'use server'

import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getSessionUser } from '@/lib/supabase/session'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/services/email'
import { composerApprovedEmail } from '@/emails/composer-approved'
import { composerRejectedEmail } from '@/emails/composer-rejected'
import type { ComposerStatus } from '@/types/database.types'

export type VetComposerResult =
  | { ok: true; emailFailed?: false }
  | { ok: true; emailFailed: true; error: string }
  | { ok: false; error: string }

export async function vetComposer(formData: FormData): Promise<VetComposerResult> {
  const supabase = await createClient()

  const user = await getSessionUser()
  console.log('[vetComposer] Authenticated user:', user?.id, user?.email)
  if (!user) return { ok: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  console.log('[vetComposer] User role profile:', profile)

  if (profile?.role !== 'admin') return { ok: false, error: 'Forbidden' }

  const profileId = formData.get('profileId') as string
  const status = formData.get('status') as ComposerStatus
  const rejectionNote = (formData.get('rejectionNote') as string | null)?.trim() || null

  console.log('[vetComposer] Inputs:', { profileId, status, rejectionNote })

  if (!profileId || !['active', 'rejected'].includes(status)) {
    return { ok: false, error: 'Invalid input' }
  }

  const { error } = await supabase
    .from('composers')
    .update({ status })
    .eq('profile_id', profileId)

  if (error) {
    console.error('[vetComposer] DB Update error:', error)
    return { ok: false, error: error.message }
  }
  console.log('[vetComposer] DB Update successful')

  // Send email
  let emailSent = true
  try {
    const { data: authUser } = await getAdminClient().auth.admin.getUserById(profileId)
    const { data: composerProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', profileId)
      .single()

    const email = authUser.user?.email
    const name = composerProfile?.full_name ?? 'Composer'
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    if (email) {
      const emailSubject = status === 'active'
        ? 'Your SyncMaster application has been approved'
        : 'Your SyncMaster application update'
      const emailHtml = status === 'active'
        ? composerApprovedEmail(name, `${appUrl}/dashboard`)
        : composerRejectedEmail(name, rejectionNote)

      const result = await sendEmail(email, emailSubject, emailHtml)
      if (!result.ok) {
        console.error('[vetComposer] email send failed:', result.error)
        emailSent = false
      }
    }
  } catch (err) {
    console.error('[vetComposer] email send error:', err)
    emailSent = false
  }

  revalidatePath('/dashboard/composers')
  revalidatePath('/dashboard')

  if (!emailSent) {
    return {
      ok: true,
      emailFailed: true,
      error: 'Composer status updated but notification email failed to send. You may want to contact them manually.',
    }
  }

  return { ok: true }
}
