# Claude Code Quick Start — Using the Refinement Template

> **For:** Claude Code desktop users
> **Purpose:** Copy-paste workflow to refine any project
> **Time:** 10 minutes to set up, 1 week to execute Phase A

---

## 🚀 Step-by-Step: Claude Code Workflow

### Step 1: Get the Template Files

All files are in `/mnt/user-data/outputs/`:

- `UNIVERSAL_REFINEMENT_TEMPLATE.md` ← **Start here**
- `SYNCMASTER_AUDIT_REPORT.md` ← Reference
- `SYNCMASTER_REFINEMENT_PLAN.md` ← Reference
- `README.md` ← Index

Copy these to your Claude Code workspace or keep them handy.

---

### Step 2: Prepare Your Project

In Claude Code terminal:

```bash
# Navigate to your project
cd /path/to/your/project

# View current structure
ls -la

# Optional: Save current state
git add . && git commit -m "Before refinement" 2>/dev/null || echo "Not a git repo, that's fine"
```

**Why:** Establishes baseline before any changes.

---

### Step 3: Run the Audit Script

```bash
# Copy the AUDIT SCRIPT section from UNIVERSAL_REFINEMENT_TEMPLATE.md
# Save it locally in Claude Code:

cat > /tmp/audit_my_project.sh << 'EOF'
[PASTE THE ENTIRE AUDIT SCRIPT HERE]
EOF

chmod +x /tmp/audit_my_project.sh

# Run it on your project
/tmp/audit_my_project.sh /path/to/your/project your-project-name
```

**What happens:**
- Script scans your directory structure
- Counts files by type
- Checks for existing system docs
- Generates audit report
- Saves to `/tmp/your-project-name_audit_*.md`

**Review the audit:**
```bash
# See the report
cat /tmp/your-project-name_audit_*.md

# Or open in Claude Code to read
```

---

### Step 4: Copy the Refinement Prompt

From `UNIVERSAL_REFINEMENT_TEMPLATE.md`, copy the section:

```
## 💬 REFINEMENT PROMPT (Copy & Paste into Claude Code)
```

It starts with:
```
# Project Refinement Analysis

I want to audit and refine my project structure...
```

---

### Step 5: Fill in Your Project Details

In the prompt, replace these placeholders:

```
{PROJECT_NAME}         → Your actual project name (e.g., "SyncMaster")
{PRE_BUILD | MID_BUILD | POST_MVP}  → Your current stage
{YOUR_TECH_STACK}      → e.g., "Next.js 14, TypeScript, Supabase, Playwright"
{SOLO | SMALL_TEAM | GROWING}       → Your team size
{YOUR_URGENCY}         → e.g., "Phase 2 complete in 3 weeks"
[Describe your current folder layout]  → Paste output from audit
[Add any specific details]             → Your constraints/context
```

**Example for SyncMaster:**
```
- **Project:** SyncMaster Phase 2
- **Stage:** MID_BUILD
- **Tech Stack:** Next.js 14, TypeScript, Supabase (PostgreSQL + RLS), 
  Playwright, Inngest, Stripe Connect, Resend, PostHog
- **Team Size:** SOLO (founder Dakol, hiring 1 engineer in 2 months)
- **Deadline/Urgency:** Phase 2 complete in 3 weeks; Series C prep

## Current Structure
[Paste tree output or list your key folders]

## Additional Context
- Local Claude Code desktop environment
- Supabase RLS is non-negotiable for security
- Playwright tests exist but not centrally organized
- Need handoff-ready documentation
- Emphasis on decision traceability (for investors)
```

---

### Step 6: Start Claude Code Conversation

In Claude Code:

```
1. New conversation
2. Paste the filled-in REFINEMENT PROMPT
3. Send
```

**Claude Code will generate:**
- Current state analysis
- Gap scoring (which layers are critical)
- Implementation plan (Phase A/B/C with timeline)
- Templates for key files
- Success criteria
- ROI breakdown

---

### Step 7: Review & Approve

Claude Code will show:
- What your project needs
- Priority ranking (critical → deferrable)
- Day-by-day breakdown for Phase A
- Exact file templates

**Read it. Ask questions. Approve or iterate.**

---

### Step 8: Execute Phase A

Once approved, tell Claude Code:

```
"Implement the refinement plan Phase A for {PROJECT_NAME}.

Start with:
1. Create folder structure (00_SYSTEM/, 02_RESEARCH/, etc.)
2. Generate GUARDRAILS.md from template
3. Generate ADR-001, ADR-002, ADR-003
4. Generate RESEARCH/INSIGHTS_SUMMARY.md
5. Generate TESTING/STRATEGY.md

Timeline: Execute over next week, 7-8 hours total.
Non-destructive: No code changes, documentation only.
"
```

**Claude Code will:**
- Create all Phase A folders
- Generate template files
- Show what was created
- Ready to code against

---

### Step 9: Build Your Project

Your project structure is now:

```
your-project/
├── 00_SYSTEM/
│   ├── WORKFLOW.md
│   ├── GUARDRAILS.md
│   └── TOOLING.md
├── 02_RESEARCH/
│   ├── REDDIT/
│   ├── TECH/
│   └── INSIGHTS_SUMMARY.md
├── 03_ARCHITECTURE/
│   └── DECISIONS/
│       ├── ADR-001-[title].md
│       ├── ADR-002-[title].md
│       └── ADR-003-[title].md
├── 05_TESTING/
│   ├── STRATEGY.md
│   └── PLAYWRIGHT/
│       └── test-cases.md
├── [your-actual-code/]
├── [your-tests/]
└── claude.md (if you have it)
```

