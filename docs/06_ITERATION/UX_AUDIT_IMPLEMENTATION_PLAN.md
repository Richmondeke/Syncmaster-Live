# UX Audit — Implementation Plan
**Audit date:** 2026-06-04  
**Branch:** `dev/dakol`  
**Executed by:** Gemini agent (pick up from this file)

---

## How to use this file

Work through the phases in order. Each fix lists:
- The exact file to edit
- The specific line or block to change
- The intended result
- A done checkbox

Mark each item `[x]` when complete. Do **not** skip ahead to a later phase until the current phase passes `npx tsc --noEmit`.

---

## Phase 1 — Critical Role & Permission Fixes
*Goal: ensure composers never see admin-only nav items and the default role is safe.*

### 1.1 — Remove Campaigns from composer sidebar
**File:** `components/dashboard/Sidebar.tsx`  
**Line:** ~79 (the `Campaigns` nav item inside `NAV_GROUPS.distribution`)

Change:
```ts
{
  label: 'Campaigns',
  href: '/dashboard/campaigns',
  icon: Mail,
  roles: ['admin', 'composer'],
},
```
To:
```ts
{
  label: 'Campaigns',
  href: '/dashboard/campaigns',
  icon: Mail,
  roles: ['admin'],
},
```
**Why:** Campaigns manages platform-level bulk email newsletters (1,240+ recipients, "SyncMaster 2.0 Feature Launch"). This is an admin/operations tool, not a composer tool.

---

### 1.2 — Change default layout role from `admin` to safe fallback
**File:** `app/(dashboard)/layout.tsx`  
**Line:** 22

Change:
```ts
const roleOverride = (cookieStore.get('role')?.value || 'admin') as Role
```
To:
```ts
const roleOverride = (cookieStore.get('role')?.value || 'composer') as Role
```
**Why:** Anyone without a role cookie (cleared browser, fresh dev session) was silently getting the full admin dashboard. `composer` is the safer default. In production, the real auth guard handles this — this is a dev/staging safeguard.

---

### 1.3 — Un-mark Submissions as adminOnly on the dashboard tools grid
**File:** `app/(dashboard)/dashboard/page.tsx`  
**Lines:** 46–50 (the Submissions tool object)

Change:
```ts
{
  label: 'Submissions',
  description: 'Manage track submissions',
  href: '/dashboard/submissions',
  icon: FileText,
  color: 'bg-orange-500/10 text-orange-500',
  adminOnly: true
},
```
To:
```ts
{
  label: 'Submissions',
  description: 'Track your pitches and submissions',
  href: '/dashboard/submissions',
  icon: FileText,
  color: 'bg-orange-500/10 text-orange-500',
},
```
**Why:** The Submissions page copy reads "Track your pitches and active submissions across all briefs" — this is a composer's core workflow. It was incorrectly hidden from them.

Also update the description from `'Manage track submissions'` (admin-sounding) to `'Track your pitches and submissions'` (composer-oriented).

---

### 1.4 — Guard "View Catalog" hero CTA by role
**File:** `app/(dashboard)/dashboard/page.tsx`  
**Lines:** ~158–170 (the hero banner CTA block)

The two hero CTAs are hardcoded:
```tsx
<Link href="/dashboard/briefs">Explore Briefs</Link>
<Link href="/dashboard/tracks">View Catalog</Link>
```

"Explore Briefs" is valid for all roles. "View Catalog" links to `/dashboard/tracks` which is only in the sidebar for `composer` and `admin` (not `producer`).

Change to conditionally render "View Catalog" only for composer/admin:
```tsx
<Link href="/dashboard/briefs" ...>Explore Briefs</Link>
{(profile.role === 'composer' || profile.role === 'admin') && (
  <Link href="/dashboard/tracks" ...>View Catalog</Link>
)}
```

---

### 1.5 — Add role-conditional hero copy on dashboard
**File:** `app/(dashboard)/dashboard/page.tsx`  
**Lines:** ~152–156 (the `<h2>` and `<p>` inside the hero section)

Current (role-agnostic):
```tsx
<h2>Your sync operations, simplified.</h2>
<p>Manage your music assets, track submissions, and connect with supervisors from one central hub.</p>
```

Replace with role-aware copy:
```tsx
<h2>Your sync operations, simplified.</h2>
<p className="...">
  {profile.role === 'composer'
    ? 'Upload your catalog, track submissions, and connect with supervisors from one central hub.'
    : profile.role === 'producer'
    ? 'Post briefs, review curated matches, and track placements from one central hub.'
    : 'Manage the full roster, match briefs, and track every placement.'}
</p>
```

---

### Phase 1 verification
```bash
npx tsc --noEmit
```
Expected: 0 errors.

---

## Phase 2 — Dashboard Design System Fixes

### 2.1 — Fix Submissions page design system
**File:** `app/(dashboard)/dashboard/submissions/page.tsx`

