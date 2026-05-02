# Environment Variables

## Required for all environments

| Variable | Where set | Purpose |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel | Server-only — never expose to browser |
| `RESEND_API_KEY` | `.env.local` + Vercel | Transactional email |
| `ANTHROPIC_API_KEY` | `.env.local` + Vercel | Active AI runtime via `services/ai.ts` |

## Rules
- Never commit `.env.local`
- Never use `SUPABASE_SERVICE_ROLE_KEY` in client components
- All public vars must be prefixed `NEXT_PUBLIC_`
- Add new vars to this doc before adding to code
- Do not add or migrate AI providers unless explicitly requested
