import { defaultContent, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { createGame } from '../api/createGame.ts'
import type { GameState } from '../state/types.ts'
import { buildSupplies, drawLevel, openLevel, SUPPLY_LEVELS } from './supplies.ts'

const config = defaultContent.config
const game = createGame(config, 7)
const content = game.content

/** The same game with exactly these upgrade tiers bought. */
const bought = (upgrades: string[]): GameState => ({ ...game, upgrades })

describe('openLevel (11.4, Table 6)', () => {
  it('11.4 a track with no tier bought is closed (0)', () => {
    expect(openLevel(bought([]), 'shop')).toBe(0)
    expect(openLevel(bought([]), 'training')).toBe(0)
  })

  it('11.4 each track reads only its own tiers', () => {
    const s = bought(['shop-1', 'shop-2'])
    expect(openLevel(s, 'shop')).toBe(2)
    expect(openLevel(s, 'training')).toBe(0)
    expect(openLevel(bought(['training-1']), 'training')).toBe(1)
    expect(openLevel(bought(['training-1']), 'shop')).toBe(0)
  })

  it('11.4 the highest bought tier sets the level, in any order', () => {
    expect(openLevel(bought(['shop-3', 'shop-1']), 'shop')).toBe(3)
    expect(openLevel(bought(['shop-1', 'shop-3']), 'shop')).toBe(3)
  })

  it('Table 6 the level comes from the content, not the tier id', () => {
    const s: GameState = {
      ...bought(['shop-1']),
      content: {
        ...content,
        upgrades: content.upgrades.map((u) => (u.id === 'shop-1' ? { ...u, opensLevel: 2 } : u)),
      },
    }
    expect(openLevel(s, 'shop')).toBe(2)
  })
})

describe('drawLevel (11.5, 11.8)', () => {
  it('11.5 draws from the highest open level while it has cards', () => {
    expect(drawLevel({ '1': ['a'], '2': ['b'], '3': ['c'] }, 3)).toBe('3')
    expect(drawLevel({ '1': ['a'], '2': ['b'], '3': ['c'] }, 2)).toBe('2')
  })

  it('11.8 row 41 an empty or missing level falls back to the next lower level with cards', () => {
    expect(drawLevel({ '1': ['a'], '2': [], '3': [] }, 3)).toBe('1')
    expect(drawLevel({ '1': [], '2': ['b'] }, 3)).toBe('2')
  })

  it('11.8 never draws above the highest open level', () => {
    expect(drawLevel({ '1': [], '2': ['b'] }, 1)).toBeNull()
  })

  it('11.8 null when every open level is empty, or no level is open', () => {
    expect(drawLevel({ '1': [], '2': [], '3': [] }, 3)).toBeNull()
    expect(drawLevel({}, 3)).toBeNull()
    expect(drawLevel({ '1': ['a'] }, 0)).toBeNull()
  })
})

describe('buildSupplies (4.12, Tables 8-9)', () => {
  const count = (items: readonly { id: string; level: number }[], level: string) =>
    items.filter((x) => String(x.level) === level).length

  it('row 18 each level holds copiesPerCard of every card and copiesPerSkill of every Skill', () => {
    const [supplies] = buildSupplies(content, config, 1)
    for (const level of SUPPLY_LEVELS) {
      expect(supplies.cards[level]).toHaveLength(
        count(content.cards, level) * config.supplies.copiesPerCard,
      )
      expect(supplies.skills[level]).toHaveLength(
        count(content.skills, level) * config.supplies.copiesPerSkill,
      )
      for (const id of supplies.cards[level]!) {
        expect(content.cards.find((c) => c.id === id)?.level).toBe(Number(level))
      }
      for (const id of supplies.skills[level]!) {
        expect(content.skills.find((s) => s.id === id)?.level).toBe(Number(level))
      }
    }
  })

  it('row 18 changing the copies in config changes the stack sizes', () => {
    const doubled: GameConfig = {
      ...config,
      supplies: {
        ...config.supplies,
        copiesPerCard: config.supplies.copiesPerCard * 2,
        copiesPerSkill: config.supplies.copiesPerSkill * 2,
      },
    }
    const [base] = buildSupplies(content, config, 1)
    const [more] = buildSupplies(content, doubled, 1)
    for (const level of SUPPLY_LEVELS) {
      expect(more.cards[level]).toHaveLength(base.cards[level]!.length * 2)
      expect(more.skills[level]).toHaveLength(base.skills[level]!.length * 2)
    }
  })

  it('the same seed builds the same stacks and returns the same next seed', () => {
    expect(buildSupplies(content, config, 42)).toEqual(buildSupplies(content, config, 42))
  })

  it('the stacks are shuffled with the seed, and the seed advances', () => {
    const [a, nextA] = buildSupplies(content, config, 1)
    const [b] = buildSupplies(content, config, 2)
    expect(nextA).not.toBe(1)
    expect(SUPPLY_LEVELS.some((l) => a.cards[l]!.join() !== b.cards[l]!.join())).toBe(true)
    for (const level of SUPPLY_LEVELS) {
      expect([...a.cards[level]!].sort()).toEqual([...b.cards[level]!].sort())
    }
  })
})
