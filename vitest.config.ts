import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'packages',
          environment: 'node',
          include: ['packages/*/src/**/*.test.ts', 'tools/*/src/**/*.test.ts'],
        },
      },
      'apps/web',
    ],
  },
})
