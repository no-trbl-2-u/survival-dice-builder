# Discovery pass 1

> Run: 2026-10-10 at bee25b5. Prompt: `plan/discover-prompt.md`.
> Inputs: `rules-lawyer` (rules coverage), an Explore agent (code, tests, loop health), a
> general-purpose agent (acceptance matrix), `reader` (live site; it could not click or resize),
> and a 375x812 check of /play in the built-in browser.
> Output: 18 candidates in `plan/PHASE_CANDIDATES.md` (15 within v1 scope, 3 beyond it),
> 5 critique rows in `plan/CRITIQUE.md`. Plan files only; no code changed.

## 1. Acceptance criteria against HEAD

Status per `spec/phases/*` criterion and per milestone (`spec/02-build-plan.md:24-27`).
"Superseded" means core loop v2 (phases 20-21) replaced the rule the criterion tests.

| Spec phase | Criterion | Status | Evidence |
|---|---|---|---|
| 0 | install, test, lint, typecheck, build, dev succeed | met | root `package.json` `verify`; `.github/workflows/ci.yml:15` |
| 0 | dev server shows a 7-hex tile | met | `apps/web/e2e/smoke.spec.ts:3`; `HexTile.test.tsx` |
| 0 | sample engine and property test pass in CI | met | `packages/engine/test/properties.test.ts` |
| 1 | a config number changes the game without code | met | `packages/engine/src/progression/levels.test.ts:25` |
| 1 | invalid content fails with a clear message | met | `packages/content/src/load.test.ts:74` |
| 1 | tile sheet reviewed by the designer | partly | `/tiles` ships; review open (`plan/AUDIT.md:1197`); new tiles undesigned (row 57) |
| 2 | owned cards conserved | met | `properties.test.ts:32` |
| 2 | canFire never uses one Star twice | met | `packages/engine/src/skills/canFire.test.ts:32,41` |
| 2 | golden 3-round replay | met | `test/golden/p5-three-rounds.json`; `golden.test.ts:177` |
| 2 | unit tests for 5.x, 6.1-6.6, 7.1-7.2, 7.8, 9.5-9.6, 10.6-10.7 | met (inferred, ~85%) | `RULES-COVERAGE.md`; 6 stale rows (see candidate "Rules coverage") |
| 3 | no enemy on lake, mountain, Barricade or base | met | `properties.test.ts:82,111`; `enemies.test.ts:191` |
| 3 | miniatures never exceed the limit | met | `properties.test.ts:128` |
| 3 | pathing, tie-break, Barricade detour | met | `enemies.test.ts:85-168` |
| 3 | golden full solo run | met | `test/golden/p7-full-run.json` (re-recorded for v2) |
| 3 | Explore phase, wave track | superseded | `enemies.test.ts:388` asserts there is none |
| 4 | unit tests for 8, 11, 13.1, 14, 17 | met | `RULES-COVERAGE.md` |
| 4 | headless run ends with cause and milestones | met | `golden/p8-builder-run.json`; `progression.test.ts:336,364` |
| 4 | engine complete for Spec v1 | partly | complete at 0f8bfc1; v2 replaced 14.2 with knockout |
| 5 | full solo run by mouse and keyboard | partly | mouse: `e2e/play-full.spec.ts:39`; keyboard: focus checks only (`a11y.spec.ts:13-34`) |
| 5 | every decision type has a control | met (inferred, ~80%) | `legalActions`-driven; engagement modal (phase 24) |
| 5 | no rule logic in apps/web | met (inferred, ~80%) | phase 25 `ruleText`; `apps/web/src/ruleNumbers.test.ts` |
| 5 | run summary exports a replayable JSON | met | `apps/web/src/play/exportRun.test.ts:26` |
| 6 | a 3-player run plays to the end | met (engine), partly (UI) | `coop.test.ts:121`; `e2e/coop-config.spec.ts:3` only starts and hands off |
| 6 | a changed config is used by the next run | met | `coop-config.spec.ts:34`; `config.spec.ts:127` |
| 6 | a saved file loads to the same state hash | met | `exportRun.test.ts:42,58` |
| 7 | 200 bot runs, no errors | met | `tools/sim/src/run.test.ts:30` |
| 7 | median end round 8-14 | **unmet** | pinned median 6 (`run.test.ts:34`); filed `plan/AUDIT.md:1204`; phase 26 next |
| 7 | a real export's timings sum to the session within 5% | partly | wired (`apps/web/src/play/timing.ts`), tested on a synthetic clock; no real export exists |
| 8 | 3D dice never change the result | met | `e2e/polish.spec.ts:79` |
| 8 | credits list every asset in use | met | `apps/web/src/credits/credits.test.ts:10,19` |
| 8 | frame rate usable on a mid-range laptop | unmet | headless figure only; designer check open (`plan/AUDIT.md:1201`) |
| 8 | tiles, structures, enemy markers replaced | partly | icons in use; terrain procedural; Kenney rows `candidate` (`ASSETS.md:58-59`) |
| 8 | animations | met (inferred, ~80%) | `apps/web/src/play/Play.module.css` keyframes |
| 8 | sound with mute | partly | synthesized only (`apps/web/src/sound/sound.ts`) |
| A | every asset has an ASSETS.md row | met | `scripts/check-assets.mjs:71` in lint |
| A | no NC or ND assets | met | `ASSETS.md` |
| A | 6 die faces in one style | met | `assets/icons/dice/` |
| A | 3D spike lands on a chosen face | met | `apps/web/src/dice3d/Dice3D.tsx` |
| B | WCAG AA contrast, light and dark | met | `scripts/check-design.mjs` (54 pairs) |
| B | 2 people read orientation, enemy, health at a glance | unmet | `plan/AUDIT.md:1199`; blind rounds were agents |
| B | templates use registered assets only | met | `check-design.mjs:9,136` |
| C | protocol, one page | met, **stale** | `docs/playtests/PROTOCOL.md:18-19` teaches the 6-card deck and wave track |
| C | survey | met, **stale** | `docs/playtests/SURVEY.md:9-10` asks about deck size and the wave track |
| C | 5 solo and 3 co-op sessions | **unmet** | `docs/playtests/runs/` holds only its README |
| C | exports and surveys collected | unmet | none |
| C | report compares minutes per round with 8-9 | partly | tool ready (`tools/sim/src/playtests.ts`); `REPORT.md` is a template with a stale "Bot floor 14" |
| C | each proposed change names a rule and evidence | unmet | no report |

