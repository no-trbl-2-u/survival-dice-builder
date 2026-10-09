import { z } from 'zod'
import { DeckEntrySchema } from './cards.ts'
import { IdSchema, NonNegativeInt, PositiveInt } from './primitives.ts'

/**
 * Every number in the rules, every section 18 option, and every designer-ruling flag from
 * `OPEN-QUESTIONS.md`. The engine reads rule values only from here.
 *
 * @rule 2, 4, 7, 8, 9, 10, 11, 12, 15, 16, 18, OPEN-QUESTIONS rows 1-15, 17, 63-70
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
    /** Row 65: an enemy attacks every exchange, or once per Combat (then it is tipped over). */
    enemyAttacks: z.enum(['every-exchange', 'once-per-combat']),
    /** Row 69: only enemies that target the player attack it, or every adjacent enemy does. */
    adjacentAttack: z.enum(['target-only', 'any-adjacent']),
    /**
     * Combat v3 (docs/design/combat-v3.md): "exchange" is Spec v1 7.8; "engage" plays Combat as
     * engagements, each opened by an Engage card option, with enemy dice rolled back at you and
     * a siege step instead of enemy attacks. Engagements are the default (designer 2026-10-09);
     * a stored config without the key gets them.
     */
    model: z.enum(['exchange', 'engage']).default('engage'),
    /** Combat v3 numbers (used only when `model` is "engage"). */
    engage: z
      .object({
        /** The 6 faces of an enemy die. */
        enemyDie: z.array(z.enum(['hit', 'miss', 'special'])).length(6),
        /** Damage of a Hit face. */
        hitDamage: NonNegativeInt,
        /** Damage of a Special face (placeholder until each grunt type has its own). */
        specialDamage: NonNegativeInt,
        /** Enemy dice an elite rolls when it is engaged or adjacent. */
        eliteDice: PositiveInt,
        /** Siege: damage each enemy next to a structure deals at the end of Combat. */
        siegeDamage: NonNegativeInt,
        /** Siege damage of an elite (placeholder for its special siege rule). */
        eliteSiegeDamage: NonNegativeInt,
        /**
         * Designer 2026-10-09: "hit" (the rule) — every enemy die rolled hits at the end of the
         * engagement, even the dice of an enemy defeated during it; "cancelled" (experiment) —
         * a defeated enemy's dice do not hit.
         */
        defeatedDice: z.enum(['hit', 'cancelled']).default('hit'),
      })
      .default({
        enemyDie: ['hit', 'hit', 'miss', 'miss', 'miss', 'special'],
        hitDamage: 1,
        specialDamage: 2,
        eliteDice: 2,
        siegeDamage: 1,
        eliteSiegeDamage: 3,
        defeatedDice: 'hit',
      }),
  }),
  experience: z.object({
    firstStep: PositiveInt,
    stepIncrease: NonNegativeInt,
    /** Row 17: extra experience for defeating an elite. */
    eliteBonus: NonNegativeInt,
    /** Row 17: the level rises by 1 for each elite that spawns, not from experience. */
    levelPerEliteSpawn: z.boolean(),
  }),
  miniatureLimit: PositiveInt,
  /** Row 63: a tile is revealed at round end when none was revealed in this many rounds. */
  clock: z.object({ forcedRevealEvery: PositiveInt.nullable() }),
  /** Spawn pressure and upkeep (rows 64, 66, 68, 70). Null or off = the phase 21 rule. */
  spawn: z.object({
    /** Row 64: each node spawns 1 more enemy every this many rounds. */
    rampEvery: PositiveInt.nullable(),
    /** Row 66: rounds a new tile waits before its nodes spawn. */
    newTileDelay: NonNegativeInt,
    /** Row 68: each node spawns 1 enemy per 2 seats, rounded up. */
    perSeat: z.boolean(),
    /** Row 70: only nodes within this many hexes of a figure or a structure spawn. */
    nodeRange: PositiveInt.nullable(),
  }),
  /** Row 67: materials a Gather gives on a spent node or off any node. */
  gather: z.object({ offNodeAmount: NonNegativeInt }),
  /** A player at 0 health is knocked out and returns at the next round start (core loop v2, row 55). */
  knockout: z.object({ returnHealthDivisor: PositiveInt, loseMaterials: z.boolean() }),
  shop: z.object({ offers: PositiveInt }),
  draft: z.object({
    reveal: PositiveInt,
    keep: PositiveInt,
    everyNRounds: PositiveInt,
    /**
     * Designer 2026-10-09: "pool" — the Skills a player does not keep go to that player's pool,
     * and each later draft offers `reveal` new Skills plus the whole pool; "supply" — they go
     * to the bottom of their supply (11.7).
     */
    unpicked: z.enum(['pool', 'supply']).default('pool'),
  }),
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
    /** Hexes nearer a player must be than the nearest structure to draw an enemy (row 56). */
    playerPullDistance: NonNegativeInt,
  }),
})
export type GameConfig = z.infer<typeof GameConfigSchema>
