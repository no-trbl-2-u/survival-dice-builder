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

/**
 * True when this Explore phase has a Skill draft: the Training Ground is open and the round
 * number is even (`draft.everyNRounds`), and this round has not drafted yet. With full slots
 * and `fullBoardDraft: "skip"`, or with 0 draft slots, there is no draft.
 *
 * @rule 10.8, 11.9
 */
export function draftDue(state: GameState): boolean {
  if (state.lastDraftRound === state.round || state.draft) return false
  if (openLevel(state, 'training') === 0) return false
  if (state.round % state.config.draft.everyNRounds !== 0) return false
  // Full slots with "skip", or no draft slots at all, mean no draft (nothing to replace).
  const player = currentPlayer(state)
  const skip = state.config.rulings.fullBoardDraft === 'skip'
  const nothingToReplace = draftedSkills(state, player).length === 0
  return !(slotsFull(state, player) && (skip || nothingToReplace))
}

/**
 * Reveals the top `draft.reveal` Skills of the highest open level Skill supply, or the next
 * lower level when it is empty (11.8). Nothing left: the draft is skipped.
 *
 * @rule 11.6, 11.8
 */
export function startDraft(state: GameState): Step {
  const player = currentPlayer(state)
  const level = drawLevel(state.supplies.skills, openLevel(state, 'training'))
  if (!level) {
    return [
      { ...state, lastDraftRound: state.round },
      [{ type: 'draftSkipped', rule: '11.8', player: player.id }],
    ]
  }
  const stack = state.supplies.skills[level] ?? []
  const options = stack.slice(0, state.config.draft.reveal)
  const skills = { ...state.supplies.skills, [level]: stack.slice(options.length) }
  return [
    {
      ...state,
      supplies: { ...state.supplies, skills },
      draft: { player: player.id, level, options, kept: null },
    },
    [{ type: 'draftStarted', rule: '11.6', player: player.id, level, options }],
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
 * Keeps 1 revealed Skill for free; the others go to the bottom of the supply (11.7). With free
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
    const [next, more] = toBottom(current, other, draft.level)
    current = next
    events.push(...more)
  }
  if (slotsFull(current, currentPlayer(current))) {
    return [{ ...current, draft: { ...draft, kept: skill } }, events]
  }
  const player = currentPlayer(current)
  const done: GameState = {
    ...updateCurrentPlayer(current, (p) => ({ ...p, skills: [...p.skills, skill] })),
    draft: null,
    lastDraftRound: current.round,
  }
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
    { ...returned, draft: null, lastDraftRound: state.round },
    [
      { type: 'skillReplaced', rule: '11.9', player: player.id, skill: old },
      ...events,
      { type: 'skillDrafted', rule: '11.9', player: player.id, skill: kept },
    ],
  ]
}