| Milestone | Status |
|---|---|
| 1. Headless engine | met at 0f8bfc1, then superseded by core loop v2 (`spec/` not yet updated) |
| 2. First playable | met; keyboard play partly proven |
| 3. Playtest build | partly: timing never used on a real run; bot band missed at HEAD |
| 4. Presentable build | partly: tile art, recorded sound, both designer feel checks missing |

Non-goals (`spec/03-build-brief.md:11-16`) are all respected at HEAD.

## 2. Candidates by lens

Scores per `skills/expand.md` §5. Bold = shortlist.

| Lens | Candidate | Score |
|---|---|---|
| A spec gaps | **Playtest kit on the current rules** | 6.5 |
| A spec gaps | Rules as played: a generated rulebook for the Spec v2 fold-in | 4.5 |
| B rules coverage | **Rules coverage that still pins the rules** | 5.5 |
| B rules coverage | **The rulings the engagement model bypasses** (needs OPEN-QUESTIONS readings) | 5.0 |
| C designer loop | **Log a cardboard session** | 5.0 |
| D balance | **A designer's batch: sweeps, N-way compares, event counts** | 5.5 |
| D balance | A ceiling pilot: a look-ahead bot | 3.5 |
| E copy | Rule text II: word-form rules and /config help | 4.5 |
| E copy | The public site and the designer's workbench | 4.5 |
| E copy | The first 60 seconds on a phone | 4.0 |
| F co-op | Co-op at 2, 3 and 4 seats, proven | 4.5 |
| G save and data | **Saved configs that follow the rules** | 5.5 |
| H engineering | **Loop telemetry: a tick that does nothing says why** | 5.5 |
| H engineering | Keyboard and screen-reader proof | 4.0 |
| I physical edition | **Physical parity: printed numbers and table markers** | 5.0 |
| J beyond v1 | Print-and-play kit from content (gated: 4 logged runs) | 2.5 |
| J beyond v1 | Scenarios with win conditions (non-goal override) | 1.0 |
| J beyond v1 | Final art direction (non-goal override) | 1.0 |

