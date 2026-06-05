# FAQ Content Plan — Pricing Page
**Date:** 2026-06-04  
**Page:** `app/pricing/page.tsx`  
**Current state:** 3 questions (all financial/deal mechanics)  
**Goal:** 13 questions across 3 grouped sections covering the full user journey

---

## Problem with current FAQ

The 3 existing questions (royalties split, sync agents, payment timing) only address people who are already close to signing a deal. They answer nothing about:
- How to get on the platform
- How the curation actually works
- What supervisors/producers can expect
- Timelines and process

Anyone landing on the pricing page for the first time still has no idea how SyncMaster actually works.

---

## Structure

Split FAQ into 3 clearly labelled sections:
1. **For Composers** (5 questions)
2. **For Supervisors & Producers** (4 questions)
3. **Deals & Payments** (4 questions — absorbs the existing 3 + 1 new)

Use an accordion (expand/collapse) pattern. On mobile, collapsed by default. On desktop, the first question in each section can start open.

---

## Section 1: For Composers

### Q1: How do I apply to the SyncMaster roster?
**A:** Apply through the signup flow at syncmaster.io/signup. You'll be asked for your composer profile, a link to your work, and basic rights documentation. Our team reviews every application manually — we're not an open directory. If you're shortlisted, we'll reach out within 5 business days to begin the vetting process.

### Q2: What does vetting actually check?
**A:** Three things: rights clarity (we need to confirm you own the master and the publishing, or have documentation if rights are split), metadata quality (proper titles, ISRC if applicable, genre tagging), and sonic readiness (stems available or can be delivered within 48 hours of a placement request). We're not judging genre or style at the vetting stage — we're checking that your music is brief-ready.

### Q3: What types of music does SyncMaster represent?
**A:** We focus on African composers — Afrobeats, Amapiano, Afrofusion, contemporary African classical, African electronic, and hybrid genres that sit between African roots and global production styles. We do not represent artists primarily focused on hip-hop or Western pop without a strong African sonic identity. If you're unsure whether your sound fits, apply — our team will assess.

### Q4: Are you exclusive? Can I still work with other sync agents?
**A:** SyncMaster is non-exclusive. You are free to work with other sync libraries, agents, or platforms simultaneously. We only ask that the specific tracks you submit to a brief are not under an exclusive hold with another party at that time. You keep full control of your catalog.

### Q5: How do briefs work once I'm on the roster?
**A:** When a brief matches your sonic profile, you'll receive a direct invite to submit. You don't browse an open board and self-submit — we send curated invites to the 3–5 composers whose work best fits that brief. This means you receive fewer invites than on open platforms, but each one is a genuine, targeted opportunity rather than a long shot.

---

## Section 2: For Supervisors & Producers

### Q6: How do I post a brief?
**A:** Sign up as a supervisor or producer at syncmaster.io/signup. Once your account is active, you can submit a brief from your dashboard — describe the project, the mood and tone you need, your budget range, and your deadline. Our team reviews every brief before it goes to the roster.

### Q7: How quickly will I receive matches after posting a brief?
**A:** Standard turnaround is 3–5 business days from brief confirmation to curated shortlist. If you have a tighter deadline, flag it in the brief — we can expedite for projects where the timeline demands it.

### Q8: How many matches will I receive?
**A:** You'll receive 3–5 curated tracks per brief — not a directory of 200 options. Every match has been reviewed by a human editor before it reaches you. If none of the options work for your project, let us know — we can run a second pass with revised parameters.

### Q9: How do I know the rights are actually clear?
**A:** Every composer on our roster has been manually vetted before they receive their first brief invite. Rights documentation — master ownership, publishing splits, ISRC — is confirmed at the vetting stage, not scrambled at the licensing stage. This is the core of what we do. You will not receive a "perfect track" and then discover a rights problem six weeks later.

---

## Section 3: Deals & Payments

*(Retain the 3 existing questions. Add one new one.)*

### Q10 (existing — retain as-is): Do you take a share of the sync fee and performance royalties?
**A:** We only take a commission on the upfront sync fee (the license fee). We do not touch your performance royalties (PRO distributions) or your master royalties. You keep 100% of your writer's share.

