# Retrospective: Axiomancer (mobile) and Table Edition (board) before Survival Dice-Builder

Written 2026-10-06 from the three repos as they stand. Every claim
carries a source and a confidence score (0 = guess, 100 = written
exactly as stated). Shallow clones: Axiomancer git history visible
2026-10-01 to 10-03, board-brainstorm 2026-08-15 to 09-18,
survival-dice-builder 2026-10-03 to 10-06. Earlier dates come from
dated plan files, decision ballots and the results archive, not git.

Owner questions in section 4 are unanswered. Section 5 is a proposal,
not a ruling.

## 1. The three projects in numbers

| Measure | Axiomancer (mobile) | Table Edition (board) | Survival Dice-Builder | Source |
|---|---|---|---|---|
| Phases shipped | 191 (31 in the revamp) | n/a (no phase plan; 14-phase roadmap unbuilt) | 22 of 22, 0 pending | `Axiomancer/plan/steps/01_build_plan.md`; `board-brainstorm/ROADMAP.md`; `plan/steps/01_build_plan.md` |
| Human playtests | playtests ran but both dice axes "were inert in every playtest that has ever been run" | 2 with other people, unlogged (owner, 2026-10-06); `playtests/` holds README only | 0 (`docs/playtests/runs/` holds README only) | `Axiomancer/plan/2026-09-02-big-numbers-overhaul.decisions.md:228-240`; owner answer; `board-brainstorm/README.md` open problem 8 |
| Simulated experiments | deck-matrix baseline, retired D57 | about 123 dated archive sections | 3 bot-batch reports, 200 runs each | `Axiomancer/docs/truth-sources.md:123-137`; `board-brainstorm/table-edition-sim-results-2026-07-22.md`; `docs/reports/` |
| Content built then cut | 132 of 134 cards, 76 of 79 enemies, 47 mechanic kinds, hazard codex, 10 relics, card editor, 8 tuning commands | MEDIC (same day), encounter categories (same day), legacy enemy format | wave track, Explore phase, setup tile, node refill (rows 3, 21, 25, 36-38, 51, 62 superseded within 48 h) | Axiomancer D10, D36, D48, D50, D52, D56, D72; `board-brainstorm/braindump/2026-08-13-*.md`; `OPEN-QUESTIONS.md` |
| Open rule questions | 9 owner-led B-rows blocked | 57 parking-lot entries in 23 clusters, plus the phases-vs-Acts split | 70 rows, 11 pending-spec, 13 proposed | `Axiomancer/plan/steps/01_build_plan.md:150-157`; `board-brainstorm/needs-brainstorming.md`; `OPEN-QUESTIONS.md` |
| Days of history | about 60 (08-08 to 10-03) | about 58 (07-22 to 09-18) | 4 (10-02 to 10-06) | plan dates |

Confidence on the table: 90. Counts are from the files named; the
Axiomancer playtest count is unknown because the clone is shallow.

## 2. The questions a retrospective should ask, with answers

### Q1. Did either project validate its core loop with humans before building outward?

**No, in both cases.** Confidence 95.

- Axiomancer: the loop built 134 cards, 79 enemies, a hazard minigame,
  a labyrinth, relics, consumables, tutorials and a card editor on top
  of a stat system the trim spec later called "decorative, display-only
  numbers that lie to the player" (`Axiomancer/plan/2026-09-25-trim-the-fat.spec.md:12-31`).
  The reset to "three grey cards, four dice, three foes" came on
  2026-09-28 (D46 to D64), about seven weeks in.
- Table Edition: 636 unique cards, 61 keywords, five bosses, a 301-card
  exploration deck, a TTS table, vendor exports, and 123 simulated
  experiments. Two table sessions with other people, both unlogged
  (owner, 2026-10-06). They found that the exploration cards did not
  work as a system, components and cards were missing from the kit,
  and the COVENANT deck had infinite combos. None of this is in the
  repo. README open problem 8 still says every number is simulated.
