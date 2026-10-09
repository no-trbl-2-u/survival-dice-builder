import type { GameConfig } from '@survival/content'
import {
  applyAction,
  legalActions,
  type Action,
  type GameEvent,
  type GameState,
} from '@survival/engine'
import { useEffect, useReducer, useRef, useState } from 'react'
import { AUTOSAVE_KEY, browserStorage, loadConfig } from '../config/configStore.ts'
import { cuesFor } from '../sound/cues.ts'
import { play } from '../sound/sound.ts'
import { BasePanel } from './BasePanel.tsx'
import { DecisionDialog } from './DecisionDialog.tsx'
import { DiceTray } from './DiceTray.tsx'
import { damageFloats, type DamageFloat } from './damageFloats.ts'
import { atTarget, forceEliteEngagement, forceEngagement } from './devEngage.ts'
import { EngagementModal } from './EngagementModal.tsx'
import { hitLine, lastEngagement, type EngageSummary } from './engageView.ts'
import { downloadRun, exportRun, readAutosave } from './exportRun.ts'
import { Hand } from './Hand.tsx'
import { PhaseBar } from './PhaseBar.tsx'
import styles from './Play.module.css'
import { PlayerPanel } from './PlayerPanel.tsx'
import { PlayLog } from './PlayLog.tsx'
import { NextStepBanner } from './NextStepBanner.tsx'
import { PlayMap } from './PlayMap.tsx'
import { loadPrefs, savePrefs, type Prefs } from './prefs.ts'
import { newRun, reduceRun, undo, type Run, type RunMsg } from './run.ts'
import { chosenDice } from './targets.ts'
import { RunSummary } from './RunSummary.tsx'
import { SkillBoard } from './SkillBoard.tsx'
import { StartPanel } from './StartPanel.tsx'

/** DEV ONLY: kept for testing (designer 2026-10-09); never in a production build. */
const devTools = import.meta.env.DEV

type Msg = RunMsg | Readonly<{ kind: 'reset' }>

/** The config with the chosen Combat model (Combat v3 playtest, docs/design/combat-v3.md). */
function withCombat(config: GameConfig, model: GameConfig['combat']['model']): GameConfig {
  return { ...config, combat: { ...config.combat, model } }
}

/** How long the engagement modal steps aside after a target pick (fixed, not skippable). */
const ASIDE_MS = 1200

/** A target pick in progress on the board: the numbers to float and the line read out. */
type Aside = Readonly<{ floats: readonly DamageFloat[]; line: string; at: number }>

/**
 * What a run of actions from an engagement does to enemies: the damage numbers and the line
 * read out, from the state before each action. Null when no enemy took damage (heals, guard, a
 * Skill with no enemy): the modal stays.
 */
function asideFor(state: GameState, actions: readonly Action[], at: number): Aside | null {
  if (!state.exchange?.engage) return null
  let current = state
  const floats: DamageFloat[] = []
  const lines: string[] = []
  for (const action of actions) {
    const prev = current
    let events: readonly GameEvent[]
    try {
      ;({ state: current, events } = applyAction(prev, action))
    } catch {
      return null
    }
    floats.push(...damageFloats(prev, events))
    const line = hitLine(prev, events)
    if (line) lines.push(line)
  }
  return floats.length > 0 ? { floats, line: lines.join(' '), at } : null
}

/** The first playable card of the engagement hand, or null. */
function firstPlayable(legal: readonly Action[]): string | null {
  return legal.find((a) => a.type === 'playOption')?.card ?? null
}

/** The page holds no run until one starts (start panel) or `?seed=` starts one at once. */
function reducer(run: Run | null, msg: Msg): Run | null {
  if (msg.kind === 'reset') return null
  if (msg.kind === 'act' && !run) return null
  return reduceRun(run as Run, msg)
}

/**
 * `/play`: a run for 1-4 players on one screen. `?seed=N` (and `?players=N`) start a run at
 * once (replays, tests), `?resume` carries on with the autosave; otherwise the start panel asks. Every control is built from
 * `legalActions`; the page only passes the chosen action back to the engine.
 */
