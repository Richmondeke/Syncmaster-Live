import { test, expect } from '@playwright/test';

test.describe('Phase 7: SyncMaster intelligence API', () => {
  test('rejects missing metadata', async ({ request }) => {
    const response = await request.post('/api/ai/tagger', {
      data: {},
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Metadata with filename is required' });
  });

  test('returns local intelligence tags for valid metadata', async ({ request }) => {
    const response = await request.post('/api/ai/tagger', {
      data: {
        metadata: {
          filename: 'night-lift.wav',
          title: 'Night Lift',
          artist: 'Dakol',
          description: 'Dark cinematic 120 bpm instrumental strings',
        },
      },
    });

    expect(response.ok()).toBe(true);

    const body = await response.json();
    expect(normalizeList(body.genres)).toContain('cinematic');
    expect(normalizeList(body.moods)).toContain('dark');
    expect(body.bpm).toBe(120);
    expect(body.summary).toContain('local SyncMaster intelligence layer');
  });

  test('accepts multipart audio for local real-audio analysis', async ({ request }) => {
    const response = await request.post('/api/ai/tagger', {
      multipart: {
        metadata: JSON.stringify({
          filename: 'night-lift.wav',
          title: 'Night Lift',
          artist: 'Dakol',
          description: 'Dark cinematic instrumental',
        }),
        file: {
          name: 'night-lift.wav',
          mimeType: 'audio/wav',
          buffer: createClickWav(120),
        },
      },
    });

    expect(response.ok()).toBe(true);

    const body = await response.json();
    expect(normalizeList(body.genres)).toContain('cinematic');
    expect(normalizeList(body.moods)).toContain('dark');
    expect(body.bpm).toBeGreaterThanOrEqual(112);
    expect(body.bpm).toBeLessThanOrEqual(128);
    expect(body.sources).toContain('audio_file');
  });
});

function normalizeList(values: unknown): string[] {
  return Array.isArray(values)
    ? values.map((value) => String(value).trim().toLowerCase()).filter(Boolean)
    : [];
}

function createClickWav(bpm: number): Buffer {
  const sampleRate = 8000;
  const seconds = 2.5;
  const totalFrames = Math.floor(sampleRate * seconds);
  const data = Buffer.alloc(totalFrames * 2);
  const beatInterval = 60 / bpm;

  for (let index = 0; index < totalFrames; index += 1) {
    const t = index / sampleRate;
    const beatPosition = t % beatInterval;
    const value = beatPosition < 0.025
      ? Math.round(20000 * Math.sin(2 * Math.PI * 880 * t))
      : Math.round(500 * Math.sin(2 * Math.PI * 220 * t));
    data.writeInt16LE(value, index * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}
