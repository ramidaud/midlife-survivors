# Codex brief: roads that run north-south, crossings, and the Woods (Nov 13)

Two jobs for Maple Hollow. The town map is `docs/plans/home-map-v3.png`.

## Rules (same as PRs #7, #8, #9)
- Painted, then reduced by a whole number, at least three tones per material. Never built from code shapes.
- Match the v4 street plates (`assets/stage/home/v4/street/street-wide-v4-a.png` and `-b.png`) and the yard kit exactly: same asphalt (#526078), curb, sidewalk, parkway grass (#9BAE73), outline and light direction. Peak fall. Neutral white balance, no sepia or golden haze.
- Each piece is its own transparent PNG with a feet line and footprint in a manifest; a native 1x comparison with the 56x60 hero; a review page. Open a PR and stop for art approval.

## Job 1: north-south roads and crossings
Today the north-south roads are the east-west plates turned 90 degrees, so the light comes from the wrong side and the parked cars lie on their sides. Where roads cross, the game lays plain asphalt from an old 32 px kit, a shade lighter than the plates.
1. **North-south street plates**, two variants, 512 x 832 each: sidewalk, parkway, a 320 px road with a dashed center line, parkway, sidewalk, the same band as the east-west plates but running up and down, lit the same way. No cars painted in (cars become separate pieces, below).
2. **Four-way crossing**, 512 x 512: the road surface where two 512 px bands cross, with crosswalks on all four sides and curb corners.
3. **T-junctions**, 512 x 512, all four ways (a road ending into another from the north, south, east, west).
4. **Parked cars seen from above, facing up/down**, three colors, about 80 x 144, matching the cars painted in the east-west plates (walls).
5. **Manhole and storm drain** decals (walk-through), small.

## Job 2: the Woods (Full Life only, past 65)
The top-right area of the map, 2960 x 2048 px. Reference: `docs/plans/reference/twin-stones-forest.png` (Rami's Nov 8 pick).
1. **The Twin Stones**: two standing stone markers carved "I" and "II" (walls), about 96 x 160 each, mossy.
2. **Forest floor** tile (walk-through), 512 x 512: leaf litter and moss on the lawn color, so it blends at the edges.
3. **Forest trail** tiles (walk-through), 512 x 512 straight and a curve: packed dirt with roots.
4. **Fallen log** (wall), about 256 x 96; **mossy rock cluster** (wall), about 160 x 112; **mushroom ring** (walk-through), about 128 x 96; **fireflies** (a 4-frame loop, about 32 x 32, drawn over everything).
5. **Evergreen** (wall, like `tree-maple-orange-v4.png` but a pine), about 144 x 192, and a **red maple** and **yellow birch** variant of the orange maple.

## Order
Job 1 first (it shows all over town), then Job 2.
