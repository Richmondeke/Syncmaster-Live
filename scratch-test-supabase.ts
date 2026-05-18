import { getAdminClient } from './lib/supabase/admin'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env.local') })

async function run() {
  try {
    const admin = getAdminClient()
    console.log('Fetching user by ID...')
    const result = await admin.auth.admin.getUserById('user-1')
    console.log('Result:', JSON.stringify(result, null, 2))
  } catch (err) {
    console.error('Error:', err)
  }
}

run()
