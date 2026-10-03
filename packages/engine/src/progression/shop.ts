import type { GameEvent } from '../events/events.ts'
import { mapHex } from '../map/tiles.ts'
import { cardDef, currentPlayer, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { GameState, Player } from '../state/types.ts'
import { drawLevel, openLevel } from './supplies.ts'

/** True when the current player's figure is on the base hex. @rule 3.6, 6.8 */
export function onBase(state: GameState): boolean {
  return mapHex(state.map, currentPlayer(state).hex)?.site === 'base'
}

/**
 * Fills the Shop up to `shop.offers` offers, each from the highest open level supply, falling
 * back to a lower level when it is empty (row 41). No cards left: fewer offers.
 *
 * @rule 11.5, Table 6
 */
export function refillOffers(state: GameState): Step {
  const highest = openLevel(state, 'shop')
  if (highest === 0) return [state, []]
  let offers = [...state.shopOffers]
  const cards: Record<string, readonly string[]> = { ...state.supplies.cards }
  const events: GameEvent[] = []
  while (offers.length < state.config.shop.offers) {
    const level = drawLevel(cards, highest)
    if (!level) break
    const [card, ...rest] = cards[level] ?? []
    if (!card) break
    cards[level] = rest
    offers = [...offers, card]
    events.push({ type: 'offerAdded', rule: '11.5', card, level })
  }
  return [{ ...state, shopOffers: offers, supplies: { ...state.supplies, cards } }, events]
}

/**
 * The cards the current player can buy now: Shop open, figure on the base (6.8, row 11), in a
 * phase that `rulings.shopTiming` allows, and enough currency. Each offer once.
 *
 * @rule 6.8, 11.5, Table 8
 */
export function legalBuys(state: GameState): string[] {
  if (state.phase === 'setup' || state.phase === 'ended') return []
  if (state.config.rulings.shopTiming === 'prepare-only' && state.phase !== 'prepare') return []
  if (state.pendingReturn || state.draft || !onBase(state)) return []
  const currency = currentPlayer(state).currency
  return [...new Set(state.shopOffers)].filter((id) => cardDef(state, id).cost <= currency)
}

/** The starter cards a player may return (deck or discard pile, not hand or table). @rule 18.1 */
export function returnableStarters(player: Player, state: GameState): string[] {
  return [...player.deck, ...player.discard]
    .filter((c) => cardDef(state, c.def).level === 0)
    .map((c) => c.id)
}

/**
 * Buys an offered card: pay its cost, put a new instance in the discard pile (13.1), and
 * replace the offer at once (11.5). In replace-starter mode (18.1) the player then returns 1
 * starter card.
 *
 * @rule 6.8, 11.5, 13.1, 18.1
 */
export function buyCard(state: GameState, card: string): Step {
  const def = cardDef(state, card)
  const player = currentPlayer(state)
  const instance = `c${state.nextCardId}`
  const index = state.shopOffers.indexOf(card)
  const shopOffers = state.shopOffers.filter((_, i) => i !== index)
  const bought = updateCurrentPlayer(state, (p) => ({
    ...p,
    currency: p.currency - def.cost,
    discard: [...p.discard, { id: instance, def: card }],
  }))
  const next: GameState = {
    ...bought,
    shopOffers,
    nextCardId: state.nextCardId + 1,
    progress: { ...state.progress, cardsBought: state.progress.cardsBought + 1 },
  }
  const events: GameEvent[] = [
    { type: 'cardBought', rule: '6.8, 13.1', player: player.id, card, instance, cost: def.cost },
  ]
  const [refilled, more] = refillOffers(next)
  const replace =
    state.config.options.boughtCards === 'replace-starter' &&
    returnableStarters(currentPlayer(refilled), refilled).length > 0
  return [{ ...refilled, pendingReturn: replace ? player.id : null }, [...events, ...more]]
}

/**
 * Replace-starter mode: the returned starter card leaves the game.
 *
 * @rule 18.1
 */
export function returnStarter(state: GameState, cardId: string): Step {
  const player = currentPlayer(state)
  const next = updateCurrentPlayer(state, (p) => ({
    ...p,
    deck: p.deck.filter((c) => c.id !== cardId),
    discard: p.discard.filter((c) => c.id !== cardId),
  }))
  return [
    { ...next, pendingReturn: null },
    [{ type: 'starterReturned', rule: '18.1', player: player.id, card: cardId }],
  ]
}
