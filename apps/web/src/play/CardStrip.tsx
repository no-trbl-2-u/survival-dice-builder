import type { CardDef } from '@survival/content'
import type { Action, GameState } from '@survival/engine'
import { useRef, useState, type PointerEvent, type RefObject } from 'react'
import { optionText } from './CardView.tsx'
import styles from './Play.module.css'
import { ofType } from './targets.ts'

type Play = Extract<Action, { type: 'playOption' }>

/** 1 card of the hand and the options it can be played for now (empty: not playable now). */
export type StripCard = Readonly<{ id: string; def: CardDef; plays: readonly Play[] }>

/** The hand as the strip shows it: every card, each with its legal Combat options now. */
export function stripCards(state: GameState, legal: readonly Action[]): StripCard[] {
  const plays = ofType(legal, 'playOption')
  const player = state.players[state.current]
  return (player?.hand ?? []).flatMap((c) => {
    const def = state.content.cards.find((d) => d.id === c.def)
    return def ? [{ id: c.id, def, plays: plays.filter((a) => a.card === c.id) }] : []
  })
}

/** Where a drag is: none, a card in the air, or a card over the felt. */
export type DragState = 'none' | 'drag' | 'over'

type Props = Readonly<{
  state: GameState
  legal: readonly Action[]
  act: (a: Action) => void
  /** The felt: the drop zone. */
  felt: RefObject<HTMLElement | null>
  /** A card with more than 1 option was played: the felt offers its options. */
  choose: (card: string) => void
  onDrag: (drag: DragState) => void
}>

/** Pixels a pointer moves before a press becomes a drag (less is a tap). */
const DRAG_START = 6

/**
 * The hand during an engagement, pinned to the bottom of the screen. A playable card is dragged
 * up onto the felt to play it (pointer events: mouse and touch alike); a tap, Enter, or Space
 * plays it too. A card with 2 options asks which on the felt. A card the engine does not offer
 * now is dimmed and does nothing.
 */
export function CardStrip({ state, legal, act, felt, choose, onDrag }: Props) {
  const cards = stripCards(state, legal)
  const [held, setHeld] = useState<{ id: string; dx: number; dy: number; over: boolean } | null>(
    null,
  )
  const start = useRef<{ id: string; x: number; y: number; moved: boolean } | null>(null)
  const dragged = useRef(false)
  if (cards.length === 0) return null

  const activate = (card: StripCard) => {
    if (card.plays.length === 1 && card.plays[0]) act(card.plays[0])
    else if (card.plays.length > 1) choose(card.id)
  }
  const overFelt = (x: number, y: number) => {
    const r = felt.current?.getBoundingClientRect()
    return Boolean(r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
  }
  const down = (card: StripCard) => (e: PointerEvent<HTMLButtonElement>) => {
    // A new press: whatever a past drag left behind (its card may be gone) no longer applies.
    dragged.current = false
    if (card.plays.length === 0 || e.button !== 0) return
    start.current = { id: card.id, x: e.clientX, y: e.clientY, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    const s = start.current
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (!s.moved && Math.hypot(dx, dy) < DRAG_START) return
    s.moved = true
    const over = overFelt(e.clientX, e.clientY)
    setHeld({ id: s.id, dx, dy, over })
    onDrag(over ? 'over' : 'drag')
  }
  const up = (card: StripCard) => (e: PointerEvent<HTMLButtonElement>) => {
    const s = start.current
    start.current = null
    if (!s?.moved) return
    // A drag never also counts as a click.
    dragged.current = true
    setHeld(null)
    onDrag('none')
    if (overFelt(e.clientX, e.clientY)) activate(card)
  }
  const cancel = () => {
    start.current = null
    setHeld(null)
    onDrag('none')
  }

  return (
    <div className={styles.cardStrip} data-testid="card-strip">
      <ul className={styles.cardStripList} aria-label="Your hand">
        {cards.map((card) => {
          const playable = card.plays.length > 0
          const lifted = held?.id === card.id ? held : null
          const label = playable
            ? `Play ${card.def.name}: ${card.plays
                .map((a) => {
                  const o = card.def.combat?.[a.option]
                  return o ? optionText(o) : 'play'
                })
                .join(' or ')}`
            : `${card.def.name}: cannot be played now`
          return (
            <li key={card.id}>
              <button
                type="button"
                className={styles.stripCard}
                data-playable={playable || undefined}
                data-lifted={lifted ? (lifted.over ? 'over' : 'drag') : undefined}
                style={
                  lifted
                    ? { transform: `translate(${lifted.dx}px, ${lifted.dy}px) rotate(-4deg)` }
                    : undefined
                }
                aria-label={label}
                aria-disabled={!playable || undefined}
                onPointerDown={down(card)}
                onPointerMove={move}
                onPointerUp={up(card)}
                onPointerCancel={cancel}
                onClick={() => {
                  if (dragged.current) {
                    dragged.current = false
                    return
                  }
                  activate(card)
                }}
              >
                <span className={styles.stripBand} aria-hidden="true" />
                <strong className={styles.stripName}>{card.def.name}</strong>
                <span className={styles.stripOptions}>
                  {(card.def.combat ?? []).map((o, i) => (
                    <span key={i} data-live={card.plays.some((a) => a.option === i) || undefined}>
                      {optionText(o)}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** The options of a card dropped on the felt: 1 chip each, plus a way back. */
export function OptionChips({
  card,
  act,
  onDone,
}: Readonly<{ card: StripCard; act: (a: Action) => void; onDone: () => void }>) {
  return (
    <div className={styles.optionChips} role="group" aria-label={`Play ${card.def.name} as`}>
      <strong className={styles.optionChipsName}>{card.def.name}</strong>
      {card.plays.map((a, i) => {
        const o = card.def.combat?.[a.option]
        return (
          <button
            key={a.option}
            type="button"
            className={styles.primary}
            // The choice is the next thing to do: start there.
            autoFocus={i === 0}
            data-chip
            onClick={() => {
              onDone()
              act(a)
            }}
          >
            {o ? optionText(o) : 'Play'}
          </button>
        )
      })}
      <button
        type="button"
        className={styles.optionChipsBack}
        aria-label="Keep the card in your hand"
        onClick={onDone}
      >
        ×
      </button>
    </div>
  )
}
