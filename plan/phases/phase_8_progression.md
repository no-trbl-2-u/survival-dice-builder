# Phase 8 — Progression: XP, upgrades, Shop, draft, end of run, milestones

> Agent-facing brief. Ship without asking. Mirrors the canonical
> sibling (`phase_5_engine_core.md`) and the phase 6-7 layout. Source:
> `spec/phases/phase-4-progression.md`. Rules: 4.12, 6.8, 8.1-8.5,
> 10.8, 10.10, 11.1-11.9, 13.1, 14.1-14.3, 17, 18.1 (bought cards,
> max level); Issue 006 rulings in `OPEN-QUESTIONS.md`.

## Outcome

Every way the player grows and every way a run ends. A headless run
reaches the end with the right cause and milestone list. **Milestone 1:
the engine is feature-complete for Spec v1 (solo).**

## New modules

```
packages/engine/src/progression/
├── levels.ts        # (exists) experienceForLevel, levelForExperience
├── experience.ts    # gainForDefeat: XP to all, currency to the killer, level-up dice (8.1-8.4)
├── supplies.ts      # card and Skill supplies per level, shuffled at setup (4.12)
├── shop.ts          # openShop, refillOffers, buyCard, returnStarter (6.8, 11.5, 13.1, 18.1)
├── upgrades.ts      # legalUpgrades, buyUpgrade (11.1-11.4, Table 6)
├── draft.ts         # draftDue, startDraft, keepSkill, replaceSkill (10.8, 11.6-11.9)
└── milestones.ts    # checkMilestones, finishRun (10.10, 14.3, 17)
```

## State additions

- `experience`, `level` (shared, 8.1, 16.2); `upgrades: string[]` (bought ids).
- `supplies: { cards: Record<level, string[]>; skills: Record<level, string[]> }` (top first).
- `shopOffers: string[]` (card def ids; empty while the Shop is closed).
- `draft: { player, options, kept } | null`; `lastDraftRound`.
- `pendingReturn: string | null` (replace-starter mode, waiting for the card to return).
- `progress: { elitesDefeated, firedSkills, tilesRevealed, cardsBought }`; `milestones: string[]`.
- `nextCardId` for bought card instances.

## Actions

- `buyCard { card }` — any decision point while the figure is on the base and the Shop is open
  (6.8 [006], `shopTiming`); never the progress action.
- `returnStarter { card }` — replace-starter mode only.
- `buyUpgrade { upgrade }` — while a Build is active on the base hex; `stopBuilding` ends it.
- `draftSkill { skill }`, then `replaceSkill { skill }` when the draft slots are full (`swap`).

## Decisions made upfront — DO NOT ASK

- **XP and currency**: every defeat gives its experience to the shared track (8.1). Currency
  goes to the player who defeated it (8.2); a Tower defeat gives no currency (proposed).
  Skirmish defeats pay the same (row 31). Level-ups give every player 1 die (8.4), capped by
  `options.maxLevel`.
- **Supplies**: `copiesPerCard` / `copiesPerSkill` copies of each Level 1-3 card / Skill, one
  shuffled stack per level (4.12, row 18).
- **Shop**: Shop I opens it with 3 offers from the highest open level (11.5). A bought offer is
  replaced at once from the highest open level supply; an empty supply falls back to the next
  lower level (as 11.8; proposed); no supply left → fewer offers. Shop II/III do not replace
  offers already shown. Buying needs the figure on the base and enough currency (6.8, row 11).
  New cards go to the discard pile (13.1). `boughtCards: "replace-starter"`: the player returns
  1 starter card from the deck or discard pile (not hand or table); none there → no return.
- **Base upgrades**: Build on the base hex buys 1 upgrade: the next tier of a track (11.4),
  paid in materials; card cost reductions apply (Mason, Engineer; proposed); Architect buys 2.
  Each upgrade: +5 maximum and +5 current base health (11.3).
- **Draft** (10.8): in Explore after the deck turn, when Training is open and the round is
  even: the top `draft.reveal` Skills of the highest open level Skill supply (fallback lower,
  11.8); keep 1, the other goes to the bottom (11.7). Full draft slots (`draftSlots`, row 9):
  `swap` = the kept Skill replaces a drafted Skill the player picks, which goes to the bottom
  of its supply (11.9); `skip` = no draft.
- **Milestones** (17): checked after the round advances (10.10) and when the run ends (14.3);
  each recorded once. "Survive to round N" = the round counter reaches N. "Reveal 10 tiles"
  counts tiles revealed in Explore and stays unreachable with 7 (row 4).
- **End of run** (14): unchanged causes; the run summary is `round`, `endedBecause`, and
  `milestones`.

## Tests (rule-tagged)

- 8.1-8.5 XP to the track, currency to the killer only, level thresholds, +1 die, max level.
- 11.2-11.4 upgrade order, cost, health; Mason reduction; Architect twice; shop opens.
- 11.5 / 6.8 buy on base only, offers refill, highest level, fallback; 13.1 discard pile;
  18.1 replace-starter.
- 10.8 / 11.6-11.9 draft on even rounds only with Training, keep 1, bottom, fallback, swap.
- 17 / 14.3 each milestone, recorded once, summary at the end.
- Properties: owned cards = 6 + bought (add mode); currency, materials, experience never
  negative; level matches the track.
- Golden: a headless full run with the progression policy (buys, upgrades, drafts).

## DoD

`pnpm verify` green, deploy green, `rules-lawyer` review addressed,
RULES-COVERAGE rows, OPEN-QUESTIONS rows for new readings, `/debug`
shows XP, level, currency, upgrades, Shop offers, draft, milestones.
