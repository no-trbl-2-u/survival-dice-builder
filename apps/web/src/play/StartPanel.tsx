import { useState, type ChangeEvent } from 'react'
import {
  combatText,
  defaultConfigMeta,
  defaultContent,
  goalText,
  knockoutText,
  siegeText,
  type GameConfig,
} from '@survival/content'
import { ConfigChanges } from '../config/ConfigChanges.tsx'
import { resetConfig, type KeyValue } from '../config/configStore.ts'
import { importRun, readAutosave } from './exportRun.ts'
import styles from './Play.module.css'
import type { Run } from './run.ts'

/** Which Combat a new run plays: engagements (Spec v2), or the older exchanges kept for playtests. */
export type CombatModel = 'exchange' | 'engage'

/** The Combat choice names, shared with /config. */
const COMBAT_LABEL = defaultConfigMeta['combat.model']?.options ?? {}

/** The lead of each Combat choice's line. */
const COMBAT_LEAD: Record<CombatModel, string> = {
  engage: 'Engagements:',
  exchange: 'The older Combat, kept for playtests.',
}

/** One line per Combat choice: how a Combat plays under it in this config, from `ruleText`. */
function combatHint(config: GameConfig, combat: CombatModel): string {
  return `${COMBAT_LEAD[combat]} ${combatText(config, combat, defaultContent)} ${siegeText(defaultContent)}`
}

/** Every player count the config allows, fewest first. */
function playerCounts(config: GameConfig): number[] {
  const { min, max } = config.players
  return Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => min + i)
}

type Props = Readonly<{
  /** The config new runs use, and the fields where it differs from the standard rules. */
  config: GameConfig
  changes: readonly string[]
  updated: readonly string[]
  store: KeyValue | undefined
  /** The config's Combat model: the select starts there. */
  combat: CombatModel
  onStart: (players: number, seed: number, combat: CombatModel) => void
  onLoad: (run: Run) => void
}>

/** Before a run: player count, seed, config status, load a file, or resume the autosave. */
export function StartPanel({
  config,
  changes,
  updated,
  store,
  combat: configCombat,
  onStart,
  onLoad,
}: Props) {
  const [players, setPlayers] = useState(config.players.min)
  const [combat, setCombat] = useState<CombatModel>(configCombat)
  const [seed, setSeed] = useState(() => String(Date.now() % 100000))
  const [error, setError] = useState<string | null>(null)
  const [saved] = useState(() => readAutosave(store))
  // The reset asks first, as on /config.
  const [confirming, setConfirming] = useState(false)
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
        {goalText()} {knockoutText(config)}
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
            {playerCounts(config).map((n) => (
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
        {combatHint(config, combat)}
      </p>
      <div className={styles.muted}>
        <ConfigChanges config={config} changes={changes} updated={updated} reviewHref="/config" />
        {changes.length === 0 ? (
          <a href="/config">Change the config</a>
        ) : confirming ? (
          <span role="group" aria-label="Reset to defaults?">
            Reset every value to the default?{' '}
            <button
              type="button"
              onClick={() => {
                resetConfig(store)
                window.location.assign('/play')
              }}
            >
              Yes, reset every value
            </button>{' '}
            <button type="button" onClick={() => setConfirming(false)}>
              Keep my values
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)}>
            Reset to defaults
          </button>
        )}
      </div>
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
