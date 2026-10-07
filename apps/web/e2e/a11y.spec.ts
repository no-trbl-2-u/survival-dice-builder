import { expect, test } from '@playwright/test'

const ROUTES = [
  ['/', 'Home', 'Survival Dice-Builder'],
  ['/play', 'Play', 'Play - Survival Dice-Builder'],
  ['/config', 'Config', 'Config - Survival Dice-Builder'],
  ['/tiles', 'Tiles', 'Tile sheet - Survival Dice-Builder'],
  ['/decisions', 'Decisions', 'Decisions - Survival Dice-Builder'],
  ['/debug', 'Debug', 'Engine console - Survival Dice-Builder'],
  ['/credits', 'Credits', 'Credits - Survival Dice-Builder'],
] as const

for (const [path, link, title] of ROUTES) {
  test(`${path}: own title, the nav marks it, and Tab never drops focus`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveTitle(title)
    const nav = page.getByRole('navigation', { name: 'Main' })
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1)
    await expect(nav.getByRole('link', { name: link, exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    )
    // Up to 10 presses, but never past the last focusable control (focus then leaves the page).
    const focusable = await page
      .locator('a[href], button, input, select, textarea, [tabindex="0"]')
      .count()
    for (let i = 0; i < Math.min(10, focusable); i++) {
      await page.keyboard.press('Tab')
      expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY')
    }
  })
}

test('/debug: after an action, focus returns to the action list heading', async ({ page }) => {
  await page.goto('/debug')
  const first = page.getByTestId('actions').getByRole('button').first()
  await first.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: /^Legal actions/ })).toBeFocused()
  await expect(page.getByRole('log')).toBeAttached()
})

test('/play: map targets name places, and the map names what stands on each hex', async ({
  page,
}) => {
  await page.goto('/play?seed=3')
  const choice = page.getByRole('button', {
    name: 'Place your figure on Plains, Base, the base centre',
  })
  await expect(choice).toHaveAccessibleName('Place your figure on Plains, Base, the base centre')
  await choice.click()
  await expect(
    page.getByTestId('play-map').locator('title', { hasText: 'your figure' }),
  ).toHaveCount(1)
})

test('/play: the start panel says what a run is and what the seed does', async ({ page }) => {
  await page.goto('/play')
  const panel = page.getByTestId('start-panel')
  await expect(panel).toContainText(
    'Keep the base standing for as many rounds as you can. A player at 0 health is knocked out',
  )
  await expect(panel.getByRole('textbox', { name: /Seed/ })).toHaveAccessibleDescription(
    'The same seed and the same choices give the same game.',
  )
  const combat = panel.getByRole('combobox', { name: /Combat/ })
  await expect(combat).toHaveAccessibleDescription(/Play Engage to roll from where you stand/)
  await combat.selectOption('exchange')
  await expect(combat).toHaveAccessibleDescription(/In each exchange you roll, play cards/)
  await expect(panel).not.toContainText('Spec v1')
})

test('/decisions: open readings link to their /config field, which takes focus', async ({
  page,
}) => {
  await page.goto('/decisions')
  await expect(page.getByTestId('readings')).toContainText('rule 7.11')
  await expect(page.getByTestId('checks').locator('li')).not.toHaveCount(0)
  await page.getByRole('link', { name: 'rulings.structureDamage' }).first().click()
  await expect(page).toHaveURL(/\/config#cfg-rulings-structureDamage$/)
  await expect(page.locator('#cfg-rulings-structureDamage')).toBeFocused()
})
