import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const engaged = (players: number, player: string) =>
  describeEvent(
    { type: 'engaged', rule: '7.8', player, card: 'c1', enemyDice: [] } as never,
    {
      content: defaultContent,
      players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
    } as never,
  )

describe('engage text in the log with no enemy dice', () => {
  it('speaks to the one player in a solo run', () => {
    expect(engaged(1, 'p1')).toBe('You engage. No enemy is next to you: no enemy dice.')
  })

  it('names the engaging player in co-op', () => {
    expect(engaged(2, 'p2')).toBe('Player 2 engages. No enemy is next to Player 2: no enemy dice.')
  })
})
