# Maple Hollow outdoor kit v3

Job 3 art is ready for Rami review. The three greens were approved before production: lawn light `#9BAE73`, lawn shadow `#6D895B`, evergreen `#315B4B`. The existing 17 colors remain intact; this outdoor kit uses those 17 plus the approved three.

Open `review-outdoors-v3.html?nostats=1` for native 1×/2×/4× previews, a 56×60 hero comparison for every piece, seam checks and a 416 px lot suggestion.

## Delivery

69 named pieces in 18 native PNGs, all described in `manifest-outdoors-v3.json`:

- Six fall trees: red maple 160×192, orange maple 144×176, gold oak 160×192, yellow birch 128×160, bare oak 128×160, half-turned maple 144×176.
- Three pines: 64×96, 80×120 and 96×144. Tree canopies are decorative overlap; only the trunk/root footprint is solid.
- `tree-line-v3.png`: 832×160, repeating horizontally. It is background dressing, not a collision boundary.
- `shrubs-v3.png`: eight 64×64 cells, including straight/vertical/corner hedges, flowering mums, foundation planting and three shrub shapes.
- `leaf-decals-v3.png`: eight padded 96×64 cells containing native pieces from 32 to 96 px wide. Leaf drifts, loose leaves and twigs are non-solid.
- `lawn-v3-a.png`, `lawn-v3-b.png`: 512×512 opaque matte lawns with quiet backgrounds and sparse readable grass clumps.
- `yard-props-v3.png`: eight columns by two rows of 48×48 cells, preserving the 16 subjects from the old lawn kit.
- `key-hunt-v3.png`: eight 48×48 cells, preserving the rock, open rock, lifted mat, tipped pot, mirror/key, mailbox, house key and blank note.
- `toy-bricks-v3.png`: five 48×48 cells for the four scatter densities and the single-brick moment. Non-solid art; existing hazard behavior is for Claude to retain.
- `fences-v3.png`: six 64×64 cells per row, picket then wood. Horizontal, vertical, corner, post, gate closed and gate open. Open gates record both post footprints separately.

Each frame entry includes its native size, atlas rectangle, foot point, floor footprint, layer and notes. `checks/` includes 4× PNGs beside the real 56×60 hero for all 69 pieces. `prompts-outdoors-v3.json` saves the style-study prompt and native construction rules.

## Lot suggestion

`suggested-lot-v3.png` is 416×640. The existing house front stays at 1×. Foundation planting softens its lawn edge, with an orange maple, pumpkin, hose, leaf pile, mailbox and open picket gate. New props stay outside the 64 px right-side route. This is a suggested composition only; it is not runtime layout data.

## Checks and integration notes

- All 18 PNGs pass the 20-color palette, binary-alpha and no-magenta checks. Isolated sprites are transparent; lawns are fully opaque. Final art is drawn on the declared native grids, not resized from generation studies or old 32 px props.
- All four lawn A/B pairings match on both axes: eight directional edge comparisons. Self and mixed 2×2 check images are in `checks/`.
- Tree-line first/last RGBA columns match exactly. A two-repeat check is included.
- Gates, foliage and native props can be inspected on magenta in the review page. The manifest footprints are integration suggestions, not runtime collision tests.
- Canopy sorting/occlusion still needs Claude’s integration. Use the trunk footprint rather than the whole tree image as solid geometry. Keep players readable under canopies.
- The current house fronts are intentionally untouched; some of their existing foundation colors remain sage. The new lawn plates and foliage use the approved outdoor greens.

No game code, source assets, navigation, spawn logic or version numbers changed. Published as art and docs only. Stop for Rami review before integration.

## New brief follow-ups on main V. 2.29.1

This kit was made against the earlier Job 3 brief at 62c6b89. The updated brief on main adds work that is **not included** here: four-sided two-row tree boundary plates and corners; fourteen separate backyard furniture sprites and seven plain yard plates; WALL/BREAKABLE/WALK-THROUGH categories and matching visual affordances; 96 px gates/gaps. The current decorative tree line is 832×160 and the fence cells are 64 px. Keep those distinctions in mind before integration. These additions remain a separate art follow-up; no runtime was altered to accommodate this older kit.
