import type { GameEvent } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { cuesFor } from './cues.ts'
import { VOICES } from './sound.ts'

const ev = (e: Record<string, unknown>) => ({ rule: '0', ...e }) as unknown as GameEvent

describe('sound cues', () => {
  it('maps events to distinct cues, most important first, at most 2', () => {
    const events = [
      ev({ type: 'diceRolled', player: 'p1', faces: [], roll: 1 }),
      ev({ type: 'enemyDamaged', enemy: 'e1', amount: 1, health: 1 }),
      ev({ type: 'enemyDamaged', enemy: 'e2', amount: 1, health: 0 }),
      ev({ type: 'levelReached', level: 2 }),
    ]
    expect(cuesFor(events)).toEqual(['levelUp', 'hit'])
    expect(cuesFor(events, 5)).toEqual(['levelUp', 'hit', 'roll'])
  })

  it('is silent for bookkeeping events', () => {
    expect(cuesFor([ev({ type: 'dieKept', player: 'p1', die: 0, kept: true })])).toEqual([])
    expect(cuesFor([])).toEqual([])
  })

  it('every cue has a voice', () => {
    for (const notes of Object.values(VOICES)) expect(notes.length).toBeGreaterThan(0)
  })
})
