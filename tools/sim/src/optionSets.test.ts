import { defaultContent, GameConfigSchema } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { applyOptions, getPath, OPTION_SETS, optionSet, parseValue, setPath } from './optionSets.ts'

const config = defaultContent.config

describe('the option sets (phase 38)', () => {
  const sets = Object.values(OPTION_SETS)

  it('every option is a config key and differs from the shipped default (drift guard)', () => {
    for (const set of sets) {
      expect(set.options.length).toBeGreaterThan(0)
      for (const o of set.options) {
        expect(getPath(config, o.path), `${set.name}: ${o.path}`).not.toBeUndefined()
        // When a default adopts an option, the set would silently measure the defaults.
        expect(getPath(config, o.path), `${set.name}: ${o.path} equals the default`).not.toEqual(
          o.value,
        )
      }
    }
  })

  it('rec holds rows 63, 66, 67; exp holds rows 64, 70; neither holds an exchanges-only row', () => {
    expect(OPTION_SETS.rec.options.map((o) => o.row)).toEqual([63, 66, 67])
    expect(OPTION_SETS.exp.options.map((o) => o.row)).toEqual([64, 70])
    const rows = sets.flatMap((s) => s.options.map((o) => o.row))
    expect(rows).not.toContain(65)
    expect(rows).not.toContain(69)
  })

  it('applyOptions gives a valid config with every option set', () => {
    for (const set of sets) {
      const applied = applyOptions(config, set)
      expect(GameConfigSchema.safeParse(applied).success).toBe(true)
      for (const o of set.options) expect(getPath(applied, o.path)).toEqual(o.value)
    }
    expect(optionSet('rec')).toBe(OPTION_SETS.rec)
    expect(optionSet('default')).toBeUndefined()
  })
})

describe('setPath', () => {
  it('sets a dotted path without changing its input', () => {
    const next = setPath(config, 'spawn.rampEvery', 2)
    expect(next.spawn.rampEvery).toBe(2)
    expect(config.spawn.rampEvery).toBeNull()
    expect(next.combat).toEqual(config.combat)
  })

  it('rejects a path the config does not have and a value the schema rejects', () => {
    expect(() => setPath(config, 'spawn.nope', 2)).toThrow('spawn.nope is not a config key')
    expect(() => setPath(config, 'nope.deeper', 2)).toThrow('is not a config key')
    expect(() => setPath(config, 'combat.model', 'melee')).toThrow('combat.model="melee"')
  })
})

describe('parseValue', () => {
  it('reads numbers, booleans, null, and strings', () => {
    expect(parseValue('3')).toBe(3)
    expect(parseValue('0.5')).toBe(0.5)
    expect(parseValue('true')).toBe(true)
    expect(parseValue('false')).toBe(false)
    expect(parseValue('null')).toBeNull()
    expect(parseValue('engage')).toBe('engage')
    expect(parseValue('')).toBe('')
  })
})
