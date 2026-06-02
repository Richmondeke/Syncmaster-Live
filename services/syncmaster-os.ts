import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const DEFAULT_OS_ROOT = path.resolve(process.cwd(), '..', 'Dakol-AI-OS', 'Dakol-AI-OS')
const DEFAULT_TIMEOUT_MS = 15_000
const DEFAULT_AUDIO_TIMEOUT_MS = 45_000

export type SyncMasterOsCommand =
  | 'analyze-metadata'
  | 'analyze-audio'
  | 'recommend-fit'
  | 'match-brief'
  | 'save-track'
  | 'save-brief'
  | 'save-recommendation'

export class SyncMasterOsError extends Error {
  constructor(
    message: string,
    readonly details?: { stderr?: string; stdout?: string; cause?: unknown },
  ) {
    super(message)
    this.name = 'SyncMasterOsError'
  }
}

export function getSyncMasterOsRoot(): string {
  return process.env.DAKOL_AI_OS_PATH || DEFAULT_OS_ROOT
}

export function isSyncMasterOsAvailable(root = getSyncMasterOsRoot()): boolean {
  return existsSync(path.join(root, 'scripts', 'os_cli.py'))
}

export async function runSyncMasterOs<T>(
  command: SyncMasterOsCommand,
  args: string[],
): Promise<T> {
  const root = getSyncMasterOsRoot()
  const scriptPath = path.join(root, 'scripts', 'os_cli.py')

  if (!isSyncMasterOsAvailable(root)) {
    throw new SyncMasterOsError(`Dakol-AI-OS CLI not found at ${scriptPath}`)
  }

  const pythonPath =
    process.env.DAKOL_AI_OS_PYTHON ||
    (existsSync(path.join(root, 'venv', 'bin', 'python'))
      ? path.join(root, 'venv', 'bin', 'python')
      : 'python3')

  const timeout = Number(
    process.env.DAKOL_AI_OS_TIMEOUT_MS ||
    (command === 'analyze-audio' ? DEFAULT_AUDIO_TIMEOUT_MS : DEFAULT_TIMEOUT_MS),
  )

  try {
    const { stdout, stderr } = await execFileAsync(
      pythonPath,
      [scriptPath, 'syncmaster', command, ...args],
      {
        cwd: root,
        timeout: Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT_MS,
        maxBuffer: 1024 * 1024,
        env: {
          ...process.env,
          PLANNING_PROVIDER: process.env.PLANNING_PROVIDER || 'deterministic',
          PLANNER_USE_CACHE: process.env.PLANNER_USE_CACHE || 'false',
        },
      },
    )

    try {
      return JSON.parse(stdout) as T
    } catch (cause) {
      throw new SyncMasterOsError('Dakol-AI-OS returned invalid JSON', { stdout, stderr, cause })
    }
  } catch (cause) {
    if (cause instanceof SyncMasterOsError) throw cause

    const error = cause as { stderr?: string; stdout?: string; message?: string }
    throw new SyncMasterOsError(error.message || 'Dakol-AI-OS command failed', {
      stderr: error.stderr,
      stdout: error.stdout,
      cause,
    })
  }
}
