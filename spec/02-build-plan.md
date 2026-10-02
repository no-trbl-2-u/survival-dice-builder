# Build Plan — Spec v1 Prototype

Twelve phases. Phases marked **non-code** are research, art, or playtest work that a person or a research agent can do in parallel with the code phases. Each phase has its own spec tab with scope, deliverables, and acceptance criteria. A phase is done only when every acceptance criterion passes.

| Phase | Name | Type | Depends on | Can run in parallel with |
| --- | --- | --- | --- | --- |
| A | Asset and library research | Non-code | — | 0, 1, 2, 3, 4 |
| B | Art direction and placeholder art | Non-code | A | 2, 3, 4, 5 |
| 0 | Foundation | Code | — | A |
| 1 | Content and data model | Code | 0 | A |
| 2 | Engine core: cards, dice, Skills, phases | Code | 1 | A, B |
| 3 | World: map, enemies, base, defenses, exploration | Code | 2 | A, B |
| 4 | Progression: XP, upgrades, Shop, draft, end of run | Code | 3 | B |
| 5 | Playable web UI (solo) | Code | 4 (engine API from 2) | B |
| 6 | Co-op hot-seat, configuration panel, save and load | Code | 5 | C |
| 7 | Playtest tooling: bot, batch runs, timing export | Code | 4 (bot), 5 (timing) | 6, C |
| 8 | Visual polish: icons, art, 3D dice, animation | Code | 5, B | 7 |
| C | Playtest protocol and first playtests | Non-code | 6, 7 | 8 |

Order of work for a single agent: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8, with A and B started on day one and C after 7.

## Milestones

1. **Headless engine (end of Phase 4):** a full run plays in tests from `seed + actions[]`, every rule covered.
2. **First playable (end of Phase 5):** the designer plays a solo run in the browser.
3. **Playtest build (end of Phase 7):** co-op, configuration, and real timing export.
4. **Presentable build (end of Phase 8):** icons, art, 3D dice.

## Handoff rules for agents

- Read the "Spec v1 — Rules" tab, the "Build brief" tab, and your phase tab before starting.
- Do not change a rule. If a rule is unclear, follow "Open questions" in the brief.
- Each phase ends with a short report: what was built, test results, open questions, and screenshots for UI phases.
