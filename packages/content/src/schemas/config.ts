import { z } from 'zod'
import { DeckEntrySchema } from './cards.ts'
import { IdSchema, NonNegativeInt, PositiveInt } from './primitives.ts'

/**
 * Every number in the rules, every section 18 option, and every designer-ruling flag from
 * `OPEN-QUESTIONS.md`. The engine reads rule values only from here.
 *
 * @rule 2, 4, 7, 8, 9, 10, 11, 12, 15, 16, 18, OPEN-QUESTIONS rows 1-15
 */
export const GameConfigSchema = z.object({
  players: z.object({ min: PositiveInt, max: PositiveInt }),
  player: z.object({
    maxHealth: PositiveInt,
    startingDice: PositiveInt,
    starterSkills: z.array(IdSchema).min(1),
    draftSlots: NonNegativeInt,
  }),
  deck: z.object({
    /** Section 18.1 starter deck + hand presets; `preset` picks one. */
    preset: IdSchema,
    presets: z
      .array(
        z.object({ id: IdSchema, handSize: PositiveInt, cards: z.array(DeckEntrySchema).min(1) }),
      )
      .min(1),
    /** A deck never has fewer cards than this (core loop v2). */
    minimumSize: PositiveInt,
  }),
  base: z.object({ startingHealth: PositiveInt, healthPerUpgrade: PositiveInt }),
  combat: z.object({
    maxRolls: PositiveInt,
    exchangeRange: PositiveInt,
    enemyMoveHexes: PositiveInt,
    moveCostNextToEnemy: PositiveInt,
  }),
  experience: z.object({ firstStep: PositiveInt, stepIncrease: NonNegativeInt }),
  miniatureLimit: PositiveInt,
  waveTrackStart: NonNegativeInt,
  shop: z.object({ offers: PositiveInt }),
  draft: z.object({ reveal: PositiveInt, keep: PositiveInt, everyNRounds: PositiveInt }),
  supplies: z.object({ copiesPerCard: PositiveInt, copiesPerSkill: PositiveInt }),
  tiles: z.object({
    countryside: PositiveInt,
    core: PositiveInt,
    /** Movement a step off the map edge costs (core loop v2: 1). */
    revealMoveCost: PositiveInt,
  }),
  milestones: z.object({
    surviveRounds: z.array(PositiveInt),
    upgradesBought: PositiveInt,
    tilesRevealed: PositiveInt,
    level: PositiveInt,
    skillFired: IdSchema,
  }),
  /** Section 18.1 configuration options. */
  options: z.object({
    boughtCards: z.enum(['add', 'replace-starter']),
    maxLevel: PositiveInt.nullable(),
    skillUses: z.enum(['once-per-exchange', 'unlimited']),
  }),
  /** Designer rulings and proposed readings (OPEN-QUESTIONS.md). Defaults = the decided reading. */
  rulings: z.object({
    enemiesPerHex: PositiveInt,
    figuresPerHex: PositiveInt,
    blockedPathRule: z.enum(['next-target', 'wait']),
    tileRotation: z.boolean(),
    coopPrepareOrder: z.enum(['alternate-hands', 'full-turn']),
    structureDamage: z.enum(['v1', 'grunt-die']),
    skirmishFail: z.enum(['stay-lose-move', 'stay-keep-move']),
    fullBoardDraft: z.enum(['swap', 'skip']),
    mandatoryPlays: z.boolean(),
    shopTiming: z.enum(['any-time-on-base', 'prepare-only']),
    shopRefill: z.enum(['immediate', 'end-of-turn']),
    healTargets: z.enum(['self', 'any-adjacent']),
    eliteReplacement: z.enum(['nearest-base', 'player-choice']),
    buildOnNode: z.boolean(),
    gatherNeedsNode: z.boolean(),
    targetTieBreak: z.array(z.enum(['player', 'tower', 'barricade', 'base'])).length(4),
  }),
})
export type GameConfig = z.infer<typeof GameConfigSchema>
