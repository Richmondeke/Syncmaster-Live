# SyncMaster Agent Instructions

These instructions are shared project rules for AI coding agents. Keep tool-specific behavior in `CLAUDE.md`, `GEMINI.md`, or local tool config files.

## Current Baseline

- Baseline date: 2026-05-02
- Status: Phase E2 design-system integration complete and verified.
- Current focus: production stabilization, documentation accuracy, manual QA, and clean commits.
- Do not start a broad AI/API migration unless explicitly requested.

Before starting meaningful work, read:

- `docs/00_SYSTEM/BASELINE.md`
- `docs/00_SYSTEM/GUARDRAILS.md`
- `docs/00_SYSTEM/TOOLING.md`
- This file

## Product

SyncMaster is a curated sync licensing platform for three roles:

- Admins who vet composers, manage briefs, and coordinate placements
- Producers who create briefs and review curated matches
- Composers who receive invites and submit track links

The product wedge is the African composer to global brief corridor: human curation, rights clarity, and a small set of vetted matches instead of an open directory.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 + shadcn/ui + Phase E2 design tokens |
| Database | Supabase Postgres + RLS |
| Auth | Supabase Auth SSR, cookie-based |
| Storage | Supabase Storage |
| Email | Resend + React Email |
| AI | Anthropic Messages API through `services/ai.ts` only |
| Deployment | Vercel |

## Next.js 16 Rule

This is not older Next.js. APIs, conventions, and request boundaries may differ from model memory.

Before writing framework-specific code, read the relevant local guide in:

```text
node_modules/next/dist/docs/
```

The auth/request boundary file is `proxy.ts`, not `middleware.ts`.

## Architecture Rules

Mutations belong in Server Actions. Do not create API routes for normal app mutations or data fetching.

```ts
// app/actions/[entity].ts
'use server'
import { createClient } from '@/lib/supabase/server'
```

API routes are only for webhooks and cron:

```text
app/api/webhooks/
app/api/cron/
```

Keep Supabase clients separated:

| Context | Client |
| --- | --- |
| Server Components, Server Actions, Route Handlers | `@/lib/supabase/server` |
| Client Components only | `@/lib/supabase/client` |

Fetch data in Server Components by default, then pass data into Client Components as props.

Use generated database types only:

```ts
import type { Database } from '@/types/database.types'
type Brief = Database['public']['Tables']['briefs']['Row']
```

Route AI calls through project agents and the service wrapper:

```ts
// server action calls agent
import { matchComposers } from '@/agents/composer-matcher'

// agent calls service
import { ai } from '@/services/ai'
```

Do not import Anthropic SDKs or call Anthropic directly outside `services/ai.ts`. The active runtime is direct Anthropic API via `ANTHROPIC_API_KEY`; Bedrock is not the current path unless docs are intentionally updated.

Forms should use `useActionState` plus Server Actions. `react-hook-form` is not installed.

Verify privileged actions server-side:

```ts
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin') throw new Error('Forbidden')
```

## Key Paths

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

## Design System

Phase E2 design-system integration is the current UI baseline.

| Pattern | Current Rule |
| --- | --- |
| Accent | Acid lime: `oklch(0.88 0.18 120)` via `--primary` |
| Radius | Base radius `--radius: 0.375rem`; config scale is 2/4/6/8/12/16px |
| Cards | Prefer subtle borders over heavy shadows |
| Active nav | Left primary border + `bg-sidebar-accent` + numeric label |
| Metadata labels | Use `.label` or `.label-strong` |
| Numeric/status values | Use `.mono` where useful |
| Alert/banner | Use `Banner` or `border-l-2 border-l-primary` pattern |
| Brief list hover | `hover:border-input hover:bg-card` |

Avoid reverting to the old default pattern of `rounded-lg border bg-card shadow-sm` for new design-system work unless the local component already requires it.

## Conventions

| Thing | Convention |
| --- | --- |
| Component files | `PascalCase.tsx` |
| Non-component files | `kebab-case.ts` |
| DB columns | `snake_case` |
| Public env vars | `NEXT_PUBLIC_SCREAMING_SNAKE` |
| Secrets | Server-only, never `NEXT_PUBLIC_` |
| Error handling | Surface to UI; no silent catches |
| Loading states | Every async action needs a visible pending state |
| Empty states | Every list needs an empty state |
| Responsive baseline | 375px mobile first, then 1280px desktop |

## Hard Rules

- Never edit `components/ui/` unless explicitly requested.
- Never use `any`.
- Never call agents from client components.
- Never call Anthropic outside `services/ai.ts`.
- Never create API routes for app mutations or normal data fetching.
- Never use `localStorage` for auth state.
- Never skip role verification in server actions.
- Never add npm packages without documenting why.
- Never hand-edit `types/database.types.ts`.
- Never write inline SQL in app code; use Supabase client methods.
- Never introduce LangGraph for simple scoring/ranking.
- After adding a DB column, update all explicit `select()` strings.
- Before Next.js framework changes, read `node_modules/next/dist/docs/`.

## Verification

Use the narrowest meaningful check during development:

```powershell
npx.cmd tsc --noEmit
```

Before release, baseline updates, or broad UI/backend changes:

```powershell
npm.cmd run build
```

Use Playwright for auth, dashboard workflows, browser behavior, and responsive UI:

```powershell
npm.cmd run test
npm.cmd run test:auth
npm.cmd run test:briefs
npm.cmd run test:outreach
npm.cmd run test:smoke
```

`npm.cmd run build` may need network access because `next/font` fetches Geist and Geist Mono from Google Fonts. If build fails only because fonts cannot be fetched, report that explicitly.

## Documentation

- Keep docs current when changing architecture, environment variables, workflows, or design-system rules.
- Use `docs/00_SYSTEM/BASELINE.md` as the current baseline before starting new work.
- Use `docs/01_PRD/OVERVIEW.md` and related feature docs for product behavior.
- Add or update ADRs for architecture decisions that change project direction.
