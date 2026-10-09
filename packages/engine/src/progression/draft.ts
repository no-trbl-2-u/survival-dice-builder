import type { GameEvent } from '../events/events.ts'
import { currentPlayer, skillDef, updateCurrentPlayer, type Step } from '../state/helpers.ts'
import type { GameState, Player } from '../state/types.ts'
import { drawLevel, openLevel } from './supplies.ts'

/** The player's drafted Skills: every Skill except the fixed starter Skills (row 9). @rule 11.9 */
export function draftedSkills(state: GameState, player: Player): string[] {
  const starters = state.config.player.starterSkills
  return player.skills.filter((s) => !starters.includes(s))
}

/** True when the player's draft slots are full. @rule 11.9 */
function slotsFull(state: GameState, player: Player): boolean {
  return draftedSkills(state, player).length >= state.config.player.draftSlots
}

/** True when a player cannot draft: full slots with `fullBoardDraft: "skip"`, or 0 draft slots. */
function cannotDraft(state: GameState, player: Player): boolean {
  const skip = state.config.rulings.fullBoardDraft === 'skip'
  const nothingToReplace = draftedSkills(state, player).length === 0
  return slotsFull(state, player) && (skip || nothingToReplace)
}

/** The next player (seat order) who has not drafted this round, if any. */
function nextDrafter(state: GameState): number {
  return state.players.findIndex((p) => !state.draftedPlayers.includes(p.id))
}

/**
 * True when this Explore phase still has a Skill draft to do: the Training Ground is open, the
 * round number is even (`draft.everyNRounds`), and a player has not drafted this round. Each
 * player drafts in seat order (11.6 "each player").
 *
 * @rule 10.8, 11.6, 11.9
 */
export function draftDue(state: GameState): boolean {
  if (state.draft) return false
  if (openLevel(state, 'training') === 0) return false
  if (state.round % state.config.draft.everyNRounds !== 0) return false
  return nextDrafter(state) >= 0
}

/** Marks a player's draft as done for this round. */
function drafted(state: GameState, player: string): GameState {
  return { ...state, draftedPlayers: [...state.draftedPlayers, player], draft: null }
}

/** True when unkept Skills go to the player's pool (designer 2026-10-09), not the supply. */
function pooling(state: GameState): boolean {
  return state.config.draft.unpicked === 'pool'
}

/** The Skills in a player's draft pool. */
export function draftPool(player: Player): readonly string[] {
  return player.draftPool ?? []
}

/**
 * Starts the next player's draft (they become the current player): the top `draft.reveal`
 * Skills of the highest open level Skill supply, or the next lower level when it is empty
 * (11.8). With `draft.unpicked: "pool"` the player's whole pool is offered too (after the new
 * Skills). A player who cannot draft (11.9) or finds no Skills is skipped.
 *
 * @rule 11.6, 11.8, 11.9, designer 2026-10-09 (draft pool)
 */
export function startDraft(state: GameState): Step {
  const seat = nextDrafter(state)
  if (seat < 0) return [state, []]
  const seated: GameState = { ...state, current: seat }
  const player = currentPlayer(seated)
  if (cannotDraft(seated, player)) return [drafted(seated, player.id), []]
  const pool = pooling(seated) ? draftPool(player) : []
  const level = drawLevel(seated.supplies.skills, openLevel(seated, 'training'))
  if (!level && pool.length === 0) {
    return [drafted(seated, player.id), [{ type: 'draftSkipped', rule: '11.8', player: player.id }]]
  }
  const stack = level ? (seated.supplies.skills[level] ?? []) : []
  const fresh = stack.slice(0, seated.config.draft.reveal)
  const skills = level
    ? { ...seated.supplies.skills, [level]: stack.slice(fresh.length) }
    : seated.supplies.skills
  const options = [...fresh, ...pool]
  const drawnFrom = level ?? String(openLevel(seated, 'training'))
  const emptied =
    pool.length > 0 ? updateCurrentPlayer(seated, (p) => ({ ...p, draftPool: [] })) : seated
  return [
    {
      ...emptied,
      supplies: { ...seated.supplies, skills },
      draft: {
        player: player.id,
        level: drawnFrom,
        options,
        kept: null,
        ...(pool.length > 0 ? { fromPool: pool } : {}),
      },
    },
    [{ type: 'draftStarted', rule: '11.6', player: player.id, level: drawnFrom, options }],
  ]
}

/** Puts an unkept Skill in the current player's draft pool. @rule designer 2026-10-09 */
function toPool(state: GameState, skill: string): Step {
  const player = currentPlayer(state)
  return [
    updateCurrentPlayer(state, (p) => ({ ...p, draftPool: [...draftPool(p), skill] })),
    [{ type: 'skillPooled', rule: 'Draft pool (designer 2026-10-09)', skill, player: player.id }],
  ]
}

/** Puts a Skill at the bottom of its level's supply. @rule 11.7, 11.9 */
function toBottom(state: GameState, skill: string, level: string): Step {
  const skills = {
    ...state.supplies.skills,
    [level]: [...(state.supplies.skills[level] ?? []), skill],
  }
  return [
    { ...state, supplies: { ...state.supplies, skills } },
    [{ type: 'skillToSupply', rule: '11.7', skill, level }],
  ]
}

/**
 * Keeps 1 revealed Skill for free; the others go to the bottom of the supply (11.7), or to the
 * player's draft pool with `draft.unpicked: "pool"` (designer 2026-10-09). With free
 * slots the Skill goes on the board; with full slots (`swap`) the player then picks the drafted
 * Skill it replaces.
 *
 * @rule 11.7, 11.9
 */
export function keepSkill(state: GameState, skill: string): Step {
  const draft = state.draft
  if (!draft) throw new Error('No draft in progress')
  let current = state
  const events: GameEvent[] = []
  for (const other of draft.options.filter((s, i) => i !== draft.options.indexOf(skill))) {
    const [next, more] = pooling(current)
      ? toPool(current, other)
      : toBottom(current, other, draft.level)
    current = next
    events.push(...more)
  }
  if (slotsFull(current, currentPlayer(current))) {
    return [{ ...current, draft: { ...draft, kept: skill } }, events]
  }
  const player = currentPlayer(current)
  const done = drafted(
    updateCurrentPlayer(current, (p) => ({ ...p, skills: [...p.skills, skill] })),
    player.id,
  )
  return [done, [...events, { type: 'skillDrafted', rule: '11.7', player: player.id, skill }]]
}

/**
 * Full draft slots: the kept Skill replaces a drafted Skill, which goes to the bottom of its
 * level's supply.
 *
 * @rule 11.9
 */
export function replaceSkill(state: GameState, old: string): Step {
  const draft = state.draft
  const kept = draft?.kept
  if (!draft || !kept) throw new Error('No kept Skill waiting for a slot')
  const player = currentPlayer(state)
  const swapped = updateCurrentPlayer(state, (p) => {
    const at = p.skills.lastIndexOf(old)
    return { ...p, skills: p.skills.map((s, i) => (i === at ? kept : s)) }
  })
  const [returned, events] = toBottom(swapped, old, String(skillDef(state, old).level))
  return [
    drafted(returned, player.id),
    [
      { type: 'skillReplaced', rule: '11.9', player: player.id, skill: old },
      ...events,
      { type: 'skillDrafted', rule: '11.9', player: player.id, skill: kept },
    ],
  ]
}
