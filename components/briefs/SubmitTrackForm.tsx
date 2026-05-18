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
    <div className="rounded-[0.375rem] border bg-surface-secondary/50 backdrop-blur-md p-8 shadow-elevation-low transition-all flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="label">Submissions</p>
        <h2 className="text-2xl display text-foreground">Submit tracks</h2>
        <p className="text-lg leading-relaxed text-muted-foreground font-medium">
          {remaining} of {MAX} submission{remaining === 1 ? '' : 's'} remaining. You can submit your best work that matches the creative direction.
        </p>
      </div>

      {submissions.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Submissions</p>
          <ol className="flex flex-col gap-3">
            {submissions.map((s, i) => (
              <li key={s.id} className="flex items-start gap-4 p-4 rounded-md bg-background/50 border border-border/50 group hover:border-primary/30 transition-all">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <a
                    href={s.track_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold truncate block hover:text-primary transition-colors"
                  >
                    {s.track_url}
                  </a>
                  {s.notes && (
                    <p className="text-sm text-foreground/70 mt-1 leading-relaxed">{s.notes}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s.status}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {remaining > 0 && (
        <form action={action} className="flex flex-col gap-6 pt-6 border-t border-border/50">
          <input type="hidden" name="briefId" value={briefId} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="trackUrl" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Track URL</Label>
            <Input
              id="trackUrl"
              name="trackUrl"
              type="url"
              placeholder="https://soundcloud.com/..."
              required
              className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all text-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Creative note <span className="text-muted-foreground font-normal lowercase">(optional)</span>
            </Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Brief note on why this track fits the brief..."
              className="flex w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-lg placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all resize-none"
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">{state.error}</p>
          )}

          <Button type="submit" size="lg" disabled={pending} className="self-start rounded-full px-10">
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
        <div className="p-6 rounded-md bg-muted/30 border border-dashed border-border flex items-center justify-center">
          <p className="text-base font-medium text-muted-foreground">
            You've submitted the maximum number of tracks for this brief.
          </p>
        </div>
      )}
    </div>
  )
}
