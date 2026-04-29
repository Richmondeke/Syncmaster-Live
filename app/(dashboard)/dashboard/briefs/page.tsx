import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BriefList, type BriefWithProducer } from '@/components/briefs/BriefList'
import { buttonVariants } from '@/components/ui/button'
import type { Database, OutreachStatus } from '@/types/database.types'

export const dynamic = 'force-dynamic'

type OutreachWithBrief = {
  id: string
  status: OutreachStatus
  sent_at: string
  briefs: BriefWithProducer
}

const OUTREACH_CLASSES: Record<OutreachStatus | 'submitted', string> = {
  invited: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  submitted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  declined: 'bg-muted text-muted-foreground',
}

const OUTREACH_LABELS: Record<OutreachStatus | 'submitted', string> = {
  invited: 'Invited',
  accepted: 'Accepted',
  submitted: 'Submitted',
  declined: 'Declined',
}

export default async function BriefsPage() {
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

  // ── Admin: see all briefs ───────────────────────────────────────────────────
  if (profile.role === 'admin') {
    const { data, error } = await supabase
      .from('briefs')
      .select(
        `id, producer_id, title, description, genres, budget_min, budget_max, deadline, status, ai_suggested_composers, created_at, updated_at,
        producers!inner ( company, profiles!inner ( full_name ) )`,
      )
      .order('created_at', { ascending: false })

    if (error) throw error

    const briefs = (data ?? []) as BriefWithProducer[]
    const draftCount = briefs.filter((b) => b.status === 'draft').length
    const sorted = [
      ...briefs.filter((b) => b.status === 'draft'),
      ...briefs.filter((b) => b.status !== 'draft'),
    ]

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Briefs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review producer briefs and manage status transitions.
          </p>
        </div>

        {draftCount > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {draftCount} brief{draftCount > 1 ? 's' : ''} awaiting review — open to activate
          </div>
        )}

        <BriefList briefs={sorted} showProducer />
      </div>
    )
  }

  // ── Producer: see own briefs ────────────────────────────────────────────────
  if (profile.role === 'producer') {
    const { data: producer } = await supabase
      .from('producers')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    let briefs: BriefWithProducer[] = []

    if (producer) {
      const { data, error } = await supabase
        .from('briefs')
        .select(
          'id, producer_id, title, description, genres, budget_min, budget_max, deadline, status, ai_suggested_composers, created_at, updated_at',
        )
        .eq('producer_id', producer.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      briefs = data ?? []
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Briefs</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Submit a brief and we'll hand-pick 3–5 vetted composers for you.
            </p>
          </div>
          <Link
            href="/dashboard/briefs/new"
            className={buttonVariants({ variant: 'default', size: 'sm' })}
          >
            <Plus className="h-4 w-4" />
            New brief
          </Link>
        </div>

        <BriefList briefs={briefs} />
      </div>
    )
  }

  // ── Composer: see invited briefs via outreach ───────────────────────────────
  if (profile.role === 'composer') {
    const { data: composer } = await supabase
      .from('composers')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    let outreachWithBriefs: OutreachWithBrief[] = []
    let submittedBriefIds = new Set<string>()

    if (composer) {
      const [outreachResult, submissionsResult] = await Promise.all([
        supabase
          .from('outreach')
          .select(
            `id, status, sent_at,
            briefs!inner ( id, producer_id, title, description, genres, budget_min, budget_max, deadline, status, ai_suggested_composers, created_at, updated_at )`,
          )
          .eq('composer_id', composer.id)
          .order('sent_at', { ascending: false }),
        supabase
          .from('submissions')
          .select('brief_id')
          .eq('composer_id', composer.id),
      ])

      if (outreachResult.error) throw outreachResult.error
      outreachWithBriefs = (outreachResult.data ?? []) as unknown as OutreachWithBrief[]
      submittedBriefIds = new Set((submissionsResult.data ?? []).map((s) => s.brief_id))
    }

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Briefs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Briefs you've been invited to submit tracks for.
          </p>
        </div>

        {outreachWithBriefs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Mail className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="font-medium text-sm">No invites yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll see briefs here once our team has matched you.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {outreachWithBriefs.map(({ id: outreachId, status: outreachStatus, briefs: brief }) => {
              const displayStatus: OutreachStatus | 'submitted' =
                outreachStatus === 'accepted' && submittedBriefIds.has(brief.id)
                  ? 'submitted'
                  : outreachStatus
              return (
              <div
                key={outreachId}
                className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${OUTREACH_CLASSES[displayStatus]}`}
                    >
                      {OUTREACH_LABELS[displayStatus]}
                    </span>
                    {brief.deadline && (
                      <span className="text-xs text-muted-foreground">
                        Due {new Date(brief.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-sm leading-tight">{brief.title}</p>

                  {brief.genres && brief.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {brief.genres.map((g) => (
                        <span
                          key={g}
                          className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}

                  {(brief.budget_min != null || brief.budget_max != null) && (
                    <p className="text-xs text-muted-foreground">
                      Budget:{' '}
                      {brief.budget_min != null && brief.budget_max != null
                        ? `$${brief.budget_min.toLocaleString()} – $${brief.budget_max.toLocaleString()}`
                        : brief.budget_min != null
                          ? `from $${brief.budget_min.toLocaleString()}`
                          : `up to $${brief.budget_max!.toLocaleString()}`}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  <Link
                    href={`/dashboard/briefs/${brief.id}`}
                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                  >
                    {outreachStatus === 'invited' ? 'Respond' : 'View'}
                  </Link>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  redirect('/dashboard')
}
