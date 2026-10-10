# Critique log

> Last pass: 2026-10-10 at commit 8402ba3
> Pass count: 11

> External-observer feedback for Survival Dice-Builder. Populated by
> `/critique`, drained by `/iterate`. See `skills/critique.md`
> for the contract.

## Pending

### [LOW] /play — the engagement log ends with "The exchange ends."
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: voice
- observation: The engagement result's full log prints the Exchanges word for the end of an engagement, now the default model.
- evidence: `apps/web/src/play/describeEvent.ts:143-144`, shown in the engagement result log
- suggested fix: Print "The engagement ends." when the exchange was an engagement.
- source: web-fetch

### [LOW] /play and /config — copy says "the designer's playtest Combat", "designer 2026-10-09", and "Combat v3"
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: voice
- observation: The start panel hint calls the default model "The designer's playtest Combat" and never says "Engagements", while the select next to it does. Several /config help lines carry build notes ("default, designer 2026-10-09") and one group is labelled with the internal version "Combat v3 numbers".
- evidence: `apps/web/src/play/StartPanel.tsx:17`; `packages/content/data/config.meta.json:103`, `:127`, `:135`
- suggested fix: Start the hint with "Engagements: play Engage ..."; shorten the help notes to "(default)"; rename the group "Engagement numbers".
- source: web-fetch

### [LOW] /play — the Skill draft does not say unkept Skills go to the pool
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: comprehension
- observation: With the new draft pool, Skills not kept come back in later drafts, but the dialog says only "keep 1 Skill" and the "(from your pool)" tag gets no explanation. The rule shows only afterwards, as a log line.
- evidence: `apps/web/src/play/DecisionDialog.tsx:31`, `:59`; `apps/web/src/play/describeEvent.ts:210`
- suggested fix: Add a muted line under the title: "The Skills you do not keep go to your pool. Later drafts offer them again."
- source: web-fetch

### [LOW] /play — a hex next to an enemy that costs too much just isn't offered, with no reason
- pass: session residue (2026-10-09)
- viewport: n/a
- category: comprehension
- observation: With `combat.moveCostNextToEnemy` above 1 (an option since 2026-10-09; the default is now 1), a step next to an enemy costs more, and with too few move points left the hex is simply not highlighted. The designer hit this before the default changed and could not tell why.
- evidence: session 2026-10-09; `packages/engine/src/movement/move.ts:51`; `apps/web/src/play/PlayMap.tsx` offers only legal hexes
- suggested fix: When the option is above 1, mark such hexes ("costs 2: next to an enemy") or say it in the Move banner.
- source: user

### [LOW] sim — the bot cannot measure today's designer changes
- pass: session residue (2026-10-09)
- viewport: n/a
- category: sim
- observation: The phase 23 report says the bot never picks targets to defeat enemies before their dice hit, so the `defeatedDice` gap is a floor. The draft pool (`draft.unpicked: "pool"`) left both pinned sim batches unchanged, because bot runs rarely reach a second draft. The hand now stays across engagements, but the bot discards whole hands, so longer Combats are under-measured.
- evidence: session 2026-10-09; `docs/reports/phase-23-defeated-dice.md`; `tools/sim/src/run.test.ts` pins unchanged by 256bdb4; `packages/bot/src/policy.ts`
- suggested fix: A bot policy that engages to defeat enemies first, keeps cards for later engagements, and buys Training so drafts happen; then re-run the defeated-dice and draft-pool comparisons.
- source: user

### [LOW] /play — the result does not say who took the damage or their health after
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: "You dealt 2 damage" does not name the elite or its health after (14 to 12); only the full event list does. The defeated grunt's die is labelled "grunt" with no mark that it was defeated.
- evidence: blind round 4 (2026-10-09), the engagement result
- suggested fix: Name each damaged enemy and its health left; mark a defeated enemy's dice.
- source: blind-round-4

### [LOW] /play — "in range" counts differ from the engaged enemies
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: The title says "vs 1 elite" while Shot says "3 enemies in range" (enemies within 2 hexes that did not roll). Testers read it as a contradiction.
- evidence: blind round 4 (2026-10-09), the Skill reach line vs the title
- suggested fix: Say what the count is ("3 in range, 1 engaged") or explain range against engaged.
- source: blind-round-4

