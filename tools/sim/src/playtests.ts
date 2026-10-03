import { minutesPerRound, timingReport, type TimedExport } from './report.ts'
import { quantile } from './run.ts'

/** A run export from `/play` (apps/web `RunExport`), as far as the playtest report needs it. */
export type PlaytestExport = TimedExport &
  Readonly<{
    players?: number
    endedBecause?: 'base' | 'player' | null
    milestones?: readonly string[]
  }>

/** The spec's simulator estimate: "about 8 to 9 minutes per round at a normal table". */
export const ESTIMATE_BAND = [8, 9] as const

/** Playtest numbers for the report. Minute figures use only exports that have timing. */
export type PlaytestSummary = Readonly<{
  sessions: number
  timed: number
  byPlayers: Readonly<Record<string, number>>
  causes: Readonly<Record<string, number>>
  medianEndRound: number
  medianSessionMinutes: number
  medianMinutesPerRound: number
  /** Real median minutes per round divided by the estimate. */
  ratio: number
  estimate: number
}>

const median = (xs: readonly number[]) =>
  quantile(
    [...xs].sort((a, b) => a - b),
    0.5,
  )
const count = (keys: readonly string[]) =>
  keys.reduce<Record<string, number>>((acc, k) => ({ ...acc, [k]: (acc[k] ?? 0) + 1 }), {})

/** Summarizes the playtest exports against the minutes-per-round estimate. */
export function summarizePlaytests(
  runs: readonly PlaytestExport[],
  estimate = 8.5,
): PlaytestSummary {
  const timed = runs.filter((r) => r.timing && typeof r.sessionMs === 'number')
  const perRound = timed.map(minutesPerRound).filter(Number.isFinite)
  const mpr = median(perRound)
  return {
    sessions: runs.length,
    timed: timed.length,
    byPlayers: count(runs.map((r) => `${r.players ?? 1}p`)),
    causes: count(runs.map((r) => r.endedBecause ?? 'unfinished')),
    medianEndRound: median(runs.map((r) => r.round)),
    medianSessionMinutes: median(timed.map((r) => (r.sessionMs ?? 0) / 60_000)),
    medianMinutesPerRound: mpr,
    ratio: mpr / estimate,
    estimate,
  }
}

const fmt = (n: number, digits = 1) => (Number.isFinite(n) ? n.toFixed(digits) : '-')
const list = (r: Readonly<Record<string, number>>) =>
  Object.entries(r)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k} ${v}`)
    .join(', ') || '-'

/** Where the real minutes per round sit against the 8-9 band. */
export function verdict(minutes: number): string {
  if (!Number.isFinite(minutes)) return 'no timed sessions yet'
  const [low, high] = ESTIMATE_BAND
  if (minutes < low) return `faster than the estimate (below ${low})`
  if (minutes > high) return `slower than the estimate (above ${high})`
  return `on the estimate (${low}-${high})`
}

/** The markdown for REPORT.md's numbers section. */
export function playtestReport(
  files: readonly Readonly<{ name: string; data: PlaytestExport }>[],
  estimate = 8.5,
): string {
  if (files.length === 0) {
    return 'No sessions yet: save run files from /play into docs/playtests/runs/ (see PROTOCOL.md).'
  }
  const s = summarizePlaytests(
    files.map((f) => f.data),
    estimate,
  )
  return [
    '| Measure | Value |',
    '| --- | --- |',
    `| Sessions (with timing) | ${s.sessions} (${s.timed}) |`,
    `| By player count | ${list(s.byPlayers)} |`,
    `| End cause | ${list(s.causes)} |`,
    `| Median end round | ${s.medianEndRound} |`,
    `| Median session minutes | ${fmt(s.medianSessionMinutes)} |`,
    `| Median minutes per round | ${fmt(s.medianMinutesPerRound)} |`,
    `| Against the estimate (${s.estimate} min) | ${fmt(s.ratio, 2)}x: ${verdict(s.medianMinutesPerRound)} |`,
    '',
    '| File | Players | Rounds | End | Minutes | Minutes per round |',
    '| --- | --- | --- | --- | --- | --- |',
    ...files.map(
      ({ name, data: d }) =>
        `| ${name} | ${d.players ?? 1} | ${d.round} | ${d.endedBecause ?? 'unfinished'} | ${d.sessionMs === undefined ? '-' : fmt(d.sessionMs / 60_000)} | ${fmt(minutesPerRound(d))} |`,
    ),
    '',
    '## Where the time went',
    '',
    timingReport(files),
  ].join('\n')
}
