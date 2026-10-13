import { defaultContent, type CardDef, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { enemyDiceCount, repair, rollEnemyDice, siege, siegeDamage } from '../src/combat/engage.ts'
import { knockOut } from '../src/combat/knockout.ts'
import {
  applyAction,
  createGame,
  legalActions,
  type Action,
  type Enemy,
  type GameState,
} from '../src/index.ts'
import { startDraft } from '../src/progression/draft.ts'
import { experienceForLevel } from '../src/progression/levels.ts'
import { legalPlacements } from '../src/skills/assign.ts'

/**
 * Phase 41: the 10 changes Spec v2 makes to the engine (`docs/spec-v2-draft/RULINGS.md`, "What
 * the rulings change in the game"), one block each, named by the Spec v2 rule.
 */
const config = defaultContent.config
const enemy = (id: string, kind: string, q: number, r: number): Enemy => ({
  id,
  kind,
  health: kind === 'elite' ? 14 : 2,
  hex: { q, r },
})

/** A solo run in its first Prepare, the figure on the base centre. */
function prepare(cfg: GameConfig = config): GameState {
  const s = createGame(cfg, 41)
  return applyAction(s, { type: 'placeFigure', q: 0, r: 0 }).state
}

describe('change 1: the 10-card deck with a hand of 5 (Spec v2 4.8, 6.1, 18.1; ruling 7)', () => {
  it('the only preset is deck-10-hand-5', () => {
    expect(config.deck.presets.map((p) => p.id)).toEqual(['deck-10-hand-5'])
    expect(config.deck.preset).toBe('deck-10-hand-5')
  })

  it('a new run deals 10 starter cards and draws a hand of 5', () => {
    const p = prepare().players[0]!
    expect(p.hand.length + p.deck.length + p.discard.length).toBe(10)
    expect(p.hand).toHaveLength(5)
  })
})

describe('change 2: no skirmish; Engage on a top half (Spec v2 6.7, 6.9, 6.10; ruling 12)', () => {
  const dayfighter: CardDef = {
    id: 'dayfighter',
    name: 'Dayfighter',
    level: 1,
    cost: 3,
    top: { kind: 'engage' },
    bottom: [{ kind: 'reroll', dice: 1 }],
    combat: [{ kind: 'engage' }],
  }
  /** Prepare with a Dayfighter in hand and a grunt next to the figure. */
  const withDayfighter = (): GameState => {
    const s = prepare()
    const p = s.players[0]!
    return {
      ...s,
      content: { ...s.content, cards: [...s.content.cards, dayfighter] },
      enemies: [enemy('e1', 'grunt', 1, 0)],
      players: [{ ...p, hand: [{ id: 'x1', def: 'dayfighter' }, ...p.hand.slice(1)] }],
    }
  }

  it('6.9 a Move never offers a hex with an enemy', () => {
    const s: GameState = {
      ...prepare(),
      enemies: [enemy('e1', 'grunt', 1, 0)],
      active: { kind: 'move', hexesLeft: 3, ignoreEnemyCost: true },
    }
    const to = legalActions(s).flatMap((a) => (a.type === 'moveTo' ? [`${a.q},${a.r}`] : []))
    expect(to).not.toContain('1,0')
  })

  it('6.7 playing an Engage top half in Prepare starts an engagement with the adjacent enemy dice', () => {
    const { state, events } = applyAction(withDayfighter(), { type: 'playCard', card: 'x1' })
    expect(state.phase).toBe('prepare')
    expect(state.exchange?.engage?.enemyDice).toHaveLength(1)
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'cardPlayed', rule: '6.7', card: 'x1', half: 'top' }),
    )
  })

  it('a Prepare engagement takes no card adds and ends back in Prepare with the card discarded', () => {
    let s = applyAction(withDayfighter(), { type: 'playCard', card: 'x1' }).state
    s = applyAction(s, { type: 'stopRolling' }).state
    const adds = legalActions(s).filter((a: Action) => a.type === 'playOption')
    expect(adds).toEqual([])
    s = applyAction(s, { type: 'confirmAssignment' }).state
    expect(s.exchange).toBeNull()
    expect(s.phase).toBe('prepare')
    expect(s.players[0]!.discard.map((c) => c.id)).toContain('x1')
  })
})

describe('change 3: Gather amounts (Spec v2 Table 8; ruling 13)', () => {
  it('Haul 3, Forage 2, Excavate 4, Quarry 6; the starter Gather stays 2', () => {
    const amount = (id: string) => {
      const top = defaultContent.cards.find((c) => c.id === id)!.top
      return top.kind === 'gather' ? top.amount : null
    }
    expect(['starter-gather', 'haul', 'forage', 'excavate', 'quarry'].map(amount)).toEqual([
      2, 3, 2, 4, 6,
    ])
  })
})

