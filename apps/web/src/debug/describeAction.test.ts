import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { describeAction } from './describeAction.ts'

describe('describeAction', () => {
  it('labels the setup tile placement', () => {
    const state = createGame(defaultContent.config, 1)
    const labels = legalActions(state).map((a) => describeAction(a, state))
    expect(labels).toHaveLength(6)
    expect(labels.every((l) => /^Place [a-z-]+ at \(-?\d+,-?\d+\)$/.test(l))).toBe(true)
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
})