### [LOW] /play — card timing and the Special face are explained only later
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: Cards are greyed while rolling with nothing saying when they become playable; the Special face (skull) means 2 damage only on the result; a Star's meaning shows only at Use dice.
- evidence: blind round 4 (2026-10-09), the Roll step
- suggested fix: A one-time note at Roll on when cards can be added; the Special and Star meanings at Roll.
- source: blind-round-4

### [LOW] /play — at 375px a fifth Skill, the target pick, and the hand still need scrolling
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: With 5 Skills the fifth sits behind the footer; during Pick target the map and list push the Skills off screen; the hand strip clips its option text and shows about 4 cards. At 1280x800 a long effect text is cut by the footer.
- evidence: blind round 4 (2026-10-09), the modal at 375x812 and 1280x800
- suggested fix: Fit 5+ Skills (3 columns or a smaller tile), and keep strip text whole.
- source: blind-round-4

### [LOW] /play — the mini-map target label can cover tokens
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: The "grunt, 1 hex north 2/2" label sits over neighbouring tokens and once hid the "You" figure; near the map edge the mini map shows enemies cut off and no hex tiles.
- evidence: blind round 4 (2026-10-09), the target mini map
- suggested fix: Place the label away from other tokens; frame the mini map on the map's hexes.
- source: blind-round-4

### [LOW] /play — Roll again stays on when every die is kept
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: After keeping the only die, "Roll again (2 left)" is still enabled though nothing would roll.
- evidence: blind round 4 (2026-10-09), the Roll step
- suggested fix: Disable or hide Roll again when no die is unkept (the engine offers the roll; the UI can say it rolls nothing).
- source: blind-round-4

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

### [LOW] /config — pick lists show internal ids next to names; presets show only ids
- pass: 6 (commit e9a9406)
- viewport: n/a (web-fetch)
- category: voice
- observation: The Skill and card pick lists show each option as "Name (id)". Deck presets are listed by bare id, e.g. "preset-2".
- evidence: `apps/web/src/config/ConfigPage.tsx:101` ```${name} (${id})` ``; `ConfigPage.tsx:81` `presets.map((p) => [p.id, p.id])`.
- suggested fix: Show only the name in options; label presets "Preset 1", "Preset 2".
- source: web-fetch

## Done

### [x] [LOW] /play — the engagement banner names a "Finish engagement" button that does not exist
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: voice
- observation: In the assign step the next-step banner says "Repeat, or Finish engagement", but the modal button reads "End engagement: enemy dice hit". With "Look at the board" open, the banner names a control the player cannot find.
- evidence: `apps/web/src/play/nextStep.ts:23`; `apps/web/src/play/EngagementModal.tsx:250`
- suggested fix: Use the button's words: "Repeat, or choose End engagement."
- source: web-fetch
- issue: #67
- fixed: (this commit) — the banner says "Repeat, or choose End engagement"; the Skill board button under the modal now reads "End engagement: enemy dice hit", the same words as the modal

### [x] [MED] /play — a Skill needing more dice than the player has gives no hint
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: Spark Burst needs a Wand and a Bow, but the player has 1 action die. Both testers asked whether it could ever fire.
- evidence: blind round 4 (2026-10-09), the Skills with 2 slots at 1 die
- suggested fix: Mark a Skill whose slots outnumber the player's dice ("needs 2 dice").
- source: blind-round-4
- issue: #66
- fixed: (this commit) — a Skill with more slots than the player has dice says "Needs 2 dice, you have 1. A level up or a card that adds a die gives you more." (phones: "needs 2 dice"); in Combat it counts the dice rolled so far

### [x] [MED] /play — the result after a target pick can read as skipped
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: After the last target pick the modal steps aside to the bare board for about a second, then "Engagement over" appears. A tester thought the result screen had been skipped.
- evidence: blind round 4 (2026-10-09), the step-aside before the result
- suggested fix: Say on the board what comes next during the step-aside, or skip the step-aside when the pick ended the engagement.
- source: blind-round-4
- issue: #65
- fixed: (this commit) — while the modal steps aside, the board shows "Engagement over. The result comes next." (or "Back to the engagement in a moment."), and the screen-reader line says it too; e2e checks the caption

### [x] [MED] /decisions — open rows 65, 66 and 69 describe exchanges, with no note that engagements are now the default
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: comprehension
- observation: The open readings 65, 66 and 69 (and their bot numbers) speak of "every exchange". Engagements are now the default Combat, and the page never says so; the decided row that records it is hidden by the open-only list.
- evidence: `OPEN-QUESTIONS.md:80`, `:81`, `:84`; `apps/web/src/decisions/DecisionsPage.tsx:56`
- suggested fix: Tag those rows "Exchanges only" on the page and add one intro line: "Combat uses engagements by default."
- source: web-fetch
- issue: #64
- fixed: (this commit) — rows 65 and 69 tagged "Exchanges only"; row 66 applies under both models

