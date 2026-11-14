import { defaultContent } from '@survival/content'
import type { GameEvent } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'

/** A solo run's names, or a co-op run with `players` seats. */
const names = (players = 1) =>
  ({
    content: defaultContent,
    players: Array.from({ length: players }, (_, i) => ({ id: `p${i + 1}` })),
  }) as never

const line = (event: Record<string, unknown>, players = 1) =>
  describeEvent({ rule: '0', ...event } as unknown as GameEvent, names(players))

// The topic log tests (knockoutLog, draftLog, ...) pin most lines; these are the rest.
describe('run and round lines in the log', () => {
  it('names the seed of a new run', () => {
    expect(line({ type: 'gameCreated', seed: 42 })).toBe('New run, seed 42.')
  })

  it('capitalises the phase and gives the round', () => {
    expect(line({ type: 'phaseStarted', phase: 'combat', round: 3 })).toBe(
      'Combat phase starts (round 3).',
    )
  })

  it('gives the new round', () => {
    expect(line({ type: 'roundAdvanced', round: 4 })).toBe('Round 4.')
  })

  it('says the base fell and the run ends', () => {
    expect(line({ type: 'runEnded', because: 'base', round: 7 })).toBe(
      'The base has fallen in round 7. The run ends.',
    )
  })
})

describe('base lines in the log', () => {
  it('gives the damage and the health left', () => {
    expect(line({ type: 'baseDamaged', amount: 2, health: 8 })).toBe(
      'The base takes 2 damage (health 8).',
    )
  })

  it('gives the repair and the new health', () => {
    expect(line({ type: 'baseRepaired', amount: 1, health: 9 })).toBe(
      'The base gets 1 health (health 9).',
    )
  })
})

describe('deferred lines in the log', () => {
  it('names an effect the engine does not play yet', () => {
    expect(line({ type: 'effectDeferred', player: 'p1', effect: 'swap', reason: 'x' })).toBe(
      'Not yet in the engine: swap.',
    )
  })

  it('names a step the engine does not play yet', () => {
    expect(line({ type: 'stepDeferred', step: 'trade', reason: 'x' })).toBe(
      'Not yet in the engine: trade.',
    )
  })
})

describe('tile lines in the log', () => {
  it('names a placed tile by name, with its center', () => {
    expect(line({ type: 'tilePlaced', tile: 'broken-village', center: { q: 2, r: -1 } })).toBe(
      'Broken Village placed at (2,-1).',
    )
  })

  it('names a revealed tile by name', () => {
    expect(line({ type: 'tileRevealed', tile: 'broken-village' })).toBe(
      'Tile revealed: Broken Village.',
    )
  })

  it('falls back to the id for a tile the content does not have', () => {
    expect(line({ type: 'tileRevealed', tile: 'no-such-tile' })).toBe(
      'Tile revealed: no-such-tile.',
    )
  })
})

describe('player lines in the log', () => {
  it('says where you start in a solo run, with bare coordinates off the map', () => {
    expect(line({ type: 'figurePlaced', player: 'p1', hex: { q: 0, r: 1 } })).toBe(
      'You start on (0,1).',
    )
  })

  it('says where a co-op player starts', () => {
    expect(line({ type: 'figurePlaced', player: 'p2', hex: { q: 1, r: 0 } }, 2)).toBe(
      'Player 2 starts on (1,0).',
    )
  })

  it('gives the action dice count, with verb agreement', () => {
    expect(line({ type: 'diceGained', player: 'p1', dice: 4 })).toBe('You now have 4 action dice.')
    expect(line({ type: 'diceGained', player: 'p2', dice: 4 }, 2)).toBe(
      'Player 2 now has 4 action dice.',
    )
  })

  it('names who ignores the hit', () => {
    expect(line({ type: 'hitIgnored', player: 'p1', enemy: 'e9' })).toBe(
      'You ignore the hit from enemy.',
    )
    expect(line({ type: 'hitIgnored', player: 'p2', enemy: 'e9' }, 2)).toBe(
      'Player 2 ignores the hit from enemy.',
    )
  })

  it('gives the health on return and asks for a base hex', () => {
    expect(line({ type: 'playerReturned', player: 'p1', health: 3 })).toBe(
      'You are back with 3 health: choose a free base hex.',
    )
    expect(line({ type: 'playerReturned', player: 'p2', health: 3 }, 2)).toBe(
      'Player 2 is back with 3 health: choose a free base hex.',
    )
  })
})

describe('shop and Skill lines in the log', () => {
  it('names a shop offer by card name and level', () => {
    expect(line({ type: 'offerAdded', card: 'starter-move', level: 'I' })).toBe(
      'Shop offer: Move (level I).',
    )
  })

  it('names whose draft pool gets a Skill', () => {
    expect(line({ type: 'skillPooled', skill: 'strike', player: 'p1' })).toBe(
      'Strike goes to your draft pool.',
    )
    expect(line({ type: 'skillPooled', skill: 'strike', player: 'p2' }, 2)).toBe(
      "Strike goes to Player 2's draft pool.",
    )
  })

  it('sends a Skill to the bottom of its supply', () => {
    expect(line({ type: 'skillToSupply', skill: 'strike', level: 'I' })).toBe(
      'Strike goes to the bottom of its supply.',
    )
  })

  it('takes a replaced Skill off the board', () => {
    expect(line({ type: 'skillReplaced', player: 'p1', skill: 'strike' })).toBe(
      'Strike leaves the Skill board.',
    )
  })
})
