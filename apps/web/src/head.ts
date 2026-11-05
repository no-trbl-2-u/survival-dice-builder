import { documentTitle, type Route } from './router.tsx'

/** The deployed site; canonical links and link previews name pages under it. */
export const SITE_URL = 'https://survival-dice-builder.pages.dev'

/** The link-preview image every page names (rendered by `scripts/og-card.mjs`). */
export const OG_IMAGE = Object.freeze({
  url: `${SITE_URL}/og-card.png`,
  width: 1200,
  height: 630,
  alt: 'Survival Dice-Builder: a die on a hex tile, with the line "Defend the base together, build your dice, survive one more round."',
})

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

/**
 * The home page's schema.org `WebSite` object, which search engines read for the site name in
 * a result. Only the home page names it: that is where they look for it.
 *
 * @param head - the home page's head.
 */
export function websiteJsonLd(head: Head): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Survival Dice-Builder',
    url: `${SITE_URL}/`,
    description: head.description,
  }
  // `<` written as \u003c, so no text can close the script element early.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * The per-page tags for the `<!--app-head-->` marker: description, link preview (with the
 * shared preview image), the canonical link (or robots noindex on the not-found page), and on
 * the home page its `WebSite` structured data.
 *
 * @param head - the page's head.
 */
export function headTags(head: Head): string {
  const tags = [
    `<meta name="description" content="${escapeHtml(head.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(head.description)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Survival Dice-Builder" />',
    `<meta property="og:image" content="${escapeHtml(OG_IMAGE.url)}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(OG_IMAGE.alt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    ...(head.url
      ? [
          `<meta property="og:url" content="${escapeHtml(head.url)}" />`,
          `<link rel="canonical" href="${escapeHtml(head.url)}" />`,
        ]
      : []),
    ...(head.noindex ? ['<meta name="robots" content="noindex" />'] : []),
    ...(head.url === `${SITE_URL}/`
      ? [`<script type="application/ld+json">${websiteJsonLd(head)}</script>`]
      : []),
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
