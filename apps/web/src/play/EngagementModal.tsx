import type { Action, GameState } from '@survival/engine'
import { useEffect, useRef, useState } from 'react'
import { GameIcon } from '../icons/GameIcon.tsx'
import { CardStrip, OptionChips, stripCards, type DragState } from './CardStrip.tsx'
import { describeEvent } from './describeEvent.ts'
import { DiceTray, EnemyDice, enemyKindOf } from './DiceTray.tsx'
import {
  cancelledLine,
  ENGAGE_STAGES,
  engageHeadline,
  engageInstruction,
  engageStage,
  type EngageSummary,
} from './engageView.ts'
import styles from './Play.module.css'
import { PlayMap } from './PlayMap.tsx'
import { SkillBoard } from './SkillBoard.tsx'
import { firstOf, ofType } from './targets.ts'

type Props = Readonly<{
  state: GameState
  legal: readonly Action[]
  act: (a: Action) => void
  actAll: (actions: readonly Action[]) => void
  selected: readonly number[]
  toggle: (die: number) => void
  dice3d: boolean
  /** Set once the engagement is over: the modal shows what happened until it is closed. */
  summary: EngageSummary | null
  onClose: () => void
}>

/**
 * Combat v3: the whole engagement in 1 modal — the enemy dice, the player's dice, cards to add,
 * the Skills, the targets, and the result. Every control is a legal action from the engine;
 * the modal only arranges them. "Look at the board" hides it until the player comes back; Esc
 * closes it only on the result, never mid-engagement.
 */
export function EngagementModal(props: Props) {
  const { state, summary, onClose } = props
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<Element | null>(null)
  const [peek, setPeek] = useState(false)
  // An action taken from the board while it is in view (a target clicked on the main map) moves
  // the engagement on: come back to show what is next, or the result.
  const [seen, setSeen] = useState(state)
  if (seen !== state) {
    setSeen(state)
    if (peek) setPeek(false)
  }
  const open = !peek

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (open && !el.open) {
      opener.current ??= document.activeElement
      el.showModal()
      firstFocus(el)?.focus()
    }
    if (!open && el.open) el.close()
  }, [open])

  // After each action, keep focus inside the modal: the clicked control may be gone, so move to
  // the step's main action (or its first control).
  useEffect(() => {
    const el = dialog.current
    if (!el?.open || el.contains(document.activeElement)) return
    firstFocus(el)?.focus()
  }, [state, summary])

  // Closing for good: give focus back to where it was (or the page's next decision).
  useEffect(
    () => () => {
      const back = opener.current
      if (back instanceof HTMLElement && document.contains(back))
        back.focus({ preventScroll: true })
    },
    [],
  )

  if (peek) {
    return (
      <div className={styles.engagePeek} role="region" aria-label="Engagement in progress">
        <span>
          <strong>Engagement paused.</strong> Look around the board, then go back to finish it.
        </span>
        <button
          type="button"
          className={styles.primary}
          autoFocus
          data-testid="engage-return"
          onClick={() => setPeek(false)}
        >
          Back to the engagement
        </button>
      </div>
    )
  }

  return (
    <dialog
      ref={dialog}
      className={styles.engageModal}
      aria-labelledby="engage-title"
      data-testid="engagement-modal"
      onCancel={(e) => {
        // Esc: only the result can close; mid-engagement it would hide pending choices.
        e.preventDefault()
        if (summary) onClose()
      }}
    >
      {summary ? (
        <SummaryView state={state} summary={summary} onClose={onClose} />
      ) : (
        <LiveView
          {...props}
          onPeek={() => {
            setPeek(true)
            window.scrollTo({ top: 0 })
          }}
        />
      )}
    </dialog>
  )
}

/**
 * Where focus goes in a step: a target, else a die's Select toggle, else "Roll again", else the
 * step's main action. Never "End engagement" or a Skill first: Enter must not skip or fire.
 */
function firstFocus(el: HTMLElement): HTMLElement | null {
  return (
    el.querySelector<HTMLElement>('[data-testid="engage-targets"] button') ??
    el.querySelector<HTMLElement>('section[aria-label="Dice"] button[aria-pressed]') ??
    el.querySelector<HTMLElement>('[data-roll-again]') ??
    el.querySelector<HTMLElement>('[data-primary]') ??
    el.querySelector<HTMLElement>('button')
  )
}

