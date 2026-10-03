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
 * Like `scriptedChoice`, but uses the map: places tiles, walks toward the first offered step,
 * and builds when it can, so goldens cover Move, Build, and skirmishes.
 */
export function explorerChoice(state: GameState): Action | undefined {
  const actions = legalActions(state)
  for (const type of ['assignDie', 'build', 'moveTo'] as const) {
    const found = actions.find((a) => a.type === type)
    if (found) return found
  }
  return actions[0]
}

/**
 * A policy that grows: walks to a gathering node next to the base for materials and back to the
 * base to spend them, buys base upgrades and Shop cards whenever it can, keeps the first
 * drafted Skill, and otherwise plays like `scriptedChoice`. Used by the full-run golden to cover
 * progression.
 */
export function builderChoice(state: GameState): Action | undefined {
  const actions = legalActions(state)
  for (const type of ['assignDie', 'buyUpgrade', 'buyCard', 'draftSkill'] as const) {
    const found = actions.find((a) => a.type === type)
    if (found) return found
  }
  const player = state.players[state.current]
  const site = (a: Action) =>
    a.type === 'moveTo' ? state.map.hexes[`${a.q},${a.r}`]?.site : undefined
  const wanted = (player?.materials ?? 0) < 3 ? 'gathering-node' : 'base'
  const move = actions.find((a) => site(a) === wanted)
  if (move) return move
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
