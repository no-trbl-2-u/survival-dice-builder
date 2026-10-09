# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

# Site audit — 2026-10-09 (pass 22, cloud tick)

No finding scores 3.0 or more: no actionable iterate work, handed to `/expand` (pass 7, bold posture). Checked this pass and clean: every internal link resolves to a route, every repository file named on /decisions exists, each route sets its own tab title, and the shell has a favicon, sitemap, robots.txt, and preview card.

## Top 5 findings (scored)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate (re-evidenced in expand pass 7); the ids also reach map titles and the log, so a button-only fix would leave them mixed

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3 (Decisions is already in the nav on every page)
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: no canonical link in the served shell (critique pass 8 reader note, seo)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate (re-evidenced in expand pass 7)

### [ ] [2.4] /: the Combat step is one long sentence chain (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: split into short sentences; Exchanges in its own sentence

### [ ] [2.1] /config: pick lists show ids next to names; presets show only ids (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: covered by the "Player names for every map piece" candidate (its /config half)

# Site audit — 2026-10-09 (pass 21, cloud tick)

## Top 5 findings (scored)

### [x] [3.6] /play: the log says "you" for every co-op skirmish result and names a repaired defense by bare id (audit, voice)
- category: content-gaps (log voice)
- impact: 4 (every co-op skirmish reads "Skirmish won: you move into the hex." whoever fought; every defense repair reads "You repair d2", while every other defense line says "Tower d2")
- ease: 9
- next: skirmishEnded names the seat with verb agreement, repaired uses the defense label; unit test in exportRun.test.ts
- issue: #59
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate; the ids also reach map titles and the log, so a button-only fix would leave them mixed

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: no canonical link in the served shell (critique pass 8 reader note, seo)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate (expand pass 6)

### [ ] [2.4] /: the Combat step is one long sentence chain (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: split into short sentences; Exchanges in its own sentence

# Site audit — 2026-10-09 (pass 20, cloud tick)

## Top 5 findings (scored)

### [x] [3.6] all pages: no sitemap; /sitemap.xml serves the HTML shell (audit, seo)
- category: seo
- impact: 4 (crawlers find no sitemap and robots.txt names none; the /sitemap.xml request gets 200 text/html, the same shape as the pass 19 favicon finding)
- ease: 9
- next: apps/web/public/sitemap.xml lists the seven nav pages, robots.txt names it, and the smoke e2e checks the XML type and that the sitemap matches the nav
- issue: #58
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate; the ids also reach map titles and the log, so a button-only fix would leave them mixed

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: no canonical link in the served shell (critique pass 8 reader note, seo)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate (expand pass 6)

### [ ] [2.4] /: the Combat step is one long sentence chain (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: split into short sentences; Exchanges in its own sentence

# Site audit — 2026-10-09 (pass 19, cloud tick)

## Top 5 findings (scored)

### [x] [3.6] all pages: no favicon; /favicon.ico serves the HTML shell (audit, seo)
- category: seo
- impact: 4 (every tab, bookmark and history entry shows the blank default icon; the automatic /favicon.ico request gets 200 text/html)
- ease: 9
- next: a project-owned SVG favicon (a die on a hex, palette colours) linked from index.html; the smoke e2e checks the link and the served file
- issue: #57
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate; the ids also reach map titles and the log, so a button-only fix would leave them mixed

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: no canonical link in the served shell (critique pass 8 reader note, seo)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate (expand pass 6)

### [ ] [2.4] /: the Combat step is one long sentence chain (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: split into short sentences; Exchanges in its own sentence

# Site audit — 2026-10-09 (pass 18, cloud tick)

## Top 5 findings (scored)

### [x] [3.2] /tiles: one flat grid with no headings (critique LOW)
- category: external-critique (a11y)
- impact: 4 (rescored from 3: the tile names look like headings but are not marked up as headings, which fails WCAG 1.3.1 Info and Relationships, level A; same basis as the pass 15 skip-link rescore)
- ease: 8
- next: an H2 per tile kind, an H3 per tile name; unit and e2e tests check the outline
- issue: #56
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate; the ids also reach map titles and the log, so a button-only fix would leave them mixed

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: no canonical link in the served shell (critique pass 8 reader note, seo)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate (expand pass 6)

