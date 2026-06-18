/**
 * Fetch posters for 2024-2026 content + World Cup
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTERS_DIR = path.join(__dirname, '..', 'public', 'posters')
const API_KEY = '264d33f3d638a3ffb0452f2fd8c0c33b'
const BASE = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

fs.mkdirSync(POSTERS_DIR, { recursive: true })

async function searchAndDownload(type, title, slug, year) {
  const endpoint = type === 'movie' ? 'search/movie' : 'search/tv'
  const yearParam = year ? (type === 'movie' ? `&year=${year}` : `&first_air_date_year=${year}`) : ''
  const url = `${BASE}/${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(title)}${yearParam}`
  
  const res = await fetch(url)
  const data = await res.json()
  const item = data.results?.[0]
  
  if (!item || !item.poster_path) {
    console.log(`❌ ${title} (${year}) — not found`)
    return false
  }
  
  const imgUrl = `${IMG_BASE}${item.poster_path}`
  const filepath = path.join(POSTERS_DIR, `${slug}.jpg`)
  
  const imgRes = await fetch(imgUrl)
  if (!imgRes.ok) { console.log(`❌ ${title} — download failed`); return false }
  
  const buf = await imgRes.arrayBuffer()
  fs.writeFileSync(filepath, Buffer.from(buf))
  console.log(`✅ ${item.title || item.name} → ${slug}.jpg (${Math.round(buf.byteLength/1024)}KB)`)
  return true
}

async function main() {
  console.log('═══ 2024-2026 FILMS ═══\n')
  await searchAndDownload('movie', 'Sinners', 'sinners', 2025)
  await searchAndDownload('movie', 'Wicked', 'wicked', 2024)
  await searchAndDownload('movie', 'Moana 2', 'moana-2', 2024)
  await searchAndDownload('movie', 'Gladiator II', 'gladiator-ii', 2024)
  await searchAndDownload('movie', 'One of Them Days', 'one-of-them-days', 2025)
  await searchAndDownload('movie', 'A Minecraft Movie', 'minecraft-movie', 2025)
  await searchAndDownload('movie', 'The Color Purple', 'the-color-purple', 2023)
  await searchAndDownload('movie', 'Bob Marley One Love', 'bob-marley-one-love', 2024)
  await searchAndDownload('movie', 'Emilia Perez', 'emilia-perez', 2024)
  await searchAndDownload('movie', 'Conclave', 'conclave', 2024)
  await searchAndDownload('movie', 'Anora', 'anora', 2024)
  
  console.log('\n═══ 2024-2026 TV ═══\n')
  await searchAndDownload('tv', 'Squid Game', 'squid-game', 2021)
  await searchAndDownload('tv', 'The Bear', 'the-bear', 2022)
  await searchAndDownload('tv', 'Shōgun', 'shogun', 2024)
  await searchAndDownload('tv', 'Young Famous and African', 'young-famous-african', 2022)
  await searchAndDownload('tv', 'Yellowjackets', 'yellowjackets', 2021)
  await searchAndDownload('tv', 'Griselda', 'griselda', 2024)
  await searchAndDownload('tv', 'The Gentlemen', 'the-gentlemen', 2024)

  console.log('\n═══ VERIFICATION ═══\n')
  const files = fs.readdirSync(POSTERS_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  console.log(`Total posters: ${files.length}`)
}

main().catch(console.error)
