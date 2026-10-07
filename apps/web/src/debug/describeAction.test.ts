import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { actionHex, describeAction } from './describeAction.ts'

describe('describeAction', () => {
  it('labels the start hexes by place, the centre first', () => {
    const state = createGame(defaultContent.config, 1)
    const labels = legalActions(state).map((a) => describeAction(a, state))
    expect(labels).toHaveLength(7)
    expect(labels[0]).toBe('Place your figure on Plains, Base, the base centre')
    expect(
      labels
        .slice(1)
        .every((l) =>
          /^Place your figure on Plains, 1 hex (north|south|east|west)(-east|-west)? of the base centre$/.test(
            l,
          ),
        ),
    ).toBe(true)
    expect(new Set(labels).size).toBe(7)
  })

  it('labels a step off the map edge as a reveal', () => {
    const start = createGame(defaultContent.config, 1)
    const placed = applyAction(start, { type: 'placeFigure', q: 1, r: 0 }).state
    const state = {
      ...placed,
      active: { kind: 'move' as const, hexesLeft: 2, ignoreEnemyCost: false },
    }
    expect(describeAction({ type: 'moveTo', q: 2, r: 0 }, state)).toBe(
      'Step off the map edge, 1 hex south-east: reveal a tile; its spawn nodes add enemies at every Combat',
    )
  })

  it('labels a Tower tie choice by the enemy, its place, and its health', () => {
    const start = createGame(defaultContent.config, 1)
    const placed = applyAction(start, { type: 'placeFigure', q: 0, r: 0 }).state
    const state = {
      ...placed,
      enemies: [
        { id: 'e3', kind: 'grunt', health: 2, hex: { q: 1, r: 0 }, attackedThisCombat: false },
      ],
    }
    expect(describeAction({ type: 'chooseTowerTarget', tower: 'd1', enemy: 'e3' }, state)).toMatch(
      /^Tower d1 shoots grunt e3 on .+, 2 health$/,
    )
  })

  it('labels every legal action of round 1 Prepare with the card name', () => {
    const start = createGame(defaultContent.config, 1)
    const state = applyAction(start, legalActions(start)[0]!).state
    const labels = legalActions(state).map((a) => describeAction(a, state))
    expect(labels.length).toBeGreaterThan(0)
    expect(labels.every((l) => /^(Play|Discard) (Move|Gather|Build|Rest)/.test(l))).toBe(true)
  })

  it('labels dice and Skills', () => {
    const base = createGame(defaultContent.config, 1)
    const state = {
      ...base,
      phase: 'combat' as const,
      exchange: {
        step: 'assign' as const,
        dice: [{ face: 'Star' as const, kept: false }],
        rollsUsed: 1,
        rerollsLeft: 0,
        rerolled: [],
        skirmish: null,
        bonusDamage: 0,
        ignoreHits: 0,
        assignments: [],
        queue: [],
      },
    }
    expect(
      describeAction(
        { type: 'assignDie', die: 0, skill: 'strike', use: 0, slot: 0, asFace: 'Sword' },
        state,
      ),
    ).toBe('Put die 1 (Star) on Strike as Sword')
  })

  it('names moves and builds by place and direction, and keeps the coordinate apart', () => {
    const base = createGame(defaultContent.config, 1)
    const move = { type: 'moveTo' as const, q: 0, r: -1 }
    expect(describeAction(move, base)).toMatch(/^Move to (open ground|[A-Z][a-z]+.*), 1 hex north$/)
    expect(actionHex(move)).toEqual({ q: 0, r: -1 })
    expect(actionHex({ type: 'stopMoving' })).toBeNull()
  })
})
