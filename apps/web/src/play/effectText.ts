import { skillEffectText, type CardDef, type GameConfig } from '@survival/content'
import { combatSideText, topText } from './CardView.tsx'

/** What a Skill does when it fires, in one plain line (the same words as / uses). */
export const skillText = skillEffectText

/**
 * Both halves of a card in one line: "Prepare: Move 3. Combat: Move 2 / Engage." The Combat
 * half is the one the run plays: the Combat v3 options under Engagements, the v1 effects
 * under Exchanges — the same words the Hand prints.
 *
 * @param def - the card from content.
 * @param config - the run config (the Gather text and the combat model read it).
 * @rule 2.6, 2.7, Table 2, Table 8
 */
export function cardText(def: CardDef, config: GameConfig): string {
  return `Prepare: ${topText(def.top, config)}. Combat: ${combatSideText(def, config.combat.model === 'engage')}.`
}

/**
 * What an enemy die face does to you, from config: its name ("Hit"), the label on the
 * die ("Hit 1", "Special 2", "Miss"), and its damage.
 *
 * @param face - the rolled enemy face.
 * @param engage - `config.combat.engage`.
 * @rule Combat v3 (engagement step 6)
 */
export function enemyFaceText(
  face: 'hit' | 'miss' | 'special',
  engage: GameConfig['combat']['engage'],
): Readonly<{ name: string; label: string; damage: number }> {
  if (face === 'hit')
    return { name: 'Hit', label: `Hit ${engage.hitDamage}`, damage: engage.hitDamage }
  if (face === 'special')
    return {
      name: 'Special',
      label: `Special ${engage.specialDamage}`,
      damage: engage.specialDamage,
    }
  return { name: 'Miss', label: 'Miss', damage: 0 }
}
