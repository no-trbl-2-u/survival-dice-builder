import { DIE_FACES } from '@survival/engine'
import { Euler, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { faceLayout, poseAt, throwFor, TOP } from './orientation.ts'

/** The world direction of a box side's normal after a pose's rotation. */
const NORMALS = [
  new Vector3(1, 0, 0),
  new Vector3(-1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, -1, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 0, -1),
]
const sideUp = (x: number, y: number, z: number) => {
  const e = new Euler(x, y, z)
  const ups = NORMALS.map((n) => n.clone().applyEuler(e).y)
  return ups.indexOf(Math.max(...ups))
}

describe('3D die orientation', () => {
  it('puts the rolled face on top and keeps all 6 faces', () => {
    for (const face of DIE_FACES) {
      const layout = faceLayout(face)
      expect(layout[TOP]).toBe(face)
      expect([...layout].sort()).toEqual([...DIE_FACES].sort())
    }
  })

  it('every throw comes to rest with the top side up, on the table', () => {
    for (let die = 0; die < 8; die++) {
      for (let roll = 1; roll <= 4; roll++) {
        const th = throwFor(die, roll)
        const end = poseAt(1, th)
        expect(sideUp(end.x, end.y, end.z)).toBe(TOP)
        expect(end.height).toBeCloseTo(0)
        expect(poseAt(0, th).height).toBeCloseTo(th.drop)
      }
    }
  })

  it('the rolled face is the one facing up at rest', () => {
    for (const face of DIE_FACES) {
      const end = poseAt(1, throwFor(2, 1))
      expect(faceLayout(face)[sideUp(end.x, end.y, end.z)]).toBe(face)
    }
  })
})
