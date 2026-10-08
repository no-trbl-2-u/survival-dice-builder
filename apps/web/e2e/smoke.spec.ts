import { expect, test } from '@playwright/test'

test('home renders the title and a 7-hex tile with no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Survival Dice-Builder')
  await expect(page.locator('polygon[data-hex]')).toHaveCount(7)
  // The page says what the game is and links straight into a run.
  await expect(page.locator('main')).toContainText('Defend the base, build your dice')
  await page.getByRole('link', { name: 'Start a run' }).click()
  await expect(page).toHaveURL(/\/play$/)
  await expect(page.getByTestId('start-panel')).toBeVisible()
  expect(errors).toEqual([])
})

test('375px viewport has no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.locator('polygon[data-hex]')).toHaveCount(7)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})

test('an unknown path says the page was not found and links home', async ({ page }) => {
  await page.goto('/decision')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  await expect(page).toHaveTitle('Page not found - Survival Dice-Builder')
  await expect(page.locator('main')).toContainText('There is no page at /decision.')
  await expect(page.locator('nav a[aria-current="page"]')).toHaveCount(0)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  await page.getByRole('link', { name: 'the home page' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Survival Dice-Builder')
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
})

test('with JavaScript off the shell says what the game is and that it needs JavaScript', async ({
  request,
}) => {
  // Headless Chromium still parses <noscript> as raw text when scripts are
  // disabled, so check the served shell rather than the rendered page.
  const html = await (await request.get('/play')).text()
  const noscript = /<noscript>([\s\S]*?)<\/noscript>/.exec(html)?.[1] ?? ''
  expect(noscript.replace(/\s+/g, ' ')).toContain(
    'a co-op survival dice-builder for 1 to 4 players',
  )
  expect(noscript).toContain('Turn JavaScript on to play.')
})
