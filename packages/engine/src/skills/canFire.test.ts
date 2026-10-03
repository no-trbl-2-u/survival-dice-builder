import type { Face, SkillFace } from '@survival/content'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { DIE_FACES } from '../dice/dice.ts'
import { canFire } from './canFire.ts'

const SKILL_FACES: SkillFace[] = ['Sword', 'Wand', 'Bow', 'Shield']

/** Reference matcher: tries every way to give each needed slot its own die. */
function bruteForce(faces: readonly Face[], need: readonly SkillFace[]): boolean {
  const used = new Array(faces.length).fill(false)
  const fill = (slot: number): boolean => {
    if (slot === need.length) return true
    for (let d = 0; d < faces.length; d++) {
      const f = faces[d]
      if (used[d] || !(f === need[slot] || f === 'Star')) continue
      used[d] = true
      if (fill(slot + 1)) return true
      used[d] = false
    }
    return false
  }
  return fill(0)
}

describe('canFire', () => {
  it('2.4 a Star counts as any one face', () => {
    expect(canFire(['Star'], ['Sword'])).toBe(true)
    expect(canFire(['Sword', 'Star'], ['Sword', 'Sword'])).toBe(true)
  })

  it('2.4 one Star never fills two slots', () => {
    expect(canFire(['Star'], ['Sword', 'Wand'])).toBe(false)
    expect(canFire(['Star', 'Bow'], ['Wand', 'Wand', 'Bow'])).toBe(false)
  })

  it('2.5 a Blank fills nothing', () => {
    expect(canFire(['Blank'], ['Shield'])).toBe(false)
  })

  it('property: matches an exhaustive one-die-per-slot search (Stars never counted twice)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...DIE_FACES), { maxLength: 7 }),
        fc.array(fc.constantFrom(...SKILL_FACES), { minLength: 1, maxLength: 5 }),
        (faces, need) => canFire(faces, need) === bruteForce(faces, need),
      ),
    )
  })
})
