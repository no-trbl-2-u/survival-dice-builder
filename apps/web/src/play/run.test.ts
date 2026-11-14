import { defaultContent } from '@survival/content'
import { applyAction, createGame, legalActions } from '@survival/engine'
import { describe, expect, it } from 'vitest'
import { newRun, reduceRun, replay, step, undo, type Run } from './run.ts'

const config = defaultContent.config

/** Takes the first legal action `n` times, one tick of the clock (100 ms) per action. */
const play = (n: number, seed = 3, players = 1): Run => {
  let run = newRun(config, seed, players, 0)
  for (let i = 1; i <= n; i++) run = step(run, legalActions(run.state)[0]!, i * 100)
  return run
}

describe('newRun', () => {
  it('starts the engine game with the seed and player count and no history', () => {
    const run = newRun(config, 7, 2, 500)
    expect(run.state).toEqual(createGame(config, 7, defaultContent, { players: 2 }))
    expect(run).toMatchObject({ seed: 7, players: 2, config, actions: [], baseCurve: [] })
    expect(run.lastEvents).toEqual([])
    expect(run.timing.lastAt).toBe(500)
  })

  it('defaults to 1 player', () => {
    expect(newRun(config, 7).players).toBe(1)
    expect(newRun(config, 7).state).toEqual(createGame(config, 7, defaultContent, { players: 1 }))
  })
})

describe('step', () => {
  it('applies the action through the engine and keeps its events', () => {
    const start = newRun(config, 3)
    const action = legalActions(start.state)[0]!
    const { state, events } = applyAction(start.state, action)
    const next = step(start, action, 100)
    expect(next.state).toEqual(state)
    expect(next.lastEvents).toEqual(events)
    expect(next.actions).toEqual([action])
    expect(next.timing.lastAt).toBe(100)
  })

  it('leaves the run it was given unchanged', () => {
    const start = newRun(config, 3)
    const copy = structuredClone(start)
    step(start, legalActions(start.state)[0]!, 100)
    expect(start).toEqual(copy)
  })

  it('records the base health once per round, when its Prepare begins', () => {
    let run = newRun(config, 3)
    let i = 0
    while (run.state.round < 3 && run.state.phase !== 'ended' && i++ < 2000) {
      const before = run.baseCurve.length
      run = step(run, legalActions(run.state)[0]!)
      const opened = run.state.phase === 'prepare' && run.state.round > before
      expect(run.baseCurve).toHaveLength(opened ? before + 1 : before)
      if (opened) expect(run.baseCurve.at(-1)).toBe(run.state.base.health)
    }
    expect(run.state.round).toBe(3)
    expect(run.baseCurve).toHaveLength(run.state.phase === 'prepare' ? 3 : 2)
  })
})

describe('replay', () => {
  it('rebuilds the same state, actions and base curve from the start', () => {
    const run = play(12, 5, 2)
    const back = replay(config, run.seed, run.players, run.actions)
    expect(back.state).toEqual(run.state)
    expect(back.actions).toEqual(run.actions)
    expect(back.baseCurve).toEqual(run.baseCurve)
    expect(back.lastEvents).toEqual(run.lastEvents)
  })

  it('with no actions is a new run', () => {
    expect(replay(config, 5, 2, [])).toEqual(newRun(config, 5, 2))
  })
})

describe('undo', () => {
  it('drops the last action and returns to the state before it', () => {
    const run = play(8)
    const back = undo(run)
    expect(back.actions).toEqual(run.actions.slice(0, -1))
    expect(back.state).toEqual(play(7).state)
    expect(back.players).toBe(run.players)
    expect(back.seed).toBe(run.seed)
  })

  it('on a run with no actions gives the start again', () => {
    const start = newRun(config, 3)
    expect(undo(start).state).toEqual(start.state)
    expect(undo(start).actions).toEqual([])
  })
})

describe('reduceRun', () => {
  it('"new" starts a run with the config, seed, players and clock of the message', () => {
    const run = reduceRun(play(4), { kind: 'new', config, seed: 9, players: 3, at: 250 })
    expect(run).toEqual(newRun(config, 9, 3, 250))
  })

  it('"act" takes 1 action at the time of the message', () => {
    const start = newRun(config, 3)
    const action = legalActions(start.state)[0]!
    expect(reduceRun(start, { kind: 'act', action, at: 40 })).toEqual(step(start, action, 40))
  })

  it('"replace" swaps in the given run as it is (load, undo)', () => {
    const other = play(5, 11)
    expect(reduceRun(play(2), { kind: 'replace', run: other })).toBe(other)
  })
})
