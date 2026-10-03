import { defaultContent, type GameConfig } from '@survival/content'
import { applyAction, createGame, type Action, type GameState } from '@survival/engine'

/** A run as the UI holds it: how it started, the actions taken, and the current engine state. */
export type Run = Readonly<{
  seed: number
  players: number
  config: GameConfig
  state: GameState
  actions: readonly Action[]
  /** Base health at the start of each round's Prepare (index 0 = round 1), for the summary. */
  baseCurve: readonly number[]
}>

/** Messages the play page sends: start a run, take 1 legal action, or replace the run (load, undo). */
export type RunMsg = Readonly<
  | { kind: 'new'; config: GameConfig; seed: number; players: number }
  | { kind: 'act'; action: Action }
  | { kind: 'replace'; run: Run }
>

/** Starts a run. */
export function newRun(config: GameConfig, seed: number, players = 1): Run {
  return {
    seed,
    players,
    config,
    state: createGame(config, seed, defaultContent, { players }),
    actions: [],
    baseCurve: [],
  }
}

/** Takes 1 action; records the base health when a new round's Prepare begins. */
export function step(run: Run, action: Action): Run {
  const state = applyAction(run.state, action).state
  const newRound = state.phase === 'prepare' && state.round > run.baseCurve.length
  return {
    ...run,
    state,
    actions: [...run.actions, action],
    baseCurve: newRound ? [...run.baseCurve, state.base.health] : run.baseCurve,
  }
}

/** Rebuilds a run from its start and actions (load, autosave resume, undo). */
export function replay(
  config: GameConfig,
  seed: number,
  players: number,
  actions: readonly Action[],
): Run {
  return actions.reduce(step, newRun(config, seed, players))
}

/** The same run without its last action (developer undo). */
export function undo(run: Run): Run {
  return replay(run.config, run.seed, run.players, run.actions.slice(0, -1))
}

/**
 * The play page reducer. Every state comes from the engine; the UI keeps the action list so a
 * run can be saved, replayed, and undone.
 */
export function reduceRun(run: Run, msg: RunMsg): Run {
  switch (msg.kind) {
    case 'new':
      return newRun(msg.config, msg.seed, msg.players)
    case 'act':
      return step(run, msg.action)
    case 'replace':
      return msg.run
  }
}
