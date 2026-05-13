/**
 * Anthropic Messages API client for SyncMaster v1.0
 * Provides a simple interface for interacting with Claude.
 */

type ClaudeTool = {
  name: string
  description: string
  input_schema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

type ClaudeMessageParam = {
  role: 'user' | 'assistant'
  content: string
}

type ClaudeToolChoice = {
  type: 'tool'
  name: string
}

type ClaudeToolUseBlock = {
  type: 'tool_use'
  id: string
  name: string
  input: unknown
}

type ClaudeTextBlock = {
  type: 'text'
  text: string
}

type ClaudeMessageResponse = {
  content: Array<ClaudeToolUseBlock | ClaudeTextBlock>
}

type CreateMessageParams = {
  model: string
  max_tokens: number
  tools?: ClaudeTool[]
  tool_choice?: ClaudeToolChoice
  messages: ClaudeMessageParam[]
}

async function createMessage({
  model,
  max_tokens,
  tools,
  tool_choice,
  messages,
}: CreateMessageParams): Promise<ClaudeMessageResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens,
      tools,
      tool_choice,
      messages,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Anthropic API request failed (${response.status}): ${errorBody}`)
  }

  return (await response.json()) as ClaudeMessageResponse
}

export const ai = {
  messages: {
    create: createMessage,
  },
}
