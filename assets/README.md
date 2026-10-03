# assets

License-checked files used by the prototype. **Every file here has a row in `/ASSETS.md`**;
`pnpm lint` fails otherwise (`scripts/check-assets.mjs`).

```
assets/
├── icons/
│   ├── dice/     # the 6 die faces: sword, wand, bow, shield, star, blank
│   └── game/     # resources, structures, enemies, sites
├── tiles/        # hex tile art (phase 11)
├── audio/        # sound effects (phase 15)
└── models/       # 3D dice / miniatures (phase 15, optional)
```

## Icon format

- Single colour: every shape uses `fill="currentColor"`, so CSS sets the colour and both themes
  work. No background square.
- `viewBox="0 0 512 512"`.
- One style: all icons come from game-icons.net (CC BY 3.0), except the Blank face, which is
  project-owned.

## Adding an asset

1. Check the license on the source's own license page. Allowed: CC0, CC BY, MIT, ISC,
   Apache 2.0, zlib, SIL OFL. NC or ND licenses are rejected unless the designer approves.
2. Add the file under the right folder.
3. Add a row to `/ASSETS.md` (source URL, license, license URL, attribution, status, date).
4. Add the attribution line to `docs/research/CREDITS.md` if the license needs one.
