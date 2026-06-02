import { getAdminClient } from '@/lib/supabase/admin'
import { recommendSyncFitWithOs } from './syncmaster-intelligence'

type SubmissionRow = {
  id: string
  track_url: string
  notes: string | null
  briefs: {
    id: string
    title: string
    description: string | null
    genres: string[] | null
    budget_min: number | null
    budget_max: number | null
  } | null
  composers: {
    id: string
    bio: string | null
    genres: string[] | null
    ai_tags: string[] | null
  } | null
}

export async function analyzeSubmissionSyncFit(submissionId: string): Promise<void> {
  const supabase = getAdminClient()

  try {
    const { data, error } = await supabase
      .from('submissions')
      .select(
        'id, track_url, notes, briefs(id, title, description, genres, budget_min, budget_max), composers(id, bio, genres, ai_tags)',
      )
      .eq('id', submissionId)
      .single()

    if (error || !data) {
      console.warn('[analyzeSubmissionSyncFit] submission not found', error)
      return
    }

    const submission = data as unknown as SubmissionRow
    const recommendation = await recommendSyncFitWithOs(toTrackMetadata(submission), toBrief(submission))
    const primaryMood = pickPrimaryMood(recommendation.reasoning)

    await supabase
      .from('submissions')
      .update({
        ai_match_score: Number((recommendation.fit_score / 10).toFixed(2)),
        ai_match_reason: recommendation.reasoning.join('; '),
        ai_mood: primaryMood,
        ai_analysis: recommendation,
        ai_description: recommendation.usage_suggestions.join(' '),
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', submissionId)
  } catch (error) {
    console.warn('[analyzeSubmissionSyncFit] analysis skipped', error)
  }
}

function toTrackMetadata(submission: SubmissionRow): Record<string, unknown> {
  return {
    id: submission.id,
    title: submission.track_url,
    description: submission.notes,
    genres: submission.composers?.genres ?? [],
    moods: submission.composers?.ai_tags ?? [],
    tags: submission.composers?.ai_tags ?? [],
    composer_profile: submission.composers?.bio,
    one_stop: true,
  }
}

function toBrief(submission: SubmissionRow): Record<string, unknown> {
  const brief = submission.briefs

  return {
    id: brief?.id,
    title: brief?.title,
    description: brief?.description,
    genres: brief?.genres ?? [],
    budget_min: brief?.budget_min,
    budget_max: brief?.budget_max,
  }
}

function pickPrimaryMood(reasons: string[]): string | null {
  const joined = reasons.join(' ').toLowerCase()
  for (const mood of ['dark', 'uplifting', 'tense', 'calm', 'cinematic', 'energetic']) {
    if (joined.includes(mood)) return mood
  }
  return null
}

