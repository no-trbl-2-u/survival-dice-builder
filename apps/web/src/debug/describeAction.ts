import type { Action, Axial, GameState } from '@survival/engine'
import { baseHex, hexName, stepsAway } from '../map/places.ts'

/** The printed name of a card instance in the current player's hand. */
function cardName(state: GameState, cardId: string): string {
  const player = state.players[state.current]
  const def = player?.hand.find((c) => c.id === cardId)?.def
  return state.content.cards.find((c) => c.id === def)?.name ?? cardId
}

function skillName(state: GameState, id: string): string {
  return state.content.skills.find((s) => s.id === id)?.name ?? id
}

/** An enemy by kind and id ("grunt e1"; game terms stay lowercase, as in the rules). */
function enemyName(state: GameState, id: string): string {
  const kind = state.enemies.find((e) => e.id === id)?.kind
  return kind ? `${kind} ${id}` : id
}

/** Where the current player stands. */
function here(state: GameState): Axial {
  return state.players[state.current]?.hex ?? { q: 0, r: 0 }
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
      return `Discard ${cardName(state, action.card)}`
    case 'toggleKeep':
      return `${state.exchange?.dice[action.die]?.kept ? 'Release' : 'Keep'} ${dieLabel(state, action.die)}`
    case 'roll':
      return `Roll again (roll ${(state.exchange?.rollsUsed ?? 0) + 1} of ${state.config.combat.maxRolls})`
    case 'stopRolling':
      return 'Stop rolling'
    case 'rerollDie':
      return `Reroll ${dieLabel(state, action.die)}`
    case 'endReroll':
      return 'Stop rerolling'
    case 'assignDie':
      return `Put ${dieLabel(state, action.die)} on ${skillName(state, action.skill)} as ${action.asFace}${action.use > 0 ? ` (use ${action.use + 1})` : ''}`
    case 'unassignDie':
      return `Take back ${dieLabel(state, action.die)}`
    case 'confirmAssignment':
      return 'Confirm dice and fire Skills'
    case 'chooseTarget': {
      const enemy = state.enemies.find((e) => e.id === action.enemy)
      const max = state.content.enemies.enemies.find((x) => x.id === enemy?.kind)?.health
      return `Target ${enemyName(state, action.enemy)}${enemy ? `, ${enemy.health} of ${max ?? enemy.health} health` : ''}`
    }
    case 'placeTile': {
      const tile = state.content.tiles.find((t) => t.id === state.revealed[0])
      const away = stepsAway(baseHex(state), action)
      return `Place ${tile?.name ?? 'the tile'} ${away === 'here' ? 'at the base' : `${away} of the base`}`
    }
    case 'moveTo': {
      const enemy = state.enemies.find((e) => e.hex.q === action.q && e.hex.r === action.r)
      const where = `${hexName(state, action)}, ${stepsAway(here(state), action)}`
      return `Move to ${where}${enemy ? `: skirmish ${enemyName(state, enemy.id)}` : ''}`
    }
    case 'stopMoving':
      return 'Stop moving'
    case 'build': {
      const name = state.content.defenses.find((d) => d.id === action.defense)?.name
      return `Build ${name ?? action.defense} on ${hexName(state, action)}, ${stepsAway(here(state), action)}`
    }
    case 'stopBuilding':
      return 'Stop building'
    case 'revealTile':
      return `Reveal ${state.tileDeck[0] ?? 'a tile'}`
    case 'skipReveal':
      return 'Skip the reveal'
    case 'buyCard': {
      const def = state.content.cards.find((c) => c.id === action.card)
      return `Buy ${def?.name ?? action.card} (${def?.cost ?? '?'} currency)`
    }
    case 'returnStarter': {
      const player = state.players[state.current]
      const def = [...(player?.deck ?? []), ...(player?.discard ?? [])].find(
        (c) => c.id === action.card,
      )?.def
      const name = state.content.cards.find((c) => c.id === def)?.name ?? action.card
      return `Return starter ${name} [${action.card}]`
    }
    case 'buyUpgrade': {
      const def = state.content.upgrades.find((u) => u.id === action.upgrade)
      return `Buy upgrade ${def?.name ?? action.upgrade}`
    }
    case 'draftSkill':
      return `Draft ${skillName(state, action.skill)}`
    case 'replaceSkill':
      return `Replace ${skillName(state, action.skill)}`
  }
}

/**
 * The map hex an action points at, for a muted coordinate suffix next to its label.
 *
 * @param action - a legal action.
 * @returns the hex, or null when the action is not about a place on the map.
 */
export function actionHex(action: Action): Axial | null {
  switch (action.type) {
    case 'placeTile':
    case 'moveTo':
    case 'build':
      return { q: action.q, r: action.r }
    default:
      return null
  }
}
