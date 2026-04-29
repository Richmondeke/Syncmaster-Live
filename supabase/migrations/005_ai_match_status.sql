-- Migration 005: Add AI matching status tracking and detailed suggestions

-- briefs: tracking AI match lifecycle
ALTER TABLE briefs
  ADD COLUMN IF NOT EXISTS ai_match_status TEXT DEFAULT 'pending'
    CHECK (ai_match_status IN ('pending', 'running', 'complete', 'failed', 'no_composers'));

-- briefs: ranked composer suggestions with scores and reasons
ALTER TABLE briefs
  ADD COLUMN IF NOT EXISTS ai_suggested_composers_detail JSONB DEFAULT '[]'::JSONB;

COMMENT ON COLUMN briefs.ai_match_status IS
  'Tracks AI matching lifecycle: pending → running → complete | failed | no_composers';

COMMENT ON COLUMN briefs.ai_suggested_composers_detail IS
  'Ranked composer suggestions: [{composer_id: UUID, match_score: 0-10, match_reason: string, confidence: 0-1}]';
