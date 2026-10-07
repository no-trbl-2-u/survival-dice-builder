import type { CardDef, GameConfig, SkillEffect } from '@survival/content'
import { bottomText, topText } from './CardView.tsx'

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

/**
 * What a Skill does when it fires, in one plain line.
 *
 * @param e - the Skill's effect from content.
 * @rule Table 3, Table 9
 */
export function skillText(e: SkillEffect): string {
  switch (e.kind) {
    case 'damage':
      return `${e.amount} damage to ${e.target === 'one' ? '1 enemy' : 'each enemy'} within ${plural(e.range, 'hex', 'hexes')}`
    case 'guard':
      return `Gain ${e.amount} guard`
    case 'heal':
      return `Heal ${e.amount}`
    case 'ignoreHit':
      return `Ignore ${plural(e.hits, 'enemy hit', 'enemy hits')} this exchange`
  }
}

/**
 * Both halves of a card in one line: "Prepare: Move 3. Combat: +1 guard."
 *
 * @param def - the card from content.
 * @rule 2.6, 2.7, Table 2, Table 8
 */
export function cardText(def: CardDef): string {
  return `Prepare: ${topText(def.top)}. Combat: ${def.bottom.map(bottomText).join(', ')}.`
}

/**
 * What an enemy die face does to you, from config: the label on the die ("HIT 1",
 * "SPECIAL 2", "miss") and its damage.
 *
 * @param face - the rolled enemy face.
 * @param engage - `config.combat.engage`.
 * @rule Combat v3 (engagement step 6)
 */
export function enemyFaceText(
  face: 'hit' | 'miss' | 'special',
  engage: GameConfig['combat']['engage'],
): Readonly<{ label: string; damage: number }> {
  if (face === 'hit') return { label: `HIT ${engage.hitDamage}`, damage: engage.hitDamage }
  if (face === 'special')
    return { label: `SPECIAL ${engage.specialDamage}`, damage: engage.specialDamage }
  return { label: 'miss', damage: 0 }
}
