import type { SupabaseClient } from '@supabase/supabase-js'
import type { BriefStatus, Database } from '@/types/database.types'

type Supabase = SupabaseClient<Database>

const VALID_TRANSITIONS: Record<BriefStatus, BriefStatus[]> = {
  draft: ['active'],
  active: ['draft', 'matched', 'closed'],
  matched: ['closed'],
  closed: [],
}

export async function assertValidBriefTransition(
  supabase: Supabase,
  briefId: string,
  toStatus: BriefStatus,
): Promise<void> {
  const { data: brief } = await supabase
    .from('briefs')
    .select('status')
    .eq('id', briefId)
    .single()

  if (!brief) throw new Error('Brief not found')

  const allowed = VALID_TRANSITIONS[brief.status]
  if (!allowed.includes(toStatus)) {
    throw new Error(`Cannot move brief from "${brief.status}" to "${toStatus}"`)
  }

  if (toStatus === 'matched') {
    const { count } = await supabase
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('brief_id', briefId)

    if (!count || count === 0) {
      throw new Error('Cannot mark as matched: no submissions have been received yet')
    }
  }
}
