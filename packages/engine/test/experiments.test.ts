import { defaultContent, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { damageEnemy, exchangeAttackers, finishExchange } from '../src/combat/resolve.ts'
import {
  activeSpawnNodes,
  nodeInRange,
  spawnAtNodes,
  spawnCount,
  spawnNodes,
} from '../src/enemies/spawning.ts'
import { structureAttacks } from '../src/enemies/structures.ts'
import { forcedReveal, forcedRevealDue } from '../src/explore/explore.ts'
import { gather } from '../src/gather/gather.ts'
import { hexDistance, type Axial } from '../src/hex.ts'
import { createGame, deserialize, legalActions, serialize, type GameState } from '../src/index.ts'
import { scriptedChoice, walk } from './helpers/policy.ts'
import { spawnEnemy } from '../src/map/spawn.ts'
import { BASE_HEX, EMPTY_MAP, emptySlots, placeTile } from '../src/map/tiles.ts'
import { standEnemiesUp } from '../src/phases/advance.ts'
import type { Enemy, Exchange, GameMap } from '../src/state/types.ts'

/**
 * Phase 22: each structural option (OPEN-QUESTIONS rows 63-70) and each experience option
 * (row 17), on and off. Off is always the phase 21 result (see also golden.test.ts).
 */
const config = defaultContent.config
const tile = (id: string) => defaultContent.tiles.find((t) => t.id === id)!

/** The default config with some groups changed. */
const withConfig = (patch: { [K in keyof GameConfig]?: Partial<GameConfig[K]> }): GameConfig => {
  const out: Record<string, unknown> = { ...config }
  for (const [key, value] of Object.entries(patch)) {
    out[key] = { ...(out[key] as object), ...(value as object) }
  }
  return out as GameConfig
}

/** A straight row of plains hexes on r = 0 with the base at (0,0); no tiles, so no spawns. */
function corridor(from: number, to: number): GameMap {
  const hexes: Record<string, GameMap['hexes'][string]> = {}
  for (let q = from; q <= to; q++) {
    const base = q === 0
    hexes[`${q},0`] = { terrain: 'plains', site: base ? 'base' : null, tile: base ? 'base' : 't' }
  }
  return { tiles: [], hexes }
}

/** A round 1 state on `map`, the player on `player`, with these enemies. */
function board(
  map: GameMap,
  player: Axial,
  enemies: Enemy[],
  patch: Partial<GameState> = {},
): GameState {
  const s = createGame(config, 1)
  return {
    ...s,
    phase: 'prepare',
    unplaced: [],
    map,
    enemies,
    nextEnemyId: 100,
    players: [{ ...s.players[0]!, hex: player }],
    ...patch,
  }
}

const grunt = (id: string, q: number, r: number, attackedThisCombat = false): Enemy => ({
  id,
  kind: 'grunt',
  health: 2,
  hex: { q, r },
  attackedThisCombat,
})

/** Base tile at (0,0) and Stony Fields (1 spawn node) east of it, revealed in `round`. */
const twoTiles = (round = 0) =>
  placeTile(
    placeTile(EMPTY_MAP, tile('broken-village'), BASE_HEX, 0),
    tile('stony-fields'),
    { q: 2, r: 1 },
    round,
  )

/** An exchange at its end (step 8): no dice, nothing queued. */
const ended: Exchange = {
  step: 'targets',
  dice: [],
  rollsUsed: 1,
  rerollsLeft: 0,
  rerolled: [],
  bonusDamage: 0,
  ignoreHits: 0,
  assignments: [],
  queue: [],
  skirmish: null,
}

describe('row 63 forced reveal (clock.forcedRevealEvery)', () => {
  const clock = (every: number | null) => withConfig({ clock: { forcedRevealEvery: every } })

  it('off: never due', () => {
    const s = { ...createGame(config, 1), round: 9 }
    expect(forcedRevealDue(s)).toBe(false)
    expect(forcedReveal(s)).toEqual([s, []])
  })

  it('due when no tile was revealed in the last N rounds; reveals in the open slot nearest the base', () => {
    const s0 = createGame(clock(3), 1)
    expect(forcedRevealDue({ ...s0, round: 2 })).toBe(false)
    const s = { ...s0, round: 3 }
    expect(forcedRevealDue(s)).toBe(true)
    const [after, events] = forcedReveal(s)
    const nearest = Math.min(...emptySlots(s.map).map((c) => hexDistance(c, BASE_HEX)))
    const placed = after.map.tiles[1]!
    expect(placed).toEqual({ tile: s.tileDeck[0], center: emptySlots(s.map)[0], revealedRound: 3 })
    expect(hexDistance(placed.center, BASE_HEX)).toBe(nearest)
    expect(after.tileDeck).toEqual(s.tileDeck.slice(1))
    expect(after.progress).toMatchObject({ tilesRevealed: 1, lastRevealRound: 3 })
    expect(events.map((e) => [e.type, e.rule])).toEqual([
      ['tileRevealed', '10.1, row 63'],
      ['tilePlaced', '10.1, row 63'],
    ])
    // A reveal resets the count: not due again until 3 more rounds pass.
    expect(forcedRevealDue({ ...after, round: 5 })).toBe(false)
    expect(forcedRevealDue({ ...after, round: 6 })).toBe(true)
  })

  it('a player reveal in the last N rounds holds the clock; an empty tile deck stops it', () => {
    const s0 = createGame(clock(3), 1)
    expect(
      forcedRevealDue({ ...s0, round: 4, progress: { ...s0.progress, lastRevealRound: 2 } }),
    ).toBe(false)
    expect(forcedRevealDue({ ...s0, round: 9, tileDeck: [] })).toBe(false)
  })

  it('runs at round end: a run where nobody steps off the map still gets a tile', () => {
    // A policy that never moves: every Move stops at once.
    const stay = (st: GameState) =>
      legalActions(st).find((a) => a.type === 'stopMoving') ?? scriptedChoice(st)
    const run = walk(createGame(clock(1), 5), stay, (st) => st.round === 2 || st.phase === 'ended')
    const s = run.states.at(-1)!
    expect(s.round).toBe(2)
    expect(s.map.tiles).toHaveLength(2)
    expect(s.map.tiles[1]!.revealedRound).toBe(1)
    expect(s.progress.lastRevealRound).toBe(1)
    const off = walk(createGame(config, 5), stay, (st) => st.round === 2 || st.phase === 'ended')
    expect(off.states.at(-1)!.map.tiles).toHaveLength(1)
  })
})

describe('row 64 spawn ramp and row 68 seat scaling (spawnCount)', () => {
  it('off: 1 per node in every round and at every seat count', () => {
    for (const players of [1, 2, 3, 4]) {
      const s = createGame(config, 1, defaultContent, { players })
      expect(spawnCount({ ...s, round: 12 })).toBe(1)
    }
  })

  it('row 64: 1 + floor((round - 1) / N)', () => {
    const s = createGame(withConfig({ spawn: { rampEvery: 4 } }), 1)
    expect([1, 4, 5, 8, 9].map((round) => spawnCount({ ...s, round }))).toEqual([1, 1, 2, 2, 3])
  })

  it('row 68: 1 per 2 seats, rounded up', () => {
    const counts = [1, 2, 3, 4].map((players) =>
      spawnCount(
        createGame(withConfig({ spawn: { perSeat: true } }), 1, defaultContent, { players }),
      ),
    )
    expect(counts).toEqual([1, 1, 2, 2])
  })

  it('ramp and seats add up; every extra enemy uses spill-over', () => {
    const cfg = withConfig({ spawn: { rampEvery: 1, perSeat: true } })
    const s = { ...board(twoTiles(), { q: -1, r: 0 }, []), config: cfg, round: 2 }
    const duo = {
      ...s,
      players: [s.players[0]!, { ...s.players[0]!, id: 'p2', hex: { q: 0, r: 1 } }],
    }
    expect(spawnCount(duo)).toBe(2)
    const [after, events] = spawnAtNodes(duo)
    expect(after.enemies).toHaveLength(2)
    expect(events.map((e) => e.type === 'enemySpawned' && e.spilled)).toEqual([false, true])
  })
})

describe('row 66 new tiles wait (spawn.newTileDelay)', () => {
  it('off: a tile revealed this round spawns at this Combat', () => {
    const s = { ...board(twoTiles(1), { q: -1, r: 0 }, []), round: 1 }
    expect(activeSpawnNodes(s)).toHaveLength(1)
  })

  it('delay 1: the tile first spawns at the Combat of the next round', () => {
    const cfg = withConfig({ spawn: { newTileDelay: 1 } })
    const s = { ...board(twoTiles(1), { q: -1, r: 0 }, []), config: cfg, round: 1 }
    expect(spawnNodes(s)).toHaveLength(1)
    expect(activeSpawnNodes(s)).toEqual([])
    expect(spawnAtNodes(s)[0].enemies).toEqual([])
    expect(activeSpawnNodes({ ...s, round: 2 })).toHaveLength(1)
  })
})

describe('row 70 spawn range (spawn.nodeRange)', () => {
  /** Stony Fields far east, at (9,-4): its node is out of reach of the base. */
  const far = () =>
    placeTile(placeTile(EMPTY_MAP, tile('broken-village'), BASE_HEX), tile('stony-fields'), {
      q: 9,
      r: -4,
    })

  it('off: every node spawns', () => {
    const s = board(far(), { q: 0, r: 0 }, [])
    expect(activeSpawnNodes(s)).toHaveLength(1)
  })

  it('only nodes within N hexes of a figure, a defense, or a Base tile hex spawn', () => {
    const cfg = withConfig({ spawn: { nodeRange: 2 } })
    const s = { ...board(far(), { q: 0, r: 0 }, []), config: cfg }
    const node = spawnNodes(s)[0]!
    expect(nodeInRange(s, node)).toBe(false)
    expect(activeSpawnNodes(s)).toEqual([])
    const near = { q: node.hex.q - 2, r: node.hex.r }
    const figure = { ...s, players: [{ ...s.players[0]!, hex: near }] }
    expect(nodeInRange(figure, node)).toBe(true)
    const tower = {
      ...s,
      defenses: [{ id: 'd1', kind: 'tower', hex: near, health: 3, builder: 'p1' }],
    }
    expect(nodeInRange(tower, node)).toBe(true)
    const knocked = { ...figure, players: [{ ...figure.players[0]!, knockedOut: true }] }
    expect(nodeInRange(knocked, node)).toBe(false)
  })
})

describe('row 65 each enemy attacks once per Combat (combat.enemyAttacks)', () => {
  // e1 on (3,0) targets the player on (2,0) (the base is 3 away, row 56).
  const exchange = (cfg: GameConfig) => ({
    ...board(corridor(-6, 6), { q: 2, r: 0 }, [grunt('e1', 3, 0)]),
    config: cfg,
    phase: 'combat' as const,
    exchange: ended,
  })
  const attacks = (s: GameState) => finishExchange(s)[1].filter((e) => e.type === 'enemyAttacked')

  it('off: the enemy attacks at the end of every exchange and is never tipped', () => {
    const s = exchange(config)
    const [after] = finishExchange(s)
    expect(after.enemies[0]!.attackedThisCombat).toBe(false)
    expect(attacks({ ...after, exchange: ended })).toHaveLength(1)
  })

  it('once per Combat: the enemy attacks once, is tipped over, and stands up at Combat start', () => {
    const s = exchange(withConfig({ combat: { enemyAttacks: 'once-per-combat' } }))
    expect(attacks(s)).toHaveLength(1)
    const [after] = finishExchange(s)
    expect(after.enemies[0]!.attackedThisCombat).toBe(true)
    expect(exchangeAttackers({ ...after, exchange: ended })).toEqual([])
    expect(attacks({ ...after, exchange: ended })).toEqual([])
    expect(standEnemiesUp(after).enemies[0]!.attackedThisCombat).toBe(false)
  })

  it('a tipped enemy skips the structure attack step', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 1, 0, true), grunt('e2', -1, 0)])
    const [, events] = structureAttacks(s)
    expect(events.filter((e) => e.type === 'structureAttacked').map((e) => e.enemy)).toEqual(['e2'])
  })
})

