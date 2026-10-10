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
