import { hexDistance, hexKey, type Axial, type GameState, type Player } from '@survival/engine'

/** The base hex: the center of the Base tile. */
export const BASE: Axial = { q: 0, r: 0 }

/** The player whose decision it is. */
export function me(state: GameState): Player {
  const player = state.players[state.current]
  if (!player) throw new Error('No current player')
  return player
}

/** The site printed on a hex, if any. */
export function siteAt(state: GameState, hex: Axial): string | null {
  return state.map.hexes[hexKey(hex)]?.site ?? null
}

/** True when an enemy stands on the hex. */
export function enemyOn(state: GameState, hex: Axial): boolean {
  return state.enemies.some((e) => e.hex.q === hex.q && e.hex.r === hex.r)
}

/**
 * The material cost of the cheapest base upgrade still to buy (the next tier of each track).
 * Infinity when every upgrade is bought.
 */
export function cheapestUpgrade(state: GameState): number {
  const costs = (['shop', 'training'] as const).flatMap((track) => {
    const bought = state.content.upgrades.filter(
      (u) => u.track === track && state.upgrades.includes(u.id),
    ).length
    const next = state.content.upgrades.find((u) => u.track === track && u.tier === bought + 1)
    return next ? [next.cost] : []
  })
  return costs.length > 0 ? Math.min(...costs) : Number.POSITIVE_INFINITY
}

/** The gathering node nearest the base with no enemy on it (ties: hex key). */
export function homeNode(state: GameState): Axial | null {
  const nodes = Object.entries(state.map.hexes)
    .filter(([, h]) => h.site === 'gathering-node')
    .map(([key]) => {
      const [q = 0, r = 0] = key.split(',').map(Number)
      return { q, r }
    })
    .filter((h) => !enemyOn(state, h))
    .sort(
      (a, b) => hexDistance(a, BASE) - hexDistance(b, BASE) || hexKey(a).localeCompare(hexKey(b)),
    )
  return nodes[0] ?? null
}

/**
 * Where the figure wants to be: a gathering node while it cannot pay for the next upgrade, else
 * the base (to buy upgrades and Shop cards, and to defend it).
 */
export function goal(state: GameState): Axial {
  const player = me(state)
  if (player.materials < cheapestUpgrade(state)) return homeNode(state) ?? BASE
  return BASE
}

/** True when the figure is on its goal hex. */
export function atGoal(state: GameState): boolean {
  const target = goal(state)
  const hex = me(state).hex
  return hex.q === target.q && hex.r === target.r
}
