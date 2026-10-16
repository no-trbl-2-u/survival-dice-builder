import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const knockout = (materialsLost: number, currencyLost: number) =>
  describeEvent(
    { type: 'playerKnockedOut', rule: '9.7', player: 'p1', materialsLost, currencyLost } as never,
    { content: defaultContent },
  )

describe('knockout text in the log', () => {
  it('names both losses, with a singular for one material', () => {
    expect(knockout(1, 3)).toBe(
      'You are knocked out and lose 1 material and 3 currency: back at the next round start.',
    )
  })

  it('names the lost currency when no materials are lost', () => {
    expect(knockout(0, 2)).toBe(
      'You are knocked out and lose 2 currency: back at the next round start.',
    )
  })

  it('names no loss when nothing is lost', () => {
    expect(knockout(0, 0)).toBe('You are knocked out: back at the next round start.')
  })
})
