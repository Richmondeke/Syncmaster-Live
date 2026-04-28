# Bug Tracker

## Format
| ID | Title | Priority | Status | File | Notes |
|----|-------|----------|--------|------|-------|

---

## Open

| ID | Title | Priority | Status | File | Notes |
|----|-------|----------|--------|------|-------|
| — | — | — | — | — | No open bugs |

---

## Resolved

| ID | Title | Priority | Status | File | Notes |
|----|-------|----------|--------|------|-------|
| B-001 | RLS policies blocking legitimate reads | Critical | Fixed | supabase/migrations/ | Was missing authenticated role grants |
| B-002 | Sidebar not rendering for composer role | High | Fixed | components/layout/Sidebar.tsx | Role check was case-sensitive |
| B-003 | Playwright auth failing on CI | High | Fixed | tests/ | Session cookie not persisted between steps |
| B-004 | Vercel TS build error on ai_suggested_composers | High | Fixed | app/actions/briefs.ts | Missing column in explicit select() string |