### Q11 (existing — retain as-is): What happens if I already have a sync agent?
**A:** SyncMaster is non-exclusive. You are free to work with other agents or libraries. We only ask that you clear the rights for the specific tracks you submit to our briefs.

### Q12 (existing — retain as-is): How do I get paid?
**A:** Once a deal is closed and the supervisor pays the license fee, we facilitate the transfer to you (minus our commission) within 14 days of receiving the funds.

### Q13 (new): What is a typical sync fee range?
**A:** Sync fees vary enormously based on the medium, territory, and duration of use. As a rough benchmark: a 30-second placement in a UK/US TV advertisement can range from $3,000 to $30,000+. A scene placement in a streaming series (Netflix, Prime, etc.) typically ranges from $5,000 to $25,000 for a limited-term license. Trailers and games tend to pay higher flat fees. Regional Nollywood and African broadcast placements are typically lower — $500 to $3,000. We'll always advise on fair market rate before any deal is finalised.

---

## Implementation notes for the agent

### Component pattern

The FAQ section is currently in `app/pricing/page.tsx` starting around line 165, using a simple `flex flex-col gap-8` with static `<div>` per question.

Build a lightweight accordion using React `useState` (no external library). The page is already a server component — convert the FAQ section into a client component, or extract it to `components/pricing/FAQAccordion.tsx` (client component).

Example accordion structure:
```tsx
'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type FAQItem = { q: string; a: string }
type FAQSection = { title: string; items: FAQItem[] }

export function FAQAccordion({ sections }: { sections: FAQSection[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-12">
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">{section.title}</h3>
          <div className="flex flex-col divide-y divide-border">
            {section.items.map((item) => {
              const id = `${section.title}-${item.q}`
              const isOpen = open === id
              return (
                <div key={id}>
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between py-5 text-left gap-4"
                  >
                    <span className="font-black text-lg tracking-[-0.04em] text-foreground">{item.q}</span>
                    <ChevronDown className={cn('w-5 h-5 text-muted-foreground shrink-0 transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen && (
                    <p className="pb-5 text-muted-foreground leading-relaxed">{item.a}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Data structure to pass in

```tsx
const faqSections: FAQSection[] = [
  {
    title: 'For Composers',
    items: [
      { q: 'How do I apply to the SyncMaster roster?', a: '...' },
      { q: 'What does vetting actually check?', a: '...' },
      { q: 'What types of music does SyncMaster represent?', a: '...' },
      { q: 'Are you exclusive? Can I still work with other sync agents?', a: '...' },
      { q: 'How do briefs work once I\'m on the roster?', a: '...' },
    ]
  },
  {
    title: 'For Supervisors & Producers',
    items: [
      { q: 'How do I post a brief?', a: '...' },
      { q: 'How quickly will I receive matches after posting a brief?', a: '...' },
      { q: 'How many matches will I receive?', a: '...' },
      { q: 'How do I know the rights are actually clear?', a: '...' },
    ]
  },
  {
    title: 'Deals & Payments',
    items: [
      { q: 'Do you take a share of the sync fee and performance royalties?', a: '...' },
      { q: 'What happens if I already have a sync agent?', a: '...' },
      { q: 'How do I get paid?', a: '...' },
      { q: 'What is a typical sync fee range?', a: '...' },
    ]
  }
]
```

### Section heading update

Change the FAQ section heading from:
```tsx
<h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
```
To:
```tsx
<h2 className="text-4xl md:text-5xl font-black tracking-[-0.068em]">Everything you need to know</h2>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
  From applying to getting paid — the full picture.
</p>
```

### Do not change

- The section's background (`bg-muted/30`) and border
- The `max-w-3xl mx-auto` container width
- The surrounding `py-32` section padding
- The `Navbar` and `Footer` — no changes to the page wrapper

---

## Validation

After implementing:
- All 13 questions render
- Clicking a question expands/collapses it
- Only one question is open at a time
- `npx tsc --noEmit` passes
- No `any` types in the new component
