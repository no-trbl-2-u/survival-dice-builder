import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { nextFloat, nextInt, seedRng, shuffle } from './rng.ts'

describe('rng', () => {
  it('the same seed gives the same sequence', () => {
    const a = nextFloat(seedRng(42))
    const b = nextFloat(seedRng(42))
    expect(a).toEqual(b)
  })

  it('floats are in [0, 1) and ints in [0, n)', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer({ min: 1, max: 100 }), (seed, n) => {
        const [f] = nextFloat(seedRng(seed))
        const [i] = nextInt(seedRng(seed), n)
        return f >= 0 && f < 1 && i >= 0 && i < n && Number.isInteger(i)
      }),
    )
  })

  it('shuffle keeps every item and does not change its input', () => {
    fc.assert(
      fc.property(fc.integer(), fc.array(fc.integer(), { maxLength: 30 }), (seed, items) => {
        const copy = [...items]
        const [out] = shuffle(seedRng(seed), items)
        return (
          JSON.stringify(items) === JSON.stringify(copy) &&
          JSON.stringify([...out].sort()) === JSON.stringify([...items].sort())
        )
      }),
    )
  })
})
