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
import { ActionLabel } from './ActionLabel.tsx'
import styles from './DebugPage.module.css'
import { EventLog } from './EventLog.tsx'
import { StateView } from './StateView.tsx'

type Run = Readonly<{ seed: number; state: GameState; actions: readonly Action[] }>

type Msg =
  { kind: 'new'; seed: number } | { kind: 'act'; action: Action } | { kind: 'bot'; steps: number }

/** Autoplay stops after this many bot actions (a stuck bot cannot freeze the page). */
const AUTOPLAY_LIMIT = 5000

/** Holds the run as seed + actions; every state comes from the engine. */
function reducer(run: Run, msg: Msg): Run {
  if (msg.kind === 'new') {
    return { seed: msg.seed, state: createGame(defaultContent.config, msg.seed), actions: [] }
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
    return { ...run, state, actions }
  }
  return {
    ...run,
    state: applyAction(run.state, msg.action).state,
    actions: [...run.actions, msg.action],
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
  const [copied, setCopied] = useState(false)
  const actions = legalActions(run.state)
  const heading = useRef<HTMLHeadingElement>(null)
  const refocus = useRef(false)

  /** Applies a step, then returns focus to the action list (its buttons are all replaced). */
  const step = (msg: Msg) => {
    refocus.current = true
    dispatch(msg)
  }

  useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    heading.current?.focus()
  }, [run])

  const copyReplay = async () => {
    await navigator.clipboard.writeText(JSON.stringify({ seed: run.seed, actions: run.actions }))
    setCopied(true)
  }

  return (
    <div className={styles.page}>
      <p>Play the rules engine one action at a time. Numbers in [brackets] are rules sections.</p>
      <form
        className={styles.controls}
        onSubmit={(e) => {
          e.preventDefault()
          setCopied(false)
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
        <button type="button" onClick={() => step({ kind: 'bot', steps: 1 })}>
          Bot step
        </button>
        <button type="button" onClick={() => step({ kind: 'bot', steps: AUTOPLAY_LIMIT })}>
          Autoplay
        </button>
        <button type="button" onClick={copyReplay}>
          {copied ? 'Replay copied' : 'Copy replay'}
        </button>
        <span>
          {run.actions.length} action{run.actions.length === 1 ? '' : 's'}
        </span>
      </form>

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
                  <ActionLabel action={action} state={run.state} />
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
