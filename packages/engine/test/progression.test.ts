import { defaultContent, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { damageEnemy } from '../src/combat/resolve.ts'
import { applyAction, createGame, legalActions, type GameState } from '../src/index.ts'
import { advance } from '../src/phases/advance.ts'
import { draftDue, startDraft } from '../src/progression/draft.ts'
import { checkMilestones } from '../src/progression/milestones.ts'
import { noSpawns } from './helpers/fixtures.ts'

const config = defaultContent.config

/** Round 1 Prepare on the base, no enemies, an empty hand; `patch` sets the rest. */
function home(patch: Partial<GameState> = {}, cfg: GameConfig = config): GameState {
  const s = createGame(cfg, 1)
  const placed = noSpawns(applyAction(s, legalActions(s)[0]!).state)
  const p = placed.players[0]!
  return {
    ...placed,
    enemies: [],
    players: [{ ...p, hand: [], deck: [], discard: [...p.hand, ...p.deck] }],
    ...patch,
  }
}

const withPlayer = (s: GameState, patch: Partial<GameState['players'][number]>): GameState => ({
  ...s,
  players: [{ ...s.players[0]!, ...patch }],
})

const grunt = { id: 'e1', kind: 'grunt', health: 2, hex: { q: 1, r: 0 } }
const types = (s: GameState) => new Set(legalActions(s).map((a) => a.type))

describe('experience and levels (8.1-8.5)', () => {
  it('8.1-8.2 a defeat gives experience to the track and currency to the player who defeated it', () => {
    const [s, events] = damageEnemy(home({ enemies: [grunt] }), 'e1', 2, 'p1')
    expect(s.experience).toBe(1)
    expect(s.players[0]!.currency).toBe(1)
    expect(events.map((e) => e.type)).toEqual([
      'enemyDamaged',
      'enemyDefeated',
      'experienceGained',
      'currencyGained',
    ])
  })

  it('8.2 row 40 a Tower defeat gives experience but no currency', () => {
    const [s] = damageEnemy(home({ enemies: [grunt] }), 'e1', 2, 'd1')
    expect(s.experience).toBe(1)
    expect(s.players[0]!.currency).toBe(0)
  })

  it('8.3-8.5 at 5 experience the level goes to 2 and every player gets 1 action die', () => {
    const [s, events] = damageEnemy(home({ enemies: [grunt], experience: 4 }), 'e1', 2, 'p1')
    expect(s.level).toBe(2)
    expect(s.players[0]!.dice).toBe(2)
    expect(events).toContainEqual(expect.objectContaining({ type: 'levelReached', level: 2 }))
  })

  it('18.1 a maximum level stops the level and the dice', () => {
    const capped = { ...config, options: { ...config.options, maxLevel: 1 } }
    const [s] = damageEnemy(home({ enemies: [grunt], experience: 4 }, capped), 'e1', 2, 'p1')
    expect(s.experience).toBe(5)
    expect(s.level).toBe(1)
    expect(s.players[0]!.dice).toBe(1)
  })

  it('Table 5 an elite gives 4 experience and 4 currency', () => {
    const elite = { ...grunt, kind: 'elite', health: 1 }
    const [s] = damageEnemy(home({ enemies: [elite] }), 'e1', 1, 'p1')
    expect([s.experience, s.players[0]!.currency, s.progress.elitesDefeated]).toEqual([4, 4, 1])
  })
})

describe('supplies (4.12)', () => {
  it('4.12, row 18 each level has its own shuffled supply: 2 copies of each card, 1 of each Skill', () => {
    const s = createGame(config, 1)
    const sizes = (r: Readonly<Record<string, readonly string[]>>) =>
      ['1', '2', '3'].map((l) => r[l]!.length)
    expect(sizes(s.supplies.cards)).toEqual([12, 8, 8])
    expect(sizes(s.supplies.skills)).toEqual([7, 4, 3])
    expect(s.shopOffers).toEqual([])
  })
})

describe('base upgrades (11.1-11.4)', () => {
  const building = (materials: number, costReduction = 0, buildsLeft = 1) =>
    withPlayer(home({ active: { kind: 'build', buildsLeft, costReduction } }), { materials })

  it('11.2, 11.4 a Build on the base offers tier I of each track that the player can pay', () => {
    expect(legalActions(building(3))).toEqual([
      { type: 'stopBuilding' },
      { type: 'buyUpgrade', upgrade: 'training-1' },
    ])
    expect(legalActions(building(4)).filter((a) => a.type === 'buyUpgrade')).toHaveLength(2)
  })

  it('11.3, 11.5 Shop I costs 4, adds 5 base health, and opens the Shop with 3 Level 1 offers', () => {
    const { state, events } = applyAction(building(4), { type: 'buyUpgrade', upgrade: 'shop-1' })
    expect(state.players[0]!.materials).toBe(0)
    expect(state.base).toEqual({ health: 25, maxHealth: 25 })
    expect(state.shopOffers).toHaveLength(3)
    expect(events.filter((e) => e.type === 'offerAdded').every((e) => e.level === '1')).toBe(true)
  })

  it('11.4 tier II is offered only after tier I', () => {
    const s = { ...building(10), upgrades: ['shop-1'] }
    const offered = legalActions(s).flatMap((a) => (a.type === 'buyUpgrade' ? [a.upgrade] : []))
    expect(offered).toEqual(['shop-2', 'training-1'])
  })

  it('Table 8 row 42 Mason lowers an upgrade cost by 1', () => {
    expect(types(building(3, 1)).has('buyUpgrade')).toBe(true)
    const { state } = applyAction(building(3, 1), { type: 'buyUpgrade', upgrade: 'shop-1' })
    expect(state.players[0]!.materials).toBe(0)
  })

  it('Table 8 Architect buys 2 upgrades', () => {
    let s = building(7, 0, 2)
    s = applyAction(s, { type: 'buyUpgrade', upgrade: 'shop-1' }).state
    expect(s.active).toMatchObject({ buildsLeft: 1 })
    s = applyAction(s, { type: 'buyUpgrade', upgrade: 'training-1' }).state
    expect(s.upgrades).toEqual(['shop-1', 'training-1'])
    expect(s.active).toBeNull()
  })
})

describe('Shop (6.8, 11.5, 13.1, 18.1)', () => {
  /** Round 1 Prepare on the base with 1 card in hand and the Shop open with Level 1 offers. */
  const shopping = (currency: number, upgrades = ['shop-1']) => {
    const s = home({ upgrades })
    const cards = s.supplies.cards['1']!
    const opened: GameState = {
      ...s,
      shopOffers: cards.slice(0, 3),
      supplies: { ...s.supplies, cards: { ...s.supplies.cards, '1': cards.slice(3) } },
    }
    return withPlayer(opened, { currency, hand: [{ id: 'h1', def: 'starter-move' }] })
  }

  it('6.8 [006] on the base with the Shop open, every affordable offer can be bought', () => {
    const s = shopping(3)
    const buys = legalActions(s).filter((a) => a.type === 'buyCard')
    expect(buys).toHaveLength(3)
    expect(legalActions(s)[0]!.type).not.toBe('buyCard')
  })

  it('6.8 not off the base, and not without enough currency', () => {
    expect(types(shopping(2)).has('buyCard')).toBe(false)
    expect(types(withPlayer(shopping(3), { hex: { q: 2, r: 0 } })).has('buyCard')).toBe(false)
  })

  it('6.8 row 16 buying works from any hex of the Base tile', () => {
    expect(types(withPlayer(shopping(3), { hex: { q: 0, r: 1 } })).has('buyCard')).toBe(true)
  })

  it('13.1, 11.5 a bought card goes to the discard pile and its offer is replaced at once', () => {
    const s = shopping(3)
    const card = s.shopOffers[0]!
    const { state } = applyAction(s, { type: 'buyCard', card })
    const p = state.players[0]!
    expect(p.currency).toBe(0)
    expect(p.discard.at(-1)).toEqual({ id: 'c11', def: card })
    expect(state.shopOffers).toHaveLength(3)
    expect(state.shopOffers).not.toContain(card)
  })

  it('11.5 with Shop II open, new offers come from Level 2', () => {
    const s = shopping(3, ['shop-1', 'shop-2'])
    const { events } = applyAction(s, { type: 'buyCard', card: s.shopOffers[0]! })
    expect(events.find((e) => e.type === 'offerAdded')).toMatchObject({ level: '2' })
  })

  it('11.5 row 41 an empty level falls back to the next lower level', () => {
    const base = shopping(3, ['shop-1', 'shop-2'])
    const s = {
      ...base,
      supplies: { ...base.supplies, cards: { ...base.supplies.cards, '2': [] } },
    }
    const { events } = applyAction(s, { type: 'buyCard', card: s.shopOffers[0]! })
    expect(events.find((e) => e.type === 'offerAdded')).toMatchObject({ level: '1' })
  })

  it('18.1 replace-starter: after a buy the player returns 1 starter card', () => {
    const cfg = {
      ...config,
      options: { ...config.options, boughtCards: 'replace-starter' as const },
    }
    const s = { ...shopping(3), config: cfg }
    const { state } = applyAction(s, { type: 'buyCard', card: s.shopOffers[0]! })
    expect(state.pendingReturn).toBe('p1')
    const returns = legalActions(state)
    expect(returns.every((a) => a.type === 'returnStarter')).toBe(true)
    const after = applyAction(state, returns[0]!).state
    const p = after.players[0]!
    // 10 starter cards and 1 card in hand, +1 bought, -1 returned.
    expect([...p.deck, ...p.discard, ...p.hand]).toHaveLength(11)
    expect(after.pendingReturn).toBeNull()
  })

  it('core loop v2 replace-starter never takes a deck below deck.minimumSize', () => {
    const cfg = {
      ...config,
      options: { ...config.options, boughtCards: 'replace-starter' as const },
    }
    const base = { ...shopping(3), config: cfg }
    const p = base.players[0]!
    // 8 in the discard pile + 1 in hand + the bought card = 10: nothing is returned.
    const small = withPlayer(base, { discard: p.discard.slice(0, 8) })
    const { state } = applyAction(small, { type: 'buyCard', card: small.shopOffers[0]! })
    expect(state.pendingReturn).toBeNull()
    expect(state.players[0]!.discard).toHaveLength(9)
  })
})

describe('Skill draft (10.8, 11.6-11.9)', () => {
  const due = (patch: Partial<GameState> = {}) =>
    home({ phase: 'combat', roundEnding: true, round: 2, upgrades: ['training-1'], ...patch })

  it('10.8 the draft happens on even rounds while the Training Ground is open', () => {
    expect(draftDue(due())).toBe(true)
    expect(draftDue(due({ round: 3 }))).toBe(false)
    expect(draftDue(due({ upgrades: [] }))).toBe(false)
    expect(draftDue(due({ draftedPlayers: ['p1'] }))).toBe(false)
  })

  it('11.6-11.7 reveal the top 2 Skills, keep 1 for free, the other goes to the bottom', () => {
    const [s] = startDraft(due())
    const [first, second] = s.draft!.options
    expect(s.supplies.skills['1']).toHaveLength(5)
    expect(legalActions(s)).toEqual([
      { type: 'draftSkill', skill: first },
      { type: 'draftSkill', skill: second },
    ])
    const { state } = applyAction(s, { type: 'draftSkill', skill: first! })
    expect(state.players[0]!.skills.at(-1)).toBe(first)
    expect(state.supplies.skills['1']!.at(-1)).toBe(second)
    expect(state.draft).toBeNull()
  })

  it('11.8 an empty supply falls back to the next lower level', () => {
    const base = due({ upgrades: ['training-1', 'training-2'] })
    const s = {
      ...base,
      supplies: { ...base.supplies, skills: { ...base.supplies.skills, '2': [] } },
    }
    expect(startDraft(s)[0].draft!.level).toBe('1')
  })

  it('11.9 [006] with 6 drafted Skills the kept Skill replaces 1 drafted Skill', () => {
    const drafted = ['cleave', 'bulwark', 'renewal', 'aimed-shot', 'spellblade', 'dodge']
    const s0 = withPlayer(due(), { skills: ['strike', 'shot', 'mend', 'guard', ...drafted] })
    const [s] = startDraft(s0)
    const kept = s.draft!.options[0]!
    const waiting = applyAction(s, { type: 'draftSkill', skill: kept }).state
    expect(legalActions(waiting).map((a) => a.type)).toEqual(Array(6).fill('replaceSkill'))
    const { state } = applyAction(waiting, { type: 'replaceSkill', skill: 'dodge' })
    expect(state.players[0]!.skills).toContain(kept)
    expect(state.players[0]!.skills).not.toContain('dodge')
    expect(state.supplies.skills['1']!.at(-1)).toBe('dodge')
  })

  it('11.9 with 0 draft slots there is no draft (nothing to replace)', () => {
    const cfg = { ...config, player: { ...config.player, draftSlots: 0 } }
    const [s, events] = startDraft({ ...due(), config: cfg })
    expect(s.draft).toBeNull()
    expect(s.draftedPlayers).toEqual(['p1'])
    expect(events).toEqual([])
  })

  it('11.8 row 50 with every open Skill supply empty the draft is skipped', () => {
    const base = due()
    const empty = { ...base.supplies.skills, '1': [] }
    const [s, events] = startDraft({ ...base, supplies: { ...base.supplies, skills: empty } })
    expect(s.draft).toBeNull()
    expect(events[0]).toMatchObject({ type: 'draftSkipped' })
  })

  it('11.9 with fullBoardDraft "skip" a full board has no draft', () => {
    const cfg = { ...config, rulings: { ...config.rulings, fullBoardDraft: 'skip' as const } }
    const drafted = ['cleave', 'bulwark', 'renewal', 'aimed-shot', 'spellblade', 'dodge']
    const s = withPlayer(
      { ...due(), config: cfg },
      {
        skills: ['strike', 'shot', 'mend', 'guard', ...drafted],
      },
    )
    const [after] = startDraft(s)
    expect(after.draft).toBeNull()
    expect(after.draftedPlayers).toEqual(['p1'])
  })
})

describe('milestones and the end of the run (14, 17)', () => {
  it('17 each milestone is recorded once', () => {
    const s = home({
      round: 10,
      level: 5,
      upgrades: ['shop-1', 'shop-2', 'training-1'],
      progress: {
        elitesDefeated: 1,
        firedSkills: ['arcane-rain'],
        tilesRevealed: 10,
        cardsBought: 0,
      },
    })
    const [after, events] = checkMilestones(s, '10.10')
    expect(after.milestones).toEqual([
      'survive-round-5',
      'survive-round-10',
      'defeat-elite',
      'fire-arcane-rain',
      'buy-upgrades',
      'reveal-tiles',
      'reach-level',
    ])
    expect(events).toHaveLength(7)
    expect(checkMilestones(after, '10.10')[1]).toEqual([])
  })

  it('14.3 the run end records the milestones reached', () => {
    const s = home({ round: 5, phase: 'ended', endedBecause: 'base' })
    const [after, events] = advance(s)
    expect(after.milestones).toEqual(['survive-round-5'])
    expect(events[0]).toMatchObject({ type: 'milestoneReached', rule: '14.3' })
  })

  it('10.10 milestones are examined when the round advances', () => {
    const s = home({ phase: 'combat', roundEnding: true, round: 4 })
    const p = s.players[0]!
    const [after, events] = advance(
      withPlayer(s, { orientation: 'top', deck: p.discard, discard: [] }),
    )
    expect(after.round).toBe(5)
    expect(events).toContainEqual(
      expect.objectContaining({ type: 'milestoneReached', milestone: 'survive-round-5' }),
    )
  })
})
