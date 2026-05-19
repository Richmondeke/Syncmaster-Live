'use server'

import { createClient } from '@/lib/supabase/server'
import { getSessionUser } from '@/lib/supabase/session'
import { revalidatePath } from 'next/cache'

export type ProfileData = {
  full_name: string | null
  bio: string | null
  portfolio_url: string | null
  genres: string[] | null
  avatar_url: string | null
}

export async function getProfile(): Promise<(ProfileData & { email: string | null; created_at: string | null }) | null> {
  const supabase = await createClient()
  const user = await getSessionUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, bio, portfolio_url, genres, avatar_url, created_at')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('[getProfile]', error)
    return null
  }

  return {
    ...(data as unknown as ProfileData & { created_at: string | null }),
    email: user.email ?? null,
  }
}

export async function updateProfile(updates: Partial<ProfileData>): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const user = await getSessionUser()
  if (!user) return { ok: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('profiles')
    .update(updates as any)
    .eq('id', user.id)

  if (error) {
    console.error('[updateProfile]', error)
    return { ok: false, error: error.message }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { ok: true }
}
