# Phase 36 — A defending bot policy

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` "A defending bot
> policy" (score 5.0) with the residue of "Combat v3 in the bot and the sim" (rejected, merged
> here), promoted via oversight 2026-10-10, renumbered 33 -> 36 via oversight 2026-10-11. Row 72
> is decided (engagements are the default), so every comparison runs under engagements. No rule,
> config value, or default changes: this phase adds a bot policy, sim counts, and a report.

## Outcome

1. `@survival/bot` gets a third policy, `defender` (`botChoice(state, { policy: 'defender' })`),
   beside `default` and `turtle`. It differs from the default bot in these decisions:
   - **Target picks** (Skill targets, single-target resolves, Tower ties): an enemy the hit
     defeats first — the one with the most enemy dice in this engagement, then the most
     experience — else the enemy nearest the base; ties go to the weaker enemy, then the id.
   - **Building**: on the base, Training before Shop (more Skills sooner); off the base, a Tower
     (else a Barricade) within 2 hexes of the base hex, nearest the threat.
   - **Where it goes**: in Prepare, the base while it can pay for an upgrade, a guard post (a
     revealed hex 2 from the base hex) toward the threat while it can pay for a defense, else
     materials as the default bot. In Combat, next to the threat (the enemy nearest the base
     within 4 hexes).
   - **Between engagements**: Repair when the base (from its tile) or a nearby defense is
     damaged; heal when hurt; Engage only with an enemy in Skill range, using a card whose other
     option is not a Move; else Move toward the threat; else Engage anyway (a heal or guard Skill
     still works), else discard.
   - **Keeping cards across engagements**: inside an engagement it adds a heal card only when
     hurt; the rest of the hand stays for the next engagement.
2. `pnpm sim` takes `--policy defender`; `compare` takes `--a-policy` / `--b-policy` (one side)
   beside `--policy` (both sides), so `pnpm sim -- compare --b-policy defender` compares the two
   bots on the same seeds.
3. Every run records a tally of play events (enemy hits taken, enemy dice cancelled, health
   lost, knock-outs, enemies defeated, defenses built, health repaired, upgrades bought);
   `compare` prints the batch totals, the CSV gets a column per count, the terminal summary a
   line.
4. The stall cap is 5000 actions **per seat** (4 defending bots reach 5000 actions by round 10).
5. `docs/reports/phase-36-defender.md`: the defender against the default bot (1, 2, and 4
   seats); rows 63-70 re-measured under the defender; defeated dice (`hit` against `cancelled`)
   and the draft pool (`pool` against `supply`) re-run under the defender.

## Routes / API / CLI surface

- No routes. `@survival/bot` exports `BotPolicy` with `defender`; `goals.ts` exports `threat`,
  `guardPost`, `cheapestDefense`, `THREAT_RANGE`, `POST_RANGE`; `defender.ts` exports
  `defenderChoice` and `bestTarget`.
- `tools/sim`: `--policy defender`, `compare --a-policy|--b-policy`, `RunResult.tally`,
  `Summary.totals`, `addEvents`, `EMPTY_TALLY`.

## Tests

- `packages/bot/src/defender.test.ts`: legal actions over 20 seeds; `bestTarget` (defeat first,
  most dice, nearest base); Tower tie against the default bot; Training first; a Tower near the
  base toward the threat; guard post and Combat goal; repair, engage in range keeping Move
  cards, move toward the threat, heal only when hurt.
- `tools/sim/src/run.test.ts`: `addEvents` per event; `summarize` totals; a pinned defender
  batch (seeds 1-200) that beats the default bot on end round, defeats, and defenses.
- `tools/sim/src/report.test.ts`: the totals rows in `compareTable`.

## Decisions made upfront — DO NOT ASK

- A bot policy is a sim option, not a rule: no config key, no engine change, no
  RULES-COVERAGE row.
- The defender lives in its own module and only overrides decisions; everything else falls
  through to the default priorities, so the default bot's pinned batches do not move.
- `OPEN-QUESTIONS.md` rows are not edited here: phase 37 records the engagement readings for
  rows 65 and 69 and can cite this report.
- Stalled runs stay in the medians, as in phase 22; the report says how many and why.
- The phase 22 exchange tables are not re-run as they were; every table here is under
  engagements.
