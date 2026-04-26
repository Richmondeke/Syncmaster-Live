import { vetComposer } from '@/app/actions/composers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Database, ComposerStatus } from '@/types/database.types'

type ProfileRow = Pick<Database['public']['Tables']['profiles']['Row'], 'full_name'>
type ComposerRow = Pick<
  Database['public']['Tables']['composers']['Row'],
  'id' | 'profile_id' | 'status' | 'genres' | 'bio' | 'portfolio_url' | 'created_at'
>

export type ComposerWithProfile = ComposerRow & { profiles: ProfileRow }

const STATUS_BADGE: Record<ComposerStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending:  { label: 'Pending',  variant: 'secondary' },
  active:   { label: 'Active',   variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

export function ComposerList({ composers }: { composers: ComposerWithProfile[] }) {
  if (composers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">No composer applications yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Genres</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applied</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {composers.map((composer) => {
            const badge = STATUS_BADGE[composer.status]
            const name = composer.profiles.full_name ?? '—'
            const applied = new Date(composer.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })

            return (
              <tr key={composer.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {composer.genres?.join(', ') || '—'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{applied}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {composer.status !== 'active' && (
                      <form action={vetComposer}>
                        <input type="hidden" name="profileId" value={composer.profile_id} />
                        <input type="hidden" name="status" value="active" />
                        <Button type="submit" size="sm" variant="default">
                          Approve
                        </Button>
                      </form>
                    )}
                    {composer.status !== 'rejected' && (
                      <form action={vetComposer}>
                        <input type="hidden" name="profileId" value={composer.profile_id} />
                        <input type="hidden" name="status" value="rejected" />
                        <Button type="submit" size="sm" variant="destructive">
                          Reject
                        </Button>
                      </form>
                    )}
                    {composer.status === 'active' && (
                      <span className="text-xs text-muted-foreground">Vetted</span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
