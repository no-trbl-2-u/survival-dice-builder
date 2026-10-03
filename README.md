# Survival Dice-Builder

Defend the base, build your dice, survive one more round.

A playable web prototype of a 1 to 4 player co-op survival dice-builder (Spec v1). Live at
https://survival-dice-builder.pages.dev.

## Setup

Requires Node 22.18+ and pnpm 9 (`corepack enable pnpm`).

```bash
pnpm install
pnpm --filter @survival/web exec playwright install chromium
pnpm dev
```

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Vite dev server for the web app |
| `pnpm test` | Vitest in watch mode |
| `pnpm lint` | ESLint + Prettier check |
| `pnpm typecheck` | `tsc --noEmit` in every workspace |
| `pnpm build` | Production build of `apps/web` |
| `pnpm e2e` | Playwright against the production build on port 4173 |
| `pnpm verify` | The full gate: lint, typecheck, test, build, e2e |
| `pnpm deploy:check` | After a push: waits for the Cloudflare Pages deploy of HEAD |

## Folders

| Folder | Purpose |
|---|---|
| `spec/` | The designer's spec. `spec/01-spec-v1-rules.md` wins over every other file. |
| `packages/content` | Game content and every rule number, as JSON validated by Zod |
| `packages/engine` | The pure rules engine (no DOM, no I/O, seeded RNG) |
| `packages/bot` | Autoplay bot for tests and batch runs |
| `apps/web` | React + Vite web app |
| `tools/sim` | Node CLI for batch runs and tuning reports |
| `plan/`, `skills/`, `.claude/` | The nexus autonomous build loop (see `agents.md`) |

See `CONTRIBUTING.md` for the coding standards.
