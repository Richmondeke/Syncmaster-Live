import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Mail } from 'lucide-react'
import { getAdminClient } from '@/lib/supabase/admin'
import { Banner } from '@/components/Banner'
import { BriefList, type BriefWithProducer } from '@/components/briefs/BriefList'
import { buttonVariants } from '@/components/ui/button'
import type { Database, OutreachStatus } from '@/types/database.types'

export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'

type OutreachWithBrief = {
  id: string
  status: OutreachStatus
  sent_at: string
  briefs: BriefWithProducer
}

const OUTREACH_CLASSES: Record<OutreachStatus | 'submitted', string> = {
  invited: 'bg-primary text-primary-foreground',
  accepted: 'border border-border bg-accent text-accent-foreground',
  submitted: 'border border-border bg-card text-muted-foreground',
  declined: 'border border-border bg-muted text-muted-foreground',
}

const OUTREACH_LABELS: Record<OutreachStatus | 'submitted', string> = {
  invited: 'Invited',
  accepted: 'Accepted',
  submitted: 'Submitted',
  declined: 'Declined',
}

export default async function BriefsPage() {
  const supabase = getAdminClient()

  const cookieStore = await cookies()
  const roleOverride = cookieStore.get('role')?.value || 'admin'
  const sessionEmail = cookieStore.get('session_email')?.value

  const profile = { role: roleOverride }
  const user = { 
    id: roleOverride === 'composer' ? 'a2308014-7225-474f-a2e1-04a02111e348' : 
        roleOverride === 'producer' ? 'mock-producer-id' : 'mock-id',
    email: sessionEmail 
  }

  // ── Admin: see all briefs ───────────────────────────────────────────────────
  if (profile.role === 'admin') {
    const { data, error } = await supabase
      .from('briefs')
      .select('id, producer_id, title, description, genres, budget_min, budget_max, deadline, status, ai_suggested_composers, ai_match_status, ai_suggested_composers_detail, created_at, updated_at, producers(company, profiles(full_name))')
      .order('created_at', { ascending: false })

    if (error) throw error

    const briefs = (data ?? []) as unknown as BriefWithProducer[]
    const draftCount = briefs.filter((b) => b.status === 'draft').length
    const sorted = [
      ...briefs.filter((b) => b.status === 'draft'),
      ...briefs.filter((b) => b.status !== 'draft'),
    ]

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Briefs</h1>
          <p className="text-lg text-muted-foreground tracking-tight mt-2">
            Review producer briefs and manage status transitions.
          </p>
        </div>

        {draftCount > 0 && (
          <Banner>
            <p className="text-sm text-card-foreground">
              <span className="label-strong">Review queue</span>{' '}
            {draftCount} brief{draftCount > 1 ? 's' : ''} awaiting review — open to activate
            </p>
          </Banner>
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
          'id, producer_id, title, description, genres, budget_min, budget_max, deadline, status, ai_suggested_composers, ai_match_status, ai_suggested_composers_detail, created_at, updated_at',
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
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Briefs</h1>
            <p className="text-lg text-muted-foreground tracking-tight mt-2">
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
        <div className="mb-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Briefs</h1>
          <p className="text-muted-foreground text-sm font-medium max-w-md">
            Exclusive opportunities you've been matched with. Review and submit your best tracks.
          </p>
        </div>

        {outreachWithBriefs.length === 0 ? (
          <div className="rounded-md border border-dashed bg-card p-12 text-center">
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
              <Link
                key={outreachId}
                href={`/dashboard/briefs/${brief.id}`}
                className="group flex flex-col gap-3 rounded-md bg-card border border-border p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${OUTREACH_CLASSES[displayStatus]}`}
                    >
                      {OUTREACH_LABELS[displayStatus]}
                    </span>
                    {brief.deadline && (
                      <span className="label">
                        Due {new Date(brief.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">{brief.title}</p>

                  {brief.genres && brief.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {brief.genres.map((g) => (
                        <span
                          key={g}
                          className="inline-flex items-center rounded-sm border border-border bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}

                  {(brief.budget_min != null || brief.budget_max != null) && (
                    <p className="text-xs text-muted-foreground">
                      <span className="label">Budget</span>{' '}
                      <span className="mono">
                      {brief.budget_min != null && brief.budget_max != null
                        ? `$${brief.budget_min.toLocaleString()} – $${brief.budget_max.toLocaleString()}`
                        : brief.budget_min != null
                          ? `from $${brief.budget_min.toLocaleString()}`
                          : `up to $${brief.budget_max!.toLocaleString()}`}
                      </span>
                    </p>
                  )}
                </div>

                <div className="shrink-0 sm:pt-1">
                  <span
                    className={buttonVariants({ variant: 'outline', size: 'sm' }) + ' pointer-events-none'}
                  >
                    {outreachStatus === 'invited' ? 'Respond' : 'View'}
                  </span>
                </div>
              </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  redirect('/dashboard')
}
