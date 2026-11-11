// Event Calendar model: 10 systems as pure functions. Each system maps (round, rng, memory) to a Day:
// { gpn: grunts per grunt node, elites: extra elites placed, elitePerNode: elites per elite node, boon: boon points, calm: bool }
// Reference board (assumption, confidence 40): 6 active grunt nodes, 1 active elite node.
// Threat in enemy health spawned per round: grunt 2, elite 14 (Spec v2 Table 5).
// Baseline (Spec v2 7.3): every grunt node 1 grunt, every elite node 1 elite, no boons.
const G = 6,
  E = 1,
  HG = 2,
  HE = 14
const R = 30,
  RUNS = 4000
const mulberry = (s) => () => {
  s = (s + 0x6d2b79f5) >>> 0
  let t = s
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const shuffle = (rnd, a) => {
  const o = [...a]
  for (let i = o.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[o[i], o[j]] = [o[j], o[i]]
  }
  return o
}
const day = (gpn, epn = 1, elites = 0, boon = 0) => ({ gpn, epn, elites, boon })
// Assumed milestone rounds for systems that read them (confidence 35): survive 5, level 3 ~ r4, upgrade x3 ~ r8, survive 10.
const MILESTONE_ROUNDS = [4, 5, 8, 10, 15]

const systems = {
  baseline: { name: 'Spec v2 today', make: () => () => day(1) },
  sundial: {
    name: 'Sundial and Eras',
    make: () => (r) => {
      const era = Math.floor((r - 1) / 8),
        slot = (r - 1) % 8
      const n = 1 + era
      return [
        day(0, 0, 0, 1),
        day(n),
        day(n),
        day(n, 1, 0, 1),
        day(n),
        day(n, 1, 0, 1),
        day(n, 1, 1 + era),
        day(n),
      ][slot]
    },
  },
  omen: {
    name: 'Omen Deck',
    make: (rnd) => {
      const cards = {
        calm: day(0, 0, 0, 1),
        raid: day(1),
        surge: day(2),
        boon: day(1, 1, 0, 1),
        eraid: day(1, 1, 1),
        doom: day(2, 1, 1),
        boon2: day(0, 1, 0, 2),
      }
      let deck = shuffle(rnd, [
          'calm',
          'raid',
          'raid',
          'raid',
          'raid',
          'surge',
          'surge',
          'boon',
          'boon',
          'eraid',
        ]),
        discard = []
      return () => {
        if (!deck.length) {
          const pool = [...discard, 'doom', 'doom']
          const cut = pool.indexOf('calm') >= 0 ? pool.indexOf('calm') : pool.indexOf('boon')
          if (cut >= 0) pool.splice(cut, 1)
          deck = shuffle(rnd, pool)
          discard = []
        }
        const c = deck.pop()
        discard.push(c)
        return cards[c]
      }
    },
  },
  dice: {
    name: 'Threat Dice',
    make: (rnd) => (r) => {
      const n = 1 + Math.floor((r - 1) / 3)
      const blessed = MILESTONE_ROUNDS.filter((m) => m < r).length // one die per past milestone shows Boon permanently? no: this round only when a milestone just hit
      const justHit = MILESTONE_ROUNDS.includes(r - 1) ? 1 : 0
      let raid = 0,
        el = 0,
        boon = justHit
      for (let i = 0; i < n - justHit; i++) {
        const f = Math.floor(rnd() * 6)
        if (f >= 1 && f <= 3) raid++
        else if (f === 4) el++
        else if (f === 5) boon++
      }
      void blessed
      return day(raid, raid > 0 ? 1 : 0, el, boon)
    },
  },
  moon: {
    name: 'Moon Wheel',
    make: () => (r) => {
      const cycle = Math.floor((r - 1) / 6),
        p = (r - 1) % 6,
        b = cycle
      return [
        day(0, 0, 0, 1),
        day(1 + b),
        day(1 + b),
        day(2 + b),
        day(2 + b, 1, 1),
        day(1 + b, 1, 0, 1),
      ][p]
    },
  },
  crossroads: {
    name: 'Crossroads',
    make: (rnd) => {
      // Each card: [threatNow gpn, boon]. Players pick lower threat; the other goes to the Grudge pile. 3 grudge cards resolve together.
      const deck0 = [
        [0, 0],
        [1, 1],
        [1, 0],
        [2, 2],
        [1, 1],
        [2, 1],
        [0, 1],
        [3, 3],
        [1, 2],
        [2, 0],
      ]
      let deck = shuffle(rnd, deck0),
        grudge = []
      return (r) => {
        if (deck.length < 2)
          deck = shuffle(
            rnd,
            deck0.map(([t, b]) => [t + Math.floor(r / 8), b]),
          )
        const a = deck.pop(),
          c = deck.pop()
        const [pick, left] = a[0] - a[1] <= c[0] - c[1] ? [a, c] : [c, a]
        grudge.push(left)
        let gpn = pick[0],
          extra = 0
        if (grudge.length >= 3) {
          extra = grudge.reduce((s, g) => s + g[0], 0)
          grudge = []
        }
        return { gpn: gpn + Math.floor(r / 8), epn: 1, elites: Math.ceil(extra / 3), boon: pick[1] }
      }
    },
  },
  notoriety: {
    name: 'Notoriety Ladder',
    make: () => (r) => {
      const rung = Math.floor((r - 1) / 3) + MILESTONE_ROUNDS.filter((m) => m < r).length
      const reached =
        Math.floor((r - 2) / 3) + MILESTONE_ROUNDS.filter((m) => m < r - 1).length < rung
      const gpn = 1 + Math.floor(rung / 3)
      return day(gpn, 1, rung % 3 === 2 && reached ? 1 : 0, reached ? 1 : 0)
    },
  },
  bag: {
    name: 'Warband Bag',
    make: (rnd) => {
      const bag = { grunt: 6, calm: 3, boon: 1, elite: 0, brute: 0 }
      return (r) => {
        if (r > 1) {
          bag.grunt += 1
          if ((r - 1) % 3 === 0) bag.elite += 1
          if ((r - 1) % 4 === 0) bag.brute += 1
        }
        if (MILESTONE_ROUNDS.includes(r - 1)) bag.boon += 1
        const tokens = Object.entries(bag).flatMap(([k, n]) => Array(n).fill(k))
        const draw = shuffle(rnd, tokens).slice(0, G) // one token per grunt node
        let grunts = 0,
          elites = 0,
          boon = 0
        for (const t of draw) {
          if (t === 'grunt') grunts++
          else if (t === 'brute') grunts += 2
          else if (t === 'elite') elites++
          else if (t === 'boon') boon++
        }
        return { gpn: grunts / G, epn: 1, elites, boon: boon ? 1 : 0 }
      }
    },
  },
  weather: {
    name: 'Weather Front',
    make: () => (r) => {
      // Tiles in a ring of 6 around the base (assumption). Storms: 1 + floor((r-1)/4); each storm tile's nodes spawn +1+floor(r/8). Sun tile: 0 spawn, nodes refresh.
      const storms = Math.min(5, 1 + Math.floor((r - 1) / 4)),
        sun = 1
      const per = 1 + Math.floor(r / 8)
      const share = (n) => n / 6
      const gpn = (1 - share(storms) - share(sun)) * 1 + share(storms) * (1 + per)
      return day(Math.max(0, gpn), 1, 0, 1)
    },
  },
  tribute: {
    name: 'Tribute Ledger',
    make: () => (r) => {
      const holiday = r % 5 === 0
      const due = holiday ? 0 : Math.ceil(r / 3)
      const unpaid = Math.max(0, due - 2) // assumption: players can spare 2 materials or currency a round
      return { gpn: 1, epn: 1, elites: 0, boon: holiday ? 2 : 0, extraGrunts: unpaid }
    },
  },
  herald: {
    name: 'Herald Countdown',
    make: (rnd) => {
      let clock = 5,
        herald = 0
      return () => {
        clock--
        if (clock > 0) return day(1, 1, 0, clock === 4 ? 0 : 0)
        herald++
        clock = 5
        const defeated = rnd() < 0.6
        return { gpn: 1, epn: 1, elites: 0, boon: defeated ? 2 : 0, herald: 14 + 6 * (herald - 1) }
      }
    },
  },
}

const threat = (d) =>
  d.gpn * G * HG + d.epn * E * HE + d.elites * HE + (d.extraGrunts ?? 0) * HG + (d.herald ?? 0)
const stats = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))]
  return { mean: +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1), p10: q(0.1), p90: q(0.9) }
}

