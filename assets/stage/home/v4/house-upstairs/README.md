# Upstairs, house job 2

Art review only. Nothing is placed in the game. Claude places approved pieces after Rami reviews this PR.

Open `deliver/review.html` locally. Each room has a native preview, an exact 3x nearest-neighbor preview with the 56x60 hero, a footprint overlay, and a route result. `deliver/mockups/room-layout.json` uses the ground-floor `views`, `placements`, and `routeChecks` structure for the House Layout Editor.

The main bedroom includes the twins' corner by the north window. Abe's room contains the music desk, collectibles, neons and wall displays. The latest privacy rule takes priority over the older plate request: there is no license plate. ABE is the only personal name allowed. No people or faces appear in the art.

## PR #11 room revisions

The current package has 59 upstairs paintings plus the unchanged coffee-table fix. The space poster reads **60 YEARS IN SPACE**, and the gaming neon is a generic game-pad. The shelf's former ghost lamp is a plain globe. Superseded branded paintings and their comparison exports have been replaced in the current tree.

Abe's north wall now runs across the full width, with a painted open oak doorway instead of the carpet cutout. The actual door interval remains in the route check. His desk and chair sit back against the wall; a beanbag, guitar amplifier, large flat rug and clothes fill the left edges. The amplifier stands against the west wall facing east.

The main bedroom has two north windows, art over the bed, a moon print, a silver wall mirror, a broad dresser with its own mirror, a large rug, laundry basket, plant and armchair. The crib moves to the southeast. The middle rug has no collision.

The walk-in closet, hall, linen and utility have distinct pictures and shallow storage, coats, boxes, plants and runners fitted around their doors. `deliver/edge-coverage.json` projects actual painted bounds onto each wall and excludes actual door openings; none of the six revised rooms has an unfilled run over 160px. It explicitly counts flat rugs as furnishing, never as collision.

`placements-review.json` is the current room recipe. `deliver/mockups/room-layout.json` retains the editor's views/placements/routeChecks format. `review-revision-prompts.json` records the new built-in imagegen calls; earlier prompt files are provenance and are superseded where the new requests overlap.

Private house photos were not attached to this chat. Paintings follow the detailed written room descriptions and use the approved public ground-floor art for style. They are proposals for Rami to check, not claims of photo-matched placement.

## Build

Run `python3 build.py`, then `python3 audit.py`, here with Pillow and NumPy available. `prompts.json` and `repaint-prompts.json` preserve the built-in imagegen requests. `generation-plan.json` records each subject, native size, layer and proposed footprint. Built-in imagegen paints each new piece separately; `sources/` contains the original paintings exactly once. Proportional fitting creates exact 3x working canvases; block-mode reduction and material-family palette mapping produce the native exports. The delivered pieces are never scaled, flipped or rotated in mock-ups.

The 128px north wall face uses the approved 96px north wall strip plus an unscaled 32px repeat of its upper plaster. Side walls retain their existing painted strip. Reused ground-floor assets are linked to their original exports and are listed separately in the manifest.

## Clearance

Routes use an exact 96x96 square flood fill against proposed footprints, then match the connected region to actual floor-plan doors. A room with one existing door is checked for access to that door. No second door is invented. The existing hall is 144px wide, so the 224px main-route target would require a separate floor-plan change. Its floor stays clear.

Footprints describe the full floor occupancy of beds, tubs and cabinets, with their raised north edges excluded only where the art overhangs the footprint. Wall decor has no collision. Ground decals have no collision, outline or shadow.

## Coffee table

The additional coffee-table repaint lives in this package. The approved runtime table is left untouched. Its native size, existing footprint and props must be preserved; only the top changes to three-tone warm light oak. The comparison and manifest record the exact checks.

No game code or version change is included in this art-approval PR.
