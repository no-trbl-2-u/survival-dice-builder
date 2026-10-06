import { z } from 'zod'

/** Copy for one config path: a group has only a label; a field adds help and its rules section. */
export const ConfigMetaEntrySchema = z.strictObject({
  label: z.string().min(1),
  help: z.string().min(1).optional(),
  /** The rules section (and OPEN-QUESTIONS row) the field sets, for example "6.9". */
  rule: z.string().min(1).optional(),
  /** A plain phrase for each value of a select field. */
  options: z.record(z.string(), z.string().min(1)).optional(),
  /** The placeholder of an empty optional number field (default "no maximum"). */
  empty: z.string().min(1).optional(),
  /** The engine never reads this field yet: /config marks it, and changing it changes nothing. */
  unused: z.literal(true).optional(),
  /**
   * A number field's slider bounds on /config, [low, high]. A UI hint only: the schema still
   * decides what is valid, and the number box beside the slider takes any valid value.
   */
  range: z.tuple([z.number().int().nonnegative(), z.number().int().positive()]).optional(),
  /** An id field's choices on /config: the content list (or the deck presets) it names. */
  source: z.enum(['skills', 'cards', 'presets']).optional(),
})
export type ConfigMetaEntry = z.infer<typeof ConfigMetaEntrySchema>

/**
 * `config.meta.json`: the label, help, and rules section of every config path, keyed by the
 * dotted path (`player.maxHealth`). UI copy only; the engine never reads it.
 *
 * @rule 18.1
 */
export const ConfigMetaSchema = z.record(z.string(), ConfigMetaEntrySchema)
export type ConfigMeta = z.infer<typeof ConfigMetaSchema>
