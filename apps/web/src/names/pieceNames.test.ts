import { botChoice } from '@survival/bot'
import { defaultContent, type GameConfig } from '@survival/content'
import { legalActions, type Axial, type GameState } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { presetName } from '../config/ConfigPage.tsx'
import { describeAction } from '../debug/describeAction.ts'
import { hexTitle } from '../map/places.ts'
import { describeEvent } from '../play/describeEvent.ts'
import { nextStep, towerTargetLabel } from '../play/nextStep.ts'
import { newRun, step } from '../play/run.ts'
import {
  baseCentre,
  defenseNameFromBase,
  enemyName,
  enemyNameFromBase,
  ENGINE_ID,
} from './pieceNames.ts'

const config = defaultContent.config

/** A state with two grunts the same distance and direction from the player, and one Tower. */
function twoGrunts(): GameState {
  const s = newRun(config, 1).state
  const base = baseCentre(s.map)
  const at = (dq: number, dr: number): Axial => ({ q: base.q + dq, r: base.r + dr })
  return {
    ...s,
    players: s.players.map((p) => ({ ...p, hex: base })),
    enemies: [
      { id: 'e7', kind: 'grunt', health: 2, hex: at(2, -1), attackedThisCombat: false },
      { id: 'e3', kind: 'grunt', health: 2, hex: at(2, -1), attackedThisCombat: false },
      { id: 'e9', kind: 'grunt', health: 2, hex: at(-1, 0), attackedThisCombat: false },
    ],
    defenses: [{ id: 'd1', kind: 'tower', hex: at(0, -1), health: 3, builder: 'p1' }],
  }
}

describe('piece names', () => {
  it('names an enemy by kind and place, with an ordinal only for two that read the same', () => {
    const s = twoGrunts()
    const from = baseCentre(s.map)
    expect(enemyName(s, 'e3', from)).toMatch(/^grunt, 2 hexes .+ \(1\)$/)
    expect(enemyName(s, 'e7', from)).toMatch(/^grunt, 2 hexes .+ \(2\)$/)
    expect(enemyName(s, 'e9', from)).toBe('grunt, 1 hex north-west')
    expect(enemyName(s, 'gone', from)).toBe('enemy')
  })

  it('names log pieces from the base centre', () => {
    const s = twoGrunts()
    expect(enemyNameFromBase(s, 'e9')).toBe('grunt 1 hex north-west of the base centre')
    expect(defenseNameFromBase(s, 'd1')).toBe('Tower 1 hex north of the base centre')
    expect(defenseNameFromBase(s, 'gone')).toBe('a defense')
  })

  it('/debug labels keep the engine id; /play labels never show it', () => {
    const s = twoGrunts()
    const target = { type: 'chooseTarget', enemy: 'e9' } as const
    expect(describeAction(target, s)).not.toMatch(ENGINE_ID)
    expect(describeAction(target, s, { ids: true })).toContain('[e9]')
  })

  it('/config names presets by place and deck, not by id', () => {
    const presets = config.deck.presets
    expect(presets.map(presetName).join(' ')).not.toMatch(ENGINE_ID)
    expect(presetName(presets[0]!, 0)).toMatch(/^Preset 1: \d+ cards, hand of \d+$/)
  })
})

/** Every line of player text a /play state produces: choices, banner, log, map titles. */
function playerText(state: GameState): string[] {
  const legal = legalActions(state)
  const towers = legal.flatMap((a) =>
    a.type === 'chooseTowerTarget' ? [towerTargetLabel(state, a)] : [],
  )
  const hexes = [...state.enemies.map((e) => e.hex), ...state.defenses.map((d) => d.hex)]
  const banner = nextStep(state, legal)
  return [
    ...legal.map((a) => describeAction(a, state)),
    ...towers,
    banner.phase,
    banner.step,
    ...state.log.slice(-60).map((e) => describeEvent(e, state)),
    ...hexes.map((h) => hexTitle(state, h)),
  ]
}

describe('no engine ids in /play text', () => {
  const runs: [string, GameConfig, number][] = [
    ['engagements', config, 1],
    ['engagements', config, 7],
    ['exchanges', { ...config, combat: { ...config.combat, model: 'exchange' } }, 3],
    ['co-op', config, 5],
  ]
  it.each(runs)(
    'a seeded %s run never shows an id',
    (_, cfg, seed) => {
      let run = newRun(cfg, seed, seed === 5 ? 2 : 1)
      const leaks = new Set<string>()
      for (let i = 0; i < 3000 && run.state.phase !== 'ended'; i++) {
        if (i % 7 === 0)
          for (const line of playerText(run.state)) if (ENGINE_ID.test(line)) leaks.add(line)
        const action = botChoice(run.state)
        if (!action) break
        run = step(run, action)
      }
      expect([...leaks].slice(0, 5)).toEqual([])
    },
    60_000,
  )
})
