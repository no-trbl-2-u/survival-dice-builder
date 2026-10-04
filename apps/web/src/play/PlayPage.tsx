import { legalActions, type Action } from '@survival/engine'
import { useEffect, useReducer, useRef, useState } from 'react'
import { AUTOSAVE_KEY, browserStorage, loadConfig } from '../config/configStore.ts'
import { cuesFor } from '../sound/cues.ts'
import { play } from '../sound/sound.ts'
import { TileView } from '../tiles/TileView.tsx'
import { BasePanel } from './BasePanel.tsx'
import { Choices } from './Choices.tsx'
import { DecisionDialog } from './DecisionDialog.tsx'
import { DiceTray } from './DiceTray.tsx'
import { downloadRun, exportRun } from './exportRun.ts'
import { Hand } from './Hand.tsx'
import { PhaseBar } from './PhaseBar.tsx'
import styles from './Play.module.css'
import { PlayerPanel } from './PlayerPanel.tsx'
import { PlayLog } from './PlayLog.tsx'
import { PlayMap } from './PlayMap.tsx'
import { loadPrefs, savePrefs, type Prefs } from './prefs.ts'
import { newRun, reduceRun, undo, type Run, type RunMsg } from './run.ts'
import { RunSummary } from './RunSummary.tsx'
import { SkillBoard } from './SkillBoard.tsx'
import { StartPanel } from './StartPanel.tsx'

type Msg = RunMsg | Readonly<{ kind: 'reset' }>

/** The page holds no run until one starts (start panel) or `?seed=` starts one at once. */
function reducer(run: Run | null, msg: Msg): Run | null {
  if (msg.kind === 'reset') return null
  if (msg.kind === 'act' && !run) return null
  return reduceRun(run as Run, msg)
}

/**
 * `/play`: a run for 1-4 players on one screen. `?seed=N` (and `?players=N`) start a run at
 * once (replays, tests); otherwise the start panel asks. Every control is built from
 * `legalActions`; the page only passes the chosen action back to the engine.
 */
export function PlayPage() {
  const store = browserStorage()
  const [{ config, custom }] = useState(() => loadConfig(store))
  const [run, dispatch] = useReducer(reducer, null, () => {
    const params = new URLSearchParams(window.location.search)
    const seed = Number.parseInt(params.get('seed') ?? '', 10)
    const players = Number.parseInt(params.get('players') ?? '1', 10) || 1
    return Number.isFinite(seed) ? newRun(config, seed, players, Date.now()) : null
  })
  const [undoOn, setUndoOn] = useState(false)
  const [prefs, setPrefsState] = useState(() => loadPrefs(store))
  const setPrefs = (next: Prefs) => {
    setPrefsState(next)
    savePrefs(store, next)
  }

  // Autosave after every action (this browser only).
  useEffect(() => {
    if (!run || run.actions.length === 0) return
    try {
      store?.setItem(AUTOSAVE_KEY, JSON.stringify(exportRun(run)))
    } catch {
      // Storage full or blocked: the run continues; only the autosave is lost.
    }
  }, [run, store])

  if (!run) {
    return (
      <StartPanel
        custom={custom}
        store={store}
        onStart={(players, seed) =>
          dispatch({ kind: 'new', config, seed, players, at: Date.now() })
        }
        onLoad={(loaded) => dispatch({ kind: 'replace', run: loaded })}
      />
    )
  }
  return (
    <Game
      run={run}
      dispatch={dispatch}
      undoOn={undoOn}
      setUndoOn={setUndoOn}
      prefs={prefs}
      setPrefs={setPrefs}
    />
  )
}

type GameProps = Readonly<{
  run: Run
  dispatch: (msg: Msg) => void
  undoOn: boolean
  setUndoOn: (on: boolean) => void
  prefs: Prefs
  setPrefs: (prefs: Prefs) => void
}>

