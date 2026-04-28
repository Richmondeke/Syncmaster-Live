# Claude Session Memory

## Critical patterns (never break these)

1. After adding a DB column, update ALL explicit `select()` strings in server actions — or the Vercel TS build will fail
2. Always verify role server-side in every server action (`profile.role !== 'admin'`) — never trust client
3. Use `createClient` from `@/lib/supabase/server` in server actions, `@/lib/supabase/client` in client components — never mix
4. Forms use `useActionState` + server actions — react-hook-form is not installed
5. Mutations → Server Actions only. No API routes for data.
6. AI calls → only through `agents/` → `services/ai.ts`. Never inline SDK calls.

## Test accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | (see project_test_accounts.md in Claude memory) | — |
| Producer | (see project_test_accounts.md in Claude memory) | — |
| Composer | masiyerdakol@gmail.com | — |

## Current build state
- Phase A: Foundation ✓
- Phase B: Core product loop ✓
- Phase C: Schema extension ✓
- Phase D: AI layer — NEXT
- Phase E: Production polish — pending
