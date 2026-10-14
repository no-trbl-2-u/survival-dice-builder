import { ConfigPage } from './config/ConfigPage.tsx'
import { CreditsPage } from './credits/CreditsPage.tsx'
import { DebugPage } from './debug/DebugPage.tsx'
import { DecisionsPage } from './decisions/DecisionsPage.tsx'
import { HomePage } from './home/HomePage.tsx'
import { NotFoundPage } from './notfound/NotFoundPage.tsx'
import { PlayPage } from './play/PlayPage.tsx'
import { matchRoute, SITE_NAME, type Route } from './router.tsx'
import { TileSheet } from './tiles/TileSheet.tsx'

/** The nav links, in order; each path is a route below, and each label is its page heading. */
export const NAV: readonly (readonly [path: string, label: string])[] = [
  ['/', 'Home'],
  ['/play', 'Play'],
  ['/config', 'Config'],
  ['/tiles', 'Tile sheet'],
  ['/decisions', 'Decisions'],
  ['/debug', 'Engine console'],
  ['/credits', 'Credits'],
]

/**
 * Every page: the nav, the tab title, and the served HTML head all read this table. A `page`
 * is rendered to static HTML at build time; a `shell` is served with its own head and an empty
 * root, because its first view depends on this browser's saved runs.
 */
export const routes: readonly Route[] = [
  {
    path: '/',
    title: SITE_NAME,
    description: 'Defend the base, build your dice, survive one more round.',
    served: 'page',
    render: () => <HomePage />,
  },
  // The board needs the height; the nav's current tab already says "Play".
  {
    path: '/play',
    title: 'Play',
    description:
      'Start a run in the browser: defend the base together at one screen, build your dice, and last as many rounds as you can.',
    served: 'shell',
    render: () => <PlayPage />,
    quietTitle: true,
  },
  {
    path: '/config',
    title: 'Config',
    description:
      'Change any rule value or option for a playtest. Saved in this browser only; new runs use it.',
    served: 'page',
    render: () => <ConfigPage />,
  },
  {
    path: '/tiles',
    title: 'Tile sheet',
    description:
      'The map tiles the game is built from, each hex listed by position with its terrain and site.',
    served: 'page',
    render: () => <TileSheet />,
  },
  {
    path: '/decisions',
    title: 'Decisions',
    description:
      'The rule readings the game plays with while they wait on the designer, the setting each one uses, and the open checks.',
    served: 'page',
    render: () => <DecisionsPage />,
  },
  {
    path: '/debug',
    title: 'Engine console',
    description: 'Play the rules engine one action at a time and read its state.',
    served: 'shell',
    render: () => <DebugPage />,
  },
  {
    path: '/credits',
    title: 'Credits',
    description: 'Every asset in the game, with its license.',
    served: 'page',
    render: () => <CreditsPage />,
  },
]

/** Any path no route matches; its empty path marks no nav link as current. */
export const notFound: Route = {
  path: '',
  title: 'Page not found',
  description: 'There is no page at this address.',
  served: 'page',
  noindex: true,
  render: (pathname) => <NotFoundPage path={pathname} />,
}

/**
 * The route for a pathname, or the not-found route.
 *
 * @param pathname - `window.location.pathname`, or the path being prerendered.
 */
export function routeFor(pathname: string): Route {
  return matchRoute(routes, pathname, notFound)
}
