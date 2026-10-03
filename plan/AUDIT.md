# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

## Needs user call (from adoption, 2026-10-02)

- [needs-user-call] **Set `CLAUDE_CODE_OAUTH_TOKEN`** as a GitHub Actions secret on `no-trbl-2-u/survival-dice-builder` (oversight 2026-10-02). The cloud `/march` cron in `.github/workflows/march.yml` is live (every 2h, off-peak) and every run fails until the secret exists. The loop never sets secrets itself.
- [needs-user-call] **Local `.env` keys.** Add `DEPLOY_PROVIDER=cloudflare-pages` and `CF_PAGES_PROJECT=survival-dice-builder` to `.env` (both are also defaulted in `scripts/deploy-check.mjs`, so this is optional). Optional: `NOTIFY_NTFY_TOPIC` for the pager before any unattended run.
- [needs-user-call] **Designer reviews (async, never blocking):** tile layouts at `/tiles` (phase 4; best reviewed before phase 7), the bot batch distribution (phase 9), the "2 people identify at a glance" check (phase 10), and the playtest sessions themselves (phase 16). The loop ships around them; review via `/oversight`.
- [needs-user-call] **Review the 9 proposed tiles** at https://survival-dice-builder.pages.dev/tiles (phase 4, 2026-10-03). Layouts live in `packages/content/data/tiles.json`; record changes in `OPEN-QUESTIONS.md`. Best before phase 7, whose full-run golden replay locks the layouts in.
- [needs-user-call] **Phase 4 proposed readings** (`OPEN-QUESTIONS.md` rows 16-21): base hex exempt from rule 3.8, XP step reading, 1 copy per supply card, 8/10-card starter decks, Gather bonus, elite spawn refill. Each is a config value; confirm or change.
- [needs-user-call] **Bot batch distribution (phase 9, 2026-10-03).** 200 default-config bot runs: median end round 14 (band 8-14, top edge), middle half 10-17, no run before round 9 (first wave), 0 runs reached level 5. Inside the band, so nothing is filed against the rules; review `docs/reports/phase-9-bot-batch.md` when convenient.
- [needs-user-call] **Art direction glance check (phase 10, 2026-10-03).** Show `design/mockups/main-screen.svg` (or the live UI after phase 11) to 2 people: can each name card orientation, enemy type, and health at a glance? Record the answers; fixes go into `design/ART-GUIDE.md`. Not blocking.
- [needs-user-call] **Source of truth sync.** `spec/README.md` says the canonical spec is the Claude design doc (tabs "Spec v1 — Rules", "Build brief", "Build plan"). The loop treats `spec/` in this repo as authoritative; re-export to `spec/` when the doc changes.
- [needs-user-call] **Visual polish feel check (phase 15, 2026-10-03).** On a mid-range laptop, open `/play`, turn on "3D dice", and play a few exchanges. Check that the frame rate feels smooth (headless Chromium: about 17 ms per frame, the canvas's `data-frame-ms`). Check that the synthesized sounds are pleasant at their low volume. Recorded sounds (Kenney CC0 packs, still `candidate` in `ASSETS.md`) are a later swap if wanted. Not blocking.
