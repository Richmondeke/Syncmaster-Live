const { Client } = require('pg')

const connectionString = 'postgresql://postgres.fftfnikbulfayrrjktuo:xpu4K4y**W9qaf4@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'

const SQL = `
-- Create tracks bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('tracks', 'tracks', true) ON CONFLICT DO NOTHING;

-- Set up RLS for the storage.objects table
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tracks');
CREATE POLICY "Allow Uploads Anon" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tracks');
CREATE POLICY "Allow Uploads Authenticated" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tracks' AND auth.role() = 'authenticated');
`

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    await client.connect()
    console.log('Executing storage bucket migration...')
    await client.query(SQL)
    console.log('✅ Storage bucket migration executed successfully!')
  } catch (err) {
    console.error('❌ Error executing SQL:', err.message)
  } finally {
    await client.end()
  }
}

run()
