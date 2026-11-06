import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { SITEMAP_PATHS } from './routes.tsx'

const SITEMAP = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'sitemap.xml',
)
const ORIGIN = 'https://survival-dice-builder.pages.dev'

describe('public/sitemap.xml', () => {
  const listed = [...fs.readFileSync(SITEMAP, 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1] ?? '',
  )

  it('lists every route but a shell-served design tool, once each, in route order', () => {
    expect(listed).toEqual(SITEMAP_PATHS.map((p) => `${ORIGIN}${p}`))
  })

  it('leaves out the engine console, which serves an empty shell', () => {
    expect(SITEMAP_PATHS).not.toContain('/debug')
    expect(SITEMAP_PATHS).toContain('/play')
  })
})
