import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /touch\.spec\.ts/,
    },
    // A touch phone (isMobile, hasTouch): card drag with real touch input (phase 24).
    { name: 'mobile-touch', use: { ...devices['Pixel 7'] }, testMatch: /touch\.spec\.ts/ },
  ],
  // Hermetic: e2e runs against the production build on its own port, never the dev server.
  webServer: {
    command: 'pnpm preview',
    port: PORT,
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
