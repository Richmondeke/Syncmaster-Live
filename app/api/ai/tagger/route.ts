import { NextResponse } from 'next/server'
import { generateAudioTags, AudioMetadata } from '@/lib/ai/agents'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { metadata } = body as { metadata: AudioMetadata }

    if (!metadata || !metadata.filename) {
      return NextResponse.json(
        { error: 'Metadata with filename is required' },
        { status: 400 }
      )
    }

    const tags = await generateAudioTags(metadata)

    return NextResponse.json(tags)
  } catch (err) {
    console.error('[API Tagger] error:', err)
    return NextResponse.json(
      { error: 'Failed to generate tags' },
      { status: 500 }
    )
  }
}