describe('row 69 adjacent enemies attack (combat.adjacentAttack)', () => {
  // e1 on (1,0) is next to the base and to the player on (2,0): its target is the base.
  const guarding = (cfg: GameConfig) => ({
    ...board(corridor(-6, 6), { q: 2, r: 0 }, [grunt('e1', 1, 0)]),
    config: cfg,
  })

  it('off: an enemy attacks only its target', () => {
    expect(exchangeAttackers(guarding(config))).toEqual([])
  })

  it('any adjacent: every enemy next to the player attacks it, whatever its target', () => {
    const s = guarding(withConfig({ combat: { adjacentAttack: 'any-adjacent' } }))
    expect(exchangeAttackers(s).map((e) => e.id)).toEqual(['e1'])
  })
})

describe('row 67 Gather off a node (gather.offNodeAmount)', () => {
  const on = (cfg: GameConfig, hex: Axial, patch: Partial<GameState> = {}) => ({
    ...board(twoTiles(), hex, []),
    config: cfg,
    ...patch,
  })
  const node = () => {
    const s = board(twoTiles(), { q: 0, r: 0 }, [])
    const [key] = Object.entries(s.map.hexes).find(([, h]) => h.site === 'gathering-node')!
    const [q = 0, r = 0] = key.split(',').map(Number)
    return { q, r }
  }
  const one = withConfig({ gather: { offNodeAmount: 1 } })

  it('off: Gather off a node or on a spent node gives nothing', () => {
    expect(gather(on(config, { q: 0, r: 0 }), 2)[0].players[0]!.materials).toBe(0)
    expect(gather(on(config, node(), { spentNodes: [node()] }), 2)[0].players[0]!.materials).toBe(0)
  })

  it('on: off a node and on a spent node give the off-node amount; a live node gives the card amount', () => {
    expect(gather(on(one, { q: 0, r: 0 }), 2)[0].players[0]!.materials).toBe(1)
    const spent = on(one, node(), { spentNodes: [node()] })
    const [after] = gather(spent, 2)
    expect(after.players[0]!.materials).toBe(1)
    expect(after.spentNodes).toHaveLength(1)
    const [live] = gather(on(one, node()), 2)
    expect(live.players[0]!.materials).toBe(2)
    expect(live.spentNodes).toEqual([node()])
  })

  it('an enemy on the hex still blocks Gather (6.9)', () => {
    const blocked = on(one, { q: 0, r: 1 }, { enemies: [grunt('e1', 0, 1)] })
    expect(gather(blocked, 2)[0].players[0]!.materials).toBe(0)
  })
})

