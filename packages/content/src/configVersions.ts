import { defaultConfigMeta, metaFor } from './configMeta.ts'
import type { ConfigMeta } from './schemas/configMeta.ts'

/**
 * Config versions: each time a default changes, the config version goes up and this list names
 * the fields whose default changed and the value they had before. A saved config then moves
 * forward: a field the player never changed takes the new default; a field they changed keeps
 * their value. Pure: no I/O.
 */

/** One step of the default history: the defaults of the fields that changed, before the step. */
export type ConfigStep = Readonly<{
  version: number
  date: string
  note: string
  /** Dotted config path -> the default it had before this version. */
  before: Readonly<Record<string, unknown>>
}>

/**
 * Every default change since the first versioned config (version 1: the phase 21 and 22
 * defaults). New keys need no step: `withConfigDefaults` fills them.
 */
export const CONFIG_HISTORY: readonly ConfigStep[] = [
  {
    version: 2,
    date: '2026-10-06',
    note: 'a hand of 5 (row 71)',
    before: { 'deck.preset': 'deck-10-hand-3' },
  },
  {
    version: 3,
    date: '2026-10-09',
    note: 'engagements by default (phase 23, row 72)',
    before: { 'combat.model': 'exchange' },
  },
  {
    version: 4,
    date: '2026-10-09',
    note: 'designer changes: Skill uses, move cost next to enemies',
    before: { 'options.skillUses': 'once-per-exchange', 'combat.moveCostNextToEnemy': 2 },
  },
]

/** The current config version. */
export const CONFIG_VERSION = CONFIG_HISTORY.reduce((v, s) => Math.max(v, s.version), 1)

type Tree = Record<string, unknown>
const isGroup = (v: unknown): v is Tree => v !== null && typeof v === 'object' && !Array.isArray(v)

function getAt(tree: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((t, k) => (isGroup(t) ? t[k] : undefined), tree)
}

function setAt(tree: unknown, path: string, value: unknown): unknown {
  const [head, ...rest] = path.split('.')
  if (!head || !isGroup(tree)) return tree
  return { ...tree, [head]: rest.length === 0 ? value : setAt(tree[head], rest.join('.'), value) }
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/**
 * The defaults as they were at a version: the current defaults with every later step undone.
 *
 * @param version - a config version (1 to `CONFIG_VERSION`).
 * @param current - the current default config.
 */
export function defaultsAt<T>(version: number, current: T): T {
  return [...CONFIG_HISTORY]
    .filter((s) => s.version > version)
    .sort((a, b) => b.version - a.version)
    .reduce<unknown>(
      (tree, step) =>
        Object.entries(step.before).reduce<unknown>((t, [p, v]) => setAt(t, p, v), tree),
      current,
    ) as T
}

/** Every leaf path where two configs differ (lists compare as one value). */
function leafDiffs(a: unknown, b: unknown, prefix = ''): string[] {
  if (isGroup(a) && isGroup(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    return [...keys].flatMap((k) => leafDiffs(a[k], b[k], prefix ? `${prefix}.${k}` : k))
  }
  return same(a, b) ? [] : [prefix]
}

/**
 * The /config fields (meta paths) where a config differs from the defaults, sorted.
 *
 * @param config - a config.
 * @param defaults - the defaults to compare with.
 */
export function changedFields(
  config: unknown,
  defaults: unknown,
  meta: ConfigMeta = defaultConfigMeta,
): string[] {
  const fields = leafDiffs(config, defaults).map((p) => metaFor(p, meta)?.path ?? p)
  return [...new Set(fields)].sort()
}

/**
 * Moves a saved config forward to the current version. A field whose default changed after the
 * save takes the new default unless the player had changed it.
 *
 * @param values - the saved config (already filled with `withConfigDefaults`).
 * @param version - the version it was saved at (1 for a save from before versions).
 * @param changed - the fields the player changed, or null to work them out against the
 *   defaults of `version`.
 * @param current - the current default config.
 * @returns the moved config and the fields that took a new default.
 */
export function migrateConfig<T>(
  values: T,
  version: number,
  changed: readonly string[] | null,
  current: T,
): Readonly<{ values: T; updated: string[] }> {
  const kept = new Set(changed ?? changedFields(values, defaultsAt(version, current)))
  const updated: string[] = []
  let out: unknown = values
  for (const step of CONFIG_HISTORY.filter((s) => s.version > version)) {
    for (const path of Object.keys(step.before)) {
      const field = metaFor(path)?.path ?? path
      if (kept.has(field) || kept.has(path)) continue
      const next = getAt(current, path)
      if (!same(getAt(out, path), next)) {
        out = setAt(out, path, next)
        updated.push(path)
      }
    }
  }
  return { values: out as T, updated: [...new Set(updated)].sort() }
}
