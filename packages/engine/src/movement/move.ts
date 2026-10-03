import { hexNeighbors, type Axial } from '../hex.ts'
import { adjacent, isPassable, mapHex, sameHex } from '../map/tiles.ts'
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
 * True when another player's figure blocks a hex. The base hex holds any number of figures
 * (OPEN-QUESTIONS row 16).
 *
 * @rule 3.8
 */
export function blockedByFigure(state: GameState, hex: Axial, playerId: string): boolean {
  const onBase = mapHex(state.map, hex)?.site === 'base'
  if (onBase && state.config.rulings.baseHexFigureLimitExempt) return false
  const others = state.players.filter((p) => p.id !== playerId && sameHex(p.hex, hex)).length
  return others >= state.config.rulings.figuresPerHex
}

/**
 * The cost to move into a hex: 1, or `combat.moveCostNextToEnemy` when the hex is next to an
 * enemy or holds one (6.9, 6.15), unless the card ignores that surcharge (Blink).
 *
 * @rule 6.7, 6.9, 6.15, Table 8 (Blink)
 */
export function moveCost(state: GameState, to: Axial, ignoreEnemyCost: boolean): number {
  if (ignoreEnemyCost) return 1
  const nearEnemy = nextToEnemy(state, to) || !!enemyAt(state, to)
  return nearEnemy ? state.config.combat.moveCostNextToEnemy : 1
}

/** A step the current player can take now, with its cost and whether it starts a skirmish. */
export type MoveOption = Readonly<{ to: Axial; cost: number; skirmish: boolean }>

/**
 * The hexes the current player can step into with the movement left: adjacent, on the map,
 * not lake or mountain (3.4), not blocked by another figure (3.8), and affordable. A hex with
 * an enemy is a skirmish and needs its full cost (6.10, 6.15).
 *
 * @rule 3.4, 3.8, 6.7, 6.9, 6.10, 6.15
 */
export function legalMoves(
  state: GameState,
  hexesLeft: number,
  ignoreEnemyCost: boolean,
): MoveOption[] {
  const player = currentPlayer(state)
  return hexNeighbors(player.hex).flatMap((to): MoveOption[] => {
    if (!isPassable(state.map, to) || blockedByFigure(state, to, player.id)) return []
    const cost = moveCost(state, to, ignoreEnemyCost)
    if (cost > hexesLeft) return []
    return [{ to, cost, skirmish: !!enemyAt(state, to) }]
  })
}
