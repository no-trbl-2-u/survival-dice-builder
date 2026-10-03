import type { Action, GameState } from '@survival/engine'

/** The printed name of a card instance in the current player's hand. */
function cardName(state: GameState, cardId: string): string {
  const player = state.players[state.current]
  const def = player?.hand.find((c) => c.id === cardId)?.def
  return state.content.cards.find((c) => c.id === def)?.name ?? cardId
}

function skillName(state: GameState, id: string): string {
  return state.content.skills.find((s) => s.id === id)?.name ?? id
}

/** The face of an exchange die, for labels. */
function dieLabel(state: GameState, die: number): string {
  const face = state.exchange?.dice[die]?.face
  return face ? `die ${die + 1} (${face})` : `die ${die + 1}`
}

/**
 * A short, plain label for an action button. Labels only: the UI never decides a rule.
 *
 * @param action - a legal action.
 * @param state - the state the action applies to (for card, Skill, and die names).
 */
export function describeAction(action: Action, state: GameState): string {
  const half = state.phase === 'prepare' ? 'top' : 'bottom'
  switch (action.type) {
    case 'playCard':
      return `Play ${cardName(state, action.card)} (${half})`
    case 'discardCard':
      return `Discard ${cardName(state, action.card)} unplayed`
    case 'toggleKeep':
      return `${state.exchange?.dice[action.die]?.kept ? 'Release' : 'Keep'} ${dieLabel(state, action.die)}`
    case 'roll':
      return `Roll again (roll ${(state.exchange?.rollsUsed ?? 0) + 1} of ${state.config.combat.maxRolls})`
    case 'stopRolling':
      return 'Stop rolling'
    case 'rerollDie':
      return `Reroll ${dieLabel(state, action.die)}`
    case 'endReroll':
      return 'Finish rerolls'
    case 'assignDie':
      return `Put ${dieLabel(state, action.die)} on ${skillName(state, action.skill)} as ${action.asFace}${action.use > 0 ? ` (use ${action.use + 1})` : ''}`
    case 'unassignDie':
      return `Take back ${dieLabel(state, action.die)}`
    case 'confirmAssignment':
      return 'Confirm dice and fire Skills'
    case 'chooseTarget': {
      const enemy = state.enemies.find((e) => e.id === action.enemy)
      return `Target ${action.enemy}${enemy ? ` (${enemy.kind}, ${enemy.health} health)` : ''}`
    }
  }
}