- Survival Dice-Builder is on the same path: 22 phases, six web routes,
  3D dice, accessibility pass, zero human runs, and the playtest
  protocol still teaches the v1 rules the engine no longer runs
  (`docs/playtests/PROTOCOL.md:18-19`, `SURVEY.md:9-10`).

### Q2. What was the actual cost of building ahead of validation?

**Weeks of work deleted, and measurement that measured nothing.** Confidence 90.

- Axiomancer trim T1 to T5 removed about 3,600 lines of dead engine
  code, 1,600 mobile orphans, 90 stale docs, 95 MB of binaries and
  16,800 plan lines read every tick (`trim-the-fat.spec.md` section 2).
  Eight tuning commands had zero invocations in six weeks (D10).
- The balance baseline was retired because "after the card purge every
  cell was the grey deck, so the file measured nothing a decision could
  use" (`Axiomancer/docs/truth-sources.md:123-137`).
- Table Edition: every co-op number from 08-05 to 09-18 was taken
  against an engine that never implemented the TOLL ruling
  (`board-brainstorm/docs/rulings.md:2307`). Six weeks of co-op
  measurement is suspect.

### Q3. What did the simulator find that humans could not, and the reverse?

**The sim finds engine bugs and pilot artifacts. Only humans find rules-model drift, table ergonomics and social failure.** Confidence 85.

Sim-only finds (board-brainstorm archive): two cards being played that
were not in the box (`unprinted-cards`), an infinite loop from Warm
Welcome plus The Chronicler (`coop-mixed-party`), the TOLL bug above,
a heal signature measuring blank because the pilot had no rule to cast
it (`sig-heuristic-coverage`).

Human-only finds from the two unlogged table sessions (owner,
2026-10-06): the exploration deck did not function at the table, cards
and components were missing from the printed kit, and the COVENANT
deck produced infinite combos that 123 sim runs with four pilot brains
never surfaced. Confidence 85 (recalled, not logged).

Human-only finds from the owner's TTS sessions: the TTS camera sat across
the table from the seat, the deal landed in front of the wrong seat,
a boss trigger was missing, the box prints 3 copies where the rule
allowed 4, and the owner's working model was already "phases don't
exist anymore, only Acts" while the rulebook said three phases
(`rulings.md:2321`, `NEEDS_HUMAN_ATTENTION.md:230-258`).

What the sim admits it cannot see: discard decisions (the ◆ ban was
decided on decision space because "the pilot cannot discard",
`rulings.md:980-990`), social failure ("Dave ruined it", README open
problem 8), and any skilled-play effect because solo and co-op pilots
sit at 100 percent win rate (open problems 4, 7, 9).

Survival Dice-Builder repeats the pilot ceiling problem from the other
side: "the bot is weak, every number here is a floor"
(`docs/reports/phase-22-experiments.md`), and the floor is driving
"recommend: turn on" verdicts for rows 63, 65, 66 and 67.

### Q4. Where did the autonomous loop help, and where did it hurt?

**It helped on engineering discipline. It hurt whenever it chose what to build.** Confidence 90.

Helped (both prior repos):
- Deterministic seeded engines with golden replays survived every
  reset (Axiomancer D1 kept "deterministic engine, reducers, RNG, CI
  gates, tests, loop harness"; the number-parity guard survived the
  Big Numbers rewrite, D20).
- Hooks enforced gates where reminders did not
  (`Axiomancer/plan/reflexes.md:104-110`).
- Decisions recorded as ballots with rejected options logged, so
  nothing is re-asked.
- Small verifiable phases: 31 R-phases in five days ending in a tagged
  APK (D76).

Hurt:
- Content outran the core (Q1).
- Tooling outran use: content stewards where "every recent pass created
  nothing; KB gates ran empty" (`Axiomancer/plan/revamp/loop.md:41`).
