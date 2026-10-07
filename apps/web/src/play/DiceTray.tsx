import { sameAction, type Action, type GameState } from '@survival/engine'
import { lazy, Suspense } from 'react'
import { faceIcon } from '../icons/gameIcons.ts'
import { GameIcon } from '../icons/GameIcon.tsx'
import { enemyFaceText } from './effectText.ts'
import styles from './Play.module.css'
import { firstOf, placementsFor } from './targets.ts'

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
}>

/**
 * The exchange dice: keep toggles while rolling, rerolls from cards, and Select/Unselect for
 * Skill placement (any number of dice; the Skill board puts them all on 1 Skill). A die on a
 * Skill leaves the tray. The roll counter shows `roll n of max`.
 */
export function DiceTray({ state, legal, act, selected, toggle, dice3d = false }: Props) {
  const ex = state.exchange
  if (!ex) return null
  const has = (a: Action) => legal.find((x) => sameAction(x, a))
  const placed = new Set(ex.assignments.map((a) => a.die))
  const roll = firstOf(legal, 'roll')
  const stop = firstOf(legal, 'stopRolling')
  const endReroll = firstOf(legal, 'endReroll')
  return (
    <section className={styles.panel} aria-label="Dice">
      <h2 className={styles.panelTitle}>
        Dice — roll {ex.rollsUsed} of {state.config.combat.maxRolls}
        {ex.step === 'reroll' ? ` · rerolls left ${ex.rerollsLeft}` : ''}
      </h2>
      {dice3d && ex.rollsUsed > 0 ? (
        <Suspense fallback={<p className={styles.muted}>Loading 3D dice…</p>}>
          <Dice3D
            faces={ex.dice.map((d) => d.face)}
            kept={ex.dice.map((d) => d.kept)}
            roll={ex.rollsUsed * 100 + ex.rerollsLeft}
          />
        </Suspense>
      ) : null}
      {ex.engage ? (
        <div data-testid="enemy-dice">
          <h3 className={styles.subTitle}>
            {ex.engage.enemyDice.length === 0
              ? 'Enemy dice: none (no enemy next to you)'
              : `Enemy dice from adjacent enemies (locked: they hit you after your Skills; a Hit deals ${state.config.combat.engage.hitDamage} damage, a Special ${state.config.combat.engage.specialDamage})`}
          </h3>
          <ul className={styles.dice}>
            {ex.engage.enemyDice.map((d, i) => {
              const enemy = state.enemies.find((e) => e.id === d.enemy)
              const who = `${enemy?.kind ?? 'enemy'} ${d.enemy}`
              const face = enemyFaceText(d.face, state.config.combat.engage)
              return (
                <li key={i} className={styles.dieItem}>
                  <span
                    className={`${styles.die} ${styles.enemyDie} ${d.face === 'miss' ? '' : styles.enemyHit}`}
                    aria-label={`Enemy die of ${who}: ${d.face}, ${face.damage} damage`}
                  >
                    <strong>{face.label}</strong>
                    <small>{who}</small>
                  </span>
                </li>
              )
            })}
          </ul>
          <h3 className={styles.subTitle}>Your dice</h3>
        </div>
      ) : null}
      <ul className={styles.dice}>
        {ex.dice.map((d, i) => {
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
        })}
      </ul>
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
    </section>
  )
}
