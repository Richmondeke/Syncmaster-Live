import { Mail, CheckCircle, XCircle } from 'lucide-react'
import { inviteComposer } from '@/app/actions/outreach'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Database, OutreachStatus } from '@/types/database.types'

type ComposerRow = Pick<Database['public']['Tables']['composers']['Row'], 'id' | 'genres'>
type ProfileRow = Pick<Database['public']['Tables']['profiles']['Row'], 'full_name'>
type OutreachRow = Pick<
  Database['public']['Tables']['outreach']['Row'],
  'id' | 'composer_id' | 'status'
>

export type ComposerForOutreach = ComposerRow & { profiles: ProfileRow }

const OUTREACH_BADGE: Record<
  OutreachStatus,
  { label: string; icon: any; className: string }
> = {
  invited: { 
    label: 'INVITED', 
    icon: Mail, 
    className: 'bg-surface-secondary text-primary border-primary/20' 
  },
  accepted: { 
    label: 'ACCEPTED', 
    icon: CheckCircle, 
    className: 'bg-acid-lime text-black border-acid-lime' 
  },
  declined: { 
    label: 'DECLINED', 
    icon: XCircle, 
    className: 'bg-muted/50 text-muted-foreground border-border/30' 
  },
}

export function OutreachPanel({
  briefId,
  composers,
  outreachRecords,
}: {
  briefId: string
  composers: ComposerForOutreach[]
  outreachRecords: OutreachRow[]
}) {
  const outreachByComposer = new Map(outreachRecords.map((o) => [o.composer_id, o]))

  if (composers.length === 0) {
    return (
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 flex flex-col gap-6 shadow-elevation-low">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl display uppercase tracking-tight">Outreach</h2>
        </div>
        <div className="rounded-[0.375rem] border border-dashed p-12 text-center bg-muted/10">
          <p className="text-sm font-black tracking-widest uppercase text-muted-foreground opacity-50">No active composers found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 flex flex-col gap-6 shadow-elevation-low transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-2xl display tracking-tight uppercase">Manual Outreach</h2>
        </div>
        <span className="label-strong text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 tracking-widest">DIRECTORY</span>
      </div>

      <div className="flex flex-col gap-3">
        {composers.map((composer, index) => {
          const outreach = outreachByComposer.get(composer.id)
          const badgeConfig = outreach ? OUTREACH_BADGE[outreach.status] : null
          const name = composer.profiles.full_name ?? '—'
          const Icon = badgeConfig?.icon

          return (
            <div
              key={composer.id}
              className="flex items-center justify-between gap-6 px-6 py-5 rounded-[0.375rem] border bg-surface-primary/40 hover:bg-surface-primary/60 transition-all group shadow-elevation-low border-l-2 border-l-transparent hover:border-l-primary"
            >
              <div className="min-w-0 flex items-center gap-4">
                <span className="text-[10px] font-mono text-primary/40">{(index + 1).toString().padStart(2, '0')}</span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-lg font-black tracking-tighter uppercase group-hover:text-primary transition-colors truncate">
                    {name}
                  </p>
                  {composer.genres && composer.genres.length > 0 && (
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] truncate">
                      {composer.genres.join(' / ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {badgeConfig && (
                  <Badge 
                    variant="outline"
                    className={`rounded-none font-black px-4 py-1 text-[10px] uppercase tracking-widest border-2 ${badgeConfig.className}`}
                  >
                    {Icon && <Icon className="h-3 w-3 mr-2 shrink-0" />}
                    {badgeConfig.label}
                  </Badge>
                )}

                {!outreach && (
                  <form action={inviteComposer}>
                    <input type="hidden" name="briefId" value={briefId} />
                    <input type="hidden" name="composerId" value={composer.id} />
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="rounded-full font-black px-6 shadow-elevation-low transition-all active:scale-95 uppercase tracking-widest text-[10px] h-9"
                    >
                      <Mail className="h-3 w-3 mr-2" />
                      Invite
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] text-center mt-2">
        SyncMaster Messenger v1.2
      </p>
    </div>
  )
}
