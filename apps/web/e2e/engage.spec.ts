import { expect, test, type Page } from '@playwright/test'
import { defaultContent } from '@survival/content'
import fs from 'node:fs'
import path from 'node:path'
import { atTarget, forceEngagement } from '../src/play/devEngage.ts'
import { exportRun } from '../src/play/exportRun.ts'
import { newRun } from '../src/play/run.ts'

const DEFAULT_CONFIG = path.join(
  import.meta.dirname,
  '../../../packages/content/data/config.default.json',
)

/** Clicks the first visible button whose name matches, if any. Returns whether it clicked. */
async function clickFirst(page: Page, name: RegExp): Promise<boolean> {
  const button = page.getByRole('button', { name }).first()
  if ((await button.count()) === 0) return false
  await button.click()
  return true
}

/** From a fresh seeded run to the first engagement's modal (engagements are the default). */
async function engage(page: Page, seed: number) {
  await page.goto(`/play?seed=${seed}`)
  const banner = page.getByTestId('next-step')
  await page
    .getByRole('button', { name: 'Place your figure on Plains, Base, the base centre' })
    .click()
  for (let i = 0; i < 40 && !(await banner.textContent())?.startsWith('Combat'); i++) {
    if (await clickFirst(page, /^Stop (moving|building)$/)) continue
    await clickFirst(page, /^Discard /)
  }
  await page
    .getByLabel('Hand')
    .getByRole('button', { name: /^Engage$/ })
    .first()
    .click()
  const modal = page.getByRole('dialog', { name: /^Engagement/ })
  await expect(modal).toBeVisible()
  return modal
}

test('/play engagement II: no pre-selected die, place names, the board damage number, the result read out', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  // First engagement of a played run: nothing is selected at Use dice.
  const first = await engage(page, 5)
  await first.getByRole('button', { name: 'Stop rolling: use these dice' }).click()
  await expect(first.getByRole('list', { name: 'Engagement steps' })).toContainText('Use dice')
  await expect(first.locator('section[aria-label="Dice"] button[aria-pressed="true"]')).toHaveCount(
    0,
  )

  // A later engagement with enemies next to the figure, carried on through the autosave (the
  // real ?resume path): the engine plays the run up to a fired Skill waiting for its target.
  const run = forceEngagement(newRun(defaultContent.config, 5), atTarget)
  if (!run) throw new Error('no target pick came up in the run')
  await page.evaluate(
    (raw) => localStorage.setItem('survival.autosave.v1', raw),
    JSON.stringify(exportRun(run)),
  )
  await page.goto('/play?resume')
  const modal = page.getByRole('dialog', { name: /^Engagement/ })
  await expect(modal).toBeVisible()
  await expect(modal.locator('#engage-title')).toContainText(/ vs \d+ (grunt|elite)/)
  await expect(modal.locator('#engage-title')).not.toContainText(/\be\d+\b/)

  const summary = modal.getByTestId('engage-summary')
  let picked = false
  for (let i = 0; i < 30 && !(await summary.isVisible()); i++) {
    const hits = modal.getByRole('button', { name: / hits / })
    if ((await hits.count()) > 0 && (await hits.first().isVisible())) {
      // Enemies are named by kind and place, never by engine id.
      for (const name of await hits.allTextContents()) expect(name).not.toMatch(/\be\d+\b/)
      await hits.first().click()
      picked = true
      // The modal steps aside, the number floats off the enemy on the board, and it returns.
      await expect(modal).toBeHidden()
      // The board says what comes next, so the result never reads as skipped.
      await expect(page.getByTestId('aside-note')).toHaveText(
        /^(Engagement over\. The result comes next\.|Back to the engagement in a moment\.)$/,
      )
      await expect(page.getByLabel('Map', { exact: true }).locator('[data-float]')).toHaveCount(1, {
        timeout: 1000,
      })
      await expect(modal).toBeVisible({ timeout: 2000 })
      continue
    }
    const dice = modal.locator('section[aria-label="Dice"] button[aria-pressed="false"]')
    if ((await dice.count()) > 0) {
      await dice.first().click()
      const skill = modal.getByRole('button', { name: /^Put dic?e / }).first()
      if ((await skill.count()) > 0) {
        await skill.click()
        continue
      }
    }
    await clickFirst(
      page,
      /^Stop rolling: use these dice$|^Done adding cards$|^Stop rerolling$|^End engagement/,
    )
  }
  expect(picked, 'a target pick came up').toBe(true)
  await expect(summary).toBeVisible()
  await expect(modal.getByTestId('engage-headline')).toHaveAttribute('role', 'status')
  expect(errors).toEqual([])
})

