# Critique log

> Last pass: 2026-10-09 at commit e859de5
> Pass count: 9

> External-observer feedback for Survival Dice-Builder. Populated by
> `/critique`, drained by `/iterate`. See `skills/critique.md`
> for the contract.

## Pending

### [MED] all pages — rules sections are cited but the rules are never linked
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: Home, /config, /debug and /decisions cite "the written rules" and rule numbers, but no page links to the rules. A visitor cannot look up a cited section.
- evidence: `apps/web/src/home/HomePage.tsx:27` "the Combat in the written rules"; `apps/web/src/config/ConfigPage.tsx:632` "Each field names its rules section."; `apps/web/src/debug/DebugPage.tsx:81` "Numbers in [brackets] are rules sections."; no href to the rules anywhere in `apps/web/src`.
- suggested fix: Link "the written rules" (and the /config and /debug notes) to `spec/01-spec-v1-rules.md` on GitHub, using the repository-link helper in `apps/web/src/decisions/Inline.tsx`.
- source: web-fetch

### [LOW] all pages — nav labels "Tiles" and "Debug" do not match the page headings
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: navigation
- observation: The nav says "Tiles" and "Debug", but the pages they open are headed "Tile sheet" and "Engine console".
- evidence: `apps/web/src/App.tsx:17,19` nav labels vs `:32,34` route titles.
- suggested fix: Use one name per page: nav "Tile sheet" and "Engine console", or rename the headings to match the nav.
- source: web-fetch

### [LOW] all pages — design tools sit in the nav as equals of Play
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: navigation
- observation: Tiles, Decisions and Debug are design and playtest aids, but the nav lists them beside Home and Play with nothing to tell them apart.
- evidence: `apps/web/src/App.tsx:13-21` NAV lists seven equal links.
- suggested fix: Split the nav into the game links and a labelled "Design tools" group, or open each tool page with one sentence that says it is a design aid.
- source: web-fetch

### [LOW] all pages — one meta description and og:url for every route, no canonical
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: seo
- observation: Every route has the home description and an og:url fixed to the home page, and there is no rel=canonical.
- evidence: `apps/web/index.html:6,16`; `apps/web/src/App.tsx:53-61` sets only the title and noindex per route.
- suggested fix: In the route effect, set a canonical link and og:url from the route path, and give each route its own description.
- source: web-fetch

### [LOW] /config — the save message names a URL path, not the page
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: voice
- observation: After a save the page says "/play" where a visitor sees the nav label "Play".
- evidence: `apps/web/src/config/ConfigPage.tsx:615` "Saved. New runs on /play use this config."
- suggested fix: Change to "Saved. New runs on the Play page use this config."
- source: web-fetch

### [LOW] /credits — the intro describes how the page is built
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: voice
- observation: The second sentence is build-process language with no use to a visitor.
- evidence: `apps/web/src/credits/CreditsPage.tsx:60` "Generated from the project's asset register."
- suggested fix: Cut the sentence, or replace it with where to report a missing credit.
- source: web-fetch

### [LOW] / — the home page does not link the Decisions page
- pass: 8 (commit c9bd27d)
- viewport: n/a (web-fetch)
- category: navigation
- observation: The "Also:" line links the tiles, the config, and credits, but not Decisions, the page that lists what waits on the designer.
- evidence: `apps/web/src/home/HomePage.tsx:37-38`.
- suggested fix: Add "the rules questions that wait on you" linked to /decisions to the "Also:" line.
- source: web-fetch

### [LOW] / — the Combat step is one long sentence chain
- pass: 8 (commit c9bd27d)
- viewport: n/a (web-fetch)
- category: voice
- observation: The Combat step joins three clauses with semicolons and colons, and names the "start panel" and "Exchanges" before the visitor has seen either. This is not the short, plain style set in bearings.
- evidence: `apps/web/src/home/HomePage.tsx:25-29` "Put your dice on your Skills one at a time; the enemy dice hit last, after your guard. Or choose Exchanges, the Combat in the written rules, on the start panel: in each exchange you roll, ..."
- suggested fix: Split into short sentences, and put Exchanges in its own sentence: "Before a run, you can choose Exchanges, the Combat in the written rules."
- source: web-fetch

