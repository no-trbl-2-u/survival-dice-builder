import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { hexDistance } from '../src/hex.ts'
import { applyAction, createGame, legalActions, type GameState } from '../src/index.ts'
import { spawnEnemy } from '../src/map/spawn.ts'

const config = defaultContent.config

/**
 * A round 1 Prepare state with the setup tile placed east of the base and nothing else on the
 * map: no enemies, an empty hand, so each test sets only what it needs.
 *
 * Base tile hexes (center 0,0): (1,0) plains gathering node, (1,-1) forest, (0,-1) plains,
 * (-1,0) hills gathering node, (-1,1) forest, (0,1) plains.
 */
function world(patch: Partial<GameState> = {}): GameState {
  const s = createGame(config, 1)
  const placed = applyAction(s, legalActions(s)[0]!).state
  const p = placed.players[0]!
  return {
    ...placed,
    enemies: [],
    players: [{ ...p, hand: [], deck: [], discard: [...p.hand, ...p.deck] }],
    phase: 'prepare',
    ...patch,
  }
}

const withPlayer = (s: GameState, patch: Partial<GameState['players'][number]>): GameState => ({
  ...s,
  players: [{ ...s.players[0]!, ...patch }],
})

const grunt = (id: string, q: number, r: number) => ({
  id,
  kind: 'grunt',
  health: 2,
  hex: { q, r },
})

const moves = (s: GameState) =>
  legalActions(s)
    .filter((a) => a.type === 'moveTo')
    .map((a) => `${(a as { q: number }).q},${(a as { r: number }).r}`)
    .sort()

describe('setup (4.2 [006])', () => {
  it('4.2 the setup tile goes in the chosen slot and its spawn node gets a grunt', () => {
    const s = createGame(config, 1)
    const slot = legalActions(s)[2]!
    const { state, events } = applyAction(s, slot)
    expect(state.phase).toBe('prepare')
    expect(state.map.tiles).toHaveLength(2)
    expect(state.revealed).toEqual([])
    expect(events.map((e) => e.type)).toContain('enemySpawned')
  })
})

describe('spawning (4.4, 9.8 [006])', () => {
  it('9.8 [006] a spawn on a taken hex spills to the nearest free hex', () => {
    const s = world({ enemies: [grunt('e1', 1, 0)] })
    const [state, events] = spawnEnemy({ ...s, nextEnemyId: 2 }, 'grunt', { q: 1, r: 0 })
    const spilled = state.enemies.find((e) => e.id === 'e2')!
    expect(hexDistance(spilled.hex, { q: 1, r: 0 })).toBe(1)
    expect(events[0]).toMatchObject({ type: 'enemySpawned', rule: '9.8', spilled: true })
  })
})

describe('Move (6.7-6.9)', () => {
  it('6.7 a Move card lets the player step hex by hex, 1 hex per point', () => {
    let s = withPlayer(world(), { hand: [{ id: 'x1', def: 'starter-move' }] })
    s = applyAction(s, { type: 'playCard', card: 'x1' }).state
    expect(s.active).toMatchObject({ kind: 'move', hexesLeft: 2 })
    expect(legalActions(s)[0]).toEqual({ type: 'stopMoving' })
    s = applyAction(s, { type: 'moveTo', q: 0, r: 1 }).state
    expect(s.players[0]!.hex).toEqual({ q: 0, r: 1 })
    expect(s.active).toMatchObject({ hexesLeft: 1 })
  })

  it('6.7 moving stops when the points run out', () => {
    let s = world({ active: { kind: 'move', hexesLeft: 1, ignoreEnemyCost: false } })
    s = applyAction(s, { type: 'moveTo', q: 0, r: 1 }).state
    expect(s.active).toBeNull()
  })

  it('6.7 the player may stop a Move early', () => {
    const s = world({ active: { kind: 'move', hexesLeft: 2, ignoreEnemyCost: false } })
    expect(applyAction(s, { type: 'stopMoving' }).state.active).toBeNull()
  })

  it('3.4 lake and mountain hexes cannot be entered; off-map hexes neither', () => {
    // From the base's west hex (-1,0), (-2,0) and (-2,1) are off the map.
    const s = withPlayer(
      world({ active: { kind: 'move', hexesLeft: 1, ignoreEnemyCost: false } }),
      {
        hex: { q: -1, r: 0 },
      },
    )
    const options = moves(s)
    expect(options).not.toContain('-2,0')
    expect(options).toContain('0,0')
    for (const key of options) {
      const terrain = s.map.hexes[key]?.terrain
      expect(['lake', 'mountain']).not.toContain(terrain)
    }
  })

  it('6.9 a hex next to an enemy costs 2', () => {
    const s = world({
      enemies: [grunt('e1', 2, 0)],
      active: { kind: 'move', hexesLeft: 1, ignoreEnemyCost: false },
    })
    // (1,0) is next to (2,0): costs 2, more than the 1 point left.
    expect(moves(s)).not.toContain('1,0')
    expect(moves(s)).toContain('0,1')
  })

  it('Table 8 a card that ignores the enemy surcharge pays 1', () => {
    const s = world({
      enemies: [grunt('e1', 2, 0)],
      active: { kind: 'move', hexesLeft: 1, ignoreEnemyCost: true },
    })
    expect(moves(s)).toContain('1,0')
  })
})

