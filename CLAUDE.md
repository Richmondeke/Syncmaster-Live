@AGENTS.md

# CLAUDE.md — Project Build Context
> Paste this file into every Claude Code session. Update the three fields marked [UPDATE] before each session.

---

## [UPDATE 1] — Who you are building for this session

**Project:** [PROJECT_NAME]
**Session #:** [N]
**Current Build Phase:** [Phase A: Foundation ✓ | Phase B: Core Loop | Phase C: Schema Extension | Phase D: AI Layer | Phase E: Production + Ship]
**Session Goal:** [ONE specific feature — e.g. "Build the track upload flow with Supabase Storage"]

---

## [UPDATE 2] — Files you are allowed to touch this session

```
[list file paths here — Claude must not modify anything outside this list]

e.g.
app/actions/tracks.ts
app/(dashboard)/tracks/page.tsx
components/tracks/TrackUploader.tsx
types/database.types.ts
```

---

## [UPDATE 3] — Where we left off

```
[Paste the last 3–5 lines of context from your previous session, or write "First session"]

e.g.
- Auth flow complete. Login, signup, middleware guard all working.
- Supabase types generated. Profiles table seeded.
- Dashboard layout scaffolded. Sidebar and header done.
- Starting point: tracks table exists but upload UI not built.
```

---

## STACK — Never deviate from this

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript — strict, no `any` |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (SSR) |
| Storage | Supabase Storage |
| Email | Resend + React Email |
| Deployment | Vercel + Vercel Cron |
| AI Layer | Anthropic SDK (`@anthropic-ai/sdk`) — via `services/ai.ts` only |

---

## ARCHITECTURE RULES — Read before writing a single line

### Mutations → Server Actions. Always.
```typescript
// ✅ CORRECT — app/actions/tracks.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTrack(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('tracks').insert({
    user_id: user.id,
    title: formData.get('title') as string,
  })
  if (error) throw error
  revalidatePath('/tracks')
}

// ❌ WRONG — do not create API routes for mutations
// app/api/tracks/route.ts  <-- NO
```

### API Routes → Webhooks and Cron only
```typescript
// ✅ CORRECT use of API routes
app/api/webhooks/stripe/route.ts   // external webhook
app/api/cron/digest/route.ts       // Vercel cron job

// ❌ WRONG — not for mutations or data fetching
app/api/tracks/route.ts            // use Server Actions instead
```

### Supabase client imports — never mix these up
```typescript
// In Server Components, Server Actions, Route Handlers:
import { createClient } from '@/lib/supabase/server'

// In Client Components ('use client') only:
import { createClient } from '@/lib/supabase/client'
```

### Data fetching — server-side by default
```typescript
// ✅ CORRECT — fetch in Server Component, pass to client
// app/(dashboard)/tracks/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TracksPage() {
  const supabase = createClient()
  const { data: tracks } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false })

  return <TrackList tracks={tracks ?? []} />
}
```

### TypeScript — always type from generated schema
```typescript
// ✅ CORRECT
import type { Database } from '@/types/database.types'
type Track = Database['public']['Tables']['tracks']['Row']

// ❌ WRONG
const track: any = ...
```

### AI calls — agents/ and services/ only. Never inline.
```typescript
// ✅ CORRECT — server action calls an agent
import { matchComposers } from '@/agents/composer-matcher'
const suggestions = await matchComposers(briefId)

// ✅ CORRECT — agent calls services/ai.ts
import { ai } from '@/services/ai'
const result = await ai.messages.create({ ... })

// ❌ WRONG — Anthropic SDK called directly in a server action or component
import Anthropic from '@anthropic-ai/sdk'  // not here
```

Use plain Anthropic SDK calls (via `services/ai.ts`) for all V1.5 AI work.
Only introduce LangGraph if a workflow requires branching agent chains or multi-step tool loops — simple scoring and ranking does not qualify.

### Security — enforce at every boundary
```typescript
// ✅ Admin-only server action — always verify role server-side
const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
if (profile?.role !== 'admin') throw new Error('Forbidden')

// ✅ Rate-limit auth endpoints via middleware (proxy.ts)
// ✅ Validate all external input at the boundary — never trust form data
// ✅ Webhook handlers must verify signatures before processing
// ✅ Never expose Supabase service_role key to the browser
```

---

## DESIGN CONVENTIONS — Follow these for every UI component

### Cards
```tsx
<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
```

### Buttons
```tsx
// Default action — no size prop
<Button>Save</Button>

// Destructive actions only
<Button variant="destructive">Delete</Button>

// Loading state inside button
<Button disabled={pending}>
  {pending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : 'Save'}
</Button>
```

