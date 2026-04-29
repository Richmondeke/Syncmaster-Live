#!/usr/bin/env node
/**
 * Seed 3 dummy active composers for AI recommendation testing.
 * Usage: node scripts/seed-composers.mjs
 *
 * Safe to re-run — skips users that already exist by email.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// Load .env.local manually
const envPath = resolve(ROOT, '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    }),
)

const supabase = createClient(
  env['NEXT_PUBLIC_SUPABASE_URL'],
  env['SUPABASE_SERVICE_ROLE_KEY'],
)

const DUMMY_COMPOSERS = [
  {
    email: 'ade.mensah.test@syncmaster.dev',
    password: 'TestPass123!',
    full_name: 'Ade Mensah',
    bio: 'Lagos-based composer with 8 years crafting Afrobeats and Highlife for film and advertising. Known for infectious rhythmic hooks and lush brass arrangements.',
    genres: ['Afrobeats', 'Highlife', 'Afropop'],
    ai_tags: ['rhythmic', 'upbeat', 'brass', 'West African', 'advertising', 'cinematic'],
    portfolio_url: 'https://soundcloud.com/ade-mensah-test',
  },
  {
    email: 'priya.nair.test@syncmaster.dev',
    password: 'TestPass123!',
    full_name: 'Priya Nair',
    bio: 'London-based composer specialising in Neo Soul, R&B, and Jazz-influenced scores. Vocal-forward production with rich harmonic depth. Credits in TV drama and luxury brand campaigns.',
    genres: ['Neo Soul', 'R&B', 'Jazz'],
    ai_tags: ['soulful', 'vocal', 'harmonic', 'cinematic', 'emotional', 'TV', 'luxury'],
    portfolio_url: 'https://soundcloud.com/priya-nair-test',
  },
  {
    email: 'marco.bellini.test@syncmaster.dev',
    password: 'TestPass123!',
    full_name: 'Marco Bellini',
    bio: 'Milan-born composer working at the intersection of Orchestral and Electronic. Trained at Berklee, now scoring for international film and game studios. Specialises in epic, tension-driven soundscapes.',
    genres: ['Cinematic', 'Orchestral', 'Electronic'],
    ai_tags: ['epic', 'tension', 'orchestral', 'hybrid', 'film', 'game', 'dramatic'],
    portfolio_url: 'https://soundcloud.com/marco-bellini-test',
  },
]

async function run() {
  console.log('Seeding dummy composers…\n')

  for (const composer of DUMMY_COMPOSERS) {
    const { email, password, full_name, bio, genres, ai_tags, portfolio_url } = composer

    // Check if user already exists
    const { data: existing } = await supabase.auth.admin.listUsers()
    const alreadyExists = existing?.users?.find((u) => u.email === email)

    let userId

    if (alreadyExists) {
      console.log(`⏭  ${full_name} (${email}) — already exists, updating composer row`)
      userId = alreadyExists.id
    } else {
      // Create auth user — trigger auto-creates profile row
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name, role: 'composer' },
      })

      if (createErr) {
        console.error(`✗  Failed to create ${full_name}:`, createErr.message)
        continue
      }

      userId = created.user.id
      console.log(`✓  Created auth user: ${full_name} (${userId})`)
    }

    // Upsert composer row
    const { error: composerErr } = await supabase
      .from('composers')
      .upsert(
        {
          profile_id: userId,
          bio,
          genres,
          ai_tags,
          portfolio_url,
          status: 'active',
        },
        { onConflict: 'profile_id' },
      )

    if (composerErr) {
      console.error(`✗  Failed to upsert composer row for ${full_name}:`, composerErr.message)
    } else {
      console.log(`✓  Composer row active: ${full_name}`)
    }
  }

  console.log('\nDone. You can now activate a brief to test AI matching.')
}

run().catch(console.error)
