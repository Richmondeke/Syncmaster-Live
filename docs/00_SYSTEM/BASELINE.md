# SyncMaster Current Baseline

**Baseline date:** 2026-05-02  
**Baseline name:** Phase E2 design-system integration complete  
**Use this file first** when resuming development or asking an agent to continue work.

---

## Product Baseline

SyncMaster is a curated sync licensing platform for:

- Admins who vet composers, manage briefs, and coordinate placements
- Producers who create briefs and review curated matches
- Composers who receive invites and submit track links

The product remains a human-curated marketplace. AI assists admin-facing matching, but does not replace curation.

---

## Technical Baseline

| Area | Current State |
|------|---------------|
| Framework | Next.js 16 App Router |
| Request boundary | `proxy.ts`, not `middleware.ts` |
| Styling | Tailwind CSS v4 with Phase E2 design tokens |
| UI kit | shadcn/ui in `components/ui/` |
| Database/auth | Supabase with RLS and SSR auth |
| AI runtime | Direct Anthropic Messages API through `services/ai.ts` |
| AI env var | `ANTHROPIC_API_KEY` |
| Email | Resend |
| Tests/build | `npx.cmd tsc --noEmit`, `npm.cmd run build` |

No further AI provider migration is planned right now.

---

## Design Baseline

Phase E2 is the current visual baseline:

- Acid-lime primary accent: `oklch(0.88 0.18 120)`
- Global radius: `--radius: 0.375rem`
- Border-led surfaces; avoid adding heavy card shadows
- Sidebar active state: left primary border, subtle sidebar accent background, numeric suffix
- Header breadcrumb: `.label`
- Dense professional dashboard styling, not marketing-page styling

Shared components added:

```text
components/Banner.tsx
components/ScoreBar.tsx
components/Waveform.tsx
```

Utility classes added in `app/globals.css`:

```text
.label
.label-strong
.display
.mono
.hairline
.hairline-strong
.muted
.dim
.accent
```

---

## Guardrails

1. Read `AGENTS.md` before Next.js work and consult `node_modules/next/dist/docs/` for framework-specific changes.
2. Keep mutations in Server Actions. API routes are for webhooks and cron only.
3. Keep Supabase client boundaries strict: server client on the server, browser client in client components only.
4. Call AI through `agents/` and `services/ai.ts`; never from client components.
5. Do not migrate AI providers unless explicitly requested.
6. Do not edit `components/ui/` unless the task is specifically about the UI primitive.
7. Do not hand-edit `types/database.types.ts`.
8. After schema changes, update all explicit Supabase `select()` strings.
9. Verify meaningful changes with `npx.cmd tsc --noEmit`; use `npm.cmd run build` before release/baseline commits.
10. Keep docs current when changing architecture, environment variables, or design-system rules.

---

## Known Documentation Caveat

Some historical docs still use earlier phase names:

- Phase E production polish is documented in `docs/06_ITERATION/PHASE_E_COMPLETION.md`
- Phase E2 design-system integration is documented in `PHASE-E-PROGRESS.md`

Treat this file and `CLAUDE.md` as the active source of truth.
