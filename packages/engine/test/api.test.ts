import { defaultContent, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import {
  applyAction,
  createGame,
  deserialize,
  legalActions,
  serialize,
  type GameState,
} from '../src/index.ts'
import { noSpawns } from './helpers/fixtures.ts'
import { scriptedChoice, walk } from './helpers/policy.ts'

const config = defaultContent.config

/** A new run with the figure placed on the base centre: round 1 Prepare. */
function started(seed: number, cfg: GameConfig = config): GameState {
  const s = createGame(cfg, seed)
  return applyAction(s, legalActions(s)[0]!).state
}

/** A grunt next to the base hex, where the player starts. */
const nearGrunt = (id = 'e1') => ({ id, kind: 'grunt', health: 2, hex: { q: 1, r: 0 } })

/** A started run whose only enemy is a grunt next to the player. */
const withGrunt = (seed: number) => ({ ...noSpawns(started(seed)), enemies: [nearGrunt()] })

/** Plays scripted actions until `stop` holds. */
function until(state: GameState, stop: (s: GameState) => boolean): GameState {
  return walk(state, scriptedChoice, stop).states.at(-1)!
}

describe('createGame (section 4)', () => {
  it('4 same config and seed give the same run', () => {
    expect(serialize(createGame(config, 7))).toBe(serialize(createGame(config, 7)))
    expect(serialize(createGame(config, 7))).not.toBe(serialize(createGame(config, 8)))
  })

  it('4.1, core loop v2 places the Base tile alone and waits for the start hex', () => {
    const s = createGame(config, 1)
    expect(s.phase).toBe('setup')
    expect(s.map.tiles).toEqual([{ tile: 'broken-village', center: { q: 0, r: 0 } }])
    expect(s.unplaced).toEqual(['p1'])
    expect(legalActions(s)).toHaveLength(7)
    expect(legalActions(s).every((a) => a.type === 'placeFigure')).toBe(true)
  })

  it('4.3, core loop v2 the tile deck holds every countryside tile on top of the core tiles', () => {
    const s = createGame(config, 1)
    const kind = (id: string) => defaultContent.tiles.find((t) => t.id === id)!.kind
    expect(s.tileDeck.map(kind)).toEqual([
      ...Array(3).fill('countryside'),
      ...Array(5).fill('core'),
    ])
  })

  it('4.5-4.11 sets health, dice, Skills, round, and draws the first hand', () => {
    const s = started(1)
    const p = s.players[0]!
    expect(p.health).toBe(15)
    expect(p.dice).toBe(1)
    expect(p.skills).toEqual(['strike', 'shot', 'mend', 'guard'])
    expect(s.base.health).toBe(20)
    expect(s.round).toBe(1)
    expect(s.phase).toBe('prepare')
    expect(p.hand).toHaveLength(3)
    expect(p.deck).toHaveLength(7)
    expect(p.orientation).toBe('top')
  })

  it('core loop v2 the run starts with no enemies on the map', () => {
    const s = started(1)
    expect(s.map.tiles).toHaveLength(1)
    expect(s.enemies).toEqual([])
  })
})

describe('Prepare (section 6)', () => {
  it('6.2-6.4 playing the hand draws the next 3 cards', () => {
    let s = started(3)
    for (let i = 0; i < 3; i++) {
      s = applyAction(s, { type: 'discardCard', card: s.players[0]!.hand[0]!.id }).state
    }
    expect(s.phase).toBe('prepare')
    expect(s.players[0]!.hand).toHaveLength(3)
    expect(s.players[0]!.deck).toHaveLength(4)
  })

  it('6.6, 7.1-7.2 an empty deck and hand end Prepare; Combat shuffles and turns the deck', () => {
    const s = until(withGrunt(3), (x) => x.phase === 'combat')
    expect(s.players[0]!.orientation).toBe('bottom')
    expect(s.log.some((e) => e.type === 'deckShuffled' && e.rule === '7.1')).toBe(true)
  })

  it('6.2 [006] a card may be discarded unplayed', () => {
    const s = started(3)
    const card = s.players[0]!.hand[0]!.id
    const { events } = applyAction(s, { type: 'discardCard', card })
    expect(events[0]).toMatchObject({ type: 'cardDiscarded', unplayed: true })
  })

  it('6.2 discarding is not offered when plays are mandatory', () => {
    const strict: GameConfig = { ...config, rulings: { ...config.rulings, mandatoryPlays: true } }
    expect(legalActions(started(3, strict)).every((a) => a.type === 'playCard')).toBe(true)
  })

  it('6.7 Rest heals, never above maximum health', () => {
    const s = started(3)
    const hurt = { ...s, players: [{ ...s.players[0]!, health: 14 }] }
    const rest = { id: 'c99', def: 'starter-rest' }
    const withRest = { ...hurt, players: [{ ...hurt.players[0]!, hand: [rest] }] }
    const { state } = applyAction(withRest, { type: 'playCard', card: 'c99' })
    expect(state.players[0]!.health).toBe(15)
  })
})

describe('Combat exchange (7.8)', () => {
  const inCombat = () => until(withGrunt(3), (x) => x.exchange?.step === 'roll')

  /**
   * The exchange with the figure off the Base tile on (3,0) and `enemy` next to it on (4,0): the
   * base is 3 away, so the enemy targets the player (row 56). On the Base tile it would not.
   */
  const exposed = (s: GameState, enemy: GameState['enemies'][number] = nearGrunt()): GameState => ({
    ...s,
    players: [{ ...s.players[0]!, hex: { q: 3, r: 0 } }],
    enemies: [{ ...enemy, hex: { q: 4, r: 0 } }],
  })
  const elite = { id: 'e9', kind: 'elite', health: 14, hex: { q: 4, r: 0 } }

  it('7.8 steps 1-2 draw 3 and roll all action dice', () => {
    const s = inCombat()
    expect(s.players[0]!.hand.length).toBeGreaterThan(0)
    expect(s.exchange!.dice).toHaveLength(1)
    expect(s.exchange!.rollsUsed).toBe(1)
  })

  it('7.8 step 4 the maximum is 3 rolls', () => {
    let s = inCombat()
    s = applyAction(s, { type: 'roll' }).state
    s = applyAction(s, { type: 'roll' }).state
    expect(s.exchange!.step).toBe('cards')
    expect(legalActions(s).some((a) => a.type === 'roll')).toBe(false)
  })

  it('7.8 step 3 a kept die keeps its face when the others are rolled', () => {
    let s = inCombat()
    const face = s.exchange!.dice[0]!.face
    s = applyAction(s, { type: 'toggleKeep', die: 0 }).state
    s = applyAction(s, { type: 'roll' }).state
    expect(s.exchange!.dice[0]!.face).toBe(face)
  })

  it('9.5 a grunt next to the player deals 2 damage, guard first (7.8 step 9)', () => {
    let s = exposed(inCombat())
    s = { ...s, players: [{ ...s.players[0]!, guard: 1 }] }
    s = applyAction(s, { type: 'stopRolling' }).state
    while (s.exchange?.step === 'cards')
      s = applyAction(s, { type: 'discardCard', card: s.players[0]!.hand[0]!.id }).state
    const before = s.players[0]!.health
    const { state, events } = applyAction(s, { type: 'confirmAssignment' })
    const hit = events.find((e) => e.type === 'playerDamaged')
    expect(hit).toMatchObject({ toGuard: 1, toHealth: 1 })
    expect(state.players[0]!.health).toBe(before - 1)
    expect(state.players[0]!.guard).toBe(0)
  })

  it('7.8 step 7 Strike with a Sword deals 2 damage and defeats a grunt', () => {
    let s = inCombat()
    s = {
      ...s,
      exchange: { ...s.exchange!, step: 'assign', dice: [{ face: 'Sword', kept: false }] },
      players: [{ ...s.players[0]!, hand: [], inPlay: s.players[0]!.hand }],
    }
    s = applyAction(s, {
      type: 'assignDie',
      die: 0,
      skill: 'strike',
      use: 0,
      slot: 0,
      asFace: 'Sword',
    }).state
    const { state, events } = applyAction(s, { type: 'confirmAssignment' })
    expect(events.map((e) => e.type)).toContain('enemyDefeated')
    expect(state.enemies).toHaveLength(0)
  })

  it('7.8 step 5 a +damage card adds to the first damage Skill that fires', () => {
    let s = inCombat()
    s = {
      ...s,
      enemies: [{ id: 'e9', kind: 'elite', health: 14, hex: { q: 1, r: 0 } }],
      exchange: {
        ...s.exchange!,
        step: 'assign',
        bonusDamage: 3,
        dice: [{ face: 'Star', kept: false }],
      },
      players: [{ ...s.players[0]!, hand: [], inPlay: s.players[0]!.hand }],
    }
    s = applyAction(s, {
      type: 'assignDie',
      die: 0,
      skill: 'strike',
      use: 0,
      slot: 0,
      asFace: 'Sword',
    }).state
    const { events } = applyAction(s, { type: 'confirmAssignment' })
    expect(events.find((e) => e.type === 'enemyDamaged')).toMatchObject({ amount: 5, health: 9 })
  })

  it('7.8 step 7 a single-target Skill asks for a target when 2 enemies are in range', () => {
    let s = inCombat()
    s = {
      ...s,
      enemies: [
        { id: 'e1', kind: 'grunt', health: 2, hex: { q: 1, r: 0 } },
        { id: 'e2', kind: 'grunt', health: 2, hex: { q: 0, r: 1 } },
      ],
      exchange: { ...s.exchange!, step: 'assign', dice: [{ face: 'Sword', kept: false }] },
      players: [{ ...s.players[0]!, hand: [], inPlay: s.players[0]!.hand }],
    }
    s = applyAction(s, {
      type: 'assignDie',
      die: 0,
      skill: 'strike',
      use: 0,
      slot: 0,
      asFace: 'Sword',
    }).state
    s = applyAction(s, { type: 'confirmAssignment' }).state
    expect(legalActions(s)).toEqual([
      { type: 'chooseTarget', enemy: 'e1' },
      { type: 'chooseTarget', enemy: 'e2' },
    ])
    const { state } = applyAction(s, { type: 'chooseTarget', enemy: 'e2' })
    expect(state.enemies.map((e) => e.id)).toEqual(['e1'])
  })

  it('9.6 an elite rolls 6 dice and deals Table 4 damage', () => {
    let s = exposed(inCombat(), elite)
    s = applyAction(s, { type: 'stopRolling' }).state
    while (s.exchange?.step === 'cards')
      s = applyAction(s, { type: 'discardCard', card: s.players[0]!.hand[0]!.id }).state
    const { events } = applyAction(s, { type: 'confirmAssignment' })
    const attack = events.find((e) => e.type === 'enemyAttacked')
    if (attack?.type !== 'enemyAttacked') throw new Error('expected an attack')
    const table = defaultContent.enemies.enemyDieDamage
    expect(attack.faces).toHaveLength(6)
    expect(attack.damage).toBe(attack.faces!.reduce((n, f) => n + table[f], 0))
  })

  it('core loop v2 with no enemy near, the exchange is still played (no 7.9 skip)', () => {
    const s = { ...noSpawns(started(3)), enemies: [] }
    const after = until(s, (x) => x.round === 2)
    expect(after.log.some((e) => e.type === 'diceRolled')).toBe(true)
  })

  /** Walks with the first legal action, discarding every card (no heals), until `stop`. */
  const firstUntil = (s: GameState, stop: (x: GameState) => boolean) =>
    walk(
      s,
      (x) => legalActions(x).find((a) => a.type === 'discardCard') ?? legalActions(x)[0],
      stop,
    ).states.at(-1)!

  /** An exposed player with 1 health and 3 materials, walked until the elite knocks them out. */
  const knockedOut = () => {
    const s = exposed(inCombat(), elite)
    const hurt = { ...s, players: [{ ...s.players[0]!, health: 1, materials: 3 }] }
    const ko = (x: GameState) => x.log.some((e) => e.type === 'playerKnockedOut')
    return firstUntil(hurt, (x) => ko(x) || x.phase === 'ended')
  }

  it('14.2, core loop v2 row 55 a player at 0 health is knocked out and the run goes on', () => {
    const s = knockedOut()
    expect(s.phase).not.toBe('ended')
    expect(s.endedBecause).toBeNull()
    expect(s.log).toContainEqual(
      expect.objectContaining({ type: 'playerKnockedOut', rule: '14.2', materialsLost: 3 }),
    )
    expect(s.players[0]!.materials).toBe(0)
  })

  it('core loop v2 row 55 a knocked-out player returns at the next round start with half health', () => {
    const s = firstUntil(knockedOut(), (x) => x.unplaced.length > 0 || x.phase === 'ended')
    expect(s.phase).toBe('prepare')
    expect(s.unplaced).toEqual(['p1'])
    expect(s.players[0]).toMatchObject({ knockedOut: false, health: 8 })
    expect(s.log).toContainEqual(
      expect.objectContaining({ type: 'playerReturned', player: 'p1', health: 8 }),
    )
    const actions = legalActions(s)
    expect(actions.length).toBeGreaterThan(0)
    expect(actions.every((a) => a.type === 'placeFigure')).toBe(true)
    const placed = applyAction(s, actions[0]!).state
    expect(placed.unplaced).toEqual([])
    expect(placed.players[0]!.hand).toHaveLength(3)
  })
})

describe('the round loop (sections 5, 10)', () => {
  it('5.1, 10.6-10.9 after Combat, the discard pile turns top-up and round 2 starts', () => {
    const s = until(withGrunt(3), (x) => x.round === 2 || x.phase === 'ended')
    expect(s.round).toBe(2)
    expect(s.phase).toBe('prepare')
    expect(s.players[0]!.orientation).toBe('top')
    expect(s.log.some((e) => e.type === 'roundAdvanced' && e.rule === '10.9')).toBe(true)
  })
})

describe('applyAction contract', () => {
  it('rejects an action that is not legal now', () => {
    expect(() => applyAction(createGame(config, 1), { type: 'roll' })).toThrow(/Illegal action/)
  })

  it('does not change its input state', () => {
    const s = createGame(config, 1)
    const before = serialize(s)
    applyAction(s, legalActions(s)[0]!)
    expect(serialize(s)).toBe(before)
  })

  it('serialize then deserialize gives the same state', () => {
    const s = until(withGrunt(5), (x) => x.exchange?.step === 'roll')
    expect(serialize(deserialize(serialize(s)))).toBe(serialize(s))
  })

  it('deserialize rejects text that is not a game state', () => {
    expect(() => deserialize('{"version":3}')).toThrow(/version 3/)
    expect(() => deserialize('{"version":2,"players":[]}')).toThrow(/version 3/)
  })
})

describe('Combat card effects (7.8 step 5)', () => {
  /** An exchange at the card step with the given dice and a hand of the given card defs. */
  function atCards(
    defs: string[],
    faces: Array<'Sword' | 'Blank' | 'Star' | 'Shield'>,
    kept = false,
  ): GameState {
    const s = until(withGrunt(3), (x) => x.exchange?.step === 'roll')
    const p = s.players[0]!
    const hand = defs.map((def, i) => ({ id: `x${i}`, def }))
    return {
      ...s,
      enemies: [{ id: 'e9', kind: 'elite', health: 14, hex: { q: 1, r: 0 } }],
      players: [{ ...p, hand, discard: [...p.discard, ...p.hand] }],
      exchange: {
        ...s.exchange!,
        step: 'cards' as const,
        dice: faces.map((face) => ({ face, kept })),
      },
    }
  }

  it('7.8 step 5 Reroll 2 dice rerolls 2 different dice, never the same die twice', () => {
    let s = atCards(['sprint'], ['Blank', 'Blank', 'Blank'])
    s = applyAction(s, { type: 'playCard', card: 'x0' }).state
    expect(s.exchange!.step).toBe('reroll')
    s = applyAction(s, { type: 'rerollDie', die: 0 }).state
    expect(legalActions(s)).not.toContainEqual({ type: 'rerollDie', die: 0 })
    s = applyAction(s, { type: 'rerollDie', die: 1 }).state
    expect(s.exchange!.step).toBe('assign')
  })

  it('7.8 step 5 Reroll 1 die can be stopped early with endReroll', () => {
    let s = atCards(['starter-move', 'starter-gather'], ['Blank'])
    s = applyAction(s, { type: 'playCard', card: 'x0' }).state
    s = applyAction(s, { type: 'endReroll' }).state
    expect(s.exchange!.step).toBe('cards')
  })

  it('7.8 step 5 Reroll all dice rerolls every die, kept dice included', () => {
    let s = atCards(['starter-rest'], ['Sword', 'Sword', 'Sword', 'Sword', 'Sword', 'Sword'], true)
    const { state, events } = applyAction(s, { type: 'playCard', card: 'x0' })
    s = state
    expect(events.filter((e) => e.type === 'dieRerolled')).toHaveLength(6)
    expect(s.exchange!.dice.every((d) => !d.kept)).toBe(true)
  })

  it('7.8 step 5 +1 die adds a rolled die for this exchange only', () => {
    let s = atCards(['scout'], ['Sword'])
    s = applyAction(s, { type: 'playCard', card: 'x0' }).state
    expect(s.exchange!.dice).toHaveLength(2)
    expect(s.players[0]!.dice).toBe(1)
  })

  it('7.8 steps 5, 9-10 a guard card absorbs damage, and guard is removed after the exchange', () => {
    let s = atCards(['starter-build'], ['Blank'])
    s = applyAction(s, { type: 'playCard', card: 'x0' }).state
    expect(s.players[0]!.guard).toBe(2)
    const { state, events } = applyAction(s, { type: 'confirmAssignment' })
    const hit = events.find((e) => e.type === 'playerDamaged')
    if (hit)
      expect(hit).toMatchObject({ toGuard: Math.min(2, (hit as { toGuard: number }).toGuard) })
    expect(state.players[0]!.guard).toBe(0)
  })

  it('7.8 step 5 +damage with no damage Skill fired has no effect', () => {
    let s = atCards(['starter-gather'], ['Blank'])
    s = applyAction(s, { type: 'playCard', card: 'x0' }).state
    const { events } = applyAction(s, { type: 'confirmAssignment' })
    expect(events.some((e) => e.type === 'enemyDamaged')).toBe(false)
  })
})

describe('deck flow across a round (5.3, 7.9, 10.7)', () => {
  /** The log of round 1 only: everything before the first `roundAdvanced` event. */
  function roundOneLog() {
    const s = until(withGrunt(11), (x) => x.round === 2 || x.phase === 'ended')
    const end = s.log.findIndex((e) => e.type === 'roundAdvanced')
    return s.log.slice(0, end)
  }
  const drawnBy = (log: ReturnType<typeof roundOneLog>, rules: string[]) =>
    log
      .filter((e) => e.type === 'cardsDrawn' && rules.includes(e.rule))
      .flatMap((e) => (e as { cards: readonly string[] }).cards)
      .sort()

  it('5.3 each round passes through the deck twice: every card is drawn in Prepare and in Combat', () => {
    const log = roundOneLog()
    const all = Array.from({ length: 10 }, (_, i) => `c${i + 1}`).sort()
    expect(drawnBy(log, ['6.1', '6.5'])).toEqual(all)
    expect(drawnBy(log, ['7.8'])).toEqual(all)
  })

  it('core loop v2 an exchange with no enemy near rolls dice and changes no health', () => {
    const s = { ...noSpawns(started(3)), enemies: [] }
    const after = until(s, (x) => x.round === 2)
    expect(after.log.some((e) => e.type === 'diceRolled')).toBe(true)
    expect(after.players[0]!.health).toBe(15)
  })

  it('10.6-10.7 after Combat the discard pile is turned, not shuffled, for the next Prepare', () => {
    const s = until(withGrunt(11), (x) => x.round === 2)
    const lastCombat = s.log.findLastIndex((e) => e.type === 'exchangeEnded')
    const between = s.log.slice(lastCombat)
    expect(between.some((e) => e.type === 'deckShuffled')).toBe(false)
    expect(between).toContainEqual(expect.objectContaining({ type: 'deckTurned', rule: '10.6' }))
  })
})
