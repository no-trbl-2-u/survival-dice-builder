import { defaultContent, type GameConfig } from '@survival/content'
import { describe, expect, it } from 'vitest'
import {
  applyBoons,
  calendarDay,
  notorietyDay,
  notorietyRung,
  sundialDay,
  threatDiceCount,
  threatDiceDay,
} from '../src/enemies/calendar.ts'
import { spawnAtNodes, spawnCount } from '../src/enemies/spawning.ts'
import { createGame, type GameState } from '../src/index.ts'
import { BASE_HEX, EMPTY_MAP, placeTile } from '../src/map/tiles.ts'

/** Event Calendar experiment (7.3, designer 2026-10-11): the 3 systems the model ranked first. */
const config = defaultContent.config
const tile = (id: string) => defaultContent.tiles.find((t) => t.id === id)!

const withCalendar = (system: NonNullable<GameConfig['calendar']>['system']): GameConfig => ({
  ...config,
  calendar: { ...config.calendar!, system },
})

/** Base tile and Stony Fields (1 spawn node), revealed in round 0, the player on the base. */
function board(
  system: NonNullable<GameConfig['calendar']>['system'],
  patch: Partial<GameState> = {},
): GameState {
  const s = createGame(withCalendar(system), 1)
  const map = placeTile(
    placeTile(EMPTY_MAP, tile('broken-village'), BASE_HEX, 0),
    tile('stony-fields'),
    { q: 2, r: 1 },
    0,
  )
  return {
    ...s,
    phase: 'combat',
    unplaced: [],
    map,
    enemies: [],
    nextEnemyId: 100,
    players: [{ ...s.players[0]!, hex: BASE_HEX }],
    ...patch,
  }
}

describe('Event Calendar off', () => {
  it('7.3 off plays the written rule: 1 enemy a node, no calendar event, no memory', () => {
    const s = board('off')
    const [day, after] = calendarDay(s)
    expect(day).toMatchObject({ grunts: 1, elites: 1, extraElites: 0, boons: [] })
    expect(after).toBe(s)
    const [spawned, events] = spawnAtNodes(s)
    expect(spawned.enemies).toHaveLength(1)
    expect(events.some((e) => e.type === 'calendarDay')).toBe(false)
    expect(spawned.calendarMark).toBeUndefined()
  })
})

describe('Sundial', () => {
  it('7.3 Sundial follows the ring: Dawn spawns nothing and rests; each lap adds 1 to raid days', () => {
    const days = [1, 2, 4, 7, 9, 10].map((round) => sundialDay(board('sundial', { round })))
    expect(days.map((d) => d.name)).toEqual([
      'Dawn',
      'Raid',
      'Harvest',
      'Blood Moon',
      'Dawn',
      'Raid',
    ])
    expect(days.map((d) => d.grunts)).toEqual([0, 1, 1, 1, 0, 2])
    expect(days[0]!.boons).toEqual(['respite'])
    expect(days[3]!.extraElites).toBe(1)
  })

  it('7.3 Sundial Dawn: no enemy spawns, the player heals and the base is repaired', () => {
    const s = board('sundial', {
      round: 1,
      base: { health: 10, maxHealth: 20 },
    })
    const hurt = { ...s, players: [{ ...s.players[0]!, health: 5 }] }
    const [after, events] = spawnAtNodes(hurt)
    expect(after.enemies).toEqual([])
    expect(after.players[0]!.health).toBe(5 + config.calendar!.respite.heal)
    expect(after.base.health).toBe(10 + config.calendar!.respite.repair)
    expect(events.map((e) => e.type)).toEqual(['calendarDay', 'healed', 'baseRepaired'])
  })

  it('6.7 Sundial Harvest: every spent gathering node works again', () => {
    const s = board('sundial', { round: 4, spentNodes: [{ q: 3, r: 1 }] })
    expect(spawnAtNodes(s)[0].spentNodes).toEqual([])
  })
})

