import { hexKey, type Axial, type GameState } from '@survival/engine'
import { stepsAway } from '../map/places.ts'

/**
 * Player names for the pieces on the map, so no engine id (`e3`, `d2`, `c4`) reaches player
 * text. A piece is named by its kind and its place; an ordinal ("(2)") is added only when two
 * pieces would read the same. /debug keeps its ids. Pure: reads the state, decides nothing.
 */

type Enemy = GameState['enemies'][number]
type Defense = GameState['defenses'][number]

/** What naming needs from a state; the log passes the parts it has. */
export type NameSource = Readonly<{
  content: GameState['content']
  enemies?: GameState['enemies']
  defenses?: GameState['defenses']
  map?: GameState['map']
  log?: GameState['log']
}>

const byId = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true })

/** Adds " (n)" when another piece has the same name. */
function withOrdinal<T extends { id: string }>(
  pieces: readonly T[],
  id: string,
  name: (p: T) => string,
): string | null {
  const piece = pieces.find((p) => p.id === id)
  if (!piece) return null
  const own = name(piece)
  const same = pieces
    .filter((p) => name(p) === own)
    .map((p) => p.id)
    .sort(byId)
  return same.length > 1 ? `${own} (${same.indexOf(id) + 1})` : own
}

/** The base center on a map, or the origin before there is one. */
export function baseCentre(map: GameState['map'] | undefined): Axial {
  for (const [key, hex] of Object.entries(map?.hexes ?? {})) {
    if (hex.site !== 'base') continue
    const [q = 0, r = 0] = key.split(',').map(Number)
    return { q, r }
  }
  return { q: 0, r: 0 }
}

/** An enemy's kind from the log, for one no longer on the map. */
function pastKind(n: NameSource, id: string): string | undefined {
  for (const e of n.log ?? []) {
    if (e.type === 'enemySpawned' && e.enemy === id) return e.kind
    if (e.type === 'eliteReplaced' && e.elite === id) return 'elite'
    if (e.type === 'enemyDefeated' && e.enemy === id) return e.kind
  }
  return undefined
}

/**
 * An enemy seen from a hex: "grunt, 1 hex east", "grunt, on your hex", with "(2)" when two read
 * the same. An enemy no longer on the map is its kind alone.
 *
 * @param n - the state (or the parts of it the caller has).
 * @param id - the enemy id.
 * @param from - the hex the player looks from.
 */
export function enemyName(n: NameSource, id: string, from: Axial): string {
  const place = (e: Enemy) => {
    const away = stepsAway(from, e.hex)
    return `${e.kind}, ${away === 'here' ? 'on your hex' : away}`
  }
  return withOrdinal(n.enemies ?? [], id, place) ?? pastKind(n, id) ?? 'enemy'
}

/**
 * An enemy for the log, placed from the base center (the log outlives the player's position):
 * "grunt 2 hexes north of the base center".
 */
export function enemyNameFromBase(n: NameSource, id: string): string {
  const base = baseCentre(n.map)
  const place = (e: Enemy) => {
    const away = stepsAway(base, e.hex)
    return `${e.kind} ${away === 'here' ? 'at the base center' : `${away} of the base center`}`
  }
  return withOrdinal(n.enemies ?? [], id, place) ?? pastKind(n, id) ?? 'enemy'
}

/** A defense's printed name ("Tower"). */
function defenseKind(n: NameSource, d: Defense): string {
  return n.content.defenses.find((x) => x.id === d.kind)?.name ?? d.kind
}

/**
 * A defense for the log and short labels: "Tower 1 hex west of the base center", with "(2)"
 * when two read the same; "a defense" once it is gone.
 */
export function defenseNameFromBase(n: NameSource, id: string): string {
  const base = baseCentre(n.map)
  const place = (d: Defense) => {
    const away = stepsAway(base, d.hex)
    return `${defenseKind(n, d)} ${away === 'here' ? 'at the base center' : `${away} of the base center`}`
  }
  return withOrdinal(n.defenses ?? [], id, place) ?? 'a defense'
}

/** True when a hex is on the map (a known place). */
export function onMap(n: NameSource, h: Axial): boolean {
  return !!n.map?.hexes[hexKey(h)]
}

/**
 * Engine ids as they would appear in player text: `e3` (enemy), `d2` (defense), `c14` (card),
 * `p1` (player), and `preset-2`. The naming test fails on any of them.
 */
export const ENGINE_ID = /\b(?:[ecdp]\d+|preset-\d+)\b/
