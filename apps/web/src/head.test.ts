import { describe, expect, it } from 'vitest'
import { headFor, headTags, pageHtml, SITE_URL } from './head.ts'
import { notFound, routes } from './routes.tsx'

const TEMPLATE = `<html><head><title>Survival Dice-Builder</title>
    <!--app-head--></head><body><div id="root"><!--app-html--></div></body></html>`

describe('headFor', () => {
  it('gives every route its own title, description, and address', () => {
    const heads = routes.map(headFor)
    expect(new Set(heads.map((h) => h.title)).size).toBe(routes.length)
    expect(new Set(heads.map((h) => h.description)).size).toBe(routes.length)
    expect(heads.map((h) => h.url)).toEqual(routes.map((r) => `${SITE_URL}${r.path}`))
    expect(heads.every((h) => !h.noindex)).toBe(true)
  })

  it('gives the not-found page noindex and no address', () => {
    expect(headFor(notFound)).toMatchObject({ url: null, noindex: true })
    const tags = headTags(headFor(notFound))
    expect(tags).toContain('<meta name="robots" content="noindex" />')
    expect(tags).not.toContain('canonical')
    expect(tags).not.toContain('og:url')
  })
})

describe('headTags', () => {
  it('writes the description, the link preview, and the canonical link', () => {
    const tiles = routes.find((r) => r.path === '/tiles')!
    const tags = headTags(headFor(tiles))
    expect(tags).toContain(`<link rel="canonical" href="${SITE_URL}/tiles" />`)
    expect(tags).toContain(`<meta property="og:url" content="${SITE_URL}/tiles" />`)
    expect(tags).toContain(
      '<meta property="og:title" content="Tile sheet - Survival Dice-Builder" />',
    )
    expect(tags).toContain(`<meta name="description" content="${tiles.description}" />`)
  })

  it('escapes text', () => {
    const tags = headTags({ title: 'A & "B"', description: '<x>', url: null, noindex: false })
    expect(tags).toContain('content="A &amp; &quot;B&quot;"')
    expect(tags).toContain('content="&lt;x&gt;"')
  })
})

describe('pageHtml', () => {
  const head = headFor(routes[0]!)

  it('fills the title, the head marker, and the root with the page body', () => {
    const html = pageHtml(TEMPLATE, head, '<p>hi</p>', '/')
    expect(html).toContain('<title>Survival Dice-Builder</title>')
    expect(html).toContain('<div id="root" data-page="/"><p>hi</p></div>')
    expect(html).not.toContain('<!--app-')
    expect(html).toContain('<meta name="description"')
  })

  it('leaves the root empty and unmarked for a shell', () => {
    const play = headFor(routes.find((r) => r.path === '/play')!)
    const html = pageHtml(TEMPLATE, play, null, '/play')
    expect(html).toContain('<div id="root"></div>')
    expect(html).toContain('<title>Play - Survival Dice-Builder</title>')
  })

  it('does not read $ patterns in the body as replacement tokens', () => {
    expect(pageHtml(TEMPLATE, head, '<p>$& $1</p>', '/')).toContain('<p>$& $1</p>')
  })

  it('fails when the template lost a marker or its title', () => {
    expect(() => pageHtml(TEMPLATE.replace('<!--app-head-->', ''), head, '', '/')).toThrow(
      'app-head',
    )
    expect(() => pageHtml(TEMPLATE.replace('<!--app-html-->', ''), head, '', '/')).toThrow(
      'app-html',
    )
    expect(() => pageHtml(TEMPLATE.replace(/<title>.*<\/title>/, ''), head, '', '/')).toThrow(
      'title',
    )
  })
})