### Forms — useActionState + Server Actions (NOT react-hook-form)
```tsx
// ✅ CORRECT — matches Next.js 16 server action pattern
'use client'
import { useActionState } from 'react'
import { myAction } from '@/app/actions/entity'

const [state, formAction, pending] = useActionState(myAction, { error: null })

<form action={formAction}>
  <div className="space-y-2">
    <Label htmlFor="field">Field</Label>
    <Input id="field" name="field" required />
    {state.error && (
      <p className="text-sm text-destructive">{state.error}</p>
    )}
  </div>
  <Button type="submit" disabled={pending}>
    {pending ? 'Saving…' : 'Save'}
  </Button>
</form>

// ❌ WRONG — react-hook-form is NOT installed
// import { useForm } from 'react-hook-form'
```

### Loading States
```tsx
// Content loading — use Skeleton
import { Skeleton } from '@/components/ui/skeleton'
<Skeleton className="h-4 w-48" />

// Action loading — spinner inside Button (see above)
// Never show a blank page — always use loading.tsx or Suspense with skeleton fallback
```

### Empty States
```tsx
<div className="rounded-lg border border-dashed p-12 text-center">
  <Icon className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
  <p className="font-medium text-sm">No items yet</p>
  <p className="text-xs text-muted-foreground mt-1">Description of next action.</p>
  <Button className="mt-4" size="sm">CTA</Button>
</div>
```

### Error States
```tsx
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>
    What went wrong. What the user can do about it.
  </AlertDescription>
</Alert>
```

### Page Layout
```tsx
<div className="flex flex-col gap-6">
  <div>
    <h1 className="text-2xl font-bold tracking-tight">Page Title</h1>
    <p className="text-muted-foreground text-sm mt-1">Supporting description.</p>
  </div>
  {/* content */}
</div>
```

---

## FOLDER STRUCTURE — Do not create files outside this map

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← sidebar, header, auth guard
│   │   └── [feature]/
│   │       ├── page.tsx        ← Server Component, fetches data
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── webhooks/
│   │   └── cron/
│   └── actions/
│       ├── auth.ts             ← signIn, signUp, signOut
│       └── [entity].ts         ← CRUD for each entity
├── agents/                     ← AI agents — one file per domain
│   ├── brief-analyzer.ts       ← scores brief, returns genre/mood tags
│   └── composer-matcher.ts     ← ranks active composers against a brief
├── core/
│   └── workflows/              ← state machine transition logic
│       ├── brief-workflow.ts
│       └── submission-workflow.ts
├── services/
│   └── ai.ts                   ← single Anthropic SDK client — import ONLY from agents/
├── components/
│   ├── ui/                     ← shadcn/ui — DO NOT EDIT
│   └── [feature]/              ← your components, kebab-case files
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← browser client
│   │   └── server.ts           ← SSR client
│   ├── email/
│   │   └── send.ts
│   └── utils.ts
├── hooks/                      ← client-side hooks only
├── types/
│   └── database.types.ts       ← generated, never hand-edit
├── emails/                     ← React Email templates
├── scripts/
│   └── gen-session.mjs         ← run `npm run session` to generate session prompt
├── docs/                       ← PRD topic files — load only what session needs
│   ├── prd-vision.md
│   ├── prd-states-and-flows.md
│   ├── prd-features-v1.md
│   ├── prd-features-v1.5.md
│   └── prd-roadmap.md
├── proxy.ts                    ← auth guard middleware
├── CLAUDE.md                   ← this file
└── .env.local                  ← never commit
```

---

## CONVENTIONS — Non-negotiable

| Thing | Convention |
|-------|-----------|
| Component files | `PascalCase.tsx` |
| All other files | `kebab-case.ts` |
| Functions | `camelCase` |
| Database columns | `snake_case` |
| Environment vars (public) | `NEXT_PUBLIC_SCREAMING_SNAKE` |
| Environment vars (private) | `SCREAMING_SNAKE` |
| Error handling | Always surface to UI — no silent catches |
| Loading states | Every async action needs a loading indicator |
| Empty states | Every list needs an empty state component |
| Mobile | Mobile-first — test at 375px before 1280px |

---

## DO NOT — Hard rules Claude must never break

```
✗ Do not modify /components/ui/ — shadcn files are read-only
✗ Do not add npm packages without listing them here first
✗ Do not write inline SQL — use Supabase client methods
✗ Do not hardcode user IDs, secrets, or credentials anywhere
✗ Do not create files outside the folder structure above
✗ Do not use 'any' type — ever
✗ Do not skip error handling — every async call needs try/catch or error handling
✗ Do not create API routes for data that should use Server Actions
✗ Do not use localStorage for auth state — Supabase SSR handles cookies
✗ Do not truncate code output — always write complete files
✗ Do not import @anthropic-ai/sdk anywhere except services/ai.ts
✗ Do not call agents/ functions from components or pages — only from server actions
✗ Do not skip role verification in server actions — always check user.role server-side
✗ Do not introduce LangGraph unless a workflow has branching multi-step agent loops
```

---

## BUILD PHASES — Current position in the arc

```
Phase A — Foundation (COMPLETE)
  ✓ Supabase project + schema + RLS
  ✓ Next.js scaffold + Tailwind + shadcn/ui
  ✓ Auth flow: login, signup, signout, middleware guard
  ✓ Dashboard shell: layout, sidebar, header
  ✓ Admin composer vetting (approve / reject)
  → Output: Working auth. Role-gated dashboard. No product loop yet.

