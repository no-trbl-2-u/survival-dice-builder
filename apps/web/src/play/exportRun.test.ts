import { botChoice } from '@survival/bot'
import { defaultContent } from '@survival/content'
import { serialize, type GameEvent } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { describeEvent } from './describeEvent.ts'
import { exportFileName, exportRun, importRun, replayExport } from './exportRun.ts'
import { newRun, step, undo, type Run } from './run.ts'

const config = defaultContent.config

/** A whole bot-played run through the UI reducer, plus every event it produced. */
function botRun(seed: number, players = 1): { run: Run; events: GameEvent[] } {
  let run = newRun(config, seed, players)
  const events: GameEvent[] = [...run.state.log]
  for (let i = 0; i < 5000 && run.state.phase !== 'ended'; i++) {
    const action = botChoice(run.state)
    if (!action) break
    const before = run.state.log.length
    run = step(run, action)
    events.push(...run.state.log.slice(Math.min(before, run.state.log.length - 1)))
  }
  return { run, events }
}

describe('exportRun', () => {
  it('replays to the same state, and names the file by seed and round', () => {
    const { run } = botRun(4)
    const data = exportRun(run)
    expect(data.version).toBe(4)
    expect(serialize(replayExport(JSON.parse(JSON.stringify(data))))).toBe(serialize(run.state))
    expect(exportFileName(data)).toBe(`survival-run-4-round-${run.state.round}.json`)
  })

  it('records the base health at the start of each round', () => {
    const { run } = botRun(4)
    expect(run.baseCurve).toHaveLength(run.state.round)
    expect(run.baseCurve[0]).toBe(config.base.startingHealth)
  })
})

describe('save and load (spec 6)', () => {
  it('a saved file loads to the identical state, co-op included', () => {
    const { run } = botRun(6, 3)
    const loaded = importRun(JSON.stringify(exportRun(run)))
    if (!('run' in loaded)) throw new Error(loaded.error)
    expect(serialize(loaded.run.state)).toBe(serialize(run.state))
    expect(loaded.run.players).toBe(3)
  })

  it('a broken or foreign file gives a plain error', () => {
    expect(importRun('not json')).toHaveProperty('error')
    expect(importRun('{"version":5}')).toEqual({ error: 'This is not a version 3 or 4 run file.' })
    expect(importRun('{"version":2}')).toEqual({
      error: 'This run file is from an earlier version and cannot be replayed.',
    })
  })

  it('a version 3 file (phase 21, no phase 22 options) loads to the same run', () => {
    const { run } = botRun(6)
    const data = JSON.parse(JSON.stringify(exportRun(run)))
    delete data.config.clock
    delete data.config.spawn
    delete data.config.gather
    const loaded = importRun(JSON.stringify({ ...data, version: 3 }))
    if (!('run' in loaded)) throw new Error(loaded.error)
    expect(serialize(loaded.run.state)).toBe(serialize(run.state))
  })

  it('undo replays every action but the last', () => {
    let run = newRun(config, 5)
    for (let i = 0; i < 4; i++) run = step(run, botChoice(run.state)!)
    const back = undo(run)
    expect(back.actions).toHaveLength(3)
    expect(serialize(step(back, run.actions[3]!).state)).toBe(serialize(run.state))
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

  it('names cards and enemies, never bare instance ids', () => {
    const { run, events } = botRun(2)
    const played = events.find((e) => e.type === 'cardPlayed')!
    const line = describeEvent(played, run.state)
    expect(line).not.toMatch(/\bc\d+\b/)
    const names = run.state.content.cards.map((c) => c.name)
    expect(names.some((n) => line.includes(n))).toBe(true)
    // The log shows the newest 60 events; the engine log keeps enough to name their enemies.
    const shown = run.state.log.slice(-60).filter((x) => x.type === 'enemyDamaged')
    expect(shown.length).toBeGreaterThan(0)
    for (const e of shown) expect(describeEvent(e, run.state)).toMatch(/^(Grunt|Elite) e\d+ /)
  })

  it('explains a gather of 0 and names co-op seats', () => {
    const state = botRun(2).run.state
    const gathered = { type: 'gathered', rule: '6.7', player: 'p1', amount: 0, materials: 0 }
    expect(describeEvent(gathered as never, state)).toBe(
      'You gathered nothing: gather on an unspent gathering node with no enemy on it.',
    )
    const spent = { ...gathered, amount: 2, materials: 2, spent: true }
    expect(describeEvent(spent as never, state)).toBe(
      'You gathered 2 materials (now 2); the node is spent.',
    )
    const coop = { ...state, players: [state.players[0]!, { ...state.players[0]!, id: 'p2' }] }
    const healed = { type: 'healed', rule: '6.4', player: 'p2', amount: 1, health: 5 }
    expect(describeEvent(healed as never, coop)).toBe('Player 2 healed 1 (health 5).')
  })

  it('names the co-op seat in skirmish results, and a repaired defense by kind', () => {
    const state = botRun(2).run.state
    const won = { type: 'skirmishEnded', rule: '6.6', player: 'p1', won: true }
    const lost = { ...won, won: false }
    expect(describeEvent(won as never, state)).toBe('Skirmish won: you move into the hex.')
    expect(describeEvent(lost as never, state)).toBe('Skirmish lost: you stay; the Move ends.')
    const coop = { ...state, players: [state.players[0]!, { ...state.players[0]!, id: 'p2' }] }
    expect(describeEvent({ ...won, player: 'p2' } as never, coop)).toBe(
      'Skirmish won: Player 2 moves into the hex.',
    )
    expect(describeEvent({ ...lost, player: 'p2' } as never, coop)).toBe(
      'Skirmish lost: Player 2 stays; the Move ends.',
    )
    const withTower = { ...state, defenses: [{ id: 'd2', kind: 'tower' }] }
    const repaired = {
      type: 'repaired',
      rule: '7.6',
      player: 'p1',
      structure: 'd2',
      amount: 1,
      health: 3,
    }
    expect(describeEvent(repaired as never, withTower as never)).toBe(
      'You repair Tower d2 for 1 (health 3).',
    )
  })
})

describe('describeEvent voice', () => {
  it('uses "an elite", names the hex, and keeps game terms lowercase mid-sentence', () => {
    const { run } = botRun(2)
    const state = run.state
    const spawned = {
      type: 'enemySpawned',
      rule: '10.2',
      enemy: 'e9',
      kind: 'elite',
      hex: { q: 0, r: 0 },
      spilled: false,
    }
    const line = describeEvent(spawned as never, state)
    expect(line).toMatch(/^An elite appears on .+ \(0,0\)\.$/)
    expect(line).not.toMatch(/on \(0,0\)/)
  })
})
