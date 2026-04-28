import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type Supabase = SupabaseClient<Database>

const MAX_SUBMISSIONS = 3

export async function assertSubmissionAllowed(
  supabase: Supabase,
  briefId: string,
  composerId: string,
): Promise<void> {
  const { data: brief } = await supabase
    .from('briefs')
    .select('status')
    .eq('id', briefId)
    .single()

  if (!brief) throw new Error('Brief not found')
  if (brief.status !== 'active') throw new Error('Submissions are only accepted for active briefs')

  const { data: outreach } = await supabase
    .from('outreach')
    .select('status')
    .eq('brief_id', briefId)
    .eq('composer_id', composerId)
    .maybeSingle()

  if (!outreach || outreach.status !== 'accepted') {
    throw new Error('You must accept the outreach invitation before submitting tracks')
  }

  const { count } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('brief_id', briefId)
    .eq('composer_id', composerId)

  if (count !== null && count >= MAX_SUBMISSIONS) {
    throw new Error(`Maximum ${MAX_SUBMISSIONS} submissions allowed per brief`)
  }
}
