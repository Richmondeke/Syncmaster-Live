# Feature: Auth + Role-Gated Access

**Status:** Complete (Phase A)
**Roles affected:** Admin, Producer, Composer

## What it does
- Email/password signup and login via Supabase Auth SSR
- Middleware guard (`proxy.ts`) redirects unauthenticated users to `/login`
- Role stored in `profiles.role` (`admin | producer | composer`)
- Dashboard sidebar renders role-appropriate nav items

## Key files
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/actions/auth.ts`
- `proxy.ts`
- `app/(dashboard)/layout.tsx`

## Test cases
- Login with valid credentials → redirect to dashboard
- Login with invalid credentials → error shown
- Unauthenticated request to `/dashboard` → redirect to `/login`
- Admin sees admin nav; composer sees composer nav
