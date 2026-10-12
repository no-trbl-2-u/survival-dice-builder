import type { GameConfig } from '@survival/content'
import { botChoice, type BotPolicy } from '@survival/bot'
import { applyAction, createGame, type GameEvent, type GameState } from '@survival/engine'

/**
 * A run that takes more actions than this per seat is stopped and reported as stalled (per seat
 * since phase 36: 4 defending bots reach 5000 actions by round 10).
 */
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
  /** What happened in play: enemy dice, health, defeats, defenses (phase 36). */
  tally: Tally
}>

/** Counts of play events over 1 run (phase 36: how the policies differ, not only how long). */
export type Tally = Readonly<{
  /** Enemy dice and attacks that hit a player (`enemyAttacked`). */
  hits: number
  /** Enemy dice cancelled because their enemy was defeated (`defeatedDice: "cancelled"`). */
  cancelled: number
  /** Health players lost (after guard). */
  healthLost: number
  knockouts: number
  enemiesDefeated: number
  defensesBuilt: number
  /** Health the base and defenses got back from Repair. */
  repaired: number
  upgradesBought: number
  /** Enemy miniatures put on the map: spawns plus elite swaps (table upkeep, row 70; phase 38). */
  placements: number
  /** Spawns that went to the nearest empty hex instead of their node (9.8). */
  spillOvers: number
  /** Grunts swapped for an elite at the miniature limit (10.5). */
  promotions: number
  /** Combat phases played (counted by `playRun`, not from events). */
  combats: number
}>

/** A tally with every count at 0. */
export const EMPTY_TALLY: Tally = {
  hits: 0,
  cancelled: 0,
  healthLost: 0,
  knockouts: 0,
  enemiesDefeated: 0,
  defensesBuilt: 0,
  repaired: 0,
  upgradesBought: 0,
  placements: 0,
  spillOvers: 0,
  promotions: 0,
  combats: 0,
}

/** Adds 1 action's events to a tally. */
export function addEvents(tally: Tally, events: readonly GameEvent[]): Tally {
  return events.reduce<Tally>((t, e) => {
    switch (e.type) {
      case 'enemyAttacked':
        return { ...t, hits: t.hits + 1 }
      case 'enemyDieCancelled':
        return { ...t, cancelled: t.cancelled + 1 }
      case 'playerDamaged':
        return { ...t, healthLost: t.healthLost + e.toHealth }
      case 'playerKnockedOut':
        return { ...t, knockouts: t.knockouts + 1 }
      case 'enemyDefeated':
        return { ...t, enemiesDefeated: t.enemiesDefeated + 1 }
      case 'defenseBuilt':
        return { ...t, defensesBuilt: t.defensesBuilt + 1 }
      case 'repaired':
        return { ...t, repaired: t.repaired + e.amount }
      case 'upgradeBought':
        return { ...t, upgradesBought: t.upgradesBought + 1 }
      case 'enemySpawned':
        return {
          ...t,
          placements: t.placements + 1,
          spillOvers: t.spillOvers + (e.spilled ? 1 : 0),
        }
      case 'eliteReplaced':
        return { ...t, placements: t.placements + 1, promotions: t.promotions + 1 }
      default:
        return t
    }
  }, tally)
}

/** How a batch is played: seats (1-4, default 1) and the bot policy (default `default`). */
export type RunOptions = Readonly<{ seats?: number; policy?: BotPolicy }>

/**
 * Plays 1 run with the bot to the end (or to `MAX_ACTIONS` per seat). Same config + seed + options =
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
  let tally = EMPTY_TALLY
  const cap = MAX_ACTIONS * (options.seats ?? 1)
  try {
    while (state.phase !== 'ended' && actions < cap) {
      if (state.round !== round && state.phase === 'prepare') {
        round = state.round
        baseCurve.push(state.base.health)
        enemyCurve.push(state.enemies.length)
        levelCurve.push(state.level)
      }
      const action = botChoice(state, { policy })
      if (!action) break
      const next = applyAction(state, action)
      const enteredCombat = state.phase !== 'combat' && next.state.phase === 'combat'
      state = next.state
      tally = addEvents(tally, next.events)
      if (enteredCombat) tally = { ...tally, combats: tally.combats + 1 }
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
    tally,
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
  /** Every run's tally added up. */
  totals: Tally
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
    totals: results.reduce<Tally>(
      (sum, r) =>
        Object.fromEntries(
          Object.entries(sum).map(([k, v]) => [k, v + r.tally[k as keyof Tally]]),
        ) as Tally,
      EMPTY_TALLY,
    ),
  }
}

/** Table upkeep per Combat over a batch: placements, spill-overs, promotions (NaN: no Combat). */
export function upkeepPerCombat(
  totals: Tally,
): Readonly<{ placements: number; spillOvers: number; promotions: number }> {
  const per = (n: number) => (totals.combats > 0 ? n / totals.combats : Number.NaN)
  return {
    placements: per(totals.placements),
    spillOvers: per(totals.spillOvers),
    promotions: per(totals.promotions),
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