/** The board, panels, and controls of a run in progress (or its summary). */
function Game({ run, dispatch, undoOn, setUndoOn, prefs, setPrefs }: GameProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const main = useRef<HTMLDivElement>(null)
  const { state } = run
  const legal = legalActions(state)
  const act = (action: Action) => {
    setSelected(null)
    dispatch({ kind: 'act', action, at: Date.now() })
  }
  const revealed = state.content.tiles.find((t) => t.id === state.revealed[0])

  // Sound: the cues of each new action (never on load or undo: those replace the run).
  const heard = useRef(run.actions.length)
  useEffect(() => {
    const fresh = run.actions.length === heard.current + 1
    heard.current = run.actions.length
    if (fresh && prefs.sound) play(cuesFor(run.lastEvents))
  }, [run, prefs.sound])

  // Keyboard: when the focused control disappears after an action, move to the next decision.
  useEffect(() => {
    const active = document.activeElement
    if (active && active !== document.body && document.contains(active)) return
    main.current
      ?.querySelector<HTMLElement>('[data-decisions] button, [data-decisions] [role="button"]')
      ?.focus()
  }, [run.actions.length])

  const who = state.players.length > 1 ? `Player ${state.current + 1}, ` : ''
  const step = state.exchange
    ? `${state.exchange.skirmish ? 'Skirmish' : 'Exchange'}: ${state.exchange.step}`
    : `${state.phase}${state.active ? `: ${state.active.kind}` : ''}`
  return (
    <div className={styles.page} ref={main}>
      <p className="visually-hidden" aria-live="polite">
        Round {state.round}, {who}
        {step}
      </p>
      <PhaseBar state={state} />
      {state.phase === 'ended' ? (
        <RunSummary
          run={run}
          baseCurve={run.baseCurve}
          onNewRun={() => dispatch({ kind: 'reset' })}
        />
      ) : null}
      <DecisionDialog state={state} legal={legal} act={act} />
      <div className={`${styles.layout} ${styles.boardRow}`}>
        <PlayMap state={state} legal={legal} act={act} events={run.lastEvents} />
        <div className={styles.side} data-decisions>
          {revealed ? (
            <section className={styles.panel} aria-label="Tile to place">
              <h2 className={styles.panelTitle}>Place {revealed.name}: choose a slot</h2>
              <div className={styles.tilePreview}>
                <TileView tile={revealed} />
              </div>
            </section>
          ) : null}
          <Choices state={state} legal={legal} act={act} />
          <PlayerPanel state={state} />
        </div>
      </div>
      {state.exchange ? (
        <div className={`${styles.layout} ${styles.exchangeRow}`} data-decisions>
          <DiceTray
            state={state}
            legal={legal}
            act={act}
            selected={selected}
            select={setSelected}
            dice3d={prefs.dice3d}
          />
          <SkillBoard
            state={state}
            legal={legal}
            act={act}
            selected={selected}
            select={setSelected}
          />
        </div>
      ) : null}
      <div className={styles.handRow} data-decisions>
        <Hand state={state} legal={legal} act={act} />
      </div>
      <div className={`${styles.layout} ${styles.lateRow}`}>
        <BasePanel state={state} legal={legal} act={act} />
        <PlayLog state={state} />
      </div>
      <div className={styles.footer}>
        <span>
          Seed {run.seed} · {run.players} {run.players === 1 ? 'player' : 'players'} ·{' '}
          {run.actions.length} {run.actions.length === 1 ? 'action' : 'actions'}
        </span>
        <button type="button" onClick={() => downloadRun(run, Date.now())}>
          Save run (file)
        </button>
        <button type="button" onClick={() => dispatch({ kind: 'reset' })}>
          New run
        </button>
        <label>
          <input
            type="checkbox"
            checked={prefs.sound}
            onChange={(e) => setPrefs({ ...prefs, sound: e.target.checked })}
          />{' '}
          Sound
        </label>
        <label>
          <input
            type="checkbox"
            checked={prefs.dice3d}
            onChange={(e) => setPrefs({ ...prefs, dice3d: e.target.checked })}
          />{' '}
          3D dice
        </label>
        <label>
          <input type="checkbox" checked={undoOn} onChange={(e) => setUndoOn(e.target.checked)} />{' '}
          Developer: allow undo
        </label>
        {undoOn ? (
          <button
            type="button"
            disabled={run.actions.length === 0}
            onClick={() => dispatch({ kind: 'replace', run: undo(run) })}
          >
            Undo last decision
          </button>
        ) : null}
      </div>
    </div>
  )
}
