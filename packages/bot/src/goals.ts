import {
  hexDistance,
  hexKey,
  hexNeighbors,
  type Axial,
  type Enemy,
  type GameState,
  type Player,
} from '@survival/engine'

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

/** The highest Build level among the current player's cards (0 with no Build card). */
export function buildLevel(state: GameState): number {
  const player = me(state)
  const ids = [...player.hand, ...player.deck, ...player.discard, ...player.inPlay].map(
    (c) => c.def,
  )
  return state.content.cards
    .filter((c) => ids.includes(c.id))
    .reduce((max, c) => (c.top.kind === 'build' ? Math.max(max, c.top.level) : max), 0)
}

/**
 * The material cost of the cheapest base upgrade still to buy (the next tier of each track) that
 * a Build of `level` can buy (Spec v2 11.4; any level with `rulings.buildLevels: "any"`).
 * Infinity when there is none.
 */
export function cheapestUpgrade(state: GameState, level = Number.POSITIVE_INFINITY): number {
  const reaches = (tier: number) => state.config.rulings.buildLevels === 'any' || tier <= level
  const costs = (['shop', 'training'] as const).flatMap((track) => {
    const bought = state.content.upgrades.filter(
      (u) => u.track === track && state.upgrades.includes(u.id),
    ).length
    const next = state.content.upgrades.find((u) => u.track === track && u.tier === bought + 1)
    return next && reaches(next.tier) ? [next.cost] : []
  })
  return costs.length > 0 ? Math.min(...costs) : Number.POSITIVE_INFINITY
}

/** True when the figure stands on the Base tile (any of its 7 hexes). */
export function onBaseTile(state: GameState, hex: Axial): boolean {
  return hexDistance(hex, BASE) <= 1
}

/** True when a gathering node has been used (each node gives materials once). */
export function spent(state: GameState, hex: Axial): boolean {
  return state.spentNodes.some((n) => n.q === hex.q && n.r === hex.r)
}

/** The unspent gathering node nearest the base with no enemy on it (ties: hex key). */
export function homeNode(state: GameState): Axial | null {
  const nodes = Object.entries(state.map.hexes)
    .filter(([, h]) => h.site === 'gathering-node')
    .map(([key]) => {
      const [q = 0, r = 0] = key.split(',').map(Number)
      return { q, r }
    })
    .filter((h) => !enemyOn(state, h) && !spent(state, h))
    .sort(
      (a, b) => hexDistance(a, BASE) - hexDistance(b, BASE) || hexKey(a).localeCompare(hexKey(b)),
    )
  return nodes[0] ?? null
}

/**
 * The hex just off the map edge nearest the figure (ties: hex key), while the tile deck has
 * tiles: stepping onto it reveals the next tile. Null when the deck is empty.
 */
export function edgeHex(state: GameState): Axial | null {
  if (state.tileDeck.length === 0) return null
  const from = me(state).hex
  const off = new Map<string, Axial>()
  for (const key of Object.keys(state.map.hexes)) {
    const [q = 0, r = 0] = key.split(',').map(Number)
    for (const n of hexNeighbors({ q, r })) {
      if (!state.map.hexes[hexKey(n)]) off.set(hexKey(n), n)
    }
  }
  return (
    [...off.values()].sort(
      (a, b) => hexDistance(a, from) - hexDistance(b, from) || hexKey(a).localeCompare(hexKey(b)),
    )[0] ?? null
  )
}

/**
 * The bot's play style. `default` gathers, explores, and builds; `turtle` never leaves the Base
 * tile (phase 22: it measures OPEN-QUESTIONS rows 63 and 69); `defender` stays near the base,
 * builds defenses next to it, and fights the enemies that come for it (phase 36). A sim option
 * only.
 */
export type BotPolicy = 'default' | 'turtle' | 'defender'

/** An enemy this close to the base hex is a threat: the defender comes home for it. */
export const THREAT_RANGE = 4

/** The defender builds its defenses this close to the base hex (the Base tile and 1 ring out). */
export const POST_RANGE = 2

/** The enemy nearest the base hex within `THREAT_RANGE` (ties: the weaker, then id), if any. */
export function threat(state: GameState): Enemy | undefined {
  return state.enemies
    .filter((e) => hexDistance(e.hex, BASE) <= THREAT_RANGE)
    .sort(
      (a, b) =>
        hexDistance(a.hex, BASE) - hexDistance(b.hex, BASE) ||
        a.health - b.health ||
        a.id.localeCompare(b.id),
    )[0]
}

/** The material cost of the cheapest defense. Infinity when the content has none. */
export function cheapestDefense(state: GameState): number {
  return Math.min(Number.POSITIVE_INFINITY, ...state.content.defenses.map((d) => d.cost))
}

/**
 * A guard post: the hex `POST_RANGE` from the base hex nearest `toward` (ties: hex key), on the
 * map, with no enemy on it. From there a Build reaches the hexes between the base and the enemy.
 */
export function guardPost(state: GameState, toward: Axial): Axial | null {
  return (
    Object.keys(state.map.hexes)
      .map((key) => {
        const [q = 0, r = 0] = key.split(',').map(Number)
        return { q, r }
      })
      .filter((h) => hexDistance(h, BASE) === POST_RANGE && !enemyOn(state, h))
      .sort(
        (a, b) =>
          hexDistance(a, toward) - hexDistance(b, toward) || hexKey(a).localeCompare(hexKey(b)),
      )[0] ?? null
  )
}

/**
 * Where the defender wants to be. In Combat: next to the threat (else the base). In Prepare: the
 * base while it can pay for an upgrade; a guard post toward the threat while it can pay for a
 * defense; else materials, as the default bot.
 */
function defenderGoal(state: GameState): Axial {
  const near = threat(state)
  if (state.phase === 'combat') return near?.hex ?? BASE
  const player = me(state)
  if (player.materials >= cheapestUpgrade(state, buildLevel(state))) return BASE
  if (near && player.materials >= cheapestDefense(state)) return guardPost(state, near.hex) ?? BASE
  return homeNode(state) ?? edgeHex(state) ?? BASE
}

/**
 * Where the figure wants to be: an unspent gathering node while it cannot pay for the next
 * upgrade (or the map edge, to reveal a tile, when no node is left), else the base (to buy
 * upgrades and Shop cards, and to defend it). The turtle always wants the base; the defender
 * see `defenderGoal`.
 */
export function goal(state: GameState, policy: BotPolicy = 'default'): Axial {
  if (policy === 'turtle') return BASE
  if (policy === 'defender') return defenderGoal(state)
  const player = me(state)
  if (player.materials < cheapestUpgrade(state, buildLevel(state)))
    return homeNode(state) ?? edgeHex(state) ?? BASE
  return BASE
}

/** True when the figure is on its goal hex. */
export function atGoal(state: GameState, policy: BotPolicy = 'default'): boolean {
  const target = goal(state, policy)
  const hex = me(state).hex
  return hex.q === target.q && hex.r === target.r
}
