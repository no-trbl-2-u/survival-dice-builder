import { hexDistance, hexKey, hexNeighbors, type Axial } from '../hex.ts'
import { enemyCanEnter } from '../map/spawn.ts'
import type { GameState } from '../state/types.ts'

/**
 * The shortest path for an enemy on `from` to a hex next to `goal`, through hexes enemies can
 * enter (no lake, mountain, base, enemy, figure, or defense). Neighbours are tried in
 * `AXIAL_DIRECTIONS` order, so the path is deterministic. Returns the hexes to step through
 * (empty when already next to `goal`), or null when every path is blocked.
 *
 * @rule 3.4, 3.7, 9.4, 9.7
 */
export function pathNextTo(state: GameState, from: Axial, goal: Axial): Axial[] | null {
  if (hexDistance(from, goal) === 1) return []
  const previous = new Map<string, Axial | null>([[hexKey(from), null]])
  let frontier: Axial[] = [from]
  while (frontier.length > 0) {
    const next: Axial[] = []
    for (const hex of frontier) {
      for (const step of hexNeighbors(hex)) {
        const key = hexKey(step)
        if (previous.has(key) || !enemyCanEnter(state, step)) continue
        previous.set(key, hex)
        if (hexDistance(step, goal) === 1) return unwind(previous, step)
        next.push(step)
      }
    }
    frontier = next
  }
  return null
}

/** Rebuilds the path that ends on `end`, without the start hex. */
function unwind(previous: Map<string, Axial | null>, end: Axial): Axial[] {
  const path: Axial[] = []
  let hex: Axial | null | undefined = end
  while (hex) {
    path.unshift(hex)
    hex = previous.get(hexKey(hex))
  }
  return path.slice(1)
}
