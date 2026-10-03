# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

## Needs user call (from adoption, 2026-10-02)

- [needs-user-call] **Set `CLAUDE_CODE_OAUTH_TOKEN`** as a GitHub Actions secret on `no-trbl-2-u/survival-dice-builder` (oversight 2026-10-02). The cloud `/march` cron in `.github/workflows/march.yml` is live (every 2h, off-peak) and every run fails until the secret exists. The loop never sets secrets itself.
- [needs-user-call] **Local `.env` keys.** Add `DEPLOY_PROVIDER=cloudflare-pages` and `CF_PAGES_PROJECT=survival-dice-builder` to `.env` (both are also defaulted in `scripts/deploy-check.mjs`, so this is optional). Optional: `NOTIFY_NTFY_TOPIC` for the pager before any unattended run.
- [needs-user-call] **Designer reviews (async, never blocking):** tile layouts at `/tiles` (phase 4; best reviewed before phase 7), the bot batch distribution (phase 9), the "2 people identify at a glance" check (phase 10), and the playtest sessions themselves (phase 16). The loop ships around them; review via `/oversight`.
- [needs-user-call] **Source of truth sync.** `spec/README.md` says the canonical spec is the Claude design doc (tabs "Spec v1 — Rules", "Build brief", "Build plan"). The loop treats `spec/` in this repo as authoritative; re-export to `spec/` when the doc changes.
