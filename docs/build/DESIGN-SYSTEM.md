# SyncMaster Design System — Phase E

> Current implementation baseline lives in `docs/00_SYSTEM/BASELINE.md`.
> Phase E2 uses acid-lime `oklch(0.88 0.18 120)`, a `0.375rem` radius baseline, and border-led dashboard surfaces.
> Treat older Spotify-green/shadow-heavy examples in this broader spec as historical reference unless they match the current implementation.

Dark editorial. Premium music industry. Spotify meets A&R portal.

---

## 1. Design Philosophy

**SyncMaster is for professionals.** Producers, composers, and admins move fast. The interface must disappear and let music, briefs, and decisions command attention.

**Visual principles:**
- **Dark-first:** Deep blacks and charcoals dominate. Content—album art, profile photos, rankings—floats above dark surfaces.
- **Generous breathing room:** Whitespace is not wasted space; it's rhythm. Card grids maintain 16px gutters. Section padding starts at 24px.
- **High contrast:** All text meets WCAG AA (4.5:1 minimum). Interaction is immediate and unambiguous.
- **Restraint:** One accent color (Spotify Green). No decorative elements. No gradients unless they serve the content.
- **System fonts:** -apple-system, Segoe UI, Roboto. No custom typefaces—speed matters more than uniqueness.
- **Elevation through shadow:** Depth comes from shadows (0–5 levels), not borders or background color shifts.

---

## 2. Semantic Token System

All colors are defined as CSS custom properties. **Never hardcode hex.** Reference tokens everywhere.

### Primary Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-primary` | `#1ED760` | `#1ED760` | Primary CTAs, success states, brand highlight |
| `--color-primary-hover` | `#1DB954` | `#1DB954` | Hover state on primary buttons |
| `--color-primary-active` | `#1aa34a` | `#1aa34a` | Pressed/active state on primary buttons |

### Neutral Scale (Text & Surface)

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-text-primary` | `#FFFFFF` | `#FFFFFF` | Headings, body text on dark |
| `--color-text-secondary` | `#B3B3B3` | `#B3B3B3` | Supporting text, captions, secondary labels |
| `--color-text-tertiary` | `#7C7C7C` | `#7C7C7C` | Placeholders, disabled text, fine print |
| `--color-surface-primary` | `#121212` | `#121212` | Main app background, primary containers |
| `--color-surface-secondary` | `#1F1F1F` | `#1F1F1F` | Elevated cards, modals, secondary sections |
| `--color-surface-tertiary` | `#282828` | `#282828` | Subtle depth layers, hover overlays |
| `--color-surface-raised` | `#333333` | `#333333` | Highest elevation before modal |
| `--color-border` | `#404040` | `#404040` | Dividers, subtle borders, disabled states |
| `--color-divider` | `#2A2A2A` | `#2A2A2A` | Hairline dividers (1px) |

### Semantic Status Colors

| Token | Color | Usage |
|-------|-------|-------|
| `--color-success` | `#1ED760` | Confirmations, checkmarks, positive feedback |
| `--color-warning` | `#FFA500` | Warnings, cautions (not yet used, available) |
| `--color-error` | `#C01810` | Errors, destructive actions, rejections |
| `--color-info` | `#0099FF` | Informational messages (not yet used, available) |

### Accent & Decorative Colors

| Token | Color | Usage |
|-------|-------|-------|
| `--color-accent-warm` | `#786030` | Album artwork backgrounds, featured content highlights |
| `--color-accent-teal` | `#667A7A` | Secondary accents, data visualization, supporting elements |
| `--color-accent-sienna` | `#907236` | Tertiary accents, themed imagery |
| `--color-accent-taupe` | `#827373` | Neutral-warm accents, subtle supporting elements |

### Interactive States

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-overlay-dark` | `rgba(0, 0, 0, 0.56)` | `rgba(0, 0, 0, 0.56)` | Modal backdrop |
| `--color-overlay-hover` | `rgba(255, 255, 255, 0.08)` | `rgba(255, 255, 255, 0.08)` | Hover overlay on dark surfaces |
| `--color-focus-ring` | `#1ED760` | `#1ED760` | Keyboard focus indicator (2px ring) |
| `--color-disabled-bg` | `#404040` | `#404040` | Disabled button/input background |
| `--color-disabled-text` | `#7C7C7C` | `#7C7C7C` | Disabled text |

---

## 3. Typography Scale

