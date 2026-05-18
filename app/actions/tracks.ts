'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Use untyped client since 'tracks' table is not in the generated types yet
function getUntypedAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type TrackData = {
  id?: string
  composer_id?: string | null
  title: string
  genre: string | null
  duration: string | null
  bpm: string | null
  key: string | null
  audio_url: string | null
  plays?: number
  versions?: any[]
}

export async function getTracks() {
  const supabase = getUntypedAdminClient()
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[getTracks]', error)
    return []
  }
  return data ?? []
}

export async function createTrack(track: Omit<TrackData, 'id'>) {
  const supabase = getUntypedAdminClient()
  const { data, error } = await supabase
    .from('tracks')
    .insert({ ...track, plays: 0, versions: [] })
    .select()
    .single()
  if (error) {
    console.error('[createTrack]', error)
    return null
  }
  revalidatePath('/dashboard/tracks')
  return data
}

export async function updateTrack(id: string, updates: Partial<TrackData>) {
  const supabase = getUntypedAdminClient()
  const { data, error } = await supabase
    .from('tracks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('[updateTrack]', error)
    return null
  }
  revalidatePath('/dashboard/tracks')
  return data
}

export async function deleteTrack(id: string) {
  const supabase = getUntypedAdminClient()
  const { error } = await supabase.from('tracks').delete().eq('id', id)
  if (error) {
    console.error('[deleteTrack]', error)
    return false
  }
  revalidatePath('/dashboard/tracks')
  return true
}

export async function deleteTracks(ids: string[]) {
  const supabase = getUntypedAdminClient()
  const { error } = await supabase.from('tracks').delete().in('id', ids)
  if (error) {
    console.error('[deleteTracks]', error)
    return false
  }
  revalidatePath('/dashboard/tracks')
  return true
}
