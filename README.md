# SyncMaster

Curated sync licensing platform for admins, producers, and composers.

Current baseline: **Phase E2 design-system integration complete**. Read `docs/00_SYSTEM/BASELINE.md`, `CLAUDE.md`, and `AGENTS.md` before continuing development.

## Getting Started

Run the development server:

```powershell
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
```

`npm.cmd run build` may need network access because `next/font` fetches Geist from Google Fonts.

## Current Guardrails

- Next.js 16: read local docs in `node_modules/next/dist/docs/` before framework changes.
- Request boundary is `proxy.ts`, not `middleware.ts`.
- Mutations live in Server Actions.
- AI calls go through `agents/` and `services/ai.ts`.
- Active AI runtime is Anthropic direct API via `ANTHROPIC_API_KEY`.
- Do not start an AI provider migration unless explicitly requested.

## Useful Docs

```text
docs/00_SYSTEM/BASELINE.md
docs/00_SYSTEM/GUARDRAILS.md
docs/01_PRD/OVERVIEW.md
PHASE-E-PROGRESS.md
ENV.md
```

## Environment

Required local variables are documented in `ENV.md` and `docs/07_DEPLOYMENT/ENV.md`.
