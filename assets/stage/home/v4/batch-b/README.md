# Maple Hollow painted Batch B

Art-only review. 79 separate native PNGs: 21 backyard furniture pieces, 16 yard props, 8 key-hunt props, 5 toy-brick densities, 8 leaf decals, 12 fence/gate modules, 7 plain yard plates and two 512x512 lawns. Four convenience atlases accompany the separate sprites.

Open [review.html](review.html) for native old/new comparisons, optional 4x comparisons, hero scale, assembled yards, desktop/phone art mockups and self/mixed lawn repeats. New subjects without an old match are labeled honestly. Old baked-yard crops retain their ground for context.

## Painted method

Built-in image generation paints the subjects. Original paintings are retained unchanged in sources/. The generator did not honor exact requested raster sizes. As in the approved sample, proportional fitting or cover cropping normalizes these paintings onto exact 8x working canvases in working-8x/. Every final pixel then comes from one exact 8x8 block-mode reduction, followed by material-family palette mapping. No sprite was built from geometric code shapes. The four approved sample props are reused unchanged.

The manifest records actual source dimensions, crop rectangles, working canvases, native dimensions, foot points, floor footprints and WALL / BREAKABLE / WALK-THROUGH categories. The 21-color palette includes Rami's approved autumn gold. Isolated sprites have binary-alpha transparency; ground is opaque. Flat leaf decals have no external silhouette ink.

## Gates and ground

Fence modules are 64px. Open gate art uses the painted pillar components with a completely clear 96px center. Closed and open variants are separate sprites. Footprints are proposed art metadata for Claude to integrate, not tested collision bodies.

The seven 416x448 yard plates contain only ground, flat paths, patios and dirt. Furniture is independent. Suggested layouts leave a 96px cross-yard lane and a 96px right return, with two exits. These review recipes do not alter the game.

Both 512px lawns were repainted again for this review: small interwoven grass clusters replace the rejected large two-tone islands. Three grass material tones are retained: #9BAE73 base, #83A89A middle and #6D895B shaded blades. Continuous painted edge strips use narrow irregular pixel cuts, with no smoothing or procedural foliage. Inspect mixed 4x4 as well as self repeats: matching edge pixels alone is not the visual acceptance test.

## Validation and limits

validation-batch-b.json verifies all 79 dimensions, approved palette and binary alpha, opaque grounds, exact 8x working dimensions, all eight A/B edge pairings and both 96px gate spans. Native assembled yards, gate joins and mixed lawn seams were inspected by eye.

Desktop 1280x800 and phone 390x844 images are static native art mockups. No runtime navigation, spawning, performance, balance, game code or version changes are included. Rami reviews this PR before integration.

## Added street ends, Nov 11

Two 512x512 dead-end ground caps, street-end-left-v4.png and street-end-right-v4.png, plus two separately extracted transparent barricades. Total native export count is now 83. The 512px band retains its 64/32/320/32/64 cross-section. Matching painted connector strips come from the existing street-wide-v2-a.png; generated native art forms the curved ends. No solid barricade remains baked into the exported ground. Assembly positions and proposed solid footprints are in the manifest. Claude must close the outer curved map boundary during integration.

Both cap connections match the existing band, and the full left-cap/street/right-cap preview was inspected visually. Sources, full prompts, exact 8x working images, native/4x comparisons and joined 1x/2x previews are included. New-subject comparisons show the existing band only as material and scale context.

## PR #4 review corrections

Rami confirmed #9BAE73 as the shared grass base on all seven yard plates and both lawns. Existing paths, patios, soil, leaves and yard layouts remain. The base is a material remap of the paintings, including grass previously exported as slate. The repaint uses the same proportional normalization and exact 8x block reduction described above. New source paintings and full prompts are in sources/revision-*.png and revision-prompts.json. Earlier studies remain only for provenance.

Vertical fences are repainted as straight north-south grid pieces. Their cell-height painted spines stack at x32; corners join those spines to painted halves of the approved horizontal runs at the original frontface height. The assembled fence board verifies the joins visually. Sprinkler and house key are repainted to occupy about40px of their original48px cells, with native hero comparisons.

Checks include prior-PR versus fix at1x/4x, fence-joins-2x.png, readability-fixes-2x.png and shared-grass-nine-plates.png, plus refreshed full comparisons and mixed lawn repeats. Hash validation confirms all other approved native sprites, including both street-end caps and barricades, are unchanged. The two affected convenience atlases were refreshed. No game code or version changes.
