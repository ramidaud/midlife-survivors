# Maple Hollow Elementary, art for review

November 13, 2026. Fifteen painted pieces for the Elementary brief. Open [review.html](review.html). Claude places the approved art afterward; no game code, version, deployment or runtime placement changes are included.

## Assets and scale

School front 1100x560, flagpole 48x256, school sign 256x128, pickup lane 512x1024, two distinct minivans and one SUV 80x144 each, slide 192x160, monkey bars 224x128, merry-go-round 160x128, four-square 256x256, hopscotch 96x320, USA map 320x224, bike rack with two bikes 160x80, lost-and-found bin/sweater 64x64.

Every piece has a native 1x comparison beside the **full unscaled 56x60 hero frame**, including its transparent cell margins. The hero is never normalized to 48px. Optional detail images enlarge by exactly 2x with nearest-neighbor pixels. School subjects are new, so existing swing/chair sprites are labeled as style references rather than fictitious old versions of these assets.

The school has one story, a clock, decorated classroom windows and an empty sign plate. The freestanding sign’s board is also blank. Native rectangles for adding game text are recorded as `blankTextArea` in the manifest. Vehicles are separate sprites; the lane contains only flat asphalt, a crosswalk, arrows and lane paint. The sweater bin is shorter than the painted hero and has the cream top highlight.

## Painting and reduction

Built-in imagegen painted each subject independently using the current v4 yard kit/street as references, neutral white balance, upper-left light and lower-right shadows. Full prompts are in `generation-prompts.json`; targeted edits that flattened the two court markings are recorded in `revision-prompts.json`. Untouched original generated paintings and earlier court studies are in `sources/`.

The school and lane use exact **2x working rasters** (2200x1120 and 1024x2048). Other pieces use exact **3x working rasters**. One exact 2x2 or 3x3 RGBA block-mode pass creates each native pixel, followed by intentional material-family mapping to the existing 21-color palette. Roof/asphalt/ink, brick, wood/cream cloth, foliage, teal metal, pink and lavender are mapped within named material families. At least three tones remain in major materials. Decals have no dark silhouette ink or floor shadow.

The generator returned variable actual dimensions despite the requested 2x/3x sizes. Original dimensions, alpha crop, fit and exact working dimensions are recorded per piece. As with the approved yard workflow, proportional normalization creates exact working canvases. Only the rectangular lane is fitted independently in width and height to fill its requested ground plate. No reduced sprite is upscaled to make its final asset, and no piece is built from code shapes.

`build.py` reproduces reduction, mapping, metadata and review images from the retained paintings. Run with Python 3, Pillow and NumPy; output goes to a fresh `deliver/` subdirectory, without overwriting reviewed exports or making generation calls.

## Feet and collision proposals

`manifest-elementary.json` records native sizes, kinds, a `feetLine` y-coordinate, `footPoint: [x,y]`, and `footprints: [[x,y,width,height], ...]`. Coordinates are local native pixels. The school’s solid rectangle covers the lower facade base; its top is drawn behind the hero. Pole/sign/furniture footprints stay near their ground bases. Top-down vehicle footprints cover the ground projection of the body, rather than only a rear bumper. Walk-through pieces have empty footprint lists.

The footprint overlays are **review annotations only**: red rectangles show proposed collision, cream shows the feet line and orange marks the foot point. These marks are never added to exported sprites. Claude must verify collision, depth sorting, 96px passages, two exits and 224px main routes during integration.

The native pickup-queue preview shows the three independent vehicles over the lane. It leaves a wide left side for a route; it is an art study, not a live map layout.

**Placement note:** the 512x1024 lane cannot fit wholly inside the brief’s approximate y150..950 school reservation (800px tall). Keep the asset at its requested native size and extend its placement into available ground during Claude’s pass. The building and other art are not shrunk to conceal this mismatch.

## Checks

`validation-elementary.json` verifies all 15 sizes, allowed reduction factors, exact working rasters, approved RGB palette, binary alpha/clear borders, bounded foot data, correct empty/solid footprint kinds and byte-identical regeneration from each working raster. Color counts are a broad sanity check; actual material shading, subjects, blank boards, hopscotch digits 1 through 10, shadow direction and native hero scale are reviewed visually.

`checks/asphalt-material.json` compares the lane and existing street patches: both use **#526078** as their dominant asphalt. Its companion 1x image shows the material side by side. The USA decal is a stylized painted playground map with Alaska/Hawaii insets. Runtime boss combat and navigation are outside this art PR.
