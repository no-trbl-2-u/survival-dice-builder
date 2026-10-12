import { GameConfigSchema, type GameConfig } from '@survival/content'

/** One option: an OPEN-QUESTIONS row, the dotted config path it sets, and the value. */
export type ConfigOption = Readonly<{ row: number; path: string; value: unknown }>

/** A named set of options a batch can play with (phase 38). */
export type OptionSet = Readonly<{ name: string; about: string; options: readonly ConfigOption[] }>

/**
 * The option sets: measurement tools, not rules, and never defaults. Rows 65 and 69 are
 * "Exchanges only" (phase 37) and row 68 is "keep off" (phase 22), so they are in neither set.
 */
export const OPTION_SETS: Readonly<Record<'rec' | 'exp', OptionSet>> = {
  rec: {
    name: 'rec',
    about: 'the rows 63-70 options phase 22 recommends that act under engagements',
    options: [
      { row: 63, path: 'clock.forcedRevealEvery', value: 3 },
      { row: 66, path: 'spawn.newTileDelay', value: 1 },
      { row: 67, path: 'gather.offNodeAmount', value: 1 },
    ],
  },
  exp: {
    name: 'exp',
    about: 'the rows 63-70 options phase 22 left for a playtest that act under engagements',
    options: [
      { row: 64, path: 'spawn.rampEvery', value: 4 },
      { row: 70, path: 'spawn.nodeRange', value: 4 },
    ],
  },
}

/** The option set called `name`, or undefined. */
export function optionSet(name: string): OptionSet | undefined {
  return name === 'rec' || name === 'exp' ? OPTION_SETS[name] : undefined
}

/** The value at a dotted path, or undefined when the path is not there. */
export function getPath(config: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (node, key) =>
        node !== null && typeof node === 'object' && key in node
          ? (node as Record<string, unknown>)[key]
          : undefined,
      config,
    )
}

/** A copy of `node` with `value` at `keys`; every key but the last must already exist. */
function setIn(node: unknown, keys: readonly string[], value: unknown, path: string): unknown {
  const [key, ...rest] = keys
  if (key === undefined) return value
  if (node === null || typeof node !== 'object' || Array.isArray(node) || !(key in node))
    throw new Error(`${path} is not a config key`)
  const record = node as Record<string, unknown>
  return { ...record, [key]: setIn(record[key], rest, value, path) }
}

/**
 * A copy of the config with `value` at the dotted `path`, checked against the config schema.
 * Throws on a path the config does not have or a value the schema rejects.
 */
export function setPath(config: GameConfig, path: string, value: unknown): GameConfig {
  const next = GameConfigSchema.safeParse(setIn(config, path.split('.'), value, path))
  if (!next.success) throw new Error(`${path}=${JSON.stringify(value)}: ${next.error.message}`)
  return next.data
}

/** The config with every option of the set applied. */
export function applyOptions(config: GameConfig, set: OptionSet): GameConfig {
  return set.options.reduce((c, o) => setPath(c, o.path, o.value), config)
}

/** A `--set` value as typed: a number, `true`, `false`, `null`, or else the string. */
export function parseValue(text: string): unknown {
  if (text === 'true') return true
  if (text === 'false') return false
  if (text === 'null') return null
  const n = Number(text)
  return text.trim() !== '' && Number.isFinite(n) ? n : text
}