test('/play engagement II at 375x812: the felt and the Skills fit together, under a short instruction', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  // A config with 6 dice (the crowded case), saved as /config would save it.
  const config = JSON.parse(fs.readFileSync(DEFAULT_CONFIG, 'utf-8'))
  config.player.startingDice = 6
  await page.addInitScript((raw) => {
    localStorage.setItem('survival.config.v1', raw)
  }, JSON.stringify(config))
  const modal = await engage(page, 5)
  await modal.getByRole('button', { name: 'Stop rolling: use these dice' }).click()
  await expect(modal.getByRole('list', { name: 'Engagement steps' })).toContainText('Use dice')
  const now = modal.getByTestId('engage-instruction')
  await expect(now).toHaveText(/Pick dice, then a Skill\./)
  const line = await now.boundingBox()
  expect(line && line.height, 'one short instruction line').toBeLessThan(44)
  const body = modal.locator('[data-testid="engage-instruction"] ~ div').first()
  const box = await body.boundingBox()
  const dice = modal.locator('section[aria-label="Dice"] button[aria-pressed]')
  const last = await dice.last().boundingBox()
  const skills = await modal.getByLabel('Skills').boundingBox()
  if (!box || !last || !skills) throw new Error('the modal body, a die, or the Skills is missing')
  expect(last.y + last.height).toBeLessThanOrEqual(box.y + box.height + 1)
  expect(skills.y + skills.height).toBeLessThanOrEqual(box.y + box.height + 1)
})

test('/play engagement II at 375x812: 5 Skills fit in 3 columns, the fifth above the footer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  // A config with 5 starter Skills and 6 dice, saved as /config would save it.
  const config = JSON.parse(fs.readFileSync(DEFAULT_CONFIG, 'utf-8'))
  config.player.startingDice = 6
  config.player.starterSkills = ['strike', 'shot', 'mend', 'guard', 'cleave']
  await page.addInitScript((raw) => {
    localStorage.setItem('survival.config.v1', raw)
  }, JSON.stringify(config))
  const modal = await engage(page, 5)
  await modal.getByRole('button', { name: 'Stop rolling: use these dice' }).click()
  await expect(modal.getByRole('list', { name: 'Engagement steps' })).toContainText('Use dice')
  const body = modal.locator('[data-testid="engage-instruction"] ~ div').first()
  const box = await body.boundingBox()
  const tiles = modal.getByLabel('Skills').locator('li')
  await expect(tiles).toHaveCount(5)
  const first = await tiles.first().boundingBox()
  const third = await tiles.nth(2).boundingBox()
  const fifth = await tiles.nth(4).boundingBox()
  if (!box || !first || !third || !fifth) throw new Error('the modal body or a Skill is missing')
  expect(Math.abs(third.y - first.y), 'the third Skill shares the first row').toBeLessThan(2)
  expect(fifth.y + fifth.height).toBeLessThanOrEqual(box.y + box.height + 1)
})

