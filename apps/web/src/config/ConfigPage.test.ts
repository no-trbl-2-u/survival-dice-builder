import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { cardCount, draftCombatModel } from './ConfigPage.tsx'

describe('draftCombatModel', () => {
  it("reads the draft's Combat model, else the default config's", () => {
    expect(draftCombatModel({ combat: { model: 'exchange' } })).toBe('exchange')
    expect(draftCombatModel({ combat: { model: 'engage' } })).toBe('engage')
    expect(draftCombatModel({ combat: { model: 'nonsense' } })).toBe(
      defaultContent.config.combat.model,
    )
    expect(draftCombatModel(null)).toBe(defaultContent.config.combat.model)
  })
})

describe('cardCount', () => {
  it('says "1 card" for a one-card deck and "N cards" otherwise', () => {
    expect(cardCount(1)).toBe('1 card')
    expect(cardCount(0)).toBe('0 cards')
    expect(cardCount(10)).toBe('10 cards')
  })
})
