# Survival Dice-Builder — spec index

The product spec lives in [`spec/`](./spec/). Read in this order:

1. [`spec/01-spec-v1-rules.md`](./spec/01-spec-v1-rules.md) — the game rules (Spec v1, ASD-STE100). **The rules win over every other file.**
2. [`spec/02-build-plan.md`](./spec/02-build-plan.md) — the designer's 12 phases, milestones, handoff rules.
3. [`spec/03-build-brief.md`](./spec/03-build-brief.md) — stack, architecture, engine API, data model, UI, testing, non-goals.
4. [`spec/phases/`](./spec/phases/) — one spec per designer phase, with acceptance criteria.

Reference only: [`spec/reference/`](./spec/reference/) (Issue 004 simulator; do not port).

**Who it's for:** the designer, playing runs to feel pacing and collect real timing data.
**v1 scope:** a full solo run (then 1–4 hot-seat co-op) with every Spec v1 rule enforced, run export, configurable rule numbers.
**Non-goals:** networked play, accounts, cloud saves, AI teammates, final art, scenarios (rules section 19).

The nexus build plan that executes this spec is
[`plan/steps/01_build_plan.md`](./plan/steps/01_build_plan.md);
stack and standing decisions are in
[`plan/bearings.md`](./plan/bearings.md).
