import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { cardText, enemyFaceText, skillText } from './effectText.ts'

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

  it('gives each enemy die face its damage from config', () => {
    const engage = defaultContent.config.combat.engage
    expect(enemyFaceText('hit', engage)).toEqual({
      label: `HIT ${engage.hitDamage}`,
      damage: engage.hitDamage,
    })
    expect(enemyFaceText('special', engage)).toEqual({
      label: `SPECIAL ${engage.specialDamage}`,
      damage: engage.specialDamage,
    })
    expect(enemyFaceText('miss', engage)).toEqual({ label: 'miss', damage: 0 })
    expect(enemyFaceText('special', { ...engage, specialDamage: 5 }).label).toBe('SPECIAL 5')
  })
})
