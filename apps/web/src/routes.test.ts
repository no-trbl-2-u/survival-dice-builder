import { describe, expect, it } from 'vitest'
import { FILES } from './entry-server.tsx'
import { NAV, notFound, routeFor, routes } from './routes.tsx'

describe('routes', () => {
  it('has a route for every nav link, and a nav link for every route', () => {
    expect(NAV.map(([path]) => path).sort()).toEqual(routes.map((r) => r.path).sort())
  })

  it('groups the design aids apart from the game pages', () => {
    expect(NAV.filter(([, , group]) => group === 'tool').map(([path]) => path)).toEqual([
      '/tiles',
      '/decisions',
      '/debug',
    ])
  })

  it('gives every route a one-sentence description', () => {
    for (const r of [...routes, notFound]) expect(r.description).toMatch(/^[A-Z].*\.$/)
  })

  it('finds a route by path and the not-found page for any other path', () => {
    expect(routeFor('/tiles/').path).toBe('/tiles')
    expect(routeFor('/tile')).toBe(notFound)
  })
})

describe('FILES', () => {
  it('serves every route and the not-found page, each from its own file', () => {
    expect(FILES.map((f) => f.page).sort()).toEqual([...routes.map((r) => r.path), ''].sort())
    expect(new Set(FILES.map((f) => f.file)).size).toBe(FILES.length)
    expect(FILES.find((f) => f.page === '/')?.file).toBe('index.html')
    expect(FILES.find((f) => f.page === '')?.file).toBe('404.html')
  })

  it('renders the not-found file for a path no route has', () => {
    const missing = FILES.find((f) => f.file === '404.html')!
    expect(routeFor(missing.path)).toBe(notFound)
  })

  it('prerenders the pages and leaves /play and /debug as shells', () => {
    const shells = FILES.filter((f) => !f.prerender).map((f) => f.page)
    expect(shells.sort()).toEqual(['/debug', '/play'])
  })
})
