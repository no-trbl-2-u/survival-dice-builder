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
    const offers = defaultConfigMeta['shop.offers']
    const fired = defaultConfigMeta['milestones.skillFired']
    const rest = Object.fromEntries(
      Object.entries(defaultConfigMeta).filter(([path]) => path !== 'player.maxHealth'),
    )
    const broken = {
      ...rest,
      'combat.maxRolls': { label: rolls!.label, range: rolls!.range },
      'rulings.shopRefill': { ...refill!, options: { immediate: 'At once' } },
      'shop.offers': { ...offers!, range: [4, 4] as [number, number] },
      'milestones.skillFired': { ...fired!, source: undefined },
      'player.speed': { label: 'Speed', help: 'Not a field.', rule: '1' },
    }
    expect(configMetaProblems(broken, defaultContent.config)).toEqual([
      'player.maxHealth: no entry',
      'combat.maxRolls: no help or rule',
      'player.speed: not a config path',
      'player.maxHealth: no slider range',
      'shop.offers: slider range is empty',
      'milestones.skillFired: no source for its choices',
      'rulings.shopRefill: no phrase for "end-of-turn"',
    ])
  })

  it('lists groups and fields; a list is a field', () => {
    const paths = configMetaPaths(defaultContent.config)
    expect(paths).toContainEqual({ path: 'rulings', group: true })
    expect(paths).toContainEqual({ path: 'deck.presets', group: false })
    expect(paths.some((p) => p.path.startsWith('deck.presets.'))).toBe(false)
  })

  it('marks the fields the engine does not read yet, and no others', () => {
    const unused = Object.entries(defaultConfigMeta)
      .filter(([, entry]) => entry.unused)
      .map(([path]) => path)
    expect(unused).toEqual([
      'combat.exchangeRange',
      'rulings.enemiesPerHex',
      'rulings.tileRotation',
      'rulings.shopRefill',
      'rulings.healTargets',
      'rulings.eliteReplacement',
    ])
  })

  it('the miniature limit help states the phase 21 rule', () => {
    expect(defaultConfigMeta['miniatureLimit']?.help).toMatch(/new grunt or elite/)
  })

  it('the Combat model names its choices plainly and describes each once', () => {
    const model = defaultConfigMeta['combat.model']
    expect(model?.options).toEqual({
      engage: 'Engagements (default)',
      exchange: 'Exchanges (written rules)',
    })
    expect(model?.help).not.toMatch(/Spec v1|Combat v3/)
    expect(model?.help?.match(/Engagements/g)).toHaveLength(1)
  })

  it('a path inside a list gets the entry of the list', () => {
    expect(metaFor(['deck', 'presets', 0, 'cards'])?.path).toBe('deck.presets')
    expect(metaFor('combat.moveCostNextToEnemy')?.entry.rule).toBe('6.9')
    expect(metaFor('nothing.here')).toBeNull()
  })
})
