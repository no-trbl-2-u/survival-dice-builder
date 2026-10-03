import type { RunResult, Summary } from './run.ts'

/** CSV columns, in order. Lists are joined with `|`. */
export const CSV_COLUMNS = [
  'seed',
  'endRound',
  'cause',
  'baseHealth',
  'level',
  'actions',
  'skills',
  'milestones',
  'baseCurve',
  'enemyCurve',
  'error',
] as const

/** Quotes a CSV field when it holds a comma, quote, or line break. */
export function csvField(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

/** One CSV line per run, with a header. */
export function toCsv(results: readonly RunResult[]): string {
  const rows = results.map((r) =>
    [
      String(r.seed),
      String(r.endRound),
      r.cause,
      String(r.baseHealth),
      String(r.level),
      String(r.actions),
      r.skills.join('|'),
      r.milestones.join('|'),
      r.baseCurve.join('|'),
      r.enemyCurve.join('|'),
      r.error ?? '',
    ]
      .map(csvField)
      .join(','),
  )
  return [CSV_COLUMNS.join(','), ...rows].join('\n') + '\n'
}

/** The batch as JSON: the summary and every run. */
export function toJson(summary: Summary, results: readonly RunResult[]): string {
  return JSON.stringify({ summary, runs: results }, null, 2) + '\n'
}

/** A short human summary for the terminal. */
export function describe(summary: Summary, band: readonly [number, number]): string {
  const [low, high] = band
  const inBand = summary.medianEndRound >= low && summary.medianEndRound <= high
  return [
    `runs ${summary.runs}, errors ${summary.errors}, stalled ${summary.stalled}`,
    `end round: median ${summary.medianEndRound}, middle half ${summary.middleHalf[0]}-${summary.middleHalf[1]}, range ${summary.minEndRound}-${summary.maxEndRound}`,
    `causes: ${JSON.stringify(summary.causes)}`,
    `median level ${summary.medianLevel}; milestones: ${JSON.stringify(summary.milestones)}`,
    `target band ${low}-${high}: ${inBand ? 'inside' : 'OUTSIDE'}`,
  ].join('\n')
}
