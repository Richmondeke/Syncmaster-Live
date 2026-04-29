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