- Holds were ignored: the loop shipped past the AUDIT-DRAIN hold, and
  the lesson filed was "a hold nothing obeys is worse than no hold"
  (`01_build_plan.md:22-32`).
- The loop set its own work. In Survival Dice-Builder phases 17 to 19
  were self-promoted and `/expand` keeps adding candidates while the
  playtest check stays open (`docs/DECISIONS.md`).

The trigger for the reset was play, not audit (owner, 2026-10-06):
"after playing it, I realized I needed to be more hands on in the card
creation process." Confidence 100 on the quote. So the primary lesson
is Q1 (play it) and the structural fix was card ownership.

The owner's response in Axiomancer was structural, not advisory: D37
(no card or keyword outside a guided session), D38 (stat phase runs
attended), D58 (loop creates no content during the revamp), D64 (loop
never starts a B-row). Confidence 100, these are quoted decisions.

### Q5. Did measurement replace judgement, or inform it?

**It replaced it more than once, and the numbers were wrong each time.** Confidence 85.

- Axiomancer D31 retuned a dice axis from 2.5 to 0.8 on a flat
  measurement that was a wiring bug; withdrawn the next day
  (`big-numbers decisions:228`).
- The S3 double count pushed the baseline to 100 percent win rates
  (`decisions:395`).
- Table Edition: the carry ruling was measured at +1pp and the
  parking lot correctly concludes "this is a coherence and
  teachability decision, and the numbers cannot make it"
  (`needs-brainstorming.md`, opened 2026-09-18). That is the right
  posture and it arrived late.
- Table Edition's `--rec` and `--exp` discipline is the best artefact
  either project produced on this question: the default sim equals the
  shipped game, proposals are a pure delta with a drift guard, and
  experiments are deleted unless promoted (`board-brainstorm/CLAUDE.md:127-151`).

### Q6. How much rules churn is normal, and how much is a symptom?

**Same-day reversals are a symptom of designing in code instead of on the table.** Confidence 75.

Table Edition: MEDIC built and removed the same day; encounter
categories superseded the same day; on 09-13 four of six rulings
amended earlier ones; "max 4 copies" became "the box is the cap" the
same afternoon (`rulings.md:1924-1993`). The phases-vs-Acts split has
been open since 08-12 and "the rulebook cannot ship until one wins".

Survival Dice-Builder: 70 rule rows in four days, 9 superseded within
48 hours by core loop v2. Rows 63 to 70 describe a loop with no clock,
a dominant turtle line and a materials budget of 20 against upgrade
costs of 33. Each got a default-off config flag instead of a stop.
The config surface grows while the design stays unsettled.

The pattern in both: a rule is written, the engine implements it, the
sim or a walkthrough exposes a hole, a new rule patches the hole. None
of these rules were tried with cardboard first.

### Q7. What was the cost of multiple surfaces?

**Parity debt, and the physical target got the least attention.** Confidence 85.

- Table Edition's mobile port is out of parity with the sim
  (`NEEDS_HUMAN_ATTENTION.md` items 0b, X, 0-ENCH.2). The render chain
  past `--pdf` is owed on Windows. Three Windows-only breaks shipped
  green from remote sessions (`CLAUDE.md:85-108`).
- Survival Dice-Builder states a physical edition as the target
  (`plan/bearings.md:182`) and has a web app, a bot, a sim CLI, 15
  one-pager sheets, and no print-and-play kit. No parity test exists
  between the engine and any printed rule or card.

### Q8. What transferred between the projects, and what did not?

**Infrastructure transferred. The lessons did not.** Confidence 90.

`NEXUS_LESSONS.md` contains seven items, all about adopting the loop
template (env var names, pnpm preflight, worktree pushes). A grep for
"axiomancer" or "board-brainstorm" across Survival Dice-Builder finds
nothing. The design lessons (card hold, rec/exp discipline, both-
environments rule, pilot ceiling, human-first validation) were not
carried.

## 3. What we learned, as rules

Each rule names the failure that justifies it.

