import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const damaged = (toGuard: number, toHealth: number, players = 1) =>
  describeEvent(
    { type: 'playerDamaged', rule: '7.8', player: 'p1', toGuard, toHealth, health: 7 } as never,
    {
      content: defaultContent,
      players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
    } as never,
  )

describe('player damage text in the log', () => {
  it('names only health when no guard is lost', () => {
    expect(damaged(0, 3)).toBe('You lose 3 health (health 7).')
  })

  it('names only guard when the guard takes the whole hit', () => {
    expect(damaged(2, 0)).toBe('You lose 2 guard (health 7).')
  })

  it('names both when the hit goes through the guard', () => {
    expect(damaged(1, 2, 2)).toBe('Player 1 loses 1 guard and 2 health (health 7).')
  })

  it('says nothing is lost for a 0-damage hit', () => {
    expect(damaged(0, 0)).toBe('You lose nothing (health 7).')
  })
})
