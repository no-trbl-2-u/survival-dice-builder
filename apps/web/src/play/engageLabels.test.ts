import { defaultContent } from '@survival/content'
import {
  createGame,
  type Action,
  type Enemy,
  type GameEvent,
  type GameState,
} from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { damageFloats } from './damageFloats.ts'
import {
  engageFoes,
  engageInstruction,
  engageInstructionShort,
  enemyLabel,
  hitLine,
} from './engageView.ts'
import { chosenDice } from './targets.ts'

const r = 'Combat v3'
const enemy = (id: string, kind: string, q: number, rr: number, health = 2): Enemy => ({
  id,
  kind,
  health,
  hex: { q, r: rr },
  attackedThisCombat: false,
})

/** A solo state with the figure on (0,0) and the given enemies, in an engagement step. */
function withEnemies(enemies: Enemy[], step: 'roll' | 'assign' | 'resolve' = 'assign'): GameState {
  const s = createGame(defaultContent.config, 1)
  return {
    ...s,
    players: [{ ...s.players[0]!, hex: { q: 0, r: 0 } }],
    enemies,
    exchange: {
      step,
      dice: [],
      rollsUsed: 1,
      rerollsLeft: 0,
      rerolled: [],
      bonusDamage: 0,
      ignoreHits: 0,
      assignments: [],
      queue: [{ skill: 'strike', use: 0 }],
      skirmish: null,
      engage: { enemyDice: enemies.map((e) => ({ enemy: e.id, face: 'hit' as const })) },
    },
  } as unknown as GameState
}

describe('enemy names by kind and place (phase 24)', () => {
  it('names distance and bearing, and "on your hex"', () => {
    const s = withEnemies([enemy('e1', 'grunt', 1, 0), enemy('e2', 'elite', 0, 0)])
    expect(enemyLabel(s, 'e1', { q: 0, r: 0 })).toMatch(/^grunt, 1 hex [a-z-]+$/)
    expect(enemyLabel(s, 'e2', { q: 0, r: 0 })).toBe('elite, on your hex')
    expect(enemyLabel(s, 'e1', { q: 0, r: 0 })).not.toMatch(/e1/)
  })

  it('numbers two enemies with the same name in id order', () => {
    const s = withEnemies([enemy('e10', 'grunt', 0, 0), enemy('e9', 'grunt', 0, 0)])
    expect(enemyLabel(s, 'e9', { q: 0, r: 0 })).toBe('grunt, on your hex (1)')
    expect(enemyLabel(s, 'e10', { q: 0, r: 0 })).toBe('grunt, on your hex (2)')
  })

  it('a defeated enemy is its kind alone', () => {
    const s = withEnemies([])
    const log: GameEvent[] = [
      { type: 'enemyDefeated', rule: r, enemy: 'e5', kind: 'elite', by: 'p1' },
    ]
    expect(enemyLabel({ ...s, log }, 'e5', { q: 0, r: 0 })).toBe('elite')
  })

  it('the title counts the engaged enemies by kind, in content order', () => {
    const s = withEnemies([
      enemy('e1', 'elite', 1, 0),
      enemy('e2', 'grunt', 0, 1),
      enemy('e3', 'grunt', -1, 1),
    ])
    expect(engageFoes(s)).toBe('2 grunts and 1 elite')
    expect(engageFoes(withEnemies([enemy('e1', 'grunt', 1, 0)]))).toBe('1 grunt')
  })
})

describe('the hit line and the damage floats (phase 24)', () => {
  const before = withEnemies(
    [enemy('e1', 'grunt', 1, 0, 3), enemy('e2', 'grunt', 0, 1, 2)],
    'resolve',
  )

  it('reads out a hit and a defeat, from the state before the pick', () => {
    const hit: GameEvent[] = [{ type: 'enemyDamaged', rule: r, enemy: 'e1', amount: 2, health: 1 }]
    expect(hitLine(before, hit)).toMatch(
      /^Strike hit grunt, 1 hex [a-z-]+ for 2\. 1 health left\.$/,
    )
    const kill: GameEvent[] = [
      { type: 'enemyDamaged', rule: r, enemy: 'e2', amount: 2, health: 0 },
      { type: 'enemyDefeated', rule: r, enemy: 'e2', kind: 'grunt', by: 'p1' },
    ]
    expect(hitLine(before, kill)).toMatch(/^Strike defeated grunt, 1 hex [a-z-]+\.$/)
    expect(hitLine(before, [])).toBe('')
  })

  it('one float per damaged enemy at its hex before the pick, defeated marked', () => {
    const events: GameEvent[] = [
      { type: 'enemyDamaged', rule: r, enemy: 'e1', amount: 2, health: 1 },
      { type: 'enemyDamaged', rule: r, enemy: 'e2', amount: 2, health: 0 },
      { type: 'enemyDefeated', rule: r, enemy: 'e2', kind: 'grunt', by: 'p1' },
    ]
    expect(damageFloats(before, events)).toEqual([
      { enemy: 'e1', hex: { q: 1, r: 0 }, amount: 2, defeated: false, kind: 'grunt' },
      { enemy: 'e2', hex: { q: 0, r: 1 }, amount: 2, defeated: true, kind: 'grunt' },
    ])
    expect(
      damageFloats(before, [{ type: 'healed', rule: r, player: 'p1', amount: 2 } as GameEvent]),
    ).toEqual([])
  })
})

describe('instructions in two lengths (phase 24)', () => {
  it('each step has a long and a short line; the short one is shorter', () => {
    for (const step of ['roll', 'assign', 'resolve'] as const) {
      const s = withEnemies([enemy('e1', 'grunt', 1, 0)], step)
      const long = engageInstruction(s)
      const short = engageInstructionShort(s)
      expect(long.length).toBeGreaterThan(short.length)
      expect(short.length).toBeLessThanOrEqual(40)
    }
    const assign = withEnemies([], 'assign')
    expect(engageInstruction(assign)).toBe(
      'Select dice. Then choose a Skill they fit. A Star fits any slot. A full Skill fires at once. When no dice are left, the enemy dice hit.',
    )
    expect(engageInstructionShort(assign)).toBe('Pick dice, then a Skill.')
    expect(engageInstructionShort(withEnemies([], 'resolve'))).toBe('Strike: pick its target.')
    const once = {
      ...assign,
      config: {
        ...assign.config,
        options: { ...assign.config.options, skillUses: 'once-per-exchange' as const },
      },
    }
    expect(engageInstruction(once)).toMatch(/ Each Skill fires once per engagement\.$/)
  })
})

describe('no pre-selected die (phase 24)', () => {
  it('nothing is chosen until the player picks; a picked die that fits nothing drops out', () => {
    const legal: Action[] = [
      { type: 'assignDie', die: 0, skill: 'strike', asFace: 'Sword', use: 0, slot: 0 },
      { type: 'assignDie', die: 2, skill: 'shot', asFace: 'Bow', use: 0, slot: 0 },
    ]
    expect(chosenDice(legal, null)).toEqual([])
    expect(chosenDice(legal, [2, 1])).toEqual([2])
  })
})
