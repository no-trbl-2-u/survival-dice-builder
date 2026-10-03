import { defaultContent } from '@survival/content'
import {
  applyAction,
  createGame,
  legalActions,
  type Action,
  type GameState,
} from '@survival/engine'
import { useReducer, useState } from 'react'
import { describeAction } from './describeAction.ts'
import styles from './DebugPage.module.css'
import { EventLog } from './EventLog.tsx'
import { StateView } from './StateView.tsx'

type Run = Readonly<{ seed: number; state: GameState; actions: readonly Action[] }>

type Msg = { kind: 'new'; seed: number } | { kind: 'act'; action: Action }

/** Holds the run as seed + actions; every state comes from the engine. */
function reducer(run: Run, msg: Msg): Run {
  if (msg.kind === 'new') {
    return { seed: msg.seed, state: createGame(defaultContent.config, msg.seed), actions: [] }
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

  const copyReplay = async () => {
    await navigator.clipboard.writeText(JSON.stringify({ seed: run.seed, actions: run.actions }))
    setCopied(true)
  }

  return (
    <div className={styles.page}>
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
        <button type="button" onClick={copyReplay}>
          {copied ? 'Replay copied' : 'Copy replay'}
        </button>
        <span>
          {run.actions.length} action{run.actions.length === 1 ? '' : 's'}
        </span>
      </form>

      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading">Legal actions ({actions.length})</h2>
        {actions.length === 0 ? (
          <p>The run has ended.</p>
        ) : (
          <ul className={styles.actions} data-testid="actions">
            {actions.map((action) => (
              <li key={JSON.stringify(action)}>
                <button type="button" onClick={() => dispatch({ kind: 'act', action })}>
                  {describeAction(action, run.state)}
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
