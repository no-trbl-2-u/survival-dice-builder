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
})
