import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'
import { milestoneIds, milestoneLabel } from './milestoneText.ts'

const m = defaultContent.config.milestones

describe('milestone text', () => {
  it('names every milestone the config sets, with no raw ids', () => {
    for (const id of milestoneIds(m)) {
      const label = milestoneLabel(id, m, defaultContent)
      expect(label).not.toBe(id)
      expect(label).not.toMatch(/-|undefined/)
    }
  })

  it('takes its numbers from the config', () => {
    const custom = { ...m, surviveRounds: [8], tilesRevealed: 7, upgradesBought: 1, level: 3 }
    expect(milestoneIds(custom)[0]).toBe('survive-round-8')
    expect(milestoneLabel('survive-round-8', custom, defaultContent)).toBe('Survive to round 8')
    expect(milestoneLabel('reveal-tiles', custom, defaultContent)).toBe('Reveal 7 tiles')
    expect(milestoneLabel('buy-upgrades', custom, defaultContent)).toBe('Buy 1 base upgrade')
    expect(milestoneLabel('reach-level', custom, defaultContent)).toBe('Reach level 3')
    const skill = defaultContent.skills.find((s) => s.id === m.skillFired)!
    expect(milestoneLabel(`fire-${m.skillFired}`, custom, defaultContent)).toBe(
      `Fire ${skill.name}`,
    )
  })

  it('uses the same label in the log', () => {
    const event = { type: 'milestoneReached', rule: '17', milestone: 'reveal-tiles', round: 4 }
    const line = describeEvent(event as never, {
      content: defaultContent,
      config: defaultContent.config,
    })
    expect(line).toBe(`Milestone: Reveal ${m.tilesRevealed} tiles.`)
  })
})
