import { defaultContent } from '@survival/content'
import { describe, expect, it } from 'vitest'
import { engagedWithElite, forceEliteEngagement } from './devEngage.ts'
import { newRun } from './run.ts'

describe('dev tools (kept for testing, designer 2026-10-09)', () => {
  it('Force elite engagement: an engagement with at least 1 elite die', () => {
    const run = forceEliteEngagement(newRun(defaultContent.config, 5))
    expect(run).not.toBeNull()
    expect(engagedWithElite(run!.state)).toBe(true)
    const dice = run!.state.exchange?.engage?.enemyDice ?? []
    expect(
      dice.some((d) => run!.state.enemies.find((e) => e.id === d.enemy)?.kind === 'elite'),
    ).toBe(true)
  })

  it('engagedWithElite is false outside an engagement', () => {
    expect(engagedWithElite(newRun(defaultContent.config, 5).state)).toBe(false)
  })
})
