# v2 one-page design sheets

Fifteen one-page design sheets for the v2 core loop of Survival Dice-Builder, framed as a board
game. Each page is a standalone attempt at the same design: the cross product of three audiences
(Designer, Playtester, Publisher) and five one-page template lineages. The PDF is
`survival-dice-builder-v2-one-pagers.pdf` (15 pages, US Letter, all drawings vector).

## Sources

- `docs/design/core-loop-v2.md` (designer walkthrough, 2026-10-04) wins on everything it states.
- `OPEN-QUESTIONS.md` rows dated 2026-10-04 and `docs/DECISIONS.md`.
- `spec/01-spec-v1-rules.md` fills the gaps. Pending items print as "to be designed".
- `FACTS.md` is the traceability layer: every number on a sheet maps to a fact id there, and each
  page carries a `<!-- facts: ... -->` comment and a `src:` footer naming its sources.

## Lineages

- **Librande diagram sheet**: Stone Librande, GDC 2010/2013: one drawing, callouts, a sidebar, whitespace.
- **Rogers one-sheet**: Scott Rogers, Level Up!: the text one-sheet with vitals, summary, outline, USPs, comparables.
- **Board-game sell sheet**: the tabletop publisher pitch page: hero scene, vitals, premise, boxed hook, components, why it sells.
- **Feature one-pager on the round**: the GDKeys feature one-pager pattern applied to the round: loop, key beats, stat bars, strategies, emotions, difficulty gap.
- **Pillars sheet**: the Ruswick / Stray Spark lineage: pitch, three pillars, loop diagram, target player, comparables, scope, milestone, risks.

## Pages

| Page | Id | Audience | Lineage | File | Orientation | Words | Diagrams | What this attempt bets on |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | A1-L1 | Designer | Librande diagram sheet | `pages/p01-designer-librande.html` | landscape | 285 | 3 | One dominant table drawing (Base tile, deck, dashed edge step, one revealed tile, grunt, elite) with short leader-line callouts carries the whole core loop; the sidebar only sorts settled vs Spec v1 fill-in vs to be designed. |
| 2 | A1-L2 | Designer | Rogers one-sheet | `pages/p02-designer-onesheet.html` | portrait | 449 | 1 | A Rogers one-sheet that marks, field by field, what v2 settles, where Spec v1 still fills in, and which decisions stay open. |
| 3 | A1-L3 | Designer | Board-game sell sheet | `pages/p03-designer-sellsheet.html` | portrait | 300 | 1 | A Designer-facing sell sheet that separates settled v2 rules from Spec v1 fill-ins and open decisions, with the land-reveal push-your-luck as the single hook. |
| 4 | A1-L4 | Designer | Feature one-pager on the round | `pages/p04-designer-feature.html` | landscape | 397 | 1 | The round is the feature: show Prepare then Combat as a loop with what is settled, what Spec v1 fills in, and which decision rows stay open, with trial-run numbers only as a gap to re-measure. |
| 5 | A1-L5 | Designer | Pillars sheet | `pages/p05-designer-pillars.html` | portrait | 399 | 1 | The Designer wants one glance at what is settled versus still open, with the v2 round (Prepare then Combat) as the spine and the print-and-play kit counts pinned to FACTS. |
| 6 | A2-L1 | Playtester | Librande diagram sheet | `pages/p06-playtester-librande.html` | landscape | 245 | 2 | One table drawing (Base tile, deck, step off the edge, one revealed tile) plus a two-half card teaches the whole round; every other word is a label or bullet. |
| 7 | A2-L2 | Playtester | Rogers one-sheet | `pages/p07-playtester-onesheet.html` | portrait | 449 | 1 | A cold Playtester learns the round as one deck played twice (Prepare top halves, Combat bottom halves) and the three push-your-luck levers: 3 rolls, stepping off the edge, spending a node. |
| 8 | A2-L3 | Playtester | Board-game sell sheet | `pages/p08-playtester-sellsheet.html` | portrait | 300 | 1 | A publisher-style sell sheet that teaches the whole round in one column while a drawn table scene shows the two-half card, the 3-roll dice dare, and stepping off the map edge. |
| 9 | A2-L4 | Playtester | Feature one-pager on the round | `pages/p09-playtester-feature.html` | landscape | 399 | 2 | A cold playtester learns the round fastest from one loop drawing plus a card shown with both halves, with the push-your-luck rules boxed beside the key beats. |
| 10 | A2-L5 | Playtester | Pillars sheet | `pages/p10-playtester-pillars.html` | portrait | 398 | 1 | The three pillars plus the four-node loop give a cold playtester the whole round in one glance, so the teach-order list only has to carry numbers. |
| 11 | A3-L1 | Publisher | Librande diagram sheet | `pages/p11-publisher-librande.html` | landscape | 229 | 2 | A publisher gets the whole pitch from one picture: the round is Prepare then Combat on a map you grow by stepping off its edge, with the card's two halves as the only detail. |
| 12 | A3-L2 | Publisher | Rogers one-sheet | `pages/p12-publisher-onesheet.html` | portrait | 449 | 1 | A publisher buys the shelf gap in one glance: the two-faced card is the hook, co-op survival is the category, and three comparables place it without teaching rules. |
| 13 | A3-L3 | Publisher | Board-game sell sheet | `pages/p13-publisher-sellsheet.html` | portrait | 297 | 1 | A publisher buys the gap on the shelf: one hand of two-faced cards (Prepare top, Combat bottom) drives a co-op tile-laying survival dice-builder, sold through a drawn table scene, four vitals, one boxed hook and two comparables. |
| 14 | A3-L4 | Publisher | Feature one-pager on the round | `pages/p14-publisher-feature.html` | landscape | 394 | 1 | The round sold as "one deck, two faces": a Prepare-then-Combat loop drawing plus five key beats, with the shelf gap (co-op survival meets dice-building on a map laid as you walk) carried by three comparables. |
| 15 | A3-L5 | Publisher | Pillars sheet | `pages/p15-publisher-pillars.html` | portrait | 398 | 2 | A publisher buys the shelf gap in 30 seconds: co-op survival defence of one base, resolved with push-your-luck dice and a growing 10-card deck on a map that grows as you reveal it. |

## Build

```
node scripts/one-pagers.mjs render   # pages/*.html -> build/*.pdf and PNG previews
node scripts/one-pagers.mjs check    # 15 pages, no banned word, a vector diagram on every page, no raster image
node scripts/one-pagers.mjs merge    # build/*.pdf -> survival-dice-builder-v2-one-pagers.pdf
```

Rendering uses the Playwright Chromium already installed for the e2e tests; `pdftoppm` (poppler)
writes the previews and `pypdf` merges. Each page is self-contained HTML with inline CSS and
inline SVG: no external resource is loaded. Fonts fall back to the system sans when Oswald,
Atkinson Hyperlegible Next, or JetBrains Mono are not installed.

## Method

Each sheet was written by one agent, then checked by an adversarial reviewer for facts (against
`FACTS.md`), structure (the lineage's required sections and word cap), and layout (the rendered
page), and repaired until it passed; a final consistency pass compared all fifteen. Numbers no
source states (age, play time, token counts) print as "not stated" or "to be measured".
