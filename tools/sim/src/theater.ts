import type { GameConfig } from '@survival/content'
import { botChoice } from '@survival/bot'
import { applyAction, createGame, type GameEvent, type GameState } from '@survival/engine'
import { MAX_ACTIONS, type RunOptions } from './run.ts'

/**
 * Run Theater (docs/design/decision-artifacts.md): one bot run recorded as a frame per Combat
 * start, so a page can show the same seed under several configs side by side. The run is the
 * same loop as `playRun`: same config + seed + options = same end round.
 */

/** A piece on a hex. */
type Piece = Readonly<{ q: number; r: number }>

/** The board right after a Combat's spawns (7.3), and what the Event Calendar did that round. */
export type TheaterFrame = Readonly<{
  round: number
  /** Map hexes as `[q, r, terrain, site]`. */
  hexes: readonly (readonly [number, number, string, string | null])[]
  enemies: readonly (Piece & { kind: string; health: number })[]
  defenses: readonly (Piece & { kind: string; health: number })[]
  players: readonly (Piece & { health: number; maxHealth: number; knockedOut: boolean })[]
  base: Readonly<{ health: number; maxHealth: number }>
  level: number
  /** Enemy miniatures put on the map by this Combat's spawn step. */
  spawned: number
  /** The calendar day's name and boons, or null with the calendar off. */
  day: Readonly<{ name: string; boons: readonly string[]; faces: readonly string[] }> | null
  /** Milestones reached so far. */
  milestones: number
}>

/** A recorded run: a frame per Combat start, and how it ended. */
export type TheaterRun = Readonly<{
  seed: number
  endRound: number
  cause: 'base' | 'stalled' | 'error'
  frames: readonly TheaterFrame[]
}>

/** The frame for a state that has just entered Combat, from that step's events. */
export function frameOf(state: GameState, events: readonly GameEvent[]): TheaterFrame {
  const day = events.find((e) => e.type === 'calendarDay')
  return {
    round: state.round,
    hexes: Object.entries(state.map.hexes).map(([key, hex]) => {
      const [q, r] = key.split(',').map(Number)
      return [q ?? 0, r ?? 0, hex.terrain, hex.site] as const
    }),
    enemies: state.enemies.map((e) => ({ ...e.hex, kind: e.kind, health: e.health })),
    defenses: state.defenses.map((d) => ({ ...d.hex, kind: d.kind, health: d.health })),
    players: state.players.map((p) => ({
      ...p.hex,
      health: p.health,
      maxHealth: p.maxHealth,
      knockedOut: p.knockedOut,
    })),
    base: state.base,
    level: state.level,
    spawned: events.filter((e) => e.type === 'enemySpawned' || e.type === 'eliteReplaced').length,
    day: day?.type === 'calendarDay' ? { name: day.day, boons: day.boons, faces: day.faces } : null,
    milestones: state.milestones.length,
  }
}

/**
 * Plays 1 bot run and records a frame at each Combat start. `maxRounds` stops a long run early
 * (the result is then "stalled"); without it the run ends as `playRun` does.
 */
export function playTheater(
  config: GameConfig,
  seed: number,
  options: RunOptions & { maxRounds?: number } = {},
): TheaterRun {
  const policy = options.policy ?? 'default'
  const seats = options.seats ?? 1
  let state: GameState = createGame(config, seed, undefined, { players: seats })
  const frames: TheaterFrame[] = []
  let actions = 0
  let failed = false
  const cap = MAX_ACTIONS * seats
  const maxRounds = options.maxRounds ?? Number.POSITIVE_INFINITY
  try {
    while (state.phase !== 'ended' && actions < cap && state.round <= maxRounds) {
      const action = botChoice(state, { policy })
      if (!action) break
      const next = applyAction(state, action)
      if (state.phase !== 'combat' && next.state.phase === 'combat')
        frames.push(frameOf(next.state, next.events))
      state = next.state
      actions += 1
    }
  } catch {
    failed = true
  }
  return {
    seed,
    endRound: state.round,
    cause: failed ? 'error' : (state.endedBecause ?? 'stalled'),
    frames,
  }
}
