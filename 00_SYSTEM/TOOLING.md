# Tools Inventory

## Frontend
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict, no `any`)
- Styling: Tailwind CSS
- Components: shadcn/ui (do not edit /components/ui/)
- Forms: useActionState + Server Actions (react-hook-form is NOT installed)

## Backend & Database
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth SSR (cookie-based, not magic link)
- Storage: Supabase Storage
- Client (server): `@/lib/supabase/server`
- Client (browser): `@/lib/supabase/client`
- RLS: Enabled (data filtering at DB layer)

## AI Layer
- SDK: `@anthropic-ai/sdk` — imported ONLY via `services/ai.ts`
- Agents: `agents/` directory (one file per domain)
- Do NOT call SDK directly from components, pages, or server actions

## Email
- Provider: Resend
- Templates: React Email (`emails/` directory)
- Sender utility: `lib/email/send.ts`

## Testing
- E2E: Playwright
- Unit: none (Jest is NOT installed)
- Strategy: test critical user flows end-to-end

## Deployment
- Hosting: Vercel
- Cron: Vercel Cron (via `app/api/cron/`)