/** The header: who is engaged, the player's health and guard, and the stage strip. */
function Head({
  state,
  stage,
  title = 'Engagement',
  onPeek,
}: Readonly<{ state: GameState; stage: number; title?: string; onPeek?: () => void }>) {
  const player = state.players[state.current]
  const ids = [...new Set(state.exchange?.engage?.enemyDice.map((d) => d.enemy) ?? [])]
  const foes = ids.map((id) => `${enemyKindOf(state, id) ?? 'enemy'} ${id}`)
  return (
    <header className={styles.engageHead}>
      <div className={styles.engageTitleRow}>
        <h2 id="engage-title" className={styles.engageTitle}>
          {title}
          {foes.length > 0 ? (
            <span className={styles.engageFoes}> vs {foes.join(', ')}</span>
          ) : null}
        </h2>
        {onPeek ? (
          <button
            type="button"
            className={styles.engagePeekButton}
            aria-label="Look at the board"
            onClick={onPeek}
          >
            <span className={styles.engageWide}>Look at the board</span>
            <span className={styles.engageNarrow}>Board</span>
          </button>
        ) : null}
        {player ? (
          <p className={styles.engageVitals} data-testid="engage-vitals">
            <span>
              <GameIcon name="health" /> Health {player.health}/{player.maxHealth}
            </span>
            <span>
              <GameIcon name="guard" /> Guard {player.guard}
            </span>
          </p>
        ) : null}
      </div>
      <ol className={styles.engageSteps} aria-label="Engagement steps">
        {ENGAGE_STAGES.map((name, i) => (
          <li
            key={name}
            aria-current={i === stage ? 'step' : undefined}
            data-done={i < stage || undefined}
            data-final={i === ENGAGE_STAGES.length - 1 || undefined}
          >
            <span className={styles.engageStepNum}>{i + 1}</span>{' '}
            <span className={styles.engageStepName}>{name}</span>
          </li>
        ))}
      </ol>
    </header>
  )
}

type LiveProps = Props & Readonly<{ onPeek: () => void }>

/** The engagement while it runs. */
function LiveView({ state, legal, act, actAll, selected, toggle, dice3d, onPeek }: LiveProps) {
  const ex = state.exchange
  const picking = legal.some((a) => a.type === 'resolveSkill' || a.type === 'chooseTarget')
  const targets = useRef<HTMLDivElement>(null)
  const felt = useRef<HTMLElement>(null)
  const [drag, setDrag] = useState<DragState>('none')
  const [choosing, setChoosing] = useState<string | null>(null)
  // The card whose options the felt offers, while it can still be played.
  const chosen = choosing
    ? stripCards(state, legal).find((c) => c.id === choosing && c.plays.length > 1)
    : undefined
  // A target pick appears at the top of the body: bring it into view (phones scroll the body).
  useEffect(() => {
    if (picking) targets.current?.scrollIntoView({ block: 'nearest' })
  }, [picking])
  if (!ex) return null
  const stage = engageStage(ex.step)
  const roll = firstOf(legal, 'roll')
  const stop = firstOf(legal, 'stopRolling')
  const endReroll = firstOf(legal, 'endReroll')
  const endCards = firstOf(legal, 'endCards')
  const finish = firstOf(legal, 'confirmAssignment')
  const rollsLeft = state.config.combat.maxRolls - ex.rollsUsed
  const primary = stop ?? endReroll ?? endCards ?? finish
  const primaryText = stop
    ? 'Stop rolling: use these dice'
    : endReroll
      ? 'Stop rerolling'
      : endCards
        ? 'Done adding cards'
        : 'End engagement: enemy dice hit'
  return (
    <>
      <Head state={state} stage={stage} onPeek={onPeek} />
      <p className={styles.engageNow} aria-live="polite" data-testid="engage-instruction">
        {engageInstruction(state)}
      </p>
      <div className={styles.engageBody} data-drag={drag === 'none' ? undefined : drag}>
        <div ref={targets} className={styles.engageTargetSlot}>
          <Targets state={state} legal={legal} act={act} />
        </div>
        <section
          ref={felt}
          className={`${styles.dice} ${styles.engageFelt}`}
          aria-label="Dice"
          data-drop={drag === 'none' ? undefined : drag}
        >
          <span className={styles.dropSlot} aria-hidden="true" />
          {chosen ? <OptionChips card={chosen} act={act} onDone={() => setChoosing(null)} /> : null}
          <RollPips
            used={ex.rollsUsed}
            max={state.config.combat.maxRolls}
            cardRerolls={ex.step === 'reroll' ? ex.rerollsLeft : null}
          />
          <EnemyDice state={state} heading={false} bare />
          {ex.engage?.enemyDice.length ? (
            <span className={styles.engageFeltSplit} aria-hidden="true" />
          ) : null}
          <DiceTray
            state={state}
            legal={legal}
            act={act}
            selected={selected}
            toggle={toggle}
            dice3d={dice3d}
            enemyDice={false}
            controls={false}
            bare
          />
        </section>
        <SkillBoard
          state={state}
          legal={legal}
          act={act}
          actAll={actAll}
          selected={selected}
          confirmButton={false}
        />
      </div>
      <CardStrip
        state={state}
        legal={legal}
        act={act}
        felt={felt}
        choose={setChoosing}
        onDrag={setDrag}
        pending={chosen?.id ?? null}
      />
      <footer className={styles.engageFoot}>
        <span className={styles.engageFootActions}>
          {roll ? (
            <button type="button" data-roll-again onClick={() => act(roll)}>
              Roll again ({rollsLeft} left)
            </button>
          ) : null}
          {primary ? (
            <button
              // A new element per step: focus then moves to the new step's first control.
              key={ex.step}
              type="button"
              className={styles.primary}
              data-primary
              onClick={() => act(primary)}
            >
              {primaryText}
            </button>
          ) : null}
        </span>
      </footer>
    </>
  )
}

