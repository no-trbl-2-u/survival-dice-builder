import { expect, test, type Page } from '@playwright/test'

/** Clicks the first visible button whose name matches, if any. Returns whether it clicked. */
async function clickFirst(page: Page, name: RegExp): Promise<boolean> {
  const button = page.getByRole('button', { name }).first()
  if ((await button.count()) === 0) return false
  await button.click()
  return true
}

test('/play: start hex, a reveal off the map edge, the Prepare hands, and 1 Combat exchange, with no errors', async ({
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

  // Setup: the map hex and the Choices button are both buttons; use the Choices one.
  await page
    .getByRole('button', { name: /^Place your figure on .*the base centre \(0,0\)$/ })
    .click()
  await expect(bar).toContainText('Round 1')

  // Prepare: walk off the map edge to reveal tiles (their enemies come at Combat), stop any
  // Build at once, and play every card until a Combat exchange starts.
  for (let i = 0; i < 60 && !(await bar.textContent())?.includes('Exchange'); i++) {
    if (await clickFirst(page, /^Step off the map edge/)) continue
    if (await clickFirst(page, /^Move to [^:]+$/)) continue
    if (await clickFirst(page, /^Stop (moving|building)$/)) continue
    await clickFirst(page, /^Play /)
  }
  await expect(page.getByTestId('play-log')).toContainText('Tile revealed')
  await expect(bar).toContainText('Exchange: roll')
  await expect(page.getByLabel('Hand')).toContainText('bottom halves up (Combat)')

  // Combat exchange: stop rolling, play the bottom halves, put a die on a Skill if one fits.
  await page.getByRole('button', { name: 'Stop rolling' }).click()
  for (let i = 0; i < 10 && /cards|reroll/.test((await bar.textContent()) ?? ''); i++) {
    if (await clickFirst(page, /^Stop rerolling$/)) continue
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

test('/play at 375px puts the controls for the current step above the map', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/play?seed=3')
  await page.getByTestId('choices').getByRole('button').first().click()
  const play = page.getByRole('button', { name: /^Play / }).first()
  await expect(play).toBeVisible()
  const control = await play.boundingBox()
  const map = await page.getByTestId('play-map').boundingBox()
  expect(control && map && control.y < map.y, 'a Play button sits above the map').toBe(true)
})
