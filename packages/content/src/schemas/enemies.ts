import { z } from 'zod'
import { FaceSchema, IdSchema, NonNegativeInt, PositiveInt } from './primitives.ts'

/**
 * How an enemy attacks: a fixed amount (grunt) or a number of action dice read on the enemy
 * die table (elite).
 *
 * @rule 9.5, 9.6
 */
export const EnemyAttackSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('fixed'), damage: PositiveInt }),
  z.object({ kind: z.literal('dice'), dice: PositiveInt }),
])
export type EnemyAttack = z.infer<typeof EnemyAttackSchema>

/** An enemy type. @rule Table 5 */
export const EnemyDefSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  health: PositiveInt,
  attack: EnemyAttackSchema,
  experience: NonNegativeInt,
  currency: NonNegativeInt,
})
export type EnemyDef = z.infer<typeof EnemyDefSchema>

/** `enemies.json`: enemy types plus the damage of each face on an enemy die (Table 4). */
export const EnemiesFileSchema = z
  .object({
    enemies: z.array(EnemyDefSchema).min(1),
    enemyDieDamage: z.record(FaceSchema, NonNegativeInt),
  })
  .refine((f) => FaceSchema.options.every((face) => face in f.enemyDieDamage), {
    message: 'enemyDieDamage must give a value for all 6 faces',
    path: ['enemyDieDamage'],
  })
export type EnemiesFile = z.infer<typeof EnemiesFileSchema>
