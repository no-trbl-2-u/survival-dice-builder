import { expect, test } from '@playwright/test'

test('/debug: clicking the first legal action 30 times plays the engine with no errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/debug')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Engine console')
  const log = page.getByTestId('log').locator('li')
  const before = await log.count()

  for (let i = 0; i < 30; i++) {
    const first = page.getByTestId('actions').getByRole('button').first()
    if ((await first.count()) === 0) break
    await first.click()
  }

  expect(await log.count()).toBeGreaterThan(before)
  await expect(page.getByTestId('state')).toContainText('Round')
  expect(errors).toEqual([])
})

test('/debug: a new seed starts a new run', async ({ page }) => {
  await page.goto('/debug')
  await page.getByLabel('Seed').fill('42')
  await page.getByRole('button', { name: 'New run' }).click()
  await expect(page.getByText('0 actions')).toBeVisible()
  await expect(page.getByTestId('state')).toContainText('1 / prepare')
})
