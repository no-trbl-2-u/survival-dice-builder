import { clearTable, drawHand, rotateDeck } from '../deck/deck.ts'
import { rerollUnkept, rollDice } from '../dice/dice.ts'
import { moveEnemies } from '../enemies/movement.ts'
import { refillNodes, waveStep } from '../enemies/spawning.ts'
import { structureAttacks, towerAttacks } from '../enemies/structures.ts'
import type { GameEvent } from '../events/events.ts'
import { startExplore } from '../explore/explore.ts'
import { hexDistance } from '../hex.ts'
import { currentPlayer, handSize, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { GameState } from '../state/types.ts'

/** A guard against an engine bug looping forever. */
const MAX_AUTOMATIC_STEPS = 10_000

/**
 * Resolves automatic steps until the engine needs a decision or the run ends. Every call
 * leaves the state at a decision point (or `ended`).
 *
 * @rule 5, 6, 7, 10
 */
export function advance(state: GameState): Step {
  let current = state
  const events: GameEvent[] = []
  for (let guard = 0; guard < MAX_AUTOMATIC_STEPS; guard++) {
    const [next, more, waiting] = stepOnce(current)
    current = next
    events.push(...more)
    if (waiting) return [current, events]
  }
  throw new Error('advance: too many automatic steps (engine bug)')
}

/** One automatic step. The third value is true when a decision is now needed. */
function stepOnce(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  switch (state.phase) {
    case 'ended':
      return [state, [], true]
    case 'setup':
      if (state.revealed.length > 0) return [state, [], true]
      return [
        { ...state, phase: 'prepare' },
        [{ type: 'phaseStarted', rule: '5.1', phase: 'prepare', round: state.round }],
        false,
      ]
    case 'prepare':
      return prepareStep(state)
    case 'combat':
      return combatStep(state)
    case 'explore':
      return exploreStep(state)
  }
}

/** Runs steps in sequence, stopping early if one ends the run. */
function chain(state: GameState, steps: readonly ((s: GameState) => Step)[]): Step {
  let current = state
  const events: GameEvent[] = []
  for (const step of steps) {
    if (current.phase === 'ended') break
    const [next, more] = step(current)
    current = next
    events.push(...more)
  }
  return [current, events]
}

/** Draws a hand for the current player and records the draw. */
function draw(state: GameState, rule: string): Step {
  const [player, drawn] = drawHand(currentPlayer(state), handSize(state))
  const next = updateCurrentPlayer(state, () => player)
  return [next, [{ type: 'cardsDrawn', rule, player: player.id, cards: drawn }]]
}

/**
 * Prepare: draw 3, play each card, draw again when the hand is empty; stop when deck and hand
 * are both empty, then start Combat. A Move or Build in progress (and a skirmish) is decided
 * step by step before the next card.
 *
 * @rule 6.1, 6.4, 6.5, 6.6, 6.7-6.15
 */
function prepareStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  if (state.exchange) return exchangeStep(state)
  const active = state.active
  if (active) {
    const done = active.kind === 'move' ? active.hexesLeft <= 0 : active.buildsLeft <= 0
    return done ? [{ ...state, active: null }, [], false] : [state, [], true]
  }
  const player = currentPlayer(state)
  if (player.hand.length > 0) return [state, [], true]
  if (player.deck.length > 0) {
    const [next, events] = draw(state, player.deck.length < handSize(state) ? '6.5' : '6.1')
    return [next, events, false]
  }
  return [...startCombat(state), false]
}

/**
 * Combat setup: shuffle the discard pile and turn it bottom-up, refill spawn nodes, do the wave
 * step, move the enemies, and let the Towers attack.
 *
 * @rule 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */
function startCombat(state: GameState): Step {
  const before = currentPlayer(state)
  const [player, rng] = rotateDeck(before, 'bottom', state.rng, true)
  const turned: GameState = { ...updateCurrentPlayer(state, () => player), rng, phase: 'combat' }
  const [next, events] = chain(turned, [
    refillNodes,
    (s) => (s.waveTrack > 0 ? waveStep(s) : [s, []]),
    moveEnemies,
    towerAttacks,
  ])
  return [
    next,
    [
      { type: 'phaseStarted', rule: '5.1', phase: 'combat', round: state.round },
      { type: 'deckShuffled', rule: '7.1', player: player.id, cards: player.deck.length },
      { type: 'deckTurned', rule: '7.2', player: player.id, orientation: 'bottom' },
      ...events,
    ],
  ]
}

