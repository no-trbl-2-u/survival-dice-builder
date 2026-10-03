import { defaultContent, GameConfigSchema, type GameConfig } from '@survival/content'

/** Browser storage keys (this browser only). */
export const CONFIG_KEY = 'survival.config.v1'
export const AUTOSAVE_KEY = 'survival.autosave.v1'

/** The part of `Storage` the stores use, so tests can pass a plain map. */
export type KeyValue = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

/** The browser's localStorage, or undefined when it is not available (private mode, tests). */
export function browserStorage(): KeyValue | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

/** The config new runs use: the stored one when it is valid, else the defaults. */
export function loadConfig(store: KeyValue | undefined): Readonly<{
  config: GameConfig
  custom: boolean
  error: string | null
}> {
  const defaults = defaultContent.config
  try {
    const raw = store?.getItem(CONFIG_KEY)
    if (!raw) return { config: defaults, custom: false, error: null }
    const parsed = GameConfigSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      return {
        config: defaults,
        custom: false,
        error: 'The saved config is not valid; using the defaults.',
      }
    }
    const custom = JSON.stringify(parsed.data) !== JSON.stringify(defaults)
    return { config: parsed.data, custom, error: null }
  } catch {
    return {
      config: defaults,
      custom: false,
      error: 'The saved config cannot be read; using the defaults.',
    }
  }
}

/**
 * Validates and stores a config. Returns the problems (path and message) when it is not valid.
 */
export function saveConfig(store: KeyValue | undefined, value: unknown): string[] {
  const parsed = GameConfigSchema.safeParse(value)
  if (!parsed.success) {
    return parsed.error.issues.map((i) => `${i.path.join('.') || 'config'}: ${i.message}`)
  }
  try {
    store?.setItem(CONFIG_KEY, JSON.stringify(parsed.data))
    return []
  } catch {
    return ['This browser does not allow saving.']
  }
}

/** Removes the stored config, so new runs use the defaults again. */
export function resetConfig(store: KeyValue | undefined): void {
  try {
    store?.removeItem(CONFIG_KEY)
  } catch {
    // Nothing stored or storage blocked: the defaults apply either way.
  }
}
