# Phase 3 — World: map, enemies, base, defenses, exploration

**Goal:** the full board: tiles, movement, enemies that hunt the nearest target, the base, defenses, exploration, and the wave track.

## Scope

- Axial hex math; tile placement (7-hex tiles adjacent to existing tiles); impassable lake and mountain.
- Player movement with path choice; extra cost next to enemies (6.9); skirmish (6.10–6.13).
- Gather and Build on the map (6.7); defenses: Barricade and Tower (section 12), placement limits (12.2).
- Enemies: spawn on nodes, refill only when defeated (9.2), move 2 hexes toward the nearest target (9.3–9.4), cannot enter Barricade hexes, Tower attack (12.3), structure attack step at end of Combat with priority Barricade, Tower, base (7.11–7.12).
- Base: health, upgrades applied as data (purchase logic in Phase 4).
- Explore phase: forced reveal with player-chosen position (default), plus optional and automatic reveal as config options (18.1).
- Wave track and wave step, miniature limit, grunt-to-elite replacement (10.3–10.5, section 15).
- Co-op exchange order and per-player enemy attacks (16.4–16.5).

## Acceptance criteria

- Property: no enemy ever stands on a lake, mountain, Barricade, or base hex.
- Property: miniature count never exceeds the configured limit.
- Pathing tests: enemy chooses the nearest target and the documented tie-break; a Barricade wall forces a detour or an attack.
- Golden replay of a full solo run on the default config.
