'use server'

import { randomUUID } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from '@/lib/supabase/session'
import { revalidatePath } from 'next/cache'
import { assertSubmissionAllowed } from '@/core/workflows/submission-workflow'
import { analyzeSubmissionSyncFit } from '@/agents/sync-fit-recommender'

export type SubmissionFormState = { error: string | null }

export async function submitTrack(
  prevState: SubmissionFormState,
  formData: FormData,
): Promise<SubmissionFormState> {
  const supabase = await createClient()

  const user = await getSessionUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: composer } = await supabase
    .from('composers')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!composer) return { error: 'Composer profile not found' }

  const briefId = formData.get('briefId') as string
  const trackUrl = (formData.get('trackUrl') as string)?.trim()
  const notes = (formData.get('notes') as string)?.trim()

  if (!briefId || !trackUrl) return { error: 'Brief and track URL are required' }

  try {
    await assertSubmissionAllowed(supabase, briefId, composer.id)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Submission not allowed' }
  }

  const submissionId = randomUUID()
  const { error } = await supabase.from('submissions').insert({
    id: submissionId,
    brief_id: briefId,
    composer_id: composer.id,
    track_url: trackUrl,
    notes: notes || null,
    status: 'pending',
  })

  if (error) return { error: error.message }

  await analyzeSubmissionSyncFit(submissionId)

  revalidatePath(`/dashboard/briefs/${briefId}`)
  return { error: null }
}