1. **A core loop is validated by three strangers at a table, not by a bot batch.** Justification: Q1, Q3. Neither project reached that bar in about 60 days.
2. **The loop never chooses content, mechanics or new surfaces.** It ships docs, bot policy, rule-text sync and ratified phases only. Justification: Axiomancer D37, D58, D64 were imposed after the fact; impose them up front. Owner ruling 2026-10-06: the Survival Dice-Builder loop keeps running, docs and bot only.
3. **A rule gets a config flag only after it has been played on cardboard.** Justification: Q6. Flags accumulated faster than decisions.
4. **One source of rule text, and the printed text is the spec.** The engine is tested against the printed card and rulebook, not against a design doc. Justification: Table Edition's parity guard worked; Survival Dice-Builder's playtest kit teaches rules the engine no longer runs.
5. **Default sim equals the shipped game. Proposals behind `--rec` with a drift guard. Experiments behind `--exp` and deleted unless promoted.** Justification: Q5; this discipline is the one artefact that kept measurement honest.
6. **A measurement needs a pilot with a known ceiling and floor before it drives a ruling.** Justification: D31, the 100 percent co-op pilots, the weak defending bot.
7. **Every physical artefact runs on the owner's machine before it is called done.** Justification: the 2026-07-27 Windows breaks.
8. **Measure the project in human sessions logged, not phases shipped.** Justification: 191 phases, 22 phases, zero sessions in the two newest repos.
9. **The sim's job is bug detection and range finding, not tuning.** Justification: Axiomancer's own rule after the reset, "simulations keep bug detectors only" (`plan/bearings.md`).
10. **A hold must be mechanical.** A hook that blocks the commit, not a line in a plan file. Justification: the ignored AUDIT-DRAIN hold.

## 4. Questions for the owner, with answers (2026-10-06)

Asked and answered the same day. My prior assumption and its
confidence are kept so the miss rate is visible.

| # | Question | Prior assumption (confidence) | Owner answer |
|---|---|---|---|
| 1 | Has anyone else played Table Edition or Survival Dice-Builder at a table? | No (70) | **Wrong.** Table Edition twice with others, unlogged. Exploration cards did not work, components and cards missing, infinite COVENANT combos. |
| 2 | What triggered the Miserere Mei, Deus reset on 2026-09-28? | Reading the code (40) | **Wrong.** Playing it. "I realized I needed to be more hands on in the card creation process." |
| 3 | What is the Survival Dice-Builder web app for? | Design tool (60) | Design tool for the physical game. |
| 4 | Table hours per week, with whom? | None possible (0) | 1 to 2 hours, solo only. |
| 5 | Keep the hourly `/march` running with zero sessions logged? | Pause (65) | **Wrong.** Keep running, docs and bot only. No mechanics, routes or content. |
| 6 | Which of rows 63, 67, 69 are resolved in your head? | None yet (50) | None yet. |
| 7 | Log the two Table Edition sessions from memory? | Yes (80) | Yes, next session, via `/playtest-log` in board-brainstorm, marked recalled. |

Three of seven priors were wrong. Two of the misses (1, 2) both point
the same way: the owner's own play was the signal in both prior
projects, and neither repo recorded it.

Open: the question "what did 123 sim experiments change in your
thinking" was not asked. It stays open for the next session.

## 5. Proposed next steps for Survival Dice-Builder

Three tracks. Discussion first, physical second, code last. The order
is the lesson.

Scaled to the answers: 1 to 2 solo hours per week, web app is a
design tool, loop stays on for docs and bot work only.

### Track A: discussion (this week)

