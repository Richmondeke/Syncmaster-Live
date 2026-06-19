#!/usr/bin/env node
/**
 * Enrich existing sync-placements data with TMDB metadata.
 * 
 * Usage:
 *   TMDB_API_KEY=your_key node scripts/enrich-with-tmdb.mjs
 * 
 * What it does:
 *   1. Reads all media entries from lib/data/sync-placements.ts
 *   2. Searches TMDB for each movie/TV title
 *   3. Gets poster_path, vote_average, overview, credits
 *   4. Downloads HD posters to /public/posters/
 *   5. Extracts music supervisor + composer credits
 *   6. Outputs enriched data as JSON
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const POSTERS_DIR = path.join(ROOT, 'public', 'posters')
const OUTPUT_FILE = path.join(ROOT, 'scripts', 'tmdb-enrichment.json')

const API_KEY = process.env.TMDB_API_KEY
if (!API_KEY) {
  console.error('❌ Set TMDB_API_KEY environment variable')
  console.error('   Get one free at: https://www.themoviedb.org/settings/api')
  process.exit(1)
}

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMG = 'https://image.tmdb.org/t/p'

fs.mkdirSync(POSTERS_DIR, { recursive: true })

// ── Rate limiter (50 req/sec max, we do 10/sec to be safe) ──────────────────
let lastReqTime = 0
async function throttle() {
  const now = Date.now()
  const diff = now - lastReqTime
  if (diff < 100) await new Promise(r => setTimeout(r, 100 - diff))
  lastReqTime = Date.now()
}

async function tmdbGet(endpoint, params = {}) {
  await throttle()
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  
  const res = await fetch(url.toString())
  if (!res.ok) {
    console.warn(`  ⚠️ TMDB ${endpoint}: ${res.status}`)
    return null
  }
  return res.json()
}

async function downloadPoster(posterPath, slug) {
  const filepath = path.join(POSTERS_DIR, `${slug}.jpg`)
  if (fs.existsSync(filepath)) {
    const stat = fs.statSync(filepath)
    if (stat.size > 5000) {
      console.log(`  📁 Already have: ${slug}.jpg (${Math.round(stat.size/1024)}KB)`)
      return true
    }
  }
  
  const url = `${TMDB_IMG}/w500${posterPath}`
  try {
    const res = await fetch(url)
    if (!res.ok) return false
    const buf = await res.arrayBuffer()
    if (buf.byteLength < 2000) return false
    fs.writeFileSync(filepath, Buffer.from(buf))
    console.log(`  ✅ Downloaded: ${slug}.jpg (${Math.round(buf.byteLength/1024)}KB)`)
    return true
  } catch (e) {
    return false
  }
}

function slugify(title) {
  return title.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const MUSIC_JOBS = new Set([
  'music supervisor', 'original music composer', 'composer',
  'music', 'music producer', 'music editor', 'songwriter',
  'music director', 'score producer'
])

function extractMusicCrew(credits) {
  if (!credits?.crew) return []
  return credits.crew
    .filter(c => 
      MUSIC_JOBS.has(c.job?.toLowerCase()) ||
      c.department?.toLowerCase() === 'sound' ||
      c.department?.toLowerCase() === 'music'
    )
    .map(c => ({ name: c.name, job: c.job, tmdbId: c.id }))
    .slice(0, 10) // top 10 music credits
}

// ── Parse existing media from sync-placements.ts ────────────────────────────
function parseExistingMedia() {
  const content = fs.readFileSync(path.join(ROOT, 'lib', 'data', 'sync-placements.ts'), 'utf8')
  
  // Extract media entries using regex
  const mediaBlock = content.match(/export const syncMedia:\s*SyncMedia\[\]\s*=\s*\[([\s\S]*?)\n\]\s*$/m)
  if (!mediaBlock) {
    // Try to find individual media entries
    const entries = []
    const regex = /{\s*id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?type:\s*'([^']+)'[\s\S]*?year:\s*(\d+)/g
    let match
    while ((match = regex.exec(content)) !== null) {
      entries.push({
        id: match[1],
        title: match[2],
        type: match[3],
        year: parseInt(match[4])
      })
    }
    return entries
  }
  
  const entries = []
  const regex = /id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?type:\s*'([^']+)'[\s\S]*?year:\s*(\d+)/g
  let match
  while ((match = regex.exec(content)) !== null) {
    entries.push({
      id: match[1],
      title: match[2],
      type: match[3],
      year: parseInt(match[4])
    })
  }
  return entries
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('  TMDB Enrichment Script for SyncMaster')
  console.log('═══════════════════════════════════════════════\n')
  
  const media = parseExistingMedia()
  console.log(`Found ${media.length} media entries to enrich\n`)
  
  const enriched = []
  let postersDownloaded = 0
  let matched = 0
  let musicCreditsFound = 0
  
  for (const entry of media) {
    console.log(`\n🔍 ${entry.title} (${entry.type}, ${entry.year})`)
    
    let tmdbData = null
    let credits = null
    const slug = slugify(entry.title)
    
    if (entry.type === 'film' || entry.type === 'documentary') {
      // Search as movie
      const results = await tmdbGet('/search/movie', { query: entry.title, year: entry.year })
      if (results?.results?.length) {
        tmdbData = results.results[0]
        console.log(`  🎬 TMDB Match: "${tmdbData.title}" (${tmdbData.release_date}) ⭐${tmdbData.vote_average}`)
        
        // Get credits
        const details = await tmdbGet(`/movie/${tmdbData.id}`, { append_to_response: 'credits' })
        credits = details?.credits
      } else {
        // Try without year
        const retry = await tmdbGet('/search/movie', { query: entry.title })
        if (retry?.results?.length) {
          tmdbData = retry.results[0]
          console.log(`  🎬 Fuzzy Match: "${tmdbData.title}" (${tmdbData.release_date}) ⭐${tmdbData.vote_average}`)
          const details = await tmdbGet(`/movie/${tmdbData.id}`, { append_to_response: 'credits' })
          credits = details?.credits
        }
      }
    } else if (entry.type === 'tv') {
      // Search as TV
      const results = await tmdbGet('/search/tv', { query: entry.title })
      if (results?.results?.length) {
        tmdbData = results.results[0]
        console.log(`  📺 TMDB Match: "${tmdbData.name}" (${tmdbData.first_air_date}) ⭐${tmdbData.vote_average}`)
        
        const details = await tmdbGet(`/tv/${tmdbData.id}`, { append_to_response: 'credits' })
        credits = details?.credits
      }
    } else {
      console.log(`  ⏭️  Skipping ${entry.type} (not on TMDB)`)
    }
    
    const musicCrew = extractMusicCrew(credits)
    if (musicCrew.length) {
      musicCreditsFound++
      console.log(`  🎵 Music credits: ${musicCrew.map(c => `${c.name} (${c.job})`).join(', ')}`)
    }
    
    // Download poster
    let posterDownloaded = false
    if (tmdbData?.poster_path) {
      posterDownloaded = await downloadPoster(tmdbData.poster_path, slug)
      if (posterDownloaded) postersDownloaded++
      matched++
    }
    
    enriched.push({
      id: entry.id,
      title: entry.title,
      type: entry.type,
      year: entry.year,
      tmdbId: tmdbData?.id || null,
      tmdbTitle: tmdbData?.title || tmdbData?.name || null,
      posterPath: tmdbData?.poster_path || null,
      localPoster: posterDownloaded ? `/posters/${slug}.jpg` : null,
      rating: tmdbData?.vote_average || null,
      voteCount: tmdbData?.vote_count || null,
      overview: tmdbData?.overview || null,
      releaseDate: tmdbData?.release_date || tmdbData?.first_air_date || null,
      musicCredits: musicCrew,
    })
  }
  
  // Save enrichment data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(enriched, null, 2))
  
  console.log('\n═══════════════════════════════════════════════')
  console.log('  RESULTS')
  console.log('═══════════════════════════════════════════════')
  console.log(`  Total media:        ${media.length}`)
  console.log(`  TMDB matches:       ${matched}`)
  console.log(`  Posters downloaded: ${postersDownloaded}`)
  console.log(`  Music credits:      ${musicCreditsFound} media with credits`)
  console.log(`  Output:             ${OUTPUT_FILE}`)
  console.log('═══════════════════════════════════════════════\n')
}

main().catch(console.error)
