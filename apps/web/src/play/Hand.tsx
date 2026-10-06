import { sameAction, type Action, type GameState } from '@survival/engine'
import { bottomText, CardView } from './CardView.tsx'
import styles from './Play.module.css'

type Props = Readonly<{ state: GameState; legal: readonly Action[]; act: (a: Action) => void }>

/**
 * The hand. In Prepare the top halves are up; in Combat the deck is turned and the hand rotates
 * 180 degrees so the bottom halves read upright. Each card offers Play and Discard when legal;
 * in Combat, Play names the bottom-half effect it fires rather than the card's (Prepare) name.
 */
export function Hand({ state, legal, act }: Props) {
  const p = state.players[state.current]
  if (!p) return null
  const up = p.orientation
  const legalOf = (a: Action) => legal.find((x) => sameAction(x, a))
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
                <CardView def={def} up={up} />
              </div>
              <div className={styles.cardButtons}>
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
