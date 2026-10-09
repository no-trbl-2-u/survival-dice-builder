import type { ReactNode } from 'react'

/** A route: its path and the page it renders. */
export type Route = Readonly<{
  path: string
  title: string
  render: () => ReactNode
  /** Keep the page title for screen readers only (the nav already marks the page). */
  quietTitle?: boolean
  /** Ask search engines not to index the page (every path is served with status 200). */
  noindex?: boolean
}>

/**
 * Picks the route for a pathname. Exact match; trailing slashes are ignored, and an empty path
 * is the home page. Unknown paths get the not-found route: Cloudflare's `_redirects` serves
 * index.html for every path, so the app itself must say that a link was wrong.
 *
 * @param routes - the app's routes.
 * @param pathname - `window.location.pathname`.
 * @param notFound - the route for a path no route matches.
 */
export function matchRoute(routes: readonly Route[], pathname: string, notFound: Route): Route {
  const path = pathname.replace(/\/+$/, '') || '/'
  return routes.find((r) => r.path === path) ?? notFound
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
