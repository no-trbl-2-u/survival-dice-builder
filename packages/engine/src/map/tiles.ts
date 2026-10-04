import { IMPASSABLE, type TileDef } from '@survival/content'
import { hexDistance, hexKey, hexNeighbors, tileHexes, type Axial } from '../hex.ts'
import type { GameMap, MapHex } from '../state/types.ts'

/**
 * Offsets from a tile's center to the centers of the 6 tiles that can touch it. 7-hex tiles
 * tessellate only in these positions (checked: 7 tiles = 49 distinct hexes).
 *
 * @rule 3.1, 10.1
 */
export const TILE_SLOT_OFFSETS: readonly Axial[] = [
  { q: 2, r: 1 },
  { q: -1, r: 3 },
  { q: -3, r: 2 },
  { q: -2, r: -1 },
  { q: 1, r: -3 },
  { q: 3, r: -2 },
]

/** Where the Base tile's center and the base hex sit. @rule 3.6, 4.1 */
export const BASE_HEX: Axial = { q: 0, r: 0 }

/** The empty map. */
export const EMPTY_MAP: GameMap = { tiles: [], hexes: {} }

/**
 * Places a tile with its center on `center`. Hex `i` of the tile goes to `tileHexes(center)[i]`
 * (fixed rotation, row 5). Returns the new map; the input is not changed.
 *
 * @rule 3.1, 4.1, 4.2, 10.1
 */
export function placeTile(map: GameMap, tile: TileDef, center: Axial): GameMap {
  const positions = tileHexes(center)
  const hexes: Record<string, MapHex> = { ...map.hexes }
  tile.hexes.forEach((hex, i) => {
    const pos = positions[i]
    if (pos) hexes[hexKey(pos)] = { terrain: hex.terrain, site: hex.site, tile: tile.id }
  })
  return { tiles: [...map.tiles, { tile: tile.id, center }], hexes }
}

/**
 * Every slot where a new tile can go: next to a placed tile, and not overlapping one.
 * Ordered by placed tile, then by `TILE_SLOT_OFFSETS`; duplicates removed.
 *
 * @rule 4.2, 10.1
 */
export function emptySlots(map: GameMap): Axial[] {
  const taken = new Set(map.tiles.map((t) => hexKey(t.center)))
  const seen = new Set<string>()
  const out: Axial[] = []
  for (const placed of map.tiles) {
    for (const offset of TILE_SLOT_OFFSETS) {
      const center = { q: placed.center.q + offset.q, r: placed.center.r + offset.r }
      const key = hexKey(center)
      if (taken.has(key) || seen.has(key)) continue
      seen.add(key)
      out.push(center)
    }
  }
  return out
}

/** The lattice index of a hex: tile centres are exactly the hexes where it is 0 (mod 7). */
function latticeIndex(hex: Axial): number {
  const raw = 3 * (hex.q - BASE_HEX.q) + (hex.r - BASE_HEX.r)
  return ((raw % 7) + 7) % 7
}

/**
 * The centre of the tile slot that covers a hex. 7-hex tiles tessellate on 1 lattice (the
 * `TILE_SLOT_OFFSETS` from the Base tile), so every hex belongs to exactly 1 slot: the hex
 * itself or 1 of its neighbours is that slot's centre. A step off the map edge reveals the next
 * tile in this slot (fixed rotation, row 5).
 *
 * @rule 3.1, 10.1, core loop v2 (exploring)
 */
export function slotCovering(hex: Axial): Axial {
  const center = tileHexes(hex).find((h) => latticeIndex(h) === 0)
  if (!center) throw new Error(`slotCovering: no slot centre next to ${hexKey(hex)}`)
  return center
}

/**
 * The hexes just off the map: not on any tile, next to a hex that is. Sorted by hex key.
 *
 * @rule 10.1, core loop v2 (exploring)
 */
export function edgeHexes(map: GameMap): Axial[] {
  const out = new Map<string, Axial>()
  for (const key of Object.keys(map.hexes)) {
    const [q = 0, r = 0] = key.split(',').map(Number)
    for (const n of hexNeighbors({ q, r })) {
      if (!map.hexes[hexKey(n)]) out.set(hexKey(n), n)
    }
  }
  return [...out.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, h]) => h)
}

/** The map hex at a position, or undefined when no tile covers it. */
export function mapHex(map: GameMap, hex: Axial): MapHex | undefined {
  return map.hexes[hexKey(hex)]
}

/**
 * True when figures and enemies may stand on a hex: it is on the map and is not lake or
 * mountain.
 *
 * @rule 3.4
 */
export function isPassable(map: GameMap, hex: Axial): boolean {
  const h = mapHex(map, hex)
  return !!h && !IMPASSABLE.includes(h.terrain)
}

/** Every hex position with a given site, in map order. @rule 3.5, Table 1 */
export function hexesWithSite(map: GameMap, site: MapHex['site']): Axial[] {
  return Object.entries(map.hexes)
    .filter(([, h]) => h.site === site)
    .map(([key]) => {
      const [q, r] = key.split(',').map(Number)
      return { q: q ?? 0, r: r ?? 0 }
    })
}

/** True when two hexes are the same position. */
export function sameHex(a: Axial, b: Axial): boolean {
  return a.q === b.q && a.r === b.r
}

/** True when two hexes touch. */
export function adjacent(a: Axial, b: Axial): boolean {
  return hexDistance(a, b) === 1
}
