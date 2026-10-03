# Phase 15 — Visual polish: icons, credits, animation, sound, 3D dice — Milestone 4

> Agent-facing brief. Ship without asking. Source: `spec/phases/phase-8-visual-polish.md`,
> `docs/research/recommendation-2d.md`, `docs/research/recommendation-3d.md`.

## Outcome

`/play` looks intentional:
- Die faces and resources use the licensed icons.
- Board changes animate.
- Sounds play, with a mute control.
- An optional 3D die shows each roll landing on the face the engine chose.

`/credits` lists every asset in use, generated from `ASSETS.md`. **Milestone 4.**

## Web (apps/web/src)

- **Icons:**
  - `icons/gameIcons.ts` also loads `assets/icons/dice/*.svg`.
  - A shared `GameIcon` component.
  - `DiceTray`, `SkillBoard`, `PlayerPanel`, `BasePanel` show die-face and resource icons. The text labels stay, because the icons are never the only cue.
- **Credits:**
  - `credits/credits.ts` (pure) parses the `ASSETS.md` tables: `in use` icons and fonts.
  - `credits/CreditsPage.tsx` serves `/credits`, linked from the nav.
  - Unit test: every `in use` row and every font appears.
- **Animation:** CSS keyframes, event-driven, all off under `prefers-reduced-motion` (already global).
  - Tiles appear on placement (`tileIn` on mount).
  - Enemies move by transform transition (keyed by enemy id).
  - Tower shots draw a fading line (`towerAttack` events of the last action).
  - Structure and base damage shake (keyed on health).
  - Level-up shows a banner (keyed on level).
  - Draft offers reveal in turn.
  - The hand rotation keeps the existing transition.
- **Sound:**
  - `sound/cues.ts` (pure) maps the events of an action to cue names.
  - `sound/sound.ts` synthesizes each cue with the Web Audio API (oscillator plus envelope; unlocks on first input).
  - A mute toggle stores to `survival.sound.v1`.
  - Default on, at low volume.
- **3D dice (spike, then optional toggle):**
  - `dice3d/orientation.ts` (pure) gives the face layout so the engine's face is on top, and the end rotation per top face.
  - `dice3d/Dice3D.tsx` is dynamically imported only when the toggle is on: three.js, one d6 per die, a scripted tumble that ends on the chosen face.
  - The "3D dice" toggle stores to `survival.dice3d.v1`. Default off; the 2D tray stays.
  - Without WebGL it shows a note and the 2D tray.

## Decisions made upfront — DO NOT ASK

- **No asset downloads in an unattended tick.** Sounds are synthesized (no files, nothing to credit). The Kenney audio and 3D model rows stay `candidate` for a later pass if the designer wants recorded sounds.
- **The 3D spike uses a scripted tumble with three.js, not physics** (R3F + Rapier from the phase 3 recommendation). The engine already decides the face, so physics adds a WASM dependency and a simulate-then-remap step for no game value. The tumble is keyframed spin that eases into the target rotation; the result is the engine's by construction. Spike notes and frame-rate notes go in `docs/research/recommendation-3d.md`.
- 3D is presentation only. The toggle never reaches the reducer, so the same seed and actions give the same state.
- Kenney 2D tile art is not swapped in. The art guide (phase 10) kept flat SVG hexes; the rows stay `candidate`.

## Tests

- **Unit:**
  - Credits cover every `in use` row.
  - The sound cue mapping.
  - The die orientation: the chosen face is on top for all 6 faces, and the layout keeps the die's faces.
  - The sound and 3D preferences store and load.
- **e2e:**
  - `/credits` lists the game-icons.net authors.
  - In `/play`, the mute and 3D toggles work with no console errors.
  - A seeded run with 3D on exports the same actions and state round as with 3D off.

## DoD

- `pnpm verify` is green.
- The deploy is green.
- The 3D spike result is recorded.
- Milestone 4 is noted.
- A designer frame-rate check row is filed in `plan/AUDIT.md`.
