# SyncMaster Refinement Plan — Multi-Perspective Analysis

> **Based on:** Audit report + LLM Council-style perspectives + Boris Cherny methodology
> **Generated:** April 28, 2026
> **For:** Dakol (founder) + incoming engineer (1-2 months)
> **Status:** Ready to implement

---

## 📊 Executive Summary

**Question:** Should SyncMaster Phase 2 adopt a 9-layer production-grade MD architecture?

**Answer:** **YES, but with pragmatism: Phase A only (Week 1), then re-evaluate.**

**Why:**
1. ✓ Solves critical handoff problem (next engineer won't be lost)
2. ✓ Locks in decision rationale (ADRs pay for themselves)
3. ✓ Organizes research findings (Reddit/MCP becomes usable, not noise)
4. ✓ Enforces test-first validation (guardrails make it automatic)
5. ⚠️ Phase A (≈5 days) vs Phase B/C (defer until after Sprint 1 complete)

---

## 🧠 Perspective Analysis (Council-Style Thinking)

### Perspective 1: Architecture Thinking (Systems Designer)

**Position:** "The layered structure is exactly right, but it needs to be implemented strategically."

**Key Points:**
- ✓ Knowledge → Decisions → Execution → Validation is the **right mental model** for growing teams
- ✓ Separating 02_RESEARCH from 03_ARCHITECTURE is **essential** (else research gets buried in decisions)
- ✓ ADRs are the **right pattern** for solo → team transition (they're not overhead; they're leverage)

**Critical Concern:**
- If you create folders but don't fill them, you've wasted time and created confusion
- Solution: **Phase A first, with explicit enforcement** (GUARDRAILS.md)

**Recommendation:** Phase A is non-negotiable; Phase B/C can wait.

---

### Perspective 2: Execution Reality (Pragmatist)

**Position:** "Structure is good, but only if it saves time. Otherwise it's organizational theater."

**Key Points:**
- ✓ Phase A creates **immediate value** (decision traceability, handoff clarity)
- ⚠️ Phase B/C are **nice-to-have** (becomes urgent only post-MVP)
- ✗ Don't implement all 9 layers at once — you'll spend 2 weeks on folders and 0 weeks on code

**Time Investment Reality:**
- Phase A: ≈2-3 days (create folders + write GUARDRAILS.md + ADR-001-003)
- Phase B: ≈3-4 days (migrate docs + create FEATURES/)
- Phase C: ≈1-2 days (future, not critical for Phase 2)

**Risk:** "Structure without substance" (empty folders = clutter)
**Mitigation:** Fill Phase A as you go; don't pre-create empty folders.

**Recommendation:** Phase A immediately, Phase B in parallel with code, Phase C post-MVP.

---

### Perspective 3: Testing-First Thinking (QA Architect)

**Position:** "Placing 05_TESTING separately is right IF you explicitly link tests to features."

**Key Points:**
- ✓ Separating 05_TESTING from 04_BUILD is **correct** (avoids "testing as afterthought")
- ✓ Having PLAYWRIGHT/ subfolder with test-cases.md **ensures visibility**
- ⚠️ But ONLY if tests are co-located in code AND linked from MD

**Implementation Detail:**
- Tests live in: `/tests/` in codebase (alongside components)
- Test docs live in: `05_TESTING/PLAYWRIGHT/` (overview, strategy, coverage)
- Link: GUARDRAILS.md says "Feature X → 01_PRD/FEATURES/X.md → 04_BUILD/ → 05_TESTING/PLAYWRIGHT/test-cases.md"

**Enforcement Mechanism:**
```
No feature reaches "DONE" until:
1. Code exists (04_BUILD/)
2. Tests pass (05_TESTING/)
3. Both linked from feature doc (01_PRD/FEATURES/)
```

**Recommendation:** Phase A includes TESTING/STRATEGY.md + GUARDRAILS.md to enforce this.

---

### Perspective 4: Research & Intelligence (Knowledge Ops)

**Position:** "Reddit/MCP findings are noise unless they're distilled into INSIGHTS_SUMMARY.md"

**Key Points:**
- ✓ Having 02_RESEARCH/REDDIT/ is **good**
- ✓ Having INSIGHTS_SUMMARY.md is **essential**
- ✗ Raw Reddit data is useless; it must be curated

**Signal Scoring (Phase A):**
```
For each Reddit finding:
## Insight
"Teams use Playwright for E2E testing"

## Signal Strength
High (appeared in 5+ threads independently)

## Decision Impact
"Adopt Playwright for SyncMaster" (already done; validates choice)
```

**Practical Flow:**
1. Run Reddit MCP → saves to `02_RESEARCH/REDDIT/[topic].md`
2. Weekly: Curate into `02_RESEARCH/INSIGHTS_SUMMARY.md`
3. When making decisions: Pull from INSIGHTS_SUMMARY, not raw REDDIT/

**Recommendation:** Phase A includes INSIGHTS_SUMMARY.md template; populate weekly (async task).

---

### Perspective 5: Founder Pragmatism (You, Dakol)

**Position:** "This structure is good, but does it actually help ME build faster?"

**ROI Analysis:**

| Investment | Benefit | ROI |
|---|---|---|
| Create 00_SYSTEM/ | Explicit guardrails (team knows the rules) | High |
| Create 02_RESEARCH/REDDIT/ | Organize market research (currently scattered) | High |
| Create ADR-001-003 | Lock in "why Supabase/RLS/Playwright" (handoff ready) | High |
| Create 05_TESTING/STRATEGY.md | Visible test philosophy (new engineer aligns) | Medium |
| Create 01_PRD/FEATURES/ | Per-feature tracking (less context switching) | Medium |
| Create 04_BUILD/ structure | Organize code docs by layer | Low-Medium |
| Create 06_ITERATION/ | Bug tracking (needed eventually) | Low |
| Create 07_DEPLOYMENT/ | CI/CD playbooks (needed for Phase 3) | Low |

**True Cost:** Phase A is 1 week of design work UPFRONT that saves 2-3 weeks of context-switching later.

**Decision:** Phase A is non-negotiable; rest is iterative.

---

## 🎯 The Verdict (Consensus)

**All perspectives align on:**
1. ✓ **Layered structure is correct** (Knowledge → Decisions → Execution → Validation)
2. ✓ **ADRs are essential** (for team + investor credibility)
3. ✓ **Testing must be first-class** (GUARDRAILS.md enforces it)
4. ✓ **Phase A first** (critical, can be done in 1 week)
5. ⚠️ **Phase B/C are important but deferrable** (do parallel with code)

**Where Perspectives Diverge:**
- **Architecture Thinker:** "Do all 9 layers now, it's the right structure"
- **Pragmatist:** "Phase A only, defer Phase B/C until after code complete"
- **Consensus:** Pragmatist wins (Phase A now, Phase B/C in parallel with code)

---

## 🔧 PRACTICAL IMPLEMENTATION PLAN

### Phase A (Week 1 - CRITICAL - Do This First)

**Timeline:** Monday-Friday (5 days, 2-3 hours/day)

#### Day 1-2: Foundation Folders + Workflow
```bash
# Create structure
mkdir -p 00_SYSTEM 02_RESEARCH/REDDIT 02_RESEARCH/TECH 03_ARCHITECTURE/DECISIONS 05_TESTING/PLAYWRIGHT 08_CONTEXT

# Create files
00_SYSTEM/WORKFLOW.md              (adapt from current claude.md)
00_SYSTEM/GUARDRAILS.md            (enforcement rules)
00_SYSTEM/TOOLING.md               (tools inventory)
```

**GUARDRAILS.md template:**
```markdown
# SyncMaster Build Guardrails

## Rule 1: Every Feature Has a Home
- Feature spec: 01_PRD/FEATURES/[feature-name].md
- Build docs: 04_BUILD/[layer]/[feature-name].md
- Tests: 05_TESTING/PLAYWRIGHT/[feature-name].test.ts + [feature-name]-cases.md
- Must link all three before DONE

## Rule 2: Every Decision Is Traceable
- Decision: 03_ARCHITECTURE/DECISIONS/ADR-NNN-[title].md
- Must answer: Why? What alternatives? Trade-offs?
- Link from code via comment: "See ADR-NNN"

## Rule 3: No Research Without Summary
- Raw findings: 02_RESEARCH/REDDIT/[topic].md
- Weekly: Distill into INSIGHTS_SUMMARY.md
- Only INSIGHTS_SUMMARY is used for decisions

## Rule 4: Tests Before Code
- Feature can't reach "Build" until test case written
- Test case in PLAYWRIGHT/[feature-name]-cases.md FIRST
- Then code. Then implementation test in suite.

## Rule 5: One PR = One Feature = One Update
- Feature docs (01_PRD) + Build docs (04_BUILD) + Tests (05_TESTING) updated together
- No "orphaned features" (in 04_BUILD but not tested)
```

#### Day 3: ADRs (Architecture Decision Records)

Create 3 foundational ADRs (these lock in existing decisions):

```bash
03_ARCHITECTURE/DECISIONS/ADR-001-auth.md
03_ARCHITECTURE/DECISIONS/ADR-002-supabase-rls.md
03_ARCHITECTURE/DECISIONS/ADR-003-playwright.md
```

**ADR-001 Template:**
```markdown
# ADR-001: Email Magic Link Auth (vs OAuth)

## Decision
We use Supabase Auth with email magic link (no OAuth initially).

## Context
- Phase 2 is early-stage; simplicity > features
- Composers may not have existing OAuth accounts
- Magic link has lower friction for new users
- Reduces dependency on OAuth providers

## Consequences
- ✓ Faster onboarding
- ✓ No third-party dependency
- ✓ Works for all geos
- ⚠️ Email delivery is critical (use Resend)
- ⚠️ No social login (add in Phase 3 if needed)

## Status: ACCEPTED
## Link in Code: /app/auth/route.ts line 15
```

#### Day 4: Research Org + Insights

```bash
02_RESEARCH/INSIGHTS_SUMMARY.md    (curated weekly findings)
```

**Template:**
```markdown
# Research Insights Summary

## Playwright vs Cypress
**Insight:** Teams report Playwright is more reliable for E2E, faster CI
**Signal Strength:** High (5+ threads, 100+ upvotes)
**Decision Impact:** We chose Playwright (validates choice)
**Status:** Confirmed, moving forward

## Next.js 14 Best Practices
**Insight:** App Router recommended over Pages Router
**Signal Strength:** High (official docs + community consensus)
**Decision Impact:** We're on App Router (validates choice)
**Status:** Confirmed, moving forward

## Supabase RLS Patterns
**Insight:** RLS at DB layer > app-layer filtering (security + performance)
**Signal Strength:** High (Supabase docs + security audits)
**Decision Impact:** Our RLS architecture is correct
**Status:** Confirmed, moving forward
```

#### Day 5: Testing Strategy

```bash
05_TESTING/STRATEGY.md
05_TESTING/PLAYWRIGHT/test-cases.md
```

**STRATEGY.md:**
```markdown
# Testing Strategy (Phase 2)

## Philosophy
- **Test-first:** Write test cases before code
- **Feature-linked:** Every feature has test cases
- **Playwright:** E2E testing for user flows
- **Coverage goal:** 80%+ (Phase 2), 90%+ (Phase 3+)

## Test Types
1. **Feature Tests** (Playwright) - User flows, happy path + edge cases
2. **Unit Tests** (Jest) - Components, utils, validation
3. **Integration Tests** (Playwright) - Cross-feature flows (auth → submit → review)

## Process
1. Write test case in PLAYWRIGHT/[feature-name]-cases.md
2. Implement test in /tests/[feature-name].spec.ts
3. Code feature
4. Tests pass → Feature done

## Enforcement
- No PR merges without passing tests
- GUARDRAILS.md enforces "no feature without test"
```

---

### Phase B (Week 2-3 - IMPORTANT - Parallel with Code)

**Do NOT delay code building** for this. Do in parallel.

#### Create PRD Structure
```bash
mkdir -p 01_PRD/FEATURES 01_PRD/USER_FLOWS
01_PRD/OVERVIEW.md              (case study summary)
01_PRD/FEATURES/brief-system.md (existing brief template, organized)
01_PRD/FEATURES/composer-auth.md
01_PRD/FEATURES/producer-onboarding.md
# ... per Sprint 1 features
```

#### Create Build Docs
```bash
mkdir -p 04_BUILD/FRONTEND 04_BUILD/BACKEND 04_BUILD/COMPONENTS 04_BUILD/INTEGRATIONS
04_BUILD/FRONTEND/PAGES.md       (overview of pages)
04_BUILD/BACKEND/API.md          (API endpoints)
04_BUILD/COMPONENTS/STATUS.md    (component status tracking)
```

#### Create Iteration Tracker
```bash
06_ITERATION/BUGS.md
06_ITERATION/IMPROVEMENTS.md
06_ITERATION/CHANGELOG.md        (per sprint)
```

---

### Phase C (Week 4+ - FUTURE)

**Do NOT do during Phase 2.** For Phase 3 / Pre-fundraising.

```bash
07_DEPLOYMENT/ENV.md
07_DEPLOYMENT/CI_CD.md
07_DEPLOYMENT/RELEASES.md
08_CONTEXT/PROMPTS.md            (reorganize from PHASE_2_QUICKSTART.md)
08_CONTEXT/CLAUDE_MEMORY.md      (reorganize from tasks/lessons.md)
08_CONTEXT/NOTES.md              (session notes, context)
```

---

## 📈 Benefits You'll See

### Week 1 (Phase A Done)
- ✓ Explicit guardrails (team knows expectations)
- ✓ Decision rationale locked (ADRs are searchable)
- ✓ Testing strategy visible (new engineer aligns immediately)
- ✓ Research organized (can reference insights vs noise)

### Week 2-3 (Phase B in Progress)
- ✓ Per-feature tracking (less "what did I do?" switching)
- ✓ Clear handoff readiness (folder structure explains itself)
- ✓ Build completeness visible (what's done, what's in progress)

### Phase 3 (Fundraising)
- ✓ Investor credibility ("look at our decision documentation")
- ✓ Onboarding new engineer trivial (structure explains itself)
- ✓ Audit trail complete (what was researched, why decisions made)

---

## 🚨 Critical Implementation Rules

### DO
- ✓ Create Phase A folders, fill them as you code
- ✓ Update GUARDRAILS.md first (it's the "constitution")
- ✓ Write ADRs DURING code, not after
- ✓ Link docs from code (comments point to ADRs, feature names)
- ✓ Automate what you can (scripts that populate CHANGELOG.md)

### DON'T
- ✗ Create Phase B/C folders before Phase A is solid
- ✗ Write docs "after" code is done (docs + code stay in sync)
- ✗ Have empty folders (creates confusion)
- ✗ Duplicate decisions across files (single source of truth in ADRs)
- ✗ Let research pile up (curate INSIGHTS_SUMMARY weekly)

---

## ✅ Success Criteria (End of Phase A)

- [ ] 00_SYSTEM/ exists with WORKFLOW.md, GUARDRAILS.md, TOOLING.md
- [ ] ADR-001, ADR-002, ADR-003 written (auth, RLS, testing)
- [ ] 02_RESEARCH/ structured (REDDIT/, TECH/, INSIGHTS_SUMMARY.md)
- [ ] 05_TESTING/STRATEGY.md + test-cases.md defined
- [ ] GUARDRAILS.md enforced in new code
- [ ] Next engineer can read GUARDRAILS.md and understand expectations
- [ ] Series C doc reviewer can read ADRs and understand "why"

---

## 📋 Action Item List (Prioritized)

**This Week (Phase A):**
1. [ ] Create folder structure (1 hour)
2. [ ] Write GUARDRAILS.md (1-2 hours)
3. [ ] Write WORKFLOW.md (30 min)
4. [ ] Write ADR-001, ADR-002, ADR-003 (2 hours, 30 min each)
5. [ ] Organize 02_RESEARCH/ with INSIGHTS_SUMMARY.md (1 hour)
6. [ ] Write 05_TESTING/STRATEGY.md (1 hour)

**Total Phase A: 7-8 hours (1 day focused work or 2-3 days + regular coding)**

**Next Week (Phase B - Parallel with Code):**
- As you build features, create corresponding 01_PRD/FEATURES/[name].md
- Link from GUARDRAILS.md
- Update 06_ITERATION/CHANGELOG.md weekly

---

## 🎬 Next Steps for Dakol

1. **Review this plan** (15 min read)
2. **Approve Phase A** (go/no-go decision)
3. **If YES:** Tell Claude Code "Implement Phase A — SyncMaster MD refinement"
4. **If CONDITIONAL:** Let me know blockers/tweaks
5. **Monitor:** After Week 1, review if structure is paying off (or feels like overhead)
6. **Re-evaluate:** After Phase A, decide on Phase B timing

---

*End of Multi-Perspective Refinement Plan — Ready to Execute*
