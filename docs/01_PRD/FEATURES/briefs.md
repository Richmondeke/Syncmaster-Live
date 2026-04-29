# Feature: Brief Management

**Status:** Complete (Phase B)
**Roles affected:** Admin (full), Producer (create/view own), Composer (view invited)

## What it does
- Producer creates a brief with title, description, genre, deadline
- Admin can view all briefs, change status
- Brief status machine: `draft → active → closed → placed`
- `BriefStatusControl` component: admin triggers transitions with confirmation modal
- Admin can revert active briefs back to draft

## Status transitions
| From | To | Who |
|------|----|-----|
| draft | active | admin |
| active | closed | admin |
| closed | placed | admin |
| active | draft | admin (revert) |

## Key files
- `app/(dashboard)/briefs/page.tsx`
- `app/(dashboard)/briefs/[id]/page.tsx`
- `app/actions/briefs.ts`
- `components/briefs/BriefStatusControl.tsx`
- `core/workflows/brief-workflow.ts`

## AI extension (Phase D)
- On `draft → active`: call `agents/brief-analyzer.ts` to populate `ai_tags`, `ai_score`
- Admin brief view shows `ai_suggested_composers` ranked list
