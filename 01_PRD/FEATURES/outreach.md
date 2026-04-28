# Feature: Outreach (Composer Invitations)

**Status:** Complete (Phase B)
**Roles affected:** Admin (invite), Composer (accept/decline)

## What it does
- Admin selects active composers and invites them to a brief
- Composer receives invitation and can accept or decline
- Accepted invitation enables the composer to submit tracks
- Admin sees invite status per composer on the brief detail view

## States
`invited → accepted | declined`

## Key files
- `app/(dashboard)/briefs/[id]/page.tsx` (admin outreach UI)
- `app/(dashboard)/outreach/page.tsx` (composer inbox)
- `app/actions/outreach.ts`

## Constraints
- Only composers with `status = approved` can be invited
- Only admin can send invitations
- Composer can only submit tracks after accepting
