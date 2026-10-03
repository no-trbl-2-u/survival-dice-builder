# Critique log

> Last pass: 2026-10-03 at commit 85d1c4d
> Pass count: 2

> External-observer feedback for Survival Dice-Builder. Populated by
> `/critique`, drained by `/iterate`. See `skills/critique.md`
> for the contract.

## Pending

### [MED] /tiles — no legend for the 4 site icons
- pass: 1 (commit 70348c1)
- viewport: desktop
- category: comprehension
- observation: The legend covers the 6 terrain colours but not the site icons (castle, rock, cave, ogre). A first-time reviewer cannot tell gathering node, spawn node, and elite spawn node apart without decoding the captions.
- evidence: legend `<ul aria-label="Terrain legend">` has 6 items, all terrains.
- suggested fix: add a "Sites" legend row showing each icon with its name (Base, Gathering node, Spawn node, Elite spawn node).
- source: browser

### [MED] /tiles — dark-mode terrain colours are hard to tell apart
- pass: 1 (commit 70348c1)
- viewport: mobile
- category: visual
- observation: In dark mode Hills and Wasteland are nearly the same, and Plains and Forest are both dark muted greens. Already flagged for the phase 10 palette; filed here so `/iterate` can fix it sooner.
- evidence: dark swatches hills rgb(117,96,58), wasteland rgb(107,92,71), plains rgb(93,107,60), forest rgb(53,85,58).
- suggested fix: spread the dark terrain tokens in `apps/web/src/styles/tokens.css` further apart in lightness and hue (target a visible step between every pair).
- source: browser

### [MED] /debug — keyboard focus is lost after every action
- pass: 1 (commit 70348c1)
- viewport: desktop
- category: a11y
- observation: Pressing an action button re-renders the action list; the pressed button disappears and focus falls to `<body>`, so keyboard users must tab from the top after each action. The log has no live region. The same pattern will matter for the real UI in phases 11-12 (bearings: keyboard-operable decisions).
- evidence: after Enter on "Play Move (bottom)", `document.activeElement` was BODY; no `aria-live`/`role=log` on the page.
- suggested fix: after each action, focus the first new action button (or the "Legal actions" heading with `tabIndex={-1}`); give the event log `role="log"` and `aria-live="polite"`.
- source: browser

### [MED] /debug — no explanation; shorthand and grammar slips
- pass: 1 (commit 70348c1)
- viewport: desktop
- category: voice
- observation: The page does not say what it is or that `[6.2]` in the log is a rules section. State shorthand ("e1 grunt (2)", "1 dice", "roll 1 of 3") is unexplained or ungrammatical, and button verbs vary ("Discard Build unplayed", "Stop rolling" vs "Finish rerolls").
- evidence: H1 "Engine console" is followed directly by the seed input; "15/15 health, 0 guard, 1 dice".
- suggested fix: add a one-line lede ("Play the rules engine one action at a time. Numbers in [brackets] are rules sections."), write "1 die"/"N dice" and "grunt, 2 health", and use "Discard Build" and "Stop rerolling".
- source: browser

### [LOW] all pages — same document title everywhere; nav does not mark the current page
- pass: 1 (commit 70348c1)
- viewport: desktop
- category: navigation
- observation: `document.title` is "Survival Dice-Builder" on /, /tiles, and /debug, and no nav link has `aria-current`. The home page has no lede, though the meta description has one.
- evidence: titles identical; nav `aria-current` = [null, null, null].
- suggested fix: set the title per route ("Tile sheet - Survival Dice-Builder"), add `aria-current="page"` plus a visible style on the active link, and show the tagline under the home H1.
- source: browser

### [HIGH] / — the home page does not say what the game is or where to start
- pass: 2 (commit 85d1c4d)
- viewport: mobile
- category: comprehension
- observation: At first paint the home page shows only the title and an unlabelled hex tile. It has no pitch and no way into a run other than the nav.
- evidence: The body text is the nav plus "Survival Dice-Builder". The DOM is nav, `<h1>`, and `<svg aria-label="Map tile with 7 hexes">`. The meta description "Defend the base, build your dice, survive one more round." is never shown.
- suggested fix: Under the H1, add a 1-2 sentence pitch (reuse the meta description) and a primary "Start a run" link to /play.
- source: browser

