import { milestoneIds, milestoneLabel, milestoneOutOfReach } from '@survival/content'
import type { GameState } from '@survival/engine'
import styles from './Play.module.css'

type Props = Readonly<{ state: GameState }>

/**
 * Every milestone of the run: met (✓) or not yet (–), with the reason when the config and
 * content put it out of reach. The glyph is hidden from screen readers, which hear "Met" or
 * "Not met" instead. The run summary and the base panel show the same list.
 *
 * @rule 1.4, 17
 */
export function MilestoneList({ state }: Props) {
  return (
    <ul className={styles.milestones}>
      {milestoneIds(state.config.milestones).map((id) => {
        const got = state.milestones.includes(id)
        const out = got ? null : milestoneOutOfReach(id, state.config, state.content)
        return (
          <li key={id} className={got ? styles.got : styles.muted}>
            <span aria-hidden="true">{got ? '✓' : '–'}</span>{' '}
            <span className="visually-hidden">{got ? 'Met: ' : 'Not met: '}</span>
            {milestoneLabel(id, state.config.milestones, state.content)}
            {out && ` (${out})`}
          </li>
        )
      })}
    </ul>
  )
}
