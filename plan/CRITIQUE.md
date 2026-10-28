# Critique log

> Last pass: 2026-10-28 at commit c326fd1
> Pass count: 30

> External-observer feedback for Survival Dice-Builder. Populated by
> `/critique`, drained by `/iterate`. See `skills/critique.md`
> for the contract.

## Pending

### [LOW] /decisions — the Event Calendar check still cites ruling numbers the visitor cannot look up (waits for /oversight)
- pass: 25 (commit 690f48e)
- viewport: desktop
- category: comprehension
- observation: The pass 21 fix dropped ruling numbers from the headings, but the Event Calendar check still cites "Spec v2 ruling N". The reading-status half of this row shipped for #186.
- evidence: "it may replace the spawn cadence (Spec v2 ruling 14) and the gathering-node rule (ruling 9)." (`plan/AUDIT.md`, "[needs-user-call] **Write the Event Calendar experiment (2026-10-11).**")
- suggested fix: Name the rules in words and drop the ruling numbers; the item is `[needs-user-call]`, so /oversight edits it.
- source: web-fetch

### [MED] /decisions — three balance checks give three different bot results
- pass: 21 (commit a6dc51f)
- viewport: desktop
- category: comprehension
- observation: "Bot batch results" gives a median end round of 14 and says nothing is filed; "Interim balance" gives round 5; "Balance under core loop v2" gives round 6 against the 8-14 band and says 57 runs buy 3 upgrades, while /play and /config mark "Buy 3 base upgrades" as out of reach under the default rules. None says which result is current.
- evidence: `plan/AUDIT.md:3223`, `:3228`, `:3229` (rendered on /decisions as checks)
- suggested fix: Close the 2026-10-03 and the first 2026-10-04 balance items in `plan/AUDIT.md` and keep one item with the latest batch under the current rules.
- source: web-fetch

### [MED] /decisions — the "Structural v2 questions" check names rows already decided
- pass: 21 (commit a6dc51f)
- viewport: desktop
- category: comprehension
- observation: The check says rule readings 63-70 each have an option on /config, all off by default, and asks the designer to try them. The same page lists rows 65 and 69 under "Decided recently", and their notes say those options were removed. Same problem as the pending "Spec v2 design work" row, in a different AUDIT item.
- evidence: `plan/AUDIT.md:3230`; `OPEN-QUESTIONS.md` rows 65, 69 "decided 2026-10-11"
- suggested fix: In that `plan/AUDIT.md` item, drop rows 65 and 69 and any advice to turn on options that no longer exist.
- source: web-fetch

### [LOW] /decisions — the "Reset /config once" check names a URL path and an unknowable date
- pass: 21 (commit a6dc51f)
- viewport: desktop
- category: voice
- observation: The heading names the page by its path, while both pages label the button "Reset to defaults". It asks every visitor to reset a config saved before 2026-10-09, a date they cannot check. The /config save message had the same path-naming problem and was fixed.
- evidence: `plan/AUDIT.md:3218`; `apps/web/src/config/ConfigPage.tsx:795`, `apps/web/src/play/StartPanel.tsx:153` "Reset to defaults"
- suggested fix: Reword to "If your config is from before 9 October, choose Reset to defaults on the Config page once", or close the item.
- source: web-fetch

### [MED] /decisions — the "Spec v2 design work" check lists rows already decided
- pass: 20 (commit ed01c82)
- viewport: desktop
- category: comprehension
- observation: The check says rows 7, 55, 30 and 49 are still to be designed, but the same page lists row 7 under "Decided recently" and / gives the elite's siege damage. Their row links go to GitHub because the rows are no longer open.
- evidence: `plan/AUDIT.md` "[needs-user-call] **Spec v2 design work (2026-10-04).**" item (rendered via `apps/web/src/decisions/DecisionsPage.tsx:93`); `OPEN-QUESTIONS.md` rows 7, 30, 49, 55 "decided 2026-10-11"
- suggested fix: Drop the decided rows from that `[needs-user-call]` item in `plan/AUDIT.md` so it names only open rows.
- source: web-fetch

### [LOW] sim — the bot cannot measure today's designer changes
- pass: session residue (2026-10-09)
- viewport: n/a
- category: sim
- observation: The phase 23 report says the bot never picks targets to defeat enemies before their dice hit, so the `defeatedDice` gap is a floor. The draft pool (`draft.unpicked: "pool"`) left both pinned sim batches unchanged, because bot runs rarely reach a second draft. The hand now stays across engagements, but the bot discards whole hands, so longer Combats are under-measured.
- evidence: session 2026-10-09; `docs/reports/phase-23-defeated-dice.md`; `tools/sim/src/run.test.ts` pins unchanged by 256bdb4; `packages/bot/src/policy.ts`
- suggested fix: A bot policy that engages to defeat enemies first, keeps cards for later engagements, and buys Training so drafts happen; then re-run the defeated-dice and draft-pool comparisons.
- source: user

## Done

### [x] [LOW] /debug — the State panel Defenses row prints the kind in lower case ("d1 tower")
- pass: 30 (commit c326fd1)
- viewport: desktop
- category: voice
- observation: Bearings capitalises Barricade and Tower, and pass 29 capitalised terrain in the same panel. The id prefix is a deliberate /debug choice; only the kind word is wrong.
- evidence: `apps/web/src/debug/StateView.tsx:88` `${d.id} ${d.kind}, ${d.health} health, at ${at(d.hex)}`
- suggested fix: Print the kind capitalised ("d1 Tower, 3 health, at (1,0)"), as the Impassable hexes row does.
- source: web-fetch
- issue: #234
- fixed: (this commit)

### [x] [LOW] /config — optional limits show "off" in lower case, and the spawn ramp help keeps a code formula
- pass: 30 (commit c326fd1)
- viewport: desktop
- category: voice
- observation: "Forced reveal every off" and "Spawn ramp every off" sit near "Maximum level Off". The spawn ramp help keeps "(1 + (round - 1) / N, rounded down)", a formula of the kind removed from /decisions.
- evidence: `packages/content/data/config.meta.json:185`, `:195`, `:213` `"empty": "off"`; `:193` "Each spawn node spawns 1 more enemy every this many rounds (1 + (round - 1) / N, rounded down)."; `apps/web/src/config/ConfigPage.tsx:348`
- suggested fix: Set the three "empty" values to "Off" and drop the bracketed formula from the spawn ramp help.
- source: web-fetch
- issue: #233
- fixed: (this commit)

### [x] [LOW] /play — the blocked-step log line names the terrain, then hedges "it is Lake or Mountain"
- pass: 30 (commit c326fd1)
- viewport: desktop
- category: voice
- observation: "You cannot enter Lake (1,-1): it is Lake or Mountain (2 left)." The place already names the terrain, so the reason repeats it as a guess.
- evidence: `apps/web/src/play/describeEvent.ts:186` `cannot enter ${place(names, event.hex)}: it is Lake or Mountain`; `apps/web/src/tiles/TileView.tsx:52` hexLabel capitalises the terrain
- suggested fix: Reword to "cannot enter Lake (1,-1): it is impassable (2 hexes left)."
- source: web-fetch
- issue: #232
- fixed: (this commit)

### [x] [LOW] /play — the delayed-return log line capitalises "You" after a colon
- pass: 30 (commit c326fd1)
- viewport: desktop
- category: voice
- observation: In solo it reads "No free base hex: You stay knocked out this round." Other log lines use lower case after a colon.
- evidence: `apps/web/src/play/describeEvent.ts:231` `No free base hex: ${who(event.player)} ...`
- suggested fix: Reorder to "You stay knocked out this round: no free base hex." (co-op: "Player 2 stays ...").
- source: web-fetch
- issue: #231
- fixed: (this commit)

### [x] [LOW] /play — the Exchanges Dice panel says "All your dice are on Skills." under a "Player 2's dice" heading
- pass: 30 (commit c326fd1)
- viewport: desktop
- category: voice
- observation: The engagement version of this note was made owner-aware; the Exchanges Combat version two lines below was not.
- evidence: `apps/web/src/play/DiceTray.tsx:141` `All your dice are on Skills.` against `:121` `All {state.players.length === 1 ? 'your' : owner} dice are on Skills.`
- suggested fix: Use the same owner-aware text at `:141` as at `:121`.
- source: web-fetch
- issue: #230
- fixed: (this commit)

### [x] [MED] /play — the engagement result screen still says "You" in co-op and gives shared experience to one player
- pass: 30 (commit c326fd1)
- viewport: desktop
- category: voice
- observation: In co-op the result lines say "You dealt", "You healed", "You gained" while the vitals above name "Player 2". Experience is shared, and the log says "All players gain 2 experience", but the result screen says "You gained 2 experience". The heal line also ends in a bare number ("You healed 2."), while the log says "You heal 2 health".
- evidence: `apps/web/src/play/EngagementModal.tsx:487` `You dealt ${summary.dealt} damage`, `:492` `You healed ${summary.healed}.`, `:497` `You gained ${rewards.join(' and ')}.`, `:500` `No enemy die hit you`; `apps/web/src/play/engageView.ts:296`, `:299`; against `apps/web/src/play/describeEvent.ts:189` and `:102`
- suggested fix: Use the seat name in co-op result lines, say "All players gain N experience" for the shared part, and render "You healed N health."
- source: web-fetch
- issue: #229
- fixed: (this commit)

### [x] [LOW] /debug — the State panel and step status print raw engine ids
- pass: 29 (commit 0f320fc)
- viewport: desktop
- category: voice
- observation: The player row reads "Player p1" while the action buttons say "Player 1's figure"; it prints "orientation top" where /play says "top halves up"; impassable hexes read "lake at (1,-1)" in lower case. The step status line says "Round 1, setup." while the State panel above it says "1 / Setup", and the exchange step shows as a raw id ("engagement: targets").
- evidence: `<dt>Player {p.id}</dt>` and `orientation {p.orientation}` (`apps/web/src/debug/StateView.tsx:101`, `:105`); `${hex.terrain} at (${key})` (`StateView.tsx:29`); `${ex.engage ? 'engagement' : 'exchange'}: ${ex.step}` (`StateView.tsx:38`); `Round ${state.round}, ${state.phase}.` (`apps/web/src/debug/stepStatus.ts:20`) against `PHASE_WORDS` (`StateView.tsx:11-16`).
- suggested fix: Head the row "Player {index + 1}", print "top halves up", capitalise terrain names, use `PHASE_WORDS` in `stepStatus`, and name each exchange step in words.
- source: web-fetch
- issue: #224
- fixed: (this commit)

### [x] [LOW] /play — the log mixes past and present tense for player actions
- pass: 29 (commit 0f320fc)
- viewport: desktop
- category: voice
- observation: Moving, gathering, building, gaining currency and buying are past tense; engaging, repairing, ignoring a hit and losing health are present tense. One Combat reads "You played Field Medic (bottom half)." then "You engage." then "You lose 2 health".
- evidence: past: `moved to` (`apps/web/src/play/describeEvent.ts:157`), `gathered` (`:161`), `built` (`:164`), `gained` (`:195`), `bought` (`:197`); present: `s('engage')` (`:129`), `s('repair')` (`:131`), `s('ignore')` (`:136`), `s('lose')` (`:145`).
- suggested fix: Use the present tense for every player action, to match the enemy lines ("attacks", "moves", "takes").
- source: web-fetch
- issue: #222
- fixed: (this commit)

### [x] [LOW] /play — the log names whose dice rolled but not whose die was kept, placed or taken back
- pass: 29 (commit 0f320fc)
- viewport: desktop
- category: voice
- observation: In co-op, "Player 2's die 1 rerolled: Star." sits next to "Die 1 kept." and "Die 1 on Strike as Sword." with no owner.
- evidence: `diceRolled` and `dieRerolled` use `whose(event.player)` (`apps/web/src/play/describeEvent.ts:111`, `:113`); `dieKept` (`:115`), `dieAssigned` (`:117`) and `dieUnassigned` (`:119`) do not.
- suggested fix: Start the three die lines with `whose(...)` too, for example "Player 2's die 1 kept."
- source: web-fetch
- issue: #221
- fixed: (this commit)

### [x] [LOW] /play — the log's experience line has no subject next to a currency line that names a player
- pass: 29 (commit 0f320fc)
- viewport: desktop
- category: comprehension
- observation: Experience is shared by all players, but its line has no subject; the currency line right after it now names one player. A co-op reader may think the experience went to that player too.
- evidence: `+${event.amount} experience (${event.experience}).` (`apps/web/src/play/describeEvent.ts:188`), then `${who(event.player)} gained ${event.amount} currency` (`:195`); home Levels item "Each defeated enemy gives experience to all players" (`packages/content/src/ruleText.ts:120`).
- suggested fix: "All players gain N experience (now M)." in co-op, "You gain N experience (now M)." solo.
- source: web-fetch
- issue: #220
- fixed: (this commit)

### [x] [MED] / — the Defenses, map and Enemies list reads like more steps of a round
- pass: 29 (commit 0f320fc)
- viewport: mobile
- category: comprehension
- observation: The items moved out of the Prepare step now sit in a second list right after the numbered Prepare and Combat steps, with no heading or lead-in and the same list style, so they read like steps 3 to 5. Two of them happen inside Combat (enemies spawn at every Combat; Towers fire at the start of each Combat).
- evidence: `apps/web/src/home/HomePage.tsx:43-55` `<ol className={styles.steps}>` (Prepare, Combat); `HomePage.tsx:56-66` `<ul className={styles.steps}>` (Defenses, The map, Enemies) with no heading.
- suggested fix: Put a short lead-in before the list (for example "What is on the map:") and give the list its own style so it does not look like more steps.
- source: web-fetch
- issue: #219
- addressed: (this commit)
- resolution: A lead-in, "On the board, every round:", now sits before the Defenses, map and Enemies items, and labels their list for screen readers. The list has its own style (no bullets, a rule down its left edge), so it no longer looks like steps 3 to 5 after the numbered Prepare and Combat. A unit test pins the two-step list and the labelled three-item list.

### [x] [MED] / — the home page never says a Tower's kill pays the player who built it
- pass: 29 (commit 0f320fc)
- viewport: desktop
- category: comprehension
- observation: The Shop item says you get currency for each enemy you defeat, and the Defenses item says a Tower hits the nearest enemy. Neither says a Tower's kill pays its builder, which is what the engine does. In co-op the /play log can now say "Player 2 gained 1 currency" during Player 1's Combat, and no page explains why.
- evidence: "Pay for cards with currency, which you get for each enemy you defeat" (`packages/content/src/ruleText.ts:143`); Tower sentence in `defenseText` (`ruleText.ts:267`); `const payee = state.defenses.find((d) => d.id === by)?.builder ?? by` (`packages/engine/src/progression/experience.ts:56`, rule "8.2, 12.3"); log line `apps/web/src/play/describeEvent.ts:195`.
- suggested fix: Add to the Tower sentence in `defenseText`: "When it defeats an enemy, the player who built it gets the currency."
- source: web-fetch
- issue: #218
- addressed: (this commit)
- resolution: The Defenses item on / now says, after each attacking defense: "When a Tower defeats an enemy, the player who built it gets the currency." The sentence comes from `defenseText` in `ruleText`, so it names any defense with an attack; the unit test pins it.

