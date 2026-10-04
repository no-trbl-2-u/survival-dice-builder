# Critique log

> Last pass: 2026-10-04 at commit 23470a2
> Pass count: 4

> External-observer feedback for Survival Dice-Builder. Populated by
> `/critique`, drained by `/iterate`. See `skills/critique.md`
> for the contract.

## Pending

### [MED] any unknown path — a mistyped URL shows the home page with no "not found" notice
- pass: 4 (commit 23470a2)
- viewport: n/a (web-fetch)
- category: navigation
- observation: The `_redirects` catch-all serves the app shell with HTTP 200 for every path, and `matchRoute` falls back to the first route. A link to `/decision` or `/setup` opens Home with the heading "Survival Dice-Builder", so the visitor does not know the link was wrong. `/robots.txt` also returns the app HTML.
- evidence: `curl -w "%{http_code} %{content_type}"`: `/nonexistent-xyz` gives "200 text/html", `/robots.txt` gives "200 text/html". `apps/web/src/router.tsx`: "unknown paths fall back to the first route".
- suggested fix: Let `matchRoute` return a not-found route (title "Page not found", one line naming the path, links to Home and Play) for unknown paths. Add `apps/web/public/robots.txt` so crawlers get a text file.
- source: web-fetch

### [LOW] all pages — with JavaScript off the page is blank
- pass: 4 (commit 23470a2)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The shell has a title and a meta description, but the body is only `<div id="root"></div>`. A visitor without JavaScript, or a text-only fetch, gets the site name and nothing else. Every route gives the same output.
- evidence: Raw `/` HTML body: `<div id="root"></div>`. No `<noscript>` element. Reader WebFetch of `/`, `/decisions`, `/config`, `/play`, `/tiles`, `/credits`: "contains only a title 'Survival Dice-Builder'".
- suggested fix: Add a `<noscript>` paragraph to `apps/web/index.html`: one line that says what the game is and that it needs JavaScript.
- source: web-fetch

> Pass 4 note: web-fetch engine (cloud, no browser). The reader could not get the client-rendered copy on /decisions or /config from the shell, so the phase 18 and 19 copy was not reviewed. A browser pass should cover it.

## Done

### [x] [MED] /config — settings are code keys with no help text
- pass: 3 (commit d6176b7)
- viewport: desktop
- category: comprehension
- observation: The designer is this page's user, but the labels are de-camelCased keys, select options are code slugs, no field has help or a rules section, and the deck presets are a raw JSON textarea.
- evidence: Labels "every nrounds", "base hex figure limit exempt", "move cost next to enemy". Options "v1/grunt-die", "stay-lose-move/stay-keep-move", "next-target/wait". All 54 controls have no aria-describedby.
- suggested fix: Keep a label, one help line, and the rules section for each field in content (next to the config schema). Render the help through aria-describedby, and show select options as plain phrases.
- source: browser
- fixed: 8326abe (phase 19: label, help, and rules section for every field from config.meta.json, via aria-describedby; select options as phrases; presets keep JSON with help)

### [x] [MED] /config — save errors are raw schema text, unsaved edits vanish, and Reset needs no confirmation
- pass: 3 (commit d6176b7)
- viewport: desktop
- category: a11y
- observation: Errors appear in a list above the form, not at the field. The only Save button is at the top of a 2777px page. Leaving the page drops edits without a warning, and Reset to defaults applies at once.
- evidence: "player.maxHealth: Too small: expected number to be >0" in `ul[role=alert]`. `#cfg-player-maxHealth` has no aria-invalid and no min. Max health 20, then Play, then back shows 15. Reset gives the status "Reset to the defaults." with no confirm step.
- suggested fix: Put each error next to its field in plain words, with aria-invalid and aria-describedby. Make the Save bar sticky, add a beforeunload warning for unsaved edits, and confirm Reset.
- source: browser
- fixed: 8326abe (phase 19: plain errors at the field with aria-invalid and a linked summary; sticky Save bar; beforeunload on unsaved edits; Reset confirms)

