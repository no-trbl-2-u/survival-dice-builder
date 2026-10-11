import { describe, expect, it } from 'vitest'
import { withConfigDefaults } from './configDefaults.ts'
import {
  CONFIG_HISTORY,
  CONFIG_VERSION,
  changedFields,
  defaultsAt,
  migrateConfig,
} from './configVersions.ts'
import { defaultContent } from './content.ts'
import type { GameConfig } from './schemas/config.ts'

const current = defaultContent.config

/** The default sets of earlier phases, as a saved config from then holds them. */
const phase21 = defaultsAt(1, current)
const phase23 = defaultsAt(3, current)
const phase25 = defaultsAt(CONFIG_VERSION, current)

describe('defaultsAt', () => {
  it('rebuilds the old defaults step by step', () => {
    expect(phase21.deck.preset).toBe('deck-10-hand-3')
    expect(phase21.combat.model).toBe('exchange')
    expect(phase21.options.skillUses).toBe('once-per-exchange')
    expect(phase21.combat.moveCostNextToEnemy).toBe(2)
    expect(phase23.deck.preset).toBe('deck-10-hand-5')
    expect(phase23.combat.model).toBe('engage')
    expect(phase23.options.skillUses).toBe('once-per-exchange')
    expect(phase25).toEqual(current)
  })

  it('names every changed path once per step, with a version above 1', () => {
    expect(CONFIG_VERSION).toBe(4)
    for (const step of CONFIG_HISTORY) expect(step.version).toBeGreaterThan(1)
  })
})

describe('changedFields', () => {
  it('lists the /config fields that differ from the defaults', () => {
    expect(changedFields(current, current)).toEqual([])
    const edited = { ...current, miniatureLimit: current.miniatureLimit + 1 }
    expect(changedFields(edited, current)).toEqual(['miniatureLimit'])
    expect(changedFields(phase21, current)).toEqual([
      'combat.model',
      'combat.moveCostNextToEnemy',
      'deck.preset',
      'options.skillUses',
    ])
  })
})

describe('migrateConfig', () => {
  it.each([
    ['phase 21', phase21, 1],
    ['phase 23', phase23, 3],
    ['phase 25', phase25, 4],
  ] as const)('an untouched %s save moves to the current defaults', (_, saved, version) => {
    const { values, updated } = migrateConfig<GameConfig>(saved, version, null, current)
    expect(values).toEqual(current)
    expect(updated.length > 0).toBe(version < CONFIG_VERSION)
  })

  it('a save from before versions is read as version 1 and keeps the changes the player made', () => {
    const saved = {
      ...phase21,
      miniatureLimit: 12,
      combat: { ...phase21.combat, moveCostNextToEnemy: 3 },
    }
    const { values, updated } = migrateConfig<GameConfig>(saved, 1, null, current)
    expect(values.miniatureLimit).toBe(12)
    expect(values.combat.moveCostNextToEnemy).toBe(3)
    expect(values.combat.model).toBe('engage')
    expect(updated).toEqual(['combat.model', 'deck.preset', 'options.skillUses'])
  })

  it('a versioned save keeps exactly the fields it lists as changed', () => {
    const saved = {
      ...phase23,
      options: { ...phase23.options, skillUses: 'once-per-exchange' as const },
    }
    const kept = migrateConfig<GameConfig>(saved, 3, ['options.skillUses'], current)
    expect(kept.values.options.skillUses).toBe('once-per-exchange')
    const moved = migrateConfig<GameConfig>(saved, 3, [], current)
    expect(moved.values.options.skillUses).toBe('unlimited')
  })

  it('a save missing new keys still parses after the defaults fill them', () => {
    const old: Partial<GameConfig> = { ...current }
    delete old.draft
    const filled = withConfigDefaults(old) as GameConfig
    expect(migrateConfig(filled, 4, null, current).values).toEqual(current)
  })
})
