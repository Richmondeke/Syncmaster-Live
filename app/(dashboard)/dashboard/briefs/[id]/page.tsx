import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { ArrowLeft, Sparkles } from 'lucide-react'
import { getAdminClient } from '@/lib/supabase/admin'
import { BriefStatusControl } from '@/components/briefs/BriefStatusControl'
import { OutreachPanel, type ComposerForOutreach } from '@/components/briefs/OutreachPanel'
import { OutreachResponse } from '@/components/briefs/OutreachResponse'
import { AiSuggestionsPanel } from '@/components/briefs/AiSuggestionsPanel'
import { buttonVariants } from '@/components/ui/button'
import type { BriefStatus, Database } from '@/types/database.types'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<BriefStatus, string> = {
  draft: 'Draft — Pending review',
  active: 'Active — Curating composers',
  matched: 'Matched — Intro made',
  closed: 'Closed',
}

const STATUS_CLASSES: Record<BriefStatus, string> = {
  draft: 'bg-muted text-muted-foreground border-border/50',
  active: 'bg-acid-lime/20 text-[#222] border-acid-lime/30',
  matched: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  closed: 'bg-green-500/10 text-green-500 border-green-500/20',
}

const PRODUCER_NEXT_STEPS: Record<BriefStatus, string> = {
  draft: "Your brief is under review. Our team will activate it once it's been assessed and begin identifying matched composers.",
  active: "We're actively curating composers for your brief. You'll be notified when your shortlist is ready to review.",
  matched: 'Your shortlist is ready. Expect a warm intro from our team shortly.',
  closed: 'This brief has been closed. Contact us if you have any questions.',
}

type BriefDetail = {
  id: string
  producer_id: string
  title: string
  description: string | null
  genres: string[] | null
  budget_min: number | null
  budget_max: number | null
  deadline: string | null
  status: BriefStatus
  ai_suggested_composers: string[] | null
  ai_match_status?: 'pending' | 'running' | 'complete' | 'failed' | 'no_composers'
  ai_suggested_composers_detail?: Array<{
    composer_id: string
    match_score: number
    match_reason: string
    confidence: number
  }> | null
  created_at: string
  updated_at: string
  producers: {
    company: string | null
    profiles: { full_name: string | null } | null
  } | null
}

type OutreachRow = Pick<
  Database['public']['Tables']['outreach']['Row'],
  'id' | 'composer_id' | 'status'
>

type Props = { params: Promise<{ id: string }> }

