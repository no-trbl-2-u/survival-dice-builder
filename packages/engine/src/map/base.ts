import { hexDistance, hexKey, tileHexes, type Axial } from '../hex.ts'
import type { GameState } from '../state/types.ts'
import { adjacent, BASE_HEX, sameHex } from './tiles.ts'

/**
 * The hexes of the Base tile: the base centre (4.1, `BASE_HEX`) and its neighbours that are on
 * the same tile, the centre first. The whole 7-hex tile is the base: buying, upgrades, and enemy
 * attacks on the base work from any of its hexes (OPEN-QUESTIONS row 16).
 *
 * @rule 3.6, 4.1, OPEN-QUESTIONS row 16
 */
export function baseHexes(state: GameState): Axial[] {
  const tile = state.map.hexes[hexKey(BASE_HEX)]?.tile
  if (!tile) return []
  return tileHexes(BASE_HEX).filter((h) => state.map.hexes[hexKey(h)]?.tile === tile)
}

/** True when a hex is part of the Base tile. @rule 6.8, 11.2, OPEN-QUESTIONS row 16 */
export function onBaseTile(state: GameState, hex: Axial): boolean {
  return baseHexes(state).some((h) => sameHex(h, hex))
}

/**
 * The Base tile hex nearest to a hex (ties: the centre, then hex key). Enemies rank the base as
 * a target by it.
 *
 * @rule 9.3, OPEN-QUESTIONS row 16
 */
export function nearestBaseHex(state: GameState, from: Axial): Axial {
  const sorted = baseHexes(state).sort(
    (a, b) =>
      hexDistance(a, from) - hexDistance(b, from) ||
      hexDistance(a, BASE_HEX) - hexDistance(b, BASE_HEX) ||
      hexKey(a).localeCompare(hexKey(b)),
  )
  return sorted[0] ?? BASE_HEX
}

/**
 * True when an enemy on `hex` can attack the base: it stands next to a Base tile hex, or on an
 * outer Base tile hex (row 27 lets a spill-over land there).
 *
 * @rule 7.12, OPEN-QUESTIONS rows 16, 27
 */
export function canAttackBase(state: GameState, hex: Axial): boolean {
  return baseHexes(state).some((b) => adjacent(b, hex) || sameHex(b, hex))
}
