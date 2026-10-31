import type { ReactNode } from 'react'

/** Where a repository file can be read on the web: its page on GitHub, main branch. */
export const repoFileUrl = (path: string) =>
  `https://github.com/no-trbl-2-u/survival-dice-builder/blob/main/${path}`

/** The written rules (Spec v1) on GitHub: what a cited rules section points into. */
export const rulesUrl = repoFileUrl('spec/01-spec-v2-rules.md')

/**
 * A `code` span that names a repository document by its full path
 * (`docs/reports/phase-22-experiments.md`). A bare name such as `PROTOCOL.md` is relative to a
 * folder named beside it, so it stays plain code.
 */
const REPO_FILE = /^[\w.-]+\/[\w./-]+\.(md|csv|html)$/

/** A repository file name in code type, linked to its page on GitHub. */
export function RepoFile({ path }: Readonly<{ path: string }>) {
  return (
    <a href={repoFileUrl(path)}>
      <code>{path}</code>
    </a>
  )
}

/** The element id of a reading on /decisions (open, or decided recently). */
export const rowId = (n: number) => `q-${n}`

/** A row reference: "row 7", or a plural list such as "rows 65 and 69", "rows 26, 28", "rows 63-70". */
const ROW_REF = /(\brow \d+\b|\brows \d+(?:(?:, | and |-)\d+)*\b)/

/**
 * Links each row number in plain text ("row N", and each number after "rows"): to the reading
 * on this page when it is listed, else to `OPEN-QUESTIONS.md` on GitHub, where every row
 * (settled ones too) is kept.
 */
function rowRefs(text: string, rows: ReadonlySet<number>, key: number): ReactNode[] {
  const link = (n: number, label: string, k: string) => (
    <a key={k} href={rows.has(n) ? `#${rowId(n)}` : repoFileUrl('OPEN-QUESTIONS.md')}>
      {label}
    </a>
  )
  return text.split(ROW_REF).flatMap((part, i): ReactNode[] => {
    const single = /^row (\d+)$/.exec(part)?.[1]
    if (single) return [link(Number(single), part, `${key}-${i}`)]
    if (!/^rows \d/.test(part)) return [part]
    // A list: "rows " stays text and each number links to its own reading.
    return part
      .split(/(\d+)/)
      .map((bit, j) => (/^\d+$/.test(bit) ? link(Number(bit), bit, `${key}-${i}-${j}`) : bit))
  })
}

/**
 * Renders the inline markdown the plan files use: **bold** and `code`. Everything else is text.
 * A `code` span that names a repository document links to it on GitHub. With `rows`, each
 * "row N" links to that reading (see `rowRefs`).
 *
 * @param text - one cell or line of markdown.
 * @param rows - the row numbers that have a reading on the page.
 */
export function Inline({ text, rows }: Readonly<{ text: string; rows?: ReadonlySet<number> }>) {
  const parts: ReactNode[] = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const code = part.slice(1, -1)
      return REPO_FILE.test(code) ? <RepoFile key={i} path={code} /> : <code key={i}>{code}</code>
    }
    return rows ? rowRefs(part, rows, i) : part
  })
  return <>{parts}</>
}
