import type { CombatOption } from '@survival/content'
import { sameAction, type Action, type GameState } from '@survival/engine'
import { bottomText, CardView, optionText } from './CardView.tsx'
import styles from './Play.module.css'

type Props = Readonly<{
  state: GameState
  legal: readonly Action[]
  act: (a: Action) => void
}>

/**
 * The hand. In Prepare the top halves are up; in Combat the deck is turned and the hand rotates
 * 180 degrees so the bottom halves read upright. Each card offers Play and Discard when legal;
 * in Combat, Play names the bottom-half effect it fires rather than the card's (Prepare) name.
 * In Combat v3 each card offers its Combat options (Engage can be played from anywhere).
 */
export function Hand({ state, legal, act }: Props) {
  const p = state.players[state.current]
  if (!p) return null
  const up = p.orientation
  const legalOf = (a: Action) => legal.find((x) => sameAction(x, a))
  const engageMode = state.config.combat.model === 'engage'
  return (
    <section className={styles.panel} aria-label="Hand">
      <h2 className={styles.panelTitle}>
        Hand — {up === 'top' ? 'top halves up (Prepare)' : 'bottom halves up (Combat)'} · deck{' '}
        {p.deck.length} · discard {p.discard.length}
      </h2>
      {p.hand.length === 0 ? <p>No cards in hand.</p> : null}
      <ul className={styles.hand} data-up={up}>
        {p.hand.map((c) => {
          const def = state.content.cards.find((d) => d.id === c.def)
          if (!def) return null
          const play = legalOf({ type: 'playCard', card: c.id })
          const discard = legalOf({ type: 'discardCard', card: c.id })
          const effect = up === 'top' ? def.name : def.bottom.map(bottomText).join(', ')
          return (
            <li key={c.id} className={styles.handCard}>
              <div className={styles.rotator} data-up={up}>
                <CardView def={def} up={up} config={state.config} engage={engageMode} />
              </div>
              <div className={styles.cardButtons}>
                {engageMode && up === 'bottom' ? (
                  <OptionButtons card={c.id} options={def.combat ?? []} legal={legal} act={act} />
                ) : null}
                {play ? (
                  <button type="button" onClick={() => act(play)}>
                    Play {effect}
                  </button>
                ) : null}
                {discard ? (
                  <button type="button" onClick={() => act(discard)}>
                    Discard {def.name}
                  </button>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

type OptionProps = Readonly<{
  card: string
  options: readonly CombatOption[]
  legal: readonly Action[]
  act: (a: Action) => void
}>

/** Combat v3: 1 button per legal option of a card. */
function OptionButtons({ card, options, legal, act }: OptionProps) {
  return (
    <>
      {options.map((o, option) => {
        const play = legal.find(
          (a) =>
            (a.type === 'playOption' || a.type === 'engage') &&
            a.card === card &&
            a.option === option,
        )
        return play ? (
          <button
            key={option}
            type="button"
            className={o.kind === 'engage' ? styles.primary : undefined}
            onClick={() => act(play)}
          >
            {optionText(o)}
          </button>
        ) : null
      })}
    </>
  )
}
