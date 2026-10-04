import { z } from 'zod'

/** Copy for one config path: a group has only a label; a field adds help and its rules section. */
export const ConfigMetaEntrySchema = z.strictObject({
  label: z.string().min(1),
  help: z.string().min(1).optional(),
  /** The rules section (and OPEN-QUESTIONS row) the field sets, for example "6.9". */
  rule: z.string().min(1).optional(),
  /** A plain phrase for each value of a select field. */
  options: z.record(z.string(), z.string().min(1)).optional(),
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