### [x] [MED] /play — at 375px the controls for the current step sit far below the map
- pass: 3 (commit d6176b7)
- viewport: mobile
- category: mobile
- observation: Each decision means scrolling down past the map and the stats card to act, then back up to see the board. The map's health labels are tiny.
- evidence: At 375x800 in round 1 Prepare, the first "Play Build" button is at y=1153. In Combat, the Dice and Skills panels start at about y=880. The map renders 343x257px, and the enemy health text is font-size 9px. There is no horizontal overflow.
- suggested fix: At narrow widths, order the active panel (Choices, Hand, or Dice and Skills) directly under the round header, or pin it as a bottom sheet. Raise the map label size to at least 12px rendered.
- source: browser
- issue: #26
- fixed: a46ca82 (at 720px and narrower the current step's controls come before the map; map health text 12 units)

### [x] [LOW] /debug — the event log prints [object Object]; the State text starts with stray letters
- pass: 3 (commit d6176b7)
- viewport: desktop
- category: comprehension
- observation: Coordinate payloads are not formatted, and the map glyph text leaks into the State section's text.
- evidence: "[4.1] tilePlaced tile=broken-village center=[object Object]". The State innerText starts with the lines "B", "P", "g", "g".
- suggested fix: Format `{q,r}` payloads as "(q,r)" in `EventLog.tsx`. Mark the map glyph text aria-hidden, or give the map a single label.
- source: browser
- issue: #25
- fixed: 6546545 (hex payloads print as (q,r); the map's accessible name explains its letters)

### [x] [MED] /play — the log and summary use enemy ids, capitalise grunt and elite, and slip on grammar
- pass: 3 (commit d6176b7)
- viewport: desktop
- category: voice
- observation: Phase 17 labels and the log write "Grunt e1" and "Elite e4", but the rules style keeps grunt and elite lowercase, and an id means nothing to a player. Other slips: an article before a vowel, a plural with 1, and a bare distance number. The log still names places by coordinates only.
- evidence: "A elite appears at (-5,1).", "Grunt e1 moves to (0,-2) toward you.", "Target Elite e4, 14 of 14 health", summary "1 upgrades", choice "Place Stony Fields 3 south-east of the base (2,1)".
- suggested fix: Write "an elite", "1 upgrade", and "3 hexes south-east". Use a lowercase kind plus its place ("the grunt on Wasteland, 1 north-west"), keeping the id only as a muted suffix. Name log places with `hexName` and `stepsAway`, as the choices do.
- source: browser
- issue: #24
- fixed: 6828627 (lowercase game terms, log places named, "an elite", "1 upgrade", "N hexes"; ids kept to tell enemies apart)

### [x] [HIGH] /play — Skills, draft options, and Shop offers never say what they do
- pass: 3 (commit d6176b7)
- viewport: desktop
- category: comprehension
- observation: The Skill board shows only a name and its die faces. The draft dialog and the Shop show only a name, faces, and a cost. A first-time player cannot judge which die to assign, which Skill to draft, or which card to buy.
- evidence: Skills panel: "Strike — can fire", "Shot / Bow", "Mend / Wand", "Guard / Shield". Draft: "Draft Renewal (Wand + Wand)", "Draft Spark Burst (Wand + Bow)". Shop: "Haul / Cost 3", "Bandage / Cost 3". No description, tooltip, or details element in the combat DOM.
- suggested fix: Generate a one-line effect text from each Skill's and card's structured `effect` in content (for example "2 damage to 1 enemy within 1 hex"). Show it under each Skill, draft option, and Shop offer.
- source: browser
- issue: #23
- fixed: 4206ea0 (effect text generated from content under each Skill, in each draft option, and on each Shop offer)

### [x] [MED] /tiles — dark-mode terrain colours are hard to tell apart
- pass: 1 (commit 70348c1)
- viewport: mobile
- category: visual
- observation: In dark mode Hills and Wasteland are nearly the same, and Plains and Forest are both dark muted greens. Already flagged for the phase 10 palette; filed here so `/iterate` can fix it sooner.
- evidence: dark swatches hills rgb(117,96,58), wasteland rgb(107,92,71), plains rgb(93,107,60), forest rgb(53,85,58).
- suggested fix: spread the dark terrain tokens in `apps/web/src/styles/tokens.css` further apart in lightness and hue (target a visible step between every pair).
- source: browser
- issue: #21 (phase 17)
- fixed: c5a664b (dark terrain tokens retuned, every pair at least 20 apart (delta E), enforced by check-design)

### [x] [MED] /debug — keyboard focus is lost after every action
- pass: 1 (commit 70348c1)
- viewport: desktop
- category: a11y
- observation: Pressing an action button re-renders the action list; the pressed button disappears and focus falls to `<body>`, so keyboard users must tab from the top after each action. The log has no live region. The same pattern will matter for the real UI in phases 11-12 (bearings: keyboard-operable decisions).
- evidence: after Enter on "Play Move (bottom)", `document.activeElement` was BODY; no `aria-live`/`role=log` on the page.
- suggested fix: after each action, focus the first new action button (or the "Legal actions" heading with `tabIndex={-1}`); give the event log `role="log"` and `aria-live="polite"`.
- source: browser
- issue: #21 (phase 17)
- fixed: c5a664b (focus returns to the Legal actions heading; the log is role=log, aria-live=polite)

### [x] [MED] /debug — no explanation; shorthand and grammar slips
- pass: 1 (commit 70348c1)
- viewport: desktop
- category: voice
- observation: The page does not say what it is or that `[6.2]` in the log is a rules section. State shorthand ("e1 grunt (2)", "1 dice", "roll 1 of 3") is unexplained or ungrammatical, and button verbs vary ("Discard Build unplayed", "Stop rolling" vs "Finish rerolls").
- evidence: H1 "Engine console" is followed directly by the seed input; "15/15 health, 0 guard, 1 dice".
- suggested fix: add a one-line lede ("Play the rules engine one action at a time. Numbers in [brackets] are rules sections."), write "1 die"/"N dice" and "grunt, 2 health", and use "Discard Build" and "Stop rerolling".
- source: browser
- issue: #21 (phase 17)
- fixed: c5a664b (lede added; "1 die", "grunt, 2 health", "Discard Build", "Stop rerolling")

### [x] [LOW] all pages — same document title everywhere; nav does not mark the current page
- pass: 1 (commit 70348c1)
- viewport: desktop
- category: navigation
- observation: `document.title` is "Survival Dice-Builder" on /, /tiles, and /debug, and no nav link has `aria-current`. The home page has no lede, though the meta description has one.
- evidence: titles identical; nav `aria-current` = [null, null, null].
- suggested fix: set the title per route ("Tile sheet - Survival Dice-Builder"), add `aria-current="page"` plus a visible style on the active link, and show the tagline under the home H1.
- source: browser
- issue: #21 (phase 17)
- fixed: c5a664b (per-route document.title; aria-current plus a visible style in the nav)

### [x] [MED] /play — choice buttons name hexes by axial coordinates and a code slug
- pass: 2 (commit 2f63473)
- viewport: mobile
- category: comprehension
- observation: Move and placement choices read as coordinates, and the tile appears as its id rather than its name, although the map knows each hex's terrain.
- evidence: The heading says "Place Stony Fields: choose a slot", but the buttons say "Place stony-fields at (2,1)". Move buttons say "Move to (1,0)".
- suggested fix: Label choices with the display name and terrain plus a direction, for example "Move to Forest (upper right)" or "Place Stony Fields: slot 1 (north-east)". Keep the coordinates in a muted suffix.
- source: browser
- issue: #21 (phase 17)
- fixed: c5a664b (choices name the place and direction; the coordinate is a muted suffix)

### [x] [MED] /play — the map's text alternatives omit enemies
- pass: 2 (commit 2f63473)
- viewport: mobile
- category: a11y
- observation: Each hex's `<title>` gives terrain and site only. An enemy has an accessible name only while it is a legal target, so a screen-reader user cannot find a grunt on the board.
- evidence: The 14 map `<title>`s are all terrain/site, for example "plains, Spawn node". The log says "A grunt appears at (2,0)", and the header says "Enemies 1/20".
- suggested fix: Add occupants to each hex title ("Plains, Spawn node, 1 grunt (2/2 health)"), or add a visually hidden "On the board" list.
- source: browser
- issue: #21 (phase 17)
- fixed: c5a664b (hex titles list enemies, defenses, and figures; non-target enemies are named images)

### [x] [MED] /play — the start panel does not explain the goal or the seed
- pass: 2 (commit 2f63473)
- viewport: desktop
- category: comprehension
- observation: "New run" asks for Players and a Seed with no line on what a seed is or how a run ends.
- evidence: The panel text is "New run / Players 1 2 3 4 / Seed [11998] / Start run / Config: default rules."
- suggested fix: Add 1 line on the goal ("Keep the base and every player alive as long as you can.") and 1 on the seed ("The same seed gives the same game.").
- source: browser
- issue: #21 (phase 17)
- fixed: c5a664b (goal line and a seed hint (aria-describedby))

### [x] [MED] /credits — 18 links are all named "Source", and the licence is stated twice per line
- pass: 2 (commit 2f63473)
- viewport: mobile
- category: a11y
- observation: In a screen reader's links list, the 18 "Source" links cannot be told apart (WCAG 2.4.4). Each line repeats "CC BY 3.0".
- evidence: "Sword die face: Broadsword icon by Lorc, game-icons.net, CC BY 3.0. Source · CC BY 3.0" (`CreditsPage.tsx:32`).
- suggested fix: Make the asset name the source link, and state the licence once per line (or once per section).
- source: browser
- issue: #20
- fixed: 2d542b8 (work names link to sources; shared licence stated once)

### [x] [MED] /tiles — no legend for the 4 site icons
- pass: 1 (commit 70348c1)
- viewport: desktop
- category: comprehension
- observation: The legend covers the 6 terrain colours but not the site icons (castle, rock, cave, ogre). A first-time reviewer cannot tell gathering node, spawn node, and elite spawn node apart without decoding the captions.
- evidence: legend `<ul aria-label="Terrain legend">` has 6 items, all terrains.
- suggested fix: add a "Sites" legend row showing each icon with its name (Base, Gathering node, Spawn node, Elite spawn node).
- source: browser
- issue: #19
- fixed: c3497c8 (site legend with icons and names)

### [x] [MED] /play — the log and footer show card ids, rule numbers, and "1 actions"
- pass: 2 (commit 2f63473)
- viewport: mobile
- category: voice
- observation: The "What happened" log names cards by instance id and starts each line with a rule number. A zero result does not say why. The footer has a plural slip.
- evidence:
  - "6.2 You played card c3 (top half)."
  - "6.7 You gathered 0 materials (now 0)."
  - The footer reads "Seed 7 · 1 player · 1 actions" (`describeEvent.ts:35` and `PlayPage.tsx:189`).
- suggested fix: Use card names ("You played Gather (top half)."). Move the rule numbers into a muted prefix or a tooltip. Say why a gather is 0. Pluralise "action".
- source: browser
- issue: #18
- fixed: 77c6b73 (card and enemy names, gather-0 reason, muted rule note, plural)

### [x] [HIGH] / — the home page does not say what the game is or where to start
- pass: 2 (commit 2f63473)
- viewport: mobile
- category: comprehension
- observation: At first paint the home page shows only the title and an unlabelled hex tile. It has no pitch and no way into a run other than the nav.
- evidence: The body text is the nav plus "Survival Dice-Builder". The DOM is nav, `<h1>`, and `<svg aria-label="Map tile with 7 hexes">`. The meta description "Defend the base, build your dice, survive one more round." is never shown.
- suggested fix: Under the H1, add a 1-2 sentence pitch (reuse the meta description) and a primary "Start a run" link to /play.
- source: browser
- issue: #17
- fixed: c97d007 (home page pitch, "Start a run" link, how a run goes)

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

