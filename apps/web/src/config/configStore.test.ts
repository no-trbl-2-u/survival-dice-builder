import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { newRun } from '../play/run.ts'
import { setAt } from './ConfigPage.tsx'
import { CONFIG_KEY, loadConfig, resetConfig, saveConfig, type KeyValue } from './configStore.ts'

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
    expect(saveConfig(store, bad)[0]).toMatch(/^combat\.maxRolls/)
    expect(store.data.has(CONFIG_KEY)).toBe(false)
  })

  it('reset and corrupt storage fall back to the defaults', () => {
    const store = memory()
    store.setItem(CONFIG_KEY, '{oops')
    expect(loadConfig(store)).toMatchObject({ custom: false, error: expect.any(String) })
    resetConfig(store)
    expect(loadConfig(store)).toEqual({ config: defaultContent.config, custom: false, error: null })
  })
})
