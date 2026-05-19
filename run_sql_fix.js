const { Client } = require('pg')
const connectionString = 'postgresql://postgres.fftfnikbulfayrrjktuo:xpu4K4y**W9qaf4@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'

const SQL = `ALTER TABLE public.placements ADD COLUMN IF NOT EXISTS placed_at DATE;`

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  try {
    await client.connect()
    await client.query(SQL)
    console.log('✅ placed_at column added!')
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await client.end()
  }
}
run()
