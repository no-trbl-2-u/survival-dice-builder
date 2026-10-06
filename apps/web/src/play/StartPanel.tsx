import { useState, type ChangeEvent } from 'react'
import type { KeyValue } from '../config/configStore.ts'
import { AUTOSAVE_KEY } from '../config/configStore.ts'
import { importRun } from './exportRun.ts'
import styles from './Play.module.css'
import type { Run } from './run.ts'

/** Which Combat a new run plays: Spec v1 exchanges, or the Combat v3 playtest. */
export type CombatModel = 'exchange' | 'engage'

type Props = Readonly<{
  custom: boolean
  store: KeyValue | undefined
  onStart: (players: number, seed: number, combat: CombatModel) => void
  onLoad: (run: Run) => void
}>

/** Reads the autosave, if a valid one exists. */
function autosaved(store: KeyValue | undefined): Run | null {
  try {
    const raw = store?.getItem(AUTOSAVE_KEY)
    if (!raw) return null
    const loaded = importRun(raw, Date.now())
    return 'run' in loaded ? loaded.run : null
  } catch {
    return null
  }
}

/** Before a run: player count, seed, config status, load a file, or resume the autosave. */
export function StartPanel({ custom, store, onStart, onLoad }: Props) {
  const [players, setPlayers] = useState(1)
  const [combat, setCombat] = useState<CombatModel>('engage')
  const [seed, setSeed] = useState(() => String(Date.now() % 100000))
  const [error, setError] = useState<string | null>(null)
  const [saved] = useState(() => autosaved(store))
  const load = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = importRun(await file.text(), Date.now())
    if ('error' in result) setError(result.error)
    else onLoad(result.run)
  }
  return (
    <section className={styles.panel} aria-labelledby="start-title" data-testid="start-panel">
      <h2 id="start-title" className={styles.panelTitle}>
        New run
      </h2>
      <p>
        Keep the base standing for as many rounds as you can. A player at 0 health is knocked out
        and comes back next round.
      </p>
      <form
        className={styles.startForm}
        onSubmit={(e) => {
          e.preventDefault()
          onStart(players, Number.parseInt(seed, 10) || 0, combat)
        }}
      >
        <label>
          Players{' '}
          <select value={players} onChange={(e) => setPlayers(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Seed{' '}
          <input
            inputMode="numeric"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            aria-describedby="seed-hint"
          />
        </label>
        <label>
          Combat{' '}
          <select value={combat} onChange={(e) => setCombat(e.target.value as CombatModel)}>
            <option value="engage">Engagements (Combat v3 playtest)</option>
            <option value="exchange">Exchanges (Spec v1)</option>
          </select>
        </label>
        <button type="submit" className={styles.primary}>
          Start run
        </button>
      </form>
      <p id="seed-hint" className={styles.muted}>
        The same seed and the same choices give the same game.
      </p>
      <p className={styles.muted}>
        Config: {custom ? 'custom (changed on the Config page)' : 'default rules'}.{' '}
        <a href="/config">Change the config</a>
      </p>
      {saved ? (
        <p>
          <button type="button" onClick={() => onLoad(saved)}>
            Resume saved run (round {saved.state.round}, {saved.players}{' '}
            {saved.players === 1 ? 'player' : 'players'})
          </button>{' '}
          <span className={styles.muted}>Saved in this browser only.</span>
        </p>
      ) : null}
      <label className={styles.fileLabel}>
        Load a run file <input type="file" accept="application/json,.json" onChange={load} />
      </label>
      {error ? (
        <p role="alert" className={styles.health}>
          {error}
        </p>
      ) : null}
    </section>
  )
}
