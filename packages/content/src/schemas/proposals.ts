import { z } from 'zod'

/** One bot batch: median end round, its middle half, and the runs that hit the sim cap. */
const BatchSchema = z.strictObject({
  median: z.number().int().nonnegative(),
  middle: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
  stalled: z.number().int().nonnegative(),
})

/** One bot's two batches: the standard rules and the rules with the proposal on. */
const BotPairSchema = z.strictObject({ standard: BatchSchema, proposal: BatchSchema })

/**
 * A proposal's measured effect under engagements: the seat count, the runs per batch, and the
 * default and defender bots' batches (`pnpm sim -- compare --configs`).
 */
export const MeasuredSchema = z.strictObject({
  seats: z.number().int().positive(),
  runs: z.number().int().positive(),
  bots: z.strictObject({ default: BotPairSchema, defender: BotPairSchema }),
})
export type Measured = z.infer<typeof MeasuredSchema>
export type Batch = z.infer<typeof BatchSchema>

/**
 * One proposal: an `OPEN-QUESTIONS.md` row's option as a named set of config values a player
 * can try. It changes only the player's local config, never a default.
 *
 * @rule 18.1
 */
export const ProposalSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** The `OPEN-QUESTIONS.md` row the proposal answers. */
  row: z.number().int().positive(),
  label: z.string().min(1),
  about: z.string().min(1),
  /** The config values it sets, by dotted path. */
  options: z.array(z.strictObject({ path: z.string().min(1), value: z.unknown() })).min(1),
  /** The loop's reading of the bot batches: turn on, needs a playtest, or keep off. */
  advice: z.enum(['turn-on', 'playtest', 'keep-off']),
  measured: MeasuredSchema.optional(),
  /** Set when the option acts only under this Combat model (it is not measured under the other). */
  combatModel: z.enum(['engage', 'exchange']).optional(),
})
export type Proposal = z.infer<typeof ProposalSchema>

/** `proposals.json`: the proposals, one per row. */
export const ProposalsFileSchema = z.array(ProposalSchema)
