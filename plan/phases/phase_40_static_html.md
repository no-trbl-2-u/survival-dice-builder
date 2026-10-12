# Phase 40 — Static HTML for each page

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "Static HTML for
> each page" (score 4.0, expand pass 6, re-evidenced in passes 7 and 8), promoted via oversight
> 2026-10-10; renumbered to 40 and moved to the end via oversight 2026-10-11. Still a static
> Cloudflare Pages build (bearings "static build").

## Outcome

1. **One route table** (`apps/web/src/routes.tsx`): every page's path, title, one-sentence
   description, and whether it is prerendered (`page`) or served as a shell (`shell`). The nav,
   the in-app `document.title`, and the served `<head>` all read it.
2. **Per-route head** (`apps/web/src/head.ts`, pure): `<title>`, description, `og:title`,
   `og:description`, `og:url`, and a canonical link for each route; the not-found page gets a
   robots `noindex` and no canonical. `index.html` keeps the shared tags and a `<!--app-head-->`
   marker; the root `<div>` carries `<!--app-html-->`.
3. **Prerender step** (`apps/web/scripts/prerender.mjs`, run by `pnpm build` after
   `vite build`): an SSR build of `src/entry-server.tsx`, then `renderToString` of `/`, `/tiles`,
   `/decisions`, `/credits`, and `/config` (the defaults) into `index.html`, `tiles.html`,
   `decisions.html`, `credits.html`, `config.html`; `/play` and `/debug` get `play.html` and
   `debug.html` with their own head and an empty root; `404.html` is the not-found page.
4. **Hydration.** `main.tsx` hydrates when the served page was prerendered for the current
   route (`data-page` on the root) and renders fresh otherwise. Pages that read this browser's
   storage (/config, the proposal buttons on /decisions, the not-found path) render the
   server's view first and read storage after hydration (`useClient`), so no hydration
   mismatch.
5. **A real 404.** `public/_redirects` (`/* /index.html 200`) is removed: Cloudflare Pages
   serves `404.html` with status 404 for an unknown path when the site has a top-level
   `404.html`. `vite preview` does the same through a small plugin, so the e2e sees what
   production serves.

## Routes / API / CLI surface

- No new routes. `/tiles` is served from `tiles.html` (Pages drops the extension); `/play`,
  `/debug` are shells with their own head; unknown paths answer 404.
- Web: `routes`, `NAV`, `routeFor(pathname)` in `routes.tsx`; `headFor(route)`, `headTags`,
  `pageHtml(template, ...)` in `head.ts`; `useClient()` in `useClient.ts`; `App` takes
  `pathname`; `renderPage`, `PAGES` in `entry-server.tsx`.

## Tests

- `head.test.ts`: every route gets its own title, description, canonical, and `og:url`; the
  not-found head has noindex and no canonical; text is HTML-escaped; `pageHtml` fills both
  markers and fails loudly when the template lost one.
- `routes.test.ts`: every nav link is a route; every route has a description; the prerender
  list covers every route plus the not-found page, with distinct file names.
- `entry-server.test.tsx`: each prerendered page renders its h1 and nav to a string; /config
  renders the defaults.
- `NotFoundPage.test.tsx`: names the path on the client.
- e2e (`static.spec.ts`): a plain HTTP fetch (no JavaScript) of every route has its title,
  description, canonical, and `og:url`; the prerendered pages carry their h1 and lede; /play
  and /debug carry their own head; an unknown path answers 404 with the not-found page and
  noindex; loading each prerendered page with JavaScript logs no hydration error. The old shell
  tests in `smoke.spec.ts` move to the per-route reading.

## Decisions made upfront — DO NOT ASK

- **`<name>.html`, not `<name>/index.html`.** Pages serves `tiles.html` at `/tiles` and
  redirects `/tiles/index.html` paths to a trailing slash; the sitemap lists paths without one.
- **Prerender with Vite's SSR build, no new dependency.** `react-dom/server` is already
  installed with `react-dom`.
- **/play and /debug are shells.** Their first view depends on saved runs and the seed in the
  URL; the head is what unfurlers read.
- **The 404 page cannot know the path at build time.** It says "There is no page at this
  address." until hydration, then names the path.
- Route descriptions live in the route table next to the titles (the titles are already
  there); they carry no rule numbers (the rule-number scan covers them).
- The SSR bundle goes to `node_modules/.ssr` (ignored everywhere, never deployed).
- No engine, content, `OPEN-QUESTIONS.md`, or `RULES-COVERAGE.md` change.
