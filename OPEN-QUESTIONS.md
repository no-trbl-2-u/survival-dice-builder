# Open questions

Rule readings the engine needs that `spec/01-spec-v1-rules.md`
(Issue 005) does not settle. Each row: the rule id, the
reading the engine implements, the config flag that carries
it, and its status.

Status vocabulary: `decided` (designer answered; the spec
text should be updated to match), `proposed` (loop's reading,
awaiting the designer), `pending-spec` (designer intends a new
rule but has not written it yet; the engine uses the v1 text
until then).

| # | Rule | Question | Reading implemented | Flag | Status |
|---|---|---|---|---|---|
| 1 | 10.4, Table 1 | Can enemies share a hex? | **One enemy per hex.** A spawn whose node is occupied spills to the nearest empty passable hex (nearest to the base on ties). | `enemiesPerHex: 1` | decided 2026-10-02 |
| 2 | 9.3–9.4 | What does an enemy do when another enemy blocks its path? | It moves toward the **next nearest target** instead. | `blockedPathRule: "next-target"` | decided 2026-10-02 |
| 3 | 4.2–4.3 | Tile count and setup. | **9 tiles:** Broken Village (base), 3 countryside, 5 core. Setup: base + 1 countryside tile. Deck: 2 countryside on top of 5 core (7 tiles). Solo waves start in round 8. | `tiles.setupCountryside: 1`, `tiles.countryside: 3`, `tiles.core: 5` | decided 2026-10-02 |
| 4 | 17 | "Reveal 10 tiles" is unreachable with 8 non-base tiles. | Milestone kept as written and never fires. Designer to pick a new number (reveal 8? reveal all?). | `milestones.revealTiles: 10` | proposed |
| 5 | 10.1 | Where can a revealed tile go? | Any empty slot adjacent to an existing tile where the 7-hex shapes tessellate; **fixed rotation**; the player picks the slot. | `tileRotation: false` | decided 2026-10-02 |
| 6 | 16 | Co-op Prepare order (16.4 covers Combat only). | Players **alternate hands of 3** in seat order until every deck is empty. | `coopPrepareOrder: "alternate-hands"` | decided 2026-10-02 |
| 7 | 7.11, 9.5 | Enemy damage to structures. | Designer intends: **1 die (Table 4) per grunt; elites get special rules** (unwritten). Until the spec carries that text the engine uses the v1 reading: grunt 2 fixed, elite 6 dice. | `structureDamage: "v1"` (future `"grunt-die"`) | pending-spec |
| 8 | 6.10–6.13 | Skirmish that does not clear the hex. | Figure **stays on the hex it came from**; the rest of the Move is lost. Entering costs movement as normal, including the 6.9 surcharge, and needs the full cost available. | `skirmishFail: "stay-lose-move"` | decided 2026-10-02 |
| 9 | 2.1 | Skill capacity. | The 4 starter Skills are fixed. **At most 6 drafted Skills.** When full, a draft may replace one drafted Skill (proposed reading of "at most"). | `draftSlots: 6`, `fullBoardDraft: "swap"` | decided 2026-10-02 (swap detail: proposed) |
| 10 | 6.2 | Must every card be played? | **A card may be discarded unplayed.** Played effects resolve as written. | `mandatoryPlays: false` | decided 2026-10-02 |
| 11 | 6.8, 11.5 | Shop timing and refill. | **Buy at any time in any phase while the figure is on the base.** Offers are shared; a bought card is **replaced immediately** so 3 offers are always shown. Assumption to confirm: the on-base requirement from 6.8 still holds. | `shopTiming: "any-time-on-base"`, `shopRefill: "immediate"` | decided 2026-10-02 (on-base assumption: proposed) |
| 12 | Table 3, 6.7 | Heal targets in co-op (Mend, Rest, Renewal, Purify). | **Self only** for v1. | `healTargets: "self"` | proposed |
| 13 | 10.5 | Which grunt becomes the elite? | The grunt **nearest the base** (ties: lowest spawn node id). | `eliteReplacement: "nearest-base"` | proposed |
| 14 | Brief | Defense on a gathering node hex. | **Allowed**; the node still works. | `buildOnNode: true` | decided (brief) |
| 15 | 9.3 | Enemy target tie-break. | Player, then Tower, then Barricade, then base; then lowest health. | `targetTieBreak` | decided (brief) |

## Spec amendments owed

Rows marked `decided` change or extend the Issue 005 text.
The designer owns `spec/`; fold these into the next issue of
the rules (and the Claude design doc) so the spec and the
engine agree: 1, 2, 3, 5, 6, 8, 9, 10, 11, and the new
structure-damage rule for 7.

## Physical edition constraint (standing)

The designer intends a physical board game. Every reading
above must be trackable with miniatures, tokens, and printed
boards: no hidden counters, no fractional values, no
unlimited piles on one hex. See `plan/bearings.md`.
