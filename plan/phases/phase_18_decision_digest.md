# Phase 18 — Designer decision digest

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` (expand pass 1,
> score 5.0), promoted via oversight 2026-10-03.

## Outcome

One place lists everything waiting on the designer:
- every rule reading not yet decided (`OPEN-QUESTIONS.md` rows with status `proposed` or `pending-spec`, including partly proposed rows), with its rules section, the reading, and the current config value;
- every `[needs-user-call]` check in `plan/AUDIT.md`.

The designer reads it as `docs/DECISIONS.md` or on the live site at `/decisions`. Nothing here decides a rule.

## Content (packages/content/src/decisions.ts, pure)

- `parseQuestions(md)`: the OPEN-QUESTIONS table as rows (number, rule, question, reading, flag, status).
- `openQuestions(rows)`: rows whose status contains `proposed` or `pending-spec`.
- `flagSettings(flag, config)`: each backticked key in the Flag column, resolved against the config as an exact path or a unique path suffix (`enemiesPerHex` -> `rulings.enemiesPerHex`). For each one: the config path, the value the row names (if any), the current value, and whether they differ. A flag starting `(engine` is an engine reading with no setting.
- `parseUserCalls(md)`: each `- [needs-user-call] **Title** body` line of AUDIT.md.
- `decisionsMarkdown(questions, calls, config)`: the generated doc. No dates or hashes, so it changes only when its sources do.

## Generator (tools/sim)

- `pnpm sim -- decisions [--out docs/DECISIONS.md]` reads `OPEN-QUESTIONS.md` and `plan/AUDIT.md` from the repo root and prints or writes the doc.
- A unit test fails when `docs/DECISIONS.md` is stale and names the command that regenerates it.

## Web (apps/web/src/decisions/)

- `DecisionsPage.tsx` at `/decisions` (title "Decisions"), linked from the nav.
- It imports both sources with `?raw` and renders them through the same content functions.
- **Readings:** grouped by status (`pending-spec` first, then `proposed`). Each row shows its number, rules section, question, and reading, plus a settings line. Each setting links to `/config#cfg-<path>`, and a differing value is marked "differs".
- **Checks:** the `[needs-user-call]` list.
- **ConfigPage:** when the URL has a `#cfg-...` hash, it scrolls to and focuses that field.

## Decisions made upfront — DO NOT ASK

- **The parser lives in `@survival/content`,** because both the web page and the sim CLI need it, and content already owns the config.
- **The page is read-only.** Changing a value stays on `/config`, and confirming a reading stays a designer edit to `OPEN-QUESTIONS.md`.
- **No per-row evidence column.** The doc links the bot batch report (`docs/reports/phase-9-bot-batch.md`) and the playtest report kit once, at the top. Per-row evidence would be invented.
- **Unresolved flag keys show as "no config field".** The doc never guesses a setting.

## Tests

- **Unit (content):**
  - Table parsing on the real file (54 rows).
  - The open filter.
  - Flag resolution: an exact path, a suffix, engine-only, unknown, and a differing value.
  - Needs-user-call parsing.
  - The markdown has both sections.
- **Unit (sim):** the `docs/DECISIONS.md` freshness check.
- **e2e:** `/decisions` lists open readings and checks, a setting link reaches `/config` with that field focused, and the nav and title checks extend to the new route.

## DoD

- `pnpm verify` is green and the deploy is green.
- `docs/DECISIONS.md` is committed.
- The AUDIT designer-review row points to `/decisions`.
