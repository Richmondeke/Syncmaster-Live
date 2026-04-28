-- Migration 004: Add AI metadata columns (non-breaking, all nullable)

-- composers: overall AI quality score and genre/mood tags
ALTER TABLE composers
  ADD COLUMN IF NOT EXISTS ai_score   NUMERIC(4, 2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ai_tags    TEXT[]        DEFAULT NULL;

-- submissions: per-brief AI match score and human-readable reason
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS ai_match_score  NUMERIC(4, 2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ai_match_reason TEXT          DEFAULT NULL;

-- briefs: ordered list of AI-suggested composer IDs (admin confirms each invite)
ALTER TABLE briefs
  ADD COLUMN IF NOT EXISTS ai_suggested_composers UUID[] DEFAULT NULL;
