import Anthropic from '@anthropic-ai/sdk'

export const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
