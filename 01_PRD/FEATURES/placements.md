# Feature: Placement Logging

**Status:** Complete (Phase B)
**Roles affected:** Admin (log), All (view own)

## What it does
- Admin logs a placement against a submitted track: sync fee + commission rate
- Brief moves to `placed` status on placement
- All roles see relevant placements in their Placements view

## Key files
- `app/(dashboard)/placements/page.tsx`
- `app/actions/placements.ts`

## Data captured
- `sync_fee` — total placement fee
- `commission_rate` — SyncMaster % cut
- `placed_at` — timestamp
- Links to: brief, submission, composer, producer
