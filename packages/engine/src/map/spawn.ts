import type { GameEvent } from '../events/events.ts'
import { hexDistance, hexKey, tileHexes, type Axial } from '../hex.ts'
import { enemyDef, type Step } from '../state/helpers.ts'
import type { Enemy, GameState } from '../state/types.ts'
import { BASE_HEX, isPassable, placeTile, sameHex } from './tiles.ts'

/**
 * True when an enemy may stand on or enter a hex: an empty hex (9.8) — passable, not the base,
 * and no enemy, figure, or defense on it (OPEN-QUESTIONS row 27). Spawning and enemy movement
 * both use it.
 *
 * @rule 3.4, 3.7, 9.4, 9.8, 12
 */
export function enemyCanEnter(state: GameState, hex: Axial): boolean {
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
  if (enemyCanEnter(state, node)) return node
  const candidates = Object.keys(state.map.hexes)
    .map((key) => {
      const [q, r] = key.split(',').map(Number)
      return { q: q ?? 0, r: r ?? 0 }
    })
    .filter((h) => enemyCanEnter(state, h))
  candidates.sort(
    (a, b) =>
      hexDistance(a, node) - hexDistance(b, node) ||
      hexDistance(a, BASE_HEX) - hexDistance(b, BASE_HEX) ||
      hexKey(a).localeCompare(hexKey(b)),
  )
  return candidates[0] ?? null
}

/** Number of enemy miniatures on the map: grunts and elites (2.2, row 32). @rule 2.2, 10.5 */
export function miniatureCount(state: GameState): number {
  return state.enemies.length
}

/**
 * The miniature limit stopped a new grunt: replace the grunt nearest the base with an elite
 * (ties: the oldest grunt, row 13). The elite keeps the grunt's hex and spawn node.
 *
 * @rule 10.5
 */
export function replaceGruntWithElite(state: GameState): Step {
  const grunts = state.enemies.filter((e) => e.kind === 'grunt')
  grunts.sort(
    (a, b) =>
      hexDistance(a.hex, BASE_HEX) - hexDistance(b.hex, BASE_HEX) ||
      Number(a.id.slice(1)) - Number(b.id.slice(1)),
  )
  const grunt = grunts[0]
  if (!grunt) return [state, []]
  const id = `e${state.nextEnemyId}`
  const elite: Enemy = {
    ...grunt,
    id,
    kind: 'elite',
    health: enemyDef(state, 'elite').health,
  }
  return [
    {
      ...state,
      enemies: state.enemies.map((e) => (e.id === grunt.id ? elite : e)),
      nextEnemyId: state.nextEnemyId + 1,
    },
    [{ type: 'eliteReplaced', rule: '10.5', grunt: grunt.id, elite: id, hex: grunt.hex }],
  ]
}

/**
 * Puts a new enemy of `kind` on a spawn node (or spills it, 9.8). `home` marks the spawn node
 * that owns it for refills (9.2); wave grunts have none. At the miniature limit (2.2) a new
 * grunt is not placed: a grunt on the map becomes an elite instead (10.5); a new elite is not
 * placed (row 32).
 *
 * @rule 2.2, 4.4, 9.2, 9.8, 10.2, 10.5, 15
 */
export function spawnEnemy(
  state: GameState,
  kind: string,
  node: Axial,
  rule = '10.2',
  home: Axial | null = node,
): Step {
  if (miniatureCount(state) >= state.config.miniatureLimit) {
    return kind === 'grunt' ? replaceGruntWithElite(state) : [state, []]
  }
  const hex = spawnHex(state, node)
  if (!hex) return [state, []]
  const def = enemyDef(state, kind)
  const id = `e${state.nextEnemyId}`
  const spilled = !sameHex(hex, node)
  const enemy: Enemy = home
    ? { id, kind, health: def.health, hex, home }
    : { id, kind, health: def.health, hex }
  return [
    { ...state, enemies: [...state.enemies, enemy], nextEnemyId: state.nextEnemyId + 1 },
    [{ type: 'enemySpawned', rule: spilled ? '9.8' : rule, enemy: id, kind, hex, spilled }],
  ]
}

/** The enemy kind a site holds: a grunt on a spawn node, an elite on an elite spawn node. @rule Table 1 */
export function nodeKind(site: string | null): 'grunt' | 'elite' | null {
  return site === 'spawn-node' ? 'grunt' : site === 'elite-spawn-node' ? 'elite' : null
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
    const kind = nodeKind(hex.site)
    if (!pos || !kind) return
    const [next, more] = spawnEnemy(current, kind, pos, setup ? '4.4' : '10.2')
    current = next
    events.push(...more)
  })
  return [current, events]
}
