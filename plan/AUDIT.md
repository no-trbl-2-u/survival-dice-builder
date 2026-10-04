# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

# Site audit — 2026-10-03 (pass 2, from critique pass 3)

## Top 5 findings (scored)

### [x] [6.3] /play: Skills, draft options, and Shop offers never say what they do (critique HIGH)
- category: external-critique (comprehension)
- impact: 9
- ease: 7
- next: one effect-text function per effect kind (Skill, Prepare, Combat), shown under each Skill, in each draft option, and on each Shop offer
- issue: #23
- fixed: 4206ea0

### [x] [4.2] /play: log and labels use enemy ids, capitalise grunt and elite, and slip on grammar (critique MED)
- category: external-critique (voice)
- impact: 6
- ease: 7
- next: lowercase kinds and place names in describeEvent and describeAction, "an elite", "1 upgrade", "3 hexes"
- issue: #24
- fixed: 6828627

### [x] [3.6] /debug: the event log prints [object Object]; stray glyph letters in State (critique LOW)
- category: external-critique (comprehension)
- impact: 4
- ease: 9
- next: format {q,r} payloads in EventLog; aria-hidden on the map glyph text
- issue: #25
- fixed: 6546545

### [x] [3.0] /play: at 375px the controls for the current step sit far below the map (critique MED)
- category: external-critique (mobile)
- impact: 6
- ease: 5
- next: order the active panel under the round header at narrow widths; larger map labels
- issue: #26
- fixed: a46ca82

### [ ] [2.5] /config: raw schema errors, unsaved edits lost, Reset unconfirmed (critique MED)
- category: external-critique (a11y)
- impact: 5
- ease: 5
- next: covered by the /config candidate in PHASE_CANDIDATES.md (expand pass 2); wait for oversight

The /config labels row (critique MED, impact 6, ease 3, score 1.8) is
outside the top 5 and is the core of that candidate.

## Needs user call (from adoption, 2026-10-02)

- [needs-user-call] **Set `CLAUDE_CODE_OAUTH_TOKEN`** as a GitHub Actions secret on `no-trbl-2-u/survival-dice-builder` (oversight 2026-10-02). The cloud `/march` cron in `.github/workflows/march.yml` is live (every 2h, off-peak) and every run fails until the secret exists. The loop never sets secrets itself. Oversight 2026-10-03: the user will set it; keep the workflow as is.
- [needs-user-call] **Local `.env` keys.** Add `DEPLOY_PROVIDER=cloudflare-pages` and `CF_PAGES_PROJECT=survival-dice-builder` to `.env` (both are also defaulted in `scripts/deploy-check.mjs`, so this is optional). Optional: `NOTIFY_NTFY_TOPIC` for the pager before any unattended run.
- [needs-user-call] **Designer reviews (async, never blocking):** tile layouts at `/tiles` (phase 4; best reviewed before phase 7), the bot batch distribution (phase 9), the "2 people identify at a glance" check (phase 10), and the playtest sessions themselves (phase 16). The loop ships around them; review via `/oversight`. Every open reading and check is listed at `/decisions` (also `docs/DECISIONS.md`).
- [needs-user-call] **Review the 9 proposed tiles** at https://survival-dice-builder.pages.dev/tiles (phase 4, 2026-10-03). Layouts live in `packages/content/data/tiles.json`; record changes in `OPEN-QUESTIONS.md`. Best before phase 7, whose full-run golden replay locks the layouts in.
- [needs-user-call] **Bot batch distribution (phase 9, 2026-10-03).** 200 default-config bot runs: median end round 14 (band 8-14, top edge), middle half 10-17, no run before round 9 (first wave), 0 runs reached level 5. Inside the band, so nothing is filed against the rules; review `docs/reports/phase-9-bot-batch.md` when convenient.
- [needs-user-call] **Art direction glance check (phase 10, 2026-10-03).** Show `design/mockups/main-screen.svg` (or the live UI after phase 11) to 2 people: can each name card orientation, enemy type, and health at a glance? Record the answers; fixes go into `design/ART-GUIDE.md`. Not blocking.
- [needs-user-call] **Source of truth sync.** `spec/README.md` says the canonical spec is the Claude design doc (tabs "Spec v1 — Rules", "Build brief", "Build plan"). The loop treats `spec/` in this repo as authoritative; re-export to `spec/` when the doc changes.
- [needs-user-call] **Visual polish feel check (phase 15, 2026-10-03).** On a mid-range laptop, open `/play`, turn on "3D dice", and play a few exchanges. Check that the frame rate feels smooth (headless Chromium: about 17 ms per frame, the canvas's `data-frame-ms`). Check that the synthesized sounds are pleasant at their low volume. Recorded sounds (Kenney CC0 packs, still `candidate` in `ASSETS.md`) are a later swap if wanted. Not blocking.
- [needs-user-call] **Spec v2 design work (2026-10-04).** The core loop is settled in `docs/design/core-loop-v2.md`; fold it into `spec/`. Still to design: the new tiles (row 57), knockout values (row 55), the elite structure-damage rule (row 7), per-card heal targets (row 12), the real Skills with upgraded tiers (rows 9, 46, 50), Build versus Repair levels (rows 30, 49), the milestone set (row 4), and later scenarios (row 58). The experience curve waits on the phase 22 report (row 17). Each is listed at `/decisions`.
- [needs-user-call] **Run the playtests (phase 16, 2026-10-03).** The kit is ready in `docs/playtests/`: `PROTOCOL.md` (one-page script), `SURVEY.md`, and the `REPORT.md` template. Target: 5 solo runs and 3 co-op sessions. Drop each run file into `docs/playtests/runs/`, then run `pnpm sim -- playtests`. The filled report feeds Spec v2 and the scenarios decision (rules section 19). The loop cannot playtest.
