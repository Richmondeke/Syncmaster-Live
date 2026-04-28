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

const STATUS_LABELS: Record<BriefStatus, string> = {
  draft: 'Draft — Pending review',
  active: 'Active — Curating composers',
  matched: 'Matched — Intro made',
  closed: 'Closed',
}

const STATUS_CLASSES: Record<BriefStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  matched: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  closed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const { data, error } = await supabase
    .from('briefs')
    .select(
      `id, producer_id, title, description, genres, budget_min, budget_max, deadline, status,
      ai_suggested_composers, created_at, updated_at,
      producers!inner ( company, profiles!inner ( full_name ) )`,
    )
    .eq('id', id)
    .single()

  if (error || !data) notFound()

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

    const producerName = brief.producers?.profiles?.full_name ?? 'Unknown'
    const producerCompany = brief.producers?.company

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard/briefs"
            aria-label="Back to briefs"
            className={buttonVariants({ variant: 'ghost', size: 'icon' }) + ' shrink-0 mt-0.5'}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight leading-tight">{brief.title}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {producerName}
              {producerCompany ? ` · ${producerCompany}` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_CLASSES[brief.status]}`}
          >
            {STATUS_LABELS[brief.status]}
          </span>
          {brief.deadline && (
            <span className="text-sm text-muted-foreground">
              Due {new Date(brief.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-5">
          {brief.description && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{brief.description}</p>
            </div>
          )}

          {brief.genres && brief.genres.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Genres
              </p>
              <div className="flex flex-wrap gap-1.5">
                {brief.genres.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(brief.budget_min != null || brief.budget_max != null) && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Budget
              </p>
              <p className="text-sm">
                {brief.budget_min != null && brief.budget_max != null
                  ? `$${brief.budget_min.toLocaleString()} – $${brief.budget_max.toLocaleString()}`
                  : brief.budget_min != null
                    ? `From $${brief.budget_min.toLocaleString()}`
                    : `Up to $${brief.budget_max!.toLocaleString()}`}
              </p>
            </div>
          )}
        </div>

        <OutreachResponse outreachId={outreach.id} status={outreach.status} />
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

  // Build AI suggestions: order composers by ai_suggested_composers ranking
  const suggestedComposers =
    brief.ai_suggested_composers && brief.ai_suggested_composers.length > 0
      ? brief.ai_suggested_composers
          .map((cid) => composers.find((c) => c.id === cid))
          .filter((c): c is ComposerForOutreach => c !== undefined)
      : []

  const invitedIds = new Set(outreachRecords.map((o) => o.composer_id))

  const producerName = brief.producers?.profiles?.full_name ?? 'Unknown'
  const producerCompany = brief.producers?.company

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/dashboard/briefs"
          aria-label="Back to briefs"
          className={buttonVariants({ variant: 'ghost', size: 'icon' }) + ' shrink-0 mt-0.5'}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight leading-tight">{brief.title}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {producerName}
            {producerCompany ? ` · ${producerCompany}` : ''}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_CLASSES[brief.status]}`}
        >
          {STATUS_LABELS[brief.status]}
        </span>
        {brief.deadline && (
          <span className="text-sm text-muted-foreground">
            Due {new Date(brief.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Brief details */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-5">
        {brief.description && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Description
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{brief.description}</p>
          </div>
        )}

        {brief.genres && brief.genres.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Genres
            </p>
            <div className="flex flex-wrap gap-1.5">
              {brief.genres.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {(brief.budget_min != null || brief.budget_max != null) && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Budget
            </p>
            <p className="text-sm">
              {brief.budget_min != null && brief.budget_max != null
                ? `$${brief.budget_min.toLocaleString()} – $${brief.budget_max.toLocaleString()}`
                : brief.budget_min != null
                  ? `From $${brief.budget_min.toLocaleString()}`
                  : `Up to $${brief.budget_max!.toLocaleString()}`}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Submitted
          </p>
          <p className="text-sm">{new Date(brief.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Admin: status controls + AI suggestions + outreach */}
      {profile.role === 'admin' && (
        <>
          <BriefStatusControl briefId={brief.id} currentStatus={brief.status} />
          {brief.status === 'active' && (
            <>
              <AiSuggestionsPanel
                composers={suggestedComposers}
                invitedIds={invitedIds}
              />
              <OutreachPanel
                briefId={brief.id}
                composers={composers}
                outreachRecords={outreachRecords}
              />
            </>
          )}
        </>
      )}

      {/* Producer: what happens next */}
      {profile.role === 'producer' && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <p className="text-sm font-semibold mb-1">What happens next</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {PRODUCER_NEXT_STEPS[brief.status]}
          </p>
        </div>
      )}
    </div>
  )
}
