# Maple Hollow painted Batch B

Art-only review. 79 separate native PNGs: 21 backyard furniture pieces, 16 yard props, 8 key-hunt props, 5 toy-brick densities, 8 leaf decals, 12 fence/gate modules, 7 plain yard plates and two 512x512 lawns. Four convenience atlases accompany the separate sprites.

Open [review.html](review.html) for native old/new comparisons, optional 4x comparisons, hero scale, assembled yards, desktop/phone art mockups and self/mixed lawn repeats. New subjects without an old match are labeled honestly. Old baked-yard crops retain their ground for context.

## Painted method

Built-in image generation paints the subjects. Original paintings are retained unchanged in sources/. The generator did not honor exact requested raster sizes. As in the approved sample, proportional fitting or cover cropping normalizes these paintings onto exact 8x working canvases in working-8x/. Every final pixel then comes from one exact 8x8 block-mode reduction, followed by material-family palette mapping. No sprite was built from geometric code shapes. The four approved sample props are reused unchanged.

The manifest records actual source dimensions, crop rectangles, working canvases, native dimensions, foot points, floor footprints and WALL / BREAKABLE / WALK-THROUGH categories. The 21-color palette includes Rami's approved autumn gold. Isolated sprites have binary-alpha transparency; ground is opaque. Flat leaf decals have no external silhouette ink.

## Gates and ground

Fence modules are 64px. Open gate art uses the painted pillar components with a completely clear 96px center. Closed and open variants are separate sprites. Footprints are proposed art metadata for Claude to integrate, not tested collision bodies.

The seven 416x448 yard plates contain only ground, flat paths, patios and dirt. Furniture is independent. Suggested layouts leave a 96px cross-yard lane and a 96px right return, with two exits. These review recipes do not alter the game.

Both 512px lawns were repainted after rejecting evenly spaced tufts. Uneven grass islands, flowers and bare flecks come from the paintings. Continuous painted edge bands use irregular minimum-error pixel cuts to share seamless edges, with no smoothing, gradients or procedural foliage. Inspect the mixed 4x4 board as well as self repeats: matching edge pixels alone is not the visual acceptance test.

## Validation and limits

validation-batch-b.json verifies all 79 dimensions, approved palette and binary alpha, opaque grounds, exact 8x working dimensions, all eight A/B edge pairings and both 96px gate spans. Native assembled yards, gate joins and mixed lawn seams were inspected by eye.

Desktop 1280x800 and phone 390x844 images are static native art mockups. No runtime navigation, spawning, performance, balance, game code or version changes are included. Rami reviews this PR before integration.
