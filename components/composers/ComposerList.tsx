'use client'

import { useActionState, useEffect, useState } from 'react'
import { vetComposer } from '@/app/actions/composers'
import { useToast } from '@/components/Toast'
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

export function ComposerList({ composers, isAdmin = false }: { composers: ComposerWithProfile[], isAdmin?: boolean }) {
  const { addToast } = useToast()
  const [rejectTarget, setRejectTarget] = useState<ComposerWithProfile | null>(null)
  const [rejectionNote, setRejectionNote] = useState('')
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const [approveState, approveAction, approveIsPending] = useActionState<
    Awaited<ReturnType<typeof vetComposer>>,
    FormData
  >(
    (_prev, formData: FormData) => vetComposer(formData),
    { ok: false, error: '' }
  )

  const [rejectState, rejectAction, rejectIsPending] = useActionState<
    Awaited<ReturnType<typeof vetComposer>>,
    FormData
  >(
    (_prev, formData: FormData) => vetComposer(formData),
    { ok: false, error: '' }
  )

  useEffect(() => {
    if (!approveIsPending) setApprovingId(null)
    if (approveState.ok) {
      addToast('Composer approved!', 'success')
      if (approveState.emailFailed) {
        addToast('Note: notification email failed to send.', 'error')
      }
    } else if (approveState.error) {
      addToast(approveState.error, 'error')
    }
  }, [approveState, approveIsPending, addToast])

  useEffect(() => {
    if (rejectState.ok) {
      addToast('Composer rejected', 'info')
      if (rejectState.emailFailed) {
        addToast('Note: notification email failed to send.', 'error')
      }
      setRejectTarget(null)
      setRejectionNote('')
    } else if (rejectState.error) {
      addToast(rejectState.error, 'error')
    }
  }, [rejectState, addToast])

  if (composers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">No composer applications yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl ring-1 ring-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Genres</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applied</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {composers.map((composer) => {
              const status = composer.status as ComposerStatus
              const badge = (status && STATUS_BADGE[status]) || { 
                label: status || 'Unknown', 
                variant: 'outline' as const 
              }

              const name = composer.profiles?.full_name ?? '—'
              const applied = composer.created_at 
                ? new Date(composer.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'

              return (
                <tr key={composer.id} className="border-b border-border bg-card last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {composer.genres?.join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={badge?.variant ?? 'outline'}>{badge?.label ?? 'Unknown'}</Badge>

                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{applied}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {isAdmin ? (
                        <>
                          {composer.status !== 'active' && (
                            <form action={approveAction} onSubmit={() => setApprovingId(composer.profile_id)}>
                              <input type="hidden" name="profileId" value={composer.profile_id} />
                              <input type="hidden" name="status" value="active" />
                              <Button type="submit" size="sm" variant="default" disabled={approveIsPending}>
                                {approveIsPending && approvingId === composer.profile_id ? (
                                  <>
                                    <span className="inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin mr-2" />
                                    Approving…
                                  </>
                                ) : (
                                  'Approve'
                                )}
                              </Button>
                            </form>
                          )}
                          {composer.status !== 'rejected' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setRejectTarget(composer)}
                              disabled={rejectIsPending}
                            >
                              Reject
                            </Button>
                          )}
                          {composer.status === 'active' && (
                            <span className="text-xs text-muted-foreground">Vetted</span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {composer.status === 'active' ? 'Active' : composer.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
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

          <form action={rejectAction} className="flex flex-col gap-4">
            <input type="hidden" name="profileId" value={rejectTarget?.profile_id ?? ''} />
            <input type="hidden" name="status" value="rejected" />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rejection-note" className="text-sm font-medium">
                Feedback <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                id="rejection-note"
                name="rejectionNote"
                rows={4}
                placeholder="e.g. Strong production but catalogue lacks sync-ready stems."
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                disabled={rejectIsPending}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setRejectTarget(null); setRejectionNote('') }}
                disabled={rejectIsPending}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={rejectIsPending}>
                {rejectIsPending ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin mr-2" />
                    Rejecting…
                  </>
                ) : (
                  'Reject application'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
