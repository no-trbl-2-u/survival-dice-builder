import { milestoneIds, milestoneOutOfReach } from '@survival/content'
import type { Action, GameState } from '@survival/engine'
import { GameIcon } from '../icons/GameIcon.tsx'
import { cardText } from './effectText.ts'
import { MilestoneList } from './MilestoneList.tsx'
import styles from './Play.module.css'
import { ofType } from './targets.ts'

type Props = Readonly<{ state: GameState; legal: readonly Action[]; act: (a: Action) => void }>

/**
 * The base board: health, the 2 upgrade tracks (bought, next, cost; Buy while a Build is active
 * on the base), and the Shop offers (Buy when the figure is on the base and the price is met).
 * When nothing can be bought it says how buying works, so materials never look stuck. The
 * run's milestones close the panel, folded, with how many are met and how many the config and
 * content put out of reach (rule 1.4).
 */
export function BasePanel({ state, legal, act }: Props) {
  const upgrades = ofType(legal, 'buyUpgrade')
  const buys = ofType(legal, 'buyCard')
  const player = state.players[state.current]
  const ids = milestoneIds(state.config.milestones)
  const outOfReach = ids.filter(
    (id) => !state.milestones.includes(id) && milestoneOutOfReach(id, state.config, state.content),
  ).length
  return (
    <section className={styles.panel} aria-label="Base">
      <h2 className={styles.panelTitle}>
        <GameIcon name="base" />{' '}
        <span key={state.base.health} className={styles.hit}>
          Base — {state.base.health} / {state.base.maxHealth} health
        </span>
      </h2>
      {(['shop', 'training'] as const).map((track) => (
        <div key={track} className={styles.track}>
          <span className={styles.trackName}>{track === 'shop' ? 'Shop' : 'Training'}</span>
          <ol className={styles.tiers}>
            {state.content.upgrades
              .filter((u) => u.track === track)
              .sort((a, b) => a.tier - b.tier)
              .map((u) => {
                const bought = state.upgrades.includes(u.id)
                const buy = upgrades.find((a) => a.upgrade === u.id)
                return (
                  <li key={u.id} className={`${styles.tier} ${bought ? styles.bought : ''}`}>
                    {buy ? (
                      <button type="button" onClick={() => act(buy)}>
                        Buy {u.name} ({u.cost} materials)
                      </button>
                    ) : (
                      <span>
                        {u.name}: {bought ? 'bought' : `${u.cost} materials`}
                      </span>
                    )}
                  </li>
                )
              })}
          </ol>
        </div>
      ))}
      {upgrades.length === 0 && player ? (
        <p className={styles.muted} data-testid="upgrade-hint">
          To buy an upgrade, stand on the Base tile and play a Build card, then pay its materials.
          You have {player.materials} materials.
        </p>
      ) : null}
      <h3 className={styles.subTitle}>
        Shop offers{' '}
        {player ? (
          <>
            · you have <GameIcon name="currency" className={styles.currency} /> {player.currency}{' '}
            currency
          </>
        ) : null}
      </h3>
      {state.shopOffers.length === 0 ? (
        <p className={styles.muted}>
          The Shop opens when you buy the Shop I upgrade. Its cards cost currency, which you get for
          defeating enemies, not materials.
        </p>
      ) : (
        <>
          {buys.length === 0 ? (
            <p className={styles.muted}>
              Buy a card while your figure is on the Base tile, with enough currency.
            </p>
          ) : null}
          <ul className={styles.offers}>
            {state.shopOffers.map((id, i) => {
              const def = state.content.cards.find((c) => c.id === id)
              const buy = buys.find((a) => a.card === id)
              return (
                <li key={`${id}-${i}`} className={styles.offer}>
                  <strong>{def?.name ?? id}</strong>
                  <span className={styles.muted}>Cost {def?.cost ?? '?'}</span>
                  {def ? <span>{cardText(def, state.config)}</span> : null}
                  {buy ? (
                    <button type="button" onClick={() => act(buy)}>
                      Buy {def?.name ?? id}
                    </button>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </>
      )}
      <details className={styles.milestoneProgress} data-testid="milestone-progress">
        <summary>
          Milestones: {state.milestones.length} of {ids.length} met
          {outOfReach > 0 ? ` (${outOfReach} out of reach)` : ''}
        </summary>
        <MilestoneList state={state} />
      </details>
    </section>
  )
}
