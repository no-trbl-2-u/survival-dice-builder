import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { DIE_FACES, rerollOne, rerollUnkept, rollDice, toggleKeep } from './dice.ts'

describe('dice', () => {
  it('2.3 every roll is one of the 6 faces', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer({ min: 1, max: 12 }), (seed, n) => {
        const [faces] = rollDice(seed >>> 0, n)
        return faces.length === n && faces.every((f) => DIE_FACES.includes(f))
      }),
    )
  })

  it('7.8 step 3 kept dice keep their face when the others are rolled again', () => {
    fc.assert(
      fc.property(fc.integer(), (seed) => {
        const [faces, rng] = rollDice(seed >>> 0, 4)
        const dice = toggleKeep(
          faces.map((face) => ({ face, kept: false })),
          1,
        )
        const [after] = rerollUnkept(rng, dice)
        return after[1]?.face === dice[1]?.face && after[1]?.kept === true
      }),
    )
  })

  it('7.8 step 5 a reroll effect changes only the chosen die', () => {
    const dice = [
      { face: 'Blank' as const, kept: false },
      { face: 'Sword' as const, kept: true },
    ]
    const [after] = rerollOne(3, dice, 0)
    expect(after[1]).toEqual(dice[1])
  })
})
