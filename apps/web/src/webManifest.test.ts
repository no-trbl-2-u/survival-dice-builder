import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { headFor } from './head.ts'
import { SITE_NAME } from './router.tsx'
import { routes } from './routes.tsx'

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.join(WEB, '..', '..')
const shell = fs.readFileSync(path.join(WEB, 'index.html'), 'utf-8')
const manifest = JSON.parse(
  fs.readFileSync(path.join(WEB, 'public', 'manifest.webmanifest'), 'utf-8'),
) as {
  name: string
  short_name: string
  description: string
  start_url: string
  scope: string
  display: string
  theme_color: string
  background_color: string
  icons: { src: string; sizes: string; type: string; purpose: string }[]
}

/** Edge sizes and IHDR colour type of a PNG under public/. */
function png(src: string): { width: number; height: number; colourType: number } {
  const bytes = fs.readFileSync(path.join(WEB, 'public', src.replace(/^\//, '')))
  expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG')
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    colourType: bytes.readUInt8(25),
  }
}

describe('web app manifest', () => {
  it('the shell links it', () => {
    expect(shell).toContain('<link rel="manifest" href="/manifest.webmanifest" />')
  })

  it('names the site, says what it is, and opens the home page in its own window', () => {
    const home = routes.find((r) => r.path === '/')
    if (!home) throw new Error('no home route')
    expect(manifest.name).toBe(SITE_NAME)
    // Android shows up to about 12 characters under a home-screen icon.
    expect(manifest.short_name.length).toBeLessThanOrEqual(12)
    expect(manifest.description).toBe(headFor(home).description)
    expect(manifest).toMatchObject({ start_url: '/', scope: '/', display: 'standalone' })
  })

  it('gives iOS the same home-screen label as the manifest, whatever page is added', () => {
    // iOS reads apple-mobile-web-app-title, not the manifest, and falls back to the page title.
    const label = /<meta name="apple-mobile-web-app-title" content="([^"]*)" \/>/.exec(shell)?.[1]
    expect(label).toBe(manifest.short_name)
  })

  it('takes its colours from the light theme: the browser bar and the page background', () => {
    const lightTheme =
      /<meta name="theme-color" content="(#[0-9a-f]{6})" media="\(prefers-color-scheme: light\)" \/>/.exec(
        shell,
      )?.[1]
    expect(manifest.theme_color).toBe(lightTheme)
    const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'design', 'tokens.json'), 'utf-8'))
    expect(manifest.background_color).toBe(tokens.light['color-bg'])
  })

  it('lists opaque 192 and 512 icons and a maskable 512, each the size it says', () => {
    const purposes = manifest.icons.map((i) => `${i.sizes} ${i.purpose}`)
    expect(purposes).toEqual(['192x192 any', '512x512 any', '512x512 maskable'])
    for (const icon of manifest.icons) {
      expect(icon.type).toBe('image/png')
      const { width, height, colourType } = png(icon.src)
      expect(`${width}x${height}`).toBe(icon.sizes)
      // 2 (RGB) or 0 (grey) carry no alpha.
      expect([0, 2]).toContain(colourType)
    }
  })
})
