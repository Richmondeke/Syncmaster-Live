import { runTask } from '@/services/ai'

export type ComposerInput = {
  id: string
  bio: string | null
  genres: string[] | null
  ai_tags: string[] | null
  profiles: { full_name: string | null } | null
}

export type BriefInput = {
  title: string
  description: string | null
  genres: string[] | null
  budget_min: number | null
  budget_max: number | null
}

export type RankedComposer = {
  composer_id: string
  match_score: number
  match_reason: string
  confidence: number
}

export async function matchComposers(
  brief: BriefInput,
  composers: ComposerInput[],
): Promise<RankedComposer[]> {
  if (composers.length === 0) return []

  const ranked = await runTask('rank-composers', { brief, composers })

  const validIds = new Set(composers.map((c) => c.id))
  return ranked
    .filter((r) => validIds.has(r.composer_id))
    .sort((a, b) => b.match_score - a.match_score)
}
