# Phase 19 — /config fit for the designer

> Agent-facing brief. Ship without asking. Source: `plan/PHASE_CANDIDATES.md` (expand pass 2,
> score 6.0), promoted via oversight 2026-10-03. Clears the 2 pending /config rows in
> `plan/CRITIQUE.md` (pass 3).

## Outcome

The designer can change any config value on `/config` without reading code:
- every field has a plain label, a one-line help, and its rules section;
- select options read as plain phrases, not code slugs;
- a save error sits next to its field, in plain words;
- Save is always in reach, leaving with unsaved edits warns, and Reset asks first.

No rule value or default changes.

## Content (packages/content)

- `data/config.meta.json`: one entry per config path, keyed by the dotted path (`player.maxHealth`).
  - Each group (`player`, `rulings`, ...) has a `label`.
  - Each leaf has a `label`, a `help` line, and a `rule` (the rules section or `OPEN-QUESTIONS` row).
  - Each enum leaf has `options`: a plain phrase for each value.
  - Arrays (`starterSkills`, `deck.presets`, `targetTieBreak`, `milestones.surviveRounds`) are leaves.
- `src/schemas/configMeta.ts`: the Zod schema for the file.
- `src/configMeta.ts` (pure):
  - `configMetaPaths(config)`: every group and leaf path.
  - `configMetaProblems(meta, config)`: lists each missing path, each unknown path, and each enum value with no phrase.
  - `defaultConfigMeta`: the file, checked at load. It throws on any problem, as content does.
  - `metaFor(path)`: the entry for a path. A numbered list path (`deck.presets.0.cards`) maps to the nearest entry above it.

## Web (apps/web/src/config/)

- **Fields:**
  - Each field shows its label, then a help line with "Rules 6.9". The help line is tied to the input with `aria-describedby`.
  - Group legends use the group label.
  - Select options show the phrase; the value stays the code slug.
  - Number inputs get `min` from the schema (0 or 1).
- **Errors:** `saveConfig` returns `{ path, message }` problems in plain words. Examples: "Enter a whole number of 1 or more." and "Pick one of the options."
  - The field holding the error gets `aria-invalid` and the message next to it (also in `aria-describedby`).
  - A summary at the top links to each field with a problem.
- **Sticky actions bar:** Save, Reset, and the status line stay pinned at the bottom of the viewport.
  - The status says "Unsaved changes" while the draft differs from what is saved.
  - A `beforeunload` warning fires only while the draft has unsaved changes. Nav links are full page loads, so this covers in-app links too.
- **Reset asks first:** "Reset to defaults" opens an inline confirm: "Yes, reset every value" or "Keep my values". It is not `window.confirm`, so it can be tested and styled.
- **/decisions:** each setting shows its config label before the path link (for example "Structure damage (`rulings.structureDamage`)").

## Decisions made upfront — DO NOT ASK

- **The metadata is a separate file, not part of `RawContent`.** It is UI copy about the config, not game content, so the engine never sees it. It is still JSON in `packages/content`, validated by Zod (standing rule 7).
- **Deck presets stay a JSON textarea.** Their help explains the shape. A structured preset editor is follow-up work if the designer asks for it.
- **The plain-word error messages come from the Zod issue code** (too small, wrong type, bad option). They are not written per field. The raw Zod message is the fallback.
- **The min attribute comes from the schema** (Zod's JSON schema export). Meta does not repeat any number.
- **The rule references use the Spec v1 section numbers.** Rulings without a section use the `OPEN-QUESTIONS` row number ("Open question 7").

## Tests

- **Unit (content):** every config path has metadata and every enum value has a phrase. A missing or unknown key is reported. `metaFor` maps list paths to their parent entry.
- **Unit (web):** `saveConfig` returns path and plain message pairs, the dirty check works, and the min helper reads the schema.
- **e2e:**
  - A label, help, and rules section are present, with `aria-describedby`.
  - A select shows phrases.
  - An invalid save puts the error at its field with `aria-invalid`.
  - Reset asks for confirmation.
  - The Save bar stays in the viewport after a scroll to the page bottom.
  - Leaving with unsaved edits triggers the `beforeunload` dialog.
  - `/decisions` shows the label beside the path.

## DoD

- `pnpm verify` is green and the deploy is green.
- Both /config rows in `plan/CRITIQUE.md` move to Done with the commit hash.
