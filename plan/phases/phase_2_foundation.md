# Phase 2 — Foundation + deploy pipeline

> Agent-facing brief. Concise, opinionated, decisive. Ship
> without asking; document any judgment calls in the commit
> body. This is the first code phase — there is no shipped
> sibling to copy from.
>
> Source spec: `spec/phases/phase-0-foundation.md`. Its
> acceptance criteria are part of this phase's DoD.

## Scope

A repository where any agent can add code and tests with the
same tools, published to Cloudflare Pages on every push:

- pnpm workspaces monorepo with the five brief packages.
- Shared strict TypeScript config with project references.
- Vite + React app that renders one 7-hex tile as SVG.
- Vitest + fast-check + ESLint + Prettier + Playwright wired.
- `pnpm verify` green. `pnpm deploy:check` green.
- `README.md`, `CONTRIBUTING.md`, one `README.md` per package.

## Outputs

```
package.json                     # root: private, packageManager pnpm@9.x, scripts below
pnpm-workspace.yaml              # packages/*, apps/*, tools/*
tsconfig.base.json               # strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, ES2022, moduleResolution bundler
tsconfig.json                    # solution file: references every package
eslint.config.js                 # flat config: typescript-eslint strict, react-hooks, no-restricted-globals for engine
.prettierrc.json  .prettierignore
vitest.workspace.ts              # or root vitest.config.ts with projects
.gitignore                       # extend the adoption one (node_modules, dist, coverage, playwright-report, test-results)
README.md                        # setup, commands, folder purpose
CONTRIBUTING.md                  # coding standards from spec/03-build-brief.md "Coding standards"
RULES-COVERAGE.md                # header + empty table (rule id | function | test)
OPEN-QUESTIONS.md                # header + the 3 known items from the brief, marked "decided in bearings"

packages/content/   package.json (@survival/content) tsconfig.json README.md src/index.ts
packages/engine/    package.json (@survival/engine)  tsconfig.json README.md
                    src/index.ts                     # exports a placeholder `hexNeighbors(axial)` (pure, TSDoc @rule 3.1)
                    src/hex.ts  src/hex.test.ts      # sample unit test
                    src/hex.property.test.ts         # sample fast-check property: 6 distinct neighbours, each at distance 1
packages/bot/       package.json (@survival/bot)     tsconfig.json README.md src/index.ts (empty export)
tools/sim/          package.json (@survival/sim)     tsconfig.json README.md src/cli.ts (prints usage, exits 0)

apps/web/           package.json (@survival/web) tsconfig.json vite.config.ts index.html README.md
                    public/_redirects               # "/* /index.html 200"
                    src/main.tsx src/App.tsx
                    src/map/HexTile.tsx             # renders 7 hexes (center + 6) as SVG polygons, flat-top, from engine hex math
                    src/map/HexTile.test.tsx        # vitest + @testing-library/react: 7 polygons rendered
                    src/styles/tokens.css           # working defaults from bearings (light + dark)
                    playwright.config.ts            # webServer: vite preview --port 4173 --strictPort
                    e2e/smoke.spec.ts               # page loads, 7 hexes visible, no console errors, 375px no h-scroll

.github/workflows/ci.yml          # on PR: pnpm install --frozen-lockfile, pnpm verify
.github/workflows/deploy.yml      # on push to main: install, build, wrangler pages deploy
```

## Root scripts

```json
{
  "dev": "pnpm --filter @survival/web dev",
  "lint": "eslint . && prettier --check .",
  "format": "prettier --write .",
  "typecheck": "tsc -b",
  "test": "vitest",
  "test:run": "vitest run",
  "build": "pnpm -r --filter ./packages/** --filter ./tools/** build && pnpm --filter @survival/web build",
  "e2e": "pnpm --filter @survival/web e2e",
  "verify": "pnpm lint && pnpm typecheck && pnpm test:run && pnpm build && pnpm e2e",
  "deploy:check": "node scripts/deploy-check.mjs"
}
```

Adjust the `build` filter syntax if pnpm rejects it; the
contract is "packages build first, then the web app".

## Stack pins (versions)

Use the current stable major of each at ship time and record
exact versions in the commit body: TypeScript 5.x, Vite (latest
major), React 18+ (19 is fine), Vitest (latest major),
fast-check 3+, Playwright (latest), ESLint 9+ flat config,
typescript-eslint 8+, Prettier 3, Zod 3+ (installed in
`packages/content` now even if unused until phase 4), wrangler
3+ as a root devDependency.

