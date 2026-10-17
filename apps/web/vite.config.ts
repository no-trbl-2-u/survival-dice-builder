import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/** The commit this build is from (CI sets GITHUB_SHA); run exports record it. */
function commit(): string {
  const sha = process.env.GITHUB_SHA
  if (sha) return sha.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  } catch {
    return 'unknown'
  }
}

/** The release version: the root package.json is the one source. */
const version = (
  JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')) as {
    version: string
  }
).version

/**
 * `vite preview` answers a path with no file the way Cloudflare Pages does: `404.html` with
 * status 404 (phase 40). Runs after Vite has served the files and mapped `/tiles` to
 * `tiles.html`.
 */
function notFoundPage(): Plugin {
  return {
    name: 'not-found-page',
    configurePreviewServer(server) {
      const file = path.join(server.config.root, server.config.build.outDir, '404.html')
      return () => {
        server.middlewares.use((req, res, next) => {
          const page = req.method === 'GET' || req.method === 'HEAD'
          if (!page || req.url?.split('?')[0]?.endsWith('.html') || !existsSync(file)) return next()
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html')
          res.end(readFileSync(file))
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), notFoundPage()],
  // Each page is its own HTML file; an unknown path is a 404, not the home page.
  appType: 'mpa',
  define: { __APP_COMMIT__: JSON.stringify(commit()), __APP_VERSION__: JSON.stringify(version) },
  // The 3D dice chunk (three.js, ~530 kB) loads only when the 3D toggle is on, and each page
  // but home is its own chunk (routes.tsx). The CSS stays one file in the head, so a
  // prerendered page is styled before its chunk arrives.
  build: { chunkSizeWarningLimit: 600, cssCodeSplit: false },
  test: {
    name: 'web',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
