import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const names = (players: number) =>
  ({
    content: defaultContent,
    players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
  }) as never

const built = (players: number, player: string, kind: string) =>
  describeEvent(
    {
      type: 'defenseBuilt',
      rule: '12.1',
      player,
      defense: 'd1',
      kind,
      hex: { q: 9, r: 9 },
      cost: 3,
    } as never,
    names(players),
  )

const upgrade = defaultContent.upgrades[0]!
const bought = (players: number, player: string) =>
  describeEvent(
    {
      type: 'upgradeBought',
      rule: '11.2',
      player,
      upgrade: upgrade.id,
      cost: 2,
      baseHealth: 12,
    } as never,
    names(players),
  )

describe('build and upgrade text in the log', () => {
  it('speaks to the one player in a solo run', () => {
    expect(built(1, 'p1', 'tower')).toBe('You build a Tower on (9,9) for 3 materials.')
    expect(bought(1, 'p1')).toBe(`You buy ${upgrade.name} for 2 materials (base health 12).`)
  })

  it('names the player who paid the materials in co-op', () => {
    expect(built(3, 'p2', 'barricade')).toBe(
      'Player 2 builds a Barricade on (9,9) for 3 materials.',
    )
    expect(bought(2, 'p2')).toBe(`Player 2 buys ${upgrade.name} for 2 materials (base health 12).`)
  })
})
