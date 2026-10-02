# Phase A — Asset and library research (non-code)

**Goal:** a license-checked list of icons, art, fonts, audio, and libraries the prototype can use, so code phases never stop to search.

## Scope

1. **Die face icons:** find 1 icon each for Sword, Wand, Bow, Shield, Star, Blank. Same style for all six. Also icons for materials, currency, health, guard, experience, base, Barricade, Tower, grunt, elite, gathering node, spawn node.
2. **Hex tiles and terrain:** 2D or 3D hex tiles for plains, forest, hills, wasteland, lake, mountain, and a central base.
3. **Miniatures (optional, for Phase 8):** low-poly player figures, grunts, elites, a tower, a barricade.
4. **3D dice:** a library that rolls custom-faced d6 dice with physics and returns the result, so the engine stays in control of randomness (the engine decides the result; the 3D roll shows it).
5. **Hex math:** a hex-grid library or reference.
6. **Audio:** dice rolls, card flips, hits, level-up.
7. **Fonts:** one display face, one body face, one numeric face.

## Starting candidates (verify each license before use)

| Need | Candidate | License (as published) | Notes |
| --- | --- | --- | --- |
| Game icons | game-icons.net | CC BY 3.0, credit each author | 4,000+ SVG icons; good for die faces and resources |
| UI icons | Lucide or Tabler Icons | ISC / MIT (verify) | Buttons and chrome only |
| Hex tiles | Kenney Hexagon Kit, Hexagon Tiles, Hexagon Buildings | CC0 | 2D renders and 3D models |
| Low-poly models | Quaternius packs | CC0 | Characters, monsters, nature |
| More 3D models | Poly Pizza | Mixed, check per model | Many Quaternius and Kenney models |
| 3D dice | @3d-dice/dice-box | MIT; uses BabylonJS + AmmoJS | Custom themes; CC0 theme repo; returns results |
| 3D dice (alternative) | React Three Fiber + @react-three/rapier | MIT | Build custom dice; more work, more control |
| Hex grid | honeycomb-grid (TypeScript) | Verify | Or implement from Red Blob Games hex guide |
| Audio playback | Howler.js | MIT (verify) | Simple web audio |
| Audio files | Kenney audio packs | CC0 (verify) | UI and impact sounds |
| Fonts | Google Fonts | SIL OFL | Same faces as the spec page if wanted |

## Deliverables

- `ASSETS.md` license register: asset name, source URL, license, required attribution text, local file path, date checked.
- `/assets` folder with downloaded files, organized by type.
- One-page recommendation: chosen icon set, tile set, dice approach (2D SVG dice first, 3D dice later), with reasons.
- Attribution text ready for an in-app Credits screen.

## Acceptance criteria

- Every asset in `/assets` has a row in `ASSETS.md` with a license link.
- No asset with a non-commercial or no-derivatives license unless the designer approves it.
- The 6 die faces exist as SVG in one consistent style.
- A 3D dice spike (Phase 8 will build it) confirms the chosen library can show a **predetermined** result, or the report says it cannot.

## Out of scope

Commissioning original art. Final visual identity (Phase B).

## 3D mechanics research (feeds Phase 8)

The engine always decides results. 3D is presentation only and must be switchable off.

| Need | Candidates to evaluate | License (verify) | Decision to record |
| --- | --- | --- | --- |
| 3D dice with physics | @3d-dice/dice-box (BabylonJS + AmmoJS); owlbear-rodeo/dice (React Three Fiber + Rapier) | MIT / check repo | Can it land on a predetermined face? |
| 3D board (optional) | Three.js via React Three Fiber; BabylonJS | MIT / Apache 2.0 | 2D SVG board stays default; is a 3D tabletop view worth it? |
| Physics engine | Rapier (@react-three/rapier), cannon-es, AmmoJS | Apache 2.0 / MIT / zlib | Match the renderer chosen above |
| Models | Kenney Hexagon Kit (3D tiles), Quaternius (characters, monsters), Poly Pizza | CC0 / mixed | Low-poly style that matches 2D icons |
| Textures and lighting | Poly Haven, ambientCG (PBR materials, HDRIs) | CC0 | Table surface, dice materials |
| Model tools | Blender (edit, recolor, export), glTF Transform (optimize .glb) | GPL (tool only) / MIT | Pipeline: source → Blender → .glb → compress |

Deliverable: a 1-page 3D recommendation plus a spike (a single d6 with custom faces that lands on a face chosen by code), with frame-rate notes on a mid-range laptop.

## Sources checked (2026-10-02)

- game-icons.net license: https://game-icons.net/about.html
- Kenney Hexagon Kit: https://kenney.nl/assets/hexagon-kit · Hexagon Tiles: https://kenney.nl/assets/hexagon-tiles · Hexagon Buildings: https://kenney.nl/assets/hexagon-buildings
- Quaternius: https://quaternius.com/
- dice-box: https://github.com/3d-dice/dice-box
- react-three-rapier: https://github.com/pmndrs/react-three-rapier
- owlbear-rodeo/dice: https://github.com/owlbear-rodeo/dice (check license)
- Honeycomb hex grid: https://abbekeultjes.nl/honeycomb/
- Poly Haven license: https://polyhaven.com/license

Lucide, Tabler, Howler.js, Kenney audio, cannon-es, AmmoJS, ambientCG, and Red Blob Games still need a license check.
