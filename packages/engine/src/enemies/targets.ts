import { hexDistance, type Axial } from '../hex.ts'
import { nearestBaseHex } from '../map/base.ts'
import { placedPlayers } from '../movement/move.ts'
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
 * Every enemy target on the map: the players whose figure is on the map (not knocked out), the
 * Barricades and Towers, and the base. The whole Base tile is the base (row 16), so the base's
 * hex is the Base tile hex nearest `from`.
 *
 * @rule 9.3, OPEN-QUESTIONS row 16, core loop v2 (knockout)
 */
export function allTargets(state: GameState, from: Axial): Target[] {
  return [
    ...placedPlayers(state).map((p): Target => ({
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
    { id: 'base', kind: 'base', hex: nearestBaseHex(state, from), health: state.base.health },
  ]
}

/**
 * How near a target counts for ranking: its hex distance, plus `rulings.playerPullDistance` for
 * a player. Enemies head for the nearest structure and turn to a player only when the player is
 * at least that many hexes nearer (core loop v2; ties go to the player by the tie-break).
 *
 * @rule 9.3, core loop v2 (Combat step 2), OPEN-QUESTIONS row 56
 */
export function rankDistance(state: GameState, from: Axial, target: Target): number {
  const pull = target.kind === 'player' ? state.config.rulings.playerPullDistance : 0
  return hexDistance(from, target.hex) + pull
}

/**
 * The targets in the order an enemy on `from` prefers them: nearest first (`rankDistance`:
 * structures first, a player only when much nearer), then `rulings.targetTieBreak` (player,
 * Tower, Barricade, base), then lowest health, then id.
 *
 * @rule 9.3, OPEN-QUESTIONS rows 15, 56
 */
export function rankTargets(state: GameState, from: Axial): Target[] {
  const order = state.config.rulings.targetTieBreak
  return allTargets(state, from).sort(
    (a, b) =>
      rankDistance(state, from, a) - rankDistance(state, from, b) ||
      order.indexOf(a.kind) - order.indexOf(b.kind) ||
      a.health - b.health ||
      a.id.localeCompare(b.id),
  )
}
