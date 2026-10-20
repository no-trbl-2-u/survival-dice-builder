import { HomePage } from './home/HomePage.tsx'
import { lazyPage } from './lazyPage.tsx'
import { NotFoundPage } from './notfound/NotFoundPage.tsx'
import { matchRoute, SITE_NAME, type Route } from './router.tsx'

// Every page but home and not-found is its own chunk, so the first load carries only the
// home page; the client loads a route's chunk before it renders (see main.tsx).
const play = lazyPage(() => import('./play/PlayPage.tsx').then((m) => m.PlayPage))
const config = lazyPage(() => import('./config/ConfigPage.tsx').then((m) => m.ConfigPage))
const tiles = lazyPage(() => import('./tiles/TileSheet.tsx').then((m) => m.TileSheet))
const decisions = lazyPage(() =>
  import('./decisions/DecisionsPage.tsx').then((m) => m.DecisionsPage),
)
const debug = lazyPage(() => import('./debug/DebugPage.tsx').then((m) => m.DebugPage))
const credits = lazyPage(() => import('./credits/CreditsPage.tsx').then((m) => m.CreditsPage))

/**
 * The nav links, in order; each path is a route below, and each label is its page heading.
 * A `tool` link is a design or playtest aid, shown apart from the game under `NAV_TOOLS_LABEL`.
 */
export const NAV: readonly (readonly [path: string, label: string, group: 'game' | 'tool'])[] = [
  ['/', 'Home', 'game'],
  ['/play', 'Play', 'game'],
  ['/config', 'Config', 'game'],
  ['/credits', 'Credits', 'game'],
  ['/tiles', 'Tile sheet', 'tool'],
  ['/decisions', 'Decisions', 'tool'],
  ['/debug', 'Engine console', 'tool'],
]

/** The label on the nav's group of design and playtest aids. */
export const NAV_TOOLS_LABEL = 'Design tools'

/**
 * Every page: the nav, the tab title, and the served HTML head all read this table. A `page`
 * is rendered to static HTML at build time; a `shell` is served with its own head and an empty
 * root, because its first view depends on this browser's saved runs.
 */
export const routes: readonly Route[] = [
  {
    path: '/',
    title: SITE_NAME,
    description:
      'Defend the base together, build your dice, survive one more round: a co-op survival dice-builder.',
    served: 'page',
    render: () => <HomePage />,
  },
  // The board needs the height; the nav's current tab already says "Play".
  {
    path: '/play',
    title: 'Play',
    description:
      'Start a run in the browser: defend the base together at one screen, build your dice and last as many rounds as you can.',
    served: 'shell',
    load: play.load,
    render: () => <play.Page />,
    quietTitle: true,
  },
  {
    path: '/config',
    title: 'Config',
    description:
      'Change any rule value or option for a playtest. Saved in this browser only; new runs use it.',
    served: 'page',
    load: config.load,
    render: () => <config.Page />,
  },
  {
    path: '/tiles',
    title: 'Tile sheet',
    description:
      'The map tiles the game is built from, each hex listed by position with its terrain and site.',
    served: 'page',
    load: tiles.load,
    render: () => <tiles.Page />,
  },
  {
    path: '/decisions',
    title: 'Decisions',
    description:
      'The rule readings the game plays with while they wait on the designer, the setting each one uses and the open checks.',
    served: 'page',
    load: decisions.load,
    render: () => <decisions.Page />,
  },
  {
    path: '/debug',
    title: 'Engine console',
    description: 'Play the rules engine one action at a time and read its state.',
    served: 'shell',
    load: debug.load,
    render: () => <debug.Page />,
  },
  {
    path: '/credits',
    title: 'Credits',
    description: 'Every asset in the game, with its license.',
    served: 'page',
    load: credits.load,
    render: () => <credits.Page />,
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
