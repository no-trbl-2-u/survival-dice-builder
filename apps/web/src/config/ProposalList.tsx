import { defaultProposals, measuredText, proposalsIn, type Proposal } from '@survival/content'
import { rowId } from '../decisions/Inline.tsx'
import styles from './ConfigPage.module.css'

type Props = Readonly<{
  /** The draft config: a proposal it already carries says so instead of offering Apply. */
  draft: unknown
  /** Sets the proposal's options in the draft. */
  onApply: (proposal: Proposal) => void
}>

/**
 * The /config "Proposals" group: each open reading's option as one Apply button that sets its
 * values in the draft (save as usual). Options that act only under exchanges are left out.
 */
export function ProposalList({ draft, onApply }: Props) {
  const carried = new Set(proposalsIn(draft).map((p) => p.id))
  const shown = defaultProposals.filter((p) => p.measured)
  return (
    <details className={styles.proposals} data-testid="config-proposal-list">
      <summary>Proposals to try ({shown.length})</summary>
      <p>
        Each proposal is an option the designer has not decided yet. Apply sets its values below;
        save to play with it. The <a href="/decisions">Decisions page</a> has the measured effect of
        each one.
      </p>
      <ul>
        {shown.map((p) => (
          <li key={p.id}>
            <strong>
              <a href={`/decisions#${rowId(p.row)}`}>{p.label}</a>
            </strong>
            : {p.about}{' '}
            {carried.has(p.id) ? (
              <em>In this config.</em>
            ) : (
              <button
                type="button"
                onClick={() => onApply(p)}
                aria-label={`Apply ${p.label}`}
                title={measuredText(p)}
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
