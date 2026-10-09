import { describe, expect, it } from 'vitest'
import { documentTitle, matchRoute, SITE_NAME, type Route } from './router.tsx'

const routes: Route[] = [
  { path: '/', title: 'Home', render: () => null },
  { path: '/tiles', title: 'Tiles', render: () => null },
]
const notFound: Route = { path: '', title: 'Page not found', render: () => null }

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
    const page = { path: '/tiles', title: 'Tile sheet', render: () => null }
    expect(documentTitle(page)).toBe('Tile sheet - Survival Dice-Builder')
    expect(documentTitle({ ...page, path: '/', title: SITE_NAME })).toBe(SITE_NAME)
  })
})
