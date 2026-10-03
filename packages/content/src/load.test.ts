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

  it('Table 2: the default starter deck has 6 cards and a hand of 3', () => {
    const { deck } = defaultContent.config
    const preset = deck.presets.find((p) => p.id === deck.preset)
    expect(preset?.handSize).toBe(3)
    expect(preset?.cards.reduce((n, e) => n + e.quantity, 0)).toBe(6)
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

  it('Table 4: elite die faces deal 1 (weapons), 2 (Star), 0 (Shield, Blank)', () => {
    expect(defaultContent.enemies.enemyDieDamage).toEqual({
      Sword: 1,
      Wand: 1,
      Bow: 1,
      Star: 2,
      Shield: 0,
      Blank: 0,
    })
  })
})

describe('invalid content fails with a clear message', () => {
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
