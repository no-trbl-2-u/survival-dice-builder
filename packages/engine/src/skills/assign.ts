import type { SkillDef } from '@survival/content'
import type { Assignment, Die } from '../state/types.ts'

/** A full use of a Skill: every slot of that use has a die. */
export type FiredUse = Readonly<{ skill: string; use: number }>

/** The dice placed on one use of one Skill. */
function placed(assignments: readonly Assignment[], skill: string, use: number): Assignment[] {
  return assignments.filter((a) => a.skill === skill && a.use === use)
}

/** True when every slot of a Skill use has a die. @rule 7.8 step 5 */
export function isFull(skill: SkillDef, assignments: readonly Assignment[], use: number): boolean {
  return placed(assignments, skill.id, use).length === skill.faces.length
}

/**
 * The use of a Skill a die can go on now: the first use that is not full. A Skill fires again
 * whenever the dice fill it again (Spec v2 7.8 step 5, ruling 31).
 *
 * @rule 7.8 step 5
 */
export function openUses(skill: SkillDef, assignments: readonly Assignment[]): number[] {
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
 * @rule 2.4, 2.5, 7.8 steps 4-5
 */
export function legalPlacements(
  dice: readonly Die[],
  skills: readonly SkillDef[],
  assignments: readonly Assignment[],
): Assignment[] {
  const usedDice = new Set(assignments.map((a) => a.die))
  const out: Assignment[] = []
  dice.forEach((die, d) => {
    if (usedDice.has(d) || die.face === 'Blank') return
    for (const skill of skills) {
      for (const use of openUses(skill, assignments)) {
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
