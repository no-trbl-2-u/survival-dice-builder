import type { Action, GameState } from '@survival/engine'
import { useEffect, useRef } from 'react'
import { skillText } from './effectText.ts'
import styles from './Play.module.css'
import { ofType } from './targets.ts'

type Props = Readonly<{ state: GameState; legal: readonly Action[]; act: (a: Action) => void }>

/**
 * A modal for choices that block the run: the Skill draft (keep 1; then, with full slots, the
 * Skill it replaces) and the replace-starter return. Focus moves to its first button.
 */
export function DecisionDialog({ state, legal, act }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const drafts = ofType(legal, 'draftSkill')
  const replaces = ofType(legal, 'replaceSkill')
  const returns = ofType(legal, 'returnStarter')
  const open = drafts.length + replaces.length + returns.length > 0
  useEffect(() => {
    if (open) ref.current?.querySelector('button')?.focus()
  }, [open, legal])
  if (!open) return null
  const skill = (id: string) => state.content.skills.find((s) => s.id === id)
  /** ": 2 damage to 1 enemy within 1 hex", or nothing for an unknown Skill. */
  const effectOf = (id: string) => {
    const def = skill(id)
    return def ? `: ${skillText(def.effect)}` : ''
  }
  const player = state.players[state.current]
  const card = (id: string) =>
    state.content.cards.find(
      (c) =>
        c.id ===
        [...(player?.deck ?? []), ...(player?.discard ?? [])].find((x) => x.id === id)?.def,
    )?.name ?? id
  const title = drafts.length
    ? 'Skill draft: keep 1 Skill'
    : replaces.length
      ? `Your 6 draft slots are full: ${skill(state.draft?.kept ?? '')?.name ?? ''} replaces 1 Skill`
      : 'Return 1 starter card'
  return (
    <div className={styles.backdrop}>
      <div
        ref={ref}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="decision-title"
      >
        <h2 id="decision-title" className={styles.panelTitle}>
          {title}
        </h2>
        <ul className={styles.choices}>
          {drafts.map((a, i) => (
            <li key={a.skill} className={styles.reveal} style={{ animationDelay: `${i * 120}ms` }}>
              <button type="button" onClick={() => act(a)}>
                Draft {skill(a.skill)?.name} ({skill(a.skill)?.faces.join(' + ')})
                <span className={styles.muted}>{effectOf(a.skill)}</span>
              </button>
            </li>
          ))}
          {replaces.map((a) => (
            <li key={a.skill}>
              <button type="button" onClick={() => act(a)}>
                Replace {skill(a.skill)?.name}
                <span className={styles.muted}>{effectOf(a.skill)}</span>
              </button>
            </li>
          ))}
          {returns.map((a) => (
            <li key={a.card}>
              <button type="button" onClick={() => act(a)}>
                Return {card(a.card)} [{a.card}]
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
