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

