import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App.tsx'
import { headFor, type Head } from './head.ts'
import { notFound, routes } from './routes.tsx'

export { pageHtml } from './head.ts'

/**
 * A file the build writes: its name in `dist`, the path it is rendered for, the route path the
 * client checks before hydrating (`data-page`), whether its body is prerendered, and its head.
 */
export type ServedFile = Readonly<{
  file: string
  path: string
  page: string
  prerender: boolean
  head: Head
}>

/** Any path no route has: the not-found page is rendered for it. */
const UNKNOWN_PATH = '/404'

/**
 * Every served HTML file: `index.html` for the home page, `<name>.html` for each other route
 * (Cloudflare Pages serves `tiles.html` at `/tiles`), and `404.html` for unknown paths.
 */
export const FILES: readonly ServedFile[] = [
  ...routes.map((r) => ({
    file: r.path === '/' ? 'index.html' : `${r.path.slice(1)}.html`,
    path: r.path,
    page: r.path,
    prerender: r.served === 'page',
    head: headFor(r),
  })),
  {
    file: '404.html',
    path: UNKNOWN_PATH,
    page: notFound.path,
    prerender: true,
    head: headFor(notFound),
  },
]

/** Loads every lazy page's chunk; `renderPage` needs them loaded. */
export async function loadPages(): Promise<void> {
  await Promise.all(routes.map((r) => r.load?.()))
}

/**
 * The app rendered to HTML for a path, as the browser's first render will see it: storage is
 * not read (`useClient` is false), so /config shows the defaults. Call `loadPages` first.
 *
 * @param path - the path to render (a path no route has renders the not-found page).
 */
export function renderPage(path: string): string {
  return renderToString(
    <StrictMode>
      <App pathname={path} />
    </StrictMode>,
  )
}
