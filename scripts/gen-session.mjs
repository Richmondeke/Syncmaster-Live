#!/usr/bin/env node
/**
 * SyncMaster — Session Prompt Generator
 * Reads PRD checklist files, detects current phase, and prints
 * a ready-to-paste Claude Code session prompt.
 *
 * Usage: npm run session
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ─── File helpers ─────────────────────────────────────────────────────────────

function read(relPath) {
  const full = resolve(ROOT, relPath)
  if (!existsSync(full)) {
    console.error(`  ✗ Missing file: ${relPath}`)
    process.exit(1)
  }
  return readFileSync(full, 'utf-8')
}

// ─── Checklist parser ─────────────────────────────────────────────────────────

function parseCheckboxes(content) {
  const done = []
  const todo = []
  let section = ''

  for (const line of content.split('\n')) {
    const heading = line.match(/^##+ (.+)/)
    if (heading) { section = heading[1].trim(); continue }

    const doneMatch = line.match(/^- \[x\] (.+)/)
    const todoMatch = line.match(/^- \[ \] (.+)/)
    if (doneMatch) done.push({ text: doneMatch[1].trim(), section })
    if (todoMatch) todo.push({ text: todoMatch[1].trim(), section })
  }

  return { done, todo }
}

// ─── Phase detection ──────────────────────────────────────────────────────────
//
// Phase B  — V1.0 items still outstanding
// Phase C  — V1.0 complete, AI schema fields not done
// Phase D  — Schema done, AI agent files not done
// Phase E  — AI done, production polish / security not done
// COMPLETE — everything checked

function detectPhase(v1, v15) {
  if (v1.todo.length > 0) return 'B'

  const schemaKeys = ['ai_score', 'ai_tags', 'ai_match', 'ai_suggested', 'Migration file', 'database.types']
  if (v15.todo.some(t => schemaKeys.some(k => t.text.includes(k)))) return 'C'

  const aiKeys = ['services/ai', 'agents/', 'brief-analyzer', 'composer-matcher', 'Anthropic SDK']
  if (v15.todo.some(t => aiKeys.some(k => t.text.includes(k)))) return 'D'

  if (v15.todo.length > 0) return 'E'

  return 'COMPLETE'
}

// ─── File suggestions ─────────────────────────────────────────────────────────
// Each entry: { keywords: string[], files: string[] }
// First match wins — order from most specific to least specific.

const FILE_HINTS = [
  {
    keywords: ['outreach', 'invite specific'],
    files: [
      'app/actions/outreach.ts',
      'app/(dashboard)/dashboard/briefs/[id]/page.tsx',
      'emails/outreach-invite.ts',
    ],
  },
  {
    keywords: ['brief management', 'manage brief', 'create and manage'],
    files: [
      'app/actions/briefs.ts',
      'app/(dashboard)/dashboard/briefs/page.tsx',
      'app/(dashboard)/dashboard/briefs/[id]/page.tsx',
      'components/briefs/BriefForm.tsx',
      'components/briefs/BriefList.tsx',
    ],
  },
  {
    keywords: ['curated shortlist', 'view curated', 'select preferred'],
    files: [
      'app/(dashboard)/dashboard/briefs/[id]/page.tsx',
      'components/briefs/ShortlistView.tsx',
    ],
  },
  {
    keywords: ['submit', 'track url', 'creative note', 'submission status'],
    files: [
      'app/actions/submissions.ts',
      'app/(dashboard)/dashboard/submissions/page.tsx',
      'components/submissions/SubmissionForm.tsx',
      'components/submissions/SubmissionList.tsx',
    ],
  },
  {
    keywords: ['placement logging', 'placements view', 'fee', 'commission'],
    files: [
      'app/actions/placements.ts',
      'app/(dashboard)/dashboard/placements/page.tsx',
      'components/placements/PlacementList.tsx',
    ],
  },
  {
    keywords: ['settings', 'name, bio', 'portfolio url'],
    files: [
      'app/actions/settings.ts',
      'app/(dashboard)/dashboard/settings/page.tsx',
    ],
  },
  {
    keywords: ['a&r feedback', 'rejection'],
    files: [
      'app/actions/composers.ts',
      'app/(dashboard)/dashboard/composers/page.tsx',
    ],
  },
  // V1.5 — Schema
  {
    keywords: ['ai_score', 'ai_tags', 'ai_match', 'ai_suggested', 'Migration file', 'database.types'],
    files: [
      'supabase/migrations/002_ai_fields.sql',
      'types/database.types.ts',
    ],
  },
  // V1.5 — AI agents
  {
    keywords: ['brief-analyzer', 'genre/mood', 'brief activation'],
    files: [
      'agents/brief-analyzer.ts',
      'services/ai.ts',
    ],
  },
  {
    keywords: ['composer-matcher', 'ranks active composers', 'ai_match_reason'],
    files: [
      'agents/composer-matcher.ts',
      'services/ai.ts',
    ],
  },
  {
    keywords: ['services/ai', 'anthropic sdk client', 'singleton'],
    files: [
      'services/ai.ts',
    ],
  },
  {
    keywords: ['Admin brief detail', 'AI-ranked composer', 'brief view shows AI'],
    files: [
      'app/(dashboard)/dashboard/briefs/[id]/page.tsx',
      'agents/composer-matcher.ts',
    ],
  },
  // V1.5 — Workflows
  {
    keywords: ['brief-workflow', 'submission-workflow', 'state guard', 'valid transition'],
    files: [
      'core/workflows/brief-workflow.ts',
      'core/workflows/submission-workflow.ts',
    ],
  },
  // V1.5 — Production polish
  {
    keywords: ['email notification', 'state transition'],
    files: [
      'lib/email/send.ts',
      'app/actions/briefs.ts',
      'app/actions/submissions.ts',
      'emails/brief-activated.ts',
      'emails/submission-shortlisted.ts',
    ],
  },
  {
    keywords: ['loading skeleton', 'skeleton'],
    files: [
      'app/(dashboard)/dashboard/briefs/loading.tsx',
      'app/(dashboard)/dashboard/submissions/loading.tsx',
      'app/(dashboard)/dashboard/placements/loading.tsx',
    ],
  },
  {
    keywords: ['toast', 'error boundary'],
    files: [
      'app/(dashboard)/layout.tsx',
      '[add sonner via: npx shadcn@latest add sonner]',
    ],
  },
  {
    keywords: ['mobile', 'responsiveness', '375px'],
    files: [
      '[audit — no new files; review all existing pages at 375px]',
    ],
  },
  {
    keywords: ['empty state'],
    files: [
      '[audit — add empty states to all existing list components]',
    ],
  },
  // V1.5 — Security
  {
    keywords: ['rate limit', 'rate-limit'],
    files: ['proxy.ts'],
  },
  {
    keywords: ['input length', 'validation'],
    files: ['app/actions/briefs.ts', 'app/actions/submissions.ts', 'app/actions/outreach.ts'],
  },
  {
    keywords: ['webhook signature'],
    files: ['app/api/webhooks/'],
  },
  {
    keywords: ['service_role', 'SUPABASE_SERVICE_ROLE'],
    files: ['[env audit — no code changes; verify .env.local and Vercel env]'],
  },
  {
    keywords: ['Admin role verified', 'server-side', 'admin server action'],
    files: ['app/actions/briefs.ts', 'app/actions/outreach.ts', 'app/actions/placements.ts'],
  },
]

function suggestFiles(item) {
  const text = item.text.toLowerCase()
  for (const hint of FILE_HINTS) {
    if (hint.keywords.some(k => text.includes(k.toLowerCase()))) {
      return hint.files
    }
  }
  return ['[determine files based on task — see folder structure in CLAUDE.md]']
}

// ─── PRD doc suggestion ───────────────────────────────────────────────────────

function suggestPRDDoc(phase) {
  if (phase === 'B') return '@docs/01_PRD/STATES-AND-FLOWS.md @docs/01_PRD/FEATURES/checklist-v1.md'
  if (phase === 'C') return '@docs/01_PRD/FEATURES/ai-layer.md'
  if (phase === 'D') return '@docs/01_PRD/FEATURES/ai-layer.md'
  if (phase === 'E') return '@docs/01_PRD/FEATURES/ai-layer.md'
  return '@docs/01_PRD/OVERVIEW.md'
}

// ─── Git context ──────────────────────────────────────────────────────────────

function getGitContext() {
  try {
    const log = execSync('git log --oneline -4', { cwd: ROOT, encoding: 'utf-8' }).trim()
    return log.split('\n').map(l => `- ${l}`).join('\n')
  } catch {
    return '- [git log unavailable — fill in manually]'
  }
}

// ─── Phase labels ─────────────────────────────────────────────────────────────

const PHASE_LABELS = {
  B: 'Phase B: Core Loop',
  C: 'Phase C: Schema Extension',
  D: 'Phase D: AI Layer',
  E: 'Phase E: Production + Ship',
  COMPLETE: 'All phases complete',
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const v1  = parseCheckboxes(read('docs/01_PRD/FEATURES/checklist-v1.md'))
const v15 = parseCheckboxes(read('docs/01_PRD/FEATURES/ai-layer.md'))

const phase       = detectPhase(v1, v15)
const activeList  = phase === 'B' ? v1 : v15
const remaining   = activeList.todo
const nextItem    = remaining[0]
const upNext      = remaining.slice(1, 4)

if (phase === 'COMPLETE') {
  console.log('\n  ✓ All PRD items are checked. Nothing left to build.\n')
  process.exit(0)
}

const phaseLabel    = PHASE_LABELS[phase]
const suggestedFiles = suggestFiles(nextItem)
const prdDoc        = suggestPRDDoc(phase)
const gitContext    = getGitContext()

// ─── Progress summary ─────────────────────────────────────────────────────────

const v1Done  = v1.done.length
const v1Total = v1.done.length + v1.todo.length
const v15Done  = v15.done.length
const v15Total = v15.done.length + v15.todo.length

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SYNCMASTER — SESSION PROMPT GENERATOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Phase:     ${phaseLabel}
  Next task: ${nextItem.text}
  Section:   ${nextItem.section}

  V1.0 progress:  ${v1Done}/${v1Total} done
  V1.5 progress:  ${v15Done}/${v15Total} done

  Up next after this session:
${upNext.length ? upNext.map(i => `    • ${i.text}`).join('\n') : '    • (last item in phase)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Copy everything below into Claude Code:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'm working on SyncMaster.

Read CLAUDE.md for full project context.
PRD reference for this session: ${prdDoc}

Session goal: ${nextItem.text}

Current phase: ${phaseLabel}

Files I'm giving you permission to modify:
${suggestedFiles.map(f => `- ${f}`).join('\n')}

Where we left off (recent commits):
${gitContext}

Up next after this session:
${upNext.length ? upNext.map(i => `- ${i.text}`).join('\n') : '- (last item in phase)'}

Constraints this session:
- No new npm packages unless listed below
- Mobile-first
- Complete files only — no truncation
- Follow all rules in CLAUDE.md

Begin with your plan (max 5 bullets), then write the code.
`)
