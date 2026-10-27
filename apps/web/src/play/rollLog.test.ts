import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const names = (players: number) =>
  ({
    content: defaultContent,
    players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
  }) as never

const line = (players: number, event: object) => describeEvent(event as never, names(players))

const rolled = (player: string) => ({
  type: 'diceRolled',
  rule: '7.8',
  player,
  faces: ['hit', 'blank'],
  roll: 1,
})
const rerolled = (player: string) => ({
  type: 'dieRerolled',
  rule: '7.8',
  player,
  die: 1,
  face: 'hit',
})
const kept = (player: string, isKept = true) => ({
  type: 'dieKept',
  rule: '7.8',
  player,
  die: 0,
  kept: isKept,
})
const assigned = (player: string) => ({
  type: 'dieAssigned',
  rule: '7.8',
  player,
  die: 0,
  skill: 'strike',
  asFace: 'sword',
})
const unassigned = (player: string) => ({ type: 'dieUnassigned', rule: '7.8', player, die: 0 })
const extra = (player: string) => ({ type: 'extraDice', rule: '7.8', player, faces: ['star'] })
const bonus = (player: string) => ({ type: 'damageBonus', rule: '7.8', player, amount: 1 })
const fired = (player: string) => ({ type: 'skillFired', rule: '7.8', player, skill: 'strike' })

describe('roll and Skill text in the log', () => {
  it('speaks to the one player in a solo run', () => {
    expect(line(1, rolled('p1'))).toBe('Your roll 1: hit, blank.')
    expect(line(1, rerolled('p1'))).toBe('Your die 2 rerolled: hit.')
    expect(line(1, kept('p1'))).toBe('Your die 1 kept.')
    expect(line(1, kept('p1', false))).toBe('Your die 1 released.')
    expect(line(1, assigned('p1'))).toBe('Your die 1 on Strike as sword.')
    expect(line(1, unassigned('p1'))).toBe('Your die 1 taken back.')
    expect(line(1, extra('p1'))).toBe('Your extra dice rolled: star.')
    expect(line(1, bonus('p1'))).toBe('+1 damage for your next damage Skill.')
    expect(line(1, fired('p1'))).toBe('Your Strike fires.')
  })

  it('names whose dice and Skill it is in co-op', () => {
    expect(line(3, rolled('p2'))).toBe("Player 2's roll 1: hit, blank.")
    expect(line(3, rerolled('p3'))).toBe("Player 3's die 2 rerolled: hit.")
    expect(line(3, kept('p2'))).toBe("Player 2's die 1 kept.")
    expect(line(3, kept('p3', false))).toBe("Player 3's die 1 released.")
    expect(line(3, assigned('p2'))).toBe("Player 2's die 1 on Strike as sword.")
    expect(line(3, unassigned('p3'))).toBe("Player 3's die 1 taken back.")
    expect(line(3, extra('p2'))).toBe("Player 2's extra dice rolled: star.")
    expect(line(3, bonus('p3'))).toBe("+1 damage for Player 3's next damage Skill.")
    expect(line(3, fired('p2'))).toBe("Player 2's Strike fires.")
  })
})
