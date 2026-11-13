# Upstairs, house job 2 (Codex, 2026-11-13)

Art review only, on `codex/house-upstairs-art`. Nothing placed in the game. No runtime or version change.

- 37 new painted pieces, plus the warm light-oak coffee-table repaint, in `assets/stage/home/v4/house-upstairs/`. Source paintings appear once in `sources/`. Built-in imagegen prompts and the width-correction prompts are included.
- Nine room mock-ups: main bedroom with the twins by the window, Abe's room, bathroom, walk-in closet, linen, utility, hall, stairs and Abe's closet. Every room has the 56x60 hero, native and exact 3x nearest-neighbor views, a 3x footprint overlay and a route result.
- All nine rooms pass a 96px square check at their actual doors. Abe's room connects both exits and keeps a 224px open square. The existing 144px hall cannot meet the 224px main-route target; it stays clear. One-door rooms retain one door.
- North-wall displays stay inside the 128px wall face and clear of openings. The hall's north door leaves too little wall for a frame, so its decor is painted edge-on on the east wall. No art rotation, flipping or scaling is applied. East TV, side dresser and rear-view south dresser are painted for their walls.
- Coffee table retains the exact 186x42 canvas, alpha silhouette, footprint, base and prop pixels. Only its connected light tabletop material receives the painted three-tone oak texture. The live table is untouched.

Open `assets/stage/home/v4/house-upstairs/deliver/review.html`. The manifest, coffee-table checks, source links and `deliver/mockups/room-layout.json` are linked there. Layout data follows the ground-floor editor format.

Private house photos were not attached to this chat. These proposals follow the written room brief and the approved public kit. No people, faces or license plates are included; ABE tiles are the explicit name exception. The newer no-plates rule supersedes the older MIDLIFE plate request.

Validation covers exact reductions and previews, palette/alpha, footprint bounds, non-overlapping footprints, wall/door clearance, source uniqueness and review links. Native image QA completed for every room. The browser blocked the local `file:` review URL, so responsive browser checks were not completed. No game run or telemetry was used.

Rami reviews the rooms and moves anything needed in the House Layout Editor. Claude places approved pieces afterward.
