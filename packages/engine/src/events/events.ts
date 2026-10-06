import type { Face, SkillFace } from '@survival/content'
import type { Axial } from '../hex.ts'
import type { EnemyDieRoll, Phase } from '../state/types.ts'

/**
 * Everything the engine resolves appears as an event. Each event names the rule that produced
 * it. The UI animates from events only.
 */
export type GameEvent = Readonly<
  { rule: string } & (
    | { type: 'gameCreated'; seed: number }
    | { type: 'phaseStarted'; phase: Phase; round: number }
    | { type: 'deckShuffled'; player: string; cards: number }
    | { type: 'deckTurned'; player: string; orientation: 'top' | 'bottom' }
    | { type: 'cardsDrawn'; player: string; cards: readonly string[] }
    | { type: 'cardPlayed'; player: string; card: string; half: 'top' | 'bottom' }
    | { type: 'cardDiscarded'; player: string; card: string; unplayed: boolean }
    | { type: 'effectDeferred'; player: string; effect: string; reason: string }
    | { type: 'healed'; player: string; amount: number; health: number }
    | { type: 'guardGained'; player: string; amount: number; guard: number }
    | { type: 'damageBonus'; player: string; amount: number }
    | { type: 'extraDice'; player: string; faces: readonly Face[] }
    | { type: 'diceRolled'; player: string; faces: readonly Face[]; roll: number }
    | { type: 'dieRerolled'; player: string; die: number; face: Face }
    | { type: 'dieKept'; player: string; die: number; kept: boolean }
    | { type: 'dieAssigned'; player: string; die: number; skill: string; asFace: SkillFace }
    | { type: 'dieUnassigned'; player: string; die: number }
    | { type: 'skillFired'; player: string; skill: string }
    | { type: 'enemyDamaged'; enemy: string; amount: number; health: number }
    | { type: 'enemyDefeated'; enemy: string; kind: string; by: string }
    | {
        type: 'enemyAttacked'
        enemy: string
        player: string
        damage: number
        faces?: readonly Face[]
      }
    | { type: 'hitIgnored'; enemy: string; player: string }
    | {
        type: 'engaged'
        player: string
        card: string
        enemyDice: readonly EnemyDieRoll[]
      }
    | { type: 'repaired'; player: string; structure: string; amount: number; health: number }
    | { type: 'playerDamaged'; player: string; toGuard: number; toHealth: number; health: number }
    | { type: 'exchangeEnded'; player: string }
    | { type: 'stepDeferred'; step: string; reason: string }
    | { type: 'tilePlaced'; tile: string; center: Axial }
    | { type: 'enemySpawned'; enemy: string; kind: string; hex: Axial; spilled: boolean }
    | { type: 'moved'; player: string; from: Axial; to: Axial; cost: number; hexesLeft: number }
    | { type: 'skirmishStarted'; player: string; hex: Axial; enemy: string }
    | { type: 'skirmishEnded'; player: string; won: boolean }
    | { type: 'gathered'; player: string; amount: number; materials: number; spent: boolean }
    | { type: 'figurePlaced'; player: string; hex: Axial }
    | { type: 'revealStepBlocked'; player: string; hex: Axial; hexesLeft: number }
    | {
        type: 'defenseBuilt'
        player: string
        defense: string
        kind: string
        hex: Axial
        cost: number
      }
    | { type: 'defenseDamaged'; defense: string; amount: number; health: number }
    | { type: 'defenseRemoved'; defense: string }
    | { type: 'roundAdvanced'; round: number }
    | { type: 'enemyMoved'; enemy: string; from: Axial; to: Axial; target: string | null }
    | { type: 'towerAttacked'; tower: string; enemy: string; damage: number }
    | {
        type: 'structureAttacked'
        enemy: string
        structure: string
        damage: number
        faces?: readonly Face[]
      }
    | { type: 'baseDamaged'; amount: number; health: number }
    | { type: 'eliteReplaced'; grunt: string; elite: string; hex: Axial }
    | { type: 'tileRevealed'; tile: string }
    | { type: 'experienceGained'; amount: number; experience: number }
    | { type: 'levelReached'; level: number }
    | { type: 'diceGained'; player: string; dice: number }
    | { type: 'currencyGained'; player: string; amount: number; currency: number }
    | { type: 'upgradeBought'; player: string; upgrade: string; cost: number; baseHealth: number }
    | { type: 'offerAdded'; card: string; level: string }
    | { type: 'cardBought'; player: string; card: string; instance: string; cost: number }
    | { type: 'starterReturned'; player: string; card: string }
    | { type: 'draftStarted'; player: string; level: string; options: readonly string[] }
    | { type: 'skillDrafted'; player: string; skill: string }
    | { type: 'draftSkipped'; player: string }
    | { type: 'skillToSupply'; skill: string; level: string }
    | { type: 'skillReplaced'; player: string; skill: string }
    | { type: 'milestoneReached'; milestone: string; round: number }
    | { type: 'playerKnockedOut'; player: string; materialsLost: number }
    | { type: 'playerReturned'; player: string; health: number }
    | { type: 'returnDelayed'; player: string }
    | { type: 'runEnded'; because: 'base'; round: number }
  )
>

/** Event type names. */
export type GameEventType = GameEvent['type']
