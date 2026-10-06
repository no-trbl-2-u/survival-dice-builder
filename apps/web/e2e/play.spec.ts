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
  const banner = page.getByTestId('next-step')
  await expect(banner).toContainText('Setup: Click a highlighted base hex')

  // Setup: the base-centre hex on the map is a button.
  await page
    .getByRole('button', { name: 'Place your figure on Plains, Base, the base centre' })
    .click()
  await expect(bar).toContainText('Round 1')

  // Prepare: walk off the map edge to reveal tiles (their enemies come at Combat), stop any
  // Build at once, and play every card until a Combat exchange starts.
  for (let i = 0; i < 60 && !(await banner.textContent())?.includes('roll again'); i++) {
    if (await clickFirst(page, /^Step off the map edge/)) continue
    if (await clickFirst(page, /^Move to [^:]+$/)) continue
    if (await clickFirst(page, /^Stop (moving|building)$/)) continue
    await clickFirst(page, /^Play /)
  }
  await expect(page.getByTestId('play-log')).toContainText('Tile revealed')
  await expect(banner).toContainText('roll again or stop rolling')
  await expect(page.getByLabel('Hand')).toContainText('bottom halves up (Combat)')

  // Combat exchange: stop rolling, play the bottom halves, put a die on a Skill if one fits.
  await page.getByRole('button', { name: 'Stop rolling' }).click()
  // In Combat each Play button names the bottom-half effect, not the card's Prepare name.
  await expect(
    page
      .getByLabel('Hand')
      .getByRole('button', { name: /^Play / })
      .first(),
  ).toHaveText(/^Play (Reroll|\+\d|Heal)/)
  for (
    let i = 0;
    i < 10 && /Play or discard|reroll/.test((await banner.textContent()) ?? '');
    i++
  ) {
    if (await clickFirst(page, /^Stop rerolling$/)) continue
    await clickFirst(page, /^Play /)
  }
  // The first die that fits is already chosen: its Skill slots are buttons at once.
  await clickFirst(page, /^Put die \d on /)
  await page.getByRole('button', { name: 'Confirm dice and fire Skills' }).click()
  // The first exchange is over: either a new exchange began or Combat moved on.
  await expect(banner).not.toContainText('Put your dice on Skills')
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
  await page
    .getByRole('button', { name: 'Place your figure on Plains, Base, the base centre' })
    .click()
  const play = page.getByRole('button', { name: /^Play / }).first()
  await expect(play).toBeVisible()
  const control = await play.boundingBox()
  const map = await page.getByTestId('play-map').boundingBox()
  expect(control && map && control.y < map.y, 'a Play button sits above the map').toBe(true)
})

test('/play Combat v3: Combat cards offer their options, and Engage starts an engagement', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto('/play?seed=5&combat=engage')
  const banner = page.getByTestId('next-step')
  await page
    .getByRole('button', { name: 'Place your figure on Plains, Base, the base centre' })
    .click()
  for (let i = 0; i < 40 && !(await banner.textContent())?.startsWith('Combat'); i++) {
    if (await clickFirst(page, /^Stop (moving|building)$/)) continue
    await clickFirst(page, /^Discard /)
  }
  await expect(banner).toContainText(/^Combat:/)
  await expect(
    page
      .getByLabel('Hand')
      .getByRole('button', { name: /^Move 2$/ })
      .first(),
  ).toBeVisible()

  // Engage: the engagement runs in a modal, step by step, and ends on its result.
  await page
    .getByLabel('Hand')
    .getByRole('button', { name: /^Engage$/ })
    .first()
    .click()
  const modal = page.getByRole('dialog', { name: /^Engagement/ })
  await expect(modal).toBeVisible()
  await expect(modal.getByRole('list', { name: 'Engagement steps' })).toContainText('Roll')
  await expect(modal.getByLabel('Dice', { exact: true })).toBeVisible()
  await expect(modal.getByLabel('Enemy dice')).toBeVisible()
  await expect(modal.getByLabel('Skills')).toBeVisible()
  // Esc never closes it mid-engagement.
  await page.keyboard.press('Escape')
  await expect(modal).toBeVisible()
  // Look at the board, then come back.
  await modal.getByRole('button', { name: 'Look at the board' }).click()
  await expect(modal).toBeHidden()
  await page.getByTestId('engage-return').click()
  await expect(modal).toBeVisible()
  const summary = modal.getByTestId('engage-summary')
  for (let i = 0; i < 20 && !(await summary.isVisible()); i++) {
    const pick = modal
      .getByRole('button', {
        name: / hits |^Fire |^Put dic?e |^Stop rolling: use these dice$|^Done adding cards$|^Stop rerolling$|^End engagement/,
      })
      .first()
    if ((await pick.count()) > 0) await pick.click()
  }
  await expect(summary).toBeVisible()
  await expect(modal).toContainText('Engagement over')
  await modal.getByRole('button', { name: 'Back to the board' }).click()
  await expect(modal).toBeHidden()
  expect(errors).toEqual([])
})
