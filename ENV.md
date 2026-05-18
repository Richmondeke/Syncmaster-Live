# Environment Variables

## Required

| Variable | Purpose | Visibility |
|----------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for browser auth | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase privileged key | Secret |
| `ANTHROPIC_API_KEY` | Active AI runtime key for `services/ai.ts` | Secret |
| `RESEND_API_KEY` | Transactional email | Secret |
| `RESEND_FROM_EMAIL` | Sender email address | Server |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Public |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | Public |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Public |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Public |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Public |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase FCM Sender ID | Public |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | Public |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | FCM VAPID Key for notifications | Public |
| `FIREBASE_PROJECT_ID` | Firebase Admin Project ID | Secret |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin Client Email | Secret |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin Private Key | Secret |

## Optional / Legacy

| Variable | Status |
|----------|--------|
| `AWS_REGION` | Legacy Bedrock experiment; not active baseline |
| `AWS_ACCESS_KEY_ID` | Legacy Bedrock experiment; not active baseline |
| `AWS_SECRET_ACCESS_KEY` | Legacy Bedrock experiment; not active baseline |
| `BEDROCK_MODEL_HAIKU` | Legacy Bedrock experiment; not active baseline |
| `BEDROCK_MODEL_SONNET` | Legacy Bedrock experiment; not active baseline |
| `GEMINI_API_KEY` | Future roadmap only; currently unused |

## Testing

| Variable | Purpose |
|----------|---------|
| `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD` | Admin test account |
| `TEST_PRODUCER_EMAIL` / `TEST_PRODUCER_PASSWORD` | Producer test account |
| `TEST_COMPOSER_EMAIL` / `TEST_COMPOSER_PASSWORD` | Composer test account |

## Rules

- Never commit `.env.local`.
- Never put secrets in variables prefixed with `NEXT_PUBLIC_`.
- AI calls must go through `services/ai.ts` and server-side agents only.
- Do not migrate AI providers unless explicitly requested.
- For local development, copy required variables to `.env.local`.
- For Vercel deployment, set secrets in Project Settings -> Environment Variables.
