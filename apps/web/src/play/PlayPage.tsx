import { defaultContent } from '@survival/content'
import { legalActions, type Action } from '@survival/engine'
import { useMemo, useReducer, useState } from 'react'
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
  const legal = legalActions(run.state)
  const act = (action: Action) => {
    setSelected(null)
    dispatch({ kind: 'act', action })
  }
  return (
    <div className={styles.page}>
      <PhaseBar state={run.state} />
      <div className={styles.layout}>
        <PlayMap state={run.state} legal={legal} act={act} />
        <div className={styles.side}>
          <Choices state={run.state} legal={legal} act={act} />
          <PlayerPanel state={run.state} />
        </div>
      </div>
      {run.state.exchange ? (
        <div className={styles.layout}>
          <DiceTray
            state={run.state}
            legal={legal}
            act={act}
            selected={selected}
            select={setSelected}
          />
          <SkillBoard
            state={run.state}
            legal={legal}
            act={act}
            selected={selected}
            select={setSelected}
          />
        </div>
      ) : null}
      <Hand state={run.state} legal={legal} act={act} />
      <p className={styles.footer}>
        Seed {run.seed} · {run.actions.length} actions ·{' '}
        <button
          type="button"
          onClick={() => dispatch({ kind: 'new', seed: (run.seed * 7919 + 1) % 100000 })}
        >
          New run
        </button>
      </p>
    </div>
  )
}
