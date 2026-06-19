#!/usr/bin/env node
/**
 * Merge TMDB enrichment data back into sync-placements.ts
 * Adds: tmdbId, rating, musicCredits to each SyncMedia entry
 * Also updates posterUrl to use the freshly downloaded poster if available
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const ENRICHMENT_FILE = path.join(ROOT, 'scripts', 'tmdb-enrichment.json')
const PLACEMENTS_FILE = path.join(ROOT, 'lib', 'data', 'sync-placements.ts')

const enrichment = JSON.parse(fs.readFileSync(ENRICHMENT_FILE, 'utf8'))
const enrichMap = new Map(enrichment.map(e => [e.id, e]))

let content = fs.readFileSync(PLACEMENTS_FILE, 'utf8')

// ── 1. Update the SyncMedia type to include new fields ──────────────────────
const oldType = `export type SyncMedia = {
  id: string
  title: string
  type: 'film' | 'tv' | 'game' | 'ad' | 'documentary'
  year: number
  posterUrl: string
  description: string
  genre: string[]
  totalSongs: number
}`

const newType = `export type MusicCredit = {
  name: string
  job: string
  tmdbId: number
}

export type SyncMedia = {
  id: string
  title: string
  type: 'film' | 'tv' | 'game' | 'ad' | 'documentary'
  year: number
  posterUrl: string
  description: string
  genre: string[]
  totalSongs: number
  tmdbId?: number | null
  rating?: number | null
  musicCredits?: MusicCredit[]
}`

if (content.includes(oldType)) {
  content = content.replace(oldType, newType)
  console.log('✅ Updated SyncMedia type with tmdbId, rating, musicCredits')
} else {
  console.log('⚠️  SyncMedia type already modified or not found in expected format')
}

// ── 2. Add enrichment data after each media entry ───────────────────────────
// Find each media entry and add tmdbId, rating, musicCredits after totalSongs

let updated = 0
for (const [id, data] of enrichMap) {
  if (!data.tmdbId) continue
  
  // Find the totalSongs line for this entry
  const idPattern = `id: '${id}'`
  const idIdx = content.indexOf(idPattern)
  if (idIdx === -1) continue
  
  // Find the totalSongs line after this id
  const afterId = content.slice(idIdx)
  const totalSongsMatch = afterId.match(/totalSongs:\s*\d+,?\s*\n/)
  if (!totalSongsMatch) continue
  
  const totalSongsEnd = idIdx + totalSongsMatch.index + totalSongsMatch[0].length
  
  // Check if tmdbId already exists for this entry
  const nextEntry = content.indexOf("id: '", idIdx + 10)
  const entrySlice = content.slice(idIdx, nextEntry > 0 ? nextEntry : idIdx + 500)
  if (entrySlice.includes('tmdbId:')) continue
  
  // Build the new fields
  let newFields = ''
  newFields += `    tmdbId: ${data.tmdbId},\n`
  newFields += `    rating: ${data.rating},\n`
  
  if (data.musicCredits?.length) {
    const credits = data.musicCredits
      .filter(c => ['Music Supervisor', 'Original Music Composer', 'Composer', 'Music', 'Songs'].includes(c.job))
      .slice(0, 5)
    if (credits.length) {
      newFields += `    musicCredits: [\n`
      credits.forEach(c => {
        newFields += `      { name: '${c.name.replace(/'/g, "\\'")}', job: '${c.job}', tmdbId: ${c.tmdbId} },\n`
      })
      newFields += `    ],\n`
    }
  }
  
  // Insert after totalSongs line
  content = content.slice(0, totalSongsEnd) + newFields + content.slice(totalSongsEnd)
  updated++
}

console.log(`✅ Enriched ${updated} media entries with TMDB data`)

// ── 3. Update poster URLs for newly downloaded posters ──────────────────────
let postersUpdated = 0
for (const [id, data] of enrichMap) {
  if (!data.localPoster) continue
  
  const idPattern = `id: '${id}'`
  const idIdx = content.indexOf(idPattern)
  if (idIdx === -1) continue
  
  // Find posterUrl in this entry
  const afterId = content.slice(idIdx)
  const posterMatch = afterId.match(/posterUrl:\s*(?:poster\([^)]*\)|'[^']*'),?\s*\n/)
  if (!posterMatch) continue
  
  // Check if poster already points to our local file
  if (posterMatch[0].includes(data.localPoster)) continue
  
  const posterStart = idIdx + posterMatch.index
  const posterEnd = posterStart + posterMatch[0].length
  content = content.slice(0, posterStart) + `posterUrl: '${data.localPoster}',\n` + content.slice(posterEnd)
  postersUpdated++
}

console.log(`✅ Updated ${postersUpdated} poster URLs`)

fs.writeFileSync(PLACEMENTS_FILE, content)
console.log(`\n📁 Written to ${PLACEMENTS_FILE}`)
console.log(`   Total size: ${Math.round(content.length / 1024)}KB`)
