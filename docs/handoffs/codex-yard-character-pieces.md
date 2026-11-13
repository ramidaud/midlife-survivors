# Codex brief: Maple Hollow yard character pieces (Batch C)

Nov 12, 2026. Rami: "make sure all the yards retain their character, that's my favorite part visually of the stage."

## Why this batch

The eleven neighbor yards are being rebuilt like Rami's backyard (V2.29.10): a plain ground picture plus every standing thing as its own sprite with a foot point and footprint. Batch B covers most of the furniture, but several **signature pieces** from today's painted yards (`assets/stage/home/v2/backyards-v2.png`) have no sprite yet. Without them, three yards lose what makes them recognizable. This batch fills only those gaps.

Compare against `backyards-v2.png` (six 416 x 448 cells, left to right: young family, retirees, grill master, fixer-upper, HOA president, Halloween). Match each piece's look and size there.

## Pieces to paint

**Every yard (the autumn frame)**
- Orange autumn shrub, 3 variants, about 64 x 48. WALL (a low bush you bump into). These line the hedge and corners and are the biggest part of the stage's look.
- White flower clump, 2 variants, about 32 x 32. WALK-THROUGH.

**Grill master**
- String lights on two posts, about 160 x 64 wide. The posts are WALL (small footprint at each post base), the lights hang above and never block. Deliver posts and the light strand as separate layers.
- Cooler, about 48 x 40. BREAKABLE.
- Cornhole board, 2 (one with a bag), about 48 x 32. WALK-THROUGH (flat on the ground).

**Fixer-upper**
- Tarp-covered lumber pile, about 80 x 64. WALL.
- Folding lawn chair (webbed, worn), about 56 x 64. WALL.
- Tall weeds and wildflowers, 3 variants, about 32 x 40. WALK-THROUGH.

**HOA president**
- Pergola with two cushioned chairs and a little table under it, about 128 x 112. Posts are WALL (four small footprints); the roof never blocks. Deliver the pergola top as its own layer so the hero can walk under it.
- Trimmed boxwood hedge block, about 64 x 40. WALL.

**Halloween**
- Sheet ghost on stakes, 2 poses, about 64 x 64. BREAKABLE.
- Lamp post (black, old-fashioned), about 32 x 96. WALL.
- Pennant bunting strand (orange, purple, cream) to hang between two lamp posts, about 160 x 32. Never blocks.
- Fog machine, about 40 x 32, plus a soft fog puff (WALK-THROUGH, 2 sizes). BREAKABLE machine.

**Young family (small extras)**
- Beach ball, about 24 x 24. WALK-THROUGH.
- Toy car, about 32 x 24. WALK-THROUGH.

**Retirees (check first)**
- If Batch B's wicker chair doesn't read like today's pink cushioned chairs, paint a pink-cushioned patio chair, about 56 x 64, WALL.
- A second raised bed with cabbages (Batch B's is tomatoes), about 128 x 80, WALL.

## Rules (same as Batch B)

- **Painted, then reduced.** Paint at an exact whole multiple (8x working canvas), reduce by that number with block mode, keep at least three tones per material. No pieces built from code shapes.
- **Neutral white balance.** No sepia, golden haze or film-look tint.
- **Palette:** the Batch B 21-color palette, mapped by material on purpose (foliage to the autumn oranges and greens, cloth to cream).
- **Kinds show in the art.** WALL: full dark outline and a heavy shadow. BREAKABLE: hero height or smaller, a cream highlight on top. WALK-THROUGH: flat, no outline, no shadow.
- **Metadata:** a manifest entry per piece with size, foot point, footprints and kind, like `manifest-batch-b.json`.
- **Checks:** each piece at 1x next to the same subject cropped from `backyards-v2.png`, and next to the 48 px hero.

## Deliver

A PR with the sprites in `assets/stage/home/v4/batch-c/`, the manifest, a review page, and the 1x comparisons. No game code changes. Claude places them after Rami approves.
