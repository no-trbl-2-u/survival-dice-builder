import type { GameEvent } from '@survival/engine'

/** The sounds the game makes; each is synthesized (see sound.ts). */
export type Cue =
  | 'roll'
  | 'card'
  | 'hit'
  | 'hurt'
  | 'defeat'
  | 'tower'
  | 'build'
  | 'base'
  | 'tile'
  | 'levelUp'
  | 'end'

/** Each event type's cue; events not listed are silent. */
const CUE: Partial<Record<GameEvent['type'], Cue>> = {
  diceRolled: 'roll',
  dieRerolled: 'roll',
  cardPlayed: 'card',
  cardBought: 'card',
  skillDrafted: 'card',
  enemyDamaged: 'hit',
  playerDamaged: 'hurt',
  enemyDefeated: 'defeat',
  towerAttacked: 'tower',
  defenseBuilt: 'build',
  upgradeBought: 'build',
  baseDamaged: 'base',
  defenseDamaged: 'base',
  tilePlaced: 'tile',
  levelReached: 'levelUp',
  runEnded: 'end',
}

/** The most important cues first: an action plays at most `max` of them. */
const PRIORITY: readonly Cue[] = [
  'end',
  'levelUp',
  'base',
  'hurt',
  'defeat',
  'tower',
  'hit',
  'roll',
  'build',
  'tile',
  'card',
]

/** The cues for one action's events: distinct, most important first, at most `max`. */
export function cuesFor(events: readonly GameEvent[], max = 2): Cue[] {
  const found = new Set(events.map((e) => CUE[e.type]).filter((c): c is Cue => Boolean(c)))
  return PRIORITY.filter((c) => found.has(c)).slice(0, max)
}
