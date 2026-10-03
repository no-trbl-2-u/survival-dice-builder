import type { GameConfig } from '@survival/content'
import { applyAction, createGame, type Action, type GameState } from '@survival/engine'

/** A run as the UI holds it: the seed, the actions taken, and the current engine state. */
export type Run = Readonly<{
  seed: number
  state: GameState
  actions: readonly Action[]
  /** Base health at the start of each round's Prepare (index 0 = round 1), for the summary. */
  baseCurve: readonly number[]
}>

/** Messages the play page sends: start a new run, or take 1 legal action. */
export type RunMsg = Readonly<{ kind: 'new'; seed: number } | { kind: 'act'; action: Action }>

/** Starts a run. */
export function newRun(config: GameConfig, seed: number): Run {
  return { seed, state: createGame(config, seed), actions: [], baseCurve: [] }
}

/**
 * The play page reducer. Every state comes from the engine; the UI keeps the action list so a
 * run can be exported and replayed.
 */
export function runReducer(config: GameConfig) {
  return (run: Run, msg: RunMsg): Run => {
    if (msg.kind === 'new') return newRun(config, msg.seed)
    const state = applyAction(run.state, msg.action).state
    const newRound = state.phase === 'prepare' && state.round > run.baseCurve.length
    return {
      ...run,
      state,
      actions: [...run.actions, msg.action],
      baseCurve: newRound ? [...run.baseCurve, state.base.health] : run.baseCurve,
    }
  }
}
