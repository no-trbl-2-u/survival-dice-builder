# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

> Bias: external-critique MED (set via oversight 2026-10-11)

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

- [needs-user-call] **Write the Event Calendar experiment spec (2026-10-11).** The designer's planned experiment for more consistent runs; it may replace the spawn cadence (Spec v2 ruling 14) and the gathering-node rule (ruling 9). See `docs/spec-v2-draft/RULINGS.md`.
- [needs-user-call] **Replace `GH_TOKEN` and add `GH_REPO` to the main checkout's `.env` (2026-10-09).** GitHub rejects the current token (401 Bad credentials), and `GH_REPO` is missing (`GH_REPO=no-trbl-2-u/survival-dice-builder`). Until then `/triage` and the phase mirror cannot run; the phase 23 and 24 mirror issues were never opened (ship commits f4ebbce and 09780d9). Worktrees now read the main checkout's `.env` (a9a44fe), so one fix covers every worktree.
- [needs-user-call] **Try card drag on a real phone (phase 24 follow-up).** Open https://survival-dice-builder.pages.dev/play on a phone, start an engagement, and drag a card up onto the felt; also swipe the hand sideways. `touch.spec.ts` covers this with emulated touch only. File anything odd with `/jot`.
- [needs-user-call] **Reset `/config` once (2026-10-09).** Saved configs are not migrated: a config saved before today keeps `combat.model: "exchange"` if it was set, and keeps `combat.moveCostNextToEnemy: 2`. Reset picks up engagements by default and no move surcharge. (The draft pool applies to old configs anyway: the key is new.)
- [resolved 2026-10-09, phase 23: (c)] **/play start panel Combat default (critique pass 6, 2026-10-07).** The start panel always starts on Engagements (673198c, the designer's playtest choice), while `combat.model` defaults to "exchange" and /config's setting only reaches `?seed=` runs. Following the saved config would make Exchanges the panel default; keeping Engagements means /config's choice is ignored there. Decide which: (a) keep Engagements as the panel default, (b) follow `combat.model`, or (c) make "engage" the config default and follow it. The hints and plain option names shipped (issue #41).
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
