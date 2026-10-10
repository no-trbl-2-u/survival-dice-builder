import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const m = defaultContent.config.milestones

describe('milestone text in the log (rule 17)', () => {
  it('uses the run summary label from ruleText', () => {
    const event = { type: 'milestoneReached', rule: '17', milestone: 'reveal-tiles', round: 4 }
    const line = describeEvent(event as never, {
      content: defaultContent,
      config: defaultContent.config,
    })
    expect(line).toBe(`Milestone: Reveal ${m.tilesRevealed} tiles.`)
  })
})
