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

/** A co-op run past setup (the setup tile placed). */
function coop(players: number, cfg: GameConfig = config): GameState {
  const s = createGame(cfg, 1, defaultContent, { players })
  return applyAction(s, legalActions(s)[0]!).state
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

describe('co-op setup (16.1, 4.6)', () => {
  it('16.1 each player has an own shuffled deck; all figures start on the base', () => {
    const s = createGame(config, 1, defaultContent, { players: 3 })
    expect(s.players.map((p) => p.id)).toEqual(['p1', 'p2', 'p3'])
    expect(s.players.every((p) => p.hex.q === 0 && p.hex.r === 0)).toBe(true)
    const ids = s.players.flatMap((p) => ownedCards(p).map((c) => c.id))
    expect(new Set(ids).size).toBe(18)
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
    const { events } = playUntil(coop(2), (s) => s.phase === 'combat')
    expect(drawOrder(events, ['6.1', '6.5'])).toEqual(['p2', 'p1', 'p2'])
  })

  it('16.8 full-turn: a player plays the whole deck before the next player', () => {
    const cfg = {
      ...config,
      rulings: { ...config.rulings, coopPrepareOrder: 'full-turn' as const },
    }
    const { events } = playUntil(coop(2, cfg), (s) => s.phase === 'combat')
    expect(drawOrder(events, ['6.1', '6.5'])).toEqual(['p1', 'p2', 'p2'])
  })

  it('16.4 Combat: exchanges go in seat order', () => {
    const { state } = playUntil(coop(2), (s) => s.phase === 'explore')
    const combat = state.log.slice(
      state.log.findIndex((e) => e.type === 'phaseStarted' && e.phase === 'combat'),
    )
    expect(drawOrder([...combat], ['7.8'])).toEqual(['p1', 'p2', 'p1', 'p2'])
  })

  it('16.5 in an exchange only enemies next to that player attack that player', () => {
    const start = playUntil(coop(2), (s) => s.phase === 'combat').state
    const { events } = playUntil(start, (s) => s.phase === 'explore')
    for (const e of events) {
      if (e.type === 'enemyAttacked' || e.type === 'playerDamaged') {
        expect(['p1', 'p2']).toContain(e.player)
      }
    }
  })
})

describe('Explore with 2 players (16.6, 10.8)', () => {
  it('16.6 each player reveals and places 1 tile, in seat order', () => {
    const start = playUntil(coop(2), (s) => s.phase === 'explore').state
    let s = start
    const placers: string[] = []
    for (let i = 0; i < 200 && s.phase === 'explore'; i++) {
      const action = legalActions(s)[0]!
      if (action.type === 'placeTile') placers.push(s.players[s.current]!.id)
      s = applyAction(s, action).state
    }
    expect(placers).toEqual(['p1', 'p2'])
    expect(s.map.tiles).toHaveLength(4)
  })

  it('10.8, 11.6 each player drafts in seat order', () => {
    const start = playUntil(coop(2), (s) => s.phase === 'explore').state
    let s: GameState = { ...start, round: 2, upgrades: ['training-1'] }
    const drafters: string[] = []
    for (let i = 0; i < 200 && s.phase === 'explore'; i++) {
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
