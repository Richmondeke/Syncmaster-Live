# Build Guardrails for $PROJECT_NAME

## Rule 1: Every Feature Has a Home
- Feature spec: 01_PRD/FEATURES/[feature-name].md
- Build docs: 04_BUILD/[layer]/[feature-name].md
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

