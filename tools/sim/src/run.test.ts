import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { csvField, toCsv } from './format.ts'
import { playRun, quantile, summarize, type RunResult } from './run.ts'

const config = defaultContent.config

describe('playRun', () => {
  it('is deterministic per seed and plays to an end', () => {
    const a = playRun(config, 3)
    expect(playRun(config, 3)).toEqual(a)
    expect(['base', 'player']).toContain(a.cause)
    expect(a.baseCurve).toHaveLength(a.endRound)
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
      level: 1,
      skills: [],
      milestones: ['survive-round-5'],
      actions: 1,
    })
    const s = summarize([run(9, 'base'), run(12, 'player'), run(15, 'error')])
    expect(s.medianEndRound).toBe(12)
    expect(s.errors).toBe(1)
    expect(s.causes).toEqual({ base: 1, player: 1, error: 1 })
    expect(s.milestones).toEqual({ 'survive-round-5': 3 })
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
