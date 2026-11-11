import { defaultContent, GameConfigSchema, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { playRun } from './run.ts'
import { playTheater } from './theater.ts'

const withCalendar = (system: NonNullable<GameConfig['calendar']>['system']): GameConfig =>
  GameConfigSchema.parse({
    ...defaultContent.config,
    calendar: { ...defaultContent.config.calendar, system },
  })

describe('Run Theater', () => {
  it('a recorded run ends in the same round, for the same cause, as the sim batch run', () => {
    for (const system of ['off', 'notoriety'] as const) {
      for (const seed of [1, 2, 3]) {
        const config = withCalendar(system)
        const batch = playRun(config, seed, { policy: 'defender' })
        const theater = playTheater(config, seed, { policy: 'defender' })
        expect([theater.endRound, theater.cause]).toEqual([batch.endRound, batch.cause])
      }
    }
  })

  it('7.3 records a frame per Combat: the round, the spawns, and the calendar day', () => {
    const run = playTheater(withCalendar('sundial'), 1, { policy: 'default' })
    expect(run.frames.map((f) => f.round)).toEqual(run.frames.map((_, i) => i + 1))
    expect(run.frames[0]?.day).toMatchObject({ name: 'Dawn', boons: ['respite'] })
    expect(run.frames[0]?.spawned).toBe(0)
    expect(playTheater(withCalendar('off'), 1).frames[0]?.day).toBeNull()
  })

  it('maxRounds stops a run early', () => {
    const run = playTheater(withCalendar('off'), 1, { policy: 'defender', maxRounds: 3 })
    expect(run.frames.length).toBeLessThanOrEqual(3)
  })
})
