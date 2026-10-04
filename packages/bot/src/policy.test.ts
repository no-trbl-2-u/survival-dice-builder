import { defaultContent } from '@survival/content'
import {
  applyAction,
  createGame,
  hexDistance,
  legalActions,
  sameAction,
  type GameState,
} from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { goal } from './goals.ts'
import { botChoice } from './policy.ts'

const config = defaultContent.config

/** A round 1 Prepare state with the figure on the base centre, with `patch` on top. */
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

  it('puts its figure on the first offered Base tile hex', () => {
    expect(botChoice(createGame(config, 1))).toEqual({ type: 'placeFigure', q: 0, r: 0 })
  })

  it('with no gathering node on the map it heads for the map edge to reveal a tile', () => {
    const poor = started()
    const target = goal(poor)
    expect(poor.map.hexes[`${target.q},${target.r}`]).toBeUndefined()
    expect(hexDistance(target, { q: 0, r: 0 })).toBe(2)
    // From an outer base hex, the bot steps off the edge.
    const edge = withPlayer(
      started({ active: { kind: 'move', hexesLeft: 2, ignoreEnemyCost: false } }),
      { hex: { q: 1, r: 0 } },
    )
    const step = botChoice(edge) as { type: string; q: number; r: number }
    expect(step.type).toBe('moveTo')
    expect(edge.map.hexes[`${step.q},${step.r}`]).toBeUndefined()
  })

  it('heads for an unspent gathering node while it cannot pay for an upgrade, then for the base', () => {
    let s = withPlayer(
      started({ active: { kind: 'move', hexesLeft: 1, ignoreEnemyCost: false } }),
      { hex: { q: 1, r: 0 } },
    )
    // Reveal a tile east of the base, then look for its nodes.
    s = applyAction(s, botChoice(s)!).state
    const node = goal(s)
    expect(s.map.hexes[`${node.q},${node.r}`]?.site).toBe('gathering-node')
    const used = { ...s, spentNodes: [node] }
    expect(goal(used)).not.toEqual(node)
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
