# @survival/bot

**Purpose:** a deterministic autoplay policy that chooses only from `legalActions` (it reads the
state to rank them). Used by tests, by the batch runner in `tools/sim`, and by the `/debug`
Autoplay button. A floor, not a skilled player, and never an AI teammate (non-goal).

**Public API:** `botChoice(state)` returns a legal action (undefined when the run has ended);
`goal(state)` is the hex the figure is heading for.

**Priorities:** required choices (starter return, draft), Shop purchases, tile placement,
active Build (cheapest upgrade, else a Tower or Barricade near an enemy), active Move (toward
the goal, never into a skirmish), Combat (keep non-Blank dice, play every bottom half, damage
Skills first, weakest target), then Prepare cards by use. See `plan/phases/phase_9_bot.md`.

**Tests:** `src/policy.test.ts` (20 seeds to the end with only legal actions, plus each
priority).
