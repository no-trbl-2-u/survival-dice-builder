import { describe, expect, it } from 'vitest'
import { defaultContent } from '@survival/content'
import { createGame } from '../api/createGame.ts'
import { hexDistance, hexKey, type Axial } from '../hex.ts'
import type { Defense, Enemy, GameMap, GameState, MapHex } from '../state/types.ts'
import { pathNextTo } from './pathing.ts'

const BASE: Axial = { q: 0, r: 0 }
const FAR: Axial = { q: 99, r: 99 }

/** Every hex within `radius` of the base, plains, with the base hex at (0,0). */
function disc(radius: number, terrain: Record<string, MapHex['terrain']> = {}): GameMap {
  const hexes: Record<string, MapHex> = {}
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      if (hexDistance({ q, r }, BASE) > radius) continue
      const key = `${q},${r}`
      const base = q === 0 && r === 0
      hexes[key] = { terrain: terrain[key] ?? 'plains', site: base ? 'base' : null, tile: 'test' }
    }
  }
  return { tiles: [], hexes }
}

/** A state on `map` with the player parked off the map unless `player` is given. */
function on(
  map: GameMap,
  extra: { enemies?: Enemy[]; defenses?: Defense[]; player?: Axial } = {},
): GameState {
  const s = createGame(defaultContent.config, 1)
  return {
    ...s,
    unplaced: [],
    map,
    enemies: extra.enemies ?? [],
    defenses: extra.defenses ?? [],
    players: s.players.map((p) => ({ ...p, hex: extra.player ?? FAR })),
  }
}

const keys = (path: Axial[] | null) => path?.map(hexKey) ?? null
const grunt = (q: number, r: number): Enemy => ({
  id: 'e9',
  kind: 'grunt',
  health: 2,
  hex: { q, r },
})
const barricade = (q: number, r: number): Defense => ({
  id: 'd1',
  kind: 'barricade',
  hex: { q, r },
  health: 4,
  builder: 'p1',
})

describe('pathNextTo', () => {
  it('9.4 an enemy already next to the goal has no steps to take', () => {
    expect(pathNextTo(on(disc(3)), { q: 1, r: 0 }, BASE)).toEqual([])
  })

  it('9.4 the path runs straight in and ends on a hex next to the goal', () => {
    expect(keys(pathNextTo(on(disc(3)), { q: 3, r: 0 }, BASE))).toEqual(['2,0', '1,0'])
  })

  it('3.4 a lake on the straight line costs 1 extra step; ties go to the first direction', () => {
    const path = pathNextTo(on(disc(3, { '1,0': 'lake' })), { q: 3, r: 0 }, BASE)
    expect(keys(path)).toEqual(['3,-1', '2,-1', '1,-1'])
    expect(hexDistance(path!.at(-1)!, BASE)).toBe(1)
  })

  it('3.4 the path never steps on a lake or mountain', () => {
    const terrain = { '2,0': 'lake', '2,-1': 'mountain', '1,0': 'lake' } as const
    const path = pathNextTo(on(disc(3, terrain)), { q: 3, r: 0 }, BASE)!
    expect(path.map(hexKey)).not.toEqual(expect.arrayContaining(['2,0', '2,-1', '1,0']))
    let from: Axial = { q: 3, r: 0 }
    for (const hex of path) {
      expect(hexDistance(from, hex)).toBe(1)
      from = hex
    }
    expect(hexDistance(from, BASE)).toBe(1)
  })

  it('9.7 another enemy, a figure or a defense on the only way in blocks the path', () => {
    const corridor: GameMap = {
      tiles: [],
      hexes: Object.fromEntries(
        [0, 1, 2, 3, 4].map((q) => [
          `${q},0`,
          { terrain: 'plains', site: q === 0 ? 'base' : null, tile: 'test' } as MapHex,
        ]),
      ),
    }
    const from = { q: 4, r: 0 }
    expect(keys(pathNextTo(on(corridor), from, BASE))).toEqual(['3,0', '2,0', '1,0'])
    expect(pathNextTo(on(corridor, { enemies: [grunt(2, 0)] }), from, BASE)).toBeNull()
    expect(pathNextTo(on(corridor, { player: { q: 2, r: 0 } }), from, BASE)).toBeNull()
    expect(pathNextTo(on(corridor, { defenses: [barricade(2, 0)] }), from, BASE)).toBeNull()
  })

  it('9.4 the path does not cross other base hexes to reach a far goal', () => {
    const map = disc(2)
    const hexes = { ...map.hexes, '-1,0': { ...map.hexes['-1,0']!, site: 'base' as const } }
    const path = pathNextTo(on({ ...map, hexes }), { q: 1, r: 0 }, { q: -2, r: 0 })!
    expect(path.map(hexKey)).not.toContain('0,0')
    expect(path.map(hexKey)).not.toContain('-1,0')
    expect(hexDistance(path.at(-1)!, { q: -2, r: 0 })).toBe(1)
  })

  it('leaves the state it reads unchanged', () => {
    const state = on(disc(3, { '1,0': 'lake' }))
    const before = JSON.stringify(state)
    pathNextTo(state, { q: 3, r: 0 }, BASE)
    expect(JSON.stringify(state)).toBe(before)
  })
})
