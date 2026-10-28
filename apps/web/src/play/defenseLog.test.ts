import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const map = { hexes: { '0,0': { site: 'base' } } }
const built = {
  type: 'defenseBuilt',
  rule: '12.1',
  player: 'p1',
  defense: 'd1',
  kind: 'tower',
  hex: { q: 0, r: -1 },
  cost: 3,
}
const tower = { id: 'd1', kind: 'tower', hex: { q: 0, r: -1 }, health: 3, builder: 'p1' }
const line = (event: unknown, defenses: readonly unknown[], log: readonly unknown[] = [built]) =>
  describeEvent(
    event as never,
    {
      content: defaultContent,
      map,
      players: [{ id: 'p1' }],
      defenses,
      enemies: [],
      log,
    } as never,
  )

describe('defense text in the log', () => {
  const removed = { type: 'defenseRemoved', rule: '12.4', defense: 'd1' }
  const damaged = { type: 'defenseDamaged', rule: '7.11', defense: 'd1', amount: 2, health: 0 }

  it('names a standing defense by kind and place', () => {
    expect(line(damaged, [tower])).toBe(
      'Tower 1 hex north of the base center takes 2 damage (health 0).',
    )
  })

  it('still names a destroyed defense where it stood', () => {
    expect(line(removed, [])).toBe('Tower 1 hex north of the base center is destroyed.')
    expect(line(damaged, [])).toBe(
      'Tower 1 hex north of the base center takes 2 damage (health 0).',
    )
  })

  it('starts the line with a capital when no build is in the log', () => {
    expect(line(removed, [], [])).toBe('A defense is destroyed.')
  })
})
