# Job 2: fill the big house

Ready for Rami’s art review. Art and suggested placement data only. No game code, source furniture, room geometry, doors, stairs or version numbers changed. Job 3 has not started.

Open `review-house2-fill-v1.html?nostats=1`. It includes before/after room views, native 1280×720 and 390×844 camera windows, whole-floor comparisons, and all 50 pieces beside the real 56×60 hero at 1×, 2× and 4×.

## Art

- `house2-fill-v1.png`: transparent 2048×1024 native atlas, 50 reusable pieces with 4 px gutters. `house2-fill-v1.json` gives each rectangle, size, foot point, solid footprint, layer and suggested rooms.
- Five floor textiles at the requested sizes: living rug 320×200, dining rug 280×200, bedroom rug 300×180, hall runner 64×400 and entry mat 96×64. All are non-solid.
- Kitchen and breakfast: 160×72 island/stools, four 64 px cabinet modules, fruit bowl, fridge papers/magnets, 96×80 table with four chairs, high chair and window plant shelf.
- Garage: three 128×96 storage shelves, pegboard, recycling bins, totes, freezer, two bikes, side-on shelving, tool drawers/case, oil and tire decals.
- Shared dressing: abstract framed pictures, book/plant shelf, clock, coat hooks, mirror, chore chart, 32 px north wall faces, corner/baseboard modules, three plant sizes, two lamps, basket, toy bin, laundry, shoes, unmatched sock and one toy brick. The laundry gag uses clothesline/basket pictograms, no words. The chore chart’s checkmarks all sit in one column.

## Assembled preview and placement

`house2-fill-layout-v1.json` proposes additions to the current `src/data/house-v2.js` layout. It does not replace runtime data. All current furniture is reused at native size in the review PNGs. The downstairs desk stays downstairs, and the existing living-room setup, twin bassinets and Abe’s music room are retained.

The island is a peninsula beside the left kitchen counter, with the stools tucked in. Its right edge ends at x584, leaving 144 px before the existing right counter at x728. The garage’s side-facing shelves keep their floor footprint close to the wall. A 96 px strip beside the minivan and the upstairs hall is clear of new furniture footprints. North wall faces stop at existing door gaps.

`house2-fill-floor1-before-v1.png` / `-after-v1.png` and the equivalent floor 2 files show the full layouts. The `-hero-v1.png` files show an actual-size hero for scale. `house2-fill-checks-v1/` contains a separate 4× check for every new piece beside the hero.

## Checks and limits

- Atlas: 17-color palette, binary RGBA alpha, no magenta or off-palette foreground colors. Native integer drawing throughout; no resized generation or nearest-color snapping.
- Suggested placement: no new solid footprint overlaps a door; every art rectangle stays inside its floor canvas. Two representative 96 px strips are clear. This is static geometry checking, not a full navigation or collision playtest.
- Density is recorded explicitly in `house2-fill-validation-v1.json`. The main garage camera has 19 foreground pieces, including 14 solid furnishings. The downstairs living/dining view is denser: 44 pieces including wall/decal details, 25 solid furnishings. Wall modules are excluded from those counts. Review that balance before integration rather than treating every camera as exactly 20 objects.
- Browser review loaded all 50 pieces and both floor comparisons; desktop and phone camera controls worked. No game run or telemetry was sent.
- Private photos remain in `private/home-photos/`; no photo, face, personal writing or brand was copied into the delivery.

The built-in image tool supplied a furniture style study. The final atlas was drawn directly on its native grid with explicit material colors, not shrunk from that study. The prompt and construction constraints are saved in `house2-fill-v1-prompt.json`.

Saved locally for review. Nothing committed, pushed or integrated. Claude will choose placements, register collision footprints and playtest after approval.