### [x] [MED] /play — nothing says unplayed cards stay in hand or when Combat ends
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: comprehension
- observation: Combat now lasts until the hand and deck are empty, and cards not played into an engagement stay in hand. The home Combat step, the start panel hint, the Combat banner, and the engagement result all leave this out, so a player cannot tell why Combat goes on after the first engagement or when it ends.
- evidence: `apps/web/src/home/HomePage.tsx:26`; `apps/web/src/play/StartPanel.tsx:17`; `apps/web/src/play/nextStep.ts:82` "Play each card: Engage ..., another option, or discard it"; the rule appears only in `OPEN-QUESTIONS.md:150`
- suggested fix: Add one line to the start panel hint and the engagement result: "Cards you did not play stay in your hand. Combat ends when your hand and deck are empty."
- source: web-fetch
- issue: #63
- fixed: (this commit) — the start panel hint, the home Combat step, and the engagement result say unplayed cards stay in hand and Combat ends when every hand and deck is empty; e2e checks the result line

### [x] [MED] /play — the engagement result is not announced to screen readers
- pass: 10 (commit 10fd9d1)
- viewport: n/a (web-fetch)
- category: a11y
- observation: When an engagement ends, the live instruction line is replaced by a result headline that is not a live region, and focus moves to "Back to the board". A screen-reader user hears the button but not the result, such as "You were knocked out."
- evidence: `apps/web/src/play/EngagementModal.tsx:236` `aria-live="polite"` is on the instruction only; the headline `<p data-testid="engage-headline">` near line 461 has no live role.
- suggested fix: Give the result headline `role="status"`, or point the dialog's `aria-describedby` at it.
- source: web-fetch
- fixed: phase 24 (this commit) — the result headline has `role="status"`; e2e checks it

### [x] [LOW] /play — the engagement headline says "took no damage" when enemy dice hit the guard
- pass: 10 (commit 10fd9d1)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The result headline says "took no damage" whenever health did not drop. The line below can then say "2 enemy dice hit you: 2 to guard, 0 to health", so the two lines seem to disagree.
- evidence: `apps/web/src/play/engageView.ts:125` `s.toHealth > 0 ? ... : 'took no damage'`; `EngagementModal.tsx:456` the hits line.
- suggested fix: When `toGuard > 0` and `toHealth` is 0, say "your guard stopped <n> damage" in the headline.
- source: web-fetch
- fixed: phase 24 (this commit) — the headline says "your guard stopped N damage" when only the guard was hit; unit test

### [x] [LOW] /play — the engagement instructions run long and repeat themselves
- pass: 10 (commit 10fd9d1)
- viewport: n/a (web-fetch)
- category: voice
- observation: The assign-step instruction joins clauses with a semicolon and a parenthesis, against the short-sentence style. The roll-step instruction says "use them" twice.
- evidence: `apps/web/src/play/engageView.ts:38-40` "Pick dice, then a Skill they fit (a Star fits any slot). A full Skill fires at once...; when no die is left, the enemy dice hit."; `engageView.ts:32` "...or stop rolling and use them. After the last roll, you use them."
- suggested fix: Split into short sentences: "Select dice. Then choose a Skill they fit. A Star fits any slot. A full Skill fires at once. When no dice are left, the enemy dice hit."
- source: web-fetch
- fixed: phase 24 (this commit) — the instructions are short sentences, with a one-line short form on phones

### [x] [LOW] /play — at 375px the engagement hand has no room to scroll and tiny card text
- pass: 10 (commit 10fd9d1)
- viewport: mobile (from CSS, web-fetch)
- category: mobile
- observation: On phones the pinned hand shrinks cards to 70px with option text at 0.62rem (about 10px). The strip is centred with no horizontal scroll, so a hand of 5 fills the screen edge to edge and a larger hand would be cut off.
- evidence: `apps/web/src/play/Play.module.css:1815-1825` `.stripCard { width: 70px }`, `.stripOptions { font-size: 0.62rem }`; `.cardStrip` (line 1575) is fixed with `justify-content: center` and no `overflow-x`.
- suggested fix: Give `.cardStripList` `overflow-x: auto` with `justify-content: safe center`, and raise `.stripOptions` to at least 0.75rem.
- source: web-fetch
- fixed: phase 24 (this commit) — the hand strip scrolls sideways; option text is at least 0.75rem on phones

