# Universal Project Refinement Template

> **Purpose:** Portable system to audit + refine ANY project's MD architecture
> **Stage:** Works at any phase (pre-build, mid-build, post-MVP)
> **Format:** Copy-paste ready for Claude Code or any agent
> **Safety:** Non-destructive (analyzes, recommends, doesn't modify your code)

---

## 📋 How to Use This Template

### In Claude Code:

1. **Copy the "AUDIT SCRIPT" section** → Save as `/tmp/audit_project.sh`
2. **Run it:** `bash /tmp/audit_project.sh /path/to/your/project`
3. **Review the output** → Understand current state vs ideal
4. **Copy the "REFINEMENT PROMPT"** → Paste into Claude Code conversation
5. **Claude Code executes the refinement plan** → Structures emerge

### In Claude Web (Regular Chat):

1. **Copy the "REFINEMENT PROMPT" section**
2. **Paste into a conversation**
3. **Claude generates the analysis + plan**
4. **You review + approve**
5. **Execute in Claude Code**

---

## 🔧 AUDIT SCRIPT (Copy & Run Anywhere)

```bash
#!/bin/bash

# Universal Project Audit Script
# Works on any project, any language, any stage
# Usage: bash audit_project.sh /path/to/project

PROJECT_ROOT="${1:-.}"
PROJECT_NAME="${2:-$(basename "$PROJECT_ROOT")}"
AUDIT_OUTPUT="/tmp/${PROJECT_NAME}_audit_$(date +%s).md"

echo "🔍 Auditing: $PROJECT_NAME"
echo "Location: $PROJECT_ROOT"
echo ""

# Initialize report
cat > "$AUDIT_OUTPUT" << 'REPORT_HEADER'
# Project Audit Report

**Project:** {PROJECT_NAME}
**Generated:** $(date)
**Purpose:** Analyze current structure vs 9-layer production-grade architecture

---

## Section 1: Current State Analysis

### 1.1 Directory Structure
```
REPORT_HEADER

# Capture directory structure
if command -v tree &> /dev/null; then
  tree -L 3 -I 'node_modules|.next|dist|build|.git' "$PROJECT_ROOT" 2>/dev/null >> "$AUDIT_OUTPUT" || \
  find "$PROJECT_ROOT" -maxdepth 3 -type d 2>/dev/null | sort >> "$AUDIT_OUTPUT"
else
  find "$PROJECT_ROOT" -maxdepth 3 -type d 2>/dev/null | sort >> "$AUDIT_OUTPUT"
fi

echo '```' >> "$AUDIT_OUTPUT"
echo "" >> "$AUDIT_OUTPUT"

# File inventory
echo "### 1.2 File Inventory" >> "$AUDIT_OUTPUT"
echo "" >> "$AUDIT_OUTPUT"

echo "**Markdown Files:**" >> "$AUDIT_OUTPUT"
MD_COUNT=$(find "$PROJECT_ROOT" -name "*.md" -type f 2>/dev/null | wc -l)
echo "$MD_COUNT files found:" >> "$AUDIT_OUTPUT"
find "$PROJECT_ROOT" -name "*.md" -type f 2>/dev/null | sed 's|'"$PROJECT_ROOT"'||' | head -20 >> "$AUDIT_OUTPUT"
echo "" >> "$AUDIT_OUTPUT"

echo "**Code Files:**" >> "$AUDIT_OUTPUT"
CODE_COUNT=$(find "$PROJECT_ROOT" \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.go" \) 2>/dev/null | grep -v node_modules | wc -l)
echo "$CODE_COUNT code files" >> "$AUDIT_OUTPUT"
echo "" >> "$AUDIT_OUTPUT"

echo "**Test Files:**" >> "$AUDIT_OUTPUT"
TEST_COUNT=$(find "$PROJECT_ROOT" \( -name "*.test.ts" -o -name "*.spec.ts" -o -name "*.test.js" -o -name "*_test.go" \) 2>/dev/null | wc -l)
echo "$TEST_COUNT test files" >> "$AUDIT_OUTPUT"
echo "" >> "$AUDIT_OUTPUT"

echo "**Config Files:**" >> "$AUDIT_OUTPUT"
find "$PROJECT_ROOT" -maxdepth 1 -type f \( -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name ".env*" -o -name "*.toml" \) 2>/dev/null | awk -F'/' '{print $NF}' >> "$AUDIT_OUTPUT"
echo "" >> "$AUDIT_OUTPUT"

# Gap analysis against 9-layer structure
cat >> "$AUDIT_OUTPUT" << 'GAP_ANALYSIS'

---

## Section 2: Gap Analysis vs 9-Layer Architecture

### Ideal Structure
```
project-root/
├── 00_SYSTEM/          (Workflow, guardrails, tooling)
├── 01_PRD/             (Features, user flows, requirements)
├── 02_RESEARCH/        (Knowledge: Reddit, competitors, tech)
├── 03_ARCHITECTURE/    (Decisions: ADRs, system design)
├── 04_BUILD/           (Execution: frontend, backend, components)
├── 05_TESTING/         (Validation: strategy, test cases, logs)
├── 06_ITERATION/       (Bugs, improvements, changelog)
├── 07_DEPLOYMENT/      (Env, CI/CD, releases)
├── 08_CONTEXT/         (Prompts, memory, notes)
└── [code/]             (Actual application source)
```

### Current vs Ideal

**Layers Present:**
GAP_ANALYSIS

# Check for key system files
[ -f "$PROJECT_ROOT/claude.md" ] && echo "✓ 00_SYSTEM exists (claude.md found)" >> "$AUDIT_OUTPUT" || echo "✗ 00_SYSTEM missing" >> "$AUDIT_OUTPUT"
[ -d "$PROJECT_ROOT/docs" ] && echo "✓ Docs folder exists" >> "$AUDIT_OUTPUT" || echo "✗ No docs folder" >> "$AUDIT_OUTPUT"
[ -d "$PROJECT_ROOT/tests" ] && echo "✓ Tests folder exists" >> "$AUDIT_OUTPUT" || echo "✗ No dedicated tests folder" >> "$AUDIT_OUTPUT"
[ -f "$PROJECT_ROOT/README.md" ] && echo "✓ README.md present" >> "$AUDIT_OUTPUT" || echo "✗ No README.md" >> "$AUDIT_OUTPUT"

echo "" >> "$AUDIT_OUTPUT"
echo "---" >> "$AUDIT_OUTPUT"
echo "" >> "$AUDIT_OUTPUT"

cat >> "$AUDIT_OUTPUT" << 'SCORING'

## Section 3: Layer Scoring

| Layer | Status | Priority | Gap | Notes |
|-------|--------|----------|-----|-------|
| 00_SYSTEM/ | [Check locally] | High | | Workflow, guardrails |
| 01_PRD/ | [Check locally] | Medium | | Features, requirements |
| 02_RESEARCH/ | [Check locally] | Critical | | Knowledge base |
| 03_ARCHITECTURE/ | [Check locally] | High | | Decisions, ADRs |
| 04_BUILD/ | [Check locally] | High | | Code organization |
| 05_TESTING/ | [Check locally] | High | | Test strategy |
| 06_ITERATION/ | [Check locally] | Low | | Bugs, improvements |
| 07_DEPLOYMENT/ | [Check locally] | Medium | | DevOps, CI/CD |
| 08_CONTEXT/ | [Check locally] | Low | | Context management |

---

## Section 4: Recommendations

### Phase A (Critical - Do First)
- [ ] Create 00_SYSTEM/ (workflow, guardrails)
- [ ] Create 02_RESEARCH/ (knowledge organization)
- [ ] Create 03_ARCHITECTURE/DECISIONS/ (ADRs)
- [ ] Create 05_TESTING/STRATEGY.md

### Phase B (Important - Parallel with Code)
- [ ] Create 01_PRD/FEATURES/
- [ ] Create 04_BUILD/
- [ ] Create 06_ITERATION/

### Phase C (Future - Post-MVP)
- [ ] Create 07_DEPLOYMENT/
- [ ] Reorganize 08_CONTEXT/

---

## Section 5: Next Steps

1. Review this audit report
2. Identify which layers are missing (critical first)
3. Use REFINEMENT_PROMPT to generate detailed plan
4. Execute Phase A (1 week)
5. Execute Phase B (2-3 weeks, parallel with code)

SCORING

# Print to stdout and save
cat "$AUDIT_OUTPUT"
echo ""
echo "✅ Audit saved to: $AUDIT_OUTPUT"
cp "$AUDIT_OUTPUT" /tmp/ 2>/dev/null || true
```

---

## 💬 REFINEMENT PROMPT (Copy & Paste into Claude Code)

```
# Project Refinement Analysis

I want to audit and refine my project structure using a 9-layer production-grade 
Markdown architecture. Here's what I need:

## Current Context
- **Project:** {PROJECT_NAME}
- **Stage:** {PRE_BUILD | MID_BUILD | POST_MVP}
- **Tech Stack:** {YOUR_TECH_STACK}
- **Team Size:** {SOLO | SMALL_TEAM | GROWING}
- **Deadline/Urgency:** {YOUR_URGENCY}

## Current Structure
[Describe your current folder layout, or paste output from the audit script above]

## The 9-Layer Architecture I Want

```
00_SYSTEM/              System docs (workflow, guardrails, tooling)
01_PRD/                 Product requirements (features, user flows)
02_RESEARCH/            Knowledge (Reddit, competitors, tech insights)
03_ARCHITECTURE/        Decisions (ADRs, system design, API design)
04_BUILD/               Execution (frontend, backend, components)
05_TESTING/             Validation (strategy, Playwright, QA logs)
06_ITERATION/           Feedback (bugs, improvements, changelog)
07_DEPLOYMENT/          Operations (env, CI/CD, releases)
08_CONTEXT/             Context (prompts, Claude memory, notes)
```

## My Key Constraint
- **Non-destructive:** Don't modify my actual code
- **Incremental:** Can implement Phase A first, Phase B/C later
- **Portable:** Works whether I'm starting fresh or mid-build
- **Practical:** No empty folders (fill as I go)

## What I Need

1. **Current State Analysis**
   - What layers am I missing?
   - What's my maturity level?
   - Which gaps are critical?

2. **Gap Scoring**
   - Rate each layer (critical, important, deferrable)
   - Show impact of each gap
   - Prioritize what to fix first

3. **Implementation Plan**
   - Phase A (Week 1): Critical layers
   - Phase B (Week 2-3): Important layers
   - Phase C (Week 4+): Future layers
   - Day-by-day breakdown for Phase A
   - Templates for key files (GUARDRAILS.md, ADRs, STRATEGY.md)

4. **Templates**
   - 00_SYSTEM/GUARDRAILS.md template (enforcement rules)
   - ADR template (Architecture Decision Records)
   - 05_TESTING/STRATEGY.md template
   - 02_RESEARCH/INSIGHTS_SUMMARY.md template

5. **Success Criteria**
   - Checklist for Phase A completion
   - How to know it's working
   - Benefits per phase

## Additional Context
[Add any specific details about your project, team, or constraints]

Please analyze, score, and provide a specific, actionable refinement plan 
that I can start implementing this week.
```

---

## 🎯 WORKFLOW (How to Use This Template)

### Scenario 1: Starting Fresh

```
1. Create /tmp/audit_project.sh (paste AUDIT SCRIPT above)
2. Run: bash audit_project.sh /path/to/your/new/project
3. Review audit output
4. Copy REFINEMENT PROMPT → Paste into Claude Code
5. Claude Code generates analysis + plan
6. Execute Phase A (create 9 folders + key files)
7. Build your project WITHIN this structure
```

### Scenario 2: Mid-Build Refinement (Like You)

```
1. Run audit script on your existing project
2. See current state vs ideal
3. Copy REFINEMENT PROMPT → Paste into Claude Code
4. Claude Code analyzes what you have + what's missing
5. Execute Phase A (add missing critical layers WITHOUT touching code)
6. Phase B in parallel with your ongoing development
7. Phase C post-MVP
```

### Scenario 3: Team Handoff

```
1. Run audit script
2. Generate refinement plan
3. Execute Phase A immediately (guardrails, decisions, research org)
4. Next team member can read GUARDRAILS.md + understand the system
5. All decisions are traceable (ADRs)
6. Testing strategy is visible (STRATEGY.md)
7. Clean handoff
```

---

## 🔑 Key Principles (Non-Destructive)

✓ **This template:**
- Audits, doesn't modify
- Recommends, doesn't force
- Structures docs, leaves code alone
- Works at any project stage
- Can be done in parallel with development

✓ **Safe to run at any time:**
- Pre-build: Establish structure before code
- Mid-build: Add structure around existing code (no rewrites)
- Post-MVP: Retrofit structure for clarity
- Pre-fundraising: Lock in decision docs + audit trail

---

## 🚀 Copy-Paste Instructions

### For Claude Code:

```
1. Copy the AUDIT SCRIPT section
2. Save as: /tmp/audit_project.sh
3. Run: bash /tmp/audit_project.sh /path/to/your/project
4. Review output
5. Copy REFINEMENT PROMPT section
6. Start new conversation in Claude Code
7. Paste REFINEMENT PROMPT
8. Claude Code analyzes + generates plan
9. Execute implementation
```

### For Claude Web Chat:

```
1. Copy REFINEMENT PROMPT
2. Paste into chat
3. Modify placeholders ({PROJECT_NAME}, {STAGE}, etc.)
4. Send
5. Claude analyzes your project structure
6. Receives detailed refinement plan
7. Can then paste into Claude Code for execution
```

---

## 📊 What Gets Generated

**Audit Report includes:**
- Current directory structure (visual tree)
- File inventory (MDs, code, tests, config)
- Existing system documents
- Gap analysis vs 9 layers
- Layer scoring (critical → deferrable)
- Recommended Phase A/B/C timeline

**Refinement Plan includes:**
- Executive summary
- Multi-perspective analysis (if you use full LLM Council)
- Detailed implementation (day-by-day)
- Templates (GUARDRAILS.md, ADRs, STRATEGY.md)
- Success criteria
- ROI calculation

---

## ✅ Safety Guarantees

🔒 **Your code is never touched:**
- Audit is read-only
- Recommendations are separate from execution
- You approve before anything changes
- Can run audit, decide not to refine, no harm done

🔒 **Works with existing structure:**
- If you already have `/docs`, it stays
- If you have `/tests`, it stays
- New layers are ADDED, not replacements
- Existing files are reorganized, not deleted

🔒 **Reversible:**
- If Phase A doesn't feel right, you can undo
- Files are created fresh (not overwrites)
- Your development continues unaffected

---

## 🎬 TL;DR - Quick Start

1. **Audit your project:**
   ```bash
   bash audit_project.sh /path/to/your/project
   ```

2. **Copy refinement prompt** (from above) → Paste into Claude Code

3. **Execute Phase A** (1 week, 7-8 hours)

4. **See clarity emerge** (guardrails, decisions, research org)

5. **Phases B/C follow** (parallel with your development)

---

## 📞 Customization

This template works for:
- ✓ Next.js + Supabase (like SyncMaster)
- ✓ Python + Django/FastAPI
- ✓ Go + microservices
- ✓ Monorepos
- ✓ Greenfield projects
- ✓ Mature codebases needing restructuring
- ✓ Solo founder
- ✓ Small teams
- ✓ Growing teams

Just adjust placeholders in REFINEMENT PROMPT to match your tech stack + stage.

---

## 🎯 You're Ready

Save this file. Use it for:
- Current project (SyncMaster)
- Next project
- Team onboarding
- Any agent/Claude instance

It's a template, not a one-time tool.

---

*End of Universal Project Refinement Template*
