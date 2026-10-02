# Bearings — Survival Dice-Builder

> Standing context for every command invocation. Read this
> alongside the relevant skill file (`skills/<name>.md`) and
> the matching phase brief. If anything here changes, update in
> the same commit.

## What we're building

The `spec/` folder is the product spec; `spec.md` at the repo
root is its index. Precedence, highest first:

1. `spec/01-spec-v1-rules.md` — the game rules (ASD-STE100). **The rules win over every other file.**
2. `spec/03-build-brief.md` — stack, architecture, engine API, data model, UI, testing.
3. `spec/02-build-plan.md` + `spec/phases/*.md` — the designer's phase specs with acceptance criteria.
4. This file and `plan/phases/*.md` — how the loop executes those specs.

> Defend the base, build your dice, survive one more round.

A playable web prototype of a 1–4 player co-op survival
dice-builder. Players defend a base on the center hex tile, go
out to gather and fight, and try to last as many rounds as
possible (they cannot win). The audience for v1 is the
designer: they play runs, feel the pacing, and export real
timing data to re-tune Spec v1.

**The name in UI copy is "Survival Dice-Builder"** (working
title; the theme is still open, so no themed naming).

**Live at:** https://survival-dice-builder.pages.dev

## Surface

**Surface:** `site`

## Auth (for Surface: site / hybrid)

**Auth:** `none`

No accounts, no login wall. `/critique` walks the public site
anonymously.

## Stack (locked — do not re-litigate)

From `spec/03-build-brief.md`. Revisit only if a phase cannot
ship without changing one of these — and then stop and file a
`[needs-user-call]`.

| Layer | Choice | Why |
|---|---|---|
| Repo | pnpm workspaces monorepo: `packages/content`, `packages/engine`, `packages/bot`, `apps/web`, `tools/sim` | Brief architecture; engine reusable by Tauri later |
| Framework | React 18+ on Vite | Brief; static build, fast dev server |
| Language | TypeScript, `strict: true`, shared base tsconfig | Shared types between engine and UI |
| Map rendering | SVG (2D axial hex map); 3D only for dice, Phase 8 | Inspectable and testable |
| State | Engine state = plain immutable data; UI holds it in one store (`useReducer` or Zustand) | Replay, undo, save/load for free |
| Styling | CSS modules + CSS custom-property tokens (tokens from `design/ART-GUIDE.md` once Phase B lands) | No framework lock-in; tokens map 1:1 from art guide |
| Content | JSON in `packages/content/data/` | Every rule number is data |
| Structured data | `none` (content JSON is code-adjacent, validated at load; no `/ship-data`) | No records backlog; content changes ship inside phases |
| Schemas | Zod | Catch content and save-file errors at load |
| Test (unit/property) | Vitest + fast-check | Unit, property, and golden-replay tests |
| Test (e2e) | Playwright against `vite preview` on port 4173 (hermetic Pattern A: static build) | Proves the built site, not just the dev server |
| Lint | ESLint (flat config, typescript-eslint) + Prettier | Consistency across agents |
| Pkg mgr | pnpm 9 (`packageManager` pinned in root `package.json`) | nexus permission allowlist assumes pnpm |
| Node | 20+ (dev machine runs 24) | |
| Hosting | Cloudflare Pages, published by GitHub Actions (`wrangler pages deploy`) | Free static hosting; deploy is scriptable, no dashboard Git link needed |

## External services

| # | Service | Runbook | Status | Last verified | Dashboard |
|---|---|---|---|---|---|
| 01 | GitHub | (repo + Actions secrets) | PARTIAL — Actions secrets not yet set | 2026-10-02 | https://github.com/no-trbl-2-u/survival-dice-builder |
| 02 | Cloudflare Pages | (phase 2 brief, "Deploy pipeline") | STUB — project created in phase 2 | 2026-10-02 | https://dash.cloudflare.com |

## Auth provider

**Auth provider:** none, v1.

## URL contract (locked)

Single-page app, hash-free client routing is not needed for v1.

```
/                 Main menu: new run (seed + player count), load save, config panel link
/play             The game screen (map, panels, hand, dice tray, Skill board, log)
/config           Configuration panel (rules section 18 + every number in config.default.json)
/summary          Run summary + JSON export (also reachable from /play when the run ends)
/debug            Engine console: legal actions as buttons, event log, state inspector, seed input, autoplay (ships in phase 5; stays as a developer tool)
/tiles            Tile sheet: the 11 proposed tile layouts as SVG (designer review, Phase 1 spec)
/credits          Credits generated from ASSETS.md
```

