import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BriefStatusControl } from '@/components/briefs/BriefStatusControl'
import { OutreachPanel, type ComposerForOutreach } from '@/components/briefs/OutreachPanel'
import { OutreachResponse } from '@/components/briefs/OutreachResponse'
import { AiSuggestionsPanel } from '@/components/briefs/AiSuggestionsPanel'
import { buttonVariants } from '@/components/ui/button'
import type { BriefStatus, Database } from '@/types/database.types'
import { cookies } from 'next/headers'

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

  const supabase = await createClient()
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

  // ── Composer: must have an outreach invite for this brief ──────────────────
  if (profile.role === 'composer') {
    const { data: composer } = await supabase
      .from('composers')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (!composer) redirect('/dashboard')

    const { data: outreach } = await supabase
      .from('outreach')
      .select('id, status')
      .eq('brief_id', id)
      .eq('composer_id', composer.id)
      .maybeSingle()

    if (!outreach) redirect('/dashboard/briefs')

    const { data: submissions } = await supabase
      .from('submissions')
      .select('id, track_url, notes, status')
      .eq('brief_id', id)
      .eq('composer_id', composer.id)
      .order('created_at', { ascending: true })

    const producerName = brief.producers?.profiles?.full_name ?? 'Unknown'
    const producerCompany = brief.producers?.company

    return (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard/briefs"
            aria-label="Back to briefs"
            className={buttonVariants({ variant: 'ghost', size: 'icon' }) + ' shrink-0 mt-0.5 rounded-full hover:bg-accent/50'}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-5xl display text-foreground">{brief.title}</h1>
            <p className="text-muted-foreground text-lg mt-3 font-medium">
              {producerName}
              {producerCompany ? ` · ${producerCompany}` : ''}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-bold tracking-tight uppercase border ${STATUS_CLASSES[brief.status]}`}
          >
            {STATUS_LABELS[brief.status]}
          </span>
          {brief.deadline && (
            <span className="text-xs label-strong bg-muted/30 px-3 py-1 rounded-md border border-border/50">
              Due {new Date(brief.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Brief details */}
        <div className="rounded-md border bg-surface-secondary p-8 flex flex-col gap-8 transition-all">
          {brief.description && (
            <div className="flex flex-col gap-4">
              <p className="label">Description</p>
              <p className="text-lg leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap">{brief.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {brief.genres && brief.genres.length > 0 && (
              <div className="flex flex-col gap-4">
                <p className="label">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {brief.genres.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center rounded-md border bg-background px-3 py-1 text-sm font-semibold text-primary shadow-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(brief.budget_min != null || brief.budget_max != null) && (
              <div className="flex flex-col gap-4">
                <p className="label">Budget</p>
                <p className="text-2xl display text-foreground">
                  {brief.budget_min != null && brief.budget_max != null
                    ? `$${brief.budget_min.toLocaleString()} – $${brief.budget_max.toLocaleString()}`
                    : brief.budget_min != null
                      ? `From $${brief.budget_min.toLocaleString()}`
                      : `Up to $${brief.budget_max!.toLocaleString()}`}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
            <p className="label">Timeline</p>
            <p className="text-sm font-medium">Submitted on {new Date(brief.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <OutreachResponse
          outreachId={outreach.id}
          status={outreach.status}
          briefId={id}
          submissions={submissions ?? []}
        />
      </div>
    )
  }

  // ── Producer: can only view own briefs ─────────────────────────────────────
  if (profile.role === 'producer') {
    const { data: producer } = await supabase
      .from('producers')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (!producer || brief.producer_id !== producer.id) redirect('/dashboard/briefs')
  }

  // ── Admin: fetch active composers + outreach records in parallel ───────────
  let composers: ComposerForOutreach[] = []
  let outreachRecords: OutreachRow[] = []

  if (profile.role === 'admin') {
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
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/dashboard/briefs"
          aria-label="Back to briefs"
          className={buttonVariants({ variant: 'ghost', size: 'icon' }) + ' shrink-0 mt-0.5 rounded-full hover:bg-accent/50'}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-5xl display text-foreground">{brief.title}</h1>
          <p className="text-muted-foreground text-lg mt-3 font-medium">
            {producerName}
            {producerCompany ? ` · ${producerCompany}` : ''}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-bold tracking-tight uppercase border ${STATUS_CLASSES[brief.status]}`}
        >
          {STATUS_LABELS[brief.status]}
        </span>
        {brief.deadline && (
          <span className="text-xs label-strong bg-muted/30 px-3 py-1 rounded-md border border-border/50">
            Due {new Date(brief.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Brief details */}
      <div className="rounded-md border bg-surface-secondary p-8 flex flex-col gap-8 transition-all">
        {brief.description && (
          <div className="flex flex-col gap-4">
            <p className="label">Description</p>
            <p className="text-lg leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap">{brief.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {brief.genres && brief.genres.length > 0 && (
            <div className="flex flex-col gap-4">
              <p className="label">Genres</p>
              <div className="flex flex-wrap gap-2">
                {brief.genres.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center rounded-md border bg-background px-3 py-1 text-sm font-semibold text-primary shadow-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(brief.budget_min != null || brief.budget_max != null) && (
            <div className="flex flex-col gap-4">
              <p className="label">Budget</p>
              <p className="text-2xl display text-foreground">
                {brief.budget_min != null && brief.budget_max != null
                  ? `$${brief.budget_min.toLocaleString()} – $${brief.budget_max.toLocaleString()}`
                  : brief.budget_min != null
                    ? `From $${brief.budget_min.toLocaleString()}`
                    : `Up to $${brief.budget_max!.toLocaleString()}`}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
          <p className="label">Timeline</p>
          <p className="text-sm font-medium">Submitted on {new Date(brief.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Admin: status controls + AI suggestions + outreach */}
      {profile.role === 'admin' && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <BriefStatusControl briefId={brief.id} currentStatus={brief.status} />
          
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

      {/* Producer: what happens next */}
      {profile.role === 'producer' && (
        <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 flex flex-col gap-4 shadow-elevation-low transition-all">
          <p className="label">
            What happens next
          </p>
          <p className="text-lg leading-relaxed text-foreground/90 font-medium">
            {PRODUCER_NEXT_STEPS[brief.status]}
          </p>
        </div>
      )}
    </div>
  )
}
