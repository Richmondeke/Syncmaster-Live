import Link from 'next/link'
import { FileText } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { Database, BriefStatus } from '@/types/database.types'
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
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  matched: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  closed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
}

type Props = {
  briefs: BriefWithProducer[]
  showProducer?: boolean
  emptyMessage?: string
}

export function BriefList({ briefs, showProducer = false, emptyMessage }: Props) {
  if (briefs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
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
        <div
          key={brief.id}
          className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[brief.status]}`}
              >
                {STATUS_LABELS[brief.status]}
              </span>
              {brief.deadline && (
                <span className="text-xs text-muted-foreground">
                  Due {new Date(brief.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            <p className="font-semibold text-sm leading-tight">{brief.title}</p>

            {showProducer && brief.producers && (
              <p className="text-xs text-muted-foreground">
                {brief.producers.profiles?.full_name ?? 'Unknown producer'}
                {brief.producers.company ? ` · ${brief.producers.company}` : ''}
              </p>
            )}

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
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
