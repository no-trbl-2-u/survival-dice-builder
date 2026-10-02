/* =====================================================================
   SIMULATION ENGINE
   ---------------------------------------------------------------------
   simulate(params) -> { events, rounds, summary, world }
   - Deterministic: the same params (including seed) give the same run.
   - The run state is private to one simulate() call. Each emitted event
     carries an immutable snapshot of the visible state, so the renderer
     can jump to any event without replaying.
   - Bot players use simple, readable heuristics. The goal is to show
     how a run unfolds, not to play optimally.
   ===================================================================== */
const SIM = (() => {

  /* ---------- Random numbers (mulberry32) ---------- */
  /** makeRng(seed) -> () => number in [0,1). Deterministic. */
  const makeRng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  /** shuffle(r, arr) -> new shuffled array (Fisher–Yates). */
  const shuffle = (r, arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- Hex math (axial coordinates [q, r]) ---------- */
  const DIRS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const key = h => h[0] + "," + h[1];
  const unkey = k => k.split(",").map(Number);
  const dist = (a, b) => (Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]) + Math.abs(a[0]+a[1]-b[0]-b[1])) / 2;
  /** A Mage Knight-style tile is a 7-hex "flower": a center hex plus its 6 neighbors. */
  const FLOWER = [[0,0], ...DIRS];
  /** Tile centers sit on a lattice; these 6 offsets are the neighboring tile slots (each 3 hexes away). */
  const TILE_DIRS = [[2,1],[3,-2],[1,-3],[-2,-1],[-3,2],[-1,3]];

  /* ---------- Content definitions (kept deliberately simple) ---------- */
  /** Die faces. Star is wild. */
  const FACES = ["Sword","Wand","Bow","Shield","Star","Blank"];
  /** Enemy die result per face. */
  const ENEMY_HIT = { Sword:1, Wand:1, Bow:1, Star:2, Shield:0, Blank:0 };

  /**
   * Cards: every card has a top (Prepare) half and a bottom (Combat) half.
   * top.k: move | gather | build | rest      bot.k: reroll | rerollAll | dmg | guard | heal | tempDie
   */
  const CARDS = {
    move:    { name:"Trek",     top:{k:"move",   n:2, label:"Move 2"},          bot:{k:"reroll",   n:1, label:"Reroll 1 die"} },
    gather:  { name:"Harvest",  top:{k:"gather", n:0, label:"Gather"},          bot:{k:"dmg",      n:1, label:"+1 damage"} },
    build:   { name:"Repair",   top:{k:"build",  n:0, label:"Build"},           bot:{k:"guard",    n:2, label:"+2 guard"} },
    rest:    { name:"Camp",     top:{k:"rest",   n:2, label:"Rest: heal 2"},    bot:{k:"rerollAll",n:0, label:"Reroll all"} },
    sprint:  { name:"Sprint",   top:{k:"move",   n:3, label:"Move 3"},          bot:{k:"reroll",   n:2, label:"Reroll 2 dice"} },
    haul:    { name:"Haul",     top:{k:"gather", n:2, label:"Gather +2"},       bot:{k:"dmg",      n:2, label:"+2 damage"} },
    mason:   { name:"Mason",    top:{k:"build",  n:1, label:"Build, cost −1"},  bot:{k:"guard",    n:3, label:"+3 guard"} },
    scout:   { name:"Scout",    top:{k:"move",   n:2, label:"Move 2"},          bot:{k:"tempDie",  n:1, label:"+1 die"} },
    bandage: { name:"Bandage",  top:{k:"rest",   n:3, label:"Rest: heal 3"},    bot:{k:"heal",     n:2, label:"Heal 2"} },
    forage:  { name:"Forage",   top:{k:"gather", n:1, label:"Gather +1"},       bot:{k:"heal",     n:1, label:"Heal 1"} }
  };
  const STARTER = ["move","move","move","move","gather","gather","gather","build","build","rest"];
  /** starterDeck(n) — 10 = full list; 8 drops 1 Trek + 1 Harvest; 6 drops 2 Treks + 1 Harvest + 1 Repair. Pure. */
  const starterDeck = n => n >= 10 ? [...STARTER] : n >= 8 ? ["move","move","move","gather","gather","build","build","rest"] : ["move","move","gather","gather","build","rest"];
  const SHOP_POOL = ["sprint","sprint","haul","haul","mason","mason","scout","scout","bandage","bandage","forage","forage"];

  /**
   * Skills (formerly movesets): fire when the roll contains the needed faces.
   * dmg = single target, aoe = every enemy in range, guard = block, heal, cancel = ignore N enemy hits.
   */
  const SKILLS = {
    strike:  { name:"Strike",      need:{Sword:1},        dmg:2, range:1, cost:0 },
    shot:    { name:"Shot",        need:{Bow:1},          dmg:1, range:2, cost:0 },
    mend:    { name:"Mend",        need:{Wand:1},         heal:1,         cost:0 },
    guard:   { name:"Guard",       need:{Shield:1},       guard:2,        cost:0 },
    cleave:  { name:"Cleave",      need:{Sword:2},        dmg:5, range:1, cost:4 },
    bulwark: { name:"Bulwark",     need:{Shield:2},       guard:5,        cost:4 },
    renewal: { name:"Renewal",     need:{Wand:2},         heal:3,         cost:4 },
    dodge:   { name:"Dodge",       need:{Shield:1,Wand:1},cancel:1,       cost:3 },
    volley:  { name:"Volley",      need:{Bow:3},          aoe:2, range:2, cost:7 },
    flurry:  { name:"Flurry",      need:{Sword:3},        dmg:9, range:1, cost:7 },
    rain:    { name:"Arcane Rain", need:{Wand:3,Bow:2},   aoe:4, range:2, cost:12 },
    aimed:   { name:"Aimed Shot",  need:{Bow:2},          dmg:3, range:2, cost:4 },
    blade:   { name:"Spellblade",  need:{Sword:1,Wand:1}, dmg:4, range:1, cost:4 },
    spark:   { name:"Spark Burst", need:{Wand:1,Bow:1},   aoe:1, range:2, cost:5 },
    fortress:{ name:"Fortress",    need:{Shield:3},       guard:8,        cost:7 },
    purify:  { name:"Purify",      need:{Wand:3},         heal:6,         cost:7 },
    phalanx: { name:"Phalanx",     need:{Sword:2,Shield:2},dmg:7, range:1, cost:10 }
  };
  const STARTER_SKILLS = ["strike","shot","mend","guard"];
  const TRAIN_POOL = ["cleave","bulwark","renewal","dodge","volley","flurry","rain","aimed","blade","spark","fortress","purify","phalanx"];

  /** Locations start broken. The reference card gives the build cost (materials). */
  const LOCATIONS = { shop:{ name:"Shop", cost:4 }, train:{ name:"Training Ground", cost:5 } };
  const LOC_HP = 3;
  const ENEMIES = { grunt:{ name:"Grunt", hp:2, dice:1, xp:1, coin:1 }, elite:{ name:"Elite", hp:6, dice:3, xp:4, coin:4 } };

  /** Terrain. Lake and mountain block movement (as in Mage Knight). */
  const TERRAIN_W = {
    start:   { plains:4, forest:2, hills:1 },
    country: { plains:4, forest:3, hills:2, wasteland:1, lake:1, mountain:1 },
    core:    { wasteland:3, hills:2, mountain:2, forest:1, plains:1, lake:1 }
  };
  const BLOCKED = new Set(["lake","mountain"]);
  const weighted = (r, w) => { const tot = Object.values(w).reduce((a,b)=>a+b,0); let x = r()*tot; for (const [k,v] of Object.entries(w)) { x -= v; if (x < 0) return k; } return Object.keys(w)[0]; };

  /* ---------- Default parameters ---------- */
  const DEFAULTS = {
    seed: 7, players: 1, maxRounds: 25,
    exploreRule: "forced",          // forced | optional | auto
    startDice: 1, startHp: 15, handSize: 3,   // tuned 2026-10-02: 6-card starter, hand of 3
    countryTiles: 5, coreTiles: 5,            // core tiles (elites) arrive around rounds 6–10
    spawnPerCountry: 1,             // grunt spawn nodes per countryside tile
    enemySpeed: 2,                  // hexes per Combat phase
    enemyCap: 20,                   // miniature limit
    xpBase: 5,                      // level L→L+1 needs xpBase × L more XP
    startTraining: true,            // true = the Start tile also has a broken Training Ground
    trainCost: 3, locHp: 3,         // Training Ground build cost; health of every built location
    maxLevel: 0,                    // highest level (0 = no cap). XP still counts after the cap
    offers: 3,                      // offers revealed when a location is built
    nodeYield: 2, nodeCharges: 2,   // charges only matter for the optional rule
    skillUses: "once",              // once | unlimited (per exchange)
    skillDraftEvery: 2,             // every N rounds each player drafts 1 Skill for free (0 = off)
    draftChoices: 2,                // Skills shown in each draft
    draftNeedsTraining: true,       // true = the draft only happens while a Training Ground is built
    deckMode: "add",                // add = bought cards join the deck | replace = each bought card replaces a starter card
    tableSpeed: 1,                  // time multiplier: 0.75 fast table, 1 normal, 1.3 slow / first play
    setupMinutes: 8,                // table setup before round 1
    /* ---- Streamlining rules (each is a rule change, measured by the time model) ---- */
    quickPrepare: true,             // Prepare: turn the Combat discard pile upright with no shuffle
    skipEmptyCombat: false,         // a player with no enemy within 2 hexes skips Combat (no shuffle, no exchanges)
    fixedGruntDamage: true,         // grunts deal fixed damage (no dice); only elites roll
    starterSize: 6,                 // 10, 8 or 6 starter cards
    exploreEvery: 1,                // reveal tiles every N rounds
    printedSites: true,             // tiles have printed sites: placing a tile is faster (time model only)
    enemyLeash: 0,                  // enemies farther than N hexes from every player and built location do not move (0 = off)
    skillPriceMult: 0,              // multiplier on Training Ground prices (rounded up)
    gruntHp: 2, gruntDice: 2,       // enemy strength
    eliteHp: 14, eliteDice: 6,
    snapshots: true                 // false = fast batch mode (no events)
  };

  /* ===================================================================
     WORLD GENERATION
     =================================================================== */
  /**
   * makeTile(r, kind, num, center, p) -> { tile, hexes }
   * Places terrain and sites on 7 hexes. At most 1 blocked hex, never the center.
   */
  const makeTile = (r, kind, num, center, p, siteSeq) => {
    const cells = FLOWER.map(off => add(center, off));
    let blockedUsed = 0;
    const terr = cells.map((h, i) => {
      let t = weighted(r, TERRAIN_W[kind]);
      if (BLOCKED.has(t) && (i === 0 || blockedUsed >= 1)) t = kind === "core" ? "wasteland" : "plains";
      if (BLOCKED.has(t)) blockedUsed++;
      return t;
    });
    const open = shuffle(r, cells.map((h,i)=>i).filter(i => !BLOCKED.has(terr[i]) && i !== 0));
    const sites = {};
    const take = () => open.shift();
    if (kind === "start") {
      sites[0] = { type:"portal" };
      sites[take()] = { type:"node" }; sites[take()] = { type:"node" };
      sites[take()] = { type:"loc", kind:"shop" };
      if (p.startTraining) sites[take()] = { type:"loc", kind:"train" };
    } else if (kind === "country") {
      sites[0] = siteSeq.loc ? { type:"loc", kind: siteSeq.loc } : { type:"node" };
      const nodes = r() < 0.5 ? 2 : 1;
      for (let i = 0; i < nodes && open.length; i++) sites[take()] = { type:"node" };
      for (let i = 0; i < p.spawnPerCountry && open.length; i++) sites[take()] = { type:"spawn", elite:false };
    } else {
      sites[0] = { type:"spawn", elite:true };
      sites[take()] = { type:"node" };
      sites[take()] = { type:"spawn", elite:false };
      if (siteSeq.loc && open.length) sites[take()] = { type:"loc", kind: siteSeq.loc };
    }
    const hexes = cells.map((h, i) => ({ h, terrain: terr[i], tile: num, site: sites[i] || null }));
    return { tile: { num, kind, center }, hexes };
  };

  /* ===================================================================
     SIMULATION
     =================================================================== */
  const simulate = (userParams = {}) => {
    const p = { ...DEFAULTS, ...userParams };
    const r = makeRng(p.seed);
    /** locCost(kind) — build cost from the reference card (Training Ground cost is a parameter). */
    const locCost = kind => kind === "train" ? p.trainCost : LOCATIONS[kind].cost;
    /** Enemy stats for this run (parameters override the defaults). */
    const EN = { grunt: { ...ENEMIES.grunt, hp: p.gruntHp, dice: p.gruntDice }, elite: { ...ENEMIES.elite, hp: p.eliteHp, dice: p.eliteDice } };
    const events = [], rounds = [];

    /* ---- Run state (private to this call) ---- */
    const world = { tiles: [], hexes: {} };          // static terrain, grows as tiles are revealed
    const S = {
      round: 1, phase: "setup", sites: {}, enemies: [], players: [],
      xp: 0, level: 1, nextLevelAt: p.xpBase, kills: 0, eliteKills: 0, builds: 0,
      milestones: [], over: false, cause: "", tileDeck: [], cardDeck: [], skillDeck: [],
      nextId: 1, tilesShown: 0, firedRain: false, seconds: p.setupMinutes * 60 * p.tableSpeed
    };
    const uid = () => S.nextId++;

    /* ---- Snapshot + event emission ---- */
    const snapshot = () => ({
      round: S.round, phase: S.phase, tilesShown: S.tilesShown,
      sites: JSON.parse(JSON.stringify(S.sites)),
      enemies: S.enemies.map(e => ({ ...e, h:[...e.h] })),
      players: S.players.map(pl => ({ id: pl.id, h:[...pl.h], hp: pl.hp, maxHp: pl.maxHp, materials: pl.materials, currency: pl.currency,
        dice: pl.dice, skills: [...pl.skills], hand: [...pl.hand], deckN: pl.deck.length, discardN: pl.discard.length,
        orient: pl.orient, faces: [...pl.faces], kept: [...pl.kept], guard: pl.guard, played: [...pl.played] })),
      xp: S.xp, level: S.level, nextLevelAt: S.nextLevelAt, kills: S.kills, milestones: [...S.milestones], seconds: Math.round(S.seconds)
    });
    /** emit(type, payload, log) — records one animation step. */
    /**
     * TIME MODEL — estimated seconds a real table spends on each step (normal speed).
     * Assumptions, not measurements: tune with playtest timings. Pure.
     */
    const TIME = {
      phase: 8,           // announce the phase, reset the table
      shuffle: e => e.shuffled ? 22 : 6,  // shuffle + rotate the deck, or only rotate it
      skipCombat: 3,
      draw: 6, play: 12,  // draw a hand; read and resolve one card half
      move: 4, gather: 6, build: 25, buy: 30, heal: 3, waste: 3, idle: 3,
      tile: () => p.printedSites ? 35 : 60,  // place a tile, set out its sites
      spawn: 6,           // put a miniature on a spawn node
      advance: e => 3 * e.enemies.length,              // move each miniature 1 hex
      roll: 8, keep: 4,
      assign: 20,         // put dice on Skills
      skill: 5, kill: 6,
      enemyAttack: e => 4 + 2 * e.rolls.reduce((t, x) => t + x.faces.length, 0) + (e.fixed ? 2 : 0), // gather and read enemy dice
      skirmish: 20, siege: 6, broken: 15, levelup: 10, milestone: 0,
      draft: 40, replace: 10, quiet: 4, skipReveal: 10, capped: 2, noTiles: 2, death: 0, end: 0
    };
    const timeFor = (type, payload) => { const t = TIME[type]; return (typeof t === "function" ? t(payload) : (t || 0)) * p.tableSpeed; };
    /** emit(type, payload, log) — adds the step's table time, then records one animation step. */
    const emit = (type, payload = {}, log = "") => { S.seconds += timeFor(type, payload); if (p.snapshots) events.push({ type, ...payload, log, snap: snapshot() }); };

    /* ---- World helpers ---- */
    const hexAt = h => world.hexes[key(h)];
    const passable = h => { const x = hexAt(h); return !!x && !BLOCKED.has(x.terrain); };
    const neighbors = h => DIRS.map(d => add(h, d)).filter(passable);
    const enemiesAt = h => S.enemies.filter(e => e.h[0] === h[0] && e.h[1] === h[1]);
    const builtLocs = () => Object.entries(S.sites).filter(([,s]) => s.type === "loc" && s.built).map(([k,s]) => ({ k, h: unkey(k), s }));

    /** revealTile(center, kind) — adds a tile, its sites, and spawns its enemies at once. */
    const revealTile = (center, kind, num, siteSeq, reason) => {
      const { tile, hexes } = makeTile(r, kind, num, center, p, siteSeq);
      world.tiles.push(tile);
      hexes.forEach(x => { world.hexes[key(x.h)] = { h: x.h, terrain: x.terrain, tile: x.tile, kind };
        if (x.site) S.sites[key(x.h)] = { ...x.site, id: uid(), hp: x.site.type === "loc" ? 0 : undefined,
          built: x.site.type === "loc" ? false : undefined, charges: x.site.type === "node" ? p.nodeCharges : undefined,
          enemyId: null, offers: [] }; });
      S.tilesShown = world.tiles.length;
      emit("tile", { tile: num, center }, reason || `Tile ${num} (${kind}) is revealed.`);
      hexes.filter(x => x.site && x.site.type === "spawn").forEach(x => spawnAt(key(x.h), "spawn"));
    };

    /** spawnAt(siteKey) — puts an enemy on a spawn node if the miniature limit allows. */
    const spawnAt = (k, why) => {
      const s = S.sites[k];
      if (S.enemies.length >= p.enemyCap) { emit("capped", { k }, "Miniature limit reached. No spawn."); return; }
      const def = s.elite ? EN.elite : EN.grunt;
      const e = { id: uid(), h: unkey(k), hp: def.hp, maxHp: def.hp, elite: !!s.elite, node: k };
      S.enemies.push(e); s.enemyId = e.id;
      emit("spawn", { enemy: e.id, k, why }, `${def.name} ${why === "refill" ? "respawns" : "spawns"} on its spawn node.`);
    };

    /** Open tile slots adjacent to the current map. */
    const openSlots = () => {
      const used = new Set(world.tiles.map(t => key(t.center)));
      const slots = new Map();
      world.tiles.forEach(t => TILE_DIRS.forEach(d => { const c = add(t.center, d); if (!used.has(key(c))) slots.set(key(c), c); }));
      return [...slots.values()];
    };

    /* ---- Pathing ---- */
    /**
     * bfsPath(from, goalFn, opts) -> array of hexes (excluding from) or null.
     * Player cost: entering a hex next to an enemy costs 2 (obstacle rule). Enemy hexes cannot be entered.
     */
    const bfsPath = (from, goalFn, opts = {}) => {
      const startK = key(from), cost = { [startK]: 0 }, prev = {}, frontier = [[0, from]];
      while (frontier.length) {
        frontier.sort((a,b) => a[0]-b[0]);
        const [c, h] = frontier.shift();
        if (goalFn(h) && key(h) !== startK) { const path = []; let k = key(h); while (k !== startK) { path.unshift(unkey(k)); k = prev[k]; } return path; }
        for (const n of neighbors(h)) {
          const nk = key(n);
          if (opts.player && enemiesAt(n).length && !goalFn(n)) continue;
          const step = opts.player && S.enemies.some(e => dist(e.h, n) === 1) ? 2 : 1;
          if (cost[nk] === undefined || c + step < cost[nk]) { cost[nk] = c + step; prev[nk] = key(h); frontier.push([c + step, n]); }
        }
      }
      return null;
    };
    const stepCost = n => S.enemies.some(e => dist(e.h, n) === 1) ? 2 : 1;

    /* ---- Experience ---- */
    /** gainXp(n) — shared track. Each level adds 1 die to every player. Thresholds rise each level. */
    const gainXp = n => {
      S.xp += n;
      while (S.xp >= S.nextLevelAt && (!p.maxLevel || S.level < p.maxLevel)) {
        S.level++; S.nextLevelAt += p.xpBase * S.level;
        S.players.forEach(pl => pl.dice++);
        emit("levelup", { level: S.level }, `Level ${S.level}. Each player gets 1 more die.`);
        milestone("level5", S.level >= 5, "Reach level 5");
      }
    };
    const milestone = (id, cond, label) => { if (cond && !S.milestones.includes(label)) { S.milestones.push(label); emit("milestone", { label }, `Milestone: ${label}.`); } };

    /** killEnemy(e, pl) — removes the enemy; its node can refill next Combat. Killer gets currency; everyone gets XP. */
    const killEnemy = (e, pl) => {
      S.enemies = S.enemies.filter(x => x.id !== e.id);
      const def = e.elite ? EN.elite : EN.grunt;
      if (S.sites[e.node]) S.sites[e.node].enemyId = null;
      pl.currency += def.coin; S.kills++; if (e.elite) S.eliteKills++;
      emit("kill", { enemy: e.id, h: e.h, player: pl.id, coin: def.coin }, `${def.name} defeated. +${def.coin} currency, +${def.xp} XP.`);
      gainXp(def.xp);
      milestone("elite", S.eliteKills >= 1, "Defeat an elite");
    };

    /* ---- Dice and Skills ---- */
    const rollFace = () => FACES[Math.floor(r() * 6)];
    const countFaces = faces => faces.reduce((m, f) => (m[f] = (m[f] || 0) + 1, m), {});
    /** canFire(pool, need) — pool is face counts. Stars cover missing faces. Pure. */
    const canFire = (pool, need) => { const miss = Object.entries(need).reduce((s,[f,n]) => s + Math.max(0, n - (pool[f]||0)), 0); return miss <= (pool.Star||0); };
    /** consume(pool, need) -> new pool with exact faces used first, then Stars. Pure. */
    const consume = (pool, need) => { const q = { ...pool }; Object.entries(need).forEach(([f,n]) => { const use = Math.min(n, q[f]||0); q[f] = (q[f]||0) - use; q.Star -= (n - use); }); return q; };

    /** skillValue(id, ctx) — how much the bot wants this skill right now. */
    const skillValue = (id, ctx) => {
      const s = SKILLS[id];
      if (s.dmg) return ctx.inRange[s.range] > 0 ? Math.min(s.dmg, ctx.hpInRange[s.range]) + 0.1 : 0;
      if (s.aoe) return ctx.countInRange[2] * Math.min(s.aoe, 2) + 0.2;
      if (s.guard) return Math.min(s.guard, ctx.incoming) * 0.9;
      if (s.heal) return Math.min(s.heal, ctx.missing) * 0.8;
      if (s.cancel) return ctx.incoming > 0 ? 1.2 : 0;
      return 0;
    };
    /** assign(faces, skills, ctx) -> list of skill ids to fire (greedy by value). Pure. */
    const assign = (faces, skills, ctx) => {
      let pool = countFaces(faces); const fired = [];
      const order = [...skills].sort((a,b) => skillValue(b,ctx) - skillValue(a,ctx));
      for (const id of order) {
        if (skillValue(id, ctx) <= 0) continue;
        let uses = 0;
        while (canFire(pool, SKILLS[id].need) && (p.skillUses === "unlimited" || uses === 0) && uses < 4) { pool = consume(pool, SKILLS[id].need); fired.push(id); uses++; }
      }
      return fired;
    };
    /** keepMask(faces, skills, ctx) — keep dice used by the current best assignment, plus dice toward the best missing skill. */
    const keepMask = (faces, skills, ctx) => {
      const fired = assign(faces, skills, ctx);
      const want = {};
      fired.forEach(id => Object.entries(SKILLS[id].need).forEach(([f,n]) => want[f] = (want[f]||0) + n));
      const goal = [...skills].filter(id => !fired.includes(id) && Object.values(SKILLS[id].need).reduce((a,b)=>a+b,0) <= faces.length)
        .sort((a,b) => skillValue(b,ctx) - skillValue(a,ctx))[0];
      if (goal) Object.entries(SKILLS[goal].need).forEach(([f,n]) => want[f] = (want[f]||0) + n);
      return faces.map(f => { if (f === "Star") return true; if ((want[f]||0) > 0) { want[f]--; return true; } return false; });
    };

    /** combatCtx(pl) — what the bot knows when it rolls. */
    const combatCtx = (pl, enemies) => {
      const inR = rng => enemies.filter(e => dist(e.h, pl.h) <= rng);
      const adj = inR(1);
      return { inRange: { 1: inR(1).length, 2: inR(2).length }, hpInRange: { 1: inR(1).reduce((s,e)=>s+e.hp,0), 2: inR(2).reduce((s,e)=>s+e.hp,0) },
        countInRange: { 2: inR(2).length }, incoming: adj.reduce((s,e)=>s + (e.elite?EN.elite.dice:EN.grunt.dice)*0.83, 0), missing: pl.maxHp - pl.hp };
    };

    /**
     * fireSkills(pl, fired, bonus, enemies) — applies damage/guard/heal. Returns { cancel }.
     * Single-target damage goes to the weakest enemy in range so kills happen early.
     */
    const fireSkills = (pl, fired, bonus, label) => {
      let cancel = 0, dmgBonus = bonus.dmg || 0;
      for (const id of fired) {
        const s = SKILLS[id];
        if (s.dmg) {
          const targets = S.enemies.filter(e => dist(e.h, pl.h) <= s.range).sort((a,b) => a.hp - b.hp);
          if (!targets.length) continue;
          const t = targets[0]; const d = s.dmg + dmgBonus; dmgBonus = 0; t.hp -= d;
          emit("skill", { player: pl.id, skill: id, target: t.id, amount: d }, `${label}${s.name} hits for ${d}.`);
          if (t.hp <= 0) killEnemy(t, pl);
        } else if (s.aoe) {
          const targets = S.enemies.filter(e => dist(e.h, pl.h) <= s.range);
          if (id === "rain") { S.firedRain = true; milestone("rain", true, "Fire Arcane Rain (full house)"); }
          targets.forEach(t => t.hp -= s.aoe);
          emit("skill", { player: pl.id, skill: id, targets: targets.map(t=>t.id), amount: s.aoe }, `${label}${s.name} hits ${targets.length} enemies for ${s.aoe}.`);
          targets.filter(t => t.hp <= 0).forEach(t => killEnemy(t, pl));
        } else if (s.guard) { pl.guard += s.guard; emit("skill", { player: pl.id, skill: id, amount: s.guard }, `${label}${s.name}: +${s.guard} guard.`); }
        else if (s.heal) { const h = Math.min(s.heal, pl.maxHp - pl.hp); pl.hp += h; emit("skill", { player: pl.id, skill: id, amount: h }, `${label}${s.name}: heal ${h}.`); }
        else if (s.cancel) { cancel += s.cancel; emit("skill", { player: pl.id, skill: id }, `${label}${s.name}: ignore ${s.cancel} hit.`); }
      }
      return { cancel };
    };

    /** enemyAttack(pl, enemies, cancel) — adjacent enemies roll their dice. Guard absorbs first. */
    const enemyAttack = (pl, attackers, cancel) => {
      if (!attackers.length) return;
      const fixedOf = e => p.fixedGruntDamage && !e.elite;
      /** Fixed grunt damage = expected damage of its dice, rounded (2 dice → 2). */
      const fixedHit = Math.round(EN.grunt.dice * 5 / 6);
      const rolls = attackers.filter(e => !fixedOf(e)).map(e => ({ id: e.id, faces: Array.from({ length: e.elite ? EN.elite.dice : EN.grunt.dice }, rollFace) }));
      const fixedN = attackers.filter(fixedOf).length;
      let hits = [...rolls.flatMap(x => x.faces.map(f => ENEMY_HIT[f])), ...Array.from({ length: fixedN }, () => fixedHit)].sort((a,b) => b - a);
      hits = hits.slice(cancel);
      const total = hits.reduce((a,b)=>a+b,0);
      const blocked = Math.min(pl.guard, total); const dmg = total - blocked;
      pl.guard -= blocked; pl.hp -= dmg;
      const nd = rolls.reduce((s,x)=>s+x.faces.length,0);
      emit("enemyAttack", { player: pl.id, rolls, total, blocked, dmg, fixed: fixedN }, `${fixedN ? `${fixedN} grunts hit for ${fixedN*fixedHit}` : ""}${fixedN && nd ? "; " : ""}${nd ? `enemies roll ${nd} dice` : ""}: ${total} damage, ${blocked} blocked, ${dmg} taken.`);
      if (pl.hp <= 0) { S.over = true; S.cause = `Player ${pl.id} fell in round ${S.round}.`; emit("death", { player: pl.id }, S.cause); }
    };

    /**
     * rollExchange(pl, opts) — Yahtzee-style rolling. Up to 3 rolls (1 for a skirmish).
     * Card bottoms add dice and rerolls. Emits one event per roll.
     */
    const rollExchange = (pl, ctx, bonus, maxRolls, label) => {
      const n = pl.dice + (bonus.tempDie || 0);
      pl.faces = Array.from({ length: n }, rollFace); pl.kept = pl.faces.map(() => false);
      emit("roll", { player: pl.id, roll: 1 }, `${label}Roll 1: ${n} dice.`);
      for (let k = 2; k <= maxRolls; k++) {
        const mask = keepMask(pl.faces, pl.skills, ctx);
        if (mask.every(Boolean)) break;
        pl.kept = mask; emit("keep", { player: pl.id }, `${label}Keep ${mask.filter(Boolean).length} dice.`);
        pl.faces = pl.faces.map((f,i) => mask[i] ? f : rollFace());
        emit("roll", { player: pl.id, roll: k }, `${label}Roll ${k}.`);
      }
      // Card rerolls after the normal rolls.
      const extra = (bonus.reroll || 0) + (bonus.rerollAll ? n : 0);
      if (extra > 0 && maxRolls > 1) {
        const mask = keepMask(pl.faces, pl.skills, ctx); let left = extra;
        const idx = mask.map((m,i) => m ? -1 : i).filter(i => i >= 0).slice(0, left);
        if (idx.length) { pl.kept = mask; pl.faces = pl.faces.map((f,i) => idx.includes(i) ? rollFace() : f);
          emit("roll", { player: pl.id, roll: "card" }, `${label}Card reroll: ${idx.length} dice.`); }
      }
      pl.kept = pl.faces.map(() => false);
    };

    /* ---- Deck handling ---- */
    const draw = pl => { if (!pl.deck.length) return false; pl.hand = pl.deck.splice(0, Math.min(p.handSize, pl.deck.length)); return true; };
    const reshuffleAndRotate = (pl, orient) => { pl.deck = shuffle(r, [...pl.deck, ...pl.discard, ...pl.hand]); pl.discard = []; pl.hand = []; pl.orient = orient; };

    /** skillPrice(id) — Training Ground price after the price multiplier. */
    const skillPrice = id => p.skillPriceMult > 0 ? Math.ceil(SKILLS[id].cost * p.skillPriceMult) : Infinity;
    /**
     * replaceStarter(pl, boughtId) — Replace mode: remove 1 starter card so deck size stays the same.
     * The bot removes a starter with the same top-half effect if it has one (Sprint replaces a Trek),
     * otherwise any starter. It takes the card from the discard pile first, then the deck.
     * If no starter is left, the deck grows by 1 (nothing to replace).
     */
    const replaceStarter = (pl, boughtId) => {
      const starters = new Set(STARTER);
      const sameKind = c => starters.has(c) && CARDS[c].top.k === CARDS[boughtId].top.k;
      const anyStarter = c => starters.has(c);
      for (const test of [sameKind, anyStarter]) for (const pile of ["discard", "deck"]) {
        const i = pl[pile].findIndex(test);
        if (i >= 0) { const [gone] = pl[pile].splice(i, 1);
          emit("replace", { player: pl.id, removed: gone, added: boughtId }, `Player ${pl.id} removes ${CARDS[gone].name} from the deck. Deck size stays the same.`); return; }
      }
      emit("replace", { player: pl.id, removed: null, added: boughtId }, `Player ${pl.id} has no starter card left to replace. The deck grows by 1.`);
    };
    /* ---- Shops and training: buying is free when you stand on the built location ---- */
    const tryBuy = pl => {
      const s = S.sites[key(pl.h)];
      if (!s || s.type !== "loc" || !s.built) return;
      const price = id => s.kind === "shop" ? 3 : skillPrice(id);
      let bought = true;
      while (bought) {
        bought = false;
        const options = s.offers.filter(id => price(id) <= pl.currency && (s.kind === "shop" || !pl.skills.includes(id)))
          .sort((a,b) => price(b) - price(a));
        if (options.length) {
          const id = options[0]; pl.currency -= price(id); s.offers = s.offers.filter((x,i) => i !== s.offers.indexOf(id));
          if (s.kind === "shop") {
            pl.discard.push(id); emit("buy", { player: pl.id, item: id, kind: "card", price: price(id) }, `Player ${pl.id} buys card ${CARDS[id].name} for ${price(id)}.`);
            if (p.deckMode === "replace") replaceStarter(pl, id);
          }
          else { pl.skills.push(id); emit("buy", { player: pl.id, item: id, kind: "skill", price: price(id) }, `Player ${pl.id} learns ${SKILLS[id].name} for ${price(id)}.`); }
          const deck = s.kind === "shop" ? S.cardDeck : S.skillDeck;
          if (deck.length) s.offers.push(deck.shift());
          bought = true;
        }
      }
    };

    /* ---- Skirmish: enter an enemy hex during Prepare. One roll, Skills only, no cards. ---- */
    const skirmish = (pl, targetHex) => {
      const foes = enemiesAt(targetHex);
      emit("skirmish", { player: pl.id, h: targetHex }, `Player ${pl.id} starts a skirmish.`);
      const ctx = combatCtx(pl, foes);
      rollExchange(pl, ctx, {}, 1, "Skirmish: ");
      const fired = assign(pl.faces, pl.skills, ctx);
      // Only enemies on the target hex can be hit.
      const others = S.enemies.filter(e => !foes.includes(e)); S.enemies = foes.filter(e => S.enemies.includes(e));
      const res = fireSkills(pl, fired, {}, "Skirmish: ");
      const survivors = S.enemies; S.enemies = [...others, ...survivors];
      enemyAttack(pl, survivors, res.cancel);
      pl.guard = 0; pl.faces = [];
      if (!survivors.length && !S.over) { pl.h = targetHex; emit("move", { player: pl.id, h: targetHex }, `Player ${pl.id} enters the cleared hex.`); }
    };

    /* ---- Prepare phase bot ---- */
    /** chooseGoal(pl) -> predicate for the hex the bot wants to reach. */
    const chooseGoal = pl => {
      const threatened = S.enemies.filter(e => builtLocs().some(b => dist(b.h, e.h) <= 1));
      if (threatened.length && pl.hp >= 9) return { why: "skirmish", fn: h => threatened.some(e => e.h[0]===h[0] && e.h[1]===h[1]) };
      const brokenAffordable = Object.entries(S.sites).filter(([k,s]) => s.type === "loc" && !s.built && locCost(s.kind) <= pl.materials && !enemiesAt(unkey(k)).length);
      if (brokenAffordable.length) return { why: "build", fn: h => brokenAffordable.some(([k]) => k === key(h)) };
      const shops = builtLocs().filter(b => b.s.offers.some(id => (b.s.kind === "shop" ? 3 : skillPrice(id)) <= pl.currency && (b.s.kind === "shop" || !pl.skills.includes(id))));
      if (shops.length) return { why: "buy", fn: h => shops.some(b => b.k === key(h)) };
      return { why: "gather", fn: h => { const s = S.sites[key(h)]; return s && s.type === "node" && (p.exploreRule !== "optional" || s.charges > 0) && !enemiesAt(h).length; } };
    };

    const doMove = (pl, n) => {
      const goal = chooseGoal(pl);
      const here = goal.fn(pl.h) && goal.why !== "skirmish";
      if (here) { emit("idle", { player: pl.id }, `Player ${pl.id} stays to ${goal.why}.`); return; }
      const path = bfsPath(pl.h, goal.fn, { player: true });
      if (!path) { emit("idle", { player: pl.id }, `Player ${pl.id} has no path.`); return; }
      let pts = n;
      for (const h of path) {
        if (enemiesAt(h).length) { skirmish(pl, h); return; }
        const c = stepCost(h); if (c > pts) break;
        pts -= c; pl.h = h;
        emit("move", { player: pl.id, h, obstacle: c > 1 }, c > 1 ? `Player ${pl.id} moves next to an enemy (costs 2).` : `Player ${pl.id} moves 1 hex.`);
        tryBuy(pl);
      }
    };

    const cardUtility = (pl, id) => {
      const t = CARDS[id].top; const s = S.sites[key(pl.h)]; const blocked = enemiesAt(pl.h).length > 0;
      if (t.k === "rest") return pl.maxHp - pl.hp >= 3 ? 5 : 0.2;
      if (t.k === "build") return s && s.type === "loc" && !s.built && !blocked && locCost(s.kind) - t.n <= pl.materials ? 10 : 0.1;
      if (t.k === "gather") return s && s.type === "node" && !blocked && (p.exploreRule !== "optional" || s.charges > 0) ? 6 : 0.1;
      if (t.k === "move") return 3;
      return 0;
    };

    const playTop = (pl, id) => {
      const t = CARDS[id].top; const s = S.sites[key(pl.h)];
      pl.played.push(id);
      emit("play", { player: pl.id, card: id, half: "top" }, `Player ${pl.id} plays ${CARDS[id].name}: ${t.label}.`);
      if (t.k === "move") doMove(pl, t.n);
      else if (t.k === "gather") {
        if (s && s.type === "node" && !enemiesAt(pl.h).length && (p.exploreRule !== "optional" || s.charges > 0)) {
          const got = p.nodeYield + t.n; pl.materials += got; if (p.exploreRule === "optional") s.charges--;
          emit("gather", { player: pl.id, h: pl.h, amount: got }, `Player ${pl.id} gathers ${got} materials.`);
        } else emit("waste", { player: pl.id }, "No gathering node here. No effect.");
      } else if (t.k === "build") {
        const cost = s && s.type === "loc" ? Math.max(0, locCost(s.kind) - t.n) : 0;
        if (s && s.type === "loc" && !s.built && pl.materials >= cost && !enemiesAt(pl.h).length) {
          pl.materials -= cost; s.built = true; s.hp = p.locHp; S.builds++;
          const deck = s.kind === "shop" ? S.cardDeck : S.skillDeck;
          s.offers = s.kind === "train" && p.skillPriceMult <= 0 ? [] : deck.splice(0, p.offers);
          emit("build", { player: pl.id, h: pl.h, kind: s.kind, cost }, `Player ${pl.id} builds the ${LOCATIONS[s.kind].name} (${cost} materials). ${s.kind === "train" && p.skillPriceMult <= 0 ? "It hosts the Skill draft." : s.offers.length + " offers revealed."}`);
          milestone("build3", S.builds >= 3, "Build 3 locations");
          tryBuy(pl);
        } else emit("waste", { player: pl.id }, "Nothing to build here. No effect.");
      } else if (t.k === "rest") {
        const h = Math.min(t.n, pl.maxHp - pl.hp); pl.hp += h;
        emit("heal", { player: pl.id, amount: h }, `Player ${pl.id} rests and heals ${h}.`);
      }
      pl.hand = pl.hand.filter((x,i) => i !== pl.hand.indexOf(id)); pl.discard.push(id);
    };

    const preparePhase = () => {
      S.phase = "prepare";
      emit("phase", { phase: "prepare" }, `Round ${S.round}: Prepare.`);
      S.players.forEach(pl => {
        // Quick Prepare: if every card is in the discard pile, turn it upright with no shuffle (same order as Combat).
        const quick = p.quickPrepare && !pl.deck.length && !pl.hand.length;
        if (quick) { pl.deck = [...pl.discard]; pl.discard = []; pl.orient = "top"; }
        else reshuffleAndRotate(pl, "top");
        emit("shuffle", { player: pl.id, shuffled: !quick, orient: "top" }, quick ? `Player ${pl.id} turns the deck upright. No shuffle.` : `Player ${pl.id} shuffles and turns the deck: top halves up.`);
      });
      for (const pl of S.players) {
        tryBuy(pl);
        while (!S.over && draw(pl)) {
          pl.played = [];
          emit("draw", { player: pl.id }, `Player ${pl.id} draws ${pl.hand.length} cards.`);
          while (pl.hand.length && !S.over) {
            const best = [...pl.hand].sort((a,b) => cardUtility(pl,b) - cardUtility(pl,a))[0];
            playTop(pl, best);
          }
          pl.played = [];
        }
      }
    };

    /* ---- Combat phase ---- */
    const advanceEnemies = () => {
      const targets = () => [...S.players.map(pl => pl.h), ...builtLocs().map(b => b.h)];
      for (let step = 0; step < p.enemySpeed; step++) {
        const moved = [];
        for (const e of S.enemies) {
          const tg = targets(); if (!tg.length) continue;
          if (tg.some(t => dist(t, e.h) <= 1)) continue;
          if (p.enemyLeash && !tg.some(t => dist(t, e.h) <= p.enemyLeash)) continue;  // dormant until players come near
          const path = bfsPath(e.h, h => tg.some(t => dist(t, h) <= 1));
          if (path && path.length) { e.h = path[0]; moved.push(e.id); }
        }
        if (moved.length) emit("advance", { enemies: moved, step: step + 1 }, `${moved.length} enemies advance 1 hex.`);
      }
    };

    const combatPhase = () => {
      S.phase = "combat";
      emit("phase", { phase: "combat" }, `Round ${S.round}: Combat.`);
      Object.entries(S.sites).filter(([,s]) => s.type === "spawn" && s.enemyId === null).forEach(([k]) => spawnAt(k, "refill"));
      advanceEnemies();
      for (const pl of S.players) {
        if (p.skipEmptyCombat && !S.enemies.some(e => dist(e.h, pl.h) <= 2)) {
          pl.discard = [...pl.discard, ...pl.deck, ...pl.hand]; pl.deck = []; pl.hand = [];
          emit("skipCombat", { player: pl.id }, `Player ${pl.id}: no enemy within 2 hexes. Skip Combat.`);
          continue;
        }
        reshuffleAndRotate(pl, "bottom");
        emit("shuffle", { player: pl.id, shuffled: true, orient: "bottom" }, `Player ${pl.id} shuffles and turns the deck 180°: bottom halves up.`);
        let ex = 0;
        while (!S.over && draw(pl)) {
          ex++;
          const foes = S.enemies.filter(e => dist(e.h, pl.h) <= 2);
          if (!foes.length) {
            emit("quiet", { player: pl.id }, `Player ${pl.id}: exchange ${ex}, no enemies in range.`);
            pl.discard.push(...pl.hand); pl.hand = []; continue;
          }
          pl.played = [...pl.hand];
          emit("draw", { player: pl.id, combat: true }, `Player ${pl.id}: exchange ${ex}. Draw ${pl.hand.length} cards (bottom halves).`);
          const bonus = pl.hand.reduce((b, id) => { const x = CARDS[id].bot; b[x.k] = (b[x.k]||0) + (x.n || 1); return b; }, {});
          const ctx = combatCtx(pl, S.enemies);
          rollExchange(pl, ctx, bonus, 3, "");
          const fired = assign(pl.faces, pl.skills, ctx);
          pl.guard += bonus.guard || 0;
          if (bonus.heal) pl.hp = Math.min(pl.maxHp, pl.hp + bonus.heal);
          emit("assign", { player: pl.id, fired }, fired.length ? `Dice go on: ${fired.map(id => SKILLS[id].name).join(", ")}.` : "No Skill can fire.");
          const res = fireSkills(pl, fired, bonus, "");
          if (!S.over) enemyAttack(pl, S.enemies.filter(e => dist(e.h, pl.h) <= 1), res.cancel);
          pl.guard = 0; pl.faces = []; pl.discard.push(...pl.hand); pl.hand = []; pl.played = [];
        }
      }
    };

    /* ---- Skill draft ---- */
    /**
     * draftScore(id, dice) — bot preference: power per face, heavily reduced when the
     * Skill needs more faces than the player has dice. Pure.
     */
    const draftScore = (id, dice) => { const s = SKILLS[id]; const faces = Object.values(s.need).reduce((a,b)=>a+b,0);
      const power = (s.dmg || 0) + (s.aoe || 0) * 3 + (s.guard || 0) * 0.6 + (s.heal || 0) * 0.6 + (s.cancel || 0) * 2.5;
      return power / faces * (faces > dice ? 0.2 : 1); };
    /**
     * skillDraft() — every p.skillDraftEvery rounds, each player sees p.draftChoices Skills
     * from the top of the Skill supply, keeps 1 for free, and returns the others to the bottom.
     */
    const skillDraft = () => {
      if (!p.skillDraftEvery || S.round % p.skillDraftEvery !== 0) return;
      if (p.draftNeedsTraining && !builtLocs().some(b => b.s.kind === "train")) { emit("draft", { player: 0, options: [], pick: null }, "Skill draft skipped: no Training Ground is built."); return; }
      for (const pl of S.players) {
        const options = [];
        for (let i = 0; i < S.skillDeck.length && options.length < p.draftChoices; i++)
          if (!pl.skills.includes(S.skillDeck[i])) options.push(S.skillDeck[i]);
        if (!options.length) { emit("draft", { player: pl.id, options: [], pick: null }, `Player ${pl.id}: the Skill supply is empty. No draft.`); continue; }
        const pick = [...options].sort((a,b) => draftScore(b, pl.dice) - draftScore(a, pl.dice))[0];
        S.skillDeck = [...S.skillDeck.filter(id => !options.includes(id)), ...options.filter(id => id !== pick)];
        pl.skills.push(pick);
        emit("draft", { player: pl.id, options, pick }, `Skill draft: player ${pl.id} chooses ${SKILLS[pick].name} from ${options.map(id => SKILLS[id].name).join(" or ")}.`);
      }
    };

    /* ---- Explore phase ---- */
    const explorePhase = () => {
      S.phase = "explore";
      emit("phase", { phase: "explore" }, `Round ${S.round}: Explore.`);
      // Siege tick: each survivor next to a built location deals 1 damage to it.
      for (const e of S.enemies) {
        const b = builtLocs().filter(b => dist(b.h, e.h) <= 1).sort((x,y) => x.s.hp - y.s.hp)[0];
        if (!b) continue;
        b.s.hp -= 1;
        emit("siege", { enemy: e.id, h: b.h }, `Siege: the ${LOCATIONS[b.s.kind].name} takes 1 damage.`);
        if (b.s.hp <= 0) { b.s.built = false; const deck = b.s.kind === "shop" ? S.cardDeck : S.skillDeck; deck.push(...b.s.offers); b.s.offers = [];
          emit("broken", { h: b.h }, `The ${LOCATIONS[b.s.kind].name} breaks. Rebuild at full cost.`); }
      }
      // Reveal tiles (one per player) according to the selected rule.
      const revealThisRound = S.round % p.exploreEvery === 0;
      if (!revealThisRound) emit("skipReveal", {}, `No reveal this round (tiles every ${p.exploreEvery} rounds).`);
      for (let i = 0; revealThisRound && i < S.players.length; i++) {
        if (!S.tileDeck.length) { emit("noTiles", {}, "The tile deck is empty. No new tiles."); break; }
        const slots = openSlots(); if (!slots.length) break;
        if (p.exploreRule === "optional") {
          const live = Object.values(S.sites).filter(s => s.type === "node" && s.charges > 0).length;
          if (live >= 2 * S.players.length) { emit("skipReveal", {}, `Players skip the reveal (${live} gathering nodes still have materials).`); break; }
        }
        let slot;
        if (p.exploreRule === "auto") slot = pick(r, slots);
        else { // Player chooses: put the new tile far from built locations and from players.
          const anchors = [...builtLocs().map(b => b.h), ...S.players.map(pl => pl.h)];
          slot = [...slots].sort((a,b) => Math.min(...anchors.map(x => dist(x,b))) - Math.min(...anchors.map(x => dist(x,a))))[0];
        }
        const t = S.tileDeck.shift();
        revealTile(slot, t.kind, t.num, t, p.exploreRule === "auto" ? `Tile ${t.num} (${t.kind}) is turned and placed by a die roll.` : `Tile ${t.num} (${t.kind}) is revealed and placed by the players.`);
      }
      milestone("tiles10", S.tilesShown >= 10, "Reveal 10 tiles");
      skillDraft();
    };

    /* ---- Setup ---- */
    S.cardDeck = shuffle(r, SHOP_POOL); S.skillDeck = shuffle(r, TRAIN_POOL);
    // Tile deck: countryside tiles, then core tiles. Locations alternate so both kinds appear early.
    const locSeq = i => i === 0 ? "train" : (i % 3 === 0 ? (i % 2 ? "shop" : "train") : null);
    S.tileDeck = [
      ...Array.from({ length: p.countryTiles }, (_, i) => ({ kind: "country", num: i + 1, loc: locSeq(i) })),
      ...Array.from({ length: p.coreTiles }, (_, i) => ({ kind: "core", num: p.countryTiles + i + 1, loc: i === 1 ? "shop" : null }))
    ];
    for (let i = 0; i < p.players; i++) {
      S.players.push({ id: i + 1, h: [0,0], hp: p.startHp, maxHp: p.startHp, materials: 0, currency: 0, dice: p.startDice,
        skills: [...STARTER_SKILLS], deck: shuffle(r, starterDeck(p.starterSize)), hand: [], discard: [], orient: "top", faces: [], kept: [], guard: 0, played: [] });
    }
    revealTile([0,0], "start", 0, {}, "The Start tile is placed. Players stand on the portal.");
    // As in Mage Knight setup, 2 countryside tiles start revealed.
    for (const slot of [[2,1],[-1,3]].slice(0, 2)) { const t = S.tileDeck.shift(); revealTile(slot, t.kind, t.num, t, `Setup: tile ${t.num} is revealed.`); }

    /* ---- Round loop ---- */
    const recordRound = () => rounds.push({
      minutes: S.seconds / 60,
      round: S.round, enemies: S.enemies.length, elites: S.enemies.filter(e => e.elite).length, tiles: S.tilesShown, level: S.level,
      dice: S.players[0].dice, minHp: Math.max(0, Math.min(...S.players.map(pl => pl.hp))),
      materials: S.players.reduce((s,pl) => s + pl.materials, 0), currency: S.players.reduce((s,pl) => s + pl.currency, 0),
      built: builtLocs().length, kills: S.kills, skills: S.players[0].skills.length, skillsAvg: S.players.reduce((t,pl)=>t+pl.skills.length,0)/S.players.length, deck: S.players[0].deck.length + S.players[0].discard.length + S.players[0].hand.length
    });
    while (!S.over && S.round <= p.maxRounds) {
      preparePhase(); if (S.over) break;
      combatPhase(); if (S.over) break;
      explorePhase();
      recordRound();
      milestone("r5", S.round >= 5, "Survive to round 5");
      milestone("r10", S.round >= 10, "Survive to round 10");
      milestone("r15", S.round >= 15, "Survive to round 15");
      S.round++;
    }
    if (S.over) recordRound();
    if (!S.over) { S.cause = `Simulation limit: ${p.maxRounds} rounds.`; emit("end", {}, S.cause); }

    return { events, rounds, world, params: p,
      locCost: kind => kind === "train" ? p.trainCost : LOCATIONS[kind].cost,
      skillPrice: id => p.skillPriceMult > 0 ? Math.ceil(SKILLS[id].cost * p.skillPriceMult) : Infinity,
      summary: { minutes: S.seconds / 60, rounds: S.over ? S.round : p.maxRounds, survivedFull: !S.over, cause: S.cause, kills: S.kills, level: S.level, milestones: [...S.milestones], tiles: S.tilesShown } };
  };

  return { simulate, DEFAULTS, CARDS, SKILLS, LOCATIONS, ENEMIES, FACES, key, unkey, dist, FLOWER, DIRS };
})();
if (typeof module !== "undefined") module.exports = SIM;
