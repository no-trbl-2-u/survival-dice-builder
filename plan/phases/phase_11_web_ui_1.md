# Phase 11 — Web UI I: /play

> Agent-facing brief. Ship without asking. Source:
> `spec/phases/phase-5-web-ui.md` (first half). Look: `design/ART-GUIDE.md`
> and `design/mockups/main-screen.svg`.

## Outcome

`/play` is a playable solo run in the browser by mouse and keyboard. Every control comes from
`legalActions`; the UI never decides a rule.

## Modules

```
apps/web/src/play/
├── PlayPage.tsx        # run state (seed + actions), layout, wiring
├── run.ts              # runReducer (new run, act) — pure, tested
├── targets.ts          # legal actions grouped by map hex / die / Skill slot — pure, tested
├── PhaseBar.tsx        # round, 3 phases (current marked), wave track, tiles left, miniatures
├── PlayMap.tsx         # SVG map: pan (drag, buttons), zoom (buttons, wheel), sites, figures,
│                       #   enemies with health, defenses, legal targets as focusable buttons
├── PlayerPanel.tsx     # health, guard, dice, materials, currency, experience/level, base
├── Hand.tsx, CardView.tsx  # cards with both halves; the hand turns 180 degrees in Combat
├── DiceTray.tsx        # dice, keep toggles, roll counter, roll/stop, reroll
├── SkillBoard.tsx      # Skills and slots; pick a die, then a slot; live can-fire highlight
└── Choices.tsx         # every other legal action as a labelled button (Shop, draft, ...)
```

## Decisions made upfront — DO NOT ASK

- **Coverage first:** any legal action without a dedicated control appears in "Choices"
  with the `describeAction` label, so a full run is already playable; phase 12 replaces those
  buttons with the base panel, Shop, draft dialog, and tile preview.
- **Map targets:** `moveTo`, `placeTile` (ghost tile outline), `build` (one button per
  defense at the hex), and `chooseTarget` (enemies) are SVG elements with `role="button"`,
  `tabIndex=0`, an `aria-label`, and Enter/Space. They are also listed in Choices, so the
  keyboard path never depends on finding a hex.
- **Dice placement:** select a die (button), then a highlighted slot. A filled slot is a
  button that takes the die back. "Can fire" = the dice on the Skill complete it (solid) or
  the free dice could (outlined), via the engine's `canFire`.
- **Card rotation:** the hand container rotates 180 degrees when the deck is bottom-up
  (Combat), with a CSS transition that the global reduced-motion rule turns off. Each card
  also names the active half in text.
- Pan/zoom keeps it simple: drag to pan, +/- buttons and the wheel to zoom, a reset button.
- Tokens from `apps/web/src/styles/tokens.css`; icons from `assets/icons` via `gameIcons`.

## Tests

- Unit: `run.ts`, `targets.ts` (hex grouping, die/slot lookup), CardView half labels.
- e2e: `/play` places the setup tile, plays the Prepare hands, and completes one Combat
  exchange by keyboard-reachable buttons, with no console errors; 375px has no horizontal
  scroll.

## DoD

`pnpm verify` green, deploy green, nav link to `/play`.
