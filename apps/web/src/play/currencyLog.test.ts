import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const gained = (players: number, player: string) =>
  describeEvent(
    { type: 'currencyGained', rule: '8.2', player, amount: 3, currency: 5 } as never,
    {
      content: defaultContent,
      players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
    } as never,
  )

describe('currency text in the log', () => {
  it('speaks to the one player in a solo run', () => {
    expect(gained(1, 'p1')).toBe('You gained 3 currency (now 5).')
  })

  it('names the player who gets the currency in co-op', () => {
    expect(gained(3, 'p2')).toBe('Player 2 gained 3 currency (now 5).')
  })
})
