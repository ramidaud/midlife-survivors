# Wall-lining and floor-detail kit

[Review boards and catalog](review-wall.html) · [Integration manifest](manifest-wall.json) · [Full prompts](batch-wall.json) · [Pixel checks](checks-wall.json)

The full enumerated brief yields **60 wall families plus 10 floor decals**, with **three colorways per family: 210 native cells**. Mountain, rowers and eagle are separate poster families so all three illustrations are available. The shared seventeen-color prop palette is unchanged. All delivered sheets have opaque exact `#FF00FF` between objects, hard pixel edges and navy silhouettes. No lettering, labels or numbers are baked into the native art.

## Assembly contract

- Every cell width is **32, 64, 96 or 128 pixels**. Sheet width is three times that cell width, one horizontal row. Colorways are material variants, not animation frames.
- A wall segment has 256px of allocated module space. Use `moduleWidth` for layout, never the cropped visible-ink bounds. For example, 128+64+64 or 96+96+64 fills the segment exactly. Normal frames include small equal gutters; the wall behind remains continuous.
- `mount: mounted` pieces are non-solid, 32-64px tall. `mount: hugging` pieces are solid and have a **24px-deep proposed floor footprint**, measured back from their lower anchor. The manifest's narrower footprint width excludes the side padding. `mount: floor` is always non-solid.
- Floor decals key out magenta like props, then use the suggested **0.23 opacity**. The floor preview demonstrates this on cream and sage. Keep them matte and unlit; do not treat a stain or tape line as a blocker.
- `rooms: ["*"]` means reusable everywhere. Other lists name the intended room. Texture keys can use a wall/floor batch prefix to avoid collisions with older prop registries.
- `repeatX: true` identifies cable trays, warning stripes, frosting, paneling, mural/parking bands and floor strips with identical left/right native edge columns in every colorway. They repeat horizontally. Other assets are isolated objects or decals, not seamless floor tiles.
- No baked floor shadows. Claude owns placement, occlusion, captions, status-light blinking, lighting and runtime collision registration. The patch panel contains lit/unlit port pixels as a base for that treatment. This delivery changes no room positions, gates, navigation, spawning or game code.
- The filled 256px examples represent intact wall segments. Leave door openings empty and preserve the existing 224px clear routes when placing solid wall-hugging pieces.

## Review boards

The `wall/review-<room>-v1.png` images cover Lobby, Bullpen, Break Room, Server, Conference, Executive, Wellness and Parking, plus an Everywhere board. Each has three different **256px allocations at exact 2x**, alongside the actual 9-to-5er. Colorways 1-3 appear in the three rows. [Layout data](wall/review-layouts-v1.json) gives the IDs in each arrangement. These are assembly studies, not proposed final room placements.

[Floor comparison](floor/review-floor-v1.png) shows all ten decals at 2x and their intended opacity. [Native catalog board](wall/review-all-native-v1.png) shows the first colorway of all seventy families in manifest order, ten columns. The review page offers all three colorways, room filtering and native/2x zoom. Oversized boards scroll inside the phone viewport rather than squeezing pixels.

## Native preparation and checks

Built-in imagegen produced an individual object study for each family, using the approved sofa and hero as style references. Full prompts, selected study names and source hashes are in `batch-wall.json`. The caster-mark study was refined to remove an unwanted carpet sample. High-resolution studies stay outside the runtime asset tree; only compact native sheets and review artifacts are delivered.

Native preparation uses uniform nearest-neighbor sampling, the existing palette, exact magenta, one-pixel navy boundaries and controlled material recolors. Repeating strips have matched side columns. Very thin tape/caster marks received a small native cleanup so each colorway has visible interior pigment rather than an all-outline duplicate.

Run the optional, offline art check:

```sh
python3 assets/stage/props/validate-wall.py
```

It checks all 210 cells for dimensions, module widths, palette, opacity, magenta margins, navy silhouettes, equal variant masks, distinct colorways and matching repeat edges. It also checks the solid/non-solid and 24px-depth contracts. It does not run or modify the game. Review the proposed footprints during Claude's placement pass; no runtime performance claim is made here.
