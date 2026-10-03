import type { Face } from '@survival/content'
import { nextInt } from '../rng/rng.ts'
import type { Die } from '../state/types.ts'

/** The 6 faces of an action die, in die order. @rule 2.3 */
export const DIE_FACES: readonly Face[] = ['Sword', 'Wand', 'Bow', 'Shield', 'Star', 'Blank']

/**
 * Rolls one action die.
 *
 * @returns the face and the next RNG state.
 * @rule 2.3
 */
export function rollDie(rng: number): readonly [Face, number] {
  const [i, next] = nextInt(rng, DIE_FACES.length)
  return [DIE_FACES[i] as Face, next]
}

/**
 * Rolls `count` action dice.
 *
 * @returns the faces and the next RNG state.
 * @rule 7.8 step 2
 */
export function rollDice(rng: number, count: number): readonly [Face[], number] {
  const faces: Face[] = []
  let state = rng
  for (let i = 0; i < count; i++) {
    const [face, next] = rollDie(state)
    faces.push(face)
    state = next
  }
  return [faces, state]
}

/**
 * Rolls every die that is not kept again. Kept dice keep their face.
 *
 * @returns the new dice and the next RNG state.
 * @rule 7.8 step 3-4
 */
export function rerollUnkept(rng: number, dice: readonly Die[]): readonly [Die[], number] {
  let state = rng
  const out = dice.map((die) => {
    if (die.kept) return die
    const [face, next] = rollDie(state)
    state = next
    return { face, kept: false }
  })
  return [out, state]
}

/**
 * Rolls one chosen die again (a card's reroll effect).
 *
 * @returns the new dice and the next RNG state.
 * @rule 7.8 step 5, Table 2, Table 8
 */
export function rerollOne(
  rng: number,
  dice: readonly Die[],
  index: number,
): readonly [Die[], number] {
  const [face, next] = rollDie(rng)
  return [dice.map((d, i) => (i === index ? { ...d, face } : d)), next]
}

/** Flips whether a die is kept between rolls. @rule 7.8 step 3 */
export function toggleKeep(dice: readonly Die[], index: number): Die[] {
  return dice.map((d, i) => (i === index ? { ...d, kept: !d.kept } : d))
}
