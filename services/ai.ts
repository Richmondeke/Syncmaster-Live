import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { z } from 'zod'

// ============================================================================
// Task Registry: Strict code-based task definitions
// ============================================================================

const TaskSchemas = {
  'rank-composers': {
    input: z.object({
      brief: z.object({
        title: z.string(),
        description: z.string().nullable(),
        genres: z.array(z.string()).nullable(),
        budget_min: z.number().nullable(),
        budget_max: z.number().nullable(),
      }),
      composers: z.array(
        z.object({
          id: z.string(),
          bio: z.string().nullable(),
          genres: z.array(z.string()).nullable(),
          ai_tags: z.array(z.string()).nullable(),
          profiles: z
            .object({
              full_name: z.string().nullable(),
            })
            .nullable(),
        }),
      ),
    }),
    output: z.array(
      z.object({
        composer_id: z.string(),
        match_score: z.number(),
        match_reason: z.string(),
        confidence: z.number(),
      }),
    ),
  },
} as const

type TaskName = keyof typeof TaskSchemas
type TaskInput<T extends TaskName> = z.infer<typeof TaskSchemas[T]['input']>
type TaskOutput<T extends TaskName> = z.infer<typeof TaskSchemas[T]['output']>

// ============================================================================
// Bedrock Client Initialization
// ============================================================================

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// ============================================================================
// Model Selection
// ============================================================================

function selectModel(taskName: TaskName): string {
  // Haiku for simple, fast tasks; Sonnet for complex reasoning
  const haikuTasks: TaskName[] = []
  const sonnetTasks: TaskName[] = ['rank-composers'] // Complex reasoning

  if (sonnetTasks.includes(taskName)) {
    return process.env.BEDROCK_MODEL_SONNET!
  }
  return process.env.BEDROCK_MODEL_HAIKU!
}

// ============================================================================
// Core runTask Function
// ============================================================================

export async function runTask<T extends TaskName>(
  taskName: T,
  input: TaskInput<T>,
): Promise<TaskOutput<T>> {
  // Validate input against schema
  const inputSchema = TaskSchemas[taskName].input
  const validatedInput = inputSchema.parse(input)

  // Select model
  const modelId = selectModel(taskName)

  // Build prompt based on task
  const prompt = buildPrompt(taskName, validatedInput)

  // Call Bedrock
  const command = new InvokeModelCommand({
    modelId,
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-06-01',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  const response = await bedrock.send(command)

  // Parse response
  const body = JSON.parse(new TextDecoder().decode(response.body))
  const content = body.content[0]?.text || ''

  // Extract and validate output
  const output = parseOutput(taskName, content)
  const outputSchema = TaskSchemas[taskName].output
  const validatedOutput = outputSchema.parse(output)

  return validatedOutput as TaskOutput<T>
}

// ============================================================================
// Prompt Building
// ============================================================================

function buildPrompt(taskName: TaskName, input: unknown): string {
  switch (taskName) {
    case 'rank-composers':
      return buildRankComposersPrompt(
        input as TaskInput<'rank-composers'>,
      )
    default:
      throw new Error(`Unknown task: ${taskName}`)
  }
}

function buildRankComposersPrompt(input: TaskInput<'rank-composers'>): string {
  const { brief, composers } = input

  const composerList = composers
    .map((c) => ({
      id: c.id,
      name: c.profiles?.full_name ?? 'Unknown',
      genres: c.genres ?? [],
      bio: c.bio ?? 'No bio provided',
      tags: c.ai_tags ?? [],
    }))

  const budgetStr =
    brief.budget_min != null && brief.budget_max != null
      ? `$${brief.budget_min}–$${brief.budget_max}`
      : brief.budget_min != null
        ? `From $${brief.budget_min}`
        : brief.budget_max != null
          ? `Up to $${brief.budget_max}`
          : 'Not specified'

  return `You are a sync licensing A&R assistant. Rank these composers by how well they match this brief.

BRIEF
Title: ${brief.title}
Description: ${brief.description ?? 'Not provided'}
Genres: ${brief.genres?.join(', ') ?? 'Not specified'}
Budget: ${budgetStr}

COMPOSERS
${JSON.stringify(composerList, null, 2)}

Return a JSON array of rankings, best to worst. Each entry must have:
{
  "composer_id": "...",
  "match_score": <number 0-10>,
  "match_reason": "<2-3 sentences explaining why this composer matches>",
  "confidence": <number 0-1, how sure you are>
}

For each composer:
- Score 0–10 based on genre fit, style, and profile
- Explain why in 2–3 sentences
- Confidence 0–1 (how sure are you about this match)

Return ONLY the JSON array, no markdown or other text.`
}

// ============================================================================
// Output Parsing
// ============================================================================

function parseOutput(taskName: TaskName, content: string): unknown {
  switch (taskName) {
    case 'rank-composers':
      return parseRankComposersOutput(content)
    default:
      throw new Error(`Unknown task: ${taskName}`)
  }
}

function parseRankComposersOutput(content: string): unknown {
  // Extract JSON from response (may be wrapped in markdown code blocks)
  const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || [null, content]
  const jsonStr = jsonMatch[1] || content

  const parsed = JSON.parse(jsonStr.trim())

  // Ensure it's an array
  if (!Array.isArray(parsed)) {
    throw new Error('Expected JSON array of rankings')
  }

  // Map fields to match expected output (score → match_score)
  return parsed.map((item: any) => ({
    composer_id: item.composer_id,
    match_score: item.score ?? item.match_score,
    match_reason: item.match_reason,
    confidence: item.confidence,
  }))
}
