import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const names = (players: number) =>
  ({
    content: defaultContent,
    players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
  }) as never

const shuffled = (players: number, player: string, cards = 10) =>
  describeEvent({ type: 'deckShuffled', rule: '7.1', player, cards } as never, names(players))
const turned = (players: number, player: string, orientation: 'top' | 'bottom') =>
  describeEvent({ type: 'deckTurned', rule: '7.2', player, orientation } as never, names(players))

describe('deck text in the log', () => {
  it('speaks to the one player in a solo run', () => {
    expect(shuffled(1, 'p1')).toBe('Your deck shuffled (10 cards).')
    expect(turned(1, 'p1', 'bottom')).toBe('Your deck turned: bottom halves up.')
  })

  it('names whose deck it is in co-op, where every deck turns at once', () => {
    expect(shuffled(3, 'p2')).toBe("Player 2's deck shuffled (10 cards).")
    expect(turned(3, 'p3', 'top')).toBe("Player 3's deck turned: top halves up.")
  })

  it('says "1 card" for a one-card deck', () => {
    expect(shuffled(1, 'p1', 1)).toBe('Your deck shuffled (1 card).')
  })
})
