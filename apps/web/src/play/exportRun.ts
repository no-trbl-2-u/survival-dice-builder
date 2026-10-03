import { GameConfigSchema } from '@survival/content'
import type { Action, GameState } from '@survival/engine'
import { replay, type Run } from './run.ts'

/** A saved run: enough to replay it exactly. Also the run summary's export. */
export type RunExport = Readonly<{
  version: 1
  seed: number
  players: number
  config: Run['config']
  actions: readonly Action[]
  round: number
  endedBecause: GameState['endedBecause']
  milestones: readonly string[]
}>

/** Builds the save file for a run. */
export function exportRun(run: Run): RunExport {
  return {
    version: 1,
    seed: run.seed,
    players: run.players,
    config: run.config,
    actions: run.actions,
    round: run.state.round,
    endedBecause: run.state.endedBecause,
    milestones: run.state.milestones,
  }
}

/**
 * Loads a save file: checks the version and the config, then replays every action through the
 * engine (an illegal action means a bad file). Returns the run or a plain error message.
 */
export function importRun(text: string): Readonly<{ run: Run } | { error: string }> {
  try {
    const data = JSON.parse(text) as Partial<RunExport>
    if (data.version !== 1) return { error: 'This is not a version 1 run file.' }
    const config = GameConfigSchema.safeParse(data.config)
    if (!config.success) return { error: 'The run file has an invalid config.' }
    if (typeof data.seed !== 'number' || !Array.isArray(data.actions)) {
      return { error: 'The run file has no seed or no action list.' }
    }
    return { run: replay(config.data, data.seed, data.players ?? 1, data.actions) }
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
export function downloadRun(run: Run): void {
  const data = exportRun(run)
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = exportFileName(data)
  a.click()
  URL.revokeObjectURL(url)
}
