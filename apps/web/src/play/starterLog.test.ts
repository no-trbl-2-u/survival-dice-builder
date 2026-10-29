import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const card = defaultContent.cards[0]!

// The returned card is already out of the deck and discard pile, so the line names it from
// the event's definition id, not from the state.
const returned = (players: number, player: string) =>
  describeEvent(
    { type: 'starterReturned', rule: '18.1', player, card: 'c3', def: card.id } as never,
    {
      content: defaultContent,
      players: Array.from({ length: players }, (_, i) => ({
        id: `p${i + 1}`,
        hand: [],
        deck: [],
        discard: [],
        inPlay: [],
      })),
    } as never,
  )

describe('returned starter text in the log', () => {
  it('names the returned card in a solo run', () => {
    expect(returned(1, 'p1')).toBe(`You return ${card.name}: it leaves the game.`)
  })

  it('names the player who returns it in co-op', () => {
    expect(returned(2, 'p2')).toBe(`Player 2 returns ${card.name}: it leaves the game.`)
  })
})
