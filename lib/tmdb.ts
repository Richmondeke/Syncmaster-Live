/**
 * TMDB (The Movie Database) API Client
 * Free tier: ~50 req/sec, unlimited requests
 * Docs: https://developer.themoviedb.org/docs
 */

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export type TmdbMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres?: { id: number; name: string }[]
}

export type TmdbTvShow = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres?: { id: number; name: string }[]
}

export type TmdbCrewMember = {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export type TmdbCredits = {
  crew: TmdbCrewMember[]
  cast: { id: number; name: string; character: string; profile_path: string | null }[]
}

// ── API Key ──────────────────────────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!key) throw new Error('TMDB_API_KEY not set in environment')
  return key
}

function getReadToken(): string | null {
  return process.env.TMDB_READ_TOKEN || null
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const token = getReadToken()
  const url = new URL(`${TMDB_BASE}${endpoint}`)

  if (!token) {
    params.api_key = getApiKey()
  }

  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url.toString(), { headers, next: { revalidate: 86400 } })
  if (!res.ok) {
    throw new Error(`TMDB ${endpoint}: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// ── Poster URLs ──────────────────────────────────────────────────────────────

export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'

export function posterUrl(posterPath: string | null, size: PosterSize = 'w500'): string | null {
  if (!posterPath) return null
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`
}

export function backdropUrl(backdropPath: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
  if (!backdropPath) return null
  return `${TMDB_IMAGE_BASE}/${size}${backdropPath}`
}

// ── Search ───────────────────────────────────────────────────────────────────

export async function searchMovies(query: string, year?: number): Promise<TmdbMovie[]> {
  const params: Record<string, string> = { query }
  if (year) params.year = String(year)
  const data = await tmdbFetch<{ results: TmdbMovie[] }>('/search/movie', params)
  return data.results
}

export async function searchTv(query: string, year?: number): Promise<TmdbTvShow[]> {
  const params: Record<string, string> = { query }
  if (year) params.first_air_date_year = String(year)
  const data = await tmdbFetch<{ results: TmdbTvShow[] }>('/search/tv', params)
  return data.results
}

// ── Details ──────────────────────────────────────────────────────────────────

export async function getMovieDetails(movieId: number): Promise<TmdbMovie & { credits: TmdbCredits }> {
  return tmdbFetch(`/movie/${movieId}`, { append_to_response: 'credits' })
}

export async function getTvDetails(tvId: number): Promise<TmdbTvShow & { credits: TmdbCredits }> {
  return tmdbFetch(`/tv/${tvId}`, { append_to_response: 'credits' })
}

// ── Credits ──────────────────────────────────────────────────────────────────

export async function getMovieCredits(movieId: number): Promise<TmdbCredits> {
  return tmdbFetch(`/movie/${movieId}/credits`)
}

export async function getTvCredits(tvId: number): Promise<TmdbCredits> {
  return tmdbFetch(`/tv/${tvId}/credits`)
}

// ── Music-specific helpers ───────────────────────────────────────────────────

const MUSIC_JOBS = [
  'Music Supervisor',
  'Original Music Composer',
  'Composer',
  'Music',
  'Music Producer',
  'Music Editor',
  'Songwriter',
  'Music Director',
  'Score Producer',
]

export function extractMusicCredits(credits: TmdbCredits): TmdbCrewMember[] {
  return credits.crew.filter(
    c =>
      MUSIC_JOBS.some(job => c.job?.toLowerCase() === job.toLowerCase()) ||
      c.department?.toLowerCase() === 'sound' ||
      c.department?.toLowerCase() === 'music'
  )
}

// ── Trending ─────────────────────────────────────────────────────────────────

export async function getTrending(
  mediaType: 'movie' | 'tv' | 'all' = 'all',
  timeWindow: 'day' | 'week' = 'week'
): Promise<(TmdbMovie | TmdbTvShow)[]> {
  const data = await tmdbFetch<{ results: (TmdbMovie | TmdbTvShow)[] }>(
    `/trending/${mediaType}/${timeWindow}`
  )
  return data.results
}

// ── Discover ─────────────────────────────────────────────────────────────────

export async function discoverMovies(params: Record<string, string> = {}): Promise<TmdbMovie[]> {
  const data = await tmdbFetch<{ results: TmdbMovie[] }>('/discover/movie', {
    sort_by: 'popularity.desc',
    ...params,
  })
  return data.results
}

// ── Keyword search (for "afrobeats", "african music", etc.) ──────────────────

export async function searchKeywords(query: string): Promise<{ id: number; name: string }[]> {
  const data = await tmdbFetch<{ results: { id: number; name: string }[] }>('/search/keyword', { query })
  return data.results
}

// ── Multi-search ─────────────────────────────────────────────────────────────

export async function searchMulti(query: string): Promise<(TmdbMovie | TmdbTvShow)[]> {
  const data = await tmdbFetch<{ results: (TmdbMovie | TmdbTvShow)[] }>('/search/multi', { query })
  return data.results
}
