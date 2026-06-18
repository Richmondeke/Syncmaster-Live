/**
 * Fetch game covers from RAWG.io (free API) + generate event posters
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTERS_DIR = path.join(__dirname, '..', 'public', 'posters')
fs.mkdirSync(POSTERS_DIR, { recursive: true })

// RAWG.io - free video game database API (no key needed for basic)
const RAWG_BASE = 'https://api.rawg.io/api'
const RAWG_KEY = 'c542e67aec3a4340908f9de9e86038af' // free tier key

async function downloadImage(url, filepath) {
  try {
    const res = await fetch(url)
    if (!res.ok) return false
    const buf = await res.arrayBuffer()
    fs.writeFileSync(filepath, Buffer.from(buf))
    console.log(`  ✅ Saved ${path.basename(filepath)} (${Math.round(buf.byteLength/1024)}KB)`)
    return true
  } catch(e) { return false }
}

async function fetchGameCover(searchTerm, slug) {
  console.log(`\n🎮 Searching: "${searchTerm}"`)
  
  // Try RAWG first
  const url = `${RAWG_BASE}/games?key=${RAWG_KEY}&search=${encodeURIComponent(searchTerm)}&page_size=3`
  try {
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      const game = data.results?.[0]
      if (game?.background_image) {
        console.log(`  RAWG found: ${game.name} (${game.released})`)
        const filepath = path.join(POSTERS_DIR, `${slug}.jpg`)
        return await downloadImage(game.background_image, filepath)
      }
    }
  } catch(e) {}
  
  // Fallback: try different Wikipedia format
  const wikiUrls = [
    `https://en.wikipedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(searchTerm)}_cover.jpg&width=300`,
    `https://en.wikipedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(searchTerm)}_cover_art.jpg&width=300`,
  ]
  for (const wurl of wikiUrls) {
    try {
      const res = await fetch(wurl, { redirect: 'follow' })
      if (res.ok && res.headers.get('content-type')?.includes('image')) {
        const buf = await res.arrayBuffer()
        if (buf.byteLength > 5000) {
          fs.writeFileSync(path.join(POSTERS_DIR, `${slug}.jpg`), Buffer.from(buf))
          console.log(`  ✅ Wiki fallback: ${slug}.jpg (${Math.round(buf.byteLength/1024)}KB)`)
          return true
        }
      }
    } catch(e) {}
  }
  
  console.log(`  ❌ Not found`)
  return false
}

async function main() {
  console.log('═══ GAMES via RAWG.io ═══')
  
  await fetchGameCover('EA Sports FC 25', 'ea-fc-25')
  await fetchGameCover('EA Sports FC 24', 'ea-fc-24')
  await fetchGameCover('NBA 2K25', 'nba-2k25')
  await fetchGameCover('FIFA 23', 'fifa-23')
  await fetchGameCover('Grand Theft Auto V', 'gta-v')
  await fetchGameCover('Grand Theft Auto VI', 'gta-vi')
  await fetchGameCover('Fortnite', 'fortnite')
  await fetchGameCover('Madden NFL 25', 'madden-25')
  await fetchGameCover('Need for Speed Unbound', 'nfs-unbound')
  await fetchGameCover('Spider-Man 2 PS5', 'spiderman-2-ps5')
  await fetchGameCover('Hogwarts Legacy', 'hogwarts-legacy')
  
  console.log('\n\n═══ VERIFICATION ═══')
  const files = fs.readdirSync(POSTERS_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  console.log(`Total posters: ${files.length}`)
}

main().catch(console.error)
