# Phase 1 — Content and data model

**Goal:** all rule numbers and game content live in validated data, not code.

## Scope

- Zod schemas and TypeScript types for: GameConfig, CardDef (level, top effect, bottom effect, cost), SkillDef (level, needed faces, effect), EnemyDef, DefenseDef, UpgradeDef, TileDef (7 hexes: terrain + site), Face table for enemy dice.
- Content files from Spec v1 Tables 1–9: starter cards, starter Skills, card supplies L1–L3, Skill supplies L1–L3, enemies, defenses, upgrades.
- `config.default.json` with every number from the rules (health 15, base 20, +5 per upgrade, costs, XP step 5, elite 14/6, grunt 2/2, miniature limit 20, hand 3, starter 6, tile counts 5 + 5) and the section 18 option flags.
- **Tile layouts:** propose 1 Base tile, 5 countryside tiles, and 5 core tiles that follow Table 1 (terrain mix, at most 1 lake or mountain per tile, never on the center hex). Present them as an SVG sheet for designer review.
- Content loader that validates on startup and reports every error with file and field.

## Acceptance criteria

- Changing a number in `config.default.json` changes the game with no code edit (proved by one test).
- Invalid content (for example a Skill with 0 faces) fails validation with a clear message.
- The tile sheet is reviewed by the designer; changes are recorded in `OPEN-QUESTIONS.md`.

## Rule references

Sections 2, 3, 4, 9 (Tables 4–5), 11 (Table 6), 12 (Table 7), 13 (Tables 8–9), 18.
