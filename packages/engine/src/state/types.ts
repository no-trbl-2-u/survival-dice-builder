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
} from '@survival/content'
import type { GameEvent } from '../events/events.ts'
import type { Axial } from '../hex.ts'

/** Round phases. `setup` holds the setup tile choice before round 1. @rule 4, 5.1, 14 */
export type Phase = 'setup' | 'prepare' | 'combat' | 'explore' | 'ended'

/** One hex on the map, copied from the tile that holds it. @rule 3.3, 3.5 */
export type MapHex = Readonly<{ terrain: Terrain; site: Site | null; tile: string }>

/** A tile placed on the map, by its center hex. @rule 3.1, 4.1, 4.2, 10.1 */
export type PlacedTile = Readonly<{ tile: string; center: Axial }>

/** The board. `hexes` is keyed by `hexKey` ("q,r"). @rule 3 */
export type GameMap = Readonly<{
  tiles: readonly PlacedTile[]
  hexes: Readonly<Record<string, MapHex>>
}>

/** A Barricade or Tower on the map. @rule 12 */
export type Defense = Readonly<{ id: string; kind: string; hex: Axial; health: number }>

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

/** An enemy on the board. @rule 9, 3.7 */
export type Enemy = Readonly<{ id: string; kind: string; health: number; hex: Axial }>

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

/** The content the engine needs, copied into the state so a run replays from the state alone. */
export type EngineContent = Readonly<{
  cards: readonly CardDef[]
  skills: readonly SkillDef[]
  enemies: EnemiesFile
  defenses: readonly DefenseDef[]
  tiles: readonly TileDef[]
}>

/**
 * The whole game. Plain immutable data: every engine function returns a new state.
 *
 * @rule 4, 5
 */
export type GameState = Readonly<{
  version: 1
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
  /** Tiles not yet placed, top first. @rule 4.2, 4.3 */
  tileDeck: readonly string[]
  /** Tiles drawn and waiting for the player to choose their slot (4.2 setup, 10.1 Explore). */
  revealed: readonly string[]
  enemies: readonly Enemy[]
  nextEnemyId: number
  defenses: readonly Defense[]
  nextDefenseId: number
  active: ActiveEffect | null
  base: Readonly<{ health: number; maxHealth: number }>
  exchange: Exchange | null
  /** The last events, trimmed to `LOG_LIMIT`. */
  log: readonly GameEvent[]
  endedBecause: 'base' | 'player' | null
}>

/** How many events `GameState.log` keeps. */
export const LOG_LIMIT = 200
