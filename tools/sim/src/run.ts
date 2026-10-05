import type { GameConfig } from '@survival/content'
import { botChoice, type BotPolicy } from '@survival/bot'
import { applyAction, createGame, type GameState } from '@survival/engine'

/** A run that takes more actions than this is stopped and reported as stalled. */
export const MAX_ACTIONS = 5000

/** One bot run, start to end. */
export type RunResult = Readonly<{
  seed: number
  endRound: number
  cause: 'base' | 'stalled' | 'error'
  error: string | null
  baseHealth: number
  /** Base health at the start of each round (index 0 = round 1). */
  baseCurve: readonly number[]
  /** Enemies on the map at the start of each round. */
  enemyCurve: readonly number[]
  /** The level at the start of each round (index 0 = round 1). */
  levelCurve: readonly number[]
  /** The round the miniature limit first turned a grunt into an elite, or null (never). */
  capReachedRound: number | null
  level: number
  skills: readonly string[]
  milestones: readonly string[]
  actions: number
}>

/** How a batch is played: seats (1-4, default 1) and the bot policy (default `default`). */
export type RunOptions = Readonly<{ seats?: number; policy?: BotPolicy }>

/**
 * Plays 1 run with the bot to the end (or to `MAX_ACTIONS`). Same config + seed + options =
 * same result. With 2-4 seats the bot plays every seat.
 */
export function playRun(config: GameConfig, seed: number, options: RunOptions = {}): RunResult {
  const policy = options.policy ?? 'default'
  let state: GameState = createGame(config, seed, undefined, { players: options.seats ?? 1 })
  const baseCurve: number[] = []
  const enemyCurve: number[] = []
  const levelCurve: number[] = []
  let round = 0
  let actions = 0
  let error: string | null = null
  try {
    while (state.phase !== 'ended' && actions < MAX_ACTIONS) {
      if (state.round !== round && state.phase === 'prepare') {
        round = state.round
        baseCurve.push(state.base.health)
        enemyCurve.push(state.enemies.length)
        levelCurve.push(state.level)
      }
      const action = botChoice(state, { policy })
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
    levelCurve,
    capReachedRound: state.progress.capReachedRound,
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
  /** Median level at the start of rounds 3, 6, and 9, over the runs that reached the round. */
  levelAt: Readonly<Record<'3' | '6' | '9', number>>
  /** Runs that reached the miniature limit, and the median round they first did. */
  capReached: number
  medianCapRound: number
  rounds: Readonly<Record<string, number>>
}>

/** The median level at the start of `round`, over the runs that reached it (NaN when none). */
export function levelAt(results: readonly RunResult[], round: number): number {
  const at = results
    .flatMap((r) => {
      const level = r.levelCurve[round - 1]
      return level === undefined ? [] : [level]
    })
    .sort((a, b) => a - b)
  return quantile(at, 0.5)
}

/** Summarizes a batch. */
export function summarize(results: readonly RunResult[]): Summary {
  const ends = results.map((r) => r.endRound).sort((a, b) => a - b)
  const levels = results.map((r) => r.level).sort((a, b) => a - b)
  const caps = results
    .flatMap((r) => (r.capReachedRound === null ? [] : [r.capReachedRound]))
    .sort((a, b) => a - b)
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
    levelAt: { '3': levelAt(results, 3), '6': levelAt(results, 6), '9': levelAt(results, 9) },
    capReached: caps.length,
    medianCapRound: quantile(caps, 0.5),
    rounds: count(ends.map(String)),
  }
}

/** Runs `runs` seeds starting at `firstSeed`. */
export function runBatch(
  config: GameConfig,
  runs: number,
  firstSeed = 1,
  options: RunOptions = {},
): RunResult[] {
  return Array.from({ length: runs }, (_, i) => playRun(config, firstSeed + i, options))
}