const out = {}
for (const [id, sys] of Object.entries(systems)) {
  const perRound = Array.from({ length: R }, () => [])
  const boonPerRound = Array.from({ length: R }, () => [])
  let goodDays = 0,
    calmDays = 0
  for (let run = 0; run < RUNS; run++) {
    const rnd = mulberry(1000 + run)
    const next = sys.make(rnd)
    for (let r = 1; r <= R; r++) {
      const d = next(r)
      perRound[r - 1].push(threat(d))
      boonPerRound[r - 1].push(d.boon)
      if (r <= 12) {
        if (d.boon > 0) goodDays++
        if (d.gpn === 0) calmDays++
      }
    }
  }
  const curve = perRound.map(stats)
  const boon = boonPerRound.map((xs) => +(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2))
  const m = (a, b) => curve.slice(a - 1, b).reduce((s, c) => s + c.mean, 0) / (b - a + 1)
  out[id] = {
    name: sys.name,
    curve,
    boon,
    goodDayShare12: +(goodDays / (RUNS * 12)).toFixed(2),
    calmShare12: +(calmDays / (RUNS * 12)).toFixed(2),
    early: +m(1, 6).toFixed(1),
    mid: +m(7, 12).toFixed(1),
    late: +m(19, 24).toFixed(1),
    r30: curve[29].mean,
    boons12: +boon
      .slice(0, 12)
      .reduce((a, b) => a + b, 0)
      .toFixed(1),
    spread12: +(curve.slice(0, 12).reduce((s, c) => s + (c.p90 - c.p10), 0) / 12).toFixed(1),
  }
}
console.log(JSON.stringify(out))
