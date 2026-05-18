import { BriefStatus } from '@/types/database.types'
import { Badge } from '@/components/ui/badge'

const STATUS_LABELS: Record<BriefStatus, string> = {
  draft: 'Draft — Pending review',
  active: 'Active — Curating composers',
  matched: 'Matched — Intro made',
  closed: 'Closed',
}

const STATUS_CLASSES: Record<BriefStatus, string> = {
  draft: 'bg-muted text-muted-foreground border-border/50',
  active: 'bg-acid-lime text-black border-acid-lime shadow-[0_0_20px_rgba(217,249,157,0.3)]',
  matched: 'bg-surface-secondary text-primary border-primary/20',
  closed: 'bg-muted/50 text-muted-foreground border-border/30',
}

type BriefDetailCardProps = {
  brief: {
    id: string
    title: string
    description: string | null
    genres: string[] | null
    budget_min: number | null
    budget_max: number | null
    deadline: string | null
    status: BriefStatus
    created_at: string
    producers: {
      company: string | null
      profiles: { full_name: string | null } | null
    } | null
  }
}

export function BriefDetailCard({ brief }: BriefDetailCardProps) {
  const producerName = brief.producers?.profiles?.full_name ?? 'Unknown'
  const producerCompany = brief.producers?.company

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center rounded-full px-4 py-1 text-[10px] font-black tracking-[0.2em] uppercase border ${STATUS_CLASSES[brief.status]}`}
            >
              {STATUS_LABELS[brief.status]}
            </span>
            {brief.deadline && (
              <span className="text-[10px] font-black text-muted-foreground bg-surface-secondary/50 px-3 py-1 rounded-full border border-border/50 tracking-widest uppercase">
                DEADLINE: {new Date(brief.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl display text-foreground tracking-[-0.04em] leading-[0.9] uppercase italic">
            {brief.title}
          </h1>
          <p className="text-muted-foreground text-xl mt-4 font-medium tracking-tight">
            FOR <span className="text-foreground font-black">{producerCompany?.toUpperCase() ?? producerName.toUpperCase()}</span>
            {producerCompany && producerName && <span className="opacity-40"> — CURATED BY {producerName.toUpperCase()}</span>}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description */}
        <div className="lg:col-span-2 rounded-[0.375rem] border bg-surface-secondary/30 backdrop-blur-md p-10 flex flex-col gap-8 shadow-elevation-low">
          {brief.description && (
            <div className="flex flex-col gap-6">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                PROJECT BRIEF / SCOPE
              </p>
              <p className="text-xl leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap selection:bg-acid-lime/30">
                {brief.description}
              </p>
            </div>
          )}
          
          <div className="pt-8 border-t border-border/30 flex flex-col gap-4">
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                TIMELINE
              </p>
              <p className="text-sm font-medium opacity-60">
                Project initiated on {new Date(brief.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
          </div>
        </div>

        {/* Right Column: Metadata */}
        <div className="flex flex-col gap-6">
          {/* Budget Card */}
          <div className="rounded-[0.375rem] border bg-surface-primary p-8 flex flex-col gap-4 shadow-elevation-low border-l-4 border-l-acid-lime">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
              ESTIMATED BUDGET
            </p>
            <p className="text-4xl display text-foreground tracking-tighter">
              {brief.budget_min != null && brief.budget_max != null
                ? `$${brief.budget_min.toLocaleString()} — $${brief.budget_max.toLocaleString()}`
                : brief.budget_min != null
                  ? `FROM $${brief.budget_min.toLocaleString()}`
                  : `UP TO $${brief.budget_max!.toLocaleString()}`}
            </p>
          </div>

          {/* Genres Card */}
          {brief.genres && brief.genres.length > 0 && (
            <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 flex flex-col gap-6 shadow-elevation-low">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                SONIC DIRECTION
              </p>
              <div className="flex flex-wrap gap-2">
                {brief.genres.map((g) => (
                  <Badge
                    key={g}
                    variant="outline"
                    className="rounded-none border-2 border-primary/20 bg-transparent px-4 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-acid-lime hover:text-black hover:border-acid-lime transition-all cursor-default"
                  >
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

