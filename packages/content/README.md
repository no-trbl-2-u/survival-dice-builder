# @survival/content

**Purpose:** all game content (cards, Skills, enemies, tiles, upgrades, defenses) and every
number from the rules, as JSON validated by Zod. No rule number lives in code.

**Public API:** `CONTENT_VERSION` (phase 2 placeholder). Phase 4 adds the Zod schemas, the
content files, `config.default.json`, and a validating loader.

**Tests:** none yet; phase 4 adds schema and loader tests.