**Now you can:**
- Code features (knowing guardrails)
- Reference decisions (via ADRs)
- Understand testing philosophy (STRATEGY.md)
- Know what's researched vs speculative

---

### Step 10: Phase B (Week 2-3, Parallel with Code)

As you build features:

```
"Add Phase B refinement as we develop:

For each feature:
1. Create 01_PRD/FEATURES/{feature-name}.md (spec)
2. Create 04_BUILD/{layer}/{feature-name}.md (implementation notes)
3. Add to 05_TESTING/PLAYWRIGHT/test-cases.md
4. Update 06_ITERATION/CHANGELOG.md weekly

This stays parallel with actual code development."
```

---

## 🧠 Key Commands (Copy-Paste Ready)

### Command 1: Run Full Audit
```bash
cat > /tmp/audit.sh << 'AUDIT'
[PASTE AUDIT SCRIPT]
AUDIT
bash /tmp/audit.sh /path/to/project project-name
```

### Command 2: Refined Audit (Your Project Already)
```bash
# Just output current structure
ls -la /path/to/project | head -50
find /path/to/project -name "*.md" | head -20
find /path/to/project -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l
```

### Command 3: Show Current Maturity
```bash
echo "=== Current Maturity Check ==="
echo "System files (00_SYSTEM/):" && ls -la 00_SYSTEM/ 2>/dev/null | wc -l || echo "Missing"
echo "Architecture decisions (03_ARCHITECTURE/DECISIONS/):" && ls -la 03_ARCHITECTURE/DECISIONS/ 2>/dev/null | wc -l || echo "Missing"
echo "Research org (02_RESEARCH/):" && ls -la 02_RESEARCH/ 2>/dev/null | wc -l || echo "Missing"
echo "Testing strategy (05_TESTING/):" && ls -la 05_TESTING/ 2>/dev/null | wc -l || echo "Missing"
```

---

## 🎯 Common Workflows

### Workflow A: "I'm starting a new project"

```
1. Create project folder
2. Run audit script (will show empty/minimal)
3. Paste refinement prompt into Claude Code
4. Get full 9-layer structure template
5. Create folder structure before coding
6. Code within clear structure
```

### Workflow B: "I'm mid-project and need structure" (Like You)

```
1. Run audit on existing project
2. Paste refinement prompt + audit output
3. Claude Code identifies gaps
4. Phase A creates missing critical layers
5. Existing code is untouched
6. New documentation layers support ongoing development
```

### Workflow C: "I'm wrapping up MVP and need fundraising docs"

```
1. Run audit
2. Phase A: Lock in decisions (ADRs)
3. Phase B: Document what was built
4. Phase C: Add deployment docs
5. Investors see decision trail + architecture
```

### Workflow D: "New engineer joining, need handoff"

```
1. Run audit
2. Execute Phase A (if not done)
3. New engineer reads GUARDRAILS.md first
4. New engineer reads ADRs for decisions
5. New engineer sees testing strategy
6. Clean onboarding, no confusion
```

---

## 🔒 Safety: Nothing Breaks

✓ **What happens:**
- Folders are created
- Templates are generated
- Your code directory untouched
- Existing files preserved
- Can be reversed (git checkout)

✓ **What doesn't happen:**
- Code isn't rewritten
- Files aren't moved
- No destructive operations
- No overwriting existing docs
- Your development isn't interrupted

---

## ⏱️ Time Investment

| Step | Time |
|------|------|
| Audit | 5 minutes |
| Review refinement plan | 15 minutes |
| Phase A execution | 7-8 hours (over 1 week) |
| Phase B (parallel with code) | Embedded in development |
| **Total to Phase A complete** | **≈ 1 week** |
| Benefit | 2-3 weeks saved later |

---

## 🚀 TL;DR - Copy & Paste Right Now

### In Claude Code Terminal:

```bash
# 1. Save audit script
cat > /tmp/audit.sh << 'SCRIPT'
[PASTE ENTIRE AUDIT SCRIPT FROM TEMPLATE]
SCRIPT

# 2. Run it
bash /tmp/audit.sh /path/to/your/project your-project-name

# 3. Review output
cat /tmp/your-project-name_audit_*.md
```

### In Claude Code Chat:

```
[PASTE REFINEMENT PROMPT from template]

[Fill in your details]

Send.
```

### Claude Code will:
- Analyze your structure
- Show what's missing
- Provide Phase A plan
- Give you templates

### You then execute:
```
"Create Phase A structure from the plan you just gave me"
```

Done. 1 week later, you have guardrails + decisions + clarity.

---

## 📞 Troubleshooting

**Q: "Audit script doesn't run"**
A: Make sure you saved it with `cat > /tmp/audit.sh` and added `chmod +x /tmp/audit.sh`

**Q: "Claude Code doesn't understand the refinement prompt"**
A: Make sure you filled in the placeholders ({PROJECT_NAME}, etc.)

**Q: "I want to run this on SyncMaster right now"**
A: All the files are already in `/mnt/user-data/outputs/` — copy SYNCMASTER_REFINEMENT_PLAN.md into Claude Code

**Q: "Can I do Phase B before finishing Phase A?"**
A: Yes, but Phase A is critical first (guardrails, decisions). Phase B can be parallel with coding.

---

## ✨ You're Ready

Save this file. The template is:
- ✓ Non-destructive
- ✓ Copy-paste ready
- ✓ Works at any stage
- ✓ Reusable for every project
- ✓ Portable between Claude instances

Use it for SyncMaster, next project, team builds, etc.

---

*End of Claude Code Quick Start*
