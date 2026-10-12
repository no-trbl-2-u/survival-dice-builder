import type { BotPolicy } from '@survival/bot'
import { parseValue } from './optionSets.ts'
import { upkeepPerCombat, type Summary } from './run.ts'

/** One `--set key=a,b,c`: a dotted config path and the values to try. */
export type SweepSet = Readonly<{ path: string; values: readonly unknown[] }>

/** One batch of a sweep: a value per set, the seats, and the bot policy. */
export type SweepCell = Readonly<{
  values: readonly Readonly<{ path: string; value: unknown }>[]
  seats: number
  policy: BotPolicy
}>

/** Reads `key=a,b,c`. Throws when the key or the values are missing. */
export function parseSet(text: string): SweepSet {
  const eq = text.indexOf('=')
  const path = eq > 0 ? text.slice(0, eq).trim() : ''
  const values = eq > 0 ? text.slice(eq + 1).split(',') : []
  if (!path || values.length === 0 || values.some((v) => v.trim() === ''))
    throw new Error(`--set must be key=a,b,c (got "${text}")`)
  return { path, values: values.map((v) => parseValue(v.trim())) }
}

/**
 * Every combination, in table order: the first set's values vary slowest, then the next sets,
 * then seats, then policy.
 */
export function sweepCells(
  sets: readonly SweepSet[],
  seats: readonly number[],
  policies: readonly BotPolicy[],
): SweepCell[] {
  const combos = sets.reduce<SweepCell['values'][]>(
    (acc, set) =>
      acc.flatMap((combo) => set.values.map((value) => [...combo, { path: set.path, value }])),
    [[]],
  )
  return combos.flatMap((values) =>
    seats.flatMap((s) => policies.map((policy) => ({ values, seats: s, policy }))),
  )
}

const fmt = (n: number, digits: number) => (Number.isFinite(n) ? n.toFixed(digits) : '-')

/** One markdown table, a row per sweep batch: end rounds, play totals, upkeep per Combat. */
export function sweepTable(
  base: string,
  rows: readonly Readonly<{ cell: SweepCell; summary: Summary }>[],
): string {
  const paths = rows[0]?.cell.values.map((v) => v.path) ?? []
  const header = [
    ...paths.map((p) => `\`${p}\``),
    'Seats',
    'Bot',
    'Runs',
    'Median end round',
    'Middle half',
    'Stalled',
    'Errors',
    'Hits taken',
    'Health lost',
    'Knock-outs',
    'Dice cancelled',
    'Placements per Combat',
    'Spill-overs per Combat',
    'Promotions per Combat',
  ]
  const line = (cells: readonly string[]) => `| ${cells.join(' | ')} |`
  return [
    `Sweep over ${base}; every count is the total over the batch's runs.`,
    '',
    line(header),
    line(header.map(() => '---')),
    ...rows.map(({ cell, summary: s }) => {
      const upkeep = upkeepPerCombat(s.totals)
      return line([
        ...cell.values.map((v) => JSON.stringify(v.value)),
        String(cell.seats),
        cell.policy,
        String(s.runs),
        String(s.medianEndRound),
        `${s.middleHalf[0]}-${s.middleHalf[1]}`,
        String(s.stalled),
        String(s.errors),
        String(s.totals.hits),
        String(s.totals.healthLost),
        String(s.totals.knockouts),
        String(s.totals.cancelled),
        fmt(upkeep.placements, 2),
        fmt(upkeep.spillOvers, 2),
        fmt(upkeep.promotions, 2),
      ])
    }),
  ].join('\n')
}
