import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { exchangeAttackers } from '../src/combat/resolve.ts'
import { currentTarget, moveEnemies } from '../src/enemies/movement.ts'
import { spawnAtNodes, spawnNodes } from '../src/enemies/spawning.ts'
import { structureAttacks, towerAttacks } from '../src/enemies/structures.ts'
import { rankTargets } from '../src/enemies/targets.ts'
import { hexKey, type Axial } from '../src/hex.ts'
import { applyAction, createGame, legalActions, type GameState } from '../src/index.ts'
import { miniatureCount, spawnEnemy } from '../src/map/spawn.ts'
import { EMPTY_MAP, placeTile } from '../src/map/tiles.ts'
import type { Enemy, GameMap } from '../src/state/types.ts'

const config = defaultContent.config
const tile = (id: string) => defaultContent.tiles.find((t) => t.id === id)!

/**
 * A straight row of plains hexes from q = `from` to q = `to` on r = 0, with the base at (0,0).
 * The base hex is a 1-hex tile of its own, so the base is that hex alone. No tiles are listed,
 * so no spawn node spawns unless a test adds tiles.
 */
function corridor(from: number, to: number): GameMap {
  const hexes: Record<string, GameMap['hexes'][string]> = {}
  for (let q = from; q <= to; q++) {
    const base = q === 0
    hexes[`${q},0`] = {
      terrain: 'plains',
      site: base ? 'base' : null,
      tile: base ? 'base' : 'test',
    }
  }
  return { tiles: [], hexes }
}

/** A round 1 Combat-ready state on `map`, the player on `player`, with these enemies. */
function board(map: GameMap, player: Axial, enemies: Enemy[], patch: Partial<GameState> = {}) {
  const s = createGame(config, 1)
  const p = s.players[0]!
  const state: GameState = {
    ...s,
    phase: 'prepare',
    unplaced: [],
    map,
    enemies,
    nextEnemyId: 100,
    players: [{ ...p, hex: player }],
    ...patch,
  }
  return state
}

const grunt = (id: string, q: number, r: number): Enemy => ({
  id,
  kind: 'grunt',
  health: 2,
  hex: { q, r },
  attackedThisCombat: false,
})

/** A defense token built by p1. */
const defense = (id: string, kind: string, q: number, r: number, health: number) => ({
  id,
  kind,
  hex: { q, r },
  health,
  builder: 'p1',
})

/** The default config with another player pull distance (row 56). */
const pull = (playerPullDistance: number) => ({
  ...config,
  rulings: { ...config.rulings, playerPullDistance },
})

const at = (s: GameState, id: string) => s.enemies.find((e) => e.id === id)?.hex

/** Base tile at (0,0) and Stony Fields (no lake or mountain) east of it at (2,1). */
const twoTiles = () =>
  placeTile(placeTile(EMPTY_MAP, tile('broken-village'), { q: 0, r: 0 }), tile('stony-fields'), {
    q: 2,
    r: 1,
  })