/**
 * Combat: run exchanges until the deck and hand are empty, then the structure attack step,
 * then Explore. An exchange with no enemy in range is skipped (7.9).
 *
 * @rule 7.7, 7.8, 7.9, 7.10-7.13
 */
function combatStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  const player = currentPlayer(state)
  if (!state.exchange) {
    if (player.hand.length === 0 && player.deck.length === 0) {
      const [attacked, events] = structureAttacks(state)
      if (attacked.phase === 'ended') return [attacked, events, false]
      const [exploring, more] = startExplore({ ...attacked, phase: 'explore' })
      return [
        exploring,
        [
          ...events,
          { type: 'phaseStarted', rule: '5.1', phase: 'explore', round: state.round },
          ...more,
        ],
        false,
      ]
    }
    const [drawn, drawEvents] = draw(state, '7.8')
    const range = state.config.combat.exchangeRange
    if (!drawn.enemies.some((e) => hexDistance(e.hex, player.hex) <= range)) {
      const skipped = updateCurrentPlayer(drawn, (p) => clearTable(p))
      return [
        skipped,
        [...drawEvents, { type: 'exchangeSkipped', rule: '7.9', player: player.id }],
        false,
      ]
    }
    const [faces, rng] = rollDice(drawn.rng, player.dice)
    const next: GameState = {
      ...drawn,
      rng,
      exchange: {
        step: 'roll',
        dice: faces.map((face) => ({ face, kept: false })),
        rollsUsed: 1,
        rerollsLeft: 0,
        rerolled: [],
        bonusDamage: 0,
        ignoreHits: 0,
        assignments: [],
        queue: [],
        skirmish: null,
      },
    }
    return [
      next,
      [...drawEvents, { type: 'diceRolled', rule: '7.8', player: player.id, faces, roll: 1 }],
      false,
    ]
  }
  return exchangeStep(state)
}

/** The automatic steps inside an exchange (or skirmish); the rest are decisions. @rule 7.8 */
function exchangeStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  const exchange = state.exchange
  if (!exchange) return [state, [], true]
  const player = currentPlayer(state)
  switch (exchange.step) {
    case 'roll':
      if (exchange.rollsUsed >= state.config.combat.maxRolls) {
        return [{ ...state, exchange: { ...exchange, step: 'cards' } }, [], false]
      }
      return [state, [], true]
    case 'cards':
      if (player.hand.length === 0) {
        return [{ ...state, exchange: { ...exchange, step: 'assign' } }, [], false]
      }
      return [state, [], true]
    case 'reroll':
      if (exchange.rerollsLeft <= 0) {
        return [{ ...state, exchange: { ...exchange, step: 'cards', rerollsLeft: 0 } }, [], false]
      }
      return [state, [], true]
    case 'assign':
    case 'targets':
      return [state, [], true]
  }
}

/** Rolls every unkept die again (the "roll" decision). @rule 7.8 step 3-4 */
export function rollAgain(state: GameState): Step {
  const exchange = state.exchange
  if (!exchange) throw new Error('No exchange in progress')
  const [dice, rng] = rerollUnkept(state.rng, exchange.dice)
  const roll = exchange.rollsUsed + 1
  return [
    { ...state, rng, exchange: { ...exchange, dice, rollsUsed: roll } },
    [
      {
        type: 'diceRolled',
        rule: '7.8',
        player: currentPlayer(state).id,
        faces: dice.map((d) => d.face),
        roll,
      },
    ],
  ]
}

/**
 * Explore: tile reveal, spawns, and waves need the map (phase 7); the Skill draft and
 * milestones arrive in phase 8. Then turn the discard pile without a shuffle and start the
 * next round.
 *
 * @rule 10.1-10.5, 10.6, 10.7, 10.8, 10.9, 10.10
 */
function exploreStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  if (state.revealed.length > 0 || state.revealOffer) return [state, [], true]
  const before = currentPlayer(state)
  const [player, rng] = rotateDeck(before, 'top', state.rng, false)
  const round = state.round + 1
  const next: GameState = {
    ...updateCurrentPlayer(state, () => player),
    rng,
    round,
    phase: 'prepare',
  }
  return [
    next,
    [
      { type: 'deckTurned', rule: '10.6', player: player.id, orientation: 'top' },
      {
        type: 'stepDeferred',
        rule: '10.8, 10.10',
        step: 'Skill draft, milestones',
        reason: 'progression (phase 8)',
      },
      { type: 'roundAdvanced', rule: '10.9', round },
      { type: 'phaseStarted', rule: '5.1', phase: 'prepare', round },
    ],
    false,
  ]
}
