# Phase 17 — Accessibility and navigation pass

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` (expand pass 1,
> score 6.5), promoted via oversight 2026-10-03 and rescoped to the 7 pending rows of
> `plan/CRITIQUE.md`.

## Outcome

Every pending critique row is fixed in one pass:
- A keyboard or screen-reader player can find every piece on the `/play` board.
- Choices name places rather than coordinates.
- `/debug` keeps focus after each action.
- Each page has its own tab title and a marked nav link.
- The dark terrain colours can be told apart.

## Web (apps/web/src)

- **Place names (shared):** a new `map/places.ts` (pure), used by `/play` and `/debug`.
  - `hexName(state, hex)` gives the terrain and site ("Forest", "Plains, Spawn node"), or "open ground" when no tile is there.
  - `bearing(from, to)` gives a compass word from the pixel angle: one of the 8 points, or "here".
  - `steps(from, to)` gives the hex distance.
- **`describeAction`:**
  - **Move:** "Move to Forest, 2 north-east". It names the enemy when there is a skirmish: "skirmish Grunt e1".
  - **Place:** "Place Stony Fields north-east of the base". The tile name comes from content, not the id.
  - **Build:** "Build Wall on Hills, north".
  - **Target:** "Target Grunt e1, 2 of 2 health".
  - **Wording:** "Discard Build" (no "unplayed"), and "Stop rerolling" in place of "Finish rerolls".
  - A new `actionHex(action)` returns the coordinates. `Choices` and `/debug` show them as a muted `(q,r)` suffix.
- **PlayMap:**
  - Each hex `<title>` lists what is on it, for example "Plains, Spawn node: Grunt e1 (2 of 2 health), your figure".
  - An enemy that is not a target gets `role="img"` and the same name.
  - The SVG map targets use the same place names.
- **StartPanel:** 2 lines.
  - "Keep the base and every player alive for as many rounds as you can."
  - "The same seed and the same choices give the same game."
- **/debug:**
  - A lede: "Play the rules engine one action at a time. Numbers in [brackets] are rules sections."
  - After each action or bot step, focus moves to the "Legal actions" heading (`tabIndex={-1}`).
  - The event log gets `role="log"` and `aria-live="polite"`.
  - StateView text: "1 die" or "N dice", and "grunt, 2 health".
- **Shell (App.tsx):**
  - `document.title` is "<route title> - Survival Dice-Builder". The home page keeps the bare name.
  - The nav comes from the route list, and the current link gets `aria-current="page"` with a visible style: underline plus bold.
- **Dark terrain tokens** (`design/tokens.json` and `styles/tokens.css`):
  - Spread the 6 terrains apart in lightness and hue.
  - `check-design.mjs` gains a distinctness check: every pair of terrains in each scheme must be at least 20 apart (CIE76 delta E).
  - Every existing contrast check must still pass.

## Decisions made upfront — DO NOT ASK

- **Bearings use screen directions on the drawn map** (8 compass words), not hex axial names. A player reads the map, not the coordinate system.
- **Coordinates stay visible as a muted suffix.** Playtest reports and replays refer to them.
- **The home tagline is already done** (c97d007 added the pitch), so the shell row covers only the title and `aria-current`.
- **The `/debug` focus target is the heading, not the first new button.** Its action list changes completely between steps, so the heading is the one stable place.
- **No visually hidden board list.** The hex titles plus named enemies cover the critique row. A second list would read the board twice.

## Tests

- **Unit:**
  - `places.ts`: bearings for all 6 neighbours plus "here", the step count, and hex names with and without a site.
  - `describeAction`: move, place, build and target labels contain no bare `(q,r)` and no tile id.
  - The App title and `aria-current` for 2 routes.
  - `check-design`: the distinctness check passes on the new palette.
- **e2e:**
  - `a11y.spec.ts`: on every route, the title is unique, the nav marks exactly 1 link `aria-current`, and 10 Tab presses never leave focus on `<body>`.
  - On `/debug`, Enter on an action leaves focus on the "Legal actions" heading.
  - On `/play`, a hex title names an enemy after the first wave spawns, using bot steps through the seeded run.
- Update any existing e2e or unit test that matched the old labels.

## DoD

- `pnpm verify` is green and the deploy is green.
- The 7 CRITIQUE rows move to Done, with this phase's commit cited.
