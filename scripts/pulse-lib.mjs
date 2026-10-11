// scripts/pulse-lib.mjs — pure parsers behind scripts/pulse.mjs.
//
// No I/O here: every function takes text or plain data and returns
// plain data, so scripts/__tests__/pulse-lib.test.mjs can pin them.

/** Weights the cloud ceiling uses (`.github/workflows/march.yml`). */
export const CLOUD_WEIGHTS = { phase: 3, churn: 1 }

/** The ceiling `march.yml` ships with when its `ceiling=` line is missing. */
export const DEFAULT_CEILING = 12

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * The value of a `> Key: value` header line, or null.
 * @param {string} text
 * @param {string} key
 */
export function header(text, key) {
  const re = new RegExp(`^> ${key}:\\s*(.+)$`, 'm')
  const m = text.match(re)
  return m ? m[1].trim() : null
}

/**
 * The leading `YYYY-MM-DD` of a header value as an ISO instant (UTC
 * midnight), or null. "2026-10-10 at commit 8402ba3" -> "2026-10-10T00:00:00Z".
 * @param {string | null} value
 */
export function headerDate(value) {
  if (!value) return null
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})\b/)
  if (!m) return null
  const iso = `${m[1]}-${m[2]}-${m[3]}T00:00:00Z`
  return Number.isNaN(new Date(iso).getTime()) ? null : iso
}

/**
 * The commit sha in a header value ("2026-10-10 at commit 8402ba3"), or null.
 * @param {string | null} value
 */
export function headerCommit(value) {
  const m = value?.match(/\bat commit ([0-9a-f]{7,40})\b/)
  return m ? m[1] : null
}

/**
 * Lines under `## Pending` up to the next `## ` heading.
 * @param {string} text
 */
export function pendingSection(text) {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex((l) => /^## Pending\s*$/.test(l))
  if (start === -1) return []
  const rest = lines.slice(start + 1)
  const end = rest.findIndex((l) => /^## /.test(l))
  return end === -1 ? rest : rest.slice(0, end)
}

/** @param {string[]} section */
export function countRows(section) {
  return section.filter((l) => /^### /.test(l)).length
}

/**
 * Open rows in `plan/AUDIT.md`: the `### [ ]` rows of the latest pass
 * (the first `# Site audit — ` block) plus every `[needs-user-call]` row.
 * @param {string} text
 * @returns {{ open: number, userCalls: number }}
 */
export function auditPending(text) {
  const lines = text.split(/\r?\n/)
  const passStarts = lines.flatMap((l, i) => (/^# Site audit — /.test(l) ? [i] : []))
  let open = 0
  if (passStarts.length > 0) {
    const end = passStarts[1] ?? lines.length
    const block = lines.slice(passStarts[0], end)
    const cut = block.findIndex((l, i) => i > 0 && /^## (?!Top )/.test(l))
    open = (cut === -1 ? block : block.slice(0, cut)).filter((l) => /^### \[ \]/.test(l)).length
  }
  const userCalls = lines.filter((l) => /^- \[needs-user-call\]/.test(l)).length
  return { open, userCalls }
}

/**
 * The `ceiling=N` value from the march workflow text.
 * @param {string | null} workflow
 */
export function ceilingFromWorkflow(workflow) {
  const m = workflow?.match(/^\s*ceiling=(\d+)\s*$/m)
  return m ? Number(m[1]) : DEFAULT_CEILING
}

/**
 * Weighted cloud budget over the 24 h before `now`, as march.yml counts it.
 * @param {{ time: string, phase: boolean }[]} commits cloud commits (Cloud-Run trailer)
 * @param {string} now ISO instant
 * @param {number} ceiling
 * @returns {{ budget: number, ceiling: number, skipping: boolean, freesAt: string | null }}
 */
export function cloudBudget(commits, now, ceiling) {
  const nowMs = new Date(now).getTime()
  const inWindow = commits
    .map((c) => ({ ms: new Date(c.time).getTime(), cost: c.phase ? CLOUD_WEIGHTS.phase : CLOUD_WEIGHTS.churn }))
    .filter((c) => c.ms > nowMs - DAY_MS && c.ms <= nowMs)
    .sort((a, b) => a.ms - b.ms)
  const budget = inWindow.reduce((sum, c) => sum + c.cost, 0)
  const skipping = budget >= ceiling
  let freesAt = null
  if (skipping) {
    // Drop the oldest commits until the budget is under the ceiling.
    let left = budget
    for (const c of inWindow) {
      left -= c.cost
      if (left < ceiling) {
        freesAt = new Date(c.ms + DAY_MS).toISOString()
        break
      }
    }
  }
  return { budget, ceiling, skipping, freesAt }
}

/**
 * "5h ago" / "3d ago" between two instants, or null when `iso` is null.
 * @param {string | null} iso
 * @param {number} nowMs
 */
export function ago(iso, nowMs) {
  if (!iso) return null
  const hours = (nowMs - new Date(iso).getTime()) / (1000 * 60 * 60)
  if (Number.isNaN(hours)) return null
  if (hours < 48) return `${Math.round(hours)}h ago`
  return `${Math.round(hours / 24)}d ago`
}
