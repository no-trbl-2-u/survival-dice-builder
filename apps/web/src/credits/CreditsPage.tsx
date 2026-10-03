import register from '../../../../ASSETS.md?raw'
import { GameIcon } from '../icons/GameIcon.tsx'
import { gameIcons } from '../icons/gameIcons.ts'
import styles from './CreditsPage.module.css'
import { assetCredits, fontCredits, SOFTWARE } from './credits.ts'

/** The icon name of an asset path (`assets/icons/dice/sword.svg` -> `face-sword`). */
function iconFor(path: string): string | null {
  const m = /assets\/icons\/(dice|game)\/(.+)\.svg$/.exec(path)
  if (!m) return null
  const name = m[1] === 'dice' ? `face-${m[2]}` : (m[2] ?? '')
  return gameIcons[name] ? name : null
}

/** `/credits`: every asset in use, generated from ASSETS.md at build time. */
export function CreditsPage() {
  const assets = assetCredits(register)
  const fonts = fontCredits(register)
  return (
    <div className={styles.page}>
      <p>Every asset in the game, with its license. Generated from the project's asset register.</p>
      <h2>Icons</h2>
      <ul className={styles.list} data-testid="credits-assets">
        {assets.map((a) => {
          const icon = iconFor(a.path)
          return (
            <li key={a.path}>
              {icon ? <GameIcon name={icon} size="1.5rem" /> : null}
              <span>
                <strong>{a.asset}</strong>:{' '}
                {a.attribution === 'none required' ? 'drawn for this game' : a.attribution}.{' '}
                {a.source.startsWith('http') ? <a href={a.source}>Source</a> : null}
                {a.licenseUrl.startsWith('http') ? (
                  <>
                    {' · '}
                    <a href={a.licenseUrl}>{a.license}</a>
                  </>
                ) : (
                  ` · ${a.license}`
                )}
              </span>
            </li>
          )
        })}
      </ul>
      <h2>Fonts</h2>
      <ul className={styles.list}>
        {fonts.map((f) => (
          <li key={f.font}>
            <span>
              <strong>{f.font}</strong> ({f.role}): <a href={f.licenseUrl}>{f.license}</a>
            </span>
          </li>
        ))}
      </ul>
      <h2>Software</h2>
      <ul className={styles.list}>
        {SOFTWARE.map((s) => (
          <li key={s.name}>
            <span>
              <strong>{s.name}</strong>: <a href={s.url}>{s.license}</a>
            </span>
          </li>
        ))}
      </ul>
      <h2>Sound</h2>
      <p>Every sound is synthesized in the browser; there are no sound files.</p>
    </div>
  )
}
