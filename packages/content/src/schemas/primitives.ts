import { z } from 'zod'

/**
 * The 6 action-die faces. Star is wild; Blank has no effect.
 *
 * @rule 2.3, 2.4, 2.5
 */
export const FaceSchema = z.enum(['Sword', 'Wand', 'Bow', 'Shield', 'Star', 'Blank'])
export type Face = z.infer<typeof FaceSchema>

/** Faces a Skill can require. Star and Blank are never a requirement. @rule 2.4, 2.5 */
export const SkillFaceSchema = z.enum(['Sword', 'Wand', 'Bow', 'Shield'])
export type SkillFace = z.infer<typeof SkillFaceSchema>

/** Content level of a supply card or Skill. @rule 2.2 */
export const LevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)])
export type Level = z.infer<typeof LevelSchema>

/** A stable, kebab-case content id (`"aimed-shot"`). */
export const IdSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be a kebab-case id like "aimed-shot"')

/** A positive whole number. */
export const PositiveInt = z.number().int().positive()
/** A whole number of 0 or more. */
export const NonNegativeInt = z.number().int().nonnegative()
