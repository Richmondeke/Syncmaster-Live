# Changelog

---

## Phase C — Schema Extension (2026-04-28)

### Added
- `ai_score`, `ai_tags`, `ai_match_reason`, `ai_suggested_composers` columns to `briefs` table
- Migration: `supabase/migrations/002_ai_fields.sql`
- Updated `types/database.types.ts`

### Fixed
- Vercel TS build error: `ai_suggested_composers` missing from explicit select() strings in `app/actions/briefs.ts`

---

## Phase B — Core Product Loop (Sessions 3–5)

### Added
- Brief creation form (producer + admin)
- Brief status state machine: `draft → active → closed → placed`
- `BriefStatusControl` component with confirmation modal for admin
- Revert-to-draft support and draft status transitions
- Outreach feature: admin invites composers to a brief, composers accept/decline
- Composer submission flow: up to 3 tracks per brief
- Placement logging: admin logs fee + commission
- Placements view (all roles)
- Settings page

### Fixed
- RLS policies blocking legitimate reads
- Sidebar not rendering for composer role
- Playwright auth failing on CI

---

## Phase A — Foundation (Sessions 1–2)

### Added
- Supabase project + schema + RLS
- Next.js 16 scaffold + Tailwind + shadcn/ui
- Auth flow: login, signup, signout, middleware guard
- Dashboard shell: layout, sidebar, header
- Admin composer vetting: approve / reject
- Role-gated dashboard (admin, producer, composer)
