'use client'

import { useActionState } from 'react'
import { createBrief, type BriefFormState } from '@/app/actions/briefs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function BriefForm() {
  const [state, formAction, pending] = useActionState<BriefFormState, FormData>(
    createBrief,
    { error: null },
  )

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Brief title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Uplifting Afrobeats for travel campaign"
          maxLength={200}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={2000}
          placeholder="Describe the project, mood, scene, and what you're looking for..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="genres">Genres</Label>
        <Input
          id="genres"
          name="genres"
          placeholder="Afrobeats, Highlife, Amapiano (comma-separated)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget_min">Budget min ($)</Label>
          <Input id="budget_min" name="budget_min" type="number" min="0" placeholder="500" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget_max">Budget max ($)</Label>
          <Input id="budget_max" name="budget_max" type="number" min="0" placeholder="2000" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Submission deadline</Label>
        <Input id="deadline" name="deadline" type="date" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          'Submit brief'
        )}
      </Button>
    </form>
  )
}
