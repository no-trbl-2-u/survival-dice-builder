import { z } from 'zod'
import { SkillEffectSchema } from './effects.ts'
import { IdSchema, LevelSchema, SkillFaceSchema } from './primitives.ts'

/**
 * A Skill: the faces it needs (each die fills 1 slot) and its effect.
 * Starter Skills have `level: 0`.
 *
 * @rule 7.8 step 6-7, Table 3, Table 9
 */
export const SkillDefSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  level: z.union([z.literal(0), LevelSchema]),
  faces: z.array(SkillFaceSchema).min(1, 'must have at least 1 face'),
  effect: SkillEffectSchema,
})
export type SkillDef = z.infer<typeof SkillDefSchema>

/** `skills.json`. */
export const SkillsFileSchema = z.object({ skills: z.array(SkillDefSchema).min(1) })
export type SkillsFile = z.infer<typeof SkillsFileSchema>
