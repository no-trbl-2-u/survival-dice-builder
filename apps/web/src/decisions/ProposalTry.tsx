import { adviceText, measuredText, proposalsIn, type Proposal } from '@survival/content'
import { useState } from 'react'
import { applyProposalToStore, browserStorage, loadConfig } from '../config/configStore.ts'
import { useClient } from '../useClient.ts'
import styles from './DecisionsPage.module.css'

/**
 * A reading's proposal on /decisions: what it does, its measured effect under engagements, the
 * recommendation, and "Try this on /play", which sets it in this browser's config (the other
 * changes stay) and opens /play. An option that acts only under exchanges has no button.
 */
export function ProposalTry({ proposal }: Readonly<{ proposal: Proposal }>) {
  const [error, setError] = useState<string | null>(null)
  // The build cannot see this browser's config: it offers the button, then the browser checks.
  const client = useClient()
  const playing =
    client && proposalsIn(loadConfig(browserStorage()).config).some((p) => p.id === proposal.id)
  const tryIt = () => {
    const problems = applyProposalToStore(browserStorage(), proposal)
    if (problems.length > 0) {
      setError(`Not saved: ${problems.map((p) => p.message).join(' ')}`)
      return
    }
    window.location.assign('/play')
  }
  return (
    <div className={styles.proposal} data-proposal={proposal.id}>
      <p>
        <strong>Proposal: {proposal.label}.</strong> {proposal.about}
      </p>
      <p className={styles.muted}>{measuredText(proposal)}</p>
      <p>{adviceText(proposal)}</p>
      {proposal.measured ? (
        playing ? (
          <p>
            Your config plays with this proposal now. <a href="/play">Play</a> or{' '}
            <a href="/config">review or reset</a>.
          </p>
        ) : (
          <p>
            <button type="button" className="brass" onClick={tryIt}>
              Try this on /play
            </button>{' '}
            <span className={styles.muted}>Saved in this browser only; no default changes.</span>
          </p>
        )
      ) : null}
      {error ? (
        <p role="alert" className={styles.differs}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
