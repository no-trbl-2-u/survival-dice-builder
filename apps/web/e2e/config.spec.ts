import { expect, test } from '@playwright/test'

test('/config: each field has a label, help with its rules section, and plain options', async ({
  page,
}) => {
  await page.goto('/config')
  const cost = page.getByLabel('Move cost next to an enemy', { exact: true })
  await expect(cost).toHaveAttribute('min', '1')
  await expect(cost).toHaveAccessibleDescription(/Hexes a Move pays .* Rules 6\.9\./)
  const skirmish = page.getByLabel('Lost skirmish', { exact: true })
  await expect(skirmish.locator('option:checked')).toHaveText('Stay; the rest of the Move is lost')
  await expect(page.getByRole('group', { name: 'Designer rulings' })).toBeVisible()
})

test('/config: a bad value is named at its field; Save stays in reach', async ({ page }) => {
  await page.goto('/config')
  const health = page.getByLabel('Maximum health', { exact: true })
  await health.fill('0')
  await expect(page.getByRole('status')).toHaveText('Unsaved changes.')
  await page.mouse.wheel(0, 100000)
  const save = page.getByRole('button', { name: 'Save config' })
  await expect(save).toBeInViewport()
  await save.click()
  await expect(health).toHaveAttribute('aria-invalid', 'true')
  await expect(health).toHaveAccessibleDescription(/Enter a number more than 0\./)
  await expect(page.getByRole('alert').getByRole('link', { name: 'Maximum health' })).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('Not saved: 1 field needs a fix.')
})

test('/config: leaving with unsaved edits warns; Reset asks first', async ({ page }) => {
  await page.goto('/config')
  await page.getByLabel('Shop offers', { exact: true }).fill('4')
  let warned = false
  page.once('dialog', (dialog) => {
    warned = dialog.type() === 'beforeunload'
    void dialog.dismiss()
  })
  await page.getByRole('link', { name: 'Tiles' }).click()
  await expect.poll(() => warned).toBe(true)
  await expect(page).toHaveURL(/\/config$/)

  await page.getByRole('button', { name: 'Reset to defaults' }).click()
  await page.getByRole('button', { name: 'Keep my values' }).click()
  await expect(page.getByLabel('Shop offers', { exact: true })).toHaveValue('4')
  await page.getByRole('button', { name: 'Reset to defaults' }).click()
  await page.getByRole('button', { name: 'Yes, reset every value' }).click()
  await expect(page.getByLabel('Shop offers', { exact: true })).toHaveValue('3')
  await expect(page.getByRole('status')).toHaveText('Reset to the defaults.')
})

test('/decisions: a setting shows its config label beside the path', async ({ page }) => {
  await page.goto('/decisions')
  await expect(page.getByTestId('readings')).toContainText(
    'Structure damage (rulings.structureDamage)',
  )
})
