# Session Prompt Templates

## Standard session opener

```
I'm working on SyncMaster.

Read CLAUDE.md for full project context.
PRD reference for this session: @docs/prd-[relevant-file].md

Session goal: [SINGLE FEATURE]
Current phase: [Phase D | Phase E]

Files I'm giving you permission to modify:
- [file 1]
- [file 2]

Where we left off:
[2–3 sentences]

Constraints:
- No new npm packages unless listed
- Mobile-first
- Complete files only — no truncation
- Follow all rules in CLAUDE.md
```

## Phase D (AI layer) opener

```
Session goal: Build agents/brief-analyzer.ts — tags briefs with genre/mood on activation

Files allowed:
- services/ai.ts
- agents/brief-analyzer.ts
- app/actions/briefs.ts (wire in call on status → active)

Where we left off:
- Phase C complete. ai_score, ai_tags, ai_match_reason, ai_suggested_composers columns exist.
- services/ai.ts not yet created.
- No agents/ files yet.
```

## Phase E (production polish) opener

```
Session goal: Email notifications on all brief/submission status transitions

Files allowed:
- emails/ (React Email templates)
- lib/email/send.ts
- app/actions/briefs.ts
- app/actions/submissions.ts
```