describe('Threat dice', () => {
  it('7.3 threat dice: 1 die, then 1 more every 3 rounds', () => {
    expect(
      [1, 3, 4, 7, 10].map((round) => threatDiceCount(board('threat-dice', { round }))),
    ).toEqual([1, 1, 2, 3, 4])
  })

  it('7.3 threat dice: each Raid adds 1 enemy a node; the roll advances the run RNG', () => {
    const s = board('threat-dice', { round: 10 })
    const [day, rng] = threatDiceDay(s)
    expect(day.faces).toHaveLength(4)
    expect(day.grunts).toBe(day.faces!.filter((f) => f === 'raid').length)
    expect(rng).not.toBe(s.rng)
    expect(threatDiceDay(s)).toEqual(threatDiceDay(s))
  })

  it('17 threat dice: a new milestone sets 1 die to Boon and is remembered', () => {
    const s = board('threat-dice', { round: 1, milestones: ['survive-5'] })
    const [day, , mark] = threatDiceDay(s)
    expect(day.faces).toEqual(['boon'])
    expect(day.boons).toEqual(['respite'])
    expect(mark).toBe(1)
    expect(threatDiceDay(s)[1]).toBe(s.rng)
    expect(threatDiceDay({ ...s, calendarMark: 1 })[1]).not.toBe(s.rng)
  })
})

describe('Notoriety ladder', () => {
  it('7.3 Notoriety climbs 1 rung every 3 rounds and 1 per milestone', () => {
    expect(notorietyRung(board('notoriety', { round: 7 }))).toBe(2)
    expect(notorietyRung(board('notoriety', { round: 7, milestones: ['a', 'b'] }))).toBe(4)
  })

  it('7.3 Notoriety: a new rung rests; rung 3 brings 1 elite and 1 more enemy a node', () => {
    const [day, mark] = notorietyDay(board('notoriety', { round: 10, calendarMark: 2 }))
    expect(mark).toBe(3)
    expect(day).toMatchObject({ grunts: 2, extraElites: 1, boons: ['respite'] })
    const [again] = notorietyDay(board('notoriety', { round: 10, calendarMark: 3 }))
    expect(again).toMatchObject({ grunts: 2, extraElites: 0, boons: [] })
  })

  it('7.3 Notoriety: the extra elite comes at the spawn node nearest the base', () => {
    const s = board('notoriety', { round: 10, calendarMark: 2 })
    const [after] = spawnAtNodes(s)
    expect(after.enemies.filter((e) => e.kind === 'elite')).toHaveLength(1)
    expect(after.calendarMark).toBe(3)
  })
})

describe('boons', () => {
  it('2.1, 14.2 Respite: a knocked-out player does not heal; health stops at the maximum', () => {
    const s = board('sundial')
    const out = { ...s.players[0]!, id: 'p2', knockedOut: true, health: 0 }
    const full = { ...s.players[0]!, health: s.players[0]!.maxHealth }
    const [after] = applyBoons({ ...s, players: [full, out] }, ['respite'])
    expect(after.players.map((p) => p.health)).toEqual([full.maxHealth, 0])
  })
})

describe('limits and options with the calendar on', () => {
  it('10.5 calendar extra elites at the miniature limit turn the nearest grunt into an elite', () => {
    const s = board('notoriety', { round: 10, calendarMark: 2 })
    const full = {
      ...s,
      config: { ...s.config, miniatureLimit: 1 },
      enemies: [{ id: 'e1', kind: 'grunt', health: 2, hex: { q: 1, r: 1 } }],
    }
    const [after, events] = spawnAtNodes(full)
    expect(after.enemies).toHaveLength(1)
    expect(after.enemies[0]!.kind).toBe('elite')
    expect(events.some((e) => e.type === 'eliteReplaced')).toBe(true)
  })

  it('9.8 calendar: a second enemy on one node spills over', () => {
    const [after, events] = spawnAtNodes(board('sundial', { round: 10 }))
    expect(after.enemies).toHaveLength(2)
    expect(
      events
        .filter((e) => e.type === 'enemySpawned')
        .map((e) => e.type === 'enemySpawned' && e.spilled),
    ).toEqual([false, true])
  })

  it('7.3 threat dice with no Raid spawn nothing at any node', () => {
    const s = board('threat-dice', { round: 1 })
    const calm = Array.from({ length: 50 }, (_, rng) => ({ ...s, rng }))
      .filter((t) => threatDiceDay(t)[0].faces?.[0] === 'calm')
      .at(0)
    expect(calm).toBeDefined()
    expect(spawnAtNodes(calm ?? s)[0].enemies).toEqual([])
  })

  it('7.3 the calendar ramp replaces spawn.rampEvery; off keeps it', () => {
    const ramp = (system: Parameters<typeof withCalendar>[0]) => {
      const cfg = withCalendar(system)
      return spawnCount({
        ...createGame({ ...cfg, spawn: { ...cfg.spawn, rampEvery: 1 } }, 1),
        round: 5,
      })
    }
    expect(ramp('off')).toBe(5)
    expect(ramp('sundial')).toBe(1)
  })
})
