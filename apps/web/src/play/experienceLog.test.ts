import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const gained = (players: number) =>
  describeEvent(
    { type: 'experienceGained', rule: '8.1', amount: 2, experience: 5 } as never,
    {
      content: defaultContent,
      players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
    } as never,
  )

describe('experience text in the log', () => {
  it('speaks to the one player in a solo run', () => {
    expect(gained(1)).toBe('You gain 2 experience (now 5).')
  })

  it('says every player shares it in co-op', () => {
    expect(gained(3)).toBe('All players gain 2 experience (now 5).')
  })
})
