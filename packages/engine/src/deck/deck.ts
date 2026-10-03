import { shuffle } from '../rng/rng.ts'
import type { CardInstance, Orientation, Player } from '../state/types.ts'

/**
 * Draws up to `count` cards from the top of the deck into the hand. If the deck has fewer
 * cards, draws them all.
 *
 * @param player - the player who draws.
 * @param count - the hand size from the active deck preset.
 * @returns the new player and the ids of the drawn cards.
 * @rule 6.1, 6.4, 6.5, 7.8 step 1
 */
export function drawHand(player: Player, count: number): readonly [Player, string[]] {
  const drawn = player.deck.slice(0, count)
  return [
    { ...player, deck: player.deck.slice(drawn.length), hand: [...player.hand, ...drawn] },
    drawn.map((c) => c.id),
  ]
}

/**
 * Moves one card from the hand to the discard pile (top of the pile).
 *
 * @rule 6.3
 */
export function discardFromHand(player: Player, cardId: string): Player {
  const card = player.hand.find((c) => c.id === cardId)
  if (!card) return player
  return {
    ...player,
    hand: player.hand.filter((c) => c.id !== cardId),
    discard: [card, ...player.discard],
  }
}

/**
 * Moves one card from the hand into play (Combat: it is discarded at the end of the exchange).
 *
 * @rule 7.8 step 5, step 10
 */
export function playToTable(player: Player, cardId: string): Player {
  const card = player.hand.find((c) => c.id === cardId)
  if (!card) return player
  return {
    ...player,
    hand: player.hand.filter((c) => c.id !== cardId),
    inPlay: [...player.inPlay, card],
  }
}

/** Puts every card in play and in hand on the discard pile. @rule 7.8 step 10, 7.9 */
export function clearTable(player: Player): Player {
  return {
    ...player,
    discard: [...[...player.inPlay, ...player.hand].reverse(), ...player.discard],
    inPlay: [],
    hand: [],
  }
}

/**
 * Turns the discard pile 180 degrees and makes it the deck. When `shuffleFirst` is set the pile
 * is shuffled first (Combat, 7.1); otherwise its order stays (Explore, 10.6).
 *
 * @param player - the player whose pile turns.
 * @param orientation - the half that is up afterwards.
 * @param rng - the RNG state (used only when shuffling).
 * @returns the new player and the next RNG state.
 * @rule 7.1, 7.2, 10.6, 10.7
 */
export function rotateDeck(
  player: Player,
  orientation: Orientation,
  rng: number,
  shuffleFirst: boolean,
): readonly [Player, number] {
  const pile: readonly CardInstance[] = [...player.discard, ...player.deck]
  const [deck, next] = shuffleFirst ? shuffle(rng, pile) : [[...pile], rng]
  return [{ ...player, deck, discard: [], orientation }, next]
}

/** Every card the player owns, wherever it is. @rule 5.4, 13.1 */
export function ownedCards(player: Player): readonly CardInstance[] {
  return [...player.deck, ...player.hand, ...player.inPlay, ...player.discard]
}
