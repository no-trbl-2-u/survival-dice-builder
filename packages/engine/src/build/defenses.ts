import type { DefenseDef } from '@survival/content'
import type { GameEvent } from '../events/events.ts'
import { hexNeighbors, type Axial } from '../hex.ts'
import { isPassable, mapHex, sameHex } from '../map/tiles.ts'
import { enemyAt } from '../movement/move.ts'
import { currentPlayer, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/** A defense the current player can build now, where, and what it costs. */
export type BuildOption = Readonly<{ defense: string; hex: Axial; cost: number }>

/** The material cost of a defense after a card's reduction (never below 0). @rule 12, Table 7, Table 8 */
export function buildCost(def: DefenseDef, costReduction: number): number {
  return Math.max(0, def.cost - costReduction)
}

/**
 * True when a defense may stand on a hex: on the map, not the base, not lake or mountain, no
 * enemy, and no other defense (1 per hex, OPEN-QUESTIONS row 24). A gathering node is allowed
 * when `rulings.buildOnNode` is set (row 14).
 *
 * @rule 12.2
 */
export function canBuildOn(state: GameState, hex: Axial): boolean {
  const h = mapHex(state.map, hex)
  if (!h || !isPassable(state.map, hex)) return false
  if (h.site === 'base') return false
  if (h.site === 'gathering-node' && !state.config.rulings.buildOnNode) return false
  if (enemyAt(state, hex)) return false
  return !state.defenses.some((d) => sameHex(d.hex, hex))
}

/**
 * Every defense the current player can build now: on their hex or an adjacent hex (12.1),
 * on an allowed hex (12.2), and affordable with their materials.
 *
 * @rule 12.1, 12.2
 */
export function legalBuilds(state: GameState, costReduction: number): BuildOption[] {
  const player = currentPlayer(state)
  const hexes = [player.hex, ...hexNeighbors(player.hex)].filter((h) => canBuildOn(state, h))
  return state.content.defenses.flatMap((def) => {
    const cost = buildCost(def, costReduction)
    if (cost > player.materials) return []
    return hexes.map((hex) => ({ defense: def.id, hex, cost }))
  })
}

/**
 * Builds a defense: pays the materials and puts the token on the map at full health.
 *
 * @rule 12.1, Table 7
 */
export function buildDefense(state: GameState, defenseId: string, hex: Axial, cost: number): Step {
  const def = state.content.defenses.find((d) => d.id === defenseId)
  if (!def) throw new Error(`Unknown defense "${defenseId}"`)
  const player = currentPlayer(state)
  const id = `d${state.nextDefenseId}`
  const next: GameState = {
    ...updateCurrentPlayer(state, (p) => ({ ...p, materials: p.materials - cost })),
    defenses: [...state.defenses, { id, kind: def.id, hex, health: def.health }],
    nextDefenseId: state.nextDefenseId + 1,
  }
  const events: GameEvent[] = [
    { type: 'defenseBuilt', rule: '12.1', player: player.id, defense: id, kind: def.id, hex, cost },
  ]
  return [next, events]
}

/**
 * Deals damage to a defense (7.11-7.12) and removes it at 0 health (12.4).
 *
 * @rule 7.11, 7.12, 12.4
 */
export function damageDefense(state: GameState, defenseId: string, amount: number): Step {
  const d = state.defenses.find((x) => x.id === defenseId)
  if (!d || amount <= 0) return [state, []]
  const health = Math.max(0, d.health - amount)
  if (health > 0) {
    return [
      {
        ...state,
        defenses: state.defenses.map((x) => (x.id === defenseId ? { ...x, health } : x)),
      },
      [{ type: 'defenseDamaged', rule: '7.11', defense: d.id, amount, health }],
    ]
  }
  return [
    { ...state, defenses: state.defenses.filter((x) => x.id !== defenseId) },
    [
      { type: 'defenseDamaged', rule: '7.11', defense: d.id, amount, health: 0 },
      { type: 'defenseRemoved', rule: '12.4', defense: d.id },
    ],
  ]
}
