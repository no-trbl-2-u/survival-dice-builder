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
 * The name of a map hex: terrain and site ("Plains, Spawn node"), with "(spent)" on a used
 * gathering node, or `open ground` off the map.
 *
 * @param state - the game state whose map is read.
 * @param hex - the hex to name.
 */
export function hexName(state: GameState, hex: Axial): string {
  const found = state.map.hexes[hexKey(hex)]
  if (!found) return 'open ground'
  const spent = state.spentNodes.some((n) => n.q === hex.q && n.r === hex.r)
  return spent ? `${hexLabel(found)} (spent)` : hexLabel(found)
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
      return `${e.kind} ${e.id} (${e.health} of ${max} health)`
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
