import { z } from 'zod'
import { NonNegativeInt, PositiveInt } from './primitives.ts'

/**
 * Top-half (Prepare) card effects. Content describes them; the engine interprets them.
 *
 * - `move`: move up to `hexes`. `ignoreEnemyCost` skips the 6.9 surcharge (Blink).
 * - `gather`: take `amount` materials from the gathering node, which is then spent (core loop
 *   v2; Haul "Gather +2" = amount 2, OPEN-QUESTIONS row 20).
 * - `build`: 1 upgrade on the base or 1 defense elsewhere; `costReduction` lowers the material
 *   cost, `times` builds more than once (Architect).
 * - `rest`: heal `amount`.
 *
 * @rule 6.7, Table 2, Table 8
 */
export const PrepareEffectSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('move'),
    hexes: PositiveInt,
    ignoreEnemyCost: z.boolean().default(false),
  }),
  z.object({ kind: z.literal('gather'), amount: PositiveInt }),
  z.object({
    kind: z.literal('build'),
    costReduction: NonNegativeInt.default(0),
    times: PositiveInt.default(1),
  }),
  z.object({ kind: z.literal('rest'), amount: PositiveInt }),
])
export type PrepareEffect = z.infer<typeof PrepareEffectSchema>

/**
 * Bottom-half (Combat) card effects, one or more per card half.
 *
 * - `reroll`: reroll `dice` dice (a number, or `"all"`).
 * - `damage`: add `amount` damage to this exchange.
 * - `guard`: gain `amount` guard.
 * - `heal`: heal `amount`.
 * - `extraDie`: roll `dice` more dice in this exchange only.
 *
 * @rule 7.8, Table 2, Table 8
 */
export const CombatEffectSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('reroll'), dice: z.union([PositiveInt, z.literal('all')]) }),
  z.object({ kind: z.literal('damage'), amount: PositiveInt }),
  z.object({ kind: z.literal('guard'), amount: PositiveInt }),
  z.object({ kind: z.literal('heal'), amount: PositiveInt }),
  z.object({ kind: z.literal('extraDie'), dice: PositiveInt }),
])
export type CombatEffect = z.infer<typeof CombatEffectSchema>

/**
 * Skill effects.
 *
 * - `damage`: `amount` damage at `range`, to one enemy or to each enemy in range.
 * - `guard`: gain `amount` guard. `heal`: heal `amount`.
 * - `ignoreHit`: ignore `hits` enemy hits this exchange (Dodge).
 *
 * @rule Table 3, Table 9
 */
export const SkillEffectSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('damage'),
    amount: PositiveInt,
    range: PositiveInt,
    target: z.enum(['one', 'each']),
  }),
  z.object({ kind: z.literal('guard'), amount: PositiveInt }),
  z.object({ kind: z.literal('heal'), amount: PositiveInt }),
  z.object({ kind: z.literal('ignoreHit'), hits: PositiveInt }),
])
export type SkillEffect = z.infer<typeof SkillEffectSchema>
