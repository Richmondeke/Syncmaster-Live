# Session Prompt Templates

## Standard Session Opener

```text
I'm working on SyncMaster.

Read CLAUDE.md and docs/00_SYSTEM/BASELINE.md for full project context.
PRD reference for this session: @docs/01_PRD/FEATURES/[relevant-feature].md

Session goal: [single feature or fix]
Current baseline: Phase E2 design-system integration complete

Files I'm giving you permission to modify:
- [file 1]
- [file 2]

Where we left off:
[2-3 sentences]

Constraints:
- No new npm packages unless listed
- Mobile-first
- Complete files only; no truncation
- Follow all rules in CLAUDE.md
- Do not migrate AI providers unless explicitly requested
```

## AI-Layer Opener

```text
I'm working on SyncMaster.

Read CLAUDE.md and docs/00_SYSTEM/BASELINE.md for full project context.
PRD reference: @docs/01_PRD/FEATURES/ai-layer.md

Session goal: [specific AI-layer change]

Files allowed:
- services/ai.ts
- agents/[agent-name].ts
- app/actions/[entity].ts

Where we left off:
- AI calls use direct Anthropic Messages API through services/ai.ts.
- ANTHROPIC_API_KEY is the active AI environment variable.
- Do not migrate providers unless explicitly requested.

Constraints:
- No new npm packages unless listed
- Server-side AI calls only
- Complete files only; no truncation
- Follow all rules in CLAUDE.md
```

## Phase E2 Design-System Opener

```text
I'm working on SyncMaster.

Read CLAUDE.md and docs/00_SYSTEM/BASELINE.md for full project context.
Design reference: @PHASE-E-PROGRESS.md

Session goal: [specific UI/design-system change]

Files allowed:
- app/globals.css
- components/[area]/[component].tsx
- docs/[relevant-doc].md

Constraints:
- No new npm packages unless listed
- Mobile-first
- Complete files only; no truncation
- Preserve Phase E2 design-system baseline
- Follow all rules in CLAUDE.md
```
