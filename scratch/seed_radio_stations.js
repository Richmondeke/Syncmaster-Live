const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
  const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
  
  if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim();
  if (keyMatch && keyMatch[1]) supabaseKey = keyMatch[1].trim();
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? (supabaseKey.includes('dummy') ? 'dummy (skipped)' : 'present') : 'missing');

const jsonPath = path.join(__dirname, 'radio_stations.json');
if (!fs.existsSync(jsonPath)) {
  console.error(`Error: JSON file not found at ${jsonPath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(jsonPath, 'utf8');
const stations = JSON.parse(rawData);

console.log(`Loaded ${stations.length} radio stations from JSON.`);

// Check if keys are dummy
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('dummy') || supabaseKey === 'dummy') {
  console.log('================================================================');
  console.log('⚠️  Supabase keys are dummy or missing.');
  console.log('⚠️  Skipping database insertion. Local fallback will be used.');
  console.log('================================================================');
  process.exit(0);
}

// If we have real keys, attempt to insert
async function seed() {
  console.log('Attempting to seed to Supabase...');
  
  // Format stations for DB insertion
  const dbRecords = stations.map(s => ({
    state_city: s['State/City'] || s['SSttaattee//CCiittyy'] || '',
    school: s['School'] || '',
    station: s['Station'] || '',
    email: s['Email'] || null,
    notes: s['Notes'] || null,
    show_name: s['Show'] || null,
    dj_music_dir: s['DJ / Music Dir.'] || null,
    website: s['Website'] || null,
    phone: s['Phone'] || null,
    address: s['Address'] || null,
    submitted: s['Submitted'] || null
  }));

  // Batch insert
  const batchSize = 50;
  for (let i = 0; i < dbRecords.length; i += batchSize) {
    const batch = dbRecords.slice(i, i + batchSize);
    console.log(`Inserting batch ${i / batchSize + 1} (${batch.length} rows)...`);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/radio_stations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ApiKey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(batch)
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }
    } catch (err) {
      console.error(`Failed to insert batch:`, err.message);
      process.exit(1);
    }
  }
  
  console.log('Seeding completed successfully!');
}

seed().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
