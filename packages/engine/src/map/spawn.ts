import { hexDistance, hexKey, type Axial } from '../hex.ts'
import { placedPlayers } from '../movement/move.ts'
import { levelForEliteSpawn } from '../progression/experience.ts'
import { enemyDef, type Step } from '../state/helpers.ts'
import type { Enemy, GameState } from '../state/types.ts'
import { BASE_HEX, isPassable, sameHex } from './tiles.ts'

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
  if (placedPlayers(state).some((p) => sameHex(p.hex, hex))) return false
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
 * The miniature limit stopped a new enemy: replace the grunt nearest the base with an elite
 * (ties: the oldest grunt, row 13). The elite keeps the grunt's hex. The first time this happens
 * `progress.capReachedRound` records the round (phase 22 report). With
 * `experience.levelPerEliteSpawn` the new elite raises the level (row 17).
 *
 * @rule 10.5, OPEN-QUESTIONS row 17
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
    id,
    kind: 'elite',
    health: enemyDef(state, 'elite').health,
    hex: grunt.hex,
    attackedThisCombat: grunt.attackedThisCombat,
  }
  const replaced: GameState = {
    ...state,
    enemies: state.enemies.map((e) => (e.id === grunt.id ? elite : e)),
    nextEnemyId: state.nextEnemyId + 1,
    progress: {
      ...state.progress,
      capReachedRound: state.progress.capReachedRound ?? state.round,
    },
  }
  const [levelled, events] = levelForEliteSpawn(replaced)
  return [
    levelled,
    [
      { type: 'eliteReplaced', rule: '10.5', grunt: grunt.id, elite: id, hex: grunt.hex },
      ...events,
    ],
  ]
}

/**
 * Puts a new enemy of `kind` on a spawn node (or spills it, 9.8). At the miniature limit (2.2)
 * the new enemy is not placed: the grunt nearest the base becomes an elite instead, for a new
 * grunt (10.5) and for a new elite (row 32). A new elite raises the level with
 * `experience.levelPerEliteSpawn` (row 17).
 *
 * @rule 2.2, 4.4, 9.2, 9.8, 10.2, 10.5, OPEN-QUESTIONS rows 17, 32
 */
export function spawnEnemy(state: GameState, kind: string, node: Axial, rule = '10.2'): Step {
  if (miniatureCount(state) >= state.config.miniatureLimit) return replaceGruntWithElite(state)
  const hex = spawnHex(state, node)
  if (!hex) return [state, []]
  const def = enemyDef(state, kind)
  const id = `e${state.nextEnemyId}`
  const spilled = !sameHex(hex, node)
  const enemy: Enemy = { id, kind, health: def.health, hex, attackedThisCombat: false }
  const placed: GameState = {
    ...state,
    enemies: [...state.enemies, enemy],
    nextEnemyId: state.nextEnemyId + 1,
  }
  const [levelled, events] = kind === 'elite' ? levelForEliteSpawn(placed) : [placed, []]
  return [
    levelled,
    [
      { type: 'enemySpawned', rule: spilled ? '9.8' : rule, enemy: id, kind, hex, spilled },
      ...events,
    ],
  ]
}

/** The enemy kind a site holds: a grunt on a spawn node, an elite on an elite spawn node. @rule Table 1 */
export function nodeKind(site: string | null): 'grunt' | 'elite' | null {
  return site === 'spawn-node' ? 'grunt' : site === 'elite-spawn-node' ? 'elite' : null
}
