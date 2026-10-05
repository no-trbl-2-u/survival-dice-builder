import { describe, expect, it } from 'vitest'
import { withConfigDefaults } from './configDefaults.ts'
import { defaultContent } from './content.ts'
import { GameConfigSchema } from './schemas/config.ts'

describe('withConfigDefaults', () => {
  it('fills a phase 21 config (no phase 22 keys) with the defaults, so it parses', () => {
    const raw = JSON.parse(JSON.stringify(defaultContent.config))
    delete raw.clock
    delete raw.spawn
    delete raw.gather
    delete raw.combat.enemyAttacks
    delete raw.combat.adjacentAttack
    raw.combat.maxRolls = 2
    expect(GameConfigSchema.safeParse(raw).success).toBe(false)
    const filled = GameConfigSchema.parse(withConfigDefaults(raw))
    expect(filled.combat.maxRolls).toBe(2)
    expect(filled.combat.enemyAttacks).toBe('every-exchange')
    expect(filled.clock.forcedRevealEvery).toBeNull()
  })

  it('keeps lists and wrong values as they are', () => {
    const raw = { player: { starterSkills: ['strike'] }, miniatureLimit: 'x' }
    const filled = withConfigDefaults(raw) as typeof raw
    expect(filled.player.starterSkills).toEqual(['strike'])
    expect(filled.miniatureLimit).toBe('x')
    expect(withConfigDefaults(null)).toBeNull()
  })
})
