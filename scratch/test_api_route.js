async function testRoute() {
  try {
    const response = await fetch('http://localhost:3000/api/ai/tagger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metadata: {
          filename: 'epic_trailer_master.wav',
          title: 'Epic Trailer Master',
          artist: 'Alistair Sterling',
          description: 'A dark cinematic hybrid trailer track with intense brass and fast string rhythms.'
        }
      })
    });

    console.log('API Route Status:', response.status);
    const data = await response.json();
    console.log('API Route Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching API route:', err);
  }
}

testRoute();
