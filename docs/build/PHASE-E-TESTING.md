# Phase E: Testing Reference

## Quick Test Commands

### Run All Phase E Tests
```bash
npm run test:phase-e
# Runs: build + smoke tests
# Time: ~45s
```

### Individual Tests

| Test | Command | Time | What it checks |
|------|---------|------|---|
| **TypeScript** | `npm run type-check` | 5s | Type errors, strict mode |
| **Build** | `npm run build` | 15s | Next.js compilation, all files |
| **Smoke (E2E)** | `npm run test:smoke` | 30s | Critical happy path, toasts, mobile |
| **All Tests** | `npm test` | 3m | Full test suite (including flaky tests) |
| **Auth Tests** | `npm run test:auth` | 1m | Login/role flows |
| **Briefs Tests** | `npm run test:briefs` | 1m | Brief CRUD, status changes |

---

## Visual Tests (Do These Before Commit)

### 1. **Mobile Responsive** (30 seconds)
```bash
npm run dev
# Open browser → Press F12 → Toggle device toolbar
# Resize to: 375px, 768px, 1280px
# Checklist:
# ✓ No horizontal scroll
# ✓ Buttons are large (44px minimum)
# ✓ Text readable
# ✓ Forms stack vertically
```

### 2. **Color System** (visual inspection)
- Open any page in browser
- Right-click → Inspect → Console
- Paste:
```javascript
// Verify color tokens exist
const colors = ['--color-primary', '--color-success', '--color-error', '--color-surface-primary'];
colors.forEach(c => {
  const val = getComputedStyle(document.documentElement).getPropertyValue(c);
  console.log(`${c}: ${val}`);
});
```
- Should show: `#1ED760` (Spotify green), `#121212` (dark surface), etc.

### 3. **Toasts** (functional check)
```bash
npm run dev
# Navigate to briefs page
# Click "New Brief" or any action button
# Watch for toast notification (appears briefly, auto-dismisses)
# Checklist:
# ✓ Toast appears in corner
# ✓ Fades out after 5 seconds
# ✓ Multiple toasts stack
```

### 4. **Loading States** (functional check)
```bash
npm run dev
# Open Network tab (DevTools → Network)
# Throttle to "Slow 3G"
# Click a form submit button
# Watch button for:
# ✓ Spinner appears
# ✓ Button disabled (grayed out)
# ✓ Text changes to "Loading..." (optional)
```

### 5. **Skeletons** (visual check)
```bash
npm run dev
# Hard refresh page (Cmd+Shift+R / Ctrl+Shift+R)
# Watch briefly for gray placeholder skeletons
# Checklist:
# ✓ Skeleton appears while loading
# ✓ Matches final content width/height
# ✓ Smooth transition to real content (no jank)
```

### 6. **Accessibility** (keyboard navigation)
```bash
npm run dev
# Don't use mouse — only Tab key
# Checklist:
# ✓ Can navigate to all buttons/inputs
# ✓ Focus ring visible (green border)
# ✓ Links underlined/obvious
# ✓ Form labels associated with inputs
```

---

## GitHub Actions (Automated on Push)

These run **automatically** on every commit/PR:
- ✅ TypeScript type-check
- ✅ Next.js build
- ✅ E2E smoke tests
- ⚠️ Accessibility audit (reports only, non-blocking)

**View results:** GitHub → Actions tab → latest run

---

## Before Vercel Deploy

```bash
# 1. Pass local tests
npm run test:phase-e

# 2. Visual inspection on mobile (Chrome DevTools)
# - Test on 375px, 768px, 1280px
# - Verify toasts, loading states, skeletons

# 3. No console errors
# - F12 → Console → Check for red errors

# 4. Commit & push
git add -A
git commit -m "Phase E: [feature name]"
git push

# 5. Wait for GitHub Actions ✅
# 6. Vercel deploys automatically on master
```

---

## Troubleshooting

### Tests Hang
```bash
# Kill any lingering processes
pkill -f "next"
npx playwright codegen
```

### Timeout on Smoke Tests
- Increase in `.github/workflows/phase-e-tests.yml`: `timeout-minutes: 10`
- Or run locally: `npm run test:smoke -- --timeout=60000`

### Color Tokens Not Loading
- Check `app/globals.css` has `:root { --color-primary: #1ED760; ... }`
- Check Tailwind config imports globals.css

### Mobile Test False Negatives
- Clear browser cache: DevTools → Network tab → check "Disable cache"
- Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

---

## Next: Vercel Deployment

Once all tests pass locally AND on GitHub:
```bash
# Vercel auto-deploys on push to master
# Monitor: https://vercel.com/syncmaster1-0

# Check Vercel Cron jobs
# - Brief deadline checker runs daily
# - Submission notifications run every 6h
```
