'use server'

import { createClient } from '@/lib/supabase/server'
import { syncMedia, syncPlacements, type SyncMedia, type SyncPlacement } from '@/lib/data/sync-placements'

// ─── Types ──────────────────────────────────────────────────────────────────

type SearchFilters = {
  type?: string
  year?: number
  africanOnly?: boolean
  country?: string
}

type SearchResult = {
  media: SyncMedia[]
  placements: SyncPlacement[]
  total: number
}

type SubmitPlacementData = {
  mediaTitle: string
  mediaType: string
  mediaYear?: number
  artistName: string
  songTitle: string
  isAfricanArtist: boolean
  artistCountry?: string
  genre?: string
  sceneDescription?: string
  season?: number
  episode?: number
}

// ─── Static data fallback helpers ───────────────────────────────────────────

function filterStaticData(query: string, filters?: SearchFilters): SearchResult {
  const q = query.toLowerCase().trim()

  // Filter media
  let filteredMedia = syncMedia.filter((m) => {
    // Text search across title and description
    const matchesQuery =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.genre.some((g) => g.toLowerCase().includes(q))

    // Type filter
    const matchesType = !filters?.type || m.type === filters.type

    // Year filter
    const matchesYear = !filters?.year || m.year === filters.year

    return matchesQuery && matchesType && matchesYear
  })

  // Filter placements
  let filteredPlacements = syncPlacements.filter((p) => {
    // Text search across artist name, song title, genre, scene
    const matchesQuery =
      !q ||
      p.artistName.toLowerCase().includes(q) ||
      p.songTitle.toLowerCase().includes(q) ||
      p.genre.toLowerCase().includes(q) ||
      (p.sceneDescription && p.sceneDescription.toLowerCase().includes(q))

    // African artist filter
    const matchesAfrican = !filters?.africanOnly || p.isAfricanArtist

    // Country filter
    const matchesCountry = !filters?.country || p.artistCountry === filters.country

    return matchesQuery && matchesAfrican && matchesCountry
  })

  // If filtering placements, also include their parent media
  if (filters?.africanOnly || filters?.country) {
    const mediaIds = new Set(filteredPlacements.map((p) => p.mediaId))
    filteredMedia = filteredMedia.filter((m) => mediaIds.has(m.id))
  }

  // If we searched and found placements but not their media, add the media
  if (q && filteredPlacements.length > 0) {
    const existingMediaIds = new Set(filteredMedia.map((m) => m.id))
    const placementMediaIds = new Set(filteredPlacements.map((p) => p.mediaId))
    for (const mediaId of placementMediaIds) {
      if (!existingMediaIds.has(mediaId)) {
        const media = syncMedia.find((m) => m.id === mediaId)
        if (media) filteredMedia.push(media)
      }
    }
  }

  return {
    media: filteredMedia,
    placements: filteredPlacements,
    total: filteredMedia.length + filteredPlacements.length,
  }
}

// ─── Server Actions ─────────────────────────────────────────────────────────

/**
 * Search across all media and placements.
 * Tries Supabase first with trigram search, falls back to static data.
 */
export async function searchSyncRadar(
  query: string,
  filters?: SearchFilters
): Promise<SearchResult> {
  try {
    const supabase = await createClient()

    // Build media query
    let mediaQuery = supabase
      .from('sync_media')
      .select('*')

    if (query) {
      mediaQuery = mediaQuery.ilike('title', `%${query}%`)
    }
    if (filters?.type) {
      mediaQuery = mediaQuery.eq('type', filters.type)
    }
    if (filters?.year) {
      mediaQuery = mediaQuery.eq('year', filters.year)
    }

    // Build placements query
    let placementsQuery = supabase
      .from('sync_placements')
      .select('*')

    if (query) {
      // Search across artist name and song title using OR
      placementsQuery = placementsQuery.or(
        `artist_name.ilike.%${query}%,song_title.ilike.%${query}%,genre.ilike.%${query}%`
      )
    }
    if (filters?.africanOnly) {
      placementsQuery = placementsQuery.eq('is_african_artist', true)
    }
    if (filters?.country) {
      placementsQuery = placementsQuery.eq('artist_country', filters.country)
    }

    const [mediaResult, placementsResult] = await Promise.all([
      mediaQuery.order('year', { ascending: false }),
      placementsQuery.order('created_at', { ascending: false }),
    ])

    // If both queries returned null data (no-op proxy), fall back
    if (mediaResult.data === null && placementsResult.data === null) {
      return filterStaticData(query, filters)
    }

    // Map Supabase rows back to our app types
    const media: SyncMedia[] = (mediaResult.data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      title: row.title as string,
      type: row.type as SyncMedia['type'],
      year: row.year as number,
      posterUrl: (row.poster_url as string) || '',
      description: (row.description as string) || '',
      genre: (row.genres as string[]) || [],
      totalSongs: (row.total_songs as number) || 0,
    }))

    const placements: SyncPlacement[] = (placementsResult.data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      mediaId: row.media_id as string,
      artistName: row.artist_name as string,
      songTitle: row.song_title as string,
      isAfricanArtist: (row.is_african_artist as boolean) || false,
      artistCountry: (row.artist_country as string) || null,
      genre: (row.genre as string) || '',
      sceneDescription: (row.scene_description as string) || null,
      spotifyUrl: (row.spotify_url as string) || null,
      season: (row.season as number) || null,
      episode: (row.episode as number) || null,
    }))

    return {
      media,
      placements,
      total: media.length + placements.length,
    }
  } catch {
    // Fallback to static data filtering
    return filterStaticData(query, filters)
  }
}

