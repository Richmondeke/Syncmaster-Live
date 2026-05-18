#!/bin/bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

cd /Users/mac/.gemini/antigravity/scratch/syncmaster

echo "Linking syncmaster-live..."
npx vercel link --yes --scope richmondekes-projects --project syncmaster-live

for key in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY RESEND_API_KEY; do
  echo "Removing $key..."
  npx vercel env rm $key production -y || true
done

echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://fftfnikbulfayrrjktuo.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdGZuaWtidWxmYXlycmprdHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNjgxNzgsImV4cCI6MjA5Mjc0NDE3OH0.L8U8_f19ZeMSdqvMgk3h7MHqnm6a_X2wukEPoAgz7qA" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdGZuaWtidWxmYXlycmprdHVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE2ODE3OCwiZXhwIjoyMDkyNzQ0MTc4fQ.ycQW-s-hA6269XGM2_EUgQpyBWehvHJMfCBRaJUw___" | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "Adding RESEND_API_KEY..."
echo "re_ToC44cBC_GhbzhYHF86ptUpu1wW5tieDE" | npx vercel env add RESEND_API_KEY production

echo "Triggering deployment..."
npx vercel deploy --prod --yes
