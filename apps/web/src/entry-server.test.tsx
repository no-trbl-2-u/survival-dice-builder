// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { FILES, renderPage } from './entry-server.tsx'

describe('renderPage', () => {
  it('renders each prerendered page with its heading and the nav, outside a browser', () => {
    for (const f of FILES.filter((x) => x.prerender)) {
      const html = renderPage(f.path)
      expect(html).toContain('aria-label="Main"')
      const title = f.head.title.replace(/ - Survival Dice-Builder$/, '')
      expect(html).toContain(`>${title}</h1>`)
    }
  })

  it('renders /config with the defaults', () => {
    expect(renderPage('/config')).toContain('Playing with the standard rules.')
  })

  it('renders the not-found page without naming a path it cannot know', () => {
    expect(renderPage('/404')).toContain('There is no page at this address.')
  })
})
