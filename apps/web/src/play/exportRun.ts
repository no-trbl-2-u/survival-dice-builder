import { GameConfigSchema, withConfigDefaults } from '@survival/content'
import type { Action, GameState } from '@survival/engine'
import { replay, type Run } from './run.ts'
import { closeTiming, resumeTiming, sessionMs, type Timing } from './timing.ts'

/** A saved run: enough to replay it exactly. Also the run summary's export. */
export type RunExport = Readonly<{
  version: 4
  seed: number
  players: number
  config: Run['config']
  actions: readonly Action[]
  round: number
  endedBecause: GameState['endedBecause']
  milestones: readonly string[]
  /** Real time per phase, decision type, and round (milliseconds); the parts sum to sessionMs. */
  timing?: Timing
  sessionMs?: number
}>

/** Builds the save file for a run; `at` closes the open wait (default: the last action). */
export function exportRun(run: Run, at = run.timing.lastAt): RunExport {
  const timing = closeTiming(run.timing, at, run.state.phase, run.state.round)
  return {
    version: 4,
    seed: run.seed,
    players: run.players,
    config: run.config,
    actions: run.actions,
    round: run.state.round,
    endedBecause: run.state.endedBecause,
    milestones: run.state.milestones,
    timing,
    sessionMs: sessionMs(timing),
  }
}

/**
 * Loads a save file: checks the version and the config, then replays every action through the
 * engine (an illegal action means a bad file). Returns the run or a plain error message. A
 * version 3 file (phase 21) still loads: its config gets the phase 22 options at their defaults
 * (off), which replay a phase 21 run unchanged.
 */
export function importRun(text: string, at = 0): Readonly<{ run: Run } | { error: string }> {
  try {
    const data = JSON.parse(text) as Partial<Omit<RunExport, 'version'>> & { version?: unknown }
    if (typeof data.version === 'number' && data.version < 3) {
      return { error: 'This run file is from an earlier version and cannot be replayed.' }
    }
    if (data.version !== 3 && data.version !== 4) {
      return { error: 'This is not a version 3 or 4 run file.' }
    }
    const config = GameConfigSchema.safeParse(withConfigDefaults(data.config))
    if (!config.success) return { error: 'The run file has an invalid config.' }
    if (typeof data.seed !== 'number' || !Array.isArray(data.actions)) {
      return { error: 'The run file has no seed or no action list.' }
    }
    const run = replay(config.data, data.seed, data.players ?? 1, data.actions)
    return { run: { ...run, timing: resumeTiming(data.timing, at) } }
  } catch (e) {
    return { error: `The run file cannot be loaded: ${e instanceof Error ? e.message : String(e)}` }
  }
}

/** Replays an export through the engine: the same start and actions give the same state. */
export function replayExport(data: RunExport): GameState {
  return replay(data.config, data.seed, data.players, data.actions).state
}

/** The download file name: `survival-run-<seed>-round-<n>.json`. */
export function exportFileName(data: RunExport): string {
  return `survival-run-${data.seed}-round-${data.round}.json`
}

/** Starts a browser download of a run file. */
export function downloadRun(run: Run, at: number): void {
  const data = exportRun(run, at)
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = exportFileName(data)
  a.click()
  URL.revokeObjectURL(url)
}
