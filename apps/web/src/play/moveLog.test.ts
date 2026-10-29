import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const map = { hexes: { '0,0': { site: 'base' }, '0,-1': { terrain: 'plains' } } }
const event = {
  type: 'enemyMoved',
  rule: '10.3',
  enemy: 'e1',
  from: { q: 0, r: -2 },
  to: { q: 0, r: -1 },
  target: null,
} as never
const line = (enemies: readonly unknown[], log: readonly unknown[] = []) =>
  describeEvent(event, { content: defaultContent, map, enemies, log } as never)

describe('enemy move text in the log', () => {
  it('names the enemy where it stood before the move', () => {
    expect(line([{ id: 'e1', kind: 'grunt', health: 2, hex: { q: 0, r: -1 } }])).toMatch(
      /^Grunt 2 hexes north of the base center moves to .*\(0,-1\)\.$/,
    )
  })

  it('keeps that place after the enemy moves on', () => {
    expect(line([{ id: 'e1', kind: 'grunt', health: 2, hex: { q: 1, r: -1 } }])).toMatch(
      /^Grunt 2 hexes north of the base center moves to /,
    )
  })

  it('keeps the kind after the enemy is defeated', () => {
    const spawned = { type: 'enemySpawned', enemy: 'e1', kind: 'elite', hex: { q: 0, r: -3 } }
    expect(line([], [spawned])).toMatch(/^Elite 2 hexes north of the base center moves to /)
  })
})

describe('player move text in the log', () => {
  const solo = (e: unknown) =>
    describeEvent(e as never, { content: defaultContent, map, enemies: [] } as never)

  it('names the unit of what is left after a step', () => {
    const moved = {
      type: 'moved',
      rule: '6.5',
      player: 'p1',
      to: { q: 0, r: -1 },
      cost: 2,
      hexesLeft: 3,
    }
    expect(solo(moved)).toMatch(/^You move to .*\(cost 2, 3 movement left\)\.$/)
  })

  it('names the same unit after a blocked reveal step', () => {
    const blocked = {
      type: 'revealStepBlocked',
      rule: '6.7',
      player: 'p1',
      hex: { q: 0, r: -1 },
      hexesLeft: 1,
    }
    expect(solo(blocked)).toMatch(/it is impassable \(1 movement left\)\.$/)
  })
})