describe('targets (9.3)', () => {
  it('9.3 the nearest target comes first', () => {
    const s = board(corridor(-6, 6), { q: -5, r: 0 }, [], {
      defenses: [defense('d1', 'barricade', 4, 0, 4)],
    })
    expect(rankTargets(s, { q: 3, r: 0 }).map((t) => t.id)).toEqual(['d1', 'base', 'p1'])
  })

  it('9.3 row 15 at equal distance: player, then Tower, then Barricade, then base', () => {
    const s = board(corridor(-6, 6), { q: 4, r: 0 }, [], {
      config: pull(0),
      defenses: [defense('d1', 'tower', 0, 0, 3)],
    })
    expect(rankTargets(s, { q: 2, r: 0 }).map((t) => t.id)).toEqual(['p1', 'd1', 'base'])
  })

  it('core loop v2 row 56 enemies prefer a structure unless a player is 2 hexes nearer', () => {
    // From (3,0): the base is 3 away. A player 2 away (1 nearer) does not pull the enemy.
    const near = board(corridor(-6, 6), { q: 5, r: 0 }, [])
    expect(rankTargets(near, { q: 3, r: 0 }).map((t) => t.id)).toEqual(['base', 'p1'])
    // A player 1 away (2 nearer) does.
    const nearer = board(corridor(-6, 6), { q: 4, r: 0 }, [])
    expect(rankTargets(nearer, { q: 3, r: 0 }).map((t) => t.id)).toEqual(['p1', 'base'])
  })

  it('row 56 with playerPullDistance 0 players rank by distance alone (9.3)', () => {
    const s = board(corridor(-6, 6), { q: 5, r: 0 }, [], { config: pull(0) })
    expect(rankTargets(s, { q: 3, r: 0 }).map((t) => t.id)).toEqual(['p1', 'base'])
  })

  it('core loop v2 a knocked-out player is not a target', () => {
    const s = board(corridor(-6, 6), { q: 4, r: 0 }, [])
    const out = { ...s, players: [{ ...s.players[0]!, knockedOut: true }] }
    expect(rankTargets(out, { q: 3, r: 0 }).map((t) => t.id)).toEqual(['base'])
  })

  it('core loop v2 an enemy attacks only its target in an exchange', () => {
    // e1 on (1,0) is next to the base and to the player on (2,0): its target is the base.
    const guarding = board(corridor(-6, 6), { q: 2, r: 0 }, [grunt('e1', 1, 0)])
    expect(currentTarget(guarding, guarding.enemies[0]!)?.id).toBe('base')
    expect(exchangeAttackers(guarding)).toEqual([])
    // e1 on (3,0): the player 1 away is 2 nearer than the base 3 away, so it targets the player.
    const pulled = board(corridor(-6, 6), { q: 2, r: 0 }, [grunt('e1', 3, 0)])
    expect(exchangeAttackers(pulled).map((e) => e.id)).toEqual(['e1'])
  })
})

describe('enemy movement (7.5, 9.4, 9.7)', () => {
  it('7.5 an enemy moves 2 hexes toward the nearest target', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 5, 0)])
    const [after, events] = moveEnemies(s)
    expect(at(after, 'e1')).toEqual({ q: 3, r: 0 })
    expect(events[0]).toMatchObject({ type: 'enemyMoved', rule: '7.5', target: 'base' })
  })

  it('9.4 an enemy stops next to its target', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 2, 0)])
    expect(at(moveEnemies(s)[0], 'e1')).toEqual({ q: 1, r: 0 })
  })

  it('9.4 an enemy next to a target does not move', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 1, 0)])
    expect(moveEnemies(s)[1]).toEqual([])
  })

  it('9.4 a Barricade wall forces an attack: the enemy cannot enter, so it attacks the Barricade', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 4, 0)], {
      defenses: [defense('d1', 'barricade', 2, 0, 4)],
    })
    const [moved] = moveEnemies(s)
    expect(at(moved, 'e1')).toEqual({ q: 3, r: 0 })
    const [attacked, events] = structureAttacks(moved)
    expect(events[0]).toMatchObject({ type: 'structureAttacked', structure: 'd1', damage: 2 })
    expect(attacked.defenses[0]!.health).toBe(2)
  })

  it('9.7 enemies in the way force a detour', () => {
    // Stony Fields at (2,1): the enemy on (3,1) is walled on (3,0) and (2,1), so it goes round.
    const blockers = [grunt('e2', 3, 0), grunt('e3', 2, 1)]
    const s = board(twoTiles(), { q: -1, r: 1 }, [grunt('e1', 3, 1), ...blockers])
    const [after] = moveEnemies(s)
    expect(at(after, 'e1')).toEqual({ q: 1, r: 2 })
  })

  it('9.7 [006] if enemies block every path to the nearest target, it goes for the next nearest', () => {
    // The player on (5,0) is nearest, but e2 on (4,0) closes the only way in; the base is next.
    const s = board(corridor(-6, 6), { q: 5, r: 0 }, [grunt('e1', 3, 0), grunt('e2', 4, 0)], {
      config: pull(0),
    })
    const [after, events] = moveEnemies(s)
    expect(events.find((e) => e.type === 'enemyMoved' && e.enemy === 'e1')).toMatchObject({
      target: 'base',
    })
    expect(at(after, 'e1')).toEqual({ q: 1, r: 0 })
  })

  it('9.7 with blockedPathRule "wait" a blocked enemy waits', () => {
    const waiting = {
      ...pull(0),
      rulings: { ...pull(0).rulings, blockedPathRule: 'wait' as const },
    }
    const s = board(corridor(-6, 6), { q: 5, r: 0 }, [grunt('e1', 3, 0), grunt('e2', 4, 0)], {
      config: waiting,
    })
    expect(at(moveEnemies(s)[0], 'e1')).toEqual({ q: 3, r: 0 })
  })

  it('3.4, 9.4 an enemy never steps onto the base, a figure, a defense, or another enemy', () => {
    const s = board(corridor(-6, 6), { q: -2, r: 0 }, [grunt('e1', 3, 0), grunt('e2', -5, 0)], {
      defenses: [defense('d1', 'tower', 5, 0, 3)],
    })
    const [after] = moveEnemies(s)
    const taken = new Set([hexKey({ q: 0, r: 0 }), hexKey({ q: -2, r: 0 }), hexKey({ q: 5, r: 0 })])
    for (const e of after.enemies) expect(taken.has(hexKey(e.hex))).toBe(false)
  })
})

