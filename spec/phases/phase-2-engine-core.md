# Phase 2 — Engine core: cards, dice, Skills, phases

**Goal:** a headless engine that runs the round loop for one player with an abstract enemy list (no map yet).

## Scope

- Seeded RNG stored in state. Deterministic `createGame`, `legalActions`, `applyAction`, `serialize`, `deserialize`.
- Deck model: deck, hand, discard, orientation (top or bottom). Draw 3, play, discard. Quick Prepare: turn the discard pile 180° without a shuffle (rule 10.6). Combat: shuffle and turn (7.1–7.2).
- Prepare phase: card plays as decisions; effects stubbed where they need the map (Move, Gather, Build) with events.
- Combat exchange (7.8): roll, keep, reroll up to 3 rolls, card bottom effects (reroll, +damage, +guard, heal, +1 die), Skill assignment with Star wild, each die and each Skill used once (config can allow unlimited Skill uses), damage, guard, heal, enemy attacks (grunt fixed 2, elite 6 dice).
- Phase machine: Prepare → Combat → Explore → next round, with events for each transition.

## Key functions (each pure, TSDoc with rule id)

`drawHand`, `playTop`, `rotateDeck`, `rollDice`, `rerollUnkept`, `canFire(faces, need)`, `assignDice(faces, skills, choice)`, `resolveSkill`, `enemyAttack`, `nextPhase`.

## Acceptance criteria

- Property: owned cards are conserved through any sequence of legal actions.
- Property: `canFire` with Stars never uses one Star for two faces.
- A golden replay of 3 rounds (seed + actions) reproduces the same state hash.
- Unit tests cover rules 5.x, 6.1–6.6, 7.1–7.2, 7.8, 9.5–9.6, 10.6–10.7.
