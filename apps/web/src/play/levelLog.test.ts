import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const level = (players: number) =>
  describeEvent(
    { type: 'levelReached', rule: '8.4', level: 2 } as never,
    {
      content: defaultContent,
      players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
    } as never,
  )

describe('level text in the log', () => {
  it('speaks to the one player in a solo run', () => {
    expect(level(1)).toBe('Level 2! You get 1 action die.')
  })

  it('names every player in co-op', () => {
    expect(level(2)).toBe('Level 2! Every player gets 1 action die.')
  })
})
