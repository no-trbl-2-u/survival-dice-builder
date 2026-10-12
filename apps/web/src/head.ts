import { documentTitle, type Route } from './router.tsx'

/** The deployed site; canonical links and link previews name pages under it. */
export const SITE_URL = 'https://survival-dice-builder.pages.dev'

/** What a page's served `<head>` says about it. */
export type Head = Readonly<{
  title: string
  description: string
  /** The page's own address, or null for the not-found page (it has none). */
  url: string | null
  noindex: boolean
}>

/**
 * The served head for a route: its tab title, description, and address.
 *
 * @param route - the route being served.
 */
export function headFor(route: Route): Head {
  return {
    title: documentTitle(route),
    description: route.description,
    url: route.noindex ? null : `${SITE_URL}${route.path}`,
    noindex: route.noindex ?? false,
  }
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * The per-page tags for the `<!--app-head-->` marker: description, link preview, and the
 * canonical link (or robots noindex on the not-found page).
 *
 * @param head - the page's head.
 */
export function headTags(head: Head): string {
  const tags = [
    `<meta name="description" content="${escapeHtml(head.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(head.description)}" />`,
    ...(head.url
      ? [
          `<meta property="og:url" content="${escapeHtml(head.url)}" />`,
          `<link rel="canonical" href="${escapeHtml(head.url)}" />`,
        ]
      : []),
    ...(head.noindex ? ['<meta name="robots" content="noindex" />'] : []),
  ]
  return tags.join('\n    ')
}

const TITLE = /<title>[^<]*<\/title>/
const HEAD_MARK = '<!--app-head-->'
const HTML_MARK = '<div id="root"><!--app-html--></div>'

/**
 * A served page: the built `index.html` with the page's title, head tags, and prerendered body.
 * Throws when the template lost a marker, so a changed `index.html` fails the build instead of
 * shipping pages without their head.
 *
 * @param template - the built `index.html`.
 * @param head - the page's head.
 * @param body - the prerendered app, or `null` for a shell (an empty root).
 * @param page - the route path the body was rendered for (`data-page`, read before hydrating).
 */
export function pageHtml(template: string, head: Head, body: string | null, page: string): string {
  for (const mark of [HEAD_MARK, HTML_MARK]) {
    if (!template.includes(mark)) throw new Error(`index.html has no ${mark}`)
  }
  if (!TITLE.test(template)) throw new Error('index.html has no <title>')
  const root =
    body === null
      ? '<div id="root"></div>'
      : `<div id="root" data-page="${escapeHtml(page)}">${body}</div>`
  return template
    .replace(TITLE, () => `<title>${escapeHtml(head.title)}</title>`)
    .replace(HEAD_MARK, () => headTags(head))
    .replace(HTML_MARK, () => root)
}
