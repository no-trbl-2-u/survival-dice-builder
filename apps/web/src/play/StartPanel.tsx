import { useState, type ChangeEvent } from 'react'
import { defaultConfigMeta } from '@survival/content'
import type { KeyValue } from '../config/configStore.ts'
import { importRun, readAutosave } from './exportRun.ts'
import styles from './Play.module.css'
import type { Run } from './run.ts'

/** Which Combat a new run plays: Spec v1 exchanges, or the Combat v3 playtest. */
export type CombatModel = 'exchange' | 'engage'

/** The Combat choice names, shared with /config. */
const COMBAT_LABEL = defaultConfigMeta['combat.model']?.options ?? {}

/** One line per Combat choice: how a Combat plays under it. */
const COMBAT_HINT: Record<CombatModel, string> = {
  engage:
    "The designer's playtest Combat. Play Engage to roll from where you stand; each enemy next to you rolls a die back. Cards you did not play stay in your hand; Combat ends when every hand and deck is empty. Enemies hit structures at the end of Combat.",
  exchange:
    'The Combat in the written rules. In each exchange you roll, play cards, and fire Skills; then every enemy next to you attacks.',
}

type Props = Readonly<{
  custom: boolean
  store: KeyValue | undefined
  /** The config's Combat model: the select starts there. */
  combat: CombatModel
  onStart: (players: number, seed: number, combat: CombatModel) => void
  onLoad: (run: Run) => void
}>

/** Before a run: player count, seed, config status, load a file, or resume the autosave. */
export function StartPanel({ custom, store, combat: configCombat, onStart, onLoad }: Props) {
  const [players, setPlayers] = useState(1)
  const [combat, setCombat] = useState<CombatModel>(configCombat)
  const [seed, setSeed] = useState(() => String(Date.now() % 100000))
  const [error, setError] = useState<string | null>(null)
  const [saved] = useState(() => readAutosave(store))
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
          <select
            value={combat}
            onChange={(e) => setCombat(e.target.value as CombatModel)}
            aria-describedby="combat-hint"
          >
            <option value="engage">{COMBAT_LABEL.engage ?? 'engage'}</option>
            <option value="exchange">{COMBAT_LABEL.exchange ?? 'exchange'}</option>
          </select>
        </label>
        <button type="submit" className={styles.primary}>
          Start run
        </button>
      </form>
      <p id="seed-hint" className={styles.muted}>
        The same seed and the same choices give the same game.
      </p>
      <p id="combat-hint" className={styles.muted}>
        Combat: {COMBAT_HINT[combat]}
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
