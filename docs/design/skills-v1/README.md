# Skills v1 proposal (2026-11-11)

30 Skills as 10 families of 3 tiers, for the Skills design session (OPEN-QUESTIONS rows 9, 12,
46; Spec v2 ruling 27). Nothing here is in the game yet; `packages/content/data/skills.json` is
unchanged.

- `skills.proposal.json`: the 30 Skills. `effect` is the part today's engine plays (valid under
  the content Skill schema); `adds` (statuses) and `keywords` are new and need engine work.
- `odds.md` / `odds.json`: from `pnpm sim -- odds`: the exact chance each Skill fires in one
  engagement with 1-6 dice and 3 rolls (Star wild, Blank empty), its value per firing, and the
  expected value at its tier's dice (I: 2, II: 3, III: 4, Ultimate: 5).
- `tools/sim/src/skillOdds.ts`: the calculator, the status glossary with values, and the
  proposal schema. Tests: `tools/sim/src/skillOdds.test.ts`.

Families: Cleave, Volley, Bulwark, Renewal, Spellblade, Hunter, Snare, Evasion, Toxin, Warden.
Drafting a family you already hold upgrades it (proposed reading for 11.9: the upgrade replaces
the held tier in its slot and does not use a new slot).

Inspiration: Dice Throne's hero boards (symbol combos, Level II/III upgrade cards placed over the
board, status tokens with stack limits). Sources in the published proposal page.
