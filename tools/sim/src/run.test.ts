import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { csvField, toCsv } from './format.ts'
import { levelAt, playRun, quantile, runBatch, summarize, type RunResult } from './run.ts'

const config = defaultContent.config

describe('playRun', () => {
  it('is deterministic per seed and plays to an end', () => {
    const a = playRun(config, 3)
    expect(playRun(config, 3)).toEqual(a)
    expect(a.cause).toBe('base')
    expect(a.baseCurve).toHaveLength(a.endRound)
    expect(a.levelCurve).toHaveLength(a.endRound)
  })

  it('plays every seat with --seats', () => {
    const duo = playRun(config, 3, { seats: 2 })
    expect(duo.cause).toBe('base')
    expect(duo).not.toEqual(playRun(config, 3))
  })

  it('the turtle policy never takes a figure off the Base tile and still plays to an end', () => {
    const turtle = playRun({ ...config, clock: { forcedRevealEvery: 3 } }, 5, { policy: 'turtle' })
    expect(turtle.cause).toBe('base')
  })
})

describe('the default batch (phase 22: no default changes)', () => {
  it('matches the phase 21 summary on seeds 1-200', () => {
    const s = summarize(runBatch(config, 200, 1))
    expect([s.medianEndRound, s.middleHalf, s.minEndRound, s.maxEndRound]).toEqual([
      6,
      [6, 8],
      5,
      12,
    ])
    expect(s.causes).toEqual({ base: 200 })
    expect(s.milestones).toEqual({
      'survive-round-5': 200,
      'defeat-elite': 35,
      'buy-upgrades': 57,
      'survive-round-10': 22,
    })
  })
})

describe('summary maths', () => {
  it('quantile uses the nearest rank', () => {
    expect(quantile([1, 2, 3, 4], 0.5)).toBe(2)
    expect(quantile([1, 2, 3, 4, 5], 0.5)).toBe(3)
    expect(quantile([1, 2, 3, 4], 0.75)).toBe(3)
    expect(quantile([], 0.5)).toBeNaN()
  })

  it('summarize counts causes and errors', () => {
    const run = (endRound: number, cause: RunResult['cause']): RunResult => ({
      seed: endRound,
      endRound,
      cause,
      error: cause === 'error' ? 'boom' : null,
      baseHealth: 0,
      baseCurve: [],
      enemyCurve: [],
      levelCurve: [1, 1, 2],
      capReachedRound: null,
      level: 1,
      skills: [],
      milestones: ['survive-round-5'],
      actions: 1,
    })
    const s = summarize([run(9, 'base'), run(12, 'stalled'), run(15, 'error')])
    expect(s.medianEndRound).toBe(12)
    expect(s.errors).toBe(1)
    expect(s.causes).toEqual({ base: 1, stalled: 1, error: 1 })
    expect(s.milestones).toEqual({ 'survive-round-5': 3 })
    expect(levelAt([run(9, 'base')], 3)).toBe(2)
    expect(levelAt([run(9, 'base')], 6)).toBeNaN()
  })
})

describe('CSV', () => {
  it('quotes fields with commas or quotes', () => {
    expect(csvField('a,b')).toBe('"a,b"')
    expect(csvField('say "hi"')).toBe('"say ""hi"""')
    expect(csvField('plain')).toBe('plain')
  })

  it('writes a header and 1 line per run', () => {
    const csv = toCsv([playRun(config, 1)])
    const lines = csv.trim().split('\n')
    expect(lines[0]).toMatch(/^seed,endRound,cause,/)
    expect(lines).toHaveLength(2)
  })
})
