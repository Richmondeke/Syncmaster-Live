import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Try pg_meta style or just attempt insert to discover columns
  const { data, error } = await supabase.rpc('version')
  if (!error) {
    console.log('Supabase version:', data)
  } else {
    console.log('rpc version error:', error.message)
  }

  // Check what tables exist via postgrest headers trick
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    }
  })
  const schema = await res.json()
  const tableNames = schema.definitions ? Object.keys(schema.definitions) : []
  console.log('Available tables:', tableNames)
}

main()