1. File the section 4 answers in `docs/DECISIONS.md` as ballots so they are never re-asked (the Axiomancer practice that worked).
2. Decide rows 63, 67 and 69 on paper, not by bot. These are structural and the bot cannot defend, so its numbers are floors.
3. Ratify rules 1 to 10 of section 3 into `agents.md` as standing rules, or strike the ones you reject.
4. Scope the loop mechanically, not by memo: a `plan/LOOP-SCOPE.md` the ship skills read, listing the allowed phase kinds (docs, bot policy, rule-text sync, playtest kit). A phase outside the list is refused, the way `guard.mjs` refuses an unverified commit.
5. In board-brainstorm, run `/playtest-log` from memory for the two unlogged sessions. File the exploration-deck failure, the missing components and the COVENANT infinite combos as findings. Mark the entries recalled.

### Track B: physical, solo (next four weeks at 1 to 2 hours per week)

1. Build a cardboard kit for core loop v2 only: the Base tile, the 8 existing tiles, the 10-card starter deck, one d6, grunt and elite tokens, Barricade and Tower tokens. No Skills beyond the 4 starters, no Shop, no draft. Budget: one hour with index cards. No renderer.
2. Play it solo. Target: 4 logged runs in 4 weeks, one per week, each in `docs/playtests/runs/` using `PROTOCOL.md` after that protocol is moved to v2 rules (it still says 6-card deck and wave track).
3. Exit criterion: does a round of Prepare then Combat feel like a decision, or like bookkeeping? If bookkeeping, nothing downstream matters.
4. Try the three structural fixes (forced reveal, once-per-Combat attacks, Gather off node gives 1) by hand, one per run, before any flag ships as default.
5. Co-op rules stay untested and undecided. Mark every co-op row in `OPEN-QUESTIONS.md` as deferred until a second player exists. Do not tune seat scaling (row 68) from the bot.

### Track C: code, inside the loop's allowed scope (now, in parallel)

1. Move the playtest kit's copy to v2 (PROTOCOL, SURVEY, REPORT). Small, mechanical, and the top candidate in `PHASE_CANDIDATES.md` already asks for one rule-text source.
2. Add a parity test: every number on a printed card or in the rulebook appears verbatim in `packages/content`. This is Table Edition's guard, ported.
3. Adopt the `--rec` and `--exp` split in `tools/sim`. Today the experiments are default-off config flags with no drift guard and no deletion rule.
4. Give the bot a defending policy before any more tuning verdicts. Report both a floor bot and a greedy-defend bot per experiment, the way Table Edition reported smart and search pilots.
5. Build the print-and-play renderer only after Track B has 4 logged runs. Run it on Windows before calling it done.

### What not to do

- No new web routes, no new Skills, no scenarios (rule 19.4 already says so), no 3D dice work, no art direction, until Track B has data.
- No tuning verdicts from the current bot.
- No porting Table Edition's 636 cards or any of its systems. Different game. The only things worth porting are disciplines: rec/exp, parity guard, both-environments, card hold.

## 6. Sources

- `/home/user/Axiomancer`: `plan/bearings.md`, `plan/lessons.md`, `plan/reflexes.md`, `plan/steps/01_build_plan.md`, `plan/2026-09-02-big-numbers-overhaul.decisions.md`, `plan/2026-09-25-refactor-strategy.decisions.md`, `plan/2026-09-25-trim-the-fat.spec.md`, `plan/revamp/*`, `docs/truth-sources.md`, `docs/game-model.md`.
- `/home/user/board-brainstorm`: `README.md`, `CLAUDE.md`, `docs/rulings.md`, `NEEDS_HUMAN_ATTENTION.md`, `needs-brainstorming.md`, `braindump/*` (35 files, 30 with dispositions), `table-edition-sim-results-2026-07-22.md` (124 sections), `cards.json`.
- `/home/user/survival-dice-builder`: `agents.md`, `plan/bearings.md`, `plan/steps/01_build_plan.md`, `plan/PHASE_CANDIDATES.md`, `OPEN-QUESTIONS.md`, `docs/DECISIONS.md`, `docs/design/core-loop-v2.md`, `docs/playtests/*`, `docs/reports/phase-22-experiments.md`, `NEXUS_LESSONS.md`, `.github/workflows/march.yml`.
