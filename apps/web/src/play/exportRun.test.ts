import { botChoice } from '@survival/bot'
import { applyProposal, defaultContent, defaultProposals } from '@survival/content'
import { serialize, type GameEvent } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { baseCentre, ENGINE_ID } from '../names/pieceNames.ts'
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

  it('records the app commit and the fields changed from the standard rules', () => {
    const { run } = botRun(4)
    expect(exportRun(run)).toMatchObject({ commit: expect.any(String), changedKeys: [] })
    const changed = newRun({ ...config, miniatureLimit: config.miniatureLimit + 1 }, 4)
    expect(exportRun(changed).changedKeys).toEqual(['miniatureLimit'])
  })

  it('records the proposals the config carries (phase 39)', () => {
    expect(exportRun(newRun(config, 4)).proposals).toEqual([])
    const reveal = defaultProposals[0]
    if (!reveal) throw new Error('no proposals')
    expect(exportRun(newRun(applyProposal(config, reveal), 4)).proposals).toEqual([reveal.id])
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
    // Engagements (the default since phase 23) end a run on siege hits and enemy dice.
    const shown = run.state.log
      .slice(-60)
      .filter((x) => x.type === 'enemyDamaged' || x.type === 'enemyAttacked')
    expect(shown.length).toBeGreaterThan(0)
    for (const e of shown) {
      const line = describeEvent(e, run.state)
      expect(line).toMatch(/^(Grunt|Elite) /)
      expect(line).not.toMatch(ENGINE_ID)
    }
  })

  it('ends an engagement with the engagement word, and an exchange with its own', () => {
    const { run, events } = botRun(2)
    const ended = events.find((e) => e.type === 'exchangeEnded')!
    expect(describeEvent(ended, run.state)).toBe('The engagement ends.')
    const exchange = { type: 'exchangeEnded', rule: '7.8', player: 'p1' }
    expect(describeEvent(exchange as never, run.state)).toBe('The exchange ends.')
  })

  it('explains a gather of 0 and names co-op seats', () => {
    const state = botRun(2).run.state
    const gathered = { type: 'gathered', rule: '6.7', player: 'p1', amount: 0, materials: 0 }
    expect(describeEvent(gathered as never, state)).toBe(
      'You gather nothing: gather on an unspent gathering node with no enemy on it.',
    )
    const spent = { ...gathered, amount: 2, materials: 2, spent: true }
    expect(describeEvent(spent as never, state)).toBe(
      'You gather 2 materials (now 2); the node is spent.',
    )
    // A Gather off a node can give 1 (gather.offNodeAmount): the singular, as the knockout line.
    const one = { ...gathered, amount: 1, materials: 3 }
    expect(describeEvent(one as never, state)).toBe('You gather 1 material (now 3).')
    const coop = { ...state, players: [state.players[0]!, { ...state.players[0]!, id: 'p2' }] }
    const healed = { type: 'healed', rule: '6.4', player: 'p2', amount: 1, health: 5 }
    expect(describeEvent(healed as never, coop)).toBe('Player 2 heals 1 health (health 5).')
    // As complete as the guard line: the amount names its unit.
    const guard = { type: 'guardGained', rule: '6.4', player: 'p1', amount: 2, guard: 3 }
    expect(describeEvent(guard as never, state)).toBe('You gain 2 guard (guard 3).')
    expect(describeEvent({ ...healed, player: 'p1' } as never, state)).toBe(
      'You heal 1 health (health 5).',
    )
  })

  it('names the currency a card costs, as an upgrade names its materials', () => {
    const state = botRun(2).run.state
    const card = state.content.cards.find((c) => c.level > 0)!
    const bought = { type: 'cardBought', rule: '6.8, 13.1', player: 'p1', card: card.id, cost: 3 }
    expect(describeEvent(bought as never, state)).toBe(`You buy ${card.name} for 3 currency.`)
  })

  it('says "1 material" for a build or upgrade a Mason or Engineer Build brings down to 1', () => {
    const state = botRun(2).run.state
    const base = baseCentre(state.map)
    const north = { q: base.q, r: base.r - 1 }
    const built = {
      type: 'defenseBuilt',
      rule: '6.6',
      player: 'p1',
      kind: 'barricade',
      hex: north,
      cost: 1,
    }
    expect(describeEvent(built as never, state)).toMatch(
      /^You build a Barricade on .+ for 1 material\.$/,
    )
    expect(describeEvent({ ...built, cost: 2 } as never, state)).toMatch(/ for 2 materials\.$/)
    const upgrade = state.content.upgrades[0]!
    const bought = {
      type: 'upgradeBought',
      rule: '8.1',
      player: 'p1',
      upgrade: upgrade.id,
      cost: 1,
      baseHealth: 12,
    }
    expect(describeEvent(bought as never, state)).toBe(
      `You buy ${upgrade.name} for 1 material (base health 12).`,
    )
  })

  it('names a repaired defense by kind', () => {
    const state = botRun(2).run.state
    const base = baseCentre(state.map)
    const north = { q: base.q, r: base.r - 1 }
    const withTower = { ...state, defenses: [{ id: 'd2', kind: 'tower', hex: north }] }
    const repaired = {
      type: 'repaired',
      rule: '7.6',
      player: 'p1',
      structure: 'd2',
      amount: 1,
      health: 3,
    }
    expect(describeEvent(repaired as never, withTower as never)).toBe(
      'You repair Tower 1 hex north of the base center by 1 health (health 3).',
    )
  })

  it('names the unit on attack lines and writes terrain as /tiles does', () => {
    const state = botRun(2).run.state
    const attacks = [
      { type: 'enemyAttacked', rule: '7.8', enemy: 'e1', player: 'p1', damage: 2 },
      { type: 'structureAttacked', rule: '8.3', enemy: 'e1', structure: 'base', damage: 2 },
      { type: 'towerAttacked', rule: '8.2', tower: 'd1', enemy: 'e1', damage: 2 },
    ]
    for (const e of attacks) {
      expect(describeEvent(e as never, state)).toMatch(/ for 2 damage\.$/)
    }
    const blocked = { type: 'revealStepBlocked', player: 'p1', hex: { q: 9, r: 9 }, hexesLeft: 1 }
    expect(describeEvent(blocked as never, state)).toMatch(/it is Lake or Mountain \(1 left\)\.$/)
  })

  it('names a defeated enemy once on the cancelled-die line', () => {
    const cancelled = { type: 'enemyDieCancelled', rule: 'Combat v3', enemy: 'e9', player: 'p1' }
    const log = [{ type: 'enemyDefeated', rule: '7.6', enemy: 'e9', kind: 'grunt', by: 'p1' }]
    const names = { ...botRun(2).run.state, enemies: [], log }
    expect(describeEvent(cancelled as never, names as never)).toBe(
      "The defeated grunt's die is cancelled.",
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
