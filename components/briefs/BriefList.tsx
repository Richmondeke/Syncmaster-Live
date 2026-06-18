import Link from 'next/link'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { FileText } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { Database, BriefStatus } from '@/types/database.types'
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { Plus } from 'lucide-react'

export type BriefWithProducer = Database['public']['Tables']['briefs']['Row'] & {
  producers?: {
    company: string | null
    profiles: { full_name: string | null } | null
  } | null
}

const STATUS_LABELS: Record<BriefStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  matched: 'Matched',
  closed: 'Closed',
}

const STATUS_CLASSES: Record<BriefStatus, string> = {
  draft: 'border border-border bg-muted text-muted-foreground',
  active: 'bg-acid-lime text-black border border-acid-lime/20',
  matched: 'border border-border bg-accent text-accent-foreground',
  closed: 'border border-border bg-card text-muted-foreground',
}

type Props = {
  briefs: BriefWithProducer[]
  showProducer?: boolean
  emptyMessage?: string
}

export function BriefList({ briefs, showProducer = false, emptyMessage }: Props) {
  if (briefs.length === 0) {
    return (
      <div className="rounded-md border border-dashed bg-card p-12 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
        <p className="font-medium text-sm">No briefs yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          {emptyMessage ?? (showProducer
            ? 'Briefs from producers will appear here once submitted.'
            : 'Create your first brief to get started.')}
        </p>
        {!showProducer && (
          <Link
            href="/dashboard/briefs/new"
            className={buttonVariants({ size: 'sm' }) + ' mt-4 inline-flex gap-1.5'}
          >
            <Plus className="h-4 w-4" />
            New brief
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {briefs.map((brief) => (
        <Link
          key={brief.id}
          href={`/dashboard/briefs/${brief.id}`}
          className="group flex flex-col gap-3 rounded-md bg-card border border-border p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${STATUS_CLASSES[brief.status]}`}
              >
                {STATUS_LABELS[brief.status]}
              </span>
              {brief.deadline && (
                <span className="label">
                  Due {new Date(brief.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            <p className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
              {brief.title}
            </p>

            {showProducer && brief.producers && (
              <p className="label">
                {brief.producers.profiles?.full_name ?? 'Unknown producer'}
                {brief.producers.company ? ` · ${brief.producers.company}` : ''}
              </p>
            )}

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
              View
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
