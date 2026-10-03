import { expect, test, type Page } from '@playwright/test'

/** Clicks the first visible button whose name matches, if any. Returns whether it clicked. */
async function clickFirst(page: Page, name: RegExp): Promise<boolean> {
  const button = page.getByRole('button', { name }).first()
  if ((await button.count()) === 0) return false
  await button.click()
  return true
}

test('/play: setup tile, the Prepare hands, and 1 Combat exchange, with no errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/play?seed=3')
  const bar = page.getByTestId('phase-bar')
  await expect(bar).toContainText('Setup')

  // Setup: the map ghost tile and the Choices button are both buttons; use the Choices one.
  await page.getByRole('button', { name: /^Place stony-fields at \(2,1\)$/ }).click()
  await expect(bar).toContainText('Round 1')

  // Prepare: play every card (stop any Move or Build at once) until Combat starts.
  for (let i = 0; i < 30 && !(await bar.textContent())?.includes('Exchange'); i++) {
    if (await clickFirst(page, /^Stop (moving|building)$/)) continue
    await clickFirst(page, /^Play /)
  }
  await expect(bar).toContainText('Exchange: roll')
  await expect(page.getByLabel('Hand')).toContainText('bottom halves up (Combat)')

  // Combat exchange: stop rolling, play the bottom halves, put a die on a Skill if one fits.
  await page.getByRole('button', { name: 'Stop rolling' }).click()
  for (let i = 0; i < 10 && /cards|reroll/.test((await bar.textContent()) ?? ''); i++) {
    if (await clickFirst(page, /^Finish rerolls$/)) continue
    await clickFirst(page, /^Play /)
  }
  if (await clickFirst(page, /^Select die 1$/)) await clickFirst(page, /^Put die 1 on /)
  await page.getByRole('button', { name: 'Confirm dice and fire Skills' }).click()
  // The first exchange is over: either a new exchange began or Combat moved on.
  await expect(bar).not.toContainText('Exchange: assign')
  expect(errors).toEqual([])
})

test('/play at 375px has no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/play?seed=1')
  await expect(page.getByTestId('play-map')).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
