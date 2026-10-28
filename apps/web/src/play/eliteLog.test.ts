import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const map = { hexes: { '0,0': { site: 'base' } } }
const event = {
  type: 'eliteReplaced',
  rule: '10.5',
  grunt: 'e1',
  elite: 'e4',
  hex: { q: 0, r: -2 },
} as never
const line = (enemies: readonly unknown[], log: readonly unknown[] = []) =>
  describeEvent(event, { content: defaultContent, map, enemies, log } as never)

describe('miniature limit text in the log', () => {
  it('names the grunt where it stood', () => {
    expect(line([{ id: 'e4', kind: 'elite', health: 5, hex: { q: 0, r: -2 } }])).toBe(
      'Miniature limit: the grunt 2 hexes north of the base center becomes an elite.',
    )
  })

  it('keeps that place after the elite moves on', () => {
    expect(line([{ id: 'e4', kind: 'elite', health: 5, hex: { q: 0, r: -1 } }])).toBe(
      'Miniature limit: the grunt 2 hexes north of the base center becomes an elite.',
    )
  })

  it('keeps that place after the elite is defeated', () => {
    expect(line([], [event])).toBe(
      'Miniature limit: the grunt 2 hexes north of the base center becomes an elite.',
    )
  })

  it('gives no ordinal that belongs to another elite', () => {
    const elites = [
      { id: 'e3', kind: 'elite', health: 5, hex: { q: 0, r: -2 } },
      { id: 'e4', kind: 'elite', health: 5, hex: { q: 0, r: -2 } },
    ]
    expect(line(elites)).toBe(
      'Miniature limit: the grunt 2 hexes north of the base center becomes an elite.',
    )
  })
})