### [x] [LOW] / — the Prepare step is one long item that also explains enemy targeting
- pass: 28 (commit 0203e31)
- viewport: mobile
- category: comprehension
- observation: The Prepare item joins card halves, Barricade and Tower stats, tile reveal, spawns and how enemies pick targets in one list item. At 375px it fills several screens, and the targeting rule matters in Combat, not Prepare. The Combat step was split for the same reason in an earlier pass.
- evidence: `apps/web/src/home/HomePage.tsx:44-48` one `<li>` with `defenseText`, `revealText`, `spawnText`, `targetText`
- suggested fix: Keep Prepare to the card-halves sentence and move defenses, map reveal and enemies into their own short items.
- source: web-fetch
- issue: #213
- addressed: (this commit)
- resolution: The Prepare step on / keeps to the card-halves sentence. Defense costs and health, the base's starting health, tile reveal, spawns and enemy targeting move to a short list after the two steps, one item each: Defenses, The map, Enemies. A unit test pins the Prepare sentence and the three items.

### [x] [LOW] /debug — "Map: 1 tiles." and raw engine ids in the State panel
- pass: 28 (commit 0203e31)
- viewport: desktop
- category: voice
- observation: At the start of every run the map's text alternative reads "Map: 1 tiles.". The State panel shows card and Skill names, but prints upgrades, milestones, the phase and the end reason as raw ids: "shop-1", "survive-round-5", "3 / prepare", "(ended: base)".
- evidence: `apps/web/src/debug/MapView.tsx:48`; `apps/web/src/debug/StateView.tsx:23`, `:25`, `:36`, `:49`; `count()` helper in the same file
- suggested fix: Use `count()` for the tile count; map upgrades to their content names and milestones through `milestoneLabel`, as /play does; print the phase and end reason in words.
- source: web-fetch
- issue: #212
- addressed: 29e9061
- resolution: The map's text alternative says "Map: 1 tile." for one tile. The State panel names upgrades by their content name ("Shop I"), milestones through `milestoneLabel` as /play does ("Survive to round 5"), the phase as /play's phase bar does (Setup, Prepare, Combat, Run over), and an ended run as "(the base fell)". A unit test pins the words; the /debug e2e checks "1 / Setup" and "Run over (the base fell)".

### [x] [LOW] /play — the spoken hit line says "for 2" with no unit
- pass: 28 (commit 0203e31)
- viewport: desktop
- category: a11y
- observation: After a target pick the status line says "Strike hit grunt, 1 hex east for 2. 1 health left." With the place before it, "1 hex east for 2" is hard to parse by ear. The visible result and the log already say "damage".
- evidence: `apps/web/src/play/engageView.ts:143` `${skill} hit ${name} for ${e.amount}. ${e.health} health left.`; used by the `role="status"` hit line in `apps/web/src/play/PlayPage.tsx`
- suggested fix: Say "Strike hit the grunt 1 hex east: 2 damage, 1 health left." and update the label test.
- source: web-fetch
- issue: #211
- addressed: (this commit)
- resolution: The hit line now says "Strike hit grunt, 1 hex east: 2 damage, 1 health left.", the same "damage" and "health left" words the result and the log use. The label test pins the new wording.

### [x] [LOW] /debug — the map shows terrain by colour only, and spawn marks differ only by case
- pass: 28 (commit 0203e31)
- viewport: desktop
- category: a11y
- observation: The map's comment says every mark is also in the state text, but terrain is a colour class only and the State panel gives tile counts, not Lake or Mountain hexes. A spawn node is "s" and an elite spawn node is "S"; a screen reader does not voice case.
- evidence: `apps/web/src/debug/MapView.tsx:10-15` SITE_MARK, `:20-22` comment, `:48` aria-label; `apps/web/src/debug/StateView.tsx` Tiles row
- suggested fix: Give the elite spawn node its own letter (for example "E") and list the Lake and Mountain hexes in the State text.
- source: web-fetch
- issue: #210
- addressed: (this commit)
- resolution: The elite spawn node is now "E" on the map and in its text alternative, so no two marks differ only by case. The State panel gains an "Impassable hexes" row listing each lake and mountain hex with its coordinates ("lake at (1,-1)"), or "none". Two StateView unit tests pin both.

