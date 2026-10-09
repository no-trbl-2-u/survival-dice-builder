import { expect, test, type CDPSession, type Page } from '@playwright/test'
import { defaultContent } from '@survival/content'
import { legalActions } from '@survival/engine'
import { forceEngagement } from '../src/play/devEngage.ts'
import { exportRun } from '../src/play/exportRun.ts'
import { newRun } from '../src/play/run.ts'

/**
 * An engagement at Use dice with a card that can be added, carried on through the autosave (the
 * real ?resume path; the dev buttons are not in the preview build).
 */
async function withPlayableCard(page: Page) {
  const run = forceEngagement(
    newRun(defaultContent.config, 5),
    (s) => s.exchange?.step === 'assign' && legalActions(s).some((a) => a.type === 'playOption'),
  )
  if (!run) throw new Error('no playable card came up')
  await page.goto('/play')
  await page.evaluate(
    (raw) => localStorage.setItem('survival.autosave.v1', raw),
    JSON.stringify(exportRun(run)),
  )
  await page.goto('/play?resume')
  const modal = page.getByRole('dialog', { name: /^Engagement/ })
  await expect(modal).toBeVisible()
  return modal
}

/** A touch gesture through CDP (Playwright's touchscreen only taps): press, move in steps, lift. */
async function swipe(
  cdp: CDPSession,
  from: { x: number; y: number },
  to: { x: number; y: number },
  steps = 12,
) {
  const point = (x: number, y: number) => [{ x, y, id: 1 }]
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: point(from.x, from.y),
  })
  for (let i = 1; i <= steps; i++) {
    const x = from.x + ((to.x - from.x) * i) / steps
    const y = from.y + ((to.y - from.y) * i) / steps
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: point(x, y) })
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}

/** The centre of a box (a missing box fails the test). */
const centre = (b: { x: number; y: number; width: number; height: number } | null) => {
  if (!b) throw new Error('the element has no box')
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
}

test('touch: dragging a playable card up onto the felt plays it, and the page does not scroll', async ({
  page,
}) => {
  const modal = await withPlayableCard(page)
  const hand = modal.getByRole('list', { name: 'Your hand' })
  const card = hand.locator('button[data-playable]').first()
  const before = await hand.getByRole('button').count()
  const name = (await card.getAttribute('aria-label')) ?? ''
  const scrollY = await page.evaluate(() => window.scrollY)
  const cdp = await page.context().newCDPSession(page)
  const from = centre(await card.boundingBox())
  const to = centre(await modal.getByLabel('Dice', { exact: true }).boundingBox())
  await swipe(cdp, from, to)
  // Played: the hand has 1 card fewer, or the felt asks which option (a 2-option card).
  await expect
    .poll(async () => {
      const chips = await modal.getByRole('group', { name: /^Play / }).count()
      const left = await hand.locator('li:not([hidden]) button').count()
      return chips > 0 || left < before
    })
    .toBe(true)
  expect(name).toMatch(/^Play /)
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollY)
})

test('touch: a sideways swipe on the hand scrolls it and plays nothing', async ({ page }) => {
  const modal = await withPlayableCard(page)
  const hand = modal.getByRole('list', { name: 'Your hand' })
  // A narrow strip so the hand overflows sideways.
  await hand.evaluate((el) => {
    el.style.maxWidth = '160px'
  })
  const before = await hand.getByRole('button').count()
  const card = hand.locator('button[data-playable]').first()
  const cdp = await page.context().newCDPSession(page)
  const from = centre(await card.boundingBox())
  await swipe(cdp, from, { x: from.x - 120, y: from.y + 2 })
  await page.waitForTimeout(300)
  expect(await hand.locator('li:not([hidden]) button').count()).toBe(before)
  expect(await modal.getByRole('group', { name: /^Play / }).count()).toBe(0)
  expect(await card.getAttribute('data-lifted')).toBeNull()
  expect(await hand.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
})