**2.1a** — Page heading: change `font-semibold` → `font-black`:
```tsx
// Line ~62
<h1 className="text-2xl font-semibold tracking-tight text-foreground">Submissions</h1>
```
→
```tsx
<h1 className="text-2xl font-black tracking-tight text-foreground">Submissions</h1>
```

**2.1b** — Submission card `rounded-md` → `rounded-[2rem]`:
```tsx
// Line ~72 — the Card className
<Card className="bg-card border-border rounded-md overflow-hidden hover:border-primary/40 ...">
```
→
```tsx
<Card className="bg-card border-border rounded-[2rem] overflow-hidden hover:border-primary/40 ...">
```

**2.1c** — Track icon container `rounded-md` → `rounded-2xl`:
```tsx
// Line ~74
<div className="w-14 h-14 rounded-md bg-primary/10 ...">
```
→
```tsx
<div className="w-14 h-14 rounded-2xl bg-primary/10 ...">
```

**2.1d** — Empty state card: `rounded-md p-20` → `rounded-[2rem] p-16`:
```tsx
<Card className="bg-card border-dashed border-border rounded-md p-20 text-center">
```
→
```tsx
<Card className="bg-card border-dashed border-border rounded-[2rem] p-16 text-center">
```

---

### 2.2 — Remove local Edit3 SVG from Campaigns page
**File:** `app/(dashboard)/dashboard/campaigns/page.tsx`  
**Lines:** ~182–200 (local `function Edit3` SVG component at bottom of file)

The file defines a custom `Edit3` SVG component locally. `Edit3` is already available from `lucide-react` (which is already imported). 

1. Remove the local `Edit3` function entirely (lines 182–200).
2. Add `Edit3` to the existing lucide imports at the top of the file.

---

### 2.3 — Remove model name from AI Tagger loading state
**File:** `app/(dashboard)/dashboard/tagger/page.tsx`  
**Line:** ~408

Change:
```tsx
<p className="text-muted-foreground max-w-sm mx-auto text-base font-medium leading-relaxed">
  Claude 3.5 Sonnet is performing deep audio metadata extraction and generating contextual sync tags.
</p>
```
To:
```tsx
<p className="text-muted-foreground max-w-sm mx-auto text-base font-medium leading-relaxed">
  AI is performing deep audio metadata extraction and generating contextual sync tags.
</p>
```

---

### Phase 2 verification
```bash
npx tsc --noEmit
```

---

## Phase 3 — Marketing: Contact Form

### 3.1 — Wire contact form to a Server Action
**File:** `app/contact/page.tsx`

The contact form (`lines ~93–129`) has no `action`, no `onSubmit`, and submits nothing. This is a silent failure for visitors.

**Step 1 — Create the server action:**

Create file: `app/actions/contact.ts`
```ts
'use server'

export type ContactFormState = {
  success: boolean
  error?: string
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().trim()
  const message = formData.get('message')?.toString().trim()

  if (!name || !email || !message) {
    return { success: false, error: 'All fields are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  // TODO: wire to Resend when email is confirmed
  // For now, log and return success so the form is functional
  console.log('[Contact Form]', { name, email, message })

  return { success: true }
}
```

**Step 2 — Convert the form in `app/contact/page.tsx` to a Client Component:**

Add `'use client'` at the top.

Import `useActionState` and the action:
```ts
'use client'
import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from '@/app/actions/contact'
```

Replace the static form with:
```tsx
const initialState: ContactFormState = { success: false }
const [state, action, pending] = useActionState(submitContactForm, initialState)

// ... inside JSX, replace the static form:
{state.success ? (
  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
    <p className="font-black text-emerald-600">Message sent! We'll get back to you within 24 hours.</p>
  </div>
) : (
  <form action={action} className="flex flex-col gap-4">
    {state.error && (
      <p className="text-sm text-destructive font-medium">{state.error}</p>
    )}
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="...">Name</label>
        <input name="name" type="text" placeholder="Your name" required className="..." />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="...">Email</label>
        <input name="email" type="email" placeholder="your@email.com" required className="..." />
      </div>
    </div>
    <div className="flex flex-col gap-1.5">
      <label className="...">Message</label>
      <textarea name="message" placeholder="How can we help?" rows={5} required className="..." />
    </div>
    <button
      type="submit"
      disabled={pending}
      className={buttonVariants({ size: 'lg' }) + ' ...'}
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  </form>
)}
```

Preserve all existing Tailwind classes on inputs and labels — only add `name` attributes and wire the form action. Do not restyle.

---

### Phase 3 verification
```bash
npx tsc --noEmit
```

---

## Phase 4 — Marketing: Navbar & About Page

### 4.1 — Move Brand Assets out of primary nav
**File:** `components/marketing/Navbar.tsx`  
**Line:** ~51 (inside the `Resources` navGroup items array)

Remove `{ label: 'Brand Assets', href: '/brand', description: 'Logos, colours, guidelines' }` from `navGroups`.

The brand page remains accessible at `/brand` — it just won't be in the primary nav. Add a link to it from the `Footer` component (`components/marketing/Footer.tsx`) under a "Company" or "Press" section if it isn't already there.

