/** One credited asset, from a row of ASSETS.md. */
export type Credit = Readonly<{
  asset: string
  path: string
  source: string
  license: string
  licenseUrl: string
  attribution: string
}>

/** One font, from the fonts table of ASSETS.md. */
export type FontCredit = Readonly<{
  font: string
  role: string
  license: string
  licenseUrl: string
}>

const cells = (line: string) =>
  line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((c) => c.trim().replace(/^`|`$/g, ''))

const tableRows = (text: string) =>
  text
    .split(/\r?\n/)
    .filter((l) => l.trim().startsWith('|') && !/^\|\s*-/.test(l.trim()))
    .map(cells)

/**
 * Every asset in use, from the register tables of ASSETS.md:
 * `| Asset | Local path | Source | License | License URL | Attribution | Status | Checked |`.
 */
export function assetCredits(text: string): Credit[] {
  return tableRows(text)
    .filter((c) => c.length >= 8 && c[1]?.startsWith('assets/') && c[6] === 'in use')
    .map(
      ([asset = '', path = '', source = '', license = '', licenseUrl = '', attribution = '']) => ({
        asset,
        path,
        source,
        license,
        licenseUrl,
        attribution,
      }),
    )
}

/** An attribution split into its parts: "Broadsword icon by Lorc, game-icons.net, CC BY 3.0". */
export type Attribution = Readonly<{ work: string; author: string; site: string }>

/**
 * Splits an ASSETS.md attribution into the work, the author, and the site (the license is a
 * column of its own). Null when the text does not have that shape.
 */
export function parseAttribution(text: string): Attribution | null {
  const m = /^(.+?) by (.+?), ([^,]+)(?:, .+)?$/.exec(text.trim())
  if (!m) return null
  const [, work = '', author = '', site = ''] = m
  return { work, author, site }
}

/** The license most assets share, stated once above the list; null for an empty list. */
export function commonLicense(
  credits: readonly Credit[],
): Pick<Credit, 'license' | 'licenseUrl'> | null {
  const counts = new Map<string, number>()
  for (const c of credits) counts.set(c.license, (counts.get(c.license) ?? 0) + 1)
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  const found = credits.find((c) => c.license === top)
  return found ? { license: found.license, licenseUrl: found.licenseUrl } : null
}

/** The fonts table: `| Font | Role | License | License URL |`. */
export function fontCredits(text: string): FontCredit[] {
  const section = text.split(/^## Fonts/m)[1]?.split(/^## /m)[0] ?? ''
  return tableRows(section)
    .filter((c) => c.length === 4 && c[0] !== 'Font')
    .map(([font = '', role = '', license = '', licenseUrl = '']) => ({
      font,
      role,
      license,
      licenseUrl,
    }))
}

/** Libraries shipped to the browser (package.json dependencies), with their licenses. */
export const SOFTWARE: readonly Readonly<{ name: string; license: string; url: string }>[] = [
  { name: 'React', license: 'MIT', url: 'https://github.com/facebook/react/blob/main/LICENSE' },
  {
    name: 'three.js (3D dice)',
    license: 'MIT',
    url: 'https://github.com/mrdoob/three.js/blob/dev/LICENSE',
  },
  { name: 'Zod', license: 'MIT', url: 'https://github.com/colinhacks/zod/blob/main/LICENSE' },
]