Dropped or not filed as candidates (ruling audit against HEAD):
- Defending bot, engage-aware bot: already phase 26.
- Engine ids in player text: already phase 27. Per-route meta and 404: phase 28.
- Experiment presets: the pending "Try the proposals" row (blocked on phase 26).
- Rule text from one source: shipped as phase 25 (625edbc). Only its residue is filed (Rule text II).
- Recorded audio and tile art: stays in Considered; filed only as the beyond-v1 art row.
- Sim charts (PNG or SVG output): one signal; the retrospective says the sim finds ranges and does not tune (rule 9). Not filed.
- Bundle split, pulse date parse, /decisions ops rows, two /config and / copy rows: one-tick fixes, filed in `plan/CRITIQUE.md`.

## 3. Promotion shortlist (top 8)

| # | Score | Candidate | Why now | Depends on |
|---|---|---|---|---|
| 1 | 5.5 | Loop telemetry | 7 of the last 8 cloud ticks (2026-10-10) skipped at the 24h ceiling with a green check and no notice (run logs); pulse prints `NaNd ago`. Cheap, and every later phase is easier to watch. | none |
| 2 | 6.5 | Playtest kit on the current rules | The kit teaches the v1 game; phase 25's `ruleText` makes the fix cheap now. It is the retrospective's first code step. | phase 25 (shipped) |
| 3 | 5.0 | Log a cardboard session | The only player plays on cardboard; there is no place to log that. Zero sessions in 8 days. | #2 (the protocol names the format) |
| 4 | 5.5 | Rules coverage that still pins the rules | 6 stale rows after 5 rule changes in 7 days; phase 26 adds bot tests that should cite correct rows. | none |
| 5 | 5.0 | The rulings the engagement model bypasses | /decisions hides 3 designer changes and shows inert settings. Needs new OPEN-QUESTIONS rows, which the designer then answers. | #4 (new rows get coverage rows) |
| 6 | 5.0 | Physical parity | The web app is a design tool for a board game; nothing catches a rule a table cannot track. | #2 (the kit text joins the printed set) |
| 7 | 5.5 | Saved configs that follow the rules | Every rule change silently leaves stale saves; presets will write the same store. Outside loop scope: needs the designer's yes. | before "Try the proposals" |
| 8 | 5.5 | A designer's batch | Rows 63-70 wait on numbers that today take a JSON file per value and a hand count from events. | phase 26 (`--policy defender`) |

Suggested order around the planned phases: #1, #2, #3, #4, then phase 26, then #5, #6, #8, then phase 27, then #7 and "Try the proposals", then phase 28.

## 4. Least sure

- **Rules as played (~60%)**: `ruleText` may not cover sections 9-12 well enough to generate an "as played" line for each; the phase may grow to 2.
- **Physical parity (~60%)**: whether `revealedRound` and the reveal clock need a table marker is an inference; the designer may already track them with tile order.
- **The first 60 seconds on a phone (~65%)**: measured once, at setup only; the reader could not click or resize, so later /play states at 375px are unmeasured this pass.