describe('change 4: enemy dice and siege from each record (Spec v2 9.6, Table 5, 7.11; rulings 15, 17)', () => {
  const s = prepare()
  it('a grunt rolls 1 enemy die and sieges 1; an elite rolls 2 and sieges 3', () => {
    const grunt = enemy('g', 'grunt', 1, 0)
    const elite = enemy('e', 'elite', 2, 0)
    expect([enemyDiceCount(s, grunt), siegeDamage(s, grunt)]).toEqual([1, 1])
    expect([enemyDiceCount(s, elite), siegeDamage(s, elite)]).toEqual([2, 3])
    const [rolls] = rollEnemyDice(s, s.rng, [grunt, elite])
    expect(rolls.map((r) => r.enemy)).toEqual(['g', 'e', 'e'])
  })

  it('changing a record changes the game, with no code edit', () => {
    const many = {
      ...s,
      content: {
        ...s.content,
        enemies: {
          enemies: s.content.enemies.enemies.map((e) =>
            e.id === 'grunt' ? { ...e, dice: 3, siege: 5 } : e,
          ),
        },
      },
    }
    const grunt = enemy('g', 'grunt', 1, 0)
    expect(rollEnemyDice(many, many.rng, [grunt])[0]).toHaveLength(3)
    const [after] = siege({ ...many, enemies: [grunt] })
    expect(after.base.health).toBe(many.base.health - 5)
  })
})

describe('change 5: no v1 enemy damage or exchange-only options (Spec v2 9.5; ruling 18)', () => {
  it('the config has no enemyAttacks, adjacentAttack, structureDamage, or elite numbers', () => {
    expect(Object.keys(config.combat)).not.toContain('enemyAttacks')
    expect(Object.keys(config.combat)).not.toContain('adjacentAttack')
    expect(Object.keys(config.rulings)).not.toContain('structureDamage')
    expect(Object.keys(config.combat.engage)).toEqual([
      'enemyDie',
      'hitDamage',
      'specialDamage',
      'defeatedDice',
    ])
  })

  it('the exchange model ends Combat with the siege step too: an enemy next to a player sieges', () => {
    const exchange: GameConfig = { ...config, combat: { ...config.combat, model: 'exchange' } }
    const s = { ...prepare(exchange), enemies: [enemy('e1', 'elite', 2, 0)] }
    const [after] = siege(s)
    expect(after.base.health).toBe(s.base.health - 3)
  })
})

describe('change 6: experience steps of 3 (Spec v2 8.5; ruling 20)', () => {
  it('levels 2 to 5 need 3, 9, 18, 30 experience', () => {
    expect([2, 3, 4, 5].map((l) => experienceForLevel(l, config))).toEqual([3, 9, 18, 30])
  })
})

describe('7.9 and 12.5 (Spec v2)', () => {
  it('7.9 a top-half Engage with no adjacent enemy rolls no enemy dice and still discards the card', () => {
    const s = prepare()
    const p = s.players[0]!
    const dayfighter: CardDef = {
      id: 'dayfighter',
      name: 'Dayfighter',
      level: 1,
      cost: 3,
      top: { kind: 'engage' },
      bottom: [{ kind: 'reroll', dice: 1 }],
      combat: [{ kind: 'engage' }],
    }
    let x: GameState = {
      ...s,
      content: { ...s.content, cards: [...s.content.cards, dayfighter] },
      enemies: [],
      players: [{ ...p, hand: [{ id: 'x1', def: 'dayfighter' }, ...p.hand.slice(1)] }],
    }
    x = applyAction(x, { type: 'playCard', card: 'x1' }).state
    expect(x.exchange?.engage?.enemyDice).toEqual([])
    x = applyAction(x, { type: 'stopRolling' }).state
    if (x.exchange) x = applyAction(x, { type: 'confirmAssignment' }).state
    expect(x.exchange).toBeNull()
    expect(x.players[0]!.discard.map((c) => c.id)).toContain('x1')
  })

  it('12.5 Repair on the base heals the base up to its maximum; elsewhere the most damaged adjacent defense', () => {
    const s = prepare()
    const hurt = { ...s, base: { ...s.base, health: s.base.maxHealth - 1 } }
    expect(repair(hurt, 5)[0].base.health).toBe(s.base.maxHealth)
    const away: GameState = {
      ...s,
      players: [{ ...s.players[0]!, hex: { q: 2, r: 0 } }],
      defenses: [
        { id: 'd1', kind: 'barricade', hex: { q: 3, r: 0 }, health: 3, builder: 'p1' },
        { id: 'd2', kind: 'barricade', hex: { q: 2, r: 1 }, health: 1, builder: 'p1' },
      ],
    }
    const [after] = repair(away, 2)
    expect(after.defenses.map((d) => d.health)).toEqual([3, 3])
  })
})

