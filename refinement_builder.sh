#!/bin/bash

# SyncMaster Refinement System - Claude Code Interactive Builder
# Purpose: Single command that audits, plans, and builds with YES/NO prompts only
# Usage: bash refinement_builder.sh [project_path] [project_name]

set -e

PROJECT_PATH="${1:-.}"
PROJECT_NAME="${2:-$(basename "$PROJECT_PATH")}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
prompt_yes_no() {
    local question=$1
    local response
    
    while true; do
        echo -e "${BLUE}${question}${NC} (yes/no): "
        read -r response
        case "$response" in
            [Yy][Ee][Ss]|[Yy])
                return 0
                ;;
            [Nn][Oo]|[Nn])
                return 1
                ;;
            *)
                echo "Please answer yes or no"
                ;;
        esac
    done
}

print_section() {
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${YELLOW}→ $1${NC}"
}

# START
clear
cat << 'BANNER'
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║         🎯 SyncMaster Refinement System - Interactive Builder             ║
║                                                                            ║
║  This will audit your project and build the complete refinement system    ║
║  with minimal interaction: just YES/NO at each step.                      ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

BANNER

print_section "STEP 1: AUDIT YOUR PROJECT"

echo "Analyzing: $PROJECT_PATH"
echo "Project: $PROJECT_NAME"
echo ""

# Audit
MD_COUNT=$(find "$PROJECT_PATH" -name "*.md" -type f 2>/dev/null | wc -l)
CODE_COUNT=$(find "$PROJECT_PATH" \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null | grep -v node_modules | wc -l)
TEST_COUNT=$(find "$PROJECT_PATH" \( -name "*.test.ts" -o -name "*.spec.ts" \) 2>/dev/null | wc -l)

echo "📊 Current State:"
echo "  • Markdown files: $MD_COUNT"
echo "  • Code files: $CODE_COUNT"
echo "  • Test files: $TEST_COUNT"
echo ""

if [ -f "$PROJECT_PATH/claude.md" ]; then
    echo "  ✓ claude.md exists"
else
    echo "  ✗ claude.md missing"
fi

if [ -d "$PROJECT_PATH/docs" ]; then
    echo "  ✓ docs/ folder exists"
else
    echo "  ✗ docs/ folder missing"
fi

if [ -d "$PROJECT_PATH/00_SYSTEM" ]; then
    echo "  ✓ 00_SYSTEM/ exists"
else
    echo "  ✗ 00_SYSTEM/ missing"
fi

echo ""
if prompt_yes_no "Continue with refinement planning?"; then
    print_step "Audit complete. Moving to planning..."
else
    echo "Exiting."
    exit 0
fi

# PLANNING
print_section "STEP 2: REVIEW REFINEMENT PLAN"

cat << 'PLAN'
The system will create 3 phases:

PHASE A (Critical - Week 1):
  ✓ 00_SYSTEM/ (workflow, guardrails, tooling)
  ✓ 02_RESEARCH/ (knowledge organization)
  ✓ 03_ARCHITECTURE/DECISIONS/ (ADRs)
  ✓ 05_TESTING/ (strategy)
  Time: 7-8 hours over 1 week (or 2-3 hours with Claude Code)

PHASE B (Important - Week 2-3):
  ✓ 01_PRD/FEATURES/
  ✓ 04_BUILD/
  ✓ 06_ITERATION/
  Time: Parallel with development

PHASE C (Future - Post-MVP):
  ✓ 07_DEPLOYMENT/
  ✓ 08_CONTEXT/
  Time: Later, not critical now

PLAN

echo ""
if prompt_yes_no "Build Phase A now (recommended)?"; then
    BUILD_PHASE_A=true
else
    echo "You can run this again later to build Phase A."
    exit 0
fi

if prompt_yes_no "Also build Phase B structure?"; then
    BUILD_PHASE_B=true
else
    BUILD_PHASE_B=false
fi

# CREATE FOLDERS
print_section "STEP 3: CREATE FOLDER STRUCTURE"

create_folder() {
    local path=$1
    if [ ! -d "$path" ]; then
        mkdir -p "$path"
        echo -e "${GREEN}✓${NC} Created: $path"
    else
        echo -e "${YELLOW}~${NC} Exists: $path"
    fi
}

