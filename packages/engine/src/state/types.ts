import type {
  CardDef,
  DefenseDef,
  EnemiesFile,
  Face,
  GameConfig,
  Site,
  SkillDef,
  SkillFace,
  Terrain,
  TileDef,
  UpgradeDef,
} from '@survival/content'
import type { GameEvent } from '../events/events.ts'
import type { Axial } from '../hex.ts'

/**
 * Round phases. `setup` holds the start-hex choices before round 1. There is no Explore phase
 * (core loop v2): the round is Prepare, then Combat.
 *
 * @rule 4, 5.1, 14, core loop v2
 */
export type Phase = 'setup' | 'prepare' | 'combat' | 'ended'

/** One hex on the map, copied from the tile that holds it. @rule 3.3, 3.5 */
export type MapHex = Readonly<{ terrain: Terrain; site: Site | null; tile: string }>

/**
 * A tile placed on the map, by its center hex, and the round it was revealed (0 for the Base
 * tile at setup). `spawn.newTileDelay` reads the round (row 66).
 *
 * @rule 3.1, 4.1, 4.2, 10.1, core loop v2 row 66
 */
export type PlacedTile = Readonly<{ tile: string; center: Axial; revealedRound: number }>

/** The board. `hexes` is keyed by `hexKey` ("q,r"). @rule 3 */
export type GameMap = Readonly<{
  tiles: readonly PlacedTile[]
  hexes: Readonly<Record<string, MapHex>>
}>

/** A Barricade or Tower on the map, and the player who built it (rows 35, 40). @rule 12 */
export type Defense = Readonly<{
  id: string
  kind: string
  hex: Axial
  health: number
  builder: string
}>

/**
 * The top-half effect being resolved one step at a time (Prepare): a Move with hexes left, or
 * a Build with builds left.
 *
 * @rule 6.7
 */
export type ActiveEffect = Readonly<
  | { kind: 'move'; hexesLeft: number; ignoreEnemyCost: boolean }
  | { kind: 'build'; buildsLeft: number; costReduction: number }
>

/** Which card half is up. Prepare reads the top half; Combat reads the bottom half. @rule 2.6, 2.7, 7.2, 10.6 */
export type Orientation = 'top' | 'bottom'

/** One physical card: a unique instance id and the card definition it prints. */
export type CardInstance = Readonly<{ id: string; def: string }>

/** One rolled action die in the current exchange. */
export type Die = Readonly<{ face: Face; kept: boolean }>

/**
 * One die placed on one Skill slot. `use` is 0 when each Skill fires once per exchange; with
 * unlimited Skill uses (18.1) a Skill can be filled again as use 1, 2, ...
 * `asFace` is the face the die counts as (a Star counts as the slot's face).
 *
 * @rule 2.4, 7.8 step 6
 */
export type Assignment = Readonly<{
  die: number
  skill: string
  use: number
  slot: number
  asFace: SkillFace
}>

/**
 * An enemy on the board. `attackedThisCombat` is set only with `combat.enemyAttacks:
 * "once-per-combat"`: the enemy has attacked (it is tipped over) and does not attack again until
 * the next Combat start (row 65).
 *
 * @rule 9, 3.7, core loop v2 row 65
 */
export type Enemy = Readonly<{
  id: string
  kind: string
  health: number
  hex: Axial
  attackedThisCombat: boolean
}>

/** A player's board, deck, and tracks. @rule 2.1, 4.6-4.10 */
export type Player = Readonly<{
  id: string
  hex: Axial
  health: number
  maxHealth: number
  dice: number
  skills: readonly string[]
  /** Index 0 is the top of each pile. */
  deck: readonly CardInstance[]
  hand: readonly CardInstance[]
  discard: readonly CardInstance[]
  /** Cards played this exchange, not yet discarded (7.8 step 10). */
  inPlay: readonly CardInstance[]
  orientation: Orientation
  guard: number
  materials: number
  currency: number
  /**
   * At 0 health the player is knocked out: the figure is off the map until it returns at the
   * next round start (core loop v2, OPEN-QUESTIONS row 55).
   */
  knockedOut: boolean
}>

/** A Skill effect waiting to resolve after dice are confirmed (7.8 step 7). */
export type QueuedEffect = Readonly<{ skill: string; use: number; bonusDamage: number }>

/**
 * The Combat exchange in progress (7.8). `step` names the decision the engine waits for.
 *
 * - `roll`: keep dice and roll again, or stop (steps 2-4).
 * - `cards`: play or discard the bottom half of each card in hand (step 5).
 * - `reroll`: choose dice for a card's reroll effect (step 5).
 * - `assign`: put dice on Skills (step 6).
 * - `targets`: choose the target of a single-target damage Skill (step 7).
 *
 * @rule 7.8
 */
