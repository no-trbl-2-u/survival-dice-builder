import { defaultContent, loadContent, defaultRawContent, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { experienceForLevel, levelForExperience } from './levels.ts'

const config = defaultContent.config

describe('levels', () => {
  it('8.5 level 2 needs 5 experience; each next step needs 5 more', () => {
    expect([1, 2, 3, 4, 5].map((l) => experienceForLevel(l, config))).toEqual([0, 5, 15, 30, 50])
  })

  it('8.3 the level increases when the track reaches the next threshold', () => {
    expect(levelForExperience(0, config)).toBe(1)
    expect(levelForExperience(4, config)).toBe(1)
    expect(levelForExperience(5, config)).toBe(2)
    expect(levelForExperience(14, config)).toBe(2)
    expect(levelForExperience(15, config)).toBe(3)
  })

  it('18.1 max level caps the level when set', () => {
    const capped: GameConfig = { ...config, options: { ...config.options, maxLevel: 2 } }
    expect(levelForExperience(1000, capped)).toBe(2)
  })

  it('spec 1: changing a number in config.default.json changes the game, with no code edit', () => {
    const raw = structuredClone(defaultRawContent)
    ;(raw['config.default.json'] as GameConfig).experience.firstStep = 3
    const result = loadContent(raw)
    if (!result.ok) throw new Error('edited config should still be valid')
    expect(levelForExperience(3, config)).toBe(1)
    expect(levelForExperience(3, result.content.config)).toBe(2)
  })
})
