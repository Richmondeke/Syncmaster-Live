# Environment Variables

## Supabase (Database & Auth)

- **NEXT_PUBLIC_SUPABASE_URL** — Supabase project URL (public)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** — Public anon key for client-side auth (public)
- **SUPABASE_SERVICE_ROLE_KEY** — Server-side service role key (secret, never expose)

## AWS Bedrock (AI Runtime)

- **AWS_REGION** — AWS region for Bedrock access. Set to `eu-north-1` (eu-north-1 chosen because Bedrock model access quotas are approved in this region)
- **AWS_ACCESS_KEY_ID** — AWS access key (secret, never expose)
- **AWS_SECRET_ACCESS_KEY** — AWS secret key (secret, never expose)
- **BEDROCK_MODEL_HAIKU** — Haiku model ID for fast, cheap tasks: `eu.anthropic.claude-haiku-4-5-20251001-v1:0`
- **BEDROCK_MODEL_SONNET** — Sonnet model ID for complex reasoning: `eu.anthropic.claude-sonnet-4-5-v1:0`

## Email (Resend)

- **RESEND_API_KEY** — Resend API key for sending transactional emails (secret)
- **RESEND_FROM_EMAIL** — Sender email address, e.g. `"SyncMaster <onboarding@resend.dev>"` (public)

## Application URLs

- **NEXT_PUBLIC_APP_URL** — Application base URL (public)
  - Local: `http://localhost:3000`
  - Production: `https://syncmaster-virid.vercel.app/`

## Optional: Google Gemini (Future)

- **GEMINI_API_KEY** — Google Gemini API key (secret, currently unused, kept for V3.0 roadmap)

## Testing

- **TEST_ADMIN_EMAIL** / **TEST_ADMIN_PASSWORD** — Admin test account
- **TEST_PRODUCER_EMAIL** / **TEST_PRODUCER_PASSWORD** — Producer test account
- **TEST_COMPOSER_EMAIL** / **TEST_COMPOSER_PASSWORD** — Composer test account

---

### Notes

- All variables prefixed `NEXT_PUBLIC_` are embedded in client bundles—never put secrets there
- AWS credentials and Resend API keys are server-only (used in Server Actions and Route Handlers)
- Bedrock calls only happen in `services/ai.ts` and agents. Never call Bedrock directly from components or client code
- For local development, copy the values above to `.env.local`
- For Vercel deployment, set all secret variables in Project Settings → Environment Variables
