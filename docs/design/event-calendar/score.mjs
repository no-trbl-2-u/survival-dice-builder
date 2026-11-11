// Scores 1-5 per criterion. Escalation, good days and variance are derived from model.json; the rest are design judgements (stated).
import fs from 'node:fs'
const m = JSON.parse(fs.readFileSync('model.json', 'utf8'))
const W = {
  escalation: 2,
  goodDays: 1.5,
  milestones: 1,
  upkeep: 1.5,
  table: 1,
  variety: 1,
  coop: 0.5,
  engine: 1,
}
const judged = {
  // milestones, upkeep, table, coop, engine
  sundial: [1, 5, 5, 2, 5],
  omen: [2, 4, 5, 3, 4],
  dice: [4, 4, 5, 4, 4],
  moon: [1, 5, 5, 3, 5],
  crossroads: [2, 2, 4, 4, 2],
  notoriety: [5, 4, 4, 3, 3],
  bag: [4, 3, 4, 3, 3],
  weather: [1, 2, 3, 3, 2],
  tribute: [1, 2, 4, 3, 2],
  herald: [4, 4, 5, 3, 3],
}
const clamp = (x) => Math.max(1, Math.min(5, Math.round(x)))
const rows = Object.entries(judged)
  .map(([id, [milestones, upkeep, table, coop, engine]]) => {
    const s = m[id]
    const ratio = s.late / s.early // rounds 19-24 over rounds 1-6
    let escalation = clamp(1 + (ratio - 1) * 2.5)
    if (s.r30 / s.late > 1.6) escalation = Math.min(escalation, 3) // runaway past round 24
    const goodDays = clamp(1 + s.goodDayShare12 * 5)
    const variety = clamp(1 + s.spread12 / 8)
    const sc = { escalation, goodDays, milestones, upkeep, table, variety, coop, engine }
    const total = Object.entries(W).reduce((t, [k, w]) => t + w * sc[k], 0)
    return { id, name: s.name, ...sc, total: +total.toFixed(1), ratio: +ratio.toFixed(2) }
  })
  .sort((a, b) => b.total - a.total)
console.log(JSON.stringify(rows))
