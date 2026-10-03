import { defaultContent } from '@survival/content'
import { legalActions, type Action } from '@survival/engine'
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { TileView } from '../tiles/TileView.tsx'
import { BasePanel } from './BasePanel.tsx'
import { DecisionDialog } from './DecisionDialog.tsx'
import { PlayLog } from './PlayLog.tsx'
import { RunSummary } from './RunSummary.tsx'
import { Choices } from './Choices.tsx'
import { DiceTray } from './DiceTray.tsx'
import { Hand } from './Hand.tsx'
import { PhaseBar } from './PhaseBar.tsx'
import styles from './Play.module.css'
import { PlayerPanel } from './PlayerPanel.tsx'
import { PlayMap } from './PlayMap.tsx'
import { newRun, runReducer } from './run.ts'
import { SkillBoard } from './SkillBoard.tsx'

const config = defaultContent.config

/** `?seed=N` in the URL fixes the seed (replays, tests); otherwise a time-based seed. */
function initialSeed(): number {
  const fromUrl = Number.parseInt(new URLSearchParams(window.location.search).get('seed') ?? '', 10)
  return Number.isFinite(fromUrl) ? fromUrl : Date.now() % 100000
}

/**
 * `/play`: a solo run. Every control is built from `legalActions`; the page only passes the
 * chosen action back to the engine.
 */
export function PlayPage() {
  const reducer = useMemo(() => runReducer(config), [])
  const [run, dispatch] = useReducer(reducer, undefined, () => newRun(config, initialSeed()))
  const [selected, setSelected] = useState<number | null>(null)
  const main = useRef<HTMLDivElement>(null)
  const legal = legalActions(run.state)
  const act = (action: Action) => {
    setSelected(null)
    dispatch({ kind: 'act', action })
  }
  const { state } = run
  const revealed = state.content.tiles.find((t) => t.id === state.revealed[0])

  // Keyboard: when the focused control disappears after an action, move to the next decision.
  useEffect(() => {
    const active = document.activeElement
    if (active && active !== document.body && document.contains(active)) return
    main.current
      ?.querySelector<HTMLElement>('[data-decisions] button, [data-decisions] [role="button"]')
      ?.focus()
  }, [run.actions.length])
  const startNext = () => dispatch({ kind: 'new', seed: (run.seed * 7919 + 1) % 100000 })
  const step = state.exchange
    ? `${state.exchange.skirmish ? 'Skirmish' : 'Exchange'}: ${state.exchange.step}`
    : `${state.phase}${state.active ? `: ${state.active.kind}` : ''}`
  return (
    <div className={styles.page} ref={main}>
      <p className="visually-hidden" aria-live="polite">
        Round {state.round}, {step}
      </p>
      <PhaseBar state={state} />
      {state.phase === 'ended' ? (
        <RunSummary run={run} baseCurve={run.baseCurve} onNewRun={startNext} />
      ) : null}
      <DecisionDialog state={state} legal={legal} act={act} />
      <div className={styles.layout}>
        <PlayMap state={state} legal={legal} act={act} />
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
        <div className={styles.layout} data-decisions>
          <DiceTray
            state={state}
            legal={legal}
            act={act}
            selected={selected}
            select={setSelected}
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
      <div data-decisions>
        <Hand state={state} legal={legal} act={act} />
      </div>
      <div className={styles.layout}>
        <BasePanel state={state} legal={legal} act={act} />
        <PlayLog state={state} />
      </div>
      <p className={styles.footer}>
        Seed {run.seed} · {run.actions.length} actions ·{' '}
        <button type="button" onClick={startNext}>
          New run
        </button>
      </p>
    </div>
  )
}
