import { expect, test } from '@playwright/test'

test('/config: each field has a label, help with its rules section, and plain options', async ({
  page,
}) => {
  await page.goto('/config')
  const cost = page.getByLabel('Move cost next to an enemy', { exact: true })
  await expect(cost).toHaveAttribute('min', '1')
  await expect(cost).toHaveAccessibleDescription(/Hexes a Move pays .* Rules 6\.9\./)
  const blocked = page.getByLabel('Blocked enemy', { exact: true })
  await expect(blocked.locator('option:checked')).toHaveText('Move toward the next nearest target')
  await expect(page.getByRole('group', { name: 'Designer rulings' })).toBeVisible()
})

test('/config: a ruling the engine does not read yet says so', async ({ page }) => {
  await page.goto('/config')
  await expect(page.getByLabel('Heal targets', { exact: true })).toHaveAccessibleDescription(
    /Not used by the engine yet: changing it changes nothing\./,
  )
  await expect(page.getByLabel('Blocked enemy', { exact: true })).not.toHaveAccessibleDescription(
    /Not used by the engine yet/,
  )
})

test('/config: a field one Combat model ignores is tagged, and says so under the other (phase 37)', async ({
  page,
}) => {
  await page.goto('/config')
  const defeated = page.getByLabel("Defeated enemies' dice", { exact: true })
  await expect(defeated).toHaveAccessibleDescription(/Engagements only\./)
  await expect(defeated).not.toHaveAccessibleDescription(/changes nothing/)
  await page.getByLabel('Combat model', { exact: true }).selectOption('exchange')
  await expect(defeated).toHaveAccessibleDescription(
    /Engagements only\. Combat is set to exchanges, so changing it changes nothing\./,
  )
})

test('/config: a field shows the rule phrase it sets, with the edited value', async ({ page }) => {
  await page.goto('/config')
  const limit = page.getByLabel('Enemy miniature limit', { exact: true })
  await expect(limit).toHaveAccessibleDescription(
    /With these values: At most 20 enemies stand on the map\./,
  )
  await limit.fill('12')
  await expect(limit).toHaveAccessibleDescription(
    /With these values: At most 12 enemies stand on the map\./,
  )
})

test('/config: the experiment options default off; the rules note links the rule reading', async ({
  page,
}) => {
  await page.goto('/config')
  const reveal = page.getByLabel('Forced reveal every', { exact: true })
  await expect(reveal).toHaveValue('')
  await expect(reveal).toHaveAttribute('placeholder', 'off')
  await expect(reveal).toHaveAccessibleDescription(
    /^At round end, .* Rules 10\.1 \(rule reading 63\)\./,
  )
  const link = page.getByRole('link', { name: '63', exact: true })
  await expect(link).toHaveAttribute('href', '/decisions#q-63')
  // A decided question is not on /decisions, so the note leaves it out.
  await expect(page.getByLabel('Blocked enemy', { exact: true })).toHaveAccessibleDescription(
    /Rules 9\.7\.(?: |$)/,
  )
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
  await page.getByRole('link', { name: 'Tile sheet' }).click()
  await expect.poll(() => warned).toBe(true)
  await expect(page).toHaveURL(/\/config$/)

  await page.getByRole('button', { name: 'Reset to the standard rules' }).click()
  await page.getByRole('button', { name: 'Keep my values' }).click()
  await expect(page.getByLabel('Shop offers', { exact: true })).toHaveValue('4')
  await page.getByRole('button', { name: 'Reset to the standard rules' }).click()
  await page.getByRole('button', { name: 'Yes, reset every value' }).click()
  await expect(page.getByLabel('Shop offers', { exact: true })).toHaveValue('3')
  await expect(page.getByRole('status')).toHaveText('Reset to the standard rules.')
})

