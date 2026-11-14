# House repaints, round three

Ten new painted variants from `docs/handoffs/codex-house-fixes-round3.md`. Nothing is placed in the game. The live ground-floor/upstairs assets, atlases, layouts and runtime files are untouched. PR #11 was already approved and merged; this package is a follow-up review.

Open `deliver/review.html`. Four room mock-ups use the exact saved positions in `docs/plans/house-layout/rami-layout-nov13.json`: living, dining/desk, kitchen and Abe's room. Each has native and exact 3x nearest-neighbor views, a 56x60 hero, a footprint overlay and a clearance report. Canvases extend beyond the floor where needed, so large wall art is not silently cropped.

| Piece | Previous canvas | New native canvas | Painted change |
| --- | --- | --- | --- |
| Galaxy TV | 92x120 | 184x240 | 2x canvas, slanted east-wall view |
| Electric console | 144x56 | 216x84 | 1.5x canvas |
| Kitchen back counter | 160x60 | 240x90 | 1.5x canvas, rear-view freestanding island with three south stools |
| Bird of paradise | 80x100 | 64x80 | Smaller variant beside the arched lamp; other instance retains original art |
| Camera/book shelves | 216x100 | 194x90 | 0.9x canvas; 194.4px width rounded to 194px |
| TV cube shelf | 64x144 | 96x216 | 1.5x canvas, west-facing east-wall view |
| Record dresser | 204x76 | 306x114 | 1.5x canvas, rear view |
| Hamper | 48x52 | 72x78 | 1.5x canvas |
| Guitar amp | 80x64 | 60x48 | 0.75x canvas, painted facing east |
| Abe's rug | 320x224 | 224x320 | Painted long way north-south |

Canvas dimensions include transparent margins. Paintings are fitted proportionally to exact 3x working rasters and reduced by a whole number with the established material-family palette mapping. No export is stretched, rotated or flipped. `prompts.json` records the built-in imagegen calls and the TV/island width refinements. Ten selected source paintings appear exactly once in `sources/`.

The manifest includes feet lines, foot points, updated footprints, previous art links and native comparisons with the hero. The island has separate proposed footprints for its cabinet and each stool. Reused room pieces link to their approved exports, including the oak coffee table. Their other editor scale/rotation requests are recorded but not applied; only the ten pieces in this brief are repainted.

## Layout constraints to review

The saved editor layout is authoritative here. The runtime currently uses some different route nudges. This review does not silently import those nudges or move Rami's pieces.

- Living: the saved layout does not connect the checked patio and dining openings with a 96px square. A lamp and toy-bin footprint also overlap.
- Dining/desk: the saved right-side desk arrangement does not connect the actual north living-room opening to the south hall opening. Some proposed table/chair/plant footprints overlap.
- Kitchen: the 96px door route passes, with no overlapping footprints or disconnected clear pockets.
- Abe's room: both doors connect on the left, but clear pockets elsewhere are cut off. The larger hamper overlaps the record-dresser footprint. This is not a whole-room clearance pass.

The doubled TV extends beyond the living floor's east edge; Abe's TV shelf and vertical rug also overhang their floor rect. Those images are shown in full and reported separately from collision. Camera shelves start 4px above the 128px north-face extent, following the saved position.

`deliver/route-checks.json` distinguishes door connectivity, disconnected clear positions, footprint overlaps, floor exceptions and image overhangs. The overlay marks the floor edge and actual door intervals. `deliver/mockups/room-layout.json` preserves the editor's views/placements/routeChecks format and every saved source coordinate.

## Rebuild

With Pillow and NumPy available, run `python3 build.py`, then `python3 audit.py` here. These scripts write only this review package. No game run, stats or leaderboard submission is used. Native image QA covers the four rooms; browser preview remains unverified after the earlier local-file policy block.

Rami reviews the art and layout constraints before Claude places approved variants or adjusts the saved layout.
