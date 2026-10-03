import type { GameState } from '../../src/index.ts'

/**
 * The same state with every spawn node and elite spawn node removed (from the content and the
 * map), so scenario tests control exactly which enemies exist: nothing refills (7.3) or
 * arrives in a wave (10.4). Enemies on the map are kept.
 */
export function noSpawns(state: GameState): GameState {
  const quiet = (site: string | null) =>
    site === 'spawn-node' || site === 'elite-spawn-node' ? null : site
  return {
    ...state,
    content: {
      ...state.content,
      tiles: state.content.tiles.map((t) => ({
        ...t,
        hexes: t.hexes.map((h) => ({ ...h, site: quiet(h.site) as typeof h.site })),
      })),
    },
    map: {
      ...state.map,
      hexes: Object.fromEntries(
        Object.entries(state.map.hexes).map(([k, h]) => [
          k,
          { ...h, site: quiet(h.site) as typeof h.site },
        ]),
      ),
    },
    nextEnemyId: Math.max(state.nextEnemyId, 100),
  }
}
