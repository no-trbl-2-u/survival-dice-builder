/**
 * Real wall-clock timing of a run (spec phase 7: "real timing capture"). Pure: the caller passes
 * every timestamp, so tests use a fake clock. All values are milliseconds.
 */
export type Timing = Readonly<{
  /** When the run started (or was loaded). */
  startedAt: number
  /** The last action (or the start). */
  lastAt: number
  /** Time spent deciding, by the phase the decision was in (setup, prepare, combat). */
  byPhase: Readonly<Record<string, number>>
  /** Time spent, by the decision type that ended the wait (playCard, roll, ...). */
  byDecision: Readonly<Record<string, number>>
  /** Time spent, by round. */
  byRound: Readonly<Record<string, number>>
}>

/** A new timing record starting at `at`. */
export function startTiming(at: number): Timing {
  return { startedAt: at, lastAt: at, byPhase: {}, byDecision: {}, byRound: {} }
}

const add = (r: Readonly<Record<string, number>>, key: string, ms: number) => ({
  ...r,
  [key]: (r[key] ?? 0) + ms,
})

/**
 * Adds the time since the last action to the phase, decision type, and round the player was
 * deciding in. A clock that goes backwards adds 0.
 */
export function recordGap(
  timing: Timing,
  at: number,
  phase: string,
  decision: string,
  round: number,
): Timing {
  const ms = Math.max(0, at - timing.lastAt)
  return {
    ...timing,
    lastAt: Math.max(at, timing.lastAt),
    byPhase: add(timing.byPhase, phase, ms),
    byDecision: add(timing.byDecision, decision, ms),
    byRound: add(timing.byRound, String(round), ms),
  }
}

/** The session length so far. */
export function sessionMs(timing: Timing): number {
  return timing.lastAt - timing.startedAt
}

/** Sum of a bucket record. */
export function total(r: Readonly<Record<string, number>>): number {
  return Object.values(r).reduce((a, b) => a + b, 0)
}

/**
 * Closes the open wait at `at` (export time): the time since the last action is still being
 * spent in the current phase and round, on a decision not made yet ("waiting").
 */
export function closeTiming(timing: Timing, at: number, phase: string, round: number): Timing {
  return recordGap(timing, at, phase, 'waiting', round)
}

/**
 * Moves a saved timing record to a new clock: the totals stay, and the time between saving and
 * loading is not counted.
 */
export function resumeTiming(saved: Timing | undefined, at: number): Timing {
  if (!saved) return startTiming(at)
  const spent = saved.lastAt - saved.startedAt
  return { ...saved, startedAt: at - spent, lastAt: at }
}
