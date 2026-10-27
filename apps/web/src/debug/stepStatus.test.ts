import type { GameState } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { stepStatus } from './stepStatus.ts'

const state = (round: number, phase: GameState['phase']) => ({ round, phase }) as GameState

describe('stepStatus', () => {
  it('sums up an Autoplay in one line with the round the run ended in', () => {
    expect(stepStatus({ by: 'autoplay', actions: 312, events: 900 }, state(7, 'ended'))).toBe(
      'Autoplay: 312 actions. The run ended in round 7.',
    )
  })

  it('counts new events for a single step and names the round and phase', () => {
    expect(stepStatus({ by: 'action', actions: 1, events: 1 }, state(2, 'prepare'))).toBe(
      'Action: 1 new event. Round 2, Prepare.',
    )
    expect(stepStatus({ by: 'bot step', actions: 1, events: 4 }, state(3, 'combat'))).toBe(
      'Bot step: 4 new events. Round 3, Combat.',
    )
  })
})