describe('skirmish (6.10-6.15)', () => {
  const atSkirmish = () => {
    const s = world({
      enemies: [grunt('e1', 1, 0)],
      active: { kind: 'move', hexesLeft: 3, ignoreEnemyCost: false },
    })
    return applyAction(s, { type: 'moveTo', q: 1, r: 0 })
  }

  it('6.10-6.11 entering an enemy hex pays 2, rolls the dice once, and goes to Skill placement', () => {
    const { state, events } = atSkirmish()
    expect(events.map((e) => e.type)).toEqual(['skirmishStarted', 'diceRolled'])
    expect(state.exchange).toMatchObject({ step: 'assign', skirmish: { hex: { q: 1, r: 0 } } })
    expect(state.active).toMatchObject({ hexesLeft: 1 })
    expect(state.players[0]!.hex).toEqual({ q: 0, r: 0 })
    expect(legalActions(state).some((a) => a.type === 'playCard')).toBe(false)
  })

  it('6.13 a won skirmish moves the figure in and keeps the rest of the Move', () => {
    let { state: s } = atSkirmish()
    s = { ...s, exchange: { ...s.exchange!, dice: [{ face: 'Sword', kept: false }] } }
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
    expect(events).toContainEqual(expect.objectContaining({ type: 'skirmishEnded', won: true }))
    expect(state.players[0]!.hex).toEqual({ q: 1, r: 0 })
    expect(state.active).toMatchObject({ kind: 'move', hexesLeft: 1 })
    expect(state.exchange).toBeNull()
  })

  it('6.12, 6.14 [006] a lost skirmish: the enemy attacks once, the figure stays, the Move ends', () => {
    const { state: s } = atSkirmish()
    const { state, events } = applyAction(s, { type: 'confirmAssignment' })
    expect(events.filter((e) => e.type === 'enemyAttacked')).toHaveLength(1)
    expect(events).toContainEqual(expect.objectContaining({ type: 'skirmishEnded', won: false }))
    expect(state.players[0]!.hex).toEqual({ q: 0, r: 0 })
    expect(state.active).toBeNull()
  })

  it('6.11 only the enemy in the entered hex can be hit', () => {
    const s = world({
      enemies: [grunt('e1', 1, 0), grunt('e2', 1, -1)],
      active: { kind: 'move', hexesLeft: 2, ignoreEnemyCost: false },
    })
    let { state } = applyAction(s, { type: 'moveTo', q: 1, r: 0 })
    state = {
      ...state,
      exchange: { ...state.exchange!, dice: [{ face: 'Sword', kept: false }] },
    }
    state = applyAction(state, {
      type: 'assignDie',
      die: 0,
      skill: 'strike',
      use: 0,
      slot: 0,
      asFace: 'Sword',
    }).state
    const after = applyAction(state, { type: 'confirmAssignment' }).state
    expect(after.enemies.map((e) => e.id)).toEqual(['e2'])
  })
})

describe('Gather (6.7, Table 1)', () => {
  it('6.7 Gather on a gathering node takes its materials', () => {
    const s = withPlayer(world(), {
      hex: { q: 1, r: 0 },
      hand: [{ id: 'x1', def: 'starter-gather' }],
    })
    const { state } = applyAction(s, { type: 'playCard', card: 'x1' })
    expect(state.players[0]!.materials).toBe(config.gatherAmount)
  })

  it('6.7 Gather off a node gives nothing', () => {
    const s = withPlayer(world(), {
      hex: { q: 0, r: 1 },
      hand: [{ id: 'x1', def: 'starter-gather' }],
    })
    const { state, events } = applyAction(s, { type: 'playCard', card: 'x1' })
    expect(state.players[0]!.materials).toBe(0)
    expect(events).toContainEqual(expect.objectContaining({ type: 'gathered', amount: 0 }))
  })
})

