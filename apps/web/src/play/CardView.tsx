import {
  gatherText,
  type CardDef,
  type CombatEffect,
  type CombatOption,
  type GameConfig,
  type PrepareEffect,
} from '@survival/content'
import styles from './Play.module.css'

/** Plain text for a top-half (Prepare) effect; Gather reads the config's node rules. */
export function topText(e: PrepareEffect, config: GameConfig): string {
  switch (e.kind) {
    case 'move':
      return `Move ${e.hexes}${e.ignoreEnemyCost ? ', no extra cost next to enemies' : ''}`
    case 'gather':
      return gatherText(e.amount, config)
    case 'build':
      return `Build${e.costReduction > 0 ? `, cost -${e.costReduction}` : ''}${e.times > 1 ? ` ${e.times} times` : ''}`
    case 'rest':
      return `Rest: heal ${e.amount}`
  }
}

/** Plain text for a bottom-half (Combat) effect. */
export function bottomText(e: CombatEffect): string {
  switch (e.kind) {
    case 'reroll':
      return e.dice === 'all'
        ? 'Reroll all dice'
        : `Reroll ${e.dice} ${e.dice === 1 ? 'die' : 'dice'}`
    case 'damage':
      return `+${e.amount} damage`
    case 'guard':
      return `+${e.amount} guard`
    case 'heal':
      return `Heal ${e.amount}`
    case 'extraDie':
      return `+${e.dice} die`
  }
}

/** Plain text for a Combat v3 card option. */
export function optionText(o: CombatOption): string {
  switch (o.kind) {
    case 'engage':
      return 'Engage'
    case 'move':
      return `Move ${o.hexes}`
    case 'reroll':
      return o.dice === 'all'
        ? 'Reroll all dice'
        : `Reroll ${o.dice} ${o.dice === 1 ? 'die' : 'dice'}`
    case 'heal':
      return `Heal ${o.amount}`
    case 'repair':
      return `Repair ${o.amount}`
  }
}

/** The Combat side as printed: Combat v3 options ("Move 2 / Engage") or the v1 effects. */
export function combatSideText(def: CardDef, engage: boolean): string {
  return engage && def.combat
    ? def.combat.map(optionText).join(' / ')
    : def.bottom.map(bottomText).join(', ')
}

type Props = Readonly<{ def: CardDef; up: 'top' | 'bottom'; config: GameConfig; engage?: boolean }>

/**
 * One card with both halves. The bottom half is printed upside down, as on the physical card;
 * the hand turns the whole card in Combat. The active half is also named in text.
 */
export function CardView({ def, up, config, engage = false }: Props) {
  return (
    <div className={styles.card} data-up={up}>
      <div className={`${styles.half} ${styles.topHalf}`}>
        <span className={styles.band}>Top · Prepare</span>
        <strong>{def.name}</strong>
        <span>{topText(def.top, config)}</span>
      </div>
      <div className={styles.cardMeta}>
        <span>{def.level === 0 ? 'Starter' : `Level ${'I'.repeat(def.level)}`}</span>
        {def.cost > 0 ? <span>Cost {def.cost}</span> : null}
      </div>
      <div className={`${styles.half} ${styles.bottomHalf}`}>
        <span className={styles.band}>Bottom · Combat</span>
        <span>{combatSideText(def, engage)}</span>
      </div>
      <span className="visually-hidden">
        Active half:{' '}
        {up === 'top'
          ? `Prepare, ${topText(def.top, config)}`
          : `Combat, ${combatSideText(def, engage)}`}
      </span>
    </div>
  )
}
