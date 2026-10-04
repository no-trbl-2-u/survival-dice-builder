import type { GameEvent } from '../events/events.ts'
import { tileHexes, type Axial } from '../hex.ts'
import { nodeKind } from '../map/spawn.ts'
import { placeTile, slotCovering } from '../map/tiles.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/**
 * Exploring (core loop v2): a Move step off the map edge reveals the top tile of the tile deck
 * and places it so that it covers the hex stepped into (fixed rotation, row 5). The tile counts
 * for the milestones (17). Its spawn nodes wait in `vacantNodes`, so its enemies appear at the
 * next Combat start (7.3), not now. An empty tile deck reveals nothing.
 *
 * @param state - the state during a Move.
 * @param hex - the off-map hex the figure steps into.
 * @rule 10.1, 10.2, 17, core loop v2 (exploring)
 */
export function revealUnder(state: GameState, hex: Axial): Step {
  const [top, ...rest] = state.tileDeck
  const tile = state.content.tiles.find((t) => t.id === top)
  if (!top || !tile) return [state, []]
  const center = slotCovering(hex)
  const nodes = tileHexes(center).filter((_, i) => nodeKind(tile.hexes[i]?.site ?? null))
  const events: GameEvent[] = [
    { type: 'tileRevealed', rule: '10.1', tile: top },
    { type: 'tilePlaced', rule: '10.1', tile: top, center },
  ]
  return [
    {
      ...state,
      map: placeTile(state.map, tile, center),
      tileDeck: rest,
      vacantNodes: [...state.vacantNodes, ...nodes],
      progress: { ...state.progress, tilesRevealed: state.progress.tilesRevealed + 1 },
    },
    events,
  ]
}
