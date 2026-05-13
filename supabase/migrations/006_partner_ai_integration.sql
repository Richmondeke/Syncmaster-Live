-- Migration 006: Add missing AI fields from partner integration
-- These fields enable autonomous brief matching and AI preferences

-- profiles: Add AI preferences for composers/producers
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_preferences JSONB DEFAULT '{}'::jsonb;

-- briefs: Add AI criteria for matching
ALTER TABLE public.briefs
  ADD COLUMN IF NOT EXISTS ai_match_criteria JSONB DEFAULT '{}'::jsonb;

-- submissions: Add mood and analysis (integrating track-level AI data here)
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS ai_mood        TEXT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ai_analysis    JSONB         DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_description TEXT          DEFAULT NULL;

-- Ensure RLS allows reading these fields (usually covered by existing policies, but good to check)
COMMENT ON COLUMN public.profiles.ai_preferences IS 'Stores AI matching preferences and settings for the user.';
COMMENT ON COLUMN public.briefs.ai_match_criteria IS 'Detailed AI-specific requirements for the brief matching process.';
COMMENT ON COLUMN public.submissions.ai_mood IS 'AI-detected mood of the track in this submission.';
