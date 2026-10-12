import { quantile, upkeepPerCombat, type Summary } from './run.ts'

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

/** A number with `digits` decimals, or `-` when there is none (NaN). */
const fmt = (n: number, digits = 1) => (Number.isFinite(n) ? n.toFixed(digits) : '-')
const percent = (part: number, whole: number) =>
  whole > 0 ? `${fmt((100 * part) / whole, 0)}%` : '-'
const causes = (s: Summary) =>
  Object.entries(s.causes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k} ${v}`)
    .join(', ')

/** A compared batch: its name and summary. */
export type Side = Readonly<{ name: string; summary: Summary }>

/**
 * Markdown comparison of 2 or more bot batches (configs or policies), a column each (A, B, C,
 * ...), with play totals and table upkeep per Combat (phase 38).
 */
export function compareTable(sides: readonly Side[]): string {
  const row = (label: string, f: (s: Summary) => string) =>
    `| ${label} | ${sides.map((side) => f(side.summary)).join(' | ')} |`
  const letter = (i: number) => String.fromCharCode(65 + i)
  return [
    `| | ${sides.map((side, i) => `${letter(i)}: ${side.name}`).join(' | ')} |`,
    `| --- | ${sides.map(() => '---').join(' | ')} |`,
    row('Runs', (s) => String(s.runs)),
    row('Errors', (s) => String(s.errors)),
    row('Stalled', (s) => String(s.stalled)),
    row('Median end round', (s) => String(s.medianEndRound)),
    row('Middle half', (s) => `${s.middleHalf[0]}-${s.middleHalf[1]}`),
    row('Range', (s) => `${s.minEndRound}-${s.maxEndRound}`),
    row('Median level', (s) => String(s.medianLevel)),
    row('Median level at round 3 / 6 / 9', (s) =>
      [s.levelAt['3'], s.levelAt['6'], s.levelAt['9']].map((n) => fmt(n, 0)).join(' / '),
    ),
    row('Runs that reach the miniature limit', (s) => `${s.capReached} of ${s.runs}`),
    row('Median round the limit is first reached', (s) => fmt(s.medianCapRound, 0)),
    row('Causes', causes),
    row('Enemy hits taken (all runs)', (s) => String(s.totals.hits)),
    row('Enemy dice cancelled', (s) => String(s.totals.cancelled)),
    row('Health lost', (s) => String(s.totals.healthLost)),
    row('Knock-outs', (s) => String(s.totals.knockouts)),
    row('Enemies defeated', (s) => String(s.totals.enemiesDefeated)),
    row('Defenses built', (s) => String(s.totals.defensesBuilt)),
    row('Health repaired', (s) => String(s.totals.repaired)),
    row('Upgrades bought', (s) => String(s.totals.upgradesBought)),
    row('Placements per Combat', (s) => fmt(upkeepPerCombat(s.totals).placements, 2)),
    row('Spill-overs per Combat', (s) => fmt(upkeepPerCombat(s.totals).spillOvers, 2)),
    row('Promotions per Combat', (s) => fmt(upkeepPerCombat(s.totals).promotions, 2)),
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