describe('spawning (core loop v2, 9.2, 9.8, 10.5)', () => {
  it('core loop v2 every spawn node spawns 1 grunt each time; an occupied node spills over', () => {
    const s = board(twoTiles(), { q: -1, r: 0 }, [])
    const nodes = spawnNodes(s)
    expect(nodes).toHaveLength(1)
    const [once, first] = spawnAtNodes(s)
    expect(once.enemies.map((e) => e.hex)).toEqual([nodes[0]!.hex])
    expect(first).toEqual([expect.objectContaining({ type: 'enemySpawned', rule: '9.2' })])
    const [twice, second] = spawnAtNodes(once)
    expect(twice.enemies).toHaveLength(2)
    expect(second).toEqual([expect.objectContaining({ rule: '9.8', spilled: true })])
  })

  it('core loop v2 an elite spawn node spawns an elite each time', () => {
    const map = placeTile(twoTiles(), tile('ash-waste'), { q: -1, r: 3 })
    const [after] = spawnAtNodes(board(map, { q: 0, r: 0 }, []))
    expect(after.enemies.map((e) => e.kind).sort()).toEqual(['elite', 'grunt', 'grunt'])
  })

  it('2.2, 10.5 at the miniature limit a new grunt replaces the grunt nearest the base with an elite', () => {
    const limited = { ...config, miniatureLimit: 2 }
    const s = board(twoTiles(), { q: 0, r: 0 }, [grunt('e1', 3, 0), grunt('e2', 1, 1)], {
      config: limited,
    })
    const [after, events] = spawnEnemy(s, 'grunt', { q: 2, r: 0 })
    expect(after.enemies.filter((e) => e.kind === 'grunt')).toHaveLength(1)
    expect(miniatureCount(after)).toBe(2)
    expect(events[0]).toMatchObject({ type: 'eliteReplaced', grunt: 'e2' })
    expect(after.enemies.find((e) => e.kind === 'elite')!.hex).toEqual({ q: 1, r: 1 })
  })

  it('2.2 row 32 at the miniature limit a new elite also promotes the grunt nearest the base', () => {
    const limited = { ...config, miniatureLimit: 1 }
    const s = board(twoTiles(), { q: 0, r: 0 }, [grunt('e1', 3, 0)], { config: limited })
    const [after, events] = spawnEnemy(s, 'elite', { q: 2, r: 0 })
    expect(after.enemies.map((e) => e.kind)).toEqual(['elite'])
    expect(events[0]).toMatchObject({ type: 'eliteReplaced', grunt: 'e1' })
  })

  it('core loop v2 at Combat start the enemies move first, then every node spawns', () => {
    const s0 = createGame(config, 1)
    let s: GameState = applyAction(s0, { type: 'placeFigure', q: -1, r: 0 }).state
    // e1 on (3,0) walks onto the Stony Fields node (2,0), next to the Base tile; the new grunt
    // then finds the node taken and spills over (9.8). Spawning first would have put it on (2,0).
    s = { ...s, map: twoTiles(), enemies: [grunt('e1', 3, 0)], nextEnemyId: 2 }
    for (let i = 0; i < 100 && s.phase === 'prepare'; i++) {
      s = applyAction(s, legalActions(s)[0]!).state
    }
    const types = s.log.flatMap((e) =>
      e.type === 'enemyMoved' || e.type === 'enemySpawned' ? [e.type] : [],
    )
    expect(types).toEqual(['enemyMoved', 'enemySpawned'])
    expect(at(s, 'e1')).toEqual({ q: 2, r: 0 })
    expect(at(s, 'e2')).toEqual({ q: 1, r: 0 })
  })
})

