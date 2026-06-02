import { generateAudioTags, type AudioMetadata } from '@/lib/ai/agents'
import { analyzeTrackMetadataWithOs, type TrackTagInput, type TrackTags } from './syncmaster-intelligence'

export async function generateTrackTags(metadata: TrackTagInput): Promise<TrackTags> {
  try {
    return await analyzeTrackMetadataWithOs(metadata)
  } catch (error) {
    console.warn('[generateTrackTags] Dakol-AI-OS bridge unavailable. Falling back to app AI tagger.', error)
    return generateAudioTags({
      filename: metadata.filename || metadata.title || 'untitled-track',
      title: metadata.title,
      artist: metadata.artist,
      description: metadata.description,
    })
  }
}

export type { AudioMetadata, TrackTagInput, TrackTags }
