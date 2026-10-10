import { canFire, enemiesInRange, type Action, type GameState } from '@survival/engine'
import { faceIcon } from '../icons/gameIcons.ts'
import { GameIcon } from '../icons/GameIcon.tsx'
import { skillText } from './effectText.ts'
import styles from './Play.module.css'
import { firstOf, fitsNoSkill, ofType, planPlacement } from './targets.ts'

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
 * of range it fires and hits nothing. When the chosen dice fit no Skill together, a line
 * above the list says so and asks the player to unselect a die. A Skill with more slots than
 * the player has dice says how many it needs (in Combat, the dice rolled so far).
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
  const diceHeld = ex ? ex.dice.length : p.dice
  return (
    <section className={styles.panel} aria-label="Skills">
      <h2 className={styles.panelTitle}>Skills</h2>
      {placing && fitsNoSkill(state, selected) ? (
        <p className={styles.noFit} role="status">
          These dice fit no Skill together. Unselect a die.
        </p>
      ) : null}
      <ul className={styles.skills}>
        {p.skills.map((id, si) => {
          const skill = state.content.skills.find((s) => s.id === id)
          if (!skill) return null
          // A Skill can fire more than once (18.1 unlimited): show the use being filled now, which
          // is the one the engine offers dice for, after any full ones.
          const onSkill = ex?.assignments.filter((a) => a.skill === id) ?? []
          const uses = [...new Set(onSkill.map((a) => a.use))].sort((a, b) => a - b)
          const full = (use: number) =>
            onSkill.filter((a) => a.use === use).length === skill.faces.length
          const timesFired = uses.filter(full).length
          const open = ofType(legal, 'assignDie').find((a) => a.skill === id)?.use
          const shown = uses.find((u) => !full(u)) ?? open ?? uses.at(-1) ?? 0
          const mine = onSkill.filter((a) => a.use === shown)
          const fires = full(shown) && mine.length > 0
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
                const firedText = ex?.engage ? 'fired' : 'fires'
                const status = (
                  <>
                    {timesFired > 0 ? (
                      <span className={styles.skillState} data-state="fired">
                        {timesFired > 1 ? `${firedText} ×${timesFired}` : firedText}
                      </span>
                    ) : null}
                    {could && placing ? (
                      <span className={styles.skillState} data-state="could">
                        {timesFired > 0 ? 'can fire again' : 'can fire'}
                      </span>
                    ) : null}
                  </>
                )
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
              {skill.faces.length > diceHeld ? (
                <NeedsDice needed={skill.faces.length} held={diceHeld} />
              ) : null}
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

/**
 * A Skill with more slots than the player has dice: how many it needs, and how to get more.
 * Phones (760px and narrower) show the short form, screen readers always hear the long one.
 */
function NeedsDice({ needed, held }: Readonly<{ needed: number; held: number }>) {
  return (
    <span className={styles.needsDice}>
      <span className={styles.reachLong}>
        Needs {needed} dice, you have {held}. A level up or a card that adds a die gives you more.
      </span>
      <span className={styles.reachShort} aria-hidden="true">
        needs {needed} dice
      </span>
    </span>
  )
}

/**
 * How many enemies an attack Skill can reach from the figure now; phones (760px and narrower)
 * show a short form ("2 in range", "none in range"), screen readers always hear the long one.
 */
function InReach({ count }: Readonly<{ count: number }>) {
  return count === 0 ? (
    <span className={styles.outOfRange}>
      <span className={styles.reachLong}>No enemy in range: it would hit nothing</span>
      <span className={styles.reachShort} aria-hidden="true">
        none in range
      </span>
    </span>
  ) : (
    <span className={styles.inRange}>
      <span className={styles.reachLong}>
        {count} {count === 1 ? 'enemy' : 'enemies'} in range
      </span>
      <span className={styles.reachShort} aria-hidden="true">
        {count} in range
      </span>
    </span>
  )
}
