import { experienceForNextLevel, type GameState } from '@survival/engine'
import { faceIcon } from '../icons/gameIcons.ts'
import { GameIcon } from '../icons/GameIcon.tsx'
import { skillText } from './effectText.ts'
import styles from './Play.module.css'

type Props = Readonly<{ state: GameState }>

/** The display name of a seat: "You" in a solo run, "Player N" in co-op. */
export function seatName(state: GameState, seat: number): string {
  return state.players.length === 1 ? 'You' : `Player ${seat + 1}`
}

/** Whose turn's things these are: "Your" in a solo run, "Player N's" in co-op. */
export function whose(state: GameState): string {
  return state.players.length === 1 ? 'Your' : `${seatName(state, state.current)}'s`
}

/**
 * Every player's tracks (the current player first in bold, marked "turn"), the shared level,
 * and the base, as numbers with labels (never a bar alone). All hands are open (16.3). The
 * experience shows a next-level target only when experience can still raise the level (18.1,
 * row 17), named as the total that reaches it ("level 3 at 9", 8.5); at a maximum level the
 * level says so. Under the tracks, each player's Skills as a read-only list (name, the dice
 * faces it needs, its effect with its range), so a player sees how far a Skill reaches before
 * choosing where to engage, in every phase, not only once the dice are rolled (7.8, 16.3).
 */
export function PlayerPanel({ state }: Props) {
  const next = experienceForNextLevel(state.level, state.config)
  const top = state.config.options.maxLevel !== null && state.level >= state.config.options.maxLevel
  return (
    <section className={styles.panel} aria-label="Players">
      <h2 className={styles.panelTitle}>
        {state.players.length === 1 ? 'You' : 'Players'} ·{' '}
        <span key={state.level} className={state.level > 1 ? styles.levelUp : undefined}>
          level {state.level}
          {top ? ' (maximum)' : ''}
        </span>{' '}
        · <GameIcon name="experience" /> experience {state.experience}
        {next === null ? '' : ` (level ${state.level + 1} at ${next})`} · base {state.base.health} /{' '}
        {state.base.maxHealth}
      </h2>
      <div data-testid="player-panel" className={styles.playerList}>
        {state.players.map((p, seat) => {
          const current = seat === state.current
          const rows: [string, string, string, string][] = [
            [
              'Health',
              p.knockedOut ? 'Knocked out' : `${p.health} / ${p.maxHealth}`,
              styles.health ?? '',
              'health',
            ],
            ['Guard', String(p.guard), styles.guard ?? '', 'guard'],
            ['Action dice', String(p.dice), '', 'face-star'],
            ['Materials', String(p.materials), styles.materials ?? '', 'materials'],
            ['Currency', String(p.currency), styles.currency ?? '', 'currency'],
          ]
          return (
            <div
              key={p.id}
              className={`${styles.playerCard} ${current ? styles.currentPlayer : ''}`}
              aria-current={current && state.players.length > 1 ? 'true' : undefined}
            >
              {state.players.length > 1 ? (
                <h3 className={styles.subTitle}>
                  {seatName(state, seat)}
                  {current ? ' — turn' : ''} · hand {p.hand.length} · deck {p.deck.length}
                </h3>
              ) : null}
              <dl className={styles.stats}>
                {rows.map(([label, value, cls, icon]) => (
                  <div key={label} className={styles.stat}>
                    <dt>
                      <GameIcon name={icon} className={cls} /> {label}
                    </dt>
                    <dd className={cls}>{value}</dd>
                  </div>
                ))}
              </dl>
              <OwnSkills state={state} skills={p.skills} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** A player's Skills, read-only: "Name: glyphs · effect within N hexes" (7.8). */
function OwnSkills({ state, skills }: Readonly<{ state: GameState; skills: readonly string[] }>) {
  const list = skills.flatMap((id) => state.content.skills.find((s) => s.id === id) ?? [])
  if (list.length === 0) return null
  return (
    <div className={styles.ownSkills}>
      <span className={styles.ownSkillsLabel}>Skills</span>
      <ul className={styles.ownSkillList}>
        {list.map((skill, i) => (
          <li key={`${skill.id}-${i}`}>
            <span className={styles.skillName}>{skill.name}:</span>{' '}
            <span className={styles.slots}>
              {skill.faces.map((face, slot) => (
                <span key={slot} role="img" aria-label={face} title={face} className={styles.slot}>
                  <GameIcon name={faceIcon(face)} />
                </span>
              ))}
            </span>{' '}
            <span className={styles.muted}>
              {skillText(skill.effect, state.config.combat.model)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
