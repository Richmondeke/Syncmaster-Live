# Feature: Track Submissions

**Status:** Complete (Phase B)
**Roles affected:** Composer (submit), Admin (review)

## What it does
- Composer submits up to 3 track URLs + creative note per brief
- Track URLs only — no file upload in V1 (Supabase Storage not used for tracks)
- Admin can view all submissions per brief

## Constraints
- Max 3 tracks per composer per brief
- Submission only allowed if composer has accepted outreach invitation
- Brief must be in `active` status

## Key files
- `app/(dashboard)/submissions/page.tsx`
- `app/(dashboard)/briefs/[id]/page.tsx` (composer submit UI)
- `app/actions/submissions.ts`
