import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { draftCombatModel } from './ConfigPage.tsx'

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
