import { expect, test, type Page } from '@playwright/test'

/** The same weak policy as play-full: the first visible button that matches, in order. */
const PREFERENCES: readonly RegExp[] = [
  /^Draft /,
  /^Place /,
  /^Step off the map edge/,
  /^Move to [^:]+$/,
  /^Stop moving$/,
  /^Stop building$/,
  /^Roll unkept dice$/,
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

/** Plays `n` decisions from a fresh seeded run, then returns the autosave. */
async function playSome(page: Page, dice3d: boolean, n: number) {
  await page.goto('/play?seed=7')
  await page.evaluate(() => localStorage.clear())
  await page.goto('/play?seed=7')
  if (dice3d) await page.getByRole('checkbox', { name: '3D dice' }).check()
  let saw3d = false
  for (let i = 0; i < n; i++) {
    expect(await step(page), 'no control to press').toBe(true)
    if (dice3d && !saw3d) {
      saw3d =
        (await page.getByTestId('dice-3d').count()) > 0 ||
        (await page.getByText('3D dice need WebGL').count()) > 0
    }
  }
  const saved = await page.evaluate(() => localStorage.getItem('survival.autosave.v1'))
  return { saved: JSON.parse(saved ?? '{}') as { actions: unknown[]; round: number }, saw3d }
}

const watch = (page: Page) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}

test('/credits lists every icon author and the fonts', async ({ page }) => {
  const errors = watch(page)
  await page.goto('/credits')
  const list = page.getByTestId('credits-assets')
  for (const author of ['Lorc', 'Delapouite', 'Sbed', 'Skoll', 'Faithtoken']) {
    await expect(list).toContainText(author)
  }
  await expect(page.locator('main')).toContainText('Alfa Slab One')
  // Link names are unique: the work name links to its source (no row of "Source" links).
  await expect(page.getByRole('link', { name: 'Source', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'CC BY 3.0' })).toHaveCount(1)
  await expect(list.getByRole('link', { name: 'Broadsword icon' })).toHaveAttribute(
    'href',
    /game-icons\.net/,
  )
  expect(errors).toEqual([])
})

test('/play: 3D dice and sound are presentation only (same actions, same state)', async ({
  page,
}) => {
  test.setTimeout(120_000)
  const errors = watch(page)
  const plain = await playSome(page, false, 40)
  const fancy = await playSome(page, true, 40)
  expect(fancy.saw3d, 'the 3D dice (or the no-WebGL note) appeared').toBe(true)
  expect(fancy.saved.actions).toEqual(plain.saved.actions)
  expect(fancy.saved.round).toBe(plain.saved.round)
  // The preference persists; sound can be muted.
  await page.reload()
  await expect(page.getByRole('checkbox', { name: '3D dice' })).toBeChecked()
  await page.getByRole('checkbox', { name: 'Sound' }).uncheck()
  await expect(page.getByRole('checkbox', { name: 'Sound' })).not.toBeChecked()
  expect(errors).toEqual([])
})
