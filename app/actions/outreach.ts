'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OutreachStatus } from '@/types/database.types'

export async function inviteComposer(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')

  const briefId = formData.get('briefId') as string
  const composerId = formData.get('composerId') as string

  if (!briefId || !composerId) throw new Error('Invalid input')

  const { data: brief } = await supabase
    .from('briefs')
    .select('status')
    .eq('id', briefId)
    .single()

  if (brief?.status !== 'active') throw new Error('Can only invite to active briefs')

  const { data: existing } = await supabase
    .from('outreach')
    .select('id')
    .eq('brief_id', briefId)
    .eq('composer_id', composerId)
    .maybeSingle()

  if (existing) return

  const { error } = await supabase.from('outreach').insert({
    brief_id: briefId,
    composer_id: composerId,
    status: 'invited',
  })

  if (error) throw error

  revalidatePath(`/dashboard/briefs/${briefId}`)
}

export type OutreachResponseState = { error: string | null }

export async function respondToOutreach(
  prevState: OutreachResponseState,
  formData: FormData,
): Promise<OutreachResponseState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: composer } = await supabase
    .from('composers')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!composer) return { error: 'Composer profile not found' }

  const outreachId = formData.get('outreachId') as string
  const status = formData.get('status') as OutreachStatus

  if (!outreachId || !['accepted', 'declined'].includes(status)) {
    return { error: 'Invalid input' }
  }

  const { data: record } = await supabase
    .from('outreach')
    .select('composer_id, brief_id, status')
    .eq('id', outreachId)
    .single()

  if (!record || record.composer_id !== composer.id) return { error: 'Forbidden' }
  if (record.status !== 'invited') return { error: 'Already responded to this invite' }

  const { error } = await supabase
    .from('outreach')
    .update({ status, responded_at: new Date().toISOString() })
    .eq('id', outreachId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/briefs')
  revalidatePath(`/dashboard/briefs/${record.brief_id}`)
  return { error: null }
}
