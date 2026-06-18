-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration: Sync Radar — Searchable Music Placement Library
-- Created: 2026-06-18
-- Description: Tables for media, placements, and community submissions
--              with full-text trigram search, RLS, and proper indexing.
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable trigram extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Media table (movies, shows, games, ads, events, documentaries)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_media (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('film', 'tv', 'game', 'ad', 'event', 'documentary')),
  year INT NOT NULL,
  poster_url TEXT,
  description TEXT,
  genres TEXT[] DEFAULT '{}',
  total_songs INT DEFAULT 0,
  tmdb_id INT,
  imdb_id TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Placements table (songs placed in media)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_placements (
  id TEXT PRIMARY KEY,
  media_id TEXT NOT NULL REFERENCES sync_media(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  song_title TEXT NOT NULL,
  is_african_artist BOOLEAN DEFAULT false,
  artist_country TEXT,
  genre TEXT,
  scene_description TEXT,
  season INT,
  episode INT,
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,
  placement_type TEXT DEFAULT 'featured' CHECK (placement_type IN ('featured', 'background', 'credits', 'trailer', 'score')),
  verified BOOLEAN DEFAULT true,
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Community submissions (pending review)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_title TEXT NOT NULL,
  media_type TEXT NOT NULL,
  media_year INT,
  artist_name TEXT NOT NULL,
  song_title TEXT NOT NULL,
  is_african_artist BOOLEAN DEFAULT false,
  artist_country TEXT,
  genre TEXT,
  scene_description TEXT,
  season INT,
  episode INT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Indexes for search performance
-- ─────────────────────────────────────────────────────────────────────────────

-- Trigram indexes for fuzzy text search (LIKE '%query%', similarity)
CREATE INDEX IF NOT EXISTS idx_media_title_trgm ON sync_media USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_placements_artist_trgm ON sync_placements USING gin(artist_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_placements_song_trgm ON sync_placements USING gin(song_title gin_trgm_ops);

-- B-tree indexes for exact filters
CREATE INDEX IF NOT EXISTS idx_media_type ON sync_media(type);
CREATE INDEX IF NOT EXISTS idx_media_year ON sync_media(year);
CREATE INDEX IF NOT EXISTS idx_placements_media ON sync_placements(media_id);
CREATE INDEX IF NOT EXISTS idx_placements_country ON sync_placements(artist_country);

-- Partial index for African artists (optimizes filtered queries)
CREATE INDEX IF NOT EXISTS idx_placements_african ON sync_placements(is_african_artist) WHERE is_african_artist = true;

-- Submission status index for admin review queue
CREATE INDEX IF NOT EXISTS idx_submissions_status ON sync_submissions(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE sync_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for media and placements (they're a public catalogue)
CREATE POLICY "sync_media_read" ON sync_media FOR SELECT USING (true);
CREATE POLICY "sync_placements_read" ON sync_placements FOR SELECT USING (true);

-- Authenticated users can submit new placements for review
CREATE POLICY "sync_submissions_insert" ON sync_submissions
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- Users can only read their own submissions
CREATE POLICY "sync_submissions_read_own" ON sync_submissions
  FOR SELECT USING (auth.uid() = submitted_by);
