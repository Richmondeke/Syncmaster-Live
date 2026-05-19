'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type PlacementData = {
  id: string
  track_id: string | null
  brief_id: string | null
  track_name: string
  brief_title: string
  company: string | null
  license_fee: string | null
  usage: string | null
  exclusivity: string | null
  territory: string | null
  media: string | null
  isrc: string | null
  composer_share: string | null
  commission: string | null
  contract_id: string | null
  placed_at: string | null
  writers: { name: string; email: string; role: string; split: number }[]
  created_at?: string
}

export async function getPlacements(): Promise<PlacementData[]> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('placements')
    .select('*')
    .order('placed_at', { ascending: false })

  if (error) {
    console.error('Error fetching placements:', error)
    return []
  }
  return data || []
}

export async function getPlacement(id: string): Promise<PlacementData | null> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('placements')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching placement:', error)
    return null
  }
  return data
}

export async function createPlacement(placement: Omit<PlacementData, 'id' | 'created_at'>): Promise<PlacementData | null> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('placements')
    .insert(placement)
    .select()
    .single()

  if (error) {
    console.error('Error creating placement:', error)
    return null
  }
  revalidatePath('/dashboard/placements')
  return data
}