test('/decisions: a setting shows its config label and a plain value', async ({ page }) => {
  await page.goto('/decisions')
  await expect(page.getByTestId('readings')).toContainText('Forced reveal every: off')
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
  const limit = page.getByLabel('Forced reveal every: use a limit', { exact: true })
  await expect(limit).not.toBeChecked()
  await limit.check()
  await expect(page.getByLabel('Forced reveal every', { exact: true })).toHaveValue('1')
  // Starter Skills are toggles; a starter deck card is a pick from the card list.
  const skills = page.locator('#cfg-player-starterSkills')
  await skills.getByLabel('Cleave', { exact: true }).check()
  await page.getByLabel('Preset 1: card 1', { exact: true }).selectOption('sprint')
  // A preset names its deck total and its hand apart, so a 10-card deck is not read as the hand.
  const preset = page.getByRole('region', { name: 'Preset 1' })
  await expect(preset.getByText(/^Deck: \d+ cards$/)).toBeVisible()
  await expect(preset.getByLabel('Cards in hand', { exact: true })).toBeVisible()
  // Renaming the preset in use is caught on save, at the field that names it.
  await page.getByRole('region', { name: 'Preset 1' }).getByLabel('Id').fill('mine')
  await page.getByRole('button', { name: 'Save config' }).click()
  await expect(
    page.getByRole('alert').getByRole('link', { name: 'Deck and hand preset' }),
  ).toBeVisible()
  await page.getByLabel('Deck and hand preset', { exact: true }).selectOption('mine')
  await page.getByRole('button', { name: 'Save config' }).click()
  await expect(page.getByRole('status')).toHaveText(
    'Saved. New runs on the Play page use this config.',
  )
  // The saved config starts a run.
  await page.goto('/play')
  await page.getByRole('button', { name: 'Start run' }).click()
  await expect(page.getByTestId('player-panel')).toContainText('16 / 16')
})

test('/config: Start run saves the edits first and starts a run with them', async ({ page }) => {
  const dialogs: string[] = []
  page.on('dialog', async (d) => {
    dialogs.push(d.type())
    await d.dismiss()
  })
  await page.goto('/config')
  await page.getByLabel('Maximum health', { exact: true }).fill('17')
  await page.getByTestId('config-bar').getByRole('button', { name: 'Start run' }).click()
  await page.waitForURL(/\/play\?seed=\d+$/)
  await expect(page.getByTestId('next-step')).toBeVisible()
  expect(dialogs).toEqual([])
  await page.goto('/config')
  await expect(page.getByLabel('Maximum health', { exact: true })).toHaveValue('17')
})

test('/config: Resume run shows only with an autosave, and carries on with it', async ({
  page,
}) => {
  await page.goto('/config')
  await expect(page.getByRole('button', { name: /^Resume run/ })).toHaveCount(0)
  // Take 1 action so the run autosaves, then come back.
  await page.goto('/play?seed=3')
  await page
    .getByRole('button', { name: 'Place your figure on Plains, Base, the base center' })
    .click()
  await page.goto('/config')
  await page.getByRole('button', { name: /^Resume run \(round 1\)$/ }).click()
  await page.waitForURL(/\/play\?resume/)
  await expect(page.getByTestId('play-map')).toBeVisible()
  await expect(page.getByTestId('start-panel')).toHaveCount(0)
})

test('/decisions: Try this on /play plays a proposal, and the start panel resets it (phase 39)', async ({
  page,
}) => {
  await page.goto('/decisions')
  const row = page.locator('[data-question="63"]')
  await expect(row).toContainText('Measured under engagements')
  await row.getByRole('button', { name: 'Try this on /play' }).click()
  await expect(page).toHaveURL(/\/play$/)
  const changes = page.getByTestId('config-changes')
  await expect(changes).toContainText('Playing with the proposal: Forced reveal.')
  await expect(page.getByRole('link', { name: 'Forced reveal' })).toHaveAttribute(
    'href',
    '/decisions#q-63',
  )
  await page.getByRole('button', { name: 'Reset to the standard rules' }).click()
  await page.getByRole('button', { name: 'Keep my values' }).click()
  await expect(changes).toContainText('Playing with the proposal: Forced reveal.')
  await page.getByRole('button', { name: 'Reset to the standard rules' }).click()
  await page.getByRole('button', { name: 'Yes, reset every value' }).click()
  await expect(changes).toContainText('Playing with the standard rules.')
  await expect(page.getByTestId('config-proposals')).toHaveCount(0)
})

test('/config: Apply sets a proposal in the draft, and Save marks it (phase 39)', async ({
  page,
}) => {
  await page.goto('/config')
  await page.getByText(/Proposals to try/).click()
  await page.getByRole('button', { name: 'Apply Spawn range' }).click()
  await expect(page.getByRole('status')).toContainText('Applied the proposal Spawn range.')
  await page.getByRole('button', { name: 'Save config' }).click()
  await expect(page.getByTestId('config-proposals')).toHaveText(
    'Playing with the proposal: Spawn range.',
  )
  await expect(page.getByTestId('config-proposal-list')).toContainText('In this config.')
})
