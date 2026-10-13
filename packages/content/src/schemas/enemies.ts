import { z } from 'zod'
import { IdSchema, NonNegativeInt, PositiveInt } from './primitives.ts'

/**
 * An enemy type. `dice`: the enemy dice (Table 4) it rolls in an engagement next to it; `siege`:
 * the damage it gives a structure in the siege step. An elite's effect is in its numbers (it
 * rolls 1 more die).
 *
 * @rule Spec v2 9.6, Table 5, 7.11
 */
export const EnemyDefSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  health: PositiveInt,
  dice: PositiveInt,
  siege: NonNegativeInt,
  experience: NonNegativeInt,
  currency: NonNegativeInt,
})
export type EnemyDef = z.infer<typeof EnemyDefSchema>

/** `enemies.json`: the enemy types (Table 5). */
export const EnemiesFileSchema = z.object({ enemies: z.array(EnemyDefSchema).min(1) })
export type EnemiesFile = z.infer<typeof EnemiesFileSchema>
