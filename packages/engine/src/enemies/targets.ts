import { hexDistance, type Axial } from '../hex.ts'
import { BASE_HEX } from '../map/tiles.ts'
import type { GameState } from '../state/types.ts'

/** Something enemies move toward and attack. @rule 9.3, 7.12 */
export type Target = Readonly<{
  id: string
  kind: 'player' | 'tower' | 'barricade' | 'base'
  hex: Axial
  health: number
}>

/** The kind of a defense token as a target: a blocking defense is a Barricade, else a Tower. */
function defenseKind(state: GameState, kind: string): 'tower' | 'barricade' {
  return state.content.defenses.find((d) => d.id === kind)?.blocksEnemies ? 'barricade' : 'tower'
}

/**
 * Every enemy target on the map: the players, the Barricades and Towers, and the base.
 *
 * @rule 9.3
 */
export function allTargets(state: GameState): Target[] {
  return [
    ...state.players.map((p): Target => ({
      id: p.id,
      kind: 'player',
      hex: p.hex,
      health: p.health,
    })),
    ...state.defenses.map((d): Target => ({
      id: d.id,
      kind: defenseKind(state, d.kind),
      hex: d.hex,
      health: d.health,
    })),
    { id: 'base', kind: 'base', hex: BASE_HEX, health: state.base.health },
  ]
}

/**
 * The targets in the order an enemy on `from` prefers them: nearest first (hex distance), then
 * `rulings.targetTieBreak` (player, Tower, Barricade, base), then lowest health, then id.
 *
 * @rule 9.3, OPEN-QUESTIONS row 15
 */
export function rankTargets(state: GameState, from: Axial): Target[] {
  const order = state.config.rulings.targetTieBreak
  return allTargets(state).sort(
    (a, b) =>
      hexDistance(from, a.hex) - hexDistance(from, b.hex) ||
      order.indexOf(a.kind) - order.indexOf(b.kind) ||
      a.health - b.health ||
      a.id.localeCompare(b.id),
  )
}