Before removing, check `components/marketing/Footer.tsx` to see if `/brand` is already linked there. If not, add it.

---

### 4.2 — Replace team initials with named placeholders on About page
**File:** `app/about/page.tsx`  
**Lines:** ~39–55 (the `team` array)

The current team array:
```ts
const team = [
  { initials: 'FC', role: 'Founder & CEO', bio: '...' },
  { initials: 'HC', role: 'Head of Curation', bio: '...' },
  { initials: 'HR', role: 'Head of Composer Relations', bio: '...' },
]
```

Add a `name` field with placeholder names (real names should be filled in by the founder):
```ts
const team = [
  { initials: 'FC', name: '[Founder Name]', role: 'Founder & CEO', bio: '...' },
  { initials: 'HC', name: '[Curator Name]', role: 'Head of Curation', bio: '...' },
  { initials: 'HR', name: '[Relations Name]', role: 'Head of Composer Relations', bio: '...' },
]
```

Update the team card JSX to show the name below the role:
```tsx
<span className="text-sm font-black tracking-tight text-foreground">{member.name}</span>
<span className="text-xs text-muted-foreground">{member.role}</span>
```

**Note to agent:** Leave `[Founder Name]` as a placeholder string. The actual names are to be filled in by the product owner — do not invent names.

---

### Phase 4 verification
```bash
npx tsc --noEmit
```

---

## Phase 5 — FAQ Expansion on Pricing Page

See companion document: `docs/06_ITERATION/FAQ_CONTENT_PLAN.md`

This phase involves adding 10 new FAQ questions to `app/pricing/page.tsx`. The content is fully drafted in the companion document. The agent's job here is:

1. Read `FAQ_CONTENT_PLAN.md` for the full question/answer copy.
2. Build an `Accordion` component pattern (or simple expand/collapse) for the FAQ section in `app/pricing/page.tsx`.
3. Replace the current static `flex flex-col gap-8` list with the expanded set.
4. Keep the existing 3 questions — add the new ones around them in the correct group order.

The FAQ section starts at approximately line 165 of `app/pricing/page.tsx`.

---

## Phase 6 — Radar Page Stub Handling

### 6.1 — Replace Radar stub with honest "Coming soon" state
**File:** `app/(dashboard)/dashboard/radar/page.tsx`

The current page shows fake "Trending Genres" pulse skeletons indefinitely with "Analyzing market data..." copy. This is deceptive UI.

Replace with a clear coming-soon state:
```tsx
export default function RadarPage() {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Sound Radar</h1>
        <p className="text-lg text-muted-foreground tracking-tight">
          Real-time market insights and trending sonic profiles across film, TV, and advertising.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 gap-6 rounded-[2.5rem] border-2 border-dashed border-border/40 bg-muted/20">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Search className="w-8 h-8 text-primary/60" />
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <p className="font-black text-foreground text-lg">Sound Radar is coming soon</p>
          <p className="text-sm text-muted-foreground">
            We're building real-time sync market data. When it launches, you'll see trending genres,
            emerging brief patterns, and which sounds are winning placements right now.
          </p>
        </div>
      </div>
    </div>
  )
}
```

Import `Search` from `lucide-react`.

---

## Final verification (after all phases)

```bash
npx tsc --noEmit
npm run build
```

If `npm run build` fails only because of Google Fonts network access, that is expected in offline environments — report it explicitly rather than treating it as a code error.

---

## Out of scope for this plan

These items require product owner input before a Gemini agent can implement them:

- Real team names on About page (requires founder to supply)
- Contact form Resend integration (requires `RESEND_API_KEY` + confirmed `from` address)
- Stories / Blog content (no posts exist — content is needed before the page has value)
- EPK file upload for cover images (requires Supabase Storage bucket decisions)
- Analytics integration (PostHog / Vercel Analytics — requires account setup)
- Terminology audit: "supervisors" (marketing) vs "producers" (DB role) — requires product decision

---

## Files touched in this plan

| File | Phase |
|------|-------|
| `components/dashboard/Sidebar.tsx` | 1.1 |
| `app/(dashboard)/layout.tsx` | 1.2 |
| `app/(dashboard)/dashboard/page.tsx` | 1.3, 1.4, 1.5 |
| `app/(dashboard)/dashboard/submissions/page.tsx` | 2.1 |
| `app/(dashboard)/dashboard/campaigns/page.tsx` | 2.2 |
| `app/(dashboard)/dashboard/tagger/page.tsx` | 2.3 |
| `app/actions/contact.ts` *(new)* | 3.1 |
| `app/contact/page.tsx` | 3.1 |
| `components/marketing/Navbar.tsx` | 4.1 |
| `components/marketing/Footer.tsx` | 4.1 |
| `app/about/page.tsx` | 4.2 |
| `app/pricing/page.tsx` | 5 |
| `app/(dashboard)/dashboard/radar/page.tsx` | 6.1 |