describe('row 17 experience experiments', () => {
  const elite = (s: GameState): GameState => ({
    ...s,
    enemies: [{ ...grunt('e1', 1, 0), kind: 'elite', health: 1 }],
  })

  it('off: an elite gives its Table 5 experience', () => {
    const [s] = damageEnemy(elite(board(corridor(-3, 3), { q: 0, r: 0 }, [])), 'e1', 1, 'p1')
    expect(s.experience).toBe(4)
  })

  it('eliteBonus adds to the experience of a defeated elite only', () => {
    const cfg = withConfig({ experience: { eliteBonus: 5 } })
    const s = { ...board(corridor(-3, 3), { q: 0, r: 0 }, []), config: cfg }
    expect(damageEnemy(elite(s), 'e1', 1, 'p1')[0].experience).toBe(9)
    const withGrunt = { ...s, enemies: [grunt('e1', 1, 0)] }
    expect(damageEnemy(withGrunt, 'e1', 2, 'p1')[0].experience).toBe(1)
  })

  it('levelPerEliteSpawn: each elite spawn raises the level by 1; experience does not', () => {
    const cfg = withConfig({ experience: { levelPerEliteSpawn: true } })
    const s = { ...board(twoTiles(), { q: -1, r: 0 }, []), config: cfg }
    const [after, events] = spawnEnemy(s, 'elite', { q: 2, r: 0 })
    expect(after.level).toBe(2)
    expect(after.players[0]!.dice).toBe(s.players[0]!.dice + 1)
    expect(events.map((e) => e.type)).toEqual(['enemySpawned', 'levelReached', 'diceGained'])
    const [grunted] = spawnEnemy(s, 'grunt', { q: 2, r: 0 })
    expect(grunted.level).toBe(1)
    const rich = { ...s, experience: 100, enemies: [grunt('e1', 1, 0)] }
    expect(damageEnemy(rich, 'e1', 2, 'p1')[0].level).toBe(1)
  })

  it('levelPerEliteSpawn: a promotion at the miniature limit counts; options.maxLevel caps it', () => {
    const cfg = withConfig({ experience: { levelPerEliteSpawn: true } })
    const capped = { ...cfg, miniatureLimit: 1, options: { ...cfg.options, maxLevel: 2 } }
    const s = { ...board(twoTiles(), { q: -1, r: 0 }, [grunt('e1', 3, 0)]), config: capped }
    const [once] = spawnEnemy(s, 'grunt', { q: 2, r: 0 })
    expect(once.level).toBe(2)
    const [twice] = spawnEnemy({ ...once, enemies: [grunt('e2', 3, 0)] }, 'grunt', { q: 2, r: 0 })
    expect(twice.level).toBe(2)
  })
})

describe('run counters and version 4', () => {
  it('capReachedRound records the round of the first promotion only', () => {
    const cfg = { ...config, miniatureLimit: 1 }
    const s = { ...board(twoTiles(), { q: -1, r: 0 }, [grunt('e1', 3, 0)]), config: cfg, round: 4 }
    expect(s.progress.capReachedRound).toBeNull()
    const [once] = spawnEnemy(s, 'grunt', { q: 2, r: 0 })
    expect(once.progress.capReachedRound).toBe(4)
    const [again] = spawnEnemy({ ...once, round: 6, enemies: [grunt('e2', 3, 0)] }, 'grunt', {
      q: 2,
      r: 0,
    })
    expect(again.progress.capReachedRound).toBe(4)
  })

  it('a new game is version 4 and round-trips through serialize', () => {
    const s = createGame(config, 3)
    expect(s.version).toBe(4)
    expect(s.progress).toMatchObject({ lastRevealRound: 0, capReachedRound: null })
    expect(deserialize(serialize(s))).toEqual(s)
  })
})
