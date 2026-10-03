import { clearTable, drawHand, rotateDeck } from '../deck/deck.ts'
import { rerollUnkept, rollDice } from '../dice/dice.ts'
import { moveEnemies } from '../enemies/movement.ts'
import { refillNodes, waveStep } from '../enemies/spawning.ts'
import { structureAttacks, towerAttacks } from '../enemies/structures.ts'
import type { GameEvent } from '../events/events.ts'
import { startExplore } from '../explore/explore.ts'
import { draftDue, startDraft } from '../progression/draft.ts'
import { checkMilestones } from '../progression/milestones.ts'
import { hexDistance } from '../hex.ts'
import { currentPlayer, handSize, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { GameState, Player } from '../state/types.ts'

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
    case 'ended': {
      // 14.3: record the milestones reached by the end of the run (once each).
      const [recorded, events] = checkMilestones(state, '14.3')
      return [recorded, events, true]
    }
    case 'setup':
      if (state.revealed.length > 0) return [state, [], true]
      return [
        { ...state, phase: 'prepare', current: 0, turnFresh: true },
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
 * The next seat after the current one (cyclic, the current seat last) whose player matches.
 * -1 when no player matches.
 *
 * @rule 16.4, 16.8
 */
export function nextSeat(state: GameState, matches: (p: Player) => boolean): number {
  const n = state.players.length
  for (let k = 1; k <= n; k++) {
    const seat = (state.current + k) % n
    const player = state.players[seat]
    if (player && matches(player)) return seat
  }
  return -1
}

/** Turns every player's deck (7.1-7.2 shuffle and bottom up; 10.6 top up, no shuffle). */
function turnAllDecks(state: GameState, side: 'top' | 'bottom'): Step {
  let rng = state.rng
  const events: GameEvent[] = []
  const players = state.players.map((before) => {
    const [player, next] = rotateDeck(before, side, rng, side === 'bottom')
    rng = next
    if (side === 'bottom') {
      events.push({
        type: 'deckShuffled',
        rule: '7.1',
        player: player.id,
        cards: player.deck.length,
      })
      events.push({ type: 'deckTurned', rule: '7.2', player: player.id, orientation: 'bottom' })
    } else {
      events.push({ type: 'deckTurned', rule: '10.6', player: player.id, orientation: 'top' })
    }
    return player
  })
  return [{ ...state, players, rng }, events]
}

/**
 * Prepare: draw 3, play each card, draw again when the hand is empty; stop when every deck and
 * hand is empty, then start Combat. With 2-4 players each plays 1 hand in seat order, then the
 * next player with cards (16.8, `coopPrepareOrder`). A Move or Build in progress (and a
 * skirmish) is decided step by step before the next card.
 *
 * @rule 6.1, 6.4, 6.5, 6.6, 6.7-6.15, 16.8
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
  // 16.8: a fresh turn draws; after a hand, "full-turn" keeps drawing, "alternate-hands" passes.
  const keepGoing = state.config.rulings.coopPrepareOrder === 'full-turn'
  if ((state.turnFresh || keepGoing) && player.deck.length > 0) {
    const [next, events] = draw(state, player.deck.length < handSize(state) ? '6.5' : '6.1')
    return [{ ...next, turnFresh: false }, events, false]
  }
  const seat = nextSeat(state, (p) => p.deck.length > 0)
  if (seat >= 0) return [{ ...state, current: seat, turnFresh: true }, [], false]
  return [...startCombat(state), false]
}

/**
 * Combat setup: every player shuffles the discard pile and turns it bottom-up, then refill
 * spawn nodes, do the wave step, move the enemies, and let the Towers attack.
 *
 * @rule 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */
function startCombat(state: GameState): Step {
  const [turned, turnEvents] = turnAllDecks(
    { ...state, phase: 'combat', current: 0, turnFresh: true },
    'bottom',
  )
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
      ...turnEvents,
      ...events,
    ],
  ]
}

/**
 * Combat: run exchanges until every deck and hand is empty, then the structure attack step,
 * then Explore. With 2-4 players the exchanges go in seat order (16.4). An exchange with no
 * enemy in range is skipped (7.9).
 *
 * @rule 7.7, 7.8, 7.9, 7.10-7.13, 16.4, 16.5
 */
function combatStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  const player = currentPlayer(state)
  if (!state.exchange) {
    // 16.4: exchanges in turn, seat order, skipping players with no cards left.
    if (!state.turnFresh || player.deck.length === 0) {
      const seat = nextSeat(state, (p) => p.deck.length > 0)
      if (seat >= 0) return [{ ...state, current: seat, turnFresh: true }, [], false]
      const [attacked, events] = structureAttacks(state)
      if (attacked.phase === 'ended') return [attacked, events, false]
      const reveals = state.players.length * state.config.tiles.revealPerPlayer
      return [
        { ...attacked, phase: 'explore', current: 0, revealsLeft: reveals },
        [...events, { type: 'phaseStarted', rule: '5.1', phase: 'explore', round: state.round }],
        false,
      ]
    }
    const [drawnState, drawEvents] = draw(state, '7.8')
    const drawn: GameState = { ...drawnState, turnFresh: false }
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
 * Explore: reveal 1 tile per player (`startExplore`, 10.1-10.5, 16.6), turn every discard pile
 * without a shuffle (10.6-10.7), do each player's Skill draft when it is due (10.8), add 1 to
 * the round counter (10.9), and record new milestones (10.10).
 *
 * @rule 10.1-10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 16.6
 */
function exploreStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  if (state.revealed.length > 0 || state.revealOffer || state.draft) return [state, [], true]
  if (state.revealsLeft > 0) {
    // 16.6: 1 reveal per player (x revealPerPlayer), placed in seat order.
    const done = state.players.length * state.config.tiles.revealPerPlayer - state.revealsLeft
    const seat = done % state.players.length
    const emptyDeck = state.tileDeck.length === 0
    const [next, events] = startExplore({ ...state, current: seat })
    // 10.3: an empty tile deck adds 1 to the wave track once per Explore phase (row 51).
    return [{ ...next, revealsLeft: emptyDeck ? 0 : state.revealsLeft - 1 }, events, false]
  }
  if (state.players.some((p) => p.orientation === 'bottom')) {
    return [...turnAllDecks(state, 'top'), false]
  }
  if (draftDue(state)) return [...startDraft(state), false]
  const round = state.round + 1
  const [next, milestones] = checkMilestones(
    { ...state, round, phase: 'prepare', current: 0, turnFresh: true, draftedPlayers: [] },
    '10.10',
  )
  return [
    next,
    [
      { type: 'roundAdvanced', rule: '10.9', round },
      ...milestones,
      { type: 'phaseStarted', rule: '5.1', phase: 'prepare', round },
    ],
    false,
  ]
}
