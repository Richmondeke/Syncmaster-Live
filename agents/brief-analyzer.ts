import { getAdminClient } from '@/lib/supabase/admin'
import { matchComposers, type ComposerInput, type RankedComposer } from './composer-matcher'

export async function analyzeBrief(briefId: string): Promise<void> {
  const supabase = getAdminClient()

  // Set status to running
  await supabase
    .from('briefs')
    .update({ ai_match_status: 'running' })
    .eq('id', briefId)

  try {
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

    if (briefResult.error || !briefResult.data) {
      await updateBriefStatus(briefId, 'failed')
      return
    }

    if (!composersResult.data || composersResult.data.length === 0) {
      await updateBriefStatus(briefId, 'no_composers')
      return
    }

    const ranked = await matchComposers(
      briefResult.data,
      composersResult.data as unknown as ComposerInput[],
    )

    if (ranked.length === 0) {
      await updateBriefStatus(briefId, 'no_composers')
      return
    }

    // Store detailed suggestions + update status
    await supabase
      .from('briefs')
      .update({
        ai_suggested_composers: ranked.map((r) => r.composer_id),
        ai_suggested_composers_detail: ranked,
        ai_match_status: 'complete',
      })
      .eq('id', briefId)
  } catch (err) {
    console.error('[analyzeBrief] error:', err)
    await updateBriefStatus(briefId, 'failed')
  }
}

async function updateBriefStatus(briefId: string, status: 'failed' | 'no_composers'): Promise<void> {
  const supabase = getAdminClient()
  await supabase
    .from('briefs')
    .update({ ai_match_status: status, ai_suggested_composers_detail: [] })
    .eq('id', briefId)
}
