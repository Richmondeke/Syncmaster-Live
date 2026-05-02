# Guardrail Audit - 2026-05-02

## Purpose

Audit the Markdown guardrails after Phase E2 so future development does not drift back to stale assumptions.

---

## Findings

### 1. Phase naming was stale

`CLAUDE.md` still identified the project as Phase D and described an older Phase E production-polish sequence. The current working baseline is Phase E2 design-system integration complete.

**Action:** Updated `CLAUDE.md` and added `docs/00_SYSTEM/BASELINE.md`.

### 2. Next.js 16 request boundary was stale

Docs still referred to `middleware.ts`. The project has moved to `proxy.ts` for Next.js 16.

**Action:** Updated active guardrails to name `proxy.ts`.

### 3. AI runtime docs were mixed

Code uses direct Anthropic Messages API through `services/ai.ts`, while root `ENV.md` still described AWS Bedrock as active.

**Action:** Updated root `ENV.md`, `docs/07_DEPLOYMENT/ENV.md`, `.env.example`, and active guardrails. Bedrock is now marked legacy/unused unless explicitly reactivated.

### 4. UI patterns were outdated

`CLAUDE.md` still recommended older `rounded-lg border bg-card shadow-sm` card defaults. Phase E2 moved the dashboard baseline to subtler borders, smaller radius, lime accent, `.label`, `.mono`, and left-border sidebar active states.

**Action:** Updated `CLAUDE.md`, `PHASE-E-PROGRESS.md`, and `docs/00_SYSTEM/BASELINE.md`.

### 5. Historical docs still exist

Some docs intentionally remain historical records:

- `docs/06_ITERATION/PHASE_E_COMPLETION.md` is production-polish Phase E.
- `docs/build/DESIGN-SYSTEM.md` is a broader design spec and still contains older Spotify-green language in places.
- `docs/build/UX-AUDIT.md` audits the broader spec, not necessarily the latest implementation.

**Action:** Active source of truth is now `docs/00_SYSTEM/BASELINE.md` plus `CLAUDE.md`.

---

## Current Baseline Sources

Read these first:

```text
AGENTS.md
CLAUDE.md
docs/00_SYSTEM/BASELINE.md
docs/00_SYSTEM/GUARDRAILS.md
PHASE-E-PROGRESS.md
```

Read these only when relevant:

```text
docs/01_PRD/
docs/build/
docs/06_ITERATION/
docs/07_DEPLOYMENT/ENV.md
```

---

## Verification Baseline

Latest known good checks:

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
```

Both passed after Phase E2. Build may need network access for Google Fonts.
