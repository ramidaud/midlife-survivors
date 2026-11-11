# Home interior v3: photo-based local review

These two floors replace the generic v2 furnishing while retaining its geometry. Art and data only. Nothing committed, pushed or wired into the game; all v2 files are retained.

- `interior-floor1-v3.png`,416x1392, plus JSON. Your desk is **downstairs in the dining nook**, beside the window and woven-basket plant. The round wood table has cream chairs. The kitchen is galley-style white cabinetry with oak trim, white stove/microwave, magnet fridge, steel double sink, a patterned runner and abstract art. Living room: two cream sofas in an L, leather recliner, slatted media console, racing rig, two empty baby swings, mirrored tiled fireplace, orchids, balloons, lamp and blind-covered back door. Entry: storage bench, basketball, shoes and louvered closet.
- `interior-floor2-v3.png`,416x928, plus JSON. The front bedroom is **Abe's room**, with dark sleigh bed, music desk and microphone, TV/cube shelf, record player/dresser, guitar, controller canvas, orbit poster, unbranded car posters, slatted lamp, toy traffic light, closet hoop and music-note neon. Russet/slate/lavender lighting is baked only into its floor rectangle. Master bedroom has the upholstered bed, wooden crib and empty double bassinet by the window. Existing bath, closets and stairs retained.
- `rami-desk-v2.png` already matches the desk shape in photo01. Reused unchanged downstairs, so no duplicate desk-v3 file was necessary. The new mesh chair and plant complete the nook.

## Reusable derived art

Four transparent native prop atlases are included: `living-photo-props-v3.png`, `abe-photo-props-v3.png`, `house-photo-support-v3.png` and `home-detail-props-v3.png`. Their cells are192x192 with8px minimum padding. `manifest-interior-photo-props-v3.json` names every piece and its art rectangle. Larger furniture is registered to the room rectangles during composition; the floor JSONs are authoritative for rendered bounds and floor footprints.

The source photographs are **not included**. They remain in the gitignored private folder. Generation prompts record reference paths/numbering only. The ledges contain abstract color blocks, not real photos or faces; no congratulations poster, names, licence plate or logos are reproduced. TVs show abstract shapes, and the neon sign is a musical note without lettering. The deliverable review page loads generated game art only.

## Checks and limits

Both canvases, all wall rectangles, door openings and stair regions match v2. Bounds and door/wall tests pass. PNGs use the shared12-color palette and binary alpha; ground/furniture interiors are opaque, outside the floor outlines and isolated props is transparent. Palette-limited stepped lighting gives the red/blue room mood without introducing bright RGB neon colors. All other rooms remain daylight.

`checks-interior-v3.json` contains the validation record. Review `review-interior-v3.html`, the before/after image, room-detail board and actual56px-hero scale check. These are art reviews, not a runtime navigation or collision playtest. The baked plates and footprint data still need Claude's integration and a playtest. Overhead fan/balloons and wall dressing are marked non-solid; they may need separate draw layers if Claude decomposes the plates later.
