import { useEffect } from 'react'
import { APP_COMMIT, APP_VERSION } from './appInfo.ts'
import { documentTitle, SITE_NAME } from './router.tsx'
import { NAV, NAV_TOOLS_LABEL, routeFor } from './routes.tsx'

/**
 * App shell: a skip link, the navigation in a header (the current page marked, the design tools
 * grouped after the game pages), then the page
 * title and the page itself in the main landmark. The served HTML already carries the page's
 * head (phase 40); the tab title and the not-found page's robots noindex are set again here
 * for a page reached on a server that serves one file for every path (`vite dev`).
 *
 * @param pathname - the path being shown: `window.location.pathname`, or the prerendered path.
 */
export function App({ pathname }: Readonly<{ pathname: string }>) {
  const route = routeFor(pathname)
  useEffect(() => {
    document.title = documentTitle(route)
    if (!route.noindex || document.querySelector('meta[name="robots"]')) return
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
          {NAV.filter(([, , group]) => group === 'game').map(([path, label]) => (
            <NavLink key={path} path={path} label={label} current={route.path} />
          ))}
          <div className="nav-tools" role="group" aria-labelledby="nav-tools-label">
            <span id="nav-tools-label" className="nav-tools-label">
              {NAV_TOOLS_LABEL}
            </span>
            {NAV.filter(([, , group]) => group === 'tool').map(([path, label]) => (
              <NavLink key={path} path={path} label={label} current={route.path} />
            ))}
          </div>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <h1 className={route.quietTitle ? 'visually-hidden' : undefined}>{route.title}</h1>
        {route.render(pathname)}
      </main>
      <footer className="site-footer" data-testid="site-footer">
        {SITE_NAME} v{APP_VERSION} · build {APP_COMMIT}
      </footer>
    </div>
  )
}

/** One nav link, marked as the current page when its path is the one shown. */
function NavLink({
  path,
  label,
  current,
}: Readonly<{ path: string; label: string; current: string }>) {
  return (
    <a href={path} aria-current={path === current ? 'page' : undefined}>
      {label}
    </a>
  )
}
