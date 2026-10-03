import type { CardDef, PrepareEffect, CombatEffect } from '@survival/content'
import styles from './Play.module.css'

/** Plain text for a top-half (Prepare) effect. */
export function topText(e: PrepareEffect): string {
  switch (e.kind) {
    case 'move':
      return `Move ${e.hexes}${e.ignoreEnemyCost ? ', no extra cost next to enemies' : ''}`
    case 'gather':
      return e.bonus > 0 ? `Gather +${e.bonus}` : 'Gather'
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

type Props = Readonly<{ def: CardDef; up: 'top' | 'bottom' }>

/**
 * One card with both halves. The bottom half is printed upside down, as on the physical card;
 * the hand turns the whole card in Combat. The active half is also named in text.
 */
export function CardView({ def, up }: Props) {
  return (
    <div className={styles.card} data-up={up}>
      <div className={`${styles.half} ${styles.topHalf}`}>
        <span className={styles.band}>Top · Prepare</span>
        <strong>{def.name}</strong>
        <span>{topText(def.top)}</span>
      </div>
      <div className={styles.cardMeta}>
        <span>{def.level === 0 ? 'Starter' : `Level ${'I'.repeat(def.level)}`}</span>
        {def.cost > 0 ? <span>Cost {def.cost}</span> : null}
      </div>
      <div className={`${styles.half} ${styles.bottomHalf}`}>
        <span className={styles.band}>Bottom · Combat</span>
        <span>{def.bottom.map(bottomText).join(', ')}</span>
      </div>
      <span className="visually-hidden">
        Active half:{' '}
        {up === 'top'
          ? `Prepare, ${topText(def.top)}`
          : `Combat, ${def.bottom.map(bottomText).join(', ')}`}
      </span>
    </div>
  )
}
