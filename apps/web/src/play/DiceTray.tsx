import { sameAction, type Action, type EnemyDieRoll, type GameState } from '@survival/engine'
import { lazy, Suspense } from 'react'
import { faceIcon } from '../icons/gameIcons.ts'
import { GameIcon } from '../icons/GameIcon.tsx'
import styles from './Play.module.css'
import { firstOf, placementsFor } from './targets.ts'

/** The word under an enemy die (the glyph carries the face; the word confirms it). */
const ENEMY_FACE_LABEL = { hit: 'Hit', miss: 'Miss', special: 'Special' } as const

/** Loaded only when 3D dice are on: three.js stays out of the main bundle. */
const Dice3D = lazy(() => import('../dice3d/Dice3D.tsx'))

type Props = Readonly<{
  state: GameState
  legal: readonly Action[]
  act: (a: Action) => void
  /** The dice chosen for a Skill (any number of them). */
  selected: readonly number[]
  toggle: (die: number) => void
  /** Show the optional 3D dice above the 2D tray (presentation only). */
  dice3d?: boolean
  /** Show the enemy dice above the player's (off when the engagement modal shows them). */
  enemyDice?: boolean
  /** Show the roll / stop buttons (off when the engagement modal puts them in its footer). */
  controls?: boolean
  /** Only the dice (no panel, title, or felt): the engagement modal puts them on its own felt. */
  bare?: boolean
}>

/**
 * The exchange dice: keep toggles while rolling, rerolls from cards, and Select/Unselect for
 * Skill placement (any number of dice; the Skill board puts them all on 1 Skill). A die on a
 * Skill leaves the tray. The roll counter shows `roll n of max`.
 */
