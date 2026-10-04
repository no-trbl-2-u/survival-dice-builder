import { defaultContent } from '@survival/content'
import fc from 'fast-check'
import { describe, it } from 'vitest'
import { ownedCards } from '../src/deck/deck.ts'
import { levelForExperience } from '../src/progression/levels.ts'
import { hexKey } from '../src/hex.ts'
import { isPassable } from '../src/map/tiles.ts'
import { createGame, type GameState } from '../src/index.ts'
import { randomChoice, walk } from './helpers/policy.ts'

const config = defaultContent.config

/** A random legal walk from a seed: the states it passes through. */
function randomWalk(seed: number, policySeed: number, steps: number): GameState[] {
  let rng = policySeed >>> 0
  return walk(
    createGame(config, seed),
    (s) => {
      const [action, next] = randomChoice(s, rng)
      rng = next
      return action
    },
    () => false,
    steps,
  ).states
}

const runs = fc.tuple(fc.integer(), fc.integer())

describe('engine properties', () => {
  it('5.4 owned cards are conserved through any sequence of legal actions', () => {
    fc.assert(
      fc.property(runs, ([seed, policy]) =>
        randomWalk(seed, policy, 150).every((s) =>
          s.players.every((p) => {
            const owned = ownedCards(p)
            const expected = 10 + s.progress.cardsBought
            return owned.length === expected && new Set(owned.map((c) => c.id)).size === expected
          }),
        ),
      ),
      { numRuns: 40 },
    )
  })

  it('2.1 health never exceeds maximum and never goes below 0', () => {
    fc.assert(
      fc.property(runs, ([seed, policy]) =>
        randomWalk(seed, policy, 150).every((s) =>
          s.players.every((p) => p.health >= 0 && p.health <= p.maxHealth),
        ),
      ),
      { numRuns: 40 },
    )
  })

  it('7.8 step 6 a die is never on 2 Skill slots', () => {
    fc.assert(
      fc.property(runs, ([seed, policy]) =>
        randomWalk(seed, policy, 150).every((s) => {
          const dice = s.exchange?.assignments.map((a) => a.die) ?? []
          return new Set(dice).size === dice.length
        }),
      ),
      { numRuns: 40 },
    )
  })

  it('every non-ended state has at least 1 legal action (no dead ends)', async () => {
    const { legalActions } = await import('../src/index.ts')
    fc.assert(
      fc.property(runs, ([seed, policy]) =>
        randomWalk(seed, policy, 150).every(
          (s) => s.phase === 'ended' || legalActions(s).length > 0,
        ),
      ),
      { numRuns: 40 },
    )
  })

  it('3.4, 3.7 no figure stands on an impassable or off-map hex; at most 1 enemy per hex', () => {
    fc.assert(
      fc.property(runs, ([seed, policy]) =>
        randomWalk(seed, policy, 150).every((s) => {
          const figures = [...s.players.map((p) => p.hex), ...s.enemies.map((e) => e.hex)]
          const enemyHexes = s.enemies.map((e) => hexKey(e.hex))
          return (
            figures.every((h) => isPassable(s.map, h)) &&
            new Set(enemyHexes).size === enemyHexes.length
          )
        }),
      ),
      { numRuns: 40 },
    )
  })

  it('12.1, 8.2, 8.3 materials and currency never go below 0; the level matches the track', () => {
    fc.assert(
      fc.property(runs, ([seed, policy]) =>
        randomWalk(seed, policy, 150).every(
          (s) =>
            s.players.every((p) => p.materials >= 0 && p.currency >= 0) &&
            s.level === levelForExperience(s.experience, s.config),
        ),
      ),
      { numRuns: 40 },
    )
  })

  it('3.4, 9.4, 12 no enemy stands on the base, a defense, or a figure hex', () => {
    fc.assert(
      fc.property(runs, ([seed, policy]) =>
        randomWalk(seed, policy, 300).every((s) => {
          const blocked = new Set([
            '0,0',
            ...s.defenses.map((d) => hexKey(d.hex)),
            ...s.players.map((p) => hexKey(p.hex)),
          ])
          return s.enemies.every((e) => !blocked.has(hexKey(e.hex)))
        }),
      ),
      { numRuns: 30 },
    )
  })

  it('2.2, 10.5 enemy miniatures never exceed the limit; base health stays in range', () => {
    fc.assert(
      fc.property(runs, ([seed, policy]) =>
        randomWalk(seed, policy, 300).every(
          (s) =>
            s.enemies.length <= s.config.miniatureLimit &&
            s.base.health >= 0 &&
            s.base.health <= s.base.maxHealth,
        ),
      ),
      { numRuns: 30 },
    )
  })
})