Routes are client-side (`react-router` or a 30-line hand router;
decide in phase 4, the first phase that adds a route, and
record it here). Cloudflare Pages gets a
`_redirects` file `/* /index.html 200` so deep links load.

## Engine API contract (locked)

From the brief. Do not change signatures; extend only by adding.

```ts
createGame(config: GameConfig, seed: number): GameState
legalActions(state: GameState): Action[]
applyAction(state: GameState, action: Action): { state: GameState; events: GameEvent[] }
serialize(state: GameState): string
deserialize(text: string): GameState
```

Every `GameEvent` carries `type`, payload, and the producing
`rule` id. RNG state lives in `GameState`; same `seed +
actions[]` = same run.

**Decisions are step-by-step.** Each `Action` is one atomic
choice: play one card, move one hex, keep or release one die,
roll or stop, put one die on one Skill slot (naming the face a
Star counts as), confirm. `legalActions` never enumerates
combinations (full dice assignments, whole move paths); the
list stays small enough to render as buttons and for the bot
to scan.

## Repository shape

```
<repo-root>/
├── spec.md                         # index into spec/
├── spec/                           # designer's spec (source of truth; edit only via /oversight)
├── agents.md  CLAUDE.md  README.md  CONTRIBUTING.md
├── RULES-COVERAGE.md               # rule id -> function -> test
├── OPEN-QUESTIONS.md               # unclear rules + proposed readings + config flag
├── ASSETS.md                       # asset license register
├── package.json  pnpm-workspace.yaml  tsconfig.base.json  eslint.config.js
├── packages/content/  packages/engine/  packages/bot/
├── apps/web/  apps/web/e2e/        # Playwright specs live with the app
├── tools/sim/
├── assets/                         # icons/, tiles/, audio/, fonts/, models/
├── design/                         # ART-GUIDE.md, templates, mock-ups (Phase B)
├── docs/                           # recommendations, playtest protocol, reports
├── .github/workflows/deploy.yml
├── .claude/  skills/  scripts/
└── plan/
```

Each package has a `README.md`: purpose, public API, tests.

## The `design/` folder

Phase 10 (spec B, in loop) writes `design/ART-GUIDE.md`, SVG templates,
and mock-ups. If the designer later drops their own exports in
`design/`, `design/decisions.*` **wins over bearings on
conflict**. The loop does not wait for design: the UI ships
with working tokens and integrates the art guide when it lands.

## Sub-agents

| Agent | When to spawn | Returns |
|---|---|---|
| `scout` | Asset/library research, license pages, prior art | Structured findings with citations |
| `reader` | Fresh-eyes critique of the live site | JSON findings array |
| `rules-lawyer` | Before committing any engine phase; when a rule reading is unclear | Rule-by-rule compliance report + missing-test list |
| `asset-clerk` | Any phase that adds a file under `assets/` | License verdict per asset + `ASSETS.md` rows |

## Visual & tonal defaults

Working defaults until `design/ART-GUIDE.md` lands:

- **Mode:** both light and dark, following `prefers-color-scheme`; WCAG AA contrast in both.
- **Type families:** system UI sans for body, a tabular-numeral mono for numbers.
- **Palette intent:** theme-neutral. Phase colours: Prepare = blue, Combat = red, Explore = green. Colour is never the only signal (always pair with an icon or label).
- **Motion:** every animation is event-driven, skippable, and off under `prefers-reduced-motion`.
- **Voice:** UI copy follows the rules' ASD-STE100 style: short, plain, imperative. Game terms (Skill, Barricade, Tower, grunt, elite) are capitalised exactly as in the rules.

## Plan expansion posture

- **Mode: bold** — `/expand` files candidates to
  `plan/PHASE_CANDIDATES.md`; `/oversight` promotes them.
  Candidates may never change a rule; rule changes are Spec v2
  work and belong in the Phase C report.

## Decisions standing for the autonomous loop

