import { describe, expect, it } from 'vitest'
import { playtestReport, summarizePlaytests, verdict, type PlaytestExport } from './playtests.ts'

const run = (
  round: number,
  minutesPerRound: number | null,
  extra: Partial<PlaytestExport> = {},
): PlaytestExport => {
  const ms = (minutesPerRound ?? 0) * 60_000
  const byRound = Object.fromEntries(Array.from({ length: round }, (_, i) => [String(i + 1), ms]))
  return {
    seed: round,
    round,
    endedBecause: 'base',
    players: 1,
    ...(minutesPerRound === null
      ? {}
      : {
          sessionMs: ms * round,
          timing: { byPhase: { combat: ms * round }, byDecision: { roll: ms * round }, byRound },
        }),
    ...extra,
  }
}

describe('playtest summary', () => {
  const runs = [
    run(10, 7),
    run(12, 9, { players: 2, endedBecause: 'player' }),
    run(14, 8),
    run(9, null, { endedBecause: null }),
  ]

  it('counts sessions, players, causes; minutes only from timed runs', () => {
    const s = summarizePlaytests(runs)
    expect(s.sessions).toBe(4)
    expect(s.timed).toBe(3)
    expect(s.byPlayers).toEqual({ '1p': 3, '2p': 1 })
    expect(s.causes).toEqual({ base: 2, player: 1, unfinished: 1 })
    expect(s.medianEndRound).toBe(10)
    expect(s.medianMinutesPerRound).toBe(8)
    expect(s.medianSessionMinutes).toBe(108)
    expect(s.ratio).toBeCloseTo(8 / 8.5)
  })

  it('compares with the 8-9 minute band', () => {
    expect(verdict(8.4)).toBe('on the estimate (8-9)')
    expect(verdict(6)).toMatch(/^faster/)
    expect(verdict(11)).toMatch(/^slower/)
    expect(verdict(Number.NaN)).toBe('no timed sessions yet')
  })

  it('writes the report table with the estimate line', () => {
    const md = playtestReport(runs.map((data, i) => ({ name: `s${i}.json`, data })))
    expect(md).toContain('| Sessions (with timing) | 4 (3) |')
    expect(md).toContain('| Against the estimate (8.5 min) | 0.94x: on the estimate (8-9) |')
    expect(md).toContain('| s3.json | 1 | 9 | unfinished | - | - |')
    expect(md).toContain('## Where the time went')
  })

  it('says so when there are no sessions yet', () => {
    expect(playtestReport([])).toMatch(/^No sessions yet/)
  })
})
