import fc from 'fast-check'
import { describe, it } from 'vitest'
import { hexDistance, hexKey, hexNeighbors } from './hex.ts'

const axial = fc.record({
  q: fc.integer({ min: -1000, max: 1000 }),
  r: fc.integer({ min: -1000, max: 1000 }),
})

describe('hex properties', () => {
  it('every hex has 6 distinct neighbours, each at distance 1', () => {
    fc.assert(
      fc.property(axial, (hex) => {
        const ns = hexNeighbors(hex)
        return (
          ns.length === 6 &&
          new Set(ns.map(hexKey)).size === 6 &&
          ns.every((n) => hexDistance(hex, n) === 1)
        )
      }),
    )
  })

  it('distance is symmetric', () => {
    fc.assert(fc.property(axial, axial, (a, b) => hexDistance(a, b) === hexDistance(b, a)))
  })
})
