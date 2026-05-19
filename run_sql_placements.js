const { Client } = require('pg')

const connectionString = 'postgresql://postgres.fftfnikbulfayrrjktuo:xpu4K4y**W9qaf4@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'

const SQL = `
CREATE TABLE IF NOT EXISTS public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES public.tracks(id) ON DELETE SET NULL,
  brief_id UUID,
  track_name TEXT NOT NULL,
  brief_title TEXT NOT NULL,
  company TEXT,
  license_fee TEXT,
  usage TEXT,
  exclusivity TEXT,
  territory TEXT,
  media TEXT,
  isrc TEXT,
  composer_share TEXT,
  commission TEXT,
  contract_id TEXT,
  placed_at DATE,
  writers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "placements_read_all" ON public.placements FOR SELECT USING (true);
CREATE POLICY "placements_admin_all" ON public.placements FOR ALL USING (auth.role() = 'service_role');
`

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    console.log('Creating placements table...')
    await client.query(SQL)
    console.log('✅ placements table created successfully!')
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await client.end()
  }
}

run()
