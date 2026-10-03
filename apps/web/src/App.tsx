import { useEffect } from 'react'
import { ConfigPage } from './config/ConfigPage.tsx'
import { CreditsPage } from './credits/CreditsPage.tsx'
import { DebugPage } from './debug/DebugPage.tsx'
import { DecisionsPage } from './decisions/DecisionsPage.tsx'
import { HomePage } from './home/HomePage.tsx'
import { PlayPage } from './play/PlayPage.tsx'
import { documentTitle, matchRoute, SITE_NAME, type Route } from './router.tsx'
import { TileSheet } from './tiles/TileSheet.tsx'

/** The nav links, in order; each path is a route below. */
const NAV: readonly (readonly [path: string, label: string])[] = [
  ['/', 'Home'],
  ['/play', 'Play'],
  ['/config', 'Config'],
  ['/tiles', 'Tiles'],
  ['/decisions', 'Decisions'],
  ['/debug', 'Debug'],
  ['/credits', 'Credits'],
]

const routes: readonly Route[] = [
  {
    path: '/',
    title: SITE_NAME,
    render: () => <HomePage />,
  },
  { path: '/play', title: 'Play', render: () => <PlayPage /> },
  { path: '/config', title: 'Config', render: () => <ConfigPage /> },
  { path: '/tiles', title: 'Tile sheet', render: () => <TileSheet /> },
  { path: '/decisions', title: 'Decisions', render: () => <DecisionsPage /> },
  { path: '/debug', title: 'Engine console', render: () => <DebugPage /> },
  { path: '/credits', title: 'Credits', render: () => <CreditsPage /> },
]

/** App shell: navigation (the current page marked), the page title, and the page itself. */
export function App() {
  const route = matchRoute(routes, window.location.pathname)
  useEffect(() => {
    document.title = documentTitle(route)
  }, [route])
  return (
    <main className="app">
      <nav aria-label="Main" className="nav">
        {NAV.map(([path, label]) => (
          <a key={path} href={path} aria-current={path === route.path ? 'page' : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <h1>{route.title}</h1>
      {route.render()}
    </main>
  )
}
