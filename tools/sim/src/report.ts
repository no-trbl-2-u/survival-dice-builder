import { quantile, type Summary } from './run.ts'

/** The timing part of a real run export (apps/web `RunExport`); milliseconds. */
export type TimedExport = Readonly<{
  seed: number
  round: number
  sessionMs?: number
  timing?: Readonly<{
    byPhase: Readonly<Record<string, number>>
    byDecision: Readonly<Record<string, number>>
    byRound: Readonly<Record<string, number>>
  }>
}>

const fmt = (n: number, digits = 1) => (Number.isFinite(n) ? n.toFixed(digits) : '-')
const percent = (part: number, whole: number) =>
  whole > 0 ? `${fmt((100 * part) / whole, 0)}%` : '-'
const causes = (s: Summary) =>
  Object.entries(s.causes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k} ${v}`)
    .join(', ')

/** Markdown comparison of two bot batches (config A against config B). */
export function compareTable(
  a: Readonly<{ name: string; summary: Summary }>,
  b: Readonly<{ name: string; summary: Summary }>,
): string {
  const row = (label: string, f: (s: Summary) => string) =>
    `| ${label} | ${f(a.summary)} | ${f(b.summary)} |`
  return [
    `| | A: ${a.name} | B: ${b.name} |`,
    '| --- | --- | --- |',
    row('Runs', (s) => String(s.runs)),
    row('Errors', (s) => String(s.errors)),
    row('Stalled', (s) => String(s.stalled)),
    row('Median end round', (s) => String(s.medianEndRound)),
    row('Middle half', (s) => `${s.middleHalf[0]}-${s.middleHalf[1]}`),
    row('Range', (s) => `${s.minEndRound}-${s.maxEndRound}`),
    row('Median level', (s) => String(s.medianLevel)),
    row('Causes', causes),
    '',
    'Bot runs have no wall clock, so minutes per round come only from real run exports:',
    '`pnpm sim -- timing <export.json ...>`.',
  ].join('\n')
}

/** Adds the buckets of every export. */
function sumBuckets(
  exports: readonly TimedExport[],
  pick: (t: NonNullable<TimedExport['timing']>) => Readonly<Record<string, number>>,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const e of exports) {
    if (!e.timing) continue
    for (const [k, v] of Object.entries(pick(e.timing))) out[k] = (out[k] ?? 0) + v
  }
  return out
}

/** Minutes per round of one export: the mean over the rounds it has time for. */
export function minutesPerRound(e: TimedExport): number {
  const rounds = Object.values(e.timing?.byRound ?? {})
  if (rounds.length === 0) return Number.NaN
  return rounds.reduce((x, y) => x + y, 0) / rounds.length / 60_000
}

/** A share table: one row per key, largest first. */
function shares(title: string, buckets: Readonly<Record<string, number>>): string[] {
  const whole = Object.values(buckets).reduce((x, y) => x + y, 0)
  const rows = Object.entries(buckets)
    .sort(([, x], [, y]) => y - x)
    .map(([k, v]) => `| ${k} | ${fmt(v / 60_000)} | ${percent(v, whole)} |`)
  return [`| ${title} | Minutes | Share |`, '| --- | --- | --- |', ...rows]
}

/** Markdown timing report from real run exports. */
export function timingReport(
  files: readonly Readonly<{ name: string; data: TimedExport }>[],
): string {
  const timed = files.filter((f) => f.data.timing)
  const perRound = timed.map((f) => minutesPerRound(f.data)).filter(Number.isFinite)
  const median = quantile(
    [...perRound].sort((x, y) => x - y),
    0.5,
  )
  const exports = timed.map((f) => f.data)
  return [
    `Exports: ${files.length} (${timed.length} with timing).`,
    `Median minutes per round: ${fmt(median)}.`,
    '',
    '| File | Seed | Rounds | Session minutes | Minutes per round |',
    '| --- | --- | --- | --- | --- |',
    ...timed.map(
      (f) =>
        `| ${f.name} | ${f.data.seed} | ${f.data.round} | ${fmt((f.data.sessionMs ?? 0) / 60_000)} | ${fmt(minutesPerRound(f.data))} |`,
    ),
    '',
    ...shares(
      'Phase',
      sumBuckets(exports, (t) => t.byPhase),
    ),
    '',
    ...shares(
      'Decision',
      sumBuckets(exports, (t) => t.byDecision),
    ),
    '',
    'Time while the tab is hidden still counts, under the phase it happened in.',
  ].join('\n')
}
