'use server'

import { createClient } from '@/lib/supabase/server'
import fs from 'fs'
import path from 'path'

export interface RadioStation {
  id: string
  state_city: string
  school: string
  station: string
  email: string | null
  notes: string | null
  show_name: string | null
  dj_music_dir: string | null
  website: string | null
  phone: string | null
  address: string | null
  submitted: string | null
}

export async function getRadioStations(): Promise<RadioStation[]> {
  try {
    const supabase = await createClient()
    
    // Check if process.env.NEXT_PUBLIC_SUPABASE_URL and process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY are dummy
    const isDummy = 
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('dummy')
      
    if (isDummy) {
      console.log('[Radio Stations] Using local JSON fallback (dummy Supabase keys detected)')
      return getLocalFallbackStations()
    }

    const { data, error } = await supabase
      .from('radio_stations')
      .select('*')
      .order('state_city', { ascending: true })

    if (error) {
      console.warn('[Radio Stations] Supabase query failed, falling back to local JSON. Error:', error.message)
      return getLocalFallbackStations()
    }

    if (!data || data.length === 0) {
      console.log('[Radio Stations] Supabase table is empty, falling back to local JSON.')
      return getLocalFallbackStations()
    }

    return data as RadioStation[]
  } catch (err: any) {
    console.warn('[Radio Stations] Unexpected error in getRadioStations, falling back to local JSON. Error:', err.message || err)
    return getLocalFallbackStations()
  }
}

function getLocalFallbackStations(): RadioStation[] {
  try {
    const filePath = path.join(process.cwd(), 'scratch', 'radio_stations.json')
    if (!fs.existsSync(filePath)) {
      console.error('[Radio Stations] Local JSON file not found at:', filePath)
      return []
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const jsonList = JSON.parse(fileContent)

    return jsonList.map((item: any, index: number) => ({
      id: item.id || `local-station-${index}`,
      state_city: item['State/City'] || item['SSttaattee//CCiittyy'] || '',
      school: item['School'] || '',
      station: item['Station'] || '',
      email: item['Email'] || null,
      notes: item['Notes'] || null,
      show_name: item['Show'] || null,
      dj_music_dir: item['DJ / Music Dir.'] || null,
      website: item['Website'] || null,
      phone: item['Phone'] || null,
      address: item['Address'] || null,
      submitted: item['Submitted'] || null,
    }))
  } catch (err) {
    console.error('[Radio Stations] Failed to read local fallback JSON:', err)
    return []
  }
}
