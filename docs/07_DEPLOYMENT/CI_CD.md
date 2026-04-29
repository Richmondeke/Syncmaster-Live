# CI/CD

## Hosting
- Platform: Vercel
- Branch: `master` auto-deploys to production
- Preview deployments: every PR

## Cron Jobs
- Route: `app/api/cron/`
- Configured in: `vercel.json`
- Auth: Bearer token checked in route handler

## Pre-deploy checklist
- [ ] `npm run build` passes locally with no TS errors
- [ ] All explicit `select()` strings updated if DB columns changed
- [ ] `.env` vars added to Vercel project settings
- [ ] Supabase migrations applied to production project
- [ ] Smoke test: login → brief → outreach → submission → placement
