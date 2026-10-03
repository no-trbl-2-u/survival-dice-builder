import type { GameConfig } from '@survival/content'
import { botChoice } from '@survival/bot'
import { applyAction, createGame, type GameState } from '@survival/engine'

/** A run that takes more actions than this is stopped and reported as stalled. */
export const MAX_ACTIONS = 5000

/** One bot run, start to end. */
export type RunResult = Readonly<{
  seed: number
  endRound: number
  cause: 'base' | 'player' | 'stalled' | 'error'
  error: string | null
  baseHealth: number
  /** Base health at the start of each round (index 0 = round 1). */
  baseCurve: readonly number[]
  /** Enemies on the map at the start of each round. */
  enemyCurve: readonly number[]
  level: number
  skills: readonly string[]
  milestones: readonly string[]
  actions: number
}>

/** Plays 1 run with the bot to the end (or to `MAX_ACTIONS`). Same config + seed = same result. */
export function playRun(config: GameConfig, seed: number): RunResult {
  let state: GameState = createGame(config, seed)
  const baseCurve: number[] = []
  const enemyCurve: number[] = []
  let round = 0
  let actions = 0
  let error: string | null = null
  try {
    while (state.phase !== 'ended' && actions < MAX_ACTIONS) {
      if (state.round !== round && state.phase === 'prepare') {
        round = state.round
        baseCurve.push(state.base.health)
        enemyCurve.push(state.enemies.length)
      }
      const action = botChoice(state)
      if (!action) break
      state = applyAction(state, action).state
      actions += 1
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }
  const cause = error ? 'error' : (state.endedBecause ?? 'stalled')
  return {
    seed,
    endRound: state.round,
    cause,
    error,
    baseHealth: state.base.health,
    baseCurve,
    enemyCurve,
    level: state.level,
    skills: state.players[0]?.skills ?? [],
    milestones: state.milestones,
    actions,
  }
}

/** The value at fraction `p` (0..1) of sorted numbers, by nearest rank. */
export function quantile(sorted: readonly number[], p: number): number {
  if (sorted.length === 0) return Number.NaN
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1))
  return sorted[i] ?? Number.NaN
}

/** Batch summary: counts, the end-round median and middle half, causes, milestone rates. */
export type Summary = Readonly<{
  runs: number
  errors: number
  stalled: number
  medianEndRound: number
  middleHalf: readonly [number, number]
  minEndRound: number
  maxEndRound: number
  causes: Readonly<Record<string, number>>
  milestones: Readonly<Record<string, number>>
  medianLevel: number
  rounds: Readonly<Record<string, number>>
}>

/** Summarizes a batch. */
export function summarize(results: readonly RunResult[]): Summary {
  const ends = results.map((r) => r.endRound).sort((a, b) => a - b)
  const levels = results.map((r) => r.level).sort((a, b) => a - b)
  const count = (keys: readonly string[]) =>
    keys.reduce<Record<string, number>>((acc, k) => ({ ...acc, [k]: (acc[k] ?? 0) + 1 }), {})
  return {
    runs: results.length,
    errors: results.filter((r) => r.cause === 'error').length,
    stalled: results.filter((r) => r.cause === 'stalled').length,
    medianEndRound: quantile(ends, 0.5),
    middleHalf: [quantile(ends, 0.25), quantile(ends, 0.75)],
    minEndRound: ends[0] ?? Number.NaN,
    maxEndRound: ends.at(-1) ?? Number.NaN,
    causes: count(results.map((r) => r.cause)),
    milestones: count(results.flatMap((r) => r.milestones)),
    medianLevel: quantile(levels, 0.5),
    rounds: count(ends.map(String)),
  }
}

/** Runs `runs` seeds starting at `firstSeed`. */
export function runBatch(config: GameConfig, runs: number, firstSeed = 1): RunResult[] {
  return Array.from({ length: runs }, (_, i) => playRun(config, firstSeed + i))
}
