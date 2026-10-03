import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions, sameAction, type GameState } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { goal } from './goals.ts'
import { botChoice } from './policy.ts'

const config = defaultContent.config

/** A round 1 Prepare state after the setup tile, with `patch` on top. */
function started(patch: Partial<GameState> = {}): GameState {
  const s = createGame(config, 1)
  return { ...applyAction(s, legalActions(s)[0]!).state, ...patch }
}

const withPlayer = (s: GameState, patch: Partial<GameState['players'][number]>): GameState => ({
  ...s,
  players: [{ ...s.players[0]!, ...patch }],
})

describe('botChoice', () => {
  it('only ever chooses legal actions, and plays 20 seeds to the end', () => {
    for (let seed = 1; seed <= 20; seed++) {
      let s = createGame(config, seed)
      let steps = 0
      while (s.phase !== 'ended' && steps < 5000) {
        const action = botChoice(s)!
        expect(legalActions(s).some((a) => sameAction(a, action))).toBe(true)
        s = applyAction(s, action).state
        steps += 1
      }
      expect(s.phase).toBe('ended')
    }
  })

  it('returns undefined when the run has ended', () => {
    expect(botChoice(started({ phase: 'ended' }))).toBeUndefined()
  })

  it('places a tile in the slot farthest from the base', () => {
    const s = createGame(config, 1)
    const choice = botChoice(s)
    expect(choice?.type).toBe('placeTile')
    const far = (a: { q: number; r: number }) =>
      (Math.abs(a.q) + Math.abs(a.r) + Math.abs(a.q + a.r)) / 2
    const best = Math.max(...legalActions(s).map((a) => far(a as { q: number; r: number })))
    expect(far(choice as { q: number; r: number })).toBe(best)
  })

  it('heads for a gathering node while it cannot pay for an upgrade, then for the base', () => {
    const poor = started()
    expect(poor.map.hexes[`${goal(poor).q},${goal(poor).r}`]?.site).toBe('gathering-node')
    const rich = withPlayer(started(), { materials: 3 })
    expect(goal(rich)).toEqual({ q: 0, r: 0 })
  })

  it('plays Build on the base when an upgrade is affordable', () => {
    const s = withPlayer(started(), {
      materials: 3,
      hand: [
        { id: 'x1', def: 'starter-move' },
        { id: 'x2', def: 'starter-build' },
      ],
    })
    expect(botChoice(s)).toEqual({ type: 'playCard', card: 'x2' })
  })

  it('buys the cheapest upgrade during a Build on the base', () => {
    const s = withPlayer(started({ active: { kind: 'build', buildsLeft: 1, costReduction: 0 } }), {
      materials: 4,
    })
    expect(botChoice(s)).toEqual({ type: 'buyUpgrade', upgrade: 'training-1' })
  })

  it('discards a card with no use (Gather off a node, full health)', () => {
    const s = withPlayer(started(), { materials: 3, hand: [{ id: 'x1', def: 'starter-gather' }] })
    expect(botChoice(s)).toEqual({ type: 'discardCard', card: 'x1' })
  })

  it('steps toward its goal and never into a skirmish', () => {
    const s = started({
      enemies: [],
      active: { kind: 'move', hexesLeft: 2, ignoreEnemyCost: false },
    })
    const choice = botChoice(s)
    expect(choice?.type).toBe('moveTo')
    // An enemy on the step it just chose: that step is now a skirmish, so the bot avoids it.
    const step = choice as { q: number; r: number }
    const blocked = { ...s, enemies: [{ id: 'e9', kind: 'grunt', health: 2, hex: step }] }
    const next = botChoice(blocked) as { type: string; q?: number; r?: number }
    expect(next.type === 'moveTo' && next.q === step.q && next.r === step.r).toBe(false)
  })

  it('keeps non-Blank dice and rolls again while a Blank is left', () => {
    const base = started()
    const exchange = {
      step: 'roll' as const,
      dice: [
        { face: 'Sword' as const, kept: false },
        { face: 'Blank' as const, kept: false },
      ],
      rollsUsed: 1,
      rerollsLeft: 0,
      rerolled: [],
      bonusDamage: 0,
      ignoreHits: 0,
      assignments: [],
      queue: [],
      skirmish: null,
    }
    const s: GameState = { ...base, phase: 'combat', exchange }
    expect(botChoice(s)).toEqual({ type: 'toggleKeep', die: 0 })
    const kept: GameState = {
      ...s,
      exchange: { ...exchange, dice: [{ face: 'Sword', kept: true }, exchange.dice[1]!] },
    }
    expect(botChoice(kept)).toEqual({ type: 'roll' })
  })
})