export type Exchange = Readonly<{
  step: 'roll' | 'cards' | 'reroll' | 'assign' | 'targets'
  dice: readonly Die[]
  rollsUsed: number
  rerollsLeft: number
  /** Dice already rerolled by the current numbered reroll effect: each die at most once. */
  rerolled: readonly number[]
  bonusDamage: number
  ignoreHits: number
  assignments: readonly Assignment[]
  queue: readonly QueuedEffect[]
  /** Set when this is a skirmish (6.10-6.14): the enemy hex entered and the hex left. */
  skirmish: Readonly<{ hex: Axial; from: Axial }> | null
}>

/** Card and Skill supplies by level, top first. @rule 4.12 */
export type Supplies = Readonly<{
  cards: Readonly<Record<string, readonly string[]>>
  skills: Readonly<Record<string, readonly string[]>>
}>

/**
 * A Skill draft in progress: the revealed Skills, and the kept one while the player picks a
 * drafted Skill to replace (full slots, 11.9).
 *
 * @rule 11.6-11.9
 */
export type Draft = Readonly<{
  player: string
  level: string
  options: readonly string[]
  kept: string | null
}>

/**
 * Run counters for the milestones, the forced reveal (row 63), and the sim reports.
 *
 * @rule 17, core loop v2 row 63
 */
export type Progress = Readonly<{
  elitesDefeated: number
  firedSkills: readonly string[]
  tilesRevealed: number
  cardsBought: number
  /** The round of the last tile reveal (0: none yet). `clock.forcedRevealEvery` reads it. */
  lastRevealRound: number
  /** The round the miniature limit first turned a grunt into an elite, or null. */
  capReachedRound: number | null
}>

/** The content the engine needs, copied into the state so a run replays from the state alone. */
export type EngineContent = Readonly<{
  cards: readonly CardDef[]
  skills: readonly SkillDef[]
  enemies: EnemiesFile
  defenses: readonly DefenseDef[]
  tiles: readonly TileDef[]
  upgrades: readonly UpgradeDef[]
}>

/**
 * The whole game. Plain immutable data: every engine function returns a new state.
 *
 * @rule 4, 5
 */
export type GameState = Readonly<{
  version: 4
  seed: number
  config: GameConfig
  content: EngineContent
  /** mulberry32 state (uint32). The engine's only source of randomness. */
  rng: number
  round: number
  phase: Phase
  players: readonly Player[]
  /** Index of the player whose decision it is. */
  current: number
  map: GameMap
  /** Tiles not yet placed, top first: countryside on top of core. @rule 4.3, core loop v2 */
  tileDeck: readonly string[]
  /**
   * Players (ids, seat order) who have not put their figure on a Base tile hex yet: at setup, and
   * at a round start for a knocked-out player who returns. @rule 4.6, 3.8, core loop v2
   */
  unplaced: readonly string[]
  /** Gathering nodes already used: each node gives materials once. @rule 6.7, core loop v2 */
  spentNodes: readonly Axial[]
  enemies: readonly Enemy[]
  nextEnemyId: number
  defenses: readonly Defense[]
  nextDefenseId: number
  active: ActiveEffect | null
  base: Readonly<{ health: number; maxHealth: number }>
  /**
   * Towers (ids, oldest first) still to attack at this Combat start. The head waits for its
   * builder's choice when 2 or more enemies are equally near (row 35). @rule 7.6, 12.3
   */
  towerQueue: readonly string[]
  exchange: Exchange | null
  /** Shared experience track and level. @rule 8.1, 8.3, 16.2 */
  experience: number
  level: number
  /** Bought base upgrade ids, in purchase order. @rule 11.2, 11.4 */
  upgrades: readonly string[]
  /** Card and Skill supplies by level ("1", "2", "3"), top first. @rule 4.12 */
  supplies: Supplies
  /** The Shop's offers (card definition ids). Empty while the Shop is closed. @rule 11.5 */
  shopOffers: readonly string[]
  /** Next bought card instance number (`c<n>`). */
  nextCardId: number
  /** Replace-starter mode (18.1): the player who must return a starter card, if any. */
  pendingReturn: string | null
  /** The Skill draft in progress (10.8, 11.6-11.9). */
  draft: Draft | null
  /** Players who drafted (or skipped the draft) this round, in seat order. @rule 10.8, 11.6 */
  draftedPlayers: readonly string[]
  /** Combat is over and the end-of-round steps are running (10.6-10.10). @rule 10.6-10.10 */
  roundEnding: boolean
  /** The current player has not drawn yet in this Prepare turn or Combat exchange. @rule 16.4, 16.8 */
  turnFresh: boolean
  /** Counters the milestones read. @rule 17 */
  progress: Progress
  /** Milestones reached, in order. @rule 10.10, 14.3, 17 */
  milestones: readonly string[]
  /** The last events, trimmed to `LOG_LIMIT`. */
  log: readonly GameEvent[]
  endedBecause: 'base' | null
}>

/** How many events `GameState.log` keeps. */
export const LOG_LIMIT = 200
