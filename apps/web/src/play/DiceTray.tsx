import type { Face } from '@survival/content'
import { sameAction, type Action, type GameState } from '@survival/engine'
import styles from './Play.module.css'
import { firstOf } from './targets.ts'

type Props = Readonly<{
  state: GameState
  legal: readonly Action[]
  act: (a: Action) => void
  selected: number | null
  select: (die: number | null) => void
}>

const FACE_MARK: Record<Face, string> = {
  Sword: '⚔',
  Bow: '➶',
  Wand: '✦',
  Shield: '⛨',
  Star: '★',
  Blank: '·',
}

/**
 * The exchange dice: keep toggles while rolling, rerolls from cards, and die selection for
 * Skill placement. The roll counter shows `roll n of max`.
 */
export function DiceTray({ state, legal, act, selected, select }: Props) {
  const ex = state.exchange
  if (!ex) return null
  const has = (a: Action) => legal.find((x) => sameAction(x, a))
  const placed = new Set(ex.assignments.map((a) => a.die))
  const roll = firstOf(legal, 'roll')
  const stop = firstOf(legal, 'stopRolling')
  const endReroll = firstOf(legal, 'endReroll')
  return (
    <section className={styles.panel} aria-label="Dice">
      <h2 className={styles.panelTitle}>
        Dice — roll {ex.rollsUsed} of {state.config.combat.maxRolls}
        {ex.step === 'reroll' ? ` · rerolls left ${ex.rerollsLeft}` : ''}
      </h2>
      <ul className={styles.dice}>
        {ex.dice.map((d, i) => {
          const keep = has({ type: 'toggleKeep', die: i })
          const reroll = has({ type: 'rerollDie', die: i })
          const canPlace = ex.step === 'assign' && !placed.has(i) && d.face !== 'Blank'
          return (
            <li key={i} className={styles.dieItem}>
              <span
                className={`${styles.die} ${d.kept ? styles.kept : ''} ${selected === i ? styles.selected : ''}`}
                aria-label={`Die ${i + 1}: ${d.face}${d.kept ? ', kept' : ''}${placed.has(i) ? ', on a Skill' : ''}`}
              >
                <span aria-hidden="true">{FACE_MARK[d.face]}</span>
                <small>{d.face}</small>
              </span>
              {keep ? (
                <button type="button" onClick={() => act(keep)}>
                  {d.kept ? 'Release' : 'Keep'} die {i + 1}
                </button>
              ) : null}
              {reroll ? (
                <button type="button" onClick={() => act(reroll)}>
                  Reroll die {i + 1}
                </button>
              ) : null}
              {canPlace ? (
                <button
                  type="button"
                  aria-pressed={selected === i}
                  onClick={() => select(selected === i ? null : i)}
                >
                  {selected === i ? 'Selected' : 'Select'} die {i + 1}
                </button>
              ) : null}
            </li>
          )
        })}
      </ul>
      <div className={styles.row}>
        {stop ? (
          <button type="button" onClick={() => act(stop)}>
            Stop rolling
          </button>
        ) : null}
        {roll ? (
          <button type="button" onClick={() => act(roll)}>
            Roll unkept dice
          </button>
        ) : null}
        {endReroll ? (
          <button type="button" onClick={() => act(endReroll)}>
            Finish rerolls
          </button>
        ) : null}
      </div>
    </section>
  )
}
