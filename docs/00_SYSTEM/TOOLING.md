# Tools Inventory

## Frontend

- Framework: Next.js 16 App Router
- Language: TypeScript strict
- Styling: Tailwind CSS v4
- Components: shadcn/ui; do not edit `components/ui/` casually
- Forms: `useActionState` + Server Actions; `react-hook-form` is not installed

## Backend & Database

- Database: Supabase PostgreSQL
- Auth: Supabase Auth SSR, cookie-based
- Storage: Supabase Storage
- Server client: `@/lib/supabase/server`
- Browser client: `@/lib/supabase/client`
- RLS: enabled; data filtering happens at the DB layer

## AI Layer

- Runtime: Anthropic Messages API through `services/ai.ts`
- Env var: `ANTHROPIC_API_KEY`
- Agents: `agents/` directory, one file per domain
- Do not call Anthropic directly from components, pages, or server actions
- Do not migrate AI providers unless explicitly requested

## Email

- Provider: Resend
- Templates: React Email in `emails/`
- Sender utility: `services/email.ts`

## Testing

- E2E: Playwright
- Type check: `npx.cmd tsc --noEmit`
- Build: `npm.cmd run build`
- Unit test framework: none currently

## Deployment

- Hosting: Vercel
- Cron: Vercel Cron via `app/api/cron/`
