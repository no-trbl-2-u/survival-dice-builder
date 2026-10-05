import { defaultContent } from './content.ts'

const isGroup = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)

/**
 * Fills the keys a config does not have from the default config, group by group (lists are
 * values, not groups). A config saved before a release that added options (phase 22) then still
 * parses, with every new option at its default (off). Keys the config has are kept as they are,
 * so a wrong value still fails the schema.
 *
 * @param raw - a parsed config JSON (any value).
 * @param defaults - the config to fill from (normally the default config).
 * @returns the filled value; a non-object `raw` is returned unchanged.
 */
export function withConfigDefaults(
  raw: unknown,
  defaults: unknown = defaultContent.config,
): unknown {
  if (!isGroup(raw) || !isGroup(defaults)) return raw
  const out: Record<string, unknown> = { ...raw }
  for (const [key, value] of Object.entries(defaults)) {
    out[key] = key in raw ? withConfigDefaults(raw[key], value) : value
  }
  return out
}
