import { defaultContent } from '@survival/content'
import {
  applyAction,
  createGame,
  hexDistance,
  legalActions,
  sameAction,
  type Enemy,
  type GameState,
} from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { bestTarget } from './defender.ts'
import { goal, guardPost, POST_RANGE, threat } from './goals.ts'
import { botChoice } from './policy.ts'

const config = defaultContent.config
const defender = { policy: 'defender' } as const

/** A round 1 Prepare state with the figure on the base centre, with `patch` on top. */
function started(patch: Partial<GameState> = {}): GameState {
  const s = createGame(config, 1)
  return { ...applyAction(s, legalActions(s)[0]!).state, ...patch }
}

const withPlayer = (s: GameState, patch: Partial<GameState['players'][number]>): GameState => ({
  ...s,
  players: [{ ...s.players[0]!, ...patch }],
})

const enemy = (id: string, kind: string, health: number, q: number, r: number): Enemy => ({
  id,
  kind,
  health,
  hex: { q, r },
  attackedThisCombat: false,
})

/** A Combat state between engagements, with this hand. */
function combat(hand: readonly string[], patch: Partial<GameState> = {}): GameState {
  return withPlayer(started({ phase: 'combat', ...patch }), {
    hand: hand.map((def, i) => ({ id: `c${i}`, def })),
  })
}

describe('the defender bot (phase 36)', () => {
  it('only ever chooses legal actions over 20 seeds', () => {
    for (let seed = 1; seed <= 20; seed++) {
      let s = createGame(config, seed)
      for (let steps = 0; s.phase !== 'ended' && steps < 1500; steps++) {
        const action = botChoice(s, defender)!
        expect(legalActions(s).some((a) => sameAction(a, action))).toBe(true)
        s = applyAction(s, action).state
      }
    }
  })

  it('targets an enemy the hit defeats, then the one nearest the base', () => {
    const s = started({
      enemies: [
        enemy('e1', 'elite', 14, 1, 0),
        enemy('e2', 'grunt', 1, 3, 0),
        enemy('e3', 'grunt', 2, 2, 0),
      ],
    })
    // 2 damage defeats both grunts: the nearer one wins over the weaker one.
    expect(bestTarget(s, ['e1', 'e2', 'e3'], 2)).toBe('e3')
    // 1 damage defeats only e2.
    expect(bestTarget(s, ['e1', 'e2', 'e3'], 1)).toBe('e2')
    // Nothing falls: the enemy nearest the base.
    expect(bestTarget(s, ['e1', 'e3'], 1)).toBe('e1')
  })

  it('prefers the defeat that cancels the most enemy dice in the engagement', () => {
    const s = started({ enemies: [enemy('e1', 'grunt', 2, 2, 0), enemy('e2', 'grunt', 2, 3, 0)] })
    const exchange = {
      step: 'targets' as const,
      dice: [],
      rollsUsed: 1,
      rerollsLeft: 0,
      rerolled: [],
      bonusDamage: 0,
      ignoreHits: 0,
      assignments: [],
      queue: [],
      skirmish: null,
      engage: {
        enemyDice: [
          { enemy: 'e2', face: 'hit' as const },
          { enemy: 'e2', face: 'miss' as const },
        ],
      },
    }
    expect(bestTarget({ ...s, exchange }, ['e1', 'e2'], 2)).toBe('e2')
  })

  it('on a Tower tie it shoots the enemy nearest the base when both fall', () => {
    const tie = started({
      phase: 'combat',
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 3, r: 0 }, health: 3, builder: 'p1' }],
      towerQueue: ['d1'],
      enemies: [enemy('e1', 'grunt', 2, 2, 0), enemy('e2', 'grunt', 1, 4, 0)],
    })
    // The default bot shoots the weakest (e2); the defender the one nearer the base.
    expect(botChoice(tie)).toEqual({ type: 'chooseTowerTarget', tower: 'd1', enemy: 'e2' })
    expect(botChoice(tie, defender)).toEqual({
      type: 'chooseTowerTarget',
      tower: 'd1',
      enemy: 'e1',
    })
  })

  it('buys Training before a cheaper Shop tier', () => {
    const s = withPlayer(
      started({
        upgrades: ['training-1'],
        active: { kind: 'build', buildsLeft: 1, costReduction: 0 },
      }),
      { materials: 6 },
    )
    expect(botChoice(s)).toEqual({ type: 'buyUpgrade', upgrade: 'shop-1' })
    expect(botChoice(s, defender)).toEqual({ type: 'buyUpgrade', upgrade: 'training-2' })
  })

  it('off the base, builds a Tower near the base toward the threat', () => {
    const s = withPlayer(
      started({
        enemies: [enemy('e1', 'grunt', 2, 4, 0)],
        active: { kind: 'build', buildsLeft: 1, costReduction: 0 },
      }),
      { materials: 4, hex: { q: 2, r: 0 } },
    )
    const choice = botChoice(s, defender) as { type: string; defense: string; q: number; r: number }
    expect(choice.type).toBe('build')
    expect(choice.defense).toBe('tower')
    expect(hexDistance(choice, { q: 0, r: 0 })).toBeLessThanOrEqual(POST_RANGE)
  })

  it('heads for a guard post with materials for a defense, and the threat in Combat', () => {
    const near = enemy('e1', 'grunt', 2, 3, 0)
    const s0 = started({ enemies: [near] })
    // Round 1 shows only the Base tile: no post yet. A revealed hex 2 from the base is one.
    expect(guardPost(s0, near.hex)).toBeNull()
    const ring = { ...s0.map.hexes['1,0']!, site: null }
    const map = { ...s0.map, hexes: { ...s0.map.hexes, '2,0': ring, '2,-1': ring } }
    const s = withPlayer({ ...s0, map }, { materials: 2 })
    expect(threat(s)?.id).toBe('e1')
    const post = goal(s, 'defender')
    expect(post).toEqual({ q: 2, r: 0 })
    expect(goal({ ...s, phase: 'combat' }, 'defender')).toEqual(near.hex)
    // An enemy far from the base is no threat.
    expect(threat(started({ enemies: [enemy('e1', 'grunt', 2, 6, 0)] }))).toBeUndefined()
  })

  it('repairs the base from its tile when the base is damaged', () => {
    const base = started().base
    const s = combat(['starter-gather', 'starter-build'], {
      base: { ...base, health: base.maxHealth - 3 },
    })
    expect(botChoice(s, defender)).toEqual({ type: 'playOption', card: 'c1', option: 0 })
  })

  it('engages with an enemy in range, keeping its Move cards', () => {
    const s = combat(['starter-move', 'starter-gather'], {
      enemies: [enemy('e1', 'grunt', 2, 2, 0)],
    })
    expect(botChoice(s, defender)).toEqual({ type: 'engage', card: 'c1', option: 0 })
  })

  it('moves toward the threat when no enemy is in range', () => {
    const s = combat(['starter-gather', 'starter-move'], {
      enemies: [enemy('e1', 'grunt', 2, 4, 0)],
    })
    expect(botChoice(s, defender)).toEqual({ type: 'playOption', card: 'c1', option: 0 })
  })

  it('heals when hurt, and keeps its heal cards for later when not', () => {
    const hurt = withPlayer(combat(['starter-gather', 'starter-rest']), { health: 10 })
    expect(botChoice(hurt, defender)).toEqual({ type: 'playOption', card: 'c1', option: 0 })
    const fine = combat(['starter-gather', 'starter-rest'])
    expect(botChoice(fine, defender)).toEqual({ type: 'engage', card: 'c0', option: 0 })
  })
})
