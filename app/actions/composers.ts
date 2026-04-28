'use server'

import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/services/email'
import { composerApprovedEmail } from '@/emails/composer-approved'
import { composerRejectedEmail } from '@/emails/composer-rejected'
import type { ComposerStatus } from '@/types/database.types'

export async function vetComposer(formData: FormData): Promise<void> {
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

  const profileId = formData.get('profileId') as string
  const status = formData.get('status') as ComposerStatus
  const rejectionNote = (formData.get('rejectionNote') as string | null)?.trim() || null

  if (!profileId || !['active', 'rejected'].includes(status)) {
    throw new Error('Invalid input')
  }

  const { error } = await supabase
    .from('composers')
    .update({ status })
    .eq('profile_id', profileId)

  if (error) throw error

  // Send email — best effort
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
      if (status === 'active') {
        await sendEmail(email, 'Your SyncMaster application has been approved', composerApprovedEmail(name, `${appUrl}/dashboard`))
      } else {
        await sendEmail(email, 'Your SyncMaster application update', composerRejectedEmail(name, rejectionNote))
      }
    }
  } catch {
    // Email failure must not roll back the status update
  }

  revalidatePath('/dashboard/composers')
}
