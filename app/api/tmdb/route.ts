import { NextRequest, NextResponse } from 'next/server'

/**
 * TMDB Proxy API Route
 * Keeps TMDB API key server-side. Exposes safe endpoints to the client.
 * 
 * GET /api/tmdb?action=search&type=movie&query=Black+Panther
 * GET /api/tmdb?action=details&type=movie&id=284054
 * GET /api/tmdb?action=trending&type=movie&window=week
 * GET /api/tmdb?action=credits&type=movie&id=284054
 */

const TMDB_BASE = 'https://api.themoviedb.org/3'

function getApiKey() {
  return process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
}

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const key = getApiKey()
  if (!key) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }
  
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set('api_key', key)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } }) // cache 1hr
  if (!res.ok) {
    return NextResponse.json(
      { error: `TMDB error: ${res.status}` },
      { status: res.status }
    )
  }
  
  const data = await res.json()
  return NextResponse.json(data)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const type = searchParams.get('type') || 'movie'
  const query = searchParams.get('query') || ''
  const id = searchParams.get('id') || ''
  const window = searchParams.get('window') || 'week'
  
  switch (action) {
    case 'search':
      return tmdbFetch(`/search/${type}`, { query })
    
    case 'details':
      return tmdbFetch(`/${type}/${id}`, { append_to_response: 'credits' })
    
    case 'trending':
      return tmdbFetch(`/trending/${type}/${window}`)
    
    case 'credits':
      return tmdbFetch(`/${type}/${id}/credits`)
    
    case 'discover':
      const genre = searchParams.get('genre') || ''
      const year = searchParams.get('year') || ''
      const params: Record<string, string> = { sort_by: 'popularity.desc' }
      if (genre) params.with_genres = genre
      if (year) params.primary_release_year = year
      return tmdbFetch(`/discover/${type}`, params)
    
    default:
      return NextResponse.json(
        { error: 'Invalid action. Use: search, details, trending, credits, discover' },
        { status: 400 }
      )
  }
}
