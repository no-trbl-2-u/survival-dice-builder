import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { cardText, skillText } from './effectText.ts'

describe('effect text', () => {
  it('describes every Skill in content', () => {
    for (const s of defaultContent.skills) {
      const text = skillText(s.effect)
      expect(text.length).toBeGreaterThan(4)
      expect(text).not.toMatch(/undefined|NaN/)
    }
    expect(skillText({ kind: 'damage', amount: 2, range: 1, target: 'one' })).toBe(
      '2 damage to 1 enemy within 1 hex',
    )
    expect(skillText({ kind: 'ignoreHit', hits: 1 })).toBe('Ignore 1 enemy hit this exchange')
  })

  it('describes both halves of every card', () => {
    for (const c of defaultContent.cards) {
      expect(cardText(c)).toMatch(/^Prepare: .+\. Combat: .+\.$/)
    }
  })
})
