@AGENTS.md

# SyncMaster - Claude Code Context

## Current Baseline

**Baseline date:** 2026-05-02  
**Status:** Phase E2 design-system integration complete and verified.  
**Current focus:** stabilization, documentation accuracy, manual QA, and clean commits. Do not start a broad AI/API migration.

Verified after Phase E2:

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
```

`npm.cmd run build` may need network access because `next/font` fetches Geist and Geist Mono from Google Fonts.

---

## Product

SyncMaster is a curated sync licensing platform for three roles: **admin**, **producer**, and **composer**.

The product wedge is the African composer to global brief corridor: human curation, rights clarity, and a small set of vetted matches instead of an open directory.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 App Router |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 + shadcn/ui + Phase E2 design tokens |
| Database | Supabase Postgres + RLS |
| Auth | Supabase Auth SSR, cookie-based |
| Storage | Supabase Storage |
| Email | Resend + React Email |
| AI | Anthropic Messages API through `services/ai.ts` only |
| Theme | `next-themes` — SSR-safe class-based dark/light toggle, FOUC prevention |
| Deployment | Vercel |

---

## Next.js 16 Rule

This project uses Next.js 16. Before writing framework-specific code, read the relevant local guide in:

```text
node_modules/next/dist/docs/
```

Auth/request boundary file is `proxy.ts`, not `middleware.ts`.

---

## Architecture Rules

**Mutations -> Server Actions only. Never API routes for app mutations.**

```ts
// app/actions/[entity].ts
'use server'
import { createClient } from '@/lib/supabase/server'
```

**API routes -> webhooks and cron only.**

Use API routes only under `app/api/webhooks/` and `app/api/cron/`.

**Supabase clients must not be mixed.**

| Context | Client |
|---------|--------|
| Server Components, Server Actions, Route Handlers | `@/lib/supabase/server` |
| Client Components only | `@/lib/supabase/client` |

**Data fetching -> Server Components by default.**

Fetch on the server, pass data into client components as props.

**Types -> generated schema only.**

```ts
import type { Database } from '@/types/database.types'
type Brief = Database['public']['Tables']['briefs']['Row']
```

**AI calls -> agents -> services/ai.ts only.**

```ts
// server action calls agent
import { matchComposers } from '@/agents/composer-matcher'

// agent calls service
import { ai } from '@/services/ai'
```

Do not import Anthropic SDKs or call Anthropic directly outside `services/ai.ts`. The active runtime is direct Anthropic API via `ANTHROPIC_API_KEY`. Bedrock is not the current path.

**Forms -> `useActionState` + Server Actions.**

`react-hook-form` is not installed.

**Security -> verify role server-side in every privileged action.**

```ts
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin') throw new Error('Forbidden')
```

---

## Key File Paths

```text
app/actions/                         all mutations, one file per entity
app/(auth)/                          login and signup
app/(dashboard)/                     role-gated dashboard pages
app/(dashboard)/layout.tsx           auth guard layout
agents/                              AI agents, one file per domain
services/ai.ts                       single Anthropic Messages API wrapper
core/workflows/                      brief and submission workflow helpers
components/ui/                       shadcn components; do not edit casually
components/dashboard/Sidebar.tsx     Phase E2 sidebar navigation pattern
components/dashboard/Header.tsx      Phase E2 breadcrumb pattern
components/briefs/BriefList.tsx      Phase E2 card/list pattern
components/Banner.tsx                Phase E2 accent-border banner
components/ScoreBar.tsx              Phase E2 score visualization
components/Waveform.tsx              Phase E2 waveform visualization
app/globals.css                      Tailwind v4 tokens and utilities
tailwind.config.ts                   radius scale and semantic token map
proxy.ts                             Next.js 16 auth/request proxy
lib/supabase/server.ts               server Supabase client
lib/supabase/client.ts               browser Supabase client
types/database.types.ts              generated; never hand-edit
emails/                              React Email templates
docs/00_SYSTEM/                      guardrails and tooling
docs/00_SYSTEM/BASELINE.md           current source-of-truth baseline
docs/01_PRD/                         product requirements
docs/build/                          build and design-system notes
docs/06_ITERATION/                   changelog, audits, phase notes
```

---

## Design-System Rules

Phase E2 design-system integration is the current UI baseline.

| Pattern | Current Rule |
|---------|--------------|
| Accent | Acid lime: `oklch(0.88 0.18 120)` via `--primary` |
| Radius | Base radius `--radius: 0.375rem`; config scale is 2/4/6/8/12/16px |
| Cards | Prefer subtle borders over heavy shadows |
| Active nav | Left primary border + `bg-sidebar-accent` + numeric label |
| Metadata labels | Use `.label` or `.label-strong` |
| Numeric/status values | Use `.mono` where useful |
| Alert/banner | Use `Banner` or `border-l-2 border-l-primary` pattern |
| Brief list hover | `hover:border-input hover:bg-card` |

Avoid reverting to the old default pattern of `rounded-lg border bg-card shadow-sm` for new design-system work unless the local component already requires it.

---

## Conventions

| Thing | Convention |
|-------|------------|
| Component files | `PascalCase.tsx` |
| Non-component files | `kebab-case.ts` |
| DB columns | `snake_case` |
| Public env vars | `NEXT_PUBLIC_SCREAMING_SNAKE` |
| Secrets | Server-only, never `NEXT_PUBLIC_` |
| Error handling | Surface to UI; no silent catches |
| Loading states | Every async action needs a visible pending state |
| Empty states | Every list needs an empty state |
| Responsive baseline | 375px mobile first, then 1280px desktop |

---

## Hard Rules

```text
Never edit components/ui/ unless explicitly requested.
Never use any.
Never call agents from client components.
Never call Anthropic outside services/ai.ts.
Never create API routes for app mutations or normal data fetching.
Never use localStorage for auth state.
Never skip role verification in server actions.
Never add npm packages without documenting why.
Never hand-edit types/database.types.ts.
Never write inline SQL in app code; use Supabase client methods.
Never introduce LangGraph for simple scoring/ranking.
After adding a DB column, update all explicit select() strings.
Before Next.js framework changes, read node_modules/next/dist/docs/.
```

---

## Build Phases

```text
A - Foundation                  complete
B - Core Loop                   complete
C - Schema Extension            complete
D - AI Layer                    implemented through Anthropic-direct service; no migration planned
E - Production Polish           historical complete phase
E2 - Design System Integration  complete and current baseline
```

Use `docs/00_SYSTEM/BASELINE.md` for the current baseline before starting new work.

---

## PRD Reference

| Task | Doc |
|------|-----|
| Vision, personas, out-of-scope | `docs/01_PRD/OVERVIEW.md` |
| Briefs, outreach, submissions | `docs/01_PRD/FEATURES/briefs.md` + `docs/01_PRD/STATES-AND-FLOWS.md` |
| AI layer | `docs/01_PRD/FEATURES/ai-layer.md` |
| Roadmap | `docs/01_PRD/ROADMAP.md` |
| Guardrails | `docs/00_SYSTEM/GUARDRAILS.md` |
| Current baseline | `docs/00_SYSTEM/BASELINE.md` |
