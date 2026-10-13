import { describe, expect, it } from 'vitest'
import { defaultContent, defaultRawContent } from './content.ts'
import { formatContentError, loadContent, type RawContent } from './load.ts'

/** Deep copy of the default raw content, so a test can break one field. */
function rawCopy(): RawContent {
  return structuredClone(defaultRawContent)
}

function errorsOf(raw: RawContent): string[] {
  const result = loadContent(raw)
  return result.ok ? [] : result.errors.map(formatContentError)
}

describe('default content', () => {
  it('validates with no errors', () => {
    expect(errorsOf(rawCopy())).toEqual([])
  })

  it('2.6, 2.7 every card has a top half (Prepare) and a bottom half (Combat)', () => {
    for (const card of defaultContent.cards) {
      expect(card.top, card.id).toBeDefined()
      expect(card.bottom.length, card.id).toBeGreaterThan(0)
    }
  })

  it('core loop v2, row 19: the default starter deck has 10 cards and a hand of 5 (row 71)', () => {
    const { deck } = defaultContent.config
    const preset = deck.presets.find((p) => p.id === deck.preset)
    expect(preset?.handSize).toBe(5)
    expect(preset?.cards.reduce((n, e) => n + e.quantity, 0)).toBe(10)
    expect(Object.fromEntries(preset?.cards.map((e) => [e.card, e.quantity]) ?? [])).toEqual({
      'starter-move': 4,
      'starter-gather': 4,
      'starter-build': 1,
      'starter-rest': 1,
    })
    expect(deck.minimumSize).toBe(10)
  })

  it('Spec v2 Table 8, ruling 13: each Gather card sets its amount (starter 2, Haul 3)', () => {
    const amount = (id: string) => {
      const top = defaultContent.cards.find((c) => c.id === id)?.top
      return top?.kind === 'gather' ? top.amount : undefined
    }
    expect(amount('starter-gather')).toBe(2)
    expect(amount('haul')).toBe(3)
  })

  it('Tables 3 and 9: 4 starter Skills and 14 draft Skills', () => {
    expect(defaultContent.skills.filter((s) => s.level === 0)).toHaveLength(4)
    expect(defaultContent.skills.filter((s) => s.level > 0)).toHaveLength(14)
  })

  it('Table 8: 14 supply cards across levels 1-3', () => {
    const supply = defaultContent.cards.filter((c) => c.level > 0)
    expect(supply).toHaveLength(14)
    expect(new Set(supply.map((c) => c.level))).toEqual(new Set([1, 2, 3]))
  })

  it('2.2 [006]: 9 tiles — 1 base, 3 countryside, 5 core', () => {
    const kinds = defaultContent.tiles.map((t) => t.kind)
    expect(kinds.filter((k) => k === 'base')).toHaveLength(1)
    expect(kinds.filter((k) => k === 'countryside')).toHaveLength(3)
    expect(kinds.filter((k) => k === 'core')).toHaveLength(5)
  })

  it('Spec v2 Table 5: each enemy record gives its enemy dice and siege damage', () => {
    const rec = (id: string) => defaultContent.enemies.enemies.find((e) => e.id === id)!
    expect(rec('grunt')).toMatchObject({ health: 2, dice: 1, siege: 1, experience: 1, currency: 1 })
    expect(rec('elite')).toMatchObject({
      health: 14,
      dice: 2,
      siege: 3,
      experience: 4,
      currency: 4,
    })
  })

  it('a Skill with 0 faces names the file and the field', () => {
    const raw = rawCopy()
    ;(raw['skills.json'] as { skills: { faces: string[] }[] }).skills[3]!.faces = []
    expect(errorsOf(raw)).toContain('skills.json: skills[3].faces: must have at least 1 face')
  })

  it('an unknown die face is rejected', () => {
    const raw = rawCopy()
    ;(raw['skills.json'] as { skills: { faces: string[] }[] }).skills[0]!.faces = ['Axe']
    expect(errorsOf(raw).some((e) => e.startsWith('skills.json: skills[0].faces[0]:'))).toBe(true)
  })

  it('a deck preset that names a missing card is a cross-file error', () => {
    const raw = rawCopy()
    const config = raw['config.default.json'] as {
      deck: { presets: { cards: { card: string }[] }[] }
    }
    config.deck.presets[0]!.cards[0]!.card = 'no-such-card'
    expect(errorsOf(raw)).toContain(
      'config.default.json: deck.presets[0].cards[0].card: unknown card "no-such-card" (not in cards.json)',
    )
  })

  it('reports every error, not just the first', () => {
    const raw = rawCopy()
    ;(raw['skills.json'] as { skills: { faces: string[] }[] }).skills[1]!.faces = []
    ;(raw['config.default.json'] as { player: { maxHealth: number } }).player.maxHealth = -1
    expect(errorsOf(raw).length).toBeGreaterThanOrEqual(2)
  })

  it('a missing upgrade tier is rejected (11.4: I, II, III in sequence)', () => {
    const raw = rawCopy()
    const file = raw['upgrades.json'] as { upgrades: { id: string }[] }
    file.upgrades = file.upgrades.filter((u) => u.id !== 'shop-2')
    expect(errorsOf(raw)).toContain(
      'upgrades.json: upgrades: track "shop" must have tiers 1, 2, 3 exactly once (found 1, 3)',
    )
  })
})
