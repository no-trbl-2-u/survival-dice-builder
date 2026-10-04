import type { CardDef, SkillEffect } from '@survival/content'
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
 * Both halves of a card in one line: "Prepare: Gather 2. Combat: +1 guard."
 *
 * @param def - the card from content.
 * @rule 2.6, 2.7, Table 2, Table 8
 */
export function cardText(def: CardDef): string {
  return `Prepare: ${topText(def.top)}. Combat: ${def.bottom.map(bottomText).join(', ')}.`
}