- **Rule ambiguity:** never ask, never guess silently. Add to `OPEN-QUESTIONS.md` (rule id, proposed reading), implement behind a config flag defaulting to the proposed reading, continue.
- **Known open items (from the brief), already decided:** defenses may be built on a gathering node hex (node still works); enemy target tie-break = player, then Tower, then Barricade, then base, then lowest health.
- **Tile layouts:** the loop proposes them (phase 4) and ships them; designer review is async via `/oversight`, never a blocker, but best done before phase 7's golden replay.
- **3D dice:** optional, presentation only. No spike before phase 15; phase 3 does license and library research only. If the phase 15 spike fails, ship without 3D.
- **Bot batch band (median end round 8–14):** a miss is tuning data, not a failure. File it; never change a rule or a default number to hit the band.
- **RNG:** mulberry32, state stored in `GameState`.
- **State hash for golden replays:** SHA-256 of `serialize(state)` (Node `crypto` in tests only; the engine never hashes).
- **Golden replay files:** `packages/engine/test/golden/*.json` = `{ seed, config, actions[], expectedHash }`. A rule change that alters a hash updates the file in the same commit, with the reason in the commit body.
- **Bought-card mode, exploration rule, Skill uses, max level:** defaults from the rules; alternatives are config flags.
- **Saves:** local file download/upload + `localStorage` autosave labelled "this browser only". No cloud saves.
- **Networking, accounts, AI teammates, scenarios (rules section 19):** out of scope at every phase.
- **Assets:** CC0 / CC BY / MIT / OFL only. Non-commercial or no-derivatives licenses are rejected unless the designer approves via `/oversight`.
- **Placeholder art:** a missing asset never blocks a phase; ship a labelled placeholder and file an AUDIT row.
- **Empty state copy:** "Nothing here yet." **Errors:** inline red text with the rule id or validation path, never a silent failure.
- **Phase reports:** each phase's commit body carries the spec's "short report" (what was built, test results, open questions); UI phases add Playwright screenshots under `docs/reports/phase-<N>/`.

## Commit verb vocabulary (locked)

| Verb | Fires from |
|---|---|
| `critique` | `/critique` |
| `expand` | `/expand` |
| `jot` | `/jot` |
| `oversight` | `/oversight` |
| `triage` | `/triage` |
| `phases` | `/plan-a-phase` |
| `plan` | plan-state-only changes |
| `feat` | new capability |
| `fix` | correcting a prior mistake |
| `docs` | doc-only edit (includes research and playtest docs) |
| `chore` | tooling/config, no product change |

`digest` stays in `guard.mjs`'s `VERBS` for when the night shift
is adopted.

## Hard rules

(Mirrors `agents.md` Standing Rules. Update there first; this
echoes.)

1. **Commit and push as a single atomic act.**
2. **No `Co-Authored-By:` trailers, no emojis.**
3. **No `--no-verify`, no force-push, no destructive resets.**
4. **The verify gate is non-negotiable.**
5. **Tests alongside code.** Every rule maps to a test in `RULES-COVERAGE.md`.
6. **Small focused modules in folders.** Each package has a README.
7. **Rule numbers live in `packages/content/`.** Never hardcoded.
8. **Never commit secrets.** `.env` is gitignored.
9. **The rules win.** Never change a rule; `spec/` is edited only via `/oversight`.
10. **Engine is pure.** No classes, no input mutation, no I/O, no `Date`/`Math.random` in `packages/engine`.
11. **No rule logic in `apps/web`.** The UI only calls the engine API.

## Verify gate (hermetic, mandatory) + deploy gate

### Pre-commit: `pnpm verify`

```
pnpm lint           # eslint + prettier --check
pnpm typecheck      # tsc -b (project references)
pnpm test:run       # vitest run across workspaces (unit + property + golden)
pnpm build          # vite build for apps/web (+ tsc builds for packages)
pnpm e2e            # playwright against vite preview on :4173
```

Until phase 2 lands there is no toolchain, so `pnpm verify`
fails by design. Phase 2 makes it green.

### Post-push: `pnpm deploy:check`

Push to `main` triggers `.github/workflows/deploy.yml`
(build, then `wrangler pages deploy apps/web/dist
--project-name=survival-dice-builder --branch=main
--commit-hash=$GITHUB_SHA`). Then:

```
pnpm deploy:check
```

Polls Cloudflare Pages for the deploy at HEAD. Exits 0 ready,
1 error, 2 timeout, 3 config/auth. Provider block:
`cloudflare-pages` in `scripts/deploy-check.mjs`.

**Red deploy = blocked tick.** Read the Actions log
(`gh run view --log-failed`), patch, push again. Up to 3
same-root-cause iterations.

## Operational notes

- **Auto-deploys:** every push to `main` deploys via GitHub Actions.
- **A red `main` = a red site.**
- **Operational secrets** in `.env` (gitignored); the deploy workflow reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from repo Actions secrets.
- **Windows dev machine:** add `nul` to `.gitignore`; never `cd` into `dist/` (EBUSY).

## Useful commands

```bash
pnpm install
pnpm dev              # vite dev server for apps/web
pnpm test             # vitest watch
pnpm verify           # the full gate
pnpm deploy:check     # post-push deploy gate
pnpm sim -- --runs 200   # batch bot runs (phase 9+)
```
