import type { Face, SkillFace } from '@survival/content'

/**
 * True when a set of dice faces can fill every face a Skill needs. Each die fills 1 slot.
 * Exact faces are used first; each Star fills exactly 1 remaining slot of any face.
 * Blank never fills a slot.
 *
 * @param faces - the available dice faces.
 * @param need - the faces the Skill needs (repeats allowed).
 * @rule 2.4, 2.5, 7.8 step 6-7
 */
export function canFire(faces: readonly Face[], need: readonly SkillFace[]): boolean {
  const have = new Map<Face, number>()
  for (const f of faces) have.set(f, (have.get(f) ?? 0) + 1)
  const wanted = new Map<SkillFace, number>()
  for (const f of need) wanted.set(f, (wanted.get(f) ?? 0) + 1)
  let missing = 0
  for (const [face, count] of wanted) missing += Math.max(0, count - (have.get(face) ?? 0))
  // Each Star covers one missing slot; one Star never covers two.
  return missing <= (have.get('Star') ?? 0)
}
