# 🚀 Quick Start: One-Command Refinement

## What It Does

You run **ONE command** in Claude Code. Then answer **YES/NO** for each step. That's it.

The script builds your entire refinement system automatically.

---

## Step 1: Get the Script

**Option A: From the ZIP**
```bash
# After extracting the ZIP:
cp refinement_builder.sh /path/to/your/project
cd /path/to/your/project
chmod +x refinement_builder.sh
```

**Option B: Direct (if you already have it)**
```bash
bash refinement_builder.sh /path/to/project project-name
```

---

## Step 2: Paste Into Claude Code

Copy this and paste into Claude Code conversation:

```
Run the refinement builder on my project:

bash refinement_builder.sh . {ProjectName}

I'll answer yes/no at each step. Build both Phase A and Phase B, then commit to git.
```

That's literally all you paste.

---

## Step 3: Answer YES/NO

Script will ask:

**Q1: "Continue with refinement planning?"**
- YES → proceeds to next step
- NO → exits (you can run again later)

**Q2: "Build Phase A now?"**
- YES → creates critical layers (GUARDRAILS, ADRs, STRATEGY)
- NO → skip Phase A

**Q3: "Also build Phase B?"**
- YES → creates PRD, BUILD, ITERATION folders
- NO → Phase A only

**Q4: "Commit to git?"**
- YES → `git add` + `git commit` (automatic)
- NO → skip commit (you'll do it manually)

---

## What Gets Built

### Phase A (Always recommended - YES)
```
00_SYSTEM/
  ✓ GUARDRAILS.md (rules for team)
  ✓ WORKFLOW.md (build process)
  ✓ TOOLING.md (tools list)

02_RESEARCH/
  ✓ INSIGHTS_SUMMARY.md (findings)

03_ARCHITECTURE/DECISIONS/
  ✓ ADR-001-auth.md (why magic link?)
  ✓ ADR-002-rls.md (why RLS at DB?)
  ✓ ADR-003-playwright.md (why Playwright?)

05_TESTING/
  ✓ STRATEGY.md (testing philosophy)
  ✓ PLAYWRIGHT/test-cases.md (test specs)
```

### Phase B (Nice to have - YES if time)
```
01_PRD/FEATURES/ (feature specs)
04_BUILD/ (build documentation)
06_ITERATION/ (bugs, improvements, changelog)
```

---

## Real Example: SyncMaster

```bash
$ bash refinement_builder.sh . SyncMaster

╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║         🎯 SyncMaster Refinement System - Interactive Builder             ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

════════════════════════════════════════════════════════════════════════════
STEP 1: AUDIT YOUR PROJECT
════════════════════════════════════════════════════════════════════════════

Analyzing: .
Project: SyncMaster

📊 Current State:
  • Markdown files: 12
  • Code files: 150
  • Test files: 8
  ✓ claude.md exists
  ✓ docs/ folder exists
  ✗ 00_SYSTEM/ missing

Continue with refinement planning? (yes/no):
> yes

════════════════════════════════════════════════════════════════════════════
STEP 2: REVIEW REFINEMENT PLAN
════════════════════════════════════════════════════════════════════════════

PHASE A (Critical - Week 1):
  ✓ 00_SYSTEM/ (workflow, guardrails, tooling)
  ✓ 02_RESEARCH/ (knowledge organization)
  ✓ 03_ARCHITECTURE/DECISIONS/ (ADRs)
  ✓ 05_TESTING/ (strategy)

PHASE B (Important - Week 2-3):
  ✓ 01_PRD/FEATURES/
  ✓ 04_BUILD/
  ✓ 06_ITERATION/

Build Phase A now? (yes/no):
> yes

Also build Phase B? (yes/no):
> yes

════════════════════════════════════════════════════════════════════════════
STEP 3: CREATE FOLDER STRUCTURE
════════════════════════════════════════════════════════════════════════════

→ Creating Phase A folders...
✓ Created: ./00_SYSTEM
✓ Created: ./02_RESEARCH/REDDIT
✓ Created: ./02_RESEARCH/TECH
✓ Created: ./03_ARCHITECTURE/DECISIONS
✓ Created: ./05_TESTING/PLAYWRIGHT

→ Creating Phase B folders...
✓ Created: ./01_PRD/FEATURES
✓ Created: ./01_PRD/USER_FLOWS
✓ Created: ./04_BUILD/FRONTEND
✓ Created: ./04_BUILD/BACKEND
✓ Created: ./04_BUILD/COMPONENTS
✓ Created: ./06_ITERATION

════════════════════════════════════════════════════════════════════════════
STEP 4: GENERATE TEMPLATE FILES
════════════════════════════════════════════════════════════════════════════

→ Generating 00_SYSTEM/GUARDRAILS.md...
→ Generating 00_SYSTEM/WORKFLOW.md...
→ Generating 00_SYSTEM/TOOLING.md...
→ Generating 02_RESEARCH/INSIGHTS_SUMMARY.md...
→ Generating 03_ARCHITECTURE/DECISIONS/ADR-001-auth.md...
→ Generating 03_ARCHITECTURE/DECISIONS/ADR-002-rls.md...
→ Generating 03_ARCHITECTURE/DECISIONS/ADR-003-playwright.md...
→ Generating 05_TESTING/STRATEGY.md...
→ Generating 05_TESTING/PLAYWRIGHT/test-cases.md...
→ Generating 01_PRD/OVERVIEW.md...
→ Generating 04_BUILD/README.md...
→ Generating 06_ITERATION/README.md...

════════════════════════════════════════════════════════════════════════════
STEP 5: VERIFICATION
════════════════════════════════════════════════════════════════════════════

Phase A Files:
✓ ./00_SYSTEM/
✓ ./00_SYSTEM/GUARDRAILS.md
✓ ./00_SYSTEM/WORKFLOW.md
✓ ./00_SYSTEM/TOOLING.md
✓ ./02_RESEARCH/
✓ ./02_RESEARCH/INSIGHTS_SUMMARY.md
✓ ./03_ARCHITECTURE/DECISIONS/
✓ ./03_ARCHITECTURE/DECISIONS/ADR-001-auth.md
✓ ./03_ARCHITECTURE/DECISIONS/ADR-002-rls.md
✓ ./03_ARCHITECTURE/DECISIONS/ADR-003-playwright.md
✓ ./05_TESTING/PLAYWRIGHT/
✓ ./05_TESTING/STRATEGY.md
✓ ./05_TESTING/PLAYWRIGHT/test-cases.md

Phase B Files:
✓ ./01_PRD/FEATURES/
✓ ./01_PRD/OVERVIEW.md
✓ ./04_BUILD/
✓ ./04_BUILD/README.md
✓ ./06_ITERATION/
✓ ./06_ITERATION/README.md

════════════════════════════════════════════════════════════════════════════
✅ COMPLETE!
════════════════════════════════════════════════════════════════════════════

Your refinement structure is ready!

NEXT STEPS:

1. Review the generated files
   → GUARDRAILS.md (rules for your team)
   → ADR-*.md (decision rationale)
   → STRATEGY.md (testing philosophy)

2. Start using the structure
   → Create features with 01_PRD/FEATURES/[name].md
   → Write tests first: 05_TESTING/PLAYWRIGHT/[name]-cases.md
   → Build with guardrails in mind

3. Keep it fresh
   → Update 02_RESEARCH/INSIGHTS_SUMMARY.md weekly
   → Track bugs in 06_ITERATION/BUGS.md
   → Update CHANGELOG.md per sprint

Commit to git? (yes/no):
> yes

✓ Changes committed

Done! Your refinement system is live.
```

---

## Time Breakdown

| What | Time |
|------|------|
| Run script + answer YES/NO | 2-3 minutes |
| Folders created | Automatic |
| Files generated | Automatic |
| Verification | Automatic |
| Git commit | Automatic |
| **Total** | **2-3 minutes** |

---

## After Build

### What You Have Now
```
✓ Guardrails for team (GUARDRAILS.md)
✓ Decision trail (ADR-001-003)
✓ Testing strategy (STRATEGY.md)
✓ Research org (INSIGHTS_SUMMARY.md)
✓ Feature structure (01_PRD/FEATURES/)
✓ Build docs structure (04_BUILD/)
✓ Iteration tracking (06_ITERATION/)
```

### What You Do Next
1. Read GUARDRAILS.md (understand the rules)
2. Customize as needed
3. Start building features:
   - Create 01_PRD/FEATURES/[feature].md
   - Write tests in 05_TESTING/PLAYWRIGHT/
   - Build in 04_BUILD/
4. Update weekly:
   - INSIGHTS_SUMMARY.md (research)
   - CHANGELOG.md (progress)
   - BUGS.md (issues)

---

## Troubleshooting

**Q: Script says "No such file or directory"**
A: Make sure you're in the right directory. Run from project root.

**Q: It asks for permission (sudo)?**
A: You shouldn't need sudo. If you do, there's a permissions issue with your project folder.

**Q: Can I run it twice?**
A: Yes! Folders that exist are skipped. Files are overwritten (but that's fine if you haven't customized them yet).

**Q: What if I don't want to commit?**
A: Say NO to the git question. You can commit manually later.

---

## That's It

Run command. Answer YES/NO. Done.

All files created. Structure locked in. Ready to build.

**2-3 minutes to complete refinement.**
