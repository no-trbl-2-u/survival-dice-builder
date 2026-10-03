import type { SkillDef } from '@survival/content'
import type { Assignment, Die } from '../state/types.ts'

/** A full use of a Skill: every slot of that use has a die. */
export type FiredUse = Readonly<{ skill: string; use: number }>

/** The dice placed on one use of one Skill. */
function placed(assignments: readonly Assignment[], skill: string, use: number): Assignment[] {
  return assignments.filter((a) => a.skill === skill && a.use === use)
}

/** True when every slot of a Skill use has a die. */
export function isFull(skill: SkillDef, assignments: readonly Assignment[], use: number): boolean {
  return placed(assignments, skill.id, use).length === skill.faces.length
}

/**
 * The uses of a Skill a die can go on now. With 1 use per exchange (default) only use 0;
 * with unlimited uses (18.1) also the next use once every earlier use is full.
 *
 * @rule 7.8 step 6, 18.1
 */
export function openUses(
  skill: SkillDef,
  assignments: readonly Assignment[],
  unlimited: boolean,
): number[] {
  if (!unlimited) return isFull(skill, assignments, 0) ? [] : [0]
  let use = 0
  while (isFull(skill, assignments, use)) use += 1
  return [use]
}

/**
 * Every legal single placement of a free die on a free Skill slot. A die fits a slot when its
 * face is the slot's face, or when it is a Star (which then counts as the slot's face). Blank
 * fits nothing. When a Skill has several free slots of the same face, only the first is
 * offered: the choices are equivalent.
 *
 * @param dice - the exchange dice.
 * @param skills - the player's Skills, in board order.
 * @param assignments - dice already placed.
 * @param unlimited - 18.1 Skill uses option.
 * @rule 2.4, 2.5, 7.8 step 6
 */
export function legalPlacements(
  dice: readonly Die[],
  skills: readonly SkillDef[],
  assignments: readonly Assignment[],
  unlimited: boolean,
): Assignment[] {
  const usedDice = new Set(assignments.map((a) => a.die))
  const out: Assignment[] = []
  dice.forEach((die, d) => {
    if (usedDice.has(d) || die.face === 'Blank') return
    for (const skill of skills) {
      for (const use of openUses(skill, assignments, unlimited)) {
        const taken = new Set(placed(assignments, skill.id, use).map((a) => a.slot))
        const offeredFaces = new Set<string>()
        skill.faces.forEach((face, slot) => {
          if (taken.has(slot) || offeredFaces.has(face)) return
          if (die.face !== face && die.face !== 'Star') return
          offeredFaces.add(face)
          out.push({ die: d, skill: skill.id, use, slot, asFace: face })
        })
      }
    }
  })
  return out
}

/**
 * The Skill uses that have every slot filled, in board order then use order. These fire on
 * confirm. Partly filled uses do not fire.
 *
 * @rule 7.8 step 7
 */
export function firedUses(
  skills: readonly SkillDef[],
  assignments: readonly Assignment[],
): FiredUse[] {
  const out: FiredUse[] = []
  for (const skill of skills) {
    const uses = [
      ...new Set(assignments.filter((a) => a.skill === skill.id).map((a) => a.use)),
    ].sort((a, b) => a - b)
    for (const use of uses) if (isFull(skill, assignments, use)) out.push({ skill: skill.id, use })
  }
  return out
}
