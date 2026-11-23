import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { createGame } from '../api/createGame.ts'
import type { GameEvent } from '../events/events.ts'
import { withLog } from './helpers.ts'
import { LOG_LIMIT } from './types.ts'

/** A numbered event, so a test can tell which events the log kept. */
const event = (round: number): GameEvent => ({
  type: 'phaseStarted',
  rule: '5.1',
  phase: 'prepare',
  round,
})

describe('withLog', () => {
  it('returns the same state when there are no events', () => {
    const s = createGame(defaultContent.config, 1)
    expect(withLog(s, [])).toBe(s)
  })

  it('keeps the last LOG_LIMIT events, oldest dropped first, in order', () => {
    const s = createGame(defaultContent.config, 1)
    const full = { ...s, log: Array.from({ length: LOG_LIMIT - 1 }, (_, i) => event(i)) }
    const log = full.log

    const next = withLog(full, [event(LOG_LIMIT - 1), event(LOG_LIMIT), event(LOG_LIMIT + 1)])

    expect(next.log).toHaveLength(LOG_LIMIT)
    expect(next.log[0]).toEqual(event(2))
    expect(next.log.at(-1)).toEqual(event(LOG_LIMIT + 1))
    expect(next.log.map((e) => (e.type === 'phaseStarted' ? e.round : -1))).toEqual(
      Array.from({ length: LOG_LIMIT }, (_, i) => i + 2),
    )
    expect(full.log).toBe(log)
    expect(full.log).toHaveLength(LOG_LIMIT - 1)
  })
})
