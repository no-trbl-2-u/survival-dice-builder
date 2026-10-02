# Phase 4 — Progression: XP, upgrades, Shop, draft, end of run

**Goal:** every way the player grows, and every way a run ends.

## Scope

- Experience shared by all players; level thresholds (step 5); +1 die per level for every player; optional max level (18.1).
- Currency to the killer; Shop I–III offers from the highest open card level; buying is free while on the base (6.8).
- Base upgrades in sequence I → II → III with costs from Table 6, played with a Build card on the base; +5 maximum and current base health per upgrade (11.1–11.4).
- Skill draft every even round while Training is open: top 2 of the highest open level, keep 1, other to the bottom; fall back to the lower level if empty (11.5–11.8).
- Bought cards: add (default) or replace a starter card (config).
- End of run: base at 0 or any player at 0 (section 14). Milestones (section 17).

## Acceptance criteria

- Unit tests for every rule in sections 8, 11, 13.1, 14, 17.
- A headless full run (scripted actions) reaches the end with a correct cause and milestone list.
- Milestone 1 reached: the engine is feature-complete for Spec v1.
