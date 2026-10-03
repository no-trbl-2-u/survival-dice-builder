import type { GameEvent } from '../events/events.ts'
import { tileHexes, type Axial } from '../hex.ts'
import { nodeKind, spawnEnemy } from '../map/spawn.ts'
import { sameHex } from '../map/tiles.ts'
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
 * Combat step 7.3: each spawn node whose enemy was defeated (`vacantNodes`) gets a new one,
 * with spill-over (9.8). Elite spawn nodes refill the same way (row 21). A node whose enemy
 * walked away is not vacant. A refill that finds no hex at all waits for the next Combat.
 *
 * @rule 7.3, 9.2, 9.8
 */
export function refillNodes(state: GameState): Step {
  let current: GameState = { ...state, vacantNodes: [] }
  const events: GameEvent[] = []
  const waiting: Axial[] = []
  for (const node of spawnNodes(state)) {
    if (!state.vacantNodes.some((v) => sameHex(v, node.hex))) continue
    const [next, more] = spawnEnemy(current, node.kind, node.hex, '7.3')
    if (more.length === 0) waiting.push(node.hex)
    current = next
    events.push(...more)
  }
  return [{ ...current, vacantNodes: waiting }, events]
}

/**
 * Wave step: 1 grunt on each spawn node (not elite spawn nodes), once per point on the wave
 * track, with spill-over. A grunt over the miniature limit becomes an elite swap (10.5).
 *
 * @rule 7.4, 10.4, 10.5, 9.8
 */
export function waveStep(state: GameState): Step {
  let current = state
  const events: GameEvent[] = []
  const nodes = spawnNodes(state).filter((n) => n.kind === 'grunt')
  for (let wave = 0; wave < state.waveTrack; wave++) {
    for (const node of nodes) {
      const [next, more] = spawnEnemy(current, 'grunt', node.hex, '10.4', null)
      current = next
      events.push(...more)
    }
  }
  return [current, events]
}
