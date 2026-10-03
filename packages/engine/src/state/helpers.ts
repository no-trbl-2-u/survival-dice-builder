import type { CardDef, EnemyDef, SkillDef } from '@survival/content'
import type { GameEvent } from '../events/events.ts'
import { LOG_LIMIT, type GameState, type Player } from './types.ts'

/** A state change plus the events it produced. Engine steps return this. */
export type Step = readonly [GameState, readonly GameEvent[]]

/** The player whose decision it is. */
export function currentPlayer(state: GameState): Player {
  const player = state.players[state.current]
  if (!player) throw new Error(`No player at index ${state.current}`)
  return player
}

/** Returns a state with the current player replaced by `fn(player)`. */
export function updateCurrentPlayer(state: GameState, fn: (p: Player) => Player): GameState {
  return { ...state, players: state.players.map((p, i) => (i === state.current ? fn(p) : p)) }
}

/** Looks up a card definition. */
export function cardDef(state: GameState, id: string): CardDef {
  const def = state.content.cards.find((c) => c.id === id)
  if (!def) throw new Error(`Unknown card "${id}"`)
  return def
}

/** Looks up a Skill definition. */
export function skillDef(state: GameState, id: string): SkillDef {
  const def = state.content.skills.find((s) => s.id === id)
  if (!def) throw new Error(`Unknown Skill "${id}"`)
  return def
}

/** Looks up an enemy definition. */
export function enemyDef(state: GameState, kind: string): EnemyDef {
  const def = state.content.enemies.enemies.find((e) => e.id === kind)
  if (!def) throw new Error(`Unknown enemy "${kind}"`)
  return def
}

/** The hand size of the active deck preset. @rule 6.1, 18.1 */
export function handSize(state: GameState): number {
  const preset = state.config.deck.presets.find((p) => p.id === state.config.deck.preset)
  if (!preset) throw new Error(`Unknown deck preset "${state.config.deck.preset}"`)
  return preset.handSize
}

/** Appends events to the state's log, keeping the last `LOG_LIMIT`. */
export function withLog(state: GameState, events: readonly GameEvent[]): GameState {
  if (events.length === 0) return state
  return { ...state, log: [...state.log, ...events].slice(-LOG_LIMIT) }
}
