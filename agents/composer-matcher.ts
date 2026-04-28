import { ai } from '@/services/ai'

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
  score: number
}

export async function matchComposers(
  brief: BriefInput,
  composers: ComposerInput[],
): Promise<RankedComposer[]> {
  if (composers.length === 0) return []

  const composerList = composers.map((c) => ({
    id: c.id,
    name: c.profiles?.full_name ?? 'Unknown',
    genres: c.genres ?? [],
    bio: c.bio ?? 'No bio provided',
    tags: c.ai_tags ?? [],
  }))

  const budgetStr =
    brief.budget_min != null && brief.budget_max != null
      ? `$${brief.budget_min}–$${brief.budget_max}`
      : brief.budget_min != null
        ? `From $${brief.budget_min}`
        : brief.budget_max != null
          ? `Up to $${brief.budget_max}`
          : 'Not specified'

  const response = await ai.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    tools: [
      {
        name: 'rank_composers',
        description: 'Return composers ranked by match quality for the brief, best match first.',
        input_schema: {
          type: 'object' as const,
          properties: {
            rankings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  composer_id: { type: 'string' },
                  score: { type: 'number', description: 'Match score 0–10' },
                },
                required: ['composer_id', 'score'],
              },
            },
          },
          required: ['rankings'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'rank_composers' },
    messages: [
      {
        role: 'user',
        content: `You are a sync licensing A&R assistant. Rank these composers by how well they match this brief.

BRIEF
Title: ${brief.title}
Description: ${brief.description ?? 'Not provided'}
Genres: ${brief.genres?.join(', ') ?? 'Not specified'}
Budget: ${budgetStr}

COMPOSERS
${JSON.stringify(composerList, null, 2)}

Return all composers ranked best to worst. Score each 0–10 based on genre fit, style, and profile.`,
      },
    ],
  })

  const toolBlock = response.content.find((b) => b.type === 'tool_use')
  if (!toolBlock || toolBlock.type !== 'tool_use') return []

  const input = toolBlock.input as { rankings: RankedComposer[] }
  const validIds = new Set(composers.map((c) => c.id))

  return input.rankings
    .filter((r) => validIds.has(r.composer_id))
    .sort((a, b) => b.score - a.score)
}
