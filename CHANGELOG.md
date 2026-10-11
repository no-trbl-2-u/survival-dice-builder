# Changelog

All releases of Survival Dice-Builder. Phase numbers and commits are in
`plan/steps/01_build_plan.md` (Phase log).

## v0.1.0 — 2026-10-11

The first release: a stable baseline of the playable prototype before the content
era (cards, Skills, enemy effects, Towers, structures). It runs core loop v2 with
engagements as the default Combat, and its written rules, rules coverage, and
playtest kit match the code.

### The game (core loop v2, Combat v3)

- The Base tile starts alone; players choose free base hexes. The map grows when a
  figure steps off its edge, and each new tile's spawn nodes add enemies at every
  Combat (phase 20).
- A round is Prepare, then Combat; there is no Explore phase and no wave track.
  The 10-card starter deck is played twice per round with a hand of 5 (phases 20,
  23).
- Gathering nodes are single-use. Enemies move, then every node spawns each Combat;
  they go for the nearest structure first, with a 2-hex pull toward players. The
  miniature limit promotes a grunt to an elite (phase 21).
- A player at 0 health is knocked out and returns next round; the run ends when the
  base falls (phase 21).
- Engagements are the default Combat: play Engage from where you stand, roll your
  dice and the adjacent enemies' dice, use your dice one at a time, and the enemy
  dice hit last. Siege at the end of Combat. Exchanges stay selectable (phases 23,
  24).
- Experience, levels, currency, the Shop, base upgrades, the Skill draft with a
  draft pool, and milestones (phases 8, 22, and the 2026-10-09 designer changes).
- Co-op hot-seat for 1-4 players (phase 13).

### The web app

- `/play`: SVG hex map with legal targets, phase bar, player panel, hand, dice
  tray, Skill board, base panel, Shop, draft, log, run summary, and a replayable
  run export with real timing (phases 11-14).
- The engagement modal: no pre-selected die, a board damage number after each
  target pick, phone fit at 375x812, touch drag, screen-reader announcements
  (phase 24).
- Icons, CSS motion, synthesized sound with mute, optional 3D dice, and `/credits`
  from the asset register (phase 15).
- Accessibility and navigation: skip link, landmarks, per-route titles, named
  places and enemies on the map (phase 17).
- `/config`: every rule value and option with labels, help, rules sections, plain
  errors, and a safe save flow (phase 19). Saved configs carry a version and follow
  rule changes; `/config` and `/play` say "Playing with N changes from the standard
  rules" (phase 30).
- `/decisions`: every open rule reading with its config value (phase 18).
- Rule text on `/`, `/play`, and `/config` is built from config by one module, so a
  rule change updates the copy (phase 25).
- Pieces are named by kind and place; no engine id reaches player text (phase 31).
- Every page shows the release line: version and build commit (phase 32).

### Tools for the designer

- `pnpm sim`: bot batches, config comparisons, timing reports, and playtest numbers
  (phases 9, 14, 16, 22).
- `pnpm sim -- rules` writes `docs/RULES-AS-PLAYED.md`: each Spec v1 rule beside
  what the engine does (phase 28).
- `pnpm sim -- kit` keeps the playtest protocol, survey, and report template in
  step with the rules (phase 29).
- Run exports record the release, the commit, and the changed config fields
  (phases 30, 32).

### Quality and the loop

- The verify gate: lint, typecheck, unit and property tests, build, and hermetic
  e2e on every commit; a deploy check after every push (phase 2 onward).
- `RULES-COVERAGE.md` cites only tests that exist, checked in the gate (phase 27).
- Cloud loop ticks say what they did on their run page; `pulse` shows the cloud
  budget (phase 26).

### Known gaps

These spec criteria need people or later work, and are not blockers for v0.1.0:

- Playtest sessions (spec phase C): none logged yet; the kit is ready.
- The bot's median end round is 6 against the 8-14 band; the defending bot is
  phase 33.
- The frame-rate check on a mid-range laptop and the two-person read of the map are
  open designer checks.
- Tile art and recorded sound are still placeholders.
- Siege's reading of rows 7 and 7.11 under engagements is open (phase 34).
