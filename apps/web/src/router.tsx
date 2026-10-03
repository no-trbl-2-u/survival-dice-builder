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

/** The site name, used alone on the home page and after every other page's title. */
export const SITE_NAME = 'Survival Dice-Builder'

/**
 * The browser tab title for a route: "Tile sheet - Survival Dice-Builder", or the bare site
 * name on the home page.
 *
 * @param route - the current route.
 */
export function documentTitle(route: Route): string {
  return route.title === SITE_NAME ? SITE_NAME : `${route.title} - ${SITE_NAME}`
}
