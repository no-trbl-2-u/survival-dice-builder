import { drawHand, rotateDeck } from '../deck/deck.ts'
import { rerollUnkept, rollDice } from '../dice/dice.ts'
import { moveEnemies } from '../enemies/movement.ts'
import { returnKnockedOut } from '../combat/knockout.ts'
import { spawnAtNodes } from '../enemies/spawning.ts'
import { forcedReveal } from '../explore/explore.ts'
import { structureAttacks, towerAttacks } from '../enemies/structures.ts'
import type { GameEvent } from '../events/events.ts'
import { draftDue, startDraft } from '../progression/draft.ts'
import { checkMilestones } from '../progression/milestones.ts'
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
    case 'setup': {
      // 4.6: each player in seat order puts their figure on a free Base tile hex.
      const seat = state.players.findIndex((p) => state.unplaced.includes(p.id))
      if (seat >= 0) return [{ ...state, current: seat }, [], true]
      return [
        { ...state, phase: 'prepare', current: 0, turnFresh: true },
        [{ type: 'phaseStarted', rule: '5.1', phase: 'prepare', round: state.round }],
        false,
      ]
    }
    case 'prepare':
      return prepareStep(state)
    case 'combat':
      return combatStep(state)
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

/** True when a player still takes turns this phase: on the map, with cards in the deck. */
function hasTurns(player: Player): boolean {
  return !player.knockedOut && player.deck.length > 0
}

/**
 * Prepare: draw a hand, play each card, draw again when the hand is empty; stop when every deck and
 * hand is empty, then start Combat. With 2-4 players each plays 1 hand in seat order, then the
 * next player with cards (16.8, `coopPrepareOrder`). A Move or Build in progress (and a
 * skirmish) is decided step by step before the next card. A returning knocked-out player first
 * puts the figure on a free Base tile hex; a knocked-out player takes no turns.
 *
 * @rule 6.1, 6.4, 6.5, 6.6, 6.7-6.15, 16.8, core loop v2 (knockout)
 */
function prepareStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  if (state.exchange) return exchangeStep(state)
  const returning = state.players.findIndex((p) => state.unplaced.includes(p.id))
  if (returning >= 0) return [{ ...state, current: returning }, [], true]
  const active = state.active
  if (active) {
    const done = active.kind === 'move' ? active.hexesLeft <= 0 : active.buildsLeft <= 0
    return done ? [{ ...state, active: null }, [], false] : [state, [], true]
  }
  const player = currentPlayer(state)
  if (player.hand.length > 0) return [state, [], true]
  // 16.8: a fresh turn draws; after a hand, "full-turn" keeps drawing, "alternate-hands" passes.
  const keepGoing = state.config.rulings.coopPrepareOrder === 'full-turn'
  if ((state.turnFresh || keepGoing) && hasTurns(player)) {
    const [next, events] = draw(state, player.deck.length < handSize(state) ? '6.5' : '6.1')
    return [{ ...next, turnFresh: false }, events, false]
  }
  const seat = nextSeat(state, hasTurns)
  if (seat >= 0) return [{ ...state, current: seat, turnFresh: true }, [], false]
  return [...startCombat(state), false]
}

/**
 * Combat start, row 65: every tipped-over enemy stands up again (it may attack in this Combat).
 *
 * @rule core loop v2 row 65 (proposed: each enemy attacks once per Combat)
 */
export function standEnemiesUp(state: GameState): GameState {
  if (!state.enemies.some((e) => e.attackedThisCombat)) return state
  return { ...state, enemies: state.enemies.map((e) => ({ ...e, attackedThisCombat: false })) }
}

/**
 * Combat setup (core loop v2): every player shuffles the discard pile and turns it bottom-up,
 * tipped enemies stand up (row 65), the enemies move, every spawn node spawns, and each Tower
 * attacks (a tie waits for its builder's choice). There is no wave track.
 *
 * @rule 7.1, 7.2, 7.5, 7.6, core loop v2 (Combat steps 1-4), row 65
 */
function startCombat(state: GameState): Step {
  const [turned, turnEvents] = turnAllDecks(
    standEnemiesUp({ ...state, phase: 'combat', current: 0, turnFresh: true }),
    'bottom',
  )
  const [next, events] = chain(turned, [
    moveEnemies,
    spawnAtNodes,
    (s) => towerAttacks({ ...s, towerQueue: towerIds(s) }),
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

/** The Towers on the map, oldest first: the defenses that attack (Table 7). @rule 7.6, 12.3 */
function towerIds(state: GameState): string[] {
  return state.defenses
    .filter((d) => state.content.defenses.find((x) => x.id === d.kind)?.attack)
    .map((d) => d.id)
}

/**
 * Combat: run exchanges until every deck and hand is empty, then the structure attack step,
 * then the end of the round. With 2-4 players the exchanges go in seat order (16.4); a
 * knocked-out player has none. An exchange is played even with no enemy near (core loop v2:
 * heal, guard, and reroll halves work anywhere; damage needs a target in range).
 *
 * @rule 7.7, 7.8, 7.10-7.13, 16.4, 16.5, core loop v2 (Combat step 5)
 */
function combatStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  const player = currentPlayer(state)
  if (state.roundEnding) return roundEndStep(state)
  if (state.towerQueue.length > 0) return [state, [], true]
  if (!state.exchange) {
    // 16.4: exchanges in turn, seat order, skipping players with no cards left.
    if (!state.turnFresh || !hasTurns(player)) {
      const seat = nextSeat(state, hasTurns)
      if (seat >= 0) return [{ ...state, current: seat, turnFresh: true }, [], false]
      const [attacked, events] = structureAttacks(state)
      if (attacked.phase === 'ended') return [attacked, events, false]
      return [{ ...attacked, current: 0, roundEnding: true }, events, false]
    }
    const [drawnState, drawEvents] = draw(state, '7.8')
    const drawn: GameState = { ...drawnState, turnFresh: false }
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
 * The end of the round, after the Combat structure attack (core loop v2: there is no Explore
 * phase): turn every discard pile without a shuffle (10.6-10.7), do each player's Skill draft
 * when it is due (10.8), reveal a tile when the forced reveal is due (row 63, off by default),
 * add 1 to the round counter (10.9), and record new milestones (10.10). Then the next round
 * starts: knocked-out players return (they choose a start hex first).
 *
 * @rule 10.6, 10.7, 10.8, 10.9, 10.10, core loop v2 (end of round, knockout), row 63
 */
function roundEndStep(state: GameState): readonly [GameState, readonly GameEvent[], boolean] {
  if (state.draft) return [state, [], true]
  if (state.players.some((p) => p.orientation === 'bottom')) {
    return [...turnAllDecks(state, 'top'), false]
  }
  if (draftDue(state)) return [...startDraft(state), false]
  const [clocked, revealed] = forcedReveal(state)
  const round = state.round + 1
  const [counted, milestones] = checkMilestones(
    {
      ...clocked,
      round,
      phase: 'prepare',
      current: 0,
      turnFresh: true,
      draftedPlayers: [],
      roundEnding: false,
    },
    '10.10',
  )
  const [next, returns] = returnKnockedOut(counted)
  return [
    next,
    [
      ...revealed,
      { type: 'roundAdvanced', rule: '10.9', round },
      ...milestones,
      { type: 'phaseStarted', rule: '5.1', phase: 'prepare', round },
      ...returns,
    ],
    false,
  ]
}