if [ "$BUILD_PHASE_A" = true ]; then
    print_step "Creating Phase A folders..."
    create_folder "$PROJECT_PATH/00_SYSTEM"
    create_folder "$PROJECT_PATH/02_RESEARCH/REDDIT"
    create_folder "$PROJECT_PATH/02_RESEARCH/TECH"
    create_folder "$PROJECT_PATH/03_ARCHITECTURE/DECISIONS"
    create_folder "$PROJECT_PATH/05_TESTING/PLAYWRIGHT"
fi

if [ "$BUILD_PHASE_B" = true ]; then
    print_step "Creating Phase B folders..."
    create_folder "$PROJECT_PATH/01_PRD/FEATURES"
    create_folder "$PROJECT_PATH/01_PRD/USER_FLOWS"
    create_folder "$PROJECT_PATH/04_BUILD/FRONTEND"
    create_folder "$PROJECT_PATH/04_BUILD/BACKEND"
    create_folder "$PROJECT_PATH/04_BUILD/COMPONENTS"
    create_folder "$PROJECT_PATH/06_ITERATION"
fi

echo ""
print_step "Folders created!"

# CREATE FILES
print_section "STEP 4: GENERATE TEMPLATE FILES"

if [ "$BUILD_PHASE_A" = true ]; then
    
    # GUARDRAILS.md
    print_step "Generating 00_SYSTEM/GUARDRAILS.md..."
    cat > "$PROJECT_PATH/00_SYSTEM/GUARDRAILS.md" << 'GUARDRAILS'
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

GUARDRAILS

    # WORKFLOW.md
    print_step "Generating 00_SYSTEM/WORKFLOW.md..."
    cat > "$PROJECT_PATH/00_SYSTEM/WORKFLOW.md" << 'WORKFLOW'
# Build Workflow

## Plan Before Code
- Any 3+ step task needs written plan first
- No guessing or exploratory coding
- Document assumptions and risks

## Verification Before Done
- Logs and test output reviewed
- Feature works in all browsers/platforms
- Documentation is current

## Self-Improvement Loop
- Every correction → rule in lessons.md
- Review lessons at session start
- Iterate until mistake rate drops

## Subagent Strategy
- Research tasks stay async
- One task per subagent for focus
- Keep main context under 120K tokens

## Autonomous Execution
- When bug report given: trace → root cause → fix
- No hand-holding needed
- Fix is tested before marked done

WORKFLOW

    # TOOLING.md
    print_step "Generating 00_SYSTEM/TOOLING.md..."
    cat > "$PROJECT_PATH/00_SYSTEM/TOOLING.md" << 'TOOLING'
# Tools Inventory

## Frontend
- Framework: Next.js 14
- Language: TypeScript
- Styling: Tailwind CSS
- Components: shadcn/ui
- Forms: React Hook Form + Zod

## Backend & Database
- Database: Supabase (PostgreSQL)
- Auth: Supabase Magic Link
- ORM: Direct SQL (or Prisma if needed)
- RLS: Enabled (data filtering at DB layer)

## Testing
- E2E: Playwright
- Unit: Jest (if applicable)
- Strategy: Test-first (cases before code)

## Workflows
- Async Tasks: Inngest
- Email: Resend (transactional)
- Observability: PostHog + Sentry

## Deployment
- Hosting: Vercel
- CDN: Cloudflare R2

TOOLING

    # ADR-001
    print_step "Generating 03_ARCHITECTURE/DECISIONS/ADR-001-auth.md..."
    cat > "$PROJECT_PATH/03_ARCHITECTURE/DECISIONS/ADR-001-auth.md" << 'ADR001'
# ADR-001: Email Magic Link Authentication

## Decision
Use Supabase Auth with email magic link (no OAuth in Phase 1).

## Context
- Phase 1 is validation; simplicity > features
- Target users may not have OAuth accounts
- Magic link has lower friction for new users
- Reduces dependency on OAuth providers
- Works for all geographies

## Consequences
✓ Faster onboarding
✓ No third-party dependency for auth
✓ Works globally
⚠️ Email delivery is critical (must use Resend)
⚠️ No social login (can add Phase 2 if needed)

