import { runSyncMasterOs } from '@/services/syncmaster-os'

export type TrackTagInput = {
  filename?: string
  title?: string
  artist?: string
  description?: string
  tags?: string[]
  audioPath?: string
  duration?: string
  sampleRate?: number
  bitrate?: number
  bpm?: number
  key?: string
  genre?: string
  album?: string
  year?: number
  isrc?: string
}

export type TrackTags = {
  genres: string[]
  moods: string[]
  energy: 'low' | 'medium' | 'high'
  bpm?: number
  key?: string
  instruments: string[]
  summary: string
  confidence?: Record<string, number>
  warnings?: string[]
  sources?: string[]
  modelAssisted?: boolean
}

type OsTrackMetadata = {
  title?: string
  artist?: string
  bpm?: number
  key?: string
  mood?: string[]
  genre?: string[]
  energy?: 'low' | 'medium' | 'high'
  vocals?: string
  tags?: string[]
  source_text?: string
}

type OsMetadataAnalysis = {
  metadata?: OsTrackMetadata
  confidence?: Record<string, number>
  warnings?: string[]
}

type OsMetadataResponse = {
  metadata?: OsTrackMetadata | OsMetadataAnalysis
  confidence?: Record<string, number>
  warnings?: string[]
  source?: string
  model_tags?: {
    provider?: string
    tags?: string[]
    warnings?: string[]
  }
  audio?: {
    duration_seconds?: number
    estimated_bpm?: number
    estimated_key?: string
    energy?: 'low' | 'medium' | 'high'
  }
}

export type SyncFitRecommendation = {
  fit_score: number
  usage_suggestions: string[]
  clearance_notes: string[]
  risks: Array<{ level: string; note: string }>
  reasoning: string[]
}

export type BriefMatch = {
  rank: number
  candidate: Record<string, unknown>
  score: number
  reasons: string[]
}

export async function analyzeTrackMetadataWithOs(input: TrackTagInput): Promise<TrackTags> {
  if (input.audioPath) {
    return analyzeAudioFileWithOs(input)
  }

  const response = await runSyncMasterOs<OsMetadataResponse>('analyze-metadata', [
    '--payload-json',
    JSON.stringify(toOsPayload(input)),
  ])

  return mapOsMetadataToTrackTags(response, input)
}

export async function analyzeAudioFileWithOs(input: TrackTagInput): Promise<TrackTags> {
  if (!input.audioPath) {
    throw new Error('audioPath is required for audio analysis')
  }

  const response = await runSyncMasterOs<OsMetadataResponse>('analyze-audio', [
    '--audio-path',
    input.audioPath,
    '--payload-json',
    JSON.stringify(toOsPayload(input)),
  ])

  return mapOsMetadataToTrackTags(response, input)
}

export async function recommendSyncFitWithOs(
  track: Record<string, unknown>,
  brief: Record<string, unknown>,
): Promise<SyncFitRecommendation> {
  return runSyncMasterOs<SyncFitRecommendation>('recommend-fit', [
    '--track-json',
    JSON.stringify(track),
    '--brief-json',
    JSON.stringify(brief),
  ])
}

export async function matchBriefWithOs(
  brief: Record<string, unknown>,
  candidates: Array<Record<string, unknown>>,
  limit?: number,
): Promise<BriefMatch[]> {
  const args = [
    '--brief-json',
    JSON.stringify(brief),
    '--candidates-json',
    JSON.stringify({ candidates }),
  ]

  if (limit != null) {
    args.push('--limit', String(limit))
  }

  const response = await runSyncMasterOs<{ matches: BriefMatch[] }>('match-brief', args)
  return response.matches
}

function mapOsMetadataToTrackTags(response: OsMetadataResponse, input: TrackTagInput): TrackTags {
  const metadataAnalysis = response.metadata
  const nestedAnalysis = isMetadataAnalysis(metadataAnalysis) ? metadataAnalysis : undefined
  const metadata = (nestedAnalysis?.metadata || metadataAnalysis || {}) as OsTrackMetadata
  const audio = response.audio || {}
  const confidence = response.confidence || nestedAnalysis?.confidence
  const metadataWarnings = nestedAnalysis?.warnings || []
  const genres = cleanList(metadata.genre)
  const moods = cleanList(metadata.mood)
  const modelTags = cleanList(response.model_tags?.tags)
  const tags = [...cleanList(metadata.tags), ...modelTags]
  const instruments = tags.filter((tag) =>
    ['piano', 'strings', 'guitar', 'drums', 'bass', 'synth', 'brass'].some((instrument) =>
      tag.toLowerCase().includes(instrument),
    ),
  )

  const title = metadata.title || input.title || input.filename || 'Untitled track'
  const genreText = genres.length > 0 ? genres.join(', ') : 'sync-ready'
  const moodText = moods.length > 0 ? moods.join(', ') : 'balanced'
  const bpm = metadata.bpm || audio.estimated_bpm
  const key = metadata.key || audio.estimated_key
  const energy = metadata.energy || audio.energy || 'medium'
  const bpmText = bpm ? ` at ${bpm} BPM` : ''

  return {
    genres: genres.length > 0 ? genres : ['Sync'],
    moods: moods.length > 0 ? moods : ['Balanced'],
    energy,
    bpm,
    key: key || undefined,
    instruments: instruments.length > 0 ? instruments : ['Mixed instrumentation'],
    summary: `${title} is a ${moodText} ${genreText} track${bpmText}, analyzed by the local SyncMaster intelligence layer.`,
    confidence,
    warnings: [...(response.warnings || []), ...metadataWarnings, ...(response.model_tags?.warnings || [])],
    sources: ['dakol-ai-os', response.source].filter((source): source is string => Boolean(source)),
    modelAssisted: response.model_tags?.provider != null && response.model_tags.provider !== 'none',
  }
}

function isMetadataAnalysis(value: OsMetadataResponse['metadata']): value is OsMetadataAnalysis {
  return Boolean(value && typeof value === 'object' && 'metadata' in value)
}

function toOsPayload(input: TrackTagInput): Record<string, unknown> {
  return {
    title: input.title || input.filename,
    artist: input.artist,
    description: input.description,
    tags: input.tags,
    duration: input.duration,
    sample_rate: input.sampleRate,
    bitrate: input.bitrate,
    bpm: input.bpm,
    key: input.key,
    genre: input.genre ? [input.genre] : undefined,
    album: input.album,
    year: input.year,
    isrc: input.isrc,
  }
}

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim())
}
