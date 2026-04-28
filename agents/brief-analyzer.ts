import { createClient } from '@/lib/supabase/server'
import { matchComposers, type ComposerInput } from './composer-matcher'

export async function analyzeBrief(briefId: string): Promise<void> {
  const supabase = await createClient()

  const [briefResult, composersResult] = await Promise.all([
    supabase
      .from('briefs')
      .select('id, title, description, genres, budget_min, budget_max')
      .eq('id', briefId)
      .single(),
    supabase
      .from('composers')
      .select('id, bio, genres, ai_tags, profiles!inner(full_name)')
      .eq('status', 'active'),
  ])

  if (briefResult.error || !briefResult.data) return
  if (!composersResult.data || composersResult.data.length === 0) return

  const ranked = await matchComposers(
    briefResult.data,
    composersResult.data as unknown as ComposerInput[],
  )

  if (ranked.length === 0) return

  await supabase
    .from('briefs')
    .update({ ai_suggested_composers: ranked.map((r) => r.composer_id) })
    .eq('id', briefId)
}
