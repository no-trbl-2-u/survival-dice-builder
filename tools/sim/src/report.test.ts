import { describe, expect, it } from 'vitest'
import { compareTable, minutesPerRound, timingReport, type TimedExport } from './report.ts'
import { summarize, type RunResult } from './run.ts'

const result = (seed: number, endRound: number): RunResult => ({
  seed,
  endRound,
  cause: 'base',
  baseHealth: 0,
  level: 2,
  actions: 10,
  skills: [],
  milestones: [],
  baseCurve: [],
  enemyCurve: [],
  error: null,
})

describe('compareTable', () => {
  it('puts both summaries side by side', () => {
    const a = summarize([result(1, 10), result(2, 12)])
    const b = summarize([result(1, 14), result(2, 16)])
    const md = compareTable({ name: 'default', summary: a }, { name: 'hard.json', summary: b })
    expect(md).toContain('| | A: default | B: hard.json |')
    expect(md).toContain('| Median end round | 10 | 14 |')
    expect(md).toContain('| Middle half | 10-12 | 14-16 |')
    expect(md).toContain('| Causes | base 2 | base 2 |')
    expect(md).toContain('pnpm sim -- timing')
  })
})

describe('timingReport', () => {
  const run: TimedExport = {
    seed: 4,
    round: 3,
    sessionMs: 360_000,
    timing: {
      byPhase: { prepare: 240_000, combat: 120_000 },
      byDecision: { playCard: 300_000, roll: 60_000 },
      byRound: { '1': 60_000, '2': 120_000, '3': 180_000 },
    },
  }

  it('gives minutes per round as the mean over rounds', () => {
    expect(minutesPerRound(run)).toBe(2)
    expect(minutesPerRound({ seed: 1, round: 1 })).toBeNaN()
  })

  it('reports shares and skips files without timing', () => {
    const md = timingReport([
      { name: 'a.json', data: run },
      { name: 'old.json', data: { seed: 9, round: 2 } },
    ])
    expect(md).toContain('Exports: 2 (1 with timing).')
    expect(md).toContain('Median minutes per round: 2.0.')
    expect(md).toContain('| a.json | 4 | 3 | 6.0 | 2.0 |')
    expect(md).toContain('| prepare | 4.0 | 67% |')
    expect(md).toContain('| roll | 1.0 | 17% |')
  })
})
