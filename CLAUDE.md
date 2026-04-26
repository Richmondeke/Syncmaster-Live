@AGENTS.md
@PRD.md

# CLAUDE.md — Project Build Context
> Paste this file into every Claude Code session. Update the three fields marked [UPDATE] before each session.

---

## [UPDATE 1] — Who you are building for this session

**Project:** [PROJECT_NAME]
**Session #:** [N]
**Current Build Phase:** [Phase 1: Foundation | Phase 2: Core Build | Phase 3: Production | Phase 4: Ship It]
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
├── middleware.ts               ← auth guard
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
```

---

## BUILD PHASES — Current position in the arc

```
Phase 1 — Foundation          [Sessions 1–2]
  ✓ Supabase project + schema + RLS
  ✓ Next.js scaffold + Tailwind + shadcn/ui
  ✓ Auth flow: login, signup, signout, middleware guard
  ✓ Dashboard shell: layout, sidebar, header
  → Output: Working auth. Empty dashboard. No features yet.

Phase 2 — Core Build          [Sessions 3–5]
  → One feature per session. One testable output per session.
  → Pattern: DB action → Server Action → Server Component → Client UI
  → Output: Main product loop works end-to-end.

Phase 3 — Production Features [Sessions 6–7]
  → Email notifications (Resend + React Email)
  → Error boundaries + toast feedback
  → Loading skeletons
  → Mobile responsiveness audit
  → Output: Production-quality UX.

Phase 4 — Ship It             [Session 8]
  → Vercel deploy
  → Env vars set in production
  → Smoke test all critical flows
  → Output: Live URL.
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

## SESSION PROMPT TEMPLATE
> Copy this block, fill in the three [UPDATE] fields at the top, and paste it as your opening message in Claude Code.

```
I'm working on [PROJECT_NAME].

Read CLAUDE.md for full project context.

Session goal: [SINGLE FEATURE — be specific]

Files I'm giving you permission to modify:
- [file 1]
- [file 2]
- [file 3]

Where we left off:
[2–3 sentences of previous session state]

Constraints this session:
- No new npm packages
- Mobile-first
- Complete files only — no truncation
- Follow all rules in CLAUDE.md

Begin with your plan (max 5 bullets), then write the code.
```
