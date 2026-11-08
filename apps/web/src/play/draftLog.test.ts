import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

const [first, second] = defaultContent.skills
const names = (players: number) =>
  ({
    content: defaultContent,
    players: Array.from({ length: players }, (_, i) => ({
      id: `p${i + 1}`,
      hand: [],
      deck: [],
      discard: [],
      inPlay: [],
    })),
  }) as never

const started = (players: number, player: string) =>
  describeEvent(
    {
      type: 'draftStarted',
      rule: '11.6',
      player,
      level: 'L1',
      options: [first!.id, second!.id],
    } as never,
    names(players),
  )
const skipped = (players: number, player: string) =>
  describeEvent({ type: 'draftSkipped', rule: '11.8', player } as never, names(players))

// The lines beside these ("Player 2 keeps ...", "... goes to Player 2's draft pool.") name the
// player, so the draft opening and skip lines name them too.
describe('Skill draft lines in the log', () => {
  it('says "Your Skill draft" in a solo run', () => {
    expect(started(1, 'p1')).toBe(`Your Skill draft: ${first!.name} or ${second!.name}.`)
    expect(skipped(1, 'p1')).toBe('No Skills left for you to draft.')
  })

  it('names the player whose draft it is in co-op', () => {
    expect(started(2, 'p2')).toBe(`Player 2's Skill draft: ${first!.name} or ${second!.name}.`)
    expect(skipped(2, 'p2')).toBe('No Skills left for Player 2 to draft.')
  })
})
