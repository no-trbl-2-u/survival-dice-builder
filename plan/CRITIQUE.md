# Critique log

> Last pass: 2026-10-03 at commit 70348c1
> Pass count: 1

> External-observer feedback for Survival Dice-Builder. Populated by
> `/critique`, drained by `/iterate`. See `skills/critique.md`
> for the contract.

## Pending

### [HIGH] /tiles — terrain and site per hex only shows on hover
- pass: 1 (commit 70348c1)
- viewport: mobile
- category: a11y
- observation: Each hex's terrain and site is only an SVG `<title>` tooltip, reached by hovering. The lede says "Hover a hex", which touch and keyboard users cannot do; each tile is one `role="img"`, so screen readers skip the per-hex titles too. The designer may well review tiles on a phone.
- evidence: lede "Hover a hex for its terrain and site."; only the 3 nav links are tabbable; hex markup `<g data-terrain="plains" data-site="base"><title>plains, Base</title>`.
- suggested fix: under each tile, list its 7 hexes as text (position, terrain, site); change the lede to point at that list; capitalise terrain names consistently ("Plains, Base").
- source: browser

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

## Done

(empty)
