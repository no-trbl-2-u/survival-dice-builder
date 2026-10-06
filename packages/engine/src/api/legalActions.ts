import { legalBuilds } from '../build/defenses.ts'
import { combatOptions, engageMode } from '../combat/engage.ts'
import { pendingTargets, resolveChoices } from '../combat/resolve.ts'
import { freeBaseHexes } from '../combat/knockout.ts'
import { towerTargets } from '../enemies/structures.ts'
import { legalMoves } from '../movement/move.ts'
import { draftedSkills } from '../progression/draft.ts'
import { legalBuys, onBase, returnableStarters } from '../progression/shop.ts'
import { legalUpgrades } from '../progression/upgrades.ts'
import { isFull, legalPlacements } from '../skills/assign.ts'
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
 * @rule 4.6, 6.2, 6.7-6.15, 6.8, 7.6, 7.8, 10.1, 10.8, 11.2, 11.6-11.9, 12.3, 18.1
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

  if (state.unplaced.includes(player.id)) {
    // 4.6, 3.8, row 16: the figure goes on a free hex of the Base tile (at setup, and when a
    // knocked-out player returns at a round start).
    return freeBaseHexes(state, player.id).map((h): Action => ({
      type: 'placeFigure',
      q: h.q,
      r: h.r,
    }))
  }

  const tower = state.towerQueue[0]
  if (tower) {
    // 12.3, row 35: the Tower's builder chooses between equally near enemies.
    return towerTargets(state, tower).map((e): Action => ({
      type: 'chooseTowerTarget',
      tower,
      enemy: e.id,
    }))
  }

  const exchange = state.exchange
  const active = state.active
  const engage = engageMode(state)
  if (engage && state.phase === 'combat' && !exchange) {
    // Combat v3: a Move option in Combat (never into an enemy: that is an engagement).
    if (active?.kind === 'move') {
      return [
        { type: 'stopMoving' },
        ...legalMoves(state, active.hexesLeft, active.ignoreEnemyCost)
          .filter((m) => !m.skirmish)
          .map((m): Action => ({ type: 'moveTo', q: m.to.q, r: m.to.r })),
      ]
    }
    return engageCardChoices(state)
  }
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
      return exchange.engage ? engagementCardChoices(state) : cardChoices()
    case 'reroll':
      return [
        { type: 'endReroll' },
        ...exchange.dice.flatMap((_, die): Action[] =>
          exchange.rerolled.includes(die) || exchange.assignments.some((a) => a.die === die)
            ? []
            : [{ type: 'rerollDie', die }],
        ),
      ]
    case 'assign': {
      const skills = player.skills.map((id) => skillDef(state, id))
      const unlimited = state.config.options.skillUses === 'unlimited'
      if (exchange.engage) {
        // Combat v3: use the dice 1 at a time (a full Skill fires at once), add cards, or stop.
        const fired = (a: { skill: string; use: number }) =>
          isFull(skillDef(state, a.skill), exchange.assignments, a.use)
        return [
          { type: 'confirmAssignment' },
          ...legalPlacements(exchange.dice, skills, exchange.assignments, unlimited).map(
            (a): Action => ({ type: 'assignDie', ...a }),
          ),
          ...engagementCardChoices(state).filter((a) => a.type === 'playOption'),
          ...exchange.assignments
            .filter((a) => !fired(a))
            .map((a): Action => ({ type: 'unassignDie', die: a.die })),
        ]
      }
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
    case 'resolve':
      return resolveChoices(state).map((c): Action => ({ type: 'resolveSkill', ...c }))
  }
}

/**
 * Combat v3, between engagements: each card's Combat options (Engage anywhere, even with no
 * enemy near; Move, Heal, Repair at once; a reroll only inside an engagement), or discard it.
 *
 * @rule Combat v3
 */
function engageCardChoices(state: GameState): Action[] {
  const player = currentPlayer(state)
  const plays = player.hand.flatMap((c) =>
    combatOptions(state, c.def).flatMap((o, option): Action[] => {
      if (o.kind === 'engage') return [{ type: 'engage', card: c.id, option }]
      return o.kind === 'reroll' ? [] : [{ type: 'playOption', card: c.id, option }]
    }),
  )
  return [...plays, ...player.hand.map((c): Action => ({ type: 'discardCard', card: c.id }))]
}

/**
 * Combat v3, inside an engagement: add cards (their reroll and heal options), or stop adding.
 *
 * @rule Combat v3 (engagement step 5)
 */
function engagementCardChoices(state: GameState): Action[] {
  const player = currentPlayer(state)
  const adds = player.hand.flatMap((c) =>
    combatOptions(state, c.def).flatMap((o, option): Action[] =>
      o.kind === 'reroll' || o.kind === 'heal' ? [{ type: 'playOption', card: c.id, option }] : [],
    ),
  )
  return [{ type: 'endCards' }, ...adds]
}
