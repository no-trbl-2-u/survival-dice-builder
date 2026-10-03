import { defaultContent } from '@survival/content'
import { AXIAL_DIRECTIONS, createGame } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { baseHex, bearing, hexContents, hexName, hexTitle, stepsAway } from './places.ts'

describe('places', () => {
  it('gives each neighbour its screen direction, and "here" for the same hex', () => {
    const origin = { q: 0, r: 0 }
    const words = AXIAL_DIRECTIONS.map((d) => bearing(origin, d))
    expect(new Set(words).size).toBe(6)
    expect(
      words.every((w) =>
        ['north', 'south', 'north-east', 'north-west', 'south-east', 'south-west'].includes(w),
      ),
    ).toBe(true)
    expect(bearing({ q: 0, r: 0 }, { q: 0, r: -1 })).toBe('north')
    expect(bearing({ q: 0, r: 0 }, { q: 0, r: 1 })).toBe('south')
    expect(bearing(origin, origin)).toBe('here')
  })

  it('counts steps with the direction', () => {
    expect(stepsAway({ q: 0, r: 0 }, { q: 0, r: -2 })).toBe('2 hexes north')
    expect(stepsAway({ q: 1, r: 1 }, { q: 1, r: 1 })).toBe('here')
  })

  it('names map hexes with their site, and open ground off the map', () => {
    const state = createGame(defaultContent.config, 1)
    const base = baseHex(state)
    expect(hexName(state, base)).toMatch(/, Base$/)
    expect(hexName(state, { q: 40, r: 40 })).toBe('open ground')
  })

  it('lists what stands on a hex', () => {
    const start = createGame(defaultContent.config, 1)
    const hex = baseHex(start)
    const state = {
      ...start,
      enemies: [{ id: 'e1', kind: 'grunt', hex, health: 1 }],
    }
    const max = start.content.enemies.enemies.find((e) => e.id === 'grunt')!.health
    expect(hexContents(state, hex)[0]).toBe(`grunt e1 (1 of ${max} health)`)
    expect(hexTitle(state, hex)).toMatch(/, Base: grunt e1/)
  })
})
