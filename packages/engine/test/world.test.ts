import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { hexDistance, tileHexes } from '../src/hex.ts'
import { applyAction, createGame, legalActions, type GameState } from '../src/index.ts'
import { canBuildOn } from '../src/build/defenses.ts'
import { spawnEnemy } from '../src/map/spawn.ts'
import { placeTile, slotCovering, TILE_SLOT_OFFSETS } from '../src/map/tiles.ts'
import { noSpawns } from './helpers/fixtures.ts'

const config = defaultContent.config
const tile = (id: string) => defaultContent.tiles.find((t) => t.id === id)!

/**
 * A round 1 Prepare state with the figure on the base centre, Stony Fields placed east of the
 * Base tile, and nothing else on the map: no enemies, an empty hand, so each test sets only what
 * it needs.
 *
 * Base tile (center 0,0): the base and 6 plain hexes. Stony Fields (center 2,1): (2,1) hills
 * gathering node, (3,1) plains, (3,0) wasteland, (2,0) plains (spawn node, removed here),
 * (1,1) hills, (1,2) plains gathering node, (2,2) forest.
 */
function world(patch: Partial<GameState> = {}): GameState {
  const s = createGame(config, 1)
  const started = applyAction(s, { type: 'placeFigure', q: 0, r: 0 }).state
  const placed = noSpawns({
    ...started,
    map: placeTile(started.map, tile('stony-fields'), { q: 2, r: 1 }),
  })
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

describe('setup (4.6, 3.8, row 16)', () => {
  it('4.6 the player puts the figure on any of the 7 Base tile hexes, then Prepare starts', () => {
    const s = createGame(config, 1)
    expect(legalActions(s).map((a) => a.type)).toEqual(Array(7).fill('placeFigure'))
    const { state, events } = applyAction(s, { type: 'placeFigure', q: 0, r: 1 })
    expect(state.phase).toBe('prepare')
    expect(state.players[0]!.hex).toEqual({ q: 0, r: 1 })
    expect(state.unplaced).toEqual([])
    expect(events[0]).toMatchObject({ type: 'figurePlaced', rule: '4.6', player: 'p1' })
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

  it('3.4 lake and mountain hexes cannot be entered; off-map hexes neither once the tile deck is empty', () => {
    // From the base's west hex (-1,0), (-2,0) and (-2,1) are off the map.
    const s = withPlayer(
      world({ active: { kind: 'move', hexesLeft: 1, ignoreEnemyCost: false }, tileDeck: [] }),
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
      active: { kind: 'move', hexesLeft: 2, ignoreEnemyCost: false },
    })
    return applyAction(s, { type: 'moveTo', q: 1, r: 0 })
  }

  it('6.10-6.11, row 26 entering an enemy hex pays 1, rolls the dice once, and goes to Skill placement', () => {
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

describe('exploring off the map edge (10.1, core loop v2)', () => {
  /** The base alone, the figure on its east hex (1,0) with a Move of `hexesLeft` in progress. */
  const atEdge = (tileDeck: string[], hexesLeft = 2) => {
    const s = createGame(config, 1)
    const placed = applyAction(s, { type: 'placeFigure', q: 1, r: 0 }).state
    const p = placed.players[0]!
    return {
      ...placed,
      tileDeck,
      players: [{ ...p, hand: [], deck: [], discard: [...p.hand, ...p.deck] }],
      active: { kind: 'move' as const, hexesLeft, ignoreEnemyCost: false },
    }
  }

  it('10.1 slotCovering finds the 1 tile slot that holds each hex', () => {
    expect(slotCovering({ q: 0, r: 0 })).toEqual({ q: 0, r: 0 })
    expect(slotCovering({ q: 2, r: 0 })).toEqual({ q: 2, r: 1 })
    expect(slotCovering({ q: 2, r: -1 })).toEqual({ q: 3, r: -2 })
    for (const center of [{ q: 0, r: 0 }, ...TILE_SLOT_OFFSETS]) {
      for (const hex of tileHexes(center)) expect(slotCovering(hex)).toEqual(center)
    }
  })

  it('core loop v2 a step off the edge costs 1, reveals the top tile under the hex, and the Move goes on', () => {
    const s = atEdge(['stony-fields', 'ash-waste'])
    expect(legalActions(s)).toContainEqual({ type: 'moveTo', q: 2, r: 0 })
    const { state, events } = applyAction(s, { type: 'moveTo', q: 2, r: 0 })
    expect(state.map.tiles.map((t) => t.tile)).toEqual(['broken-village', 'stony-fields'])
    expect(state.map.tiles[1]!.center).toEqual({ q: 2, r: 1 })
    expect(state.tileDeck).toEqual(['ash-waste'])
    expect(state.players[0]!.hex).toEqual({ q: 2, r: 0 })
    expect(state.active).toMatchObject({ kind: 'move', hexesLeft: 1 })
    expect(state.progress.tilesRevealed).toBe(1)
    expect(events.map((e) => e.type)).toEqual(['tileRevealed', 'tilePlaced', 'moved'])
  })

  it('core loop v2 the new tile has no enemies until the next Combat start', () => {
    const { state } = applyAction(atEdge(['stony-fields']), { type: 'moveTo', q: 2, r: 0 })
    expect(state.enemies).toEqual([])
    // Stony Fields' spawn node is (2,0), under the figure: it spawns at the Combat start.
    let s = applyAction(state, { type: 'stopMoving' }).state
    for (let i = 0; i < 50 && s.phase === 'prepare'; i++)
      s = applyAction(s, legalActions(s)[0]!).state
    expect(s.phase).toBe('combat')
    expect(s.enemies).toHaveLength(1)
    expect(s.log.some((e) => e.type === 'enemySpawned')).toBe(true)
  })

  it('row 61 a revealed lake under the step leaves the figure where it was, the cost paid', () => {
    // Meadowlands has its lake on hex 5: placed at (3,-2), the lake is (2,-1).
    const { state, events } = applyAction(atEdge(['meadowlands']), {
      type: 'moveTo',
      q: 2,
      r: -1,
    })
    expect(state.map.tiles[1]).toEqual({ tile: 'meadowlands', center: { q: 3, r: -2 } })
    expect(state.map.hexes['2,-1']?.terrain).toBe('lake')
    expect(state.players[0]!.hex).toEqual({ q: 1, r: 0 })
    expect(state.active).toMatchObject({ hexesLeft: 1 })
    expect(events.at(-1)).toMatchObject({ type: 'revealStepBlocked', rule: '3.4' })
  })

  it('core loop v2 with an empty tile deck there is no step off the edge', () => {
    expect(moves(atEdge([]))).not.toContain('2,0')
    expect(moves(atEdge(['stony-fields'], 1))).toContain('2,0')
  })
})

describe('figures on the Base tile (3.8, row 16)', () => {
  it('3.8 row 16 the 1-figure limit holds on base hexes too', () => {
    const s = createGame(config, 1, defaultContent, { players: 2 })
    const first = applyAction(s, { type: 'placeFigure', q: 0, r: 0 }).state
    expect(first.current).toBe(1)
    const spots = legalActions(first).map((a) => (a.type === 'placeFigure' ? `${a.q},${a.r}` : ''))
    expect(spots).toHaveLength(6)
    expect(spots).not.toContain('0,0')
  })
})

describe('Gather (6.7, Table 1, core loop v2)', () => {
  const gathering = (def: string, q = 1, r = 2) =>
    withPlayer(world(), { hex: { q, r }, hand: [{ id: 'x1', def }] })

  it('6.7 Gather on a gathering node takes the card amount and spends the node', () => {
    const { state, events } = applyAction(gathering('starter-gather'), {
      type: 'playCard',
      card: 'x1',
    })
    expect(state.players[0]!.materials).toBe(2)
    expect(state.spentNodes).toEqual([{ q: 1, r: 2 }])
    expect(events).toContainEqual(expect.objectContaining({ type: 'gathered', spent: true }))
  })

  it('core loop v2 a spent node gives nothing', () => {
    const s = { ...gathering('starter-gather'), spentNodes: [{ q: 1, r: 2 }] }
    const { state } = applyAction(s, { type: 'playCard', card: 'x1' })
    expect(state.players[0]!.materials).toBe(0)
  })

  it('row 20 Haul gathers 2 in total', () => {
    const { state } = applyAction(gathering('haul'), { type: 'playCard', card: 'x1' })
    expect(state.players[0]!.materials).toBe(2)
  })

  it('row 59 with gatherNeedsNode off, Gather works off a node and spends nothing', () => {
    const loose = { ...config, rulings: { ...config.rulings, gatherNeedsNode: false } }
    const s = { ...gathering('haul', 0, 1), config: loose }
    const { state } = applyAction(s, { type: 'playCard', card: 'x1' })
    expect(state.players[0]!.materials).toBe(2)
    expect(state.spentNodes).toEqual([])
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
  // (1,1) is the Stony Fields hills hex next to the Base tile.
  const building = (materials: number) =>
    withPlayer(world({ active: { kind: 'build', buildsLeft: 1, costReduction: 0 } }), {
      hex: { q: 1, r: 1 },
      materials,
    })

  it('12.1 a defense is built on or next to the player and paid in materials', () => {
    const s = building(4)
    const { state, events } = applyAction(s, { type: 'build', defense: 'tower', q: 1, r: 1 })
    expect(state.players[0]!.materials).toBe(0)
    expect(state.defenses).toEqual([
      { id: 'd1', kind: 'tower', hex: { q: 1, r: 1 }, health: 3, builder: 'p1' },
    ])
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
      enemies: [grunt('e1', 2, 0)],
      defenses: [{ id: 'd9', kind: 'barricade', hex: { q: 1, r: 2 }, health: 4, builder: 'p1' }],
    }
    const hexes = new Set(
      legalActions(s)
        .filter((a) => a.type === 'build')
        .map((a) => `${(a as { q: number }).q},${(a as { r: number }).r}`),
    )
    expect(canBuildOn(s, { q: 0, r: 0 })).toBe(false)
    expect(hexes.has('2,0')).toBe(false)
    expect(hexes.has('1,2')).toBe(false)
    expect(hexes.has('1,1')).toBe(true)
  })

  it('12.2 [row 14] a defense may be built on a gathering node', () => {
    const s = withPlayer(world({ active: { kind: 'build', buildsLeft: 1, costReduction: 0 } }), {
      hex: { q: 1, r: 2 },
      materials: 2,
    })
    expect(legalActions(s)).toContainEqual({ type: 'build', defense: 'barricade', q: 1, r: 2 })
  })

  it('Table 8 a cost reduction lowers the price (Mason: Barricade costs 1)', () => {
    const s = withPlayer(world({ active: { kind: 'build', buildsLeft: 1, costReduction: 1 } }), {
      hex: { q: 1, r: 1 },
      materials: 1,
    })
    const { state } = applyAction(s, { type: 'build', defense: 'barricade', q: 1, r: 1 })
    expect(state.players[0]!.materials).toBe(0)
  })

  it('Table 8 Architect builds twice', () => {
    let s = withPlayer(world(), {
      hex: { q: 1, r: 1 },
      materials: 4,
      hand: [{ id: 'x1', def: 'architect' }],
    })
    s = applyAction(s, { type: 'playCard', card: 'x1' }).state
    expect(s.active).toMatchObject({ kind: 'build', buildsLeft: 2 })
    s = applyAction(s, { type: 'build', defense: 'barricade', q: 1, r: 1 }).state
    expect(s.active).toMatchObject({ buildsLeft: 1 })
    s = applyAction(s, { type: 'build', defense: 'barricade', q: 2, r: 0 }).state
    expect(s.defenses).toHaveLength(2)
    expect(s.active).toBeNull()
  })

  it('6.7, 11.2 Build on the base hex offers base upgrades, not defenses (row 30)', () => {
    const s = withPlayer(world(), { materials: 4, hand: [{ id: 'x1', def: 'starter-build' }] })
    const { state } = applyAction(s, { type: 'playCard', card: 'x1' })
    expect(state.active).toMatchObject({ kind: 'build' })
    const types = new Set(legalActions(state).map((a) => a.type))
    expect(types.has('buyUpgrade')).toBe(true)
    expect(types.has('build')).toBe(false)
  })

  it('row 16 Build on an outer Base tile hex also offers base upgrades', () => {
    const s = withPlayer(world(), {
      hex: { q: 0, r: 1 },
      materials: 4,
      hand: [{ id: 'x1', def: 'starter-build' }],
    })
    const { state } = applyAction(s, { type: 'playCard', card: 'x1' })
    expect(legalActions(state).some((a) => a.type === 'buyUpgrade')).toBe(true)
  })
})

describe('Combat range (7.8, core loop v2)', () => {
  /** A Combat exchange at Skill placement with 1 Sword die and the given enemies. */
  function atAssign(enemies: GameState['enemies'], hex = { q: 0, r: 0 }): GameState {
    const start = createGame(config, 3)
    let s: GameState = { ...noSpawns(applyAction(start, legalActions(start)[0]!).state), enemies }
    for (let i = 0; i < 50 && s.exchange?.step !== 'roll'; i++) {
      s = applyAction(s, legalActions(s)[0]!).state
    }
    const p = s.players[0]!
    return {
      ...s,
      // Enemies moved at the start of Combat (7.5): put them back where the test wants them.
      enemies,
      exchange: { ...s.exchange!, step: 'assign', dice: [{ face: 'Sword', kept: false }] },
      players: [{ ...p, hex, hand: [], inPlay: p.hand }],
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

  it('7.8 step 8 only enemies next to the player (and targeting it) attack', () => {
    // Off the Base tile on (3,0): e2 next to it and e1 2 away both target the player (row 56).
    const s = atAssign([grunt('e1', 5, 0), grunt('e2', 4, 0)], { q: 3, r: 0 })
    const { events } = applyAction(s, { type: 'confirmAssignment' })
    const attackers = events.flatMap((e) => (e.type === 'enemyAttacked' ? [e.enemy] : []))
    expect(attackers).toEqual(['e2'])
  })

  it('core loop v2 an exchange with no enemy near is played: a guard Skill still fires', () => {
    let s = atAssign([])
    s = { ...s, exchange: { ...s.exchange!, dice: [{ face: 'Shield', kept: false }] } }
    s = applyAction(s, {
      type: 'assignDie',
      die: 0,
      skill: 'guard',
      use: 0,
      slot: 0,
      asFace: 'Shield',
    }).state
    const { events } = applyAction(s, { type: 'confirmAssignment' })
    expect(events).toContainEqual(expect.objectContaining({ type: 'guardGained', amount: 2 }))
  })
})
