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

  // Check Pro status for submission limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  if (!profile?.is_pro) {
    const { count, error: countError } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })
      .eq('composer_id', composer.id)

    if (countError) {
      console.error('[submitTrack] countError:', countError)
      return { error: 'Failed to verify submission limits.' }
    }

    if (count !== null && count >= 1) {
      return {
        error: 'Free tier is limited to 1 submission in total. Please upgrade to Pro in Settings to submit unlimited tracks.'
      }
    }
  }

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
