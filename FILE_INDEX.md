# SyncMaster Phase 2 — Complete File Index

> **Last Updated:** April 28, 2026
> **Purpose:** Find any document, understand its purpose, know when to use it

---

## 📍 Root Level Files

### claude.md ⭐ (CRITICAL)
**Purpose:** Your operating system for building  
**Read:** At every session start  
**Update:** Never (it's locked). Corrections → lessons.md instead  
**Key sections:**
- Workflow Orchestration (when to plan, when to use subagents)
- Verification Before Done (checklist for every task)
- Self-Improvement Loop (how to capture and prevent mistakes)
- Autonomous Bug Fixing (who owns issues)

**Use case:** "How should I approach this work?" → Read claude.md

---

### PHASE_2_QUICKSTART.md ⭐ (START HERE)
**Purpose:** Your 5-minute orientation to the new system  
**Read:** Before your first build session  
**Update:** Never (it's reference only)  
**Covers:**
- What changed from Phase 1
- Files you'll use daily
- Your weekly rhythm
- How to request work
- Red flags (when to stop & replan)

**Use case:** "I'm new to this system. Where do I start?" → Read PHASE_2_QUICKSTART.md

---

### README.md
**Purpose:** Folder structure guide + navigation  
**Read:** Once, bookmark the table of contents  
**Update:** When new folders added  
**Explains:**
- What goes in each folder
- How files flow together
- Git + version control strategy
- Reddit MCP integration

**Use case:** "Where should I look for X?" → Check README.md table

---

### SETUP_COMPLETE.txt
**Purpose:** Confirmation that Phase 2 system is ready  
**Read:** Once (celebrate that it's done)  
**Update:** Never  
**Contains:**
- What you have (checklist)
- File structure (visual)
- Quickstart (3 steps)
- Key documents (where to find things)

---

### SyncMaster_Read_ME.txt
**Purpose:** Original MVP vision (Phase 1)  
**Read:** Quarterly refresh on original goals  
**Update:** Never (archive — reference only)  
**Why keep it:** Reminds you why this matters

---

## 📁 tasks/ (Active Work)

### PHASE_2_PLAN.md ⭐ (LOCKED ROADMAP)
**Purpose:** 10-sprint roadmap for Phase 2  
**Read:** Start of week (what's the bigger goal?)  
**Update:** Only on major re-planning (quarterly)  
**Contains:**
- Phase 2 goals (20–30 composers, 15–20 briefs, 2–3 placements)
- All 10 sprints (goals, deliverables)
- Success metrics
- Risk mitigations
- Definition of Done

**Use case:** "What's the bigger picture?" OR "What's Sprint 4?" → Check PHASE_2_PLAN.md

---

### CURRENT.md ⭐ (THIS WEEK'S CHECKLIST)
**Purpose:** Active sprint tracking (single source of truth)  
**Read:** Every morning (what are we building today?)  
**Update:** Daily (mark items done as you complete them)  
**Contains:**
- Sprint goals
- Parallel research tasks
- Detailed checklist (by phase)
- Blockers & risks
- Success checklist
- Notes & decisions

**Use case:** "What's done? What's next?" → Check CURRENT.md

---

### lessons.md ⭐ (SELF-IMPROVEMENT LOG)
**Purpose:** Capture mistakes, convert to rules, prevent recurrence  
**Read:** Start of every session (what should I avoid?)  
**Update:** Immediately after any correction (within same session)  
**Contains:**
- Critical Patterns (locked rules)
  - Plan before code
  - File safety
  - RLS testing
  - Subagent research
  - Verification
  - Elegant solutions
- Session-specific corrections
- Patterns to watch (by severity)
- Rules by phase

**Use case:** "What mistake might I make today?" → Read lessons.md

---

### research/README.md
**Purpose:** Templates for subagent research tasks  
**Read:** When you need market context or validation  
**Update:** As new research tasks are defined  
**Contains:**
- 5 ready-to-run research tasks
  - Composer pain points
  - Nollywood workflows
  - African creator networks
  - Rights complexity
  - Competitor sentiment
- How to execute research
- Expected output format
- Success criteria

**Use case:** "I need validation on X. How do I research it?" → Read research/README.md

---

### research/*.md (Findings)
**Purpose:** Output from async research tasks  
**Read:** When making product decisions  
**Update:** Only by subagent (you don't touch these)  
**Example files:**
- `research/reddit-composer-pain.md`
- `research/reddit-nollywood-production.md`
- `research/stripe-connect-setup.md`

**Use case:** "What did we learn from Reddit?" → Check research/*.md

---

## 📁 docs/ (Reference - Read Only)

### ARCHITECTURE.md ⭐ (SERIES C CREDIBILITY)
**Purpose:** Phase 2 tech stack, detailed and auditable  
**Read:** Once (bookmark Section 11 for fundraising)  
**Update:** Never (locked, represents current Phase 2 decision)  
**Contains:**
- Executive summary
- Database layer (Supabase, RLS, schema, policies, indexes)
- Frontend (Next.js, structure, components)
- Auth & authorization
- Storage (Cloudflare R2)
- Workflows (Inngest)
- Observability (PostHog, Sentry, Axiom)
- Deployment & infrastructure
- Security & compliance
- Disaster recovery
- Series C checklist

**Use case:** "Show me the tech stack" OR "What's our security model?" → ARCHITECTURE.md

---

### SyncMaster_Case_Study.md
**Purpose:** Market research, personas, pain points, competitive analysis  
**Read:** Quarterly (keep fresh as market changes)  
**Update:** When new research findings arrive  
**Contains:**
- Executive summary
- Market opportunity ($650M sync market)
- Validated pain points
- Competitive landscape (7 competitors analyzed)
- 3 personas (Tunde, Amara, James)
- Problem statement
- MVP scope
- Differentiation (4 core points)
- Risks & mitigation
- Success metrics
- 3-phase growth strategy
- Tech stack (Phase 1 no-code)

**Use case:** "Why are we building this?" OR "How do we position vs. Songtradr?" → Case Study

---

### SyncMaster_Brief_Template.md
**Purpose:** Structure of sync briefs (producer-facing intake, composer-facing distribution)  
**Read:** When designing brief UI or email templates  
**Update:** Only if brief format changes  
**Contains:**
- Part 1: Producer intake form (what they fill out)
- Part 2: Composer-facing email (how we distribute)
- Part 3: Internal matching checklist
- Part 4: Submission intake (what composers submit)
- Part 5: Brief lifecycle states (8 states)
- Part 6: Quality control rules

**Use case:** "What fields does a brief have?" OR "How do I distribute to composers?" → Brief Template

---

### SyncMaster_Airtable_Schema.md
**Purpose:** No-code MVP schema (Phase 1 reference)  
**Read:** Once (reference when designing Phase 2 SQL schema)  
**Update:** Never (Phase 1 archive)  
**Why keep it:** Schema mapping from Airtable → Supabase was validated; preserves knowledge

---

## 🎯 Decision Map (Which File for What)

| I need to... | Primary File | Secondary |
|---|---|---|
| ...understand the build system | `claude.md` | `PHASE_2_QUICKSTART.md` |
| ...see what we're building this sprint | `tasks/CURRENT.md` | `tasks/PHASE_2_PLAN.md` |
| ...avoid mistakes | `tasks/lessons.md` | `claude.md` |
| ...understand tech stack | `docs/ARCHITECTURE.md` | `README.md` |
| ...review market research | `docs/SyncMaster_Case_Study.md` | `docs/SyncMaster_Brief_Template.md` |
| ...run a research task | `tasks/research/README.md` | N/A |
| ...see research findings | `tasks/research/*.md` | N/A |
| ...understand brief structure | `docs/SyncMaster_Brief_Template.md` | N/A |
| ...find the folder guide | `README.md` | N/A |
| ...get 5-min orientation | `PHASE_2_QUICKSTART.md` | `SETUP_COMPLETE.txt` |

---

## 📊 File Access Pattern (How They Work Together)

```
Session Start
  ↓
Read claude.md (build system rules)
Read tasks/lessons.md (avoid mistakes)
Check tasks/CURRENT.md (what's this week?)
  ↓
Make a plan (if 3+ steps)
Show to Dakol (get approval)
  ↓
Build (follow checklist)
Reference docs/* as needed
Run async research (subagent)
  ↓
Test/Verify (logs, tests, demo)
  ↓
Hit correction? → Update tasks/lessons.md
  ↓
Sprint complete? → Archive tasks/CURRENT.md
Create next tasks/CURRENT.md from tasks/PHASE_2_PLAN.md
  ↓
Session end
```

---

## 📝 Editing Rules

### Never Edit (Locked Docs)
- `claude.md` — Corrections → `tasks/lessons.md` instead
- `PHASE_2_QUICKSTART.md` — Reference only
- `SETUP_COMPLETE.txt` — Reference only
- `docs/ARCHITECTURE.md` — Locked Phase 2 decision
- `docs/SyncMaster_Case_Study.md` — Only on major re-research
- Original Phase 1 docs (Airtable, Brief Template) — Reference only

### Update Regularly
- `tasks/CURRENT.md` — Daily (mark items done)
- `tasks/lessons.md` — After every correction
- `tasks/PHASE_2_PLAN.md` — Quarterly re-plan (only on major change)
- `tasks/research/*.md` — Subagent only (you review, don't edit)

### Update on Change
- `README.md` — When folder structure changes
- `docs/SyncMaster_Case_Study.md` — When research changes market understanding

---

## 🗂️ Git Strategy

### Commit These (Essential)
```
✓ claude.md
✓ tasks/PHASE_2_PLAN.md
✓ tasks/CURRENT.md
✓ tasks/lessons.md
✓ docs/ARCHITECTURE.md
✓ docs/SyncMaster_*.md
✓ PHASE_2_QUICKSTART.md
✓ README.md
```

### Don't Commit (Ignore)
```
✗ .env, .env.local (secrets)
✗ node_modules/ (dependencies)
✗ .next/, build/ (artifacts)
✗ tasks/research/*.md (optional; async findings)
```

### Commit Messages
```
Good:
✓ "Rule: RLS test all DB work (Phase 2 critical)"
✓ "Sprint 1: Database foundation complete"
✓ "Add Phase 2 tech stack & deployment guide"

Bad:
✗ "update"
✗ "fixes"
✗ "stuff"
```

---

## 📖 Reading Order (First Time)

1. **PHASE_2_QUICKSTART.md** (5 min) — Get oriented
2. **claude.md** → Workflow Orchestration (5 min) — Understand how to build
3. **tasks/CURRENT.md** → Sprint 1 Goals (5 min) — See what we're building
4. **docs/ARCHITECTURE.md** → Executive Summary (5 min) — Understand tech
5. **SETUP_COMPLETE.txt** (2 min) — Celebrate it's done

Total: 22 minutes to full orientation

---

## 🚨 Red Flags (When to Stop & Replan)

If you see these, pause:

- ❌ No written plan (for 3+ step tasks)
- ❌ Building without CURRENT.md checklist
- ❌ Corrections not captured in lessons.md
- ❌ RLS not tested
- ❌ Research mixed into main code context
- ❌ No verification (logs, tests, demo)

**Fix:** Replan in CURRENT.md, show to Dakol, get approval, continue.

---

## ✅ Success Checklist (Phase 2 End)

- [ ] tasks/PHASE_2_PLAN.md: 10 sprints 80%+ complete
- [ ] tasks/lessons.md: 10+ captured patterns, low mistake rate
- [ ] docs/ARCHITECTURE.md: Complete, auditable, Series C ready
- [ ] All sprints archived with learnings
- [ ] 20–30 composers onboarded
- [ ] 15–20 briefs sourced
- [ ] 2–3 placements for case studies
- [ ] Zero data loss (99.9% uptime)
- [ ] Audit trail complete

---

## 📞 Quick Reference

**I need to understand...**
- ...the build system → `claude.md`
- ...this week's work → `tasks/CURRENT.md`
- ...common mistakes → `tasks/lessons.md`
- ...the tech stack → `docs/ARCHITECTURE.md`
- ...market opportunity → `docs/SyncMaster_Case_Study.md`
- ...how to run research → `tasks/research/README.md`
- ...the folder layout → `README.md`
- ...getting started → `PHASE_2_QUICKSTART.md`

---

*End of File Index — You're fully mapped*
