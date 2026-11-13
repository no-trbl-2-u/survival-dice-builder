import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { cardCount, draftCombatModel, groupHeading, SundialDaysEditor } from './ConfigPage.tsx'

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

describe('SundialDaysEditor', () => {
  it('captions each day with its place, name and what sets it apart (critique pass 47)', () => {
    const days = defaultContent.config.calendar!.sundial.days
    const html = renderToStaticMarkup(
      createElement(SundialDaysEditor, { groupA11y: {}, value: days, onChange: () => {} }),
    )
    expect(html).toContain('Day 1: Dawn (no enemies, a Respite)')
    expect(html).toContain('Day 6: Feast (a Respite)')
    expect(html).toContain('Day 7: Blood Moon (1 extra elite)')
    expect(html).toContain('Day 2: Raid<')
  })
})