**Font Stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif`

| Scale | Font Size | Weight | Line Height | Letter Spacing | Usage |
|-------|-----------|--------|-------------|-----------------|-------|
| **Display** | 24px | 700 | 1.33 (32px) | 0 | Page section headings, hero titles |
| **H1** | 16px | 700 | 1.5 (24px) | 0 | Primary section headers, prominent labels |
| **H2** | 14.08px | 600 | 1.5 (21.12px) | 0 | Secondary section headers, card titles |
| **H3** | 13px | 700 | 1.54 (20px) | 0 | Tertiary headings, emphasized metadata |
| **Body** | 14px | 400 | 1.5 (21px) | 0 | Standard body text, dense content |
| **Body Light** | 16px | 400 | 1.5 (24px) | 0 | Light body text, supporting copy, longer prose |
| **Button** | 16px | 600 | 1.5 (24px) | 0 | Button labels, interactive text |
| **Link** | 14px | 700 | 1.5 (21px) | 0 | Inline links with semantic highlight |
| **Caption** | 12px | 400 | 1.5 (18px) | 0 | Fine print, timestamps, secondary metadata |
| **Code** | 13px | 400 | 1.54 (20px) | 0 | Monospace content (status codes, identifiers) |
| **Label** | 12px | 600 | 1.5 (18px) | 0 | Form labels, small headings |

**Hierarchy principle:** Font weight signals importance. Use 400 for supporting roles, 600 for medium emphasis, 700 for primary focus.

---

## 4. Spacing System

**Base unit:** 4px. All spacing is a multiple of 4px.

### Spacing Scale

```
Micro:   0px, 2px, 4px
Small:   8px, 12px
Standard: 16px, 20px, 24px
Large:   28px, 32px, 40px
XL:      48px, 56px, 64px
```

### Usage Context

| Context | Value |
|---------|-------|
| Button padding (horizontal) | 32px |
| Button padding (vertical) | 12px |
| Card padding | 12px–24px |
| Section padding (horizontal) | 24px (desktop), 16px (tablet), 12px (mobile) |
| Section padding (vertical) | 20px–24px |
| List item padding | 12px (v), 16px (h) |
| Card grid gap | 16px |
| Sidebar nav item spacing | 8px (v), 0px (h) |
| Modal padding | 24px |
| Toast padding | 16px |

---

## 5. Border Radius Scale

Consistent rounding reinforces component families.

| Value | Usage |
|-------|-------|
| **0px** | Text inputs, top bar, full-width sections |
| **4px** | Subtle containers, input fields, secondary modals |
| **6px** | Card containers, image corners, media preview boxes |
| **8px** | Dialog modals, large overlay containers |
| **9999px** | Pill-shaped buttons, fully rounded interactive elements |
| **50%** | Circular avatars, profile images |

---

## 6. Shadow & Elevation System

Depth is created through shadows, not borders.

| Level | Shadow | Usage |
|-------|--------|-------|
| **0** | none | Flat elements, text, icons, backgrounds |
| **1** | `0px 2px 8px rgba(0, 0, 0, 0.3)` | Secondary cards, subtle elevation |
| **2** | `0px 8px 24px rgba(0, 0, 0, 0.4)` | Primary media cards, default card state |
| **3** | `0px 12px 32px rgba(0, 0, 0, 0.6)` | Card hover, drawer panels, dropdowns |
| **4** | `0px 16px 40px rgba(0, 0, 0, 0.8)` | Modal dialogs, context menus |
| **5** | `0px 20px 48px rgba(0, 0, 0, 1.0)` | Full-screen modals, critical overlays |

**Philosophy:** Shadows use pure black at varying opacity. No color contamination. Soft diffuse blurs simulate overhead lighting in dark environments.

---

## 7. Component Patterns

### Button Family

#### Primary Button (CTA)
- **Background:** `var(--color-primary)` (#1ED760)
- **Text:** Black, 16px, weight 600
- **Padding:** 12px 32px
- **Border-radius:** 9999px
- **Height:** 48px minimum
- **Hover:** `var(--color-primary-hover)` (#1DB954)
- **Active:** `var(--color-primary-active)` (#1aa34a)
- **Disabled:** bg `var(--color-disabled-bg)`, text `var(--color-disabled-text)`
- **Focus:** 2px `var(--color-focus-ring)` ring

#### Secondary Button
- **Background:** transparent
- **Text:** `var(--color-text-primary)` (#FFFFFF), 16px, weight 600
- **Border:** 2px solid `var(--color-text-primary)`
- **Padding:** 12px 32px
- **Border-radius:** 9999px
- **Height:** 48px minimum
- **Hover:** `var(--color-overlay-hover)` background
- **Disabled:** border & text `var(--color-border)`

#### Ghost Button (Minimal)
- **Background:** transparent
- **Text:** `var(--color-text-secondary)` (#B3B3B3), 16px, weight 400
- **Padding:** 8px 16px
- **Border-radius:** 9999px
- **Height:** auto
- **Hover:** text `var(--color-text-primary)`, bg `var(--color-overlay-hover)`
- **Active:** text `var(--color-primary)`

#### Icon Button (Circular)
- **Background:** `var(--color-surface-secondary)` (#1F1F1F)
- **Text/Icon:** `var(--color-text-primary)`, 16px, weight 400
- **Padding:** 12px
- **Border-radius:** 50%
- **Height/Width:** 48px
- **Hover:** bg `var(--color-surface-tertiary)`, text `var(--color-primary)`
- **Active:** bg `var(--color-border)`

### Card Patterns

#### Brief Summary Card (Admin/Producer)
```
┌─────────────────────────┐
│ Title                   │
│ Genres: Afrobeat, World │
│ Budget: $5k–$15k        │
│ Active: 3 composers     │
│ Status: Running         │
└─────────────────────────┘
```
- **Background:** `var(--color-surface-secondary)`
- **Padding:** 16px
- **Border-radius:** 6px
- **Shadow:** Level 2
- **Hover:** Level 3 shadow, `var(--color-overlay-hover)` background
- **Text:** H2 for title, Body for details

#### Composer Card (Brief matching)
```
┌────────────────────────┐
│ [Avatar]     Name      │
│ Genres: Jazz, World    │
│ Tags: Rhythmic, Soulful│
│ Match: 87% | Conf: 0.92│
│ [Invite Button]        │
└────────────────────────┘
```
- **Background:** `var(--color-surface-secondary)`
- **Padding:** 12px
- **Border-radius:** 6px
- **Avatar:** 40px × 40px, radius 50%
- **Match %:** `var(--color-primary)` text
- **Confidence:** `var(--color-text-secondary)` text

#### Submission Panel (Composer view)
```
┌──────────────────────────┐
│ Upload Status: 87%       │
│ [████████░░░░░░░░░]     │
│ Review started • 2h ago  │
│ Status: Under review     │
└──────────────────────────┘
```
- **Background:** `var(--color-surface-secondary)`
- **Padding:** 16px
- **Border-radius:** 6px
- **Progress bar:** `var(--color-primary)` fill
- **Timeline:** `var(--color-text-secondary)` text

#### AI Match Reasoning Card
```
┌───────────────────────────────┐
│ Match Score: 8.5/10           │
│ Confidence: 92%               │
│ "Perfect genre fit. Strong... │
│ ...traditional percussion.    │
│ Would recommend reaching out."│
└───────────────────────────────┘
```
- **Score:** H2, `var(--color-primary)`
- **Confidence:** `var(--color-text-secondary)`
- **Reasoning:** Body, 2–3 sentences max

### Form Patterns

#### Text Input
- **Background:** `var(--color-surface-tertiary)`
- **Text:** `var(--color-text-primary)`, 14px, weight 400
- **Border:** 1px solid `var(--color-border)`
- **Border-radius:** 4px
- **Padding:** 12px 16px
- **Height:** 40px minimum
- **Placeholder:** `var(--color-text-tertiary)`
- **Focus:** border `var(--color-primary)`, box-shadow 0 0 0 2px `var(--color-primary)` with 0.1 opacity
- **Error:** border `var(--color-error)`, box-shadow red

#### Search Input
- **Background:** `var(--color-surface-secondary)`
- **Text:** `var(--color-text-primary)`, 16px, weight 400
- **Border-radius:** 500px
- **Padding:** 12px 48px (icon space)
- **Height:** 48px
- **Placeholder:** `var(--color-text-secondary)`
- **Focus:** box-shadow 0 0 0 2px `var(--color-focus-ring)`

#### Textarea (if used)
- Same as text input but with min-height 120px
- Resizable (both axes or vertical only)

### Navigation

#### Sidebar Navigation
- **Background:** transparent
- **Width:** 331px (desktop), 64px (collapsed), 100% (mobile drawer)
- **Text:** `var(--color-text-secondary)`, 16px, weight 400
- **Item padding:** 0 left, 36px left-indent, 32px height
- **Hover:** bg `var(--color-overlay-hover)`, text `var(--color-text-primary)`
- **Active:** bg `rgba(30, 215, 96, 0.1)`, text `var(--color-primary)`
- **Section title:** weight 700, 14px, margin-top 28px, margin-bottom 8px

#### Top Navigation Bar
- **Background:** `var(--color-surface-primary)`
- **Height:** 64px
- **Padding:** 16px 24px
- **Border-bottom:** 1px solid `var(--color-divider)` (optional)
- **Logo area:** Left-aligned, 32px × 32px icon
- **Actions:** Right-aligned, 16px spacing

### Badges

#### Success Badge
- **Background:** `var(--color-primary)` (#1ED760)
- **Text:** Black, 12px, weight 700
- **Padding:** 4px 12px
- **Border-radius:** 9999px

#### Neutral Badge
- **Background:** `rgba(179, 179, 179, 0.2)`
- **Text:** `var(--color-text-secondary)`, 12px, weight 600
- **Border:** 1px solid `var(--color-text-secondary)`
- **Padding:** 4px 12px
- **Border-radius:** 9999px

#### Status Badge (Active/Matched/Closed)
- **Active:** green (`var(--color-primary)`)
- **Matched:** blue (`var(--color-info)`)
- **Closed:** gray (`var(--color-text-secondary)`)

### Loading & Empty States

#### Skeleton Card (Brief/Composer list)
```
┌──────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │ h1
│ ▓▓▓▓▓▓▓▓ ▓▓▓▓       │ body
│ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓▓▓   │ body
└──────────────────────┘
```
- **Pulse animation:** opacity 0.5 → 1.0 → 0.5 over 2s infinite
- **Color:** `var(--color-surface-tertiary)`
- **Border-radius:** match component (6px for cards)

#### Empty State
```
┌────────────────────────┐
│                        │
│         📭             │
│   No briefs yet        │
│  Create your first...  │
│  [Create Brief →]      │
│                        │
└────────────────────────┘
```
- **Container:** rounded-lg border border-dashed, padding 48px, text-center
- **Icon:** 48px, gray (`var(--color-text-secondary)`)
- **Title:** H2, `var(--color-text-primary)`
- **Description:** Body, `var(--color-text-secondary)`
- **CTA:** Primary button

#### Loading Spinner (AI Analysis)
- **Size:** 24px × 24px (inline), 48px × 48px (full-screen)
- **Color:** `var(--color-primary)`
- **Animation:** rotation 360° over 1s infinite, linear
- **Opacity:** fade in 200ms ease-in

---

## 8. Z-Index Layering Scale

Consistent z-index values prevent stacking conflicts and establish a clear layering hierarchy across the application.

| Layer | Z-Index | Usage | Components |
|-------|---------|-------|------------|
| **Base** | 0–1 | Default document flow (background, cards, sections) | Regular cards, panels, surfaces |
| **Interactive** | 10 | Interactive elements above base content | Buttons (hover states), form inputs, links |
| **Dropdown** | 20 | Dropdowns, popovers, tooltips above cards | Select menus, command palettes, hover tooltips |
| **Modal/Overlay** | 40 | Modal dialogs, full-screen overlays, sheet panels | Dialogs, modals, side sheets, full-screen menus |
| **Toast** | 100 | Notifications, success/error messages at top | Toasts, snackbars, notifications |
| **Tooltip/Popover** | 1000 | Absolutely positioned tooltips above all UI | Rich tooltips with interactive content |

**Rules:**
- Never use arbitrary z-index values. Use the scale provided.
- Modal backdrop (`<DialogBackdrop>`) uses the same z-index as the modal itself (40) but sits behind it via DOM order.
- Multiple modals: each new modal gets z-index 40 + 10 per layer (40, 50, 60...) if truly nested.
- Toasts always use 100 to ensure they're visible above modals.
- Tooltips (1000) sit above everything except full-page notifications.

### Examples

```css
/* Base card (default) */
.card {
  z-index: 0;
}