describe('Build (12.1-12.4)', () => {
  const building = (materials: number) =>
    withPlayer(world({ active: { kind: 'build', buildsLeft: 1, costReduction: 0 } }), {
      hex: { q: 0, r: 1 },
      materials,
    })

  it('12.1 a defense is built on or next to the player and paid in materials', () => {
    const s = building(4)
    const { state, events } = applyAction(s, { type: 'build', defense: 'tower', q: 0, r: 1 })
    expect(state.players[0]!.materials).toBe(0)
    expect(state.defenses).toEqual([{ id: 'd1', kind: 'tower', hex: { q: 0, r: 1 }, health: 3 }])
    expect(events[0]).toMatchObject({ type: 'defenseBuilt', cost: 4 })
    expect(state.active).toBeNull()
  })

  it('12.1 an unaffordable defense is not offered', () => {
    const builds = legalActions(building(2)).filter((a) => a.type === 'build')
    expect(builds.length).toBeGreaterThan(0)
    expect(builds.every((a) => (a as { defense: string }).defense === 'barricade')).toBe(true)
  })

  it('12.2 not on the base hex, an enemy, or another defense', () => {
    let s = building(10)
    s = {
      ...s,
      enemies: [grunt('e1', 1, 1)],
      defenses: [{ id: 'd9', kind: 'barricade', hex: { q: -1, r: 1 }, health: 4 }],
    }
    const hexes = new Set(
      legalActions(s)
        .filter((a) => a.type === 'build')
        .map((a) => `${(a as { q: number }).q},${(a as { r: number }).r}`),
    )
    expect(hexes.has('0,0')).toBe(false)
    expect(hexes.has('1,1')).toBe(false)
    expect(hexes.has('-1,1')).toBe(false)
    expect(hexes.has('0,1')).toBe(true)
  })

  it('12.2 [row 14] a defense may be built on a gathering node', () => {
    const s = withPlayer(world({ active: { kind: 'build', buildsLeft: 1, costReduction: 0 } }), {
      hex: { q: 1, r: 0 },
      materials: 2,
    })
    expect(legalActions(s)).toContainEqual({ type: 'build', defense: 'barricade', q: 1, r: 0 })
  })

  it('Table 8 a cost reduction lowers the price (Mason: Barricade costs 1)', () => {
    const s = withPlayer(world({ active: { kind: 'build', buildsLeft: 1, costReduction: 1 } }), {
      hex: { q: 0, r: 1 },
      materials: 1,
    })
    const { state } = applyAction(s, { type: 'build', defense: 'barricade', q: 0, r: 1 })
    expect(state.players[0]!.materials).toBe(0)
  })

  it('Table 8 Architect builds twice', () => {
    let s = withPlayer(world(), {
      hex: { q: 0, r: 1 },
      materials: 4,
      hand: [{ id: 'x1', def: 'architect' }],
    })
    s = applyAction(s, { type: 'playCard', card: 'x1' }).state
    expect(s.active).toMatchObject({ kind: 'build', buildsLeft: 2 })
    s = applyAction(s, { type: 'build', defense: 'barricade', q: 0, r: 1 }).state
    expect(s.active).toMatchObject({ buildsLeft: 1 })
    s = applyAction(s, { type: 'build', defense: 'barricade', q: -1, r: 1 }).state
    expect(s.defenses).toHaveLength(2)
    expect(s.active).toBeNull()
  })

  it('11.2 Build on the base hex is a base upgrade (deferred to phase 8)', () => {
    const s = withPlayer(world(), { hand: [{ id: 'x1', def: 'starter-build' }] })
    const { state, events } = applyAction(s, { type: 'playCard', card: 'x1' })
    expect(state.active).toBeNull()
    expect(events).toContainEqual(expect.objectContaining({ type: 'effectDeferred' }))
  })
})

describe('Combat range (7.8, 7.9)', () => {
  /** A Combat exchange at Skill placement with 1 Sword die and the given enemies. */
  function atAssign(enemies: GameState['enemies']): GameState {
    const start = createGame(config, 3)
    let s: GameState = { ...applyAction(start, legalActions(start)[0]!).state, enemies }
    for (let i = 0; i < 50 && s.exchange?.step !== 'roll'; i++) {
      s = applyAction(s, legalActions(s)[0]!).state
    }
    const p = s.players[0]!
    return {
      ...s,
      exchange: { ...s.exchange!, step: 'assign', dice: [{ face: 'Sword', kept: false }] },
      players: [{ ...p, hand: [], inPlay: p.hand }],
    }
  }

  it('7.8 step 7 a Skill only hits enemies within its range (Strike: 1)', () => {
    let s = atAssign([grunt('e1', 2, 0)])
    s = applyAction(s, {
      type: 'assignDie',
      die: 0,
      skill: 'strike',
      use: 0,
      slot: 0,
      asFace: 'Sword',
    }).state
    const { events } = applyAction(s, { type: 'confirmAssignment' })
    expect(events.some((e) => e.type === 'enemyDamaged')).toBe(false)
  })

  it('7.8 step 8 only enemies next to the player attack', () => {
    const s = atAssign([grunt('e1', 2, 0), grunt('e2', 0, 1)])
    const { events } = applyAction(s, { type: 'confirmAssignment' })
    const attackers = events.flatMap((e) => (e.type === 'enemyAttacked' ? [e.enemy] : []))
    expect(attackers).toEqual(['e2'])
  })

  it('7.9 an exchange is skipped when no enemy is within exchange range', () => {
    const start = createGame(config, 1)
    let s: GameState = {
      ...applyAction(start, legalActions(start)[0]!).state,
      enemies: [grunt('e1', 3, 0)],
    }
    for (let i = 0; i < 50 && s.round === 1; i++) s = applyAction(s, legalActions(s)[0]!).state
    expect(s.log.some((e) => e.type === 'exchangeSkipped')).toBe(true)
    expect(s.log.some((e) => e.type === 'diceRolled')).toBe(false)
  })
})
