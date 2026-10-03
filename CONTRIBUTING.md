# Contributing

Coding standards from `spec/03-build-brief.md`, plus the loop's standing rules in `agents.md`.

## Functional core

- The engine is pure functions over plain data: no classes, no mutation of inputs, no I/O, no
  `Date` or `Math.random` inside `packages/engine`. ESLint enforces this.
- Randomness comes only from the seeded RNG stored in `GameState`.
- The UI never decides a rule. It only calls the engine API and offers `legalActions`.

## Explicit documentation

- Every exported type and function has a TSDoc comment: what it does, its inputs, its outputs,
  and the rules section it implements (`@rule 7.8`).
- Non-obvious lines get inline comments.
- Each package has a `README.md`: purpose, public API, tests.

## Rules traceability

- Every rule maps to at least one test. Test names start with the rule id (`"7.8 keep dice"`).
- Keep `RULES-COVERAGE.md` current: rule id, function, test.
- An unclear rule goes to `OPEN-QUESTIONS.md` with a proposed reading behind a config flag.
  Never change a rule.

## Data, not code

Every number from the rules lives in `packages/content` (`config.default.json` and content
JSON), validated by Zod at load time.

## Tests

- Unit: `*.test.ts(x)` next to the code.
- Property: `*.property.test.ts` with fast-check.
- Golden replays: `seed + actions[]` files with an expected state hash. A rule change that alters
  a replay updates the file on purpose, with the reason in the commit body.
- E2E: `apps/web/e2e/*.spec.ts` with Playwright against the production build.

## The gate

`pnpm verify` must pass before every commit. No `--no-verify`, no force-push.
