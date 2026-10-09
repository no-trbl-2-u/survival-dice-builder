# agents.md

> The entry point for any AI agent landing in this repo cold
> (Claude Code, Cursor, Aider, anything else). Read this top to
> bottom; it's short, and the rules at the top are non-negotiable.

## Standing rules

These apply to every command, every skill, every session. They
are not optional. The skill files repeat them; this is the
canonical source.

### 1. Commit and push. Always. As a single atomic act.

Shipped work that isn't committed is rolled-back work waiting to
happen. Shipped work that's committed but not pushed is invisible
to Cloudflare Pages and to future loop ticks. The autonomous
loop assumes `origin/main` is the source of truth.

Every shipping skill ends with `git commit` **immediately followed
by** `git push origin main`. Don't leave commits
unpushed between ticks. Don't leave the working tree dirty.

### 2. No `Co-Authored-By:` trailers. No emojis.

Plain commit message bodies. **Never** add a `Co-Authored-By:`
line, a "Generated with…" footer, or any emoji — in commits,
in code, in content, in design notes.

**One carve-out:** commits shipped from the cloud loop
(`.github/workflows/march.yml`) MUST end with a single
trailer: `Cloud-Run: <run-url>`. The cloud ceiling check
uses this trailer to distinguish cloud-shipped commits
from local work. Nothing else is allowed in the footer.
See `.github/CLOUD_LOOP.md` for the full convention.

### 3. The verify gate is non-negotiable.

`pnpm verify` runs **before** every commit:

```
lint → typecheck → test:run → build → e2e
```

The canonical composition, with two variance rules: `data:validate`
runs iff the project has a data layer (GitHub-as-DB, DB
migrations, etc.) — drop the leg otherwise; `lint` is an
optional leg, wired into `verify` or left as a standalone
script, per stack. See `nexus/customization/verify-gate.md` for
stack-specific compositions.

Every check is a hard gate. **Hermetic e2e is part of the gate.**
A red e2e is a blocked push. Never `--no-verify`. Fix the root
cause.

**Never run the gate in the background.** Run every leg as a
foreground, blocking call and wait for it. `run_in_background:
true` on the gate (or any leg) is forbidden — in a
non-interactive run (cloud `/march`) the agent SDK ends the turn
while the gate is still alive, the background-task resume
notification is unreliable, and the process cannot exit because
the gate's children (dev server, headless browser, DB
containers) keep the tree alive. That is the cloud post-result
exit hang. If the gate has outgrown a single foreground budget,
**shrink the gate, do not background it** — split it into
sequential foreground legs and move any O(content) breadth
(per-record crawls) off the per-commit path onto a nightly job.
A page template is not more correct for being rendered 2,700
times instead of 30; prove archetypes per commit, prove the
exhaustive set nightly.

### 4. The deploy gate runs **after** every push.

`pnpm deploy:check` polls Cloudflare Pages for the deploy
matching the just-pushed commit. Prints state transitions. Exits
non-zero on `error` / `failed` / timeout.

Every shipping skill calls it as Step 12 (or equivalent). A red
deploy is treated identically to a red verify gate: read the log,
patch, push again. Repeated failures escalate per failure modes.

### 5. No `--no-verify`. No force-push. No destructive resets.

If a hook fails, fix the underlying issue. If `git pull`
diverges, stop and report. Tests alongside code, never "add tests
later".

### 6. The rules win. Never change a rule.

`spec/01-spec-v1-rules.md` (Spec v1) beats every other file,
including this one. If a rule is unclear, add it to
`OPEN-QUESTIONS.md` with the rule id and a proposed reading,
implement the proposed reading behind a config flag, and
continue. Every rule maps to at least one test, tracked in
`RULES-COVERAGE.md` (rule id -> function -> test).

The engine is a functional core: pure functions over plain
data. No classes, no mutation of inputs, no I/O, no `Date` or
`Math.random` inside `packages/engine`. Every exported type and
function has TSDoc naming its rule section (`@rule 7.8`). The
UI never decides a rule; it only calls the engine API.

### 7. Rule numbers and content stay in `packages/content/`.

Every number from the rules lives in
`packages/content/config.default.json` or the content JSON,
validated by Zod. No hardcoded numbers in the engine, no
hardcoded copy or records in components.

### 8. Blocked is loud.

Before stopping on any failure-mode condition, run
`node scripts/notify.mjs --title "<skill>: stopped"
--body "<reason>" --priority high` (best-effort — a failed
notification never becomes its own stop). Applies to every
skill; see `nexus/playbooks/hands-off.md`.

---

## Project

**Survival Dice-Builder** — a 1–4 player co-op survival dice-builder prototype: defend the central base, push your luck with dice, last as many rounds as you can. Lives at https://survival-dice-builder.pages.dev.

The product spec is the `spec/` folder; `spec.md` at the repo
root is its index and reading order. Read it once.

## Repo shape

