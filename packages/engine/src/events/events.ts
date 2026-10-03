import type { Face, SkillFace } from '@survival/content'
import type { Phase } from '../state/types.ts'

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
    | { type: 'playerDamaged'; player: string; toGuard: number; toHealth: number; health: number }
    | { type: 'exchangeSkipped'; player: string }
    | { type: 'exchangeEnded'; player: string }
    | { type: 'stepDeferred'; step: string; reason: string }
    | { type: 'roundAdvanced'; round: number }
    | { type: 'runEnded'; because: 'base' | 'player'; round: number }
  )
>

/** Event type names. */
export type GameEventType = GameEvent['type']
