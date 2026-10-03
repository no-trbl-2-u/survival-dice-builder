import { defaultContent } from '@survival/content'
import { legalActions } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { exportRun, importRun } from './exportRun.ts'
import { newRun, step, undo } from './run.ts'
import { closeTiming, recordGap, resumeTiming, sessionMs, startTiming, total } from './timing.ts'

describe('timing', () => {
  it('adds each gap to its phase, decision, and round', () => {
    let t = startTiming(1000)
    t = recordGap(t, 1500, 'prepare', 'playCard', 1)
    t = recordGap(t, 1800, 'combat', 'roll', 1)
    t = recordGap(t, 2800, 'prepare', 'playCard', 2)
    expect(t.byPhase).toEqual({ prepare: 1500, combat: 300 })
    expect(t.byDecision).toEqual({ playCard: 1500, roll: 300 })
    expect(t.byRound).toEqual({ '1': 800, '2': 1000 })
    expect(sessionMs(t)).toBe(1800)
    expect(total(t.byPhase)).toBe(sessionMs(t))
  })

  it('ignores a clock that goes backwards', () => {
    const t = recordGap(startTiming(1000), 900, 'prepare', 'roll', 1)
    expect(t.lastAt).toBe(1000)
    expect(total(t.byPhase)).toBe(0)
  })

  it('closes the open wait as "waiting"', () => {
    const t = closeTiming(startTiming(0), 400, 'combat', 3)
    expect(t.byDecision).toEqual({ waiting: 400 })
    expect(total(t.byRound)).toBe(sessionMs(t))
  })

  it('resumes on a new clock without counting the gap', () => {
    const saved = recordGap(startTiming(0), 500, 'prepare', 'roll', 1)
    const t = resumeTiming(saved, 10_000)
    expect(sessionMs(t)).toBe(500)
    expect(sessionMs(recordGap(t, 10_100, 'prepare', 'roll', 1))).toBe(600)
  })
})

describe('run timing', () => {
  const config = defaultContent.config
  const play = (n: number) => {
    let run = newRun(config, 3, 1, 0)
    for (let i = 1; i <= n; i++) run = step(run, legalActions(run.state)[0]!, i * 100)
    return run
  }

  it('records every action and exports parts that sum to the session', () => {
    const data = exportRun(play(6), 900)
    expect(data.sessionMs).toBe(900)
    expect(total(data.timing!.byPhase)).toBe(900)
    expect(total(data.timing!.byDecision)).toBe(900)
    expect(total(data.timing!.byRound)).toBe(900)
  })

  it('keeps timing through undo and load', () => {
    const run = play(4)
    expect(undo(run).timing).toEqual(run.timing)
    const loaded = importRun(JSON.stringify(exportRun(run)), 50_000)
    if (!('run' in loaded)) throw new Error(loaded.error)
    expect(sessionMs(loaded.run.timing)).toBe(400)
  })

  it('loads an old file without timing', () => {
    const old: Record<string, unknown> = { ...exportRun(play(2)) }
    delete old.timing
    delete old.sessionMs
    const loaded = importRun(JSON.stringify(old), 7)
    if (!('run' in loaded)) throw new Error(loaded.error)
    expect(loaded.run.timing.startedAt).toBe(7)
  })
})
