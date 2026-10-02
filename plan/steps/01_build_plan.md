# 01 — Build plan

> Style guardrails for every phase below. Always ship unit tests
> alongside code — never "add tests later". Break work into
> small, focused modules in folders. Pure helpers go in their
> own modules with their own tests. Every rule a phase touches
> gets a row in `RULES-COVERAGE.md`.
>
> This plan executes the designer's `spec/02-build-plan.md`.
> Each phase names its source spec (`spec/phases/...`); that
> spec's **acceptance criteria are the phase's DoD**. Nexus
> phase numbers differ from spec phase ids (spec 0 = nexus
> phase 2, and so on); large spec phases are split in two.

## Status (at-a-glance)

`/march`, `/ship-a-phase`, and (transitively) `/loop` read this
block to find the next phase. Status vocabulary: `[ ]` pending
→ `[x]` shipped (with commit hash); `[skipped]` (set only via
`/oversight`); `[blocked: <reason> <date>]` (set by
`ship-a-phase` on a phase-shaped failure — `/march` skips it,
`/oversight` unblocks it); `[-]` partial-with-carry-overs.
Tick in this file in the same commit that ships the phase.

**Substrate (phases 1–4):**
- [x] Phase 1 — nexus overlay (agents.md, plan/, skills/, .claude/, scripts/, gates specified) — shipped in the `chore: adopt nexus methodology` commit
- [ ] Phase 2 — Foundation + deploy pipeline (spec 0)
- [ ] Phase 3 — Asset and library research (spec A, non-code)
- [ ] Phase 4 — Content and data model + tile proposals (spec 1)

**Headless engine (phases 5–8) — Milestone 1 at phase 8:**
- [ ] Phase 5 — Engine core: cards, dice, Skills, phases (spec 2) — CANONICAL SIBLING
- [ ] Phase 6 — World I: hex map, tiles, movement, Gather/Build, defenses (spec 3, first half)
- [ ] Phase 7 — World II: enemies, base, exploration, wave track, co-op order (spec 3, second half)
- [ ] Phase 8 — Progression: XP, upgrades, Shop, draft, end of run, milestones (spec 4)

**Playable (phases 9–11) — Milestone 2 at phase 11:**
- [ ] Phase 9 — Art direction and placeholder art (spec B, non-code)
- [ ] Phase 10 — Web UI I: map, player panel, hand, dice tray, Skill board, phase bar (spec 5, first half)
- [ ] Phase 11 — Web UI II: base panel, Shop, draft, tile placement, log, run summary + export, keyboard (spec 5, second half)

**Playtest build (phases 12–13) — Milestone 3 at phase 13:**
- [ ] Phase 12 — Co-op hot-seat, configuration panel, save and load (spec 6)
- [ ] Phase 13 — Playtest tooling: bot, batch runs, timing export (spec 7)

**Presentable (phases 14–15) — Milestone 4 at phase 14:**
- [ ] Phase 14 — Visual polish: icons, art, 3D dice, animation, sound (spec 8)
- [ ] Phase 15 — Playtest protocol, survey, and analysis kit (spec C, non-code)

> **After phase 15:** the loop transitions to `/iterate`.
> Real playtest sessions (spec C, item 2) need people; the
> designer runs them and drops run exports in
> `docs/playtests/runs/`. `/iterate` then fills the report.

> **Note on deploys before phase 2 ships:** there is no deploy
> workflow until phase 2, so `pnpm deploy:check` reports "no
> deploy for this commit". Phase 2 lands the workflow and
> iterates to a green deploy.

---

## Per-phase scope

Each row above corresponds to one phase. The detailed brief
lives at `plan/phases/phase_<N>_<topic>.md`. If a brief is
missing when the loop reaches its phase, the loop generates one
(via `/plan-a-phase` shape) from the scope below + the source
spec + the canonical sibling (phase 5).

### Phase 1 — nexus overlay

Shipped with the adoption commit. Gates specified, not yet green.

### Phase 2 — Foundation + deploy pipeline

Source: `spec/phases/phase-0-foundation.md`. pnpm monorepo
skeleton, shared strict tsconfig, Vite + React app rendering a
7-hex SVG tile, Vitest + fast-check + ESLint + Prettier +
Playwright, `pnpm verify` green, README + CONTRIBUTING,
Cloudflare Pages deploy via GitHub Actions, deploy gate green.
Detailed brief: `phase_2_foundation.md`.

### Phase 3 — Asset and library research

Source: `spec/phases/phase-A-assets-and-libraries.md`. Non-code
research run by `scout` + `asset-clerk`. `ASSETS.md` register,
`assets/` folder, 6 die-face SVGs in one style, the full icon
list, a 1-page 2D recommendation and a 1-page 3D
recommendation in `docs/research/`, and a predetermined-face
3D dice spike under `tools/spikes/dice3d/` (not wired into the
app; excluded from `pnpm verify` except typecheck). Commit verb
`docs` for research, `feat` for the spike.

### Phase 4 — Content and data model + tile proposals