Phase B — Core Product Loop   [Sessions 3–5] ← CURRENT
  → Brief creation + management (producer + admin)
  → Outreach: admin invites composers to a brief
  → Composer submission flow (up to 3 tracks per brief)
  → Placement logging (admin: fee + commission)
  → Placements view (all roles) + Settings page
  → Pattern: DB action → Server Action → Server Component → Client UI
  → Output: Full loop runs end-to-end. Real data flows.

Phase C — Schema Extension    [1 session, non-breaking]
  → Add AI metadata columns (ai_score, ai_tags, ai_match_reason, ai_suggested_composers)
  → Migration: supabase/migrations/002_ai_fields.sql
  → Update types/database.types.ts
  → Output: Schema is V1.5-ready. All existing code unchanged.

Phase D — AI Layer            [1–2 sessions]
  → services/ai.ts — Anthropic SDK client
  → agents/brief-analyzer.ts — tags briefs with genre/mood on activation
  → agents/composer-matcher.ts — scores active composers against a brief
  → Wire into admin brief view as suggestions (human still decides)
  → Output: Admin sees AI-ranked composer list. Hybrid mode.

Phase E — Production + Ship   [Sessions 6–8]
  → Email notifications on all state transitions
  → Error boundaries + toast feedback on all mutations
  → Loading skeletons on all data pages
  → Mobile audit (375px baseline)
  → Vercel deploy + env vars in production
  → Smoke test all critical flows
  → Output: Live URL. Production-quality UX.
```

---

## REQUIRED OUTPUT FORMAT — Every session

Claude must always structure output as:

```
## Plan
[Bullet list — max 5 points. What you're about to do.]

## Code
[Complete files — no truncation. Every file fully written.]

## Test checklist
[3–5 specific things to manually verify after implementation]

## Next session setup
[One sentence: what the next session should start with]
```

---

## PRD REFERENCE — Load only what the session needs

Do NOT load the full PRD every session. Reference only the relevant doc from `/docs/`:

| Session task | Load this doc |
|-------------|---------------|
| Auth, signup, roles, middleware | `docs/prd-states-and-flows.md` |
| Briefs (create, manage, activate) | `docs/prd-states-and-flows.md` + `docs/prd-features-v1.md` |
| Outreach (inviting composers) | `docs/prd-states-and-flows.md` + `docs/prd-features-v1.md` |
| Submissions (composer submits tracks) | `docs/prd-states-and-flows.md` + `docs/prd-features-v1.md` |
| Placements + Settings | `docs/prd-features-v1.md` |
| Workflow state guards (core/workflows/) | `docs/prd-features-v1.5.md` |
| AI layer (agents, services) | `docs/prd-features-v1.5.md` |
| Schema migration | `docs/prd-features-v1.5.md` |
| Production polish (emails, skeletons, toasts) | `docs/prd-features-v1.5.md` |
| Roadmap questions or competitor context | `docs/prd-roadmap.md` |
| Personas or product vision | `docs/prd-vision.md` |

Add the relevant `@docs/prd-*.md` reference to the [UPDATE 3] block in each session prompt.

---

## SESSION PROMPT TEMPLATE
> Copy this block, fill in the three [UPDATE] fields at the top, and paste it as your opening message in Claude Code.

```
I'm working on SyncMaster.

Read CLAUDE.md for full project context.
PRD reference for this session: @docs/prd-[relevant-file].md

Session goal: [SINGLE FEATURE — be specific]

Current phase: [Phase A ✓ | Phase B | Phase C | Phase D | Phase E]

Files I'm giving you permission to modify:
- [file 1]
- [file 2]
- [file 3]

Where we left off:
[2–3 sentences of previous session state]

Constraints this session:
- No new npm packages unless listed below
- Mobile-first
- Complete files only — no truncation
- Follow all rules in CLAUDE.md

Begin with your plan (max 5 bullets), then write the code.
```
