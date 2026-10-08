import type { ReactNode } from 'react'

/** Where a repository file can be read on the web: its page on GitHub, main branch. */
export const repoFileUrl = (path: string) =>
  `https://github.com/no-trbl-2-u/survival-dice-builder/blob/main/${path}`

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

/** The element id of an open reading on /decisions. */
export const rowId = (n: number) => `q-${n}`

/**
 * Links each "row N" in plain text: to the reading on this page when it is listed, else to
 * `OPEN-QUESTIONS.md` on GitHub, where every row (settled ones too) is kept.
 */
function rowRefs(text: string, rows: ReadonlySet<number>, key: number): ReactNode[] {
  return text.split(/(\brow \d+\b)/).map((part, i) => {
    const n = /^row (\d+)$/.exec(part)?.[1]
    if (!n) return part
    const href = rows.has(Number(n)) ? `#${rowId(Number(n))}` : repoFileUrl('OPEN-QUESTIONS.md')
    return (
      <a key={`${key}-${i}`} href={href}>
        {part}
      </a>
    )
  })
}

/**
 * Renders the inline markdown the plan files use: **bold** and `code`. Everything else is text.
 * A `code` span that names a repository document links to it on GitHub. With `rows`, each
 * "row N" links to that reading (see `rowRefs`).
 *
 * @param text - one cell or line of markdown.
 * @param rows - the row numbers listed on the page.
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
