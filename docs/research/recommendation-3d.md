# 3D recommendation (phase 3, spec A) — research only

Checked 2026-10-03. 3D is presentation only: the engine always decides the result, and the 2D
dice tray stays the default. **The spike is deferred to phase 15** (decided 2026-10-02), where
spec A's acceptance criterion ("a d6 with custom faces lands on a face chosen by code") is met.

## The deciding question: can it land on a predetermined face?

| Library | License | Last release | Predetermined face? | Verdict |
|---|---|---|---|---|
| @3d-dice/dice-box 1.1.4 (BabylonJS 5.57 + AmmoJS) | MIT (Babylon Apache-2.0, Ammo zlib) | 2024-08-24 | **No.** Issue #47 "Deterministic Rolls" open since 2022; #86 closed as duplicate; v2.0 never shipped | Rejected for our need |
| @3d-dice/dice-box-threejs 0.0.12 (three 0.143 + cannon-es 0.20) | MIT | 2022-10-26 | **Yes**, `roll("1d6@4")` per README "Predetermined Outcomes" | Fallback only: unmaintained, old three pin, custom d6 face images undocumented |
| owlbear-rodeo/dice (R3F + Rapier) | **GPL-3.0** | commit 2024-04-10 | No (physics decides the result) | Rejected (copyleft) |

## Recommendation

**Build our own die with React Three Fiber + @react-three/rapier + three.js.**

Method (the one discussed in dice-box #47): simulate the throw off-screen with the physics engine,
read which face ends up on top, then remap the die's face textures so the engine's chosen face is
the one that lands on top, and play the recorded throw on screen. The physics stays natural; the
result is the engine's.

| Part | Pick | License | Risk |
|---|---|---|---|
| Renderer | three.js 0.186 via @react-three/fiber 9.8 | MIT | Bundle size; load only when the 3D toggle is on (dynamic import) |
| Physics | @react-three/rapier 2.2 / Rapier JS 0.21 | MIT / Apache-2.0 | WASM; check Vite 8 compatibility and size |
| Models | Kenney Hexagon Kit (3D tiles), Quaternius (figures, monsters) | CC0 | Two artists' low-poly styles may need recolouring in Blender |
| Textures, HDRIs | Poly Haven, ambientCG | CC0 | Large files; compress before shipping |
| Pipeline | Blender (tool only, GPL) → .glb → glTF Transform (MIT) | — | Tooling, not shipped |

If the phase 15 spike cannot land on a chosen face within the phase, ship without 3D dice and
record why here (bearings: a failed spike is not a blocker).

## Not needed for v1

- A 3D board view: the 2D SVG board stays the default; no evidence yet that a tabletop view is
  worth the cost.
