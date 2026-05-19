import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SQL = `
-- Create tracks table
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  composer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  genre TEXT,
  duration TEXT,
  bpm TEXT,
  key TEXT,
  audio_url TEXT,
  plays INTEGER DEFAULT 0,
  versions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Allow read for all authenticated users
CREATE POLICY IF NOT EXISTS "tracks_read_all" ON public.tracks
  FOR SELECT USING (true);

-- Allow insert/update/delete for service_role (admin)
CREATE POLICY IF NOT EXISTS "tracks_admin_all" ON public.tracks
  FOR ALL USING (auth.role() = 'service_role');

-- Allow composers to manage their own tracks
CREATE POLICY IF NOT EXISTS "tracks_composer_own" ON public.tracks
  FOR ALL USING (auth.uid() = composer_id);
`

async function main() {
  // Use pg_dump trick: call a stored proc that executes arbitrary SQL
  // Since we can't run raw SQL, we'll try the Supabase Management API
  const projectRef = 'fftfnikbulfayrrjktuo'
  
  // Try the management REST API
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: SQL }),
  })

  if (res.ok) {
    console.log('✅ Table created via management API')
    return
  }

  const errText = await res.text()
  console.log('Management API failed:', res.status, errText)
  
  // Fallback: insert a dummy row to trigger automatic table creation is not possible
  // Instead print the SQL for manual execution
  console.log('\n⚠️  Could not auto-create table. Please run this SQL in Supabase Dashboard → SQL Editor:\n')
  console.log(SQL)
}

main()
