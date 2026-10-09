import { canFire, enemiesInRange, type Action, type GameState } from '@survival/engine'
import { faceIcon } from '../icons/gameIcons.ts'
import { GameIcon } from '../icons/GameIcon.tsx'
import { skillText } from './effectText.ts'
import styles from './Play.module.css'
import { firstOf, ofType, planPlacement } from './targets.ts'

type Props = Readonly<{
  state: GameState
  legal: readonly Action[]
  act: (a: Action) => void
  /** Several engine actions in a row: the chosen dice placed on 1 Skill. */
  actAll: (actions: readonly Action[]) => void
  /** The dice chosen in the tray. */
  selected: readonly number[]
  /** Show the confirm / finish button (off when the engagement modal puts it in its footer). */
  confirmButton?: boolean
}>

/**
 * The Skill board, each Skill as "Name: glyph glyph". During placement, every Skill all the
 * chosen dice fit together is a button that puts them on it (`planPlacement`: the engine's
 * own placements, 1 die at a time); a filled slot takes its die back. "Fires" = every slot is filled; "can fire" = the free dice could
 * fill it (engine `canFire`). An attack Skill says how many enemies are in its range now: out
 * of range it fires and hits nothing.
 */
export function SkillBoard({ state, legal, act, actAll, selected, confirmButton = true }: Props) {
  const p = state.players[state.current]
  if (!p) return null
  const ex = state.exchange
  const placing = ex?.step === 'assign'
  const unassign = ofType(legal, 'unassignDie')
  const confirm = firstOf(legal, 'confirmAssignment')
  const placed = new Set(ex?.assignments.map((a) => a.die) ?? [])
  const freeFaces = ex ? ex.dice.filter((_, i) => !placed.has(i)).map((d) => d.face) : []
  return (
    <section className={styles.panel} aria-label="Skills">
      <h2 className={styles.panelTitle}>Skills</h2>
      <ul className={styles.skills}>
        {p.skills.map((id, si) => {
          const skill = state.content.skills.find((s) => s.id === id)
          if (!skill) return null
          const mine = ex?.assignments.filter((a) => a.skill === id && a.use === 0) ?? []
          const fires = mine.length === skill.faces.length
          const could = !fires && canFire([...freeFaces, ...mine.map((a) => a.asFace)], skill.faces)
          return (
            <li
              key={`${id}-${si}`}
              className={`${styles.skill} ${fires ? styles.fires : ''} ${could && placing && selected.length === 0 ? styles.could : ''}`}
            >
              {(() => {
                const plan = placing ? planPlacement(state, id, selected) : null
                const filling = new Map(plan?.map((a) => [a.slot, a]) ?? [])
                const slots = skill.faces.map((face, slot) => {
                  const here = mine.find((a) => a.slot === slot)
                  const incoming = filling.get(slot)
                  const back = !plan && here && unassign.find((u) => u.die === here.die)
                  if (back) {
                    const name = `Die ${here.die + 1} (${here.asFace}) — take back`
                    return (
                      <button
                        key={slot}
                        type="button"
                        className={styles.slotFilled}
                        aria-label={name}
                        title={name}
                        onClick={() => act(back)}
                      >
                        <GameIcon name={faceIcon(here.asFace)} />
                      </button>
                    )
                  }
                  const name = here ? `Die ${here.die + 1} (${here.asFace})` : face
                  return (
                    <span
                      key={slot}
                      role="img"
                      aria-label={name}
                      title={name}
                      className={here ? styles.slotFilled : incoming ? styles.slotFit : styles.slot}
                    >
                      <GameIcon name={faceIcon(here ? here.asFace : face)} />
                    </span>
                  )
                })
                const status = fires ? (
                  <span className={styles.skillState} data-state="fired">
                    {ex?.engage ? 'fired' : 'fires'}
                  </span>
                ) : could && placing ? (
                  <span className={styles.skillState} data-state="could">
                    can fire
                  </span>
                ) : null
                if (plan) {
                  const dice = plan.map((a) => a.die + 1)
                  const name = `Put ${dice.length === 1 ? 'die' : 'dice'} ${dice.join(', ')} on ${skill.name}`
                  return (
                    <button
                      type="button"
                      className={`${styles.skillHead} ${styles.skillPick}`}
                      aria-label={name}
                      title={name}
                      onClick={() => actAll(plan)}
                    >
                      <span className={styles.skillName}>{skill.name}:</span>
                      <span className={styles.slots}>{slots}</span>
                      {status}
                    </button>
                  )
                }
                return (
                  <div className={styles.skillHead}>
                    <span className={styles.skillName}>{skill.name}:</span>
                    <span className={styles.slots}>{slots}</span>
                    {status}
                  </div>
                )
              })()}
              <span className={styles.muted}>{skillText(skill.effect)}</span>
              {skill.effect.kind === 'damage' ? (
                <InReach count={enemiesInRange(state, skill.effect.range).length} />
              ) : null}
            </li>
          )
        })}
      </ul>
      {confirm && confirmButton ? (
        <button type="button" className={styles.primary} onClick={() => act(confirm)}>
          {ex?.engage ? 'Finish engagement' : 'Confirm dice and fire Skills'}
        </button>
      ) : null}
    </section>
  )
}

/** How many enemies an attack Skill can reach from the figure now. */
function InReach({ count }: Readonly<{ count: number }>) {
  return count === 0 ? (
    <span className={styles.outOfRange}>No enemy in range: it would hit nothing</span>
  ) : (
    <span className={styles.inRange}>
      {count} {count === 1 ? 'enemy' : 'enemies'} in range
    </span>
  )
}
