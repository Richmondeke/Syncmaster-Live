'use client'

import { useState } from 'react'
import { updateBriefStatus } from '@/app/actions/briefs'
import { useToast } from '@/components/Toast'
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
// @ts-ignore – lucide-react Turbopack ESM type mismatch
import { Settings2, AlertTriangle, CheckCircle2, Play, RotateCcw, XCircle, Loader2 } from 'lucide-react'

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

const STATUS_ICONS: Record<BriefStatus, any> = {
  draft: Settings2,
  active: Play,
  matched: CheckCircle2,
  closed: XCircle,
}

type Props = {
  briefId: string
  currentStatus: BriefStatus
}

export function BriefStatusControl({ briefId, currentStatus }: Props) {
  const { addToast } = useToast()
  const [pendingAction, setPendingAction] = useState<StatusAction | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const actions = STATUS_ACTIONS[currentStatus]
  const CurrentIcon = STATUS_ICONS[currentStatus] || Settings2

  const handleConfirm = async () => {
    if (!pendingAction) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await updateBriefStatus(briefId, pendingAction.nextStatus)
      if (result?.error) {
        setError(result.error)
      } else {
        addToast(`Brief status updated to ${pendingAction.nextStatus}`, 'success')
        setPendingAction(null)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (actions.length === 0 && currentStatus === 'closed') {
    return (
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 flex flex-col gap-4 shadow-elevation-low">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-muted/20">
            <XCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-xl display tracking-tight uppercase">Brief Closed</h2>
        </div>
        <p className="text-sm text-muted-foreground font-medium bg-muted/5 p-4 rounded-xl border border-dashed text-center">
          This brief has been finalized. No further status changes are permitted.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 flex flex-col gap-6 shadow-elevation-low transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <CurrentIcon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl display tracking-tight uppercase">Workflow Control</h2>
          </div>
          <span className="text-[10px] font-black bg-primary/20 text-primary px-3 py-1 rounded-full tracking-widest border border-primary/20 uppercase">
            {currentStatus}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Available Transitions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actions.map((action) => {
              const isPrimary = action.nextStatus === 'active' || action.nextStatus === 'matched'
              const isDestructive = action.variant === 'destructive'
              
              return (
                <button
                  key={action.nextStatus}
                  onClick={() => { setError(null); setPendingAction(action) }}
                  disabled={isSubmitting}
                  className={`
                    flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left group
                    ${isPrimary 
                      ? 'bg-acid-lime/5 border-acid-lime/20 hover:bg-acid-lime/10 hover:border-acid-lime' 
                      : isDestructive
                        ? 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:border-red-500'
                        : 'bg-surface-primary/40 border-border/40 hover:bg-surface-primary/60 hover:border-primary/40'
                    }
                  `}
                >
                  <span className={`text-xs font-black uppercase tracking-wider ${isPrimary ? 'text-acid-lime' : isDestructive ? 'text-red-500' : 'text-foreground'}`}>
                    {action.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-snug group-hover:text-foreground/80 transition-colors">
                    {action.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <Dialog open={!!pendingAction} onOpenChange={(open) => { if (!open) { setPendingAction(null); setError(null) } }}>
        <DialogContent className="max-w-md bg-surface-primary/95 backdrop-blur-xl border-border/60 shadow-elevation-high p-8">
          <DialogHeader className="gap-2">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-full ${pendingAction?.variant === 'destructive' ? 'bg-red-500/10' : 'bg-acid-lime/10'}`}>
                {pendingAction?.variant === 'destructive' 
                  ? <AlertTriangle className="h-5 w-5 text-red-500" /> 
                  : <RotateCcw className="h-5 w-5 text-acid-lime" />
                }
              </div>
              <DialogTitle className="text-2xl display tracking-tight uppercase">Update Status?</DialogTitle>
            </div>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
              {pendingAction?.description}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm font-medium text-red-500">{error}</p>
            </div>
          )}

          <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => { setPendingAction(null); setError(null) }} 
              disabled={isSubmitting}
              className="rounded-full font-bold px-6 h-11 border-border/60"
            >
              Cancel
            </Button>
            <Button
              variant={pendingAction?.variant || 'default'}
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={`rounded-full font-black px-8 h-11 uppercase tracking-widest text-xs shadow-elevation-low transition-all active:scale-95 ${!pendingAction?.variant ? 'bg-acid-lime text-black hover:bg-acid-lime/90' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating
                </>
              ) : (
                'Confirm Change'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
