import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
import { configMetaPaths, configMetaProblems, defaultConfigMeta, metaFor } from './configMeta.ts'

describe('config metadata (rule 18.1)', () => {
  it('every config path has an entry, every field has help and a rule, every option a phrase', () => {
    expect(configMetaProblems(defaultConfigMeta, defaultContent.config)).toEqual([])
  })

  it('reports a missing entry, an unknown path, a field without help, and a missing phrase', () => {
    const refill = defaultConfigMeta['rulings.shopRefill']
    const rolls = defaultConfigMeta['combat.maxRolls']
    const rest = Object.fromEntries(
      Object.entries(defaultConfigMeta).filter(([path]) => path !== 'player.maxHealth'),
    )
    const broken = {
      ...rest,
      'combat.maxRolls': { label: rolls!.label },
      'rulings.shopRefill': { ...refill!, options: { immediate: 'At once' } },
      'player.speed': { label: 'Speed', help: 'Not a field.', rule: '1' },
    }
    expect(configMetaProblems(broken, defaultContent.config)).toEqual([
      'player.maxHealth: no entry',
      'combat.maxRolls: no help or rule',
      'player.speed: not a config path',
      'rulings.shopRefill: no phrase for "end-of-turn"',
    ])
  })

  it('lists groups and fields; a list is a field', () => {
    const paths = configMetaPaths(defaultContent.config)
    expect(paths).toContainEqual({ path: 'rulings', group: true })
    expect(paths).toContainEqual({ path: 'deck.presets', group: false })
    expect(paths.some((p) => p.path.startsWith('deck.presets.'))).toBe(false)
  })

  it('a path inside a list gets the entry of the list', () => {
    expect(metaFor(['deck', 'presets', 0, 'cards'])?.path).toBe('deck.presets')
    expect(metaFor('combat.moveCostNextToEnemy')?.entry.rule).toBe('6.9')
    expect(metaFor('nothing.here')).toBeNull()
  })
})
