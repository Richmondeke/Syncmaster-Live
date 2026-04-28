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
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-sm font-semibold mb-1">You declined this brief</p>
        <p className="text-sm text-muted-foreground">Contact us if you'd like to reconsider.</p>
      </div>
    )
  }

  const error = acceptState.error ?? declineState.error

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold">You've been invited to submit</p>
        <p className="text-sm text-muted-foreground mt-1">
          Accept to confirm your interest. You can then submit up to 3 tracks with a creative note.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <form action={acceptAction}>
          <input type="hidden" name="outreachId" value={outreachId} />
          <input type="hidden" name="status" value="accepted" />
          <Button type="submit" disabled={acceptPending || declinePending}>
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
          <Button type="submit" variant="outline" disabled={acceptPending || declinePending}>
            {declinePending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              'Decline'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
