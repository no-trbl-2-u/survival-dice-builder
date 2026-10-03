import { defaultContent, type GameConfig } from '@survival/content'
import {
  applyAction,
  createGame,
  type Action,
  type GameEvent,
  type GameState,
} from '@survival/engine'
import { recordGap, startTiming, type Timing } from './timing.ts'

/** A run as the UI holds it: how it started, the actions taken, and the current engine state. */
export type Run = Readonly<{
  seed: number
  players: number
  config: GameConfig
  state: GameState
  actions: readonly Action[]
  /** Base health at the start of each round's Prepare (index 0 = round 1), for the summary. */
  baseCurve: readonly number[]
  /** Real wall-clock time per phase, decision type, and round. */
  timing: Timing
  /** The events of the last action (animation and sound cues); empty at the start. */
  lastEvents: readonly GameEvent[]
}>

/** Messages the play page sends: start a run, take 1 legal action, or replace the run (load, undo). */
export type RunMsg = Readonly<
  | { kind: 'new'; config: GameConfig; seed: number; players: number; at: number }
  | { kind: 'act'; action: Action; at: number }
  | { kind: 'replace'; run: Run }
>

/** Starts a run. */
export function newRun(config: GameConfig, seed: number, players = 1, at = 0): Run {
  return {
    seed,
    players,
    config,
    state: createGame(config, seed, defaultContent, { players }),
    actions: [],
    baseCurve: [],
    timing: startTiming(at),
    lastEvents: [],
  }
}

/**
 * Takes 1 action at time `at` (default: no time passes); records the time spent on the decision
 * and the base health when a new round's Prepare begins.
 */
export function step(run: Run, action: Action, at = run.timing.lastAt): Run {
  const before = run.state
  const { state, events } = applyAction(before, action)
  const newRound = state.phase === 'prepare' && state.round > run.baseCurve.length
  return {
    ...run,
    state,
    actions: [...run.actions, action],
    baseCurve: newRound ? [...run.baseCurve, state.base.health] : run.baseCurve,
    timing: recordGap(run.timing, at, before.phase, action.type, before.round),
    lastEvents: events,
  }
}

/** Rebuilds a run from its start and actions (load, autosave resume, undo). */
export function replay(
  config: GameConfig,
  seed: number,
  players: number,
  actions: readonly Action[],
): Run {
  return actions.reduce((run, a) => step(run, a), newRun(config, seed, players))
}

/** The same run without its last action (developer undo). */
export function undo(run: Run): Run {
  const back = replay(run.config, run.seed, run.players, run.actions.slice(0, -1))
  return { ...back, timing: run.timing }
}

/**
 * The play page reducer. Every state comes from the engine; the UI keeps the action list so a
 * run can be saved, replayed, and undone.
 */
export function reduceRun(run: Run, msg: RunMsg): Run {
  switch (msg.kind) {
    case 'new':
      return newRun(msg.config, msg.seed, msg.players, msg.at)
    case 'act':
      return step(run, msg.action, msg.at)
    case 'replace':
      return msg.run
  }
}
