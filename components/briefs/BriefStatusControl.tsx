'use client'

import { useState } from 'react'
import { updateBriefStatus } from '@/app/actions/briefs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { BriefStatus } from '@/types/database.types'

type StatusAction = {
  label: string
  nextStatus: BriefStatus
  description: string
  variant?: 'default' | 'destructive' | 'outline'
}

const STATUS_ACTIONS: Record<BriefStatus, StatusAction[]> = {
  draft: [
    {
      label: 'Activate brief',
      nextStatus: 'active',
      description: 'Mark this brief as active and begin curating composers.',
    },
  ],
  active: [
    {
      label: 'Mark as matched',
      nextStatus: 'matched',
      description: 'Indicate that you have identified and introduced composers to the producer.',
    },
    {
      label: 'Revert to draft',
      nextStatus: 'draft',
      description: 'Move this brief back to draft status.',
      variant: 'outline',
    },
    {
      label: 'Close brief',
      nextStatus: 'closed',
      description: 'Close this brief. This action cannot be undone.',
      variant: 'destructive',
    },
  ],
  matched: [
    {
      label: 'Close brief',
      nextStatus: 'closed',
      description: 'Close this brief. This action cannot be undone.',
      variant: 'destructive',
    },
  ],
  closed: [],
}

type Props = {
  briefId: string
  currentStatus: BriefStatus
}

export function BriefStatusControl({ briefId, currentStatus }: Props) {
  const [pendingAction, setPendingAction] = useState<StatusAction | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const actions = STATUS_ACTIONS[currentStatus]

  if (actions.length === 0) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-sm font-semibold mb-2">Status controls</p>
        <p className="text-sm text-muted-foreground">This brief is closed. No further actions available.</p>
      </div>
    )
  }

  const handleConfirm = async () => {
    if (!pendingAction) return

    setIsSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set('briefId', briefId)
      formData.set('status', pendingAction.nextStatus)
      await updateBriefStatus(formData)
      setPendingAction(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-sm font-semibold mb-3">Status controls</p>
        {error && (
          <p className="text-sm text-destructive mb-3">{error}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.nextStatus}
              size="sm"
              variant={action.variant || 'default'}
              onClick={() => setPendingAction(action)}
              disabled={isSubmitting}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm status change</DialogTitle>
            <DialogDescription>{pendingAction?.description}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPendingAction(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant={pendingAction?.variant || 'default'}
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Confirming…' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
