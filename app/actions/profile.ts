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
  is_pro?: boolean
  role?: string
}

export async function getProfile(): Promise<(ProfileData & { email: string | null; created_at: string | null }) | null> {
  const supabase = await createClient()
  const user = await getSessionUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, created_at, role, is_pro, composers(bio, portfolio_url, genres)')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('[getProfile]', error)
    return null
  }

  const composer = Array.isArray((data as any).composers)
    ? (data as any).composers[0]
    : (data as any).composers

  return {
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    created_at: data.created_at,
    role: data.role,
    is_pro: data.is_pro,
    bio: composer?.bio ?? null,
    portfolio_url: composer?.portfolio_url ?? null,
    genres: composer?.genres ?? null,
    email: user.email ?? null,
  }
}

export async function updateProfile(updates: Partial<ProfileData>): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const user = await getSessionUser()
  if (!user) return { ok: false, error: 'Unauthorized' }

  // 1. Separate fields
  const profileUpdates: any = {}
  if (updates.full_name !== undefined) profileUpdates.full_name = updates.full_name
  if (updates.avatar_url !== undefined) profileUpdates.avatar_url = updates.avatar_url

  const composerUpdates: any = {}
  if (updates.bio !== undefined) composerUpdates.bio = updates.bio
  if (updates.portfolio_url !== undefined) composerUpdates.portfolio_url = updates.portfolio_url
  if (updates.genres !== undefined) composerUpdates.genres = updates.genres

  // 2. Perform updates
  if (Object.keys(profileUpdates).length > 0) {
    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', user.id)
    if (error) {
      console.error('[updateProfile] Profiles update error:', error)
      return { ok: false, error: error.message }
    }
  }

  if (Object.keys(composerUpdates).length > 0) {
    // Check if composer record exists, if not, create it
    const { data: composerData } = await supabase
      .from('composers')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle()

    if (composerData) {
      const { error } = await supabase
        .from('composers')
        .update(composerUpdates)
        .eq('profile_id', user.id)
      if (error) {
        console.error('[updateProfile] Composers update error:', error)
        return { ok: false, error: error.message }
      }
    } else {
      const { error } = await supabase
        .from('composers')
        .insert({ profile_id: user.id, ...composerUpdates })
      if (error) {
        console.error('[updateProfile] Composers insert error:', error)
        return { ok: false, error: error.message }
      }
    }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { ok: true }
}