export function DiceTray({
  state,
  legal,
  act,
  selected,
  toggle,
  dice3d = false,
  enemyDice = true,
  controls = true,
  bare = false,
}: Props) {
  const ex = state.exchange
  if (!ex) return null
  const has = (a: Action) => legal.find((x) => sameAction(x, a))
  const placed = new Set(ex.assignments.map((a) => a.die))
  const roll = firstOf(legal, 'roll')
  const stop = firstOf(legal, 'stopRolling')
  const endReroll = firstOf(legal, 'endReroll')
  const dice3dView =
    dice3d && ex.rollsUsed > 0 ? (
      <Suspense fallback={<p className={styles.muted}>Loading 3D dice…</p>}>
        <Dice3D
          faces={ex.dice.map((d) => d.face)}
          kept={ex.dice.map((d) => d.kept)}
          roll={ex.rollsUsed * 100 + ex.rerollsLeft}
        />
      </Suspense>
    ) : null
  const allPlaced = ex.dice.length > 0 && ex.dice.every((_, i) => placed.has(i))
  const items = ex.dice.map((d, i) => {
    if (placed.has(i)) return null
    const keep = has({ type: 'toggleKeep', die: i })
    const reroll = has({ type: 'rerollDie', die: i })
    const canPlace = ex.step === 'assign' && placementsFor(legal, i).length > 0
    const isSelected = selected.includes(i)
    return (
      <li key={i} className={styles.dieItem}>
        <span
          className={`${styles.die} ${d.kept ? styles.kept : ''} ${isSelected ? styles.selected : ''}`}
          aria-label={`Die ${i + 1}: ${d.face}${d.kept ? ', kept' : ''}`}
        >
          <GameIcon name={faceIcon(d.face)} size="1.6rem" />
          <small>{d.face}</small>
        </span>
        {keep ? (
          <button type="button" onClick={() => act(keep)}>
            {d.kept ? 'Release' : 'Keep'} die {i + 1}
          </button>
        ) : null}
        {reroll ? (
          <button type="button" onClick={() => act(reroll)}>
            Reroll die {i + 1}
          </button>
        ) : null}
        {canPlace ? (
          <button
            type="button"
            aria-pressed={isSelected}
            aria-label={`${isSelected ? 'Unselect' : 'Select'} die ${i + 1}`}
            onClick={() => toggle(i)}
          >
            {isSelected ? 'Unselect' : 'Select'}
          </button>
        ) : null}
      </li>
    )
  })
  if (bare) {
    return (
      <>
        {dice3dView}
        <ul className={styles.engageDiceList} aria-label="Your dice">
          {items}
        </ul>
        {allPlaced ? <p className={styles.engageFeltNote}>All your dice are on Skills.</p> : null}
      </>
    )
  }
  return (
    <section className={styles.panel} aria-label="Dice">
      <h2 className={styles.panelTitle}>
        Dice — roll {ex.rollsUsed} of {state.config.combat.maxRolls}
        {ex.step === 'reroll' ? ` · rerolls left ${ex.rerollsLeft}` : ''}
      </h2>
      {dice3dView}
      {ex.engage && enemyDice ? (
        <>
          <EnemyDice state={state} />
          <h3 className={styles.subTitle}>Your dice</h3>
        </>
      ) : null}
      <ul className={styles.dice}>{items}</ul>
      {allPlaced ? <p className={styles.muted}>All your dice are on Skills.</p> : null}
      {controls ? (
        <div className={styles.row}>
          {stop ? (
            <button type="button" onClick={() => act(stop)}>
              Stop rolling
            </button>
          ) : null}
          {roll ? (
            <button type="button" onClick={() => act(roll)}>
              Roll unkept dice
            </button>
          ) : null}
          {endReroll ? (
            <button type="button" onClick={() => act(endReroll)}>
              Stop rerolling
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

/**
 * The enemy dice of an engagement: black dice rolled once by the engaged enemy and every enemy
 * next to the player. Locked: they hit after the player's Skills.
 */
export function EnemyDice({
  state,
  heading = true,
  rolls,
  bare = false,
}: Readonly<{
  state: GameState
  heading?: boolean
  rolls?: readonly EnemyDieRoll[]
  /** Only the dice, no felt: the engagement modal puts them on its own felt. */
  bare?: boolean
}>) {
  const dice = rolls ?? state.exchange?.engage?.enemyDice
  if (!dice) return null
  const cfg = state.config.combat.engage
  const damage = { hit: cfg.hitDamage, special: cfg.specialDamage, miss: 0 }
  return (
    <div data-testid="enemy-dice" className={bare ? styles.engageDiceGroup : undefined}>
      {heading ? (
        <h3 className={styles.subTitle}>
          {dice.length === 0
            ? 'Enemy dice: none (no enemy next to you)'
            : 'Enemy dice from adjacent enemies (locked: they hit you after your Skills)'}
        </h3>
      ) : null}
      <ul
        className={bare ? styles.engageDiceList : styles.dice}
        aria-label={bare ? 'Enemy dice' : undefined}
      >
        {dice.map((d, i) => {
          const kind = enemyKindOf(state, d.enemy)
          const elite = kind === 'elite'
          const who = `${kind ?? 'enemy'} ${d.enemy}`
          return (
            <li key={i} className={styles.dieItem}>
              <span
                className={`${styles.die} ${styles.enemyDie} ${elite ? styles.enemyElite : ''}`}
                data-face={d.face}
                data-kind={elite ? 'elite' : 'grunt'}
                aria-label={`Enemy die of ${who}: ${d.face}`}
              >
                <GameIcon name={`face-enemy-${d.face}`} size="2.4rem" />
              </span>
              <span className={styles.enemyDieLabel} aria-hidden="true">
                <strong>
                  {ENEMY_FACE_LABEL[d.face]}
                  {damage[d.face] > 0 ? `: ${damage[d.face]} dmg` : ''}
                </strong>
                <small>{who}</small>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** An enemy's kind: on the map now, or (defeated) from the event that put it there. */
export function enemyKindOf(state: GameState, id: string): string | undefined {
  const live = state.enemies.find((e) => e.id === id)?.kind
  if (live) return live
  for (const e of state.log) {
    if (e.type === 'enemySpawned' && e.enemy === id) return e.kind
    if (e.type === 'eliteReplaced' && e.elite === id) return 'elite'
  }
  return undefined
}
