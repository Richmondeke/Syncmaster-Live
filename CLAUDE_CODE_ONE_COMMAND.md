# Claude Code One-Command Refinement Builder

## 🚀 Usage (Copy & Paste Into Claude Code)

```
I want to build my project refinement system with minimal interaction.

I have: refinement_builder.sh in my project
I want: You to run it interactively, I'll answer yes/no for each step

Command:
bash refinement_builder.sh /path/to/your/project your-project-name

Just ask me yes/no at each step. I'll approve:
  - Continuing after audit
  - Building Phase A (critical layers)
  - Building Phase B (important layers)
  - Committing to git

Then you'll create all the folders and template files automatically.
```

---

## 📋 What Will Happen

**Claude Code will:**

1. ✓ Audit your project (MDs, code, tests)
2. ✓ Ask: "Continue with planning?" (YES/NO)
3. ✓ Show Phase A/B/C plan
4. ✓ Ask: "Build Phase A?" (YES/NO)
5. ✓ Ask: "Build Phase B?" (YES/NO)
6. ✓ Create all folders
7. ✓ Generate template files (GUARDRAILS.md, ADRs, STRATEGY.md, etc.)
8. ✓ Verify everything was created
9. ✓ Ask: "Commit to git?" (YES/NO)
10. ✓ Done

**You only say: YES or NO**

---

## 📂 What Gets Created

### Phase A (Always offers)
```
00_SYSTEM/
  ├── GUARDRAILS.md (enforcement rules)
  ├── WORKFLOW.md (build process)
  └── TOOLING.md (tools inventory)

02_RESEARCH/
  ├── REDDIT/
  ├── TECH/
  └── INSIGHTS_SUMMARY.md (weekly findings)

03_ARCHITECTURE/DECISIONS/
  ├── ADR-001-auth.md
  ├── ADR-002-rls.md
  └── ADR-003-playwright.md

05_TESTING/PLAYWRIGHT/
  ├── test-cases.md
  └── STRATEGY.md
```

### Phase B (Optional)
```
01_PRD/
  ├── FEATURES/
  ├── USER_FLOWS/
  └── OVERVIEW.md

04_BUILD/
  ├── FRONTEND/
  ├── BACKEND/
  ├── COMPONENTS/
  └── README.md

06_ITERATION/
  ├── BUGS.md
  ├── IMPROVEMENTS.md
  ├── CHANGELOG.md
  └── README.md
```

---

## 🎯 Three Scenarios

### Scenario 1: Quick Phase A Only
```
Start: bash refinement_builder.sh . your-project
Step 1: YES (continue with planning)
Step 2: YES (build Phase A)
Step 3: NO (skip Phase B)
Step 4: YES (commit to git)
Result: Phase A created in ~5 minutes
```

### Scenario 2: Phase A + B
```
Start: bash refinement_builder.sh . your-project
Step 1: YES
Step 2: YES (Phase A)
Step 3: YES (Phase B)
Step 4: YES (commit)
Result: Both phases created in ~10 minutes
```

### Scenario 3: Just Audit, Decide Later
```
Start: bash refinement_builder.sh . your-project
Step 1: NO (after audit)
Result: Audit shown, script exits
You can run again anytime to actually build
```

---

## ✅ Instructions for Claude Code

1. **Save the script:**
   ```bash
   # In Claude Code terminal, from your project root:
   cp /path/to/refinement_builder.sh .
   chmod +x refinement_builder.sh
   ```

2. **Run it:**
   ```bash
   bash refinement_builder.sh . my-project-name
   ```

3. **Answer YES/NO at each prompt**

4. **Done** — all files created

---

## 📝 Script Features

✓ **Non-destructive** — Creates only new files, doesn't modify existing
✓ **Colored output** — Easy to read progress
✓ **Verification** — Shows what was created
✓ **Git-aware** — Commits if repo exists
✓ **Customizable** — Edit templates as needed after creation
✓ **Idempotent** — Safe to run again (checks if folders exist)

---

## 🚀 One-Liner for SyncMaster

```bash
bash refinement_builder.sh /path/to/syncmaster SyncMaster
```

Then answer:
- YES (continue)
- YES (Phase A)
- YES (Phase B)  
- YES (commit)

Done in 2 minutes. Files built automatically.

---

## 💡 After Build

1. Review generated files
2. Customize GUARDRAILS.md for your team
3. Add more ADRs as decisions arise
4. Update INSIGHTS_SUMMARY.md weekly
5. Start using the structure immediately

---

*Just copy the command at top, paste into Claude Code. I'll guide you through YES/NO prompts.*
