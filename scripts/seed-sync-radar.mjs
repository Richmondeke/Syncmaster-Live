#!/usr/bin/env node

/**
 * seed-sync-radar.mjs
 * 
 * Reads lib/data/sync-placements.ts, parses the static media + placements
 * arrays, and generates a SQL seed file at supabase/seed-sync-radar.sql.
 *
 * Usage:
 *   node scripts/seed-sync-radar.mjs
 *
 * The generated file can be run against Supabase:
 *   psql $DATABASE_URL -f supabase/seed-sync-radar.sql
 *   -- or via the Supabase dashboard SQL editor
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DATA_FILE = join(ROOT, 'lib/data/sync-placements.ts')
const OUTPUT_FILE = join(ROOT, 'supabase/seed-sync-radar.sql')

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Escape single quotes for SQL string literals */
const esc = (str) => {
  if (str === null || str === undefined) return 'NULL'
  return `'${String(str).replace(/'/g, "''")}'`
}

/** Convert a JS string[] to a Postgres TEXT[] literal */
const pgArray = (arr) => {
  if (!arr || arr.length === 0) return "'{}'::TEXT[]"
  const items = arr.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(',')
  return `'{${items}}'::TEXT[]`
}

/** Parse a boolean for SQL */
const pgBool = (val) => (val ? 'true' : 'false')

/** Parse an int or null */
const pgInt = (val) => (val === null || val === undefined ? 'NULL' : String(val))

// ─── Parse TS file ──────────────────────────────────────────────────────────

const tsSource = readFileSync(DATA_FILE, 'utf-8')

/**
 * Extract an array assignment from the TS source.
 * We find the opening `export const NAME: TYPE[] = [` and match brackets.
 */
function extractArray(source, varName) {
  // Find the start of the array
  const re = new RegExp(`export\\s+const\\s+${varName}\\s*[:][^=]*=\\s*\\[`)
  const match = re.exec(source)
  if (!match) throw new Error(`Could not find ${varName} in source`)

  const startIdx = match.index + match[0].length - 1 // at the '['
  let depth = 0
  let i = startIdx
  for (; i < source.length; i++) {
    if (source[i] === '[') depth++
    else if (source[i] === ']') {
      depth--
      if (depth === 0) break
    }
  }
  const arrayStr = source.slice(startIdx, i + 1)
  return arrayStr
}

/**
 * Evaluate an extracted TS array by stripping types, handling template
 * literals for poster URLs (replace with null for seed), and running
 * through a safe parser.
 */
function parseArrayEntries(rawArrayStr) {
  // Remove trailing commas before ] or }
  let cleaned = rawArrayStr
    // Remove line comments
    .replace(/\/\/[^\n]*/g, '')
    // Replace TS-style type annotations in values like `as const`
    .replace(/\bas\b\s+\w+/g, '')

  // Replace poster('...') calls with NULL — posters are served from /public
  cleaned = cleaned.replace(/poster\([^)]*\)/g, 'null')

  // The entries use `null` which is valid JS, booleans too.
  // We can eval this as a JS array (safe: we control the source).
  // eslint-disable-next-line no-eval
  const entries = eval(`(${cleaned})`)
  return entries
}

// ─── Extract + parse data ───────────────────────────────────────────────────

console.log('📖 Reading data from', DATA_FILE)

const mediaRaw = extractArray(tsSource, 'syncMedia')
const placementsRaw = extractArray(tsSource, 'syncPlacements')

const mediaEntries = parseArrayEntries(mediaRaw)
const placementEntries = parseArrayEntries(placementsRaw)

console.log(`   Found ${mediaEntries.length} media entries`)
console.log(`   Found ${placementEntries.length} placement entries`)

// ─── Generate SQL ───────────────────────────────────────────────────────────

const lines = []

lines.push('-- ═══════════════════════════════════════════════════════════════════════════')
lines.push('-- Sync Radar Seed Data')
lines.push(`-- Generated: ${new Date().toISOString()}`)
lines.push(`-- Media: ${mediaEntries.length} entries | Placements: ${placementEntries.length} entries`)
lines.push('-- ═══════════════════════════════════════════════════════════════════════════')
lines.push('')
lines.push('BEGIN;')
lines.push('')

// ── Media INSERT ────────────────────────────────────────────────────────────

lines.push('-- ─── Media ──────────────────────────────────────────────────────────────')
lines.push('INSERT INTO sync_media (id, title, type, year, poster_url, description, genres, total_songs, verified)')
lines.push('VALUES')

const mediaValues = mediaEntries.map((m) => {
  return `  (${esc(m.id)}, ${esc(m.title)}, ${esc(m.type)}, ${pgInt(m.year)}, ${esc(m.posterUrl)}, ${esc(m.description)}, ${pgArray(m.genre)}, ${pgInt(m.totalSongs)}, true)`
})

lines.push(mediaValues.join(',\n'))
lines.push('ON CONFLICT (id) DO UPDATE SET')
lines.push('  title = EXCLUDED.title,')
lines.push('  type = EXCLUDED.type,')
lines.push('  year = EXCLUDED.year,')
lines.push('  poster_url = EXCLUDED.poster_url,')
lines.push('  description = EXCLUDED.description,')
lines.push('  genres = EXCLUDED.genres,')
lines.push('  total_songs = EXCLUDED.total_songs,')
lines.push('  updated_at = NOW();')
lines.push('')

// ── Placements INSERT ───────────────────────────────────────────────────────

lines.push('-- ─── Placements ─────────────────────────────────────────────────────────')
lines.push('INSERT INTO sync_placements (id, media_id, artist_name, song_title, is_african_artist, artist_country, genre, scene_description, season, episode, spotify_url, placement_type, verified)')
lines.push('VALUES')

const placementValues = placementEntries.map((p) => {
  return `  (${esc(p.id)}, ${esc(p.mediaId)}, ${esc(p.artistName)}, ${esc(p.songTitle)}, ${pgBool(p.isAfricanArtist)}, ${esc(p.artistCountry)}, ${esc(p.genre)}, ${esc(p.sceneDescription)}, ${pgInt(p.season)}, ${pgInt(p.episode)}, ${esc(p.spotifyUrl)}, 'featured', true)`
})

lines.push(placementValues.join(',\n'))
lines.push('ON CONFLICT (id) DO UPDATE SET')
lines.push('  media_id = EXCLUDED.media_id,')
lines.push('  artist_name = EXCLUDED.artist_name,')
lines.push('  song_title = EXCLUDED.song_title,')
lines.push('  is_african_artist = EXCLUDED.is_african_artist,')
lines.push('  artist_country = EXCLUDED.artist_country,')
lines.push('  genre = EXCLUDED.genre,')
lines.push('  scene_description = EXCLUDED.scene_description,')
lines.push('  season = EXCLUDED.season,')
lines.push('  episode = EXCLUDED.episode,')
lines.push('  spotify_url = EXCLUDED.spotify_url;')
lines.push('')
lines.push('COMMIT;')
lines.push('')
lines.push(`-- Total: ${mediaEntries.length} media + ${placementEntries.length} placements`)

const sql = lines.join('\n')

writeFileSync(OUTPUT_FILE, sql, 'utf-8')
console.log(`\n✅ Seed file written to ${OUTPUT_FILE}`)
console.log(`   ${mediaEntries.length} media + ${placementEntries.length} placements`)
console.log(`   File size: ${(Buffer.byteLength(sql) / 1024).toFixed(1)} KB`)
