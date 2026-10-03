# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

# Site audit — 2026-10-03

## Top 5 findings (scored)

### [x] [4.5] /credits: 18 links all named "Source"; licence stated twice (critique MED)
- category: external-critique (a11y)
- impact: 5
- ease: 9
- issue: #20
- fixed: 2d542b8

### [x] [4.9] /play: the log shows card ids, rule numbers, and "1 actions" (critique MED)
- category: external-critique (voice)
- impact: 7
- ease: 7
- issue: #18
- fixed: 77c6b73

### [x] [8.1] /: the home page does not say what the game is or where to start (critique HIGH)
- category: external-critique (comprehension)
- impact: 9
- ease: 9
- issue: #17
- fixed: c97d007

### [x] [7.2] /tiles: terrain and site per hex only show on hover (critique HIGH)
- category: external-critique (a11y)
- impact: 9
- ease: 8
- issue: #16
- fixed: 08a5708
- next: list each tile's 7 hexes as text under the tile; reword the lede

### [x] [4.8] /tiles: no legend for the 4 site icons (critique MED)
- category: external-critique (comprehension)
- impact: 6
- ease: 8
- next: add a "Sites" legend row with each icon and name
- issue: #19
- fixed: c3497c8

### [x] [4.2] /debug: keyboard focus is lost after every action (critique MED)
- category: external-critique (a11y)
- impact: 6
- ease: 7
- next: reuse the /play focus-next-decision effect
- issue: #21 (phase 17)
- fixed: c5a664b

### [x] [3.5] /debug: no explanation; shorthand and grammar slips (critique MED)
- category: external-critique (voice)
- impact: 5
- ease: 7
- next: a short intro paragraph and plain labels
- issue: #21 (phase 17)
- fixed: c5a664b

### [x] [3.0] /tiles: dark-mode terrain colours are hard to tell apart (critique MED)
- category: external-critique (visual)
- impact: 5
- ease: 6
- next: retune dark terrain tokens in design/tokens.json; check-design re-verifies contrast
- issue: #21 (phase 17)
- fixed: c5a664b

## Needs user call (from adoption, 2026-10-02)

- [needs-user-call] **Set `CLAUDE_CODE_OAUTH_TOKEN`** as a GitHub Actions secret on `no-trbl-2-u/survival-dice-builder` (oversight 2026-10-02). The cloud `/march` cron in `.github/workflows/march.yml` is live (every 2h, off-peak) and every run fails until the secret exists. The loop never sets secrets itself. Oversight 2026-10-03: the user will set it; keep the workflow as is.
- [needs-user-call] **Local `.env` keys.** Add `DEPLOY_PROVIDER=cloudflare-pages` and `CF_PAGES_PROJECT=survival-dice-builder` to `.env` (both are also defaulted in `scripts/deploy-check.mjs`, so this is optional). Optional: `NOTIFY_NTFY_TOPIC` for the pager before any unattended run.
- [needs-user-call] **Designer reviews (async, never blocking):** tile layouts at `/tiles` (phase 4; best reviewed before phase 7), the bot batch distribution (phase 9), the "2 people identify at a glance" check (phase 10), and the playtest sessions themselves (phase 16). The loop ships around them; review via `/oversight`.
- [needs-user-call] **Review the 9 proposed tiles** at https://survival-dice-builder.pages.dev/tiles (phase 4, 2026-10-03). Layouts live in `packages/content/data/tiles.json`; record changes in `OPEN-QUESTIONS.md`. Best before phase 7, whose full-run golden replay locks the layouts in.
- [needs-user-call] **Phase 4 proposed readings** (`OPEN-QUESTIONS.md` rows 16-21): base hex exempt from rule 3.8, XP step reading, 1 copy per supply card, 8/10-card starter decks, Gather bonus, elite spawn refill. Each is a config value; confirm or change.
- [needs-user-call] **Bot batch distribution (phase 9, 2026-10-03).** 200 default-config bot runs: median end round 14 (band 8-14, top edge), middle half 10-17, no run before round 9 (first wave), 0 runs reached level 5. Inside the band, so nothing is filed against the rules; review `docs/reports/phase-9-bot-batch.md` when convenient.
- [needs-user-call] **Art direction glance check (phase 10, 2026-10-03).** Show `design/mockups/main-screen.svg` (or the live UI after phase 11) to 2 people: can each name card orientation, enemy type, and health at a glance? Record the answers; fixes go into `design/ART-GUIDE.md`. Not blocking.
- [needs-user-call] **Source of truth sync.** `spec/README.md` says the canonical spec is the Claude design doc (tabs "Spec v1 — Rules", "Build brief", "Build plan"). The loop treats `spec/` in this repo as authoritative; re-export to `spec/` when the doc changes.
- [needs-user-call] **Visual polish feel check (phase 15, 2026-10-03).** On a mid-range laptop, open `/play`, turn on "3D dice", and play a few exchanges. Check that the frame rate feels smooth (headless Chromium: about 17 ms per frame, the canvas's `data-frame-ms`). Check that the synthesized sounds are pleasant at their low volume. Recorded sounds (Kenney CC0 packs, still `candidate` in `ASSETS.md`) are a later swap if wanted. Not blocking.
- [needs-user-call] **Run the playtests (phase 16, 2026-10-03).** The kit is ready in `docs/playtests/`: `PROTOCOL.md` (one-page script), `SURVEY.md`, and the `REPORT.md` template. Target: 5 solo runs and 3 co-op sessions. Drop each run file into `docs/playtests/runs/`, then run `pnpm sim -- playtests`. The filled report feeds Spec v2 and the scenarios decision (rules section 19). The loop cannot playtest.
