@AGENTS.md

# SyncMaster — Claude Code Context

## Project
Sync licensing platform. Three roles: **admin**, **producer**, **composer**.
Current phase: **Phase D — AI Layer** (A, B, C complete).

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 App Router |
| Language | TypeScript strict — no `any`, ever |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth SSR (cookie-based) |
| Storage | Supabase Storage |
| Email | Resend + React Email (`emails/`) |
| AI | `@anthropic-ai/sdk` via `services/ai.ts` only |
| Deployment | Vercel + Vercel Cron |

---

## Architecture Rules

**Mutations → Server Actions only. Never API routes.**
```ts
// app/actions/[entity].ts
'use server'
import { createClient } from '@/lib/supabase/server'
```

**API routes → webhooks and cron only** (`app/api/webhooks/`, `app/api/cron/`)

**Supabase clients — never mix:**
- Server components / actions / route handlers: `@/lib/supabase/server`
- Client components only: `@/lib/supabase/client`

**Data fetching → Server Components by default.** Fetch, pass as props to client.

**Types → always from generated schema:**
```ts
import type { Database } from '@/types/database.types'
type Brief = Database['public']['Tables']['briefs']['Row']
```

**AI calls → agents/ → services/ai.ts only. Never inline SDK.**
```ts
// server action calls agent:
import { matchComposers } from '@/agents/composer-matcher'
// agent calls SDK via:
import { ai } from '@/services/ai'
```

**Forms → `useActionState` + Server Actions. `react-hook-form` is not installed.**

**Security → verify role server-side in every admin action:**
```ts
const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
if (profile?.role !== 'admin') throw new Error('Forbidden')
```

---

## Key File Paths

```
app/actions/          ← all mutations (one file per entity)
app/(auth)/           ← login, signup
app/(dashboard)/      ← all role-gated pages (layout.tsx = auth guard)
agents/               ← AI agents, one file per domain
services/ai.ts        ← single Anthropic SDK client
core/workflows/       ← brief-workflow.ts, submission-workflow.ts
components/ui/        ← shadcn — READ ONLY, never edit
lib/supabase/server.ts / client.ts
types/database.types.ts  ← generated, never hand-edit
emails/               ← React Email templates
middleware.ts          ← auth guard (edge middleware)
docs/01_PRD/          ← all PRD docs, load only what the session needs
docs/00_SYSTEM/       ← guardrails, tooling reference
docs/01_PRD/FEATURES/ ← per-feature specs
docs/build/           ← build notes (FRONTEND / BACKEND / COMPONENTS)
docs/06_ITERATION/    ← bugs, changelog, improvements
docs/08_CONTEXT/PROMPTS.md ← session prompt templates
```

---

## Conventions

| Thing | Convention |
|-------|------------|
| Component files | `PascalCase.tsx` |
| All other files | `kebab-case.ts` |
| DB columns | `snake_case` |
| Public env vars | `NEXT_PUBLIC_SCREAMING_SNAKE` |
| Error handling | Surface to UI — no silent catches |
| Loading states | Every async action needs a loading indicator |
| Empty states | Every list needs an empty state |
| Mobile | 375px first, 1280px second |

**UI patterns:**
- Card: `rounded-lg border bg-card text-card-foreground shadow-sm p-6`
- Page: `<div className="flex flex-col gap-6">` with h1 + muted description
- Loading button: spinner span inside `<Button disabled={pending}>`
- Empty state: `rounded-lg border border-dashed p-12 text-center`
- Error: `<Alert variant="destructive">` with `<AlertCircle>`

---

## Hard Rules

```
✗ Never edit /components/ui/
✗ Never use `any`
✗ Never import @anthropic-ai/sdk outside services/ai.ts
✗ Never call agents/ from components or pages — server actions only
✗ Never create API routes for mutations or data fetching
✗ Never use localStorage for auth state
✗ Never skip role verification in server actions
✗ Never add npm packages without noting them in session context
✗ Never truncate code output — always write complete files
✗ Never write inline SQL — use Supabase client methods
✗ Never introduce LangGraph for simple scoring/ranking
✗ After adding a DB column — update ALL explicit select() strings or Vercel build breaks
```

---

## Build Phases

```
A — Foundation        ✓  Auth, RLS, dashboard shell, composer vetting
B — Core Loop         ✓  Briefs, outreach, submissions, placements
C — Schema Extension  ✓  ai_score, ai_tags, ai_match_reason, ai_suggested_composers
D — AI Layer          ←  services/ai.ts, brief-analyzer, composer-matcher, admin UI
E — Production        →  Emails, toasts, skeletons, mobile audit, Vercel deploy
```

---

## PRD Reference (load only what the session needs)

| Task | Doc |
|------|-----|
| AI layer, agents, production polish | `docs/01_PRD/FEATURES/ai-layer.md` |
| Briefs, outreach, submissions | `docs/01_PRD/FEATURES/briefs.md` + `docs/01_PRD/STATES-AND-FLOWS.md` |
| State machines + user flows | `docs/01_PRD/STATES-AND-FLOWS.md` |
| Vision, personas, out-of-scope | `docs/01_PRD/OVERVIEW.md` |
| Post-V1.5 roadmap | `docs/01_PRD/ROADMAP.md` |

Session prompt templates → `docs/08_CONTEXT/PROMPTS.md`