/**
 * The roll counter in the felt's corner: 1 pip per roll, filled for each roll used. During a
 * card's reroll it also says how many card rerolls are left.
 */
function RollPips({
  used,
  max,
  cardRerolls,
}: Readonly<{ used: number; max: number; cardRerolls: number | null }>) {
  return (
    <p className={styles.engageRolls} data-testid="engage-rolls">
      <span>Rolls:</span>
      <span role="img" aria-label={`Roll ${used} of ${max}`} className={styles.engagePips}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={styles.engagePip} data-used={i < used || undefined} />
        ))}
      </span>
      {cardRerolls !== null ? <span>· card rerolls {cardRerolls}</span> : null}
    </p>
  )
}

/** Hexes around the player the target map frames: the same zoom for every pick. */
const MINI_MAP_RADIUS = 3

/**
 * A fired attack Skill picks its enemy here: a small map framed on the player, the enemies in
 * range highlighted and clickable, and 1 button per target (the keyboard and screen-reader way;
 * hovering either one highlights the other). The engine's own target list; the next Skill in
 * the queue goes first.
 */
function Targets({ state, legal, act }: Readonly<Pick<Props, 'state' | 'legal' | 'act'>>) {
  const [hover, setHover] = useState<string | null>(null)
  const head = state.exchange?.queue[0]
  const resolves = ofType(legal, 'resolveSkill').filter(
    (a) => !head || (a.skill === head.skill && a.use === head.use),
  )
  const chooses = ofType(legal, 'chooseTarget')
  if (resolves.length === 0 && chooses.length === 0) return null
  const enemy = (id: string) => state.enemies.find((e) => e.id === id)
  const label = (id: string) => {
    const e = enemy(id)
    const max = e ? state.content.enemies.enemies.find((d) => d.id === e.kind)?.health : undefined
    return e ? `${e.kind} ${id} (health ${e.health}${max ? `/${max}` : ''})` : `enemy ${id}`
  }
  const skillName = (id: string) => state.content.skills.find((s) => s.id === id)?.name ?? id
  const player = state.players[state.current]
  const onMap = [...resolves, ...chooses].some((a) => a.enemy !== undefined)
  const buttonProps = (id: string | undefined) =>
    id
      ? {
          'data-highlight': hover === id || undefined,
          onPointerEnter: () => setHover(id),
          onPointerLeave: () => setHover(null),
          onFocus: () => setHover(id),
          onBlur: () => setHover(null),
        }
      : {}
  return (
    <section
      className={styles.engageTargets}
      aria-label="Choose a target"
      data-testid="engage-targets"
    >
      {onMap && player ? (
        <PlayMap
          state={state}
          legal={[...resolves, ...chooses]}
          act={act}
          around={{ hex: player.hex, radius: MINI_MAP_RADIUS }}
          fixed
          highlight={hover}
          onHighlight={setHover}
          label="Target map"
          className={styles.miniMap}
        />
      ) : null}
      <div className={styles.engageTargetPick}>
        <h3 className={styles.subTitle}>Choose a target</h3>
        <ul className={styles.engageTargetList}>
          {resolves.map((a) => (
            <li key={`${a.skill}-${a.use}-${a.enemy ?? 'none'}`}>
              <button
                type="button"
                className={styles.primary}
                data-primary
                onClick={() => act(a)}
                {...buttonProps(a.enemy)}
              >
                {a.enemy
                  ? `${skillName(a.skill)} hits ${label(a.enemy)}`
                  : `Fire ${skillName(a.skill)}`}
              </button>
            </li>
          ))}
          {chooses.map((a) => (
            <li key={a.enemy}>
              <button
                type="button"
                className={styles.primary}
                data-primary
                onClick={() => act(a)}
                {...buttonProps(a.enemy)}
              >
                Target {label(a.enemy)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** The result of a finished engagement, until the player closes it. */
function SummaryView({
  state,
  summary,
  onClose,
}: Readonly<{ state: GameState; summary: EngageSummary; onClose: () => void }>) {
  const lines: string[] = []
  const skillName = (id: string) => state.content.skills.find((s) => s.id === id)?.name ?? id
  lines.push(
    summary.fired.length > 0
      ? `Skills fired: ${summary.fired.map(skillName).join(', ')}.`
      : 'No Skill fired.',
  )
  lines.push(
    summary.dealt > 0
      ? `You dealt ${summary.dealt} damage${summary.defeated > 0 ? ` and defeated ${summary.defeated} ${summary.defeated === 1 ? 'enemy' : 'enemies'}` : ''}.`
      : 'You dealt no damage.',
  )
  if (summary.healed > 0) lines.push(`You healed ${summary.healed}.`)
  const rewards = [
    summary.experience > 0 ? `${summary.experience} experience` : '',
    summary.currency > 0 ? `${summary.currency} currency` : '',
  ].filter(Boolean)
  if (rewards.length > 0) lines.push(`You gained ${rewards.join(' and ')}.`)
  lines.push(
    summary.hitsTaken === 0
      ? `No enemy die hit you${summary.ignored > 0 ? ` (${summary.ignored} ignored)` : ''}.`
      : `${summary.hitsTaken} enemy ${summary.hitsTaken === 1 ? 'die' : 'dice'} hit you: ${summary.toGuard} to guard, ${summary.toHealth} to health${summary.ignored > 0 ? ` (${summary.ignored} ignored)` : ''}.`,
  )
  const cancelled = cancelledLine(summary)
  if (cancelled) lines.push(cancelled)
  return (
    <>
      <Head state={state} stage={ENGAGE_STAGES.length - 1} title="Engagement over" />
      <p
        className={`${styles.engageNow} ${summary.knockedOut ? styles.engageKo : ''}`}
        data-testid="engage-headline"
      >
        {engageHeadline(summary)}
      </p>
      <div className={styles.engageSummary} data-testid="engage-summary">
        {summary.enemyDice.length > 0 ? (
          <>
            <h3 className={styles.subTitle}>The enemy dice</h3>
            <EnemyDice state={state} heading={false} rolls={summary.enemyDice} />
          </>
        ) : null}
        <ul className={styles.engageTotals}>
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <details>
          <summary>Everything that happened</summary>
          <ol className={styles.log}>
            {summary.events.map((e, i) => (
              <li key={i}>{describeEvent(e, state)}</li>
            ))}
          </ol>
        </details>
      </div>
      <footer className={styles.engageFoot}>
        <span />
        <button type="button" className={styles.primary} data-primary onClick={onClose}>
          Back to the board
        </button>
      </footer>
    </>
  )
}
