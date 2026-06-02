import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { unlink, writeFile } from 'node:fs/promises'
import { generateTrackTags, type TrackTagInput } from '@/agents/metadata-tagger'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let tempPath: string | null = null

  try {
    const parsed = await parseTaggerRequest(req)
    tempPath = parsed.tempPath
    const metadata = parsed.metadata

    if (!metadata || !metadata.filename) {
      return NextResponse.json(
        { error: 'Metadata with filename is required' },
        { status: 400 }
      )
    }

    const tags = await generateTrackTags(metadata)

    return NextResponse.json(tags)
  } catch (err) {
    console.error('[API Tagger] error:', err)
    return NextResponse.json(
      { error: 'Failed to generate tags' },
      { status: 500 }
    )
  } finally {
    if (tempPath) {
      await unlink(tempPath).catch(() => undefined)
    }
  }
}

async function parseTaggerRequest(req: Request): Promise<{ metadata: TrackTagInput; tempPath: string | null }> {
  const contentType = req.headers.get('content-type') || ''

  if (!contentType.includes('multipart/form-data')) {
    const body = await req.json()
    return { metadata: body.metadata as TrackTagInput, tempPath: null }
  }

  const form = await req.formData()
  const metadataRaw = form.get('metadata')
  const file = form.get('file')
  const metadata =
    typeof metadataRaw === 'string' && metadataRaw.trim()
      ? (JSON.parse(metadataRaw) as TrackTagInput)
      : {}

  if (!(file instanceof File)) {
    return { metadata, tempPath: null }
  }

  const extension = safeExtension(file.name)
  const tempPath = path.join(tmpdir(), `syncmaster-${randomUUID()}${extension}`)
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(tempPath, buffer)

  return {
    metadata: {
      ...metadata,
      filename: metadata.filename || file.name,
      audioPath: tempPath,
    },
    tempPath,
  }
}

function safeExtension(filename: string): string {
  const extension = path.extname(filename).toLowerCase()
  return /^[a-z0-9.]+$/.test(extension) && extension.length <= 12 ? extension : '.wav'
}
