import { HexTile } from './map/HexTile.tsx'

/** Phase 2 shell: the title and one 7-hex map tile. Routing arrives in phase 4. */
export function App() {
  return (
    <main className="app">
      <h1>Survival Dice-Builder</h1>
      <HexTile center={{ q: 0, r: 0 }} />
    </main>
  )
}
