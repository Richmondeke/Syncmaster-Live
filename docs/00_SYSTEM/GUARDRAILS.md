# SyncMaster Build Guardrails

## Current Baseline Rule
- Before starting work, read `docs/00_SYSTEM/BASELINE.md`, `CLAUDE.md`, and `AGENTS.md`.
- For Next.js framework changes, read the relevant local guide in `node_modules/next/dist/docs/`.
- The current request boundary file is `proxy.ts`, not `middleware.ts`.
- The current AI runtime is direct Anthropic through `services/ai.ts`; do not migrate providers unless explicitly requested.

## Rule 1: Every Feature Has a Home
- Feature spec: 01_PRD/FEATURES/[feature-name].md
- Build docs: docs/build/[feature-name].md or docs/06_ITERATION/[feature-name].md
- Tests: 05_TESTING/PLAYWRIGHT/[feature-name].test.ts
- Must link all three before marking DONE

## Rule 2: Every Decision Is Traceable
- Decision: 03_ARCHITECTURE/DECISIONS/ADR-NNN-[title].md
- Must answer: Why? What alternatives? Trade-offs?
- Link from code: "See ADR-NNN" in comments

## Rule 3: No Research Without Summary
- Raw findings: 02_RESEARCH/REDDIT/[topic].md
- Weekly: Distill into INSIGHTS_SUMMARY.md
- Only INSIGHTS_SUMMARY used for decisions

## Rule 4: Tests Before Code
- Feature can't reach "Build" until test case written
- Test case in PLAYWRIGHT/[feature-name]-cases.md FIRST
- Then implementation test in suite

## Rule 5: One PR = One Feature
- Feature docs (01_PRD) + Build docs (04_BUILD) + Tests (05_TESTING) updated together
- No orphaned features (in code but not tested)

## Rule 6: Preserve Design-System Baseline
- Phase E2 is the current visual baseline.
- New dashboard UI should use tokenized surfaces, subtle borders, `0.375rem` radius baseline, `.label` metadata, and `.mono` numeric values where appropriate.
- Do not reintroduce heavy card shadows or old filled sidebar active states unless a specific component requires it.

## Rule 7: Verify Before Baseline Updates
- `npx.cmd tsc --noEmit` is required before marking code work complete.
- `npm.cmd run build` is required before release or baseline updates.
- If build fails only because Google Fonts cannot be fetched, rerun with network access or document the blocker explicitly.
