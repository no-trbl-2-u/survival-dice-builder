import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { damageEnemy } from '../src/combat/resolve.ts'
import { moveEnemies } from '../src/enemies/movement.ts'
import { refillNodes, spawnNodes, waveStep } from '../src/enemies/spawning.ts'
import { structureAttacks, towerAttacks } from '../src/enemies/structures.ts'
import { rankTargets } from '../src/enemies/targets.ts'
import { startExplore } from '../src/explore/explore.ts'
import { hexKey, type Axial } from '../src/hex.ts'
import { applyAction, createGame, legalActions, type GameState } from '../src/index.ts'
import { miniatureCount, spawnEnemy } from '../src/map/spawn.ts'
import { EMPTY_MAP, placeTile } from '../src/map/tiles.ts'
import type { Enemy, GameMap } from '../src/state/types.ts'

const config = defaultContent.config
const tile = (id: string) => defaultContent.tiles.find((t) => t.id === id)!

/**
 * A straight row of plains hexes from q = `from` to q = `to` on r = 0, with the base at (0,0).
 * No tiles are listed, so nothing refills or arrives in a wave unless a test adds tiles.
 */
function corridor(from: number, to: number): GameMap {
  const hexes: Record<string, GameMap['hexes'][string]> = {}
  for (let q = from; q <= to; q++) {
    hexes[`${q},0`] = { terrain: 'plains', site: q === 0 ? 'base' : null, tile: 'test' }
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
    revealed: [],
    map,
    enemies,
    nextEnemyId: 100,
    players: [{ ...p, hex: player }],
    ...patch,
  }
  return state
}

const grunt = (id: string, q: number, r: number, home?: Axial): Enemy => ({
  id,
  kind: 'grunt',
  health: 2,
  hex: { q, r },
  ...(home ? { home } : {}),
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
      defenses: [{ id: 'd1', kind: 'barricade', hex: { q: 4, r: 0 }, health: 4 }],
    })
    expect(rankTargets(s, { q: 3, r: 0 }).map((t) => t.id)).toEqual(['d1', 'base', 'p1'])
  })

  it('9.3 row 15 at equal distance: player, then Tower, then Barricade, then base', () => {
    const s = board(corridor(-6, 6), { q: 4, r: 0 }, [], {
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 0, r: 0 }, health: 3 }],
    })
    expect(rankTargets(s, { q: 2, r: 0 }).map((t) => t.id)).toEqual(['p1', 'd1', 'base'])
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
      defenses: [{ id: 'd1', kind: 'barricade', hex: { q: 2, r: 0 }, health: 4 }],
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
    const s = board(corridor(-6, 6), { q: 5, r: 0 }, [grunt('e1', 3, 0), grunt('e2', 4, 0)])
    const [after, events] = moveEnemies(s)
    expect(events.find((e) => e.type === 'enemyMoved' && e.enemy === 'e1')).toMatchObject({
      target: 'base',
    })
    expect(at(after, 'e1')).toEqual({ q: 1, r: 0 })
  })

  it('9.7 with blockedPathRule "wait" a blocked enemy waits', () => {
    const waiting = { ...config, rulings: { ...config.rulings, blockedPathRule: 'wait' as const } }
    const s = board(corridor(-6, 6), { q: 5, r: 0 }, [grunt('e1', 3, 0), grunt('e2', 4, 0)], {
      config: waiting,
    })
    expect(at(moveEnemies(s)[0], 'e1')).toEqual({ q: 3, r: 0 })
  })

  it('3.4, 9.4 an enemy never steps onto the base, a figure, a defense, or another enemy', () => {
    const s = board(corridor(-6, 6), { q: -2, r: 0 }, [grunt('e1', 3, 0), grunt('e2', -5, 0)], {
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 5, r: 0 }, health: 3 }],
    })
    const [after] = moveEnemies(s)
    const taken = new Set([hexKey({ q: 0, r: 0 }), hexKey({ q: -2, r: 0 }), hexKey({ q: 5, r: 0 })])
    for (const e of after.enemies) expect(taken.has(hexKey(e.hex))).toBe(false)
  })
})

