import { applyAction, legalActions, type Action, type GameState } from '../../src/index.ts'
import { nextInt } from '../../src/rng/rng.ts'

/**
 * A simple deterministic policy for tests: play cards in hand order, stop rolling at once,
 * end rerolls, place dice while any placement exists, then confirm, and target the first
 * enemy. It always makes progress.
 */
export function scriptedChoice(state: GameState): Action | undefined {
  const actions = legalActions(state)
  const assign = actions.find((a) => a.type === 'assignDie')
  if (assign) return assign
  return actions[0]
}

/**
 * Picks a uniformly random legal action using a test-side RNG (not the game's), so property
 * tests explore unusual orders: toggling dice, rolling again, discarding, unassigning.
 */
export function randomChoice(state: GameState, rng: number): readonly [Action | undefined, number] {
  const actions = legalActions(state)
  if (actions.length === 0) return [undefined, rng]
  const [i, next] = nextInt(rng, actions.length)
  return [actions[i], next]
}

/** A recorded run: the states after each action, and the actions taken. */
export type Walk = Readonly<{ states: GameState[]; actions: Action[] }>

/**
 * Plays from a state with a chooser until `stop` says so, the run ends, or `maxSteps` actions.
 */
export function walk(
  start: GameState,
  choose: (s: GameState) => Action | undefined,
  stop: (s: GameState) => boolean,
  maxSteps = 2000,
): Walk {
  const states = [start]
  const actions: Action[] = []
  let state = start
  for (let i = 0; i < maxSteps && !stop(state); i++) {
    const action = choose(state)
    if (!action) break
    state = applyAction(state, action).state
    states.push(state)
    actions.push(action)
  }
  return { states, actions }
}
