/**
 * Parses `RULES-COVERAGE.md` and checks each row's test citations against the test files.
 * Pure: the caller reads the files and passes their text in.
 */

/** One citation in a row's Test(s) cell: a test file and the titles quoted after it. */
export interface Citation {
  /** Backticked path as written, or null when titles come before any path. */
  file: string | null
  titles: string[]
}

export interface CoverageRow {
  rule: string
  tests: string
  citations: Citation[]
  /** True when the Test(s) cell marks the rule superseded instead of citing a test. */
  superseded: boolean
}

export interface CitationProblem {
  rule: string
  problem: string
}

const QUOTED = /"((?:[^"\\]|\\.)*)"/g
const PATH = /`([^`]+\.test\.tsx?)`/g

/** Splits a markdown table row into cells, keeping escaped pipes. */
function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split(/(?<!\\)\|/)
    .map((c) => c.trim())
}

/** Reads the citations of one Test(s) cell in order: each path owns the titles after it. */
export function parseCitations(cell: string): Citation[] {
  const marks: { at: number; kind: 'file' | 'title'; text: string }[] = []
  for (const m of cell.matchAll(PATH)) marks.push({ at: m.index, kind: 'file', text: m[1] ?? '' })
  // Titles are quoted outside backticks only.
  const unticked = cell.replace(/`[^`]*`/g, (s) => ' '.repeat(s.length))
  for (const m of unticked.matchAll(QUOTED)) {
    marks.push({ at: m.index, kind: 'title', text: (m[1] ?? '').replace(/\\"/g, '"') })
  }
  marks.sort((a, b) => a.at - b.at)
  const out: Citation[] = []
  let current: Citation | null = null
  for (const mark of marks) {
    if (mark.kind === 'file') {
      current = { file: mark.text, titles: [] }
      out.push(current)
    } else {
      if (!current) {
        current = { file: null, titles: [] }
        out.push(current)
      }
      current.titles.push(mark.text)
    }
  }
  return out
}

/** Every table row of the coverage file except the header and divider. */
export function parseCoverage(text: string): CoverageRow[] {
  return text
    .split(/\r?\n/)
    .filter((l) => l.startsWith('|') && !/^\|\s*-/.test(l) && !/^\|\s*Rule\s*\|/.test(l))
    .map((line) => {
      const [rule = '', , tests = ''] = cells(line)
      return {
        rule,
        tests,
        citations: parseCitations(tests),
        superseded: /\bsuperseded by\b/i.test(tests),
      }
    })
}

/** The searchable fragments of a quoted title: "..." marks a cut, so each piece must appear. */
export function titleFragments(title: string): string[] {
  return title
    .split(/\.\.\.|…/)
    .map((f) => f.trim())
    .filter((f) => f.length >= 4)
}

/**
 * Checks every citation. `files` maps repo-relative test paths (forward slashes) to their text.
 * A cited path matches any test file whose path ends with it. A title must have each fragment
 * in one test file: the cited one, or any test file when the cell gives no path first.
 */
export function checkCoverage(rows: CoverageRow[], files: Map<string, string>): CitationProblem[] {
  const problems: CitationProblem[] = []
  const paths = [...files.keys()]
  for (const row of rows) {
    if (
      row.citations.length === 0 &&
      !row.superseded &&
      !/schema validation only/.test(row.tests)
    ) {
      problems.push({ rule: row.rule, problem: 'cites no test and is not marked superseded' })
    }
    for (const c of row.citations) {
      let scope = paths
      if (c.file) {
        const file = c.file
        scope = paths.filter((p) => p === file || p.endsWith(`/${file}`))
        if (scope.length === 0) {
          problems.push({ rule: row.rule, problem: `no test file ${c.file}` })
          continue
        }
      }
      for (const title of c.titles) {
        const fragments = titleFragments(title)
        if (fragments.length === 0) continue
        const found = scope.some((p) => {
          const body = files.get(p) ?? ''
          return fragments.every((f) => body.includes(f))
        })
        if (!found) {
          problems.push({
            rule: row.rule,
            problem: `no test titled "${title}"${c.file ? ` in ${c.file}` : ''}`,
          })
        }
      }
    }
  }
  return problems
}
