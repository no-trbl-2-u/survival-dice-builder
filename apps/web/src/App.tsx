import { ConfigPage } from './config/ConfigPage.tsx'
import { CreditsPage } from './credits/CreditsPage.tsx'
import { DebugPage } from './debug/DebugPage.tsx'
import { HomePage } from './home/HomePage.tsx'
import { PlayPage } from './play/PlayPage.tsx'
import { matchRoute, type Route } from './router.tsx'
import { TileSheet } from './tiles/TileSheet.tsx'

const routes: readonly Route[] = [
  {
    path: '/',
    title: 'Survival Dice-Builder',
    render: () => <HomePage />,
  },
  { path: '/play', title: 'Play', render: () => <PlayPage /> },
  { path: '/config', title: 'Config', render: () => <ConfigPage /> },
  { path: '/tiles', title: 'Tile sheet', render: () => <TileSheet /> },
  { path: '/debug', title: 'Engine console', render: () => <DebugPage /> },
  { path: '/credits', title: 'Credits', render: () => <CreditsPage /> },
]

/** App shell: navigation plus the page for the current path. */
export function App() {
  const route = matchRoute(routes, window.location.pathname)
  return (
    <main className="app">
      <nav aria-label="Main" className="nav">
        <a href="/">Home</a>
        <a href="/play">Play</a>
        <a href="/config">Config</a>
        <a href="/tiles">Tiles</a>
        <a href="/debug">Debug</a>
        <a href="/credits">Credits</a>
      </nav>
      <h1>{route.title}</h1>
      {route.render()}
    </main>
  )
}
