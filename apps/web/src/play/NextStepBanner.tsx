import type { Action, GameState } from '@survival/engine'
import { ActionLabel } from '../debug/ActionLabel.tsx'
import { bannerActions, nextStep } from './nextStep.ts'
import styles from './Play.module.css'

type Props = Readonly<{ state: GameState; legal: readonly Action[]; act: (a: Action) => void }>

/**
 * The big line at the top of /play: `{PHASE}: {STEP}`, what to do right now. It also holds the
 * few decisions with nothing else to click (stop moving, stop building, a Tower's target).
 */
export function NextStepBanner({ state, legal, act }: Props) {
  const { phase, step } = nextStep(state, legal)
  const extra = bannerActions(legal)
  return (
    <section
      className={`${styles.banner} ${state.exchange || state.phase === 'combat' ? styles.bannerCombat : styles.bannerPrepare}`}
      data-testid="next-step"
      data-decisions
      aria-live="polite"
    >
      <p className={styles.bannerText}>
        <strong>{phase}:</strong> {step}
      </p>
      {extra.length > 0 ? (
        <div className={styles.bannerActions}>
          {extra.map((a) => (
            <button key={JSON.stringify(a)} type="button" onClick={() => act(a)}>
              <ActionLabel action={a} state={state} />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
