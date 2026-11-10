import register from '../../../../ASSETS.md?raw'
import { GameIcon } from '../icons/GameIcon.tsx'
import { gameIcons } from '../icons/gameIcons.ts'
import styles from './CreditsPage.module.css'
import {
  assetCredits,
  commonLicense,
  creditGroups,
  fontCredits,
  licenseLinkText,
  parseAttribution,
  SOFTWARE,
  type Credit,
} from './credits.ts'

/** The icon name of an asset path (`assets/icons/dice/sword.svg` -> `face-sword`). */
function iconFor(path: string): string | null {
  const m = /assets\/icons\/(dice|game)\/(.+)\.svg$/.exec(path)
  if (!m) return null
  const name = m[1] === 'dice' ? `face-${m[2]}` : (m[2] ?? '')
  return gameIcons[name] ? name : null
}

/** An in-house asset: drawn for this game, so it needs no attribution. */
function inHouse(c: Credit): boolean {
  return c.attribution === 'none required'
}

/**
 * One credit line: the work's name links to its source, the author and site follow, and the
 * license (linked) is stated once. Every link name is unique, so a links list reads well.
 */
function CreditLine({ credit: a, shared }: Readonly<{ credit: Credit; shared: string | null }>) {
  const parts = parseAttribution(a.attribution)
  const work = parts?.work ?? a.asset
  // The shared license is stated once above the list; only a different one is named here.
  const own =
    a.license === shared ? null : a.licenseUrl.startsWith('http') ? (
      <a href={a.licenseUrl}>{a.license}</a>
    ) : (
      a.license
    )
  const license = own ? <> ({own})</> : null
  return (
    <span>
      <strong>{a.asset}</strong>:{' '}
      {/* An in-house asset needs no license note: "drawn for this game" already says whose it is. */}
      {inHouse(a) ? (
        <>drawn for this game</>
      ) : (
        <>
          {a.source.startsWith('http') ? <a href={a.source}>{work}</a> : work}
          {parts ? ` by ${parts.author}, ${parts.site}` : ''}
          {license}
        </>
      )}
    </span>
  )
}

/** One register section: the shared license stated once, then a line per asset. */
function CreditList({
  credits,
  noun,
  testId,
}: Readonly<{ credits: readonly Credit[]; noun: string; testId: string }>) {
  const shared = commonLicense(credits)
  const all = shared !== null && credits.every((c) => c.license === shared.license)
  // In-house lines name no license, so the intro excludes them in words rather than leaving
  // "unless a line says otherwise" to cover them.
  const own = credits.some(inHouse)
  const othersShare =
    shared !== null && credits.every((c) => inHouse(c) || c.license === shared.license)
  const lead = all
    ? `Every ${noun} is under `
    : own
      ? `${othersShare ? 'Every' : 'Unless a line says otherwise, every'} ${noun} by a named artist is under `
      : `Unless a line says otherwise, every ${noun} is under `
  return (
    <>
      {shared ? (
        <p>
          {lead}
          <a href={shared.licenseUrl}>{shared.license}</a>
          {own && !all ? `; the ${noun}s drawn for this game are not` : ''}. Each name links to its
          source.
        </p>
      ) : null}
      <ul className={styles.list} data-testid={testId}>
        {credits.map((a) => {
          const icon = iconFor(a.path)
          return (
            <li key={a.path}>
              {icon ? <GameIcon name={icon} size="1.5rem" /> : null}
              <CreditLine credit={a} shared={shared?.license ?? null} />
            </li>
          )
        })}
      </ul>
    </>
  )
}

/** Where a visitor reports a missing or wrong credit. */
const ISSUES_URL = 'https://github.com/no-trbl-2-u/survival-dice-builder/issues'

/** `/credits`: every asset in use, generated from ASSETS.md at build time. */
export function CreditsPage() {
  const { icons, textures } = creditGroups(assetCredits(register))
  const fonts = fontCredits(register)
  return (
    <div className={styles.page}>
      <p>
        Every asset in the game, with its license. If a credit is missing or wrong,{' '}
        <a href={ISSUES_URL}>open an issue</a> (on GitHub).
      </p>
      <h2>Icons</h2>
      <CreditList credits={icons} noun="icon" testId="credits-assets" />
      <h2>Textures</h2>
      <CreditList credits={textures} noun="texture" testId="credits-textures" />
      <h2>Fonts</h2>
      <ul className={styles.list} data-testid="credits-fonts">
        {fonts.map((f) => (
          <li key={f.font}>
            <span>
              <a href={f.source}>
                <strong>{f.font}</strong>
              </a>{' '}
              ({f.role}): <a href={f.licenseUrl}>{licenseLinkText(f.font, f.license)}</a>
            </span>
          </li>
        ))}
      </ul>
      <h2>Software</h2>
      <ul className={styles.list} data-testid="credits-software">
        {SOFTWARE.map((s) => (
          <li key={s.name}>
            <span>
              <a href={s.source}>
                <strong>{s.name}</strong>
              </a>{' '}
              ({s.role}): <a href={s.url}>{licenseLinkText(s.name, s.license)}</a>
            </span>
          </li>
        ))}
      </ul>
      <h2>Sound</h2>
      <p>Every sound is synthesized in the browser; there are no sound files.</p>
    </div>
  )
}
