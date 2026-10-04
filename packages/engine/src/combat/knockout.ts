import { baseHexes } from '../map/base.ts'
import { blockedByFigure, enemyAt, placedPlayers } from '../movement/move.ts'
import type { GameEvent } from '../events/events.ts'
import type { Axial } from '../hex.ts'
import { sameHex } from '../map/tiles.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState, Player } from '../state/types.ts'

/**
 * Knocks out a player at 0 health (core loop v2): the figure leaves the map, guard is removed,
 * every card (hand, in play, deck) goes on the discard pile so the player takes no more turns
 * this round, and the materials carried are lost (`knockout.loseMaterials`, row 55). A Move or
 * Build in progress ends. The run goes on: it ends only when the base falls (14.1).
 *
 * @rule 14.2, core loop v2 (knockout), OPEN-QUESTIONS row 55
 */
export function knockOut(state: GameState, playerId: string): Step {
  const player = state.players.find((p) => p.id === playerId)
  if (!player || player.knockedOut) return [state, []]
  const lost = state.config.knockout.loseMaterials ? player.materials : 0
  const out: Player = {
    ...player,
    health: 0,
    guard: 0,
    knockedOut: true,
    materials: player.materials - lost,
    discard: [...player.inPlay, ...player.hand, ...player.deck, ...player.discard],
    hand: [],
    inPlay: [],
    deck: [],
  }
  return [
    {
      ...state,
      players: state.players.map((p) => (p.id === playerId ? out : p)),
      active: null,
    },
    [{ type: 'playerKnockedOut', rule: '14.2', player: playerId, materialsLost: lost }],
  ]
}

/**
 * The Base tile hexes a figure can be put on now: no figure (3.8) and no enemy on it.
 *
 * @rule 3.8, 4.6, OPEN-QUESTIONS row 16
 */
export function freeBaseHexes(state: GameState, playerId: string): Axial[] {
  return baseHexes(state).filter((h) => !blockedByFigure(state, h, playerId) && !enemyAt(state, h))
}

/**
 * How many more figures the Base tile can take now: on each hex with no enemy,
 * `rulings.figuresPerHex` minus the figures already there.
 *
 * @rule 3.8, 4.6
 */
function freeFigurePlaces(state: GameState): number {
  const limit = state.config.rulings.figuresPerHex
  return baseHexes(state)
    .filter((h) => !enemyAt(state, h))
    .reduce((sum, h) => {
      const there = placedPlayers(state).filter((p) => sameHex(p.hex, h)).length
      return sum + Math.max(0, limit - there)
    }, 0)
}

/**
 * The round start (core loop v2): each knocked-out player, in seat order, comes back with
 * maximum health divided by `knockout.returnHealthDivisor`, rounded up (row 55), and then puts
 * the figure on a free Base tile hex (`unplaced`, the same choice as setup). With no free hex
 * left for them the player stays knocked out until the next round start.
 *
 * @rule 4.6, core loop v2 (knockout), OPEN-QUESTIONS row 55
 */
export function returnKnockedOut(state: GameState): Step {
  let free = freeFigurePlaces(state)
  let current = state
  const events: GameEvent[] = []
  for (const player of state.players) {
    if (!player.knockedOut) continue
    if (free === 0) {
      events.push({ type: 'returnDelayed', rule: '4.6', player: player.id })
      continue
    }
    free -= 1
    const health = Math.ceil(player.maxHealth / state.config.knockout.returnHealthDivisor)
    current = {
      ...current,
      players: current.players.map((p) =>
        p.id === player.id ? { ...p, knockedOut: false, health } : p,
      ),
      unplaced: [...current.unplaced, player.id],
    }
    events.push({ type: 'playerReturned', rule: '4.6', player: player.id, health })
  }
  return [current, events]
}
