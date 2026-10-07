import { defaultContent } from '@survival/content'
import {
  applyAction,
  createGame,
  legalActions,
  type Action,
  type ActionType,
} from '@survival/engine'
import { describe, expect, it } from 'vitest'
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
      active: { kind: 'build', buildsLeft: 1, costReduction: 0 },
      players: placed.players.map((p) => ({ ...p, materials: 50 })),
    } as const
    const legal = legalActions(building)
    expect(nextStep(building, legal).step).toBe('Build: buy a base upgrade, or stop building')
    expect(bannerActions(legal).map((a) => a.type)).toContain('buyUpgrade')
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

  it('Exchanges: the roll and assign banners name the Keep buttons and the Skill rows', () => {
    let s = createGame(config, 7)
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