### [x] [MED] /debug — the intro says bracketed tags are rule sections, but most Combat events show "[Combat v3]"
- pass: 28 (commit 0203e31)
- viewport: desktop
- category: comprehension
- observation: The intro says "Numbers in [brackets] are sections of the written rules." Under the default Engagements Combat most Combat events are tagged "[Combat v3]", a name already removed from /play and /config, and draft events show "[Draft pool (designer 2026-10-09)]". Neither is a number or a rules section.
- evidence: `apps/web/src/debug/DebugPage.tsx:88` intro; `apps/web/src/debug/EventLog.tsx:38` prints `[{event.rule}]`; `packages/engine/src/combat/engage.ts:150`, `:166`, `:222` `rule: 'Combat v3'`; `packages/engine/src/progression/draft.ts:107`
- suggested fix: Show a non-numeric tag in words (for example "not in the written rules", with the helper /decisions uses for citations) and reword the intro to match.
- source: web-fetch
- issue: #209
- addressed: (this commit)
- resolution: The log prints a rules section number as it is ("[7.8]", "[7.8, Table 9]") and any other tag ("Combat v3", the designer's draft pool ruling) as "[not in the written rules]". The intro now says each line starts with the section it follows, or [not in the written rules] when the step comes from a later design decision. A ruleTag unit test and the debug e2e pin it.

### [x] [MED] /debug — Autoplay floods screen readers through the live event log
- pass: 28 (commit 0203e31)
- viewport: desktop
- category: a11y
- observation: The whole event log is a polite live region. One Autoplay click can apply up to 5000 bot actions and add hundreds of lines at once, and each is announced.
- evidence: `apps/web/src/debug/EventLog.tsx:32-33` `role="log" aria-live="polite"`; `apps/web/src/debug/DebugPage.tsx:23` `AUTOPLAY_LIMIT = 5000`
- suggested fix: Turn the live region off on the full log and announce one short status line per action or per Autoplay ("Autoplay: 312 actions, the run ended in round 7").
- source: web-fetch
- issue: #208
- addressed: d5c1206
- resolution: The event log is no longer a live region. A status line under the controls sums up each step in one sentence: "Autoplay: 312 actions. The run ended in round 7." after Autoplay, "Bot step: 4 new events. Round 3, combat." or "Action: 1 new event. Round 2, prepare." after one step. A stepStatus unit test and the debug and a11y e2e pin it.

### [x] [LOW] /config — preset editor: card remove button sounds like "Remove preset"; Id help text is unclear
- pass: 27 (commit a3ab1b5)
- viewport: desktop
- category: a11y
- observation: The button that removes one card is named "Remove preset 1: card 1", which a screen reader starts the same way as the "Remove preset" button that removes the whole preset; that button has no preset number. The Id help reads "Id: the name "Deck and hand preset" picks this preset by.", which ends on a preposition and points at an Id the "Deck and hand preset" choices never show.
- evidence: `apps/web/src/config/ConfigPage.tsx:623` aria-label; `:584-590` "Remove preset"; `:593` help text
- suggested fix: Name the buttons "Remove card N from preset P" and "Remove preset P"; reword the help to "Id: a short name for this preset. Saved configs use it to find the preset."
- source: web-fetch
- issue: #204
- addressed: (this commit)
- resolution: The card button is now "Remove card 1 from preset 1" and the preset button reads "Remove preset 1". The Id help reads "Id: a short name for this preset. Saved configs use it to find the preset." The /config e2e pins all three.

### [x] [LOW] /play log — the cancelled-die line reads "A die of grunt is cancelled: grunt was defeated."
- pass: 27 (commit a3ab1b5)
- viewport: desktop
- category: voice
- observation: The defeated enemy is off the map, so its name falls back to the bare kind with no article, and the line names it twice.
- evidence: `apps/web/src/play/describeEvent.ts:129`; `apps/web/src/names/pieceNames.ts` past-kind fallback
- suggested fix: Reword to "The defeated grunt's die is cancelled." with the article helper in `describeEvent.ts`.
- source: web-fetch
- issue: #203
- addressed: (this commit)
- resolution: The line now reads "The defeated grunt's die is cancelled.", naming the enemy once. An exportRun unit test pins it.

### [x] [LOW] /play log — attack and repair lines end in a bare number; terrain is lower case
- pass: 27 (commit a3ab1b5)
- viewport: desktop
- category: voice
- observation: "attacks you for 2.", "hits grunt for 2.", "attacks the base for 2." and "repair the base for 2 (health N)." give no unit, while nearby lines say "takes 2 damage". The blocked-step line says "it is lake or mountain"; /tiles writes Lake and Mountain.
- evidence: `apps/web/src/play/describeEvent.ts:123`, `:127`, `:168`, `:170`, `:180`
- suggested fix: Say "for 2 damage", "repairs the base by 2 health", and "it is Lake or Mountain".
- source: web-fetch
- issue: #202
- addressed: (this commit)
- resolution: The attack, siege and tower lines now end "for 2 damage", the repair line reads "repairs the base by 2 health (health N)", and the blocked-step line says "it is Lake or Mountain", as /tiles writes them. An exportRun unit test pins all five.

### [x] [LOW] /play — the upgrade hint says "You have 1 materials"
- pass: 27 (commit a3ab1b5)
- viewport: desktop
- category: voice
- observation: The hint under the upgrade tracks prints the count with a fixed plural. The Buy button in the same file and the log (a3ab1b5) already use the singular for 1.
- evidence: `apps/web/src/play/BasePanel.tsx:74` `You have {player.materials} materials.`; `:12` `materials(n)` helper
- suggested fix: Render `You have {materials(player.materials)}.`
- source: web-fetch
- issue: #201
- addressed: (this commit)
- resolution: The hint under the upgrade tracks now counts with the same `materials` helper as the Buy button, so 1 reads "You have 1 material." A BasePanel unit test pins 1 and 2.

### [x] [LOW] /play — the milestone list tells met from not met only by a glyph and a colour
- pass: 27 (commit a3ab1b5)
- viewport: desktop
- category: a11y
- observation: Each milestone item starts with a check mark or an en dash and a colour class. A screen reader hears "check mark" or nothing, never "met" or "not met".
- evidence: `apps/web/src/play/MilestoneList.tsx:21` `{got ? '✓' : '–'} {milestoneLabel(...)}`
- suggested fix: Mark the glyph `aria-hidden` and add visually hidden text "met" or "not met" to each item.
- source: web-fetch
- issue: #200
- addressed: (this commit)
- resolution: The glyph in each milestone item is now `aria-hidden`, and a visually hidden "Met:" or "Not met:" comes before the label, so a screen reader hears "Met: Survive to round 5". The base panel and the run summary share the list. A MilestoneList unit test pins both texts and the hidden glyph.

### [x] [MED] /play — the Base panel prices upgrade tiers that Build cards can never buy
- pass: 27 (commit a3ab1b5)
- viewport: desktop
- category: comprehension
- observation: The upgrade tracks list Shop II, Shop III, Training II and Training III with a material price, the same way as the tiers a player can buy. Under the default rules Build cards buy only Shop I and Training I, so these four are out of reach, and /play does not say so. When both tier I upgrades are bought, the hint still tells the player to play a Build card and pay materials, but nothing is left to buy. /config and the milestone list already say "out of reach" for the same limit.
- evidence: `apps/web/src/play/BasePanel.tsx:61` `{u.name}: {bought ? 'bought' : materials(u.cost)}`; `:70-74` hint shows whenever no Buy action is legal; `packages/content/src/ruleText.ts:574` `upgradesReachable`
- suggested fix: Show tiers outside `upgradesReachable` as "Shop II: out of reach", using the same reason text as the milestone list, and hide the Build-card hint when no reachable tier is left to buy.
- source: web-fetch
- issue: #199
- addressed: (this commit)
- resolution: A tier outside `upgradesReachable` now reads "Shop II: out of reach", and one line under the tracks gives the reason ("Out of reach: Build cards can buy only Shop I and Training I.") from a new content helper, `upgradesReachNote`, in the milestone list's words. The Build-card hint shows only while a tier in reach is left to buy. BasePanel and content unit tests pin the default rules and `buildLevels: "any"`.

### [x] [LOW] /decisions — open rule readings still print code formulas, phase numbers, report paths, and config keys
- pass: 26 (commit fa7c02b)
- viewport: desktop
- category: voice
- observation: Earlier fixes cleaned the Setting lines and the status lines. The body text of the open readings still has build-history and code tokens.
- evidence: Row 64 "`1 + floor((round - 1) / N)` enemies per Combat"; rows 63-70 "Report: `docs/reports/phase-22-experiments.md`"; row 78 "(phase 41 bot batch: 0 of 200 runs)" and "`rulings.buildLevels: \"any\"` plays the Spec v1 rule" (`OPEN-QUESTIONS.md`)
- suggested fix: Write the open readings in player words ("1 more enemy per node every N rounds"). Cut the phase numbers and file paths. Name the /config option, not its key.
- source: web-fetch
- issue: #193
- addressed: (this commit)

### [x] [LOW] /decisions — row 70 uses tabletop words and a second name for the miniature limit (addressed at 34fb231)
- pass: 26 (commit fa7c02b)
- viewport: desktop
- category: voice
- observation: /play and /config call the enemy cap the "miniature limit". Row 70 says "the 20 cap" and talks about "table upkeep" and "placements". Its rule tag also puts one pair of brackets inside another.
- evidence: "70. Table upkeep per Combat: up to 13 placements, each with spill-over to the nearest empty hex and a nearest-grunt promotion at the 20 cap, every round. (not in the written rules (physical edition))"; /play "Enemies N of 20 (miniature limit)"
- suggested fix: Reword to "Up to 13 new enemies each Combat; each spills to the nearest empty hex, and the nearest grunt promotes at the miniature limit (20)." Remove the nested brackets from the tag.
- source: web-fetch
- issue: #192
- resolution: Row 70 now reads "Up to 13 new enemies each Combat; each spills to the nearest empty hex, and the nearest grunt promotes at the miniature limit (20), every round." A rule tag with a note after the design-document name now joins it with a comma ("not in the written rules, physical edition"), so the page never nests brackets; the content unit test pins it.

### [x] [LOW] /config — preset quantity inputs are named after the raw preset id (addressed at (this commit))
- pass: 26 (commit fa7c02b)
- viewport: desktop
- category: a11y
- observation: In the deck preset editor, each card select is named "Preset 1: card N", but each quantity input is named after the raw id, so a screen reader hears two names for one preset. The editable "Id" field shows the raw key.
- evidence: `apps/web/src/config/ConfigPage.tsx:595` aria-label `Preset ${p + 1}: card ${i + 1}`; `:607` aria-label `${preset.id}: card ${i + 1} quantity` (reads "deck-10-hand-5: card 1 quantity"); `:566` label "Id"
- suggested fix: Name the quantity input `Preset ${p + 1}: card ${i + 1} quantity`, and give the "Id" field help text that says what it is.
- source: web-fetch
- issue: #191
- resolution: Each quantity input is named "Preset N: card M quantity" and each remove button "Remove preset N: card M", by place as the card select is, never by the raw id. The Id field gets help text under the preset head ("Id: the name "Deck and hand preset" picks this preset by."), tied by aria-describedby. The /config e2e checks all three.

### [x] [MED] /decisions — row 67 says 4 players get too few materials for Shop I; its own numbers say they get enough (addressed at (this commit))
- pass: 26 (commit fa7c02b)
- viewport: desktop
- category: comprehension
- observation: Row 67 says 10 nodes give 20 materials, so each node gives 2 and 2.5 nodes give 5. Shop I costs 4. The claim "below Shop I" contradicts the row's own numbers and the home page.
- evidence: "10 single-use nodes give 20 materials per run with starter Gather ... In 4-player, 2.5 nodes each is below Shop I." (`OPEN-QUESTIONS.md` row 67); / "buy Shop I (a Build card and 4 materials)"; `packages/content/data/upgrades.json` Shop I `"cost": 4`
- suggested fix: Recompute the 4-player claim with the current Gather and Shop I values, or cut it from row 67.
- source: web-fetch
- issue: #190
- resolution: Row 67's reading drops "In 4-player, 2.5 nodes each is below Shop I.": at Gather 2 that is 5 materials each, more than Shop I's 4. The rest of the row (20 materials per run, 33 for the 6 upgrades) stands. docs/DECISIONS.md is regenerated.

### [x] [MED] /decisions — rule reading 67 gives two recommendations and two bot results (addressed at (this commit))
- pass: 26 (commit fa7c02b)
- viewport: desktop
- category: comprehension
- observation: The reading text of row 67 says turn the option on and gives a median end round of 6 to 9. The proposal block under it says the option needs a playtest and gives round 6, now 8. /config shows only the playtest advice. A reader cannot tell which result is current.
- evidence: "Bot report: median end round 6 to 9, the largest single change. Recommendation: turn on." (`OPEN-QUESTIONS.md` row 67) and "Recommendation from the bot batches: it needs a playtest." (`packages/content/data/proposals.json` row 67, `"advice": "playtest"`)
- suggested fix: Cut the old "Bot report ... Recommendation: turn on." sentences from row 67 in `OPEN-QUESTIONS.md`, so the measured proposal block is the only result shown.
- source: web-fetch
- issue: #189
- resolution: Row 67's reading drops its old bot report and its "Recommendation: turn on.", so the measured proposal block (it needs a playtest; median round 6, now 8) is the only result on /decisions. docs/DECISIONS.md is regenerated. A DecisionsPage test fails when an open reading's own recommendation contradicts its proposal's advice.

### [x] [LOW] /decisions — row 17's reading status cites a ruling number (addressed at (this commit))
- pass: 25 (commit 690f48e)
- viewport: desktop
- category: comprehension
- observation: The pass 21 fix dropped ruling numbers from the headings, but a reading status still cites "Spec v2 ruling N".
- evidence: "Waiting for the designer to write the rule (Spec v2 ruling 20: steps of 3 by default; open for playtest)." (`OPEN-QUESTIONS.md:32`)
- suggested fix: Name the rule in words and drop the ruling number.
- source: web-fetch
- issue: #186
- resolution: Row 17's status now reads "Spec v2 sets steps of 3 by default; open for playtest", and docs/DECISIONS.md is regenerated. The decisions test now bars "ruling N" from every open reading's status label. The Event Calendar check half stays pending: it is a `[needs-user-call]` item, which only /oversight changes.

### [x] [LOW] /credits — empty die faces gloss themselves twice, and "Project-owned" is capitalised mid-line (addressed at (this commit))
- pass: 25 (commit 690f48e)
- viewport: desktop
- category: voice
- observation: Two die-face names carry a bracketed gloss that repeats the name, and each in-house line ends with "(Project-owned)" after "drawn for this game", which says the same thing.
- evidence: "Blank die face (empty: a blank face shows nothing): drawn for this game (Project-owned)"; "Enemy die face: miss (empty: a miss shows nothing): ..." (`ASSETS.md:23`, `:25`)
- suggested fix: Shorten the names to "Blank die face (empty)" and "Enemy die face: miss (empty)", and end in-house lines at "drawn for this game".
- source: web-fetch
- issue: #185
- resolution: ASSETS.md names the two faces "Blank die face (empty)" and "Enemy die face: miss (empty)". In-house lines on /credits end at "drawn for this game"; the register keeps "Project-owned" for the asset check, but the page no longer prints it. A CreditsPage unit test keeps the gloss and the license note off those lines.

### [x] [LOW] / — the Prepare step keeps the serial comma (addressed at (this commit))
- pass: 25 (commit 690f48e)
- viewport: desktop
- category: voice
- observation: The site dropped the serial comma everywhere else. This line is hand-written in HomePage.tsx, outside the strings the serial-comma tests scan.
- evidence: "Prepare: play the top halves of your cards to move, gather materials, and build Barricades and Towers." (`apps/web/src/home/HomePage.tsx`)
- suggested fix: Drop the comma before "and build" and add the home page copy to the serial-comma test.
- source: web-fetch
- issue: #184
- resolution: The Prepare step on / now reads "to move, gather materials and build Barricades and Towers." The home page's level line had the same comma ("level 4 needs 9 more, and each next step grows by 3"); it drops it too. A HomePage unit test scans the whole page's text for a serial comma before "and" or "or".

### [x] [LOW] /config — measured lines write the Combat model in lower case (addressed at (this commit))
- pass: 25 (commit 690f48e)
- viewport: desktop
- category: voice
- observation: Every proposal's measured line says "engagements" in lower case. The home page and the Combat select capitalise the model names.
- evidence: /config "Measured under engagements, 200 bot runs each, solo." (`packages/content/src/proposals.ts:154`); / "you can choose Exchanges instead"
- suggested fix: Write "Measured with Engagements Combat, 200 bot runs each, solo."
- source: web-fetch
- issue: #183
- resolution: Each proposal's measured line on /config and /decisions now reads "Measured with Engagements Combat, 200 bot runs each, solo." The line for an option measured only under the other model says "Not measured with Engagements Combat: this option changes nothing until Combat uses Exchanges.", and its recommendation cites "an earlier bot batch with Exchanges Combat". A unit test keeps lower-case "engagements" and "exchanges" out of every proposal line.

### [x] [MED] /config — proposals name "Default bot" and "Defender bot" but never say what they are (addressed at (this commit))
- pass: 25 (commit 690f48e)
- viewport: desktop
- category: comprehension
- observation: Each proposal's measured result gives one result per bot. The section intro and the rest of the page never say how either bot plays, so a stranger cannot tell why the results differ (round 6 against round 10).
- evidence: "Default bot: the median run ends in round 6 (no change)." / "Defender bot: the median run ends in round 10 (no change)."; `packages/content/src/proposals.ts:156`
- suggested fix: Add one sentence to the Proposals intro that says what each bot does, sourced from the bot package's policy names.
- source: web-fetch
- issue: #182
- resolution: The /config Proposals intro has a second line that says what each bot plays like: the default bot gathers, explores and builds across the map; the defender bot stays near the base, builds its defenses next to it and fights the enemies that come for it. The line is `BOTS_TEXT` in the content package. Unit tests and the /config e2e spec check it.

### [x] [MED] /config — the rules form's group is named "config", a raw key (addressed at (this commit))
- pass: 25 (commit 690f48e)
- viewport: desktop
- category: a11y
- observation: The fieldset around the whole rules form has the legend "config". It shows between the last proposal's Apply button and the "Players" group, and a screen reader announces it as the form's group name.
- evidence: page text order "Apply" / "config" / "Players"; `apps/web/src/config/ConfigPage.tsx:221` falls back to `human(path.at(-1) ?? 'config')` for the root path, rendered as `<legend>` at :238
- suggested fix: Give the root fieldset a real label ("Rules"), or render no fieldset and legend when the path is empty.
- source: web-fetch
- issue: #181
- resolution: The root fieldset of the /config rules form is named "Rules" instead of the raw key "config". The legend stays visually hidden, as before. The /config e2e spec checks for a "Rules" group and no "config" group.

### [x] [LOW] /decisions — rule readings and checks still use the serial comma (addressed at 054341d)
- pass: 24 (commit 3baaf7b)
- viewport: desktop
- category: voice
- observation: The site dropped the serial comma (f5a5c17) and tests ban it in ruleText, proposals and /config copy, but /decisions text comes from `OPEN-QUESTIONS.md` and `plan/AUDIT.md`, which the tests do not scan.
- evidence: /decisions row 78 "Shop II, Shop III, Training II, or Training III"; check "Art direction glance check" "card orientation, enemy type, and health"
- suggested fix: Drop the comma before "and"/"or" in those rows and extend the serial-comma test to the /decisions sources.
- source: web-fetch
- issue: #177
- resolution: The open rule readings and the designer checks on /decisions drop the serial comma: rows 9, 12, 46, 49, 68, 69, 70, 74 and 78 and the general note in `OPEN-QUESTIONS.md`, and the phone drag, designer reviews, glance check, visual polish, Structural v2 and playtest checks in `plan/AUDIT.md`. Three clause lists that the same pattern caught (rows 46, 69 and 74) are reworded around one comma. docs/DECISIONS.md is regenerated. A decisions test renders the page and fails on any comma before a list-ending "and" or "or".

### [x] [LOW] /decisions — rule reading 4 says "unreachable with 8 non-base tiles"; /play and /config say "out of reach" (addressed at 142c4e6)
- pass: 24 (commit 3baaf7b)
- viewport: desktop
- category: voice
- observation: One state, two words, plus a data-style phrase ("non-base"). /play and /config say "out of reach: the tile deck holds 8 tiles".
- evidence: `OPEN-QUESTIONS.md:19` ""Reveal 10 tiles" is unreachable with 8 non-base tiles."
- suggested fix: Reword row 4's question to ""Reveal 10 tiles" is out of reach: the tile deck holds 8 tiles."
- source: web-fetch
- issue: #176
- resolution: Row 4's question now reads ""Reveal 10 tiles" is out of reach: the tile deck holds 8 tiles.", the words /play and /config use for that milestone. docs/DECISIONS.md is regenerated. A decisions test builds the expected question from the same milestone label and out-of-reach reason /play shows, and bans "unreachable" and "non-base" in it.

### [x] [LOW] /config — the Milestones section does not name "Defeat an elite" (addressed at 9dacefa)
- pass: 24 (commit 3baaf7b)
- viewport: desktop
- category: comprehension
- observation: /config lists 7 milestone lines; the /play list and count have 8. "Defeat an elite" has no setting, so /config never names it and the two pages give different milestone counts.
- evidence: `packages/content/src/ruleText.ts:529` always includes `defeat-elite`; no "Defeat an elite" text under `apps/web/src/config/`
- suggested fix: Add a read-only line to the /config Milestones section: "Defeat an elite (always on; no setting)."
- source: web-fetch
- issue: #175
- resolution: The Milestones section on /config now opens with a note, "Defeat an elite is always a milestone and has no setting.", so the page names all 8 milestones, as /play does. A config group may now carry help in `config.meta.json`; /config shows it under the section name and links it as the section's description. A configMeta test checks that every milestone is named in a field line or in that note, and the config e2e checks the note.

### [x] [MED] /config — each proposal's measured result is one long sentence with test-harness words (addressed at d720367)
- pass: 24 (commit 3baaf7b)
- viewport: desktop
- category: voice
- observation: The measured text chains clauses with a semicolon and uses "middle half" and "runs that reach the sim cap", which no page explains. Lines such as "median end round 10 with the standard rules, 10 with this on" read as no change without saying so. Not the short STE style in bearings.
- evidence: `packages/content/src/proposals.ts:138` (`batchText`)
- suggested fix: Split into short sentences per bot ("Defender bot: runs end in round 10 (no change). Runs that never end: 26, now 1.") and explain the sim cap once in the section intro.
- source: web-fetch
- issue: #174
- resolution: Each bot's result is now two short sentences: "Defender bot: the median run ends in round 10 (no change). Runs stopped with the base still standing: 26, now 1." The middle half is left out of the page (it stays in the data), and the new wording says what a stalled run is, so no intro is needed. A proposals test bans the semicolon, "middle half" and "sim cap" in every measured line.

### [x] [MED] /play — the folded milestone count includes milestones the list marks out of reach (addressed at 7fbb0b8)
- pass: 24 (commit 3baaf7b)
- viewport: desktop
- category: comprehension
- observation: The Base panel summary reads "Milestones: 0 of 8 met" under the default rules, but 3 of the 8 (Buy 3 base upgrades, Reveal 10 tiles, Fire Arcane Rain) are marked out of reach in the list below it. The folded line does not say that only 5 can be met.
- evidence: `apps/web/src/play/BasePanel.tsx:105` counts `milestoneIds(state.config.milestones).length`, with no out-of-reach filter
- suggested fix: Add the out-of-reach count to the summary line, e.g. "Milestones: 0 of 8 met (3 out of reach)".
- source: web-fetch
- issue: #173
- resolution: The base panel summary now reads "Milestones: 0 of 8 met (3 out of reach)" under the default rules; a met milestone never counts as out of reach, and the bracket drops when none is. A unit test pins both cases and the full-run e2e checks the summary shape.

### [x] [MED] /decisions — rule reading 78 does not name "Fire Arcane Rain" as a milestone it blocks (addressed at 289c846)
- pass: 24 (commit 3baaf7b)
- viewport: desktop
- category: comprehension
- observation: /play and /config mark "Fire Arcane Rain" out of reach because Build cards buy only Training I (since 8c3b940). Row 78 is the reading for that cause, but it names only "Buy 3 base upgrades". "Arcane Rain" is not on /decisions, so the designer is not told about the second blocked milestone.
- evidence: `OPEN-QUESTIONS.md` has no "Arcane" match; /config "Fire Arcane Rain (out of reach: a level 3 Skill needs Training III, and Build cards can buy only Training I)."
- suggested fix: Add to row 78's question in `OPEN-QUESTIONS.md`: "and "Fire Arcane Rain" cannot be met (a level 3 Skill needs Training III)".
- source: web-fetch
- issue: #172
- resolution: Row 78's question now says 2 milestones are out of reach: "Buy 3 base upgrades" and "Fire Arcane Rain" (a level 3 Skill needs Training III). docs/DECISIONS.md is regenerated, and a decisions test checks that every milestone the default rules put out of reach is named in an open reading.

### [x] [LOW] /decisions — Rule readings are out of number order with no subheading (addressed at 92706e6)
- pass: 23 (commit 14de3ef)
- viewport: desktop
- category: comprehension
- observation: Readings waiting for a new rule sort first, then the rest, so the list runs 4, 9, ... 57, 58, then 56, 61. With no subheading between the two groups, 56 looks misplaced.
- evidence: `packages/content/src/decisions.ts:91-94` ranks 'pending-spec' rows first; live headings "58. Scenarios" then "56. Enemy pull distance"
- suggested fix: Split the list under two subheadings ("Waiting for a rule", "Played as proposed"), or sort by number only.
- source: web-fetch
- issue: #167
- resolution: openQuestions now sorts the open rows by number only; each row's status line already says whether it waits for a new rule. docs/DECISIONS.md is regenerated, and the decisions test pins number order.

### [x] [LOW] / — the link to /decisions is named "the open rules questions" (addressed at (this commit))
- pass: 23 (commit 14de3ef)
- viewport: desktop
- category: comprehension
- observation: The home page link text, the nav label "Decisions", and the page's "rule readings and checks" give one page three names; a visitor cannot tell the link goes to Decisions.
- evidence: `apps/web/src/home/HomePage.tsx:74` "<a href=\"/decisions\">the open rules questions</a>"; nav label "Decisions"
- suggested fix: Name the link "the Decisions page" (with a short gloss: rule readings the designer has not decided).
- source: web-fetch
- issue: #166
- resolution: The home page's Also line now links /decisions as "the Decisions page", matching the nav label, with the gloss "(rule readings that wait on the designer)". The HomePage test pins the link name and gloss and bars "open rules questions".

### [x] [LOW] / and /play — the heal effect reads "Heal 1" with no unit (addressed at (this commit))
- pass: 23 (commit 14de3ef)
- viewport: desktop
- category: voice
- observation: The starter Skill line says "Mend (Wand: heal 1)" while Guard's effect is complete ("gain 2 guard").
- evidence: `packages/content/src/ruleText.ts:449-450` returns `Heal ${e.amount}`
- suggested fix: Return `Heal ${e.amount} health` from skillEffectText, and update the tests that pin it.
- source: web-fetch
- issue: #165
- resolution: skillEffectText returns "Heal N health", so the starter Skill line on / and the Skill board on /play read "Mend (Wand: heal 1 health)", as complete as "gain 2 guard". The startText test pins the new line, and a new skillEffectText test pins the heal and guard wording. Card faces keep their short printed form ("Rest: heal 1").

### [x] [LOW] /play and /config — one enemy cap has two names, and proposals talk about a table (addressed at (this commit))
- pass: 23 (commit 14de3ef)
- viewport: desktop
- category: voice
- observation: /config names the cap "Enemy miniature limit" (the rules term, 10.5) while the /play counter says "(map limit)". Two proposals speak of players who "sit at the table" and "miniatures to place", though the game runs on one screen.
- evidence: `packages/content/data/config.meta.json:173`; `apps/web/src/play/PhaseBar.tsx:44` "Enemies N of 20 (map limit)"; `packages/content/data/proposals.json:178`, `:221`
- suggested fix: Make the /play counter use the rules term ("miniature limit"); reword the proposals to "when more players play" and "so fewer enemies are on the map".
- source: web-fetch
- issue: #164
- resolution: The /play counter reads "Enemies N of 20 (miniature limit)", the rules term (10.5) and the /config label. The "Seat scaling" proposal now says "when more players play" and "Spawn range" says "so fewer enemies are on the map". A ruleText test scans every proposal label and about line and every /config label, help and option for tabletop phrasing ("at the table", "miniatures to place"), with a planted case; the PhaseBar test pins the new counter.

### [x] [LOW] / and /config — the siege sentence and a proposal still use the serial comma (addressed at (this commit))
- pass: 23 (commit 14de3ef)
- viewport: desktop
- category: voice
- observation: The Combat step's siege sentence and the "Spawn range" proposal use the serial comma, which the site dropped elsewhere.
- evidence: / "each enemy next to a Barricade, a Tower, or the base hits one of them" (`packages/content/src/ruleText.ts:254`); `packages/content/data/proposals.json:221` "near a player figure, a Barricade, a Tower, or the Base tile spawn"
- suggested fix: Drop the comma before "or" in both lines; add a test that no ruleText or proposal copy contains ", or ".
- source: web-fetch
- issue: #163
- resolution: The siege sentence and the "Spawn range" proposal drop the comma before "or", and so do the engagement card step ("another option or discard it") and two /config help lines (the enemy die faces, the spawn range). A new ruleText test scans the ruleText source, every proposal label and about line, and every /config label, help and option for a list comma before "or"; a planted case pins the scan.

### [x] [MED] /config — a proposal's measured bot result is only in the Apply button's tooltip (addressed at (this commit))
- pass: 23 (commit 14de3ef)
- viewport: mobile
- category: a11y
- observation: Under "Proposals to try", the bot's measured result for each proposal is only in the Apply button's title tooltip. Touch users never see it, and screen readers may not hear it because the button has its own aria-label.
- evidence: `apps/web/src/config/ProposalList.tsx:40-41` aria-label={`Apply ${p.label}`} title={measuredText(p)}
- suggested fix: Show measuredText(p) as visible text after the proposal's about line, and link it to the button with aria-describedby.
- source: web-fetch
- issue: #162
- resolution: Each proposal under "Proposals to try" now shows its measured result as visible text under its about line, and the Apply button names that line with aria-describedby instead of a title tooltip. The intro says the effect is shown there and the Decisions page has the recommendation. A new unit test pins the link for every shown proposal; the /config e2e checks the text is visible.

### [x] [LOW] /play — at 1280x800 a long Skill effect text is cut by the footer (addressed at (this commit))
- pass: blind-round-4 (phase 24)
- viewport: 1280x800
- category: comprehension
- observation: At 1280x800 a long effect text is cut by the footer. (The 5-Skill, hand-strip and target-pick parts shipped; see Done.)
- evidence: blind round 4 (2026-10-09), the modal at 1280x800
- suggested fix: Keep a long effect text above the footer.
- source: blind-round-4
- issue: #157
- resolution: Reproduced with 5 or more Skills: the modal held 4 columns, so the fifth and sixth Skills sat under the footer. Above 760px, 5 or more Skills now take tiles of at least 160px with 28px slots, smaller effect text and the short reach line ("none in range"; screen readers still hear the long one), so 6 Skills with the longest effect texts share 1 row and the body does not scroll. A new e2e at 1280x800 pins it.

### [x] [LOW] / and /tiles — lists use the serial comma in some places and not others (addressed at (this commit))
- pass: 22 (commit 5e9eef1)
- viewport: desktop
- category: voice
- observation: The same / paragraph uses the serial comma in one list and drops it in the next two; /tiles uses it.
- evidence: / "What you have": "15 health, 1 action die, and 4 Skills", then "4 Move, 4 Gather, 1 Build and 1 Rest"; / Skills: "in rounds 2, 4, 6 and so on"; /tiles: "1 Base tile, 3 Countryside tiles, and 5 Core tiles".
- suggested fix: Pick one list style and use it in andList (packages/content/src/ruleText.ts) and the hand-written lists on / and /tiles.
- source: web-fetch
- issue: #156
- resolution: The site drops the serial comma everywhere, as `andList` already did: the / start line and exchange line in ruleText, the / "Also:" links, the /tiles tile count, the /play and /decisions descriptions and the noscript line. The ruleText, HomePage and TileView tests pin the new text.

### [x] [LOW] /tiles — each tile's hex list jumps from Center to Lower right, then runs counter-clockwise (addressed at (this commit))
- pass: 22 (commit 5e9eef1)
- viewport: desktop
- category: comprehension
- observation: The hex list order is not one a visitor expects (such as Top, then clockwise), so matching the list to the drawn tile is hard.
- evidence: Meadowlands: "Center: Plains", "Lower right: Plains, Gathering node", "Upper right: Forest", "Top: Hills, Spawn node", "Upper left: Plains", "Lower left: Lake", "Bottom: Forest, Gathering node".
- suggested fix: List Center, then Top, Upper right, Lower right, Bottom, Lower left, Upper left.
- source: web-fetch
- issue: #155
- resolution: Each /tiles hex list now reads the center, then Top and clockwise (Upper right, Lower right, Bottom, Lower left, Upper left), from a new `HEX_LIST_ORDER` in `apps/web/src/tiles/TileView.tsx`; the drawn tile and the hex indices are unchanged. A TileSheet test pins the order.

### [x] [MED] /play — the Dodge effect says "this exchange" under the default Engagements Combat (addressed at (this commit))
- pass: 22 (commit 5e9eef1)
- viewport: desktop
- category: voice
- observation: The draft Skill Dodge reads "Ignore 1 enemy hit this exchange". The default Combat is Engagements, and / and /config call Exchanges "the older Combat kept for playtests". Under Engagements the effect lasts for the current engagement, so the word points at the wrong Combat model.
- evidence: packages/content/src/ruleText.ts:450 `Ignore ${plural(e.hits, 'enemy hit', 'enemy hits')} this exchange`; /: "Before a run, you can choose Exchanges instead, the older Combat kept for playtests."
- suggested fix: Word the effect by Combat model: "this engagement" under Engagements, "this exchange" under Exchanges.
- source: web-fetch
- issue: #154
- resolution: skillEffectText (packages/content/src/ruleText.ts) now takes the run's Combat model, so Dodge reads "Ignore 1 enemy hit this engagement" under Engagements and "Ignore 1 enemy hit this exchange" under Exchanges, on the /play Skill board, the draft dialog and the / starter Skills line. The engine resets ignored hits at the start of each engagement, so the new word matches the rule. An effectText test pins both wordings.

### [x] [MED] /tiles — the Base legend says upgrades are bought "here", on the one Center hex (addressed at (this commit))
- pass: 22 (commit 5e9eef1)
- viewport: desktop
- category: comprehension
- observation: /tiles puts "upgrades are bought here" on the Base site, which is only the Center hex of Broken Village. / says "on the base". The /play Base panel says any hex of the Base tile works, which is what the engine does. A /tiles reader will think they must stand on the center hex.
- evidence: /tiles legend: "Base (the players defend it; upgrades are bought here, and cards once Shop I is built)"; /tiles: "Center: Plains, Base"; apps/web/src/play/BasePanel.tsx:55: "To buy an upgrade, stand on the Base tile and play a Build card".
- suggested fix: Use the /play wording on every page: "stand on the Base tile" in the /tiles Base legend and in the / Shop and Training lines.
- source: web-fetch
- issue: #153
- resolution: the /tiles Base legend now reads "the players defend it; stand on the Base tile to buy upgrades, and cards once Shop I is built", and the / Shop and Training lines read "Stand on the Base tile and buy Shop I (...)" and "buy at any time you stand on the Base tile", matching the /play Base panel and the engine (any hex of the Base tile, OPEN-QUESTIONS row 16). The wording lives in ruleText (siteText, shopText, trainingText); unit tests pin it.

### [x] [MED] / — the home page never says the game is co-op (addressed at (this commit))
- pass: 22 (commit 5e9eef1)
- viewport: desktop
- category: comprehension
- observation: The pitch says "for 1 to 4 players, on one screen" and the reader must infer from "Keep the base standing" that the players work together. The no-JS text says "co-op" and the /play description says "together", but the home copy and the home meta description do not.
- evidence: / pitch: "Defend the base, build your dice, survive one more round. A survival dice-builder for 1 to 4 players, on one screen." / meta description: "Defend the base, build your dice, survive one more round."
- suggested fix: Say "co-op" in the / pitch (for example "A co-op survival dice-builder for 1 to 4 players on one screen: all players defend one base.") and in the / meta description.
- source: web-fetch
- issue: #152
- resolution: the / pitch now reads "A co-op survival dice-builder for 1 to 4 players on one screen: all players defend one base." (player count from config through playersText), and the / meta description reads "Defend the base together, build your dice, survive one more round: a co-op survival dice-builder." A unit test pins the pitch; the static e2e checks the served / copy for "A co-op survival dice-builder".

### [x] [LOW] /play — the target pick pushes the Skills off screen (addressed at (this commit))
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: During Pick target the map and list push the Skills off screen.
- evidence: blind round 4 (2026-10-09), the modal at 375x812 and 1280x800
- suggested fix: Keep the Skills in view during Pick target.
- source: blind-round-4
- issue: #151
- resolution: during a target pick the Skills come up under the targets and the felt (every die already placed) goes last. At phone width the mini map is 150px tall, the target buttons are compact, and the "Choose a target" heading is heard, not shown (the instruction line says to pick a target). With 4 targets in range the first Skills row and the fired Skill end above the footer at 375x812 and 1280x800; an e2e at both sizes pins it.

### [x] [LOW] /play — at 375px the hand strip clips its option text (addressed at (this commit))
- pass: blind-round-4 (phase 24)
- viewport: 375x812
- category: comprehension
- observation: The hand strip clips its option text and shows about 4 cards.
- evidence: blind round 4 (2026-10-09), the modal at 375x812
- suggested fix: Keep strip text whole.
- source: blind-round-4
- issue: #150
- resolution: at phone width the strip cards share the width (up to 84px each, at least 66px), the colour band is 6px and the name padding smaller, so a 2-word name stays on 1 line and every option line ends above the bottom edge; the 4 cards left after Engage show without scrolling. An e2e at 375x812 with a deck of the wordiest cards (Field Medic, Sanctuary, Quarry, Excavate) pins both.

### [x] [LOW] /play — at 375px a fifth Skill sits behind the footer (addressed at (this commit))
- pass: blind-round-4 (phase 24)
- viewport: 375x812
- category: comprehension
- observation: With 5 Skills the fifth sits behind the footer.
- evidence: blind round 4 (2026-10-09), the modal at 375x812
- suggested fix: Fit 5+ Skills (3 columns or a smaller tile).
- source: blind-round-4
- issue: #149
- resolution: at phone width 5 or more Skills take 3 columns of smaller tiles (slots 1.6rem, still a touch target; smaller name and effect text), so with 6 dice the fifth Skill ends above the footer. An e2e at 375x812 with 5 starter Skills pins the 3-column row and the fifth tile inside the modal body.

### [x] [LOW] /play — the mini-map target label can cover tokens (addressed at (this commit))
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: The "grunt, 1 hex north 2/2" label sits over neighbouring tokens and once hid the "You" figure; near the map edge the mini map shows enemies cut off and no hex tiles.
- evidence: blind round 4 (2026-10-09), the target mini map
- suggested fix: Place the label away from other tokens; frame the mini map on the map's hexes.
- source: blind-round-4
- issue: #148
- resolution: the target tag now takes the first side (right, left, above, below) that stays in the frame and covers no figure, defense or other enemy (`placeTag` in `apps/web/src/play/mapTag.ts`); the mini map also frames every enemy it can target, so none is cut off at the 3-hex edge.

### [x] [LOW] /play — card timing and the Special face are explained only later (addressed at (this commit))
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: Cards are greyed while rolling with nothing saying when they become playable; the Special face (skull) means 2 damage only on the result; a Star's meaning shows only at Use dice.
- evidence: blind round 4 (2026-10-09), the Roll step
- suggested fix: A one-time note at Roll on when cards can be added; the Special and Star meanings at Roll.
- source: blind-round-4
- issue: #147
- resolution: the Roll instruction now says when cards come (engagements: "You can add cards from your hand when you use the dice."; exchanges: "Then you can add cards from your hand.") and what a Star fits ("A Star fits any Skill slot."); phones read "Keep or roll dice. Cards come after." The Special face already reads "Special 2" under each enemy die from the Roll step on, so it needed no change.

### [x] [LOW] /play — "in range" counts differ from the engaged enemies (addressed at (this commit))
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: The title says "vs 1 elite" while Shot says "3 enemies in range" (enemies within 2 hexes that did not roll). Testers read it as a contradiction.
- evidence: blind round 4 (2026-10-09), the Skill reach line vs the title
- suggested fix: Say what the count is ("3 in range, 1 engaged") or explain range against engaged.
- source: blind-round-4
- issue: #146
- resolution: in an engagement, an attack Skill whose range holds enemies that did not roll now says how many of them are engaged: "3 enemies in range, 1 of them engaged" (phones: "3 in range, 1 engaged"). When every enemy in range is engaged the line gives the count alone.

### [x] [LOW] /play — the "reveal 10 tiles" milestone may be unreachable (addressed at (this commit))
- pass: oversight (2026-10-10)
- viewport: n/a
- category: rules
- observation: `milestones.tilesRevealed` is 10, but `packages/content/data/tiles.json` holds 9 tiles. If the Base tile is one of them, at most 8 can be revealed and the milestone never fires. Unverified: oversight did not trace the engine.
- evidence: `packages/content/data/config.default.json` `milestones.tilesRevealed=10`; `tiles.json` (9 ids); expand candidate "Rule text" pass 5 row ("Reveal 10 tiles", only 8 can be revealed)
- suggested fix: Verify the reachable count; if unreachable, file an `OPEN-QUESTIONS.md` reading (proposed: cap the milestone at the revealable count) rather than change the rule value silently.
- source: oversight
- issue: #145
- resolution: verified unreachable: the Base tile starts on the map, so the tile deck holds 8 tiles. OPEN-QUESTIONS row 4 already carries the reading (pending-spec), so the value stays 10; the /play run summary and the /config milestone line now mark it "out of reach: the tile deck holds 8 tiles".

### [x] [LOW] /decisions — headings cite "row 20" and ruling numbers the visitor cannot look up (addressed at (this commit))
- pass: 21 (commit a6dc51f)
- viewport: desktop
- category: comprehension
- observation: Rows 59 and 60 start with "Row 20 says/reads ..." and their rule tag ends "row 20" (a row of rules Table 8, not a row on this page). Row 78 cites "ruling 25" and one check cites "Spec v2 ruling 14". The page shows neither table nor rulings.
- evidence: `OPEN-QUESTIONS.md:75` "Row 20 reads \"Gather +2\" (Haul) as 2 in total"; /decisions heading "(rule Table 8, row 20, decided 2026-10-11)"
- suggested fix: Name the card instead of the table row ("The Haul card says ..."), and drop the ruling numbers or link them to the written rules.
- source: web-fetch
- issue: #144

### [x] [LOW] /tiles — tile captions write site names in lower case (addressed at (this commit))
- pass: 21 (commit a6dc51f)
- viewport: desktop
- category: voice
- observation: The caption under each tile name reads "1 base", "2 gathering nodes, 1 spawn node", "1 elite spawn node"; the site legend and every hex list on the same page write "Base", "Gathering node", "Elite spawn node".
- evidence: `apps/web/src/tiles/TileSheet.tsx:34` (`SITE_LABEL[s].toLowerCase()`)
- suggested fix: Drop the `.toLowerCase()` in the caption so it matches the legend ("1 Base, 2 Gathering nodes").
- source: web-fetch
- issue: #143

### [x] [LOW] /config — "standard rules" and "defaults" name the same baseline (addressed at (this commit))
- pass: 21 (commit a6dc51f)
- viewport: desktop
- category: voice
- observation: The status line says "Playing with the standard rules" or "N changes from the standard rules"; the button next to it says "Reset to defaults" and its confirm "Reset every value to the default?". Same on the /play start panel. A visitor cannot tell the two are the same thing.
- evidence: `apps/web/src/config/ConfigChanges.tsx:62`; `apps/web/src/config/ConfigPage.tsx:781,795`; `apps/web/src/play/StartPanel.tsx:137,153`
- suggested fix: Use one name on both pages, e.g. "Reset to the standard rules" and "Reset every value to the standard rules?".
- source: web-fetch
- issue: #142

### [x] [LOW] /play — the result's enemy dice do not mark a defeated enemy (addressed at (this commit))
- pass: blind-round-4 (phase 24), split from the "who took the damage" row
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: On the engagement result the defeated grunt's die is still labelled "grunt" with no mark that it was defeated. The result now names each damaged enemy and says it was defeated, but the dice row does not.
- evidence: blind round 4 (2026-10-09); `apps/web/src/play/DiceTray.tsx` `EnemyDice` marks cancelled dice only during the exchange (`rolls` given: no marks)
- suggested fix: Pass the defeated enemies to the result's `EnemyDice` and mark their dice (label and a visual cue).
- source: blind-round-4
- issue: #141
- fixed: (this commit). The result passes its defeated enemies to `EnemyDice`; each of their dice is dimmed (`data-defeated`), its label reads "grunt, defeated" and its name says "its enemy was defeated".

### [x] [LOW] all pages — design tools sit in the nav as equals of Play (addressed at 39fccdf)
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: navigation
- observation: Tiles, Decisions and Debug are design and playtest aids, but the nav lists them beside Home and Play with nothing to tell them apart.
- evidence: `apps/web/src/App.tsx:13-21` NAV lists seven equal links.
- suggested fix: Split the nav into the game links and a labelled "Design tools" group, or open each tool page with one sentence that says it is a design aid.
- source: web-fetch
- issue: #140
- fixed: 39fccdf. The nav lists Home, Play, Config and Credits, then a group labelled "Design tools" (Tile sheet, Decisions, Engine console) set apart at the rail's far end (`NAV` group field, `NAV_TOOLS_LABEL`).

### [x] [LOW] /play — the result does not say who took the damage or their health after (addressed at eb40e28)
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: "You dealt 2 damage" does not name the elite or its health after (14 to 12); only the full event list does. The defeated grunt's die is labelled "grunt" with no mark that it was defeated.
- evidence: blind round 4 (2026-10-09), the engagement result
- suggested fix: Name each damaged enemy and its health left; mark a defeated enemy's dice.
- source: blind-round-4
- issue: #139
- fixed: eb40e28. The result lists each damaged enemy: "Elite, 1 hex north took 2 damage: 12 health left." or "Grunt took 2 damage and was defeated." (`hitsLine` over the summary's new `hits`). The dice mark is split into its own Pending row.

### [x] [LOW] /credits — the intro describes how the page is built (addressed at a409efe)
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: voice
- observation: The second sentence is build-process language with no use to a visitor.
- evidence: `apps/web/src/credits/CreditsPage.tsx:60` "Generated from the project's asset register."
- suggested fix: Cut the sentence, or replace it with where to report a missing credit.
- source: web-fetch
- issue: #138
- fixed: a409efe. The intro now reads "If a credit is missing or wrong, open an issue", linking the repo's issues page; the polish e2e checks the link and that "asset register" is gone.

### [x] [LOW] /decisions — row 57 shows a raw rule tag and a data file name (addressed at 4936726)
- pass: 20 (commit ed01c82)
- viewport: desktop
- category: voice
- observation: Row 57's heading prints "(rule Core loop v2)" raw, its setting reads "tiles.json: no config field", and it writes "countryside" and "core" in lower case where /tiles capitalises them. Some rows still carry "designer 2026-10-04" stamps.
- evidence: `apps/web/src/decisions/DecisionsPage.tsx:76` "<code>{s.key}</code>: no config field", `:126` "(rule {q.rule})"; `OPEN-QUESTIONS.md` row 57
- suggested fix: Pass the rule through the same citation helper /config uses, print "Set in the map tiles, not on the Config page", and capitalise the tile kinds.
- source: web-fetch
- issue: #137
- fixed: 4936726. Reading headings go through `readingRuleText` (the play log's `ruleCitation`; a tag with no section reads "not in the written rules"), a content-file setting reads "Set in the map tiles, not on the Config page" (`unlistedSettingText`), and row 57 writes "Countryside" and "Core". The "designer 2026-10-04" stamps are left: they date the designer's rulings.

### [x] [LOW] /tiles — the Base legend says cards are bought there with no Shop I condition (addressed at b1cd77c)
- pass: 20 (commit ed01c82)
- viewport: desktop
- category: comprehension
- observation: The Base legend says upgrades and cards are bought on the base; / says the Shop opens only after Shop I. The home Shop line says currency comes from each defeated enemy without the amounts, though the Levels line gives the experience per enemy.
- evidence: `packages/content/src/ruleText.ts:68` "upgrades and cards are bought here"; `ruleText.ts:127,133` Shop I and currency lines; `enemies.json` currency grunt 1, elite 4
- suggested fix: Say cards are bought there once Shop I is built, and add the per-enemy currency to the Shop line from `enemies.json`.
- source: web-fetch
- issue: #136
- fixed: b1cd77c. `siteText` takes the upgrades content: the Base legend reads "the players defend it; upgrades are bought here, and cards once Shop I is built". `shopText` lists each enemy's currency from `enemies.json` ("(a grunt 1, an elite 4)").

### [x] [MED] / — "What you have" names the four Skills but not their faces or effects (addressed at d1099a2)
- pass: 20 (commit ed01c82)
- viewport: desktop
- category: comprehension
- observation: The starter line lists Strike, Shot, Mend, Guard with no die face or effect. Later "Your guard takes the damage first" uses guard with no source, so a visitor cannot tell where guard comes from.
- evidence: `packages/content/src/ruleText.ts:426` "4 Skills your dice can fire (Strike, Shot, Mend, Guard)"; `ruleText.ts:205` "Your guard takes the damage first, then your health."; `packages/content/data/skills.json`
- suggested fix: Generate each Skill's face and effect from `skills.json` ("Strike (Sword): 2 damage next to you"), and say guard comes from the Guard Skill and card bottom halves.
- source: web-fetch
- issue: #135

### [x] [MED] / — Prepare says to build Barricades and Towers but never what they cost or do (addressed at a4a370b)
- pass: 20 (commit ed01c82)
- viewport: desktop
- category: comprehension
- observation: The home page tells players to build Barricades and Towers and keep the base standing, but gives no cost, health, or effect for either, and not the base's health. Only /play shows these.
- evidence: `apps/web/src/home/HomePage.tsx:44-45` "build Barricades and Towers."; `packages/content/data/defenses.json` (Barricade cost 2, health 4; Tower cost 4, health 3, 2 damage at range 2); `config.default.json` base.startingHealth 20
- suggested fix: Add a `defenseText(content, config)` to `ruleText.ts` that reads the costs, health, and Tower damage from content, and show it in the Prepare step.
- source: web-fetch
- issue: #134

### [x] [MED] /play — "Reset to the standard rules" wipes the saved config in one click (addressed at b5e61e1)
- pass: 20 (commit ed01c82)
- viewport: desktop
- category: comprehension
- observation: The start panel button clears the saved config and reloads with no confirm, while /config asks first. The two buttons also name the action differently ("standard rules" and "defaults").
- evidence: `apps/web/src/play/StartPanel.tsx:134-142` onClick `resetConfig(store)` then `window.location.assign('/play')`; `apps/web/src/config/ConfigPage.tsx` "Reset every value to the default?" confirm, "Reset to defaults"
- suggested fix: Give the start panel button the same confirm step as /config and one label on both pages.
- source: web-fetch
- issue: #133

### [x] [LOW] all pages — one meta description and og:url for every route, no canonical (pass 9; addressed at d1b99ff, found stale at pass 20)
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: seo
- observation: Every route has the home description and an og:url fixed to the home page, and there is no rel=canonical.
- evidence: `apps/web/index.html:6,16`; `apps/web/src/App.tsx:53-61` sets only the title and noindex per route.
- suggested fix: In the route effect, set a canonical link and og:url from the route path, and give each route its own description.
- source: web-fetch

### [x] [LOW] / — the Combat step is one long sentence chain
- pass: 8 (commit c9bd27d)
- viewport: n/a (web-fetch)
- category: voice
- observation: The Combat step joins three clauses with semicolons and colons, and names the "start panel" and "Exchanges" before the visitor has seen either. This is not the short, plain style set in bearings.
- evidence: `apps/web/src/home/HomePage.tsx:25-29` "Put your dice on your Skills one at a time; the enemy dice hit last, after your guard. Or choose Exchanges, the Combat in the written rules, on the start panel: in each exchange you roll, ..."
- suggested fix: Split into short sentences, and put Exchanges in its own sentence: "Before a run, you can choose Exchanges, the Combat in the written rules."
- source: web-fetch
- issue: #132
- fixed: (this commit)

### [x] [LOW] /play — a hex next to an enemy that costs too much just isn't offered, with no reason
- pass: session residue (2026-10-09)
- viewport: n/a
- category: comprehension
- observation: With `combat.moveCostNextToEnemy` above 1 (an option since 2026-10-09; the default is now 1), a step next to an enemy costs more, and with too few move points left the hex is simply not highlighted. The designer hit this before the default changed and could not tell why.
- evidence: session 2026-10-09; `packages/engine/src/movement/move.ts:51`; `apps/web/src/play/PlayMap.tsx` offers only legal hexes
- suggested fix: When the option is above 1, mark such hexes ("costs 2: next to an enemy") or say it in the Move banner.
- source: user
- issue: #131
- fixed: (this commit)

### [x] [LOW] /tiles — the site legend names the sites but not what they do
- pass: 19 (commit ce4724a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The terrain legend now gives each terrain's effect on moves, but Base, Gathering node, Spawn node and Elite spawn node have no text after them. Neither /tiles nor / says how an elite spawn node differs from a spawn node.
- evidence: `apps/web/src/tiles/TileSheet.tsx:62-65` renders only `SITE_LABEL[s]`.
- suggested fix: After each site name add a short effect from ruleText, as the terrain rows do (for example "Gathering node (Gather here for materials)").
- source: web-fetch
- issue: #130
- fixed: (this commit)

### [x] [LOW] /credits — the ambientCG textures are listed under the "Icons" heading
- pass: 19 (commit ce4724a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The five CC0 textures (wood, planks, felt, paper, brass) sit in the Icons list, right after "every icon is under CC BY 3.0". The register has its own Textures section; the page has no Textures heading.
- evidence: `apps/web/src/credits/CreditsPage.tsx:61-78` renders every asset under one "Icons" list; `ASSETS.md:40-50` groups them under "## Textures".
- suggested fix: Split the asset list by path (assets/icons vs assets/textures) and give the textures a "Textures" heading.
- source: web-fetch
- issue: #129
- fixed: (this commit)

### [x] [LOW] /debug — the Engine console ignores the saved config and does not say so
- pass: 19 (commit ce4724a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: /play starts runs from the config saved on /config; /debug always plays the default rules. A playtester who changes a value and checks it here sees the old rule.
- evidence: `apps/web/src/debug/DebugPage.tsx:28` `createGame(defaultContent.config, msg.seed)` vs `apps/web/src/play/PlayPage.tsx:100` `loadConfig(store)`.
- suggested fix: Add "This console uses the default rules, not your saved config." to the intro (or start from the saved config as /play does).
- source: web-fetch
- issue: #128
- fixed: (this commit)

### [x] [LOW] /config — a deck preset's "Hand size" reads as the deck total
- pass: discovery 1 (2026-10-10, bee25b5)
- viewport: 1280x800
- category: comprehension
- observation: Under each deck preset the label "Hand size" sits right before "10 cards", so `deck-10-hand-3` reads as a hand of 10.
- evidence: `apps/web/src/config/ConfigPage.tsx:506`; reader pass (discovery 1).
- suggested fix: Put each value on its own labelled line ("Deck: 10 cards", "Hand: 3 cards").
- source: discovery
- issue: #127
- fixed: (this commit)

### [x] [LOW] /decisions — decided row 7 says "enemy record" and points at an unexplained "row 73"
- pass: 19 (commit ce4724a)
- viewport: n/a (web-fetch)
- category: voice
- observation: "Enemy record" is a data word already removed from the home page; "(row 73)" names a row the reader is not told about.
- evidence: `OPEN-QUESTIONS.md:22` "each enemy record gives its siege damage (7.11, Table 5): at the end of Combat a grunt deals 1 damage and an elite 3 (row 73)".
- suggested fix: Reword to "At the end of Combat a grunt deals 1 damage and an elite 3 to a structure next to it (7.11, Table 5)."
- source: web-fetch
- issue: #126
- fixed: (this commit); row 7 says when the siege happens and what each enemy deals

### [x] [LOW] all pages — the main script is 650 kB, over the build's own 600 kB warning
- pass: discovery 1 (2026-10-10, bee25b5)
- viewport: n/a
- category: perf
- observation: `pnpm --filter @survival/web build` warns "Some chunks are larger than 600 kB": `index-*.js` is 649.80 kB (198.36 kB gzip). The 3D dice are already a separate chunk (530 kB).
- evidence: build output at bee25b5; every route is imported eagerly in `apps/web/src/App.tsx:25-43`.
- suggested fix: Lazy-load the design-tool routes (/config, /decisions, /debug, /tiles) with `React.lazy`, so a player's first load carries / and /play only.
- source: discovery
- issue: #125
- fixed: (this commit); the main script is 277 kB, every page but home is its own chunk

### [x] [MED] / — a stranger cannot learn what they start with or how a round turns over
- pass: 19 (commit ce4724a)
- viewport: n/a (web-fetch)
- category: comprehension
- observation: The home page uses Skills, guard, action die, materials and "the top halves of your cards" without saying what a player starts with (deck, hand size, starting Skills, dice), what the bottom halves do, that each round is Prepare then Combat, or how 1 to 4 players take turns on one screen.
- evidence: / "play the top halves of your cards to move, gather materials, and build Barricades and Towers"; "Put your dice on your Skills one at a time."; "Your guard takes the damage first, then your health." (`apps/web/src/home/HomePage.tsx:36-65`).
- suggested fix: Before "How a run goes", add a short "What you have" list from ruleText (starting deck and hand size, starting Skills, action dice, guard and health, what each card half does) and one line on round order and player turns.
- source: web-fetch
- issue: #124
- fixed: (this commit)

### [x] [MED] /decisions — the Checks list still shows developer to-do notes
- pass: 19 (commit ce4724a)
- viewport: n/a (web-fetch)
- category: voice
- observation: The earlier fix dropped only the `.env` and token rows. Checks still name a slash command, a test file, phase numbers, a repo README and an internal design doc, none of which a visitor can act on. One check still calls the 9 tiles "proposed" with a "best before phase 7" deadline, though /tiles says the Play page builds its map from them.
- evidence: `docs/DECISIONS.md:141` "`touch.spec.ts` covers this with emulated touch only. File anything odd with `/jot`."; `:144` "Review the 9 proposed tiles ... Best before phase 7"; `:146` "`spec/README.md` says the canonical spec is the Claude design doc"; `:149` "Interim balance after phase 20".
- suggested fix: Show only checks a designer or playtester can do from the site, in player words; close the tiles and source-sync checks in AUDIT, and drop phase numbers, file names and slash commands from the rest.
- source: web-fetch
- issue: #123
- fixed: (this commit)

### [x] [LOW] /tiles — the legend says only which terrains are impassable, not what the others do
- pass: 12 (commit c34753b)
- viewport: desktop
- category: comprehension
- observation: The legend lists Plains, Forest, Hills, Wasteland, Lake (Impassable), Mountain (Impassable). Nothing on /tiles or / says whether Forest, Hills or Wasteland change movement.
- evidence: /tiles legend; / "How a run goes" does not mention terrain.
- suggested fix: Add each terrain's effect after its name in the legend ("no effect" or its move cost), taken from config.
- source: browser
- issue: #122
- fixed: (this commit)
- note: Terrain only matters for entering a hex (rule 3.4); the legend now says "no effect on moves" or "impassable" from the content's IMPASSABLE list

### [x] [LOW] /play — the run summary lists "Buy 3 base upgrades", which default rules cannot reach
- pass: 18 (commit 8f7cdbb)
- viewport: desktop
- category: comprehension
- observation: With only Build I cards, only Shop I and Training I can be bought, so the milestone is out of reach (open question 78). Nothing before the summary says milestones exist, so a stranger first meets them as goals they could not have met. Separate from the pending "reveal 10 tiles" row.
- evidence: `apps/web/src/play/RunSummary.tsx:14,38`; `config.default.json` `upgradesBought: 3`; OPEN-QUESTIONS.md row 78 "(phase 41 bot batch: 0 of 200 runs)".
- suggested fix: Mark milestones the current config cannot reach in the run summary and on /config, and name milestones in one start-panel line.
- source: web-fetch
- issue: #121
- fixed: 5658bb3
- note: run summary and /config mark the milestone; the start-panel milestone line is left for a later tick

### [x] [LOW] /config — help texts name the baseline three ways and carry roadmap wording
- pass: 13 (commit 23315d6)
- viewport: n/a
- category: voice
- observation: Help says "(default)", "Off: the current rule", and "the written rule" for baselines; one keeps a section number "(6.9)" next to the rules note. Two engagement help texts say "until each grunt type has its own Special" and "until elites have their own siege rule", which the build-word scan misses; die faces are "hit, miss, or special" in one line and "Hit face" in the next.
- evidence: `packages/content/data/config.meta.json:103,109,141,146,152,170,200`.
- suggested fix: One pattern ("(default)" for the shipped value, "as in the written rules" for the printed rule), drop "(6.9)" and the "until ..." clauses, one casing for face names.
- source: web-fetch
- issue: #120
- fixed: 90858d8

### [x] [LOW] /config and / — the level steps are worded three ways, and no page says how much experience an enemy gives
- pass: 18 (commit 8f7cdbb)
- viewport: desktop
- category: comprehension
- observation: / gives step sizes ("level 3 needs 6 more"); /config "Step increase" still says "than the step before it"; /decisions row 17 gives "3 more than the last step (3, 9, 18, 30)". The Experience fields have no live rule line, and / says "Each defeated enemy gives experience" without the amounts.
- evidence: `packages/content/src/ruleText.ts:71,74`; /config "Each next level needs this much more experience than the step before it. Rules 8.5."; `ruleLineFor` (`ruleText.ts:398-433`) has no experience branch; `packages/content/data/enemies.json` grunt 1, elite 4.
- suggested fix: Return levelText from ruleLineFor for experience fields, reuse that phrase in the /config help, and add the per-enemy amounts to levelText.
- source: web-fetch
- issue: #119
- fixed: 431fb35

### [x] [LOW] / — the "Also" line calls the tiles "proposed" and says rules questions "wait on you"
- pass: 18 (commit 8f7cdbb)
- viewport: desktop
- category: voice
- observation: /tiles says the Play page builds its map from these tiles, so "the proposed tiles" tells a stranger they are not in play. "the rules questions that wait on you" addresses a player as the designer; /decisions says they wait on the designer.
- evidence: `apps/web/src/home/HomePage.tsx:67-68`; /tiles "The game on the Play page builds its map from these 9 tiles"; /decisions "16 rule readings and 14 checks wait on the designer."
- suggested fix: Change the links to "the map tiles" and "the open rules questions".
- source: web-fetch
- issue: #118
- fixed: 4a1c111

### [x] [LOW] /config — "(open question N)" citations are plain text and name a list /decisions does not show
- pass: 17 (commit 2e92a76)
- viewport: desktop
- category: navigation
- observation: Help texts end "(open question N)" with no link, and /decisions never uses the words "open question"; several cited numbers (1, 2, 5, 6, 13, 14, 39) are not on that page, so the citation leads nowhere. /decisions already links its rows to /config fields, but not back.
- evidence: /config "Rules 9.7 (open questions 2, 39).", "Rules 10.1 (open question 5)."; `apps/web/src/config/ConfigPage.tsx:266`; link pattern in `ProposalList.tsx:31`.
- suggested fix: Link each number to `/decisions#<rowId>` when the row is shown there, else drop it; use one name on both pages.
- source: web-fetch
- issue: #117
- fixed: (this commit)

### [x] [LOW] /play — the knockout log names only lost materials, prints "1 materials", and omits the lost currency
- pass: 18 (commit 8f7cdbb)
- viewport: desktop
- category: voice
- observation: / and the start panel say a knocked-out player loses materials and currency; the log line names materials only, without a singular form.
- evidence: `apps/web/src/play/describeEvent.ts:204` "`loses ${event.materialsLost} materials`"; the engine event carries `currencyLost`; config `loseMaterials` and `loseCurrency` both true.
- suggested fix: Name both losses with correct plurals ("loses 1 material and 3 currency").
- source: web-fetch
- issue: #116
- fixed: (this commit)

### [x] [LOW] / — the "written rules" link leaves the site with no sign
- pass: discovery 1 (2026-10-10, bee25b5)
- viewport: 1280x800
- category: navigation
- observation: The home page's "written rules" link opens a GitHub markdown file with nothing to say it leaves the site.
- evidence: `apps/web/src/home/HomePage.tsx` (link pinned by `HomePage.test.tsx:26-28`); reader pass (discovery 1).
- suggested fix: Add "(on GitHub)" to the link text or an external-link mark with an accessible name.
- source: discovery
- issue: #115
- fixed: (this commit)

### [x] [MED] /play — the start panel shows rule text from the default config, not the saved one
- pass: 18 (commit 8f7cdbb)
- viewport: desktop
- category: comprehension
- observation: The New run panel builds its knockout and Combat lines from the default config and hard-codes 1 to 4 players. A visitor who saved other knockout or player settings on /config sees the default text above "Start run".
- evidence: `apps/web/src/play/StartPanel.tsx:25-26` COMBAT_HINT reads `defaultContent.config`; `:69` `knockoutText(defaultContent.config)`; `:81` `[1, 2, 3, 4].map(...)`; the `config` prop is used only for the changes list.
- suggested fix: Pass the `config` prop to combatText, siegeText and knockoutText, and build the Players options from the config's player range.
- source: web-fetch
- issue: #114
- fixed: (this commit)

### [x] [MED] / — the Combat step says "Play an Engage card"; Engage is an option on Move and Gather, not a card
- pass: 18 (commit 8f7cdbb)
- viewport: desktop
- category: comprehension
- observation: A new player holding Move, Gather, Build and Rest looks for a card called Engage that does not exist. Engage is a Combat option on Move and Gather only; Build and Rest have none. The /play banner already treats it as an option ("Play each card: Engage (...), another option, or discard it").
- evidence: / "Play an Engage card to roll your dice from where you stand"; `packages/content/src/ruleText.ts:154`; `packages/content/data/cards.json` engage options on starter Move and Gather only.
- suggested fix: Word it as an option: "Play a card's Engage option (on Move and Gather) to roll your dice from where you stand".
- source: web-fetch
- issue: #113
- fixed: (this commit)

### [x] [LOW] /play — Roll again stays on when every die is kept
- pass: blind-round-4 (phase 24)
- viewport: 1280x800 and 375x812
- category: comprehension
- observation: After keeping the only die, "Roll again (2 left)" is still enabled though nothing would roll.
- evidence: blind round 4 (2026-10-09), the Roll step
- suggested fix: Disable or hide Roll again when no die is unkept (the engine offers the roll; the UI can say it rolls nothing).
- source: blind-round-4
- issue: #112
- fixed: (this commit)

### [x] [LOW] /tiles — terrain names are lower case in the legend and capitalised in the hex lists
- pass: 17 (commit 2e92a76)
- viewport: desktop
- category: voice
- observation: The terrain legend prints raw ids ("plains", "lake (impassable)") next to a site legend and hex lists in capitals ("Plains, Gathering node"); tile SVG labels say "countryside tile" under a "Countryside tiles" heading.
- evidence: `apps/web/src/tiles/TileSheet.tsx:49` renders `{t}` raw; `TileView.tsx:62` aria-label `${tile.name}, ${tile.kind} tile`.
- suggested fix: Render legend terrains through the capitalising helper hexLabel() uses, and capitalise the kind in the SVG label.
- source: web-fetch
- issue: #111
- fixed: (this commit)

### [x] [LOW] /config — the draft help says "each round that this number divides"
- pass: 17 (commit 2e92a76)
- viewport: desktop
- category: voice
- observation: The "Draft every N rounds" help is a divisibility statement, not STE-plain; / says the same thing as "every 2nd round".
- evidence: `packages/content/data/config.meta.json:271` "a draft happens in each round that this number divides."
- suggested fix: "With the Training Ground open, a draft happens every N rounds (2: rounds 2, 4, 6)."
- source: web-fetch
- issue: #110
- fixed: (this commit)

### [x] [LOW] /decisions — row 17 says "steps of 3", recommends turning on the default, and prints `eliteBonus: 5`
- pass: 17 (commit 2e92a76)
- viewport: desktop
- category: comprehension
- observation: The thresholds 3, 9, 18, 30 grow by 3 each level; the step is not 3. The phase 22 note "(recommend: turn on)" reads as advice for a setting that is already the default. The row prints a raw config key where /config says "Extra experience for an elite".
- evidence: /decisions "The engine plays Spec v2 8.5: steps of 3 (level 2 at 3, 3 at 9, 4 at 18, 5 at 30)."; "steps of 3 give 1 more level by round 9 (recommend: turn on)"; "(`eliteBonus: 5`)".
- suggested fix: Say "each step grows by 3 (3, 9, 18, 30)", mark the phase 22 advice "now the default", and write "5 extra experience for an elite".
- source: web-fetch
- issue: #109
- fixed: (this commit)

### [x] [LOW] /config — the rules note prints "Rules engagements." and "Rules core loop (open question 55)."
- pass: 13 (commit 23315d6)
- viewport: n/a
- category: comprehension
- observation: `ruleCitation` maps design-document tags to player words, so fields with no written-rules section end with a citation that is not a section anyone can look up.
- evidence: `apps/web/src/config/ConfigPage.tsx:248`; tags "Combat v3", "Combat v3 (siege)", "Core loop v2 (open question 55)" in `config.meta.json`; mapping at `packages/content/src/ruleText.ts:151-154`.
- suggested fix: For a field with no written-rules section, print "Not in the written rules (open question N)" or nothing.
- source: web-fetch
- issue: #108
- fixed: (this commit)

### [x] [LOW] /decisions — decided row 7 still states the v1 siege reading before the Spec v2 one
- pass: 17 (commit 2e92a76)
- viewport: desktop
- category: comprehension
- observation: Row 7 still says "Until the spec carries that text the engine uses the v1 reading: grunt 2 fixed, elite 6 dice" right before the Spec v2 sentence (grunt 1, elite 3). The Done fix for rows 7, 55, 65, 69, 72 missed this sentence.
- evidence: `OPEN-QUESTIONS.md:22`; /decisions "Decided recently" row 7.
- suggested fix: Drop the "Designer intends ... elite 6 dice." sentences so the row gives only the Spec v2 reading.
- source: web-fetch
- issue: #107
- fixed: (this commit)

### [x] [LOW] / — the Training line omits the Build card and when the draft happens
- pass: 16 (commit 0b2ae6a)
- viewport: desktop
- category: comprehension
- observation: The Shop line says where to buy and that it needs a Build card; the Training line in the same list says neither, and "every 2nd round" does not say which rounds.
- evidence: `packages/content/src/ruleText.ts:94` vs `:111-116`; / "Training I (3 materials) opens the Training Ground: every 2nd round, each player looks at 2 Skills and keeps 1 for free."
- suggested fix: Build `trainingText` like `shopText` ("Buy Training I on the base (a Build card and 3 materials) to open the Training Ground") and name the draft rounds ("rounds 2, 4, 6 ...").
- source: web-fetch
- issue: #106
- fixed: (this commit)

### [x] [LOW] / — the Levels line says "3 more than the step before" with no step defined
- pass: 16 (commit 0b2ae6a)
- viewport: desktop
- category: comprehension
- observation: A reader cannot work out what level 3 needs from "each next level needs 3 more than the step before"; /decisions row 17 words the same rule differently ("than the last step").
- evidence: `packages/content/src/ruleText.ts:71`; / "Level 2 needs 3 experience, and each next level needs 3 more than the step before."
- suggested fix: Give the first three thresholds from config ("Level 2 needs 3 experience, level 3 needs 6 more, level 4 needs 9 more.").
- source: web-fetch
- issue: #105
- fixed: (this commit)

### [x] [MED] /decisions — rule reading 4 gives three tile counts and calls itself "Superseded" while still pending
- pass: 17 (commit 2e92a76)
- viewport: desktop
- category: comprehension
- observation: Row 4's question says 8 non-base tiles, its reading offers "Reveal 7 (the whole tile deck)", then "Superseded: Reveal 7 is under review", and the Setting line says the game uses 10. /tiles lists 9 tiles (8 non-base), so 7 is not the whole deck. A visitor cannot tell the current reading. Same root as the Pending row "/play — the reveal 10 tiles milestone may be unreachable"; this row is the public copy.
- evidence: `OPEN-QUESTIONS.md:19`; /decisions "Reveal 7 (the whole tile deck)", "Setting: Tiles revealed: 10 (This row names 7; the game uses 10.)"; /tiles "builds its map from these 9 tiles".
- suggested fix: Rewrite row 4's reading cell to one count from the content ("8 tiles can be revealed; the milestone asks for 10. Proposal: reveal 8, every tile.") and drop the "Superseded" sentence; leave the config value to the open question.
- source: web-fetch
- issue: #104
- fixed: (this commit)

### [x] [LOW] /config — the save message names a URL path, not the page
- pass: 9 (commit e859de5)
- viewport: n/a (web-fetch)
- category: voice
- observation: After a save the page says "/play" where a visitor sees the nav label "Play".
- evidence: `apps/web/src/config/ConfigPage.tsx:615` "Saved. New runs on /play use this config."
- suggested fix: Change to "Saved. New runs on the Play page use this config."
- source: web-fetch
- issue: #103
- fixed: (this commit)

### [x] [LOW] / — the Combat step says "Play Engage" and "each enemy record gives its dice"
- pass: 16 (commit 0b2ae6a)
- viewport: desktop
- category: voice
- observation: "Enemy record" is a data word a player never sees, and "Play Engage" does not say Engage is a card.
- evidence: `packages/content/src/ruleText.ts:143`: "Play Engage to roll your dice from where you stand, plus the enemy dice of each enemy next to you (each enemy record gives its dice)."
- suggested fix: "Play an Engage card to roll your dice plus the enemy dice of each enemy next to you (a grunt rolls N, an elite M)", with N and M read from the enemy content.
- source: web-fetch
- issue: #102
- fixed: (this commit). `combatText` now takes the enemy content and reads "Play an Engage card to roll your dice from where you stand, plus the enemy dice of each enemy next to you (a grunt rolls 1, an elite 2)", the counts read from each enemy's dice; ruleText tests pin both.

### [x] [LOW] / — the home page does not link the Decisions page
- pass: 8 (commit c9bd27d)
- viewport: n/a (web-fetch)
- category: navigation
- observation: The "Also:" line links the tiles, the config, and credits, but not Decisions, the page that lists what waits on the designer.
- evidence: `apps/web/src/home/HomePage.tsx:37-38`.
- suggested fix: Add "the rules questions that wait on you" linked to /decisions to the "Also:" line.
- source: web-fetch
- issue: #101
- fixed: (this commit). The "Also:" line now links "the rules questions that wait on you" to /decisions between the rules config and credits; a HomePage test pins the link.

### [x] [LOW] /play — the phase bar arrow is read aloud and the enemy cap is unexplained
- pass: 14 (commit f95875e)
- viewport: desktop
- category: a11y
- observation: The current phase starts with a text "▶ " that screen readers read, although `aria-current="step"` already marks it. The counter "Enemies 3/20" does not say that 20 is the miniature limit.
- evidence: `apps/web/src/play/PhaseBar.tsx:33,40-41`.
- suggested fix: Wrap the arrow in `<span aria-hidden="true">`; label the counter "Enemies 3 of 20 (limit)" or add a title/visually-hidden "miniature limit".
- source: web-fetch
- issue: #100
- fixed: (this commit). The arrow on the current phase sits in an `aria-hidden` span, so screen readers hear only the phase name and its `aria-current` step. The counter reads "Enemies 3 of 20 (map limit)" with the miniature-limit rule from `ruleText` as its title; a PhaseBar test pins both.

### [x] [LOW] /tiles — "Proposed layouts for review" does not say if /play uses them
- pass: 14 (commit f95875e)
- viewport: desktop
- category: comprehension
- observation: The intro says the layouts are proposed "for review" but not by whom, or whether the game plays these tiles now. It also writes "countryside tiles" and "core tiles" in lowercase next to "Base tile", while the headings capitalise all three.
- evidence: `apps/web/src/tiles/TileSheet.tsx:31`.
- suggested fix: One sentence: "The game on the Play page uses these tiles." (or what is true); match the capitals of the headings.
- source: web-fetch
- issue: #99
- fixed: (this commit). The intro and the page description now say the game on the Play page builds its map from these tiles, counts them per kind from the content with the headings' capitals ("1 Base tile, 3 Countryside tiles, and 5 Core tiles"), and says the Base tile starts in the center and the Countryside tiles are drawn before the Core tiles; a TileSheet test pins the sentence.

### [x] [LOW] /play — the start panel Combat hint repeats its label
- pass: 14 (commit f95875e)
- viewport: desktop
- category: voice
- observation: The hint is prefixed "Combat:" and the text itself starts with "Engagements:" or "The Combat in the written rules", so it reads "Combat: Engagements: ..." and "Combat: The Combat in the written rules."
- evidence: `apps/web/src/play/StartPanel.tsx:23-25,115`.
- suggested fix: Drop the "Combat:" prefix at line 115, or drop the label from each hint so the text starts with the rule.
- source: web-fetch
- issue: #98
- fixed: (this commit). The hint under the Combat select drops its "Combat:" prefix, so it starts with the rule ("Engagements: ..." or "The older Combat, kept for playtests. ..."); the StartPanel test pins both starts.

### [x] [MED] /decisions — each "Setting:" line shows raw config keys and code values
- pass: 14 (commit f95875e)
- viewport: desktop
- category: voice
- observation: Each reading's setting line prints the dotted config path and the raw value in code type; long values become "a list or table" and a mismatch reads "(the row says X: differs)". A visitor cannot read the current rule in plain words.
- evidence: `apps/web/src/decisions/DecisionsPage.tsx:41-43` ("= a list or table", "(the row says {s.named}: differs)").
- suggested fix: Lead with the field's plain label and a plain value from `config.meta.json` (e.g. "Enemies per hex: 1"); keep the path only as the /config link target; reword the mismatch note ("This row names X; the game uses Y.").
- source: web-fetch
- issue: #97
- fixed: (this commit). Each setting reads "<label>: <value>": the /config label is the link (the path stays only as the link target), and the value is in plain words from `config.meta.json` via a new `settingValueText` (select phrases without the "(default)" note, the empty placeholder, on/off, numbers, "a list on the Config page"). A mismatch reads "(This row names X; the game uses Y.)".

### [x] [MED] / and /config — the enemy target rule is stated two ways
- pass: 13 (commit 23315d6)
- viewport: n/a
- category: voice
- observation: / says "enemies go for the nearest structure first" and stops; /config says they turn to a player who is at least 2 hexes nearer, with a tie order. A visitor reading / learns enemies ignore players.
- evidence: `packages/content/src/ruleText.ts:57` (spawnText) vs `packages/content/src/ruleText.ts:134-138` (targetOrderText).
- suggested fix: Drop the targeting clause from `spawnText` and show `targetOrderText` (or a short form built from the same config) on /.
- source: web-fetch
- issue: #96
- fixed: (this commit). `spawnText` ends at when spawn nodes add enemies; a new `targetText` (the head of `targetOrderText`, from `rulings.playerPullDistance`) follows it on / and in the PROTOCOL teach list, so / names the 2-hex player pull that /config gives. A test pins the short form as the start of the full order line.

### [x] [MED] /decisions — decided rows 7, 55, 65, 69 and 72 still give pre-Spec-v2 readings that contradict /
- pass: 16 (commit 0b2ae6a)
- viewport: desktop
- category: comprehension
- observation: The home page states the shipped rules; the decided rows on /decisions still carry their old text, so a visitor gets two answers. Row 7 says the engine uses "grunt 2 fixed, elite 6 dice" for structure damage; / says a grunt deals 1 and an elite 3. Row 55 says a knocked-out player loses "the materials they carried"; / (and config `knockout.loseCurrency: true`) says materials and currency. Row 72 calls engagements a "Playtest build" with open points; / calls them the Combat in the written rules. Rows 65 and 69 sit under "Decided recently" but still read "Proposed: ... option, default off".
- evidence: `docs/DECISIONS.md:115`, `:119`, `:122`, `:123`, `:126` (generated from `OPEN-QUESTIONS.md` rows 7, 55, 65, 69, 72); `packages/content/src/ruleText.ts` siege and knockout text on /.
- suggested fix: Show a "Spec v2:" line on each decided row superseded by a ruling (siege from each enemy record; materials and currency lost; engagements are the written Combat; rows 65/69 options removed), and regenerate `docs/DECISIONS.md`. Same family as the rows 74/75 finding below; one fix can close both.
- source: web-fetch
- issue: #95
- fixed: (this commit). A Reading cell in `OPEN-QUESTIONS.md` may end with a `**Spec v2:**` note; `splitReading` splits it off, and /decisions and `docs/DECISIONS.md` show it on its own "Now in the written rules:" line (player words; the scan bans "Spec v2" in components). Rows 7 (siege from each enemy record), 55 (materials and currency), 65, 69, 74, 75 (options removed) and 72 (engagements are the written Combat) carry a note; row 75 drops "Once per exchange stays an option". The "Decided recently" intro says a reading plays now unless its Spec v2 line says what replaced it. A test fails when a decided row whose setting Spec v2 removed has no note.

### [x] [LOW] /decisions — decided rows 74 and 75 describe options phase 41 removed
- pass: 15 (commit 255362f)
- viewport: desktop
- category: comprehension
- observation: Row 75 says "Once per exchange stays an option" and row 74 discusses the exchange-only enemy options; phase 41 dropped both, and the config has no such keys.
- evidence: `docs/DECISIONS.md:125`, `:127`; `packages/content/data/config.default.json` (no Skill-fire limit key).
- suggested fix: Add "Option removed in Spec v2" to rows 74 and 75 and delete "stays an option".
- source: web-fetch
- issue: #95
- fixed: (this commit), with the pass 16 MED above: rows 74 and 75 carry a Spec v2 note that the options are removed.

### [x] [MED] /decisions — the public page lists repo housekeeping
- pass: discovery 1 (2026-10-10, bee25b5)
- viewport: 1280x800
- category: content
- observation: The checks list shows operations notes to every visitor: "Replace GH_TOKEN and add GH_REPO to the main checkout's .env", "GitHub rejects the current token (401 Bad credentials)", and the `.env` keys DEPLOY_PROVIDER, CF_PAGES_PROJECT, NOTIFY_NTFY_TOPIC. No secret values appear.
- evidence: `packages/content/src/decisions.ts:194` reads every `- [needs-user-call]` line of `plan/AUDIT.md`, including the operations rows at `plan/AUDIT.md:1191,1195`.
- suggested fix: Skip needs-user-call rows that name `.env`, a token, or a local checkout (or tag them `ops` in AUDIT and filter the tag); regenerate `docs/DECISIONS.md`.
- source: discovery
- issue: #94
- fixed: (this commit). `parseUserCalls` skips a needs-user-call line that names `.env`, a token, or the local checkout, so /decisions and `docs/DECISIONS.md` drop the two operations rows (16 checks become 14). The rows stay in `plan/AUDIT.md` for the operator.

### [x] [MED] / — the home page never says how the base takes damage under engagements
- pass: 13 (commit 23315d6)
- viewport: n/a
- category: comprehension
- observation: / says the run ends when the base falls, but the Combat step does not mention siege. "Enemies hit structures at the end of Combat" appears only on the /play start panel and in /config help, typed by hand, with no damage numbers (grunt 1, elite 3 in config).
- evidence: `apps/web/src/play/StartPanel.tsx:24`, `packages/content/data/config.meta.json:129`; siege damage in `packages/content/data/config.default.json`; nothing in `combatText(config, 'engage')`.
- suggested fix: Add a `siegeText(config)` to `ruleText` ("At the end of Combat, each grunt next to a Barricade, Tower, or the base deals 1 damage to it; each elite deals 3") and use it on /, the start panel and /config.
- source: web-fetch
- issue: #93
- fixed: (this commit). One `siegeText(content)` in `ruleText`, built from each enemy record's siege damage (the numbers live in `enemies.json`, not the config): "When Combat ends, each enemy next to a Barricade, a Tower, or the base hits one of them (a Barricade first, then a Tower, then the base), even when it is next to a player too: a grunt deals 1 damage, an elite 3." / reads it at the end of the Combat step ("Either way, ..."), the start panel's Combat hint reads it under both models (replacing the hand-typed line), and /config's Combat model rule line appends it.

### [x] [MED] /play, / and /config — four different accounts of when the enemy dice hit in an engagement
- pass: 13 (commit 23315d6)
- viewport: n/a
- category: voice
- observation: The /play banner says the enemy dice hit after you choose End engagement; the engagement modal says they hit "when no dice are left"; / says "the enemy dice hit last, after your guard" (reads as if guard acts first); /config says "guard first" and "at the end of the engagement, all at once". The same rule is said four ways.
- evidence: `apps/web/src/play/nextStep.ts:23`, `apps/web/src/play/engageView.ts:48`, `packages/content/src/ruleText.ts:90`, `packages/content/data/config.meta.json:146,176`.
- suggested fix: One `ruleText` phrase ("When you end the engagement, every enemy die hits at once; your guard takes the damage first") read by the banner, the modal, / and /config.
- source: web-fetch
- issue: #92
- fixed: (this commit). One `enemyHitText(config)` in `ruleText`: "When you choose End engagement or no dice are left, every enemy die hits you at once, even the dice of an enemy you defeated. Your guard takes the damage first, then your health." `combatText` (/, the start panel, the playtest kit), the modal's assign line (and so the banner), and /config help for Hit damage and Defeated enemies' dice all read it; the "cancelled" experiment changes the phrase with it.

### [x] [MED] /play — during an engagement the banner says click the map; the modal says choose in the modal
- pass: 13 (commit 23315d6)
- viewport: n/a
- category: comprehension
- observation: When a Skill fires, the phase banner says "click a highlighted enemy on the map to hit", while the modal in front says "Choose the enemy it hits." The modal has no map; targets are picked in it. The banner's engagement lines are still hand-written.
- evidence: `apps/web/src/play/nextStep.ts:20-25,54` vs `apps/web/src/play/engageView.ts:35,55`.
- suggested fix: During an engagement, have the banner read `engageInstruction` (or a short form of it) instead of the `ENGAGE` table, and drop the table.
- source: web-fetch
- issue: #91
- fixed: (this commit). The banner reads `engageInstruction`, the modal's own line, at every engagement step; the `ENGAGE` table is gone. The modal's assign line now names End engagement, as the old banner did.

### [x] [MED] / — "Level up, buy cards in the Shop, and draft Skills" gives no when or how
- pass: 14 (commit f95875e)
- viewport: desktop
- category: comprehension
- observation: The home page closes with three ways to grow in one sentence. It does not say when the Shop opens, what you pay with, or what earns a level and a Skill draft. The Shop is named nowhere else on the page.
- evidence: `apps/web/src/home/HomePage.tsx:44` "Level up, buy cards in the Shop, and draft Skills to last longer."
- suggested fix: One short `ruleText` line each for the Shop (when, currency) and levels (experience earns a level; a level gives a Skill draft), with numbers from config.
- source: web-fetch
- issue: #90
- fixed: (this commit). Spec v2 8.4 gives a new die per level, not a Skill draft; the draft comes from the Training Ground (10.8), so / now has one line each for levels, the Shop and Skills.

### [x] [MED] /decisions — says the Combat model changes only on the Config page; /play can also pick it per run
- pass: 14 (commit f95875e)
- viewport: desktop
- category: comprehension
- observation: The intro says a reading marked for the other Combat model "changes nothing until the Combat model is switched on the Config page", but the /play start panel has its own Combat select for one run.
- evidence: `packages/content/src/decisions.ts:218`; `apps/web/src/play/StartPanel.tsx` Combat select.
- suggested fix: "...changes nothing unless you choose Exchanges on the Play start panel (one run) or on the Config page (every new run)."
- source: web-fetch
- issue: #89
- fixed: (this commit)

### [x] [MED] /decisions — row 17 still says the engine uses steps of 5
- pass: 15 (commit 255362f)
- viewport: desktop
- category: comprehension
- observation: The reading says "Current engine: steps grow by 5 (level 2 at 5, 3 at 15, 4 at 30, 5 at 50)", while its own Setting line shows `firstStep = 3; stepIncrease = 3`, which Spec v2 8.5 makes the default. The heading quotes the Spec v1 rule text.
- evidence: `docs/DECISIONS.md:33-37` (generated from `OPEN-QUESTIONS.md` row 17); `packages/content/data/config.default.json:58-59`; Spec v2 8.5.
- suggested fix: Quote Spec v2 8.5 in the heading and say the engine plays steps of 3; keep only what is still open (whether the step stays a playtest option).
- source: web-fetch
- issue: #88
- fixed: (this commit)

### [x] [MED] /decisions — decided row 60 gives the old Gather amounts
- pass: 15 (commit 255362f)
- viewport: desktop
- category: comprehension
- observation: Row 60 says "Forage 1, Excavate 3, Quarry 5 (starter Gather 2)" and "Forage now gathers less than the starter card". The cards the engine plays, and Spec v2 Table 8, use Haul 3, Forage 2, Excavate 4, Quarry 6. A tester reading the row expects the wrong amounts.
- evidence: `docs/DECISIONS.md:121`; `packages/content/data/cards.json` Gather values for Haul, Forage, Excavate, Quarry; Spec v2 Table 8.
- suggested fix: Mark row 60 as replaced by Spec v2 and state the current amounts.
- source: web-fetch
- issue: #88
- fixed: (this commit)

### [x] [MED] /config — "Rolls per exchange" names the old Combat and the wrong step
- pass: 15 (commit 255362f)
- viewport: desktop
- category: voice
- observation: The roll limit is labelled "Rolls per exchange" with help "in one combat exchange" and cites "7.8 step 4". Engagements are the default and the only Combat in Spec v2; the 3-roll limit is 7.8 step 3.
- evidence: `packages/content/data/config.meta.json:83-85`; `spec/01-spec-v2-rules.md:164` (7.8 step 3 "The maximum is 3 rolls.").
- suggested fix: Label "Rolls per engagement", help "The most times a player rolls dice in one engagement.", rule "7.8 step 3".
- source: web-fetch
- issue: #87
- addressed: iterate (this commit); the /config field now reads "Rolls per engagement", help "The most times a player rolls dice in one engagement.", rule 7.8 step 3; a configMeta test pins the label and rule.

### [x] [MED] /config — two help texts call the Spec v1 option "the written rule"
- pass: 15 (commit 255362f)
- viewport: desktop
- category: comprehension
- observation: "Move cost next to an enemy" says "2: the written rule (6.9)", and "Skills you do not keep" labels Supply "(written rules)". Spec v2 6.9 sets no surcharge (cost 1) and 11.7 sends unkept Skills to the draft pool, so the defaults are now the written rules and the alternatives are the old ones.
- evidence: `packages/content/data/config.meta.json:103` and `:279-282`; `spec/01-spec-v2-rules.md` 6.9, 11.7.
- suggested fix: "1 (default): the written rule (6.9). 2: the older rule, for playtests." and "Your pool (default, written rules)" / "Back to the supply (older rule)".
- source: web-fetch
- issue: #86
- addressed: iterate (7dfe010); "Move cost next to an enemy" now reads "1 (default): no extra cost, as in the written rules. 2: the older rule, kept for playtests."; "Skills you do not keep" options read "Your pool (default, written rules)" and "Back to the supply (older rule)", and its help calls Supply the older rule; configMetaText tests pin both.

### [x] [HIGH] / and /play — Exchanges is called "the Combat in the written rules"; Spec v2 deletes it
- pass: 15 (commit 255362f)
- viewport: desktop
- category: comprehension
- observation: The home page says "Or choose Exchanges, the Combat in the written rules, on the start panel" and links the rules; the /play start-panel hint for Exchanges begins "The Combat in the written rules." Spec v2 (6.10) deletes the skirmish and makes Engage the only way to attack, so the linked rules now describe engagements only. The text sends players to the wrong mode as the rules mode.
- evidence: `apps/web/src/home/HomePage.tsx:38-39`; `apps/web/src/play/StartPanel.tsx:25`; `spec/01-spec-v2-rules.md` 6.10 "Deleted in Spec v2: the skirmish."
- suggested fix: Call Exchanges the older Combat kept for playtests (as the /config help does), and drop the "written rules" link from it; if a rules link stays, put it on the Engagements text.
- source: web-fetch
- issue: #85
- addressed: iterate (f0ad808); / says "This is the Combat in the written rules." after the Engagements text and calls Exchanges "the older Combat kept for playtests"; the /play hint for Exchanges starts "The older Combat, kept for playtests."; HomePage and new StartPanel tests pin both.

### [x] [HIGH] / and /config — Exchanges text says every adjacent enemy attacks; the default is only enemies that target you
- pass: 12 (commit c34753b)
- viewport: desktop
- category: comprehension
- observation: The home page and /config describe Exchanges as "then every enemy next to you attacks". The default `combat.adjacentAttack` is `"target-only"`, and /decisions row 56 says an enemy attacks only its target. A player who picks Exchanges gets other behaviour than the text promises.
- evidence: `packages/content/src/ruleText.ts:81` returns the sentence as a fixed string and does not read `combat.adjacentAttack` (`config.default.json:116`); /config "Which adjacent enemies attack" default "Only enemies that target the player".
- suggested fix: Build the sentence in `ruleText` from `combat.adjacentAttack` ("then each enemy next to you that targets you attacks" for `target-only`), with a test per option.
- source: browser
- addressed: phase 33 (rule text II); `combatText` reads `combat.adjacentAttack`: "then each enemy next to you that targets you attacks" by default, and /config shows it as the live line under Which adjacent enemies attack.

### [x] [MED] /config — the Combat model help says each enemy rolls one die back; elites roll 2
- pass: 12 (commit c34753b)
- viewport: desktop
- category: comprehension
- observation: The Engagements help says "each enemy next to you rolls a die back". The same page (elite enemy dice) and the home page say an elite rolls 2 dice.
- evidence: `packages/content/data/config.meta.json:129` (hand-written help, not from `ruleText`).
- suggested fix: Take the dice counts from config through `ruleText`: "each grunt next to you rolls 1 die back, each elite rolls 2".
- source: browser
- addressed: phase 33; the Combat model help no longer counts enemy dice, and its live line reads "1 enemy die for each grunt and 2 dice for each elite" from config.

### [x] [MED] /config — the enemy target order lists Player first, while the rest of the site says enemies go for the nearest structure
- pass: 12 (commit c34753b)
- viewport: desktop
- category: comprehension
- observation: "Enemy target order: 1. Player, 2. Tower, 3. Barricade, 4. Base" reads as a contradiction of "enemies go for the nearest structure first" on /. The rule that reconciles them (Player pull distance) is in a separate field further down.
- evidence: /config "Which equally near target an enemy picks first"; "Player pull distance: Enemies head for the nearest structure; they turn to a player only when the player is at least this many hexes nearer."
- suggested fix: Add to the target-order help: "Only breaks ties between equally near targets; see Player pull distance."
- source: browser
- addressed: phase 33; target-order help reads "Only breaks ties between equally near targets, top to bottom; see Player pull distance", and `targetOrderText` gives both fields one live line.

### [x] [MED] / and /play — "Combat ends when every hand and deck is empty" does not say how a kept hand empties
- pass: 12 (commit c34753b)
- viewport: desktop
- category: comprehension
- observation: The text says unplayed cards stay in hand and that Combat ends only when every hand and deck is empty. A new player cannot tell whether they must play or discard every card. "Every card must be played" is off by default, so discarding is allowed but never named.
- evidence: `packages/content/src/ruleText.ts:96`; `apps/web/src/play/EngagementModal.tsx:486`.
- suggested fix: In `ruleText`: "Play or discard each card. Cards stay in your hand between engagements; Combat ends when every hand and deck is empty." Read the discard part from the ruling.
- source: browser
- addressed: phase 33; `combatEndText` reads `rulings.mandatoryPlays`: "Play or discard each card. Cards you do not play yet stay in your hand between engagements ..." on /, /play (engagement result, step line) and /config.

### [x] [LOW] /config — help texts start with "Row N:", which means nothing to a visitor
- pass: 12 (commit c34753b)
- viewport: desktop
- category: voice
- observation: Eight help texts open with a spreadsheet row number ("Row 65:", "Row 17:", "Row 63:" ...). The page never says what a row is.
- evidence: `packages/content/data/config.meta.json:109,119,200,206,220,230,237,243,248,258`.
- suggested fix: Drop the "Row N:" prefixes, or replace them with a link to the matching /decisions entry ("open question 65").
- source: browser
- addressed: phase 33; no help starts with "Row N:" (the open question stays in the rules note), and a content test fails on row, phase, or design-draft names in /config text.

### [x] [LOW] /config — pick lists show internal ids next to names; presets show only ids
- pass: 6 (commit e9a9406)
- viewport: n/a (web-fetch)
- category: voice
- observation: The Skill and card pick lists show each option as "Name (id)". Deck presets are listed by bare id, e.g. "preset-2".
- evidence: `apps/web/src/config/ConfigPage.tsx:101` ```${name} (${id})` ``; `ConfigPage.tsx:81` `presets.map((p) => [p.id, p.id])`.
- suggested fix: Show only the name in options; label presets "Preset 1", "Preset 2".
- source: web-fetch
- addressed: phase 31 (player names); pick lists show names only, presets read "Preset N: 10 cards, hand of 5".

### [x] [LOW] tooling — pulse prints "last pass NaNd ago" and always 0 audit rows
- pass: discovery 1 (2026-10-10, bee25b5)
- viewport: n/a
- category: tooling
- observation: `node scripts/pulse.mjs` prints "critique 16 pending, last pass NaNd ago" and "audit 0 pending".
- evidence: `scripts/pulse.mjs:105` appends `T00:00:00Z` to the whole header value ("2026-10-10 at commit 8402ba3"); `pulse.mjs:42` counts rows under `## Pending`, which `plan/AUDIT.md` does not have.
- suggested fix: Take only the leading `YYYY-MM-DD` before building the date; count AUDIT's scored findings from its real sections. The larger loop-visibility work is the candidate "Loop telemetry".
- source: discovery
- addressed: phase 26 (loop telemetry); pulse parses the leading date or the header's commit time, and counts AUDIT's latest-pass open rows and needs-user-call rows.

### [x] [LOW] /play — the Skill draft does not say unkept Skills go to the pool
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: comprehension
- observation: With the new draft pool, Skills not kept come back in later drafts, but the dialog says only "keep 1 Skill" and the "(from your pool)" tag gets no explanation. The rule shows only afterwards, as a log line.
- evidence: `apps/web/src/play/DecisionDialog.tsx:31`, `:59`; `apps/web/src/play/describeEvent.ts:210`
- suggested fix: Add a muted line under the title: "The Skills you do not keep go to your pool. Later drafts offer them again."
- source: web-fetch
- issue: #70
- fixed: (this commit)

### [x] [LOW] /play and /config — copy says "the designer's playtest Combat", "designer 2026-10-09", and "Combat v3"
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: voice
- observation: The start panel hint calls the default model "The designer's playtest Combat" and never says "Engagements", while the select next to it does. Several /config help lines carry build notes ("default, designer 2026-10-09") and one group is labelled with the internal version "Combat v3 numbers".
- evidence: `apps/web/src/play/StartPanel.tsx:17`; `packages/content/data/config.meta.json:103`, `:127`, `:135`
- suggested fix: Start the hint with "Engagements: play Engage ..."; shorten the help notes to "(default)"; rename the group "Engagement numbers".
- source: web-fetch
- issue: #69
- fixed: (this commit) — the start hint opens "Engagements: play Engage ..."; the /config help notes say "(default)" with no build dates; the group is "Engagement numbers".

### [x] [LOW] /play — the engagement log ends with "The exchange ends."
- pass: 11 (commit 8402ba3)
- viewport: desktop
- category: voice
- observation: The engagement result's full log prints the Exchanges word for the end of an engagement, now the default model.
- evidence: `apps/web/src/play/describeEvent.ts:143-144`, shown in the engagement result log
- suggested fix: Print "The engagement ends." when the exchange was an engagement.
- source: web-fetch
- issue: #68
- fixed: (this commit) — the log reads the engine's rule tag: an engagement ends with "The engagement ends.", an exchange still with "The exchange ends."

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