/* Dropdown below modal */
.dropdown {
  z-index: 20;
}

/* Modal dialog */
.modal {
  z-index: 40;
}

/* Modal backdrop (sits behind modal via DOM, same z-index context) */
.modal-backdrop {
  z-index: 40;
  pointer-events: auto;
}

.modal {
  position: relative;
  z-index: 41; /* Slightly above backdrop */
}

/* Toast notification */
.toast {
  z-index: 100;
  position: fixed;
  bottom: 16px;
  right: 16px;
}

/* Rich tooltip */
.tooltip {
  z-index: 1000;
  position: absolute;
}

/* Full-screen loader (emergency z-index) */
.loader-fullscreen {
  z-index: 9999;
}
```

---

## 9. Responsive Breakpoints

All breakpoints are **mobile-first** (mobile → tablet → desktop).

| Breakpoint | Width | Layout Changes |
|-----------|-------|-----------------|
| **Mobile** | 0–639px | 1-column grid, full-width cards, hamburger nav, bottom nav, 12px padding |
| **Tablet** | 640–1023px | 2–3 column grid, sidebar collapsed (64px icons), 20px padding |
| **Desktop** | 1024px+ | 6-column grid, full 331px sidebar, 24–32px padding |
| **Large Desktop** | 1400px+ | Max-width 1400px container, expanded media grids, extended sidebars |

### Typography Scaling

| Scale | Desktop | Mobile |
|-------|---------|--------|
| Display | 24px | 20px |
| H1 | 16px | 14px |
| H2 | 14.08px | 13px |
| Body | 14px | 14px (no change) |
| Caption | 12px | 12px (no change) |

### Spacing Scaling

| Element | Desktop | Mobile |
|---------|---------|--------|
| Section padding (h) | 24–32px | 12px |
| Section padding (v) | 20–24px | 16px |
| Card grid gap | 16px | 12px |
| Card padding | 16px | 12px |

### Touch Targets

- **Minimum:** 44px × 44px
- **Preferred:** 48px × 48px
- **Icon buttons:** 48px × 48px (always)
- **Links in text:** 16px font + 4px padding (v) = 24px target
- **Gap between targets:** minimum 8px

---

## 9. Transitions, Animations & Easing

**Reduce motion:** Respect `prefers-reduced-motion: reduce`. Disable all animations for users who prefer it.

### Standard Durations

- **Quick interactions** (hover color, opacity): 150ms
- **Medium interactions** (card elevation, modal entry): 200ms
- **Slow animations** (page transitions, loaders): 300ms

### Easing Curves (Cubic-Bezier)

All transitions use one of three easing functions for natural, professional motion:

| Curve | Cubic-Bezier | Usage | Feeling |
|-------|--------------|-------|---------|
| **ease-in** | `cubic-bezier(0.4, 0, 1, 1)` | Enter animations, modal reveal, slide-in | Slow start, rapid end (attention-grabbing) |
| **ease-out** | `cubic-bezier(0, 0, 0.2, 1)` | Exit animations, button states, hover effects | Quick start, gentle settle (responsive feel) |
| **ease-in-out** | `cubic-bezier(0.4, 0, 0.2, 1)` | Continuous transitions, elevation changes, cross-fades | Balanced motion (professional, smooth) |

**Why these curves?**
- **ease-in (0.4, 0, 1, 1):** Slow start signals intentional motion. Best for drawing attention (modal entry, new content slide-in).
- **ease-out (0, 0, 0.2, 1):** Immediate response feels interactive. Best for user actions (button clicks, hover lift).
- **ease-in-out (0.4, 0, 0.2, 1):** Balanced deceleration. Best for continuous state changes (shadow elevation, cross-fades).

### Animation Patterns by Context

```css
/* Button hover: quick, responsive */
button {
  transition: background-color 150ms cubic-bezier(0, 0, 0.2, 1),
              transform 150ms cubic-bezier(0, 0, 0.2, 1);
}

