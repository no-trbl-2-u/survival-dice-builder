import { botChoice } from '@survival/bot'
import {
  applyAction,
  hexKey,
  hexNeighbors,
  legalActions,
  type Action,
  type GameState,
} from '@survival/engine'
import { step, type Run } from './run.ts'

const MAX_STEPS = 4000

/**
 * DEV ONLY: kept for testing (designer 2026-10-09); never in a production build. Plays the bot
 * forward until the current player is in an engagement with at least one enemy die. Each legal
 * Engage is tried on a scratch copy and taken only when enemies roll back; otherwise the bot
 * plays on. `until` picks the moment to stop (default: the engagement's first roll; `atTarget`:
 * a fired Skill waiting for its enemy). Null when it never comes.
 */
export function forceEngagement(run: Run, until = engagedWithEnemies): Run | null {
  let current = run
  for (let i = 0; i < MAX_STEPS; i++) {
    const state = current.state
    if (until(state)) return current
    if (state.phase === 'ended') return null
    const engage = legalActions(state).find(
      (a) =>
        a.type === 'engage' &&
        (applyAction(state, a).state.exchange?.engage?.enemyDice.length ?? 0) > 0,
    )
    const action = engage ?? botChoice(state)
    if (!action) return null
    current = step(current, action)
  }
  return null
}

/** An engagement where at least 1 enemy rolled dice back. */
export function engagedWithEnemies(state: GameState): boolean {
  return (state.exchange?.engage?.enemyDice.length ?? 0) > 0
}

/** An engagement where at least 1 enemy die belongs to an elite. */
export function engagedWithElite(state: GameState): boolean {
  const dice = state.exchange?.engage?.enemyDice ?? []
  return dice.some((d) => state.enemies.find((e) => e.id === d.enemy)?.kind === 'elite')
}

/** An engagement waiting for the player to pick the enemy a fired Skill hits. */
export function atTarget(state: GameState): boolean {
  return (
    engagedWithEnemies(state) &&
    legalActions(state).some((a) => a.type === 'resolveSkill' && a.enemy !== undefined)
  )
}

/** The id the dev tool gives the elite it places. */
export const DEV_ELITE = 'dev-elite'

/**
 * The state with 1 elite (full health, id `dev-elite`) on a free land hex next to the current
 * player, or null when no hex is free. DEV ONLY: it edits state outside the engine on purpose,
 * like `?dice=N`.
 */
function withElite(state: GameState): GameState | null {
  const def = state.content.enemies.enemies.find((d) => d.id === 'elite')
  const player = state.players[state.current]
  if (!def || !player) return null
  const taken = new Set([
    ...state.enemies.map((e) => hexKey(e.hex)),
    ...state.defenses.map((d) => hexKey(d.hex)),
    ...state.players.map((p) => hexKey(p.hex)),
  ])
  const hex = hexNeighbors(player.hex).find((h) => {
    const site = state.map.hexes[hexKey(h)]
    return site && site.terrain !== 'lake' && site.terrain !== 'mountain' && !taken.has(hexKey(h))
  })
  if (!hex) return null
  return {
    ...state,
    enemies: [
      ...state.enemies,
      { id: DEV_ELITE, kind: 'elite', health: def.health, hex, attackedThisCombat: false },
    ],
  }
}

/**
 * DEV ONLY: kept for testing (designer 2026-10-09); never in a production build. An engagement
 * against an elite: the bot plays on to one when it comes; otherwise, at the first legal Engage,
 * an elite is placed next to the player and that Engage is applied through the engine. Null
 * when no Engage comes up with a free hex next to the player.
 */
export function forceEliteEngagement(run: Run): Run | null {
  const found = forceEngagement(run, engagedWithElite)
  if (found) return found
  let current = run
  for (let i = 0; i < MAX_STEPS; i++) {
    const state = current.state
    if (state.phase === 'ended') return null
    const engage = legalActions(state).find((a): a is Action => a.type === 'engage')
    const placed = engage ? withElite(state) : null
    if (engage && placed) {
      const next = step({ ...current, state: placed }, engage)
      if (engagedWithElite(next.state)) return next
    }
    const action = botChoice(state)
    if (!action) return null
    current = step(current, action)
  }
  return null
}
