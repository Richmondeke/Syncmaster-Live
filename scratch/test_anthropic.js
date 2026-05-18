const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  });
}

console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);

const MODELS = [
  'claude-3-5-sonnet-latest',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-haiku-latest',
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307'
];

async function testModels() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('API key missing!');
    return;
  }

  for (const model of MODELS) {
    console.log(`\n--- Testing model: ${model} ---`);
    const payload = {
      model: model,
      max_tokens: 1024,
      tools: [
        {
          name: 'tag_audio',
          description: 'Generate tags and metadata for an audio track.',
          input_schema: {
            type: 'object',
            properties: {
              genres: { type: 'array', items: { type: 'string' } },
              moods: { type: 'array', items: { type: 'string' } },
              energy: { type: 'string', enum: ['low', 'medium', 'high'] },
              bpm: { type: 'number' },
              key: { type: 'string' },
              instruments: { type: 'array', items: { type: 'string' } },
              summary: { type: 'string', description: 'Brief description of the track (1-2 sentences)' },
            },
            required: ['genres', 'moods', 'energy', 'instruments', 'summary'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'tag_audio' },
      messages: [
        {
          role: 'user',
          content: `Analyze this audio track metadata and suggest professional sync licensing tags.
          
          TRACK DETAILS:
          Filename: test_track.mp3
          Title: test track
          Artist: Alistair Sterling
          Description: A dark, intense orchestral hybrid track with heavy brass swells, fast tension strings, and deep hybrid impacts. Ideal for sci-fi video game cinematic trailers.
          
          Return professional tags suitable for a music library search engine.`,
        },
      ],
    };

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(payload),
      });

      console.log('Status:', response.status);
      const body = await response.text();
      console.log('Body snippet:', body.substring(0, 300));
      if (response.ok) {
        console.log(`🎉 SUCCESS WITH MODEL: ${model}`);
        break;
      }
    } catch (err) {
      console.error('Error fetching Anthropic:', err);
    }
  }
}

testModels();