button:hover {
  transform: scale(1.02);
}

/* Card elevation on hover: smooth transition */
.card {
  transition: box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow: var(--shadow-3);
}

/* Modal entry: intentional, draws focus */
.modal {
  animation: slideUp 300ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Page fade transition: balanced */
.page-enter {
  animation: fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Timing Decision Tree

| Action | Duration | Curve | Why |
|--------|----------|-------|-----|
| Hover color/opacity | 150ms | ease-out | User expects immediate visual feedback |
| Button scale on hover | 150ms | ease-out | Quick, tactile response |
| Card shadow elevation | 200ms | ease-in-out | Smooth, continuous change |
| Modal/overlay entry | 300ms | ease-in | Slow start captures attention |
| Modal/overlay exit | 300ms | ease-out | Quick disappear feels responsive |
| Spinner rotation | 1000ms | linear | Continuous motion needs no easing |
| Page transition/fade | 200ms | ease-in-out | Balanced, professional handoff |
| Skeleton pulse | 2000ms | linear | Subtle, continuous loop |

---

## 10. State Preservation & Focus Management

### Navigation State Preservation

When users navigate away and return to a page, maintain their context:

| Context | What to Preserve | How |
|---------|------------------|-----|
| **Filter/Sort state** | Active filters, sort direction, column sort | URL search params (`?filters=...`) or sessionStorage |
| **Scroll position** | Scroll depth on list pages | SessionStorage or History API restore |
| **Form drafts** | Partially-filled forms | localStorage with `beforeunload` listener |
| **Active tabs** | Selected tab in multi-tab interface | URL hash or state param |
| **Pagination** | Current page number | URL search param `?page=2` |

**Implementation pattern:**
```tsx
// Preserve scroll position
useEffect(() => {
  const savedScroll = sessionStorage.getItem('listScroll');
  if (savedScroll) {
    window.scrollY = parseInt(savedScroll);
    sessionStorage.removeItem('listScroll');
  }

  return () => {
    sessionStorage.setItem('listScroll', window.scrollY.toString());
  };
}, []);
```

### Focus Management for Accessibility

After dynamic state changes, restore focus to keep keyboard users oriented:

| Scenario | Action | CSS/JS |
|----------|--------|--------|
| **Modal opens** | Move focus to first focusable element inside modal | Use `autoFocus` on first input, or `useEffect + ref.focus()` |
| **Modal closes** | Restore focus to trigger button | Store ref before opening, focus on close |
| **List item deleted** | Move focus to next item (or previous if last) | focus() after DOM update |
| **Form submitted** | Move focus to success message or next section | ScrollIntoView + focus() |
| **Filtering changes list** | Announce change + move focus to results | Use `aria-live="polite"` region |

**Example: Modal focus management:**
```tsx
const triggerRef = useRef<HTMLButtonElement>(null);
const firstInputRef = useRef<HTMLInputElement>(null);

const openModal = () => {
  setOpen(true);
  setTimeout(() => firstInputRef.current?.focus(), 100);
};

const closeModal = () => {
  setOpen(false);
  triggerRef.current?.focus();
};
```

### Focus Indicator Standards

- **Visible focus ring:** 2px `var(--color-focus-ring)` (#1ED760) with 2px offset
- **Contrast:** Focus ring must have ≥ 3:1 contrast against background
- **Non-destructive:** Never remove focus styles for "aesthetics"—keyboard users depend on them

---

## 11. SyncMaster-Specific Patterns (Phase E)

### Brief Analysis Panel (Admin)
Shows real-time AI analysis when brief status transitions to "active".

```
┌────────────────────────────────┐
│ 🤖 AI Analysis Running...      │
│ Analyzing with Claude Haiku... │
│ ⏱️ 2.3s • 1,245 tokens        │
└────────────────────────────────┘
```
- **Loading state:** spinner + "Analyzing..." + latency (ms) + token count
- **Complete state:** "✅ Analysis Complete" + match count + timestamp
- **Error state:** "⚠️ Analysis Failed" + retry button

### Composer Match List (With Reasoning)
For each matched composer: avatar, name, genres, **match score badge** (#1ED760), **confidence %** (secondary text), **"why" tooltip** (on hover or expansion).

```
┌─────────────────────────────────────┐
│ [Avatar] Ayo Adeyemi           87%  │
│ Afrobeat, Highlife, World   (0.92)  │
│ ─────────────────────────────────── │
│ "Perfect genre fit. 10+ years...    │
│ ...traditional percussion strong."  │
│ [Invite] [View Profile]            │
└─────────────────────────────────────┘
```

### Submission Status Timeline (Composer)
Visual progress of submission workflow: upload → review → decision.

```
Upload ✓ → Review → Decision
──●───────●───────●
  ↓
Uploaded 2h ago
```
- **Completed steps:** green checkmark, dark text
- **Current step:** filled circle (animated), primary accent
- **Future steps:** empty circle, secondary text
- **Timeline:** Body light, gray text

### AI Debug Panel (Admin-only)
Visible in dashboard admin section. Shows Anthropic request metrics for transparency.

```
╔════════════════════════════════════╗
║ AI Request Metrics                 ║
║ Model: Claude Sonnet               ║
║ Latency: 2.3s                      ║
║ Input tokens: 1,245 | Output: 543  ║
║ Estimated cost: $0.000287          ║
╚════════════════════════════════════╝
```
- **Container:** modal or panel, 24px padding, monospace text
- **Labels:** Body, secondary text
- **Values:** Body, primary text, right-aligned
- **Metrics:** optional detail (for transparency, not UI burden)

---

## 12. Future-Proofing (Phase F/G Hooks)

### Analytics Dashboard Grid (Phase F)
No implementation, just CSS structure for metrics/charts.

```css
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
}

.metric-card {
  background: var(--color-surface-secondary);
  border-radius: 6px;
  padding: 24px;
  box-shadow: var(--shadow-2);
}

.metric-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}
```

### Composer Portfolio Section (Phase G)
Hero + bio + media grid (reusable pattern).

```css
.portfolio-hero {
  background: linear-gradient(135deg, var(--color-surface-secondary), var(--color-surface-tertiary));
  padding: 64px 24px;
  text-align: center;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 24px;
}

.media-item {
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: var(--shadow-2);
  transition: box-shadow 200ms ease-in-out;
}

.media-item:hover {
  box-shadow: var(--shadow-3);
}
```

### Email Template Base (Resend + React Email)
Base styles for transactional emails. Phones have limited CSS support; use inline styles + minimal media queries.

```css
/* Email base */
body {
  font-family: -apple-system, Segoe UI, sans-serif;
  background-color: var(--color-surface-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  line-height: 1.5;
}

.email-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: var(--color-surface-secondary);
}

.email-cta {
  display: inline-block;
  padding: 12px 32px;
  background: var(--color-primary);
  color: black;
  text-decoration: none;
  border-radius: 9999px;
  font-weight: 600;
}
```

---

## 13. Do's and Don'ts

### Common Patterns

#### Destructive Action Confirmation

All actions that delete or permanently change data must require confirmation:

```tsx
{/* Delete Button with Confirmation Dialog */}
<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete Brief</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete this brief?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. All submissions will be permanently deleted.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowConfirm(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Rules:**
- Modal title clearly states the action
- Description explains consequences (data loss, permanent changes)
- Destructive button is right-aligned (easy to avoid accidental clicks)
- Cancel button is default/secondary styling
- Keyboard focus management: focus moves to modal on open, back to trigger on close

#### Text Truncation with Tooltips

Long text (names, titles, descriptions) must truncate gracefully with tooltip fallback:

```css
/* Single-line truncation */
.truncate-single {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line clamping (2–3 lines max) */
.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hover tooltip reveals full text */
.with-tooltip {
  cursor: help;
}
```

**Usage:**
```tsx
<div className="truncate-single" title="Full text appears in native tooltip">
  Very long title that gets truncated
</div>

{/* Rich tooltip with custom styling */}
<Tooltip content="Full composer name: Ayo Adeyemi Okonkwo">
  <span className="truncate-single">Ayo Adeyemi Okonkwo</span>
</Tooltip>
```

---

### Do ✅

- **Use semantic tokens everywhere.** Never hardcode hex.
- **Maintain dark-first aesthetic.** All surfaces `#121212`–`#282828` range.
- **Apply consistent spacing.** All margins/padding = multiples of 4px.
- **Test 4.5:1 contrast.** All text must meet WCAG AA on all backgrounds.
- **Implement hover states universally.** Every interactive element must signal interactivity.
- **Use shadows for depth, not borders.** Borders waste dark UI real estate.
- **Round corners consistently.** Cards 6px, buttons 9999px, modals 8px.
- **Provide focus indicators.** 2px `var(--color-focus-ring)` ring on tab navigation.
- **Scale responsively.** Test at 375px (mobile), 768px (tablet), 1024px (desktop).
- **Respect `prefers-reduced-motion`.** Disable animations for accessibility.
- **Use easing curves.** ease-out (150ms) for hover, ease-in-out (200ms) for elevation, ease-in (300ms) for modals.
- **Manage focus on state changes.** Move focus after modal opens, form submits, or list items change.
- **Confirm destructive actions.** Always show a modal before delete/permanent operations.

### Don't ❌

- **Don't hardcode hex values.** Use CSS variables only.
- **Don't exceed 2 font weights per screen.** Stick to 400/600 or 600/700 pairs.
- **Don't use `#1ED760` for secondary actions.** Reserve green for primary CTAs only.
- **Don't skip shadow elevation.** Every raised component needs a shadow level.
- **Don't use light backgrounds in dark mode.** Violates dark-first principle.
- **Don't crop or distort imagery.** Preserve aspect ratios. Use full-bleed containers.
- **Don't over-round corners.** Max 9999px (pill shape); no arbitrary values.
- **Don't add borders to dark surfaces.** Use `var(--color-overlay-hover)` instead.
- **Don't disable focus states.** Keyboard navigation is accessibility, not optional.
- **Don't mix oklch and hex.** Choose one color space per file and stick to it.
- **Don't use arbitrary z-index values.** Always use the z-index scale (0, 10, 20, 40, 100, 1000).
- **Don't truncate long text without a tooltip.** Always provide a way to see the full content.
- **Don't skip destructive action confirmation.** Accidental deletion is user trust loss.

---

## 14. Implementation Checklist for Phase E

### Components to Style/Verify

- [ ] Brief card (title, genres, budget, match count, status badge)
- [ ] Composer card (avatar, name, match %, confidence, invite button)
- [ ] Submission panel (upload progress, status, timeline)
- [ ] AI reasoning card (score, confidence, explanation text)
- [ ] Empty state (icon, title, description, CTA)
- [ ] Loading skeleton (pulse animation, placeholder shapes)
- [ ] AI debug panel (metrics display, optional/admin-only)
- [ ] Success/error toasts (2–4 second timeout, icon + text)
- [ ] Form inputs (text, search, textarea if needed)
- [ ] Button states (primary, secondary, ghost, icon; all 4 states: default, hover, active, disabled)
- [ ] Modal/dialog (background, 24px padding, shadow level 4)
- [ ] Sidebar navigation (active/hover states, collapsed mode)
- [ ] Top navigation (height 64px, logo + actions)

### Testing Checklist

- [ ] Dark mode toggle works (class strategy via `[data-theme="dark"]`)
- [ ] Touch targets ≥ 44px on mobile
- [ ] Text contrast ≥ 4.5:1 (test with WebAIM contrast checker)
- [ ] Responsive at 375px, 768px, 1024px breakpoints
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Focus indicators visible (2px ring)
- [ ] Hover states trigger on desktop
- [ ] No hardcoded hex values (grep for `#` in CSS)
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Loading states appear immediately (no janky flash)

---

## 15. Quick Reference for Designers/Developers

### Color Quick Pick

```
Primary CTA:        #1ED760 (var(--color-primary))
Dark Surface:       #121212 (var(--color-surface-primary))
Elevated Surface:   #1F1F1F (var(--color-surface-secondary))
White Text:         #FFFFFF (var(--color-text-primary))
Gray Text:          #B3B3B3 (var(--color-text-secondary))
Light Gray Text:    #7C7C7C (var(--color-text-tertiary))
Error:              #C01810 (var(--color-error))
Border:             #404040 (var(--color-border))
```

### Spacing Quick Pick

```
Tight:    4px, 8px
Standard: 12px, 16px, 24px
Loose:    32px, 48px
```

### Border Radius Quick Pick

```
Sharp:     0px
Subtle:    4px
Standard:  6px
Rounded:   9999px (pills)
Circle:    50%
```

### Shadow Quick Pick

```
Level 0 (flat):        none
Level 1 (subtle):      0px 2px 8px rgba(0,0,0,0.3)
Level 2 (standard):    0px 8px 24px rgba(0,0,0,0.4)
Level 3 (elevated):    0px 12px 32px rgba(0,0,0,0.6)
Level 4 (floating):    0px 16px 40px rgba(0,0,0,0.8)
Level 5 (maximum):     0px 20px 48px rgba(0,0,0,1.0)
```

---

## 15. Implementation Notes for Future Phases

- **Phase F (Analytics):** Extend `.analytics-grid` CSS. Add chart component wrapper styles. Re-use color tokens for chart fills.
- **Phase G (Composer Marketplace):** Use `.portfolio-*` patterns. Extend media grid. Add lightbox/modal for full-size images.
- **Phase H (Recommendations):** Add suggestion card pattern. Extend AI reasoning card with recommendation reasoning.
- **Payment Integration:** Add `.price-card` and `.plan-badge` patterns. Extend semantic colors for pricing tiers.

All patterns inherit from the token system. **No new hex values needed.**

---

**Last updated:** April 2026 — Phase E (Email, UI polish, workflows)  
**Next audit:** Post-Phase F (when analytics ship)
