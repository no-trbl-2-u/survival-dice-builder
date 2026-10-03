import type { Action, GameState } from '@survival/engine'
import { describeAction } from '../debug/describeAction.ts'
import styles from './Play.module.css'
import { COVERED } from './targets.ts'

type Props = Readonly<{ state: GameState; legal: readonly Action[]; act: (a: Action) => void }>

/**
 * Every legal action without a dedicated control (map targets, Move and Build stops, Shop,
 * upgrades, draft, reveal): a labelled button each, so the whole run stays playable by keyboard.
 */
export function Choices({ state, legal, act }: Props) {
  const rest = legal.filter((a) => !COVERED.has(a.type))
  if (rest.length === 0) return null
  return (
    <section className={styles.panel} aria-label="Choices">
      <h2 className={styles.panelTitle}>Choices</h2>
      <ul className={styles.choices} data-testid="choices">
        {rest.map((a) => (
          <li key={JSON.stringify(a)}>
            <button type="button" onClick={() => act(a)}>
              {describeAction(a, state)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
