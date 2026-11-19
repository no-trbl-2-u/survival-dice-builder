import { describe, expect, it } from 'vitest'
import { AXIAL_DIRECTIONS, hexDistance, hexKey, hexNeighbors, tileHexes } from './hex.ts'

describe('hex', () => {
  it('3.1 neighbours of the origin are the 6 axial directions', () => {
    expect(hexNeighbors({ q: 0, r: 0 })).toEqual(AXIAL_DIRECTIONS)
  })

  it('3.1 a map tile has 7 hexes: 1 center hex and 6 outer hexes', () => {
    const hexes = tileHexes({ q: 2, r: -1 })
    expect(hexes).toHaveLength(7)
    expect(hexes[0]).toEqual({ q: 2, r: -1 })
    expect(new Set(hexes.map(hexKey)).size).toBe(7)
  })

  it('distance is 0 to itself and counts steps', () => {
    expect(hexDistance({ q: 0, r: 0 }, { q: 0, r: 0 })).toBe(0)
    expect(hexDistance({ q: 0, r: 0 }, { q: 2, r: -1 })).toBe(2)
    expect(hexDistance({ q: -2, r: 3 }, { q: 1, r: 0 })).toBe(3)
  })

  it('3.1 hexKey writes "q,r", the key of map.hexes, signs included', () => {
    expect(hexKey({ q: 0, r: 0 })).toBe('0,0')
    expect(hexKey({ q: -2, r: 3 })).toBe('-2,3')
    expect(hexKey({ q: 1, r: -11 })).not.toBe(hexKey({ q: 11, r: -1 }))
  })

  it('3.1 the 6 directions form a ring: each is next to the one after it, i + 3 is opposite i', () => {
    const origin = { q: 0, r: 0 }
    expect(new Set(AXIAL_DIRECTIONS.map(hexKey)).size).toBe(6)
    AXIAL_DIRECTIONS.forEach((d, i) => {
      expect(hexDistance(origin, d)).toBe(1)
      expect(hexDistance(d, AXIAL_DIRECTIONS[(i + 1) % 6]!)).toBe(1)
      const opposite = AXIAL_DIRECTIONS[(i + 3) % 6]!
      expect({ q: d.q + opposite.q, r: d.r + opposite.r }).toEqual(origin)
    })
  })

  it('3.1 hexNeighbors and tileHexes leave the input hex unchanged', () => {
    const hex = Object.freeze({ q: 3, r: -2 })
    expect(hexNeighbors(hex)[0]).toEqual({ q: 4, r: -2 })
    expect(tileHexes(hex)[0]).toBe(hex)
    expect(hex).toEqual({ q: 3, r: -2 })
  })
})
