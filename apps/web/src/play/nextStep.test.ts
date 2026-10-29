import { cardStepText, defaultContent } from '@survival/content'
import {
  applyAction,
  createGame,
  legalActions,
  type Action,
  type ActionType,
  type GameState,
} from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { engageInstruction } from './engageView.ts'
import { bannerActions, nextStep } from './nextStep.ts'
import { COVERED } from './targets.ts'

const config = defaultContent.config
const MAP: ReadonlySet<ActionType> = new Set<ActionType>([
  'placeFigure',
  'moveTo',
  'build',
  'chooseTarget',
])

describe('nextStep', () => {
  it('names a tied Tower by its place, never by its id', () => {
    const start = createGame(config, 1)
    const placed = applyAction(start, { type: 'placeFigure', q: 0, r: 0 }).state
    const state = {
      ...placed,
      defenses: [{ id: 'd1', kind: 'tower', hex: { q: 0, r: -1 }, health: 3, builder: 'p1' }],
    }
    const legal: Action[] = [{ type: 'chooseTowerTarget', tower: 'd1', enemy: 'e1' }]
    const { phase, step } = nextStep(state, legal)
    expect(phase).toBe('Combat')
    expect(step).toMatch(
      /^Choose which enemy the Tower on .+, 1 hex north of the base center shoots$/,
    )
    expect(step).not.toContain('d1')
  })

  it('the engagement Combat card line offers discarding only when the rules allow it', () => {
    const start = createGame(config, 1)
    const placed = applyAction(start, { type: 'placeFigure', q: 0, r: 0 }).state
    const combat = { ...placed, phase: 'combat' as const, active: null, exchange: null }
    expect(nextStep(combat, []).step).toBe(cardStepText(config, 'engage'))
    expect(nextStep(combat, []).step).toMatch(/or discard it$/)
    const must = {
      ...combat,
      config: { ...config, rulings: { ...config.rulings, mandatoryPlays: true } },
    }
    expect(nextStep(must, []).step).not.toMatch(/discard/)
  })

  it('names the setup step, then Prepare once the figure is placed', () => {
    const s = createGame(config, 3)
    expect(nextStep(s, legalActions(s))).toEqual({
      phase: 'Setup',
      step: 'Click a highlighted base hex to place your figure',
    })
    const next = applyAction(s, legalActions(s)[0]!).state
    expect(nextStep(next, legalActions(next)).phase).toBe('Prepare')
  })

  it('a Build on the base offers the affordable upgrades in the banner', () => {
    const s = createGame(config, 3)
    const placed = applyAction(s, legalActions(s)[0]!).state
    const building = {
      ...placed,
      active: { kind: 'build', buildsLeft: 1, costReduction: 0, level: 1 },
      players: placed.players.map((p) => ({ ...p, materials: 50 })),
    } as const
    const legal = legalActions(building)
    expect(nextStep(building, legal).step).toBe('Build: buy a base upgrade, or stop building')
    expect(bannerActions(legal).map((a) => a.type)).toContain('buyUpgrade')
  })

  it('the Move banner says why a hex next to an enemy is not offered when the surcharge is on', () => {
    const start = createGame(config, 1)
    const placed = applyAction(start, { type: 'placeFigure', q: 0, r: 0 }).state
    const p = placed.players[0]!
    const moving = {
      ...placed,
      phase: 'prepare' as const,
      active: { kind: 'move', hexesLeft: 1, ignoreEnemyCost: false } as const,
      enemies: [{ id: 'e1', kind: 'grunt', hex: { q: 2, r: -1 }, health: 1 }],
      players: [{ ...p, hand: [], deck: [] }],
    } as GameState
    const surcharge = {
      ...moving,
      config: { ...config, combat: { ...config.combat, moveCostNextToEnemy: 2 } },
    }
    expect(nextStep(surcharge, legalActions(surcharge)).step).toBe(
      'Move: click a highlighted hex (1 movement left), or stop moving. ' +
        'A hex next to an enemy costs 2, more than you have left',
    )
    expect(nextStep(moving, legalActions(moving)).step).toBe(
      'Move: click a highlighted hex (1 movement left), or stop moving',
    )
  })

  it('names the seat in a multi-player run', () => {
    const s = createGame(config, 3, defaultContent, { players: 2 })
    expect(nextStep(s, legalActions(s)).step).toMatch(/^Player 1: /)
  })

  it('Combat v3: every legal action of a played-out engage run has a control', () => {
    const engage = { ...config, combat: { ...config.combat, model: 'engage' as const } }
    let s = createGame(engage, 5)
    for (let i = 0; i < 600 && s.phase !== 'ended'; i++) {
      const legal = legalActions(s)
      const banner = new Set(bannerActions(legal))
      for (const a of legal)
        expect(COVERED.has(a.type) || MAP.has(a.type) || banner.has(a)).toBe(true)
      expect(nextStep(s, legal).step).not.toBe('Waiting')
      s = applyAction(s, legal[i % legal.length] as Action).state
    }
  })

  it('every legal action of a played-out run has a control, a map target, or a banner button', () => {
    let s = createGame(config, 7)
    for (let i = 0; i < 400 && s.phase !== 'ended'; i++) {
      const legal = legalActions(s)
      const banner = new Set(bannerActions(legal))
      for (const a of legal)
        expect(COVERED.has(a.type) || MAP.has(a.type) || banner.has(a)).toBe(true)
      expect(nextStep(s, legal).step).not.toBe('Waiting')
      s = applyAction(s, legal[0] as Action).state
    }
  })

  it('Engagements: the assign banner names the End engagement button by its words', () => {
    const engage = { ...config, combat: { ...config.combat, model: 'engage' as const } }
    let s = createGame(engage, 5)
    let seen = false
    for (let i = 0; i < 600 && s.phase !== 'ended'; i++) {
      const legal = legalActions(s)
      if (s.exchange?.engage && s.exchange.step === 'assign') {
        const text = nextStep(s, legal).step
        expect(text).toContain('choose End engagement')
        expect(text).not.toContain('Finish engagement')
        seen = true
      }
      s = applyAction(s, legal[i % legal.length] as Action).state
    }
    expect(seen).toBe(true)
  })

  it('Engagements: the banner says what the modal says, and never points at the map', () => {
    const engage = { ...config, combat: { ...config.combat, model: 'engage' as const } }
    let s = createGame(engage, 5)
    const seen = new Set<string>()
    for (let i = 0; i < 600 && s.phase !== 'ended'; i++) {
      const legal = legalActions(s)
      if (s.exchange?.engage && legal.every((a) => a.type !== 'chooseTowerTarget')) {
        const text = nextStep(s, legal).step
        expect(text).toBe(engageInstruction(s))
        expect(text).not.toMatch(/map/i)
        seen.add(s.exchange.step)
      }
      s = applyAction(s, legal[i % legal.length] as Action).state
    }
    expect(seen.has('assign')).toBe(true)
  })

  it('Exchanges: the roll and assign banners name the Keep buttons and the Skill rows', () => {
    const exchange = { ...config, combat: { ...config.combat, model: 'exchange' as const } }
    let s = createGame(exchange, 7)
    const seen = new Set<string>()
    for (let i = 0; i < 400 && s.phase !== 'ended'; i++) {
      const legal = legalActions(s)
      const step = s.exchange && !s.exchange.engage ? s.exchange.step : null
      if (step === 'roll' || step === 'assign') {
        const text = nextStep(s, legal).step
        expect(text).not.toMatch(/Click dice|Skill slot/)
        if (step === 'roll') expect(text).toMatch(/^Keep dice, then roll again or stop rolling/)
        else expect(text).toMatch(/^Select dice, then click a Skill they fit\. Confirm when done/)
        seen.add(step)
      }
      s = applyAction(s, legal[0] as Action).state
    }
    expect([...seen].sort()).toEqual(['assign', 'roll'])
  })
})