```
spec/                Spec v1 rules, build brief, per-phase specs (source of truth).
packages/content/    JSON content + Zod schemas + config.default.json.
packages/engine/     Pure rules engine (no DOM).
packages/bot/        Autoplay bot for tests and batch runs.
apps/web/            React + Vite web app (SVG hex map).
tools/sim/           Node CLI: batch runs, tuning reports.
assets/              License-checked assets (register in ASSETS.md).
plan/                Build plan, phase briefs, audit findings.
skills/              Source-of-truth skill files invoked by slash commands.
.claude/             Claude Code config — slash commands, sub-agents,
                     settings.json (permission allowlist), hooks/ (guard).
design/              Design exports (ART-GUIDE.md, templates, mock-ups).
```

## How work happens

This project is **driven autonomously** by a small set of skills.
You don't normally write code by manually editing files; you
invoke a skill that does the right thing end-to-end.

### Skills (the verbs)

| Skill | Source of truth | What it does |
|---|---|---|
| `ship-a-phase` | `skills/ship-a-phase.md` | Ship one phase from the build plan. |
| `plan-a-phase` | `skills/plan-a-phase.md` | Refine the next phase brief, no code. |
| `iterate` | `skills/iterate.md` | Audit + ship one improvement. |
| `critique` | `skills/critique.md` | External-observer pass; writes to `CRITIQUE.md`. |
| `triage` | `skills/triage.md` | Issue review; routes to backlogs. |
| `expand` | `skills/expand.md` | Plan-expansion pass; proposes phase candidates from accumulated signals. Posture-controlled (bold/strict/autonomous). |
| `march` | `skills/march.md` | Outer dispatcher: triage → critique → phase → expand → iterate. |
| `oversight` | `skills/oversight.md` | **User-in-the-loop.** The only skill that asks the user anything. Promotes phase candidates. |
| `jot` | `skills/jot.md` | User quickfire → one row in `CRITIQUE.md`, seconds flat. |

### Invocation

```
/ship-a-phase                # ship next pending phase
/plan-a-phase                # refine next phase brief
/iterate                     # audit + ship one improvement
/critique                    # external-observer pass
/triage                      # review unlabeled issues
/expand                      # propose new phase candidates
/march                       # do the right thing
/oversight                   # course-correct
/jot                         # quickfire a note to CRITIQUE.md
/loop 30m /march             # autonomous loop
```

### Sub-agents

| Agent | Use for |
|---|---|
| `scout` | Open-web research with citations. |
| `reader` | Fresh-eyes site observer. |
| `rules-lawyer` | Checks code and tests against Spec v1; audits `RULES-COVERAGE.md`. |
| `asset-clerk` | License-checks assets and keeps `ASSETS.md` honest. |

The main agent writes wiring, code, decisions. Spawn sub-agents
aggressively for everything else.

---

## Operational secrets

The autonomous loop is hermetic for shipping; the awareness layer
needs tokens. Both live in `.env` (gitignored). Configure once
per machine. The scripts read `.env` through `scripts/load-env.mjs`:
the current directory's first, then the main checkout's, so a git
worktree (which has no `.env` of its own) uses the main one.

### `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` — deploy gate

Used by `pnpm deploy:check` to read Cloudflare Pages deploy
state, and by `.github/workflows/deploy.yml` (as repo secrets)
to publish. The `CF_*` spellings are accepted too.

```
DEPLOY_PROVIDER=cloudflare-pages
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
CF_PAGES_PROJECT=survival-dice-builder
```

Get one: https://dash.cloudflare.com/profile/api-tokens
(permission: Account > Cloudflare Pages > Edit).

If missing, `pnpm deploy:check` exits 3 with a clear error.

### `GH_TOKEN` — issue triage

Used by `/triage` to review and label open GitHub issues. The
`gh` CLI auto-reads `GH_TOKEN`.

```
GH_TOKEN=github_pat_...
GH_REPO=no-trbl-2-u/survival-dice-builder
```

Get one: https://github.com/settings/tokens

### `NOTIFY_NTFY_TOPIC` / `NOTIFY_WEBHOOK_URL` — pager (optional)

Used by `scripts/notify.mjs` (standing rule 8). Either works;
ntfy is the zero-setup path. Optional at Level 0–2; required
before an unattended window per the hands-off pre-flight.

### No other secrets

If a feature ever requires more, the relevant skill stops at its
failure-mode condition rather than inventing a placeholder.

---

## Where to look

| If you need… | Read |
|---|---|
| What Survival Dice-Builder is | `spec.md` |
| Stack, conventions, defaults | `plan/bearings.md` |
| What ships next | `plan/steps/01_build_plan.md` |
| How a phase is built | `plan/phases/phase_<N>_<topic>.md` |
| How a skill works | `skills/<skill>.md` |
| What a sub-agent does | `.claude/agents/<name>.md` |
| Latest weaknesses | `plan/AUDIT.md` |
| The rules | `spec/01-spec-v1-rules.md` |
| Rule -> test map | `RULES-COVERAGE.md` |
| Unclear rules | `OPEN-QUESTIONS.md` |
| Critique queue | `plan/CRITIQUE.md` |
