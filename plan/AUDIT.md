# Site audit

> Latest findings from `/iterate audit`. Rewritten on each audit
> pass. `[needs-user-call]` rows below are durable.

## Needs user call (from adoption, 2026-10-02)

- [needs-user-call] **Set GitHub Actions secrets** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` on `no-trbl-2-u/survival-dice-builder` (same values as `.env`). Phase 2's `deploy.yml` needs them; the loop never sets secrets itself.
- [needs-user-call] **Cloudflare token scope.** Confirm the API token has Account > Cloudflare Pages > Edit. Phase 2 creates the `survival-dice-builder` Pages project with it (default URL `https://survival-dice-builder.pages.dev`; if that name is taken, phase 2 records the actual URL in bearings).
- [needs-user-call] **Local `.env` keys.** Add `DEPLOY_PROVIDER=cloudflare-pages` and `CF_PAGES_PROJECT=survival-dice-builder` to `.env` (both are also defaulted in `scripts/deploy-check.mjs`, so this is optional). Optional: `NOTIFY_NTFY_TOPIC` for the pager before any unattended run.
- [needs-user-call] **Designer reviews (async, never blocking):** tile layouts at `/tiles` (phase 4), the "2 people identify at a glance" check (phase 9), and the playtest sessions themselves (phase 15). The loop ships around them; review via `/oversight`.
- [needs-user-call] **Source of truth sync.** `spec/README.md` says the canonical spec is the Claude design doc (tabs "Spec v1 — Rules", "Build brief", "Build plan"). The loop treats `spec/` in this repo as authoritative; re-export to `spec/` when the doc changes.
