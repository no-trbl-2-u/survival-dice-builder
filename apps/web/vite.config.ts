import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  // The 3D dice chunk (three.js, ~530 kB) loads only when the 3D toggle is on.
  build: { chunkSizeWarningLimit: 600 },
  test: {
    name: 'web',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
