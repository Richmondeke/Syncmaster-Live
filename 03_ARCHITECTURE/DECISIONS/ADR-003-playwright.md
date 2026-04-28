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

