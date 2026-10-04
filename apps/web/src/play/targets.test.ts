import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions, type Action } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { newRun, reduceRun } from './run.ts'
import { COVERED, firstOf, hexTargets, placementsFor } from './targets.ts'

const config = defaultContent.config

describe('reduceRun', () => {
  it('keeps the action list and the engine state in step', () => {
    const reduce = reduceRun
    const start = newRun(config, 5)
    const action = legalActions(start.state)[0]!
    const next = reduce(start, { kind: 'act', action, at: 0 })
    expect(next.actions).toEqual([action])
    expect(next.state).toEqual(applyAction(start.state, action).state)
    expect(reduce(next, { kind: 'new', config, seed: 9, players: 1, at: 0 }).actions).toEqual([])
  })
})

describe('targets', () => {
  it('groups start hexes, steps, and builds by hex', () => {
    const legal: Action[] = [
      { type: 'placeFigure', q: 2, r: 1 },
      { type: 'moveTo', q: 1, r: 0 },
      { type: 'build', defense: 'tower', q: 1, r: 0 },
      { type: 'build', defense: 'barricade', q: 1, r: 0 },
    ]
    const t = hexTargets(legal)
    expect(t.get('2,1')?.start).toEqual(legal[0])
    expect(t.get('1,0')?.move).toEqual(legal[1])
    expect(t.get('1,0')?.builds).toHaveLength(2)
  })

  it('finds the placements of 1 die and the first action of a type', () => {
    const legal: Action[] = [
      { type: 'confirmAssignment' },
      { type: 'assignDie', die: 0, skill: 'strike', use: 0, slot: 0, asFace: 'Sword' },
      { type: 'assignDie', die: 1, skill: 'shot', use: 0, slot: 0, asFace: 'Bow' },
    ]
    expect(placementsFor(legal, 1)).toEqual([legal[2]])
    expect(firstOf(legal, 'confirmAssignment')).toEqual(legal[0])
  })

  it('every action type of a new run has a control or a Choices button', () => {
    const s = createGame(config, 1)
    for (const a of legalActions(s))
      expect(COVERED.has(a.type) || a.type === 'placeFigure').toBe(true)
  })
})