describe('Towers and structures (7.6, 7.11-7.12, 12.3, 14.1)', () => {
  it('12.3 a Tower gives 2 damage to the nearest enemy within 2 hexes', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 5, 0), grunt('e2', 4, 0)], {
      defenses: [defense('d1', 'tower', 3, 0, 3)],
      towerQueue: ['d1'],
    })
    const [after, events] = towerAttacks(s)
    expect(events[0]).toMatchObject({ type: 'towerAttacked', enemy: 'e2', damage: 2 })
    expect(after.enemies.map((e) => e.id)).toEqual(['e1'])
    expect(after.towerQueue).toEqual([])
  })

  it('12.3 a Tower with no enemy within 2 hexes does nothing', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 6, 0)], {
      defenses: [defense('d1', 'tower', 3, 0, 3)],
      towerQueue: ['d1'],
    })
    expect(towerAttacks(s)[1]).toEqual([])
  })

  it('12.3 row 35 equally near enemies: the Tower waits for its builder to choose', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 2, 0), grunt('e2', 4, 0)], {
      phase: 'combat',
      defenses: [defense('d1', 'tower', 3, 0, 3)],
      towerQueue: ['d1'],
    })
    const [waiting, events] = towerAttacks(s)
    expect(events).toEqual([])
    expect(waiting.towerQueue).toEqual(['d1'])
    expect(legalActions(waiting)).toEqual([
      { type: 'chooseTowerTarget', tower: 'd1', enemy: 'e1' },
      { type: 'chooseTowerTarget', tower: 'd1', enemy: 'e2' },
    ])
  })

  it('12.3 row 35 with 2 players the builder in seat 2 decides the tie, then seat 1 is current', () => {
    const s0 = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 2, 0), grunt('e2', 4, 0)], {
      phase: 'combat',
      defenses: [{ ...defense('d1', 'tower', 3, 0, 3), builder: 'p2' }],
      towerQueue: ['d1'],
    })
    const s: GameState = {
      ...s0,
      players: [s0.players[0]!, { ...s0.players[0]!, id: 'p2', hex: { q: -4, r: 0 } }],
    }
    const [waiting] = towerAttacks(s)
    expect(waiting.current).toBe(1)
    const { state } = applyAction(waiting, { type: 'chooseTowerTarget', tower: 'd1', enemy: 'e1' })
    expect(state.towerQueue).toEqual([])
    expect(state.current).toBe(0)
  })

  it('rows 40, 53 a Tower that defeats an enemy pays the currency to its builder', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 2, 0), grunt('e2', 4, 0)], {
      phase: 'combat',
      defenses: [defense('d1', 'tower', 3, 0, 3)],
      towerQueue: ['d1'],
    })
    const { state, events } = applyAction(s, {
      type: 'chooseTowerTarget',
      tower: 'd1',
      enemy: 'e2',
    })
    expect(state.enemies.map((e) => e.id)).toEqual(['e1'])
    const grunts = defaultContent.enemies.enemies.find((e) => e.id === 'grunt')!
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'currencyGained', player: 'p1', amount: grunts.currency }),
    )
  })

  it('7.12 an enemy attacks a Barricade before the base', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 1, 0)], {
      defenses: [defense('d1', 'barricade', 2, 0, 4)],
    })
    expect(structureAttacks(s)[1][0]).toMatchObject({ structure: 'd1' })
  })

  it('7.11 an enemy next to a player does not attack a structure', () => {
    const s = board(corridor(-6, 6), { q: 2, r: 0 }, [grunt('e1', 1, 0)])
    expect(structureAttacks(s)[1]).toEqual([])
  })

  it('12.4 a defense at 0 health is removed', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 3, 0)], {
      defenses: [defense('d1', 'tower', 4, 0, 2)],
    })
    const [after, events] = structureAttacks(s)
    expect(after.defenses).toEqual([])
    expect(events.map((e) => e.type)).toContain('defenseRemoved')
  })

  it('14.1 the run ends when the base reaches 0 health', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 1, 0)], {
      base: { health: 2, maxHealth: 20 },
    })
    const [after, events] = structureAttacks(s)
    expect(after.phase).toBe('ended')
    expect(after.endedBecause).toBe('base')
    expect(events.at(-1)).toMatchObject({ type: 'runEnded', rule: '14.1', because: 'base' })
  })

  it('7.11 row 7 with structureDamage "grunt-die" a grunt rolls 1 action die', () => {
    const dice = {
      ...config,
      rulings: { ...config.rulings, structureDamage: 'grunt-die' as const },
    }
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 1, 0)], { config: dice })
    const attack = structureAttacks(s)[1][0]
    if (attack?.type !== 'structureAttacked') throw new Error('expected a structure attack')
    expect(attack.faces).toHaveLength(1)
  })
})

