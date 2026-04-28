'use client'

import { useState } from 'react'
import { vetComposer } from '@/app/actions/composers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  const [rejectTarget, setRejectTarget] = useState<ComposerWithProfile | null>(null)
  const [rejectionNote, setRejectionNote] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleReject = async () => {
    if (!rejectTarget) return
    setIsPending(true)
    try {
      const fd = new FormData()
      fd.set('profileId', rejectTarget.profile_id)
      fd.set('status', 'rejected')
      if (rejectionNote.trim()) fd.set('rejectionNote', rejectionNote.trim())
      await vetComposer(fd)
    } finally {
      setIsPending(false)
      setRejectTarget(null)
      setRejectionNote('')
    }
  }

  if (composers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">No composer applications yet.</p>
      </div>
    )
  }

  return (
    <>
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
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setRejectTarget(composer)}
                        >
                          Reject
                        </Button>
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

      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) { setRejectTarget(null); setRejectionNote('') }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
            <DialogDescription>
              {rejectTarget?.profiles.full_name ?? 'This composer'} will be notified by email. Add optional A&amp;R feedback to include in the rejection.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="rejection-note" className="text-sm font-medium">
              Feedback <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              id="rejection-note"
              rows={4}
              placeholder="e.g. Strong production but catalogue lacks sync-ready stems."
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectionNote('') }} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isPending}>
              {isPending ? 'Rejecting…' : 'Reject application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
