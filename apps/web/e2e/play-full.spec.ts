import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'

/**
 * Plays a whole seeded run through the UI only. The order of preference is a simple, weak
 * policy; buying is skipped. Each step clicks the first visible button that matches.
 */
const PREFERENCES: readonly RegExp[] = [
  /^Draft /,
  /^Replace /,
  /^Return /,
  /^Place /,
  /^Tower /,
  /^Step off the map edge/,
  /^Move to [^:]+$/,
  /^Stop moving$/,
  /^Stop building$/,
  /^Stop rolling$/,
  /^Stop rerolling$/,
  /^Play /,
  /^Put die /,
  /^Select die /,
  /^Confirm dice and fire Skills$/,
  /^Target /,
  /^Discard /,
]

async function step(page: Page): Promise<boolean> {
  for (const name of PREFERENCES) {
    const button = page.getByRole('button', { name }).first()
    if ((await button.count()) > 0 && (await button.isVisible())) {
      await button.click()
      return true
    }
  }
  return false
}

test('/play: a full seeded solo run to the summary, then a replayable export', async ({ page }) => {
  test.setTimeout(240_000)
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/play?seed=5')
  const summary = page.getByTestId('run-summary')
  for (let i = 0; i < 3000 && (await summary.count()) === 0; i++) {
    const moved = await step(page)
    expect(moved, 'no control to press').toBe(true)
  }
  await expect(summary).toBeVisible()
  await expect(summary).toContainText(/The base fell in round \d+/)
  await expect(page.getByTestId('play-log')).toContainText('The run ends.')

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download run (JSON)' }).click()
  const file = await (await download).path()
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
  expect(data.seed).toBe(5)
  expect(data.actions.length).toBeGreaterThan(50)
  // Real timing: the phase buckets sum to the session length (within 5%).
  const phases = Object.values(data.timing.byPhase as Record<string, number>)
  const sum = phases.reduce((a, b) => a + b, 0)
  expect(data.sessionMs).toBeGreaterThan(0)
  expect(Math.abs(sum - data.sessionMs)).toBeLessThanOrEqual(data.sessionMs * 0.05)
  expect(errors).toEqual([])
})