Source: `spec/phases/phase-1-content.md`. Zod schemas + types
for every content kind; content JSON from Spec v1 Tables 1–9;
`config.default.json` with every rule number and section 18
flags; validating loader with file + field errors; 11 proposed
tile layouts served at `/tiles` as an SVG sheet;
`OPEN-QUESTIONS.md` and `RULES-COVERAGE.md` created. Designer
review of tiles is async (files an AUDIT `[needs-user-call]`).

### Phase 5 — Engine core (CANONICAL SIBLING)

Source: `spec/phases/phase-2-engine-core.md`. Seeded RNG in
state; the five API functions; deck model and orientation;
Prepare card plays (map effects stubbed as events); Combat
exchange (7.8) with Star wild; phase machine; golden replay
harness. **Establishes the template every later engine phase
copies:** module layout, TSDoc `@rule` tags, rule-tagged test
names, property-test helpers, golden replay format,
`RULES-COVERAGE.md` rows, `rules-lawyer` review before commit.
Detailed brief: `phase_5_engine_core.md`.

### Phase 6 — World I

Source: `spec/phases/phase-3-world.md` (map half). Axial hex
math, tile placement, impassable lake/mountain, player movement
with path choice, extra cost next to enemies (6.9), skirmish
(6.10–6.13), Gather and Build on the map (6.7), Barricade and
Tower with placement limits (section 12). Replaces phase 5's
map stubs.

### Phase 7 — World II

Source: `spec/phases/phase-3-world.md` (enemy half). Spawn and
refill (9.2), enemy movement toward nearest target with the
locked tie-break (9.3–9.4), Barricade blocking, Tower attack
(12.3), structure attack step (7.11–7.12), base health,
Explore phase with forced/optional/automatic reveal (18.1),
wave track, miniature limit, grunt-to-elite (10.3–10.5,
section 15), co-op exchange order (16.4–16.5). All spec 3
acceptance criteria, including a full solo golden replay.

### Phase 8 — Progression

Source: `spec/phases/phase-4-progression.md`. Shared XP and
levels, +1 die per level, currency to the killer, Shop I–III,
base upgrades I→III, Skill draft on even rounds, bought-card
mode, end of run, milestones. Headless full run reaches the end
with correct cause and milestones. **Milestone 1.**

### Phase 9 — Art direction and placeholder art

Source: `spec/phases/phase-B-art-direction.md`. Non-code.
`design/ART-GUIDE.md` (palette tokens light + dark, type scale,
icon sizes, readability rules, phase colours), SVG templates
(card, die net, tile, base board), two mock-ups (main screen,
run summary) as SVG. Contrast verified by script. The
"2 people can identify at a glance" check is a designer task,
filed as a `[needs-user-call]` row, not a blocker.

### Phase 10 — Web UI I

Source: `spec/phases/phase-5-web-ui.md` (first half). `/play`
with the SVG map (pan, zoom, legal-target highlights), player
panel, hand with visible 180° rotation, dice tray with keep
toggles and roll counter, Skill board with live can-fire
highlight, phase bar. Every control is driven by
`legalActions`. Playwright plays one Prepare + Combat exchange.

### Phase 11 — Web UI II

Source: `spec/phases/phase-5-web-ui.md` (second half). Base
panel (upgrade tracks, Shop offers), draft dialog, tile
placement preview, event log with rule ids, run summary with
JSON export (seed + actions, replayable), full keyboard
operation, reduced motion. Playwright plays a full seeded solo
run to the end. **Milestone 2.**

### Phase 12 — Co-op, config, save/load

Source: `spec/phases/phase-6-coop-config-save.md`. 1–4 players
hot-seat, `/config` panel over every config value with reset,
save/load file, `localStorage` autosave, developer undo via
replay.

### Phase 13 — Playtest tooling

Source: `spec/phases/phase-7-playtest-tooling.md`.
`packages/bot` policy over `legalActions`, `tools/sim` CLI
(CSV/JSON), real wall-clock timing per phase and decision type
in the export, config comparison report. 200-run batch median
end round 8–14 (regression check; a miss files an AUDIT row
and an OPEN-QUESTIONS entry, it does not change rules).
**Milestone 3.**

### Phase 14 — Visual polish

Source: `spec/phases/phase-8-visual-polish.md`. Swap in
phase 3/9 assets, `/credits` from `ASSETS.md`, optional 3D dice
toggle (presentation only, state-hash-identical), event-driven
animations, sound with mute. **Milestone 4.**

### Phase 15 — Playtest protocol and analysis kit

Source: `spec/phases/phase-C-playtests.md`. Non-code where it
can be. `docs/playtests/PROTOCOL.md` (one-page script),
`docs/playtests/SURVEY.md`, a `tools/sim` subcommand that
ingests run exports from `docs/playtests/runs/` and computes
median rounds/minutes and minutes-per-round vs the simulator
estimate, and `docs/playtests/REPORT.md` as a template. The
sessions themselves are filed as a `[needs-user-call]`.

---

## Carry-overs / known gaps (update as phases ship)

(Empty until phases ship.)

## Phase log (commit hashes)

- phase 1 — (adoption commit) — nexus overlay
