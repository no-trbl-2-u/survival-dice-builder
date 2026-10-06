import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { newRun } from '../play/run.ts'
import { numberMin, setAt } from './ConfigPage.tsx'
import {
  CONFIG_KEY,
  isDirty,
  loadConfig,
  plainMessage,
  resetConfig,
  saveConfig,
  type KeyValue,
} from './configStore.ts'
import { GameConfigSchema } from '@survival/content'

/** An in-memory storage. */
function memory(): KeyValue & { data: Map<string, string> } {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  }
}

describe('config store (spec 6)', () => {
  it('a changed config value is used by the next new run', () => {
    const store = memory()
    const changed = setAt(defaultContent.config, ['player', 'maxHealth'], 21)
    expect(saveConfig(store, changed)).toEqual([])
    const { config, custom } = loadConfig(store)
    expect(custom).toBe(true)
    expect(newRun(config, 1).state.players[0]!.health).toBe(21)
  })

  it('an invalid value is not saved and names the field', () => {
    const store = memory()
    const bad = setAt(defaultContent.config, ['combat', 'maxRolls'], 0)
    expect(saveConfig(store, bad)).toEqual([
      { path: 'combat.maxRolls', message: 'Enter a number more than 0.' },
    ])
    expect(store.data.has(CONFIG_KEY)).toBe(false)
  })

  it('problems are in plain words and filed under their field, naming the list item', () => {
    let bad = setAt(defaultContent.config, ['player', 'maxHealth'], '')
    bad = setAt(bad, ['deck', 'presets', 1, 'cards', 0, 'quantity'], 1.5)
    bad = setAt(bad, ['rulings', 'targetTieBreak'], ['player'])
    bad = setAt(bad, ['rulings', 'shopRefill'], 'later')
    expect(saveConfig(memory(), bad)).toEqual([
      { path: 'player.maxHealth', message: 'Enter a number.' },
      { path: 'deck.presets', message: 'Item 2, cards, item 1, quantity: Enter a whole number.' },
      { path: 'rulings.shopRefill', message: 'Use one of: immediate, end-of-turn.' },
      { path: 'rulings.targetTieBreak', message: 'List exactly 4 items.' },
    ])
  })

  it('a name that does not exist is not saved: it would crash the next run', () => {
    const store = memory()
    let bad = setAt(defaultContent.config, ['player', 'starterSkills'], ['strike', 'fireball'])
    bad = setAt(bad, ['deck', 'preset'], 'deck-10-hand-6')
    expect(saveConfig(store, bad)).toEqual([
      { path: 'deck.preset', message: 'No preset with id "deck-10-hand-6"' },
      {
        path: 'player.starterSkills',
        message: 'Item 2: Unknown Skill "fireball" (not in skills.json)',
      },
    ])
    expect(store.data.has(CONFIG_KEY)).toBe(false)
  })

  it('a stored config that names a missing card falls back to the defaults', () => {
    const store = memory()
    const bad = setAt(defaultContent.config, ['deck', 'presets', 0, 'cards', 0, 'card'], 'gone')
    store.setItem(CONFIG_KEY, JSON.stringify(bad))
    expect(loadConfig(store)).toMatchObject({
      config: defaultContent.config,
      custom: false,
      error: expect.any(String),
    })
  })

  it('an unknown issue keeps its own text, capitalised', () => {
    expect(plainMessage({ code: 'custom', message: 'must be odd', path: [] })).toBe('Must be odd')
  })

  it('the dirty check and the number minimum read the draft and the schema', () => {
    const changed = setAt(defaultContent.config, ['shop', 'offers'], 4)
    expect(isDirty(defaultContent.config, defaultContent.config)).toBe(false)
    expect(isDirty(changed, defaultContent.config)).toBe(true)
    expect(numberMin(GameConfigSchema.shape.shop.shape.offers)).toBe(1)
    expect(numberMin(GameConfigSchema.shape.rulings.shape.playerPullDistance)).toBe(0)
  })

  it('reset and corrupt storage fall back to the defaults', () => {
    const store = memory()
    store.setItem(CONFIG_KEY, '{oops')
    expect(loadConfig(store)).toMatchObject({ custom: false, error: expect.any(String) })
    resetConfig(store)
    expect(loadConfig(store)).toEqual({ config: defaultContent.config, custom: false, error: null })
  })
})
