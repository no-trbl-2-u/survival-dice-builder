import { z } from 'zod'
import { IdSchema, PositiveInt } from './primitives.ts'

/**
 * A defense token. `blocksEnemies` = Barricade (12, Table 7); `attack` = Tower (12.3).
 *
 * @rule 12, Table 7
 */
export const DefenseDefSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  cost: PositiveInt,
  health: PositiveInt,
  blocksEnemies: z.boolean(),
  attack: z.object({ damage: PositiveInt, range: PositiveInt }).nullable(),
})
export type DefenseDef = z.infer<typeof DefenseDefSchema>

/** `defenses.json`. */
export const DefensesFileSchema = z.object({ defenses: z.array(DefenseDefSchema).min(1) })

/**
 * One step of a base upgrade track. Steps of a track are bought in tier order (11.4).
 * `opensLevel` is the supply level the Shop offers or the Training draft uses from this tier.
 *
 * @rule 11, Table 6
 */
export const UpgradeDefSchema = z.object({
  id: IdSchema,
  track: z.enum(['shop', 'training']),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  name: z.string().min(1),
  cost: PositiveInt,
  opensLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
})
export type UpgradeDef = z.infer<typeof UpgradeDefSchema>

/** `upgrades.json`: each track must list tiers 1, 2, 3 exactly once. */
export const UpgradesFileSchema = z
  .object({ upgrades: z.array(UpgradeDefSchema).min(1) })
  .superRefine((f, ctx) => {
    for (const track of ['shop', 'training'] as const) {
      const tiers = f.upgrades
        .filter((u) => u.track === track)
        .map((u) => u.tier)
        .sort()
      if (tiers.join(',') !== '1,2,3') {
        ctx.addIssue({
          code: 'custom',
          message: `track "${track}" must have tiers 1, 2, 3 exactly once (found ${tiers.join(', ') || 'none'})`,
          path: ['upgrades'],
        })
      }
    }
  })
