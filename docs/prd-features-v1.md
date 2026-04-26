# SyncMaster — V1.0 Feature Checklist (Current Build)

## Auth & Onboarding
- [x] Composer signup with role selection
- [x] Producer signup (immediate access)
- [x] Admin role (SQL-set, no self-registration)
- [x] Application received email (Resend)
- [x] Composer pending/rejected state on dashboard

## Admin Tools
- [x] Composer vetting: approve / reject
- [x] Brief management: review, activate, status transitions
- [ ] Outreach: invite specific composers to a brief
- [ ] Placement logging: fee + commission entry

## Producer Flow
- [x] Create and manage briefs
- [ ] View curated shortlist when ready
- [ ] Select preferred track

## Composer Flow
- [ ] View invited briefs (outreach-only — not open browse)
- [ ] Submit up to 3 tracks + creative note per brief
- [ ] View own submission statuses

## Shared
- [ ] Placements view (all roles)
- [ ] Settings: update name, bio, portfolio URL

## Out of Scope — V1.0
```
✗ In-app messaging
✗ Automated payments or escrow
✗ E-signature
✗ Algorithmic or AI-assisted matching (admin matches manually in V1.0 — AI suggestions are Phase D)
✗ File upload for tracks (track URLs only)
✗ Open composer browse by producers
✗ Global music supervisor role (uses producer login)
✗ Split sheet file uploads
✗ Stem access
```

## Schema ↔ Feature Mapping
| Feature | DB Table | Status Field |
|---------|----------|-------------|
| Composer application | `composers` | `pending\|active\|rejected` |
| Producer brief | `briefs` | `draft\|active\|matched\|closed` |
| Composer submission | `submissions` | `pending\|shortlisted\|accepted\|rejected` |
| Admin outreach invite | `outreach` | `invited\|accepted\|declined` |
| Deal closure | `placements` | `pending\|confirmed\|paid` |
| Internal admin task | `tasks` | `open\|in_progress\|done` |
