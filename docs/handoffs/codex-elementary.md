# Codex brief: Maple Hollow Elementary (Nov 13)

Elementary is the first area of the full Maple Hollow map (`docs/plans/home-map-v3.png`). It opens at age 44, and the Fifth-Grade Math Homework boss fights you on its playground at 45. It's live now with yard-kit placeholders (swings, sandboxes, soccer goals, trees). These pieces make it a school.

## Rules (from CLAUDE.md, "Pixel rules" and "World rules")
- Painted, then reduced: paint at 2x or 3x the final size and reduce by that number, keeping at least three tones per material. Never built from code shapes.
- Same style, palette and light direction as the v4 yard kit (`assets/stage/home/v4/yard/`). Peak fall. Neutral white balance, no sepia, golden haze or film-look tint.
- Each piece is its own transparent PNG with a feet line and a solid footprint in the manifest, like `manifest-batch-c.json`.
- Walls (taller than the hero): full dark outline, heavy shadow. Breakables (hero height or smaller): cream highlight on top. Walk-through decals: no outline, no shadow.
- Compare each piece with the 56x60 hero at real size before handing it over.

## Pieces (final sizes in px)
1. **School building front** (wall), about 1100 x 560: one-story brick school with a main entrance, a bank of windows with paper leaves and turkeys taped up, a clock, and a blank sign plate above the door. Solid at its base, so you walk behind its top.
2. **Flagpole** (wall), about 48 x 256.
3. **School sign on a brick base** (wall), about 256 x 128, blank letter board (we add text in game).
4. **Pickup line**: a 512 x 1024 drop-off lane in the same asphalt as `street-wide-v4-a.png`, with a crosswalk and painted arrows (walk-through), plus two minivans and an SUV idling (walls, about 80 x 144 each, top-down like the parked cars).
5. **Playground**: slide (wall, about 192 x 160), monkey bars (wall, about 224 x 128), merry-go-round (wall, about 160 x 128).
6. **Blacktop decals** (walk-through): four-square court 256 x 256, hopscotch 96 x 320, painted map of the USA 320 x 224.
7. **Bike rack with two bikes** (wall), about 160 x 80.
8. **Lost-and-found bin with a sad sweater** (breakable), about 64 x 64.

## Placement (for Claude, after art approval)
The building, flagpole, sign and pickup line go in the open lawn at the top left of the area (about x 150 to 1350, y 150 to 950 inside the 2960 x 2752 area). The playground stays where the swings are now.