describe('spawning (7.3, 9.2, 10.4, 10.5)', () => {
  it('7.3, 9.2 a spawn node refills only when its enemy was defeated', () => {
    const map = twoTiles()
    const s = board(map, { q: 0, r: 0 }, [])
    const nodes = spawnNodes(s)
    expect(nodes).toHaveLength(1)
    const home = nodes[0]!.hex
    // Its enemy walked away but is alive: the node is empty but not vacant, so no refill.
    const away = board(map, { q: 0, r: 0 }, [grunt('e1', 1, 1, home)])
    expect(refillNodes(away)[1]).toEqual([])
    // Defeating that enemy makes the node vacant; the next refill puts a new grunt on it.
    const [defeated] = damageEnemy(away, 'e1', 2, 'p1')
    expect(defeated.vacantNodes).toEqual([home])
    const [refilled, events] = refillNodes(defeated)
    expect(refilled.enemies).toHaveLength(1)
    expect(refilled.vacantNodes).toEqual([])
    expect(events[0]).toMatchObject({ type: 'enemySpawned', rule: '7.3', hex: home })
  })

  it('7.3 row 21 an elite spawn node refills with an elite', () => {
    const map = placeTile(twoTiles(), tile('ash-waste'), { q: -1, r: 3 })
    const s = board(map, { q: 0, r: 0 }, [])
    const [after] = refillNodes({ ...s, vacantNodes: spawnNodes(s).map((n) => n.hex) })
    expect(after.enemies.map((e) => e.kind).sort()).toEqual(['elite', 'grunt', 'grunt'])
  })

  it('10.4 the wave step puts 1 grunt per spawn node per wave point, spilling over', () => {
    const s = board(twoTiles(), { q: 0, r: 0 }, [], { waveTrack: 2 })
    const [after, events] = waveStep(s)
    expect(after.enemies).toHaveLength(2)
    expect(after.enemies.every((e) => e.home === undefined)).toBe(true)
    expect(events.map((e) => e.rule)).toEqual(['10.4', '9.8'])
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

  it('2.2 row 32 at the miniature limit a new elite is not placed', () => {
    const limited = { ...config, miniatureLimit: 1 }
    const s = board(twoTiles(), { q: 0, r: 0 }, [grunt('e1', 3, 0)], { config: limited })
    expect(spawnEnemy(s, 'elite', { q: 2, r: 0 })[0].enemies).toHaveLength(1)
  })
})

describe('Towers and structures (7.6, 7.11-7.12, 12.3, 14.1)', () => {
  it('12.3 a Tower gives 2 damage to the nearest enemy within 2 hexes', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 5, 0), grunt('e2', 4, 0)], {
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 3, r: 0 }, health: 3 }],
    })
    const [after, events] = towerAttacks(s)
    expect(events[0]).toMatchObject({ type: 'towerAttacked', enemy: 'e2', damage: 2 })
    expect(after.enemies.map((e) => e.id)).toEqual(['e1'])
  })

  it('12.3 a Tower with no enemy within 2 hexes does nothing', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 6, 0)], {
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 3, r: 0 }, health: 3 }],
    })
    expect(towerAttacks(s)[1]).toEqual([])
  })

  it('7.12 an enemy attacks a Barricade before the base', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 1, 0)], {
      defenses: [{ id: 'd1', kind: 'barricade', hex: { q: 2, r: 0 }, health: 4 }],
    })
    expect(structureAttacks(s)[1][0]).toMatchObject({ structure: 'd1' })
  })

  it('7.11 an enemy next to a player does not attack a structure', () => {
    const s = board(corridor(-6, 6), { q: 2, r: 0 }, [grunt('e1', 1, 0)])
    expect(structureAttacks(s)[1]).toEqual([])
  })

  it('12.4 a defense at 0 health is removed', () => {
    const s = board(corridor(-6, 6), { q: -6, r: 0 }, [grunt('e1', 3, 0)], {
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 4, r: 0 }, health: 2 }],
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

describe('Explore (10.1-10.3, 18.1)', () => {
  const exploring = (exploration: 'forced' | 'optional' | 'automatic', tileDeck?: string[]) => {
    const cfg = { ...config, options: { ...config.options, exploration } }
    const s = board(twoTiles(), { q: 0, r: 0 }, [], { config: cfg, phase: 'explore' })
    return tileDeck ? { ...s, tileDeck } : s
  }

  it('10.1 forced: the top tile is revealed and the player chooses its slot', () => {
    const [s] = startExplore(exploring('forced', ['meadowlands', 'old-woods']))
    expect(s.revealed).toEqual(['meadowlands'])
    expect(s.tileDeck).toEqual(['old-woods'])
    expect(legalActions(s).every((a) => a.type === 'placeTile')).toBe(true)
    const { state, events } = applyAction(s, legalActions(s)[0]!)
    expect(state.map.tiles).toHaveLength(3)
    expect(events[0]).toMatchObject({ type: 'tilePlaced', rule: '10.1' })
    expect(state.phase).toBe('prepare')
    expect(state.round).toBe(2)
  })

  it('10.2 the new tile gets 1 enemy on each spawn node', () => {
    const [s] = startExplore(exploring('forced', ['meadowlands']))
    const { events } = applyAction(s, legalActions(s)[0]!)
    expect(events.filter((e) => e.type === 'enemySpawned')).toHaveLength(1)
  })

  it('18.1 automatic: the tile is placed in the empty slot nearest the base', () => {
    const [s] = startExplore(exploring('automatic', ['meadowlands']))
    expect(s.map.tiles).toHaveLength(3)
    expect(s.revealed).toEqual([])
  })

  it('18.1 optional: the player may skip the reveal', () => {
    const [s] = startExplore(exploring('optional', ['meadowlands']))
    expect(legalActions(s)).toEqual([{ type: 'skipReveal' }, { type: 'revealTile' }])
    const skipped = applyAction(s, { type: 'skipReveal' }).state
    expect(skipped.tileDeck).toEqual(['meadowlands'])
    const revealed = applyAction(s, { type: 'revealTile' }).state
    expect(revealed.revealed).toEqual(['meadowlands'])
  })

  it('10.3, 15.2 with an empty tile deck the wave track goes up by 1 and no tile is revealed', () => {
    const [s, events] = startExplore(exploring('forced', []))
    expect(s.waveTrack).toBe(1)
    expect(s.revealed).toEqual([])
    expect(events[0]).toMatchObject({ type: 'waveTrackAdvanced', rule: '10.3' })
  })
})
