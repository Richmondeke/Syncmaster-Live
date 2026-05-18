'use client'

import { useActionState } from 'react'
import { respondToOutreach, type OutreachResponseState } from '@/app/actions/outreach'
import { Button } from '@/components/ui/button'
import type { OutreachStatus } from '@/types/database.types'
import { SubmitTrackForm } from './SubmitTrackForm'

type Submission = {
  id: string
  track_url: string
  notes: string | null
  status: string
}

type Props = {
  outreachId: string
  status: OutreachStatus
  briefId: string
  submissions: Submission[]
}

const INITIAL: OutreachResponseState = { error: null }

export function OutreachResponse({ outreachId, status, briefId, submissions }: Props) {
  const [acceptState, acceptAction, acceptPending] = useActionState(respondToOutreach, INITIAL)
  const [declineState, declineAction, declinePending] = useActionState(respondToOutreach, INITIAL)

  if (status === 'accepted') {
    return <SubmitTrackForm briefId={briefId} submissions={submissions} />
  }

  if (status === 'declined') {
    return (
      <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 shadow-elevation-low transition-all flex flex-col gap-4">
        <div>
          <p className="label">Decision</p>
          <p className="text-lg leading-relaxed text-foreground/90 font-medium mt-2">You declined this brief</p>
        </div>
        <p className="text-sm text-muted-foreground">Contact us if you'd like to reconsider.</p>
      </div>
    )
  }

  const error = acceptState.error ?? declineState.error

  return (
    <div className="rounded-[2.5rem] border border-border bg-card shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] p-8 md:p-12 relative overflow-hidden group transition-all flex flex-col gap-6">
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="label">Invitation</p>
          <h2 className="text-2xl font-black tracking-tight text-foreground">You've been invited to submit</h2>
          <p className="text-lg leading-relaxed text-muted-foreground font-medium max-w-2xl">
            Accept to confirm your interest. You can then submit up to 3 tracks with a creative note for the producer to review.
          </p>
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <form action={acceptAction}>
            <input type="hidden" name="outreachId" value={outreachId} />
            <input type="hidden" name="status" value="accepted" />
            <Button type="submit" size="lg" className="rounded-full px-8" disabled={acceptPending || declinePending}>
              {acceptPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                'Accept brief'
              )}
            </Button>
          </form>
          <form action={declineAction}>
            <input type="hidden" name="outreachId" value={outreachId} />
            <input type="hidden" name="status" value="declined" />
            <Button type="submit" variant="outline" size="lg" className="rounded-full px-8" disabled={acceptPending || declinePending}>
              {declinePending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                'Decline'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