test('/play engagement II at 1280x800: 6 Skills with long effect texts fit in 1 row above the footer', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  // 6 Skills with the longest effect texts and the most slots, and 6 dice, saved as /config would.
  const config = JSON.parse(fs.readFileSync(DEFAULT_CONFIG, 'utf-8'))
  config.player.startingDice = 6
  config.player.starterSkills = [
    'arcane-rain',
    'phalanx',
    'meteor',
    'spark-burst',
    'flurry',
    'dodge',
  ]
  await page.addInitScript((raw) => {
    localStorage.setItem('survival.config.v1', raw)
  }, JSON.stringify(config))
  const modal = await engage(page, 5)
  await modal.getByRole('button', { name: 'Stop rolling: use these dice' }).click()
  await expect(modal.getByRole('list', { name: 'Engagement steps' })).toContainText('Use dice')
  const body = modal.locator('[data-testid="engage-instruction"] ~ div').first()
  const box = await body.boundingBox()
  const tiles = modal.getByLabel('Skills').locator('li')
  await expect(tiles).toHaveCount(6)
  const first = await tiles.first().boundingBox()
  if (!box || !first) throw new Error('the modal body or a Skill is missing')
  for (const tile of await tiles.all()) {
    const t = await tile.boundingBox()
    if (!t) throw new Error('a Skill is missing')
    expect(Math.abs(t.y - first.y), 'every Skill in the first row').toBeLessThan(2)
    expect(t.y + t.height, 'every Skill above the footer').toBeLessThanOrEqual(
      box.y + box.height + 1,
    )
  }
  const scrolls = await body.evaluate((el) => el.scrollHeight > el.clientHeight)
  expect(scrolls, 'the body does not scroll').toBe(false)
})

test('/play engagement II at 375x812: the hand strip shows every option line whole', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  // A deck of the wordiest cards (2-word names, "Reroll all dice"), saved as /config would save it.
  const config = JSON.parse(fs.readFileSync(DEFAULT_CONFIG, 'utf-8'))
  config.deck.presets[0].cards = [
    { card: 'field-medic', quantity: 3 },
    { card: 'sanctuary', quantity: 2 },
    { card: 'quarry', quantity: 3 },
    { card: 'excavate', quantity: 2 },
  ]
  await page.addInitScript((raw) => {
    localStorage.setItem('survival.config.v1', raw)
  }, JSON.stringify(config))
  await engage(page, 5)
  const strip = page.getByLabel('Your hand')
  const lines = strip.locator('button span span')
  expect(await lines.count(), 'cards in the strip').toBeGreaterThan(4)
  for (const line of await lines.all()) {
    const box = await line.boundingBox()
    if (!box) throw new Error('an option line is missing')
    expect(
      box.y + box.height,
      `"${await line.textContent()}" above the bottom edge`,
    ).toBeLessThanOrEqual(812)
  }
  const fits = await strip.evaluate((ul) => ul.scrollWidth <= ul.clientWidth)
  expect(fits, 'every card in view without scrolling').toBe(true)
})

for (const [width, height] of [
  [375, 812],
  [1280, 800],
] as const) {
  test(`/play engagement II at ${width}x${height}: the Skills stay in view during a target pick`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/play')
    // The engine plays the run up to a fired Skill waiting for its target (4 targets in range).
    const run = forceEngagement(newRun(defaultContent.config, 5), atTarget)
    if (!run) throw new Error('no target pick came up in the run')
    await page.evaluate(
      (raw) => localStorage.setItem('survival.autosave.v1', raw),
      JSON.stringify(exportRun(run)),
    )
    await page.goto('/play?resume')
    const modal = page.getByRole('dialog', { name: /^Engagement/ })
    const targets = modal.getByTestId('engage-targets')
    await expect(targets.getByRole('button', { name: / hits / })).toHaveCount(4)
    const body = modal.locator('[data-testid="engage-instruction"] ~ div').first()
    const box = await body.boundingBox()
    const last = await targets
      .getByRole('button', { name: / hits / })
      .last()
      .boundingBox()
    const tiles = modal.getByLabel('Skills').locator('li')
    const first = await tiles.first().boundingBox()
    const fired = await tiles.filter({ hasText: 'Shot' }).boundingBox()
    if (!box || !last || !first || !fired)
      throw new Error('the body, a target or a Skill is missing')
    const bottom = box.y + box.height + 1
    expect(last.y + last.height, 'the last target in view').toBeLessThanOrEqual(bottom)
    expect(first.y + first.height, 'the first Skills in view').toBeLessThanOrEqual(bottom)
    expect(fired.y + fired.height, 'the fired Skill in view').toBeLessThanOrEqual(bottom)
    expect(first.y, 'the Skills under the targets').toBeGreaterThan(last.y)
  })
}
