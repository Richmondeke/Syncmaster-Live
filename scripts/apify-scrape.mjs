#!/usr/bin/env node
/**
 * Apify Scraping Scripts for SyncMaster
 * 
 * Uses Apify API to run actors and retrieve scraped data.
 * Budget: $5 total — each script prints estimated cost before running.
 * 
 * Usage:
 *   APIFY_TOKEN=your_token node scripts/apify-scrape.mjs [command]
 * 
 * Commands:
 *   spotify-artists   — Scrape African artist data from Spotify (~$1.50)
 *   google-sync        — Search Google for sync placement articles (~$1.00)
 *   imdb-credits       — Scrape IMDb for music supervisors (~$1.50)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '..', 'scripts', 'apify-output')
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const APIFY_TOKEN = process.env.APIFY_TOKEN
if (!APIFY_TOKEN) {
  console.error('❌ Set APIFY_TOKEN environment variable')
  process.exit(1)
}
const APIFY_BASE = 'https://api.apify.com/v2'

// ── Apify API helpers ────────────────────────────────────────────────────────

async function runActor(actorId, input, opts = {}) {
  const timeout = opts.timeout || 300 // 5 min default
  console.log(`\n🚀 Running actor: ${actorId}`)
  console.log(`   Input: ${JSON.stringify(input).slice(0, 200)}...`)
  
  const res = await fetch(`${APIFY_BASE}/acts/${actorId}/runs?token=${APIFY_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...input,
      memory: opts.memory || 256, // minimize memory = minimize cost
      timeout,
    })
  })
  
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Failed to start actor: ${res.status} ${err}`)
  }
  
  const run = await res.json()
  console.log(`   Run ID: ${run.data.id}`)
  console.log(`   Status: ${run.data.status}`)
  
  // Poll for completion
  let status = run.data.status
  let attempts = 0
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 5000))
    const check = await fetch(`${APIFY_BASE}/actor-runs/${run.data.id}?token=${APIFY_TOKEN}`)
    const checkData = await check.json()
    status = checkData.data.status
    attempts++
    process.stdout.write(`   Polling... ${status} (${attempts * 5}s)\r`)
    if (attempts > timeout / 5) break
  }
  console.log(`\n   Final status: ${status}`)
  
  if (status !== 'SUCCEEDED') {
    console.warn(`   ⚠️ Run did not succeed: ${status}`)
    return []
  }
  
  // Get results
  const datasetId = run.data.defaultDatasetId
  const items = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`)
  const results = await items.json()
  console.log(`   📦 Got ${results.length} items`)
  return results
}

// ── 1. Spotify African Artists ───────────────────────────────────────────────

async function scrapeSpotifyArtists() {
  console.log('═══════════════════════════════════════════════')
  console.log('  SPOTIFY: African Artist Data')
  console.log('  Est. cost: ~$0.50-1.50 (budget conscious)')
  console.log('═══════════════════════════════════════════════')
  
  // Key African artists from our sync database + notable ones
  const artists = [
    'Burna Boy', 'Wizkid', 'Tems', 'Rema', 'Davido',
    'Tiwa Savage', 'Asa', 'Fela Kuti', 'Asake', 'Ayra Starr',
    'Fireboy DML', 'Omah Lay', 'CKay', 'Yemi Alade', 'Olamide',
    'Diamond Platnumz', 'Sauti Sol', 'Shatta Wale', 'Stonebwoy',
    'Angelique Kidjo', 'Baaba Maal', 'Youssou N\'Dour', 'Salif Keita',
    'Adekunle Gold', 'Simi', 'Patoranking', 'Mr Eazi', 'Joeboy',
    'Oxlade', 'Lojay', 'Victony', 'Ruger', 'BNXN', 'Crayon',
    'Ladysmith Black Mambazo', 'Miriam Makeba', 'Hugh Masekela',
    'Black Coffee', 'Master KG', 'Focalistic', 'Nasty C', 'AKA',
    'Kabza De Small', 'DJ Maphorisa', 'Tyla', 'Uncle Waffles',
    'Amaarae', 'SGaWD', 'Darkoo', 'Buju', 'Zinoleesky',
  ]
  
  try {
    // Use a Spotify scraper actor — try the most cost-effective one
    const results = await runActor('apify~spotify-scraper', {
      searchTerms: artists.map(a => `artist:${a}`),
      maxItems: 100, // limit to control cost
      searchType: 'artist',
    }, { memory: 256, timeout: 120 })
    
    const outputFile = path.join(OUTPUT_DIR, 'spotify-artists.json')
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2))
    console.log(`\n✅ Saved to ${outputFile}`)
    return results
  } catch (e) {
    console.error(`❌ Spotify scrape failed: ${e.message}`)
    // Fallback: try alternative actor
    console.log('Trying alternative actor...')
    try {
      const results = await runActor('curious_coder~spotify-scraper', {
        searchQueries: artists.slice(0, 20), // smaller batch
        maxResults: 50,
      }, { memory: 256, timeout: 120 })
      
      const outputFile = path.join(OUTPUT_DIR, 'spotify-artists.json')
      fs.writeFileSync(outputFile, JSON.stringify(results, null, 2))
      console.log(`\n✅ Saved to ${outputFile}`)
      return results
    } catch (e2) {
      console.error(`❌ Fallback also failed: ${e2.message}`)
      return []
    }
  }
}

// ── 2. Google Search: Sync Placements ────────────────────────────────────────

async function scrapeGoogleSync() {
  console.log('═══════════════════════════════════════════════')
  console.log('  GOOGLE: Sync Placement Articles')
  console.log('  Est. cost: ~$0.50-1.00')
  console.log('═══════════════════════════════════════════════')
  
  const queries = [
    '"African music" sync placement movie OR TV 2024 2025 2026',
    '"music supervisor" Afrobeats OR "African music" placement',
    'Burna Boy OR Wizkid OR Tems OR Rema sync license film',
    '"sync licensing" African artist commercial OR advertisement',
    'Afrobeats soundtrack Netflix OR Disney OR HBO 2025',
  ]
  
  try {
    const results = await runActor('apify~google-search-scraper', {
      queries: queries.join('\n'),
      maxPagesPerQuery: 2, // 2 pages = ~20 results per query
      resultsPerPage: 10,
      languageCode: 'en',
      countryCode: 'us',
    }, { memory: 256, timeout: 120 })
    
    const outputFile = path.join(OUTPUT_DIR, 'google-sync-articles.json')
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2))
    console.log(`\n✅ Saved to ${outputFile}`)
    return results
  } catch (e) {
    console.error(`❌ Google scrape failed: ${e.message}`)
    return []
  }
}

// ── 3. IMDb Music Credits ────────────────────────────────────────────────────

async function scrapeImdbCredits() {
  console.log('═══════════════════════════════════════════════')
  console.log('  IMDB: Music Supervisor Credits')
  console.log('  Est. cost: ~$1.00-1.50')
  console.log('═══════════════════════════════════════════════')
  
  // Our key movies/shows to get soundtrack credits for
  const titles = [
    'Black Panther Wakanda Forever', 'Queen and Slim',
    'Spider-Man Across the Spider-Verse', 'Coming 2 America',
    'The Woman King', 'Barbie', 'Creed III', 'Get Out',
    'Mufasa: The Lion King', 'Moana 2', 'Wicked', 'Beast',
    'Stranger Things', 'Euphoria', 'Insecure', 'Atlanta',
    'Ted Lasso', 'The Bear', 'Yellowjackets', 'Wednesday',
    'Squid Game', 'Emily in Paris', 'Bridgerton', 'The Crown',
  ]
  
  try {
    const results = await runActor('epctex~imdb-scraper', {
      search: titles.join('\n'),
      maxItems: 50,
      type: 'movie',
    }, { memory: 512, timeout: 180 })
    
    const outputFile = path.join(OUTPUT_DIR, 'imdb-credits.json')
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2))
    console.log(`\n✅ Saved to ${outputFile}`)
    return results
  } catch (e) {
    console.error(`❌ IMDb scrape failed: ${e.message}`)
    return []
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────────

const command = process.argv[2]

console.log('\n🎵 SyncMaster Apify Scraper')
console.log(`   Token: ${APIFY_TOKEN.slice(0, 15)}...`)
console.log(`   Budget: $5.00 total\n`)

switch (command) {
  case 'spotify-artists':
    await scrapeSpotifyArtists()
    break
  case 'google-sync':
    await scrapeGoogleSync()
    break
  case 'imdb-credits':
    await scrapeImdbCredits()
    break
  case 'all':
    console.log('⚠️  Running ALL scrapers. Est. total: ~$3-5')
    console.log('   Press Ctrl+C within 5s to cancel...\n')
    await new Promise(r => setTimeout(r, 5000))
    await scrapeSpotifyArtists()
    await scrapeGoogleSync()
    await scrapeImdbCredits()
    break
  default:
    console.log('Usage: node scripts/apify-scrape.mjs [command]\n')
    console.log('Commands:')
    console.log('  spotify-artists  — Scrape African artist data (~$1.50)')
    console.log('  google-sync      — Search for sync placement articles (~$1.00)')
    console.log('  imdb-credits     — Scrape IMDb music credits (~$1.50)')
    console.log('  all              — Run everything (~$3-5)')
    break
}
