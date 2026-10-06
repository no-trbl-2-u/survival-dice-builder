import {
  configReferenceProblems,
  defaultContent,
  GameConfigSchema,
  metaFor,
  withConfigDefaults,
  type GameConfig,
} from '@survival/content'

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

/**
 * The config new runs use: the stored one when it is valid, else the defaults. Keys a stored
 * config does not have yet (options added after it was saved) take their default values.
 */
export function loadConfig(store: KeyValue | undefined): Readonly<{
  config: GameConfig
  custom: boolean
  error: string | null
}> {
  const defaults = defaultContent.config
  try {
    const raw = store?.getItem(CONFIG_KEY)
    if (!raw) return { config: defaults, custom: false, error: null }
    const parsed = GameConfigSchema.safeParse(withConfigDefaults(JSON.parse(raw)))
    if (!parsed.success || configReferenceProblems(parsed.data, defaultContent).length > 0) {
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

/** One save problem: the config field it belongs to (dotted path) and a plain message. */
export type ConfigProblem = Readonly<{ path: string; message: string }>

/** The parts of a Zod issue the plain message reads. */
type Issue = Readonly<{
  code: string
  message: string
  path: readonly PropertyKey[]
  origin?: string
  expected?: string
  minimum?: number | bigint
  maximum?: number | bigint
  inclusive?: boolean
  exact?: boolean
  values?: readonly unknown[]
}>

/** A Zod issue in plain words ("Enter a number of 1 or more."). The Zod text is the fallback. */
export function plainMessage(issue: Issue): string {
  const n = Number(issue.minimum ?? issue.maximum)
  if (issue.code === 'invalid_type') {
    if (issue.expected === 'int') return 'Enter a whole number.'
    if (issue.expected === 'number') return 'Enter a number.'
    if (issue.expected === 'array') return 'Enter a list.'
    return 'This value has the wrong type.'
  }
  if (issue.code === 'too_small' && issue.origin === 'number')
    return `Enter a number ${issue.inclusive ? `of ${n} or more` : `more than ${n}`}.`
  if (issue.code === 'too_big' && issue.origin === 'number')
    return `Enter a number ${issue.inclusive ? `of ${n} or less` : `less than ${n}`}.`
  if ((issue.code === 'too_small' || issue.code === 'too_big') && issue.origin === 'array') {
    const items = `${n} ${n === 1 ? 'item' : 'items'}`
    if (issue.exact) return `List exactly ${items}.`
    return issue.code === 'too_small' ? `List at least ${items}.` : `List at most ${items}.`
  }
  if (issue.code === 'invalid_value' && issue.values)
    return `Use one of: ${issue.values.map(String).join(', ')}.`
  return issue.message.charAt(0).toUpperCase() + issue.message.slice(1)
}

/**
 * The problem for one Zod issue, filed under the config field that holds it. An issue inside a
 * list names the item ("Item 2, quantity: ...").
 */
function toProblem(issue: Issue): ConfigProblem {
  const path = issue.path.map(String)
  const field = metaFor(path)?.path ?? (path.join('.') || 'config')
  const rest = issue.path
    .slice(field.split('.').length)
    .map((k) => (typeof k === 'number' ? `item ${k + 1}` : String(k)))
  const where = rest.length > 0 ? `${rest.join(', ')}: ` : ''
  const message = plainMessage(issue)
  return {
    path: field,
    message: where ? where.charAt(0).toUpperCase() + where.slice(1) + message : message,
  }
}

/**
 * Validates and stores a config: its shape first, then its references (cards, Skills, and deck
 * presets that exist; tile counts the tile set can fill), so a saved config always starts a
 * run. Returns the problems (field path and plain message) when it is not valid.
 */
export function saveConfig(store: KeyValue | undefined, value: unknown): ConfigProblem[] {
  const parsed = GameConfigSchema.safeParse(value)
  if (!parsed.success) return parsed.error.issues.map((i) => toProblem(i as Issue))
  const refs = configReferenceProblems(parsed.data, defaultContent)
  if (refs.length > 0)
    return refs.map((r) => toProblem({ code: 'custom', message: r.message, path: r.path }))
  try {
    store?.setItem(CONFIG_KEY, JSON.stringify(parsed.data))
    return []
  } catch {
    return [{ path: 'config', message: 'This browser does not allow saving.' }]
  }
}

/** True when the draft differs from the config last saved (or loaded). */
export function isDirty(draft: unknown, saved: unknown): boolean {
  return JSON.stringify(draft) !== JSON.stringify(saved)
}

/** Removes the stored config, so new runs use the defaults again. */
export function resetConfig(store: KeyValue | undefined): void {
  try {
    store?.removeItem(CONFIG_KEY)
  } catch {
    // Nothing stored or storage blocked: the defaults apply either way.
  }
}
