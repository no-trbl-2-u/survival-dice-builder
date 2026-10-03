import type { GameEvent } from '../events/events.ts'
import { hexDistance } from '../hex.ts'
import { placeTileAndSpawn } from '../map/spawn.ts'
import { BASE_HEX, emptySlots } from '../map/tiles.ts'
import type { Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/**
 * The start of Explore. An empty tile deck adds 1 to the wave track instead (10.3). Otherwise,
 * by `options.exploration` (18.1): forced (default) reveals the top tile for the player to
 * place; automatic places it in the empty slot nearest the base; optional offers the choice.
 *
 * @rule 10.1, 10.2, 10.3, 15.2, 17, 18.1
 */
export function startExplore(state: GameState): Step {
  const [top, ...rest] = state.tileDeck
  if (!top) {
    const waveTrack = state.waveTrack + 1
    return [{ ...state, waveTrack }, [{ type: 'waveTrackAdvanced', rule: '10.3', waveTrack }]]
  }
  switch (state.config.options.exploration) {
    case 'optional':
      return [{ ...state, revealOffer: true }, []]
    case 'forced':
      return revealTop(state)
    case 'automatic': {
      const slot = [...emptySlots(state.map)].sort(
        (a, b) => hexDistance(a, BASE_HEX) - hexDistance(b, BASE_HEX),
      )[0]
      if (!slot) return [state, []]
      const progress = { ...state.progress, tilesRevealed: state.progress.tilesRevealed + 1 }
      const [placed, events] = placeTileAndSpawn({ ...state, tileDeck: rest, progress }, top, slot)
      return [placed, [{ type: 'tileRevealed', rule: '10.1', tile: top }, ...events]]
    }
  }
}

/**
 * Reveals the top tile of the tile deck; the player then chooses its slot (`placeTile`).
 *
 * @rule 10.1, 17
 */
export function revealTop(state: GameState): Step {
  const [top, ...rest] = state.tileDeck
  if (!top) return [{ ...state, revealOffer: false }, []]
  const events: GameEvent[] = [{ type: 'tileRevealed', rule: '10.1', tile: top }]
  const progress = { ...state.progress, tilesRevealed: state.progress.tilesRevealed + 1 }
  return [{ ...state, tileDeck: rest, revealed: [top], revealOffer: false, progress }, events]
}
