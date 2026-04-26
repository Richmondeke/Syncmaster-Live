# SyncMaster — V1.5 Feature Checklist (AI Layer + Production Polish)

## Schema Extension (non-breaking migration)
- [ ] `ai_score NUMERIC(4,2)`, `ai_tags TEXT[]` on `composers`
- [ ] `ai_match_score NUMERIC(4,2)`, `ai_match_reason TEXT` on `submissions`
- [ ] `ai_suggested_composers UUID[]` on `briefs`
- [ ] Migration file: `supabase/migrations/002_ai_fields.sql`
- [ ] `types/database.types.ts` updated to include new fields

## AI Layer (admin-facing only)
- [ ] `services/ai.ts` — Anthropic SDK client singleton (model: claude-sonnet-4-6)
- [ ] `agents/brief-analyzer.ts` — runs on brief activation, tags genre/mood, returns scored composer list
- [ ] `agents/composer-matcher.ts` — ranks active composers against a brief with `ai_match_reason` per composer
- [ ] Admin brief detail view shows AI-ranked composer suggestions
- [ ] Admin clicks to confirm each invite — AI never auto-creates outreach records

## Workflow State Guards (core/workflows/)
- [ ] `brief-workflow.ts` — enforces valid transitions (e.g. cannot move to `matched` with zero submissions)
- [ ] `submission-workflow.ts` — enforces max 3 submissions per composer per brief

## Production Polish
- [ ] Email notifications on all state transitions (shortlisted, accepted, rejected, activated)
- [ ] Loading skeletons on all data pages
- [ ] Error boundaries on all routes
- [ ] Toast feedback on all mutations
- [ ] Mobile responsiveness audit (375px baseline)
- [ ] A&R feedback field surfaced on composer rejection
- [ ] Empty states on every list view

## Security Hardening
- [ ] Rate limiting on /login and /signup via proxy.ts middleware
- [ ] Input length validation on all form fields before DB write
- [ ] Webhook signature verification on all /api/webhooks/* routes
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is never exposed to browser bundle
- [ ] Admin role verified server-side on every admin server action (not just UI-gated)
