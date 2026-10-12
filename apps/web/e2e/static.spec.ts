import { expect, test } from '@playwright/test'

const SITE = 'https://survival-dice-builder.pages.dev'

/** Every route as served (phase 40): its tab title, a line of its copy, or null for a shell. */
const ROUTES: readonly (readonly [path: string, title: string, copy: string | null])[] = [
  ['/', 'Survival Dice-Builder', 'Defend the base, build your dice'],
  ['/tiles', 'Tile sheet - Survival Dice-Builder', 'Proposed layouts for review'],
  ['/decisions', 'Decisions - Survival Dice-Builder', 'wait on the designer'],
  ['/credits', 'Credits - Survival Dice-Builder', 'Every asset in the game, with its license.'],
  ['/config', 'Config - Survival Dice-Builder', 'Playing with the standard rules.'],
  ['/play', 'Play - Survival Dice-Builder', null],
  ['/debug', 'Engine console - Survival Dice-Builder', null],
]

const attr = (html: string, pattern: RegExp) => pattern.exec(html)?.[1] ?? null

for (const [path, title, copy] of ROUTES) {
  test(`${path} is served with its own head${copy ? ' and its copy' : ''}, no JavaScript needed`, async ({
    request,
  }) => {
    const res = await request.get(path)
    expect(res.status()).toBe(200)
    const html = await res.text()
    expect(attr(html, /<title>([^<]*)<\/title>/)).toBe(title)
    expect(attr(html, /<meta property="og:title" content="([^"]*)"/)).toBe(title)
    expect(attr(html, /<link rel="canonical" href="([^"]*)"/)).toBe(`${SITE}${path}`)
    expect(attr(html, /<meta property="og:url" content="([^"]*)"/)).toBe(`${SITE}${path}`)
    const description = attr(html, /<meta name="description" content="([^"]*)"/)
    expect(description).toMatch(/^[A-Z].*\.$/)
    expect(attr(html, /<meta property="og:description" content="([^"]*)"/)).toBe(description)
    expect(html).not.toContain('name="robots"')
    if (copy) {
      const heading = title.replace(/ - Survival Dice-Builder$/, '')
      expect(html).toContain(`<h1>${heading}</h1>`)
      expect(html).toContain(copy)
    } else {
      expect(html).toContain('<div id="root"></div>')
    }
  })
}

test('no two routes share a description', async ({ request }) => {
  const descriptions = await Promise.all(
    ROUTES.map(async ([path]) =>
      attr(await (await request.get(path)).text(), /<meta name="description" content="([^"]*)"/),
    ),
  )
  expect(new Set(descriptions).size).toBe(ROUTES.length)
})

test('an unknown path answers 404 with the not-found page and noindex', async ({ request }) => {
  const res = await request.get('/decision')
  expect(res.status()).toBe(404)
  const html = await res.text()
  expect(html).toContain('<h1>Page not found</h1>')
  expect(html).toContain('There is no page at this address.')
  expect(html).toContain('<meta name="robots" content="noindex" />')
  expect(html).not.toContain('rel="canonical"')
  // A missing file is a 404 too, as on Cloudflare Pages.
  expect((await request.get('/assets/missing.js')).status()).toBe(404)
})

for (const path of ['/', '/tiles', '/decisions', '/credits', '/config', '/decision']) {
  test(`${path} hydrates without an error`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('404')) errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // Hydrated: the nav's current page and the footer came from the served HTML, and the page
    // answers to the browser (the not-found page names the path only once it runs here).
    if (path === '/decision') {
      await expect(page.locator('main')).toContainText('There is no page at /decision.')
    }
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })
}

test("the prerendered /decisions and /config read this browser's config once hydrated", async ({
  page,
}) => {
  await page.goto('/decisions')
  await page.getByRole('button', { name: 'Try this on /play' }).first().click()
  await expect(page).toHaveURL(/\/play$/)
  await page.goto('/decisions')
  await expect(page.locator('main')).toContainText('Your config plays with this proposal now.')
  await page.goto('/config')
  await expect(page.getByTestId('config-changes')).toContainText(
    'Playing with the proposal: Forced reveal.',
  )
})
