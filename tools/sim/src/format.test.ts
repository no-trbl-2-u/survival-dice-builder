import { describe as suite, expect, it } from 'vitest'
import { describe, toJson } from './format.ts'
import { EMPTY_TALLY, type RunResult, type Summary } from './run.ts'

/** A hand-built batch summary; only the fields `describe` prints matter. */
function summary(medianEndRound: number): Summary {
  return {
    runs: 20,
    errors: 1,
    stalled: 2,
    medianEndRound,
    middleHalf: [7, 12],
    minEndRound: 4,
    maxEndRound: 16,
    causes: { base: 18, stalled: 2 },
    milestones: { firstUpgrade: 5 },
    medianLevel: 3,
    levelAt: { '3': 1, '6': 2, '9': 3 },
    capReached: 0,
    medianCapRound: Number.NaN,
    rounds: {},
    totals: { ...EMPTY_TALLY, hits: 40, combats: 200 },
  }
}

suite('describe', () => {
  it('prints the counts, end rounds, causes, level and every tally total', () => {
    const lines = describe(summary(10), [8, 14]).split('\n')
    expect(lines).toEqual([
      'runs 20, errors 1, stalled 2',
      'end round: median 10, middle half 7-12, range 4-16',
      'causes: {"base":18,"stalled":2}',
      'median level 3; milestones: {"firstUpgrade":5}',
      expect.stringMatching(/^play totals: hits 40, cancelled 0, .*, combats 200$/),
      'target band 8-14: inside',
    ])
    for (const key of Object.keys(EMPTY_TALLY)) expect(lines[4]).toContain(`${key} `)
  })

  it('counts both band edges as inside', () => {
    expect(describe(summary(8), [8, 14])).toMatch(/target band 8-14: inside$/)
    expect(describe(summary(14), [8, 14])).toMatch(/target band 8-14: inside$/)
  })

  it('flags a median below or above the band as OUTSIDE', () => {
    expect(describe(summary(7), [8, 14])).toMatch(/target band 8-14: OUTSIDE$/)
    expect(describe(summary(15), [8, 14])).toMatch(/target band 8-14: OUTSIDE$/)
  })
})

suite('toJson', () => {
  it('writes the summary and every run, indented, with a final newline', () => {
    const run = { seed: 3, endRound: 9 } as unknown as RunResult
    const text = toJson(summary(10), [run])
    expect(text.endsWith('}\n')).toBe(true)
    expect(text).toContain('\n  "summary": {')
    const parsed = JSON.parse(text) as { summary: Summary; runs: RunResult[] }
    expect(parsed.runs).toEqual([run])
    expect(parsed.summary.medianEndRound).toBe(10)
    // JSON has no NaN; a batch where no run reached the cap writes null.
    expect(parsed.summary.medianCapRound).toBeNull()
  })
})
