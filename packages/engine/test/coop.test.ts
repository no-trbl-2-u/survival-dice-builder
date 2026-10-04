import { defaultContent, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { ownedCards } from '../src/deck/deck.ts'
import {
  applyAction,
  createGame,
  legalActions,
  type GameEvent,
  type GameState,
} from '../src/index.ts'
import { explorerChoice, walk } from './helpers/policy.ts'

const config = defaultContent.config

/** A co-op run past setup: each figure on the first free Base tile hex, in seat order. */
function coop(players: number, cfg: GameConfig = config): GameState {
  let s = createGame(cfg, 1, defaultContent, { players })
  while (s.phase === 'setup') s = applyAction(s, legalActions(s)[0]!).state
  return s
}

/** Plays the first legal action until `stop`, collecting every event. */
function playUntil(start: GameState, stop: (s: GameState) => boolean, max = 2000) {
  let s = start
  const events: GameEvent[] = []
  for (let i = 0; i < max && !stop(s) && s.phase !== 'ended'; i++) {
    const r = applyAction(s, legalActions(s)[0]!)
    s = r.state
    events.push(...r.events)
  }
  return { state: s, events }
}

/** The events before the first one that matches. */
const before = (events: GameEvent[], stop: (e: GameEvent) => boolean) => {
  const i = events.findIndex(stop)
  return i < 0 ? events : events.slice(0, i)
}

const combatStarts = (e: GameEvent) => e.type === 'phaseStarted' && e.phase === 'combat'

describe('co-op setup (16.1, 4.6)', () => {
  it('16.1 each player has an own shuffled deck', () => {
    const s = createGame(config, 1, defaultContent, { players: 3 })
    expect(s.players.map((p) => p.id)).toEqual(['p1', 'p2', 'p3'])
    const ids = s.players.flatMap((p) => ownedCards(p).map((c) => c.id))
    expect(new Set(ids).size).toBe(30)
  })

  it('4.6, 3.8 each player in seat order puts the figure on a free Base tile hex', () => {
    let s = createGame(config, 1, defaultContent, { players: 3 })
    const placers: string[] = []
    while (s.phase === 'setup') {
      placers.push(s.players[s.current]!.id)
      s = applyAction(s, legalActions(s)[0]!).state
    }
    expect(placers).toEqual(['p1', 'p2', 'p3'])
    expect(new Set(s.players.map((p) => `${p.hex.q},${p.hex.r}`)).size).toBe(3)
  })

  it('rejects a player count outside config.players', () => {
    expect(() => createGame(config, 1, defaultContent, { players: 5 })).toThrow(/outside 1-4/)
  })

  it('a solo run is the same as before co-op (setup defaults to 1 player)', () => {
    expect(createGame(config, 7)).toEqual(createGame(config, 7, defaultContent, { players: 1 }))
  })
})

describe('turn order (16.4, 16.8)', () => {
  const drawOrder = (events: GameEvent[], rules: string[]) =>
    events.flatMap((e) => (e.type === 'cardsDrawn' && rules.includes(e.rule) ? [e.player] : []))

  it('16.8 row 6 Prepare: players alternate hands of 3 in seat order', () => {
    const { events } = playUntil(coop(2), (s) => s.round === 2)
    // p1's first hand was drawn when setup ended; 10 cards make 4 hands each.
    expect(drawOrder(before(events, combatStarts), ['6.1', '6.5'])).toEqual([
      'p2',
      'p1',
      'p2',
      'p1',
      'p2',
      'p1',
      'p2',
    ])
  })

  it('16.8 full-turn: a player plays the whole deck before the next player', () => {
    const cfg = {
      ...config,
      rulings: { ...config.rulings, coopPrepareOrder: 'full-turn' as const },
    }
    const { events } = playUntil(coop(2, cfg), (s) => s.round === 2)
    expect(drawOrder(before(events, combatStarts), ['6.1', '6.5'])).toEqual([
      'p1',
      'p1',
      'p1',
      'p2',
      'p2',
      'p2',
      'p2',
    ])
  })

  it('16.4 Combat: exchanges go in seat order', () => {
    const { events } = playUntil(coop(2), (s) => s.round === 2)
    const combat = events.slice(events.findIndex(combatStarts))
    expect(drawOrder(combat, ['7.8'])).toEqual(['p1', 'p2', 'p1', 'p2', 'p1', 'p2', 'p1', 'p2'])
  })

  it('16.5 in an exchange only enemies next to that player attack that player', () => {
    const { events } = playUntil(coop(2), (s) => s.round === 3)
    for (const e of events) {
      if (e.type === 'enemyAttacked' || e.type === 'playerDamaged') {
        expect(['p1', 'p2']).toContain(e.player)
      }
    }
  })
})

describe('the end of the round with 2 players (10.8)', () => {
  it('10.8, 11.6 each player drafts in seat order', () => {
    let s: GameState = { ...coop(2), round: 2, upgrades: ['training-1'] }
    const drafters: string[] = []
    for (let i = 0; i < 500 && s.round === 2; i++) {
      const action = legalActions(s)[0]!
      if (action.type === 'draftSkill') drafters.push(s.players[s.current]!.id)
      s = applyAction(s, action).state
    }
    expect(drafters).toEqual(['p1', 'p2'])
  })
})

describe('a 3-player run', () => {
  it('plays to the end (spec 6 acceptance)', () => {
    const run = walk(
      createGame(config, 3, defaultContent, { players: 3 }),
      explorerChoice,
      (s) => s.phase === 'ended',
      50_000,
    )
    const last = run.states.at(-1)!
    expect(last.phase).toBe('ended')
    expect(last.players).toHaveLength(3)
  })
})
