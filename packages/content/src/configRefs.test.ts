import { describe, expect, it } from 'vitest'
import { defaultContent } from './content.ts'
import { configReferenceProblems } from './configRefs.ts'
import type { GameConfig } from './schemas/config.ts'

const base = defaultContent.config
const check = (config: GameConfig) =>
  configReferenceProblems(config, defaultContent).map((p) => `${p.path.join('.')}: ${p.message}`)

describe('config references (rules 1.5, 4.10, 11.9, 18.1)', () => {
  it('the default config has none', () => {
    expect(check(base)).toEqual([])
  })

  it('names a starter Skill or milestone Skill that does not exist', () => {
    expect(
      check({
        ...base,
        player: { ...base.player, starterSkills: ['strike', 'fireball'] },
        milestones: { ...base.milestones, skillFired: 'nope' },
      }),
    ).toEqual([
      'player.starterSkills.1: unknown Skill "fireball" (not in skills.json)',
      'milestones.skillFired: unknown Skill "nope" (not in skills.json)',
    ])
  })

  it('names a deck preset or card that does not exist, and a duplicate preset id', () => {
    const [first, ...rest] = base.deck.presets
    const presets = [
      { ...first!, cards: [{ card: 'starter-moov', quantity: 4 }] },
      { ...first!, cards: first!.cards },
      ...rest,
    ]
    expect(check({ ...base, deck: { ...base.deck, preset: 'deck-10-hand-6', presets } })).toEqual([
      'deck.presets.0.cards.0.card: unknown card "starter-moov" (not in cards.json)',
      `deck.presets.1.id: duplicate preset id "${first!.id}"`,
      'deck.preset: no preset with id "deck-10-hand-6"',
    ])
  })

  it('names a tile count the tile set cannot fill', () => {
    expect(check({ ...base, tiles: { ...base.tiles, core: 9 } })).toEqual([
      'tiles.core: config needs 9 core tiles; the tile set has 5',
    ])
  })

  it('names a smallest value above its largest', () => {
    expect(
      check({
        ...base,
        players: { min: 3, max: 2 },
        draft: { ...base.draft, reveal: 2, keep: 3 },
      }),
    ).toEqual([
      'players.min: fewest players (3) is more than most players (2)',
      'draft.keep: keeps 3 of only 2 revealed Skills',
    ])
  })
})
