import { canFire, enemiesInRange, type Action, type GameState } from '@survival/engine'
import { faceIcon } from '../icons/gameIcons.ts'
import { GameIcon } from '../icons/GameIcon.tsx'
import { skillText } from './effectText.ts'
import styles from './Play.module.css'
import { firstOf, ofType, placementsFor } from './targets.ts'

type Props = Readonly<{
  state: GameState
  legal: readonly Action[]
  act: (a: Action) => void
  selected: number | null
  select: (die: number | null) => void
}>

/**
 * The Skill board. During placement, the slots the selected die fits are buttons; a filled
 * slot takes its die back. "Fires" = every slot is filled; "can fire" = the free dice could
 * fill it (engine `canFire`). An attack Skill says how many enemies are in its range now: out
 * of range it fires and hits nothing.
 */
export function SkillBoard({ state, legal, act, selected, select }: Props) {
  const p = state.players[state.current]
  if (!p) return null
  const ex = state.exchange
  const placing = ex?.step === 'assign'
  const fits = selected === null ? [] : placementsFor(legal, selected)
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
              className={`${styles.skill} ${fires ? styles.fires : ''} ${could && placing ? styles.could : ''}`}
            >
              <span className={styles.skillName}>
                {skill.name}
                {fires ? ' — fires' : could && placing ? ' — can fire' : ''}
              </span>
              <span className={styles.muted}>{skillText(skill.effect)}</span>
              {skill.effect.kind === 'damage' ? (
                <InReach count={enemiesInRange(state, skill.effect.range).length} />
              ) : null}
              <span className={styles.slots}>
                {skill.faces.map((face, slot) => {
                  const here = mine.find((a) => a.slot === slot)
                  const fit = fits.find((a) => a.skill === id && a.slot === slot && a.use === 0)
                  const back = here && unassign.find((u) => u.die === here.die)
                  if (back) {
                    return (
                      <button
                        key={slot}
                        type="button"
                        className={styles.slotFilled}
                        onClick={() => act(back)}
                      >
                        Die {here.die + 1} ({here.asFace}) — take back
                      </button>
                    )
                  }
                  if (fit) {
                    return (
                      <button
                        key={slot}
                        type="button"
                        className={styles.slotFit}
                        onClick={() => {
                          act(fit)
                          select(null)
                        }}
                      >
                        Put die {fit.die + 1} on {face}
                      </button>
                    )
                  }
                  return (
                    <span key={slot} className={styles.slot}>
                      <GameIcon name={faceIcon(here ? here.asFace : face)} />{' '}
                      {here ? `Die ${here.die + 1}` : face}
                    </span>
                  )
                })}
              </span>
            </li>
          )
        })}
      </ul>
      {confirm ? (
        <button type="button" className={styles.primary} onClick={() => act(confirm)}>
          Confirm dice and fire Skills
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
