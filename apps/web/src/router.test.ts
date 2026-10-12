import { describe, expect, it } from 'vitest'
import { documentTitle, matchRoute, SITE_NAME, type Route } from './router.tsx'

const page = { description: 'A page.', served: 'page', render: () => null } as const
const routes: Route[] = [
  { ...page, path: '/', title: 'Home' },
  { ...page, path: '/tiles', title: 'Tiles' },
]
const notFound: Route = { ...page, path: '', title: 'Page not found' }

describe('matchRoute', () => {
  it('matches exact paths and ignores a trailing slash', () => {
    expect(matchRoute(routes, '/tiles', notFound).title).toBe('Tiles')
    expect(matchRoute(routes, '/tiles/', notFound).title).toBe('Tiles')
    expect(matchRoute(routes, '', notFound).title).toBe('Home')
  })

  it('gives unknown paths the not-found route, not the home page', () => {
    expect(matchRoute(routes, '/nope', notFound).title).toBe('Page not found')
    expect(matchRoute(routes, '/tile', notFound).title).toBe('Page not found')
  })
})

describe('documentTitle', () => {
  it('puts the page title before the site name, and keeps the home page bare', () => {
    const tiles = { ...page, path: '/tiles', title: 'Tile sheet' }
    expect(documentTitle(tiles)).toBe('Tile sheet - Survival Dice-Builder')
    expect(documentTitle({ ...tiles, path: '/', title: SITE_NAME })).toBe(SITE_NAME)
  })
})
