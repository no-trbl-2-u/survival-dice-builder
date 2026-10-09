import { expect, test } from '@playwright/test'

test('/tiles shows the 9 proposed tiles with no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/tiles')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tile sheet')
  await expect(page.locator('[data-tile]')).toHaveCount(9)
  await expect(page.locator('[data-tile] [data-hex]')).toHaveCount(63)
  await expect(page.locator('[data-tile="broken-village"] [data-site="base"]')).toHaveCount(1)
  // Every hex is also listed as text (touch, keyboard, and screen-reader users).
  await expect(page.locator('[data-hex-row]')).toHaveCount(63)
  // Screen-reader users can jump by heading: one H2 per kind, one H3 per tile.
  await expect(page.getByRole('heading', { level: 2 })).toHaveText([
    'Base tile',
    'Countryside tiles',
    'Core tiles',
  ])
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(9)
  await expect(page.getByRole('heading', { level: 3, name: 'Broken Village' })).toBeVisible()
  await expect(page.getByRole('list', { name: 'Broken Village hexes' })).toContainText(
    'Center: Plains, Base',
  )
  await expect(page.locator('#tiles-intro')).not.toContainText('Hover')
  // The site icons have a legend, each with its icon and name.
  const sites = page.getByRole('list', { name: 'Site legend' })
  await expect(sites.getByRole('listitem')).toHaveCount(4)
  await expect(sites).toContainText('Elite spawn node')
  await expect(sites.locator('svg[data-icon]')).toHaveCount(4)
  expect(errors).toEqual([])
})

test('/tiles at 375px has no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/tiles')
  await expect(page.locator('[data-tile]')).toHaveCount(9)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})

test('navigation links reach both pages', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Main' })
  await nav.getByRole('link', { name: 'Tiles' }).click()
  await expect(page).toHaveURL(/\/tiles$/)
  await nav.getByRole('link', { name: 'Home' }).click()
  await expect(page.locator('polygon[data-hex]')).toHaveCount(7)
})
