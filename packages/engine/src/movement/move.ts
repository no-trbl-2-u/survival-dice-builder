import { hexNeighbors, type Axial } from '../hex.ts'
import { hexKey } from '../hex.ts'
import { adjacent, isPassable, sameHex } from '../map/tiles.ts'
import { currentPlayer } from '../state/helpers.ts'
import type { Enemy, GameState } from '../state/types.ts'

/** The enemy standing on a hex, if any (at most 1, rule 3.7). @rule 3.7 */
export function enemyAt(state: GameState, hex: Axial): Enemy | undefined {
  return state.enemies.find((e) => sameHex(e.hex, hex))
}

/**
 * True when an enemy stands next to a hex. The enemy on the hex itself does not count.
 *
 * @rule 6.9
 */
export function nextToEnemy(state: GameState, hex: Axial): boolean {
  return state.enemies.some((e) => adjacent(e.hex, hex))
}

/**
 * The players whose figure is on the map: placed (not waiting for a start hex) and not knocked
 * out. Only these figures block hexes, draw enemies, and shield structures.
 *
 * @rule 3.8, 4.6, core loop v2 (knockout)
 */
export function placedPlayers(state: GameState): GameState['players'] {
  return state.players.filter((p) => !p.knockedOut && !state.unplaced.includes(p.id))
}

/**
 * True when another player's figure blocks a hex. The limit holds on the Base tile too
 * (OPEN-QUESTIONS row 16).
 *
 * @rule 3.8, OPEN-QUESTIONS row 16
 */
export function blockedByFigure(state: GameState, hex: Axial, playerId: string): boolean {
  const others = placedPlayers(state).filter((p) => p.id !== playerId && sameHex(p.hex, hex))
  return others.length >= state.config.rulings.figuresPerHex
}

/**
 * The cost to move into a hex: 1, or `combat.moveCostNextToEnemy` when the hex is next to an
 * enemy (a config option; Spec v2 6.9: 1), unless the card ignores that surcharge (Blink).
 *
 * @rule 6.7, 6.9, Table 8 (Blink), OPEN-QUESTIONS rows 26, 28
 */
export function moveCost(state: GameState, to: Axial, ignoreEnemyCost: boolean): number {
  if (ignoreEnemyCost) return 1
  return nextToEnemy(state, to) ? state.config.combat.moveCostNextToEnemy : 1
}

/**
 * A step the current player can take now, with its cost, and whether it steps off the map edge
 * to reveal a tile (6.7 Explore).
 */
export type MoveOption = Readonly<{ to: Axial; cost: number; reveal: boolean }>

/**
 * The hexes the current player can step into with the movement left: adjacent, on the map,
 * not lake or mountain (3.4), not blocked by another figure (3.8), not holding an enemy (6.9;
 * there is no skirmish, 6.10), and affordable. While the tile deck has tiles, a hex just off the
 * map edge is a step too: it costs `tiles.revealMoveCost` and reveals the next tile under that
 * hex (6.7 Explore).
 *
 * @rule Spec v2 3.4, 3.8, 6.7, 6.9, 6.10, 10.3
 */
export function legalMoves(
  state: GameState,
  hexesLeft: number,
  ignoreEnemyCost: boolean,
): MoveOption[] {
  const player = currentPlayer(state)
  return hexNeighbors(player.hex).flatMap((to): MoveOption[] => {
    if (!state.map.hexes[hexKey(to)]) {
      const cost = state.config.tiles.revealMoveCost
      const canReveal = state.tileDeck.length > 0 && cost <= hexesLeft
      return canReveal ? [{ to, cost, reveal: true }] : []
    }
    if (!isPassable(state.map, to) || blockedByFigure(state, to, player.id)) return []
    if (enemyAt(state, to)) return []
    const cost = moveCost(state, to, ignoreEnemyCost)
    if (cost > hexesLeft) return []
    return [{ to, cost, reveal: false }]
  })
}
