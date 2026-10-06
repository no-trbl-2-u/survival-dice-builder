import { z } from 'zod'
import { CombatEffectSchema, CombatOptionSchema, PrepareEffectSchema } from './effects.ts'
import { IdSchema, LevelSchema, NonNegativeInt, PositiveInt } from './primitives.ts'

/**
 * A card: a top half (Prepare) and an upside-down bottom half (Combat).
 * Starter cards have `level: 0` and `cost: 0`; supply cards have level 1-3 and a currency cost.
 *
 * @rule 2.6, 2.7, Table 2, Table 8
 */
export const CardDefSchema = z
  .object({
    id: IdSchema,
    name: z.string().min(1),
    level: z.union([z.literal(0), LevelSchema]),
    cost: NonNegativeInt,
    top: PrepareEffectSchema,
    bottom: z.array(CombatEffectSchema).min(1, 'must have at least 1 Combat effect'),
    /** Combat v3: the options of the Combat side (play 1). Used when `combat.model` is "engage". */
    combat: z.array(CombatOptionSchema).min(1).optional(),
  })
  .refine((c) => (c.level === 0) === (c.cost === 0), {
    message: 'starter cards (level 0) cost 0; supply cards cost currency',
    path: ['cost'],
  })
export type CardDef = z.infer<typeof CardDefSchema>

/** The starter deck: card ids with quantities. @rule 4.8, Table 2 */
export const DeckEntrySchema = z.object({ card: IdSchema, quantity: PositiveInt })
export type DeckEntry = z.infer<typeof DeckEntrySchema>

/** `cards.json`. */
export const CardsFileSchema = z.object({ cards: z.array(CardDefSchema).min(1) })
export type CardsFile = z.infer<typeof CardsFileSchema>
