# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

> Bias: external-critique MED (set via oversight 2026-10-11)

# Site audit — 2026-11-12 (pass 325, cloud tick)

Pass 324 made the changes list name a choice field's option, not its stored key (4672694). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 46 ran at cf41877, 9 commits ago, about 19 hours) and so is the expand gate (pass 31 ran 12 commits ago, under 48 hours). Every build plan phase is shipped or blocked. Every Pending critique row edits a `[needs-user-call]` /decisions item and waits for /oversight. So this pass audits afresh: the same "Playing with N changes from the standard rules" list prints every changed list field as "changed" ("Enemy die faces: changed", "Survive to rounds: changed", "Enemy target order: changed", "Starter Skills: changed"), so a playtest on a saved config cannot say which faces, rounds, order or Skills it plays, while /config shows them. Scored 3.2 (comprehension: impact 4, ease 8). `shortValue` now lists a list of words or numbers in order, each word by its /config phrase (option phrase, Skill or card name, or the capitalised key): "Enemy die faces: Hit, Hit, Hit, Miss, Miss, Special". Lists of records (Sundial days, deck presets) still read "changed". A ConfigChanges test pins three list fields. Next in line: the next tick audits afresh or waits for the critique gate.

## Top 5 findings (scored)

### [x] [3.2] /play and /config: the changes list shows a changed list field as "changed"
- category: comprehension
- impact: 4
- ease: 8
- next: `shortValue` lists words and numbers by their /config phrase, pinned in `ConfigChanges.test.tsx`
- issue: #383
- fixed: (this commit)

# Site audit — 2026-11-12 (pass 324, cloud tick)

Pass 323 gave the /config Event Calendar fields their rule line (a9f8ddc). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 46 ran at cf41877, 8 commits ago, about 18 hours) and so is the expand gate (pass 31 ran 11 commits ago, under 48 hours). Every build plan phase is shipped or blocked. Every Pending critique row edits a `[needs-user-call]` /decisions item and waits for /oversight. So this pass audits afresh: the "Playing with N changes from the standard rules" list on the /play start panel and on /config prints a changed choice field by its stored key ("Event Calendar: threat-dice", "Shop timing: prepare-only", "Combat model: exchange"), while the /config drop-down for the same field reads "Threat dice (experiment)", "Only in the Prepare phase", "Exchanges (older rule)". Scored 3.6 (comprehension: impact 4, ease 9). `shortValue` now takes the field's option phrases from config meta and the list passes them, so it reads "Event Calendar: Threat dice (experiment)"; a ConfigChanges test pins two fields. Next in line: the next tick audits afresh or waits for the critique gate.

## Top 5 findings (scored)

### [x] [3.6] /play and /config: the changes list prints a choice field's stored key
- category: comprehension
- impact: 4
- ease: 9
- next: give `shortValue` the option phrases from config meta, pinned in `ConfigChanges.test.tsx`
- issue: #382
- fixed: (this commit)

# Site audit — 2026-11-12 (pass 323, cloud tick)

Pass 322 gave the /config Countryside and Core tiles fields their rule line (176207c). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 46 ran at cf41877, 7 commits ago, same day) and so is the expand gate (pass 31 ran 10 commits ago, under 48 hours). Every build plan phase is shipped or blocked. Every Pending critique row edits a `[needs-user-call]` /decisions item and waits for /oversight. So this pass audits afresh: the 11 Event Calendar fields are the last live /config settings with no rule line. Their help says "this many" without the draft's values, the Sundial lap counts rounds apart from the ring length, and nothing says a Sundial, Threat dice or Notoriety field does nothing while another system is chosen. Scored 3.2 (comprehension: impact 4, ease 8). New `calendarText` builds each system's line from config, as `sundialDay`, `threatDiceDay`, `notorietyDay` and `applyBoons` play it (default Threat dice: "Threat dice: 1 die in round 1, and 1 more every 3 rounds. The faces are Calm, Raid, Raid, Raid, Elite and Boon." then what a Respite gives); `respiteText` gives the Respite fields' line; `ruleLineFor` maps every `calendar.*` field and adds "Not in play: the Event Calendar is Off." when the field's system is not chosen. A ruleText test pins the four systems, singular values, the mapping and the not-in-play note. Next in line: no live /config field lacks a rule line; the next tick audits afresh or waits for the critique gate.

## Top 5 findings (scored)

### [x] [3.2] /config: the Event Calendar fields show no rule line
- category: comprehension
- impact: 4
- ease: 8
- next: `calendarText` and `respiteText` from config, mapped in `ruleLineFor`, pinned in `ruleText.test.ts`
- issue: #381
- fixed: (this commit)

# Site audit — 2026-11-12 (pass 322, cloud tick)

Pass 321 made the /config Event Calendar help say what Respite and Harvest do (1b5f4b3). No issues are open for triage. The critique gate is closed (pass 46 ran at cf41877, 6 commits ago, same day) and so is the expand gate (pass 31 ran 9 commits ago, under 48 hours). Every build plan phase is shipped or blocked. Every Pending critique row edits a `[needs-user-call]` /decisions item and waits for /oversight. So this pass audits afresh and takes the last /config fields on the pass 308 list with no rule line: Countryside tiles and Core tiles. Their help ("Countryside tiles in the game.", range 1 to 10) reads as a free setting, while `createGame` builds the tile deck from the tile set and `configRefs` reports any other count as an error. Scored 3.6 (comprehension: impact 4, ease 9). New `tileDeckText` reads the counts from content: "The map starts with the Base tile alone. The tile deck is the 3 countryside tiles, shuffled, on top of the 5 core tiles, shuffled. These numbers must match the tile set on the Tile sheet.", as Spec v2 2.2, 4.1 and 4.3 and `createGame` play it. `ruleLineFor` maps both fields to it; a ruleText test pins the default, a one-tile set and the mapping. Next in line: no /config field with a live setting lacks a rule line; the next tick audits afresh or waits for the critique gate.

## Top 5 findings (scored)

### [x] [3.6] /config: the Countryside and Core tiles fields show no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: `tileDeckText` from content, mapped in `ruleLineFor`, pinned in `ruleText.test.ts`
- issue: #380
- fixed: (this commit)

# Site audit — 2026-11-12 (pass 321, cloud tick)

Pass 320 made the Event Calendar log line give units, plurals, capitals and the elite count (1afd780). No issues are open for triage. The critique gate is closed (pass 46 ran at cf41877, 5 commits ago, same day) and so is the expand gate (pass 31 ran 8 commits ago, under 48 hours). Every build plan phase is shipped or blocked. The pass 20/21 MED rows and the pass 25/46 /decisions LOW rows edit `[needs-user-call]` items and wait for /oversight. Top of the queue: the pass 46 LOW row, the /config Event Calendar help naming Respite and Harvest without saying what they do. Scored 3.2 (external-critique LOW: impact 4, ease 8). The `calendar.system` help now ends "Respite: each player who is not knocked out heals and the base is repaired. Harvest: every spent gathering node works again.", matching the engine's `applyBoons`; a test in `configMetaText.test.ts` pins it. Next in line: no pending critique row that a cloud tick can ship; the next tick audits afresh.

## Top 5 findings (scored)

### [x] [3.2] /config: the Event Calendar help uses Respite and Harvest without saying what they do
- category: external-critique
- impact: 4
- ease: 8
- next: add one sentence defining Respite and Harvest to the `calendar.system` help
- issue: #379
- fixed: (this commit)

# Site audit — 2026-11-12 (pass 320, cloud tick)

Pass 319 made the Build levels help name the Build numeral (7bc0336). No issues are open for triage. The critique gate is closed (pass 46 ran at cf41877, 3 commits ago, same day) and so is the expand gate (pass 31 ran 6 commits ago, under 48 hours). Every build plan phase is shipped or blocked. Top of the queue: the pass 46 MED row, reading 79's Setting line on /decisions printing "`sundial`: no config field; `notoriety`: no config field" because the flag parser read the `(experiment: ...)` note's option values as setting keys. Scored 6.3 (external-critique MED: impact 6, ease 7, x1.5 bias). `flagSettings` now drops an `(experiment ...)` note (a setting written after it, as in row 77's `miniatureLimit`, still counts); the line reads "`calendar.system` = `\"off\"`". Tests in `decisions.test.ts` pin both. Next in line: the pass 46 LOW rows (Event Calendar log line, Respite and Harvest help).

## Top 5 findings (scored)

### [x] [6.3] /decisions: reading 79's Setting line reads option values as config fields
- category: external-critique
- impact: 6
- ease: 7
- next: teach `flagSettings` to skip `(experiment: ...)` notes
- issue: #377
- fixed: (this commit)

### [ ] [3.0] /play: the Event Calendar log line drops units, plurals and capitals
- category: external-critique
- impact: 4
- ease: 7
- next: reword `calendarDay` in `describeEvent.ts`

# Site audit — 2026-11-12 (pass 319, cloud tick)

Pass 318 made the Threat die Raid help say each Raid is the whole spawn count (e744a6c). No issues are open for triage. The critique gate is closed (pass 46 ran at cf41877, 2 commits ago, same day) and so is the expand gate (pass 31 ran 5 commits ago, under 48 hours). Every build plan phase is shipped or blocked. Top of the queue: the pass 46 MED row, the /config Build levels help saying a Build card reaches "only up to its own level", read as the card level now printed on card faces (Engineer is Level 2 but carries Build I). Scored 8.1 (external-critique MED: impact 6, ease 9, x1.5 bias). The help and the `buildLevelsText` rule line now read "only up to its Build level (the numeral after Build, not the card level)"; tests in `configMetaText.test.ts` and `ruleText.test.ts` pin it. Next in line: the pass 46 MED row on reading 79's Setting line.

## Top 5 findings (scored)

### [x] [8.1] /config and /play: "up to its own level" reads as the card level
- category: external-critique
- impact: 6
- ease: 9
- next: reword the Build levels help and `buildLevelsText` to name the Build numeral
- issue: #376
- fixed: (this commit)

### [ ] [6.8] /decisions: reading 79's Setting line reads option values as config fields
- category: external-critique
- impact: 6
- ease: 7
- next: teach `decisions.ts` to skip option values, or write the flag as `calendar.system` only

# Site audit — 2026-11-12 (pass 318, cloud tick)

Pass 317 printed card levels as numbers on card faces (fa7a233). No issues are open for triage. The critique gate is closed (pass 46 ran at cf41877, 1 commit ago, same day) and so is the expand gate (pass 31 ran 4 commits ago, about 10 hours, under 48). Every build plan phase is shipped or blocked. Top of the queue: the pass 46 MED row, the /config Threat die faces help saying a Raid gives "another" enemy, while the engine makes the Raid count the whole spawn per node and adds 1 elite at each elite spawn node on any Raid day. Scored 8.1 (external-critique MED: impact 6, ease 9, x1.5 bias). The help now reads "Raid (each spawn node spawns 1 enemy per Raid, and any Raid also brings 1 elite at each elite spawn node; with no Raid, the spawn nodes spawn nothing)"; a test in `configMetaText.test.ts` pins it. Next in line: the other pass 46 MED rows (Build level wording, reading 79's Setting line).

## Top 5 findings (scored)

### [x] [8.1] /config: the Threat die Raid face says "another enemy"; each Raid is the whole spawn count
- category: external-critique
- impact: 6
- ease: 9
- next: reword `calendar.threatDice.faces` help, pinned in `configMetaText.test.ts`
- issue: #375
- fixed: (this commit)

### [ ] [8.1] /config and /play: "up to its own level" reads as the card level
- category: external-critique
- impact: 6
- ease: 9
- next: reword the Build levels help to name the Build numeral

### [ ] [6.8] /decisions: reading 79's Setting line reads option values as config fields
- category: external-critique
- impact: 6
- ease: 7
- next: teach `decisions.ts` to skip option values, or write the flag as `calendar.system` only

# Site audit — 2026-11-11 (pass 317, cloud tick)

Pass 316 capitalised Lake and Mountain on the /config Blocked enemy line (9dd75be). No issues are open for triage. The critique gate is closed (pass 45 ran 10 commits ago, same day) and so is the expand gate (pass 30 ran 18 commits ago, about 35 hours, under 48). Every build plan phase is shipped or blocked. The MED /decisions rows edit `[needs-user-call]` items and wait for /oversight. Top of the queue: the last pass 45 LOW row, card faces printing "Level II" while the /config Supplies and Milestones lines give levels as numbers. Scored 2.7 (external-critique LOW: impact 3, ease 9). New `cardLevelText` prints "Level 2" on the card face ("Starter" for level 0); Roman numerals stay on upgrade and Build names (Shop II, Build I). Tests pin the helper and a rendered card. Next in line: the pass 45 rows are drained; the remaining Pending rows wait for /oversight, so the next tick re-audits.

## Top 5 findings (scored)

### [x] [2.7] /play: card faces print "Level II" while /config gives levels as numbers
- category: external-critique
- impact: 3
- ease: 9
- next: `cardLevelText` on `CardView`, pinned in `CardView.test.tsx`
- issue: #374
- fixed: (this commit)

# Site audit — 2026-11-11 (pass 316, cloud tick)

Pass 315 gave the / Enemies line each enemy's health (aee21d7). No issues are open for triage. The critique gate is closed (pass 45 ran 5 commits ago, same day) and so is the expand gate (pass 30 ran 13 commits ago, about 32 hours, under 48). Every build plan phase is shipped or blocked. The MED /decisions rows edit `[needs-user-call]` items and wait for /oversight. Top of the queue: the pass 45 LOW row, the /config Blocked enemy line writing "lakes and mountains" in lower case while /tiles and the /play log capitalise Lake and Mountain. Scored 2.7 (external-critique LOW: impact 3, ease 9). `blockedPathText` now reads "Enemies, player figures, Barricades, Towers, Lake and Mountain hexes block an enemy."; the two ruling tests pin the new text. Next in line: the other pass 45 LOW row (Level II on card faces).

## Top 5 findings (scored)

### [x] [2.7] /config: the Blocked enemy line writes "lakes and mountains" in lower case
- category: external-critique
- impact: 3
- ease: 9
- next: "Lake and Mountain hexes" in `blockedPathText`, pinned in tests
- issue: #372
- fixed: (this commit)

# Site audit — 2026-11-11 (pass 315, cloud tick)

Pass 314 gave the Repair card option its unit and the / Combat step its repair line (9d37532). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 45 ran 4 commits ago, same day) and so is the expand gate (pass 30 ran 12 commits ago, about 32 hours, under 48). Every build plan phase is shipped or blocked. The MED /decisions rows edit `[needs-user-call]` items and wait for /oversight. Top of the queue: the pass 45 LOW row, the / Enemies line giving no enemy's health, so a reader cannot tell a grunt falls to one Strike while an elite takes several. Scored 2.7 (external-critique LOW: impact 3, ease 9). New `enemyHealthText`, built from `enemies.json`, ends the Enemies line: "A grunt has 2 health, an elite 14." Tests pin the default, a changed record, an empty list, and the / Enemies item. Next in line: the other pass 45 LOW rows (Lake and Mountain case, Level II on card faces).

## Top 5 findings (scored)

### [x] [2.7] /: the Enemies line never gives each enemy's health
- category: external-critique
- impact: 3
- ease: 9
- next: `enemyHealthText` from `enemies.json` on the / Enemies line, pinned in tests
- issue: #370
- fixed: (this commit)

# Site audit — 2026-11-11 (pass 314, cloud tick)

Pass 313 gave the / Tower clause its order after the enemy move and spawn (2ab35f5). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 45 ran 3 commits ago, same day) and so is the expand gate (pass 30 ran 11 commits ago, about 26 hours, under 48). Every build plan phase is shipped or blocked. The MED /decisions rows edit `[needs-user-call]` items and wait for /oversight. Top of the queue: the pass 45 LOW row, the starter Build card's Combat option reading "Repair 2" with no unit and no page saying what a repair heals. Scored 2.7 (external-critique LOW: impact 3, ease 9). `optionText` now prints "Repair 2 health", and the Combat step on / ends with `repairText`, built from `repair`: the base gets the health on the Base tile, anywhere else the most damaged defense on or next to your hex, never above full health. Tests pin the option text, `repairText`, and the / Combat item. Next in line: the other pass 45 LOW rows (enemy health, Lake and Mountain case, Level II on card faces).

## Top 5 findings (scored)

### [x] [2.7] /play: the Repair 2 card option does not say what it repairs
- category: external-critique
- impact: 3
- ease: 9
- next: unit on `optionText`, `repairText` on the / Combat step, pinned in tests
- issue: #368
- fixed: (this commit)

# Site audit — 2026-11-11 (pass 313, cloud tick)

Pass 312 made the / Defenses line say no enemy can enter any defense hex (22440d9). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 45 ran 2 commits ago) and so is the expand gate (pass 30 ran 10 commits ago, about 25 hours, under 48). Every build plan phase is shipped or blocked. Top of the queue: the first pass 45 LOW row, the / Defenses line saying a Tower fires "at the start of each Combat" while the Enemies line says enemies move and spawn then, with no order between them. Scored 2.7 (external-critique LOW: impact 3, ease 9). `defenseText` now reads "at each Combat, after the enemies move and spawn, it deals 2 damage to the nearest enemy within 2 hexes", as `startCombat` chains `moveEnemies`, `spawnAtNodes`, `towerAttacks`; the ruleText test pins the default and a changed defense. Next in line: the other pass 45 LOW rows (Repair 2, enemy health, Lake and Mountain case, Level II on card faces).

## Top 5 findings (scored)

### [x] [2.7] /: the Tower attack and the enemy move have no stated order
- category: external-critique
- impact: 3
- ease: 9
- next: name the order in `defenseText`, pinned in `ruleText.test.ts`
- issue: #367
- fixed: (this commit)

# Site audit — 2026-11-11 (pass 312, cloud tick)

Pass 311 gave the /config Copies of each card and Skill fields their rule line (551d569), and critique pass 45 filed 6 rows (c0e2e32). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 45 ran 1 commit ago) and so is the expand gate (pass 30 ran 9 commits ago, under 48 hours). Every build plan phase is shipped or blocked. Top of the queue: the MED critique row from pass 45, the / Defenses line saying only a Barricade stops enemies while `enemyCanEnter` keeps every enemy off every defense hex. Scored 8.1 (external-critique MED: impact 6, ease 9, x1.5 bias). `defenseText` drops the `blocksEnemies` clause and adds one sentence after the defense list: "No enemy can enter a hex with a defense on it." A ruleText test pins the default, a changed config, an empty defense list, and a defense with `blocksEnemies` false. Next in line: the pass 45 LOW rows (Tower attack order, Repair 2, enemy health, Lake and Mountain case, Level II on card faces).

## Top 5 findings (scored)

### [x] [8.1] /: the Defenses line says only a Barricade stops enemies
- category: external-critique
- impact: 6
- ease: 9
- next: one sentence for every defense in `defenseText`, pinned in `ruleText.test.ts`
- issue: #366
- fixed: (this commit)

# Site audit — 2026-11-11 (pass 311, cloud tick)

Pass 310 gave the /config Defenses on gathering nodes field its rule line (d446740). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 10 commits ago, a few minutes under 24 hours) and so is the expand gate (pass 30 ran 7 commits ago). Every build plan phase is shipped or blocked. The Pending critique rows all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the /config Copies of each card and Copies of each Skill fields, which show no rule line. Scored 2.7 (comprehension: impact 3, ease 9). New `suppliesText` reads from config and content: "The Shop offers cards from a supply of 2 copies of each level 1 to 3 card (28 cards), and the Training Ground draft offers Skills from a supply of 1 copy of each level 1 to 3 Skill (14 Skills). Each draws from the highest level opened, or from a lower level when that one runs out.", as `buildSupplies` and `drawLevel` play it. Both fields map to it; a ruleText test pins the default and a changed config. Next in line: the Countryside and Core tiles fields.

## Top 5 findings (scored)

### [x] [2.7] /config: the Copies of each card and Copies of each Skill fields show no rule line
- category: comprehension
- impact: 3
- ease: 9
- next: add `suppliesText` and map the `supplies` group to it in `ruleLineFor`
- issue: #365
- fixed: (this commit)

# Site audit — 2026-11-11 (pass 310, cloud tick)

Pass 309 gave the /config Build levels field its rule line (99e0b5e). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 9 commits ago, a few minutes under 24 hours) and so is the expand gate (pass 30 ran 6 commits ago). Every build plan phase is shipped or blocked. The Pending critique rows all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the next /config field with no rule line, Defenses on gathering nodes (`rulings.buildOnNode`, row 14). Scored 2.7 (comprehension: impact 3, ease 9). New `buildOnNodeText` reads from config: ticked (the default), "A defense is built on your hex or a hex next to it, one per hex. It may stand on a gathering node hex, and the node still works for Gather."; not ticked, the second sentence reads "It may not stand on a gathering node hex.", as `canBuildOn` plays it. A ruleText test pins both. Next in line: the Copies of each card and Copies of each Skill fields, and Countryside and Core tiles.

## Top 5 findings (scored)

### [x] [2.7] /config: the Defenses on gathering nodes field shows no rule line
- category: comprehension
- impact: 3
- ease: 9
- next: add `buildOnNodeText` and map `rulings.buildOnNode` to it in `ruleLineFor`
- issue: #364
- fixed: d446740

# Site audit — 2026-11-11 (pass 309, cloud tick)

Pass 308 gave the /debug intro its Copy replay sentence (55b76cf). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 8 commits ago, under 24 hours) and so is the expand gate (pass 30 ran 4 commits ago). Every build plan phase is shipped or blocked. The Pending critique rows all edit `[needs-user-call]` items, which /oversight owns. Checked this pass: which /config fields `ruleLineFor` answers. 14 of the 67 fields have no rule line; 7 are retired or unused, and of the 7 left the Build levels field matters most, since it decides why "Buy 3 base upgrades" and "Fire Arcane Rain" are out of reach (row 78). Scored 3.6 (comprehension: impact 4, ease 9). New `buildLevelsText` reads from config: levelled (the default), "A Build card buys a base upgrade or builds a defense only up to its own level: Build I buys tier I. Build cards can buy only Shop I and Training I.", the second sentence from `upgradesReachNote`; any tier, "A Build card buys the next tier of an upgrade track and builds any defense, whatever its level.". A ruleText test pins both. Next in line: the Defenses on gathering nodes, Copies of each card and Skill, and Countryside and Core tiles fields, which also show no rule line.

## Top 5 findings (scored)

### [x] [3.6] /config: the Build levels field shows no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: add `buildLevelsText` and map `rulings.buildLevels` to it in `ruleLineFor`
- issue: #363
- fixed: 99e0b5e

# Site audit — 2026-11-11 (pass 308, cloud tick)

Pass 307 gave the /debug intro its Bot step and Autoplay sentences (7a870b6). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 7 commits ago, under 24 hours) and so is the expand gate (pass 30 ran 3 commits ago). Every build plan phase is shipped or blocked. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 44 LOW row on /debug, where "Copy replay" copies the seed and every action as JSON but the page does not say what the copy is for, and no page loads it back. Scored 2.7 (comprehension: impact 3, ease 9). The intro now ends "Copy replay copies the seed and every action, to paste into a bug report."; the debug e2e intro test pins it. Next in line: no LOW rows remain outside the /oversight-owned /decisions items, so the next tick likely waits for the critique gate or hands to /expand.

## Top 5 findings (scored)

### [x] [2.7] /debug: Copy replay does not say what the copied replay is for
- category: external-critique
- impact: 3
- ease: 9
- next: add the Copy replay sentence to the intro
- issue: #362
- fixed: 55b76cf

# Site audit — 2026-11-10 (pass 307, cloud tick)

Pass 306 capitalised the /credits enemy die faces (00f4b35). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 6 commits ago, today) and so is the expand gate (pass 30 ran 2 commits ago). Every build plan phase is shipped or blocked. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 44 LOW row on /debug, where the intro explains the log tags but not Bot step or Autoplay, and the actions heading says "Legal actions". Scored 2.7 (voice: impact 3, ease 9). The intro now says "Bot step lets the bot choose the next action. Autoplay lets the bot play up to 5000 actions, usually to the end of the run.", reading the number from AUTOPLAY_LIMIT, and the heading reads "Actions you can take (n)". A debug e2e test pins both; the a11y focus test follows the new heading. Next in line: the /debug "Copy replay" row.

## Top 5 findings (scored)

### [x] [2.7] /debug: the intro does not explain Bot step or Autoplay
- category: external-critique
- impact: 3
- ease: 9
- next: add the Bot step and Autoplay sentences to the intro; rename the actions heading
- issue: #361
- fixed: 7a870b6

# Site audit — 2026-11-10 (pass 306, cloud tick)

Pass 305 gave the /credits Fonts and Software links their own text (5242a2e). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 5 commits ago, today) and so is the expand gate (pass 30 ran 2 commits ago). Every build plan phase is shipped or blocked. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 44 LOW row on /credits, where the enemy die faces read "hit", "miss" and "special" while the action faces on the same page and the rules, /play, /config and the home page write Hit, Miss and Special. Scored 1.8 (voice: impact 2, ease 9). The three ASSETS.md rows now read "Enemy die face: Hit (claw marks)", "Enemy die face: Miss (empty)" and "Enemy die face: Special (skull)"; a CreditsPage test pins the capitals. Next in line: the two /debug intro rows.

## Top 5 findings (scored)

### [x] [1.8] /credits: the enemy die face names are lower case
- category: external-critique
- impact: 2
- ease: 9
- next: capitalise Hit, Miss and Special in the three ASSETS.md rows
- issue: #360
- fixed: 00f4b35

# Site audit — 2026-11-10 (pass 305, cloud tick)

Pass 304 gave the home page Also line its glosses (935724e), and expand pass 30 (d1664ac) filed no candidates. No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 4 commits ago, today) and the expand gate too (pass 30 ran 1 commit ago). Every build plan phase is shipped or blocked. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 44 LOW row on /credits, where three Software links read "MIT" and two Fonts links read "SIL OFL 1.1", so a screen-reader links list cannot tell them apart. Scored 2.8 (a11y: impact 4, ease 7). Each font and library name now links to its source (a new Source column in the ASSETS.md fonts table; a role and source on each SOFTWARE entry), and each license link reads "<name> license (<license>)". A CreditsPage test pins the roles, the source links and that no Fonts or Software link name repeats. Font designers are not named yet. Next in line: the enemy face case row, then the /debug intro rows.

## Top 5 findings (scored)

### [x] [2.8] /credits: the Software and Fonts links repeat the same link text
- category: external-critique
- impact: 4
- ease: 7
- next: link names to sources, give libraries a role, make license link text unique
- issue: #359
- fixed: 5242a2e

# Site audit — 2026-11-10 (pass 304, cloud tick)

Pass 303 gave the home page knockout line the free base hex and the 1-round delay (6aacbc9). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 2 commits ago) and so is the expand gate (pass 29 ran 19 commits ago, about 43 hours). Every build plan phase is shipped or blocked. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 44 LOW row on /, where the closing "Also:" line said what only the Decisions page is for. Scored 2.7 (comprehension: impact 3, ease 9). The line now glosses the Tile sheet (every map tile, hex by hex), the Config page (change a rule for your next runs) and Credits (every asset and its license), from their route descriptions; a HomePage test pins the three glosses. Next in line: the /credits link text and enemy face case rows, then the /debug intro rows.

## Top 5 findings (scored)

### [x] [2.7] /: the closing Also line glosses only the Decisions page
- category: external-critique
- impact: 3
- ease: 9
- next: add a short gloss after the Tile sheet, Config and Credits links
- issue: #358
- fixed: 6aacbc9

# Site audit — 2026-11-10 (pass 303, cloud tick)

Pass 302 gave the /config Forced reveal every field its line (ea2b332), and critique pass 44 (25c7d0c) filed 6 findings. No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 44 ran 1 commit ago) and so is the expand gate (pass 29 ran 18 commits ago, under 48 hours). Every build plan phase is shipped or blocked. The top row is the pass 44 MED finding: the knockout line on the home page and the /play start panel says a knocked-out player comes back next round, but not where, or that a full base keeps them out 1 more round (Spec v2 14.4). Scored 5.4 (external-critique MED: impact 4, ease 9, x1.5 bias). `knockoutText` now reads "A player at 0 health is knocked out and comes back at the start of the next round on a free base hex, with half of their maximum health, rounded up. If no base hex is free, they stay out 1 more round." then the losses, as `returnKnockedOut` and `freeFigurePlaces` play it (a free base hex has no enemy and room under the figure limit). The ruleText and HomePage tests pin it; the playtest kit was regenerated.

## Top 5 findings (scored)

### [x] [5.4] /: the knockout line does not say where a player comes back, or that a full base delays it
- category: external-critique
- impact: 4
- ease: 9
- next: extend `knockoutText` with the round start, the free base hex and the 1-round delay
- issue: #357
- fixed: (this commit)

# Site audit — 2026-11-10 (pass 302, cloud tick)

Pass 301 gave the /config Blocked enemy field its line (ed35cf9). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 43 ran 10 commits ago, just under 24 hours) and so is the expand gate (pass 29 ran 16 commits ago, about 40 hours). Every build plan phase is shipped or blocked. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. So this pass takes the next field on the pass 284 list: Forced reveal every shows no line, so a playtester who turns it on sees no line saying when a tile is revealed without a step. Scored 3.6 (comprehension: impact 4, ease 9). The new `forcedRevealText` (Spec v2 6.7, row 63) reads "A tile is revealed only when a player steps off the edge of the map." while it is off (the default); set to N it reads "At round end, if no tile was revealed in the last N rounds and the tile deck is not empty, the top tile is revealed in the open slot nearest the base.", as `forcedRevealDue` and `forcedReveal` play it. `ruleLineFor` maps `clock.forcedRevealEvery` to it; a ruleText test pins off, 3 and 1. Still without a line: the supply copies, the tile counts, Defenses on gathering nodes and Build levels.

## Top 5 findings (scored)

### [x] [3.6] /config: the Forced reveal every field shows no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: add `forcedRevealText` and map `clock.forcedRevealEvery` to it in `ruleLineFor`
- issue: #356
- fixed: (this commit)

# Site audit — 2026-11-10 (pass 301, cloud tick)

Pass 300 gave the /config Figures per hex field its line (63b5033). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 43 ran 9 commits ago, about 22 hours) and so is the expand gate (pass 29 ran 15 commits ago, about 39 hours). Every build plan phase is shipped or blocked. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. So this pass takes the next field on the pass 284 list: Blocked enemy shows no line, so a playtester who changes it is not told what blocks an enemy or what a blocked enemy does. Scored 3.6 (comprehension: impact 4, ease 9). The new `blockedPathText` (Spec v2 9.7, rows 2, 39) reads "Enemies, player figures, Barricades, Towers, lakes and mountains block an enemy. If every path to its target is blocked, the enemy moves toward the next nearest target; if no path reaches any target, it does not move." from config; in wait mode the enemy "waits where it is", as `chooseRoute` and `pathNextTo` play it. `ruleLineFor` maps `rulings.blockedPathRule` to it; a ruleText test pins both modes. Still without a line: the supply copies, the tile counts, Forced reveal, Defenses on gathering nodes and Build levels.

## Top 5 findings (scored)

### [x] [3.6] /config: the Blocked enemy field shows no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: add `blockedPathText` and map `rulings.blockedPathRule` to it in `ruleLineFor`
- issue: #355
- fixed: (this commit)

# Site audit — 2026-11-10 (pass 300, cloud tick)

Pass 299 gave the /config Smallest deck and Bought cards fields their line (b0a3361). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 43 ran 8 commits ago, about 22 hours) and so is the expand gate (pass 29 ran 14 commits ago, about 38 hours). Every build plan phase is shipped or blocked. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. So this pass takes the next field on the pass 284 list: Figures per hex shows no line, so a playtester who changes it is not told that the limit holds on the base too, that a figure cannot move into a full hex, or that a knocked-out player with no free base hex stays out. Scored 3.6 (comprehension: impact 4, ease 9). The new `figuresPerHexText` (Spec v2 3.8, 4.6, 14.4, row 16) reads "A hex holds at most 1 player figure, on the base too: you cannot move into a hex where another figure stands, and a knocked-out player who finds no free base hex stays out until the next round start." from config, as `blockedByFigure` and `returnKnockedOut` play it; `ruleLineFor` maps `rulings.figuresPerHex` to it; a ruleText test pins it at 1 and 2. Still without a line: the supply copies, the tile counts, Blocked enemy, Forced reveal, Defenses on gathering nodes and Build levels.

## Top 5 findings (scored)

### [x] [3.6] /config: the Figures per hex field shows no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: add `figuresPerHexText` and map `rulings.figuresPerHex` to it in `ruleLineFor`
- issue: #354
- fixed: (this commit)

# Site audit — 2026-11-10 (pass 299, cloud tick)

Pass 298 gave the /tiles lede the reveal line (64cb599). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 43 ran 7 commits ago, under 24 hours) and so is the expand gate (pass 29 ran 13 commits ago, about 37 hours). Every build plan phase is shipped or blocked. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. So this pass goes back to the pass 284 list of /config fields `ruleLineFor` still gives no line, and takes Smallest deck with Bought cards, which only together say when a starter card leaves. Scored 3.6 (comprehension: impact 4, ease 9). The new `boughtCardsText` (Spec v2 13.1, 18.1, row 44) reads "A card you buy goes to your discard pile and adds to your deck; no starter card leaves it." from config; in replace-starter mode it reads "then, if you have more than 10 cards, you return a starter card from your deck or discard pile and it leaves the game.", as `returnableStarters` plays it. `ruleLineFor` maps `deck.minimumSize` and `options.boughtCards` to it; a ruleText test pins both modes. Still without a line: the supply copies, the tile counts, Figures per hex, Blocked enemy, Forced reveal, Defenses on gathering nodes and Build levels.

## Top 5 findings (scored)

### [x] [3.6] /config: the Smallest deck and Bought cards fields show no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: add `boughtCardsText` and map `deck.minimumSize` and `options.boughtCards` to it in `ruleLineFor`
- issue: #353
- fixed: (this commit)

# Site audit — 2026-11-10 (pass 298, cloud tick)

Pass 297 labelled the /play undo tick box "Allow undo" (87e4658). No issues are open for triage. The critique gate is closed (pass 43 ran 6 commits ago, under 24 hours) and so is the expand gate (pass 29 ran 13 commits ago, under 48 hours). Every build plan phase is shipped or blocked. This pass takes the last open pass 43 row: the /tiles lede says tiles are "drawn" but not when a tile joins the map. Scored 3.6 (impact 3, ease 8; comprehension, no bias). The lede now prints `revealText` from content after the draw order: "Step off the edge of the map to reveal a new tile; the step costs N movement." A TileSheet test pins the line and its cost from config. The remaining Pending critique rows are /decisions items that edit `[needs-user-call]` AUDIT items, which wait for /oversight.

## Top 5 findings (scored)

### [x] [3.6] /tiles: the lede says tiles are "drawn", but not when a tile joins the map (critique pass 43)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: add the reveal rule line after the lede, from the rule text
- issue: #352
- fixed: (this commit)

# Site audit — 2026-11-09 (pass 297, cloud tick)

Pass 296 gave Shop offers and card faces the "currency" unit (805b259). No issues are open for triage. The critique gate is closed (pass 43 ran 5 commits ago) and so is the expand gate (pass 29 ran 12 commits ago, under 48 hours). Every build plan phase is shipped or blocked. This pass takes the next pass 43 LOW row: the /play footer labels the undo tick box "Developer: allow undo", beside Sound and 3D dice. Undo shipped as a player option in phase 13 and shows in production, unlike the real dev tools (`import.meta.env.DEV` only). Scored 4.0 (impact 3, ease 8; comprehension, no bias). The tick box now reads "Allow undo". The polish e2e pins the label and that ticking it shows "Undo last decision". Next in line: the /tiles reveal line (LOW).

## Top 5 findings (scored)

### [x] [4.0] /play: the footer shows a "Developer: allow undo" tick box beside the player options (critique pass 43)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: label it "Allow undo"
- issue: #351
- fixed: (this commit)

### [ ] [3.6] /tiles: the lede says tiles are "drawn", but not when a tile joins the map (critique pass 43)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: add the reveal rule line after the lede, from the rule text

# Site audit — 2026-11-09 (pass 296, cloud tick)

Pass 295 gave the /play player panel each player's Skills list (d2fa477). No issues are open for triage. The critique gate is closed (pass 43 ran 4 commits ago) and so is the expand gate (pass 29 ran 10 commits ago, under 48 hours). Every build plan phase is shipped or blocked. Every pass 43 MED row has shipped, so this pass takes the top LOW row: Shop offers and card faces print "Cost 3" with no unit, next to upgrade prices that say "materials". Scored 4.5 (impact 3, ease 9; voice, no bias). `cardPriceText` in `CardView.tsx` (Table 8, card supplies cost in currency) now prints "Cost 3 currency" on Shop offers and card faces. A CardView test and a BasePanel test pin it. Next in line: the developer undo tick box in the /play footer (LOW), then the /tiles reveal line (LOW).

## Top 5 findings (scored)

### [x] [4.5] /play: Shop offers and card faces show "Cost 3" with no unit (critique pass 43)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: show "Cost 3 currency" on Shop offers and card faces
- issue: #350
- fixed: (this commit)

### [ ] [4.0] /play: the footer shows a "Developer: allow undo" tick box beside the player options (critique pass 43)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: label it "Allow undo" or move it to the dev tools

# Site audit — 2026-11-09 (pass 295, cloud tick)

Pass 294 gave the /play start panel the round line (2ab93b8). No issues are open for triage. The critique gate is closed (pass 43 ran 3 commits ago) and so is the expand gate (pass 29 ran 8 commits ago, under 48 hours). Every build plan phase is shipped or blocked. This pass takes the last pass 43 MED row: under Engagements Combat the player cannot see their Skills or ranges before choosing where to engage. Scored 7.2 (impact 6, ease 8, x1.5 bias). The player panel now lists each player's Skills read-only under their tracks (name, the faces it needs, `skillText` with its range from content), in every phase and for every seat. Two PlayerPanel tests pin the list solo and in co-op. Next in line: the pass 43 LOW rows (Shop "Cost" unit, the developer undo tick box).

## Top 5 findings (scored)

### [x] [7.2] /play: no Skills or ranges in view before engaging (critique pass 43)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: list the player's Skills read-only in the player panel
- issue: #349
- fixed: (this commit)

# Site audit — 2026-11-09 (pass 294, cloud tick)

Pass 293 gave the /play start panel and the home page the enemy-move line (e915510). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 43 ran 2 commits ago) and so is the expand gate (pass 29 ran 8 commits ago, under 48 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). This pass takes the next pass 43 MED row: /play says when Combat ends but never when Prepare ends. Scored 8.1 (impact 6, ease 9, x1.5 bias). The start panel intro now reads the goal, then `roundText` (Spec v2 5.1, 5.3, 16.4, 16.8) from config, then the knockout line; with 2 or more players allowed it also says how players share one screen. A StartPanel test pins the round line under the default config and under a solo-only config (no shared-screen sentence), and the a11y e2e pins the intro order. Next in line: the Skills list in the player panel (MED), then the pass 43 LOW rows.

## Top 5 findings (scored)

### [x] [8.1] /play: the start panel never says when Prepare ends (critique pass 43)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: add the `roundText` round line to the start panel
- issue: #348
- fixed: (this commit)

### [ ] [5.4] /play: the player cannot see their Skills or ranges before engaging (critique pass 43)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: read-only Skill list in the player panel in Prepare and Combat

### [ ] [4.5] /play: Shop offers and card faces show "Cost 3" with no unit (critique pass 43)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: show "Cost 3 currency" on Shop offers and card faces

# Site audit — 2026-11-09 (pass 293, cloud tick)

Pass 292 gave the /config Move cost next to an enemy field its line (add46fe), and critique pass 43 filed 6 rows (b44072d). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 43 ran 1 commit ago) and so is the expand gate (pass 29 ran 7 commits ago, under 48 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The new pass 43 MED rows are actionable from cloud; the bias (external-critique MED, x1.5) puts them on top. This pass takes the enemy-move row: no page a player reads before a run says that enemies move at each Combat, or how far. Scored 8.1 (impact 6, ease 9, x1.5). The /play start panel's Combat hint and the home page Enemies item now add `enemyMoveText` (Spec v2 7.5) from config, the line /config already prints; both Combat choices move enemies (`advance.ts` runs `moveEnemies` for each), so the hint names it under both. Tests pin the home item and the start panel hint at 1 hex under both choices. Next in line: the pass 43 round line on the /play start panel (MED), then the Skills list in the player panel (MED).

## Top 5 findings (scored)

### [x] [8.1] /play and /: no page before a run says when and how far enemies move (critique pass 43)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: add `enemyMoveText` to the start panel Combat hint and the home Enemies item
- issue: #347
- fixed: (this commit)

### [ ] [8.1] /play: the start panel never says when Prepare ends (critique pass 43)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: add the `roundText` round line to the start panel

### [ ] [5.4] /play: the player cannot see their Skills or ranges before engaging (critique pass 43)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: read-only Skill list in the player panel in Prepare and Combat

# Site audit — 2026-11-09 (pass 292, cloud tick)

Pass 291 gave the /config Rolls per engagement field its line (fc1932a). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 42 ran 10 commits ago, just under 24 hours) and so is the expand gate (pass 29 ran 5 commits ago). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. So this pass takes the next field on the pass 284 list: Move cost next to an enemy shows no line, so a playtester who sets it to 2 is not told that no step enters an enemy's hex or that Blink ignores the extra cost. Scored 3.6 (comprehension: impact 4, ease 9). The new `moveCostText` (Spec v2 6.9, row 76) reads "You cannot move into a hex that has an enemy, and a step onto a hex next to an enemy costs 1, the same as each step." from config; above 1 it reads "costs 2 movement instead of 1; Blink ignores that cost.", naming the cards whose Move has `ignoreEnemyCost` from content, as `moveCost` plays it. `ruleLineFor` maps `combat.moveCostNextToEnemy` to it; a ruleText test pins it at 1 and 2. Still without a line: Smallest deck, the supply copies, the tile counts, Bought cards, Figures per hex, Blocked enemy, Forced reveal, Defenses on gathering nodes and Build levels.

## Top 5 findings (scored)

### [x] [3.6] /config: the Move cost next to an enemy field shows no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: add `moveCostText` and map `combat.moveCostNextToEnemy` to it in `ruleLineFor`
- issue: #346
- fixed: (this commit)

# Site audit — 2026-11-09 (pass 291, cloud tick)

Pass 290 gave the /config Enemy move field its line (fb9904e). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 42 ran 9 commits ago, about 23 hours) and so is the expand gate (pass 29 ran 4 commits ago). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. So this pass takes the next field on the pass 284 list: Rolls per engagement shows no line, so a playtester who changes it is not told that the first roll counts, that you keep dice between rolls, or that the enemy dice and a card's Reroll sit outside the limit. Scored 3.6 (comprehension: impact 4, ease 9). The new `rollsText` (Spec v2 7.8 steps 2, 3 and 6) reads "In an engagement you roll all your dice, then keep the dice you want and roll the others again, up to 3 rolls in all. The enemy dice roll only once, and a card's Reroll does not count as a roll." from config, the count `rollsUsed` keeps (the first roll is 1), and `ruleLineFor` maps `combat.maxRolls` to it; a ruleText test pins it at 3, 2 and 1. Still without a line: Move cost next to an enemy, Smallest deck, the supply copies, the tile counts, Bought cards, Figures per hex, Blocked enemy, Forced reveal, Defenses on gathering nodes and Build levels.

## Top 5 findings (scored)

### [x] [3.6] /config: the Rolls per engagement field shows no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: add `rollsText` and map `combat.maxRolls` to it in `ruleLineFor`
- issue: #345
- fixed: (this commit)

# Site audit — 2026-11-09 (pass 290, cloud tick)

Pass 289 gave the /config spawn fields one verb and made the Spawn range help read in order (c7b5f85). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 42 ran 8 commits ago, about 21 hours) and so is the expand gate (pass 29 ran 3 commits ago). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. So this pass goes back to the pass 284 list of /config fields `ruleLineFor` still gives no line, and takes the next one: the Enemy move field never says when enemies move, in which order, or where they stop. Scored 3.6 (comprehension: impact 4, ease 9). The new `enemyMoveText` (Spec v2 7.5) reads "At each Combat, before the spawn nodes spawn, each enemy, oldest first, moves up to 2 hexes toward its target and stops next to it." from config, the same order `moveEnemies` and `startCombat` play, and `ruleLineFor` maps `combat.enemyMoveHexes` to it plus `targetOrderText`; a ruleText test pins it at 2 and at 1 hex. Still without a line: Rolls per engagement, Move cost next to an enemy, Smallest deck, the supply copies, the tile counts, Bought cards, Figures per hex, Blocked enemy, Forced reveal, Defenses on gathering nodes and Build levels.

## Top 5 findings (scored)

### [x] [3.6] /config: the Enemy move field shows no rule line
- category: comprehension
- impact: 4
- ease: 9
- next: add `enemyMoveText` and map `combat.enemyMoveHexes` to it plus `targetOrderText` in `ruleLineFor`
- issue: #344
- fixed: (this commit)

# Site audit — 2026-11-09 (pass 289, cloud tick)

Pass 288 named the highest open level Skill supply in the Skills revealed help (74c1915). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 42 ran 7 commits ago, about 21 hours) and so is the expand gate (pass 29 ran 2 commits ago). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The Pending MED critique rows edit `[needs-user-call]` items, which /oversight owns. The last open pass 42 row is the [LOW] Spawn pressure wording: New tile waits says "add enemies at every Combat" while the other spawn fields say "gets 1 grunt at each Combat", and the Spawn range help puts its list between subject and verb. Scored 3.6 (external-critique LOW: impact 4, ease 9). `spawnText` now reads "Each new tile's spawn nodes get enemies at each Combat." (Spec v2 7.3, row 66); the Spawn range help reads "A spawn node spawns only when a player figure, a Barricade, a Tower or the base is within this many hexes." and `siteText` names the same list (row 70, `nodeInRange`); the /debug reveal line and the playtest protocol follow. Next in line: the /oversight-owned /decisions rows; no other open critique row is actionable from cloud.

## Top 5 findings (scored)

### [x] [3.6] /config: the Spawn pressure fields use three verbs, and the Spawn range help is hard to parse (critique pass 42)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "get enemies at each Combat" in `spawnText`; rewrite the `spawn.nodeRange` help; name the same list in `siteText`
- issue: #343
- fixed: (this commit)

# Site audit — 2026-11-09 (pass 288, cloud tick)

Pass 287 gave the /config Base fields a base line (23e3a42), and expand pass 29 filed 1 candidate (48c4f73). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 42 ran 6 commits ago, about 19 hours) and so is the expand gate (pass 29 just ran). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The Pending MED critique rows edit `[needs-user-call]` items, which /oversight owns. The two open pass 42 [LOW] /config rows tie at 3.6 (external-critique LOW: impact 4, ease 9); the cheaper one wins: the Skills revealed help says "from the top of the supply", but there is one Skill supply for each level. The help now reads "New Skills each player looks at in a draft, from the top of the highest open level Skill supply." (Spec v2 11.6), which is the supply `draft.ts` draws from. Next in line: the pass 42 [LOW] Spawn pressure wording row.

## Top 5 findings (scored)

### [x] [3.6] /config: the Skills revealed help does not say which Skill supply (critique pass 42)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: name the highest open level Skill supply in the `draft.reveal` help
- issue: #342
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 287, cloud tick)

Pass 286 made the enemy die line say the enemy dice hit you (8cb7ef3). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 42 ran 4 commits ago) and so is the expand gate (pass 28 ran 19 commits ago, about 36 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The Pending MED critique rows edit `[needs-user-call]` items, which /oversight owns. The top open row is pass 42's [LOW]: the Starting base health field shows the whole Defenses line, and Health per upgrade shows none. Scored 3.6 (external-critique LOW: impact 4, ease 9). The new `baseText` (Spec v2 8.2, 11.3) reads "The base starts with 20 health. Each base upgrade adds 5 to its maximum health and to its health." from config, and `ruleLineFor` maps both Base fields to it; ruleText tests pin both at default and changed values. Next in line: the two other pass 42 [LOW] /config rows.

## Top 5 findings (scored)

### [x] [3.6] /config: the Base fields show the whole Defenses line, or none (critique pass 42)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: add `baseText` and map `base.startingHealth` and `base.healthPerUpgrade` to it in `ruleLineFor`
- issue: #341
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 286, cloud tick)

Pass 285 named the seat scaling and the spawn ramp in the /config spawn fields' line (2612c69). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 42 ran 3 commits ago) and so is the expand gate (pass 28 ran 18 commits ago, about 30 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The Pending MED critique rows edit `[needs-user-call]` items, which /oversight owns. The top open row is pass 42's [LOW]: the enemy die line says a Miss does no damage, then "every enemy die hits you at once". Scored 3.6 (external-critique LOW: impact 4, ease 9). `enemyHitText` now uses the rules' words, "the enemy dice hit you at once" (Spec v2 7.8 step 7); the playtest protocol is regenerated. Next in line: the three other pass 42 [LOW] /config rows.

## Top 5 findings (scored)

### [x] [3.6] /config: the enemy die line says a Miss does no damage, then that every die hits (critique pass 42)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: use the rules' words in `enemyHitText`
- issue: #340
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 285, cloud tick)

Pass 284 gave the /config enemy die fields their line (23d4b52); critique pass 42 filed 6 rows and its home Combat row shipped (42279ab). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 42 ran 2 commits ago) and so is the expand gate (pass 28 ran 17 commits ago, about 34 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The top Pending critique row is pass 42's [MED]: with the spawn ramp or seat scaling on, `siteText` drops the count and says "gets grunts at each Combat", so the /config spawn fields' line says less than the help. Scored 6.3 (external-critique MED: impact 6, ease 7, bias 1.5). `siteText` now reads `spawnCount`'s two terms: "gets 1 grunt for each 2 seats, rounded up, at each Combat" and ", and 1 more for every N rounds after round 1" (or "each round" at 1); ruleText tests pin ramp, seats and both. Next in line: the four pass 42 [LOW] /config rows, then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [6.3] /config: the spawn fields' rule line says only "grunts" with the ramp or seat scaling on (critique pass 42)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: name the seat scaling and the ramp in `siteText`
- issue: #339
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 284, cloud tick)

Pass 283 gave the /config spawn ramp, seats, range and maximum level fields their rule line (71630e8). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 ran 10 commits ago, just under 24 hours) and so is the expand gate (pass 28 ran 14 commits ago, about 28 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass listed every /config field `ruleLineFor` still gives no line. No existing phrase reads the rest, so this pass added one for the closest group: Enemy die faces and Special damage show no line, and the Hit damage field's line (`enemyHitText`) never names the damage it sets. Scored 3.6 (comprehension: impact 4, ease 9). The new `enemyDieText` (Spec v2 Table 4) reads "An enemy die has 2 Hit faces, 3 Miss faces and 1 Special face. A Hit deals 1 damage, a Special 2, a Miss none." from config, and `ruleLineFor` maps the three fields to it plus `enemyHitText`; ruleText tests pin it at default and changed values. Still without a line: Rolls per engagement, Enemy move, Move cost next to an enemy, Health per upgrade, Smallest deck, the supply copies, the tile counts, Bought cards, Figures per hex, Blocked enemy, Forced reveal, Defenses on gathering nodes and Build levels (each needs a new phrase), plus the unused and retired fields. The critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.6] /config: Enemy die faces, Hit damage and Special damage show no die line (audit)
- category: content-gaps (comprehension)
- impact: 4
- ease: 9
- next: add `enemyDieText` (Table 4) and map `combat.engage.enemyDie`, `hitDamage`, `specialDamage` to it plus `enemyHitText` in `ruleLineFor`
- issue: #337
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 283, cloud tick)

Pass 282 gave the /config start and base health fields their rule line (3d0184d). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 ran 9 commits ago, about 23 hours) and so is the expand gate (pass 28 ran 13 commits ago, about 27 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass went on down the list of /config fields `ruleLineFor` gives no line. Four more are fields an existing phrase already reads: Spawn ramp every, Spawns scale with seats and Spawn range (the tile sheet's spawn node phrase, `siteText`), and Maximum level (`levelText`, "The level stops at N."). A playtester who changes one of them sees no "With these values" line. Scored 3.6 (comprehension: impact 4, ease 9). `ruleLineFor` now maps the three spawn fields to "A spawn node ...; an elite spawn node ..." built from `siteText`, and `options.maxLevel` to `levelText`; ruleText tests pin each. Next in line: the /oversight-owned /decisions rows. The critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.6] /config: Spawn ramp every, Spawns scale with seats, Spawn range and Maximum level show no rule line (audit)
- category: content-gaps (comprehension)
- impact: 4
- ease: 9
- next: map `spawn.rampEvery`, `spawn.perSeat`, `spawn.nodeRange` to a spawn node line from `siteText`, and `options.maxLevel` to `levelText`, in `ruleLineFor`
- issue: #336
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 282, cloud tick)

Pass 281 gave the /config Skills revealed, Shop and Co-op order fields their rule line (bff296e). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 ran 8 commits ago, about 22 hours) and so is the expand gate (pass 28 ran 12 commits ago, about 26 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass went on from pass 281's list of /config fields that `ruleLineFor` gives no line. Five more are fields the home page lines already read: Maximum health, Starting dice, Starter Skills and Deck and hand preset (`startText`), and Starting base health (`defenseText`). A playtester who changes one of them sees no "With these values" line. Scored 3.6 (comprehension: impact 4, ease 9). `ruleLineFor` now maps the four start fields to `startText` and `base.startingHealth` to `defenseText`. ruleText tests pin each, and the "others get none" check now uses Copies of each card. Next in line: the /oversight-owned /decisions rows. The critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.6] /config: Maximum health, Starting dice, Starter Skills, Deck preset and Starting base health show no rule line (audit)
- category: content-gaps (comprehension)
- impact: 4
- ease: 9
- next: map `player.maxHealth`, `player.startingDice`, `player.starterSkills`, `deck.preset` to `startText` and `base.startingHealth` to `defenseText` in `ruleLineFor`
- issue: #335
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 281, cloud tick)

Pass 280 reworded the /config draft cadence help and gave it a rule line (b8e6e1b). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 ran 7 commits ago, about 21 hours) and so is the expand gate (pass 28 ran 11 commits ago, about 25 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass listed every /config field `ruleLineFor` gives no line, and found four the home page lines already read: Skills revealed (`trainingText`), Shop offers and Shop timing (`shopText`), and Co-op Prepare order (`roundText`). A playtester who changes one sees no "With these values" line, while Draft every N rounds, beside Skills revealed, shows one. Scored 3.6 (comprehension: impact 4, ease 9). `ruleLineFor` now maps the four fields to those lines, and ruleText tests pin each. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.6] /config: Skills revealed, Shop offers, Shop timing and Co-op Prepare order show no rule line (audit)
- category: content-gaps (comprehension)
- impact: 4
- ease: 9
- next: map `draft.reveal`, `shop.offers`, `rulings.shopTiming` and `rulings.coopPrepareOrder` in `ruleLineFor`
- issue: #334
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 280, cloud tick)

Pass 279 named the player in the /play Skill draft opening and skip log lines (56ff19b). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 ran 6 commits ago, about 20 hours) and so is the expand gate (pass 28 ran 10 commits ago, about 24 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top finding, from critique pass 41: the /config "Draft every N rounds" help reads "at 2, in rounds 2, 4 and 6", as if drafts stop at round 6, and the field has no "With these values" line. Scored 3.6 (critique LOW comprehension: impact 4, ease 9). The help now reads "With the Training Ground open, a draft happens every N rounds. At 2: rounds 2, 4, 6 and so on.", and `ruleLineFor` prints `trainingText` for `draft.everyNRounds`, so the line follows the draft's value. Next in line: the remaining Pending critique rows edit durable `[needs-user-call]` items and wait for /oversight; the next tick audits afresh.

## Top 5 findings (scored)

### [x] [3.6] /config: the "Draft every N rounds" help example reads as if drafts stop at round 6 (critique LOW, pass 41)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: reword the `draft.everyNRounds` help ("At 2: rounds 2, 4, 6 and so on.") and add a `ruleLineFor` branch printing `trainingText`
- issue: #333
- fixed: (this commit)

# Site audit — 2026-11-08 (pass 279, cloud tick)

Pass 278 numbered the /play event log newest-highest and noted hidden lines (1ac7823). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 ran 5 commits ago, about 19 hours) and so is the expand gate (pass 28 ran 9 commits ago, about 23 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The pending /decisions MED rows edit durable `[needs-user-call]` items and wait for /oversight. Top finding, from critique pass 41: the /play Skill draft opening and skip log lines have no subject, while the lines beside them name the player. Scored 3.6 (critique LOW voice: impact 4, ease 9). The lines now read "Player 2's Skill draft: <a> or <b>." and "No Skills left for Player 2 to draft." in co-op, and "Your Skill draft: ..." and "No Skills left for you to draft." solo; `draftLog.test.ts` pins both. Next in line: the pass 41 LOW draft cadence help row.

## Top 5 findings (scored)

### [x] [3.6] /play: the Skill draft opening and skip log lines do not name the player (critique LOW, pass 41)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "Player 2's Skill draft: ..." and "No Skills left for Player 2 to draft." in `describeEvent.ts` (solo: "Your Skill draft: ...")
- issue: #332
- fixed: (this commit)

### [ ] [3.6] /config: the "Draft every N rounds" help example reads as if drafts stop at round 6 (critique LOW, pass 41)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: reword the `draft.everyNRounds` help ("At 2: rounds 2, 4, 6 and so on.") and add a `ruleLineFor` branch printing `trainingText`

# Site audit — 2026-11-08 (pass 278, cloud tick)

Pass 277 named the seat in the co-op /play draft and starter-return dialogs (0b6ec28). No issues are open for triage (#223 waits for the user; #330 is this loop's own mirror). The critique gate is closed (pass 41 ran 4 commits ago, about 18 hours) and so is the expand gate (pass 28 ran 8 commits ago, about 18 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top finding, from critique pass 41: the /play event log shows the 60 newest lines in a plain `<ol>`, says nothing about older lines, and a screen reader numbers the newest line 1. Rescored 3.6 (critique LOW a11y: impact 4, since every long run passes 60 lines and the numbering misleads every screen-reader user, ease 9); it ties the draft log subjects row and wins the tie-break as the row already mirrored to a public issue (#330). The log `<ol>` is now `reversed`, and past 60 lines a muted line under the heading reads "Showing the 60 newest of N lines."; component tests pin the attribute, the note at 75 lines and no note at 60. Next in line: the pass 41 LOW rows (the draft log subjects, the draft cadence help).

## Top 5 findings (scored)

### [x] [3.6] /play: the event log hides lines past 60 without saying so, and numbers the newest line 1 (critique LOW, pass 41)
- category: external-critique (a11y)
- impact: 4
- ease: 9
- next: `reversed` on the log `<ol>`, and a muted "Showing the 60 newest of N lines" past 60
- issue: #330
- fixed: (this commit)

### [ ] [3.6] /play: the Skill draft opening and skip log lines do not name the player (critique LOW, pass 41)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "Player 2's Skill draft: ..." and "No Skills left for Player 2 to draft." in `describeEvent.ts` (solo: "Your Skill draft: ...")

# Site audit — 2026-11-07 (pass 277, cloud tick)

Pass 276 stated the full-slots rule on the /config Draft Skill slots line (bbddbbd). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 ran 3 commits ago) and so is the expand gate (pass 28 ran 7 commits ago, about 11 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top finding, from critique pass 41: in co-op the /play draft, replace and starter-return dialogs name the seat ("Player 2") above the title, but the title and help lines say "you" and "your". Scored 3.6 (critique LOW voice: impact 4, ease 9). `draftPoolText`, `replaceSkillText`, `returnStarterText` and `draftFullText` take an optional seat name; the dialog passes it in co-op, so the lines read "The Skills Player 2 does not keep go to Player 2's pool.", "The Skill Player 2 replaces goes to the bottom of its supply.", "Player 2 bought a card, so a starter card leaves Player 2's deck for good." and "Player 2's 6 draft slots are full: ...". Solo, /config, / and the playtest kit keep "you". Next in line: the pass 41 LOW rows (the draft log subjects, the log cap, already mirrored as #330, and the draft cadence help).

## Top 5 findings (scored)

### [x] [3.6] /play: in co-op the draft and starter-return help says "you" under a dialog that names the seat (critique LOW, pass 41)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: pass the seat name to `draftPoolText`, `returnStarterText`, `replaceSkillText` and `draftFullText`
- issue: #331
- fixed: (this commit)

### [ ] [2.7] /play: the event log hides lines past 60 without saying so, and numbers the newest line 1 (critique LOW, pass 41)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: `reversed` on the log `<ol>`, and a muted "Showing the 60 newest of N lines" past 60
- issue: #330

# Site audit — 2026-11-07 (pass 276, cloud tick)

Pass 275 reworded the / Skills line for the draft pool (d92b945). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 ran 2 commits ago) and so is the expand gate (pass 28 ran 6 commits ago, about 4 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top finding, from critique pass 41: the /config Draft Skill slots line read "Your 6 draft slots are full: the new Skill replaces a Skill.", a game moment that does not say only drafted Skills are replaced or where the old one goes (11.9). Scored 8.1 (critique MED: impact 6, ease 9, bias x1.5). A new `draftSlotsText` states the rule for the Draft Skill slots and Draft with full slots fields: "With all 6 draft slots full, a newly kept Skill replaces one of your drafted Skills, which goes to the bottom of its supply." (skip: "a player has no Skill draft"; 0 slots: "no player drafts a Skill"). The /play replace dialog adds "The Skill you replace goes to the bottom of its supply." Next in line: the pass 41 LOW rows (co-op seat voice in the draft help, draft log subjects, log cap, draft cadence help).

## Top 5 findings (scored)

### [x] [8.1] /config: the Draft Skill slots line states a game moment and does not say which Skill is replaced or where it goes (critique MED, pass 41, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: `draftSlotsText` in `ruleLineFor`; replace help line in the /play dialog
- issue: #329
- fixed: (this commit)

### [ ] [3.6] /play: in co-op the draft and starter-return help says "you" under a dialog that names the seat (critique LOW, pass 41)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: pass the seat name to `draftPoolText`, `returnStarterText` and `replaceSkillText`

# Site audit — 2026-11-07 (pass 275, cloud tick)

Pass 274 added the /decisions inline markdown unit test (8e8b4a3), and critique pass 41 filed 6 findings (290d32f). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 41 just ran) and so is the expand gate (pass 28 ran 5 commits ago, about 3 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top finding, from critique pass 41: the / Skills line says each player looks at 2 Skills, but under the default pool rule (11.6) every later draft also offers that player's pool, and the /config "Skills revealed" help has the same gap. Scored 9.0 (critique MED: impact 6, ease 10, bias x1.5, capped). `trainingText` now says "looks at 2 new Skills plus their own pool" under the pool rule and keeps "looks at 2 Skills" under the supply rule; the "Skills revealed" help says "New Skills each player looks at in a draft, from the top of the supply." Next in line: the pass 41 MED Draft Skill slots line, then the pass 41 LOW rows.

## Top 5 findings (scored)

### [x] [9.0] /: the Skills line says a draft shows 2 Skills, but later drafts add the pool (critique MED, pass 41, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 10
- next: reword `trainingText` and the "Skills revealed" help
- issue: #328
- fixed: (this commit)

### [ ] [8.1] /config: the Draft Skill slots line states a game moment and does not say which Skill is replaced or where it goes (critique MED, pass 41, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: write the rule in `ruleLineFor` and add "it goes to the bottom of its supply" to the /play dialog

# Site audit — 2026-11-07 (pass 274, cloud tick)

Pass 273 added the /play event log component test (b5e5475). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 40 ran 10 commits ago, about 22 hours) and so is the expand gate (pass 28 ran 3 commits ago, about 3 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). This pass looked again for web modules with no test: `decisions/Inline.tsx` renders the inline markdown on /decisions (bold, code, repository file links, row links) and is only checked through `DecisionsPage.test.tsx` against the live `OPEN-QUESTIONS.md`, so a reading edit can drop the case a check relied on. Scored 2.7 (tests: impact 3, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. A new unit test uses fixed strings: bold and code, a repository path linked and a bare file name left plain, "row N" in-page or to the full table, each number after "rows" in list and range forms, and no link for "Row N", a number inside a word, or a row inside bold or code. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [2.7] /decisions inline markdown: no unit test of its own (tests)
- category: tests
- impact: 3
- ease: 9
- next: add `decisions/Inline.test.tsx`
- issue: #327
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-07 (pass 273, cloud tick)

Pass 272 labelled the Engine console Skill draft option "Keep <Skill>" (bfbd11e). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 40 ran 9 commits ago, about 19 hours) and so is the expand gate (pass 28 ran 2 commits ago, about 2 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). This pass looked again for web modules with no test: `play/PlayLog.tsx` draws the /play event log, and only its `logRuleNote` helper is tested. A change that showed the oldest line first, dropped the 60-line cap, or lost the rule note after a line would go unnoticed outside the e2e tests. Scored 2.7 (tests: impact 3, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. A new component test checks the labelled region and heading, the newest line first with its rule note, only the 60 newest lines in a long run, and "not in the written rules" for a tag with no section. Checked this pass: /decisions links every lower-case "row N" and "rows N, M and K" in the rendered readings and checks; the capitalised "Row N" in `OPEN-QUESTIONS.md` and `plan/AUDIT.md` sits in prose the page does not render. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [2.7] /play event log: no component test for order, cap and rule notes (tests)
- category: tests
- impact: 3
- ease: 9
- next: add `play/PlayLog.test.tsx`
- issue: #326
- fixed: b5e5475

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-07 (pass 272, cloud tick)

Pass 271 handed to `/expand` (pass 28, 4961141). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 40 ran 8 commits ago, about 18 hours) and so is the expand gate (pass 28 ran 0 commits ago, about 1 hour); a second expand pass with nothing moved would be churn. Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top: the Engine console still labels a Skill draft option "Draft <Skill>" and its state row "Draft", while /play (b0967f1) and the shared event log say "keep". Pass 271's "no Draft <Skill> left" check did not cover the Engine console's `describeAction`. Scored 1.8 (voice: impact 2, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. The action now reads "Keep <Skill>" and the state row "Skill draft"; a describeAction test pins the label. Next in line: the /oversight-owned /decisions rows; the next tick hands to /critique or /expand as their gates open.

## Top 5 findings (scored)

### [x] [1.8] Engine console: the Skill draft option says "Draft <Skill>", not "Keep" (voice)
- category: voice
- impact: 2
- ease: 9
- next: label the action "Keep <Skill>" and the state row "Skill draft"
- issue: #325
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-07 (pass 271, cloud tick)

Pass 270's /config Skills help labels shipped (7ec021c). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 40 ran 7 commits ago, about 17 hours) and so is the expand gate (pass 27 ran 9 commits ago, about 22 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every critique pass 40 row has shipped. No finding the loop can ship scores 3.0 or more, so there is no actionable iterate work. Handed to `/expand` (pass 28, bold posture). The five /decisions critique rows (three MED at 8.1 with the bias, two LOW) all edit `[needs-user-call]` items and wait for /oversight. Checked this pass: no "Draft <Skill>" button or "drafts" log string is left in non-test `apps/web/src` or `packages/content/src` after b0967f1; the Shop offer and Return a starter card texts no longer reach the Exchanges bottom half under the default Combat (92c6634).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-07 (pass 270, cloud tick)

Pass 269 said "keep" on the /play Skill draft buttons and log (b0967f1). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 40 ran 6 commits ago, about 16 hours) and so is the expand gate (pass 27 ran 8 commits ago, about 22 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top: the /config "Skills you do not keep" help writes "Your pool (default):" and "Back to the supply:" while the list says "Your pool (default, written rules)" and "Back to the supply (older rule)". Scored 2.4 (critique LOW: impact 2, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. The help now opens each choice with its exact list label, and the configMetaText 11.7 test pins both. Next in line: the /oversight-owned /decisions rows; with the critique queue otherwise drained, the next tick hands to /critique or /expand as their gates open.

## Top 5 findings (scored)

### [x] [2.4] /config: the "Skills you do not keep" help does not start each choice with its list label (external-critique LOW, pass 40)
- category: external-critique (voice)
- impact: 2
- ease: 9
- next: start each choice with its exact list label
- issue: #324
- fixed: 7ec021c

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-07 (pass 269, cloud tick)

Pass 268 named the Build card in the /tiles Base legend (da2f86d). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 40 ran 5 commits ago, about 15 hours) and so is the expand gate (pass 27 ran 8 commits ago, about 21 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top: the /play Skill draft buttons say "Draft <Skill>" and the log says "drafts" under a banner ("Choose a Skill to keep") and title ("Skill draft: keep a Skill") that say keep. Scored 2.4 (critique LOW: impact 3, ease 8). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. The buttons now read "Keep <Skill> (<faces>)" and the log "<who> keep(s) <Skill>"; a DecisionDialog test and the tenseLog test pin them, and the e2e click policies match "Keep" (not the card strip's "Keep the card"). Next in line: the /config Skills help labels row, then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [2.4] /play: the Skill draft buttons say "Draft" under a banner that says "keep" (external-critique LOW, pass 40)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: label the buttons "Keep <name> (<faces>)"
- issue: #323
- fixed: (this commit)

### [ ] [2.4] /config: the "Skills you do not keep" help does not start each choice with its list label (external-critique LOW, pass 40)
- category: external-critique (voice)
- impact: 2
- ease: 9
- next: start each choice with its exact list label

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-07 (pass 268, cloud tick)

Pass 267 added "with no enemy on it" to the Gather texts (b96be5c). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 40 ran 4 commits ago, about 16 hours) and so is the expand gate (pass 27 ran 6 commits ago, about 20 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top: the /tiles Base legend says "stand on the Base tile to buy upgrades" and never names the Build card, while / and the /play Base panel say a Build card and its materials buy an upgrade. Scored 2.7 (critique LOW: impact 3, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. The legend now reads "stand on the Base tile and play a Build card to buy upgrades, and buy cards once Shop I is built"; the ruleText and TileView tests pin it. Next in line: the pass 40 LOW rows (Skill draft "Keep" buttons, /config Skills help labels), then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [2.7] /tiles: the Base legend does not say a Build card is needed to buy upgrades (external-critique LOW, pass 40)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: "stand on the Base tile and play a Build card to buy upgrades"
- issue: #322
- fixed: (this commit)

### [ ] [2.4] /play: the Skill draft buttons say "Draft" under a banner that says "keep" (external-critique LOW, pass 40)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: label the buttons "Keep <name> (<faces>)"

### [ ] [2.4] /config: the "Skills you do not keep" help does not start each choice with its list label (external-critique LOW, pass 40)
- category: external-critique (voice)
- impact: 2
- ease: 9
- next: start each choice with its exact list label

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-07 (pass 267, cloud tick)

Passes since 266 fixed the two pass 40 MED rows on /play (Shop offers print the default Combat half, 92c6634; the Build banner says no upgrade is in reach, cd95418). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 40 ran 3 commits ago, about 13 hours) and so is the expand gate (pass 27 ran 5 commits ago, about 19 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Four pass 40 LOW rows can ship without /oversight. Top: the Gather card, the /tiles node legend and the / Materials line never say an enemy on the hex blocks a Gather (rule 6.9), so a player learns it only from the log after the card is spent. Scored 3.2 (critique LOW: impact 4, a wasted card; ease 8). Each text now says "with no enemy on it" in every reading (node rule, off-node amount, anywhere), and a ruleText test checks all three readings. Next in line: the pass 40 LOW rows (/tiles Base legend Build card, Skill draft "Keep" buttons, /config Skills help labels), then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.2] /play: the Gather texts never say an enemy on the hex blocks it (external-critique LOW, pass 40)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: add "with no enemy on it" to the card text, the node legend and the Materials line
- issue: #321
- fixed: (this commit)

### [ ] [2.7] /tiles: the Base legend does not say a Build card is needed to buy upgrades (external-critique LOW, pass 40)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: "stand on the Base tile and play a Build card to buy upgrades"

### [ ] [2.4] /play: the Skill draft buttons say "Draft" under a banner that says "keep" (external-critique LOW, pass 40)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: label the buttons "Keep <name> (<faces>)"

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-06 (pass 266, cloud tick)

Pass 265 tested the /play board damage number (7ac55c4). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 39 ran 9 commits ago, about 23 hours) and so is the expand gate (pass 27 ran 1 commit ago). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass looked again for web modules with no test: `play/NextStepBanner.tsx` draws the line at the top of /play and holds the only buttons for stop moving, stop building, and a Tower's target. Only e2e tests read its text. A change that sent the wrong action from a button, showed a map move as a button, named a Tower target by its engine id, or lost the combat colour would go unnoticed. Scored 2.7 (tests: impact 3, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. A new component test checks the phase and step text with no buttons during setup, a stop-moving button that sends exactly that action (and no button for the map move), and a Tower target button that names the enemy and its health but no engine id, with the banner in its combat colour. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours, and the expand gate after 20 commits or 48 hours.

## Top 5 findings (scored)

### [x] [2.7] /play: the next-step banner buttons have no component test (tests)
- category: tests
- impact: 3
- ease: 9
- next: a `NextStepBanner` component test for the step text, the actions its buttons send, Tower target labels, and the combat colour
- issue: #317
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-06 (pass 265, cloud tick)

Pass 264 renamed the /decisions proposal buttons to name the Play page (a109944). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 39 ran 7 commits ago, about 18 hours) and so is the expand gate (pass 26 ran 18 commits ago, about 43 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass looked again for web modules with no test: `play/damageFloats.ts` builds the damage number that floats off an enemy on the /play board after a target pick, and only the engagement e2e test sees one float. A change that dropped the defeated flag (the token that fades out with the number), placed a float at the wrong hex, or drew one for an enemy the state does not have would go unnoticed. Scored 2.7 (tests: impact 3, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. A new unit test checks one float per `enemyDamaged` event at the enemy hex with its kind and amount, the defeated flag only on the enemy the same action defeats, and no float for a missing enemy or for other events. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours, and the expand gate after 20 commits or 48 hours.

## Top 5 findings (scored)

### [x] [2.7] /play: the board damage number has no unit test (tests)
- category: tests
- impact: 3
- ease: 9
- next: a `damageFloats` unit test for hex, kind, amount, the defeated flag, and missing enemies
- issue: #316
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-06 (pass 264, cloud tick)

Pass 263 tested that every icon name the app draws has a file (af1c087). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 39 ran 6 commits ago, about 18 hours) and so is the expand gate (pass 26 ran 18 commits ago, about 43 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass looked for page text that names a URL path where the nav names the page: each of the 6 proposals on /decisions has a button labelled "Try this on /play". The /config save message had the same problem and now says "the Play page" (#103). Scored 2.7 (voice: impact 3, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. The button now reads "Try this on the Play page"; a DecisionsPage test checks that no button on the page names a path, and the e2e tests click the new label. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [2.7] /decisions: proposal buttons say "Try this on /play", a URL path (voice)
- category: voice
- impact: 3
- ease: 9
- next: label the button "Try this on the Play page"; a test checks that no /decisions button names a path
- issue: #315
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-06 (pass 263, cloud tick)

Pass 262 named the player count in the /play description (00806c6). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 39 ran 5 commits ago, about 17 hours) and so is the expand gate (pass 26 ran 17 commits ago, about 42 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass looked for web modules with no test: `icons/gameIcons.ts` has none, and every lookup into it falls back to empty markup, so an icon name with no file draws nothing. The play map draws enemies and defenses by their content id, so a new enemy or defense in the content with no icon file would be an invisible piece on the board, and a renamed die-face file a blank die. The site-to-icon map was also written out twice, in the tile sheet and the play map. Scored 2.7 (tests: impact 3, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 rows did, because the expand gate is closed. `SITE_ICON` now lives once in `icons/gameIcons.ts`, typed over every site; a new unit test checks that every action and enemy die face, every content enemy and defense id, every site and every panel icon has a file, and that the markup keeps only the shapes. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [2.7] Icons: a missing icon name draws nothing and no test checks the names the app asks for (tests)
- category: tests
- impact: 3
- ease: 9
- next: one `SITE_ICON` in `icons/gameIcons.ts`, and a unit test that every name the app draws has a file
- issue: #314
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-06 (pass 262, cloud tick)

Pass 261 gave the / pitch the one tagline wording (0424f8d). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 39 ran 4 commits ago, about 15 hours) and so is the expand gate (pass 26 ran 16 commits ago, about 40 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The top row is the pass 39 /play description row: it says "defend the base together at one screen", while the home page says "on one screen" and /play also starts solo runs. Scored 2.4 (voice: impact 3, ease 8). It ships ahead of a hand-off to /expand, as earlier sub-3.0 critique rows did, because the expand gate is closed. The description now reads "Start a run in the browser: 1 to 4 players on one screen defend the base, build their dice and last as many rounds as they can.", with the player count from `playersText`, as the home page has it; a routes test ties the two and bars "together" and "at one screen". Next in line: the /oversight-owned /decisions rows; with no other actionable row, the next tick with the expand gate open hands to /expand.

## Top 5 findings (scored)

### [x] [2.4] /play description says "at one screen" and "together" for a page that starts solo runs (critique LOW, pass 39)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: reword the /play description to the suggested fix, player count from `playersText`
- issue: #313
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-06 (pass 261, cloud tick)

Pass 260 left /debug out of the sitemap (a245cec). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 39 ran 3 commits ago, about 14 hours) and so is the expand gate (pass 26 ran 15 commits ago, about 40 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The top row is the pass 39 tagline row: the / pitch says "Defend the base, build your dice", while the home description, the manifest, the preview-image alt and the og-card image say "Defend the base together". Scored 2.7 (voice: impact 3, ease 9). It ships ahead of a hand-off to /expand, as earlier sub-3.0 critique rows did, because the expand gate is closed. `TAGLINE` in `apps/web/src/router.tsx` is now the one wording: the pitch, the home description (which the manifest test already ties to the manifest) and the preview-image alt read it. A HomePage test ties all four to it and to the og-card script's line, and the smoke e2e test checks the served pitch. Next in line: the /play description; then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [2.7] / and the head word the tagline two ways ("together") (critique LOW, pass 39)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: one wording from one constant for the pitch and the descriptions
- issue: #312
- fixed: (this commit)

### [ ] [2.4] /play description says "at one screen" and "together" for a page that starts solo runs (critique LOW, pass 39)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: reword the /play description to the suggested fix

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-06 (pass 260, cloud tick)

Pass 259 gave iOS the manifest's home-screen label (516c4f4). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 39 ran 2 commits ago, about 14 hours) and so is the expand gate (pass 26 ran 14 commits ago, about 39 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The top row is the pass 39 sitemap row: `public/sitemap.xml` lists /debug, the engine console, which is a shell-served design tool with no content until its script runs. Scored 3.2 (seo: impact 4, ease 8). The sitemap now leaves /debug out; `SITEMAP_PATHS` in `apps/web/src/routes.tsx` names the routes it lists (every route but a shell-served tool), a unit test ties the file to it, and the smoke e2e test checks the served sitemap lists every nav page but the engine console. /play stays listed: it is a shell, but it is the game. Next in line: the pitch and descriptions word the tagline two ways; the /play description; then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.2] /sitemap.xml lists /debug, a shell-served design tool (critique LOW, pass 39)
- category: external-critique (seo)
- impact: 4
- ease: 8
- next: drop shell-served tool routes from the sitemap, with a test that it lists only prerendered routes
- issue: #311
- fixed: (this commit)

### [ ] [2.7] / and the head word the tagline two ways ("together") (critique LOW, pass 39)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: one wording from one constant for the pitch and the descriptions

### [ ] [2.4] /play description says "at one screen" and "together" for a page that starts solo runs (critique LOW, pass 39)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: reword the /play description to the suggested fix

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 259, cloud tick)

Pass 258 linked a web app manifest with home-screen icons (0bc9e92), and critique pass 39 then filed four LOW rows (330c0df). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 39 ran 1 commit ago) and so is the expand gate (pass 26 ran 13 commits ago, about 24 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Of the four new critique rows, the iOS home-screen label is the cheapest: the shell names no `apple-mobile-web-app-title`, so iOS labels a home-screen icon with the page title, which differs per page ("Play - Survival Dice-Builder"), instead of the manifest's "Dice-Builder". Scored 3.6 (seo: impact 4, every iOS home-screen add; ease 9). The shell now names `apple-mobile-web-app-title` with the manifest short_name; a unit test ties the two together, and the smoke e2e test checks the served tag. Next in line: the other pass 39 rows (the sitemap lists /debug; the pitch and descriptions word the tagline two ways; the /play description), then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.6] Every page: no apple-mobile-web-app-title, so iOS labels home-screen icons with the page title (critique LOW, pass 39)
- category: external-critique (seo)
- impact: 4
- ease: 9
- next: name `apple-mobile-web-app-title` with the manifest short_name in `apps/web/index.html`, with tests
- issue: #310
- fixed: (this commit)

### [ ] [3.2] /sitemap.xml lists /debug, a shell-served design tool (critique LOW, pass 39)
- category: external-critique (seo)
- impact: 4
- ease: 8
- next: drop shell-served tool routes from the sitemap, with a test that it lists only prerendered routes

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 258, cloud tick)

Pass 257 named the site in WebSite structured data on the home page (fcf9708). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 10 commits ago, under 24 hours) and so is the expand gate (pass 26 ran 11 commits ago, about 25 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass requested the files a browser asks for when a visitor installs a site: `/manifest.webmanifest` returns the 404 page and the shell links no manifest, so Android's "Add to Home screen" and desktop Chrome's "Install" give a page shortcut with a guessed name and icon, and the game cannot open in its own window. A one-screen hot-seat game is likely played on a tablet on the table. Scored 3.2 (seo: impact 4, every install on Android and desktop; ease 8). `apps/web/public/manifest.webmanifest` names the site, the home description, start URL /, standalone display, and the light theme colours; `scripts/touch-icon.mjs` now also renders opaque 192 and 512 icons and a maskable 512 (the die in the middle 60%), and the shell links the manifest. A unit test ties the name, description and colours to the shell, routes and tokens and checks each icon's size and opacity; the smoke e2e test checks the served link, manifest and icons. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.2] Every page: no web app manifest, so Android installs get a guessed name and icon (seo)
- category: seo
- impact: 4
- ease: 8
- next: add `apps/web/public/manifest.webmanifest` with 192, 512 and maskable 512 icons from `scripts/touch-icon.mjs`, link it from the shell, with tests
- issue: #309
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 257, cloud tick)

Pass 256 named both colour schemes and a theme-color for each (1d74198). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 9 commits ago, about 23 hours) and so is the expand gate (pass 26 ran 10 commits ago, about 24 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass looked for structured data on the served pages and found none: search engines read the site name for a result from a schema.org `WebSite` object on the home page, and without one they guess from the title or the domain. Scored 3.2 (seo: impact 4, every search result for the site; ease 8). `headTags` now writes a `WebSite` JSON-LD script (name, url, the home description) on the home page only, with `<` escaped so no text can close the script. A unit test checks the object, that no other page or the not-found page carries it, and the escaping; the smoke e2e test checks the served home page and /play. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.2] Home page: no WebSite structured data, so search results guess the site name (seo)
- category: seo
- impact: 4
- ease: 8
- next: write a `WebSite` JSON-LD script into the home page head in `apps/web/src/head.ts`, with tests
- issue: #308
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 256, cloud tick)

Pass 255 linked an opaque 180x180 home-screen icon (1276380). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 8 commits ago, about 22 hours) and so is the expand gate (pass 26 ran 9 commits ago, about 22 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass read the served head again: the site follows `prefers-color-scheme`, but only its stylesheet says so. The shell names no `color-scheme`, so a dark-mode visitor's browser paints a white canvas until the CSS arrives, and no `theme-color`, so phone browsers leave their toolbar untinted. Scored 3.6 (seo: impact 4, every dark-mode visit and every phone; ease 9). The shell now names `color-scheme: light dark` and one `theme-color` per scheme, the `--wood-table` colour the page paints around the board. A unit test ties both colours to tokens.css; the served-head e2e test allows `theme-color` twice (one per scheme) and still bars any other repeated meta tag; the smoke e2e test checks served pages carry all three tags. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.6] Every page: no color-scheme or theme-color meta, so dark mode flashes white and phone toolbars stay untinted (seo)
- category: seo
- impact: 4
- ease: 9
- next: name `color-scheme` and a `theme-color` per scheme (the `--wood-table` token) in `apps/web/index.html`, with tests
- issue: #307
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 255, cloud tick)

Pass 254 made each /config settings section a heading (80e495d). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 7 commits ago, about 19 hours) and so is the expand gate (pass 26 ran 8 commits ago, about 19 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass requested the icon files a browser or phone asks for on its own: the shell links only the SVG favicon, and `/apple-touch-icon.png` returns the 404 page, so an iOS home-screen bookmark shows a page screenshot, not the game's icon. Scored 3.2 (seo: impact 4, every phone bookmark and link share on iOS; ease 8). `scripts/touch-icon.mjs` renders the favicon on the light background to an opaque 180x180 `apps/web/public/apple-touch-icon.png`; the shell links it; a unit test checks the link, the size and that the PNG has no alpha, and the smoke e2e test checks the served file. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.2] Every page: no apple-touch-icon, so iOS home-screen bookmarks show a screenshot (seo)
- category: seo
- impact: 4
- ease: 8
- next: render the favicon to an opaque 180x180 `apps/web/public/apple-touch-icon.png` and link it from the shell, with tests
- issue: #306
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 254, cloud tick)

Pass 253 gave the hashed `/assets/` files a one-year immutable cache (e39aed3). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 6 commits ago, about 18 hours) and so is the expand gate (pass 26 ran 7 commits ago, about 19 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass re-read the live headers, fonts, chunks, titles, sitemap and 404, which are all right, and the heading outline of every prerendered page. /config is one long form of 18 settings sections, each a fieldset with a legend, but its only heading is the h1, so a screen reader user cannot jump between sections by heading. Scored 3.2 (a11y: impact 4, the longest page; ease 8). Each section legend now holds an h2 (the nested "Enemy die" group an h3), styled like the plaque; the root "Rules" group stays plain text. A unit test checks the heading levels and an e2e test checks the served headings and that each group keeps its name. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.2] /config: the 18 settings sections are not headings, so they cannot be jumped to (a11y)
- category: a11y
- impact: 4
- ease: 8
- next: put an h2 in each section legend (h3 when nested), styled like the plaque, with tests
- issue: #305
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 253, cloud tick)

Pass 252 named `twitter:card` once on every page (5c352a8). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 5 commits ago, under 5 hours) and so is the expand gate (pass 26 ran 7 commits ago, about 17 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass read the live response headers: Cloudflare Pages serves the content-hashed files under `/assets/` (page chunks, the three.js dice chunk, the CSS, the fonts) with `max-age=0, must-revalidate`, so every repeat visit asks again for each one. Scored 4.5 (perf: impact 5, every repeat visit; ease 9). `apps/web/public/_headers` gives `/assets/*` a one-year immutable cache; pages and unhashed files keep the default so a deploy shows at once. A unit test reads the file and bars a long cache on any other path. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [4.5] Every page: hashed /assets files served with max-age=0, so repeat visits refetch (perf)
- category: perf
- impact: 5
- ease: 9
- next: add `apps/web/public/_headers` with a one-year immutable cache on `/assets/*`, with a test
- issue: #304
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 252, cloud tick)

Pass 251 named a link-preview image on every page (566d865). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 4 commits ago, under 4 hours) and so is the expand gate (pass 26 ran 6 commits ago, about 17 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass read the served head of / on the live site: `apps/web/index.html` still carried its own `og:type`, `og:site_name` and `twitter:card` ("summary"), and pass 251's `headTags` adds all three again, so every page names `twitter:card` twice with different values. A preview service that reads the first one shows a small card, not the new image. Scored 4.9 (seo: impact 7, every page and the point of pass 251; ease 7). The three static tags are dropped, so `headTags` alone names them; the /play shell test now expects `summary_large_image`, and the served-head e2e test fails when any route names a meta tag twice. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [4.9] Every page: twitter:card named twice, "summary" before "summary_large_image" (seo)
- category: seo
- impact: 7
- ease: 7
- next: drop the static `og:type`, `og:site_name` and `twitter:card` from `apps/web/index.html`; e2e bars a repeated meta tag
- issue: #303
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 251, cloud tick)

Pass 250 made decided row 49 say what Spec v2 plays (4fca278). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 3 commits ago, under 3 hours) and so is the expand gate (pass 26 ran 4 commits ago, about 15 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass checked the served head of every live route: titles, descriptions, canonicals, the sitemap and the 404 are right, but no page names a link-preview image, so a shared link shows no card. Scored 3.5 (seo: impact 5, every page; ease 7). `scripts/og-card.mjs` renders one 1200x630 card in the light palette and the site fonts to `apps/web/public/og-card.png`; `headTags` names it (og:image with size and alt, og:type, og:site_name, twitter:card); a unit test checks the PNG size against the tags and an e2e test checks every served page names it and the server returns it. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [3.5] Every page: no link-preview image for shared links (seo)
- category: seo
- impact: 5
- ease: 7
- next: render a card to `apps/web/public/og-card.png` and name it from `headTags`, with tests
- issue: #302
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-05 (pass 250, cloud tick)

Pass 249 cut the older bot reports from the measured proposal rows (d0e124f). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 2 commits ago, about 14 hours) and so is the expand gate (pass 26 ran 3 commits ago, about 15 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top finding, from critique pass 38: decided row 49 still opened "Current engine: yes, each Build is a separate purchase" and ended "To write into Spec v2." Scored 7.2 (critique MED: impact 6, ease 8, bias x1.5). Row 49 now says what the game plays under Spec v2 (11.4) in a Spec v2 note, and a test bars "To write into Spec v2" in every decided row. Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [x] [7.2] /decisions: decided row 49 still says the engine lets one Build card buy tier I and tier II (critique MED, pass 38, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: drop "To write into Spec v2." from row 49 and add a Spec v2 note naming 11.4, regenerate `docs/DECISIONS.md`, add a test
- issue: #301
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-04 (pass 249, cloud tick)

Critique pass 38 filed two MED rows on /decisions (e356f80). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 38 ran 1 commit ago) and so is the expand gate (pass 26 ran 2 commits ago). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top finding, from critique pass 38: rule reading 68 says the 4-seat median goes from 5 to 4 while its measured block says 5 to 3. Scored 7.2 (critique MED: impact 6, ease 8, bias x1.5). Rows 63, 64, 66 and 70 carry the same older "Bot report:" sentence next to their measured blocks, so all five are cut (row 70 keeps its physical-edition note); a test bars "Bot report" in a measured proposal's reading. Next in line: the pass 38 MED row 49 (decided row still says "To write into Spec v2.").

## Top 5 findings (scored)

### [x] [7.2] /decisions: row 68 gives two different 4-seat bot results for seat scaling (critique MED, pass 38, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: cut the older "Bot report:" sentences from every measured proposal row in `OPEN-QUESTIONS.md`, regenerate `docs/DECISIONS.md`, add a test
- issue: #300
- fixed: (this commit)

### [ ] [7.2] /decisions: decided row 49 still says the engine lets one Build card buy tier I and tier II (critique MED, pass 38, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: drop "To write into Spec v2." from row 49 and add a Spec v2 note naming ruling 25

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-04 (pass 248, cloud tick)

Pass 247 matched the /config Combat model help to its option label (81aa9d9). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 37 ran 7 commits ago, about 15 hours) and so is the expand gate (pass 25 ran 11 commits ago, about 24 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass re-checked the older open LOW rows still marked `[ ]` in earlier audit blocks (the /credits Icons intro, the / "Also:" line, the "not in the written rules" log tags, the "Unpicked Skills" option names) against the source; each was fixed by a later commit. Nothing scored 3.0 or more. No actionable iterate work, so the tick hands to /expand (bold posture): pass 26 adds critique pass 37 and audit passes 239-247 as evidence for "Player text on Spec v2" and "The exchange Combat model after Spec v2". Next in line: the /oversight-owned /decisions rows; the critique gate opens after 12 commits or 24 hours.

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-04 (pass 247, cloud tick)

Pass 246 capitalised the model name in the /config model-only note (01c5227). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 37 ran 6 commits ago, about 14 hours) and so is the expand gate (pass 25 ran 10 commits ago, under 48 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The /decisions MED rows (balance checks, Structural v2 questions, Spec v2 design work) still wait for /oversight. Top finding, from critique pass 37: the /config Combat model help names the second option "Exchanges:" while the list says "Exchanges (older rules)", and the page writes the tag both "(older rules)" and "(older rule)". Re-scored 3.0 (critique LOW: impact 3, ease 10, two strings in one JSON file). The help now reads "Exchanges (older rule): the earlier Combat, kept for playtests." and the option reads "Exchanges (older rule)"; a test bars "(older rules)" in every option label. Next in line: the /oversight-owned /decisions rows; with no LOW rows left outside them, the next tick likely hands to /expand or waits for the critique gate.

## Top 5 findings (scored)

### [x] [3.0] /config: the Combat model help names the second option "Exchanges:", the list says "Exchanges (older rules)" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: match the help to the option label in `config.meta.json`, and use one form of the older-rule tag
- issue: #298
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-04 (pass 246, cloud tick)

Pass 245 rewrote the /tiles gathering-node legend (b4c7e2c). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 37 ran 5 commits ago, about 12 hours) and so is the expand gate (pass 25 ran 9 commits ago, under 48 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The /decisions MED rows (balance checks, Structural v2 questions, Spec v2 design work) still wait for /oversight. Top finding, from critique pass 37: the /config model-only note writes the tag "Engagements only." and then "Combat is set to exchanges", lower-casing the model it just capitalised. A 3.0 (critique LOW: impact 3, ease 10, a two-word case change). `combatModelNote` now writes "Combat is set to Exchanges" (or "Engagements"), the names the Combat model list uses. Next in line: the pass 37 LOW Combat model help row ("Exchanges:" against "Exchanges (older rules)").

## Top 5 findings (scored)

### [x] [3.0] /config: the model-only note writes "Exchanges only" then "Combat is set to exchanges" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: capitalise the model name in `packages/content/src/decisions.ts:321-322`
- issue: #297
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [2.4] /config: the Combat model help names the second option "Exchanges:", the list says "Exchanges (older rules)" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: match the help to the option label in `config.meta.json`, and use one form of the older-rule tag

# Site audit — 2026-11-04 (pass 245, cloud tick)

Pass 244 appended the draft-pool sentence to the / Skills line (dd58ace). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 37 ran 4 commits ago, under 24 hours) and so is the expand gate (pass 25 ran 9 commits ago, under 48 hours). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The /decisions MED rows (balance checks, Structural v2 questions, Spec v2 design work) still wait for /oversight. Top finding, from critique pass 37: the /tiles gathering-node legend says "a Gather card here gets its materials, once", while / says any card's Gather option works on a node and a spent node stays spent for the run. A 3.0 (critique LOW: impact 3, ease 10). The legend now reads "a card's Gather option here gets its materials once; then the node is spent for the rest of the run" (and, with the node ruling off, "the first Gather option played here spends it"). Next in line: the pass 37 LOW /config wording rows (Combat model help "Exchanges:", the model-only note).

## Top 5 findings (scored)

### [x] [3.0] /tiles: the gathering-node legend still says "a Gather card ... once" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: legend wording in `ruleText.ts:83`
- issue: #296
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [2.4] /config: the Combat model help names the second option "Exchanges:", the list says "Exchanges (older rules)" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: match the help to the option label in `config.meta.json`

### [ ] [2.4] /config: the model-only note writes "Exchanges only" then "Combat is set to exchanges" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: capitalise the model name in `packages/content/src/decisions.ts:321-322`

# Site audit — 2026-11-03 (pass 244, cloud tick)

Pass 243 moved /decisions row 77 to "(the older rule)" (412c645). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 37 ran 3 commits ago) and so is the expand gate (pass 25 ran 8 commits ago). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). The /decisions MED rows (balance checks, Structural v2 questions, Spec v2 design work) still wait for /oversight. Top finding, from critique pass 37: the / Skills line says each player looks at 2 Skills and keeps 1, but never says the others go to the draft pool (11.7) that later drafts also offer (11.6). A 3.2 (critique LOW: impact 4, ease 8). `trainingText` now ends with `draftPoolText`, the same sentence /play shows: "The Skills you do not keep go to your pool. Later drafts offer them again." (or "go back to the supply." under the older rule). Next in line: the pass 37 LOW /config wording rows and the /tiles gathering-node legend.

## Top 5 findings (scored)

### [x] [3.2] /: the Skills line never says the unkept Skills go to your pool (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: append `draftPoolText` to `trainingText` in `packages/content/src/ruleText.ts`
- issue: #295
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [3.0] /tiles: the gathering-node legend still says "a Gather card ... once" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: legend wording in `ruleText.ts:83`

### [ ] [2.4] /config: the Combat model help names the second option "Exchanges:", the list says "Exchanges (older rules)" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: match the help to the option label in `config.meta.json`

# Site audit — 2026-11-03 (pass 243, cloud tick)

Pass 242 dropped the "yet" from the /config Exchange range note (799b5b9). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 37 ran 2 commits ago) and so is the expand gate (pass 25 ran 7 commits ago). Every build plan phase is shipped or blocked (phase 35 waits on the designer's Skills session). Top finding, from critique pass 37: /decisions row 77 calls the bottom of the supply "the written 11.7", while Spec v2 11.7 sends unkept Skills to the draft pool and /config labels the supply "older rule". An 8.1 (critique MED: impact 6, ease 9, bias x1.5). Row 77 and the structural note now say "(the older rule)"; the decided reading is unchanged. Next in line: the pass 37 LOW /config wording rows (Combat model help "Exchanges:", the model-only note).

## Top 5 findings (scored)

### [x] [8.1] /decisions: row 77 calls the bottom of the supply the written 11.7, which is the draft pool (critique MED, pass 37, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: wording in `OPEN-QUESTIONS.md` row 77 and the structural note; regenerate `docs/DECISIONS.md`
- issue: #294
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [2.4] /config: the Combat model help names the second option "Exchanges:", the list says "Exchanges (older rules)" (critique LOW, pass 37)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: match the help to the option label in `config.meta.json`

# Site audit — 2026-11-03 (pass 242, cloud tick)

Pass 241 moved the /play log tags off the deleted Spec v2 rules 9.2 and 10.1 (cbaf8a6), and critique pass 37 (adbd215) filed 6 rows. No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 37 ran 1 commit ago) and so is the expand gate (pass 25 ran 6 commits ago). Phase 35 is still blocked on the designer's Skills session. Top finding, new from critique pass 37: the /config Exchange range help describes the older Exchanges Combat, then the unused mark says "Not used by the engine yet", which reads as a promise the engine will use it, while no Combat model in this build reads the field. An 8.1 (critique MED: impact 6, ease 9, bias x1.5). The help now ends "The Exchanges Combat in this build does not use this range either.", and the metadata schema gains a "retired" unused mark, which /config shows as "Not used by the engine: changing it changes nothing." Removing the field instead would need a config version bump and golden replays for a range nothing reads. Next in line: the /decisions row 77 cite (critique MED, pass 37), then the pass 37 LOW /config wording rows.

## Top 5 findings (scored)

### [x] [8.1] /config: the Exchange range says "not used by the engine yet" for a range no Combat model reads (critique MED, pass 37, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: retired unused mark and a help sentence in `config.meta.json`
- issue: #293
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-03 (pass 241, cloud tick)

Pass 240 moved seven /config cites off the deleted Spec v2 rules 9.2 and 10.1 (ee64539). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 10 commits ago, just under 24 hours) and so is the expand gate (pass 25 ran 3 commits ago). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass checked the engine's log tags against the deleted section list. Top finding, new this pass: the /play log shows "rule 9.2" after every spawn and "rule 10.1" after every tile reveal, and two default-off experiments show "rule 8.3, row 17" and "rule 10.1, row 63". The engine passes these tags as arguments, so the log-tag test, which reads only `rule: '...'`, missed them. A 3.0 (impact 3: every run logs them; ease 10: four tags). Spawns now cite 7.3 and step-off reveals 6.7; the two experiments are tagged by row only, so the log says "not in the written rules". A new ruleNumbers test reads every tag literal in the engine and fails on a deleted section or a row in a log note. Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] /play: the log cites Spec v2 rules 9.2 and 10.1, which v2 deleted (audit)
- category: comprehension
- impact: 3
- ease: 10
- next: tag spawns 7.3 and reveals 6.7 in the engine; test every engine tag literal
- issue: #292
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-03 (pass 240, cloud tick)

Pass 239 reworded the /config Exchange range help (76e49e4). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 9 commits ago, about 17 hours) and so is the expand gate (pass 25 ran 2 commits ago). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass checked every /config rule cite against the Spec v2 section list. Top finding, new this pass: seven fields cite sections Spec v2 deleted. "Rule 9.2" (spawn ramp, new tile wait, spawns per seat, spawn range) now reads "Deleted in Spec v2: each spawn node gets an enemy in each Combat (7.3)", and "Rule 10.1" (forced reveal, new tile wait, reveal move cost, tile rotation) reads "Deleted in Spec v2: tiles are revealed when a figure steps off the map (6.7)". A 3.0 (impact 3: a playtester who looks up the cite finds a deleted line; ease 10: seven rule strings). The fields now cite 7.3 and 6.7, the sections the deleted lines point to, and a configMeta test reads the spec and fails on any cite of a deleted section. The generated docs/RULES-AS-PLAYED.md is unchanged (it lists changed fields only when the config differs from the defaults). Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] /config: seven fields cite Spec v2 rules 9.2 and 10.1, which v2 deleted (audit)
- category: comprehension
- impact: 3
- ease: 10
- next: cite 7.3 and 6.7 in `config.meta.json`; test that no cite names a deleted section
- issue: #291
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-03 (pass 239, cloud tick)

Pass 238 found nothing to ship and handed to /expand (pass 25, 0fa67de). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 8 commits ago, about 17 hours) and so is the expand gate (pass 25 ran 1 commit ago). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass read the served text of /config against Spec v2. Top finding, new this pass: the "Exchange range" help ("If no enemy is within this many hexes, the exchange has no effect and the hand is discarded.") is the Spec v1 text of 7.9, but the field cites "Rule 7.9.", whose Spec v2 text is "If no enemy is next to you, no enemy dice roll." A 3.0 (impact 3: a playtester who follows the rule link reads a different rule; ease 10: one help string). The help now opens "The older rules:" and gives the written 7.9 reading; the configMeta test pins both. The field stays marked as not read by the engine. Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] /config: the Exchange range help paraphrases Spec v1 7.9 under a Spec v2 "Rule 7.9" cite (audit)
- category: comprehension
- impact: 3
- ease: 10
- next: reword the `combat.exchangeRange` help in `config.meta.json`
- issue: #290
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-03 (pass 238, cloud tick)

Pass 237 dropped the [not in the written rules] clause from the /debug intro (185d655). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 7 commits ago, about 15 hours) and so is the expand gate (pass 24 ran 9 commits ago, about 23 hours). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass read the served text of /, /tiles and /credits against Spec v2 (start, round, Combat, knockout, level and shop lines), checked the status codes of every route, the 404 page, robots.txt and the sitemap, the head tags of /, /play and /tiles, and the colocated tests of the /play helpers. Nothing scored 3.0 or more. The /credits line "the icons drawn for this game are not" names no license for them, but the repo has no license file, so that wording is the designer's call, not a loop fix. No actionable iterate work, so the tick hands to /expand (bold posture): pass 25 adds critique pass 36's two hand-typed rule phrases (51499f9, 185d655) as evidence for "Player text on Spec v2". Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-03 (pass 237, cloud tick)

Pass 236 named the next level and its experience total on the /play player panel (4a48ed0). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 6 commits ago, about 13 hours) and so is the expand gate (pass 24 ran 7 commits ago, about 22 hours). Phase 35 is still blocked on the designer's Skills session. Top finding, from critique pass 36: the /debug intro explains a [not in the written rules] tag that the standard rules never log (the only such event, "Combat v3", fires only with the non-default "cancelled" defeated dice). A 3.0 (impact 3, ease 10: one clause). The intro drops the clause; the debug e2e pins its absence. Next in line: the /oversight-owned /decisions rows; with nothing else queued, the next tick hands to /expand when its gate opens.

## Top 5 findings (scored)

### [x] [3.0] /debug: the intro explains a [not in the written rules] tag the page never shows (critique LOW, pass 36)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: drop the clause from the /debug intro in `DebugPage.tsx`
- issue: #289
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-03 (pass 236, cloud tick)

Pass 235 cited one rule section as "Rule 7.8." on /config (0f7f6cc). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 5 commits ago, about 12 hours) and so is the expand gate (pass 24 ran 7 commits ago, about 21 hours). Phase 35 is still blocked on the designer's Skills session. Top finding, from critique pass 36: the /play player panel shows "experience 3 / 9", a running total, while / and /config give level costs as "6 more". A 3.0 (impact 3, ease 9). The panel now names the target as "experience 3 (level 3 at 9)"; the PlayerPanel test pins the level 1 and level 2 wording and the absence of the bare "/ total". Next in line: the /debug [not in the written rules] clause (pass 36), then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] /play: the player panel's next-level target is a total (critique LOW, pass 36)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: name the target in `PlayerPanel.tsx`, for example "experience 3 (level 3 at 9)"
- issue: #288
- fixed: (this commit)

### [ ] [2.7] /debug: the intro explains a [not in the written rules] tag the page never shows (critique LOW, pass 36)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: drop the clause from the /debug intro in `DebugPage.tsx`

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-03 (pass 235, cloud tick)

Pass 234 said a spent node stays spent for the run on the / Materials line (40f75d9). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 4 commits ago, about 11 hours) and so is the expand gate (pass 24 ran 6 commits ago, about 13 hours). Phase 35 is still blocked on the designer's Skills session. Top finding, from critique pass 36: /config cites one section with the plural "Rules 7.8.", while the /play log says "rule 7.8". A 3.0 (impact 3, ease 10). `configRuleNote` now writes "Rule 7.8." for one section and "Rules 4.10, Table 3." for more than one; the ruleText, configMetaText and /config e2e tests pin both. Next in line: the two other LOW rows from pass 36 (/play experience target, /debug tag clause), then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] /config: a single rule section is cited as "Rules 7.8." (critique LOW, pass 36)
- category: external-critique (voice)
- impact: 3
- ease: 10
- next: singular "Rule" for one section in `ruleText.ts`
- issue: #287
- fixed: (this commit)

### [ ] [3.0] /play: the player panel's next-level target is a total (critique LOW, pass 36)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: name the target in `PlayerPanel.tsx`, for example "experience 3 (level 3 at 9)"

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-03 (pass 234, cloud tick)

Pass 233 kept a blank Seed field from announcing an error on /play and /debug (6eb51c8). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 3 commits ago, about 10 hours) and so is the expand gate (pass 24 ran 5 commits ago, about 19 hours). Phase 35 is still blocked on the designer's Skills session. Top finding, from critique pass 36: the / Materials line sits under "On the board, every round:" and says "each node gives its materials once", which can read as once per round; the engine spends a node for the rest of the run. A 3.0 (impact 3, ease 10). The default-rules line now ends "each node gives its materials once, then it is spent for the rest of the run."; the ruleText and HomePage tests pin it. The gatherNeedsNode-off wording is unchanged: there a spent node gives the same as any other hex. Next in line: the three other LOW rows from pass 36, then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] /: the Materials line under "every round" says a node gives its materials "once" (critique LOW, pass 36)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: add "then it is spent for the rest of the run" in `ruleText.ts`
- issue: #286
- fixed: (this commit)

### [ ] [3.0] /config: a single rule section is cited as "Rules 7.8." (critique LOW, pass 36)
- category: external-critique (voice)
- impact: 3
- ease: 10
- next: singular "Rule" for one section in `ruleText.ts`

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 233, cloud tick)

Pass 232 put the /config Combat model siege step after both options (51499f9). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 2 commits ago) and so is the expand gate (pass 24 ran 4 commits ago). Phase 35 is still blocked on the designer's Skills session. The five LOW rows from critique pass 36 score 3.0-3.2; the top one is the a11y row: clearing the Seed field on /play or /debug shows "Type a whole number." in a role="alert" at once, so a screen reader announces an error before the player types. A 3.2 (impact 4: every screen-reader player who types a seed; ease 8: two components and one helper). A blank field now keeps Start disabled and shows the message quietly (no alert, aria-invalid false); text that is not digits still gets the alert. A component test pins both cases. Next in line: the other four LOW rows from pass 36, then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.2] /play and /debug: clearing the Seed field announces an error at once (critique LOW, pass 36)
- category: external-critique (a11y)
- impact: 4
- ease: 8
- next: `isSeedBlank` in `apps/web/src/play/seed.ts`; blank field renders the message without role="alert" on both pages
- issue: #285
- fixed: (this commit)

### [ ] [3.0] /: the Materials line under "every round" says a node gives its materials "once" (critique LOW, pass 36)
- category: external-critique (comprehension)
- impact: 3
- ease: 10
- next: add "then it is spent for the rest of the run" in `ruleText.ts`

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 232, cloud tick)

Pass 231 named the tests in the RULES-COVERAGE row for Tables 5 and 7 (634872c), and critique pass 36 ran after it (7bedca7). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 36 ran 1 commit ago) and so is the expand gate (pass 24 ran 3 commits ago). Phase 35 is still blocked on the designer's Skills session. Top finding, new from critique pass 36: the /config Combat model help puts the siege step under Engagements only, while the engine runs it under both models and / says "Either way". A 9.0 (critique MED, impact 6, ease 10, bias x1.5, clamped). The help now names both options, then "In both, enemies hit structures in the siege step at the end of Combat."; a content test pins it. Next in line: the five LOW rows from pass 36, then the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [9.0] /config Combat model help puts the siege step under Engagements only (critique MED, pass 36, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 10
- next: move the siege clause after both options in `config.meta.json` `combat.model.help`
- issue: #284
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 231, cloud tick)

Pass 230 handed to /expand (pass 24, 6dd10e4). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 11 commits ago, just under 24 hours) and so is the expand gate (pass 24 ran 1 commit ago). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. Top finding, new this pass: the `RULES-COVERAGE.md` row for Tables 5 and 7 (the enemy and defense records) names no test. Its test column still reads "schema validation only; behaviour tests in phases 6-7", a plan note from before those phases shipped. A 3.0 (impact 3: standing rule 6 asks every rule to map to a test in this file and the rules-lawyer audits it; ease 10: one row). The row now names the two schemas, the load and rule-text tests and the Tower test, and points to the rows that hold the behaviour tests. Every other row names at least one test. Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] RULES-COVERAGE row for Tables 5 and 7 names no test (audit, tests)
- category: tests (rules coverage)
- impact: 3
- ease: 10
- next: name `EnemyDefSchema`, `DefenseDefSchema` and their tests in the row
- issue: #283
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 230, cloud tick)

Pass 229 made the READMEs, sim help and content TSDoc say Spec v2 (e74354f). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 10 commits ago, about 23 hours) and so is the expand gate (pass 23 ran 5 commits ago). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. This pass checked the rest of the repo for Spec v1 text (only history lines and Spec v1 option names remain), the route descriptions and served head tags, the count-and-noun strings in /play and /debug, and the sim option sets against OPEN-QUESTIONS (rows 63, 64, 66, 67 and 70 are still proposed, and rows 65 and 69 are already left out). Nothing scored 3.0 or more. No actionable iterate work, so the tick hands to /expand (bold posture): pass 24 adds the Spec v1 doc drift from passes 228 and 229 as evidence for "Player text on Spec v2". Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 229, cloud tick)

Pass 228 made the engine and web doc comments quote Spec v2 (9191956). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 9 commits ago, about 16 hours) and so is the expand gate (pass 23 ran 4 commits ago). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. Top finding, new this pass: pass 228 swept engine and web doc comments, but four other places still describe the game as Spec v1. The repo README (the GitHub landing page) says "(Spec v1)"; the engine README says "the pure rules engine for Spec v1" and "feature-complete for Spec v1"; the `pnpm sim` help says `rules` prints "each Spec v1 rule" while it renders Spec v2; the `defaultContent` TSDoc says "Spec v1, Issue 006 draft". A 3.0 (impact 3: the first page a GitHub visitor reads names the wrong rules; ease 10: five lines). All now say Spec v2; the engine README keeps Milestone 1 as Spec v1 history and adds that phase 41 moved the engine to Spec v2. `agents.md` and `spec/` keep their Spec v1 lines: the rule book and the spec change only through /oversight. Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] README, engine README, sim help and content TSDoc still say Spec v1 (audit, docs)
- category: docs (rules accuracy)
- impact: 3
- ease: 10
- next: "Spec v2" in `README.md`, `packages/engine/README.md`, the `rules` line of the `pnpm sim` help, and the `defaultContent` TSDoc
- issue: #282
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 228, cloud tick)

Pass 227 dropped the /play next-level target when experience cannot raise the level (ac87099). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 8 commits ago, about 16 hours) and so is the expand gate (pass 23 ran 3 commits ago). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row edits a `[needs-user-call]` item, which /oversight owns. Top finding, new this pass: two doc comments still describe Spec v1. The TSDoc of `experienceForLevel` (rule 8.5) quotes Spec v1 steps of 5, 10, 15 (totals 5, 15, 30, 50) while Spec v2 8.5 and `config.default.json` use steps of 3 (totals 3, 9, 18, 30); the `rulesUrl` comment calls the linked `spec/01-spec-v2-rules.md` "Spec v1". A 3.0 (impact 3: the rule-cited TSDoc that standing rule 6 makes the engine's contract misstates a rule's numbers, and the rules-lawyer reads it; ease 10: two comment lines). Both now say Spec v2; the numbers are already pinned by `levels.test.ts` and `spec-v2.test.ts` "change 6". No other Spec v1 numbers remain in engine or web doc comments. Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.0] Engine and web doc comments still quote Spec v1 (rule 8.5 steps, the rules link) (audit, docs)
- category: docs (rules accuracy)
- impact: 3
- ease: 10
- next: Spec v2 numbers in the `experienceForLevel` TSDoc; "Spec v2" in the `rulesUrl` comment
- issue: #281
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 227, cloud tick)

Pass 226 fixed the Materials line on / (4414830). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 7 commits ago, about 14 hours) and so is the expand gate (pass 23 ran 1 commit ago). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row now edits a `[needs-user-call]` item, which /oversight owns. Top finding, new this pass: the /play player panel always shows "experience N / T" for the next level, but with a Maximum level set on /config and reached, or with the "1 level for each elite that spawns" experiment on, no experience total raises the level (`levelForExperience`, `raiseLevel`). The panel shows a target the player cannot reach. A 3.2 (impact 4: the one progress number on /play misleads under two /config options; ease 8: an engine helper, one label and tests). The engine's new `experienceForNextLevel` returns null in both cases. The panel then shows "experience N" with no target, and "level N (maximum)" at the cap. Engine and PlayerPanel tests pin it. Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.2] /play: the player panel shows a next-level target no experience can reach (audit, comprehension)
- category: comprehension
- impact: 4
- ease: 8
- next: `experienceForNextLevel` in the engine; the panel drops the target when it is null and says "(maximum)" at the cap
- issue: #280
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 226, cloud tick)

Pass 225 made /config tick boxes that start unticked say "Not ticked (default)" (3c0624a), and expand pass 23 found no new candidates (c88a809). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 6 commits ago, about 13 hours) and so is the expand gate (pass 23 ran 0 commits ago). Phase 35 is still blocked on the designer's Skills session. Top finding, from pass 35: the Materials line on / names only the starter Gather card, while Shop cards (Haul, Excavate, Quarry) gather too under the same node rule. A 2.7 (impact 3, ease 9), the last Pending critique row the site can act on without /oversight. `materialsText` now says "Play a card's Gather option on a gathering node to get its materials (2 materials for the starter Gather card)", in the "Engage option" wording the Combat line uses; the off-node and anywhere readings follow. ruleText and HomePage tests pin it. Next in line: only the /oversight-owned /decisions rows remain.

## Top 5 findings (scored)

### [x] [2.7] /: the Materials line names only the starter Gather card, not the Shop cards that also gather (critique LOW, pass 35)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: "Play a card's Gather option ... to get its materials (2 materials for the starter Gather card)" in `materialsText`
- issue: #279
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 225, cloud tick)

Pass 224 made /play and /debug refuse a seed that is not a whole number (f0ed9f4). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 4 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 19 commits ago, about 45 hours). Phase 35 is still blocked on the designer's Skills session. Top finding, from pass 35: on /config the tick boxes that start unticked say "Off (default)" while the control shows a box, not an "Off" state, and the boxes ticked by default say "When ticked (default)". A 2.7 (impact 3, ease 9), the only Pending critique row the site can act on without /oversight. The four boolean helps (1 level for each elite that spawns, Spawns scale with seats, Tile rotation, Every card must be played) now say "Not ticked (default):"; number limits keep "Off". A configMetaText test fails when a tick box says "Off (default)". Next in line: the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [2.7] /config: tick-box helps say "Off (default)" for a box with no "Off" label (critique LOW, pass 35)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: for tick boxes only, write "Not ticked (default):" in `config.meta.json`
- issue: #278
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-02 (pass 224, cloud tick)

Pass 223 tagged engagement and draft-pool log lines with rules 7.7, 7.8 and 11.7 (611750c). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 3 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 18 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Top finding, from pass 35: on /play and /debug a seed that is not a whole number silently starts seed 0, against the hint "The same seed and the same choices give the same game." A 3.5 (impact 5: a run starts on a seed the player did not type, and nothing says so; ease 7: one shared parser, two forms, tests). Both forms now read the field with one `parseSeed` (digits only, a safe integer); while it is not a whole number the start button is disabled and the field says "Type a whole number." A unit test and a StartPanel test pin it. Next in line: the pass 35 LOWs (tick-box "Off (default)" wording, the Materials line) and the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.5] /play and /debug: a seed that is not a number silently starts seed 0 (critique LOW, pass 35)
- category: external-critique (comprehension)
- impact: 5
- ease: 7
- next: one `parseSeed` for both forms; disable the start button and say "Type a whole number." while the seed is not one
- issue: #277
- fixed: (this commit)

### [x] [2.7] /config: tick-box helps say "Off (default)" for a box with no "Off" label (critique LOW, pass 35)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: for tick boxes only, write "Not ticked (default):" in `config.meta.json`

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-01 (pass 223, cloud tick)

Pass 222 cited rule 7.8 on the /config defeated dice note (4144937). No issues are open for triage (#223 waits for the user). The critique gate is closed (pass 35 ran 2 commits ago) and so is the expand gate (pass 22 ran 17 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Top finding, from pass 35: under the default rules the /play log and /debug tag most engagement events and every pooled Skill "not in the written rules", while Spec v2 writes them as rules 7.7, 7.8 and 11.7. A 5.4 (impact 6, ease 6, bias x1.5 for critique MED). The engine now tags a bottom-half card, its heal, move or repair 7.7 (repair "7.7, 12.5"), the Combat draw 7.7, a card reroll, a fired Skill, an ignored hit and the damage 7.8, an enemy die hit "7.8, Table 4", an engagement's end "7.8 step 9" (exported as `ENGAGEMENT_END`, so the log still tells it from a v1 exchange's "7.8"), and a pooled Skill 11.7. Only the "Cancelled" experiment's cancelled die keeps the engagement design tag, as it is not the written rule. Engine tests pin the engagement-end tags and the pool tag; the engagement golden replay hash was regenerated because the log is part of the state (only `expectedHash` changed). Next in line: the pass 35 LOWs and the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [5.4] /play and /debug: engagement and draft-pool log lines say "not in the written rules" (critique MED, pass 35, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: tag engagement events with their 7.7 / 7.8 section and the pooled Skill with 11.7; pin with an engine test
- issue: #276
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-01 (pass 222, cloud tick)

Pass 221 named all 7 Base tile hexes the base (800a190), and critique pass 35 filed 6 rows (2f8713b). No issues are open for triage. The critique gate is closed (pass 35 ran 1 commit ago) and so is the expand gate (pass 22 ran 16 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Top finding, new from pass 35: the /config "Defeated enemies' dice" note says "Not in the written rules", but Spec v2 rule 7.8 step 7 is the default choice. A 6.8 (impact 5: a rules note contradicts the written rules; ease 9: one content field and a test; bias x1.5 for critique MED). The field now cites 7.8 and its help says Still hit is the written rule; the same sentence takes the pass 35 LOW marker-placement fix. Next in line: the pass 35 MED log-tag row (engagement and draft-pool log lines say "not in the written rules"; tag them 7.8 and 11.7), then the pass 35 LOWs.

## Top 5 findings (scored)

### [x] [6.8] /config: "Defeated enemies' dice" says not in the written rules; rule 7.8 step 7 is the default (critique MED, pass 35, bias x1.5)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: cite 7.8 on the field and name Still hit as the written rule
- issue: #275
- fixed: (this commit)

### [ ] [5.4] /play and /debug: engagement and draft-pool log lines say "not in the written rules" (critique MED, pass 35, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: tag engagement events with their 7.8 / 7.10 / 7.11 step and the pooled Skill with 11.7; pin with an engine test

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-11-01 (pass 221, cloud tick)

Pass 220 closed the sim row (bea13b7). No issues are open for triage. The critique gate is closed (pass 34 ran 10 commits ago, a few minutes under 24 hours) and so is the expand gate (pass 22 ran 14 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding, new this pass: the Tile sheet says the Broken Village has "1 Base" and lists only its center as "Plains, Base", while rule 3.6 and decided reading 16 make all 7 hexes the base, and the engine and the page's own site legend ("stand on the Base tile") play it that way. A 4.0 (impact 5: a reference page contradicts a rule; ease 8: one caption, one label helper and tests). The caption now reads "All 7 hexes are the base", and every Base tile hex names "Base" in its hex list and drawing label; the printed icon stays on the center, as the tile prints it. Next in line: no row scores 3.0 or more outside the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [4.0] /tiles: the Base tile reads as 1 base hex; rule 3.6 makes all 7 the base (audit, comprehension)
- category: comprehension
- impact: 5
- ease: 8
- next: say all 7 hexes are the base under the tile and name each hex "Base"
- issue: #274
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

# Site audit — 2026-11-01 (pass 220, cloud tick)

Pass 219 named the default in every /config tick box and limit (6abf961). No issues are open for triage. The critique gate is closed (pass 34 ran 9 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 13 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding: the sim LOW row (the bot cannot measure today's designer changes) is stale. Phase 36 (5890e54) shipped the defender bot, which defeats enemies before their dice hit, keeps its heal cards across engagements and buys Training, and `docs/reports/phase-36-defender.md` sections 3 and 4 re-ran the defeated-dice and draft-pool comparisons the row asks for. A 3.2 (impact 3: a stale row keeps a done ask in the queue; ease 9: state files only; +0.5 user source). The row moves to Done with the phase 36 numbers and the residual the report's caveat records (the bot keeps only heal cards). Next in line: no row scores 3.0 or more outside the /oversight-owned /decisions rows.

## Top 5 findings (scored)

### [x] [3.2] sim: the bot cannot measure today's designer changes; phase 36 already measured them (critique LOW, source user)
- category: external-critique (tests)
- impact: 3
- ease: 9
- next: move the CRITIQUE.md row to Done, citing the phase 36 report
- issue: #273
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

# Site audit — 2026-11-01 (pass 219, cloud tick)

Pass 218 marked the default choice in every /config list (6a8354f). No issues are open for triage. The critique gate is closed (pass 34 ran 8 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 12 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding, new this pass: the lists now mark their default, and some tick boxes and limits say "(default)" in their help, but five do not: Maximum level ("Off: no maximum."), Tile rotation, Every card must be played, Defenses on gathering nodes and Gather needs a node. A 3.2 (impact 4: five fields on a tool page, and the designer cannot tell which setting the written rules use; ease 8: five strings and a content test). Each help now names its default ("Off (default): as in the written rules." or "When ticked (default), ..."), every default being a written rule or a decided reading (spec 8.4 and 18.1; open questions 5, 10, 14, 59), and a configMetaText test fails when a tick box or optional limit leaves its default unnamed. Next in line: the sim LOW row (the bot cannot measure today's designer changes).

## Top 5 findings (scored)

### [x] [3.2] /config: five tick boxes and limits do not name their default; their siblings and every list do (audit, comprehension)
- category: comprehension
- impact: 4
- ease: 8
- next: name the default in each help and add a test over every tick box and optional limit
- issue: #272
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

### [ ] [1.8] sim: the bot cannot measure today's designer changes (critique LOW)
- category: external-critique (tests)
- impact: 3
- ease: 6
- next: see the CRITIQUE.md row

# Site audit — 2026-11-01 (pass 218, cloud tick)

Pass 217 fixed the /config "Skills you do not keep" help (95d7426). No issues are open for triage. The critique gate is closed (pass 34 ran 7 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 11 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding, new this pass: four /config lists mark their default choice and eight do not (Bought cards, Blocked enemy, Co-op Prepare order, Draft with full slots, Shop timing, and the unused Shop refill, Heal targets and Grunt that becomes an elite). A 3.2 (impact 4: eight fields on a tool page, and the designer cannot tell which choice the written rules use; ease 8: eight strings and a content test). Each default choice now ends "(default)", and a configMetaText test fails when any list leaves its default unmarked. /decisions drops the bracket when it quotes a choice, so its text is unchanged. Next in line: the sim LOW row (the bot cannot measure today's designer changes).

## Top 5 findings (scored)

### [x] [3.2] /config: eight lists do not mark their default choice; four others do (audit, comprehension)
- category: comprehension
- impact: 4
- ease: 8
- next: add "(default)" to each default choice and a test over every list
- issue: #271
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

### [ ] [1.8] sim: the bot cannot measure today's designer changes (critique LOW)
- category: external-critique (tests)
- impact: 3
- ease: 6
- next: see the CRITIQUE.md row

# Site audit — 2026-11-01 (pass 217, cloud tick)

Pass 216 fixed the /credits Icons intro (650e1b9). No issues are open for triage. The critique gate is closed (pass 34 ran 6 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 10 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding: the pass 214 audit note on the /config "Skills you do not keep" help. A 2.4 (impact 3: one field on a tool page; ease 8: one string and a unit check). The help now opens "Your pool (default):" and names the other choice "Back to the supply:", so both choices read as the list labels them, and a configMetaText test pins it. Next in line: the sim LOW row (the bot cannot measure today's designer changes).

## Top 5 findings (scored)

### [x] [2.4] /config: the "Unpicked Skills" help names its choices "Pool" and "Supply"; the list says "Your pool" and "Back to the supply" (audit, voice)
- category: voice
- impact: 3
- ease: 8
- next: open each choice in the help with the list label
- issue: #270
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

### [ ] [1.8] sim: the bot cannot measure today's designer changes (critique LOW)
- category: external-critique (tests)
- impact: 3
- ease: 6
- next: see the CRITIQUE.md row

# Site audit — 2026-11-01 (pass 216, cloud tick)

Pass 215 fixed the home page "Also:" line (ab521ad). No issues are open for triage. The critique gate is closed (pass 34 ran 5 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 9 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding: the pass 34 LOW row on the /credits Icons intro. A 2.7 (impact 3: one sentence on a tool page; ease 9: one string and a unit check). The intro now reads "Every icon by a named artist is under CC BY 3.0; the icons drawn for this game are not. Each name links to its source." The Textures intro is unchanged ("Every texture is under CC0."), and a CreditsPage test pins both. Next in line: the "Unpicked Skills" help names.

## Top 5 findings (scored)

### [x] [2.7] /credits: the Icons intro reads as if the icons drawn for this game are CC BY 3.0 too (critique LOW, pass 34)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: "Every icon by a named artist is under CC BY 3.0; the icons drawn for this game are not."
- issue: #269
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

### [ ] [2.4] /config: the "Unpicked Skills" help names its choices "Pool" and "Supply"; the list says "Your pool" and "Back to the supply" (audit, voice)
- category: voice
- impact: 3
- ease: 8
- next: open each choice in the help with the list label

### [ ] [1.8] sim: the bot cannot measure today's designer changes (critique LOW)
- category: external-critique (tests)
- impact: 3
- ease: 6
- next: see the CRITIQUE.md row

# Site audit — 2026-11-01 (pass 215, cloud tick)

Pass 214 fixed the /config "Defeated enemies' dice" help (62a3e23). No issues are open for triage. The critique gate is closed (pass 34 ran 5 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 9 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding: the pass 34 LOW row on the home page "Also:" line. A 2.7 (impact 3: one line on the home page; ease 9: one string and a unit check). The line now reads "Also: the Tile sheet, the Config page, the Decisions page (rule readings that wait on the designer) and Credits.", and a HomePage test checks the Tile sheet, Config and Credits links against their nav labels. Next in line: the /credits icon license intro, the "Unpicked Skills" help names.

## Top 5 findings (scored)

### [x] [2.7] /: the "Also:" line names the Tile sheet and Config pages differently from their headings (critique LOW, pass 34)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: "Also: the Tile sheet, the Config page, the Decisions page ... and Credits."
- issue: #268
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

### [ ] [2.7] /credits: the Icons intro reads as if the icons drawn for this game are CC BY 3.0 too (critique LOW, pass 34)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: "Every icon by a named artist is under CC BY 3.0; the icons drawn for this game are not."

### [ ] [2.4] /config: the "Unpicked Skills" help names its choices "Pool" and "Supply"; the list says "Your pool" and "Back to the supply" (audit, voice)
- category: voice
- impact: 3
- ease: 8
- next: open each choice in the help with the list label

# Site audit — 2026-11-01 (pass 214, cloud tick)

Pass 213 fixed the /config Enemy die damage helps (e655e40). No issues are open for triage. The critique gate is closed (pass 34 ran 4 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 8 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding: the pass 34 LOW row on the /config "Defeated enemies' dice" help. A 2.7 (impact 3: one field on a tool page; ease 9: one string and a unit check). The help now opens "Still hit: a defeated enemy's dice hit anyway (default).", so both choices read as the list labels them, and a configMetaText test pins it. Fresh audit note for a later tick: the "Unpicked Skills" help names its choices "Pool" and "Supply" while the list says "Your pool" and "Back to the supply" (same class, 2.4). Next in line: the "Also:" line names, the /credits icon license intro.

## Top 5 findings (scored)

### [x] [2.7] /config: the "Defeated enemies' dice" help names an option "Hit" that the list calls "Still hit" (critique LOW, pass 34)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: start the help with "Still hit:" to match the option label
- issue: #267
- fixed: 62a3e23

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

### [ ] [2.7] /: the "Also:" line names the Tile sheet and Config pages differently from their headings (critique LOW, pass 34)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: "Also: the Tile sheet, the Config page, the Decisions page ... and Credits."

### [ ] [2.4] /config: the "Unpicked Skills" help names its choices "Pool" and "Supply"; the list says "Your pool" and "Back to the supply" (audit, voice)
- category: voice
- impact: 3
- ease: 8
- next: open each choice in the help with the list label

# Site audit — 2026-11-01 (pass 213, cloud tick)

Pass 212 fixed the home page materials line (ab3aab8). No issues are open for triage. The critique gate is closed (pass 34 ran 1 commit ago, under 24 hours) and so is the expand gate (pass 22 ran 6 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The two MED /decisions rows edit `[needs-user-call]` items, which /oversight owns. Top finding: the pass 34 LOW row on the /config Enemy die damage help. A 2.7 (impact 3: one field group on a tool page; ease 9: two strings and a unit check). The helps now read "Damage a Hit face deals to the player." and "Damage a Special face deals to the player.", and a configMetaText test pins both. Next in line: the three pass 34 LOW rows left ("Still hit" help, the "Also:" line names, the /credits icon license intro).

## Top 5 findings (scored)

### [x] [2.7] /config: the Enemy die damage help writes the faces in lower case (critique LOW, pass 34)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: "Damage a Hit face deals to the player." and the Special line to match
- issue: #266
- fixed: e655e40

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

### [ ] [2.7] /config: the "Defeated enemies' dice" help names an option "Hit" that the list calls "Still hit" (critique LOW, pass 34)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: start the help with "Still hit:" to match the option label

### [ ] [2.7] /: the "Also:" line names the Tile sheet and Config pages differently from their headings (critique LOW, pass 34)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: "Also: the Tile sheet, the Config page, the Decisions page ... and Credits."

# Site audit — 2026-10-31 (pass 212, cloud tick)

Pass 211 fixed the /decisions file links (7418ddf), and critique pass 34 (32a483b) filed five rows. No issues are open for triage. The critique gate is closed (pass 34 ran 1 commit ago) and so is the expand gate (pass 22 ran 4 commits ago). Phase 35 is still blocked on the designer's Skills session. Top finding: the pass 34 MED row. The home page prices Barricades, Towers and Shop I in materials but never says where materials come from. A 6.3 (impact 6: the first page every visitor reads; ease 7: one rule-text helper and two tests; MED bias x1.5). A Materials item now opens the "On the board, every round:" list, built by `materialsText` from the starter deck's Gather amount and the Gather config. Next in line: the four pass 34 LOW rows (Enemy die damage help, "Still hit" help, the "Also:" line names, the /credits icon license intro).

## Top 5 findings (scored)

### [x] [6.3] /: the home page never says where materials come from (critique MED, pass 34, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: add a Materials item from the Gather amount and the gathering-node rule
- issue: #265
- fixed: ab3aab8

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

### [ ] [2.7] /config: the Enemy die damage help writes the faces in lower case (critique LOW, pass 34)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: "Damage a Hit face deals to the player." and the Special line to match

### [ ] [2.7] /: the "Also:" line names the Tile sheet and Config pages differently from their headings (critique LOW, pass 34)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: "Also: the Tile sheet, the Config page, the Decisions page ... and Credits."

# Site audit — 2026-10-31 (pass 211, cloud tick)

Pass 210 fixed the /debug rules link (47d29d5). No issues are open for triage. The critique gate is closed (pass 33 ran 9 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 2 commits ago). Phase 35 is still blocked on the designer's Skills session. Fresh audit finding: the /decisions intro links `OPEN-QUESTIONS.md` and `docs/DECISIONS.md` to GitHub with no notice, while /, /config, /credits and /debug now say "(on GitHub)". A 1.8 (impact 2: two links on one page; ease 9: one string and a unit check). The intro now ends "docs/DECISIONS.md (both on GitHub).", and a DecisionsPage test pins it. With this, every intro link to GitHub on the site says so. The rows left all edit `[needs-user-call]` items, which /oversight owns.

## Top 5 findings (scored)

### [x] [1.8] /decisions: the two file links in the intro do not say they open GitHub (audit, navigation)
- category: links (navigation)
- impact: 2
- ease: 9
- next: add "(both on GitHub)" as on /, /config, /credits and /debug
- issue: #264
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

# Site audit — 2026-10-31 (pass 210, cloud tick)

Pass 209 fixed the /credits issue link (6dbc4b2). No issues are open for triage. The critique gate is closed (pass 33 ran 8 commits ago, under 24 hours) and so is the expand gate (pass 22 ran 1 commit ago). Phase 35 is still blocked on the designer's Skills session. Fresh audit finding: the /debug intro links "written rules" to GitHub with no notice, while / and /config say "(on GitHub)" after the same link. A 1.8 (impact 2: one link on a tool page; ease 9: one string and an e2e check). The intro now says "the section of the written rules (on GitHub) it follows", and the debug e2e test pins it. The rows left all edit `[needs-user-call]` items, which /oversight owns.

## Top 5 findings (scored)

### [x] [1.8] /debug: the "written rules" link does not say it opens GitHub (audit, navigation)
- category: links (navigation)
- impact: 2
- ease: 9
- next: add "(on GitHub)" as on / and /config
- issue: #263
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

# Site audit — 2026-10-31 (pass 209, cloud tick)

Pass 208 handed to `/expand` (pass 22, 05dbd05). No issues are open for triage. The critique gate is closed (pass 33 ran 7 commits ago, under 24 hours) and so is the expand gate (pass 22 ran at the last commit). Phase 35 is still blocked on the designer's Skills session. Fresh audit finding: the /credits intro links "open an issue" to GitHub with no notice, while / and /config say "(on GitHub)" after theirs (pass 206 fixed /config). A 1.8 (impact 2: one link; ease 9: one string and an e2e check). The intro now says "open an issue (on GitHub).", and the credits e2e test pins it. The rows left all edit `[needs-user-call]` items, which /oversight owns.

## Top 5 findings (scored)

### [x] [1.8] /credits: the "open an issue" link does not say it opens GitHub (audit, navigation)
- category: links (navigation)
- impact: 2
- ease: 9
- next: add "(on GitHub)" as on / and /config
- issue: #262
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

# Site audit — 2026-10-31 (pass 208, cloud tick)

Pass 207's /decisions row links shipped (d29b03d). No issues are open for triage. The critique gate is closed (pass 33 ran 6 commits ago, under 24 hours) and so is the expand gate (pass 21 ran 7 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Every critique pass 33 row has shipped. No finding the loop can ship scores 3.0 or more, so there is no actionable iterate work. Handed to `/expand` (pass 22, bold posture). The five /decisions critique rows (three MED at 8.1 with the bias, two LOW) all edit `[needs-user-call]` items and wait for /oversight. The sim bot-policy row (critique LOW, user) is phase-sized. Checked this pass: no "(s)" plurals, doubled words or wrong articles in non-test `apps/web/src` strings; the solo level line that pass 103 noted now says "You get 1 action die" (`describeEvent.ts:197`).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

# Site audit — 2026-10-31 (pass 207, cloud tick)

Pass 206's "written rules" link fix shipped (35073ff). No issues are open for triage. The critique gate is closed (pass 33 ran 6 commits ago, under 24 hours) and so is the expand gate (pass 21 ran 7 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Top of the queue the loop can ship: the pass 33 LOW navigation row on /decisions, where a "row N" link to a reading under Decided recently left for GitHub because those items had no id, and "rows 65 and 69" was not linked. A 1.2 (impact 2: a few links on one page; ease 6: an id, a wider set and a list regex). Decided recently items now carry `q-N` ids and count as listed, and each number after "rows" links to its reading; a DecisionsPage test pins both. The rows left all edit `[needs-user-call]` items, which /oversight owns.

## Top 5 findings (scored)

### [x] [1.2] /decisions: "row N" links to Decided recently rows leave the page (critique pass 33 LOW)
- category: external-critique (navigation)
- impact: 2
- ease: 6
- next: ids on Decided recently items, link each number after "rows"
- issue: #261
- fixed: d29b03d

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

# Site audit — 2026-10-31 (pass 206, cloud tick)

Pass 205's Build step fix shipped (9ea1df7). No issues are open for triage. The critique gate is closed (pass 33 ran 5 commits ago, under 24 hours) and so is the expand gate (pass 21 ran 6 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Top of the queue: the pass 33 LOW navigation row on /config, where the intro linked "written rules" to GitHub with no notice, while the home page says "(on GitHub)". A 1.8 (impact 2: one link; ease 9: one string and an e2e check). The intro now says "the written rules (on GitHub)", and a config e2e test pins the text and the link. Next in line: the /decisions row links, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /config: the "written rules" link does not say it opens GitHub (critique pass 33 LOW)
- category: external-critique (navigation)
- impact: 2
- ease: 9
- next: add "(on GitHub)" as on the home page
- issue: #260
- fixed: (this commit)

### [ ] [1.2] /decisions: "row N" links to Decided recently rows leave the page (critique pass 33 LOW)
- category: external-critique (navigation)
- impact: 2
- ease: 6
- next: ids on Decided recently items, link each number after "rows"

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [7.2] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: /oversight drops rows 65 and 69 from that item

# Site audit — 2026-10-31 (pass 204, cloud tick)

Pass 203's /config bar fix shipped (216c617). No issues are open for triage. The critique gate is closed (pass 33 ran 2 commits ago, under 24 hours) and so is the expand gate (pass 21 ran 3 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the pass 33 LOW voice row on /config, where the Combat model help said "play Engage" although Engage is an option on the Move and Gather cards, not a card. A 1.8 (impact 2: one help line; ease 9: one string and a pinned test). The help now says "play a card's Engage option to roll from where you stand", as the home page does, and a configMetaText test fails if any help says "play Engage". Next in line: the Build step unit on /play, the "written rules" link on /config, the /decisions row links, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /config: the Combat model help still says "play Engage" (critique pass 33 LOW)
- category: external-critique (voice)
- impact: 2
- ease: 9
- next: reword the config.meta.json help string
- issue: #258
- fixed: a239cf6

### [ ] [1.8] /play: the Build step says "(2 left)" with no unit (critique pass 33 LOW)
- category: external-critique (comprehension)
- impact: 2
- ease: 9
- next: "(2 builds left)", singular for 1, pin in the nextStep test

### [ ] [1.8] /config: the "written rules" link does not say it opens GitHub (critique pass 33 LOW)
- category: external-critique (navigation)
- impact: 2
- ease: 9
- next: add "(on GitHub)" as on the home page

### [ ] [1.2] /decisions: "row N" links to Decided recently rows leave the page (critique pass 33 LOW)
- category: external-critique (navigation)
- impact: 2
- ease: 6
- next: ids on Decided recently items, link each number after "rows"

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

# Site audit — 2026-10-31 (pass 203, cloud tick)

Critique pass 33 (914aacb) filed five rows: one MED, four LOW. No issues are open for triage. The critique gate is closed (pass 33 ran at the last commit) and so is the expand gate (pass 21 ran 2 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Top of the queue: the pass 33 MED navigation row on /config, where the bar's Start run button opened /play with a seed and no player count, so it always started a solo run and failed when the saved Fewest players was 2 or more. A 7.2 (impact 6: every run started from /config, and co-op could not start there; ease 8: one button and one e2e test; bias x1.5). The button now reads "Set up a run" and opens the /play start panel, which offers the player counts the config allows and a seed. Next in line: the four pass 33 LOW rows (Combat model help wording, /decisions row links, the "written rules" link, the Build step unit), then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [7.2] /config: Start run always starts a solo run, and fails when the saved minimum is above 1 (critique pass 33 MED, bias x1.5)
- category: external-critique (navigation)
- impact: 6
- ease: 8
- next: point the bar button at the /play start panel, pin it in e2e
- issue: #257
- fixed: 216c617

### [ ] [1.8] /play: the Build step says "(2 left)" with no unit (critique pass 33 LOW)
- category: external-critique (comprehension)
- impact: 2
- ease: 9
- next: "(2 builds left)", singular for 1, pin in the nextStep test

### [ ] [1.8] /config: the "written rules" link does not say it opens GitHub (critique pass 33 LOW)
- category: external-critique (navigation)
- impact: 2
- ease: 9
- next: add "(on GitHub)" as on the home page

### [ ] [1.8] /config: the Combat model help still says "play Engage" (critique pass 33 LOW)
- category: external-critique (voice)
- impact: 2
- ease: 9
- next: reword the config.meta.json help string

### [ ] [1.2] /decisions: "row N" links to Decided recently rows leave the page (critique pass 33 LOW)
- category: external-critique (navigation)
- impact: 2
- ease: 6
- next: ids on Decided recently items, link each number after "rows"

# Site audit — 2026-10-30 (pass 202, cloud tick)

Pass 201's rule reading 70 fix shipped (d632676). No issues are open for triage. The critique gate is closed (pass 32 ran 8 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 18 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. No finding the loop can ship scores 3.0 or more, so there is no actionable iterate work. Handed to `/expand` (pass 21, bold posture). The five /decisions critique rows (three MED at 8.1 with the bias, two LOW) all edit `[needs-user-call]` items and wait for /oversight. The sim bot-policy row (critique LOW, user) is phase-sized. Checked this pass: every "you" and "your" string in `apps/web/src/play` (non-test) either names the seat in co-op through `seatName`, `whose` or a `seat` argument, or is solo-only (`nextStep.ts`, `engageView.ts`). The co-op wording drip from passes 189 to 199 found nothing new. Seat logic is now in 12 files, 25 sites.

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

### [ ] [1.4] /decisions: the Event Calendar check still cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 2
- ease: 7
- next: /oversight names the rules in words in that `[needs-user-call]` item

# Site audit — 2026-10-30 (pass 201, cloud tick)

Pass 200's /decisions case fix shipped (70ad49a). No issues are open for triage. The critique gate is closed (pass 32 ran 7 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 17 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 32 LOW voice row on /decisions, where rule reading 70 still called the upkeep saving "a table question". A 1.2 (impact 2: one sentence on one page; ease 6: one reading and a regenerated digest). The reading now says "whether fewer enemies to place each round saves time is a question for the physical edition.", and a DecisionsPage test pins it. Next in line: the rows that wait for /oversight; the next critique pass opens the queue again.

## Top 5 findings (scored)

### [x] [1.2] /decisions: rule reading 70 still calls the upkeep saving "a table question" (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 6
- next: reword row 70 in `OPEN-QUESTIONS.md`, regenerate `docs/DECISIONS.md`
- issue: #256
- fixed: d632676

# Site audit — 2026-10-30 (pass 200, cloud tick)

Pass 199's co-op map figure fix shipped (855d09c). No issues are open for triage. The critique gate is closed (pass 32 ran 6 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 16 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 32 LOW voice row on /decisions, where game terms changed case inside the page: "engagements" beside "Exchanges" in the intro, "lake or mountain" in row 61 while /tiles and /play write "Lake" and "Mountain", and "hit, miss or special" on /config while row 72, the rules and /play write "Hit", "Miss" and "Special". A 1.6 (impact 2: three lines on two pages; ease 8: three strings and two pinned tests). The intro now says "Combat uses Engagements by default.", row 61 says "Lake or Mountain", and the /config Enemy die faces help says "Hit, Miss or Special." Next in line: rule reading 70's wording, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.6] /decisions: game terms change case inside the page (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 8
- next: "Engagements" in the intro, "Lake or Mountain" in row 61, one case for die faces
- issue: #255
- fixed: 70ad49a

### [ ] [1.2] /decisions: rule reading 70 still calls the upkeep saving "a table question" (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 6
- next: reword row 70 in `OPEN-QUESTIONS.md`, regenerate `docs/DECISIONS.md`

# Site audit — 2026-10-30 (pass 199, cloud tick)

Pass 198's base health fix shipped (07a74ee). No issues are open for triage. The critique gate is closed (pass 32 ran 5 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 15 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the audit LOW a11y row on the /play map figure. In co-op its accessible name read "P2's figure at 0,0", taken from the short "P2" drawn on the token, while every other /play panel names the seat "Player 2". A 1.8 (impact 2: screen-reader users in co-op; ease 9: one label). The name now comes from `seatName` ("Player 2's figure at 0,0"); the token still shows "P2". A new PlayMap test pins the solo and co-op names. Next in line: the /decisions case row, then rule reading 70's wording, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /play: in co-op the map figure's accessible name says "P2's figure" (audit LOW)
- category: a11y
- impact: 2
- ease: 9
- next: use the seat name in `PlayMap.tsx` figure `aria-label`
- issue: #254
- fixed: 855d09c

### [ ] [1.6] /decisions: game terms change case inside the page (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 8
- next: "Engagements" in the intro, "Lake or Mountain" in row 61, one case for die faces

### [ ] [1.2] /decisions: rule reading 70 still calls the upkeep saving "a table question" (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 6
- next: reword row 70 in `OPEN-QUESTIONS.md`, regenerate `docs/DECISIONS.md`

# Site audit — 2026-10-30 (pass 198, cloud tick)

Pass 197's Knockout tick box fix shipped (f86dd08). No issues are open for triage. The critique gate is closed (pass 32 ran 4 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 14 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 32 LOW voice row on the /config base health help, which said "The run stops when it reaches 0." while the home page says "The run ends when the base falls." "Stops" can read as a pause. A 2.7 (impact 3: the first setting on /config; ease 9: one string). It now says "The run ends when it reaches 0." Next in line: the co-op map figure label, then the /decisions case row, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.7] /config: base health help says the run "stops" (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 9
- next: "The run ends when it reaches 0." in `config.meta.json`
- issue: #253
- fixed: 07a74ee

### [ ] [1.8] /play: in co-op the map figure's accessible name says "P2's figure" (audit LOW)
- category: a11y
- impact: 2
- ease: 9
- next: use the seat name in `PlayMap.tsx` figure `aria-label`

### [ ] [1.6] /decisions: game terms change case inside the page (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 8
- next: "Engagements" in the intro, "Lake or Mountain" in row 61, one case for die faces

### [ ] [1.2] /decisions: rule reading 70 still calls the upkeep saving "a table question" (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 6
- next: reword row 70 in `OPEN-QUESTIONS.md`, regenerate `docs/DECISIONS.md`

# Site audit — 2026-10-30 (pass 197, cloud tick)

Pass 196's Move cost fix shipped (8437dae). No issues are open for triage. The critique gate is closed (pass 32 ran 3 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 13 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 32 LOW voice row on the /config Knockout tick boxes. Both are ticked by default, but the materials help said "When on" with no default mark, and the currency help said "When on (default)" with a "too" that pointed back at it, while every other tick box on the page says "When ticked". A 2.7 (impact 3: two help lines on the page where a designer sets the knockout rules; ease 9: two strings). Both now say "When ticked (default), a knocked-out player loses all ...". Next in line: the /config base health wording, then the co-op map figure label, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.7] /config: Knockout tick boxes say "When on", only one marks its default (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 9
- next: "When ticked (default), ..." in `config.meta.json`
- issue: #252
- fixed: f86dd08

### [ ] [2.7] /config: base health help says the run "stops" (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 9
- next: "The run ends when it reaches 0." in `config.meta.json`

### [ ] [1.8] /play: in co-op the map figure's accessible name says "P2's figure" (audit LOW)
- category: a11y
- impact: 2
- ease: 9
- next: use the seat name in `PlayMap.tsx` figure `aria-label`

### [ ] [1.6] /decisions: game terms change case inside the page (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 8
- next: "Engagements" in the intro, "Lake or Mountain" in row 61, one case for die faces

### [ ] [1.2] /decisions: rule reading 70 still calls the upkeep saving "a table question" (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 6
- next: reword row 70 in `OPEN-QUESTIONS.md`, regenerate `docs/DECISIONS.md`

# Site audit — 2026-10-30 (pass 196, cloud tick)

Pass 195's rule reading 56 fix shipped (eead64e). No issues are open for triage. The critique gate is closed (pass 32 ran 2 commits ago) and so is the expand gate (pass 20 ran 12 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left all edit `[needs-user-call]` items, which /oversight owns. Top of the queue: the critique pass 32 LOW voice row. The home page map item said "the step costs 1 hex of movement" and the /config Move cost help began "Hexes a Move pays", while the log, /debug and the Move banner count the Move budget in movement. A 3.0 (impact 3: two lines a new player reads while learning Move; ease 10: two strings, their tests and the regenerated playtest kit). The map item now says "the step costs 1 movement." and the help begins "Movement a Move pays to enter a hex next to an enemy." Next in line: the /config Knockout and base health wording, then the co-op map figure label, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.0] / and /config: Move cost still given in hexes, not movement (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 10
- next: reword `ruleText.ts` map item and `config.meta.json` move-cost help, regenerate `docs/playtests/PROTOCOL.md`
- issue: #251
- fixed: 8437dae

### [ ] [2.7] /config: Knockout tick boxes say "When on", only one marks its default (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 9
- next: "When ticked (default), ..." in `config.meta.json`

### [ ] [2.7] /config: base health help says the run "stops" (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 9
- next: "The run ends when it reaches 0." in `config.meta.json`

### [ ] [1.8] /play: in co-op the map figure's accessible name says "P2's figure" (audit LOW)
- category: a11y
- impact: 2
- ease: 9
- next: use the seat name in `PlayMap.tsx` figure `aria-label`

### [ ] [1.6] /decisions: game terms change case inside the page (critique pass 32 LOW)
- category: external-critique
- impact: 2
- ease: 8
- next: "Engagements" in the intro, "Lake or Mountain" in row 61, one case for die faces

# Site audit — 2026-10-30 (pass 195, cloud tick)

Pass 194's co-op card chips fix shipped (a97bccc), and critique pass 32 filed 6 findings (96669d8). No issues are open for triage. The critique gate is closed (pass 32 ran at the last commit) and so is the expand gate (pass 20 ran 11 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Top of the queue: the critique pass 32 MED row. /decisions rule reading 56 said "An enemy attacks only its target", which is false in the default Engagements Combat, where every enemy next to the player rolls its dice (row 69 and the home page Combat step say so). A 7.2 (impact 6: the /decisions page is where the designer confirms readings, and the sentence contradicts two other texts; ease 8: one sentence and a regenerated doc; bias x1.5: external-critique MED). Row 56 now limits the sentence to targeting: "An enemy moves only toward its target, so a figure on the Base tile is never pulled". Next in line: the pass 32 LOW voice rows, then the co-op map figure label, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [7.2] /decisions: rule reading 56 says an enemy attacks only its target (critique pass 32 MED)
- category: external-critique
- impact: 6
- ease: 8
- next: reword row 56 in `OPEN-QUESTIONS.md`, regenerate `docs/DECISIONS.md`
- issue: #250
- fixed: (this commit)

### [ ] [3.0] / and /config: Move cost still given in hexes, not movement (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 10
- next: reword `ruleText.ts` map item and `config.meta.json` move-cost help

### [ ] [2.7] /config: Knockout tick boxes say "When on", only one marks its default (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 9
- next: "When ticked (default), ..." in `config.meta.json`

### [ ] [2.7] /config: base health help says the run "stops" (critique pass 32 LOW)
- category: external-critique
- impact: 3
- ease: 9
- next: "The run ends when it reaches 0." in `config.meta.json`

### [ ] [1.8] /play: in co-op the map figure's accessible name says "P2's figure" (audit LOW)
- category: a11y
- impact: 2
- ease: 9
- next: use the seat name in `PlayMap.tsx` figure `aria-label`

# Site audit — 2026-10-29 (pass 194, cloud tick)

Pass 193's co-op Shop hint fix shipped (8809bb7). No issues are open for triage. The critique gate is closed (pass 31 ran 11 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 9 commits ago). Phase 35 is still blocked on the designer's Skills session. Top of the queue: the item pass 193 saw while auditing. In co-op the × button that takes a dropped card back from the option chips was named "Keep the card in your hand", under a hand list named "Player 2's hand". Rescored as a11y to 3.0 (impact 3: the label is the button's only name, read on every co-op card drop with more than one option; ease 10: one prop, the seat name already at hand; no bias: LOW). It now reads "Keep the card in Player 2's hand" in co-op and "your hand" solo, through a `seat` prop the engagement modal fills from `seatName`, pinned by new CardStrip tests. Seen while auditing: the map figure's accessible name reads "P2's figure" in co-op, where the rest of the page says "Player 2's figure". Next in line: that label, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.0] /play: in co-op the card chips' back button says "your hand" (audit LOW)
- category: a11y
- impact: 3
- ease: 10
- next: name the seat in co-op in `CardStrip.tsx` `OptionChips`
- issue: #249
- fixed: (this commit)

### [ ] [1.8] /play: in co-op the map figure's accessible name says "P2's figure" (audit LOW)
- category: a11y
- impact: 2
- ease: 9
- next: use the seat name in `PlayMap.tsx` figure `aria-label`

# Site audit — 2026-10-29 (pass 193, cloud tick)

Pass 192's co-op draft and return dialog fix shipped (2814744). No issues are open for triage. The critique gate is closed (pass 31 ran 10 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 8 commits ago). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight and the sim bot-policy row, so this pass audited /play fresh for co-op wording. In co-op the Base panel's Shop hint still read "Buy a card while your figure is on the Base tile, with enough currency." under a Shop heading that says "Player 2 has 3 currency". A 3.2 (impact 4: the hint shows on every co-op turn after Shop I when the seat cannot buy, the same reach as the Base panel lines fixed at d0fc360; ease 8; no bias: LOW). It now reads "while Player 2's figure is on the Base tile" in co-op and "your figure" solo, through `whose`, pinned by a new BasePanel test. Seen while auditing: the card strip's back button is labelled "Keep the card in your hand" under a "Player 2's hand" list in co-op (screen readers only). Next in line: that label, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.2] /play: in co-op the Shop hint says "your figure" (audit LOW)
- category: voice
- impact: 4
- ease: 8
- next: name the seat in co-op in `BasePanel.tsx`
- issue: #248
- fixed: (this commit)

### [x] [1.6] /play: in co-op the card strip's back button says "your hand" (audit LOW)
- category: voice
- impact: 2
- ease: 8
- next: name the seat in co-op in `CardStrip.tsx` `OptionChips`

# Site audit — 2026-10-29 (pass 192, cloud tick)

Pass 191's co-op Skill dice hint fix shipped (39716c8). No issues are open for triage. The critique gate is closed (pass 31 ran 9 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 7 commits ago). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight and the sim bot-policy row, so this pass audited /play fresh for co-op wording. In co-op the Skill draft and starter-return dialog never said whose choice it was: the modal covers the banner and the Players panel that name the seat, its accessible name was only "Skill draft: keep a Skill" or "Return a starter card", and its options said "(from your pool)" and "(you have 4)". A 3.2 (impact 4: every co-op level up drafts once per seat, and a co-op card buy can return a starter; ease 8; no bias: LOW). In co-op the dialog now shows "Player 2" above the title and in its accessible name, and the options read "(from Player 2's pool)" and "(Player 2 has 4)", as the engagement modal does; solo is unchanged. Pinned by new DecisionDialog tests. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.2] /play: in co-op the draft and return dialog does not name the seat (audit LOW)
- category: voice
- impact: 4
- ease: 8
- next: name the seat in co-op in `DecisionDialog.tsx`
- issue: #247
- fixed: (this commit)

# Site audit — 2026-10-29 (pass 191, cloud tick)

Pass 190's co-op Base panel fix shipped (d0fc360). No issues are open for triage. The critique gate is closed (pass 31 ran 8 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 6 commits ago). Phase 35 is still blocked on the designer's Skills session. Top of the queue: the item pass 190 saw while auditing. In co-op a Skill with more slots than the seat has dice said "Needs 2 dice, you have 1. A level up or a card that adds a die gives you more." under a "Player 2's Skills" heading. Rescored to 3.2 (impact 4: shows on every co-op turn at 1 die with a 2-slot Skill, the same reach as the Base panel lines; ease 8; no bias: LOW). It now reads "Player 2 has 1 ... gives Player 2 more" in co-op and "you have" solo, through `seatName`, pinned by a new SkillBoard test. Next in line: the rows that wait for /oversight; the critique queue holds no other actionable row.

## Top 5 findings (scored)

### [x] [3.2] /play: in co-op the Skill dice hint says "you have 1" (audit LOW)
- category: voice
- impact: 4
- ease: 8
- next: name the seat in co-op in `SkillBoard.tsx`
- issue: #246
- fixed: (this commit)

# Site audit — 2026-10-29 (pass 190, cloud tick)

Pass 189's co-op enemy-dice subheading fix shipped (c98bce0). No issues are open for triage. The critique gate is closed (pass 31 ran 7 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 5 commits ago). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight and the sim bot-policy row, so this pass audited /play fresh for co-op wording. In co-op the Base panel still spoke to "you" about one seat's purse: the Build-card hint ended "You have 2 materials." and the Shop offers heading read "you have 3 currency", beside Hand, Skills and Dice panels that name the seat. A 3.2 (impact 4: both lines show on every co-op turn; ease 8; no bias: LOW). Both now read "Player 2 has" in co-op and "You have" solo, through `seatName`, pinned by new BasePanel tests. Seen while auditing: the Skill hint "Needs 2 dice, you have 1." in `SkillBoard.tsx` has the same co-op gap. Next in line: that hint, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.2] /play: in co-op the Base panel says "You have" for one seat's materials and currency (audit LOW)
- category: voice
- impact: 4
- ease: 8
- next: name the seat in co-op in `BasePanel.tsx`
- issue: #245
- fixed: (this commit)

### [ ] [2.4] /play: in co-op the Skill dice hint says "you have 1" (audit LOW)
- category: voice
- impact: 3
- ease: 8
- next: name the seat in co-op in `SkillBoard.tsx`

# Site audit — 2026-10-29 (pass 189, cloud tick)

Pass 188's movement-left fix shipped (d77cf3d). No issues are open for triage. The critique gate is closed (pass 31 ran 6 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 4 commits ago). Phase 35 is still blocked on the designer's Skills session. Top of the queue: in co-op the enemy-dice subheading in the Dice panel said "no enemy next to you" and "they hit you after your Skills" under a "Player 2's dice" heading. Rescored to 3.2 (impact 4: the subheading on every engagement turn in co-op, the same reach as the all-placed note fixed at 9e64aa5; ease 8; no bias: LOW). The subheading now names the seat in co-op and still speaks to "you" solo, pinned by new DiceTray tests. Next in line: the rows that wait for /oversight; the critique queue holds no other actionable row.

## Top 5 findings (scored)

### [x] [3.2] /play: in co-op the enemy-dice subheading still says "you" (critique LOW, pass 31)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: name the seat in co-op in `DiceTray.tsx`
- issue: #244
- fixed: (this commit)

# Site audit — 2026-10-29 (pass 188, cloud tick)

Pass 187's rule tag fix shipped (2f58448). No issues are open for triage. The critique gate is closed (pass 31 ran 5 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 3 commits ago). Phase 35 is still blocked on the designer's Skills session. Top of the queue: after a step the log read "(cost 2, 3 left)" and "it is impassable (1 left)" with no unit, while /debug called the same number "hexes", which is wrong when a step costs 2. Rescored to 3.2 (impact 4: the line after every step on /play, plus /debug and the Move banner; ease 8; no bias: LOW). All three now read "movement left", the word the engine uses for the Move budget, pinned by new move log tests and the updated /debug and banner tests. Next in line: the rows that wait for /oversight and the co-op enemy-dice subheading.

## Top 5 findings (scored)

### [x] [3.2] /play and /debug: "3 left" after a move has no unit (critique LOW, pass 31)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: name the unit ("movement left") in the log, /debug, and the Move banner
- issue: #243
- fixed: (this commit)

### [ ] [2.4] /play: in co-op the enemy-dice subheading still says "you" (critique LOW, pass 31)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: name the seat in co-op in `DiceTray.tsx`

# Site audit — 2026-10-29 (pass 187, cloud tick)

Pass 186's enemy move line fix shipped (66e0753). No issues are open for triage. The critique gate is closed (pass 31 ran 4 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 2 commits ago). Phase 35 is still blocked on the designer's Skills session. Top of the queue: the /play log tagged a Skill going to the draft pool "rule Draft pool (designer 2026-10-09)" and engagement events "rule engagements", neither a section a reader can look up. A 3.0 (impact 3, ease 8, no bias: LOW). The log note now reads "rule 7.8" for a section of the written rules and "not in the written rules" for any other tag, the /debug reading, pinned by a new test. Next in line: the rows that wait for /oversight and the low critique rows (co-op enemy-dice subheading, the unit of "3 left").

## Top 5 findings (scored)

### [x] [3.0] /play log: the rule tag prints "rule Draft pool (designer 2026-10-09)" (critique LOW, pass 31)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: use the /debug ruleTag reading in the /play log
- issue: #242
- fixed: (this commit)

### [ ] [2.4] /play: in co-op the enemy-dice subheading still says "you" (critique LOW, pass 31)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: name the seat in co-op in `DiceTray.tsx`

### [ ] [2.4] /play and /debug: "3 left" after a move has no unit (critique LOW, pass 31)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: name the unit ("movement left") in the log and /debug

# Site audit — 2026-10-29 (pass 186, cloud tick)

Pass 185's returned-starter line fix shipped (c1e3be6), and expand pass 20 filed 1 candidate (2585c5b). No issues are open for triage. The critique gate is closed (pass 31 ran 3 commits ago, under 24 hours) and so is the expand gate (pass 20 ran 1 commit ago). Phase 35 is still blocked on the designer's Skills session. Top of the queue: the enemy move line named the enemy by the hex it had just moved to, so "Grunt 1 hex north of the base center moves to Plains (0,-1)" said the grunt was already where it was going, and older move lines changed their wording each time it moved. A 4.5 (impact 5, ease 6, bias x1.5). The line now names the enemy where it stood before the move, from `event.from`, with its kind from the map or the log, pinned by a new log test. The damage and attack lines still name an enemy where it stands now, since their events carry no hex. Next in line: the rows that wait for /oversight and the low critique rows (rule tag, co-op enemy-dice subheading).

## Top 5 findings (scored)

### [x] [4.5] /play log: an enemy is named by where it stands now, not where it stood (critique MED, pass 31, bias x1.5)
- category: external-critique (comprehension)
- impact: 5
- ease: 6
- next: name the moving enemy from `event.from` with `kindFromBase`
- issue: #241
- fixed: (this commit)

### [ ] [3.0] /play log: the rule tag prints "rule Draft pool (designer 2026-10-09)" (critique LOW, pass 31)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: use the /debug ruleTag reading in the /play log

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-29 (pass 185, cloud tick)

Pass 184's destroyed Tower fix shipped (293e981), and critique pass 31 filed 5 rows (06a684f). No issues are open for triage. The critique gate is closed (pass 31 ran 1 commit ago) and so is the expand gate (pass 19 ran 19 commits and about 42 hours ago, under 20 and 48). Phase 35 is still blocked on the designer's Skills session. Top of the new critique rows: the returned-starter log line always read "Starter card a card leaves the game.", because the engine removes the card before the line names it, and in co-op it did not say who returned it. A 6.0 (impact 5, ease 8, bias x1.5). The `starterReturned` event now carries the card's definition, and the line reads "Player 2 returns Rest: it leaves the game." ("You return ..." solo), pinned by an engine test and a new log test. Next in line: the enemy move line that names an enemy by where it stands now (critique MED, pass 31).

## Top 5 findings (scored)

### [x] [6.0] /play log: the returned-starter line reads "Starter card a card leaves the game." (critique MED, pass 31, bias x1.5)
- category: external-critique (comprehension)
- impact: 5
- ease: 8
- next: carry the card definition on `starterReturned`; name the player and the card
- issue: #240
- fixed: (this commit)

### [ ] [4.5] /play log: an enemy is named by where it stands now, not where it stood (critique MED, pass 31, bias x1.5)
- category: external-critique (comprehension)
- impact: 5
- ease: 6
- next: name the moving enemy from `event.from` with `kindFromBase`

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 184, cloud tick)

Pass 183's miniature limit line fix shipped (9e43257). No issues are open for triage. The critique gate is closed (pass 30 ran 10 commits ago, under 24 hours) and so is the expand gate (pass 19 ran 17 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight and the sim bot-policy row, so this pass audited the /play log lines fresh. The log names pieces from the current state, so once a Tower was destroyed every line about it fell back to "a defense": "a defense is destroyed.", "a defense takes 2 damage (health 0).", lower case at the start of the sentence and with the Tower's name and place lost. A 3.6 (impact 4, ease 9). A destroyed defense is now named where it stood, from its build event in the log, and the defense lines start with a capital, pinned by a new log test. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.6] /play log: a destroyed Tower reads "a defense is destroyed." (audit, pass 184)
- category: voice
- impact: 4
- ease: 9
- next: name a destroyed defense from its build in the log; capitalise the defense lines
- issue: #239
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 183, cloud tick)

Pass 182's preset editor size line fix shipped (2298840). No issues are open for triage. The critique gate is closed (pass 30 ran 10 commits ago, under 24 hours) and so is the expand gate (pass 19 ran 16 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight and the sim bot-policy row, so this pass audited the /play log lines fresh. The miniature limit line named the grunt by relabelling the new elite: once that elite was defeated it read "Miniature limit: the elite becomes an elite.", after the elite moved it gave the elite's new place, and an ordinal meant for another elite could land on the grunt. A 3.6 (impact 4, ease 9). The line now names the grunt from the event's own hex through a shared `kindFromBase`, pinned by a new log test. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.6] /play log: the miniature limit line says "the elite becomes an elite" once that elite is defeated (audit, pass 183)
- category: voice
- impact: 4
- ease: 9
- next: name the grunt from the event's hex, not by relabelling the elite
- issue: #238
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 182, cloud tick)

Pass 181's deck shuffled log line fix shipped (418b03c). No issues are open for triage. The critique gate is closed (pass 30 ran 9 commits ago, under 24 hours) and so is the expand gate (pass 19 ran 15 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight and the sim bot-policy row, so this pass audited the shipped pages fresh for fixed plurals. Pass 180 made the deck preset label say "1 card", but the preset editor's own size line on /config still said "Deck: 1 cards" for a one-card preset. A 2.7 (impact 3, ease 9). Both now share one `cardCount` wording, pinned by a new unit test; the e2e check accepts either form. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.7] /config: the preset editor says "Deck: 1 cards" for a one-card preset (audit, pass 182)
- category: voice
- impact: 3
- ease: 9
- next: say "1 card" for a count of 1, as the preset label does
- issue: #237
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 181, cloud tick)

Pass 180's deck preset label fix shipped (cbc36d2). No issues are open for triage. The critique gate is closed (pass 30 ran 8 commits ago, same day) and so is the expand gate (pass 19 ran 14 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight and the sim bot-policy row, so this tick takes pass 180's next row. The /play log said "Your deck shuffled (1 cards)." for a one-card deck preset, while the preset label and the start text say "1 card". A 2.4 (impact 3, ease 8). The line now says "1 card" for a count of 1, pinned by a new deck log test. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.4] /play log: the deck shuffled line says "(1 cards)" for a one-card deck (audit, pass 180)
- category: voice
- impact: 3
- ease: 8
- next: say "1 card" for a count of 1
- issue: #236
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 180, cloud tick)

Pass 179's Defenses row fix shipped (0ffe618). No issues are open for triage. The critique gate is closed (pass 30 ran 7 commits ago, same day) and so is the expand gate (pass 19 ran 13 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight and the sim bot-policy row, so this pass audited the shipped pages fresh. The /debug Enemies row keeps "grunt" in lower case, as bearings writes it. Shipped this pass: a voice LOW on /config. The deck preset label said "Preset 1: 1 cards, hand of 5" for a one-card preset, while the start text for the same deck says "1 card". A 2.7 (impact 3, ease 9). The label now says "1 card" for a count of 1, pinned by a new unit test. Next in line: the log's "deck shuffled (1 cards)" line for a one-card deck, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.7] /config: a one-card deck preset reads "1 cards" (audit, pass 180)
- category: voice
- impact: 3
- ease: 9
- next: say "1 card" for a count of 1, as the start text does
- issue: #235
- fixed: (this commit)

### [ ] [2.4] /play log: the deck shuffled line says "(1 cards)" for a one-card deck (audit, pass 180)
- category: voice
- impact: 3
- ease: 8
- next: say "1 card" for a count of 1

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 179, cloud tick)

No issues are open for triage. The critique gate is closed (pass 30 ran 6 commits ago, same day) and so is the expand gate (pass 19 ran 12 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left in the queue wait for /oversight, so this tick takes the last pass 30 LOW row. On /debug the State panel Defenses row printed the kind in lower case ("d1 tower, 3 health, at (1,0)"), while the Impassable hexes row in the same panel capitalises terrain. The kind now goes through the same `capital` helper: "d1 Tower, 3 health, at (1,0)". The id prefix stays, as a /debug choice. A new StateView test pins the row.

## Top 5 findings (scored)

### [x] [3.6] /debug: the State panel Defenses row prints the kind in lower case (critique LOW, pass 30)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: capitalise the kind, as the Impassable hexes row does
- issue: #234
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 178, cloud tick)

No issues are open for triage. The critique gate is closed (pass 30 ran 5 commits ago, same day) and so is the expand gate (pass 19 ran 11 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left in the queue wait for /oversight, so this tick takes a pass 30 LOW row. On /config the three optional limits (Forced reveal every, Spawn ramp every, Spawn range) showed "off" in lower case beside "Maximum level Off", and the spawn ramp help kept the formula "(1 + (round - 1) / N, rounded down)". The placeholders now read "Off" and the formula is gone; /decisions still prints the value in lower case mid-sentence. New content tests pin capitalised placeholders and formula-free help.

## Top 5 findings (scored)

### [x] [3.6] /config: optional limits show "off" in lower case; spawn ramp help keeps a formula (critique LOW, pass 30)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "Off" placeholders, drop the formula
- issue: #233
- fixed: (this commit)

### [ ] [3.6] /debug: the State panel Defenses row prints the kind in lower case (critique LOW, pass 30)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: capitalise the kind, as the Impassable hexes row does

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 177, cloud tick)

No issues are open for triage. The critique gate is closed (pass 30 ran 4 commits ago, same day) and so is the expand gate (pass 19 ran 10 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left in the queue wait for /oversight, so this tick takes the last pass 30 LOW row. The blocked-step log line read "You cannot enter Lake (1,-1): it is Lake or Mountain (2 left).", naming the terrain and then guessing at it. The reason now says what the terrain does, in the word /tiles uses: "You cannot enter Lake (1,-1): it is impassable (2 left)." The "(2 left)" stays as on the move line beside it. The export log test pins the whole line.

## Top 5 findings (scored)

### [x] [3.6] /play: the blocked-step log line hedges "it is Lake or Mountain" (critique LOW, pass 30)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: say "it is impassable", as /tiles does
- issue: #232
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 176, cloud tick)

No issues are open for triage. The critique gate is closed (pass 30 ran 3 commits ago, same day) and so is the expand gate (pass 19 ran 9 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left in the queue wait for /oversight, so this tick takes the first pass 30 LOW row. The delayed-return log line read "No free base hex: You stay knocked out this round.", with a capital after the colon where other log lines use lower case. It now leads with the player and gives the reason after the colon: "You stay knocked out this round: no free base hex." solo, "Player 2 stays knocked out this round: no free base hex." in co-op. New knockout log tests pin both wordings.

## Top 5 findings (scored)

### [x] [3.6] /play: the delayed-return log line capitalises "You" after a colon (critique LOW, pass 30)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: lead with the player, reason after the colon
- issue: #231
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 175, cloud tick)

No issues are open for triage. The critique gate is closed (pass 30 ran 2 commits ago, same day) and so is the expand gate (pass 19 ran 8 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED critique rows left in the queue wait for /oversight, so this tick takes the cheapest pass 30 LOW row. In co-op the Dice panel's note under "Player 2's dice" still read "All your dice are on Skills." once every die was placed; the engagement window's copy of the note already named the seat. Both now share one owner-aware line: "All Player 2's dice are on Skills." in co-op, "All your dice are on Skills." solo. New DiceTray tests pin both wordings in and out of the engagement window.

## Top 5 findings (scored)

### [x] [3.6] /play: the Dice panel all-placed note says "your" under "Player 2's dice" (critique LOW, pass 30)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: use the owner-aware note in both places
- issue: #230
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-28 (pass 174, cloud tick)

No issues are open for triage. The critique gate is closed (pass 30 ran 1 commit ago, same day) and so is the expand gate (pass 19 ran 7 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Pass 30 filed one MED row that does not wait for /oversight: in co-op the engagement result still said "You dealt", "You healed", "You gained" under vitals that name "Player 2", and it gave the shared experience to "You" while the log says "All players gain". The result lines and the verdict now name the seat in co-op ("Player 2 dealt 3 damage.", "1 enemy die hit Player 2", "Player 2 was knocked out."), experience goes to "All players" and currency to the seat, and the heal line reads "healed 2 health." The seat comes from the engagement's own `engaged` event. Solo wording is unchanged apart from the heal line. The lines move into a pure `resultLines` helper in `engageView.ts`, pinned by new tests for both wordings.

## Top 5 findings (scored)

### [x] [9.0] /play: the engagement result says "You" in co-op and gives shared experience to one player (critique MED, pass 30, bias x1.5)
- category: external-critique (voice)
- impact: 6
- ease: 10
- next: name the seat in the result lines and verdict, experience to all players
- issue: #229
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-27 (pass 173, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 11 commits ago, same day) and so is the expand gate (pass 19 ran 4 commits ago). Phase 35 is still blocked on the designer's Skills session. The critique queue's open rows wait for /oversight or need a new bot policy, so this tick follows the last two ticks' heading fixes into the engagement window. In co-op the window covers the Players panel, yet its header line read "Health 5/8 Guard 1" with no owner, and screen readers heard the card strip as "Your hand" and the dice as "Your dice" on every player's turn. In co-op the line now starts with "Player 2", and the strip and dice list are named "Player 2's hand" and "Player 2's dice"; solo stays "Your". The "Your"/"Player N's" wording moves into one `whose` helper beside `seatName`, which the Hand, Skills and Dice headings now share. New EngageVitals, CardStrip and DiceTray tests pin both wordings.

## Top 5 findings (scored)

### [x] [3.2] /play: the engagement window does not say whose engagement it is (audit, pass 173)
- category: voice
- impact: 4
- ease: 8
- next: name the seat in the vitals line, the hand strip and the dice list in co-op
- issue: #228
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-27 (pass 172, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 10 commits ago, same day) and so is the expand gate (pass 19 ran 5 commits ago). Phase 35 is still blocked on the designer's Skills session. The critique queue's open rows wait for /oversight, so this tick follows last tick's Hand fix on /play. In co-op each seat has its own Skills and dice, but the Skills panel heading read just "Skills" and the Dice panel "Dice — roll 1 of 3", with "Your dice" under the enemy dice, on every player's turn. They now read "Player 2's Skills", "Player 2's dice — roll 1 of 3" and "Player 2's dice" in co-op, and "Your Skills", "Your dice" solo, the same wording as the Hand heading. The sections' accessible names stay "Skills" and "Dice". New SkillBoard and DiceTray tests pin both wordings.

## Top 5 findings (scored)

### [x] [3.2] /play: the Skills and Dice headings do not say whose they are (audit, pass 172)
- category: voice
- impact: 4
- ease: 8
- next: start both headings with whose Skills and dice they are
- issue: #227
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-27 (pass 171, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 9 commits ago, same day) and so is the expand gate (pass 19 ran 4 commits ago). Phase 35 is still blocked on the designer's Skills session. The critique queue's open rows wait for /oversight or need a new bot policy, so this tick audits /play afresh. In co-op every hand is open and the Players panel names each seat, but the Hand panel heading read "Hand — top halves up (Prepare) · deck 7 · discard 0" without saying whose hand it shows, though it changes with every turn. It now reads "Player 2's hand — ..." in co-op and "Your hand — ..." solo, the same wording as the log's whose(...) lines. The section's accessible name stays "Hand". A new Hand.test.tsx pins both wordings.

## Top 5 findings (scored)

### [x] [3.2] /play: the Hand panel heading does not say whose hand it is (audit, pass 171)
- category: voice
- impact: 4
- ease: 8
- next: start the heading with whose hand it is
- issue: #226
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-27 (pass 170, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 8 commits ago, same day) and so is the expand gate (pass 19 ran 3 commits ago). Phase 35 is still blocked on the designer's Skills session. The pass-29 critique queue is drained and its MED rows wait for /oversight, so this tick ships the item the last tick saw while testing. The /debug State panel's Tiles row ended with "; waiting to place: p1": those are players whose figure is not on the map yet, named by engine id, inside a row about tiles. They now get their own "Figures to place" row ("Player 2"), shown only while a figure waits. Two StateView tests pin the row and its absence.

## Top 5 findings (scored)

### [x] [3.2] /debug: the Tiles row lists figures to place by engine id (audit, pass 170)
- category: voice
- impact: 4
- ease: 8
- next: own "Figures to place" row named by player number
- issue: #225
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-27 (pass 169, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 7 commits ago, same day) and so is the expand gate (pass 19 ran last tick). Phase 35 is still blocked on the designer's Skills session. The /decisions MED rows still wait for /oversight, so the last pass-29 LOW row ships. The /debug State panel headed each player with the engine id ("Player p1"), printed "orientation top", named impassable hexes in lower case ("lake at (1,-1)") and showed the exchange step as a raw id ("engagement: targets"); the step status line said "Round 1, setup." under a panel that says "Setup". Players are now "Player 1", "Player 2"; the row says "top halves up"; terrain reads "Lake", "Mountain"; the exchange step reads "Exchange: Pick targets"; and stepStatus shares the panel's PHASE_WORDS ("Round 1, Setup."). A new StateView test pins the player heading, halves and step words; the Lake/Mountain and stepStatus tests follow. Seen while testing: the Tiles row still lists unplaced tiles by id ("waiting to place: p1"), a candidate for the next critique pass. The pass-29 queue is drained; what remains waits for /oversight.

## Top 5 findings (scored)

### [x] [3.2] /debug: State panel and step status print raw engine ids (critique LOW, pass 29)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: player numbers, halves in words, capital terrain, PHASE_WORDS and step words
- issue: #224
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-27 (pass 168, cloud tick)

No issues are open for triage (#223, the push 403 from run 40468433445, waits for the user). The critique gate is closed (pass 29 ran 5 commits ago, same day) and so is the expand gate (pass 18, about 47 hours and 19 commits ago). Phase 35 is still blocked on the designer's Skills session. The /decisions MED rows still wait for /oversight, so the next pass-29 LOW row ships: the fix the 403 tick could not push. The /play log told drawing, playing, discarding, healing, guard, moving, gathering, building, buying, drafting and gaining in the past tense but engaging, repairing and losing health in the present, beside enemy lines that are all present. Every player-action line is now present tense with verb agreement ("You build a Tower", "Player 2 builds a Tower", "All players gain 2 experience"); tenseLog.test.ts pins all 13 lines solo and co-op, and the older log tests follow. The engagement result readout stays past tense: it sums up a finished fight. The next tick takes the next pass-29 LOW row (/debug raw engine ids).

## Top 5 findings (scored)

### [x] [3.2] /play log: player actions mix past and present tense (critique LOW, pass 29)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: one tense for every player action line
- issue: #222
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

# Site audit — 2026-10-27 (pass 167, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 4 commits ago, same day) and so is the expand gate (pass 18, about 44 hours and 18 commits ago). Phase 35 is still blocked on the designer's Skills session. The /decisions MED rows still wait for /oversight, so the top pass-29 LOW row ships. In co-op the /play log named whose dice rolled and rerolled ("Player 2's die 1 rerolled: Star.") but not whose die was kept, released, placed on a Skill or taken back ("Die 1 kept."). Those three lines now start the same way: "Player 2's die 1 kept." in co-op, "Your die 1 kept." solo; a unit test pins all four wordings both ways. The next tick takes the next pass-29 LOW row (the log's mixed past and present tense).

## Top 5 findings (scored)

### [x] [3.6] /play log: kept, placed and taken-back die lines do not name whose die (critique LOW, pass 29)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: start the three die lines with whose(...)
- issue: #221
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [3.2] /play log: player actions mix past and present tense (critique LOW, pass 29)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: one tense for every player action line

# Site audit — 2026-10-27 (pass 166, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 3 commits ago, same day) and so is the expand gate (pass 18, about 43 hours and 17 commits ago). Phase 35 is still blocked on the designer's Skills session. The /decisions MED rows still wait for /oversight, so the top pass-29 LOW row ships. Experience is shared by every player, but its /play log line had no subject ("+2 experience (5).") right before a currency line that names one player. It now reads "All players gained 2 experience (now 5)." in co-op and "You gained ..." solo, in the same past tense as the currency line; a unit test pins both. The next tick takes the next pass-29 LOW row (whose die was kept, placed or taken back).

## Top 5 findings (scored)

### [x] [3.6] /play log: the experience line has no subject next to a currency line that names a player (critique LOW, pass 29)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: "All players gained N experience (now M)." in co-op, "You gained ..." solo
- issue: #220
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [3.6] /play log: kept, placed and taken-back die lines do not name whose die (critique LOW, pass 29)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: start the three die lines with whose(...)

# Site audit — 2026-10-27 (pass 165, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 2 commits ago, same day) and so is the expand gate (pass 18, about 41 hours and 16 commits ago). Phase 35 is still blocked on the designer's Skills session. Shipped: the other pass-29 MED row. On / the Defenses, map and Enemies items sat in a second list right after the numbered Prepare and Combat steps, with no lead-in and a near-identical style, so they read like steps 3 to 5. An 8.1 (impact 6, ease 9, bias x1.5). A lead-in "On the board, every round:" now labels the list, and the list drops its bullets for a rule down its left edge; a unit test pins it. The next tick takes the top remaining row; the /decisions MED rows still wait for /oversight, so the pass-29 LOW rows are next.

## Top 5 findings (scored)

### [x] [8.1] /: the Defenses, map and Enemies list reads like more steps of a round (critique MED, pass 29, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: a short lead-in before the list and its own list style
- issue: #219
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: waits for /oversight

### [ ] [3.6] /play log: the experience line has no subject next to a currency line that names a player (critique LOW, pass 29)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: "All players gain N experience (now M)." in co-op, "You gain ..." solo

# Site audit — 2026-10-27 (pass 164, cloud tick)

No issues are open for triage. The critique gate is closed (pass 29 ran 1 commit ago, same day) and so is the expand gate (pass 18, about 40 hours and 15 commits ago). Phase 35 is still blocked on the designer's Skills session. Critique pass 29 filed 2 new MED rows; this pass took the first. Shipped: the Defenses item on / never said that a Tower's kill pays the player who built it, which the engine does (8.2, rows 40 and 53), so in co-op a "Player 2 gained 1 currency" line in Player 1's Combat had no explanation anywhere. An 8.1 (impact 6, ease 9, bias x1.5). `defenseText` now adds "When a Tower defeats an enemy, the player who built it gets the currency." after each defense with an attack, pinned by the unit test. The next tick takes the other pass-29 MED row (the Defenses, map and Enemies list reads like more steps).

## Top 5 findings (scored)

### [x] [8.1] /: the home page never says a Tower's kill pays the player who built it (critique MED, pass 29, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: add the builder-pays sentence to `defenseText`
- issue: #218
- fixed: (this commit)

### [ ] [8.1] /: the Defenses, map and Enemies list reads like more steps of a round (critique MED, pass 29, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: a short lead-in before the list and its own list style

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

# Site audit — 2026-10-26 (pass 163, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 10 commits ago, same day) and so is the expand gate (pass 18, about 28 hours and 15 commits ago). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight, so this pass took the row pass 162 left next in line. Shipped this pass: a bug LOW in the /play log, the same shape as passes 160 to 162. Every player rolls their own dice, but the roll, reroll, extra-dice, damage-bonus and Skill-fired lines ("Roll 1: hit, blank.", "Strike fires.") named no player, so in co-op a reader could not tell whose roll or Skill each line was. A 3.2 (impact 4, ease 8). The lines now read "Player 2's roll 1: ...", "Player 2's die 2 rerolled: ...", "Player 2's extra dice rolled: ...", "+1 damage for Player 2's next damage Skill." and "Player 2's Strike fires." ("Your ..." in a solo run), pinned by a new unit test. The next tick re-audits.

## Top 5 findings (scored)

### [x] [3.2] /play log: the roll, reroll, extra-dice, damage-bonus and Skill-fired lines name no player (audit, pass 162)
- category: bug
- impact: 4
- ease: 8
- next: name the owner, as the deck, build, upgrade and currency lines do
- issue: #217
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

# Site audit — 2026-10-26 (pass 162, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 9 commits ago, same day) and so is the expand gate (pass 18, 12 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight, so this pass audited the shipped pages fresh. Shipped this pass: a bug LOW in the /play log, the same shape as passes 160 and 161. At each phase start every player's deck turns at once, and the log printed "Deck shuffled (10 cards)." and "Deck turned: bottom halves up." once per player with no name, so in co-op the lines repeated and did not say whose deck each was. A 3.6 (impact 4, ease 9). The lines now read "Player 2's deck shuffled (10 cards)." and "Player 2's deck turned: bottom halves up." ("Your deck ..." in a solo run), pinned by a new unit test. Next in line: the roll and Skill lines ("Roll 1: ...", "Strike fires.") also carry a player the log does not name; the next tick re-audits.

## Top 5 findings (scored)

### [x] [3.6] /play log: the deck lines do not say whose deck turned (audit, pass 162)
- category: bug
- impact: 4
- ease: 9
- next: name the owner, as the build, upgrade and currency lines do
- issue: #216
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [3.2] /play log: the roll, reroll, extra-dice, damage-bonus and Skill-fired lines name no player (audit, pass 162)
- category: bug
- impact: 4
- ease: 8
- next: name the player on each, as the card-played line does

# Site audit — 2026-10-26 (pass 161, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 8 commits ago, same day) and so is the expand gate (pass 18, 11 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight, so this pass audited the shipped pages fresh. Shipped this pass: a bug LOW in the /play log, the same shape as pass 160. A build read "Tower built on Plains (1,0) for 3 materials." and an upgrade "Shop I bought for 2 materials (base health 12)." Materials belong to one player, and a Tower's defeats pay its builder, so in co-op the log did not say who paid. A 3.6 (impact 4, ease 9). The lines now read "Player 2 built a Tower on ... for 3 materials." and "Player 2 bought Shop I for 2 materials ..." ("You" in a solo run), pinned by a new unit test. Next in line: the rows that wait for /oversight; the next tick re-audits.

## Top 5 findings (scored)

### [x] [3.6] /play log: build and upgrade lines do not say which player paid (audit, pass 161)
- category: bug
- impact: 4
- ease: 9
- next: name the player, as the gather, card-bought and currency lines do
- issue: #215
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

# Site audit — 2026-10-26 (pass 160, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 7 commits ago, same day) and so is the expand gate (pass 18, 10 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight, so this pass audited the shipped pages fresh. Shipped this pass: a bug LOW in the /play log. When an enemy was defeated, the currency line read "+3 currency (5)." and named no one, though currency belongs to one player (8.2) and a Tower's defeat pays the player who built it. In co-op the log did not say who got it. A 3.6 (impact 4, ease 9). The line now reads "Player 2 gained 3 currency (now 5)." ("You gained" in a solo run), pinned by a new unit test. Next in line: the rows that wait for /oversight; the next tick re-audits.

## Top 5 findings (scored)

### [x] [3.6] /play log: the currency line does not say which player got it (audit, pass 160)
- category: bug
- impact: 4
- ease: 9
- next: name the player, as the guard and gather lines do
- issue: #214
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

# Site audit — 2026-10-26 (pass 159, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 6 commits ago, same day) and so is the expand gate (pass 18, 9 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Shipped this pass: the critique LOW on the / Prepare step. One list item joined the card halves, Barricade and Tower stats, the base's health, tile reveal, spawns and enemy targeting, and filled several screens at 375px. A 2.0 (impact 3, ease 7), named next in line by pass 158; the two 8.1 rows above it wait for /oversight. Prepare now keeps to the card-halves sentence, and Defenses, The map and Enemies follow as their own short items. Next in line: the /decisions rows wait for /oversight; the next tick re-audits.

## Top 5 findings (scored)

### [x] [2.0] /: the Prepare step is one long item that also explains enemy targeting (critique LOW, pass 28)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: keep Prepare to the card-halves sentence; move defenses, reveal and enemies into their own items
- issue: #213
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

# Site audit — 2026-10-26 (pass 158, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 5 commits ago, same day) and so is the expand gate (pass 18, 10 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Shipped this pass: the critique LOW on the Engine console State panel. The map's text alternative read "Map: 1 tiles." and the panel printed upgrades, milestones, the phase and the end reason as raw ids ("shop-1", "survive-round-5", "3 / prepare", "(ended: base)"). A 2.1 (impact 3, ease 7), named next in line by pass 157. The map now says "1 tile", upgrades and milestones carry their names, the phase reads Setup, Prepare, Combat or Run over, and an ended run says "(the base fell)". Next in line: the / Prepare step split (critique LOW, pass 28, 2.0).

## Top 5 findings (scored)

### [x] [2.1] /debug: "Map: 1 tiles." and raw engine ids in the State panel (critique LOW, pass 28)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: say "1 tile"; name upgrades, milestones, phase and end reason in words
- issue: #212
- fixed: 29e9061

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.0] /: the Prepare step is one long item that also explains enemy targeting (critique LOW, pass 28)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: keep Prepare to the card-halves sentence; move defenses, reveal and enemies into their own items

# Site audit — 2026-10-26 (pass 157, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 4 commits ago, same day) and so is the expand gate (pass 18, 9 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Shipped this pass: the critique LOW on the /play hit line. After a target pick the status line said "Strike hit grunt, 1 hex east for 2. 1 health left.", and "1 hex east for 2" is hard to parse by ear. A 2.4 (impact 3, ease 8), named next in line by pass 156. It now says "Strike hit grunt, 1 hex east: 2 damage, 1 health left." Next in line: the /debug "Map: 1 tiles." and raw engine ids (critique LOW, pass 28, 2.1).

## Top 5 findings (scored)

### [x] [2.4] /play: the spoken hit line says "for 2" with no unit (critique LOW, pass 28)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: say "Strike hit grunt, 1 hex east: 2 damage, 1 health left."
- issue: #211
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.1] /debug: "Map: 1 tiles." and raw engine ids in the State panel (critique LOW, pass 28)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: use count() for tiles; name upgrades, milestones, phase and end reason in words

### [ ] [2.0] /: the Prepare step is one long item that also explains enemy targeting (critique LOW, pass 28)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: keep Prepare to the card-halves sentence; move defenses, reveal and enemies into their own items

# Site audit — 2026-10-26 (pass 156, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 3 commits ago, same day) and so is the expand gate (pass 18, 8 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Shipped this pass: the critique LOW on the Engine console map. Terrain was a colour only, the State text never named the lake and mountain hexes, and spawn nodes were "s" and "S", which a screen reader does not tell apart. A 2.1 (impact 3, ease 7), named next in line by pass 155 (the /play hit line scores 2.4 and is next). The elite spawn node is now "E" and the State panel lists the impassable hexes. Next in line: the /play hit line (critique LOW, pass 28, 2.4).

## Top 5 findings (scored)

### [x] [2.1] /debug: map terrain is colour-only and spawn marks differ only by case (critique LOW, pass 28)
- category: external-critique (a11y)
- impact: 3
- ease: 7
- next: mark the elite spawn node "E" and list lake and mountain hexes in the State text
- issue: #210
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.4] /play: the spoken hit line says "for 2" with no unit (critique LOW, pass 28)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: say "Strike hit the grunt 1 hex east: 2 damage, 1 health left."

### [ ] [2.1] /debug: "Map: 1 tiles." and raw engine ids in the State panel (critique LOW, pass 28)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: use count() for tiles; name upgrades, milestones, phase and end reason in words

# Site audit — 2026-10-26 (pass 155, cloud tick)

No issues are open for triage. The critique gate is closed (pass 28, 2 commits ago, same day) and so is the expand gate (pass 18, 7 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Shipped this pass: the critique MED on the Engine console's rule tags. The intro said numbers in [brackets] are rules sections, but Combat events showed "[Combat v3]" and draft events "[Draft pool (designer 2026-10-09)]". A 5.3 (impact 5, ease 7, bias x1.5). Non-numeric tags now read "[not in the written rules]" and the intro says so. Next in line: the /debug map's colour-only terrain and case-only spawn marks (critique LOW, pass 28).

## Top 5 findings (scored)

### [x] [5.3] /debug: the intro says bracketed tags are rule sections, but Combat events show "[Combat v3]" (critique MED, pass 28, bias x1.5)
- category: external-critique (comprehension)
- impact: 5
- ease: 7
- next: show non-numeric tags in words and reword the intro
- issue: #209
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.4] /play: the spoken hit line says "for 2" with no unit (critique LOW, pass 28)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: say "Strike hit the grunt 1 hex east: 2 damage, 1 health left."

# Site audit — 2026-10-26 (pass 153, cloud tick)

Pass 152's Copy replay fix shipped (6948e73). No issues are open for triage. The critique gate is closed (pass 27, 10 commits ago, under 24 hours) and so is the expand gate (pass 18, 2 commits ago). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight, so this pass audited the shipped pages fresh. Shipped this pass: a bug LOW on the Engine console. The State panel said "1 materials" for a player holding one material and "Move: 1 hexes left" for a Move with one hex left, though the same line already says "1 die". A 2.4 (impact 3, ease 8). Both counts now take the singular for 1, pinned by a new StateView unit test. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.4] /debug: the State panel says "1 materials" and "1 hexes left" (audit, pass 153)
- category: bug
- impact: 3
- ease: 8
- next: say "1 material" and "1 hex left" for a count of 1
- issue: #207
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.0] /decisions: the Event Calendar check cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: /oversight rewrites the [needs-user-call] Event Calendar item in words

### [ ] [1.2] sim: the bot cannot measure today's designer changes (critique LOW, session residue)
- category: external-critique (sim)
- impact: 3
- ease: 4
- next: a phase-sized bot policy change; belongs with /expand or /oversight

# Site audit — 2026-10-25 (pass 152, cloud tick)

Pass 151's run summary health chart fix shipped (bacf29d), and expand pass 18 found no new candidates (d03f0fb). No issues are open for triage. The critique gate is closed (pass 27, 8 commits ago, under 24 hours) and so is the expand gate (pass 18 ran last commit). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight, so this pass audited the shipped pages fresh. Shipped this pass: a bug LOW on the Engine console. After Copy replay the button said "Replay copied" through every later action until New run, though the copied replay no longer matched the run, and a refused clipboard write failed silently. A 2.4 (impact 3, ease 8). Every step now clears the label, and a refused write says "Copy failed", pinned by the debug e2e. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.4] /debug: Copy replay still says "Replay copied" after more actions (audit, pass 152)
- category: bug
- impact: 3
- ease: 8
- next: clear the copied state on every step; say "Copy failed" when the clipboard refuses
- issue: #206
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.0] /decisions: the Event Calendar check cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: /oversight rewrites the [needs-user-call] Event Calendar item in words

### [ ] [1.2] sim: the bot cannot measure today's designer changes (critique LOW, session residue)
- category: external-critique (sim)
- impact: 3
- ease: 4
- next: a phase-sized bot policy change; belongs with /expand or /oversight

# Site audit — 2026-10-25 (pass 151, cloud tick)

Pass 150's /config preset button fix shipped (f021080). No issues are open for triage. The critique gate is closed (pass 27, 7 commits ago, under 24 hours) and so is the expand gate (pass 17, 19 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The critique queue holds only rows that wait for /oversight, so this pass audited the shipped pages fresh. Shipped this pass: an a11y LOW. The run summary's base health chart labelled each bar "1: 10", so a screen reader heard a number, a colon and a number with no word for round or health. A 2.4 (impact 3, ease 8). The short label is now hidden from screen readers, which hear "Round 1: base health 10", pinned by a RunSummary unit test. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.4] /play: the run summary health chart reads "1: 10" to screen readers (audit, pass 151)
- category: a11y
- impact: 3
- ease: 8
- next: hide the short label and add "Round N: base health H" as visually hidden text
- issue: #205
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.0] /decisions: the Event Calendar check cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: /oversight rewrites the [needs-user-call] Event Calendar item in words

### [ ] [1.2] sim: the bot cannot measure today's designer changes (critique LOW, session residue)
- category: external-critique (sim)
- impact: 3
- ease: 4
- next: a phase-sized bot policy change; belongs with /expand or /oversight

# Site audit — 2026-10-25 (pass 150, cloud tick)

Pass 149's cancelled-die line fix shipped (84a8dfd). No issues are open for triage. The critique gate is closed (pass 27, 6 commits ago, under 24 hours) and so is the expand gate (pass 17, 18 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED rows above the LOWs all wait for /oversight. Shipped this pass: the pass 27 a11y LOW. The /config card remove button was named "Remove preset 1: card 1", so it started like the whole-preset "Remove preset" button, which had no number, and the Id help ended on a preposition. A 2.4 (impact 3, ease 8). The buttons now read "Remove card 1 from preset 1" and "Remove preset 1", and the help reads "Id: a short name for this preset. Saved configs use it to find the preset.", pinned by the /config e2e. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.4] /config: the preset card remove button sounds like "Remove preset" (critique LOW, pass 27)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: "Remove card N from preset P" and "Remove preset P", and reword the Id help
- issue: #204
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.0] /decisions: the Event Calendar check cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: /oversight rewrites the [needs-user-call] Event Calendar item in words

### [ ] [1.2] sim: the bot cannot measure today's designer changes (critique LOW, session residue)
- category: external-critique (sim)
- impact: 3
- ease: 4
- next: a phase-sized bot policy change; belongs with /expand or /oversight

# Site audit — 2026-10-25 (pass 149, cloud tick)

Pass 148's log wording fix shipped (94683e4). No issues are open for triage. The critique gate is closed (pass 27, 5 commits ago, under 24 hours) and so is the expand gate (pass 17, 16 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED rows above the LOWs all wait for /oversight. Shipped this pass: the pass 27 voice LOW. The cancelled-die line read "A die of grunt is cancelled: grunt was defeated.", naming the defeated enemy twice with no article. A 2.4 (impact 3, ease 8). The line now reads "The defeated grunt's die is cancelled.", pinned by an exportRun unit test. Next in line: the /config preset button names, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.4] /play log: the cancelled-die line names the defeated enemy twice with no article (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: "The defeated grunt's die is cancelled." in describeEvent
- issue: #203
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.4] /config: the preset card remove button sounds like "Remove preset" (critique LOW, pass 27)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: "Remove card N from preset P" and "Remove preset P", and reword the Id help

### [ ] [2.0] /decisions: the Event Calendar check cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: /oversight rewrites the [needs-user-call] Event Calendar item in words

# Site audit — 2026-10-25 (pass 148, cloud tick)

Pass 147's upgrade hint fix shipped (d274490). No issues are open for triage. The critique gate is closed (pass 27, 4 commits ago, under 24 hours) and so is the expand gate (pass 17, 16 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED rows above the LOWs all wait for /oversight. Shipped this pass: the pass 27 voice LOW. The log's attack, siege, tower and repair lines ended in a bare number while nearby lines say "takes 2 damage", and the blocked-step line wrote terrain in lower case. A 2.4 (impact 3, ease 8). The lines now say "for 2 damage", "by 2 health" and "Lake or Mountain", pinned by an exportRun unit test. Next in line: the cancelled-die line, the /config preset button names, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.4] /play log: attack and repair lines end in a bare number; terrain is lower case (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: "for 2 damage", "repairs the base by 2 health", "Lake or Mountain" in describeEvent
- issue: #202
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.4] /play log: the cancelled-die line names the defeated enemy twice with no article (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: "The defeated grunt's die is cancelled." with the article helper in describeEvent

### [ ] [2.4] /config: the preset card remove button sounds like "Remove preset" (critique LOW, pass 27)
- category: external-critique (a11y)
- impact: 3
- ease: 8
- next: "Remove card N from preset P" and "Remove preset P", and reword the Id help

# Site audit — 2026-10-25 (pass 147, cloud tick)

Pass 146's milestone list fix shipped (149cdaa). No issues are open for triage. The critique gate is closed (pass 27, 3 commits ago, under 24 hours) and so is the expand gate (pass 17, 15 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED rows above the LOWs all wait for /oversight. Shipped this pass: the pass 27 voice LOW. The hint under the upgrade tracks read "You have 1 materials." while the Buy button in the same panel already says "1 material". A 2.7 (impact 3, ease 9). The hint now uses the panel's `materials` helper, and a BasePanel unit test pins 1 and 2. Next in line: the log wording, the cancelled-die line, the /config preset button names, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.7] /play: the upgrade hint says "You have 1 materials" (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: use the `materials` helper in the BasePanel hint, with a unit test
- issue: #201
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.4] /play log: attack and repair lines end in a bare number; terrain is lower case (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: "for 2 damage", "repairs the base by 2 health", "Lake or Mountain" in describeEvent

### [ ] [2.4] /play log: the cancelled-die line names the defeated enemy twice with no article (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: "The defeated grunt's die is cancelled." with the article helper in describeEvent

# Site audit — 2026-10-25 (pass 146, cloud tick)

Pass 145's Base panel fix shipped (af6b6e9). No issues are open for triage. The critique gate is closed (pass 27, 2 commits ago, under 24 hours) and so is the expand gate (pass 17, 13 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. The MED rows above the LOWs all wait for /oversight. Shipped this pass: the pass 27 a11y LOW. Each milestone item said met or not met only by a check mark or an en dash and a colour, so a screen reader heard "check mark" or nothing. A 2.7 (impact 3, ease 9). The glyph is now `aria-hidden` and visually hidden "Met:" or "Not met:" text comes before each label, in the base panel and the run summary. Next in line: the "1 materials" hint, the log wording, the /config preset button names, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.7] /play: the milestone list tells met from not met only by a glyph (critique LOW, pass 27)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: `aria-hidden` glyph and visually hidden "Met:" / "Not met:" text in MilestoneList, with a unit test
- issue: #200
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.7] /play: the upgrade hint says "You have 1 materials" (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: use the `materials` helper in the BasePanel hint

### [ ] [2.4] /play log: attack and repair lines end in a bare number; terrain is lower case (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: "for 2 damage", "repairs the base by 2 health", "Lake or Mountain" in describeEvent

# Site audit — 2026-10-25 (pass 145, cloud tick)

Pass 144's log line fix shipped (a3ab1b5), then critique pass 27 filed 6 findings (73726d0). No issues are open for triage. The critique gate is closed (pass 27, 1 commit ago) and so is the expand gate (pass 17, 12 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Shipped this pass: the pass 27 MED. The /play base panel priced Shop II, Shop III, Training II and Training III like tiers a player can buy, though under the default rules Build cards buy only the tier I upgrades, and its Build-card hint stayed up after both were bought. An 8.1 (impact 6, ease 9, bias x1.5). Those tiers now read "out of reach", one line gives the reason in the milestone list's words, and the hint shows only while a tier in reach is left. Next in line: the pass 27 LOW rows (the "1 materials" hint, the milestone list's met/not met text, the log wording, the /config preset button names), then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [8.1] /play: the Base panel prices upgrade tiers Build cards can never buy (critique MED, pass 27, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: "out of reach" on tiers outside `upgradesReachable`, the reason from `upgradesReachNote`, the Build-card hint only while a tier in reach is left; BasePanel and content unit tests
- issue: #199
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [2.7] /play: the milestone list tells met from not met only by a glyph (critique LOW, pass 27)
- category: external-critique (a11y)
- impact: 3
- ease: 9
- next: `aria-hidden` glyph and visually hidden "met" / "not met" text in MilestoneList

### [ ] [2.7] /play: the upgrade hint says "You have 1 materials" (critique LOW, pass 27)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: use the `materials` helper in the BasePanel hint

# Site audit — 2026-10-25 (pass 144, cloud tick)

Pass 143's Buy upgrade price fix shipped (ec50ca8). No issues are open for triage. The critique gate is closed (pass 26, 10 commits ago, under 24 hours since the pass ran) and so is the expand gate (pass 17, 11 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row the site can act on waits for /oversight. Shipped this pass: the next-in-line log line. A Mason or Engineer Build can bring a build or an upgrade down to 1 material, and the /play log said "for 1 materials" in both lines. A 1.8 (impact 2, ease 9), shipped as pass 126's gather line was. One `materials` helper in describeEvent now names every materials amount (gather, build, upgrade, knockout), and an exportRun unit test pins a cost of 1 and of 2. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /play: a Mason or Engineer Build logs "for 1 materials"
- category: content-gaps (voice)
- impact: 2
- ease: 9
- next: one `materials` helper in describeEvent for the gather, build, upgrade and knockout lines, with an exportRun unit test
- issue: #198
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49, 50 and 55 from that item

### [ ] [2.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: /oversight rewords the item to name the "Reset to defaults" button and a readable date, or closes it

# Site audit — 2026-10-24 (pass 143, cloud tick)

Pass 142's /decisions citation guard shipped (ec2ebf6). No issues are open for triage. The critique gate is closed (pass 26, 9 commits ago, under 24 hours) and so is the expand gate (pass 17, 10 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row the site can act on waits for /oversight. Checked this pass: the prices the /play base panel shows against the prices the engine charges. With a Mason or Engineer Build active on the base, the Buy button for an upgrade showed the list price, while `legalUpgrades` charges it less the card's cut. An Engineer Build read "Buy Training I (3 materials)" and took 1 material. A 4.5 (impact 5, ease 9). The engine now exports `legalUpgrades`, the button shows the price it returns, "1 material" is singular, and a BasePanel unit test pins a plain Build and an Engineer Build. Next in line: the "Barricade built for 1 materials." log line a Mason Build gives, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [4.5] /play: the Buy upgrade button shows the list price, not the Mason or Engineer price
- category: bugs
- impact: 5
- ease: 9
- next: show the engine's `legalUpgrades` price on the button, singular "1 material", and a BasePanel unit test
- issue: #197
- fixed: (this commit)

### [x] [1.8] /play: a Mason Build logs "Barricade built for 1 materials."
- category: content-gaps (voice)
- impact: 2
- ease: 9
- next: singular "1 material" in the build and upgrade log lines, with an exportRun unit test
- fixed: in pass 144 (issue #198)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49, 50 and 55 from that item

# Site audit — 2026-10-24 (pass 142, cloud tick)

Pass 141's milestone-kind test shipped (023653b), so the "Milestones a default run can reach" candidate has its last test and only the designer question is left. No issues are open for triage. The critique gate is closed (pass 26, 8 commits ago, under 24 hours) and so is the expand gate (pass 17, 9 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row the site can act on waits for /oversight. Checked this pass: the guard half of the "/decisions checks that stay true" candidate. /decisions shows every check word for word, and no test compares the rule-reading rows a check cites with their status. When the designer decides a row, a check that still asks about it goes stale and no test fails. A 3.2 (impact 4, ease 8). `citedRows` reads the rows a check cites ("row 57", "rows 30, 49", "rule readings 63-70"). A content test fails when a public check cites a row that does not exist, or a decided row outside the pinned list of today's stale citations. That list holds rows 7, 30, 49, 50 and 55 in "Spec v2 design work" and rows 65 and 69 in "Structural v2 questions". Row 50 is decided too, and no critique row named it. A check may drop rows from the list but not add any. The wording stays for /oversight. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.2] tests: a /decisions check can cite a decided rule reading and no test fails
- category: tests
- impact: 4
- ease: 8
- next: a content test that every row a public check cites exists and is open, apart from the pinned known-stale rows
- issue: #196
- fixed: ec2ebf6

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49, 50 and 55 from that item (row 50 found by this pass's test)

### [ ] [1.2] sim: the bot cannot measure today's designer changes (critique LOW, session residue)
- category: external-critique (sim)
- impact: 3
- ease: 4
- next: a phase-sized bot policy change; belongs with /expand or /oversight

# Site audit — 2026-10-24 (pass 141, cloud tick)

Pass 140's milestone id guard shipped (e2a17fd). No issues are open for triage. The critique gate is closed (pass 26, 7 commits ago, under 24 hours) and so is the expand gate (pass 17, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row the site can act on waits for /oversight, and the sim-bot row is phase-sized. Checked this pass: the last test the "Milestones a default run can reach" candidate still lacks. `milestoneOutOfReach` answers null for any milestone it does not name, so a new milestone kind would show on /play, /config and the run summary as within reach even when the default game cannot meet it, and no test would fail. A 3.2 (impact 4, ease 8). A content test now sorts every milestone kind into "always within reach" (survive to a round, defeat an elite) or "has a config that puts it out of reach, with a reason" (fire a Skill, buy upgrades, reveal tiles, reach a level); a kind in neither list fails it. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.2] tests: a new milestone kind is treated as within reach and no test fails
- category: tests
- impact: 4
- ease: 8
- next: a content test that every milestone kind is always within reach or can be marked out of reach
- issue: #195
- fixed: 023653b

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.2] sim: the bot cannot measure today's designer changes (critique LOW, session residue)
- category: external-critique (sim)
- impact: 3
- ease: 4
- next: a phase-sized bot policy change; belongs with /expand or /oversight

# Site audit — 2026-10-24 (pass 140, cloud tick)

Pass 139's open-readings fix shipped (6eb1c7f). No issues are open for triage. The critique gate is closed (pass 26, 6 commits ago, under 24 hours) and so is the expand gate (pass 17, 7 commits ago, under 48 hours). Phase 35 is still blocked on the designer's Skills session. Every Pending critique row the site can act on waits for /oversight, and the sim-bot row is phase-sized. Checked this pass: the guard the "Milestones a default run can reach" candidate still lacks. The engine records milestones from its own list (`reachedMilestones`), while /play's "Milestones: N of 8 met", the /config milestone lines and the sim report count from the content's `milestoneIds`; no test compared the two, so a milestone added to one list only would be recorded and never shown, or shown and never met. A 3.2 (impact 4, ease 8). An engine test now meets every milestone and checks that `checkMilestones` records exactly `milestoneIds`, under the default config and a custom one; dropping an id from either list fails it. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [3.2] tests: the engine's milestone ids and the list /play, /config and the sim show are never compared
- category: tests
- impact: 4
- ease: 8
- next: an engine test that every milestone met records exactly `milestoneIds`
- issue: #194
- fixed: e2a17fd

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.2] sim: the bot cannot measure today's designer changes (critique LOW, session residue)
- category: external-critique (sim)
- impact: 3
- ease: 4
- next: a phase-sized bot policy change; belongs with /expand or /oversight

# Site audit — 2026-10-24 (pass 139, cloud tick)

Pass 138's row 70 fix shipped (34fb231). No issues are open for triage. The critique gate is closed (pass 26, 5 commits ago) and so is the expand gate (pass 17, today). Phase 35 is still blocked on the designer's Skills session. The three MEDs at 8.1 still wait for /oversight, so the top pick a cloud tick can act on is the last pass 26 LOW: the open readings on /decisions still printed a code formula (row 64), phase numbers (rows 9, 17, 63-70, 78), the report path in each proposal row, and config keys (rows 67, 78). That scores 1.8 (impact 3, ease 6). The readings now say "1 more enemy per Combat every N rounds", drop the "(option, default off; measured in phase 22)" note the status line already gives, drop the report path (the phase 22 notes under the OPEN-QUESTIONS.md table still name it), and name the Config options by their labels. A /decisions unit test pins it. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /decisions: open rule readings still print code formulas, phase numbers, report paths, and config keys (critique LOW, pass 26)
- category: external-critique (voice)
- impact: 3
- ease: 6
- next: write the open readings in player words, cut phase numbers and file paths, name /config options not keys
- issue: #193
- fixed: 6eb1c7f

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.2] sim: the bot cannot measure today's designer changes (critique LOW, session residue)
- category: external-critique (sim)
- impact: 3
- ease: 4
- next: a phase-sized bot policy change; belongs with /expand or /oversight

# Site audit — 2026-10-24 (pass 138, cloud tick)

Pass 137's /config preset naming fix shipped (a4b5d3f). No issues are open for triage. The critique gate is closed (pass 26, 4 commits ago) and so is the expand gate (pass 17, today). Phase 35 is still blocked on the designer's Skills session. The three MEDs at 8.1 still wait for /oversight, so the top pick a cloud tick can act on is the pass 26 voice LOW: row 70 on /decisions said "table upkeep", "placements" and "the 20 cap" where /play and /config say "miniature limit", and its tag nested one pair of brackets in another. That scores 2.0 (impact 3, ease 7). The row now speaks in player words and names the miniature limit, and a rule tag's note joins with a comma. Next in line: the rows that wait for /oversight, then the pass 26 LOW on code tokens in open readings.

## Top 5 findings (scored)

### [x] [2.0] /decisions: row 70 uses tabletop words and a second name for the miniature limit (critique LOW, pass 26)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: reword row 70 to "miniature limit" and drop the nested brackets in its tag
- issue: #192
- fixed: 34fb231

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.8] /decisions: open rule readings still print code formulas, phase numbers, report paths, and config keys (critique LOW, pass 26)
- category: external-critique (voice)
- impact: 3
- ease: 6
- next: write the open readings in player words, cut phase numbers and file paths, name /config options not keys

# Site audit — 2026-10-24 (pass 137, cloud tick)

Pass 136's row 67 Shop I fix shipped (14daa93). No issues are open for triage. The critique gate is closed (pass 26, 3 commits ago) and so is the expand gate (pass 17, today). Phase 35 is still blocked on the designer's Skills session. The three MEDs at 8.1 still wait for /oversight, so the top pick a cloud tick can act on is the pass 26 a11y LOW: on /config each preset quantity input and remove button was named after the raw preset id ("deck-10-hand-5: card 1 quantity") while the card select beside it says "Preset 1: card 1". That scores 3.6 (impact 4, ease 9). Both now name the preset by its place, the Id field gets help text, and the /config e2e checks the names. Next in line: the rows that wait for /oversight, then the pass 26 LOWs (row 70 wording, code tokens in open readings).

## Top 5 findings (scored)

### [x] [3.6] /config: preset quantity inputs are named after the raw preset id (critique LOW, pass 26)
- category: external-critique (a11y)
- impact: 4
- ease: 9
- next: name quantity inputs and remove buttons "Preset N: card M"; help text on the Id field
- issue: #191
- fixed: a4b5d3f

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.0] /decisions: row 70 uses tabletop words and a second name for the miniature limit (critique LOW, pass 26)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: reword row 70 to "miniature limit" and drop the nested brackets in its tag

# Site audit — 2026-10-24 (pass 136, cloud tick)

Pass 135's row 67 recommendation fix shipped (af4b13f). No issues are open for triage. The critique gate is closed (pass 26, 2 commits ago) and so is the expand gate (pass 17, today). Phase 35 is still blocked on the designer's Skills session. The top pick is the other pass 26 MED on rule reading 67: "In 4-player, 2.5 nodes each is below Shop I" contradicts the row's own numbers (2.5 nodes at Gather 2 give 5 materials; Shop I costs 4). That scores 8.1 (impact 6, ease 9, bias x1.5). The sentence is cut; the rest of the row stands. Next in line: the rows that wait for /oversight, then the pass 26 LOWs (row 70 wording, code tokens in open readings, /config preset input names).

## Top 5 findings (scored)

### [x] [8.1] /decisions: row 67 says 4 players get too few materials for Shop I; its own numbers say enough (critique MED, pass 26, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: cut the 4-player Shop I sentence from row 67
- issue: #190
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.0] /decisions: row 70 uses tabletop words and a second name for the miniature limit (critique LOW, pass 26)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: reword row 70 to "miniature limit" and drop the nested brackets in its tag

# Site audit — 2026-10-24 (pass 135, cloud tick)

Critique pass 26 filed five rows, and expand pass 17 found no new candidates. No issues are open for triage. The critique gate is closed (pass 26, 1 commit ago) and so is the expand gate (pass 17, today). Phase 35 is still blocked on the designer's Skills session. The top pick is the pass 26 MED on rule reading 67: the reading said "Recommendation: turn on" and gave a median of 6 to 9, but the proposal block under it says it needs a playtest and gives 6, now 8. That scores 8.1 (impact 6, ease 9, bias x1.5). The reading's own report sentences are cut, and a DecisionsPage test keeps each reading's own recommendation in line with its proposal's advice. Next in line: the second row-67 MED (the 4-player Shop I claim contradicts the row's own numbers).

## Top 5 findings (scored)

### [x] [8.1] /decisions: rule reading 67 gives two recommendations and two bot results (critique MED, pass 26, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: cut row 67's old bot report sentences; DecisionsPage test guards reading-vs-proposal advice
- issue: #189
- fixed: (this commit)

### [ ] [8.1] /decisions: row 67 says 4 players get too few materials for Shop I; its own numbers say enough (critique MED, pass 26, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: recompute the 4-player claim against Gather 2 and Shop I cost 4, or cut it

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

# Site audit — 2026-10-23 (pass 134, cloud tick)

Pass 133's /tiles row shipped (5ea4a9b). No issues are open for triage, the critique gate is closed (pass 25, 8 commits ago, under 24 hours), the expand gate is closed (pass 16, 15 commits ago, under 48 hours), and the only pending phase (35) is blocked on the designer's Skills session. Every critique row left waits for /oversight or is the phase-sized sim-bot row, so this pass read the prerendered pages for copy that breaks the site's own rules. Two /config help lines still ended an "and" list with a serial comma, which the rest of the site has dropped: "an id, a hand size, and its starter cards" (deck presets) and "in rounds 2, 4, and 6" (draft), a 1.8 (impact 2, ease 9). The serial-comma guard in ruleText.test.ts only caught ", or" lists. Both lines now drop the comma, and a new guard bars "x, y, and z" lists from every /config help line. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /config: deck preset and draft help keep the serial comma (audit, pass 134)
- category: voice
- impact: 2
- ease: 9
- next: config.meta.json drops both commas; ruleText test guards "and" lists in /config help
- issue: #188
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.0] /decisions: the Event Calendar check cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 3
- ease: 6.5
- next: /oversight names the spawn cadence and gathering-node rules in words in that `[needs-user-call]` item

# Site audit — 2026-10-23 (pass 133, cloud tick)

Pass 132's /decisions row 17 shipped (26a870b). No issues are open for triage, the critique gate is closed (pass 25, 7 commits ago, under 24 hours), the expand gate is closed (pass 16, 14 commits ago, under 48 hours), and the only pending phase (35) is blocked on the designer's Skills session. Every critique row left waits for /oversight or is the phase-sized sim-bot row, so this pass checked the /tiles captions against the page's own wording. Under each tile name the site count joined its parts with commas only ("2 Gathering nodes, 1 Spawn node"), while the intro on the same page reads "1 Base tile, 3 Countryside tiles and 5 Core tiles", a 1.8 (impact 2, ease 9). The site count now ends with "and" ("2 Gathering nodes and 1 Spawn node"), both lists share one `andList` in TileSheet.tsx, and a TileSheet test pins it. Next in line: the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /tiles: tile site counts end without "and", unlike the intro (audit, pass 133)
- category: voice
- impact: 2
- ease: 9
- next: siteSummary ends with "and" through a shared andList; TileSheet unit test
- issue: #187
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.0] /decisions: the Event Calendar check cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 3
- ease: 6.5
- next: /oversight names the spawn cadence and gathering-node rules in words in that `[needs-user-call]` item

# Site audit — 2026-10-23 (pass 132, cloud tick)

Pass 131's /credits row shipped (4acb1eb). No issues are open for triage, the critique gate is closed (pass 25, 6 commits ago, under 24 hours), the expand gate is closed (pass 16, 13 commits ago, under 48 hours), and the only pending phase (35) is blocked on the designer's Skills session. The three 8.1 rows on /decisions still wait for /oversight, so this tick takes the last shippable pass-25 LOW row at 2.0: /decisions still cited ruling numbers the visitor cannot look up. Row 17's reading status read "Spec v2 ruling 20: steps of 3 by default"; it now reads "Spec v2 sets steps of 3 by default", docs/DECISIONS.md is regenerated, and the decisions test bars "ruling N" from every open reading's status label. The row's other half, the Event Calendar check ("Spec v2 ruling 14", "ruling 9"), edits a `[needs-user-call]` item, so it is split into its own LOW row that waits for /oversight. With this row gone the critique queue holds only rows that wait for /oversight and the sim-bot row.

## Top 5 findings (scored)

### [x] [2.0] /decisions: row 17's reading status cites a ruling number (critique LOW, pass 25)
- category: external-critique (comprehension)
- impact: 3
- ease: 6.5
- next: OPEN-QUESTIONS.md row 17 names the rule in words; docs/DECISIONS.md regenerated; decisions test bars "ruling N" in status labels
- issue: #186
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.0] /decisions: the Event Calendar check cites ruling numbers (critique LOW, pass 25; waits for /oversight)
- category: external-critique (comprehension)
- impact: 3
- ease: 6.5
- next: /oversight names the spawn cadence and gathering-node rules in words in that `[needs-user-call]` item

# Site audit — 2026-10-23 (pass 131, cloud tick)

Pass 130's home page serial-comma row shipped (3917feb). No issues are open for triage, the critique gate is closed (pass 25, 5 commits ago), the expand gate is closed (pass 16, 12 commits ago, under 48 hours), and the only pending phase (35) is blocked on the designer's Skills session. The three 8.1 rows on /decisions still wait for /oversight, so this tick takes the top pass-25 LOW row at 2.2: on /credits the two empty die faces glossed their own names ("Blank die face (empty: a blank face shows nothing)") and every in-house line ended "drawn for this game (Project-owned)". ASSETS.md shortens the two names, the page drops the license note on in-house lines, and a CreditsPage unit test keeps both off. Next in line: the /decisions ruling-numbers LOW row, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.2] /credits: empty die faces gloss themselves twice (critique LOW, pass 25)
- category: external-critique (voice)
- impact: 3
- ease: 7.5
- next: names shortened in ASSETS.md; CreditLine ends in-house lines at "drawn for this game"; CreditsPage unit test
- issue: #185
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.0] /decisions: two items still cite ruling numbers the visitor cannot look up (critique LOW, pass 25)
- category: external-critique (voice)
- impact: 3
- ease: 6.5
- next: name the rules in words in OPEN-QUESTIONS.md row 32 and the AUDIT.md item, drop the ruling numbers

# Site audit — 2026-10-23 (pass 130, cloud tick)

Pass 129's /config Combat-name row shipped (be81353). No issues are open for triage, the critique gate is closed (pass 25, 4 commits ago), the expand gate is closed (pass 16, 11 commits ago, under 48 hours), and the only pending phase (35) is blocked on the designer's Skills session. The three 8.1 rows on /decisions still wait for /oversight, so this tick takes the top pass-25 LOW row at 2.4: the home page's Prepare step kept the serial comma ("gather materials, and build"). It drops it, as does the home page's level line ("9 more, and each next step"), and a HomePage unit test now scans the page's text for a serial comma. Next in line: the /credits and /decisions LOW rows, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.4] /: the Prepare step keeps the serial comma (critique LOW, pass 25)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: comma dropped in HomePage.tsx and the level line in ruleText.ts; HomePage unit test scans the page for a serial comma
- issue: #184
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.2] /credits: empty die faces gloss themselves twice (critique LOW, pass 25)
- category: external-critique (voice)
- impact: 3
- ease: 7.5
- next: shorten the two die-face names and end in-house lines at "drawn for this game"

# Site audit — 2026-10-23 (pass 129, cloud tick)

Pass 128's /config bots row shipped (1115343). No issues are open for triage, the critique gate is closed (pass 25, 3 commits ago), the expand gate is closed (pass 16, 10 commits ago, under 48 hours), and the only pending phase (35) is blocked on the designer's Skills session. The three 8.1 rows on /decisions still wait for /oversight, so this tick takes the top pass-25 LOW row at 2.7: every proposal's measured line on /config and /decisions wrote the Combat model in lower case ("Measured under engagements"), while the home page and the Combat select capitalise it. The measured, unmeasured and advice lines now say "Engagements Combat" and "Exchanges", and a unit test keeps the lower-case names out of every proposal line. Next in line: the home page serial comma, then the /credits and /decisions LOW rows, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.7] /config: measured lines write the Combat model in lower case (critique LOW, pass 25)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: `measuredText` and `adviceText` name "Engagements Combat" and "Exchanges"; unit, component and e2e checks updated
- issue: #183
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.4] /: the Prepare step keeps the serial comma (critique LOW, pass 25)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: drop the comma in HomePage.tsx and add the home page copy to the serial-comma test

# Site audit — 2026-10-23 (pass 128, cloud tick)

Pass 127's /config "Rules" group row shipped (362bf37). No issues are open for triage, the critique gate is closed (pass 25, 2 commits ago), the expand gate is closed (pass 16, 9 commits ago, under 48 hours), and the only pending phase (35) is blocked on the designer's Skills session. The three 8.1 rows on /decisions still wait for /oversight, so the top row this tick can ship is the pass-25 MED row on /config at 6.8: each measured line names "Default bot" and "Defender bot", but the page never said what either bot does. The Proposals intro now has one line per bot, from the bot package's policy descriptions. Next in line: the pass-25 LOW rows, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [6.8] /config: proposals name "Default bot" and "Defender bot" but never say what they are (critique MED, pass 25, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 7.5
- next: `BOTS_TEXT` in the Proposals intro; unit tests and config.spec.ts check it
- issue: #182
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.4] /: the Prepare step keeps the serial comma (critique LOW, pass 25)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: drop the comma in HomePage.tsx and add the home page copy to the serial-comma test

# Site audit — 2026-10-23 (pass 127, cloud tick)

Pass 126's /play gather line row shipped (690f48e), and critique pass 25 (fe9d292) filed six rows. The critique gate is closed (pass 25, 0 commits ago) and the expand gate is closed (pass 16, 8 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The new pass-25 MED row on /config scores 8.1 with the bias (impact 6, ease 9, x1.5) and is the cheapest of the 8.1 rows that need no /oversight call: the whole rules form sat in a fieldset whose legend was the raw key "config", so a screen reader announced the form's group as "config". The root fieldset is now named "Rules", and the /config e2e spec pins it. Next in line: the other pass-25 MED row (what "Default bot" and "Defender bot" are), then the pass-25 LOW rows, then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [8.1] /config: the rules form's group is named "config", a raw key (critique MED, pass 25, bias x1.5)
- category: external-critique (a11y)
- impact: 6
- ease: 9
- next: the root fieldset's legend reads "Rules"; e2e check in config.spec.ts
- issue: #181
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [6.8] /config: proposals name "Default bot" and "Defender bot" but never say what they are (critique MED, pass 25, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 7.5
- next: one line per bot in the proposals intro, from the bot's own description

# Site audit — 2026-10-23 (pass 126, cloud tick)

Pass 125's /play card-buy line row shipped (c2b3128). The critique gate is closed (pass 24, 10 commits ago, under 24 hours) and the expand gate is closed (pass 16, 6 commits ago). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. This pass checked the /play log amounts for singular and plural. The gather line always said "materials", so with "Gather off a node" set to 1 on /config a Gather off a node read "You gathered 1 materials (now 3).", while the knockout line already says "1 material", a 1.8 (impact 2, ease 9). It now reads "You gathered 1 material (now 3).", and an exportRun unit test pins it. Next in line: the sim bot row (session residue), then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /play log: a gather of 1 says "1 materials" (audit, pass 126)
- category: voice
- impact: 2
- ease: 9
- next: the gather line uses the singular for 1, as the knockout line does; unit test in exportRun.test.ts
- issue: #180
- fixed: 690f48e

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords the check or closes it

# Site audit — 2026-10-23 (pass 125, cloud tick)

Pass 124's /play heal line row shipped (b93855c). The critique gate is closed (pass 24, 9 commits ago, under 24 hours) and the expand gate is closed (pass 16, 5 commits ago). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. This pass read the rest of the /play log lines in `describeEvent` for amounts with no unit. The card-buy line read "You bought Sprint for 3." while the upgrade line reads "bought for 4 materials." and the Base panel says the Shop's cards cost currency, a 1.8 (impact 2, ease 9). It now reads "You bought Sprint for 3 currency.", and an exportRun unit test pins it. Next in line: the sim bot row (session residue), then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /play log: the card-buy line says "for 3" with no unit (audit, pass 125)
- category: voice
- impact: 2
- ease: 9
- next: the card-buy line names "currency", as the upgrade line names "materials"; unit test in exportRun.test.ts
- issue: #179
- fixed: c2b3128

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords the check or closes it

# Site audit — 2026-10-22 (pass 124, cloud tick)

Pass 123's /decisions serial comma row shipped (054341d). The critique gate is closed (pass 24, 8 commits ago, under 24 hours) and the expand gate is closed (pass 16, 3 commits ago). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. No pass 24 row is left, so this pass checked the /play log lines in `describeEvent` against the site's wording. The heal line read "You healed 2 (health 7)." with no unit, while the guard line reads "You gained 2 guard (guard 3)." and Skills and cards say "Heal 1 health" (d6ee0fd), a 1.8 (impact 2, ease 9). It now reads "You healed 2 health (health 7).", and the exportRun unit test pins the solo and co-op heal lines and the guard line. Next in line: the sim bot row (session residue), then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [1.8] /play log: the heal line says "healed 2" with no unit (audit, pass 124)
- category: voice
- impact: 2
- ease: 9
- next: the heal line names "health", as the guard line names "guard"; unit test in exportRun.test.ts
- issue: #178
- fixed: b93855c

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords the check or closes it

# Site audit — 2026-10-22 (pass 123, cloud tick)

Pass 122's rule reading 4 row shipped (142c4e6). The critique gate is closed (pass 24, 7 commits ago, under 24 hours) and the expand gate is closed (pass 16, 3 commits ago). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. The top row the loop can ship is the /decisions serial comma at 2.1 (impact 3, ease 7): the site dropped the serial comma, but the open readings in `OPEN-QUESTIONS.md` and the checks in this file still wrote "Training II, or Training III" and "enemy type, and health". Those rows now drop it, three clause lists are reworded around one comma, docs/DECISIONS.md is regenerated, and a decisions test fails on any list-ending ", and" or ", or" on the rendered page. Next in line: the sim bot row (session residue), then the rows that wait for /oversight.

## Top 5 findings (scored)

### [x] [2.1] /decisions: rule readings and checks still use the serial comma (critique LOW, pass 24)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: drop the comma before "and"/"or" in the readings and checks; a decisions test scans the rendered page
- issue: #177
- fixed: 054341d

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords the check or closes it

# Site audit — 2026-10-22 (pass 122, cloud tick)

Pass 121's /config Milestones row shipped (9dacefa). The critique gate is closed (pass 24, 6 commits ago, under 24 hours) and the expand gate is closed (pass 16, 2 commits ago). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Of pass 24's rows the top one the loop can ship is rule reading 4's wording at 2.7 (impact 3, ease 9): /decisions said ""Reveal 10 tiles" is unreachable with 8 non-base tiles" while /play and /config say "out of reach: the tile deck holds 8 tiles". Row 4 now uses the /play words, docs/DECISIONS.md is regenerated, and a decisions test builds the expected question from the same label and reason /play shows. Next in line: the /decisions serial comma (2.1), then the sim bot row.

## Top 5 findings (scored)

### [x] [2.7] /decisions: rule reading 4 says "unreachable with 8 non-base tiles" (critique LOW, pass 24)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: reword row 4's question to "out of reach: the tile deck holds 8 tiles"
- issue: #176
- fixed: 142c4e6

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.1] /decisions: rule readings and checks still use the serial comma (critique LOW, pass 24)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: drop the comma before "and"/"or" in the named rows and extend the serial-comma test to the /decisions sources

# Site audit — 2026-10-22 (pass 121, cloud tick)

Pass 120's /config measured line row shipped (d720367), and expand pass 16 ran at b4f5814 with no new candidates. The critique gate is closed (pass 24, 5 commits ago, under 24 hours) and the expand gate is closed (pass 16, 0 commits ago). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Of pass 24's rows the three left are LOW; the top one is the /config Milestones row at 3.2 (impact 4, ease 8): /config listed 7 milestone lines while /play lists 8, because "Defeat an elite" has no setting. A config group may now carry help in `config.meta.json`, and the Milestones section opens with "Defeat an elite is always a milestone and has no setting." A configMeta test checks that every milestone is named on /config, and the config e2e checks the note. Next in line: rule reading 4's wording (2.7) and the /decisions serial comma (2.1).

## Top 5 findings (scored)

### [x] [3.2] /config: the Milestones section does not name "Defeat an elite" (critique LOW, pass 24)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: show group help on /config and give the Milestones group a note naming the milestone with no setting
- issue: #175
- fixed: 9dacefa

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.7] /decisions: rule reading 4 says "unreachable with 8 non-base tiles" (critique LOW, pass 24)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: reword row 4's question to "out of reach: the tile deck holds 8 tiles"

# Site audit — 2026-10-22 (pass 120, cloud tick)

Pass 119's base panel row shipped (7fbb0b8). The critique gate is closed (pass 24, 3 commits ago, under 24 hours) and the expand gate is closed (pass 15, 19 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Of pass 24's rows the top one the loop can ship is the /config measured line at 5.3 (impact 5, ease 7, bias x1.5): each proposal's bot result was one long sentence with a semicolon, "middle half" and "runs that reach the sim cap", and an unchanged median read as two numbers. Each bot is now two short sentences: "the median run ends in round 10 (no change)" and "Runs stopped with the base still standing: 26, now 1." The new words explain the stalled runs, so no section intro is needed. A proposals test bans the semicolon and the two harness phrases in every measured line.

## Top 5 findings (scored)

### [x] [5.3] /config: each proposal's measured result is one long sentence with test-harness words (critique MED, pass 24, bias x1.5)
- category: external-critique (voice)
- impact: 5
- ease: 7
- next: split `batchText` into short sentences per bot and say "no change" when a count is the same
- issue: #174
- fixed: d720367

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

# Site audit — 2026-10-22 (pass 119, cloud tick)

Pass 118's milestone panel row shipped (3baaf7b), and critique pass 24 ran at that commit and filed 6 rows (3 MED, 3 LOW). The critique gate is closed (pass 24, 1 commit ago) and the expand gate is closed (pass 15, 17 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Of pass 24's rows the top one is rule reading 78 at 8.1 (impact 6, ease 9, bias x1.5): /play and /config mark "Fire Arcane Rain" out of reach because Build cards buy only Training I, but row 78, the reading for that cause, named only "Buy 3 base upgrades". Row 78 now names both milestones, docs/DECISIONS.md is regenerated, and a decisions test checks that every milestone the default rules put out of reach is named in an open reading.

## Top 5 findings (scored)

### [x] [8.1] /decisions: rule reading 78 does not name "Fire Arcane Rain" (critique MED, pass 24, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: name the milestone in row 78's question and pin it with a decisions test
- issue: #172
- fixed: 289c846

### [x] [7.2] /play: the folded milestone count includes milestones the list marks out of reach (critique MED, pass 24, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: add the out-of-reach count to the base panel summary line
- issue: #173
- fixed: 7fbb0b8

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

# Site audit — 2026-10-22 (pass 118, cloud tick)

Pass 117's sim milestone row shipped (e2f727e). The critique gate is closed (pass 23, 10 commits ago, 3 minutes under 24 hours) and the expand gate is closed (pass 15, 15 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Checked this pass: where /play shows the milestones. Spec v2 1.4 says milestones show the progress of a run, but /play lists them only on the run summary after the base falls; mid-run a milestone is one log line when it is met, and the out-of-reach reasons pass 113 to 116 added are seen only at the end. A 3.5 (impact 5, ease 7). The run summary's list is now a shared `MilestoneList`, and the base panel ends with a folded "Milestones: N of 8 met" section that shows the same list; a component test and the full-run e2e pin it.

## Top 5 findings (scored)

### [x] [3.5] /play: the milestones are listed only after the base falls (audit, pass 118)
- category: tests
- impact: 5
- ease: 7
- next: share the run summary's milestone list and fold it into the base panel with a met count
- issue: #171
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-22 (pass 117, cloud tick)

Pass 116's "Fire Arcane Rain" row shipped (8c3b940), so `milestoneOutOfReach` now answers every milestone kind. The critique gate is closed (pass 23, 9 commits ago, under 24 hours) and the expand gate is closed (pass 15, 14 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Checked this pass: the third part of the "Milestones a default run can reach" candidate, the sim report. `summarize` counted only the milestones some run met, so the 5 milestones no default run meets (round 15, Arcane Rain, 3 upgrades, 10 tiles, level 5) were missing from the terminal line and the JSON report instead of reading 0, a 3.2 (impact 4, ease 8). The batch, compare and sweep commands now pass the config's `milestoneIds`, every milestone is listed from 0, and the default-batch pin lists all 8.

## Top 5 findings (scored)

### [x] [3.2] sim: a milestone no run meets is missing from the batch summary (audit, pass 117)
- category: tests
- impact: 4
- ease: 8
- next: seed `summarize`'s milestone counts with the config's `milestoneIds` at 0
- issue: #170
- fixed: e2f727e

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-22 (pass 116, cloud tick)

Pass 115's "Reach level 5" row shipped (23f95a5). The critique gate is closed (pass 23, 8 commits ago, under 24 hours) and the expand gate is closed (pass 15, 13 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Checked this pass: the last milestone kind `milestoneOutOfReach` did not answer, `fire-<skill>`. The default "Fire Arcane Rain" cannot be met: Arcane Rain is a level 3 Skill, a draft offers Skills only up to the open Training level (11.8), and under `rulings.buildLevels: "levelled"` Build cards buy only Training I (row 78). The run summary showed it as a plain miss on every default run, a 2.8 (impact 4, ease 7). It now reads "out of reach: a level 3 Skill needs Training III, and Build cards can buy only Training I" on the run summary and the /config milestone line; a ruleText test and the full-run e2e pin it.

## Top 5 findings (scored)

### [x] [2.8] /play and /config: "Fire Arcane Rain" is not marked out of reach while Build cards buy only Training I (audit, pass 116)
- category: tests
- impact: 4
- ease: 7
- next: mark `fire-<skill>` in `milestoneOutOfReach` when no reachable Training upgrade opens the Skill's level
- issue: #169
- fixed: 8c3b940

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-21 (pass 115, cloud tick)

Pass 114's rule-reading order row shipped (92706e6). The critique gate is closed (pass 23, 7 commits ago, under 24 hours) and the expand gate is closed (pass 15, 12 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. The critique queue has no other row the loop can ship but the phase-sized sim-bot row. Checked this pass: `milestoneOutOfReach` against every milestone kind, the part of the "Milestones a default run can reach" candidate still open. It marked upgrades and tiles but not "Reach level 5" when /config's Maximum level is below 5, so the run summary showed that milestone as missed with no reason, a 2.7 (impact 3, ease 9). It now reads "out of reach: the level stops at 4" on the run summary and the /config milestone line, and a ruleText test pins it.

## Top 5 findings (scored)

### [x] [2.7] /play and /config: "Reach level 5" is not marked out of reach under a lower maximum level (audit, pass 115)
- category: tests
- impact: 3
- ease: 9
- next: mark `reach-level` in `milestoneOutOfReach` when `options.maxLevel` is below `milestones.level`
- issue: #168
- fixed: 23f95a5

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-21 (pass 114, cloud tick)

Pass 113's Decisions-link row shipped (458564e). The critique gate is closed (pass 23, 6 commits ago, under 24 hours) and the expand gate is closed (pass 15, 11 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Every shippable row is LOW and scores under 3.0, so the loop drains the last LOW critique row: pass 23's rule-reading order row at 2.5 (impact 3, ease 8). /decisions listed `pending-spec` readings first, so the numbers ran 4 ... 58, then 56, 61 with no subheading. openQuestions now sorts by number only (each row's status line already says what it waits on), docs/DECISIONS.md is regenerated, and the decisions test pins number order. With this row gone the critique queue holds only rows that wait for /oversight and the sim-bot row.

## Top 5 findings (scored)

### [x] [2.5] /decisions: Rule readings are out of number order with no subheading (critique LOW, pass 23)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: sort the open readings by number only
- issue: #167
- fixed: 92706e6

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-21 (pass 113, cloud tick)

Pass 112's heal-unit row shipped (d6ee0fd). The critique gate is closed (pass 23, 4 commits ago, under 24 hours) and the expand gate is closed (pass 15, 9 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Every shippable row is LOW and scores under 3.0, so the loop keeps draining LOW critique rows. The top one is pass 23's Decisions-link row at 2.6 (impact 3, ease 9): the home page's Also line linked /decisions as "the open rules questions", a third name for a page the nav calls "Decisions". The link now reads "the Decisions page" with the gloss "(rule readings that wait on the designer)", and the HomePage test pins the link name and gloss and bars the old wording.

## Top 5 findings (scored)

### [x] [2.6] /: the link to /decisions is named "the open rules questions" (critique LOW, pass 23)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: name the link "the Decisions page" with a short gloss
- issue: #166
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.5] /decisions: Rule readings are out of number order with no subheading (critique LOW, pass 23)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: split the list under "Waiting for a rule" and "Played as proposed" subheadings

# Site audit — 2026-10-21 (pass 112, cloud tick)

Pass 111's enemy-cap row shipped (2014593). The critique gate is closed (pass 23, 3 commits ago, under 24 hours) and the expand gate is closed (pass 15, 9 commits ago, under 48 hours). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Every shippable row is LOW and scores under 3.0, so the loop keeps draining LOW critique rows. The top one is pass 23's heal-unit row at 2.7 (impact 3, ease 9): the starter Skill line read "Mend (Wand: heal 1)" beside "gain 2 guard". skillEffectText now returns "Heal N health", the startText test pins the new line, and a skillEffectText test pins the heal and guard wording.

## Top 5 findings (scored)

### [x] [2.7] / and /play: the heal effect reads "Heal 1" with no unit (critique LOW, pass 23)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: return "Heal N health" from skillEffectText; update the pinned tests
- issue: #165
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.6] /: the link to /decisions is named "the open rules questions" (critique LOW, pass 23)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: name the link "the Decisions page" with a short gloss

# Site audit — 2026-10-21 (pass 111, cloud tick)

Pass 110's serial-comma row shipped (f5a5c17). The critique gate is closed (pass 23, 2 commits ago, under 24 hours) and the expand gate is closed (pass 15, 8 commits ago, under 48 hours). The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Every shippable row is LOW and scores under 3.0, so the loop keeps draining LOW critique rows. The top one is pass 23's enemy-cap row at 2.7 (impact 3, ease 9): the /play counter said "(map limit)" while /config and rule 10.5 say "miniature limit", and two proposals spoke of a table. The counter now says "(miniature limit)", the proposals say "when more players play" and "so fewer enemies are on the map", and a ruleText test scans proposals and /config metadata for tabletop phrasing.

## Top 5 findings (scored)

### [x] [2.7] /play and /config: one enemy cap has two names, and proposals talk about a table (critique LOW, pass 23)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: say "miniature limit" on the /play counter; reword the two proposals
- issue: #164
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.7] / and /play: the heal effect reads "Heal 1" with no unit (critique LOW, pass 23)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: return "Heal N health" from skillEffectText; update the pinned tests

# Site audit — 2026-10-21 (pass 110, cloud tick)

Pass 109's /config proposal-result row shipped (5db99a1). The critique gate is closed (pass 23, 1 commit ago, under 24 hours) and the expand gate is closed (pass 15, 7 commits ago, under 48 hours). The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Every shippable row is LOW and scores under 3.0, so the loop keeps draining LOW critique rows. The top one is pass 23's serial-comma row at 2.7 (impact 3, ease 9): the / siege sentence and the "Spawn range" proposal read "a Barricade, a Tower, or ...". Both now drop the comma, and so do the engagement card step and two /config help lines. A ruleText test scans ruleText, the proposals and the /config metadata for a list comma before "or".

## Top 5 findings (scored)

### [x] [2.7] / and /config: the siege sentence and a proposal still use the serial comma (critique LOW, pass 23)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: drop the comma before "or" in both lines; add a test for ", or " in rule text and proposals
- issue: #163
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.7] /play and /config: one enemy cap has two names, and proposals talk about a table (critique LOW, pass 23)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: say "miniature limit" on the /play counter; reword the two proposals

# Site audit — 2026-10-21 (pass 109, cloud tick)

Pass 108's "base center" fix shipped (14de3ef) and critique pass 23 filed 6 findings (096c182). The critique gate is closed (pass 23, 1 commit ago) and the expand gate is closed (pass 15, 6 commits ago). The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. The top shippable row is pass 23's MED: on /config each proposal's measured bot result sat only in the Apply button's title tooltip, so touch users never saw it and screen readers might not hear it, a 6.8 (impact 5, ease 9, bias x1.5). The result is now visible text under each proposal, named by the button's aria-describedby.

## Top 5 findings (scored)

### [x] [6.8] /config: a proposal's measured bot result is only in the Apply button's tooltip (critique MED, pass 23, bias x1.5)
- category: external-critique (a11y)
- impact: 5
- ease: 9
- next: show measuredText as visible text; link it to the button with aria-describedby
- issue: #162
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.7] / and /config: the siege sentence and a proposal still use the serial comma (critique LOW, pass 23)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: drop the comma before "or" in both lines; add a test for ", or " in rule text and proposals

# Site audit — 2026-10-21 (pass 108, cloud tick)

Pass 107's damage line shipped (cbffc78). The critique gate is closed (pass 22, 11 commits, under 24 hours by minutes) and the expand gate is closed (pass 15, 4 commits ago). The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Checked this pass: the spelling of the base in visible text. The /play log, piece names and action labels said "the base centre", while Spec v2 (1.3, 3.1, 4.1) and the /tiles legend say "center", a 2.4 (impact 3, ease 8). Every visible "base centre" now reads "base center"; the unit and e2e tests that pin the words follow.

## Top 5 findings (scored)

### [x] [2.4] /play and /debug: "the base centre" where the rules and /tiles say "center" (iterate audit)
- category: voice
- impact: 3
- ease: 8
- next: say "base center" in piece names, the log and action labels; update the pinned tests
- issue: #161
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)

# Site audit — 2026-10-21 (pass 107, cloud tick)

Pass 106's co-op engage line shipped (32a58ca). The critique gate is closed (pass 22, 10 commits, under 24 hours by minutes) and the expand gate is closed (pass 15, 3 commits ago). The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Checked this pass: the damage line in `describeEvent`. Every hit named both parts, so a player with no guard, the usual case, read "You lose 0 guard and 3 health", a 2.7 (impact 3, ease 9). It now names only what was lost and says "lose nothing" for a 0-damage hit. A new unit test pins all four cases.

## Top 5 findings (scored)

### [x] [2.7] /play log: the damage line says "lose 0 guard" when no guard is lost (iterate audit)
- category: voice
- impact: 3
- ease: 9
- next: name only the parts lost; "lose nothing" for a 0-damage hit
- issue: #160
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)

# Site audit — 2026-10-21 (pass 106, cloud tick)

Pass 105's solo level line shipped (bb008c0). The critique gate is closed (pass 22, 9 commits, under 24 hours) and the expand gate is closed (pass 15, 2 commits ago). The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Checked this pass: the rest of `describeEvent` for solo and co-op wording. In a co-op run the engage line with no enemy dice said "Player 2 engages. No enemy is next to you", a 1.8 (impact 2, ease 9): it now names the seat in co-op and keeps "you" in a solo run. A new unit test pins both. Gather, build and upgrade lines say "materials" for any amount, but no card, cost or default config gives 1, so that is left.

## Top 5 findings (scored)

### [x] [1.8] /play log: the co-op engage line says "No enemy is next to you" (iterate audit)
- category: voice
- impact: 2
- ease: 9
- next: name the engaging player in co-op, keep "you" in a solo run
- issue: #159
- fixed: 32a58ca

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-20 (pass 105, cloud tick)

Expand pass 15 shipped (e8d495e) with no new candidates, so the expand gate is closed again (under 48 hours) and the critique gate is closed (pass 22, 8 commits, under 24 hours). The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. The top row the loop can ship is pass 104's solo level line at 1.8: in a solo run the level line now reads "You get 1 action die", as the other solo log lines do, and co-op still reads "Every player gets 1 action die". A new unit test pins both.

## Top 5 findings (scored)

### [x] [1.8] /play log: the solo level line says "Every player gets 1 action die" (iterate audit)
- category: voice
- impact: 2
- ease: 9
- next: say "You get 1 action die" in a solo run, as the other solo log lines do
- issue: #158
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-20 (pass 104, cloud tick)

Pass 103's 1280x800 Skills row shipped (016c38a), the last blind round 4 row. No finding the loop can ship scores 3.0 or more: no actionable iterate work, handed to `/expand` (pass 15, bold posture). The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. The sim bot-policy row (critique LOW, user) is phase-sized and sits in the promoted bot candidate's follow-up. Checked this pass: `describeEvent` (60 event types) is pinned by `exportRun.test.ts`, `knockoutLog.test.ts`, `milestoneLog.test.ts` and `pieceNames.test.ts`; the solo level line "Every player gets 1 action die" reads oddly with one player, a 1.8 (impact 2, ease 9), left for a later pass. The critique gate is closed (pass 22, 7 commits, under 24 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.8] /play log: the solo level line says "Every player gets 1 action die" (iterate audit)
- category: voice
- impact: 2
- ease: 9
- next: say "You get 1 action die" in a solo run, as the other solo log lines do

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-20 (pass 103, cloud tick)

Pass 102's serial-comma row shipped (448f6e6). The three `[needs-user-call]` MED rows from passes 20 and 21 still score 8.1 and wait for /oversight. Every shippable row is LOW and scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 13 commits, under 48 hours), so the loop keeps draining LOW critique rows. The top one is the last part of the blind-round-4 row at 1.8 (impact 3, ease 6): at 1280x800 the effect texts of the 4 starter Skills fit, but with 5 or more Skills the modal held 4 columns, so the fifth and sixth Skills sat under the footer. Above 760px, 5 or more Skills now take tiles of at least 160px with 28px slots, smaller effect text and the short reach line (screen readers still hear the long one), so 6 Skills with the longest effect texts share 1 row and the body does not scroll. A new e2e at 1280x800 pins it. The critique gate is closed (pass 22, 7 commits, under 24 hours).

## Top 5 findings (scored)

### [x] [1.8] /play: at 1280x800 a long Skill effect text is cut by the footer (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: 5 or more Skills share 1 row above the footer at desktop width
- issue: #157
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the item

# Site audit — 2026-10-20 (pass 102, cloud tick)

Pass 101's /tiles hex-list row shipped (52e9393). The three `[needs-user-call]` MED rows from passes 20 and 21 still score 8.1 and wait for /oversight. Every shippable row is LOW and scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 12 commits, under 48 hours), so the loop keeps draining LOW critique rows. The top one is the serial-comma row at 2.4 (impact 3, ease 8): / and /tiles mixed lists with and without the serial comma. Most lists, and `andList` in ruleText, drop it, so the site now drops it everywhere: the / start line ("15 health, 1 action die and 4 Skills"), the exchange line ("roll, play cards and fire Skills"), the / "Also:" links, the /tiles tile count ("3 Countryside tiles and 5 Core tiles"), and the /play and /decisions descriptions and the noscript line. The ruleText, HomePage and TileView tests pin the new text. The critique gate is closed (pass 22, 6 commits, under 24 hours).

## Top 5 findings (scored)

### [x] [2.4] / and /tiles: lists mix the serial comma (critique LOW, pass 22)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: drop the serial comma in the hand-written lists, as andList does
- issue: #156
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [1.8] /play: at 1280x800 a long Skill effect text is cut by the footer (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: keep a long effect text above the footer

# Site audit — 2026-10-20 (pass 101, cloud tick)

Pass 100's Dodge row shipped (bf619f8). The three `[needs-user-call]` MED rows from passes 20 and 21 still score 8.1 and wait for /oversight. Every shippable row is LOW and scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 11 commits, under 48 hours), so the loop keeps draining LOW critique rows. The top one is the /tiles hex-list order at 2.7 (impact 3, ease 9): each list ran Center, Lower right, Upper right, Top, then counter-clockwise, the engine's direction order. The lists now read Center, then Top and clockwise, from a new `HEX_LIST_ORDER`; the drawing is unchanged. A TileSheet test pins the order. The critique gate is closed (pass 22, 5 commits, under 24 hours).

## Top 5 findings (scored)

### [x] [2.7] /tiles: each hex list jumps from Center to Lower right, then runs counter-clockwise (critique LOW, pass 22)
- category: external-critique (comprehension)
- impact: 3
- ease: 9
- next: list Center, then Top and clockwise
- issue: #155
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.4] / and /tiles: lists mix the serial comma (critique LOW, pass 22)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: pick one list style in andList and the hand-written lists on / and /tiles

# Site audit — 2026-10-20 (pass 100, cloud tick)

Pass 99's /tiles Base-legend row shipped (4362104). With the oversight bias (external-critique MED x1.5), the top shippable row is the Dodge row at 6.3 (impact 5, ease 8.5): the draft Skill Dodge read "Ignore 1 enemy hit this exchange" while the default Combat is Engagements. The engine resets ignored hits at the start of each engagement, so `skillEffectText` now takes the run's Combat model and reads "this engagement" under Engagements and "this exchange" under Exchanges, on the /play Skill board, the draft dialog and the / starter Skills line. An effectText test pins both. The three `[needs-user-call]` MED rows from passes 20 and 21 still score 8.1 and wait for /oversight. Every other pending row is LOW and scores under 3.0. The critique gate is closed (pass 22, 4 commits, under 24 hours), and the expand gate is closed (pass 14 at f7dc176, 10 commits, under 48 hours).

## Top 5 findings (scored)

### [x] [6.3] /play: the Dodge effect says "this exchange" under Engagements (critique MED, pass 22, bias x1.5)
- category: external-critique (voice)
- impact: 5
- ease: 8.5
- next: word the Dodge effect in ruleText by Combat model
- issue: #154
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

### [ ] [2.4] / and /tiles: lists mix the serial comma (critique LOW, pass 22)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: pick one list style in andList and the hand-written lists on / and /tiles

# Site audit — 2026-10-20 (pass 99, cloud tick)

Pass 98's home co-op row shipped (8c4708d). With the oversight bias (external-critique MED x1.5), the top shippable row is the /tiles Base-legend row at 7.6 (impact 6, ease 8.5): the legend said upgrades are "bought here" on the Base site, which /tiles marks on the Center hex only, and / said "on the base". The engine takes any hex of the Base tile (OPEN-QUESTIONS row 16). The legend now says "stand on the Base tile to buy upgrades", and the / Shop and Training lines say "Stand on the Base tile and buy ...", as the /play Base panel does. The three `[needs-user-call]` MED rows from passes 20 and 21 still score 8.1 and wait for /oversight. Next: the Dodge "this exchange" row (MED, pass 22). The critique gate is closed (pass 22, 2 commits, under 24 hours), and the expand gate is closed (pass 14 at f7dc176, 10 commits, under 48 hours).

## Top 5 findings (scored)

### [x] [7.6] /tiles: the Base legend says upgrades are bought "here", on the one Center hex (critique MED, pass 22, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 8.5
- next: "stand on the Base tile" in the /tiles Base legend and the / Shop and Training lines
- issue: #153
- fixed: (this commit)

### [ ] [6.3] /play: the Dodge effect says "this exchange" under Engagements (critique MED, pass 22, bias x1.5)
- category: external-critique (voice)
- impact: 5
- ease: 8.5
- next: word the Dodge effect in ruleText by Combat model

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [8.1] /decisions: the "Spec v2 design work" check lists rows already decided (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 7, 30, 49 and 55 from that item

# Site audit — 2026-10-20 (pass 98, cloud tick)

Pass 97's target-pick row shipped (5e9eef1), and critique pass 22 (85d700f) filed 5 rows: 3 MED, 2 LOW. With the oversight bias (external-critique MED x1.5), the top shippable row is the home co-op row at 8.1 (impact 6, ease 9): the / pitch and meta description never said the players work together. The pitch now says "A co-op survival dice-builder for 1 to 4 players on one screen: all players defend one base.", and the meta description says "together" and "co-op". The three `[needs-user-call]` MED rows from passes 20 and 21 also score 8.1 and still wait for /oversight. Next: the /tiles Base-legend row and the Dodge "this exchange" row (both MED, pass 22). The critique gate is closed (pass 22, under 24 hours), and the expand gate is closed (pass 14 at f7dc176, 9 commits, under 48 hours).

## Top 5 findings (scored)

### [x] [8.1] /: the home page never says the game is co-op (critique MED, pass 22, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: "co-op" in the / pitch and the / meta description
- issue: #152
- fixed: (this commit)

### [ ] [7.6] /tiles: the Base legend says upgrades are bought "here", on the one Center hex (critique MED, pass 22, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 8.5
- next: "stand on the Base tile" in the /tiles Base legend and the / Shop and Training lines

### [ ] [6.3] /play: the Dodge effect says "this exchange" under Engagements (critique MED, pass 22, bias x1.5)
- category: external-critique (voice)
- impact: 5
- ease: 8.5
- next: word the Dodge effect in ruleText by Combat model

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

# Site audit — 2026-10-20 (pass 97, cloud tick)

Pass 96's hand-strip row shipped (77ce2eb). The two MED rows from critique pass 21, the pass 20 design-work row, and the LOW reset-wording row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. Every shippable row scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 6 commits since, under 48 hours), so the loop keeps draining LOW critique rows. The top one is the target-pick half of the blind-round-4 row at 1.4: with 4 targets in range the Skills started about 215px below the screen at 375x812 and below the footer at 1280x800. During a pick the Skills now come up under the targets and the felt (every die already placed) goes last; at phone width the mini map is 150px tall, the target buttons are compact, and the "Choose a target" heading is heard, not shown. The first Skills row and the fired Skill end above the footer at both sizes; a new e2e pins it. The 1280x800 effect-text part of the row stays pending. The critique gate is closed (pass 21, 11 commits, under 24 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [1.4] /play: the target pick pushes the Skills off screen (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 2
- ease: 7
- next: Skills under the targets during a pick; smaller mini map and compact target buttons at phone width
- issue: #151
- fixed: (this commit)

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the `[needs-user-call]` reset item

# Site audit — 2026-10-20 (pass 96, cloud tick)

Pass 95's 5-Skill row shipped (a2cdf09). The two MED rows from critique pass 21, the pass 20 design-work row, and the LOW reset-wording row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. Every shippable row scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 5 commits since, under 48 hours), so the loop keeps draining LOW critique rows. The top one is the hand-strip half of the blind-round-4 375px row at 1.4: at phone width each strip card was 70px wide, so a 2-word name (Field Medic) and "Reroll all dice" wrapped, and the last option line ended about 18px below the screen. At phone width the cards now share the strip (up to 84px each, at least 66px), the colour band is 6px and the name padding is smaller, so with a Field Medic / Sanctuary hand every option line ends above the bottom edge and all 4 cards show without scrolling. A new e2e at 375x812 with a deck of the wordiest cards pins it. The target-pick half and the 1280x800 effect-text part of the row stay pending. The critique gate is closed (pass 21, 10 commits, under 24 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [1.4] /play: at 375px the hand strip clips its option text (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 2
- ease: 7
- next: strip cards share the width at phone size; slimmer band and name padding
- issue: #150
- fixed: (this commit)

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the `[needs-user-call]` reset item

# Site audit — 2026-10-19 (pass 95, cloud tick)

Pass 94's mini-map tag row shipped (b444fc3). The two MED rows from critique pass 21, the pass 20 design-work row, and the LOW reset-wording row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. Every shippable row scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 4 commits since, under 48 hours), so the loop keeps draining LOW critique rows. The top one is the 5-Skill half of the blind-round-4 375px row at 1.4: at phone width the Skills sat in 2 columns, so with 5 Skills and 6 dice the fifth tile (Cleave) ended about 42px under the footer. With 5 or more Skills the grid now takes 3 columns of smaller tiles (slots 1.6rem, still over 24px; name 0.85rem; effect 0.7rem), and the fifth ends above the footer. A new e2e at 375x812 pins it. The target-pick and hand-strip halves of the row stay pending. The critique gate is closed (pass 21, 9 commits, under 24 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [1.4] /play: at 375px a fifth Skill sits behind the footer (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 2
- ease: 7
- next: 3 columns of smaller tiles for 5+ Skills at phone width
- issue: #149
- fixed: (this commit)

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the `[needs-user-call]` reset item

# Site audit — 2026-10-19 (pass 94, cloud tick)

Pass 93's Roll-step row shipped (ec0ca26). The two MED rows from critique pass 21, the pass 20 design-work row, and the LOW reset-wording row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. Every shippable row scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 3 commits since, under 48 hours), so the loop keeps draining LOW critique rows. The top one is the blind-round-4 mini-map row at 1.4: the target tag always sat right of the token (left only at the frame edge), so it could cover the "You" figure or another enemy, and an enemy in range beyond the 3-hex frame was cut off. A new `placeTag` helper (`apps/web/src/play/mapTag.ts`) tries right, left, above, below and takes the first side that stays in the frame and covers no figure, defense or other enemy; the mini map now also frames every enemy it can target. Five unit tests pin the placement. The critique gate is closed (pass 21, 8 commits, under 24 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [1.4] /play: the mini-map target label can cover tokens (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 2
- ease: 7
- next: place the tag on a free side in the frame; frame every targetable enemy
- issue: #148
- fixed: (this commit)

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the `[needs-user-call]` reset item

# Site audit — 2026-10-19 (pass 93, cloud tick)

Pass 92's /play "in range" row shipped (1d42ce4). The two MED rows from critique pass 21, the pass 20 design-work row, and the LOW reset-wording row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. Every shippable row scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 1 commit since, under 48 hours), so the loop keeps draining LOW critique rows. The top one is the blind-round-4 Roll row at 1.4: the engine offers cards in an engagement only at Use dice, but the Roll instruction said nothing about cards, and a Star's meaning showed only at Use dice. The Roll instruction now adds "You can add cards from your hand when you use the dice." (exchanges without an engagement: "Then you can add cards from your hand.") and "A Star fits any Skill slot."; the phone line reads "Keep or roll dice. Cards come after." The Special face already reads "Special 2" under each enemy die, so that half of the row was stale. An engageView test pins both lines. The critique gate is closed (pass 21, 7 commits, under 24 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [1.4] /play: the Roll step does not say when cards come or what a Star fits (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 2
- ease: 7
- next: add the card timing and the Star meaning to the Roll instruction
- issue: #147
- fixed: (this commit)

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the `[needs-user-call]` reset item

# Site audit — 2026-10-19 (pass 92, cloud tick)

Pass 91's "Reveal 10 tiles" row shipped (f7dc176). The two MED rows from critique pass 21, the pass 20 design-work row, and the LOW reset-wording row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. Every shippable row scores under 3.0, and the expand gate is closed (pass 14 at f7dc176, 0 commits since), so the loop keeps draining LOW critique rows. The top one is the /play "in range" row at 0.8, rescored to 1.4 now the fix is a prop on the reach line: in an engagement the title names the enemies that rolled dice ("vs 1 elite") while Shot said "3 enemies in range". `InReach` now takes the engaged count (in-range enemies in `exchange.engage.enemyDice`) and, when it is lower, reads "3 enemies in range, 1 of them engaged" (phones: "3 in range, 1 engaged"). Two SkillBoard tests pin both lines. The critique gate is closed (pass 21, 6 commits, under 24 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [1.4] /play: "in range" counts differ from the engaged enemies (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 2
- ease: 7
- next: say "3 in range, 1 engaged" on the Skill reach line in an engagement
- issue: #146
- fixed: (this commit)

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the `[needs-user-call]` reset item

# Site audit — 2026-10-19 (pass 91, cloud tick)

Pass 90's /decisions row-20 wording shipped (dda37ce). The two MED rows from critique pass 21, the pass 20 design-work row, and the LOW reset-wording row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. The top shippable row is the oversight "reveal 10 tiles" row at 2.1: tracing `createGame` shows the tile deck is the countryside and core tiles only (the Base tile starts on the map), so with 8 tiles in the deck "Reveal 10 tiles" can never fire. OPEN-QUESTIONS row 4 already holds the reading (pending-spec), so the value is not changed from cloud. `milestoneOutOfReach` now covers `reveal-tiles` the way it covers `buy-upgrades`: the /play run summary and the /config milestone line read "Reveal 10 tiles (out of reach: the tile deck holds 8 tiles)". A ruleText test pins the helper and the rule line; the full-run e2e checks the summary. The critique gate is closed (pass 21, 5 commits, under 24 hours) and the expand gate is closed (pass 13 at 8fc13ac, 19 commits, under 48 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [2.1] /play and /config: "Reveal 10 tiles" cannot be met with 8 tiles in the tile deck (critique LOW, oversight 2026-10-10)
- category: external-critique (rules)
- impact: 3
- ease: 7
- next: mark the milestone out of reach on the run summary and /config; the value waits on OPEN-QUESTIONS row 4
- issue: #145
- fixed: (this commit)

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the `[needs-user-call]` reset item

# Site audit — 2026-10-19 (pass 90, cloud tick)

Pass 89's /tiles caption row shipped (ceada01). The two MED rows from critique pass 21 and the pass 20 design-work row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. The top shippable row is the /decisions row-20 wording at 1.6: rows 59 and 60 opened with "Row 20 says/reads", their rule tag ended "row 20" (a row of rules Table 8 the page does not show), and row 78 cited "ruling 25". Rows 59 and 60 now name the Haul card, row 78 drops the ruling number, and `readingRuleText` drops a rules-table row from a rule tag ("rule 6.7, Table 8"); the decisions tests pin the helper and the page test checks rows 59, 60 and 78. The "Spec v2 ruling 14" citation sits in a `[needs-user-call]` check, so it waits for /oversight. The critique gate is closed (pass 21, 4 commits, under 24 hours) and the expand gate is closed (pass 13 at 8fc13ac, 18 commits, under 48 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [1.6] /decisions: headings cite "row 20" and ruling numbers a visitor cannot look up (critique LOW, pass 21)
- category: external-critique (comprehension)
- impact: 2
- ease: 8
- next: name the Haul card in rows 59 and 60; drop the ruling number in row 78; drop the table row from rule tags
- issue: #144
- fixed: (this commit)

### [ ] [1.4] /decisions: the "Reset /config once" check names a URL path and an unknowable date (critique LOW, pass 21; waits for /oversight)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: /oversight rewords or closes the `[needs-user-call]` reset item

# Site audit — 2026-10-19 (pass 89, cloud tick)

Pass 88's reset-wording row shipped (3a23999). The two MED rows from critique pass 21 and the pass 20 design-work row still edit `[needs-user-call]` items, which only /oversight changes, so they wait. The top shippable row is the /tiles caption at 1.8: each tile's site count read "1 base", "2 gathering nodes" while the site legend and hex lists write "Base", "Gathering node". The caption now uses the legend's labels as written ("1 Base", "2 Gathering nodes, 1 Spawn node"); a TileSheet test pins it. The critique gate is closed (pass 21, 2 commits, under 24 hours) and the expand gate is closed (pass 13 at 8fc13ac, 17 commits, under 48 hours).

## Top 5 findings (scored)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [x] [1.8] /tiles: tile captions write site names in lower case (critique LOW, pass 21)
- category: external-critique (voice)
- impact: 2
- ease: 9
- next: drop the `.toLowerCase()` in the TileSheet caption
- issue: #143
- fixed: (this commit)

### [ ] [1.6] /decisions: headings cite "row 20" and ruling numbers a visitor cannot look up (critique LOW, pass 21)
- category: external-critique (comprehension)
- impact: 2
- ease: 8
- next: name the Haul card instead of the rules table row in rows 59 and 60; drop or link the ruling numbers

# Site audit — 2026-10-19 (pass 88, cloud tick)

Pass 87's defeated-dice row shipped (a6dc51f). Critique pass 21 filed six rows. Its two MED rows (the /decisions balance checks at 8.1 and the "Structural v2 questions" check at 8.1, both with the MED bias) edit `[needs-user-call]` rows, which only /oversight changes, so they wait with the design-work row. The top shippable row is the /config reset wording at 2.4: the status line said "the standard rules" while the button said "Reset to defaults". /config and the /play start panel now say "Reset to the standard rules", confirm with "Reset every value to the standard rules?", and /config reports "Reset to the standard rules."; the StartPanel test and the config e2e pin the new words. The critique gate is closed (pass 21, 1 commit, under 24 hours) and the expand gate is closed (pass 13 at 8fc13ac, 16 commits, under 48 hours).

## Top 5 findings (scored)

### [x] [2.4] /config: "standard rules" and "defaults" name the same baseline (critique LOW, pass 21)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: name the reset button and its confirm after the standard rules on /config and /play
- issue: #142
- fixed: (this commit)

### [ ] [8.1] /decisions: three balance checks give three different bot results (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight closes the 2026-10-03 and first 2026-10-04 balance items and keeps the latest batch

### [ ] [8.1] /decisions: the "Structural v2 questions" check names rows already decided (critique MED, pass 21, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: /oversight drops rows 65 and 69 and the advice to turn on removed options

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [1.8] /tiles: tile captions write site names in lower case (critique LOW, pass 21)
- category: external-critique (voice)
- impact: 2
- ease: 9
- next: drop the `.toLowerCase()` in the TileSheet caption

# Site audit — 2026-10-19 (pass 87, cloud tick)

Pass 86's nav row shipped (39fccdf). The /decisions design-work row (6.8 with the MED bias) still edits a `[needs-user-call]` row and waits for /oversight. The top shippable row is the result's enemy dice at 0.8: a defeated enemy's dice looked like any other. The result now passes its defeated enemies (from the summary's `hits`) to `EnemyDice`, which dims their dice (`data-defeated`), labels them "grunt, defeated" and names them "its enemy was defeated"; the DiceTray test pins the mark. Every shippable row scores under 3.0, the critique gate is closed (pass 20, 9 commits, under 24 hours) and the expand gate is closed (pass 13 at 8fc13ac, 14 commits, under 48 hours), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [0.8] /play: the result's enemy dice do not mark a defeated enemy (critique LOW, split from blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 3
- next: pass the defeated enemies to the result's EnemyDice and mark their dice
- issue: #141
- fixed: (this commit)

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [0.8] /play: "in range" counts differ from the engaged enemies (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 3
- next: say "3 in range, 1 engaged" on the Skill reach line

### [ ] [0.7] /play: card timing and the Special face are explained only later (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 2.5
- next: a one-time note at Roll on when cards can be added; Special and Star meanings at Roll

### [ ] [0.6] /play: at 375px a fifth Skill, the target pick, and the hand still need scrolling (critique LOW)
- category: external-critique (mobile)
- impact: 3
- ease: 2
- next: compact the engagement modal at 375px

# Site audit — 2026-10-18 (pass 86, cloud tick)

Pass 85's /play result row shipped (eb40e28). The /decisions design-work row (6.8 with the MED bias) still edits a `[needs-user-call]` row and waits for /oversight. The top shippable row is the nav at 0.9: Tile sheet, Decisions and Engine console sat beside Home and Play as equals. `NAV` now gives each link a group; the nav lists the game pages (Home, Play, Config, Credits) and then a group labelled "Design tools" at the rail's far end. The routes unit test pins the tool paths and the a11y e2e checks the labelled group holds the three tool links. Every shippable row scores under 3.0 and the expand gate is closed (pass 13 at 8fc13ac, 13 commits, under 48 hours), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [0.9] all pages: design tools sit in the nav as equals of Play (critique LOW, pass 9)
- category: external-critique (navigation)
- impact: 3
- ease: 3
- next: group Tiles, Decisions and Debug under a "Design tools" label
- issue: #140
- fixed: 39fccdf

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [0.8] /play: "in range" counts differ from the engaged enemies (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 3
- next: say "3 in range, 1 engaged" on the Skill reach line

### [ ] [0.8] /play: the result's enemy dice do not mark a defeated enemy (critique LOW, split from blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 3
- next: pass the defeated enemies to the result's EnemyDice and mark their dice

### [ ] [0.7] /play: card timing and the Special face are explained only later (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 2.5
- next: a one-time note at Roll on when cards can be added; Special and Star meanings at Roll

# Site audit — 2026-10-18 (pass 85, cloud tick)

Pass 84's /credits row shipped (a409efe). The /decisions design-work row (6.8 with the MED bias) still edits a `[needs-user-call]` row and waits for /oversight. The top shippable row is the /play result at 1.0: "You dealt 2 damage" named no enemy. The engagement summary now keeps each damaged enemy's damage and health after (`hits`), and the result adds "Elite, 1 hex north took 2 damage: 12 health left." or "Grunt took 2 damage and was defeated." (`hitsLine`); the engageView test pins both. The row's second half, marking a defeated enemy's dice on the result, is split into its own LOW row. Every shippable row scores under 3.0 and the expand gate is closed (pass 13 at 8fc13ac, 12 commits, under 48 hours), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [1.0] /play: the result does not say who took the damage (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 4
- ease: 3
- next: name each damaged enemy and its health left
- issue: #139
- fixed: eb40e28

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [0.9] all pages: design tools sit in the nav as equals of Play (critique LOW, pass 9)
- category: external-critique (navigation)
- impact: 3
- ease: 3
- next: group Tiles, Decisions and Debug under a "Design tools" label

### [ ] [0.8] /play: "in range" counts differ from the engaged enemies (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 3
- next: say "3 in range, 1 engaged" on the Skill reach line

### [ ] [0.8] /play: the result's enemy dice do not mark a defeated enemy (critique LOW, split from blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 3
- next: pass the defeated enemies to the result's EnemyDice and mark their dice

# Site audit — 2026-10-18 (pass 84, cloud tick)

Pass 83's /decisions row 57 shipped (4936726). The /decisions design-work row (6.8 with the MED bias) still edits a `[needs-user-call]` row and waits for /oversight. The "reveal 10 tiles" critique row is already `OPEN-QUESTIONS.md` row 4 (pending-spec, proposed "Reveal 8"); it changes a rule value, so it stays with the designer. The top shippable row is the /credits intro at 1.2: its second sentence, "Generated from the project's asset register", described the build. It now says "If a credit is missing or wrong, open an issue", linking the repo's issues page; the polish e2e checks the link and that the old sentence is gone. Every shippable row scores under 3.0 and the expand gate is closed (pass 13 at 8fc13ac, 11 commits), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: replace the sentence with where to report a missing credit
- issue: #138
- fixed: (this commit)

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [1.0] /play: the result does not say who took the damage (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 4
- ease: 3
- next: name each damaged enemy and its health left; mark a defeated enemy's dice

### [ ] [0.9] all pages: design tools sit in the nav as equals of Play (critique LOW, pass 9)
- category: external-critique (navigation)
- impact: 3
- ease: 3
- next: group Tiles, Decisions and Debug under a "Design tools" label

### [ ] [0.8] /play: "in range" counts differ from the engaged enemies (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 3
- next: say "3 in range, 1 engaged" on the Skill reach line

# Site audit — 2026-10-18 (pass 83, cloud tick)

Pass 82's /tiles Base legend row shipped (b1cd77c). The /decisions design-work row (6.8 with the MED bias) still edits a `[needs-user-call]` row and waits for /oversight. The top shippable row is /decisions row 57 at 2.1: its heading printed "(rule Core loop v2)", its setting "tiles.json: no config field", and the tile kinds were lower case. Reading headings (open and decided) now go through `readingRuleText`, which uses the play log's `ruleCitation` and words a tag with no section as "not in the written rules"; a content-file setting reads "Set in the map tiles, not on the Config page" (`unlistedSettingText`); row 57 writes "Countryside" and "Core". The decisions tests pin both helpers; the page test checks row 57. Every shippable row scores under 3.0 and the expand gate is closed (pass 13 at 8fc13ac, under 48 hours and 20 commits), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [2.1] /decisions: row 57 shows a raw rule tag and a data file name (critique LOW, pass 20)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: cite the rule through the play log helper; "Set in the map tiles, not on the Config page"
- issue: #137
- fixed: 4936726

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

### [ ] [1.0] /play: the result does not say who took the damage (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 4
- ease: 3
- next: name each damaged enemy and its health left; mark a defeated enemy's dice

### [ ] [0.9] all pages: design tools sit in the nav as equals of Play (critique LOW, pass 9)
- category: external-critique (navigation)
- impact: 3
- ease: 3
- next: group Tiles, Decisions and Debug under a "Design tools" label

# Site audit — 2026-10-18 (pass 82, cloud tick)

Pass 81's "What you have" row shipped (d1099a2). The external-critique MED bias (x1.5) now applies only to the /decisions design-work row, which edits a `[needs-user-call]` row and waits for /oversight. The top shippable row is the /tiles Base legend at 2.4: it said cards are bought on the base, while / says the Shop opens only with Shop I, and the home Shop line gave no currency per enemy. `siteText` now takes the upgrades content and says "upgrades are bought here, and cards once Shop I is built"; `shopText` lists each enemy's currency from `enemies.json` ("a grunt 1, an elite 4"). The ruleText tests pin both sentences and a changed-currency content; the TileSheet legend test checks the new Base text. Every shippable row scores under 3.0 and the expand gate is closed (pass 13 ran yesterday at 8fc13ac), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [2.4] /tiles: the Base legend says cards are bought there with no Shop I condition (critique LOW, pass 20)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: say cards are bought there once Shop I is built; add per-enemy currency to the home Shop line
- issue: #136
- fixed: b1cd77c

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [2.1] /decisions: row 57 shows a raw rule tag and a data file name (critique LOW, pass 20)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: cite the rule through the /config helper; "Set in the map tiles, not on the Config page"

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

### [ ] [1.0] /play: the result does not say who took the damage (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 4
- ease: 3
- next: name each damaged enemy and its health left; mark a defeated enemy's dice

# Site audit — 2026-10-18 (pass 81, cloud tick)

Pass 80's / Prepare defenses row shipped (a4a370b). The external-critique MED bias (x1.5) still applies to the two pass 20 MED rows left. The /decisions design-work row scores highest on paper but edits a `[needs-user-call]` row, so it waits for /oversight. The top shippable row is "What you have" on / at 5.4: it named Strike, Shot, Mend and Guard with no face or effect, and nothing said where guard comes from. `skillEffectText` moves from the /play app into `ruleText` (the Skill board and decision dialog keep the same words through it), and `startText` now gives each starter Skill its faces and effect from `skills.json` and says guard comes from the Guard Skill (and the card bottom halves under the exchange model). The ruleText start test pins the default sentence, a one-Skill config, and the exchange model.

## Top 5 findings (scored)

### [x] [5.4] /: "What you have" names the four Skills without faces or effects (critique MED, pass 20, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: generate each Skill's face and effect from skills.json; say where guard comes from
- issue: #135
- fixed: d1099a2

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [2.4] /tiles: the Base legend says cards are bought there with no Shop I condition (critique LOW, pass 20)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: say cards are bought there once Shop I is built; add per-enemy currency to the home Shop line

### [ ] [2.1] /decisions: row 57 shows a raw rule tag and a data file name (critique LOW, pass 20)
- category: external-critique (voice)
- impact: 3
- ease: 7
- next: cite the rule through the /config helper; "Set in the map tiles, not on the Config page"

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

# Site audit — 2026-10-18 (pass 80, cloud tick)

Pass 79's /play start panel reset row shipped (b5e61e1). The external-critique MED bias (x1.5) still applies to the three pass 20 MED rows. The /decisions design-work row scores highest on paper but edits a `[needs-user-call]` row, so it waits for /oversight. Of the two 5.4 rows, the Prepare defenses row ships first (older in the queue, cheaper): / said to build Barricades and Towers with no cost, health, or effect, and no base health. A new `defenseText(config, content)` in `ruleText` reads each defense's cost, health, and effect from `defenses.json` and the base's starting health from config; the Prepare step on / shows it. A ruleText test pins the default sentence and one with changed numbers.

## Top 5 findings (scored)

### [x] [5.4] /: Prepare names Barricades and Towers without cost or effect (critique MED, pass 20, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: add `defenseText` to ruleText from defenses.json and show it in the Prepare step
- issue: #134
- fixed: a4a370b

### [ ] [5.4] /: "What you have" names the four Skills without faces or effects (critique MED, pass 20, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: generate each Skill's face and effect from skills.json; say where guard comes from

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

### [ ] [1.2] /play: the result does not say who took the damage or their health after (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 2
- ease: 6
- next: name the player and their health after in the engagement result line

# Site audit — 2026-10-18 (pass 79, cloud tick)

Pass 78's / Combat step row shipped (ed01c82). Critique pass 20 filed four MED rows, so the external-critique MED bias (x1.5) applies again. The top row is the /play start panel reset at 6.0: "Reset to the standard rules" cleared the saved config and reloaded in one click, while /config asks first and calls it "Reset to defaults". The start panel button is now "Reset to defaults" and asks "Reset every value to the default?" with "Yes, reset every value" and "Keep my values", the same words as /config. A StartPanel test checks the confirm and the cancel; the /decisions proposal e2e now cancels once, then confirms. The /decisions design-work row scores higher on paper, but its fix edits a `[needs-user-call]` row, which only /oversight changes, so it waits.

## Top 5 findings (scored)

### [x] [6.0] /play: the start panel reset clears the config with no confirm (critique MED, pass 20, bias x1.5)
- category: external-critique (comprehension)
- impact: 5
- ease: 8
- next: give the start panel reset the /config confirm and label
- issue: #133
- fixed: b5e61e1

### [ ] [5.4] /: Prepare names Barricades and Towers without cost or effect (critique MED, pass 20, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: add `defenseText` to ruleText from defenses.json and show it in the Prepare step

### [ ] [5.4] /: "What you have" names the four Skills without faces or effects (critique MED, pass 20, bias x1.5)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: generate each Skill's face and effect from skills.json; say where guard comes from

### [ ] [6.8] /decisions: the Spec v2 design work item lists decided rows (critique MED, pass 20, bias x1.5; waits for /oversight)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: /oversight drops rows 7, 30, 49, 55 (decided 2026-10-11) from the durable design-work item

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

# Site audit — 2026-10-18 (pass 78, cloud tick)

Pass 77's /play move surcharge row shipped (4fdb8a5). No MED rows are left, so the bias does not apply; the top row is the / Combat step at 1.5. An earlier fix had already dropped "Exchanges, the Combat in the written rules", but the step still ran "Or choose Exchanges, the older Combat kept for playtests, on the start panel: in each exchange you roll, play cards, and fire Skills; then each enemy ...", naming the start panel before a visitor has seen it. The step now says "Before a run, you can choose Exchanges instead, the older Combat kept for playtests." in its own sentence, and the exchange rule text in ruleText splits at the semicolon into two sentences (the /play start panel reads it too). The HomePage test checks the new sentences and that no colon or semicolon joins them; the ruleText test pins the split text. Every row scores under 3.0 and the expand gate is closed (pass 13 ran yesterday), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [1.5] /: the Combat step is one long sentence chain (critique LOW, pass 8)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: split the Combat step into short sentences
- issue: #132
- fixed: (this commit)

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

### [ ] [1.2] /play: the result does not say who took the damage or their health after (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: name each damaged enemy with its health left; mark a defeated enemy's dice

### [ ] [1.2] /play: "in range" counts differ from the engaged enemies (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: count the same enemies in both places

### [ ] [1.0] all pages: one meta description and og:url for every route, no canonical (critique LOW, pass 9)
- category: external-critique (seo)
- impact: 2
- ease: 5
- next: set canonical and og:url per route in the route effect

# Site audit — 2026-10-18 (pass 77, cloud tick)

Pass 76's /tiles site legend row shipped (692486b). No MED rows are left, so the bias does not apply; the top row is the user-jotted /play move surcharge at 1.7. With `combat.moveCostNextToEnemy` above 1, a hex next to an enemy that costs more than the movement left was just not highlighted. The engine now exports `stepsOutOfReach` (the map steps that are legal but unaffordable), and the Move banner adds "A hex next to an enemy costs N, more than you have left" when any exist. The default (1) never shows it. An engine test covers the surcharge, Blink, and the default; a nextStep test checks both banner lines. Every row scores under 3.0 and the expand gate is closed (pass 13 ran yesterday), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [1.7] /play: a hex next to an enemy that costs too much is not offered, with no reason (critique LOW, user +0.5)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: when the move cost next to an enemy is above 1, say so in the Move banner
- issue: #131
- fixed: (this commit)

### [ ] [1.5] /: the Combat step is one long sentence chain (critique LOW, pass 8)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: split the Combat step into short sentences

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

### [ ] [1.2] /play: the result does not say who took the damage or their health after (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: name each damaged enemy with its health left; mark a defeated enemy's dice

### [ ] [1.2] /play: "in range" counts differ from the engaged enemies (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: count the same enemies in both places

# Site audit — 2026-10-17 (pass 76, cloud tick)

Pass 75's /credits textures row shipped (ad64856). No MED rows are left, so the bias does not apply; the top LOW row is the /tiles site legend at 1.8. The legend named Base, Gathering node, Spawn node and Elite spawn node with nothing after them, while each terrain row says what it does to moves. Each site now carries its Table 1 function in brackets, built by a new `siteText` in ruleText from config, so the spawn options (rows 64, 66, 68, 70) and the Gather node ruling change the wording with them. A ruleText test covers the default and a varied spawn config; the TileSheet unit test and the tiles e2e check the legend text. Every row scores under 3.0 and the expand gate is closed (pass 13 ran this morning), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [1.8] /tiles: the site legend names the sites but not what they do (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: a short effect after each site name, from ruleText
- issue: #130
- fixed: (this commit)

### [ ] [1.7] /play: a hex next to an enemy that costs too much is not offered, with no reason (critique LOW, user +0.5)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: when the move cost next to an enemy is above 1, say so in the Move banner

### [ ] [1.5] /: the Combat step is one long sentence chain (critique LOW, pass 8)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: split the Combat step into short sentences

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

### [ ] [1.2] /play: the result does not say who took the damage or their health after (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: name each damaged enemy with its health left; mark a defeated enemy's dice

# Site audit — 2026-10-17 (pass 75, cloud tick)

Pass 74's /debug intro row shipped (8fc13ac). No MED rows are left, so the bias does not apply; two pass-19 LOW rows tie at 1.8 and the cheapest wins: the /credits textures. The five CC0 ambientCG textures sat in the Icons list, right after "every icon is under CC BY 3.0". The page now splits the register by path: icons under Icons, textures under their own Textures heading, each list stating its shared license once. A unit test checks no asset is lost in the split; the credits e2e checks the textures are out of the icon list. Every row scores under 3.0 and the expand gate is closed (pass 13 ran this morning), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [1.8] /credits: the ambientCG textures are listed under the "Icons" heading (critique LOW, pass 19)
- category: external-critique (content)
- impact: 2
- ease: 9
- next: split the list by path; textures under a Textures heading
- issue: #129
- fixed: (this commit)

### [ ] [1.8] /tiles: the site legend names the sites but not what they do (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: a short effect after each site name, from ruleText

### [ ] [1.7] /play: a hex next to an enemy that costs too much is not offered, with no reason (critique LOW, user +0.5)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: when the move cost next to an enemy is above 1, say so in the Move banner

### [ ] [1.5] /: the Combat step is one long sentence chain (critique LOW, pass 8)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: split the Combat step into short sentences

### [ ] [1.2] /credits: the intro describes how the page is built (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 2
- ease: 6
- next: drop "Generated from the project's asset register" from the intro

# Site audit — 2026-10-17 (pass 74, cloud tick)

Pass 73's /config deck preset row shipped (0426919). No MED rows are left, so the bias does not apply; three pass-19 LOW rows tie at 1.8 and the cheapest wins: the /debug intro. /play starts a run from the config saved on /config, but the Engine console always plays the standard rules and did not say so. The intro now says it plays the standard rules, not a config saved on Config, and links there. The debug e2e checks the sentence. Every row scores under 3.0 and the expand gate is closed (19 commits, under 48h since pass 12), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [1.8] /debug: the Engine console ignores the saved config and does not say so (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 2
- ease: 9
- next: one intro sentence that the console plays the standard rules
- issue: #128
- fixed: (this commit)

### [ ] [1.8] /tiles: the site legend names the sites but not what they do (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: a short effect after each site name, from ruleText

### [ ] [1.8] /credits: the ambientCG textures are listed under the "Icons" heading (critique LOW, pass 19)
- category: external-critique (content)
- impact: 2
- ease: 9
- next: move the texture rows under their own heading

### [ ] [1.7] /play: a hex next to an enemy that costs too much is not offered, with no reason (critique LOW, user +0.5)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: when the move cost next to an enemy is above 1, say so in the Move banner

### [ ] [1.5] /: the Combat step is one long sentence chain (critique LOW, pass 19)
- category: external-critique (voice)
- impact: 2
- ease: 7
- next: split the Combat step into short sentences

# Site audit — 2026-10-17 (pass 73, cloud tick)

Pass 72's /decisions row 7 wording shipped (bbef6b5). No MED rows are left, so the bias does not apply; four LOW rows tie at 1.8 and the oldest wins: the /config deck preset label (discovery 1). Each preset put "Hand size" and its box right before "10 cards", so a 10-card deck read as a hand of 10. The deck total now comes first as "Deck: 10 cards", and the hand box is labelled "Cards in hand". The config e2e checks both labels.

## Top 5 findings (scored)

### [x] [1.8] /config: a deck preset's "Hand size" reads as the deck total (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: deck total first as "Deck: N cards", the hand box labelled "Cards in hand"
- issue: #127
- fixed: (this commit)

### [ ] [1.8] /tiles: the site legend names the sites but not what they do (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: a short effect after each site name, from ruleText

### [ ] [1.8] /debug: the Engine console ignores the saved config and does not say so (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 2
- ease: 9
- next: one intro sentence that the console plays the default rules

### [ ] [1.8] /credits: the ambientCG textures are listed under the "Icons" heading (critique LOW, pass 19)
- category: external-critique (content)
- impact: 2
- ease: 9
- next: move the texture rows under their own heading

### [ ] [1.7] /play: a hex next to an enemy that costs too much is not offered, with no reason (critique LOW, user +0.5)
- category: external-critique (comprehension)
- impact: 3
- ease: 4
- next: when the move cost next to an enemy is above 1, say so in the Move banner

# Site audit — 2026-10-17 (pass 72, cloud tick)

Pass 71's bundle row shipped (fc1a82e). No MED rows are left, so the bias does not apply; the top pending row is the /decisions row 7 wording at 2.0. Its Spec v2 note used the data word "enemy record" and pointed at "row 73" without saying what that row is. The note now says what happens in play: when Combat ends, each enemy next to a structure hits one structure next to it, a grunt for 1 damage and an elite for 3. The reading itself does not change. `docs/DECISIONS.md` is regenerated from the table.

## Top 5 findings (scored)

### [x] [2.0] /decisions: decided row 7 says "enemy record" and points at an unexplained "row 73" (critique LOW, pass 19)
- category: external-critique (voice)
- impact: 2
- ease: 10
- next: reword row 7's reading in `OPEN-QUESTIONS.md`
- issue: #126
- fixed: (this commit)

### [ ] [1.8] /config: a deck preset's "Hand size" reads as the deck total (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: relabel the preset field and say what it counts

### [ ] [1.8] /tiles: the site legend names the sites but not what they do (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: a short effect after each site name, from ruleText

### [ ] [1.8] /debug: the Engine console ignores the saved config and does not say so (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 2
- ease: 9
- next: one intro sentence that the console plays the default rules

### [ ] [1.8] /credits: the ambientCG textures are listed under the "Icons" heading (critique LOW, pass 19)
- category: external-critique (content)
- impact: 2
- ease: 9
- next: move the texture rows under their own heading

# Site audit — 2026-10-17 (pass 71, cloud tick)

Pass 70's home page row shipped (5c2763d). No MED rows are left, so the bias does not apply; every pending row is LOW and the top two tie at 2.0. The older one wins the tie: the main script had grown to 727 kB, over the build's own 600 kB warning, because every page was imported eagerly. Each page but home and not-found is now its own chunk through a small `lazyPage` helper; the client loads the route's chunk before it hydrates, and the prerender loads every page before it renders, so the served HTML and the first render still match. The CSS stays one stylesheet in the head, so a prerendered page is styled before its chunk arrives. The main script is now 277 kB and the build has no size warning.

## Top 5 findings (scored)

### [x] [2.0] all pages: the main script is 727 kB, over the build's own 600 kB warning (critique LOW)
- category: external-critique (perf)
- impact: 4
- ease: 5
- next: each page but home its own chunk, loaded before the first render
- issue: #125
- fixed: (this commit)

### [ ] [2.0] /decisions: decided row 7 says "enemy record" and points at an unexplained "row 73" (critique LOW, pass 19)
- category: external-critique (voice)
- impact: 2
- ease: 10
- next: reword row 7's reading in `OPEN-QUESTIONS.md`

### [ ] [1.8] /config: a deck preset's "Hand size" reads as the deck total (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: relabel the preset field and say what it counts

### [ ] [1.8] /tiles: the site legend names the sites but not what they do (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: a short effect after each site name, from ruleText

### [ ] [1.8] /debug: the Engine console ignores the saved config and does not say so (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 2
- ease: 9
- next: one intro sentence that the console plays the default rules

# Site audit — 2026-10-17 (pass 70, cloud tick)

Pass 69's Checks row shipped (b19439e). The MED bias still applies to the last pass 19 MED row, which tops the list: the home page used Skills, action dice and card halves without saying what a player starts with or how a round turns over. Two new ruleText phrases fill the gap from config and content: `startText` (health, action dice, the starter Skills by name, the starter deck by card, hand size, and what each card half is for) and `roundText` (Prepare then Combat, one pass through the deck each, and the co-op turn order from `rulings.coopPrepareOrder`). The home page shows them under a new "What you have" heading and at the top of "How a run goes".

## Top 5 findings (scored)

### [x] [6.8] /: a stranger cannot learn what they start with or how a round turns over (critique MED, pass 19)
- category: external-critique (comprehension)
- impact: 6
- ease: 7.5
- next: `startText` and `roundText` in ruleText, shown on /
- issue: #124
- fixed: (this commit)

### [ ] [2.0] all pages: the main script is 727 kB, over the build's own 600 kB warning (critique LOW)
- category: external-critique (perf)
- impact: 4
- ease: 5
- next: split the /config, /decisions, /debug, /tiles routes into lazy chunks

### [ ] [2.0] /decisions: decided row 7 says "enemy record" and points at an unexplained "row 73" (critique LOW, pass 19)
- category: external-critique (voice)
- impact: 2
- ease: 10
- next: reword row 7's reading in `OPEN-QUESTIONS.md`

### [ ] [1.8] /config: a deck preset's "Hand size" reads as the deck total (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: relabel the preset field and say what it counts

### [ ] [1.8] /tiles: the site legend names the sites but not what they do (critique LOW, pass 19)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: a short effect after each site name, from ruleText

# Site audit — 2026-10-17 (pass 69, cloud tick)

Critique pass 19 (396b79e) filed two MED rows, so the MED bias applies again. The top row is the /decisions Checks list (5.3): its needs-user-call rows still named test files, phase numbers, slash commands and the repo README. Each check row in this file is reworded in player words, keeping what the designer has to do; the tiles check drops "proposed" and the phase 7 deadline, and the source-of-truth sync is tagged `[ops]`, which keeps it here for the operator and off the public list (14 checks become 13). A new test keeps file names, phase numbers and slash commands off the public checks.

## Top 5 findings (scored)

### [x] [5.3] /decisions: the Checks list still shows developer to-do notes (critique MED, pass 19)
- category: external-critique (voice)
- impact: 5
- ease: 7
- next: reword the needs-user-call rows; `[ops]` tag keeps operator rows off the public list
- issue: #123
- fixed: (this commit)

### [ ] [4.5] /: a stranger cannot learn what they start with or how a round turns over (critique MED, pass 19)
- category: external-critique (comprehension)
- impact: 6
- ease: 5
- next: a short "What you have" list from ruleText before "How a run goes"

### [ ] [2.0] all pages: the main script is 727 kB, over the build's own 600 kB warning (critique LOW)
- category: external-critique (perf)
- impact: 4
- ease: 5
- next: split the /config, /decisions, /debug, /tiles routes into lazy chunks

### [ ] [2.0] /decisions: decided row 7 says "enemy record" and points at an unexplained "row 73" (critique LOW, pass 19)
- category: external-critique (voice)
- impact: 2
- ease: 10
- next: reword row 7's reading in `OPEN-QUESTIONS.md`

### [ ] [1.8] /config: a deck preset's "Hand size" reads as the deck total (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: relabel the preset field and say what it counts

# Site audit — 2026-10-17 (pass 68, cloud tick)

Pass 67's milestone row shipped (5658bb3). No MED rows remain, so the MED bias applies to nothing. The top row is the /tiles terrain legend (2.1). Terrain only matters for entering a hex (rule 3.4; nothing in the engine reads Forest, Hills or Wasteland), so each legend item now says "no effect on moves" or "impassable", read from the content's IMPASSABLE list. Every row scores under 3.0 and the expand gate is closed (12 commits, under 48h since pass 12), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [2.1] /tiles: the legend says only which terrains are impassable, not what the others do (critique LOW, pass 12)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: each legend item says "no effect on moves" or "impassable", from `IMPASSABLE`
- issue: #122
- fixed: (this commit)

### [ ] [2.0] all pages: the main script is 727 kB, over the build's own 600 kB warning (critique LOW)
- category: external-critique (perf)
- impact: 4
- ease: 5
- next: split the /config, /decisions, /debug, /tiles routes into lazy chunks

### [ ] [1.8] /config: a deck preset's "Hand size" reads as the deck total (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: relabel the preset field and say what it counts

### [ ] [1.8] /play: a hex next to an enemy that costs too much just isn't offered, with no reason (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: name the reason in the move hint

### [ ] [1.8] /play: the "reveal 10 tiles" milestone may be unreachable (critique LOW)
- category: external-critique (rules)
- impact: 3
- ease: 6
- next: trace the revealable count; mark the milestone out of reach as pass 67 did for upgrades

# Site audit — 2026-10-16 (pass 67, cloud tick)

Pass 66's /config baseline row shipped (90858d8). No MED rows remain, so the MED bias applies to nothing. The top row is the run summary's "Buy 3 base upgrades" milestone (2.4), which default rules cannot reach (row 78). A new content helper counts the upgrades the Build cards can buy, and the run summary and /config mark the milestone out of reach. Every row scores under 3.0 and the expand gate is closed (11 commits, under 48h since pass 12), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [2.4] /play: the run summary lists "Buy 3 base upgrades", which default rules cannot reach (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: `upgradesReachable` and `milestoneOutOfReach` in `ruleText.ts`; run summary and /config milestone line show the reason
- issue: #121
- fixed: 5658bb3

### [ ] [2.1] /tiles: the legend says only which terrains are impassable, not what the others do (critique LOW, pass 12)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: add each terrain's effect after its name in the legend, from config

### [ ] [2.0] all pages: the main script is 727 kB, over the build's own 600 kB warning (critique LOW)
- category: external-critique (perf)
- impact: 4
- ease: 5
- next: split the /config, /decisions, /debug, /tiles routes into lazy chunks

### [ ] [1.8] /config: a deck preset's "Hand size" reads as the deck total (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: relabel the preset field and say what it counts

### [ ] [1.8] /play: a hex next to an enemy that costs too much just isn't offered, with no reason (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: name the reason in the move hint

# Site audit — 2026-10-16 (pass 66, cloud tick)

Pass 65's level-step row shipped (431fb35). No MED rows remain, so the MED bias applies to nothing. Two LOW rows tie at 2.4; the tie-break picks the oldest-filed, the /config baseline wording (pass 13). The "(6.9)" and siege "until" clauses were already gone; nine help texts still said "Off: the current rule", one promised a later Special, and the face names were cased two ways. Every row scores under 3.0 and the expand gate is closed (10 commits, 24h since pass 12), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW, pass 13)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one baseline pattern in `config.meta.json`; drop the "until ..." clause; one casing for face names
- issue: #120
- fixed: 90858d8

### [ ] [2.4] /play: the run summary lists "Buy 3 base upgrades", which default rules cannot reach (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: mark milestones the config cannot reach in the run summary and on /config

### [ ] [2.1] /tiles: the legend says only which terrains are impassable, not what the others do (critique LOW, pass 12)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: add each terrain's effect after its name in the legend, from config

### [ ] [2.0] all pages: the main script is 650 kB, over the build's own 600 kB warning (critique LOW)
- category: external-critique (perf)
- impact: 4
- ease: 5
- next: split the /play and /config routes into lazy chunks

### [ ] [1.8] /config: a deck preset's "Hand size" reads as the deck total (critique LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 6
- next: relabel the preset field and say what it counts

# Site audit — 2026-10-16 (pass 65, cloud tick)

Pass 64's "Also" line row shipped (4a1c111). No MED rows remain, so the MED bias applies to nothing. Three LOW rows tie at 2.4; the tie-break picks the oldest-filed, the level-step wording and per-enemy experience. Every row scores under 3.0 and the expand gate is closed (9 commits, 23h since pass 12), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [2.4] / and /config: the level steps are worded three ways, and no page gives each enemy's experience (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: return levelText from ruleLineFor for experience fields; add per-enemy amounts to levelText
- issue: #119
- fixed: 431fb35

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one baseline pattern in `config.meta.json`; drop "(6.9)" and the "until ..." clauses

### [ ] [2.4] /play: the run summary lists "Buy 3 base upgrades", which default rules cannot reach (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: mark milestones the config cannot reach in the run summary and on /config

### [ ] [2.1] /tiles: the legend says only which terrains are impassable, not what the others do (critique LOW, pass 12)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: add each terrain's effect after its name in the legend, from config

### [ ] [2.0] all pages: the main script is 650 kB, over the build's own 600 kB warning (critique LOW)
- category: external-critique (perf)
- impact: 4
- ease: 5
- next: split the /play and /config routes into lazy chunks

# Site audit — 2026-10-16 (pass 64, cloud tick)

Pass 63's /config citations row shipped (ed27a5c). No MED rows remain, so the MED bias applies to nothing. Three LOW rows tie at 2.4; the tie-break picks the cheapest, the "Also" line wording on /. Every row scores under 3.0 and the expand gate is closed (8 commits, 22h since pass 12), so the loop keeps draining LOW critique rows.

## Top 5 findings (scored)

### [x] [2.4] / : the "Also" line calls the tiles "proposed" and says rules questions "wait on you" (critique LOW, pass 18)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: change the link texts in `HomePage.tsx` to "the map tiles" and "the open rules questions"
- issue: #118
- fixed: 4a1c111

### [ ] [2.4] / and /config: the level steps are worded three ways, and no page gives each enemy's experience (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: return levelText from ruleLineFor for experience fields; add per-enemy amounts to levelText

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one baseline pattern in `config.meta.json`; drop "(6.9)" and the "until ..." clauses

### [ ] [2.4] /play: the run summary lists "Buy 3 base upgrades", which default rules cannot reach (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: mark milestones the config cannot reach in the run summary and on /config

### [ ] [2.1] /tiles: the legend says only which terrains are impassable, not what the others do (critique LOW, pass 12)
- category: external-critique (comprehension)
- impact: 3
- ease: 7
- next: add each terrain's effect after its name in the legend, from config

# Site audit — 2026-10-16 (pass 63, cloud tick)

Pass 62's knockout log row shipped (3378e0c). No MED rows remain, so the MED bias applies to nothing. The /config citations row is the top LOW at 2.6; every remaining row scores under 3.0, and the loop keeps draining LOW critique rows while the expand gate is closed.

## Top 5 findings (scored)

### [x] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: name open rows "rule reading N" and link them to /decisions; leave decided rows out
- issue: #117
- fixed: ed27a5c

### [ ] [2.4] / and /config: the level steps are worded three ways, and no page gives each enemy's experience (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: return levelText from ruleLineFor for experience fields; add per-enemy amounts to levelText

### [ ] [2.4] / : the "Also" line calls the tiles "proposed" and says rules questions "wait on you" (critique LOW, pass 18)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: change the link texts in `HomePage.tsx` to "the map tiles" and "the open rules questions"

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one baseline pattern in `config.meta.json`; drop "(6.9)" and the "until ..." clauses

### [ ] [2.4] /play: the run summary lists "Buy 3 base upgrades", which default rules cannot reach (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: mark milestones the config cannot reach in the run summary and on /config

# Site audit — 2026-10-16 (pass 62, cloud tick)

Pass 61's GitHub link mark shipped (5fc7a03). No MED rows remain, so the MED bias applies to nothing. The knockout log row is now the top LOW at 2.7.

## Top 5 findings (scored)

### [x] [2.7] /play: the knockout log names only lost materials and prints "1 materials" (critique LOW, pass 18)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: name both losses with correct plurals in `describeEvent.ts`; pin in `knockoutLog.test.ts`
- issue: #116
- fixed: (this commit)

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

### [ ] [2.4] / and /config: the level steps are worded three ways, and no page gives each enemy's experience (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: return levelText from ruleLineFor for experience fields; add per-enemy amounts to levelText

### [ ] [2.4] / : the "Also" line calls the tiles "proposed" and says rules questions "wait on you" (critique LOW, pass 18)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: change the link texts in `HomePage.tsx` to "the map tiles" and "the open rules questions"

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one baseline pattern in `config.meta.json`; drop "(6.9)" and the "until ..." clauses

# Site audit — 2026-10-16 (pass 61, cloud tick)

Pass 60's start panel fix shipped (a740b4e); no MED rows remain, so the MED bias applies to nothing. Two LOW rows tie at 2.7; the tie-break takes the older one, the home page's GitHub link from discovery 1.

## Top 5 findings (scored)

### [x] [2.7] /: the "written rules" link leaves the site with no sign (critique LOW, discovery 1)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: "(on GitHub)" after the link text; update `HomePage.test.tsx`
- issue: #115
- fixed: (this commit)

### [ ] [2.7] /play: the knockout log names only lost materials and prints "1 materials" (critique LOW, pass 18)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: name both losses with correct plurals in `describeEvent.ts`

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

### [ ] [2.4] / and /config: the level steps are worded three ways, and no page gives each enemy's experience (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: return levelText from ruleLineFor for experience fields; add per-enemy amounts to levelText

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8
- next: one name for the baseline across the /config help texts; drop roadmap wording

# Site audit — 2026-10-16 (pass 60, cloud tick)

Pass 59's / Engage wording fix shipped (9ed6514). The start panel row is the last MED in the queue, so the external-critique MED bias (x1.5) applies to it and it leads at 5.3. With it done no MED rows remain; the next tick's LOW leaders are the GitHub link mark and the knockout log plurals, both at 2.7.

## Top 5 findings (scored)

### [x] [5.3] /play: the start panel shows rule text from the default config, not the saved one (critique MED, pass 18)
- category: external-critique (comprehension)
- impact: 5
- ease: 7
- next: the Combat hint and knockout line read the saved config; the Players select lists the config's player range and starts at its fewest
- issue: #114
- fixed: (this commit)

### [ ] [2.7] /: the "written rules" link leaves the site with no sign (critique LOW, discovery 1)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: "(on GitHub)" after the link text; update `HomePage.test.tsx`

### [ ] [2.7] /play: the knockout log names only lost materials and prints "1 materials" (critique LOW, pass 18)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: name both losses with correct plurals in `describeEvent.ts`

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

### [ ] [2.4] / and /config: the level steps are worded three ways, and no page gives each enemy's experience (critique LOW, pass 18)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: return levelText from ruleLineFor for experience fields; add per-enemy amounts to levelText

# Site audit — 2026-10-16 (pass 59, cloud tick)

Pass 58's Roll again fix shipped, and critique pass 18 (9420b62) filed 2 MED rows, so the external-critique MED bias (x1.5) applies again. The / Engage wording row is a one-phrase change in the shared rule text (the card names come from the config's starter deck), so it leads at 8.1; the start panel row needs the saved config threaded through four helpers and the player range, so it follows.

## Top 5 findings (scored)

### [x] [8.1] /: the Combat step says "Play an Engage card"; Engage is an option on Move and Gather (critique MED, pass 18)
- category: external-critique (comprehension)
- impact: 6
- ease: 9
- next: combatText says "Play a card's Engage option (on Move and Gather)", the names read from the config's starter deck
- issue: #113
- fixed: (this commit)

### [ ] [5.3] /play: the start panel shows rule text from the default config, not the saved one (critique MED, pass 18)
- category: external-critique (comprehension)
- impact: 5
- ease: 7
- next: pass the `config` prop to combatText, siegeText and knockoutText; build the Players options from the config's player range

### [ ] [2.7] /: the "written rules" link leaves the site with no sign (critique LOW, discovery 1)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: "(on GitHub)" after the link text; update `HomePage.test.tsx`

### [ ] [2.7] /play: the knockout log names only lost materials and prints "1 materials" (critique LOW, pass 18)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: name both losses with correct plurals in `describeEvent.ts`

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

# Site audit — 2026-10-16 (pass 58, cloud tick)

Pass 57's /tiles casing fix shipped, and expand pass 12 (c80efff) found nothing new. No MED rows remain, so the bias does not apply. Re-scored the whole Pending queue, not only the pass 17 rows: the blind-round-4 Roll again row hits every engagement on /play (the main surface), and the fix is a disabled button with its reason plus a helper test, so it scores 3.2 and leads.

## Top 5 findings (scored)

### [x] [3.2] /play: Roll again stays on when every die is kept (critique LOW, blind round 4)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: disable Roll again when every die is kept and say so on the button ("Roll again: every die is kept")
- issue: #112
- fixed: (this commit)

### [ ] [2.7] /: the "written rules" link leaves the site with no sign (critique LOW, discovery 1)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: "(on GitHub)" after the link text; update `HomePage.test.tsx`

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 4
- ease: 6
- next: one word for the baseline; drop roadmap wording from help

### [ ] [2.4] /tiles: the legend says only which terrains are impassable, not what the others do (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6
- next: one line per terrain in the legend

# Site audit — 2026-10-15 (pass 57, cloud tick)

Pass 56's draft help fix shipped; no MED rows remain, so the bias does not apply. The two 2.6 rows tie; the /tiles casing row is the cheaper one (one shared helper, one CSS line, tests), so it leads.

## Top 5 findings (scored)

### [x] [2.6] /tiles: terrain names are lower case in the legend and capitalised in the hex lists (critique LOW, pass 17)
- category: external-critique (voice)
- impact: 3
- ease: 8.5
- next: legend and tile drawing labels through the capitalising helper the hex lists use; drop the CSS text-transform
- issue: #111
- fixed: (this commit)

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 4
- ease: 6
- next: one word for the baseline; drop roadmap wording from help

### [ ] [2.4] /tiles: the legend says only which terrains are impassable, not what the others do (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6
- next: one line per terrain in the legend

### [ ] [2.0] all pages: the main script is 650 kB, over the build's own 600 kB warning (critique LOW)
- category: external-critique (perf)
- impact: 4
- ease: 5
- next: split the 3D dice and /debug out of the main chunk

# Site audit — 2026-10-15 (pass 56, cloud tick)

Pass 55's /decisions row 17 fix shipped; no MED rows remain, so the bias does not apply. Re-scored the pass-17 draft help row: the fix is one help string in `config.meta.json` plus a test, the same cost as row 17 (ease 8), so it leads at 3.2.

## Top 5 findings (scored)

### [x] [3.2] /config: the draft help says "each round that this number divides" (critique LOW, pass 17)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "a draft happens every N rounds: at 2, in rounds 2, 4, and 6." in `config.meta.json`
- issue: #110
- fixed: (this commit)

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

### [ ] [2.6] /tiles: terrain names are lower case in the legend and capitalised in the hex lists (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8.5
- next: one casing for terrain names

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 4
- ease: 6
- next: one word for the baseline; drop roadmap wording from help

### [ ] [2.4] /tiles: the legend says only which terrains are impassable, not what the others do (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6
- next: one line per terrain in the legend

# Site audit — 2026-10-15 (pass 55, cloud tick)

Pass 54's /config rules note shipped; no MED rows remain, so the bias does not apply. Re-scored the pass-17 row 17 finding: the fix is one reading cell in `OPEN-QUESTIONS.md` plus a regenerated digest, the same cost as row 7 (ease 8), so it leads at 3.2.

## Top 5 findings (scored)

### [x] [3.2] /decisions: row 17 says "steps of 3" and prints `eliteBonus: 5` (critique LOW, pass 17)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: "each step grows by 3 (3, 9, 18, 30)"; "now the default"; "5 extra experience for an elite"
- issue: #109
- fixed: (this commit)

### [ ] [2.8] /config: the draft help says "each round that this number divides" (critique LOW, pass 17)
- category: external-critique (voice)
- impact: 4
- ease: 7
- next: "a draft happens every N rounds (2: rounds 2, 4, 6)" in `config.meta.json`

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

### [ ] [2.6] /tiles: terrain names are lower case in the legend and capitalised in the hex lists (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8.5
- next: one casing for terrain names

### [ ] [2.4] /config: help texts name the baseline three ways and carry roadmap wording (critique LOW)
- category: external-critique (voice)
- impact: 4
- ease: 6
- next: one word for the baseline; drop roadmap wording from help

# Site audit — 2026-10-15 (pass 54, cloud tick)

Pass 53's two rows shipped; no MED rows remain, so the bias does not apply. The pass-13 /config rules note is the top LOW row at 3.0.

## Top 5 findings (scored)

### [x] [3.0] /config: the rules note prints "Rules engagements." and "Rules core loop (open question 55)." (critique LOW, pass 13)
- category: external-critique (voice)
- impact: 4
- ease: 7.5
- next: `configRuleNote` drops design-document tags; a field with no section reads "Not in the written rules"
- issue: #108
- fixed: (this commit)

### [ ] [2.8] /decisions: row 17 says "steps of 3" and prints `eliteBonus: 5` (critique LOW, pass 17)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: "each step grows by 3 (3, 9, 18, 30)"; "5 extra experience for an elite"

### [ ] [2.8] /config: the draft help says "each round that this number divides" (critique LOW, pass 17)
- category: external-critique (voice)
- impact: 4
- ease: 7
- next: "a draft happens every N rounds (2: rounds 2, 4, 6)" in `config.meta.json`

### [ ] [2.6] /config: "(open question N)" citations are plain text and name a list /decisions does not show (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 6.5
- next: link the citations to /decisions, or show every row there

### [ ] [2.6] /tiles: terrain names are lower case in the legend and capitalised in the hex lists (critique LOW)
- category: external-critique (voice)
- impact: 3
- ease: 8.5
- next: one casing for terrain names

# Site audit — 2026-10-15 (pass 53, cloud tick)

Pass 52's Levels row shipped; no MED rows remain, so the bias does not apply. Two LOW rows tie at 3.2; the pass-16 Training line shipped first, then the pass-17 row 7 siege reading.

## Top 5 findings (scored)

### [x] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds
- issue: #106
- fixed: (this commit)

### [x] [3.2] /decisions: decided row 7 still states the v1 siege reading before the Spec v2 one (critique LOW, pass 17)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: drop the "Designer intends ... elite 6 dice." sentences from row 7
- issue: #107
- fixed: (this commit)

### [ ] [3.0] /config: the rules note prints "Rules engagements." and "Rules core loop (open question 55)." (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 7.5
- next: read the rule ids into plain words, or drop them from the note

### [ ] [2.8] /decisions: row 17 says "steps of 3" and prints `eliteBonus: 5` (critique LOW, pass 17)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: "each step grows by 3 (3, 9, 18, 30)"; "5 extra experience for an elite"

### [ ] [2.8] /config: the draft help says "each round that this number divides" (critique LOW, pass 17)
- category: external-critique (voice)
- impact: 4
- ease: 7
- next: "a draft happens every N rounds (2: rounds 2, 4, 6)" in `config.meta.json`

# Site audit — 2026-10-15 (pass 52, cloud tick)

Pass 51's MED row shipped; no MED rows remain, so the bias does not apply. Three LOW rows tie at 3.2; the two pass-16 rows are older, and the Levels line is the cheaper of them.

## Top 5 findings (scored)

### [x] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`
- issue: #105
- fixed: (this commit)

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /decisions: decided row 7 still states the v1 siege reading before the Spec v2 one (critique LOW, pass 17)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: drop the "Designer intends ... elite 6 dice." sentences from row 7

### [ ] [3.0] /config: the rules note prints "Rules engagements." and "Rules core loop (open question 55)." (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 7.5
- next: read the rule ids into plain words, or drop them from the note

### [ ] [2.8] /decisions: row 17 says "steps of 3" and prints `eliteBonus: 5` (critique LOW, pass 17)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: "each step grows by 3 (3, 9, 18, 30)"; "5 extra experience for an elite"

# Site audit — 2026-10-15 (pass 51, cloud tick)

Critique pass 17 filed one MED row; the oversight bias (external-critique MED, x1.5) lifts it to the top.

## Top 5 findings (scored)

### [x] [6.3] /decisions: rule reading 4 gives three tile counts and calls itself "Superseded" while still pending (critique MED, pass 17)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: one count from the content (8 tiles can be revealed), drop the "Superseded" sentence, regenerate `docs/DECISIONS.md`
- issue: #104
- fixed: (this commit)

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`

### [ ] [3.2] /decisions: decided row 7 still states the v1 siege reading before the Spec v2 one (critique LOW, pass 17)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: drop the "Designer intends ... elite 6 dice." sentences from row 7

### [ ] [3.0] /config: the rules note prints "Rules engagements." and "Rules core loop (open question 55)." (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 7.5
- next: read the rule ids into plain words, or drop them from the note

# Site audit — 2026-10-15 (pass 50, cloud tick)

Pass 49's top row shipped; no MED rows remain, so the bias does not apply. Four LOW rows tie at 3.2; the oldest (pass 9) wins the tie-break: the /config save message.

## Top 5 findings (scored)

### [x] [3.2] /config: the save message names a URL path, not the page (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Saved. New runs on the Play page use this config."
- issue: #103
- fixed: (this commit)

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`

### [ ] [3.0] /config: the rules note prints "Rules engagements." and "Rules core loop (open question 55)." (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 7.5
- next: read the rule ids into plain words, or drop them from the note

### [ ] [2.8] /decisions: the "Try this on /play" button names a URL path, not the page (iterate audit)
- category: voice
- impact: 4
- ease: 7
- next: "Try this on the Play page"; update the unit and e2e tests that pin the label

# Site audit — 2026-10-14 (pass 49, cloud tick)

Pass 48's top row shipped; no MED rows remain, so the bias does not apply. Four LOW rows tie at 3.2; the Combat-step row is the cheapest of the pass 16 ties and fixes the line a new player reads first on /, on the /play start panel, and in the playtest kit.

## Top 5 findings (scored)

### [x] [3.2] /: the Combat step says "Play Engage" and "each enemy record gives its dice" (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Play an Engage card"; name grunt and elite dice from the enemy content
- issue: #102
- fixed: (this commit)

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`

### [ ] [3.2] /config: the save message names a URL path, not the page (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Saved. New runs on the Play page use this config."

### [ ] [3.0] /config: the rules note prints "Rules engagements." and "Rules core loop (open question 55)." (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 7.5
- next: read the rule ids into plain words, or drop them from the note

# Site audit — 2026-10-14 (pass 48, cloud tick)

Pass 47's top row shipped; no MED rows remain, so the bias does not apply. Re-scoring the older LOW rows, the pass 8 home-page row is still live and the cheapest navigation fix in the queue (impact 4, ease 9); it outranks the 3.2 ties.

## Top 5 findings (scored)

### [x] [3.6] /: the home page does not link the Decisions page (critique LOW, pass 8)
- category: external-critique (navigation)
- impact: 4
- ease: 9
- next: add "the rules questions that wait on you" linked to /decisions to the "Also:" line
- issue: #101
- fixed: (this commit)

### [ ] [3.2] /: the Combat step says "Play Engage" and "each enemy record gives its dice" (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Play an Engage card"; name grunt and elite dice from the enemy content

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`

### [ ] [3.2] /config: the save message names a URL path, not the page (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Saved. New runs on the Play page use this config."

# Site audit — 2026-10-14 (pass 47, cloud tick)

Pass 46's top row shipped; no MED rows remain, so the bias does not apply. Four LOW rows tie at 3.2; the oldest (pass 14) wins the tie-break: the /play phase bar.

## Top 5 findings (scored)

### [x] [3.2] /play: the phase bar arrow is read aloud and the enemy cap is unexplained (critique LOW, pass 14)
- category: external-critique (a11y)
- impact: 4
- ease: 8
- next: hide the arrow from screen readers; say the 20 is the miniature limit
- issue: #100
- fixed: (this commit)

### [ ] [3.2] /: the Combat step says "Play Engage" and "each enemy record gives its dice" (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Play an Engage card"; name grunt and elite dice from the enemy content

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`

### [ ] [3.2] /config: the rules note prints "Rules engagements." for fields with no written-rules section (critique LOW, pass 13)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: print "Not in the written rules (open question N)" or nothing

# Site audit — 2026-10-14 (pass 46, cloud tick)

Pass 45's top row shipped; no MED rows remain, so the bias does not apply. Four LOW rows tie at 3.2; the oldest (pass 14) wins the tie-break: the /tiles intro.

## Top 5 findings (scored)

### [x] [3.2] /tiles: "Proposed layouts for review" does not say if /play uses them (critique LOW, pass 14)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: say on /tiles that /play builds its map from these tiles; match the headings' capitals
- issue: #99
- fixed: (this commit)

### [ ] [3.2] /play: the phase bar arrow is read aloud and the enemy cap is unexplained (critique LOW, pass 14)
- category: external-critique (a11y)
- impact: 4
- ease: 8
- next: hide the arrow from screen readers; say the 20 is the miniature limit

### [ ] [3.2] /: the Combat step says "Play Engage" and "each enemy record gives its dice" (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Play an Engage card"; name grunt and elite dice from the enemy content

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`

# Site audit — 2026-10-14 (pass 45, cloud tick)

Pass 44's top row shipped; no MED rows remain, so the bias does not apply. Four LOW rows tie at 3.2; the oldest (pass 14) wins the tie-break: the /play start panel Combat hint.

## Top 5 findings (scored)

### [x] [3.2] /play: the start panel Combat hint repeats its label (critique LOW, pass 14)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: drop the "Combat:" prefix in `StartPanel.tsx`
- issue: #98
- fixed: (this commit)

### [ ] [3.2] /: the Combat step says "Play Engage" and "each enemy record gives its dice" (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Play an Engage card"; name grunt and elite dice from the enemy content

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`

### [ ] [3.2] /tiles: "Proposed layouts for review" does not say if /play uses them (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: say on /tiles which layout /play uses

# Site audit — 2026-10-14 (pass 44, cloud tick)

Pass 43's top row shipped. The one MED row left leads under the MED bias: the /decisions setting lines in config keys and code values (pass 14).

## Top 5 findings (scored)

### [x] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`
- issue: #97
- fixed: (this commit)

### [ ] [3.2] /play: the start panel Combat hint repeats its label (critique LOW, pass 14)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: drop the "Combat:" prefix in `StartPanel.tsx`

### [ ] [3.2] /: the Combat step says "Play Engage" and "each enemy record gives its dice" (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Play an Engage card"; name grunt and elite dice from the enemy content

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

### [ ] [3.2] /: the Levels line says "3 more than the step before" with no step defined (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: give the first thresholds from config in `ruleText`

# Site audit — 2026-10-14 (pass 43, cloud tick)

Pass 42's top row shipped. Two MED rows lead under the MED bias; the older one, the enemy target rule stated two ways (pass 13), goes first.

## Top 5 findings (scored)

### [x] [4.5] / and /config: the enemy target rule is stated two ways (critique MED, pass 13)
- category: external-critique (voice)
- impact: 5
- ease: 6
- next: drop the targeting clause from `spawnText`; show a short `targetText` on / and in the PROTOCOL teach list
- issue: #96
- fixed: (this commit)

### [ ] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`

### [ ] [3.2] /play: the start panel Combat hint repeats its label (critique LOW, pass 14)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: drop the "Combat:" prefix in `StartPanel.tsx`

### [ ] [3.2] /: the Combat step says "Play Engage" and "each enemy record gives its dice" (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Play an Engage card"; name grunt and elite dice from the enemy content

### [ ] [3.2] /: the Training line omits the Build card and when the draft happens (critique LOW, pass 16)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: build `trainingText` like `shopText`; name the draft rounds

# Site audit — 2026-10-14 (pass 42, cloud tick)

Pass 41's top row shipped. Critique pass 16 filed a MED on /decisions: decided rows 7, 55, 65, 69 and 72 still give pre-Spec-v2 readings that contradict /. One fix also closes the pass 15 LOW on rows 74 and 75, so it scores highest under the MED bias.

## Top 5 findings (scored)

### [x] [5.4] /decisions: decided rows give pre-Spec-v2 readings that contradict / (critique MED, pass 16; closes pass 15 LOW rows 74/75)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: a `**Spec v2:**` note in each superseded Reading cell, split off by `splitReading` onto its own line; regenerate `docs/DECISIONS.md`
- issue: #95
- fixed: (this commit)

### [ ] [4.5] / and /config: the enemy target rule is stated two ways (critique MED, pass 13)
- category: external-critique (voice)
- impact: 5
- ease: 6
- next: drop the targeting clause from `spawnText`; show a short `targetOrderText` on /

### [ ] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`

### [ ] [3.2] /play: the start panel Combat hint repeats its label (critique LOW, pass 14)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: drop the "Combat:" prefix in `StartPanel.tsx`

### [ ] [3.2] /: the Combat step says "Play Engage" and "each enemy record gives its dice" (critique LOW, pass 16)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Play an Engage card"; name grunt and elite dice from the enemy content

# Site audit — 2026-10-14 (pass 41, cloud tick)

Pass 40's top row shipped. Three MED rows tie at 4.5 under the MED bias; the oldest goes first: /decisions shows every visitor the repo's `.env` and token notes.

## Top 5 findings (scored)

### [x] [4.5] /decisions: the public page lists repo housekeeping (critique MED, discovery 1)
- category: external-critique (comprehension)
- impact: 5
- ease: 6
- next: `parseUserCalls` skips needs-user-call lines naming `.env`, a token, or the local checkout; regenerate `docs/DECISIONS.md`
- issue: #94
- fixed: (this commit)

### [ ] [4.5] / and /config: the enemy target rule is stated two ways (critique MED, pass 13)
- category: external-critique (voice)
- impact: 5
- ease: 6
- next: drop the targeting clause from `spawnText`; show a short `targetOrderText` on /

### [ ] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`

### [ ] [3.6] /decisions: rows 74 and 75 describe options phase 41 removed (critique LOW, pass 15)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: mark both "Option removed in Spec v2"

### [ ] [3.2] /play: the start panel Combat hint repeats its label (critique LOW, pass 14)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: drop the "Combat:" prefix in `StartPanel.tsx`

# Site audit — 2026-10-13 (pass 40, cloud tick)

Pass 39's top row shipped. The siege row is next: / says the run ends when the base falls but never says how the base takes damage, and the start panel's "Enemies hit structures at the end of Combat" was typed by hand with no numbers.

## Top 5 findings (scored)

### [x] [5.4] /: the home page never says how the base takes damage under engagements (critique MED, pass 13)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: `siegeText(content)` in `ruleText`, from each enemy record's siege damage, used on /, the start panel and /config
- issue: #93
- fixed: (this commit)

### [ ] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`

### [ ] [4.5] / and /config: the enemy target rule is stated two ways (critique MED, pass 13)
- category: external-critique (voice)
- impact: 5
- ease: 6
- next: drop the targeting clause from `spawnText`; show a short `targetOrderText` on /

### [ ] [4.5] /decisions: the public page lists repo housekeeping (critique MED)
- category: external-critique (comprehension)
- impact: 5
- ease: 6
- next: see the CRITIQUE.md row

### [ ] [3.6] /decisions: rows 74 and 75 describe options phase 41 removed (critique LOW, pass 15)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: mark both "Option removed in Spec v2"

# Site audit — 2026-10-13 (pass 39, cloud tick)

Pass 38's top row shipped. The pass 13 MED rows stay on top under the MED bias (x1.5). The enemy dice timing comes first: the banner and the modal now agree, but / and /config still told it two other ways, and "after your guard" read as if guard acted first.

## Top 5 findings (scored)

### [x] [5.4] /play, / and /config: four accounts of when the enemy dice hit in an engagement (critique MED, pass 13)
- category: external-critique (voice)
- impact: 6
- ease: 6
- next: one `enemyHitText(config)` in `ruleText`, read by `combatText` (/ and the start panel), the modal's assign line (and so the banner), and /config help for hit damage and defeated dice
- issue: #92
- fixed: (this commit)

### [ ] [5.4] /: the home page never says how the base takes damage under engagements (critique MED, pass 13)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: `siegeText(config)` in `ruleText`, used on /, the start panel and /config

### [ ] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`

### [ ] [4.5] / and /config: the enemy target rule is stated two ways (critique MED, pass 13)
- category: external-critique (voice)
- impact: 5
- ease: 6
- next: drop the targeting clause from `spawnText`; show a short `targetOrderText` on /

### [ ] [3.6] /decisions: rows 74 and 75 describe options phase 41 removed (critique LOW, pass 15)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: mark both "Option removed in Spec v2"

# Site audit — 2026-10-13 (pass 38, cloud tick)

Pass 37's top row shipped. Re-scoring the whole critique queue with the MED bias (x1.5) lifts the pass 13 MED rows above the pass 37 list: the engagement banner tells the player to click the map while the modal in front of it picks targets with no map. A wrong instruction on the main play surface, and a cheap fix.

## Top 5 findings (scored)

### [x] [6.3] /play: during an engagement the banner says click the map; the modal says choose in the modal (critique MED, pass 13)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: the banner reads `engageInstruction`; drop the `ENGAGE` table
- issue: #91
- fixed: (this commit)

### [ ] [5.4] /play, / and /config: four accounts of when the enemy dice hit in an engagement (critique MED, pass 13)
- category: external-critique (voice)
- impact: 6
- ease: 6
- next: one `ruleText` phrase read by the modal, /, and /config help

### [ ] [5.4] /: the home page never says how the base takes damage under engagements (critique MED, pass 13)
- category: external-critique (comprehension)
- impact: 6
- ease: 6
- next: `siegeText(config)` in `ruleText`, used on /, the start panel and /config

### [ ] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`

### [ ] [4.5] / and /config: the enemy target rule is stated two ways (critique MED, pass 13)
- category: external-critique (voice)
- impact: 5
- ease: 6
- next: drop the targeting clause from `spawnText`; show a short `targetOrderText` on /

# Site audit — 2026-10-13 (pass 37, cloud tick)

Pass 36's top row shipped. The home page growth line is next: it gave no when or how, and it said levels bring Skill drafts, which Spec v2 8.4 does not (a level gives a die; the Training Ground drafts).

## Top 5 findings (scored)

### [x] [6.3] /: "Level up, buy cards in the Shop, and draft Skills" gives no when or how (critique MED, pass 14)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: `levelText`, `shopText`, `trainingText` in `ruleText`, read by / under "How you grow"
- issue: #90
- fixed: (this commit)

### [ ] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`

### [ ] [3.6] /decisions: rows 74 and 75 describe options phase 41 removed (critique LOW, pass 15)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: mark both "Option removed in Spec v2"

### [ ] [3.6] /play: the start panel Combat hint repeats its label (critique LOW, pass 14)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: drop the "Combat:" prefix on the hint

### [ ] [3.6] /play: the phase bar arrow is read aloud and the enemy cap is unexplained (critique LOW, pass 14)
- category: external-critique (a11y)
- impact: 4
- ease: 9
- next: `aria-hidden` on the arrow; say 20 is the miniature limit

# Site audit — 2026-10-13 (pass 36, cloud tick)

Pass 15's MED rows are shipped. The queue still holds pass 13 and 14 MED rows, which the MED bias (x1.5) lifts above the pass 15 LOW row. The cheapest is the /decisions Combat model line, which names only the Config page although /play picks the Combat model per run.

## Top 5 findings (scored)

### [x] [6.8] /decisions: the Combat model line names only the Config page (critique MED, pass 14)
- category: external-critique (comprehension)
- impact: 5
- ease: 9
- next: name the Play start panel (one run) and the Config page (every new run) in `combatModelLine`
- issue: #89
- fixed: (this commit)

### [x] [6.3] /: "Level up, buy cards in the Shop, and draft Skills" gives no when or how (critique MED, pass 14)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: one `ruleText` line each for the Shop and for levels, numbers from config

### [ ] [4.5] /decisions: each "Setting:" line shows raw config keys and code values (critique MED, pass 14)
- category: external-critique (voice)
- impact: 6
- ease: 5
- next: lead with the plain label and value from `config.meta.json`

### [ ] [3.6] /decisions: rows 74 and 75 describe options phase 41 removed (critique LOW, pass 15)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: mark both "Option removed in Spec v2"

### [ ] [3.6] /play: the start panel Combat hint repeats its label (critique LOW, pass 14)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: drop the "Combat:" prefix on the hint

# Site audit — 2026-10-13 (pass 35, cloud tick)

Critique pass 15 filed six rows after phase 41 moved the engine to Spec v2. The HIGH row leads: / and /play called Exchanges "the Combat in the written rules", while Spec v2 6.10 makes Engage the only Combat. The MED rows on the same drift (config.meta.json help, /decisions rows 17 and 60) score 7.2 with the MED bias and follow.

## Top 5 findings (scored)

### [x] [7.2] / and /play: Exchanges is called the Combat in the written rules (critique HIGH, pass 15)
- category: external-critique (comprehension)
- impact: 9
- ease: 8
- next: link the written rules from the Engagements text; Exchanges is "the older Combat kept for playtests"
- issue: #85
- fixed: f0ad808

### [x] [7.2] /config: two help texts call the Spec v1 option "the written rule" (critique MED, pass 15)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: swap the "written rule" marks in `config.meta.json` for 6.9 and 11.7
- issue: #86
- fixed: 7dfe010

### [x] [7.2] /config: "Rolls per exchange" names the old Combat and the wrong step (critique MED, pass 15)
- category: external-critique (voice)
- impact: 6
- ease: 8
- next: "Rolls per engagement", rule 7.8 step 3
- issue: #87
- fixed: 091c25e

### [x] [6.3] /decisions: rows 17 and 60 give Spec v1 numbers (critique MED, pass 15)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: update `OPEN-QUESTIONS.md` rows 17 and 60, regenerate `docs/DECISIONS.md`
- issue: #88
- fixed: (this commit)

### [ ] [3.6] /decisions: rows 74 and 75 describe options phase 41 removed (critique LOW, pass 15)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: mark both "Option removed in Spec v2"

# Site audit — 2026-10-10 (pass 34, cloud tick)

The queue is unchanged since pass 33 apart from its shipped top row. The draft pool row now leads. The line shows only while `draft.unpicked` is `"pool"` (the default); with `"supply"` unkept Skills leave, so the dialog says nothing.

## Top 5 findings (scored)

### [x] [3.0] /play: the Skill draft does not say unkept Skills go to the pool (critique LOW, pass 11)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: a muted line under the draft title
- issue: #70
- fixed: (this commit)

### [ ] [2.4] /play: a hex next to an enemy that costs too much is not offered, with no reason (session residue LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: when `combat.moveCostNextToEnemy` is above 1, say it in the Move banner

### [ ] [2.4] /play: Roll again stays on when every die is kept (blind round 4 LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: disable Roll again when no die is unkept

# Site audit — 2026-10-10 (pass 33, cloud tick)

The queue is unchanged since pass 32 apart from its shipped top row. The voice row from critique pass 11 now leads. Besides the three places the row names, two more /config help lines carried "designer, 2026-10-09" (defeated enemies' dice, Skill uses); they say "(default)" too. Rule tags and code comments keep their dates; only visitor copy changes.

## Top 5 findings (scored)

### [x] [3.2] /play and /config: copy says "the designer's playtest Combat", "designer 2026-10-09", and "Combat v3" (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Engagements: play Engage ..." in the hint; "(default)" in help notes; group "Engagement numbers"
- issue: #69
- fixed: (this commit)

### [ ] [3.0] /play: the Skill draft does not say unkept Skills go to the pool (critique LOW, pass 11)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: a muted line under the draft title

### [ ] [2.4] /play: a hex next to an enemy that costs too much is not offered, with no reason (session residue LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: when `combat.moveCostNextToEnemy` is above 1, say it in the Move banner

# Site audit — 2026-10-10 (pass 32, cloud tick)

The queue is unchanged since pass 31 apart from its shipped top row. The engagement log row now leads. The engine already tags an engagement's end with the Combat v3 rule and an exchange's with 7.8, so the log reads that tag; no engine event changes, so the golden replays keep their hashes.

## Top 5 findings (scored)

### [x] [3.6] /play: the engagement log ends with "The exchange ends." (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: print "The engagement ends." for an engagement
- issue: #68
- fixed: (this commit)

### [ ] [3.2] /play and /config: copy says "the designer's playtest Combat", "designer 2026-10-09", and "Combat v3" (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Engagements: play Engage ..." in the hint; "(default)" in help notes; group "Engagement numbers"

### [ ] [3.0] /play: the Skill draft does not say unkept Skills go to the pool (critique LOW, pass 11)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: a muted line under the draft title

### [ ] [2.4] /play: a hex next to an enemy that costs too much is not offered, with no reason (session residue LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: when `combat.moveCostNextToEnemy` is above 1, say it in the Move banner

# Site audit — 2026-10-10 (pass 31, cloud tick)

The queue is unchanged since pass 30 apart from its shipped top row. The two LOW voice rows from critique pass 11 tie at 3.6; the banner row is older in the file, so it goes first. The Skill board under the modal said "Finish engagement" too, so it now uses the modal's words.

## Top 5 findings (scored)

### [x] [3.6] /play: the engagement banner names a "Finish engagement" button that does not exist (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "Repeat, or choose End engagement"
- issue: #67
- fixed: (this commit)

### [ ] [3.6] /play: the engagement log ends with "The exchange ends." (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: print "The engagement ends." for an engagement

### [ ] [3.2] /play and /config: copy says "the designer's playtest Combat", "designer 2026-10-09", and "Combat v3" (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Engagements: play Engage ..." in the hint; "(default)" in help notes; group "Engagement numbers"

### [ ] [3.0] /play: the Skill draft does not say unkept Skills go to the pool (critique LOW, pass 11)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: a muted line under the draft title

### [ ] [2.4] /play: a hex next to an enemy that costs too much is not offered, with no reason (session residue LOW)
- category: external-critique (comprehension)
- impact: 3
- ease: 8
- next: when `combat.moveCostNextToEnemy` is above 1, say it in the Move banner

# Site audit — 2026-10-10 (pass 30, cloud tick)

The queue is unchanged since pass 29 apart from its shipped top row. The last blind-round-4 MED row now leads: a Skill with more slots than the player has dice says how many it needs.

## Top 5 findings (scored)

### [x] [4.2] /play: a Skill needing more dice than the player has gives no hint (blind round 4 MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: mark a Skill whose slots outnumber the player's dice ("needs 2 dice")
- issue: #66
- fixed: (this commit)

### [ ] [3.6] /play: the engagement banner names a "Finish engagement" button that does not exist (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "Repeat, or choose End engagement"

### [ ] [3.6] /play: the engagement log ends with "The exchange ends." (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: print "The engagement ends." for an engagement

### [ ] [3.2] /play and /config: copy says "the designer's playtest Combat", "designer 2026-10-09", and "Combat v3" (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Engagements: play Engage ..." in the hint; "(default)" in help notes; group "Engagement numbers"

### [ ] [3.0] /play: the Skill draft does not say unkept Skills go to the pool (critique LOW, pass 11)
- category: external-critique (comprehension)
- impact: 4
- ease: 8
- next: a muted line under the draft title

# Site audit — 2026-10-10 (pass 29, cloud tick)

The queue is unchanged since pass 28 apart from its shipped top row. The two blind-round-4 MED rows tie; the step-aside row is copy and one board caption, so it goes first. The board now says what comes next while the modal steps aside, which keeps the damage number on the board that phase 24 asked for.

## Top 5 findings (scored)

### [x] [4.2] /play: the result after a target pick can read as skipped (blind round 4 MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: a caption on the board during the step-aside: "Engagement over. The result comes next." or "Back to the engagement in a moment."
- issue: #65
- fixed: (this commit)

### [ ] [4.2] /play: a Skill needing more dice than the player has gives no hint (blind round 4 MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: mark a Skill whose slots outnumber the player's dice ("needs 2 dice")

### [ ] [3.6] /play: the engagement banner names a "Finish engagement" button that does not exist (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "Repeat, or choose End engagement"

### [ ] [3.6] /play: the engagement log ends with "The exchange ends." (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: print "The engagement ends." for an engagement

### [ ] [3.2] /play and /config: copy says "the designer's playtest Combat", "designer 2026-10-09", and "Combat v3" (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 8
- next: "Engagements: play Engage ..." in the hint; "(default)" in help notes; group "Engagement numbers"

# Site audit — 2026-10-10 (pass 28, cloud tick)

The queue is unchanged since pass 27 apart from its shipped top row. The /decisions MED row now leads. Of its three rows, only 65 and 69 set exchange-only options (the engine reads them only in `finishExchange`); row 66's tile delay applies under both models, so it is not tagged.

## Top 5 findings (scored)

### [x] [4.9] /decisions: open rows 65, 66, 69 speak of exchanges with no note that engagements are the default (critique MED, pass 11)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: a `combatModel` field in the config metadata; the page and docs/DECISIONS.md tag rows whose proposed option is exchange-only, and say the default model
- issue: #64
- fixed: (this commit)

### [ ] [4.2] /play: the result after a target pick can read as skipped (blind round 4 MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: skip the step-aside when the pick ended the engagement, or say what comes next on the board

### [ ] [4.2] /play: a Skill needing more dice than the player has gives no hint (blind round 4 MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: mark a Skill whose slots outnumber the player's dice ("needs 2 dice")

### [ ] [3.6] /play: the engagement banner names a "Finish engagement" button that does not exist (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "Repeat, or choose End engagement"

### [ ] [3.6] /play: the engagement log ends with "The exchange ends." (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: print "The engagement ends." for an engagement

# Site audit — 2026-10-10 (pass 27, cloud tick)

Critique pass 11 refilled the queue with 2 MED and 4 LOW rows. The two MED comprehension rows from pass 11 tie on impact; the unplayed-cards line is copy only and touches every Combat, so it wins.

## Top 5 findings (scored)

### [x] [5.4] /play: nothing says unplayed cards stay in hand or when Combat ends (critique MED, pass 11)
- category: external-critique (comprehension)
- impact: 6 (every engagement Combat; the default model)
- ease: 9
- next: one line in the start panel hint, the home Combat step, and the engagement result
- issue: #63
- fixed: (this commit)

### [ ] [4.9] /decisions: open rows 65, 66, 69 speak of exchanges with no note that engagements are the default (critique MED, pass 11)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: an "Exchanges only" tag on those rows and one intro line

### [ ] [4.2] /play: the result after a target pick can read as skipped (blind round 4 MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: skip the step-aside when the pick ended the engagement, or say what comes next on the board

### [ ] [4.2] /play: a Skill needing more dice than the player has gives no hint (blind round 4 MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: mark a Skill whose slots outnumber the player's dice ("needs 2 dice")

### [ ] [3.6] /play: the engagement banner names a "Finish engagement" button that does not exist (critique LOW, pass 11)
- category: external-critique (voice)
- impact: 4
- ease: 9
- next: "Repeat, or choose End engagement"

# Site audit — 2026-10-09 (pass 26, cloud tick)

Critique pass 10 and the user's jot of 2026-10-09 refilled the queue. The two MED a11y rows tie; the enemy-dice label is the one-line fix.

## Top 5 findings (scored)

### [x] [5.4] /play: screen readers hear enemy dice as "hit" or "special" with no damage (critique MED, pass 10)
- category: external-critique (a11y)
- impact: 6 (every engagement; the damage is the point of the die)
- ease: 9
- next: aria-label from `enemyFaceText(...).label`
- issue: #62
- fixed: (this commit)

### [ ] [5.4] /play: the engagement result is not announced to screen readers (critique MED, pass 10)
- category: external-critique (a11y)
- impact: 6
- ease: 9
- next: `role="status"` on the result headline

### [ ] [4.7] /play: no pre-selected die in the engagement modal (user jot MED, call recorded)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: drop the `firstFit` auto-pick; nothing is selected until the player taps dice (+0.5 user)

### [ ] [4.2] /config: Start run always starts an engagement run (critique MED, pass 10)
- category: external-critique (comprehension)
- impact: 6
- ease: 7
- next: name it on the button, or follow the saved Combat model

### [ ] [3.5] /play: a defeated enemy's die still hits, and nothing says so (user jot MED, call recorded)
- category: external-critique (comprehension)
- impact: 6
- ease: 5
- next: keep the rule and say so in the modal; add a default-off config toggle that cancels a defeated enemy's dice (+0.5 user)

# Site audit — 2026-10-09 (pass 25, cloud tick)

No finding scores 3.0 or more: no actionable iterate work, handed to `/expand` (pass 8, bold posture). Re-checked this pass: the 4 open critique pass 9 rows are still true in source (`ConfigPage.tsx:616`, `CreditsPage.tsx:60`, `index.html:6,16`, `App.tsx:13-21`).

## Top 5 findings (scored)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate (re-evidenced in expand pass 8)

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3 (Decisions is already in the nav on every page)
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: one meta description and og:url for every route, no canonical (critique LOW, pass 9)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate (re-evidenced in expand pass 8); a script-set canonical does not reach unfurlers that skip JavaScript

### [ ] [2.7] /config: the save message names "/play", not the Play page (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: "Saved. New runs on the Play page use this config."

### [ ] [2.4] all pages: design tools sit in the nav as equals of Play (critique LOW, pass 9)
- category: external-critique (navigation)
- impact: 3
- ease: 8
- next: a labelled "Design tools" group in the nav; filed as Considered in expand pass 8

# Site audit — 2026-10-09 (pass 24, cloud tick)

## Top 5 findings (scored)

### [x] [3.6] all pages: nav labels "Tiles" and "Debug" do not match the page headings (critique LOW, pass 9)
- category: external-critique (navigation)
- impact: 4 (the nav is on every page; two of its seven links land on a page with another name)
- ease: 9
- next: nav labels "Tile sheet" and "Engine console"; e2e checks each nav label is its page heading
- issue: #61
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: one meta description and og:url for every route, no canonical (critique LOW, pass 9)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate, or set canonical and og:url in the route effect

### [ ] [2.7] /config: the save message names "/play", not the Play page (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: "Saved. New runs on the Play page use this config."

# Site audit — 2026-10-09 (pass 23, cloud tick)

## Top 5 findings (scored)

### [x] [4.8] all pages: rules sections are cited but the rules are never linked (critique MED, pass 9)
- category: external-critique (comprehension)
- impact: 6 (Home, /config and /debug all point at "the written rules" or rule numbers with no way to read them)
- ease: 8
- next: export `rulesUrl` from `decisions/Inline.tsx`; link "written rules" on Home, /config, /debug; unit test in HomePage.test.tsx
- issue: #60
- fixed: (this commit)

### [ ] [2.8] /play: enemy choice buttons name enemies by engine id (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 7
- next: waits on the "Player names for every map piece" candidate

### [ ] [2.7] /: home page does not link /decisions (critique LOW)
- category: external-critique (navigation)
- impact: 3
- ease: 9
- next: add the Decisions link to the "Also:" line

### [ ] [2.7] all pages: one meta description and og:url for every route, no canonical (critique LOW, pass 9)
- category: seo
- impact: 3
- ease: 9
- next: covered by the "Static HTML for each page" candidate, or set canonical and og:url in the route effect

### [ ] [2.7] /config: the save message names "/play", not the Play page (critique LOW, pass 9)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: "Saved. New runs on the Play page use this config."

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

- [needs-user-call] **Write the Event Calendar experiment (2026-10-11).** The designer's planned experiment for more consistent runs; it may replace the spawn cadence (Spec v2 ruling 14) and the gathering-node rule (ruling 9).
- [needs-user-call] **Replace `GH_TOKEN` and add `GH_REPO` to the main checkout's `.env` (2026-10-09).** GitHub rejects the current token (401 Bad credentials), and `GH_REPO` is missing (`GH_REPO=no-trbl-2-u/survival-dice-builder`). Until then `/triage` and the phase mirror cannot run; the phase 23 and 24 mirror issues were never opened (ship commits f4ebbce and 09780d9). Worktrees now read the main checkout's `.env` (a9a44fe), so one fix covers every worktree.
- [needs-user-call] **Try card drag on a real phone.** Open https://survival-dice-builder.pages.dev/play on a phone, start an engagement and drag a card up onto the felt; also swipe the hand sideways. The automated tests only emulate touch, so note anything odd.
- [needs-user-call] **Reset /config once (2026-10-09).** Saved configs are not updated: a config saved before 2026-10-09 can still set Combat to Exchanges and a move cost of 2 next to an enemy. Reset picks up engagements and a cost of 1. (The draft pool applies to old configs anyway.)
- [resolved 2026-10-09, phase 23: (c)] **/play start panel Combat default (critique pass 6, 2026-10-07).** The start panel always starts on Engagements (673198c, the designer's playtest choice), while `combat.model` defaults to "exchange" and /config's setting only reaches `?seed=` runs. Following the saved config would make Exchanges the panel default; keeping Engagements means /config's choice is ignored there. Decide which: (a) keep Engagements as the panel default, (b) follow `combat.model`, or (c) make "engage" the config default and follow it. The hints and plain option names shipped (issue #41).
- [needs-user-call] **Local `.env` keys.** Add `DEPLOY_PROVIDER=cloudflare-pages` and `CF_PAGES_PROJECT=survival-dice-builder` to `.env` (both are also defaulted in `scripts/deploy-check.mjs`, so this is optional). Optional: `NOTIFY_NTFY_TOPIC` for the pager before any unattended run.
- [needs-user-call] **Designer reviews (never blocking):** the tile layouts at /tiles, the bot batch results, the glance check and the playtest sessions. The game keeps being built around them. Every open reading and check is listed at /decisions.
- [needs-user-call] **Review the 9 tiles** at https://survival-dice-builder.pages.dev/tiles (2026-10-03). The Play page builds its map from them; a layout change goes in as a rule reading.
- [needs-user-call] **Bot batch results (2026-10-03).** 200 bot runs on the default rules: median end round 14 (band 8-14, top edge), middle half 10-17, no run before round 9 (first wave), 0 runs reached level 5. Inside the band, so nothing is filed against the rules; read the bot batch report when convenient.
- [needs-user-call] **Art direction glance check (2026-10-03).** Show the Play page to 2 people: can each name card orientation, enemy type and health at a glance? Record the answers in the art guide. Not blocking.
- [needs-user-call] [ops] **Source of truth sync.** `spec/README.md` says the canonical spec is the Claude design doc (tabs "Spec v1 — Rules", "Build brief", "Build plan"). The loop treats `spec/` in this repo as authoritative; re-export to `spec/` when the doc changes.
- [needs-user-call] **Visual polish feel check (2026-10-03).** On a mid-range laptop, open /play, turn on "3D dice" and play a few engagements. Check that the frame rate feels smooth (about 17 ms per frame in automated tests) and that the sounds are pleasant at their low volume. Recorded sounds (free Kenney packs) can replace them later if wanted. Not blocking.
- [needs-user-call] **Spec v2 design work (2026-10-04).** The core loop is settled and in the written rules. Still to design: the new tiles (row 57), knockout values (row 55), the elite structure-damage rule (row 7), per-card heal targets (row 12), the real Skills with upgraded tiers (rows 9, 46, 50), Build versus Repair levels (rows 30, 49), the milestone set (row 4), and later scenarios (row 58). The experience curve waits on the experiments report (row 17). Each is listed at /decisions.
- [needs-user-call] **Interim balance (2026-10-04).** Under that day's first rule set the 200-run bot batch ended at a median of round 5 (middle half 4-6), against round 14 before. 199 of 200 runs ended when the player fell: the bot walked onto new tiles, and their enemies appeared around it at the next Combat. The next rule set replaced the run end at 0 health with knockout and changed spawning and targeting. Not blocking.
- [needs-user-call] **Balance under core loop v2 (2026-10-04).** With no wave track, every node spawning at every Combat, structure-first targeting and knockout, the 200-run bot batch ends at a median of round 6 (middle half 6-8, range 5-12), against the 8-14 band. All 200 runs end when the base falls; median level 2; 57 runs buy 3 upgrades, 35 defeat an elite, 22 survive to round 10. The bot is weak (it builds few defenses and never defends the base on purpose), so this is a floor, not a verdict. **Experiments (2026-10-05):** the default batch is unchanged (median 6), Gather off a node for 1 (row 67) alone gives median 9, and the combined proposed set gives median 8 (middle half 8-9). Not blocking.
- [needs-user-call] **Structural v2 questions (2026-10-05).** Rule readings 63-70 record issues no card, Skill, elite or structure can fix: no clock (63), map-state difficulty (64), exchange count coupled to deck size (65), the explorer pinned by same-round spawns (66), the fixed material budget (67), co-op pressure (68), the Base tile as a safe firing position (69), and table upkeep (70). Each has a proposed reading as an option on /config (all off by default), measured by the bot: the experiments report recommends turning on 63, 65, 66 and 67, keeping 68 off and playtesting 64, 69 and 70. **The designer decides each row** (set the option on /config to try it, then mark the row decided). Not blocking.
- [needs-user-call] **Run the playtests (2026-10-03).** The kit is ready: a one-page script, a survey and a report template. Target: 5 solo runs and 3 co-op sessions; the script says how to file each run. The filled report feeds the scenarios decision (rules section 19). Only people can playtest.
