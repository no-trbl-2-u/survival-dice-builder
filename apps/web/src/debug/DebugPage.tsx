import { botChoice } from '@survival/bot'
import { defaultContent } from '@survival/content'
import {
  applyAction,
  createGame,
  legalActions,
  type Action,
  type GameState,
} from '@survival/engine'
import { useEffect, useReducer, useRef, useState } from 'react'
import { rulesUrl } from '../decisions/Inline.tsx'
import { ActionLabel } from './ActionLabel.tsx'
import styles from './DebugPage.module.css'
import { EventLog } from './EventLog.tsx'
import { StateView } from './StateView.tsx'
import { type StepResult, stepStatus } from './stepStatus.ts'

type Run = Readonly<{
  seed: number
  state: GameState
  actions: readonly Action[]
  /** The last step, for the status line; null at the start of a run. */
  last: StepResult | null
}>

type Msg =
  | { kind: 'new'; seed: number }
  | { kind: 'act'; action: Action }
  | { kind: 'bot'; steps: number; by: 'bot step' | 'autoplay' }

/** Autoplay stops after this many bot actions (a stuck bot cannot freeze the page). */
const AUTOPLAY_LIMIT = 5000

/** Holds the run as seed + actions; every state comes from the engine. */
function reducer(run: Run, msg: Msg): Run {
  if (msg.kind === 'new') {
    return {
      seed: msg.seed,
      state: createGame(defaultContent.config, msg.seed),
      actions: [],
      last: null,
    }
  }
  if (msg.kind === 'bot') {
    let state = run.state
    const actions = [...run.actions]
    for (let i = 0; i < msg.steps; i++) {
      const action = botChoice(state)
      if (!action) break
      state = applyAction(state, action).state
      actions.push(action)
    }
    const last = {
      by: msg.by,
      actions: actions.length - run.actions.length,
      events: state.log.length - run.state.log.length,
    }
    return { ...run, state, actions, last }
  }
  const state = applyAction(run.state, msg.action).state
  return {
    ...run,
    state,
    actions: [...run.actions, msg.action],
    last: { by: 'action', actions: 1, events: state.log.length - run.state.log.length },
  }
}

/**
 * Developer console for the engine: the legal actions as buttons, the state, and the event log
 * with rule ids. Ugly by design; it exists so every engine phase can be played on the live site
 * before the real UI (phases 11-12). It never decides a rule.
 */
export function DebugPage() {
  const [seedText, setSeedText] = useState('1')
  const [run, dispatch] = useReducer(reducer, undefined, () =>
    reducer({} as Run, { kind: 'new', seed: 1 }),
  )
  // What the last Copy replay did; any later step clears it, so it never names a stale replay.
  const [copied, setCopied] = useState<'copied' | 'failed' | null>(null)
  const actions = legalActions(run.state)
  const heading = useRef<HTMLHeadingElement>(null)
  const refocus = useRef(false)

  /** Applies a step, then returns focus to the action list (its buttons are all replaced). */
  const step = (msg: Msg) => {
    refocus.current = true
    setCopied(null)
    dispatch(msg)
  }

  useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    heading.current?.focus()
  }, [run])

  const copyReplay = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify({ seed: run.seed, actions: run.actions }))
      setCopied('copied')
    } catch {
      setCopied('failed')
    }
  }

  return (
    <div className={styles.page}>
      <p>
        Play the rules engine one action at a time. Each log line starts with the section of the{' '}
        <a href={rulesUrl}>written rules</a> (on GitHub) it follows, in [brackets], or [not in the
        written rules] when the step comes from a later design decision. It always plays the
        standard rules, not a config saved on <a href="/config">Config</a>.
      </p>
      <form
        className={styles.controls}
        onSubmit={(e) => {
          e.preventDefault()
          setCopied(null)
          dispatch({ kind: 'new', seed: Number.parseInt(seedText, 10) || 0 })
        }}
      >
        <label>
          Seed{' '}
          <input
            inputMode="numeric"
            value={seedText}
            onChange={(e) => setSeedText(e.target.value)}
            aria-label="Seed"
          />
        </label>
        <button type="submit">New run</button>
        <button type="button" onClick={() => step({ kind: 'bot', steps: 1, by: 'bot step' })}>
          Bot step
        </button>
        <button
          type="button"
          onClick={() => step({ kind: 'bot', steps: AUTOPLAY_LIMIT, by: 'autoplay' })}
        >
          Autoplay
        </button>
        <button type="button" onClick={copyReplay}>
          {copied === 'copied'
            ? 'Replay copied'
            : copied === 'failed'
              ? 'Copy failed'
              : 'Copy replay'}
        </button>
        <span>
          {run.actions.length} action{run.actions.length === 1 ? '' : 's'}
        </span>
      </form>
      <p role="status" data-testid="step-status">
        {run.last ? stepStatus(run.last, run.state) : ''}
      </p>

      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" ref={heading} tabIndex={-1}>
          Legal actions ({actions.length})
        </h2>
        {actions.length === 0 ? (
          <p>The run has ended.</p>
        ) : (
          <ul className={styles.actions} data-testid="actions">
            {actions.map((action) => (
              <li key={JSON.stringify(action)}>
                <button type="button" onClick={() => step({ kind: 'act', action })}>
                  <ActionLabel action={action} state={run.state} ids />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={styles.columns}>
        <StateView state={run.state} />
        <EventLog events={run.state.log} />
      </div>
    </div>
  )
}