## Engine purity lint

In `eslint.config.js`, for `packages/engine/**`: forbid
`Math.random`, `Date`, `class` declarations, and imports of
`node:*`, `react`, or anything in `apps/`. This enforces bearings
hard rule 10 mechanically from day one.

## Verify gate

```bash
pnpm install
pnpm verify
```

Must pass before commit. Install Playwright browsers with
`pnpm --filter @survival/web exec playwright install chromium`
(chromium only; e2e runs chromium only).

## Deploy pipeline

`.github/workflows/deploy.yml`:

- Trigger: `push` to `main`, plus `workflow_dispatch`.
- Steps: checkout, `pnpm/action-setup`, `actions/setup-node`
  (node 20, cache pnpm), `pnpm install --frozen-lockfile`,
  `pnpm build`, then
  `pnpm exec wrangler pages project create survival-dice-builder --production-branch=main || true`
  (idempotent), then
  `pnpm exec wrangler pages deploy apps/web/dist --project-name=survival-dice-builder --branch=main --commit-hash=${{ github.sha }} --commit-message="${{ github.event.head_commit.message }}"`
  (quote the message safely; truncate to the first line).
- Env: `CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}`,
  `CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`.
- The deploy workflow does **not** run e2e (the local verify
  gate already did); `ci.yml` runs the full verify on PRs.

`deploy-check.mjs` matches on
`deployment_trigger.metadata.commit_hash`, which
`--commit-hash` sets.

**Precondition (user):** the repo secrets
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must exist
(see `plan/AUDIT.md`). If `gh secret list` does not show both,
ship the code anyway, then mark the phase
`[blocked: Actions secrets missing <date>]` per the skill's
deploy failure mode, run `node scripts/notify.mjs`, and stop.
Do not set secrets yourself.

## Deploy gate

After `git push`, `pnpm deploy:check` may be red the first time
(project not yet created, secrets missing, lockfile drift).
Iterate within phase 2 until green, max 3 same-root-cause
iterations. Read failures with `gh run view --log-failed`.

## Tests

### Unit
- `hex.test.ts` — neighbours of origin are the 6 axial
  directions (@rule 3.1).
- `hex.property.test.ts` — for any axial coordinate, 6 distinct
  neighbours, each at hex distance 1.
- `HexTile.test.tsx` — renders exactly 7 hex polygons.

### E2E
- `smoke.spec.ts` — `/` loads, 7 `[data-hex]` elements visible,
  no console errors, at 375px `scrollWidth - innerWidth <= 1`.

## Decisions made upfront — DO NOT ASK

- Hex orientation: flat-top axial `{q, r}`, key `"q,r"` (matches brief data model).
- Package names: `@survival/content`, `@survival/engine`, `@survival/bot`, `@survival/sim`, `@survival/web`.
- Packages consumed from source via TS project references + Vite aliases; no publishing.
- Router: none yet; phase 10 adds routing. `/` shows the tile with the heading "Survival Dice-Builder".
- Test file naming: `*.test.ts(x)` unit, `*.property.test.ts` property, `e2e/*.spec.ts` Playwright.
- Test names start with the rule id when they test a rule: `"3.1 neighbours of a hex"`.
- Line endings: add `.gitattributes` with `* text=auto eol=lf` (Windows dev machine).
- `.gitignore` gains `nul` (Windows hazard) if not already present.

## Mobile reflow

The tile SVG scales to the viewport width with a 16px gutter;
no horizontal scroll at 375px.

## Git

```bash
git add <explicit files>
git commit -m "$(cat <<'EOF'
feat: foundation and deploy pipeline — phase 2

- <bullet list of what shipped>

Report (spec 0): <commands that pass, test counts>

Decisions:
- <versions, any deviations>
EOF
)"
git push origin main
```

## DoD

- Spec 0 acceptance: install/test/lint/typecheck/build/dev all succeed on a clean checkout; dev server shows a 7-hex tile; one sample engine test and one property test pass in CI.
- `pnpm deploy:check` green; the live URL shows the tile.
- Flip Phase 2's `[ ]` → `[x]` in `plan/steps/01_build_plan.md` with the commit hash; add to "Phase log".

## Follow-ups (out of scope this phase)

- Content schemas (phase 4). Routing (phase 10). Real tokens (phase 9).
