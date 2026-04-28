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

