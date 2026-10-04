import { describe, expect, it } from 'vitest'
import type { Player } from '../state/types.ts'
import {
  clearTable,
  discardFromHand,
  drawHand,
  ownedCards,
  playToTable,
  rotateDeck,
} from './deck.ts'

const card = (n: number) => ({ id: `c${n}`, def: 'starter-move' })

function player(deck: number, discard = 0): Player {
  return {
    id: 'p1',
    hex: { q: 0, r: 0 },
    health: 15,
    maxHealth: 15,
    dice: 1,
    skills: [],
    deck: Array.from({ length: deck }, (_, i) => card(i + 1)),
    hand: [],
    discard: Array.from({ length: discard }, (_, i) => card(100 + i)),
    inPlay: [],
    orientation: 'top',
    guard: 0,
    materials: 0,
    currency: 0,
    knockedOut: false,
  }
}

describe('deck', () => {
  it('6.1 draws 3 cards from the top of the deck', () => {
    const [p, drawn] = drawHand(player(6), 3)
    expect(drawn).toEqual(['c1', 'c2', 'c3'])
    expect(p.deck.map((c) => c.id)).toEqual(['c4', 'c5', 'c6'])
  })

  it('6.5 with fewer than 3 cards, draws all of them', () => {
    const [p, drawn] = drawHand(player(2), 3)
    expect(drawn).toHaveLength(2)
    expect(p.deck).toHaveLength(0)
  })

  it('6.3 a played card goes on top of the discard pile', () => {
    const [p] = drawHand(player(3, 1), 3)
    const after = discardFromHand(p, 'c2')
    expect(after.discard[0]?.id).toBe('c2')
    expect(after.hand.map((c) => c.id)).toEqual(['c1', 'c3'])
  })

  it('7.8 step 10: played cards and the rest of the hand go to the discard pile', () => {
    const [p] = drawHand(player(3), 3)
    const after = clearTable(playToTable(p, 'c1'))
    expect(after.hand).toHaveLength(0)
    expect(after.inPlay).toHaveLength(0)
    expect(after.discard).toHaveLength(3)
  })

  it('10.6 turns the discard pile 180 degrees without a shuffle', () => {
    const p = player(0, 4)
    const [after] = rotateDeck(p, 'top', 1, false)
    expect(after.deck.map((c) => c.id)).toEqual(p.discard.map((c) => c.id))
    expect(after.orientation).toBe('top')
    expect(after.discard).toHaveLength(0)
  })

  it('7.1-7.2 shuffles the discard pile and turns it bottom-up for Combat', () => {
    const [after] = rotateDeck(player(0, 6), 'bottom', 7, true)
    expect(after.orientation).toBe('bottom')
    expect(after.deck).toHaveLength(6)
  })

  it('5.4 owned cards counts every pile', () => {
    const [p] = drawHand(player(4, 2), 3)
    expect(ownedCards(playToTable(p, 'c1'))).toHaveLength(6)
  })
})
