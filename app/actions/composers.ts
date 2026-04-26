'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
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

  if (!profileId || !['active', 'rejected'].includes(status)) {
    throw new Error('Invalid input')
  }

  const { error } = await supabase
    .from('composers')
    .update({ status })
    .eq('profile_id', profileId)

  if (error) throw error

  revalidatePath('/dashboard/composers')
}
