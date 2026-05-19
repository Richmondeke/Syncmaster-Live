require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testUpload() {
  console.log('Testing upload to Supabase storage...')
  
  // Create a dummy file
  const fileContent = 'dummy audio content'
  
  const { data, error } = await supabase.storage
    .from('tracks')
    .upload(`test-upload-${Date.now()}.txt`, fileContent, {
      contentType: 'text/plain',
      upsert: false
    })
    
  if (error) {
    console.error('❌ Upload failed:', error)
  } else {
    console.log('✅ Upload succeeded:', data)
  }
}

testUpload()
