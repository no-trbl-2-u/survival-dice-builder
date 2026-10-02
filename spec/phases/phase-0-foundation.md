# Phase 0 — Foundation

**Goal:** a repository where any agent can add code and tests with the same tools.

## Scope

- Monorepo with `packages/content`, `packages/engine`, `packages/bot`, `apps/web`, `tools/sim` (pnpm or npm workspaces).
- TypeScript strict config shared across packages.
- Vite + React app that renders an empty hex grid (7 hexes) as SVG.
- Vitest, fast-check, ESLint, Prettier configured.
- CI script: lint, type check, tests, build.
- `README.md` with setup, commands, and folder purpose. `CONTRIBUTING.md` with the coding standards from the brief.

## Acceptance criteria

- `install`, `test`, `lint`, `typecheck`, `build`, and `dev` commands all succeed on a clean checkout.
- The dev server shows a 7-hex tile.
- One sample engine test and one sample property test pass in CI.