### [ ] [2.4] /: the Combat step is one long sentence chain (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: split into short sentences; Exchanges in its own sentence

# Site audit — 2026-10-09 (pass 17, cloud tick)

No finding scores 3.0 or more: no actionable iterate work, handed to `/expand` (pass 6, bold posture).

## Top 5 findings (scored)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate (re-evidenced in expand pass 6); the ids also reach map titles and the log, so a button-only fix would leave them mixed

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: no canonical link in the served shell (critique pass 8 reader note, seo)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate (expand pass 6), which gives each route its own canonical

### [ ] [2.4] /tiles: one flat grid with no headings (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: an H2 per tile kind, an H3 per tile name

### [ ] [2.4] /: the Combat step is one long sentence chain (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: split into short sentences; Exchanges in its own sentence

# Site audit — 2026-10-08 (pass 16, cloud tick)

## Top 5 findings (scored)

### [x] [3.2] all pages: no Open Graph or Twitter card tags in the served shell (audit, seo)
- category: seo
- impact: 4 (every shared link, including links sent to playtesters; unfurlers read the static HTML and run no JavaScript)
- ease: 8
- next: og:type, og:site_name, og:title, og:description, og:url and twitter:card in index.html; the smoke e2e checks the served shell
- issue: #55
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts (or the pending "Player names for every map piece" candidate)

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.4] /tiles: one flat grid with no headings (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: an H2 per tile kind, an H3 per tile name

### [ ] [2.4] /: the Combat step is one long sentence chain (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: split into short sentences; Exchanges in its own sentence

# Site audit — 2026-10-08 (pass 15, cloud tick)

## Top 5 findings (scored)

### [x] [3.6] all pages: nav inside <main>, no skip link (critique LOW)
- category: external-critique (a11y)
- impact: 4 (rescored from 3: it fails WCAG 2.4.1 Bypass Blocks, level A, on every page)
- ease: 9
- next: nav moves into a header before main; "Skip to content" is the first Tab stop and focuses main
- issue: #54
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts (or the pending "Player names for every map piece" candidate)

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.4] /tiles: one flat grid with no headings (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: an H2 per tile kind, an H3 per tile name

### [ ] [2.4] /: the Combat step is one long sentence chain (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: split into short sentences; Exchanges in its own sentence

# Site audit — 2026-10-08 (pass 14, cloud tick)

## Top 5 findings (scored)

### [x] [4.2] /decisions: status lines use build-process words and point at hidden rows (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 7
- next: each status reads as a plain label (`statusLabel`, no dates or phase numbers); each "row N" links to the listed reading, or to `OPEN-QUESTIONS.md` when the row is settled and hidden
- issue: #53
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts (or the pending "Player names for every map piece" candidate)

### [ ] [2.7] all pages: nav inside <main>, no skip link (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: move nav into a header before main; add "Skip to content"

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.4] /tiles: one flat grid with no headings (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: an H2 per tile kind, an H3 per tile name

# Site audit — 2026-10-08 (pass 13, cloud tick)

## Top 5 findings (scored)

### [x] [4.5] /decisions: names repository files it does not link (critique MED)
- category: external-critique (navigation)
- impact: 5
- ease: 9
- next: every full repository path in a `code` span links to its GitHub page; the lede says the designer confirms a reading
- issue: #52
- fixed: (this commit)

### [ ] [4.2] /decisions: status lines use build-process words and point at hidden rows (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 7
- next: map each status to a plain label with no phase numbers; drop or inline references to hidden rows

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts (or the pending "Player names for every map piece" candidate)

### [ ] [2.7] all pages: nav inside <main>, no skip link (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: move nav into a header before main; add "Skip to content"

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

# Site audit — 2026-10-08 (pass 12, cloud tick)

## Top 5 findings (scored)

### [x] [3.0] /play: enemy dice faces use three different cases (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 10 (re-scored: copy in effectText.ts and DiceTray.tsx plus one unit test, no layout change)
- next: faces read "Hit 1", "Special 2", "Miss"; the aria label names the face; heading "Enemy dice (locked): they hit you after your Skills"
- issue: #51
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts (or the pending "Player names for every map piece" candidate)

### [ ] [2.4] /config: pick lists show internal ids next to names (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: names only in options; presets as "Preset 1", "Preset 2" (also in the "Player names" candidate)

# Site audit — 2026-10-08 (pass 11, cloud tick)

## Top 5 findings (scored)

### [x] [3.0] any unknown path: "Page not found" served with HTTP 200, no noindex (critique LOW)
- category: external-critique (seo)
- impact: 3
- ease: 10 (re-scored: one robots meta tag from the notFound route, as the pass 9 noscript line)
- next: notFound route adds a robots noindex meta tag
- issue: #50
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts (or the pending "Player names for every map piece" candidate)

### [ ] [2.4] /play: enemy dice faces use three different cases (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one case for faces in effectText.ts; shorter DiceTray heading

### [ ] [2.4] /config: pick lists show internal ids next to names (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: names only in options; presets as "Preset 1", "Preset 2"

# Site audit — 2026-10-08 (pass 10, cloud tick)

## Top 5 findings (scored)

### [x] [3.6] /config: optional-limit toggles are always named "...: on" (critique LOW)
- category: external-critique (a11y)
- impact: 4 (re-scored: the name contradicts the checked state, so a screen reader announces the wrong setting)
- ease: 9
- next: name the checkbox "<label>: use a limit" in ConfigPage.tsx
- issue: #49
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts

### [ ] [2.7] any unknown path: "Page not found" served with HTTP 200, no noindex (critique LOW)
- category: external-critique (seo)
- impact: 3
- ease: 9
- next: notFound route adds a robots noindex meta tag

### [ ] [2.4] /play: enemy dice faces use three different cases (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one case for faces in effectText.ts; shorter DiceTray heading

### [ ] [2.4] /config: pick lists show internal ids next to names (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: names only in options; presets as "Preset 1", "Preset 2"

# Site audit — 2026-10-08 (pass 9, cloud tick)

## Top 5 findings (scored)

### [x] [3.0] all pages: with JavaScript off the page is blank (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: one noscript line in apps/web/index.html
- issue: #48
- fixed: (this commit)

### [ ] [2.7] /config: optional-limit toggles are always named "...: on" (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: name the checkbox "<label>: use a limit" in ConfigPage.tsx

### [ ] [2.7] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts

### [ ] [2.4] /play: enemy dice faces use three different cases (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one case for faces in effectText.ts; shorter DiceTray heading

### [ ] [2.4] /config: pick lists show internal ids next to names (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: names only in options; presets as "Preset 1", "Preset 2"

# Site audit — 2026-10-08 (pass 8, cloud tick)

## Top 5 findings (scored)

### [x] [3.2] /: "How a run goes" describes only Engagements Combat (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: one sentence in HomePage.tsx naming Exchanges
- issue: #47
- fixed: (this commit)

### [ ] [3.0] all pages: with JavaScript off the page is blank (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: one noscript line in apps/web/index.html

### [ ] [2.7] /config: optional-limit toggles are always named "...: on" (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: name the checkbox "<label>: use a limit" in ConfigPage.tsx

### [ ] [2.7] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts

### [ ] [2.4] /play: enemy dice faces use three different cases (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one case for faces in effectText.ts; shorter DiceTray heading

# Site audit — 2026-10-08 (pass 7, cloud tick)

## Top 5 findings (scored)

### [x] [3.6] /play: run summary milestone labels are hard-coded (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 6
- next: build the labels from config.milestones; reuse them in the log
- issue: #46
- fixed: (this commit)

### [ ] [3.2] /: "How a run goes" describes only Engagements Combat (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: one sentence in HomePage.tsx naming Exchanges

### [ ] [3.0] all pages: with JavaScript off the page is blank (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: one noscript line in apps/web/index.html

### [ ] [2.7] /config: optional-limit toggles are always named "...: on" (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: name the checkbox "<label>: use a limit" in ConfigPage.tsx

### [ ] [2.7] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: name enemies by kind and place in describeAction.ts

# Site audit — 2026-10-07 (pass 6, from critique pass 7)

## Top 5 findings (scored)

### [x] [5.4] /play: the starter return buttons show card ids and no card text (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 9
- next: one button per starter kind with its card text, a why line, no ids (DecisionDialog.tsx, starterChoices.ts)
- issue: #44
- fixed: (this commit)

### [x] [4.0] /config: the Combat model setting uses internal labels and repeats itself (critique MED)
- category: external-critique (voice)
- impact: 5
- ease: 8
- next: reuse the start panel labels and hint lines in config.meta.json
- issue: #45
- fixed: (this commit)

### [ ] [3.6] /play: run summary milestone labels are hard-coded (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 6
- next: build the labels from config.milestones; reuse them in the log

### [ ] [3.2] /: "How a run goes" describes only Engagements Combat (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: one sentence in HomePage.tsx naming Exchanges

### [ ] [3.0] all pages: with JavaScript off the page is blank (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: one noscript line in apps/web/index.html

# Site audit — 2026-10-07 (pass 5, cloud tick)

## Top 5 findings (scored)

### [x] [4.8] any unknown path: a mistyped URL shows the home page with no notice (critique MED)
- category: external-critique (navigation)
- impact: 6
- ease: 8
- next: a not-found route in matchRoute naming the path, links to Home and Play; public/robots.txt
- issue: #42
- fixed: (this commit)

### [x] [4.2] /play: the Tower-tie choice names the Tower by its internal id (critique MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: name the Tower by its hex and terrain in nextStep.ts and describeAction.ts
- issue: #43
- fixed: (this commit)

### [ ] [3.6] /play: run summary milestone labels are hard-coded (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 6
- next: build the labels from config.milestones; reuse them in the log

### [ ] [3.0] all pages: with JavaScript off the page is blank (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: one noscript line in apps/web/index.html

### [ ] [2.7] /config: optional-limit toggles are always named "...: on" (critique LOW)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: name the checkbox "<label>: use a limit" in ConfigPage.tsx

# Site audit — 2026-10-07 (pass 4, from critique pass 6)

## Top 5 findings (scored)

### [x] [8.1] /play: the Exchanges next-step banner describes controls that no longer exist (critique HIGH)
- category: external-critique (comprehension)
- impact: 9
- ease: 9
- next: reword EXCHANGE.roll and EXCHANGE.assign in nextStep.ts; a unit test pins both lines
- issue: #37
- fixed: f85de8f

### [x] [4.8] /play: when the selected dice fit no Skill, the board goes quiet with no reason (critique MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: a "fit no Skill" line above the Skill list in SkillBoard.tsx
- issue: #38
- fixed: e55ad36

### [x] [4.8] /play: enemy dice show "SPECIAL" with no damage (critique MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: "HIT 1" / "SPECIAL 2" from config in DiceTray.tsx
- issue: #39
- fixed: d8bfcfa

### [x] [4.2] /play: the start panel's Combat choice ignores the saved config (critique MED)
- category: external-critique (comprehension)
- impact: 7
- ease: 6
- next: seed the select from config.combat.model, add hints, drop the docs/ path
- issue: #41
- fixed: (this commit) — hints and plain option names shipped; the default choice is a user call (see below)

### [x] [4.2] / and /play: nothing says that exploring adds enemies (critique MED)
- category: external-critique (comprehension)
- impact: 7
- ease: 6
- next: one home step and the reveal button text
- issue: #40
- fixed: 2d3def3

# Site audit — 2026-10-06 (pass 3, from critique pass 5)

## Top 5 findings (scored)

### [x] [6.3] /config: inert rulings look live; miniature limit help is the v1 rule (critique HIGH)
- category: external-critique (comprehension)
- impact: 9
- ease: 7
- next: an `unused` mark in config.meta.json for every field the engine never reads, shown in the field help; an engine test checks the marks against the engine source
- issue: #33
- fixed: 7906caa

### [x] [4.9] /play: the start panel gives the v1 lose condition (critique MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: one copy line in StartPanel.tsx
- issue: #34
- fixed: d37e59e

### [x] [4.5] /play: the Gather card does not say it needs an unspent gathering node (critique MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: Gather effect text in CardView
- issue: #35
- fixed: e1cf396

### [ ] [4.2] / and /play: nothing says that exploring adds enemies (critique MED)
- category: external-critique (comprehension)
- impact: 7
- ease: 6
- next: one home step and the reveal button text

### [ ] [3.6] /play: run summary milestone labels are hard-coded (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 6
- next: build the labels from config.milestones; reuse them in the log

# Site audit — 2026-10-03 (pass 2, from critique pass 3)

## Top 5 findings (scored)

### [x] [6.3] /play: Skills, draft options, and Shop offers never say what they do (critique HIGH)
- category: external-critique (comprehension)
- impact: 9
- ease: 7
- next: one effect-text function per effect kind (Skill, Prepare, Combat), shown under each Skill, in each draft option, and on each Shop offer
- issue: #23
- fixed: 4206ea0

### [x] [4.2] /play: log and labels use enemy ids, capitalise grunt and elite, and slip on grammar (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 7
- next: lowercase kinds and place names in describeEvent and describeAction, "an elite", "1 upgrade", "3 hexes"
- issue: #24
- fixed: 6828627

### [x] [3.6] /debug: the event log prints [object Object]; stray glyph letters in State (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: format {q,r} payloads in EventLog; aria-hidden on the map glyph text
- issue: #25
- fixed: 6546545

### [x] [3.0] /play: at 375px the controls for the current step sit far below the map (critique MED)
- category: external-critique (mobile)
- impact: 6
- ease: 5
- next: order the active panel under the round header at narrow widths; larger map labels
- issue: #26
- fixed: a46ca82

### [ ] [2.5] /config: raw schema errors, unsaved edits lost, Reset unconfirmed (critique MED)
- category: external-critique (a11y)
- impact: 5
- ease: 5
- next: covered by the /config candidate in PHASE_CANDIDATES.md (expand pass 2); wait for oversight

The /config labels row (critique MED, impact 6, ease 3, score 1.8) is
outside the top 5 and is the core of that candidate.

## Needs user call (from adoption, 2026-10-02)

- [needs-user-call] **/play start panel Combat default (critique pass 6, 2026-10-07).** The start panel always starts on Engagements (673198c, the designer's playtest choice), while `combat.model` defaults to "exchange" and /config's setting only reaches `?seed=` runs. Following the saved config would make Exchanges the panel default; keeping Engagements means /config's choice is ignored there. Decide which: (a) keep Engagements as the panel default, (b) follow `combat.model`, or (c) make "engage" the config default and follow it. The hints and plain option names shipped (issue #41).
- [needs-user-call] **Set `CLAUDE_CODE_OAUTH_TOKEN`** as a GitHub Actions secret on `no-trbl-2-u/survival-dice-builder` (oversight 2026-10-02). The cloud `/march` cron in `.github/workflows/march.yml` is live (every 2h, off-peak) and every run fails until the secret exists. The loop never sets secrets itself. Oversight 2026-10-03: the user will set it; keep the workflow as is.
- [needs-user-call] **Local `.env` keys.** Add `DEPLOY_PROVIDER=cloudflare-pages` and `CF_PAGES_PROJECT=survival-dice-builder` to `.env` (both are also defaulted in `scripts/deploy-check.mjs`, so this is optional). Optional: `NOTIFY_NTFY_TOPIC` for the pager before any unattended run.
- [needs-user-call] **Designer reviews (async, never blocking):** tile layouts at `/tiles` (phase 4; best reviewed before phase 7), the bot batch distribution (phase 9), the "2 people identify at a glance" check (phase 10), and the playtest sessions themselves (phase 16). The loop ships around them; review via `/oversight`. Every open reading and check is listed at `/decisions` (also `docs/DECISIONS.md`).
- [needs-user-call] **Review the 9 proposed tiles** at https://survival-dice-builder.pages.dev/tiles (phase 4, 2026-10-03). Layouts live in `packages/content/data/tiles.json`; record changes in `OPEN-QUESTIONS.md`. Best before phase 7, whose full-run golden replay locks the layouts in.
- [needs-user-call] **Bot batch distribution (phase 9, 2026-10-03).** 200 default-config bot runs: median end round 14 (band 8-14, top edge), middle half 10-17, no run before round 9 (first wave), 0 runs reached level 5. Inside the band, so nothing is filed against the rules; review `docs/reports/phase-9-bot-batch.md` when convenient.
- [needs-user-call] **Art direction glance check (phase 10, 2026-10-03).** Show `design/mockups/main-screen.svg` (or the live UI after phase 11) to 2 people: can each name card orientation, enemy type, and health at a glance? Record the answers; fixes go into `design/ART-GUIDE.md`. Not blocking.
- [needs-user-call] **Source of truth sync.** `spec/README.md` says the canonical spec is the Claude design doc (tabs "Spec v1 — Rules", "Build brief", "Build plan"). The loop treats `spec/` in this repo as authoritative; re-export to `spec/` when the doc changes.
- [needs-user-call] **Visual polish feel check (phase 15, 2026-10-03).** On a mid-range laptop, open `/play`, turn on "3D dice", and play a few exchanges. Check that the frame rate feels smooth (headless Chromium: about 17 ms per frame, the canvas's `data-frame-ms`). Check that the synthesized sounds are pleasant at their low volume. Recorded sounds (Kenney CC0 packs, still `candidate` in `ASSETS.md`) are a later swap if wanted. Not blocking.
- [needs-user-call] **Spec v2 design work (2026-10-04).** The core loop is settled in `docs/design/core-loop-v2.md`; fold it into `spec/`. Still to design: the new tiles (row 57), knockout values (row 55), the elite structure-damage rule (row 7), per-card heal targets (row 12), the real Skills with upgraded tiers (rows 9, 46, 50), Build versus Repair levels (rows 30, 49), the milestone set (row 4), and later scenarios (row 58). The experience curve waits on the phase 22 report (row 17). Each is listed at `/decisions`.
- [needs-user-call] **Interim balance after phase 20 (2026-10-04).** Under the phase 20 rules the 200-run bot batch ends at a median of round 5 (middle half 4-6), against round 14 before. 199 of 200 runs end when the player falls: the bot walks onto new tiles, and their enemies appear around it at the next Combat. Phase 21 replaces the run end at 0 health with knockout and changes spawning and targeting, so re-measure then. A run where nobody steps off the Base tile has no enemies and never ends until phase 21 (row 62). Not blocking.
- [needs-user-call] **Balance after phase 21 (2026-10-04).** Under the core loop v2 rules (no wave track, every node spawns at every Combat, structure-first targeting, knockout) the 200-run bot batch ends at a median of round 6 (middle half 6-8, range 5-12), against the 8-14 band. All 200 runs end when the base falls (0 errors, 0 stalled); median level 2; 57 runs buy 3 upgrades, 35 defeat an elite, 22 survive to round 10. The bot is weak (it builds few defenses and never defends the base on purpose), so this is a floor, not a verdict. Phase 22 compares experience curves, Skill caps, and spawn pressure on top of these rules. Not blocking. **Phase 22 (2026-10-05):** the comparisons are in `docs/reports/phase-22-experiments.md`; the default batch is unchanged (median 6), Gather off a node for 1 (row 67) alone gives median 9, and the combined proposed set gives median 8 (middle half 8-9).
- [needs-user-call] **Structural v2 questions (2026-10-05).** `OPEN-QUESTIONS.md` rows 63-70 record issues no card, Skill, elite, or structure can fix: no clock (63), map-state difficulty (64), exchange count coupled to deck size (65), the explorer pinned by same-round spawns (66), the fixed material budget (67), co-op pressure (68), the Base tile as a safe firing position (69), and table upkeep (70). Phase 22 (2026-10-05) built one proposed reading per row as a config option (all default off) and measured each: `docs/reports/phase-22-experiments.md` recommends turning on rows 63, 65, 66, and 67, keeping 68 off, and playtesting 64, 69, and 70. **The designer decides each row** (set the option on /config to try it, then mark the row decided). Not blocking the loop.
- [needs-user-call] **Run the playtests (phase 16, 2026-10-03).** The kit is ready in `docs/playtests/`: `PROTOCOL.md` (one-page script), `SURVEY.md`, and the `REPORT.md` template. Target: 5 solo runs and 3 co-op sessions. Drop each run file into `docs/playtests/runs/`, then run `pnpm sim -- playtests`. The filled report feeds Spec v2 and the scenarios decision (rules section 19). The loop cannot playtest.
