# Codex brief: ground-floor repaint at house scale (job 1b)

Continue on the PR #10 branch (`codex/house-ground-floor-art`). Rami approved the art direction of PR #10. This pass repaints the furniture at one new scale and fixes every piece that was turned or seen from the wrong side. **Rami's own layouts replace the room mock-ups.**

## 1. Where things go: Rami's layouts
Rami placed every room himself in the House Layout Editor. Use these renders as the placement map (hero shown for scale):
- `docs/plans/house-layout/living.png`
- `docs/plans/house-layout/dining-desk-shared.png`
- `docs/plans/house-layout/kitchen.png`
- `docs/plans/house-layout/entry.png`

Coordinates are in `docs/plans/house-layout/placements.json` (room-relative, y < 0 is the north wall band, 128 px tall). Treat the positions as intent, then tidy: snap to the grid, keep 96 px gaps where the hero passes, keep two ways out of every room.

## 2. One scale for the whole house
Rami's edits enlarged almost everything 130-150%. Decision (Rami, Nov 13): **all furniture is painted about 1.4x its PR #10 size**, measured against the hero (56 x 60 px, unchanged). The hero must not feel tiny, so:

| Kind | Height vs hero (60 px) | Examples |
|---|---|---|
| Things you sit at or lean on | never taller than the hero | chairs, sofa back, counters, tables, desk, console |
| Low things | under half the hero | coffee table, rugs, baskets, toy bin, shoe rack |
| Tall things | up to about 1.7x the hero | doors, fridge, floor lamps, bookcases, curtains, bird of paradise |

Paint every piece at its final size (whole-number rule). No stretching, no per-piece percentages.

## 3. Repaint from the right angle
Turning pixel art 90 degrees never looks right. These were rotated in the editor and need a real repaint from the camera's view (north walls face-on, side walls seen from above, south side seen from behind):
- **Living:** TV and fluted media console on the **east wall** facing west toward the sofa. Racing sim rig turned to face the TV. Second cream sofa becomes a **love seat on the south side**, seen from behind, facing north.
- **Dining/desk:** electric console on the south side, seen from behind.
- **Kitchen:** see section 5.
- **Entry:** storage bench against the west wall, seen from above.

## 4. Room notes from Rami
**Living**
- Add the **babies' two bassinets** in the corner between the sofa and the wall shelves.
- Add **side tables with lamps** on both sides of the love seat (the new side-table lamp is a good start).
- Photo ledges: paint as **one taller two-row unit**, with new items on the second row.
- Pothos hang in both windows (hanging plants).
- Blanket basket needs more contrast against the rug.
- Coffee table about 1.2x, not bigger. TV may be big, but it has to read as a TV on a wall.

**Dining and desk**
- **Standing desk**, not an L desk. Keep the monitors, shelves, cameras and moon print.
- **Windows on the north and west walls.**
- Four matching dining chairs, evenly spaced around the round table, on the rug.
- Shoe rack and laundry basket move out (see entry and laundry closet).

**Entry**
- Shoe rack lives here, next to the storage bench and coat hooks.

**Laundry closet**
- Laundry basket lives here.

## 5. Kitchen: full repaint as one set
Rami: "the room looks a mess, everything will probably need to be re-rendered." Paint the kitchen as one matched set, all from the same viewpoint:
- North wall: sink run (double sink, dish rack, dishwasher) under a full row of upper cabinets, stove with microwave above next to it, more counter in the northeast corner.
- A long counter along the bottom left (seen from behind, south side).
- Fridge in the southeast corner, facing into the room (magnets stay).
- Patterned runner down the middle.

## 6. Edge art (the "empty frame" problem)
The yards feel finished because their edges are packed. Give every room the same:
- Baseboards and wall trim on side walls, not flat cream strips.
- Something against every wall stretch longer than about 160 px (furniture, a plant, a basket, art).
- Corners get a piece (plant, lamp, bin).

## 7. Deliver
- Repainted pieces plus the new ones (bassinets, love seat, standing desk, two-row ledges, kitchen set, windows).
- One mock-up per room built from `placements.json`, at 3x nearest-neighbor, hero included.
- Footprint check and the 96 px route check per room.
- Nothing placed in the game; Claude places after Rami approves.
- Neutral white balance, no sepia or golden haze. No people, names or readable personal text.