export default async function BriefDetailPage({ params }: Props) {
  const { id } = await params

  const supabase = getAdminClient()
  const cookieStore = await cookies()
  const roleOverride = cookieStore.get('role')?.value || 'admin'
  const sessionEmail = cookieStore.get('session_email')?.value

  if (!sessionEmail) redirect('/login')

  const profile = { role: roleOverride }
  const user = {
    id: roleOverride === 'composer' ? 'a2308014-7225-474f-a2e1-04a02111e348' :
        roleOverride === 'producer' ? 'mock-producer-id' : 'mock-admin-id',
    email: sessionEmail
  }

  const { data, error } = await supabase
    .from('briefs')
    .select(
      `id, producer_id, title, description, genres, budget_min, budget_max, deadline, status,
      ai_suggested_composers, ai_match_status, ai_suggested_composers_detail, created_at, updated_at,
      producers!inner ( company, profiles!inner ( full_name ) )`,
    )
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('BRIEF FETCH ERROR:', error, 'DATA:', data, 'ID:', id)
    notFound()
  }

  const brief = data as unknown as BriefDetail

  let composers: ComposerForOutreach[] = []
  let outreachRecords: OutreachRow[] = []
  let outreachForComposer: OutreachRow | null = null
  let submissionsForComposer: any[] = []

  // Role checks and data fetching
  if (profile.role === 'composer') {
    const { data: composer } = await supabase
      .from('composers')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (!composer) redirect('/dashboard')

    const { data: outreach } = await supabase
      .from('outreach')
      .select('id, composer_id, status')
      .eq('brief_id', id)
      .eq('composer_id', composer.id)
      .maybeSingle()

    if (!outreach) redirect('/dashboard/briefs')
    outreachForComposer = outreach

    const { data: submissions } = await supabase
      .from('submissions')
      .select('id, track_url, notes, status')
      .eq('brief_id', id)
      .eq('composer_id', composer.id)
      .order('created_at', { ascending: true })

    submissionsForComposer = submissions ?? []
  } else if (profile.role === 'producer') {
    const { data: producer } = await supabase
      .from('producers')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (!producer || brief.producer_id !== producer.id) redirect('/dashboard/briefs')
  } else if (profile.role === 'admin') {
    const [composersResult, outreachResult] = await Promise.all([
      supabase
        .from('composers')
        .select('id, genres, profiles!inner(full_name)')
        .eq('status', 'active'),
      supabase
        .from('outreach')
        .select('id, composer_id, status')
        .eq('brief_id', id),
    ])

    composers = (composersResult.data ?? []) as unknown as ComposerForOutreach[]
    outreachRecords = (outreachResult.data ?? []) as OutreachRow[]
  }

  const producerName = brief.producers?.profiles?.full_name ?? 'Unknown'
  const producerCompany = brief.producers?.company

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute top-40 left-1/4 w-[600px] h-[400px] bg-fuchsia-500/10 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pt-6">
        
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard/briefs"
            aria-label="Back to briefs"
            className={buttonVariants({ variant: 'outline', size: 'icon' }) + ' shrink-0 mt-3 rounded-full hover:bg-accent/50 bg-card border border-border shadow-sm'}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.1] text-foreground">
              {brief.title}
            </h1>
            <p className="text-xl text-muted-foreground mt-4 font-medium tracking-tight">
              {producerName}
              {producerCompany ? ` · ${producerCompany}` : ''}
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-5 py-1.5 text-sm font-bold tracking-tight uppercase border shadow-sm ${STATUS_CLASSES[brief.status]}`}
          >
            {STATUS_LABELS[brief.status]}
          </span>
          {brief.deadline && (
            <span className="text-sm font-bold bg-card px-4 py-1.5 rounded-full border border-border shadow-sm text-foreground tracking-tight">
              Due {new Date(brief.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Brief details Card */}
        <div className="rounded-[2.5rem] border border-border bg-card shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col gap-10 transition-all relative overflow-hidden group">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-10">
            {brief.description && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-black tracking-tight">Description</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap">{brief.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {brief.genres && brief.genres.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-black tracking-tight">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {brief.genres.map((g) => (
                      <span
                        key={g}
                        className="inline-flex items-center rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(brief.budget_min != null || brief.budget_max != null) && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-black tracking-tight">Budget</h3>
                  <p className="text-3xl font-black text-foreground tracking-tight">
                    {brief.budget_min != null && brief.budget_max != null
                      ? `$${brief.budget_min.toLocaleString()} – $${brief.budget_max.toLocaleString()}`
                      : brief.budget_min != null
                        ? `From $${brief.budget_min.toLocaleString()}`
                        : `Up to $${brief.budget_max!.toLocaleString()}`
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-8 border-t border-border/50">
              <p className="text-sm font-bold text-muted-foreground tracking-tight">Submitted on {new Date(brief.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Role Specific Panels */}
        
        {/* Composer: Outreach Response */}
        {profile.role === 'composer' && outreachForComposer && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <OutreachResponse
              outreachId={outreachForComposer.id}
              status={outreachForComposer.status}
              briefId={id}
              submissions={submissionsForComposer}
            />
          </div>
        )}

        {/* Admin: Status Controls, AI Suggestions, Outreach */}
        {profile.role === 'admin' && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="rounded-[2.5rem] border border-border bg-card shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight mb-8">Admin Controls</h3>
                <BriefStatusControl briefId={brief.id} currentStatus={brief.status} />
              </div>
            </div>
            
            {brief.status === 'active' && (
              <>
                <AiSuggestionsPanel briefId={brief.id} />
                <OutreachPanel
                  briefId={brief.id}
                  composers={composers}
                  outreachRecords={outreachRecords}
                />
              </>
            )}
          </div>
        )}

        {/* Producer: Next Steps */}
        {profile.role === 'producer' && (
          <div className="rounded-[2.5rem] border border-border bg-card shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 relative overflow-hidden group">
             <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none" />
             <div className="relative z-10 flex flex-col gap-4">
              <h3 className="text-2xl font-black tracking-tight">What happens next</h3>
              <p className="text-lg leading-relaxed text-muted-foreground font-medium">
                {PRODUCER_NEXT_STEPS[brief.status]}
              </p>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