### [x] [LOW] /play — enemy choice buttons name enemies by engine id ("grunt e3")
- pass: 7 (commit b91436a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: Target, Tower-target, skirmish and resolve buttons name each enemy as "<kind> <id>", e.g. "Tower on Plains, 2 hexes north of the base centre shoots grunt e3 on Forest, 2 health". The Tower button repeats the Tower's full place, which the banner already gives. Two enemies on the same terrain differ only by the id.
- evidence: `apps/web/src/debug/describeAction.ts:17-19` `enemyName` returns `${kind} ${id}`; used at `:71`, `:75`, `:88`, `:131`; banner at `apps/web/src/play/nextStep.ts:47`.
- suggested fix: Name enemies by kind plus place (terrain and direction from the player or Tower, as `stepsAway` does), and leave the Tower out of Tower-target buttons.
- source: web-fetch
- fixed: phase 24 (this commit) — enemies are named by kind and place in the modal, on the map, and on enemy dice; Tower-target buttons say "Shoot grunt, 2 hexes east of the Tower (health 2/3)" without naming the Tower again; /debug keeps ids

### [x] [MED] /play — the pre-selected die is often not the one the player wants
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: observation
- observation: At Use dice the modal pre-selects the first die that fits a Skill, and after each placement it jumps to another fitting die (e.g. a second Wand when Dodge still needs a Shield). Blind testers had to Unselect almost every time.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest round 3; `apps/web/src/play/PlayPage.tsx` `firstFit` auto-pick
- suggested fix: (user, 2026-10-09) no pre-selection: nothing is selected until the player taps dice, then a Skill.
- source: user
- fixed: phase 24 (this commit) — nothing is pre-selected; unit and e2e tests

### [x] [MED] /play — no in-modal note of the damage a target pick dealt
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: observation
- observation: After picking a target the modal moves straight back to Use dice; the damage dealt (and a kill) only shows in the log or on the board. Testers checked the board to see if the hit landed.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest round 3
- suggested fix: (user, 2026-10-09) after a target pick, the modal steps aside, a damage number ("-2") floats off the enemy on the board, and the modal comes back after a short delay.
- source: user
- fixed: phase 24 (this commit) — after a damaging pick the modal steps aside for 1.2s, -N floats off the enemy on the board, a status line reads it out, and the modal comes back; e2e checks it

### [x] [MED] /play — card drag on a real touch phone is untested
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: mobile
- observation: The engagement hand strip uses pointer events with touch-action: none, verified with a mouse at 375px only. Long-press, scroll-versus-drag and accidental taps on a real touch device are unknown.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; `apps/web/src/play/CardStrip.tsx`; blind testers drove it with mouse events
- suggested fix: (user, 2026-10-09) run a touch-emulated Playwright test (mobile Chrome, touch events) and fix what it finds; then the user tries the deployed site on a real phone.
- source: user
- fixed: phase 24 (this commit) — touch.spec.ts drags with CDP touch events on a mobile-touch (Pixel 7) project: up onto the felt plays a card with no page scroll; sideways scrolls the hand and plays nothing. The designer's real-phone check stays a follow-up

### [x] [LOW] /play — at 375px the dice and Skills are never on screen together
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: mobile
- observation: On a phone the felt (8 dice: 2 rows) and the Skills need scrolling back and forth; the selected die is usually out of view when a Skill is tapped. The instruction line takes 3 lines and stays pinned.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest round 3; screenshots at 375x812
- suggested fix: (user, 2026-10-09) cut the instruction to one short line on phones (the long text stays on desktop) and shrink the Skill tiles so the felt and Skills fit together at 375x812.
- source: user
- fixed: phase 24 (this commit) — compact Skills (2 columns) and a short instruction line; at 375x812 with 6 dice the last die and the Skill grid fit together (e2e)

### [x] [LOW] /play — nothing says hand cards can be dragged, or why they are greyed
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: comprehension
- observation: Cards in the engagement hand strip peek from the bottom edge and look like background on desktop; during Roll they are greyed with no reason (cards cannot be added while rolling).
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest round 3
- suggested fix: (user, 2026-10-09) a wordless nudge: the first time cards become playable in a run, the first playable card lifts slightly toward the felt and settles back. Greyed cards stay greyed, no text.
- source: user
- fixed: phase 24 (this commit) — the first playable card of a run nudges toward the felt once, with no words

### [x] [LOW] /play — mini map: orange vs white rings are unexplained and tokens are unnamed
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: comprehension
- observation: On the target map, in-range enemies have an orange ring and the hovered or focused one a white glow; testers could not tell what the two meant until hovering. Tokens carry health but no name, so grunt e5 and e6 look the same.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest round 3; `apps/web/src/play/Play.module.css` .miniMap .target
- suggested fix: (user, 2026-10-09) no legend: the hovered or focused enemy on the mini map shows its name and health beside it (its button already lights up). Orange alone means 'in range'.
- source: user
- fixed: phase 24 (this commit) — the highlighted target gets a name and health label beside its token; orange stays "in range", no legend

### [x] [LOW] /play — elite enemy dice not yet seen by a blind tester
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: observation
- observation: None of the 3 blind runs met an elite as a tester, so the gold elite dice vs white grunt dice and the 2-dice elite roll have not had a fresh-eyes check.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest rounds 1-3
- suggested fix: (user, 2026-10-09) run a blind round once this phase's changes land, with the dev tool able to force an elite engagement; it also covers the new die picking and the board damage number.
- source: user
- fixed: phase 24 (this commit) — blind round 4 played elite engagements on desktop and phone (Force elite engagement); both finished; findings filed as blind-round-4 rows

### [x] [LOW] /play — remove the dev-only engagement tools once the modal is signed off
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: observation
- observation: "Force engagement (dev)", "Force target pick (dev)" and `?dice=N` (dev server only) are still in the code with TODOs. The DiceTray and CardStrip unit tests use `forceEngagement` as a fixture and need their own fixture first.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; `apps/web/src/play/devEngage.ts`, `PlayPage.tsx` devTools, `DiceTray.test.tsx`, `CardStrip.test.tsx`
- suggested fix: (user, 2026-10-09) keep the dev-only tools (Force engagement, Force target pick, ?dice=N) for testing; they never ship to players. Add a way to force an elite engagement for the elite blind round. Update devEngage.ts's TODO to say they stay.
- source: user

> Pass 4 note: web-fetch engine (cloud, no browser). The reader could not get the client-rendered copy on /decisions or /config from the shell, so the phase 18 and 19 copy was not reviewed. A browser pass should cover it.

> Pass 5 note: web-fetch engine (cloud, no browser). The live pages return only the app shell, so the reader read the shipped copy from source as a stand-in. 2 reader observations were not filed (cap): /decisions status lines use process words and point at a hidden row 62 (MED); the phase bar and live region print raw step ids such as "Exchange: cards" (LOW).

> Pass 8 note: web-fetch engine (cloud, no browser). Every route served only the app shell, so the reader read the shipped copy from source. 2 reader observations were not filed (cap): the /decisions lede counts "rule readings" and "checks" without saying what they are (LOW, partly covered by the status-line row); index.html has no canonical link or Open Graph tags (LOW). The pass 5 observation about raw step ids is no longer true on /play; that form now appears only on /debug.
- fixed: phase 24 (this commit) — the dev tools are kept (comments updated) and Force elite engagement (dev) is added

### [x] [LOW] /play — Heal is offered (and spent) at full health
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: observation
- observation: Rest's "Heal 2" (and Mend) can be played at full health and does nothing ("You healed 0"), with no warning before the card is spent.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest round 3
- suggested fix: (user, 2026-10-09) won't fix: wasting a heal is the player's choice; the engine keeps offering it.
- source: user
- fixed: won't fix (designer 2026-10-09)

### [x] [LOW] /play — a Star placed on a Skill shows as the slot's face
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: comprehension
- observation: Once a Star die is on a Skill the slot shows (and names) the slot face, e.g. "Die 1 (Sword)", so the player wonders where the Star went.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest round 3; `apps/web/src/play/SkillBoard.tsx` slot label uses asFace
- suggested fix: (user, 2026-10-09) won't fix: a Star counts as the slot's face, so it shows that face.
- source: user
- fixed: won't fix (designer 2026-10-09)

### [x] [MED] /config — Start run always starts an engagement run, whatever Combat model is saved
- pass: 10 (commit 10fd9d1)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The new Start run button on the Config bar always opens an engagement run. A visitor who sets the Combat model to exchanges on the same page and presses Start run still gets engagements, and the button does not say so.
- evidence: `apps/web/src/config/ConfigPage.tsx:700` links `/play?seed=...&combat=engage`; `apps/web/src/play/PlayPage.tsx:59` uses the saved `config.combat.model` only when `combat` is not `engage`.
- suggested fix: (user, 2026-10-09) make 'engage' the config default Combat model and drop the `&combat=engage` override, so Start run follows the saved config; update the sim baseline and tests that assume 'exchange'.
- source: web-fetch
- fixed: phase 23 (this commit) — `combat.model` defaults to "engage"; Start run goes to `/play?seed=<n>` and follows the saved config; `/play?combat=exchange` still reaches exchanges; config e2e checks the URL

### [x] [MED] /play — a defeated enemy's die still hits, and nothing says so
- pass: user-jot (commit d95a149)
- viewport: unspecified
- auth_state: anonymous
- category: observation
- observation: In an engagement, killing an enemy does not cancel the die it rolled: the result can read "You defeated 2 enemies" and still "1 enemy die hit you", and the log shows "Grunt e8 is defeated." then "Grunt e8 attacks you for 1." The "Locked" note was removed from the felt, so nothing explains it; the blind tester called it unfair. Decide the rule (keep, or cancel a defeated enemy's dice), then explain or change it.
- evidence: user-spotted at 2026-10-09T11:37:32-04:00; blind playtest round 3 (2026-10-09); `packages/engine/src/combat/engage.ts` finishEngagement hits with every rolled enemy die
- suggested fix: (user, 2026-10-09) keep the rule: every enemy die hits at the end, all at once, so the player must still defend against a defeated enemy's attack. Add a config toggle (default off) that cancels a defeated enemy's dice, for the simulator to compare.
- source: user
- fixed: phase 23 (this commit) — the rule stays (every enemy die hits at the end, all at once); `combat.engage.defeatedDice: "cancelled"` cancels a defeated enemy's dice for the sim (greyed on the felt, a log line, a result line); report in docs/reports/phase-23-defeated-dice.md

### [x] [MED] /play — screen readers hear enemy dice as "hit" or "special" with no damage
- pass: 10 (commit 10fd9d1)
- viewport: n/a (web-fetch)
- category: a11y
- observation: In the engagement modal each enemy die is named by its raw face word. The visible label that gives the damage ("Hit 2", "Special 3") is hidden from assistive technology.
- evidence: `apps/web/src/play/DiceTray.tsx:191` `aria-label={`Enemy die of ${who}: ${d.face}`}`; `DiceTray.tsx:195-196` the `enemyFaceText(...).label` span is `aria-hidden="true"`.
- suggested fix: Build the aria-label from `enemyFaceText(d.face, state.config.combat.engage).label`.
- source: web-fetch
- issue: #62
- fixed: (this commit) — each enemy die's aria-label carries its damage label from config ("Enemy die of grunt e3: Hit 1"), the same text the hidden visible label shows; the DiceTray test checks it

### [x] [LOW] all pages — nav labels "Tiles" and "Debug" do not match the page headings
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: navigation
- observation: The nav says "Tiles" and "Debug", but the pages they open are headed "Tile sheet" and "Engine console".
- evidence: `apps/web/src/App.tsx:17,19` nav labels vs `:32,34` route titles.
- suggested fix: Use one name per page: nav "Tile sheet" and "Engine console", or rename the headings to match the nav.
- source: web-fetch
- issue: #61
- fixed: (this commit) — the nav reads "Tile sheet" and "Engine console", the page headings; e2e checks every nav label is its page heading

### [x] [MED] all pages — rules sections are cited but the rules are never linked
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: Home, /config, /debug and /decisions cite "the written rules" and rule numbers, but no page links to the rules. A visitor cannot look up a cited section.
- evidence: `apps/web/src/home/HomePage.tsx:27` "the Combat in the written rules"; `apps/web/src/config/ConfigPage.tsx:632` "Each field names its rules section."; `apps/web/src/debug/DebugPage.tsx:81` "Numbers in [brackets] are rules sections."; no href to the rules anywhere in `apps/web/src`.
- suggested fix: Link "the written rules" (and the /config and /debug notes) to `spec/01-spec-v1-rules.md` on GitHub, using the repository-link helper in `apps/web/src/decisions/Inline.tsx`.
- source: web-fetch
- issue: #60
- fixed: (this commit) — "written rules" on Home, /config and /debug links to `spec/01-spec-v1-rules.md` on GitHub (`rulesUrl` in `decisions/Inline.tsx`); /decisions already links the files it names

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

