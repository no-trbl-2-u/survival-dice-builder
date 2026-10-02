# Phase 8 — Visual polish: icons, art, 3D dice, animation

**Goal:** a prototype that looks intentional and is pleasant to playtest.

## Scope

- Replace placeholders with Phase A/B assets: die faces, resource icons, tiles, structures, enemy markers.
- Credits screen generated from `ASSETS.md`.
- **3D dice (optional toggle):** the engine decides the faces; the 3D roll animates to those faces (chosen library from Phase A). The 2D dice tray stays the default.
- Animations: card rotation between phases, enemy movement, Tower shots, structure damage, level-up, draft reveal, tile reveal.
- Sound effects with a mute control.

## Acceptance criteria

- Turning 3D dice on or off never changes a game result (same seed and actions give the same state hash).
- Credits list every asset in use.
- Frame rate stays usable on a mid-range laptop (designer check).
