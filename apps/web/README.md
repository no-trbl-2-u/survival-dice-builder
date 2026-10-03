# @survival/web

**Purpose:** the React + Vite web app. It renders the engine's state and offers only the actions
from `legalActions`; it never decides a rule (bearings hard rule 11).

**Public surface:** `/` (phase 2: title + one 7-hex SVG tile). Routes are listed in
`plan/bearings.md`, "URL contract".

**Tests:** `src/**/*.test.{ts,tsx}` (Vitest + Testing Library, jsdom), `e2e/*.spec.ts`
(Playwright against `vite preview` on port 4173). Run `pnpm test:run` and `pnpm e2e` from the
repo root.
