import { botChoice } from '@survival/bot'
import { defaultContent } from '@survival/content'
import { serialize, type GameEvent } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'
import { exportFileName, exportRun, replayExport } from './exportRun.ts'
import { newRun, runReducer, type Run } from './run.ts'

const config = defaultContent.config

/** A whole bot-played run through the UI reducer, plus every event it produced. */
function botRun(seed: number): { run: Run; events: GameEvent[] } {
  const reduce = runReducer(config)
  let run = newRun(config, seed)
  const events: GameEvent[] = [...run.state.log]
  for (let i = 0; i < 5000 && run.state.phase !== 'ended'; i++) {
    const action = botChoice(run.state)
    if (!action) break
    const before = run.state.log.length
    run = reduce(run, { kind: 'act', action })
    events.push(...run.state.log.slice(Math.min(before, run.state.log.length - 1)))
  }
  return { run, events }
}

describe('exportRun', () => {
  it('replays to the same state, and names the file by seed and round', () => {
    const { run } = botRun(4)
    const data = exportRun(run)
    expect(data.version).toBe(1)
    expect(serialize(replayExport(JSON.parse(JSON.stringify(data))))).toBe(serialize(run.state))
    expect(exportFileName(data)).toBe(`survival-run-4-round-${run.state.round}.json`)
  })

  it('records the base health at the start of each round', () => {
    const { run } = botRun(4)
    expect(run.baseCurve).toHaveLength(run.state.round)
    expect(run.baseCurve[0]).toBe(config.base.startingHealth)
  })
})

describe('describeEvent', () => {
  it('writes a plain sentence for every event of a full run', () => {
    const { run, events } = botRun(2)
    const types = new Set<string>()
    for (const e of events) {
      const line = describeEvent(e, run.state)
      types.add(e.type)
      expect(line.length).toBeGreaterThan(3)
      expect(line).not.toMatch(/undefined|\[object/)
    }
    expect(types.size).toBeGreaterThan(20)
  })
})
