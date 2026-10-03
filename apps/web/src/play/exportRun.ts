import type { GameConfig } from '@survival/content'
import { applyAction, createGame, type Action, type GameState } from '@survival/engine'
import type { Run } from './run.ts'

/** The exported run: enough to replay it exactly. */
export type RunExport = Readonly<{
  version: 1
  seed: number
  config: GameConfig
  actions: readonly Action[]
  round: number
  endedBecause: GameState['endedBecause']
  milestones: readonly string[]
}>

/** Builds the export for a run. */
export function exportRun(run: Run): RunExport {
  return {
    version: 1,
    seed: run.seed,
    config: run.state.config,
    actions: run.actions,
    round: run.state.round,
    endedBecause: run.state.endedBecause,
    milestones: run.state.milestones,
  }
}

/** Replays an export through the engine: the same seed, config, and actions give the same state. */
export function replayExport(data: RunExport): GameState {
  return data.actions.reduce((s, a) => applyAction(s, a).state, createGame(data.config, data.seed))
}

/** The download file name: `survival-run-<seed>-round-<n>.json`. */
export function exportFileName(data: RunExport): string {
  return `survival-run-${data.seed}-round-${data.round}.json`
}
