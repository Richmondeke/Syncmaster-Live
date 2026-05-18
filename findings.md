# Findings & Decisions - SyncMaster EPK Implementation

## Requirements
- **EPK Table in Supabase**: Defined via SQL migration. Must include foreign key to `profiles(id)`, standard timestamps, RLS policies (public read for published, write restricted to owners), and unique constraint on `slug`.
- **Dynamic sharable vanity URLs**: Deploy catch-all route at `app/[slug]/page.tsx` resolving unique slugs.
- **EPK Management CRUD**: Full support in `app/(dashboard)/dashboard/epks/page.tsx` via Server Actions with slug uniqueness validation.
- **Local DB Mock Server**: Extend the process-wide simulated REST API route `app/api/supabase/[[...path]]/route.ts` to mock `epks` table actions (`GET`, `POST`, `PATCH`, `DELETE`).

## Research Findings
- **Database client patterns**: Server actions check auth by retrieving cookies and setting headers or using a custom proxy database client.
- **Mock DB routing**: The mock server `app/api/supabase/[[...path]]/route.ts` defines a global mock state in memory containing tables. We need to add the `epks` list here.
- **Vanilla Tailwind CSS v4 design tokens**: The project uses Tailwind CSS v4. Standard colors include primary acid-lime `oklch(0.88 0.18 120)` and dark border-led surfaces.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Catch-all dynamic routing | `app/[slug]/page.tsx` meets the vanity URL request `syncmaster.live/EPKname` perfectly |
| Independent `types/epk.types.ts` | Adheres to strict baseline guidelines to never edit `types/database.types.ts` |
| Slug validation inside Server Actions | Prevent DB conflict errors by performing a safe pre-check on slug existence |

## Visual/Browser Findings
- The original placeholder file `app/(dashboard)/dashboard/epks/page.tsx` contains static mock details (e.g., Album Release, Artist Profile, etc.) with view count badges and layout components.
