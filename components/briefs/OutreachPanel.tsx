import { Mail } from 'lucide-react'
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
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  invited: { label: 'Invited', variant: 'secondary' },
  accepted: { label: 'Accepted', variant: 'default' },
  declined: { label: 'Declined', variant: 'destructive' },
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
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-sm font-semibold mb-4">Outreach</p>
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Mail className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No active composers</p>
          <p className="text-xs text-muted-foreground mt-1">
            Approve composer applications to start inviting.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold">Outreach</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Invite active composers to submit tracks for this brief.
        </p>
      </div>

      <div className="rounded-lg border divide-y">
        {composers.map((composer) => {
          const outreach = outreachByComposer.get(composer.id)
          const badge = outreach ? OUTREACH_BADGE[outreach.status] : null
          const name = composer.profiles.full_name ?? '—'

          return (
            <div
              key={composer.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
                {composer.genres && composer.genres.length > 0 && (
                  <p className="text-xs text-muted-foreground truncate">
                    {composer.genres.join(', ')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
                {!outreach && (
                  <form action={inviteComposer}>
                    <input type="hidden" name="briefId" value={briefId} />
                    <input type="hidden" name="composerId" value={composer.id} />
                    <Button type="submit" size="sm" variant="outline">
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      Invite
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
