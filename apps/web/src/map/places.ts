import { hexDistance, hexKey, type Axial, type GameState } from '@survival/engine'
import { hexLabel } from '../tiles/TileView.tsx'
import { hexToPixel } from './geometry.ts'

/** The 8 compass words, clockwise from north (screen up). */
const COMPASS = [
  'north',
  'north-east',
  'east',
  'south-east',
  'south',
  'south-west',
  'west',
  'north-west',
] as const

/**
 * The direction from one hex to another as drawn on screen: one of 8 compass words, or `here`.
 *
 * @param from - the hex the player is looking from.
 * @param to - the hex being named.
 */
export function bearing(from: Axial, to: Axial): string {
  if (from.q === to.q && from.r === to.r) return 'here'
  const a = hexToPixel(from, 1)
  const b = hexToPixel(to, 1)
  // Screen y grows downward; turn it so 0 degrees is north and angles run clockwise.
  const degrees = (Math.atan2(b.x - a.x, a.y - b.y) * 180) / Math.PI
  return COMPASS[Math.round((degrees + 360) / 45) % 8] ?? 'north'
}

/**
 * The first round a spawn node on this hex spawns, when that is after the current round: its
 * tile waits `spawn.newTileDelay` rounds after its reveal (row 66). Null otherwise (no node, or
 * it spawns this round already).
 *
 * @param state - the game state whose map is read.
 * @param hex - the hex to check.
 */
export function spawnsFrom(state: GameState, hex: Axial): number | null {
  const found = state.map.hexes[hexKey(hex)]
  if (found?.site !== 'spawn-node' && found?.site !== 'elite-spawn-node') return null
  const placed = state.map.tiles.find((t) => t.tile === found.tile)
  if (!placed) return null
  const first = placed.revealedRound + state.config.spawn.newTileDelay
  return first > state.round ? first : null
}

/**
 * The name of a map hex: terrain and site ("Plains, Spawn node"), with "(spent)" on a used
 * gathering node, "(spawns from round N)" on a node of a tile that still waits (row 66), or
 * `open ground` off the map.
 *
 * @param state - the game state whose map is read.
 * @param hex - the hex to name.
 */
export function hexName(state: GameState, hex: Axial): string {
  const found = state.map.hexes[hexKey(hex)]
  if (!found) return 'open ground'
  const spent = state.spentNodes.some((n) => n.q === hex.q && n.r === hex.r)
  if (spent) return `${hexLabel(found)} (spent)`
  const from = state.config.spawn.newTileDelay > 0 ? spawnsFrom(state, hex) : null
  return from === null ? hexLabel(found) : `${hexLabel(found)} (spawns from round ${from})`
}

/** Where the base is, or the map origin before a base exists. */
export function baseHex(state: GameState): Axial {
  for (const [key, hex] of Object.entries(state.map.hexes)) {
    if (hex.site !== 'base') continue
    const [q = 0, r = 0] = key.split(',').map(Number)
    return { q, r }
  }
  return { q: 0, r: 0 }
}

/**
 * How far and which way a hex is from another, in words: "2 hexes north-east", "1 hex west", or
 * `here`.
 *
 * @param from - the hex the player is looking from.
 * @param to - the hex being named.
 */
export function stepsAway(from: Axial, to: Axial): string {
  const n = hexDistance(from, to)
  return n === 0 ? 'here' : `${n} ${n === 1 ? 'hex' : 'hexes'} ${bearing(from, to)}`
}

/**
 * Everything standing on a hex, in words: enemies with health, defenses, and figures.
 *
 * @param state - the game state.
 * @param hex - the hex to read.
 */
export function hexContents(state: GameState, hex: Axial): string[] {
  const on = (h: Axial) => h.q === hex.q && h.r === hex.r
  const enemies = state.enemies.filter((e) => on(e.hex))
  const defenses = state.defenses.filter((d) => on(d.hex))
  const figures = state.players.flatMap((p, seat) =>
    on(p.hex) && !state.unplaced.includes(p.id) ? [seat] : [],
  )
  return [
    ...enemies.map((e) => {
      const max = state.content.enemies.enemies.find((x) => x.id === e.kind)?.health ?? e.health
      const tipped = e.attackedThisCombat ? ', attacked' : ''
      return `${e.kind} ${e.id} (${e.health} of ${max} health${tipped})`
    }),
    ...defenses.map((d) => {
      const name = state.content.defenses.find((x) => x.id === d.kind)?.name ?? d.kind
      return `${name} (${d.health} health)`
    }),
    ...figures.map((seat) =>
      state.players.length === 1 ? 'your figure' : `Player ${seat + 1}'s figure`,
    ),
  ]
}

/**
 * The full text name of a hex for the map: its name, then what stands on it.
 *
 * @param state - the game state.
 * @param hex - the hex to describe.
 */
export function hexTitle(state: GameState, hex: Axial): string {
  const contents = hexContents(state, hex)
  return contents.length > 0
    ? `${hexName(state, hex)}: ${contents.join(', ')}`
    : hexName(state, hex)
}

/**
 * A defense by its kind and place, for players who cannot see engine ids: "Tower on Forest,
 * 2 hexes north of the base centre". Falls back to the id when the defense is gone.
 *
 * @param state - the game state.
 * @param id - the defense id.
 */
export function defenseName(state: GameState, id: string): string {
  const defense = state.defenses.find((d) => d.id === id)
  if (!defense) return id
  const name = state.content.defenses.find((x) => x.id === defense.kind)?.name ?? defense.kind
  const away = stepsAway(baseHex(state), defense.hex)
  const where = away === 'here' ? 'the base centre' : `${away} of the base centre`
  return `${name} on ${hexName(state, defense.hex)}, ${where}`
}
