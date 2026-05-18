

async function run() {
  const baseUrl = 'http://localhost:3000/api/supabase/rest/v1/epks'
  const epkId = `epk-test-${Date.now()}`
  
  console.log(`1. Creating a new EPK with ID: ${epkId}...`)
  
  const postResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: epkId,
      user_id: 'a2308014-7225-474f-a2e1-04a02111e348',
      title: 'Summer Breeze Test',
      slug: `summer-breeze-test-${Date.now()}`,
      type: 'Single Release',
      status: 'draft',
      bio: 'A chill tropical acoustic soundtrack for testing purposes.',
      tracks: [],
      social_links: {}
    })
  })

  if (!postResponse.ok) {
    console.error('Failed to create EPK:', postResponse.status, await postResponse.text())
    process.exit(1)
  }

  console.log('EPK created successfully!')

  console.log('\n2. Retrieving all EPKs from the database...')
  const getResponse = await fetch(baseUrl, {
    headers: {
      'Accept': 'application/json'
    }
  })

  if (!getResponse.ok) {
    console.error('Failed to retrieve EPKs:', getResponse.status, await getResponse.text())
    process.exit(1)
  }

  const epks = await getResponse.json()
  console.log(`Found ${epks.length} EPKs in mock DB.`)

  const found = epks.find(e => e.id === epkId)
  if (found) {
    console.log('\nSUCCESS: The newly created EPK was found in the list!')
    console.log(JSON.stringify(found, null, 2))
  } else {
    console.error('\nFAILURE: The newly created EPK was NOT found in the list!')
    process.exit(1)
  }
}

run().catch(console.error)