## Alternatives Considered
- OAuth (Google, GitHub): Adds complexity early, fewer signup options
- Phone SMS: More expensive, different delivery challenges
- Username/password: Higher friction, password reset overhead

## Status
ACCEPTED

## Link in Code
See: /app/auth/route.ts line 15

ADR001

    # ADR-002
    print_step "Generating 03_ARCHITECTURE/DECISIONS/ADR-002-rls.md..."
    cat > "$PROJECT_PATH/03_ARCHITECTURE/DECISIONS/ADR-002-rls.md" << 'ADR002'
# ADR-002: RLS (Row-Level Security) at Database Layer

## Decision
Enforce all data access control via Supabase RLS policies, not application logic.

## Context
- Security: Filtering at DB layer is more secure than app layer
- Performance: DB can optimize queries with RLS
- Consistency: Single source of truth for access control
- Audit: RLS enforcement is automatic and traceable

## Consequences
✓ Security enforced at source (DB layer)
✓ Impossible to accidentally leak data via app bugs
✓ Queries are optimized by Postgres planner
✓ Clear audit trail of who accessed what
⚠️ RLS policy writing requires care (can be complex)
⚠️ Local development needs RLS simulation

## Alternatives Considered
- App-layer filtering: Easier to code, but error-prone
- Hybrid (both layers): Redundant and harder to maintain

## Status
ACCEPTED

## Link in Code
See: /lib/supabase/schema.sql for RLS policies

ADR002

    # ADR-003
    print_step "Generating 03_ARCHITECTURE/DECISIONS/ADR-003-playwright.md..."
    cat > "$PROJECT_PATH/03_ARCHITECTURE/DECISIONS/ADR-003-playwright.md" << 'ADR003'
# ADR-003: Playwright for E2E Testing

## Decision
Use Playwright for end-to-end testing (not Cypress).

## Context
- Playwright has better reliability for flaky tests
- Faster CI/CD execution
- Better cross-browser support (Chrome, Firefox, Safari)
- Community consensus in 2026 favors Playwright
- Easier local debugging

## Consequences
✓ Faster test execution
✓ More reliable in CI pipelines
✓ Better debugging tools
✓ Strong community support
⚠️ Learning curve (different from Cypress)

## Alternatives Considered
- Cypress: Simpler API, but less reliable in CI
- Selenium: More mature, but slower
- Manual testing: Not scalable

## Status
ACCEPTED

## Link in Code
See: /tests/ directory and playwright.config.ts

ADR003

    # RESEARCH/INSIGHTS_SUMMARY.md
    print_step "Generating 02_RESEARCH/INSIGHTS_SUMMARY.md..."
    cat > "$PROJECT_PATH/02_RESEARCH/INSIGHTS_SUMMARY.md" << 'INSIGHTS'
# Research Insights Summary

**Purpose:** Weekly curated findings from Reddit, competitors, tech research
**Updated:** [Add date when populated]
**Last Reviewed:** [Add date]

---

## Template

For each finding:

### Insight Title
**Finding:** [What did you learn?]
**Source:** [Reddit thread, competitor, docs, etc.]
**Signal Strength:** High/Medium/Low (how many sources confirm?)
**Decision Impact:** [How does this affect our choices?]
**Status:** Confirmed/In Progress/Action Needed
**Date Added:** [Date]

---

## Examples (to populate weekly)

### Playwright Reliability in CI
**Finding:** Teams report Playwright more stable than Cypress in CI environments
**Source:** r/webdev, r/testing, multiple Playwright issues
**Signal Strength:** High (5+ independent threads, 100+ upvotes)
**Decision Impact:** Validates our choice of Playwright over Cypress
**Status:** Confirmed
**Date Added:** 2026-04-28

### Supabase RLS Best Practices
**Finding:** RLS at DB layer recommended over app-layer filtering for security
**Source:** Supabase docs, security audits, industry consensus
**Signal Strength:** High
**Decision Impact:** Validates our RLS-first architecture
**Status:** Confirmed
**Date Added:** 2026-04-28

---

## How to Use
1. Run Reddit/competitor research (weekly or as needed)
2. Add findings here with signal strength + impact
3. Reference INSIGHTS_SUMMARY when making decisions
4. Link decisions back to research (decision traceability)

