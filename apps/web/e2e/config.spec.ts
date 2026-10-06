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

test('/config: a ruling the engine does not read yet says so', async ({ page }) => {
  await page.goto('/config')
  await expect(page.getByLabel('Heal targets', { exact: true })).toHaveAccessibleDescription(
    /Not used by the engine yet: changing it changes nothing\./,
  )
  await expect(page.getByLabel('Lost skirmish', { exact: true })).not.toHaveAccessibleDescription(
    /Not used by the engine yet/,
  )
})

test('/config: the phase 22 experiment options default off, with help that names the row', async ({
  page,
}) => {
  await page.goto('/config')
  const reveal = page.getByLabel('Forced reveal every', { exact: true })
  await expect(reveal).toHaveValue('')
  await expect(reveal).toHaveAttribute('placeholder', 'off')
  await expect(reveal).toHaveAccessibleDescription(/Row 63: .* Rules 10\.1 \(open question 63\)\./)
  const attacks = page.getByLabel('Enemy attacks per Combat', { exact: true })
  await expect(attacks.locator('option:checked')).toHaveText('Every exchange (off)')
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

test('/config: sliders, toggles, and pick lists; a name can only come from the content', async ({
  page,
}) => {
  await page.goto('/config')
  // No free-text JSON: every list has its own control.
  await expect(page.locator('textarea')).toHaveCount(0)
  // A slider and its number box move together.
  const slider = page.getByLabel('Maximum health slider', { exact: true })
  await slider.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByLabel('Maximum health', { exact: true })).toHaveValue('16')
  // An optional limit turns on at the low end of its range.
  await page.getByLabel('Forced reveal every: on', { exact: true }).check()
  await expect(page.getByLabel('Forced reveal every', { exact: true })).toHaveValue('1')
  // Starter Skills are toggles; a starter deck card is a pick from the card list.
  const skills = page.locator('#cfg-player-starterSkills')
  await skills.getByLabel('Cleave', { exact: true }).check()
  await page.getByLabel('deck-10-hand-5: card 1', { exact: true }).selectOption('sprint')
  // Renaming the preset in use is caught on save, at the field that names it.
  await page.getByRole('region', { name: 'Preset deck-10-hand-5' }).getByLabel('Id').fill('mine')
  await page.getByRole('button', { name: 'Save config' }).click()
  await expect(
    page.getByRole('alert').getByRole('link', { name: 'Deck and hand preset' }),
  ).toBeVisible()
  await page.getByLabel('Deck and hand preset', { exact: true }).selectOption('mine')
  await page.getByRole('button', { name: 'Save config' }).click()
  await expect(page.getByRole('status')).toContainText('Saved')
  // The saved config starts a run.
  await page.goto('/play')
  await page.getByRole('button', { name: 'Start run' }).click()
  await expect(page.getByTestId('player-panel')).toContainText('16 / 16')
})
