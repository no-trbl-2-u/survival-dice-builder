# 2D recommendation (phase 3, spec A)

Checked 2026-10-03. Every license below was read from the project's own LICENSE file or license
page; release dates from the npm registry. Register: `ASSETS.md`.

| Need | Pick | License | Why | Main risk |
|---|---|---|---|---|
| Die faces + game icons | game-icons.net, single-colour SVG (in `assets/icons/`) | CC BY 3.0 | One consistent style, 4,000+ icons, themeable with `currentColor` | Credit each author; busy icons (Barricade) may need a simpler pick in phase 10 |
| Hex math | Own module from the Red Blob Games code generator output | CC0 (generated code only) | ~150 lines, no dependency, already started in `packages/engine/src/hex.ts` | We own the edge-case tests. Fallback: honeycomb-grid (MIT, no release since 2023-11) |
| UI chrome icons | Lucide (`lucide-react`) | ISC (+ MIT notice for Feather-derived icons) | Very active, tree-shakeable React components | Keep the MIT notice in credits |
| Audio playback | Plain Web Audio API (~50 lines: unlock on first input, cache buffers, play) | none needed | Our needs are short one-shots; no dependency | Autoplay unlock and iOS Safari quirks. Fallback: Howler.js (MIT, no release since 2023-09) |
| Audio files | Kenney Casino Audio (dice, cards), Interface Sounds (UI), Impact Sounds (hits) | CC0 | One style, no attribution | No obvious level-up sound; format unconfirmed (likely .ogg, Safari may need .mp3) |
| Tile art | Kenney Hexagon Tiles + Hexagon Buildings (2D PNG) | CC0 | Ready-made 2D hex terrain and buildings | 2014 art; terrain set may not cover "wasteland"; PNG scaling. Fallback: flat coloured SVG hexes (current) |
| Fonts | Oswald (display), Atkinson Hyperlegible Next (body), JetBrains Mono (numbers) | SIL OFL 1.1 | Legibility for short plain sentences; tabular digits | Oswald reads as generic "survival"; phase 10 may swap it |

## Rejected or not chosen

- **Howler.js** and **honeycomb-grid**: allowed licenses, kept as fallbacks only (slow-moving).
- **Tabler Icons** (MIT): fine, but Lucide is the single UI icon set.

## When each lands

- Fonts: loaded via Google Fonts CSS in phase 10 (art direction).
- Tile art: downloaded in phase 11 if the art guide keeps it; otherwise SVG hexes stay.
- Audio: downloaded in phase 15.

## Open questions (need a download to answer)

- Which terrain types does Hexagon Tiles include (plains, forest, hills, wasteland, lake, mountain)?
- Kenney audio file formats.