describe('change 7: levelled Build (Spec v2 11.4, 12.1; ruling 25)', () => {
  const onBase = (level: number, upgrades: string[]): GameState => {
    const s = prepare()
    return {
      ...s,
      upgrades,
      players: [{ ...s.players[0]!, materials: 20 }],
      active: { kind: 'build', buildsLeft: 1, costReduction: 0, level },
    }
  }
  const offered = (s: GameState) =>
    legalActions(s).flatMap((a) => (a.type === 'buyUpgrade' ? [a.upgrade] : []))

  it('every Build card in the content is Build I', () => {
    const levels = defaultContent.cards.flatMap((c) =>
      c.top.kind === 'build' ? [c.top.level] : [],
    )
    expect(levels.length).toBeGreaterThan(0)
    expect(new Set(levels)).toEqual(new Set([1]))
  })

  it('11.4 Build I buys tier I only; Build II buys tier II; Build III buys tier III', () => {
    expect(offered(onBase(1, ['shop-1', 'training-1']))).toEqual([])
    expect(offered(onBase(2, ['shop-1', 'training-1']))).toEqual(['shop-2', 'training-2'])
    expect(offered(onBase(2, ['shop-1', 'shop-2']))).toEqual(['training-1'])
    expect(offered(onBase(3, ['shop-1', 'shop-2']))).toEqual(['shop-3', 'training-1'])
  })

  it('12.1 a defense above the Build level is not offered', () => {
    const s = prepare()
    const high = {
      ...s,
      content: {
        ...s.content,
        defenses: s.content.defenses.map((d) => (d.id === 'tower' ? { ...d, level: 2 } : d)),
      },
      players: [{ ...s.players[0]!, hex: { q: 1, r: 0 }, materials: 20 }],
      active: { kind: 'build' as const, buildsLeft: 1, costReduction: 0, level: 1 },
    }
    const kinds = new Set(
      legalActions(high).flatMap((a) => (a.type === 'build' ? [a.defense] : [])),
    )
    expect(kinds.has('tower')).toBe(false)
  })

  it('rulings.buildLevels "any" keeps the Spec v1 rule: any next tier', () => {
    const any = { ...config, rulings: { ...config.rulings, buildLevels: 'any' as const } }
    expect(offered({ ...onBase(1, ['shop-1', 'training-1']), config: any })).toEqual([
      'shop-2',
      'training-2',
    ])
  })
})

describe('change 8: the draft (Spec v2 11.6-11.8; rulings 26, 28)', () => {
  const duo = () => createGame(config, 41, defaultContent, { players: 2 })

  it('11.6 each player sees 2 new Skills plus their own pool', () => {
    const s = duo()
    const p2 = s.players[1]!
    const ready = {
      ...s,
      upgrades: ['training-1'],
      players: [s.players[0]!, { ...p2, draftPool: ['volley'] }],
      draftedPlayers: [s.players[0]!.id],
    }
    const [started] = startDraft(ready)
    expect(started.draft?.player).toBe(p2.id)
    expect(started.draft?.options).toHaveLength(3)
    expect(started.draft?.options.at(-1)).toBe('volley')
  })

  it('11.8 an empty open supply falls back to the next lower level', () => {
    const s = duo()
    const ready = {
      ...s,
      upgrades: ['training-1', 'training-2'],
      supplies: { ...s.supplies, skills: { ...s.supplies.skills, '2': [] } },
    }
    const [started] = startDraft(ready)
    expect(started.draft?.level).toBe('1')
    expect(started.draft?.options).toHaveLength(2)
  })
})

describe('change 9: a knockout loses all currency too (Spec v2 14.2; ruling 30)', () => {
  it('materials and currency go to 0', () => {
    const s = prepare()
    const rich = { ...s, players: [{ ...s.players[0]!, materials: 3, currency: 7 }] }
    const [out] = knockOut(rich, rich.players[0]!.id)
    expect(out.players[0]).toMatchObject({ materials: 0, currency: 0, knockedOut: true })
  })

  it('knockout.loseCurrency off keeps the currency', () => {
    const keep = { ...config, knockout: { ...config.knockout, loseCurrency: false } }
    const s = { ...prepare(keep), config: keep }
    const rich = { ...s, players: [{ ...s.players[0]!, currency: 7 }] }
    expect(knockOut(rich, rich.players[0]!.id)[0].players[0]!.currency).toBe(7)
  })
})

describe('change 10: a Skill fires again whenever the dice fill it (Spec v2 7.8 step 5; ruling 31)', () => {
  it('the config has no skillUses option; a full Skill opens its next use', () => {
    expect(Object.keys(config.options)).not.toContain('skillUses')
    const strike = defaultContent.skills.find((x) => x.id === 'strike')!
    const placed = [{ die: 0, skill: 'strike', use: 0, slot: 0, asFace: 'Sword' as const }]
    const dice = [
      { face: 'Sword' as const, kept: false },
      { face: 'Sword' as const, kept: false },
    ]
    expect(legalPlacements(dice, [strike], placed)).toEqual([
      { die: 1, skill: 'strike', use: 1, slot: 0, asFace: 'Sword' },
    ])
  })
})
