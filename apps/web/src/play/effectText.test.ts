import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { combatSideText } from './CardView.tsx'
import { cardText, enemyFaceText, skillText } from './effectText.ts'

describe('effect text', () => {
  it('describes every Skill in content', () => {
    for (const s of defaultContent.skills) {
      const text = skillText(s.effect, 'engage')
      expect(text.length).toBeGreaterThan(4)
      expect(text).not.toMatch(/undefined|NaN/)
    }
    expect(skillText({ kind: 'damage', amount: 2, range: 1, target: 'one' }, 'engage')).toBe(
      '2 damage to 1 enemy within 1 hex',
    )
    expect(skillText({ kind: 'ignoreHit', hits: 1 }, 'engage')).toBe(
      'Ignore 1 enemy hit this engagement',
    )
    expect(skillText({ kind: 'ignoreHit', hits: 1 }, 'exchange')).toBe(
      'Ignore 1 enemy hit this exchange',
    )
  })

  it('describes both halves of every card', () => {
    for (const c of defaultContent.cards) {
      expect(cardText(c, defaultContent.config)).toMatch(/^Prepare: .+\. Combat: .+\.$/)
    }
  })

  it('prints the Combat half the run plays, as the Hand does (critique pass 40)', () => {
    const config = defaultContent.config
    expect(config.combat.model).toBe('engage')
    const haul = defaultContent.cards.find((c) => c.id === 'haul')
    expect(haul?.combat).toBeDefined()
    if (!haul) return
    expect(cardText(haul, config)).toContain(`Combat: ${combatSideText(haul, true)}.`)
    expect(cardText(haul, config)).toContain('Engage')
    const exchange = { ...config, combat: { ...config.combat, model: 'exchange' as const } }
    expect(cardText(haul, exchange)).toContain(`Combat: ${combatSideText(haul, false)}.`)
    expect(cardText(haul, exchange)).not.toBe(cardText(haul, config))
  })

  it('gives each enemy die face its damage from config', () => {
    const engage = defaultContent.config.combat.engage
    expect(enemyFaceText('hit', engage)).toEqual({
      name: 'Hit',
      label: `Hit ${engage.hitDamage}`,
      damage: engage.hitDamage,
    })
    expect(enemyFaceText('special', engage)).toEqual({
      name: 'Special',
      label: `Special ${engage.specialDamage}`,
      damage: engage.specialDamage,
    })
    expect(enemyFaceText('miss', engage)).toEqual({ name: 'Miss', label: 'Miss', damage: 0 })
    expect(enemyFaceText('special', { ...engage, specialDamage: 5 }).label).toBe('Special 5')
  })
})