/**
 * Submit a community placement for review.
 * Requires authenticated user.
 */
export async function submitPlacement(data: SubmitPlacementData): Promise<{
  success?: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Must be signed in to submit' }
    }

    const { error } = await supabase.from('sync_submissions').insert({
      media_title: data.mediaTitle,
      media_type: data.mediaType,
      media_year: data.mediaYear ?? null,
      artist_name: data.artistName,
      song_title: data.songTitle,
      is_african_artist: data.isAfricanArtist,
      artist_country: data.artistCountry ?? null,
      genre: data.genre ?? null,
      scene_description: data.sceneDescription ?? null,
      season: data.season ?? null,
      episode: data.episode ?? null,
      submitted_by: user.id,
    })

    if (error) return { error: error.message }
    return { success: true }
  } catch {
    return { error: 'Supabase is not configured. Community submissions are coming soon!' }
  }
}

/**
 * Get all unique countries that have African artist placements.
 * Falls back to static data extraction.
 */
export async function getCountries(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('sync_placements')
      .select('artist_country')
      .not('artist_country', 'is', null)
      .eq('is_african_artist', true)

    if (data && data.length > 0) {
      const countries = [...new Set(data.map((r: Record<string, unknown>) => r.artist_country as string))]
      return countries.sort()
    }
  } catch {
    // Fall through to static data
  }

  // Static fallback
  const countries = [
    ...new Set(
      syncPlacements
        .filter((p) => p.isAfricanArtist && p.artistCountry)
        .map((p) => p.artistCountry as string)
    ),
  ]
  return countries.sort()
}

/**
 * Get all unique years across all media.
 * Falls back to static data extraction.
 */
export async function getYears(): Promise<number[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('sync_media')
      .select('year')
      .order('year', { ascending: false })

    if (data && data.length > 0) {
      return [...new Set(data.map((r: Record<string, unknown>) => r.year as number))]
    }
  } catch {
    // Fall through to static data
  }

  // Static fallback
  const years = [...new Set(syncMedia.map((m) => m.year))]
  return years.sort((a, b) => b - a)
}

/**
 * Get a single media entry with all its placements.
 * Falls back to static data.
 */
export async function getMediaWithPlacements(mediaId: string): Promise<{
  media: SyncMedia | null
  placements: SyncPlacement[]
}> {
  try {
    const supabase = await createClient()

    const [mediaResult, placementsResult] = await Promise.all([
      supabase.from('sync_media').select('*').eq('id', mediaId).single(),
      supabase
        .from('sync_placements')
        .select('*')
        .eq('media_id', mediaId)
        .order('created_at', { ascending: true }),
    ])

    if (mediaResult.data) {
      const row = mediaResult.data as Record<string, unknown>
      const media: SyncMedia = {
        id: row.id as string,
        title: row.title as string,
        type: row.type as SyncMedia['type'],
        year: row.year as number,
        posterUrl: (row.poster_url as string) || '',
        description: (row.description as string) || '',
        genre: (row.genres as string[]) || [],
        totalSongs: (row.total_songs as number) || 0,
      }

      const placements: SyncPlacement[] = (placementsResult.data || []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        mediaId: r.media_id as string,
        artistName: r.artist_name as string,
        songTitle: r.song_title as string,
        isAfricanArtist: (r.is_african_artist as boolean) || false,
        artistCountry: (r.artist_country as string) || null,
        genre: (r.genre as string) || '',
        sceneDescription: (r.scene_description as string) || null,
        spotifyUrl: (r.spotify_url as string) || null,
        season: (r.season as number) || null,
        episode: (r.episode as number) || null,
      }))

      return { media, placements }
    }
  } catch {
    // Fall through to static data
  }

  // Static fallback
  const media = syncMedia.find((m) => m.id === mediaId) ?? null
  const placements = syncPlacements.filter((p) => p.mediaId === mediaId)
  return { media, placements }
}

/**
 * Get stats for the Sync Radar dashboard.
 * Falls back to static data counts.
 */
export async function getSyncRadarStats(): Promise<{
  totalMedia: number
  totalPlacements: number
  totalAfricanPlacements: number
  uniqueCountries: number
}> {
  try {
    const supabase = await createClient()

    const [mediaCount, placementsCount, africanCount, countries] = await Promise.all([
      supabase.from('sync_media').select('id', { count: 'exact', head: true }),
      supabase.from('sync_placements').select('id', { count: 'exact', head: true }),
      supabase
        .from('sync_placements')
        .select('id', { count: 'exact', head: true })
        .eq('is_african_artist', true),
      supabase
        .from('sync_placements')
        .select('artist_country')
        .not('artist_country', 'is', null)
        .eq('is_african_artist', true),
    ])

    if (mediaCount.count !== null) {
      const uniqueCountries = new Set(
        (countries.data || []).map((r: Record<string, unknown>) => r.artist_country)
      ).size

      return {
        totalMedia: mediaCount.count ?? 0,
        totalPlacements: placementsCount.count ?? 0,
        totalAfricanPlacements: africanCount.count ?? 0,
        uniqueCountries,
      }
    }
  } catch {
    // Fall through to static data
  }

  // Static fallback
  const africanPlacements = syncPlacements.filter((p) => p.isAfricanArtist)
  const uniqueCountries = new Set(
    africanPlacements.filter((p) => p.artistCountry).map((p) => p.artistCountry)
  ).size

  return {
    totalMedia: syncMedia.length,
    totalPlacements: syncPlacements.length,
    totalAfricanPlacements: africanPlacements.length,
    uniqueCountries,
  }
}
