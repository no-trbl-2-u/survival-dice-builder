import type { GameEvent } from '../events/events.ts'
import { hexDistance, type Axial } from '../hex.ts'
import { BASE_HEX, emptySlots, placeTile, slotCovering } from '../map/tiles.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/**
 * Reveals the top tile of the tile deck with its center on `center`: the tile records the round
 * (row 66), the reveal counts for the milestones (17), and `progress.lastRevealRound` is set
 * (row 63). An empty tile deck reveals nothing.
 *
 * @rule 10.1, 17, core loop v2 rows 63, 66
 */
function revealAt(state: GameState, center: Axial, rule: string): Step {
  const [top, ...rest] = state.tileDeck
  const tile = state.content.tiles.find((t) => t.id === top)
  if (!top || !tile) return [state, []]
  const events: GameEvent[] = [
    { type: 'tileRevealed', rule, tile: top },
    { type: 'tilePlaced', rule, tile: top, center },
  ]
  return [
    {
      ...state,
      map: placeTile(state.map, tile, center, state.round),
      tileDeck: rest,
      progress: {
        ...state.progress,
        tilesRevealed: state.progress.tilesRevealed + 1,
        lastRevealRound: state.round,
      },
    },
    events,
  ]
}

/**
 * Exploring (core loop v2): a Move step off the map edge reveals the top tile of the tile deck
 * and places it so that it covers the hex stepped into (fixed rotation, row 5). The tile counts
 * for the milestones (17). Its enemies do not appear now: its spawn nodes spawn at the next
 * Combat start, with every other node (core loop v2), or later with `spawn.newTileDelay`
 * (row 66). An empty tile deck reveals nothing.
 *
 * @param state - the state during a Move.
 * @param hex - the off-map hex the figure steps into.
 * @rule 10.1, 10.2, 17, core loop v2 (exploring)
 */
export function revealUnder(state: GameState, hex: Axial): Step {
  return revealAt(state, slotCovering(hex), '10.1')
}

/**
 * True when the forced reveal is due at this round end: `clock.forcedRevealEvery` is set, no
 * tile was revealed in the last N rounds, and the tile deck is not empty.
 *
 * @rule core loop v2 row 63 (proposed: forced reveal)
 */
export function forcedRevealDue(state: GameState): boolean {
  const every = state.config.clock.forcedRevealEvery
  if (every === null || state.tileDeck.length === 0) return false
  return state.round - state.progress.lastRevealRound >= every
}

/**
 * The clock (row 63, proposed reading): at round end, when `forcedRevealDue`, the top tile is
 * revealed in the open slot nearest the base (ties: slot order, `emptySlots`). The engine picks
 * the slot so bot runs stay deterministic. Off (`null`): nothing happens.
 *
 * @rule 10.1, core loop v2 row 63 (proposed: forced reveal)
 */
export function forcedReveal(state: GameState): Step {
  if (!forcedRevealDue(state)) return [state, []]
  const slot = emptySlots(state.map)
    .map((center, i) => ({ center, i }))
    .sort(
      (a, b) => hexDistance(a.center, BASE_HEX) - hexDistance(b.center, BASE_HEX) || a.i - b.i,
    )[0]
  return slot ? revealAt(state, slot.center, '10.1, row 63') : [state, []]
}
