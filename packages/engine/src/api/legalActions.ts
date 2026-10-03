import { legalBuilds } from '../build/defenses.ts'
import { pendingTargets } from '../combat/resolve.ts'
import { emptySlots } from '../map/tiles.ts'
import { legalMoves } from '../movement/move.ts'
import { draftedSkills } from '../progression/draft.ts'
import { legalBuys, onBase, returnableStarters } from '../progression/shop.ts'
import { legalUpgrades } from '../progression/upgrades.ts'
import { legalPlacements } from '../skills/assign.ts'
import { currentPlayer, skillDef } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'
import type { Action } from './actions.ts'

/**
 * What the current decision-maker may do now. Empty when the run has ended.
 * The action that moves the game forward comes first, so "take the first legal action"
 * always makes progress (used by the debug console and tests).
 *
 * Buying a card (6.8) is offered at every decision while the figure is on the base; it never
 * comes first. A pending starter return (18.1) or Skill draft (10.8) must be resolved first.
 *
 * @rule 4.2, 6.2, 6.7-6.15, 6.8, 7.8, 10.1, 10.8, 11.2, 11.6-11.9, 18.1
 */
export function legalActions(state: GameState): Action[] {
  if (state.phase === 'ended') return []
  const player = currentPlayer(state)
  if (state.pendingReturn) {
    return returnableStarters(player, state).map((card): Action => ({
      type: 'returnStarter',
      card,
    }))
  }
  const draft = state.draft
  if (draft) {
    return draft.kept
      ? draftedSkills(state, player).map((skill): Action => ({ type: 'replaceSkill', skill }))
      : draft.options.map((skill): Action => ({ type: 'draftSkill', skill }))
  }
  const core = coreActions(state)
  if (core.length === 0) return core
  return [...core, ...legalBuys(state).map((card): Action => ({ type: 'buyCard', card }))]
}

/** The decisions of the current phase and step, before Shop purchases. */
function coreActions(state: GameState): Action[] {
  const player = currentPlayer(state)
  const mayDiscard = !state.config.rulings.mandatoryPlays
  const cardChoices = (): Action[] => [
    ...player.hand.map((c): Action => ({ type: 'playCard', card: c.id })),
    ...(mayDiscard ? player.hand.map((c): Action => ({ type: 'discardCard', card: c.id })) : []),
  ]

  if (state.revealed.length > 0 && (state.phase === 'setup' || state.phase === 'explore')) {
    return emptySlots(state.map).map((h): Action => ({ type: 'placeTile', q: h.q, r: h.r }))
  }
  if (state.phase === 'explore' && state.revealOffer) {
    return [{ type: 'skipReveal' }, { type: 'revealTile' }]
  }

  const exchange = state.exchange
  const active = state.active
  if (state.phase === 'prepare' && !exchange) {
    if (active?.kind === 'move') {
      return [
        { type: 'stopMoving' },
        ...legalMoves(state, active.hexesLeft, active.ignoreEnemyCost).map((m): Action => ({
          type: 'moveTo',
          q: m.to.q,
          r: m.to.r,
        })),
      ]
    }
    if (active?.kind === 'build' && onBase(state)) {
      return [
        { type: 'stopBuilding' },
        ...legalUpgrades(state, active.costReduction).map((u): Action => ({
          type: 'buyUpgrade',
          upgrade: u.upgrade,
        })),
      ]
    }
    if (active?.kind === 'build') {
      return [
        { type: 'stopBuilding' },
        ...legalBuilds(state, active.costReduction).map((b): Action => ({
          type: 'build',
          defense: b.defense,
          q: b.hex.q,
          r: b.hex.r,
        })),
      ]
    }
    return cardChoices()
  }
  if (!exchange) return []
  switch (exchange.step) {
    case 'roll':
      return [
        { type: 'stopRolling' },
        ...(exchange.rollsUsed < state.config.combat.maxRolls ? [{ type: 'roll' } as const] : []),
        ...exchange.dice.map((_, die): Action => ({ type: 'toggleKeep', die })),
      ]
    case 'cards':
      return cardChoices()
    case 'reroll':
      return [
        { type: 'endReroll' },
        ...exchange.dice.flatMap((_, die): Action[] =>
          exchange.rerolled.includes(die) ? [] : [{ type: 'rerollDie', die }],
        ),
      ]
    case 'assign': {
      const skills = player.skills.map((id) => skillDef(state, id))
      const unlimited = state.config.options.skillUses === 'unlimited'
      return [
        { type: 'confirmAssignment' },
        ...legalPlacements(exchange.dice, skills, exchange.assignments, unlimited).map(
          (a): Action => ({ type: 'assignDie', ...a }),
        ),
        ...exchange.assignments.map((a): Action => ({ type: 'unassignDie', die: a.die })),
      ]
    }
    case 'targets':
      return pendingTargets(state).map((e): Action => ({ type: 'chooseTarget', enemy: e.id }))
  }
}
