import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { cardCount, draftCombatModel, groupHeading } from './ConfigPage.tsx'

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

describe('groupHeading', () => {
  it('makes a section an h2 and a nested group an h3, and leaves the root plain', () => {
    const html = (depth: number) =>
      renderToStaticMarkup(
        groupHeading(depth, 'Combat') as Parameters<typeof renderToStaticMarkup>[0],
      )
    expect(html(0)).toBe('Combat')
    expect(html(1)).toMatch(/^<h2 [^>]*>Combat<\/h2>$/)
    expect(html(2)).toMatch(/^<h3 [^>]*>Combat<\/h3>$/)
    expect(html(3)).toMatch(/^<h3 [^>]*>Combat<\/h3>$/)
  })
})
