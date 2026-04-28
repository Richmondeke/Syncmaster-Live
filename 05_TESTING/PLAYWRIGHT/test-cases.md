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

