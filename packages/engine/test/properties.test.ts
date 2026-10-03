import { defaultContent } from '@survival/content'
import fc from 'fast-check'
import { describe, it } from 'vitest'
import { ownedCards } from '../src/deck/deck.ts'
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
            return owned.length === 6 && new Set(owned.map((c) => c.id)).size === 6
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
})
