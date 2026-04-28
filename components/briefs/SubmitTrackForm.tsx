'use client'

import { useActionState } from 'react'
import { submitTrack, type SubmissionFormState } from '@/app/actions/submissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Submission = {
  id: string
  track_url: string
  notes: string | null
  status: string
}

type Props = {
  briefId: string
  submissions: Submission[]
}

const MAX = 3

const INITIAL: SubmissionFormState = { error: null }

export function SubmitTrackForm({ briefId, submissions }: Props) {
  const [state, action, pending] = useActionState(submitTrack, INITIAL)
  const remaining = MAX - submissions.length

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-5">
      <div>
        <p className="text-sm font-semibold">Submit tracks</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {remaining} of {MAX} submission{remaining === 1 ? '' : 's'} remaining
        </p>
      </div>

      {submissions.length > 0 && (
        <ol className="flex flex-col gap-2">
          {submissions.map((s, i) => (
            <li key={s.id} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <a
                  href={s.track_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium truncate block hover:underline"
                >
                  {s.track_url}
                </a>
                {s.notes && (
                  <p className="text-xs text-muted-foreground mt-0.5">{s.notes}</p>
                )}
                <span className="text-xs text-muted-foreground capitalize">{s.status}</span>
              </div>
            </li>
          ))}
        </ol>
      )}

      {remaining > 0 && (
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="briefId" value={briefId} />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="trackUrl">Track URL</Label>
            <Input
              id="trackUrl"
              name="trackUrl"
              type="url"
              placeholder="https://soundcloud.com/..."
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">
              Creative note <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Brief note on why this track fits the brief."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="self-start">
            {pending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Submitting…
              </>
            ) : (
              'Submit track'
            )}
          </Button>
        </form>
      )}

      {remaining === 0 && (
        <p className="text-sm text-muted-foreground">
          You've submitted the maximum number of tracks for this brief.
        </p>
      )}
    </div>
  )
}
