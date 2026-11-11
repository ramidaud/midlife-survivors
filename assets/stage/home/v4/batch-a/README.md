# Maple Hollow painted redo: Batch A

For Rami review. Art and docs only. No runtime, balance, navigation, spawn, camera or version changes. Batch B is not started.

## Delivered

- Four containing wall sides: north/south 832×256; west/east 256×832. Four 256×256 corners. Optional canopy-only layers retain exact offsets.
- Six fall trees: red maple 160×192 (approved sample unchanged), orange maple 144×176, gold oak 160×192, yellow birch 128×160, bare oak 128×160, half-turned maple 144×176.
- Pines: 64×96, 80×120, 96×144. Eight 64×64 shrub/hedge pieces, separate PNGs and a 512×64 atlas.
- `manifest-batch-a.json` has WALL categories, local foot points and core/trunk floor footprints. Tree crowns are not colliders. Continuous wall cores, not isolated wall trunks, contain the map. Foreground canopy layers are optional and non-solid.

## Painted workflow

The original Batch A paintings supply the approved wall sides, five new fall trees, pine set and shrub set; four new contextual paintings replace the corner set. The red maple is the approved Step 0 native export. No rejected v3/boundary raster is used as a production input.

Imagegen did not honor exact requested dimensions. Unchanged generated sources and actual sizes are retained in `sources/`; each is fitted or cover-cropped proportionally with nearest-neighbor to its exact 8× working canvas, then reduced using the most common RGBA color in each 8×8 block. No stretching or smoothing. Color mapping separates foliage, evergreen, paper/bark and warm wood families before choosing palette tones.

The four corners were repainted individually after Rami's review. Each painting uses a fixed 512×512 native guide containing the two approved neighboring wall sides and a blank 256×256 target quadrant. The whole context is normalized uniformly to its 4096×4096 working canvas, then only that target quadrant is extracted and reduced by 8. There is no silhouette crop or enlargement of corner trees. Neighboring-side pixels are not taken from the generated output and remain unchanged in production.

Join acceptance is visual: inspect `checks/assembled-wall-hero.png` and the four `checks/join-*-v2.png` close-ups. The scale, tree continuations and ragged inner edge are checked together, without edge-pixel equality as a success criterion. Core footprints for the revised corners follow the dense painted region and leave the ragged fringe non-solid. Pine and hedge work is unchanged.

Rami approved one additional autumn gold, #D8AD4A, in this chat before export. The swatch board shows it beside the existing 20 colors. No other new colors are used.

## Review and checks

Open `review.html`: old/new at 1× and 4× for every piece, native/2× hero checks, assembled wall, core rectangles, repeats and 1280×800/390×844 static art mockups. Previous v3 trees and shrubs appear only in the comparison folder. There was no approved matching four-sided wall to compare, so the decorative old tree strip is clearly labeled as context, without pretending it is an equivalent plate.

`validation-batch-a.json` records dimensions, allowed colors, binary alpha, zero transparent core holes and unchanged approved artwork. Corner join acceptance is the assembled visual review. Runtime collision, camera bounds and canopy sorting remain for Claude to integrate and playtest. Camera must remain inside the containing wall.

Next after Rami approves this PR: Batch B furniture, plain yards, props, fences/gates, decals and two 512px lawns. Flowers and bare patches must be unevenly distributed to avoid a repeat grid.
