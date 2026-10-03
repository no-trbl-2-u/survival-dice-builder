import { HexTile } from './map/HexTile.tsx'
import { matchRoute, type Route } from './router.tsx'
import { TileSheet } from './tiles/TileSheet.tsx'

const routes: readonly Route[] = [
  {
    path: '/',
    title: 'Survival Dice-Builder',
    render: () => <HexTile center={{ q: 0, r: 0 }} />,
  },
  { path: '/tiles', title: 'Tile sheet', render: () => <TileSheet /> },
]

/** App shell: navigation plus the page for the current path. */
export function App() {
  const route = matchRoute(routes, window.location.pathname)
  return (
    <main className="app">
      <nav aria-label="Main" className="nav">
        <a href="/">Home</a>
        <a href="/tiles">Tiles</a>
      </nav>
      <h1>{route.title}</h1>
      {route.render()}
    </main>
  )
}
