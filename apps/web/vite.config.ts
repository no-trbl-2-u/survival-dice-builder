import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
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

export default defineConfig({
  plugins: [react()],
  define: { __APP_COMMIT__: JSON.stringify(commit()) },
  // The 3D dice chunk (three.js, ~530 kB) loads only when the 3D toggle is on.
  build: { chunkSizeWarningLimit: 600 },
  test: {
    name: 'web',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
