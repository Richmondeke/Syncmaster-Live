# Phase E2 - Design System Integration Progress

## Current Status

**Status:** COMPLETE  
**Baseline date:** 2026-05-02  
**Scope:** Design-system token integration, navigation/header alignment, brief-card polish, shared visual components.

This file supersedes the older in-progress Phase E design-system checklist. Historical Phase E production-polish notes remain in `docs/06_ITERATION/PHASE_E_COMPLETION.md`.

---

## Completed Steps

| Step | Scope | Status |
|------|-------|--------|
| 1 | Update dark mode token block in `app/globals.css` | Complete |
| 2 | Add light mode semantic token definitions | Complete |
| 3 | Expand `@theme inline` for new tokens | Complete |
| 4 | Add design utility classes | Complete |
| 5 | Align radius baseline to `0.375rem` | Complete |
| 6 | Update sidebar active state and numbering | Complete |
| 7 | Update header breadcrumb display with `.label` | Complete |
| 8 | Add `Waveform`, `ScoreBar`, and `Banner` components | Complete |
| 9 | Update brief cards and alerts to design-system patterns | Complete |
| 10 | Run final verification | Complete |

---

## Verification

Passed:

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
```

Also verified:

```powershell
npm.cmd run dev -- --port 3000
```

Dev server URL:

```text
http://localhost:3000
```

Note: `npm.cmd run build` may need network access because `next/font` fetches Geist and Geist Mono from Google Fonts.

---

## Current Design Baseline

- Accent is acid lime: `oklch(0.88 0.18 120)`
- Radius baseline is 6px: `--radius: 0.375rem`
- Cards use subtle borders instead of heavy shadows
- Sidebar active state uses left primary border plus `bg-sidebar-accent`
- Header breadcrumb uses `.label`
- Brief cards use `bg-card`, `border-border`, `hover:border-input`, and design utility classes
- New shared components: `components/Banner.tsx`, `components/ScoreBar.tsx`, `components/Waveform.tsx`

---

## Files Changed By Phase E2

```text
app/globals.css
components/dashboard/Sidebar.tsx
components/dashboard/Header.tsx
components/briefs/BriefList.tsx
app/(dashboard)/dashboard/briefs/page.tsx
components/Banner.tsx
components/ScoreBar.tsx
components/Waveform.tsx
```

`tailwind.config.ts` was verified; its radius scale already matched the design-system target.

---

## Commit Guidance

Recommended scoped commit:

```powershell
git add app/globals.css components/dashboard/Sidebar.tsx components/dashboard/Header.tsx components/briefs/BriefList.tsx app/(dashboard)/dashboard/briefs/page.tsx components/Banner.tsx components/ScoreBar.tsx components/Waveform.tsx PHASE-E-PROGRESS.md docs/00_SYSTEM/BASELINE.md CLAUDE.md
git commit -m "feat(phase-e): complete design system integration baseline"
```

Keep unrelated AI/API experiments, generated caches, and local environment files out of this commit unless intentionally committing them separately.
