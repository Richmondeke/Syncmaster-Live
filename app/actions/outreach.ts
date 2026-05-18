'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { getSessionUser } from '@/lib/supabase/session'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/services/email'
import { outreachInviteEmail } from '@/emails/outreach-invite'
import { outreachAcceptedEmail } from '@/emails/outreach-accepted'
import type { OutreachStatus } from '@/types/database.types'

export async function inviteComposer(formData: FormData): Promise<void> {
  const supabase = getAdminClient()

  const user = await getSessionUser()
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
    .select('status, title')
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

  // Send invite email — best effort
  try {
    const { data: composerRow } = await supabase
      .from('composers')
      .select('profile_id, profiles!inner(full_name)')
      .eq('id', composerId)
      .single()

    if (composerRow) {
      const { data: authUser } = await getAdminClient().auth.admin.getUserById(composerRow.profile_id)
      const email = authUser.user?.email
      const name = (composerRow.profiles as unknown as { full_name: string | null })?.full_name ?? 'Composer'
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

      if (email) {
        await sendEmail(
          email,
          `You've been invited to submit for: ${brief.title}`,
          outreachInviteEmail(name, brief.title, `${appUrl}/dashboard/briefs/${briefId}`),
        )
      }
    }
  } catch {
    // Email failure must not roll back the invite
  }

  revalidatePath(`/dashboard/briefs/${briefId}`)
}

export type OutreachResponseState = { error: string | null }

export async function respondToOutreach(
  prevState: OutreachResponseState,
  formData: FormData,
): Promise<OutreachResponseState> {
  const supabase = getAdminClient()

  const user = await getSessionUser()
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

  if (status === 'accepted' && user.email) {
    try {
      const { data: composerProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const { data: brief } = await supabase
        .from('briefs')
        .select('title')
        .eq('id', record.brief_id)
        .single()

      const emailResult = await sendEmail(
        user.email,
        'Your brief invitation was accepted',
        outreachAcceptedEmail(composerProfile?.full_name ?? 'Composer', brief?.title ?? 'the brief'),
      )

      if (!emailResult.ok) {
        console.error('[respondToOutreach] acceptance email failed:', emailResult.error)
      }
    } catch (err) {
      console.error('[respondToOutreach] acceptance email error:', err)
    }
  }

  revalidatePath('/dashboard/briefs')
  revalidatePath(`/dashboard/briefs/${record.brief_id}`)
  return { error: null }
}
