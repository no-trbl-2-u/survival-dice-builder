# Phase 3 — Asset and library research

> Agent-facing brief. Concise, opinionated, decisive. Ship
> without asking; document any judgment calls in the commit
> body. Non-code phase: deliverables are docs and asset files.
>
> Source spec: `spec/phases/phase-A-assets-and-libraries.md`.
> Its acceptance criteria apply, except the 3D dice spike,
> which is deferred to phase 15 (bearings, "3D dice").

## Scope

A license-checked register of icons, art, fonts, audio, and
libraries so later code phases never stop to search, plus the
first real asset files: the 6 die faces and the core game icons
as SVG in one consistent style.

## Outputs

```
ASSETS.md                          # license register (one row per asset in assets/, plus "candidate" rows)
assets/README.md                   # folder layout + how to add an asset
assets/icons/dice/{sword,wand,bow,shield,star,blank}.svg
assets/icons/game/<name>.svg       # materials, currency, health, guard, experience, base,
                                   # barricade, tower, grunt, elite, gathering-node, spawn-node
docs/research/recommendation-2d.md # icon set, tile approach, hex math, fonts, audio: choice + reasons
docs/research/recommendation-3d.md # 3D dice library, renderer, physics, models: choice + reasons (research only)
docs/research/CREDITS.md           # attribution text ready for the /credits screen (phase 15)
scripts/check-assets.mjs           # every file under assets/ has an ASSETS.md row (and vice versa)
```

`pnpm lint` runs `node scripts/check-assets.mjs` so the register
cannot drift.

## Decisions made upfront — DO NOT ASK

- **Icon set:** game-icons.net (CC BY 3.0), taken from its GitHub
  mirror as plain SVG. One set = one style. Credit each author.
- **Normalisation:** icons are stored as single-colour SVG using
  `fill="currentColor"`, 512x512 viewBox, no background square,
  so the UI themes them with CSS.
- **Blank face:** drawn in-repo (a rounded empty face outline),
  licensed with the project; no third-party asset.
- **Downloads in this phase are limited to SVG icons** (small text
  files). Large binary packs (Kenney hex kits, Quaternius models,
  audio packs, fonts) are recorded as `candidate` rows with
  verified licenses and URLs; the phase that first uses one
  downloads it (tiles: phase 11, audio and models: phase 15).
- **Fonts:** pick from Google Fonts (SIL OFL); load via Google
  Fonts CSS later, no font files committed now.
- **Rejected licenses:** NC, ND, or no license → `rejected` row,
  not used.
- **3D:** library and license research only; spike in phase 15.
- `asset-clerk` verifies every license; `scout` researches
  libraries. Run them in parallel.

## Acceptance (from spec A, adjusted)

- Every file in `assets/` has an `ASSETS.md` row with a license link (checked by script).
- No NC/ND asset.
- The 6 die faces exist as SVG in one consistent style.
- 3D: recommendation written; spike deferred to phase 15 (documented).

## Verify gate

`pnpm verify` (lint now includes the asset register check).

## Commit verb

`docs: asset and library research — phase 3` (asset SVGs and the
check script ride in the same commit).

## Follow-ups

- Download chosen tile art (phase 11), audio + 3D models (phase 15).
- `/credits` screen built from `docs/research/CREDITS.md` (phase 15).
