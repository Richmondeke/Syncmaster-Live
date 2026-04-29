# ADR-001: Email/Password Authentication

## Decision
Use Supabase Auth with email/password (no OAuth, no magic link in Phase 1).

## Context
- Phase 1 is validation; simplicity > features
- Email/password gives composers and producers familiar, low-friction onboarding
- Reduces dependency on third-party OAuth providers
- Works for all geographies including markets where Google/GitHub accounts are less common
- Supabase SSR handles cookies — no localStorage for auth state

## Consequences
✓ Straightforward onboarding
✓ No third-party dependency for auth
✓ Works globally
✓ Role stored in `profiles.role` — checked server-side on every admin action
⚠️ Password reset flow must be implemented (Supabase handles this)
⚠️ No social login (can add Phase 2 if needed)

## Alternatives Considered
- Magic link: Lower friction but email delivery becomes critical path; less familiar to some users
- OAuth (Google, GitHub): Adds complexity early, not universal in target markets
- Phone SMS: More expensive, different delivery challenges

## Status
ACCEPTED

## Link in Code
See: `app/actions/auth.ts`, `proxy.ts`
