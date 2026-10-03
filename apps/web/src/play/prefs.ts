import type { KeyValue } from '../config/configStore.ts'

/** Presentation preferences (never part of a run or its state). */
export type Prefs = Readonly<{ sound: boolean; dice3d: boolean }>

export const SOUND_KEY = 'survival.sound.v1'
export const DICE3D_KEY = 'survival.dice3d.v1'

/** Sound on and 3D dice off unless this browser saved otherwise. */
export function loadPrefs(store: KeyValue | undefined): Prefs {
  const read = (key: string, fallback: boolean) => {
    try {
      const v = store?.getItem(key)
      return v === 'on' ? true : v === 'off' ? false : fallback
    } catch {
      return fallback
    }
  }
  return { sound: read(SOUND_KEY, true), dice3d: read(DICE3D_KEY, false) }
}

/** Saves the preferences; a blocked store only loses them. */
export function savePrefs(store: KeyValue | undefined, prefs: Prefs): void {
  try {
    store?.setItem(SOUND_KEY, prefs.sound ? 'on' : 'off')
    store?.setItem(DICE3D_KEY, prefs.dice3d ? 'on' : 'off')
  } catch {
    // Storage blocked: the preference lasts this page only.
  }
}
