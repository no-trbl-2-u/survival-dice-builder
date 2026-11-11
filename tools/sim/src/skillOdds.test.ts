import { defaultContent } from '@survival/content'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { fireChance, oddsTable, SkillProposalSchema } from './skillOdds.ts'

describe('fireChance (2.3-2.5, 7.8)', () => {
  it('1 face, 1 die, 1 roll: the face or a Star, 2 in 6', () => {
    expect(fireChance(['Sword'], 1, 1)).toBeCloseTo(2 / 6, 10)
  })

  it('1 face, 1 die, 3 rolls: 1 - (4/6)^3', () => {
    expect(fireChance(['Sword'], 1, 3)).toBeCloseTo(1 - (4 / 6) ** 3, 10)
  })

  it('more faces than dice never fire; more dice never lower the chance', () => {
    expect(fireChance(['Sword', 'Sword', 'Sword'], 2)).toBe(0)
    const cleave = [2, 3, 4, 5].map((d) => fireChance(['Sword', 'Sword'], d))
    expect([...cleave].sort((a, b) => a - b)).toEqual(cleave)
  })

  it('2 different faces fire more often than 2 of the same face (a Star helps either slot)', () => {
    expect(fireChance(['Sword', 'Wand'], 2)).toBeGreaterThan(fireChance(['Sword', 'Sword'], 2))
  })
})

describe('Skills v1 proposal (docs/design/skills-v1/skills.proposal.json)', () => {
  const file = JSON.parse(
    fs.readFileSync(
      new URL('../../../docs/design/skills-v1/skills.proposal.json', import.meta.url),
      'utf-8',
    ),
  ) as { skills: unknown[] }

  it('has 30 Skills, 10 families of 3 tiers, each valid under the proposal schema', () => {
    const skills = file.skills.map((s) => SkillProposalSchema.parse(s))
    expect(skills).toHaveLength(30)
    const families = new Set(skills.map((s) => s.family))
    expect(families.size).toBe(10)
    for (const f of families) {
      expect(skills.filter((s) => s.family === f).map((s) => s.tier)).toEqual(['I', 'II', 'III'])
    }
  })

  it('17: only Arcane Rain reuses a current id, so the "Fire Arcane Rain" milestone still works', () => {
    const ids = new Set(defaultContent.skills.map((s) => s.id))
    const skills = file.skills.map((s) => SkillProposalSchema.parse(s))
    expect(skills.filter((s) => ids.has(s.id)).map((s) => s.id)).toEqual(['arcane-rain'])
    expect(oddsTable(skills).every((r) => r.chance.every((c) => c >= 0 && c <= 1))).toBe(true)
  })
})
