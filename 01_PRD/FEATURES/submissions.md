# Feature: Track Submissions

**Status:** Complete (Phase B)
**Roles affected:** Composer (submit), Admin (review)

## What it does
- Composer uploads up to 3 tracks per brief
- Track stored in Supabase Storage
- Admin can view all submissions per brief

## Constraints
- Max 3 tracks per composer per brief
- Submission only allowed if composer has accepted outreach invitation
- Brief must be in `active` status

## Key files
- `app/(dashboard)/submissions/page.tsx`
- `app/(dashboard)/briefs/[id]/page.tsx` (composer submit UI)
- `app/actions/submissions.ts`
