// Phase 40: after `vite build`, write one HTML file per page. Builds `src/entry-server.tsx`
// for Node, renders each prerendered route into the built index.html, and writes the shells
// (/play, /debug) and 404.html with their own head. See plan/phases/phase_40_static_html.md.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = new URL('../dist/', import.meta.url)
// Never deployed: node_modules is ignored by git, lint, and the deploy.
const ssrDir = new URL('../node_modules/.ssr/', import.meta.url)

await build({
  root,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: fileURLToPath(ssrDir),
    emptyOutDir: true,
    copyPublicDir: false,
  },
})

const { FILES, loadPages, pageHtml, renderPage } = await import(
  new URL('entry-server.js', ssrDir).href
)
await loadPages()
const template = readFileSync(new URL('index.html', dist), 'utf-8')
for (const f of FILES) {
  const body = f.prerender ? renderPage(f.path) : null
  writeFileSync(new URL(f.file, dist), pageHtml(template, f.head, body, f.page))
  console.log(`prerender: ${f.file}${f.prerender ? '' : ' (shell)'}`)
}
rmSync(ssrDir, { recursive: true, force: true })