### [MED] /play — the log and footer show card ids, rule numbers, and "1 actions"
- pass: 2 (commit 85d1c4d)
- viewport: mobile
- category: voice
- observation: The "What happened" log names cards by instance id and starts each line with a rule number. A zero result does not say why. The footer has a plural slip.
- evidence:
  - "6.2 You played card c3 (top half)."
  - "6.7 You gathered 0 materials (now 0)."
  - The footer reads "Seed 7 · 1 player · 1 actions" (`describeEvent.ts:35` and `PlayPage.tsx:189`).
- suggested fix: Use card names ("You played Gather (top half)."). Move the rule numbers into a muted prefix or a tooltip. Say why a gather is 0. Pluralise "action".
- source: browser

### [MED] /play — choice buttons name hexes by axial coordinates and a code slug
- pass: 2 (commit 85d1c4d)
- viewport: mobile
- category: comprehension
- observation: Move and placement choices read as coordinates, and the tile appears as its id rather than its name, although the map knows each hex's terrain.
- evidence: The heading says "Place Stony Fields: choose a slot", but the buttons say "Place stony-fields at (2,1)". Move buttons say "Move to (1,0)".
- suggested fix: Label choices with the display name and terrain plus a direction, for example "Move to Forest (upper right)" or "Place Stony Fields: slot 1 (north-east)". Keep the coordinates in a muted suffix.
- source: browser

### [MED] /play — the map's text alternatives omit enemies
- pass: 2 (commit 85d1c4d)
- viewport: mobile
- category: a11y
- observation: Each hex's `<title>` gives terrain and site only. An enemy has an accessible name only while it is a legal target, so a screen-reader user cannot find a grunt on the board.
- evidence: The 14 map `<title>`s are all terrain/site, for example "plains, Spawn node". The log says "A grunt appears at (2,0)", and the header says "Enemies 1/20".
- suggested fix: Add occupants to each hex title ("Plains, Spawn node, 1 grunt (2/2 health)"), or add a visually hidden "On the board" list.
- source: browser

### [MED] /play — the start panel does not explain the goal or the seed
- pass: 2 (commit 85d1c4d)
- viewport: desktop
- category: comprehension
- observation: "New run" asks for Players and a Seed with no line on what a seed is or how a run ends.
- evidence: The panel text is "New run / Players 1 2 3 4 / Seed [11998] / Start run / Config: default rules."
- suggested fix: Add 1 line on the goal ("Keep the base and every player alive as long as you can.") and 1 on the seed ("The same seed gives the same game.").
- source: browser

### [MED] /credits — 18 links are all named "Source", and the licence is stated twice per line
- pass: 2 (commit 85d1c4d)
- viewport: mobile
- category: a11y
- observation: In a screen reader's links list, the 18 "Source" links cannot be told apart (WCAG 2.4.4). Each line repeats "CC BY 3.0".
- evidence: "Sword die face: Broadsword icon by Lorc, game-icons.net, CC BY 3.0. Source · CC BY 3.0" (`CreditsPage.tsx:32`).
- suggested fix: Make the asset name the source link, and state the licence once per line (or once per section).
- source: browser

## Done

### [x] [HIGH] /tiles — terrain and site per hex only shows on hover
- pass: 1 (commit 70348c1)
- viewport: mobile
- category: a11y
- observation: Each hex's terrain and site is only an SVG `<title>` tooltip, reached by hovering. The lede says "Hover a hex", which touch and keyboard users cannot do; each tile is one `role="img"`, so screen readers skip the per-hex titles too. The designer may well review tiles on a phone.
- evidence: lede "Hover a hex for its terrain and site."; only the 3 nav links are tabbable; hex markup `<g data-terrain="plains" data-site="base"><title>plains, Base</title>`.
- suggested fix: under each tile, list its 7 hexes as text (position, terrain, site); change the lede to point at that list; capitalise terrain names consistently ("Plains, Base").
- source: browser
- issue: #16
- fixed: 08a5708 (each tile lists its 7 hexes as text; lede reworded)

