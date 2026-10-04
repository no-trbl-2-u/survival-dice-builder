import meta from '../data/config.meta.json' with { type: 'json' }
import { defaultContent } from './content.ts'
import { GameConfigSchema, type GameConfig } from './schemas/config.ts'
import { ConfigMetaSchema, type ConfigMeta, type ConfigMetaEntry } from './schemas/configMeta.ts'

/** A config path and its kind: a group (object), or a field (anything else, lists included). */
export type ConfigMetaPath = Readonly<{ path: string; group: boolean }>

/**
 * Every group and field path of a config, in order (`player`, `player.maxHealth`, ...). Lists
 * are fields: their items have no entries of their own.
 *
 * @param config - the config to walk (normally the default config).
 */
export function configMetaPaths(config: GameConfig): ConfigMetaPath[] {
  const walk = (value: unknown, prefix: string[]): ConfigMetaPath[] =>
    Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
      const path = [...prefix, key]
      const group = child !== null && typeof child === 'object' && !Array.isArray(child)
      return [{ path: path.join('.'), group }, ...(group ? walk(child, path) : [])]
    })
  return walk(config, [])
}

/** The select values of each enum field in the config schema, keyed by dotted path. */
function enumValues(): Map<string, readonly string[]> {
  type Node = { def: { type: string }; shape?: Record<string, Node>; options?: string[] }
  const found = new Map<string, readonly string[]>()
  const walk = (node: Node, prefix: string[]) => {
    if (node.def.type === 'enum' && node.options) found.set(prefix.join('.'), node.options)
    for (const [key, child] of Object.entries(node.shape ?? {})) walk(child, [...prefix, key])
  }
  walk(GameConfigSchema as unknown as Node, [])
  return found
}

/**
 * Every gap between the metadata and the config: a path with no entry, an entry for no path, a
 * field with no help or rules section, and a select value with no phrase.
 *
 * @param metadata - the parsed `config.meta.json`.
 * @param config - the config it describes (normally the default config).
 */
export function configMetaProblems(metadata: ConfigMeta, config: GameConfig): string[] {
  const paths = configMetaPaths(config)
  const known = new Set(paths.map((p) => p.path))
  const problems: string[] = []
  for (const { path, group } of paths) {
    const entry = metadata[path]
    if (!entry) problems.push(`${path}: no entry`)
    else if (!group && (!entry.help || !entry.rule)) problems.push(`${path}: no help or rule`)
  }
  for (const path of Object.keys(metadata)) {
    if (!known.has(path)) problems.push(`${path}: not a config path`)
  }
  for (const [path, values] of enumValues()) {
    const options = metadata[path]?.options ?? {}
    for (const v of values) if (!options[v]) problems.push(`${path}: no phrase for "${v}"`)
  }
  return problems
}

/** Validates `config.meta.json` against the default config; throws with every problem. */
function loadMeta(): ConfigMeta {
  const parsed = ConfigMetaSchema.safeParse(meta)
  if (!parsed.success) {
    throw new Error(`Invalid config.meta.json:\n${parsed.error.message}`)
  }
  const problems = configMetaProblems(parsed.data, defaultContent.config)
  if (problems.length > 0) {
    throw new Error(`Invalid config.meta.json:\n${problems.map((p) => `  - ${p}`).join('\n')}`)
  }
  return parsed.data
}

/** The validated config metadata: label, help, and rules section of every config path. */
export const defaultConfigMeta: ConfigMeta = loadMeta()

/**
 * The entry for a config path. A path inside a list (`deck.presets.0.cards`) gets the entry of
 * the nearest path above it that has one.
 *
 * @param path - a dotted path or a path array.
 * @param metadata - the metadata to read (normally the default).
 */
export function metaFor(
  path: string | readonly (string | number)[],
  metadata: ConfigMeta = defaultConfigMeta,
): Readonly<{ path: string; entry: ConfigMetaEntry }> | null {
  const parts = typeof path === 'string' ? path.split('.') : path.map(String)
  for (let n = parts.length; n > 0; n--) {
    const key = parts.slice(0, n).join('.')
    const entry = metadata[key]
    if (entry) return { path: key, entry }
  }
  return null
}
