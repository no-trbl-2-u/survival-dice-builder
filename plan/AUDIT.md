# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

> Bias: external-critique MED (set via oversight 2026-10-11)

# Site audit — 2026-10-22 (pass 122, cloud tick)

Pass 121's /config Milestones row shipped (9dacefa). The critique gate is closed (pass 24, 6 commits ago, under 24 hours) and the expand gate is closed (pass 16, 2 commits ago). The only pending phase (35) is blocked on the designer's Skills session. The three `[needs-user-call]` MED rows still score 8.1 and the LOW "Reset /config once" row 1.4; all four wait for /oversight. Of pass 24's rows the top one the loop can ship is rule reading 4's wording at 2.7 (impact 3, ease 9): /decisions said ""Reveal 10 tiles" is unreachable with 8 non-base tiles" while /play and /config say "out of reach: the tile deck holds 8 tiles". Row 4 now uses the /play words, docs/DECISIONS.md is regenerated, and a decisions test builds the expected question from the same label and reason /play shows. Next in line: the /decisions serial comma (2.1), then the sim bot row.

## Top 5 findings (scored)

### [x] [2.7] /decisions: rule reading 4 says "unreachable with 8 non-base tiles" (critique LOW, pass 24)
- category: external-critique (voice)
- impact: 3
- ease: 9
- next: reword row 4's question to "out of reach: the tile deck holds 8 tiles"
- issue: #176
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
- [needs-user-call] **Try card drag on a real phone.** Open https://survival-dice-builder.pages.dev/play on a phone, start an engagement, and drag a card up onto the felt; also swipe the hand sideways. The automated tests only emulate touch, so note anything odd.
- [needs-user-call] **Reset /config once (2026-10-09).** Saved configs are not updated: a config saved before 2026-10-09 can still set Combat to Exchanges and a move cost of 2 next to an enemy. Reset picks up engagements and a cost of 1. (The draft pool applies to old configs anyway.)
- [resolved 2026-10-09, phase 23: (c)] **/play start panel Combat default (critique pass 6, 2026-10-07).** The start panel always starts on Engagements (673198c, the designer's playtest choice), while `combat.model` defaults to "exchange" and /config's setting only reaches `?seed=` runs. Following the saved config would make Exchanges the panel default; keeping Engagements means /config's choice is ignored there. Decide which: (a) keep Engagements as the panel default, (b) follow `combat.model`, or (c) make "engage" the config default and follow it. The hints and plain option names shipped (issue #41).
- [needs-user-call] **Local `.env` keys.** Add `DEPLOY_PROVIDER=cloudflare-pages` and `CF_PAGES_PROJECT=survival-dice-builder` to `.env` (both are also defaulted in `scripts/deploy-check.mjs`, so this is optional). Optional: `NOTIFY_NTFY_TOPIC` for the pager before any unattended run.
- [needs-user-call] **Designer reviews (never blocking):** the tile layouts at /tiles, the bot batch results, the glance check, and the playtest sessions. The game keeps being built around them. Every open reading and check is listed at /decisions.
- [needs-user-call] **Review the 9 tiles** at https://survival-dice-builder.pages.dev/tiles (2026-10-03). The Play page builds its map from them; a layout change goes in as a rule reading.
- [needs-user-call] **Bot batch results (2026-10-03).** 200 bot runs on the default rules: median end round 14 (band 8-14, top edge), middle half 10-17, no run before round 9 (first wave), 0 runs reached level 5. Inside the band, so nothing is filed against the rules; read the bot batch report when convenient.
- [needs-user-call] **Art direction glance check (2026-10-03).** Show the Play page to 2 people: can each name card orientation, enemy type, and health at a glance? Record the answers in the art guide. Not blocking.
- [needs-user-call] [ops] **Source of truth sync.** `spec/README.md` says the canonical spec is the Claude design doc (tabs "Spec v1 — Rules", "Build brief", "Build plan"). The loop treats `spec/` in this repo as authoritative; re-export to `spec/` when the doc changes.
- [needs-user-call] **Visual polish feel check (2026-10-03).** On a mid-range laptop, open /play, turn on "3D dice", and play a few engagements. Check that the frame rate feels smooth (about 17 ms per frame in automated tests) and that the sounds are pleasant at their low volume. Recorded sounds (free Kenney packs) can replace them later if wanted. Not blocking.
- [needs-user-call] **Spec v2 design work (2026-10-04).** The core loop is settled and in the written rules. Still to design: the new tiles (row 57), knockout values (row 55), the elite structure-damage rule (row 7), per-card heal targets (row 12), the real Skills with upgraded tiers (rows 9, 46, 50), Build versus Repair levels (rows 30, 49), the milestone set (row 4), and later scenarios (row 58). The experience curve waits on the experiments report (row 17). Each is listed at /decisions.
- [needs-user-call] **Interim balance (2026-10-04).** Under that day's first rule set the 200-run bot batch ended at a median of round 5 (middle half 4-6), against round 14 before. 199 of 200 runs ended when the player fell: the bot walked onto new tiles, and their enemies appeared around it at the next Combat. The next rule set replaced the run end at 0 health with knockout and changed spawning and targeting. Not blocking.
- [needs-user-call] **Balance under core loop v2 (2026-10-04).** With no wave track, every node spawning at every Combat, structure-first targeting and knockout, the 200-run bot batch ends at a median of round 6 (middle half 6-8, range 5-12), against the 8-14 band. All 200 runs end when the base falls; median level 2; 57 runs buy 3 upgrades, 35 defeat an elite, 22 survive to round 10. The bot is weak (it builds few defenses and never defends the base on purpose), so this is a floor, not a verdict. **Experiments (2026-10-05):** the default batch is unchanged (median 6), Gather off a node for 1 (row 67) alone gives median 9, and the combined proposed set gives median 8 (middle half 8-9). Not blocking.
- [needs-user-call] **Structural v2 questions (2026-10-05).** Rule readings 63-70 record issues no card, Skill, elite, or structure can fix: no clock (63), map-state difficulty (64), exchange count coupled to deck size (65), the explorer pinned by same-round spawns (66), the fixed material budget (67), co-op pressure (68), the Base tile as a safe firing position (69), and table upkeep (70). Each has a proposed reading as an option on /config (all off by default), measured by the bot: the experiments report recommends turning on 63, 65, 66, and 67, keeping 68 off, and playtesting 64, 69, and 70. **The designer decides each row** (set the option on /config to try it, then mark the row decided). Not blocking.
- [needs-user-call] **Run the playtests (2026-10-03).** The kit is ready: a one-page script, a survey, and a report template. Target: 5 solo runs and 3 co-op sessions; the script says how to file each run. The filled report feeds the scenarios decision (rules section 19). Only people can playtest.
