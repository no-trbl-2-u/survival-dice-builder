import {
  BOTS_TEXT,
  defaultProposals,
  measuredText,
  proposalsIn,
  type Proposal,
} from '@survival/content'
import { rowId } from '../decisions/Inline.tsx'
import styles from './ConfigPage.module.css'

type Props = Readonly<{
  /** The draft config: a proposal it already carries says so instead of offering Apply. */
  draft: unknown
  /** Sets the proposal's options in the draft. */
  onApply: (proposal: Proposal) => void
}>

/** The id of a proposal's measured line, which its Apply button names as its description. */
const measuredId = (p: Proposal) => `proposal-measured-${p.id}`

/**
 * The /config "Proposals" group: each open reading's option as one Apply button that sets its
 * values in the draft (save as usual), under the bot runs' measured effect in visible text. Options that act only under exchanges are left out.
 */
export function ProposalList({ draft, onApply }: Props) {
  const carried = new Set(proposalsIn(draft).map((p) => p.id))
  const shown = defaultProposals.filter((p) => p.measured)
  return (
    <details className={styles.proposals} data-testid="config-proposal-list">
      <summary>Proposals to try ({shown.length})</summary>
      <p>
        Each proposal is an option the designer has not decided yet, with its measured effect from
        the bot runs. Apply sets its values below; save to play with it. The{' '}
        <a href="/decisions">Decisions page</a> has the recommendation for each one.
      </p>
      <p>{BOTS_TEXT}</p>
      <ul>
        {shown.map((p) => (
          <li key={p.id}>
            <strong>
              <a href={`/decisions#${rowId(p.row)}`}>{p.label}</a>
            </strong>
            : {p.about}
            <p id={measuredId(p)} className={styles.proposalMeasured}>
              {measuredText(p)}
            </p>
            {carried.has(p.id) ? (
              <em>In this config.</em>
            ) : (
              <button
                type="button"
                onClick={() => onApply(p)}
                aria-label={`Apply ${p.label}`}
                aria-describedby={measuredId(p)}
              >
                Apply
              </button>
            )}
          </li>
        ))}
      </ul>
    </details>
  )
}
