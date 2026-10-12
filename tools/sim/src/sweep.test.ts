import { describe, expect, it } from 'vitest'
import { EMPTY_TALLY, summarize, type RunResult } from './run.ts'
import { parseSet, sweepCells, sweepTable } from './sweep.ts'

const run = (endRound: number): RunResult => ({
  seed: 1,
  endRound,
  cause: 'base',
  error: null,
  baseHealth: 0,
  baseCurve: [],
  enemyCurve: [],
  levelCurve: [],
  capReachedRound: null,
  level: 1,
  skills: [],
  milestones: [],
  actions: 1,
  tally: { ...EMPTY_TALLY, combats: endRound, placements: 3 * endRound, knockouts: 1 },
})

describe('parseSet', () => {
  it('reads a dotted key and typed values', () => {
    expect(parseSet('spawn.rampEvery=2,3,null')).toEqual({
      path: 'spawn.rampEvery',
      values: [2, 3, null],
    })
    expect(parseSet('combat.model=engage,exchange').values).toEqual(['engage', 'exchange'])
  })

  it('rejects a missing key or value', () => {
    expect(() => parseSet('spawn.rampEvery')).toThrow('--set must be key=a,b,c')
    expect(() => parseSet('=2,3')).toThrow('--set must be key=a,b,c')
    expect(() => parseSet('spawn.rampEvery=2,,3')).toThrow('--set must be key=a,b,c')
  })
})

describe('sweepCells', () => {
  it('is every value x seats x policy, the first set varying slowest', () => {
    const cells = sweepCells(
      [parseSet('spawn.rampEvery=2,3'), parseSet('spawn.perSeat=true,false')],
      [1, 4],
      ['default', 'defender'],
    )
    expect(cells).toHaveLength(2 * 2 * 2 * 2)
    expect(cells[0]).toEqual({
      values: [
        { path: 'spawn.rampEvery', value: 2 },
        { path: 'spawn.perSeat', value: true },
      ],
      seats: 1,
      policy: 'default',
    })
    expect(cells[1]?.policy).toBe('defender')
    expect(cells[2]?.seats).toBe(4)
    expect(cells.at(-1)?.values.map((v) => v.value)).toEqual([3, false])
  })
})

describe('sweepTable', () => {
  it('writes one row per batch with the values, seats, bot, and upkeep per Combat', () => {
    const cells = sweepCells([parseSet('spawn.rampEvery=2,4')], [2], ['defender'])
    const md = sweepTable(
      'rec',
      cells.map((cell, i) => ({ cell, summary: summarize([run(6 + i), run(8 + i)]) })),
    )
    const lines = md.split('\n')
    expect(lines[0]).toBe("Sweep over rec; every count is the total over the batch's runs.")
    expect(lines[2]).toMatch(/^\| `spawn.rampEvery` \| Seats \| Bot \| Runs \| Median end round/)
    expect(lines[2]).toContain('Placements per Combat')
    expect(lines).toHaveLength(4 + 2)
    expect(lines[4]).toBe(
      '| 2 | 2 | defender | 2 | 6 | 6-8 | 0 | 0 | 0 | 0 | 2 | 0 | 3.00 | 0.00 | 0.00 |',
    )
    expect(lines[5]).toMatch(/^\| 4 \| 2 \| defender \| 2 \| 7 \|/)
  })
})
