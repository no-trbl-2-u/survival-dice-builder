import type { GameEvent } from '../events/events.ts'
import { hexDistance, hexKey, tileHexes, type Axial } from '../hex.ts'
import { enemyDef, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import { isPassable, placeTile, sameHex } from './tiles.ts'

/**
 * True when an enemy may be placed on a hex: an empty hex (9.8) — passable, not the base, and
 * no enemy, figure, or defense on it (OPEN-QUESTIONS row 27).
 *
 * @rule 3.7, 9.8, 12
 */
function canHoldEnemy(state: GameState, hex: Axial): boolean {
  if (!isPassable(state.map, hex)) return false
  if (state.map.hexes[hexKey(hex)]?.site === 'base') return false
  if (state.enemies.some((e) => sameHex(e.hex, hex))) return false
  if (state.players.some((p) => sameHex(p.hex, hex))) return false
  return !state.defenses.some((d) => sameHex(d.hex, hex))
}

/**
 * Where a new enemy goes: the node itself if it is free, else the nearest free hex enemies
 * can stand on, nearest the base on ties, then by hex key (spill-over, 9.8 [006]).
 *
 * @rule 3.7, 9.8
 */
export function spawnHex(state: GameState, node: Axial): Axial | null {
  if (canHoldEnemy(state, node)) return node
  const candidates = Object.keys(state.map.hexes)
    .map((key) => {
      const [q, r] = key.split(',').map(Number)
      return { q: q ?? 0, r: r ?? 0 }
    })
    .filter((h) => canHoldEnemy(state, h))
  candidates.sort(
    (a, b) =>
      hexDistance(a, node) - hexDistance(b, node) ||
      hexDistance(a, { q: 0, r: 0 }) - hexDistance(b, { q: 0, r: 0 }) ||
      hexKey(a).localeCompare(hexKey(b)),
  )
  return candidates[0] ?? null
}

/**
 * Puts a new enemy of `kind` on a spawn node (or spills it, 9.8).
 *
 * @rule 4.4, 9.2, 9.8, 10.2
 */
export function spawnEnemy(state: GameState, kind: string, node: Axial, rule = '10.2'): Step {
  const hex = spawnHex(state, node)
  if (!hex) return [state, []]
  const def = enemyDef(state, kind)
  const id = `e${state.nextEnemyId}`
  const spilled = !sameHex(hex, node)
  return [
    {
      ...state,
      enemies: [...state.enemies, { id, kind, health: def.health, hex }],
      nextEnemyId: state.nextEnemyId + 1,
    },
    [{ type: 'enemySpawned', rule: spilled ? '9.8' : rule, enemy: id, kind, hex, spilled }],
  ]
}

/**
 * Places a tile on the map and puts 1 enemy on each of its spawn nodes: a grunt on a spawn
 * node, an elite on an elite spawn node.
 *
 * @rule 4.2, 4.4, 10.1, 10.2, Table 1
 */
export function placeTileAndSpawn(
  state: GameState,
  tileId: string,
  center: Axial,
  setup = false,
): Step {
  const tile = state.content.tiles.find((t) => t.id === tileId)
  if (!tile) throw new Error(`Unknown tile "${tileId}"`)
  let current: GameState = { ...state, map: placeTile(state.map, tile, center) }
  const events: GameEvent[] = [
    { type: 'tilePlaced', rule: setup ? '4.2' : '10.1', tile: tileId, center },
  ]
  const positions = tileHexes(center)
  tile.hexes.forEach((hex, i) => {
    const pos = positions[i]
    if (!pos) return
    const kind =
      hex.site === 'spawn-node' ? 'grunt' : hex.site === 'elite-spawn-node' ? 'elite' : null
    if (!kind) return
    const [next, more] = spawnEnemy(current, kind, pos, setup ? '4.4' : '10.2')
    current = next
    events.push(...more)
  })
  return [current, events]
}
