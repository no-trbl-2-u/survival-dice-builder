import { useEffect } from 'react'
import { ConfigPage } from './config/ConfigPage.tsx'
import { CreditsPage } from './credits/CreditsPage.tsx'
import { DebugPage } from './debug/DebugPage.tsx'
import { DecisionsPage } from './decisions/DecisionsPage.tsx'
import { HomePage } from './home/HomePage.tsx'
import { NotFoundPage } from './notfound/NotFoundPage.tsx'
import { PlayPage } from './play/PlayPage.tsx'
import { documentTitle, matchRoute, SITE_NAME, type Route } from './router.tsx'
import { TileSheet } from './tiles/TileSheet.tsx'

/** The nav links, in order; each path is a route below, and each label is its page heading. */
const NAV: readonly (readonly [path: string, label: string])[] = [
  ['/', 'Home'],
  ['/play', 'Play'],
  ['/config', 'Config'],
  ['/tiles', 'Tile sheet'],
  ['/decisions', 'Decisions'],
  ['/debug', 'Engine console'],
  ['/credits', 'Credits'],
]

const routes: readonly Route[] = [
  {
    path: '/',
    title: SITE_NAME,
    render: () => <HomePage />,
  },
  // The board needs the height; the nav's current tab already says "Play".
  { path: '/play', title: 'Play', render: () => <PlayPage />, quietTitle: true },
  { path: '/config', title: 'Config', render: () => <ConfigPage /> },
  { path: '/tiles', title: 'Tile sheet', render: () => <TileSheet /> },
  { path: '/decisions', title: 'Decisions', render: () => <DecisionsPage /> },
  { path: '/debug', title: 'Engine console', render: () => <DebugPage /> },
  { path: '/credits', title: 'Credits', render: () => <CreditsPage /> },
]

/** Any path no route matches; its empty path marks no nav link as current. */
const notFound: Route = {
  path: '',
  title: 'Page not found',
  noindex: true,
  render: () => <NotFoundPage path={window.location.pathname} />,
}

/**
 * App shell: a skip link, the navigation in a header (the current page marked), then the page
 * title and the page itself in the main landmark. The
 * not-found page also gets a robots noindex tag, so a mistyped URL is not indexed as a page.
 */
export function App() {
  const route = matchRoute(routes, window.location.pathname, notFound)
  useEffect(() => {
    document.title = documentTitle(route)
    if (!route.noindex) return
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.append(robots)
    return () => robots.remove()
  }, [route])
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header>
        <nav aria-label="Main" className="nav">
          {NAV.map(([path, label]) => (
            <a key={path} href={path} aria-current={path === route.path ? 'page' : undefined}>
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <h1 className={route.quietTitle ? 'visually-hidden' : undefined}>{route.title}</h1>
        {route.render()}
      </main>
    </div>
  )
}
