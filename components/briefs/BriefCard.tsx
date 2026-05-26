import Link from 'next/link'
import { Calendar, DollarSign, ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { BriefStatus } from '@/types/database.types'

export type BriefCardData = {
  id: string
  title: string
  description: string | null
  genres: string[] | null
  budget_min: number | null
  budget_max: number | null
  deadline: string | null
  status: BriefStatus
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
  active: 'bg-primary text-primary-foreground',
  matched: 'border border-border bg-accent text-accent-foreground',
  closed: 'border border-border bg-card text-muted-foreground',
}

type Props = {
  brief: BriefCardData
  showProducer?: boolean
}

export function BriefCard({ brief, showProducer = false }: Props) {
  return (
    <Link
      href={`/dashboard/briefs/${brief.id}`}
      className="group relative z-10 flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01] min-w-[340px] max-w-[400px] shrink-0 cursor-pointer"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${STATUS_CLASSES[brief.status]}`}
          >
            {STATUS_LABELS[brief.status]}
          </span>
          {brief.deadline && (
            <span className="text-xs font-bold text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md border border-border/50">
              {new Date(brief.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
            {brief.title}
          </h3>
          {showProducer && brief.producers && (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary/20 to-accent-warm/20 flex items-center justify-center text-xs font-bold border border-primary/10">
                {brief.producers.profiles?.full_name?.charAt(0) ?? '?'}
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                {brief.producers.profiles?.full_name ?? 'Unknown'} <span className="font-normal opacity-60">at</span> {brief.producers.company ?? 'N/A'}
              </p>
            </div>
          )}
        </div>

        {brief.genres && brief.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {brief.genres.slice(0, 4).map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center rounded-lg border bg-background/50 px-2.5 py-1 text-xs font-bold text-primary shadow-sm group-hover:bg-primary/5 transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-6">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Budget Range
            </span>
            <span className="text-sm font-black text-foreground">
              {brief.budget_min != null && brief.budget_max != null
                ? `$${brief.budget_min.toLocaleString()} – $${brief.budget_max.toLocaleString()}`
                : brief.budget_min != null
                  ? `from $${brief.budget_min.toLocaleString()}`
                  : brief.budget_max != null
                    ? `up to $${brief.budget_max.toLocaleString()}`
                    : 'Contact for info'}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-inner pointer-events-none">
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
