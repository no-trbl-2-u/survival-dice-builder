import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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

export default defineConfig({
  plugins: [react()],
  define: { __APP_COMMIT__: JSON.stringify(commit()), __APP_VERSION__: JSON.stringify(version) },
  // The 3D dice chunk (three.js, ~530 kB) loads only when the 3D toggle is on.
  build: { chunkSizeWarningLimit: 600 },
  test: {
    name: 'web',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