export function PlayPage() {
  const store = browserStorage()
  const [{ config, custom }] = useState(() => loadConfig(store))
  const [run, dispatch] = useReducer(reducer, null, () => {
    const params = new URLSearchParams(window.location.search)
    // `?resume`: carry on with this browser's autosaved run (the Config bar links here).
    if (params.has('resume')) return readAutosave(store)
    const seed = Number.parseInt(params.get('seed') ?? '', 10)
    const players = Number.parseInt(params.get('players') ?? '1', 10) || 1
    // `?combat=engage|exchange` picks a model for this run; otherwise the config's (phase 23).
    const asked = params.get('combat')
    const combat = asked === 'engage' || asked === 'exchange' ? asked : config.combat.model
    // DEV ONLY: kept for testing (designer 2026-10-09); never in a production build. `?dice=N`
    // starts each player with N dice, to see a crowded dice tray.
    const dice = Number.parseInt(params.get('dice') ?? '', 10)
    const base = withCombat(config, combat)
    const start =
      devTools && dice > 0 ? { ...base, player: { ...base.player, startingDice: dice } } : base
    return Number.isFinite(seed) ? newRun(start, seed, players, Date.now()) : null
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
        combat={config.combat.model}
        onStart={(players, seed, combat) =>
          dispatch({
            kind: 'new',
            config: withCombat(config, combat),
            seed,
            players,
            at: Date.now(),
          })
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
  // Dice chosen for a Skill: nothing until the player picks (no pre-selection, designer
  // 2026-10-09). Every Skill the free dice can fill shows "can fire" meanwhile.
  const [picked, setPicked] = useState<readonly number[] | null>(null)
  const main = useRef<HTMLDivElement>(null)
  const { state } = run
  const legal = legalActions(state)
  // After a target pick that damaged an enemy, the modal steps aside: the number floats off the
  // enemy on the board, and the modal comes back on its own.
  const [aside, setAside] = useState<Aside | null>(null)
  const [said, setSaid] = useState('')
  /** Several engine actions in a row (dice placed on a Skill one by one). */
  const actAll = (actions: readonly Action[]) => {
    setPicked(null)
    const at = Date.now()
    const next = asideFor(state, actions, at)
    if (next) {
      setAside(next)
      setSaid(next.line)
    }
    for (const action of actions) dispatch({ kind: 'act', action, at })
  }
  const act = (action: Action) => actAll([action])
  useEffect(() => {
    if (!aside) return
    const timer = window.setTimeout(() => setAside(null), ASIDE_MS)
    return () => window.clearTimeout(timer)
  }, [aside])
  const chosen = chosenDice(legal, picked)
  const toggle = (die: number) =>
    setPicked(chosen.includes(die) ? chosen.filter((d) => d !== die) : [...chosen, die])

  // Combat v3: the engagement runs in a modal; when it ends, the modal shows the result until
  // the player closes it. (Labels only: the summary reads the engine's events.)
  const engaged = Boolean(state.exchange?.engage)
  const [summary, setSummary] = useState<EngageSummary | null>(null)
  // Set during render (not in an effect) so the modal never unmounts between the last action
  // and its result.
  const [wasEngaged, setWasEngaged] = useState(engaged)
  if (wasEngaged !== engaged) {
    setWasEngaged(engaged)
    setSummary(engaged ? null : lastEngagement(state.log))
  }

  // The first time cards become playable in this run, the first playable card nudges toward
  // the felt once (no words). Per run: a new run mounts a new Game.
  const [nudge, setNudge] = useState<'waiting' | 'done' | string>('waiting')
  const playable = engaged ? firstPlayable(legal) : null
  if (nudge === 'waiting' && playable) setNudge(playable)
  const nudging = nudge !== 'waiting' && nudge !== 'done' ? nudge : null

  // Sound: the cues of each new action (never on load or undo: those replace the run).
  const heard = useRef(run.actions.length)
  useEffect(() => {
    const fresh = run.actions.length === heard.current + 1
    heard.current = run.actions.length
    if (fresh && prefs.sound) play(cuesFor(run.lastEvents))
  }, [run, prefs.sound])

  // Keyboard: when the focused control disappears after an action, move to the next decision
  // without scrolling the page to it.
  useEffect(() => {
    const active = document.activeElement
    if (active && active !== document.body && document.contains(active)) return
    main.current
      ?.querySelector<HTMLElement>('[data-decisions] button, [data-decisions] [role="button"]')
      ?.focus({ preventScroll: true })
  }, [run.actions.length])

  return (
    <div className={styles.page} ref={main}>
      <NextStepBanner state={state} legal={legal} act={act} />
      <PhaseBar state={state} />
      {state.phase === 'ended' ? (
        <RunSummary
          run={run}
          baseCurve={run.baseCurve}
          onNewRun={() => dispatch({ kind: 'reset' })}
        />
      ) : null}
      <DecisionDialog state={state} legal={legal} act={act} />
      {/* What a target pick did, heard while the modal steps aside (outside the dialog). */}
      <p className={styles.srOnly} role="status" data-testid="hit-line">
        {said}
      </p>
      <div className={`${styles.layout} ${styles.boardRow}`}>
        <PlayMap
          state={state}
          legal={legal}
          act={act}
          events={run.lastEvents}
          floats={aside?.floats}
          floatKey={aside?.at}
        />
        <div className={styles.side} data-decisions>
          <PlayerPanel state={state} />
        </div>
      </div>
      {engaged || summary ? (
        <EngagementModal
          state={state}
          legal={legal}
          act={act}
          actAll={actAll}
          selected={chosen}
          toggle={toggle}
          dice3d={prefs.dice3d}
          aside={Boolean(aside)}
          nudge={nudging}
          onNudged={() => setNudge('done')}
          summary={engaged ? null : summary}
          onClose={() => {
            setSummary(null)
            // Back to the board: bring the map into view (phones stack panels above it).
            document.querySelector('[aria-label="Map"]')?.scrollIntoView({ block: 'start' })
          }}
        />
      ) : null}
      {state.exchange && !engaged ? (
        <div className={`${styles.layout} ${styles.exchangeRow}`} data-decisions>
          <DiceTray
            state={state}
            legal={legal}
            act={act}
            selected={chosen}
            toggle={toggle}
            dice3d={prefs.dice3d}
          />
          <SkillBoard state={state} legal={legal} act={act} actAll={actAll} selected={chosen} />
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
        {devTools ? (
          <button
            type="button"
            data-testid="force-engagement"
            onClick={() => {
              const next = forceEngagement(run)
              if (next) dispatch({ kind: 'replace', run: next })
            }}
          >
            Force engagement (dev)
          </button>
        ) : null}
        {devTools ? (
          <button
            type="button"
            data-testid="force-elite"
            onClick={() => {
              const next = forceEliteEngagement(run)
              if (next) dispatch({ kind: 'replace', run: next })
            }}
          >
            Force elite engagement (dev)
          </button>
        ) : null}
        {devTools ? (
          <button
            type="button"
            data-testid="force-target"
            onClick={() => {
              const next = forceEngagement(run, atTarget)
              if (next) dispatch({ kind: 'replace', run: next })
            }}
          >
            Force target pick (dev)
          </button>
        ) : null}
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
