import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { routeFor } from './routes.tsx'
import '@fontsource/alfa-slab-one/400.css'
import '@fontsource-variable/bitter/wght.css'
import './styles/tokens.css'
import './styles/wood.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element in index.html')

const pathname = window.location.pathname
const route = routeFor(pathname)
const app = (
  <StrictMode>
    <App pathname={pathname} />
  </StrictMode>
)
// The page's chunk is loaded first, so the first render matches the prerendered HTML. A page
// prerendered for this route is hydrated; a shell (/play, /debug) or a page served for another
// path (`vite dev` serves index.html everywhere) is rendered fresh.
void Promise.resolve(route.load?.()).then(() => {
  if (root.dataset.page === route.path) hydrateRoot(root, app)
  else createRoot(root).render(app)
})
