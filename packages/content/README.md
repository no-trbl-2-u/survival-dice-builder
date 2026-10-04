# @survival/content

**Purpose:** all game content (cards, Skills, enemies, tiles, upgrades, defenses) and every
number from the rules, as JSON validated by Zod. No rule number lives in code.

**Public API:** `CONTENT_VERSION` (phase 2 placeholder). Phase 4 adds the Zod schemas, the
content files, `config.default.json`, and a validating loader.

**Tests:** none yet; phase 4 adds schema and loader tests.

**Config metadata (phase 19):** `data/config.meta.json` gives every config path a plain label,
a one-line help, its rules section, and a phrase for each select value. `/config` and
`/decisions` read it through `defaultConfigMeta` and `metaFor`. It is checked at load against
the default config: a config key with no entry fails the build and the tests.
