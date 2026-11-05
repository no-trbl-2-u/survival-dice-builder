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
  // Every page ends with the release line (phase 32).
  await expect(page.getByTestId('site-footer')).toHaveText(
    /^Survival Dice-Builder v\d+\.\d+\.\d+ · build \S+$/,
  )
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

test('the served /play shell carries its own link-preview tags for apps that run no JavaScript', async ({
  request,
}) => {
  const html = await (await request.get('/play')).text()
  expect(html).toContain('<meta property="og:title" content="Play - Survival Dice-Builder" />')
  expect(html).toContain(
    '<meta property="og:url" content="https://survival-dice-builder.pages.dev/play" />',
  )
  expect(html).toMatch(/property="og:description"\s+content="Start a run/)
  expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
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

test('the shell links a favicon and a home-screen icon, and both are served as images', async ({
  request,
}) => {
  const html = await (await request.get('/tiles')).text()
  expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />')
  const icon = await request.get('/favicon.svg')
  expect(icon.ok()).toBe(true)
  expect(icon.headers()['content-type']).toContain('image/svg+xml')
  expect(await icon.text()).toContain('<polygon')
  expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />')
  const touch = await request.get('/apple-touch-icon.png')
  expect(touch.ok()).toBe(true)
  expect(touch.headers()['content-type']).toContain('image/png')
})

test('the shell links a web app manifest, and its icons are served', async ({ request }) => {
  const html = await (await request.get('/play')).text()
  expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest" />')
  const res = await request.get('/manifest.webmanifest')
  expect(res.ok()).toBe(true)
  const manifest = (await res.json()) as { name: string; icons: { src: string }[] }
  expect(manifest.name).toBe('Survival Dice-Builder')
  for (const icon of manifest.icons) {
    const served = await request.get(icon.src)
    expect(served.ok()).toBe(true)
    expect(served.headers()['content-type']).toContain('image/png')
  }
})

test('every served page names both colour schemes and a browser bar colour for each', async ({
  request,
}) => {
  for (const route of ['/', '/play', '/decisions']) {
    const html = await (await request.get(route)).text()
    expect(html).toContain('<meta name="color-scheme" content="light dark" />')
    expect(html).toMatch(
      /<meta name="theme-color" content="#[0-9a-f]{6}" media="\(prefers-color-scheme: light\)" \/>/,
    )
    expect(html).toMatch(
      /<meta name="theme-color" content="#[0-9a-f]{6}" media="\(prefers-color-scheme: dark\)" \/>/,
    )
  }
})

test('the served home page names the site in WebSite structured data; other pages do not', async ({
  request,
}) => {
  const html = await (await request.get('/')).text()
  const json = /<script type="application\/ld\+json">(.*?)<\/script>/.exec(html)?.[1]
  expect(JSON.parse(json ?? 'null')).toMatchObject({
    '@type': 'WebSite',
    name: 'Survival Dice-Builder',
    url: 'https://survival-dice-builder.pages.dev/',
  })
  expect(await (await request.get('/play')).text()).not.toContain('ld+json')
})

test('the sitemap is served as XML, lists every nav page, and robots.txt names it', async ({
  page,
  request,
}) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBe(true)
  expect(sitemap.headers()['content-type']).toMatch(/xml/)
  const listed = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1] ?? '').pathname,
  )
  await page.goto('/')
  const nav = await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link')
    .evaluateAll((links) => links.map((a) => new URL((a as HTMLAnchorElement).href).pathname))
  expect([...listed].sort()).toEqual([...nav].sort())
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Sitemap: https://survival-dice-builder.pages.dev/sitemap.xml')
})
