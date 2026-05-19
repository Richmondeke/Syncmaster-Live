const { Client } = require('pg')

const connectionString = 'postgresql://postgres.fftfnikbulfayrrjktuo:xpu4K4y**W9qaf4@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'

const SQL = `SELECT id, name FROM storage.buckets;`

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  })
  
  try {
    await client.connect()
    const res = await client.query(SQL)
    console.log('Buckets:', res.rows)
  } catch (err) {
    console.error('❌ Error executing SQL:', err.message)
  } finally {
    await client.end()
  }
}

run()
