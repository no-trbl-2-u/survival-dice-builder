# Phase 13 — Co-op hot-seat, configuration panel, save and load

> Agent-facing brief. Ship without asking. Source:
> `spec/phases/phase-6-coop-config-save.md`, plus the engine's co-op turn
> order moved here from phase 7 (rules 16.1-16.8; OPEN-QUESTIONS rows 6, 12, 16).

## Outcome

1-4 players share one screen; every config value can be changed before a run; a run can be
saved to a file, autosaved in this browser, loaded, and continued to the identical state.

## Engine (packages/engine)

- `createGame(config, seed, content, setup = { players: 1 })` — players `p1`..`pN`
  (`config.players.min`..`max`), each with an own shuffled starter deck (16.1), all on the base
  (4.6, row 16). Card instance ids stay unique across players.
- Turn order with `state.current` and a `turnFresh` flag:
  - **Prepare (16.8, row 6):** `alternate-hands` = each player in seat order draws and plays 1
    hand, then the next player with cards; `full-turn` = a player plays the whole deck first.
  - **Combat (16.4-16.5):** exchanges in turn, seat order, skipping players with no cards; in a
    player's exchange only enemies next to that player attack that player (7.8 already does).
  - Every player shuffles and turns the deck at 7.1-7.2 and turns it at 10.6.
  - **Explore (16.6, open):** `players x tiles.revealPerPlayer` reveals, each placed by the next
    seat; an empty tile deck adds 1 to the wave track once per Explore phase (proposed row).
  - **Draft (10.8, 11.6):** each player drafts in seat order (`draftedPlayers` per round).
  - 16.7: any player at 0 ends the run (unchanged).
- Solo play is unchanged: existing tests and goldens must still pass with at most a hash
  regeneration for the new state fields (say so in the commit).

## Web (apps/web)

- `/play` start panel: player count 1-4, seed, "Start run"; "Resume saved run" when an
  autosave exists (label: "saved in this browser only").
- Whose turn: phase bar names the current player ("Player 2"); the player panel lists every
  player with the current one marked; map figures are labelled P1-P4.
- `/config`: a form generated from `GameConfigSchema` (numbers, booleans, enums, number
  lists; other arrays as validated JSON), "Save", "Reset to defaults"; stored in
  `localStorage`; `/play` uses it for new runs and shows "custom config" when it differs.
- Save/load: "Save run" downloads `{ version, seed, players, config, actions }`; "Load run"
  replays it (same serialized state); autosave after every action; developer toggle "Allow
  undo" replays all actions but the last.

## Decisions made upfront — DO NOT ASK

- Save files replay actions instead of storing state: smaller, and the replay proves the file.
- Config storage key `survival.config.v1`, autosave key `survival.autosave.v1`; corrupt or
  invalid stored data is ignored (with a message), never crashes the page.
- Heal targets stay self-only (row 12).

## Tests

- Engine: 3-player run to the end (bot); Prepare alternates hands (and full-turn); exchanges
  in turn; each player's reveal; per-player draft; solo unchanged.
- Web unit: config form round trip and new-run-uses-config; save -> load -> same state hash;
  undo.
- e2e: a 3-player run starts and passes the turn; `/config` change is used by the next run.

## DoD

`pnpm verify` green, rules-lawyer review of the engine part, deploy green.
