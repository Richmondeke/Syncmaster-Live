# PHASE 2 BUILD SYSTEM — Quick Start Guide

> **For:** Dakol (founder)
> **Date:** April 28, 2026
> **Purpose:** How to use the new build system + file structure

---

## What Changed (Summary)

You went from:
```
/mnt/project/
├── Claude_Md_.txt (basic workflow)
├── SyncMaster_*.md (5 docs, flat structure)
└── [no sprint tracking]
```

To:
```
/mnt/project/
├── claude.md (Boris Cherny-inspired build system)
├── tasks/
│   ├── PHASE_2_PLAN.md (10-sprint locked roadmap)
│   ├── CURRENT.md (active sprint checklist)
│   ├── lessons.md (self-improvement log)
│   └── research/ (async research findings)
├── docs/ (product + architecture docs)
└── README.md (folder guide)
```

**Why:** Discipline, scalability, and self-improvement. This structure helps you build faster, avoid mistakes, and document everything for Series C.

---

## Files You'll Use Daily

### 1. claude.md (Your operating system)
- **Read at:** Session start
- **Purpose:** Build rules, workflow, when to plan, when to use subagents
- **How to use:** Skim "Workflow Orchestration" + "Verification Before Done"
- **Update:** Never (it's locked system docs). Corrections → lessons.md instead.

### 2. tasks/CURRENT.md (This sprint's checklist)
- **Read at:** Session start (what are we building this week?)
- **Update:** Daily (mark items done as you complete them)
- **Purpose:** Single source of truth for Sprint 1 work
- **How to use:** Copy checklist items, verify deliverables, mark done
- **Archive:** When sprint closes, move to `tasks/PHASE_2_PLAN.md` → next sprint

### 3. tasks/lessons.md (What we learned)
- **Read at:** Session start (what mistakes should we avoid today?)
- **Update:** After every correction ("I did X wrong → rule to prevent recurrence")
- **Purpose:** Prevent repeat mistakes, improve with every session
- **Sections:** Critical Patterns (locked rules) + Session Corrections (temporary)

### 4. tasks/research/README.md (Research templates)
- **Use when:** You need market context, competitor intel, validation
- **How:** Assign subagent a research task → gets findings in markdown
- **Integration:** Findings inform product decisions (Phase 2 roadmap)

---

## Your Weekly Rhythm

### Every Monday Morning

1. **Review lessons.md**
   ```
   "What patterns should I watch for this week?"
   ```

2. **Check CURRENT.md**
   ```
   "What's the sprint goal? What's done? What's blockers?"
   ```

3. **Assign research (if needed)**
   ```
   "Run Reddit research task: Composer pain points → tasks/research/reddit-composer-pain.md"
   ```

4. **Approve/replan**
   ```
   "Go ahead with this approach" OR "Let's change the plan to X"
   ```

### During the Week

- Claude Code follows the plan
- If corrections/mistakes happen → Claude Code updates lessons.md immediately
- If plan changes → Claude Code updates CURRENT.md before building
- No surprises; you stay informed

### Friday End-of-Week

1. **Review delivery** — Does the work match Definition of Done?
2. **Capture learnings** — Any patterns to lock in lessons.md?
3. **Plan next sprint** — What's priority for Sprint 2?

---

## The Claude Code Workflow (What Claude Does)

### For Every Non-Trivial Task

```
1. PLAN (write to CURRENT.md)
   - What's the problem?
   - What's the approach?
   - What's success?

2. SHOW TO DAKOL
   - "Here's my plan. Approved?"
   - Wait for go/no-go

3. BUILD (execute plan)
   - Follow the checklist
   - Test as you go
   - Mark items done

4. VERIFY
   - Logs, tests, demo
   - Ask: "Would a staff engineer approve this?"

5. DOCUMENT
   - Capture learnings → lessons.md
   - Update CURRENT.md with completions

6. IF CORRECTIONS
   → Update lessons.md immediately (prevent recurrence)
```

---

## Key Principles (Locked)

These are non-negotiable for Phase 2:

1. **Plan before code** — 3+ step tasks get written plans. No "just trying"
2. **RLS tested first** — Every database feature tested with RLS on. Series C requirement.
3. **Verify everything** — Logs, tests, demo. No "it should work"
4. **Capture mistakes** — Every correction → rule in lessons.md
5. **Use subagents** — Research tasks stay async. Keep main context <120K tokens.

---

## How to Request Work

### Simple request (1-2 steps)
```
"Create the Supabase project and let me know the URL."
```
Claude Code: Does it, shows logs, done.

### Medium request (3+ steps)
```
"Set up the database foundation for Phase 2."
```
Claude Code:
1. Writes plan to CURRENT.md
2. Shows to you: "Here's my approach. Approved?"
3. You: "Go" or "Change X first"
4. Claude Code builds, verifies, documents

### Complex request (architectural decision)
```
"Should we use Inngest or Zapier for workflows?"
```
Claude Code:
1. Research both (subagent task)
2. Document trade-offs
3. Recommend based on Series C credibility, cost, reliability
4. You decide

---

## File Reference (Quick Lookup)

| I need to... | Look here |
|---|---|
| ...understand Phase 2 roadmap | `tasks/PHASE_2_PLAN.md` |
| ...see this week's sprint | `tasks/CURRENT.md` |
| ...avoid common mistakes | `tasks/lessons.md` |
| ...understand the tech stack | `docs/ARCHITECTURE.md` |
| ...see the sync brief template | `docs/SyncMaster_Brief_Template.md` |
| ...review market research | `docs/SyncMaster_Case_Study.md` |
| ...run a research task | `tasks/research/README.md` |
| ...understand the build system | `claude.md` |

---

## When to Stop & Replan

These are red flags. If you see them, pause and replan:

- ❌ Claude Code says "I'm going to try this approach and see what works"
  - **Fix:** "Write a plan first, show it to me"

- ❌ Building without a written checklist
  - **Fix:** "Add it to CURRENT.md, mark items done as you go"

- ❌ Correcting mistakes without updating lessons.md
  - **Fix:** "Update lessons.md to prevent this again"

- ❌ RLS not tested (or "we'll test it later")
  - **Fix:** "Test RLS now, before moving on. Series C requires this."

- ❌ Big research task mixed into main context
  - **Fix:** "Use subagent for research, keep main context clean"

---

## Success Looks Like

At the end of Phase 2 (Sprint 10), you'll have:

✓ **On schedule:** 10 sprints delivered on timeline
✓ **High quality:** Tests pass, RLS secure, docs complete
✓ **Low surprises:** Corrections caught early, patterns locked in lessons.md
✓ **Series C ready:** Architecture docs, audit trails, compliance locked in
✓ **Scalable:** One founder → one engineer → team (handoff-ready)

---

## Red Button: How to Reset If Things Go Wrong

If the plan goes sideways:

```
1. STOP — Don't keep pushing
2. ASSESS — What broke? Why?
3. COMMUNICATE — Tell Claude Code the issue
4. REPLAN — Write new plan to CURRENT.md
5. EXECUTE — Follow new plan
```

That's it. No shame in replans. Happens all the time.

---

## Reddit MCP Research (Optional But Recommended)

Phase 2 includes async research tasks (subagent runs while you're building):

**Example:**
```
"Run research task: Sync licensing trends
Search: r/filmmaking, r/WeAreTheMusicMakers for composer pain points
Output: tasks/research/reddit-composer-pain.md
Findings inform: Sprint 2 composer portal design"
```

**How it works:**
1. Subagent searches Reddit (async)
2. Returns 3–5 key findings + links
3. You review, integrate into product decisions
4. Cite findings in decision docs (for Series C)

**Research tasks ready:**
- Composer pain points
- Nollywood production workflows
- African creator networks
- Rights complexity
- Competitor sentiment

See `tasks/research/README.md` for all tasks.

---

## Checklist: You're Ready If

- [ ] You've read claude.md (Workflow Orchestration + Verification sections)
- [ ] You understand tasks/CURRENT.md (active sprint checklist)
- [ ] You know how lessons.md works (mistakes → rules)
- [ ] You've reviewed docs/ARCHITECTURE.md (tech stack overview)
- [ ] You've got tasks/PHASE_2_PLAN.md bookmarked (10-sprint roadmap)
- [ ] You know how to request work (3-step process above)
- [ ] You understand the red flags (when to stop + replan)

---

## Next Actions (Starting Monday)

1. **Review claude.md** — Understand the build system
2. **Approve Sprint 1 plan** — `tasks/CURRENT.md` is ready
3. **Kick off Phase 2** — "Let's build Sprint 1"
4. **Watch the workflow** — Notice how plans, corrections, and lessons work
5. **Iterate** — After Week 1, we'll have patterns to lock in

---

## Questions?

- **How do I request work?** → See "How to Request Work" above
- **What if the plan changes?** → Replan in CURRENT.md, show Dakol, get approval
- **What if Claude Code makes mistakes?** → Corrections update lessons.md automatically
- **How do I know we're on track?** → Check PHASE_2_PLAN.md vs. sprints/ archive weekly
- **What about Reddit research?** → Optional. Subagent runs async while building happens.

---

## TL;DR

- **claude.md** = your build system (read daily)
- **CURRENT.md** = this sprint's checklist (update daily)
- **lessons.md** = what we learned (review to avoid mistakes)
- **Research tasks** = async context gathering (optional, informs decisions)
- **Plan → Build → Verify → Document → Improve** = the rhythm

You're ready to build Phase 2 with discipline and confidence.

---

*End of Quick Start Guide — You're all set for Phase 2*