### [LOW] /play — enemy choice buttons name enemies by engine id ("grunt e3")
- pass: 7 (commit b91436a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: Target, Tower-target, skirmish and resolve buttons name each enemy as "<kind> <id>", e.g. "Tower on Plains, 2 hexes north of the base centre shoots grunt e3 on Forest, 2 health". The Tower button repeats the Tower's full place, which the banner already gives. Two enemies on the same terrain differ only by the id.
- evidence: `apps/web/src/debug/describeAction.ts:17-19` `enemyName` returns `${kind} ${id}`; used at `:71`, `:75`, `:88`, `:131`; banner at `apps/web/src/play/nextStep.ts:47`.
- suggested fix: Name enemies by kind plus place (terrain and direction from the player or Tower, as `stepsAway` does), and leave the Tower out of Tower-target buttons.
- source: web-fetch

### [LOW] /config — pick lists show internal ids next to names; presets show only ids
- pass: 6 (commit e9a9406)
- viewport: n/a (web-fetch)
- category: voice
- observation: The Skill and card pick lists show each option as "Name (id)". Deck presets are listed by bare id, e.g. "preset-2".
- evidence: `apps/web/src/config/ConfigPage.tsx:101` ```${name} (${id})` ``; `ConfigPage.tsx:81` `presets.map((p) => [p.id, p.id])`.
- suggested fix: Show only the name in options; label presets "Preset 1", "Preset 2".
- source: web-fetch

> Pass 4 note: web-fetch engine (cloud, no browser). The reader could not get the client-rendered copy on /decisions or /config from the shell, so the phase 18 and 19 copy was not reviewed. A browser pass should cover it.

> Pass 5 note: web-fetch engine (cloud, no browser). The live pages return only the app shell, so the reader read the shipped copy from source as a stand-in. 2 reader observations were not filed (cap): /decisions status lines use process words and point at a hidden row 62 (MED); the phase bar and live region print raw step ids such as "Exchange: cards" (LOW).

> Pass 8 note: web-fetch engine (cloud, no browser). Every route served only the app shell, so the reader read the shipped copy from source. 2 reader observations were not filed (cap): the /decisions lede counts "rule readings" and "checks" without saying what they are (LOW, partly covered by the status-line row); index.html has no canonical link or Open Graph tags (LOW). The pass 5 observation about raw step ids is no longer true on /play; that form now appears only on /debug.

## Done

### [x] [LOW] /tiles — the tiles are one flat grid with no headings
- pass: 8 (commit c9bd27d)
- viewport: n/a (web-fetch)
- category: a11y
- observation: The lede names Base, countryside and core tiles, and the doc comment says "grouped by kind", but the sheet is one grid with no H2 or H3. Tile names are <strong>, so screen-reader users cannot jump from tile to tile by heading.
- evidence: `apps/web/src/tiles/TileSheet.tsx:18-19`, `:26`, `:46-51`.
- suggested fix: Group the grid under an H2 per kind (Base, Countryside, Core) and make each tile name an H3.
- source: web-fetch
- issue: #56
- fixed: (this commit) — the sheet has an H2 per kind (Base tile, Countryside tiles, Core tiles) and each tile name is an H3

### [x] [LOW] all pages — the main nav is inside <main> and there is no skip link
- pass: 8 (commit c9bd27d)
- viewport: n/a (web-fetch)
- category: a11y
- observation: The nav sits inside the main landmark, so landmark navigation lands on the nav, not the content. Keyboard users tab through 7 nav links on every page before they reach the content.
- evidence: `apps/web/src/App.tsx:62-69` `<main className="app"><nav aria-label="Main" ...>`.
- suggested fix: Move the nav into a <header> before <main>, and add a "Skip to content" link as the first focusable element.
- source: web-fetch
- issue: #54
- fixed: (this commit) — the nav sits in a header before main; a "Skip to content" link is the first Tab stop and moves focus to main

### [x] [MED] /decisions — status lines use build-process words and point at hidden rows
- pass: 8 (commit c9bd27d)
- viewport: n/a (web-fetch)
- category: voice
- observation: Each reading prints its raw status, e.g. "proposed 2026-10-05 (structural; option measured in phase 22)" or "proposed 2026-10-04 (engine: phase 21, shipped)". Phase numbers and "structural" mean nothing to the designer. Row 63 says "never ends (row 62)", but row 62 is superseded and the page hides it, so the reference leads nowhere. Read from source; the live page is client-rendered.
- evidence: `apps/web/src/decisions/DecisionsPage.tsx:76` `Status: {q.status}`; `packages/content/src/decisions.ts:64` `const OPEN = /proposed|pending-spec/` filters superseded rows; `OPEN-QUESTIONS.md` rows 62-63.
- suggested fix: Map each status to a plain label ("Proposed, waiting for your answer", "Waiting for rules text") with no phase numbers, and drop or inline references to rows the page does not show.
- source: web-fetch
- issue: #53
- fixed: (this commit) — statuses read as plain labels with no dates or phase numbers; each "row N" links to the listed reading, or to `OPEN-QUESTIONS.md` for a settled row

### [x] [MED] /decisions — the page tells the designer to edit repository files it does not link
- pass: 8 (commit c9bd27d)
- viewport: n/a (web-fetch)
- category: navigation
- observation: The lede says "To confirm a reading, change its status in OPEN-QUESTIONS.md. The same list is in docs/DECISIONS.md." Both names are code text, not links, and readings name report files such as `docs/reports/phase-22-experiments.md` the same way. A designer who uses only the site cannot open any of them. Read from source; the live page is client-rendered.
- evidence: `apps/web/src/decisions/DecisionsPage.tsx:60-62`; report paths inside `OPEN-QUESTIONS.md` rows 63-70.
- suggested fix: Link each file to its page on GitHub (github.com/no-trbl-2-u/survival-dice-builder/blob/main/...), and say in one sentence who confirms a reading.
- source: web-fetch
- issue: #52
- fixed: (this commit)

### [x] [LOW] /play — enemy dice faces use three different cases, and the heading is long
- pass: 7 (commit b91436a)
- viewport: n/a (web-fetch)
- category: voice
- observation: Dice show "HIT 1", "SPECIAL 2" and "miss"; the heading says "a Hit deals 1 damage, a Special 2"; the screen-reader label uses the raw lowercase face ("hit"). The heading is a long bracketed sentence that repeats the damage each die now shows.
- evidence: `apps/web/src/play/effectText.ts:47-50`; `apps/web/src/play/DiceTray.tsx:56` heading; `DiceTray.tsx:67` aria-label `${d.face}`.
- suggested fix: Use one case for all faces (Hit 1 / Special 2 / Miss) and shorten the heading to "Enemy dice: they hit you after your Skills".
- source: web-fetch
- issue: #51
- fixed: (this commit)

### [x] [LOW] any unknown path — "Page not found" is served with HTTP 200 and no noindex
- pass: 7 (commit b91436a)
- viewport: n/a (web-fetch)
- category: seo
- observation: The new not-found view is client-side only. Every path returns 200 with the same shell, so crawlers can index mistyped URLs as copies of the home page.
- evidence: `apps/web/public/_redirects:1` `/* /index.html 200`; `apps/web/src/App.tsx:39-43` notFound route only sets document.title; WebFetch of `/no-such-page` returned the home shell.
- suggested fix: Have the notFound route add `<meta name="robots" content="noindex">`, or list known routes in `_redirects` and send the rest to a 404 page with status 404.
- source: web-fetch
- issue: #50
- fixed: (this commit) — the notFound route adds `<meta name="robots" content="noindex">` and removes it on the way out

### [x] [LOW] /config — optional-limit toggles are always named "...: on"
- pass: 6 (commit e9a9406)
- viewport: n/a (web-fetch)
- category: a11y
- observation: The checkbox for an optional limit has the accessible name "<label>: on" even when unchecked, and the visible "Off" / "no maximum" text is aria-hidden. A screen reader hears "X: on, checkbox, not checked".
- evidence: `apps/web/src/config/ConfigPage.tsx:261` ``aria-label={`${label}: on`}``; `ConfigPage.tsx:264` `<span aria-hidden="true">`.
- suggested fix: Name the checkbox "<label>: use a limit" and let the checked state carry on/off.
- source: web-fetch
- issue: #49
- fixed: (this commit) — the checkbox is named "<label>: use a limit"; its checked state carries on/off

### [x] [LOW] all pages — with JavaScript off the page is blank
- pass: 4 (commit 23470a2)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The shell has a title and a meta description, but the body is only `<div id="root"></div>`. A visitor without JavaScript, or a text-only fetch, gets the site name and nothing else. Every route gives the same output.
- evidence: Raw `/` HTML body: `<div id="root"></div>`. No `<noscript>` element. Reader WebFetch of `/`, `/decisions`, `/config`, `/play`, `/tiles`, `/credits`: "contains only a title 'Survival Dice-Builder'".
- suggested fix: Add a `<noscript>` paragraph to `apps/web/index.html`: one line that says what the game is and that it needs JavaScript.
- source: web-fetch
- issue: #48
- fixed: (this commit) — `apps/web/index.html` adds a `<noscript>` paragraph saying what the game is and that it needs JavaScript

### [x] [LOW] / — the home page "How a run goes" describes only Engagements Combat
- pass: 7 (commit b91436a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The Combat step says "play Engage to roll your dice, plus 1 enemy die for each enemy next to you", but the start panel offers both models and the config default is Exchanges. A player who picks Exchanges gets a different Combat from the one the home page describes.
- evidence: `apps/web/src/home/HomePage.tsx:25-27`; `apps/web/src/play/StartPanel.tsx:94-95`; `packages/content/data/config.default.json:117` `"model": "exchange"`.
- suggested fix: Add one sentence: "Or choose Exchanges (the written rules) on the start panel." (Related user call in AUDIT.md: the start panel Combat default.)
- source: web-fetch
- issue: #47
- fixed: (this commit) — the Combat step in `apps/web/src/home/HomePage.tsx` adds one sentence naming Exchanges and how it plays

### [x] [MED] /play — run summary milestone labels are hard-coded and ignore the config
- pass: 5 (commit 04b907a)
- viewport: n/a (web-fetch)
- category: voice
- observation: The labels are a fixed table. "Reveal 10 tiles" shows on every run, but only 8 tiles can be revealed. If /config changes surviveRounds, the label falls back to the raw id ("Fire survive-round-8"). The log prints raw milestone ids.
- evidence: `apps/web/src/play/RunSummary.tsx:12` 'reveal-tiles': 'Reveal 10 tiles'; `:55-56` fallback `Fire ${... ?? id}`; `apps/web/src/play/describeEvent.ts:204` `Milestone: ${event.milestone}.`
- suggested fix: Build the labels from `config.milestones` (for example `Reveal ${m.tilesRevealed} tiles`, `Survive to round ${n}`), and use the same labels in the log.
- source: web-fetch
- issue: #46
- fixed: (this commit) — labels and log lines come from `config.milestones` via `apps/web/src/play/milestoneText.ts`

### [x] [MED] /config — the Combat model setting uses internal labels and repeats itself
- pass: 7 (commit b91436a)
- viewport: n/a (web-fetch)
- category: voice
- observation: /config names the options "Exchanges (Spec v1)" and "Engagements (Combat v3)", while the /play start panel now says "Exchanges (written rules)" and "Engagements (playtest)". The /config help is long and says "Engagements are..." then "Engagements: ..." again.
- evidence: `packages/content/data/config.meta.json:127` help text; `:130-131` option labels; `apps/web/src/play/StartPanel.tsx:12-17` (COMBAT_HINT) and `:94-95`.
- suggested fix: Reuse the start panel's option labels and its two hint lines as the /config options and help.
- source: web-fetch
- issue: #45
- fixed: (this commit) — /config uses the start panel names and one hint line per model; the start panel reads its names from config.meta.json

### [x] [MED] /play — the "Return 1 starter card" buttons show card ids and no card text
- pass: 7 (commit b91436a)
- viewport: n/a (web-fetch)
- category: voice
- observation: Each return button reads "Return Move [c3]": the engine card id sits in square brackets, and the button does not say what the card does. The draft and replace buttons in the same dialog do show effect text. Nothing says why a starter card goes back.
- evidence: `apps/web/src/play/DecisionDialog.tsx:73` `Return {card(a.card)} [{a.card}]`; title only "Return 1 starter card"; draft/replace buttons at `DecisionDialog.tsx:58,66` use `effectOf()`.
- suggested fix: Drop the `[id]`, show the card text on each button, and add one line saying why a starter card goes back.
- source: web-fetch
- issue: #44
- fixed: (this commit)

### [x] [MED] /play — the Tower-tie choice names the Tower by its internal id
- pass: 5 (commit 04b907a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The phase 21 Tower-tie decision shows the Tower's engine id. With 2 Towers, the player cannot tell which one is asking.
- evidence: `apps/web/src/play/PhaseBar.tsx:21` `Tower ${state.towerQueue[0]}: choose between equally near enemies`; `apps/web/src/debug/describeAction.ts:68` `Tower ${action.tower} shoots ...`.
- suggested fix: Name the Tower by its place, for example "Tower on Forest (2,1): choose its target", and mark that Tower on the map.
- source: web-fetch
- issue: #43
- fixed: (this commit) — the next-step banner and the action label name the Tower by kind, terrain, and distance from the base centre; marking it on the map is left for a later tick

### [x] [MED] any unknown path — a mistyped URL shows the home page with no "not found" notice
- pass: 4 (commit 23470a2)
- viewport: n/a (web-fetch)
- category: navigation
- observation: The `_redirects` catch-all serves the app shell with HTTP 200 for every path, and `matchRoute` falls back to the first route. A link to `/decision` or `/setup` opens Home with the heading "Survival Dice-Builder", so the visitor does not know the link was wrong. `/robots.txt` also returns the app HTML.
- evidence: `curl -w "%{http_code} %{content_type}"`: `/nonexistent-xyz` gives "200 text/html", `/robots.txt` gives "200 text/html". `apps/web/src/router.tsx`: "unknown paths fall back to the first route".
- suggested fix: Let `matchRoute` return a not-found route (title "Page not found", one line naming the path, links to Home and Play) for unknown paths. Add `apps/web/public/robots.txt` so crawlers get a text file.
- source: web-fetch
- issue: #42
- fixed: (this commit) — unknown paths get a "Page not found" page naming the path, with links to Home and Play; robots.txt ships as a text file

### [x] [MED] /play — the start panel's Combat choice ignores the saved config and uses internal labels
- pass: 6 (commit e9a9406)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The Combat select always starts on "Engagements", whatever /config says (default config is "exchange"); only `?seed=` runs read `config.combat.model`. The options are named "Combat v3 playtest" and "Spec v1", with no line saying how the two differ, and the /config help for the same setting points to a repo file (`docs/design/combat-v3.md`) a visitor cannot open.
- evidence: `apps/web/src/play/StartPanel.tsx:33` `useState<CombatModel>('engage')`; `StartPanel.tsx:82-83` "Engagements (Combat v3 playtest)" / "Exchanges (Spec v1)"; `PlayPage.tsx:51` vs `:81`; `packages/content/data/config.meta.json:127`.
- suggested fix: Start the select from the saved `combat.model`, add a one-line hint for each choice, and drop the docs/ path from the /config help.
- source: web-fetch
- issue: #41
- fixed: (this commit) — hints, plain option names, no docs/ path in the /config help; the default choice is filed as a user call in AUDIT.md

### [x] [MED] / and /play — nothing says that exploring adds enemies
- pass: 5 (commit 04b907a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The core v2 trade-off is not explained. Every spawn node on a revealed tile spawns enemies at every Combat, and enemies go for structures first. The home steps and the reveal button only say "reveal a tile".
- evidence: `apps/web/src/home/HomePage.tsx:19` "Step off the edge of the map to reveal a new tile."; `apps/web/src/debug/describeAction.ts:77` "Step off the map edge, ...: reveal a tile".
- suggested fix: Add one home step: "Each revealed tile's spawn nodes add enemies at every Combat. Enemies attack the nearest structure first." Say the same in short form on the reveal button.
- source: web-fetch
- issue: #40
- fixed: 2d3def3

### [x] [MED] /play — enemy dice show "SPECIAL" with no damage or meaning
- pass: 6 (commit e9a9406)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: In an engagement, enemy dice can read HIT, SPECIAL, or miss. Nothing on /play says what a special does or that it deals more damage than a hit.
- evidence: `apps/web/src/play/DiceTray.tsx:68` `d.face === 'special' ? 'SPECIAL'`; no other "special" copy in `apps/web/src`; `packages/content/data/config.default.json` `"specialDamage": 2`.
- suggested fix: Show the damage from config on each enemy die, e.g. "HIT 1" and "SPECIAL 2".
- source: web-fetch
- issue: #39
- fixed: d8bfcfa

### [x] [MED] /play — when the selected dice fit no Skill, the board goes quiet with no reason
- pass: 6 (commit e9a9406)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: If the selected dice do not fit any one Skill together, no Skill row becomes a button and the "can fire" outline is hidden (it shows only with nothing selected). Nothing tells the player to unselect a die.
- evidence: `apps/web/src/play/SkillBoard.tsx:47` `could` class requires `selected.length === 0`; `SkillBoard.tsx:50` `planPlacement(...)` returns null when the dice do not fit (`targets.ts:62`, `:81`) and the row renders as a plain `<div>`.
- suggested fix: When the selected dice fit no Skill, show "These dice fit no Skill together. Unselect a die." above the Skill list.
- source: web-fetch
- issue: #38
- fixed: e55ad36

### [x] [HIGH] /play — in Exchanges Combat the next-step banner describes controls that no longer exist
- pass: 6 (commit e9a9406)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The assign step says "pick a die, click a Skill slot", but empty Skill slots are not buttons now; you select dice and then click the whole Skill row. The roll step says "Click dice to keep them", but the dice are not clickable; only the "Keep die N" buttons keep. A player who follows the banner clicks things that do nothing.
- evidence: `apps/web/src/play/nextStep.ts:8` "Click dice to keep them, then roll again or stop rolling"; `nextStep.ts:11` "Put your dice on Skills: pick a die, click a Skill slot, then confirm"; `SkillBoard.tsx:73-81` empty slot is a `<span role="img">`; `DiceTray.tsx:88-98` die is a `<span>`, keep is a separate button.
- suggested fix: Reword EXCHANGE.assign to "Select dice, then click a Skill they fit. Confirm when done." and EXCHANGE.roll to "Keep dice, then roll again or stop rolling."
- source: web-fetch
- issue: #37
- fixed: f85de8f

### [x] [MED] /play — the Gather card does not say it needs an unspent gathering node
- pass: 5 (commit 04b907a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The Gather card's top half shows only "Gather N". It does not say that Gather needs an unspent gathering node with no enemy on it, or that the node is then spent. The player learns this from the log after the card is wasted.
- evidence: `apps/web/src/play/CardView.tsx:10` `Gather ${e.amount}`; `apps/web/src/play/describeEvent.ts:151` "gathered nothing: gather on an unspent gathering node with no enemy on it."
- suggested fix: Change the text to "Gather N on an unspent gathering node (the node is spent)".
- source: web-fetch
- issue: #35
- fixed: e1cf396 (the Gather top half reads "Gather N on an unspent gathering node (the node is spent)")

### [x] [MED] /play — the start panel gives the v1 lose condition
- pass: 5 (commit 04b907a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The goal line tells players to keep every player alive. In v2 a player at 0 health is knocked out and comes back next round. Only the base falling ends the run.
- evidence: `apps/web/src/play/StartPanel.tsx:45` "Keep the base and every player alive for as many rounds as you can."
- suggested fix: "Keep the base standing for as many rounds as you can. A player at 0 health is knocked out and comes back next round."
- source: web-fetch
- issue: #34
- fixed: d37e59e (the start panel says only the base falling ends the run; a player at 0 health is knocked out and comes back next round)

### [x] [HIGH] /config — three rulings do nothing, and the miniature limit help states the old rule
- pass: 5 (commit 04b907a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: /config offers Tile rotation, Heal targets, and Grunt that becomes an elite, but the engine never reads any of them. Changing them changes nothing. The miniature limit help still gives the v1 rule. In phase 21, any spawn past the limit (grunt or elite) turns the grunt nearest the base into an elite.
- evidence: `packages/content/data/config.meta.json`: "When ticked, the player may rotate a revealed tile."; "player-choice": "The players choose"; "any-adjacent": "The player or an adjacent ally"; miniatureLimit help "A grunt over the limit turns a grunt into an elite." `grep -rn "tileRotation|healTargets|eliteReplacement" packages/engine/src` finds nothing.
- suggested fix: Hide the three inert rulings on /config (or mark them "not used by the engine yet"). Change the miniatureLimit help to "Past the limit, a new grunt or elite turns the grunt nearest the base into an elite instead."
- source: web-fetch
- issue: #33
- fixed: 7906caa (/config marks every field the engine does not read yet: these three plus Exchange range, Enemies per hex, and Shop refill; an engine test keeps the marks honest; miniature limit help states the phase 21 rule)

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

