import type { ReactNode } from 'react'

/** A route: its path and the page it renders. */
export type Route = Readonly<{ path: string; title: string; render: () => ReactNode }>

/**
 * Picks the route for a pathname. Exact match; trailing slashes are ignored; unknown paths
 * fall back to the first route. Cloudflare's `_redirects` serves index.html for every path.
 *
 * @param routes - the app's routes; the first one is the fallback.
 * @param pathname - `window.location.pathname`.
 */
export function matchRoute(routes: readonly Route[], pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/'
  const found = routes.find((r) => r.path === path)
  if (found) return found
  const fallback = routes[0]
  if (!fallback) throw new Error('matchRoute needs at least 1 route')
  return fallback
}
