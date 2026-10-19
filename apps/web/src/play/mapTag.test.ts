import { describe, expect, it } from 'vitest'
import { placeTag } from './mapTag.ts'

const frame = { x: -200, y: -200, w: 400, h: 400 }
const at = { x: 0, y: 0, r: 16 }
const size = { w: 80, h: 30 }

describe('placeTag', () => {
  it('puts the tag right of the token when nothing is there', () => {
    expect(placeTag(at, size, frame, [])).toEqual({ side: 'right', x: 20, y: -15 })
  })

  it('moves the tag left when a figure stands to the right', () => {
    const you = { x: 50, y: 5, r: 9 }
    expect(placeTag(at, size, frame, [you]).side).toBe('left')
  })

  it('moves the tag left when the right side leaves the frame', () => {
    expect(placeTag({ ...at, x: 150 }, size, frame, []).side).toBe('left')
  })

  it('goes above when tokens stand on both sides', () => {
    const left = { x: -50, y: 0, r: 16 }
    const right = { x: 50, y: 0, r: 16 }
    expect(placeTag(at, size, frame, [left, right])).toEqual({ side: 'above', x: -40, y: -50 })
  })

  it('keeps the tag in the frame even if it must cover a token', () => {
    const corner = { x: 180, y: -180, r: 16 }
    const beside = { x: 120, y: -180, r: 16 }
    expect(placeTag(corner, size, frame, [beside]).side).toBe('left')
  })
})
