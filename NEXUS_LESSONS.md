# NEXUS_LESSONS

Friction found while adopting nexus into survival-dice-builder
(2026-10-02). Feed to `/lessons-pr` in the nexus repo.

1. **Cloudflare env names.** `deploy-check.mjs` reads `CF_API_TOKEN` / `CF_ACCOUNT_ID`, but wrangler and most users' `.env` use `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`. Patched locally to accept both; the template should too.
2. **Phase 1 means two things.** `prompts/adopt.md` says "Phase 1 ships the nexus overlay itself"; `playbooks/new-project.md` and `templates/plan/phases/phase_1_bootstrap.md` make phase 1 the stack bootstrap. Resolved here as phase 1 = overlay (ticked by the adoption commit), phase 2 = bootstrap. Pick one.
3. **No pnpm preflight.** Nothing checks `pnpm` is on PATH before writing a gate that depends on it. A one-line check in adopt.md (and a corepack hint) would surface it early.
4. **Spec as a folder.** Skills assume a single root `spec.md`. A multi-file `spec/` folder with its own phase specs and acceptance criteria needed a root `spec.md` index and a precedence list in bearings. Worth a documented pattern: "designer-authored phase specs" mapped onto nexus phases.
5. **Non-code phases.** The build-plan template has no shape for research / art-direction / playtest phases (deliverables are docs, acceptance includes human checks). Suggest a `docs` phase type whose human-only checks become `[needs-user-call]` rows instead of blockers.
6. **Cloudflare Pages deploy path.** ci-providers.md doesn't spell out "deploy via GitHub Actions + `wrangler pages deploy --commit-hash`" so the gate's commit-hash match works without the dashboard Git integration.
7. **Worktree sessions.** adopt.md says push to main; when the agent runs in a git worktree on a feature branch, it must fast-forward to origin/main first and push `HEAD:main`. Worth one sentence.
