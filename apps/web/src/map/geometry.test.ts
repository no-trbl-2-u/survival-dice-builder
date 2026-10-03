import { describe, expect, it } from 'vitest'
import { hexPolygonPoints, hexToPixel } from './geometry.ts'

describe('geometry', () => {
  it('the origin hex is centered at 0,0', () => {
    expect(hexToPixel({ q: 0, r: 0 }, 10)).toEqual({ x: 0, y: 0 })
  })

  it('a flat-top hex polygon has 6 corners', () => {
    expect(hexPolygonPoints({ x: 0, y: 0 }, 10).split(' ')).toHaveLength(6)
  })
})