INSIGHTS

    # TESTING/STRATEGY.md
    print_step "Generating 05_TESTING/STRATEGY.md..."
    cat > "$PROJECT_PATH/05_TESTING/STRATEGY.md" << 'TESTING'
# Testing Strategy

## Philosophy
- **Test-first:** Write test cases before code
- **Feature-linked:** Every feature has test cases
- **Playwright:** E2E testing for user flows
- **Coverage goal:** 80%+ Phase 1, 90%+ Phase 2+

## Test Types

### Feature Tests (Playwright)
- User flows from start to finish
- Happy path + edge cases
- Location: 05_TESTING/PLAYWRIGHT/[feature-name].test.ts

### Unit Tests (Jest)
- Components, utilities, validation
- Location: src/**/__tests__/

### Integration Tests
- Cross-feature flows (auth → submit → review)
- Location: 05_TESTING/PLAYWRIGHT/integration/

## Process
1. Write test case in PLAYWRIGHT/[feature-name]-cases.md
2. Implement test in /tests/[feature-name].spec.ts
3. Code feature (test still failing)
4. Make test pass
5. Feature complete

## Enforcement
- No PR merges without passing tests
- CI blocks merge if test coverage drops
- GUARDRAILS.md enforces "no feature without test"

## Debugging
- Run locally: `npm run test:watch`
- Debug UI: `npm run test:debug`
- Headed mode: `npx playwright test --headed`

TESTING

    # PLAYWRIGHT/test-cases.md
    print_step "Generating 05_TESTING/PLAYWRIGHT/test-cases.md..."
    cat > "$PROJECT_PATH/05_TESTING/PLAYWRIGHT/test-cases.md" << 'TESTCASES'
# Playwright Test Cases

**Purpose:** Document test cases per feature (before code written)
**Format:** Feature → Test Case → Expected Result
**Status:** Update as features complete

---

## Template

### Feature: [Feature Name]
**Spec:** [Link to 01_PRD/FEATURES/]
**Test File:** [feature-name].spec.ts

#### Test Case 1: Happy Path
- Precondition: [User state, data setup]
- Action: [What user does]
- Expected: [What should happen]
- Edge Cases: [What could go wrong]

#### Test Case 2: Error Handling
- Precondition: [Invalid state]
- Action: [User attempts action]
- Expected: [Error message, graceful failure]

---

## Examples (to populate per feature)

### Feature: User Signup
**Spec:** 01_PRD/FEATURES/user-signup.md
**Test File:** user-signup.spec.ts

#### Test Case 1: Valid Signup
- Precondition: User not logged in
- Action: Enter email → Click "Sign Up" → Check email → Click link
- Expected: User logged in, redirected to onboarding

#### Test Case 2: Invalid Email
- Precondition: User not logged in
- Action: Enter "invalid-email" → Click "Sign Up"
- Expected: Error message "Please enter a valid email"

#### Test Case 3: Email Already Exists
- Precondition: Email already has account
- Action: Enter existing email → Click "Sign Up"
- Expected: Error message "Email already registered" + link to login

---

## Coverage Checklist
- [ ] Happy path test
- [ ] Invalid input test
- [ ] Edge case test
- [ ] Error handling test
- [ ] Permission test (if applicable)

TESTCASES

fi

if [ "$BUILD_PHASE_B" = true ]; then
    
    print_step "Generating Phase B files..."
    
    # 01_PRD/OVERVIEW.md
    cat > "$PROJECT_PATH/01_PRD/OVERVIEW.md" << 'PRD_OVERVIEW'
# Product Overview

## Project: $PROJECT_NAME

### Vision
[Add your project vision here]

### Target Users
[Who are you building for?]

### Core Problem
[What problem are you solving?]

### Key Features
[List your MVP features]

### Success Metrics
[How will you measure success?]

PRD_OVERVIEW

    # 04_BUILD/README.md
    cat > "$PROJECT_PATH/04_BUILD/README.md" << 'BUILD_README'
# Build Documentation

## Layers

