# Phase 20 — Core loop v2 I: map, exploration, and Prepare

> Agent-facing brief. Ship without asking. Source: `docs/design/core-loop-v2.md` (designer
> walkthrough 2026-10-04) and the `OPEN-QUESTIONS.md` rows decided on 2026-10-04 (16, 18, 19,
> 20, 26, 28). `spec/` is not edited: the designer folds the walkthrough into the next rules
> issue. Phase 21 owns enemies and Combat (no wave track, spawning at every Combat,
> structure-first targeting, knockout).

## Outcome

A run starts on the Base tile alone, and the players explore by walking off the map edge:
- Setup: the Base tile (base centre + 6 plain hexes, no nodes). Each player puts their figure on
  a free hex of the Base tile (1 figure per hex), in seat order.
- The whole Base tile is the base: buying cards, buying upgrades, and enemy attacks on the base
  work from (or next to) any of its 7 hexes.
- The round is Prepare, then Combat. There is no Explore phase. Its round-end steps (turn the
  discard pile, the draft, the round counter, the milestones) run at the end of Combat.
- A Move step off the map edge reveals the top tile of the tile deck (countryside on top of
  core) so that it covers the hex entered (fixed rotation). The step costs 1, and the Move goes
  on. The new tile's enemies appear at the next Combat start.
- Gather takes the card's amount on a gathering node and spends the node for good.
- The starter deck is 10 cards (4 Move 2, 4 Gather 2, 1 Build, 1 Rest) with a hand of 3, and a
  deck never drops below 10 cards. The supplies hold 2 copies of each card.
- A step into an enemy's hex (a skirmish) costs 1.

## Content (packages/content)

- `tiles.json`: Broken Village = base centre (plains) + 6 plains, no sites.
- `cards.json`: the Gather effect is `{ kind: 'gather', amount }`. Amounts: starter Gather 2,
  Haul 2 (row 20), Forage 1, Excavate 3, Quarry 5 ("Gather +N" read as N in total, row 20; new
  row 60 flags that Forage now gathers less than the starter card).
- `config.default.json`:
  - new preset `deck-10-hand-3` (row 19 cards, hand 3), now the default `deck.preset`;
  - new `deck.minimumSize: 10`, `tiles.revealMoveCost: 1`, `rulings.gatherNeedsNode: true`;
  - `supplies.copiesPerCard: 2` (row 18);
  - removed: `gatherAmount` (the card sets it), `tiles.setupCountryside`,
    `tiles.revealPerPlayer`, `options.exploration` (no Explore phase),
    `rulings.baseHexFigureLimitExempt` (row 16: 3.8 holds on base hexes).
- `config.meta.json`: entries follow the keys above. A stored config with the old keys fails
  validation, and /config already falls back to the defaults with a notice.

## Engine (packages/engine)

| Area | Change |
|---|---|
| `state/types.ts` | `version: 2`; `Phase` drops `explore`; drops `revealed`, `revealOffer`, `revealsLeft`; adds `unplaced` (seats still to place a figure) and `spentNodes`. |
| `api/createGame.ts` | Base tile only; tile deck = shuffled countryside on shuffled core; phase `setup` with every player unplaced. |
| `api/actions.ts` | Adds `placeFigure {q,r}`; drops `placeTile`, `revealTile`, `skipReveal`. |
| `map/base.ts` (new) | `baseTileId`, `onBaseTile(state, hex)`, `baseHexes(state)`, `nearestBaseHex(state, from)`. |
| `map/tiles.ts` | `slotCovering(hex)`: the tile-lattice centre whose 7 hexes hold `hex`. `edgeHexes(map)`. |
| `explore/explore.ts` | `revealUnder(state, hex)`: draw the top tile, place it at `slotCovering(hex)`, count it for the milestones, queue its spawn nodes in `vacantNodes` (7.3 fills them at the next Combat). |
| `movement/move.ts` | Off-map neighbours are legal steps (cost `tiles.revealMoveCost`) while the tile deck has tiles; an enemy's hex costs 1 (rows 26, 28); no base exemption from 3.8. |
| `api/applyAction.ts` | `moveTo` off the edge reveals, then enters the hex if passable (else the figure stays); `placeFigure`. |
| `gather/gather.ts` | `amount` from the card; needs an unspent node with no enemy (flag `gatherNeedsNode`); spends the node. |
| `phases/advance.ts` | Setup waits for every figure; Combat ends with structure attacks, then the round end (wave track +1 when the tile deck is empty, turn decks, draft, round, milestones). |
| `progression/shop.ts` | `onBase` = any Base tile hex; `returnableStarters` is empty when the player has `deck.minimumSize` cards or fewer. |
| `enemies/targets.ts`, `structures.ts` | The base target is the nearest Base tile hex; an enemy next to any Base tile hex (or standing on an outer one) attacks the base. |
| `api/serialize.ts` | `deserialize` accepts version 2 only, with a plain error. |

