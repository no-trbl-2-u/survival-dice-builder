/**
 * Axial hex coordinates. A hex is addressed by `{ q, r }`; its map key is `"q,r"`.
 *
 * @rule 3.1
 */
export type Axial = Readonly<{ q: number; r: number }>

/**
 * The 6 axial neighbour offsets, in clockwise order starting east (flat-top layout).
 *
 * @rule 3.1
 */
export const AXIAL_DIRECTIONS: readonly Axial[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
]

/**
 * Returns the map key for a hex.
 *
 * @param hex - the hex to key.
 * @returns `"q,r"`, the key used in `GameState.map.hexes`.
 */
export function hexKey(hex: Axial): string {
  return `${hex.q},${hex.r}`
}

/**
 * Returns the 6 hexes adjacent to a hex. A map tile is 1 center hex plus these 6.
 *
 * @param hex - the center hex.
 * @returns the 6 neighbours, in `AXIAL_DIRECTIONS` order. The input is not changed.
 * @rule 3.1
 */
export function hexNeighbors(hex: Axial): Axial[] {
  return AXIAL_DIRECTIONS.map((d) => ({ q: hex.q + d.q, r: hex.r + d.r }))
}

/**
 * Returns the number of hex steps between 2 hexes.
 *
 * @param a - first hex.
 * @param b - second hex.
 * @returns the hex distance (0 when equal, 1 for neighbours).
 */
export function hexDistance(a: Axial, b: Axial): number {
  const dq = a.q - b.q
  const dr = a.r - b.r
  // Axial distance: the third cube coordinate is s = -q - r.
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2
}

/**
 * Returns the 7 hexes of a map tile centered on a hex: the center first, then its neighbours.
 *
 * @param center - the tile's center hex.
 * @returns 7 hexes.
 * @rule 3.1
 */
export function tileHexes(center: Axial): Axial[] {
  return [center, ...hexNeighbors(center)]
}