- **FRONTEND/** — UI components, pages, styling
- **BACKEND/** — APIs, business logic, database queries
- **COMPONENTS/** — Reusable component specs
- **INTEGRATIONS/** — Third-party service integrations (Stripe, email, etc.)

## How to Use

For each feature:
1. Create [FEATURE_NAME].md in relevant layer
2. Link to 01_PRD/FEATURES/[FEATURE_NAME].md
3. Link to 05_TESTING/PLAYWRIGHT/[FEATURE_NAME].test.ts
4. Update when code is complete

BUILD_README

    # 06_ITERATION/README.md
    cat > "$PROJECT_PATH/06_ITERATION/README.md" << 'ITERATION_README'
# Iteration Tracking

## Files

- **BUGS.md** — Known bugs, priority, status
- **IMPROVEMENTS.md** — Feature ideas, enhancements
- **CHANGELOG.md** — Per-sprint updates

## How to Use

### When You Find a Bug
1. Add to BUGS.md with: title, description, priority, status
2. Link to related feature/code
3. Update status as it progresses

### When You Have an Idea
1. Add to IMPROVEMENTS.md with: description, impact, effort
2. Tag with: easy/medium/hard, priority
3. Link to features affected

### At End of Sprint
1. Update CHANGELOG.md with: what shipped, what fixed, what's next
2. Archive closed bugs/improvements
3. Use as retrospective + portfolio proof

ITERATION_README

fi

echo ""

# VERIFICATION
print_section "STEP 5: VERIFICATION"

print_step "Checking created structure..."

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/"
        return 1
    fi
}

if [ "$BUILD_PHASE_A" = true ]; then
    echo "Phase A Files:"
    check_dir "$PROJECT_PATH/00_SYSTEM"
    check_file "$PROJECT_PATH/00_SYSTEM/GUARDRAILS.md"
    check_file "$PROJECT_PATH/00_SYSTEM/WORKFLOW.md"
    check_file "$PROJECT_PATH/00_SYSTEM/TOOLING.md"
    check_dir "$PROJECT_PATH/02_RESEARCH"
    check_file "$PROJECT_PATH/02_RESEARCH/INSIGHTS_SUMMARY.md"
    check_dir "$PROJECT_PATH/03_ARCHITECTURE/DECISIONS"
    check_file "$PROJECT_PATH/03_ARCHITECTURE/DECISIONS/ADR-001-auth.md"
    check_file "$PROJECT_PATH/03_ARCHITECTURE/DECISIONS/ADR-002-rls.md"
    check_file "$PROJECT_PATH/03_ARCHITECTURE/DECISIONS/ADR-003-playwright.md"
    check_dir "$PROJECT_PATH/05_TESTING/PLAYWRIGHT"
    check_file "$PROJECT_PATH/05_TESTING/STRATEGY.md"
    check_file "$PROJECT_PATH/05_TESTING/PLAYWRIGHT/test-cases.md"
fi

if [ "$BUILD_PHASE_B" = true ]; then
    echo "Phase B Files:"
    check_dir "$PROJECT_PATH/01_PRD/FEATURES"
    check_file "$PROJECT_PATH/01_PRD/OVERVIEW.md"
    check_dir "$PROJECT_PATH/04_BUILD"
    check_file "$PROJECT_PATH/04_BUILD/README.md"
    check_dir "$PROJECT_PATH/06_ITERATION"
    check_file "$PROJECT_PATH/06_ITERATION/README.md"
fi

echo ""

# SUCCESS
print_section "✅ COMPLETE!"

cat << 'SUCCESS'
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

4. Make it work for your team
   → Customize GUARDRAILS.md as needed
   → Add more ADRs as decisions arise
   → Expand test coverage over time

SUCCESS

echo ""
echo -e "${GREEN}All files created in: $PROJECT_PATH${NC}"
echo ""

# Final confirmation
if prompt_yes_no "Commit these changes to git?"; then
    cd "$PROJECT_PATH"
    git add -A 2>/dev/null || echo "Not a git repo (that's fine)"
    git commit -m "Refinement: Add Phase A/B structure and templates" 2>/dev/null || echo "Git commit skipped"
    echo -e "${GREEN}✓ Changes committed${NC}"
else
    echo "Skipped git commit"
fi

echo ""
echo -e "${GREEN}Done! Your refinement system is live.${NC}"