## Bot and sim

- `packages/bot`: places the figure on the first offered hex; goals skip spent nodes; with no
  unspent node it walks to the nearest map edge and steps off it to reveal.
- `tools/sim`: unchanged code; the 200-run batch is re-run and the numbers go in the commit body.

## Web (apps/web)

- `/play`:
  - Setup reads "Setup: place your figure on a base hex". The legal hexes are map buttons and Choices.
  - Off-map steps are dashed ghost hexes labelled "Step off the edge to (q,r): reveal a tile".
  - The phase bar shows Prepare and Combat only. Spent nodes are dimmed and their title says "spent".
- The "Tile to place" panel goes. `/debug` describes `placeFigure` and the reveal step.
- The run export goes to version 2. An older file gives "This run file is from an earlier
  version and cannot be replayed."
- Home copy: the round is Prepare then Combat, and exploring is walking off the edge.

## Decisions made upfront — DO NOT ASK

- **Haul and every Gather card need an unspent node** (`rulings.gatherNeedsNode: true`). The
  walkthrough says "on a gathering node, take N"; row 20 says "on a node or off one". The flag
  keeps row 20's literal reading one switch away. New row 59, proposed.
- **"Gather +N" means N in total for every card**, as row 20 rules for Haul. Forage drops to 1.
  New row 60, proposed (the designer re-prices Forage).
- **A revealed hex that is lake or mountain:** the tile is placed, the step's cost is paid, and
  the figure stays where it was. New row 61, proposed.
- **The wave track stays until phase 21.** With no Explore phase, 10.3 moves to the round end:
  an empty tile deck adds 1 per round. New row 62, proposed (phase 21 removes the track).
- **New tiles' spawn nodes go into `vacantNodes`.** The 7.3 refill at the next Combat start
  places their enemies. Phase 21 replaces this with spawning at every node every Combat.
- **Start hexes:** all 7 Base tile hexes are allowed (the centre too), in seat order.
- **10-card deck with a hand of 3:** a new preset. The 18.1 presets (6/3, 8/4, 10/5) stay
  selectable. The minimum deck size applies only where a card leaves the game (replace-starter).
- **Removed config keys are removed, not left inert.** A dead flag on /config would mislead
  the designer.

## Tests

- **Unit/integration (engine):**
  - setup: Base tile only, figures placed on free base hexes, deck order;
  - the slot lattice: `slotCovering` returns the one slot that covers each off-map neighbour;
  - reveal: cost 1, the Move goes on, no enemies until Combat, then spawned; the impassable-hex case;
  - Gather: amount, node spent, flag off;
  - base tile: buying and Build on an outer hex, enemy attacks next to an outer hex;
  - skirmish step costs 1; 3.8 holds on base hexes; the round runs Prepare, Combat, then the next round;
  - minimum deck size; version 2 serialize.
- **Goldens:** re-recorded on purpose (`UPDATE_GOLDEN=1`); the policies cover reveal steps.
- **Bot:** `policy.test.ts` runs a seeded run that reveals at least 1 tile and gathers.
- **e2e:** `/play` setup places the figure; a Move can reveal a tile; the co-op flow places 2
  figures; a11y name patterns follow the new labels.

## Verify gate

`pnpm verify` (lint, typecheck, test:run, build, e2e), foreground, then `pnpm deploy:check`.

## Docs

- `RULES-COVERAGE.md` rows for 4.x setup, 6.7 Gather, 6.9/6.15, 10.x exploration, 10.6-10.10
  round end.
- `OPEN-QUESTIONS.md`: row 16 shipped; rows 59-62 added.
- `docs/DECISIONS.md` regenerated (`pnpm sim -- decisions`).

## DoD

- [ ] A solo and a 2-player run start on the Base tile alone, with the figures placed by the players.
- [ ] Walking off the edge reveals a tile under the hex entered; its enemies appear at the next Combat.
- [ ] Gathering spends the node; the 10-card deck is the default.
- [ ] No Explore phase anywhere (engine, UI, copy).
- [ ] Goldens, bot batch, and export version 2; the verify gate and the deploy gate are green.

## Follow-ups (out of scope)

- Phase 21: no wave track, spawning at every node each Combat, structure-first targeting,
  Tower ties and currency, non-attack halves without enemies, knockout.
- New tiles (row 57) and the milestone set (row 4).
