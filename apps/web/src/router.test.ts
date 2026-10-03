import { describe, expect, it } from 'vitest'
import { matchRoute, type Route } from './router.tsx'

const routes: Route[] = [
  { path: '/', title: 'Home', render: () => null },
  { path: '/tiles', title: 'Tiles', render: () => null },
]

describe('matchRoute', () => {
  it('matches exact paths and ignores a trailing slash', () => {
    expect(matchRoute(routes, '/tiles').title).toBe('Tiles')
    expect(matchRoute(routes, '/tiles/').title).toBe('Tiles')
  })

  it('falls back to the first route', () => {
    expect(matchRoute(routes, '/nope').title).toBe('Home')
    expect(matchRoute(routes, '').title).toBe('Home')
  })
})
