import type { GameEvent } from '../events/events.ts'
import { tileHexes, type Axial } from '../hex.ts'
import { nodeKind, spawnEnemy } from '../map/spawn.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/** A spawn node on the map and the enemy kind it holds. */
export type SpawnNode = Readonly<{ hex: Axial; kind: 'grunt' | 'elite' }>

/**
 * Every spawn node and elite spawn node on the map, in tile placement order, then hex order.
 *
 * @rule Table 1
 */
export function spawnNodes(state: GameState): SpawnNode[] {
  return state.map.tiles.flatMap((placed) => {
    const tile = state.content.tiles.find((t) => t.id === placed.tile)
    const positions = tileHexes(placed.center)
    return (tile?.hexes ?? []).flatMap((hex, i): SpawnNode[] => {
      const kind = nodeKind(hex.site)
      const pos = positions[i]
      return kind && pos ? [{ hex: pos, kind }] : []
    })
  })
}

/**
 * Combat start, after the enemies move (core loop v2): every spawn node gets 1 grunt and every
 * elite spawn node 1 elite, on every revealed tile, in `spawnNodes` order. An occupied node
 * spills the enemy to the nearest empty hex (9.8); past the miniature limit the grunt nearest
 * the base becomes an elite instead (10.5, row 32). There is no wave track.
 *
 * @rule 9.2, 9.8, 10.5, core loop v2 (Combat step 3)
 */
export function spawnAtNodes(state: GameState): Step {
  let current = state
  const events: GameEvent[] = []
  for (const node of spawnNodes(state)) {
    const [next, more] = spawnEnemy(current, node.kind, node.hex, '9.2')
    current = next
    events.push(...more)
  }
  return [current, events]
}
