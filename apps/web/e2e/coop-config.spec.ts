import { expect, test } from '@playwright/test'

test('/play: a 3-player run starts and passes the turn in seat order', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto('/play')
  await page.getByLabel('Players').selectOption('3')
  await page.getByLabel('Seed').fill('5')
  await page.getByRole('button', { name: 'Start run' }).click()
  const turn = page.getByTestId('turn')
  // Setup: each player in seat order puts their figure on a free base hex.
  for (let seat = 1; seat <= 3; seat++) {
    await expect(page.getByTestId('phase-bar')).toContainText(`Player ${seat}, place your figure`)
    await page
      .getByRole('button', {
        name: new RegExp(`^Place Player ${seat}'s figure .* \\(-?\\d+,-?\\d+\\)$`),
      })
      .first()
      .click()
  }
  await expect(turn).toHaveText("Player 1's turn")
  for (let i = 0; i < 3; i++)
    await page
      .getByRole('button', { name: /^Discard / })
      .first()
      .click()
  await expect(turn).toHaveText("Player 2's turn")
  await expect(page.getByTestId('player-panel')).toContainText('Player 3')
  expect(errors).toEqual([])
})

test('/config: a changed value is used by the next run', async ({ page }) => {
  await page.goto('/config')
  const maxHealth = page.getByLabel('Maximum health', { exact: true })
  await maxHealth.fill('21')
  await page.getByRole('button', { name: 'Save config' }).click()
  await expect(page.getByRole('status')).toContainText('Saved')
  await page.goto('/play')
  await expect(page.getByTestId('start-panel')).toContainText('custom')
  await page.getByRole('button', { name: 'Start run' }).click()
  await expect(page.getByTestId('player-panel')).toContainText('21 / 21')
  // Reset for other tests in this browser context.
  await page.goto('/config')
  await page.getByRole('button', { name: 'Reset to defaults' }).click()
  await page.getByRole('button', { name: 'Yes, reset every value' }).click()
})

test('/play: the autosave offers to resume the run', async ({ page }) => {
  await page.goto('/play?seed=8')
  await page.getByRole('button', { name: /^Place your figure .* \(0,0\)$/ }).click()
  await page.goto('/play')
  await expect(page.getByRole('button', { name: /^Resume saved run/ })).toBeVisible()
  await expect(page.getByText('Saved in this browser only.')).toBeVisible()
})
