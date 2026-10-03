import { describe, expect, it } from 'vitest'
import { loadPrefs, savePrefs, SOUND_KEY } from './prefs.ts'

const memory = () => {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  }
}

describe('presentation prefs', () => {
  it('defaults to sound on, 3D dice off', () => {
    expect(loadPrefs(memory())).toEqual({ sound: true, dice3d: false })
    expect(loadPrefs(undefined)).toEqual({ sound: true, dice3d: false })
  })

  it('saves and loads', () => {
    const store = memory()
    savePrefs(store, { sound: false, dice3d: true })
    expect(store.getItem(SOUND_KEY)).toBe('off')
    expect(loadPrefs(store)).toEqual({ sound: false, dice3d: true })
  })

  it('survives a blocked store', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
      removeItem: () => undefined,
    }
    expect(loadPrefs(blocked)).toEqual({ sound: true, dice3d: false })
    expect(() => savePrefs(blocked, { sound: false, dice3d: false })).not.toThrow()
  })
})
