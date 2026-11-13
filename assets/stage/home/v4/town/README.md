# Maple Hollow town buildings

November 13, 2026. One art-only batch for Rami’s review: **Strip Mall first, Town Square second, Community Center third**. Open [review.html](review.html). Claude places approved art afterward. No game code, version, deployment or runtime placement changes are included.

## What is included

37 PNG pieces: **34 new paintings and 3 approved yard pieces reused unchanged**.

- Strip Mall: grocery, bank, pizza, pharmacy and dry-cleaner fronts at 416x384; a 2496x96 paved walkway and separate 2496x96 overhead canopy; 512px parking-stall and drive-aisle tiles; four 80x144 car colors; cart corral, runaway cart, light pole, curb island/tree and trash can.
- Town Square: arcade 832x448, coffee and hardware fronts 416x384, fountain 384x320, brick-plaza and concrete-pad tiles 512x512, quarter pipe, grind rail, two 160x288 food trucks, a small bench and planter. Bench/planter sprites can be instanced to furnish the square.
- Community Center: hall 1100x560, potluck folding table with cloth/casserole, bounce house, sawhorse barricade, cooler and separate string-light posts/strand. Tables and barricades can be instanced for the plural party pieces. The approved yard cooler and both light PNGs are copied byte-for-byte, with source paths and hashes in the manifest.

All sign plates are blank. Shop windows carry generic contents that distinguish their subjects. There are no brand names or logos. The hall has its bulletin board; the bank has columns and its night-deposit slot; the arcade has visible game cabinets.

Every piece has a native 1x comparison with the **full unscaled 56x60 hero frame**, including its transparent cell margins. Larger pieces scroll within their own frame. The detail links enlarge by exactly 2x with nearest-neighbor edges. Reference house/chair images show the existing style, not invented old versions of the new buildings.

## Painted method

Built-in imagegen painted each new subject individually using the v4 house fronts, yard kit and street as references. Full prompts and requested dimensions are in `generation-plan.json`. The cool-gray concrete correction has its prompt in `revision-prompts.json`; the earlier study is retained alongside the untouched original sources.

The generator returned variable actual sizes despite the requested dimensions. Each source is fitted onto an exact 2x or 3x working raster, then reduced by **one exact 2x2 or 3x3 RGBA block-mode pass**. Original source size, crop, fit, working size and reduction factor are recorded per piece. Material families are selected deliberately before tones: cream/wood, brick, foliage, roof/asphalt/ink, teal metal, pink/lavender. Neutral white balance, upper-left light and lower-right shadows match the yard kit.

Buildings share a three-pixel lower canvas margin, so their native base lines align. Other isolated subjects are proportionally fitted, except the rail’s recorded fit in both axes. Floors use rectangular painted-surface crops. The brick crop follows the painting’s repeating bond phase. The neutral concrete uses slate as its main tone, preserving the painted low/high marks in a three-tone cool family. Existing upper metal glints on the breakable cart/trash can map to cream, preserving their painted geometry.

The two long walkway strips are **six copies of painted 416x96 modules**. Full exact 2x working strips and the original module working images are retained. Opposite painted edge blocks are copied before reduction to align repeat edges. The four square ground tiles have native 2x2 repeat previews. This copies and cuts paint; no world artwork is built from code shapes.

Rectangular ground plates are intentionally opaque so repeated tiles do not expose gaps. Isolated props and overhead layers have binary-alpha transparency. Sparse source-alpha pinholes in an otherwise opaque ground crop (at most 0.1%) copy adjacent painted pixels before opaque coverage normalization; raw sources remain unchanged. The manifest records this cleanup.

`build.py` contains reduction/material helpers; `prepare.py` reproduces the exports, manifest and review files. Requires Python 3, Pillow and NumPy. Run `python prepare.py` from this folder; it creates a fresh `deliver/` subdirectory without overwriting reviewed exports or making image-generation calls. Keep `reference/`, `sources/`, `reused/` and `generation-plan.json` beside the scripts.

## Feet, footprints and layers

`manifest-town-buildings.json` records `feetLine` (local y), `footPoint` [x,y], `footprints` [x,y,width,height], kind, native size and source provenance. WALL/BREAKABLE pieces propose ground footprints; WALK-THROUGH pieces have none. Top-down car/truck footprints follow their ground projection, not just the rear bumper.

The canopy and string-light strand use **renderLayer: overhead**, with no floor collision. The canopy is attached to the storefront row rather than adding blocking posts. Its final placement and visibility around the hero belong to integration. The main row preview leaves the canopy off to show the storefront art clearly; a separate overlay study shows it above the row. These are native art assemblies, not live map layouts or navigation tests.

Red rectangles, the cream feet line and orange foot point appear only in separate footprint-overlay review images. They are never baked into exported sprites. Claude verifies real depth sorting, doors, 96px passages, two exits and 224px main routes after approval.

Five storefronts occupy 2080px of the 2496px area width. The remaining 416px can support a side exit/alley when the final layout is placed. Sizes for unspecified props were chosen against the existing hero and yard furniture; all chosen sizes are explicit in the manifest.

## Validation

`validation-town-buildings.json` checks all 37 native dimensions, approved RGB palette, binary alpha, foot data, empty/solid footprint kinds, cream top highlights for breakables, allowed 2x/3x working dimensions and exact regeneration from working rasters. The three approved reuses are hash-checked unchanged. Repeated ground edges match; native repeat images and all subjects are also inspected visually.

Color counts are a sanity check, not an automatic material-shading judgment. The gallery and 1x comparisons are the visual acceptance check. Art approval and runtime integration remain pending.
