# Phase 9 — Early bot + batch sanity runs

> Agent-facing brief. Ship without asking. Source:
> `spec/phases/phase-7-playtest-tooling.md` (bot and batch items only).
> The engine is feature-complete for Spec v1 solo (phase 8); this phase
> plays it at scale so tuning data reaches the designer while the UI is
> built.

## Outcome

`packages/bot` plays any state using only `legalActions` + a read of the
state; `pnpm sim -- --runs 200` plays 200 seeds and writes CSV or JSON;
`/debug` gets an "Autoplay" button. The median end round is reported
against the 8-14 band.

## Modules

```
packages/bot/src/
├── index.ts          # botChoice (public API)
├── policy.ts         # the decision priorities, one small function per decision kind
├── goals.ts          # where the figure wants to go (gathering node / base) and why
└── policy.test.ts    # every decision kind; never illegal; 20-seed smoke
tools/sim/src/
├── run.ts            # playRun(config, seed) -> RunResult; summarize(results)
├── format.ts         # CSV and JSON writers
├── cli.ts            # --runs N --seed S --config file --out file.csv|json
└── run.test.ts
```

## Bot priorities (deterministic; no randomness)

1. Required choices: return a starter (first), draft (first damage Skill, else first), replace
   the weakest drafted Skill (first listed).
2. Upgrades: buy when offered (Training I first: cheapest; then Shop I).
3. Shop: buy the first affordable offer.
4. Prepare cards: Build on the base when an upgrade is affordable; Gather on a gathering node;
   Rest when hurt (health at most max - 3); Move when the goal is elsewhere; Build off the base
   when a defense is affordable; otherwise discard the card.
5. Move: step toward the goal (shortest hex distance), never into a skirmish; stop when there.
   Goal: the gathering node next to the base while materials are below the cheapest next
   upgrade; otherwise the base.
6. Build off the base: a Tower if affordable, else a Barricade, on the offered hex nearest an
   enemy.
7. Combat: keep every non-Blank die, roll again while a Blank is left, play every bottom half,
   reroll Blanks, place dice on damage Skills first, then guard, then heal; target the enemy
   with the lowest health.
8. Explore: place a tile in the slot farthest from the base; reveal when optional.

## Batch output (per run)

seed, end round, cause, final base health, base health per round, enemies on the map per
round, level, Skills owned, milestones, actions taken. Summary: runs, errors, median end round,
middle half, causes.

## Decisions made upfront — DO NOT ASK

- Bot lives in `packages/bot` (pure, same ESLint rules as the engine: no I/O, no randomness).
- `tools/sim` runs under plain Node (type stripping); content JSON imports carry
  `with { type: 'json' }` so Node can load them.
- A run that hits 5 000 actions is stopped and counted as `cause: "stalled"` (a bot or engine
  bug signal, reported, not hidden).
- **Band miss does not change rules.** If the 200-run median is outside 8-14, file an AUDIT
  `[needs-user-call]` row with the distribution and an OPEN-QUESTIONS entry. The bot is a
  floor, not a skilled player: say so in both.
- The report goes to `docs/reports/phase-9-bot-batch.md` (committed) with the numbers.

## Tests

- Bot: chooses only legal actions across 20 seeds to the end; each priority has a scenario.
- Sim: `playRun` is deterministic per seed; summary maths (median, quartiles); CSV header and
  escaping.
- e2e: `/debug` Autoplay plays to the end of a run with no console errors.

## DoD

`pnpm verify` green; `pnpm sim -- --runs 200` completes with 0 errors; report committed;
deploy green.
