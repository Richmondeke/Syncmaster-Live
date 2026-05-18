# Task Plan: SyncMaster EPKs Implementation

## Goal
Implement a robust, production-grade Electronic Press Kit (EPK) management system in SyncMaster, using real Supabase tables, custom dynamic slug-based public URLs, full Server Actions CRUD, beautiful frontend design (Tailwind CSS v4 & glassmorphic design), and a simulated mock endpoint database interceptor.

## Current Phase
Phase 6: E2E Verification & Smoke Testing (Complete)

## Phases

### Phase 1: Discovery & Verification
- [x] Verify existing database schema and migrations
- [x] Analyze mock REST server (`app/api/supabase/[[...path]]/route.ts`)
- [x] Analyze brief server actions and routing structure
- [x] Create project planning files (`task_plan.md`, `findings.md`, `progress.md`)
- **Status:** complete

### Phase 2: Schema Migration & Database Mocking
- [x] Create `supabase/migrations/009_epks.sql` with unique index, foreign key, and RLS policies
- [x] Create frontend TypeScript definitions `types/epk.types.ts`
- [x] Add `epks` table to the local `mockDb` object in `app/api/supabase/[[...path]]/route.ts`
- [x] Add simulated API endpoint logic in `route.ts` for GET, POST, PATCH, and DELETE operations
- **Status:** complete

### Phase 3: Server Actions Implementation
- [x] Implement `app/actions/epks.ts` Server Actions:
  - `getEPKs()` (returns current user's EPKs)
  - `getEPKBySlug(slug)` (returns a public/accessible EPK)
  - `createEPK(data)` (creates an EPK, validating slug uniqueness)
  - `updateEPK(id, data)` (updates an EPK, validating slug uniqueness if slug changed)
  - `deleteEPK(id)` (deletes an EPK owned by the user)
- **Status:** complete

### Phase 4: Dynamic Public EPK Page
- [x] Create catch-all route `app/[slug]/page.tsx` for shareable URLs
- [x] Design an extremely aesthetic, high-craft, acid-lime/sleek-dark public presentation page
- [x] Implement responsive layout, glassmorphic player card, track lists, and social linkages
- [x] Handle 404 cleanly when EPK doesn't exist or is not published
- **Status:** complete

### Phase 5: Dashboard EPK UI (Create, Edit, Delete)
- [x] Revamp `app/(dashboard)/dashboard/epks/page.tsx` to use real data/actions
- [x] Add modern CRUD forms/modals (for Creating & Editing EPKs)
- [x] Incorporate acid-lime v4 aesthetics, toast indicators, and smooth state updates
- **Status:** complete

### Phase 6: E2E Verification & Smoke Testing
- [x] Verify local database mocking and CRUD flow with a script/smoke test
- [x] Check console and browser for zero runtime warnings/errors
- [x] Confirm everything is pixel-perfect and responsive
- **Status:** complete

## Key Questions
1. **What fields does an EPK require?**
   `id` (uuid), `user_id` (uuid), `title` (text), `slug` (text, unique index), `type` (text: 'Album Release' | 'EP Page' | 'Artist Profile'), `status` (text: 'draft' | 'published'), `views` (integer, default 0), `image_url` (text, optional), `bio` (text, optional), `tracks` (jsonb array, default '[]'), `social_links` (jsonb, default '{}'), `created_at` (timestamptz), `updated_at` (timestamptz).
2. **How is auth checked in Server Actions?**
   By checking user session email or ID cookies via the database client setup.

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Create `types/epk.types.ts` | Respect "Never hand-edit `types/database.types.ts`" and keep types clean |
| Dynamic catch-all `app/[slug]/page.tsx` | Allows clean vanity URLs like `syncmaster.live/slug` |
| Slug validation inside Server Actions | Prevent DB conflict errors by performing a safe pre-check on slug existence |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| None  | 1       | N/A        |