describe('the Base tile is the base (row 16)', () => {
  it('row 16 an enemy next to an outer Base tile hex attacks the base', () => {
    // (2,0) touches the outer base hex (1,0), not the base centre.
    const s = board(twoTiles(), { q: -1, r: 0 }, [grunt('e1', 2, 0)])
    const [after, events] = structureAttacks(s)
    expect(events[0]).toMatchObject({ type: 'structureAttacked', structure: 'base' })
    expect(after.base.health).toBe(s.base.health - 2)
  })

  it('row 16 enemies rank the base by its nearest Base tile hex', () => {
    const s = board(twoTiles(), { q: -1, r: 0 }, [grunt('e1', 3, 0)])
    const base = rankTargets(s, { q: 3, r: 0 }).find((t) => t.kind === 'base')!
    expect(base.hex).toEqual({ q: 1, r: 0 })
  })
})

describe('end of round (10.6-10.9, core loop v2)', () => {
  it('core loop v2 there is no Explore phase and no wave track: Combat is followed by the next Prepare', () => {
    const s0 = createGame(config, 1)
    let s: GameState = { ...applyAction(s0, legalActions(s0)[0]!).state, tileDeck: [] }
    for (let i = 0; i < 300 && s.round === 1 && s.phase !== 'ended'; i++) {
      s = applyAction(s, legalActions(s)[0]!).state
    }
    const phases = s.log.flatMap((e) => (e.type === 'phaseStarted' ? [e.phase] : []))
    expect(phases).toEqual(['prepare', 'combat', 'prepare'])
    expect(s.round).toBe(2)
    expect('waveTrack' in s).toBe(false)
  })
})
