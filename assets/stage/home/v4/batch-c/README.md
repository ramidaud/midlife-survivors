# Maple Hollow yard character pieces, Batch C

November 12, 2026. Art-only PR for Rami’s review. Claude places approved pieces later.

Size revision: see [REVISION.md](REVISION.md) and [the size report](revision-size-report.json). All revised target canvases are applied; approved exports are hash-checked unchanged.

Open [review.html](review.html). Each of the 30 PNG sprites has an untouched 1x crop of the same subject from `backyards-v2.png`, the new sprite at 1x, and the live office-worker hero normalized to exactly 48px tall for this comparison only. The hero’s live painted bounds are 36x53; its comparison thumbnail uses nearest-neighbor reduction. Optional 4x detail links use whole-number nearest-neighbor enlargement.

## What is included

- Three autumn shrubs, two white flower clumps, three weeds/wildflowers.
- Two light posts as one layer with two footprints, a separate hanging strand, cooler, two cornhole boards (one with a bag).
- Tarp-covered lumber and a worn webbed folding chair.
- Pergola roof, four painted support posts, cushioned chair (place twice), little table, boxwood hedge.
- Two sheet ghosts, old-fashioned lamp (place twice), bunting, fog machine, two fog sizes.
- Beach ball, toy car, cabbage raised bed.

Retirees chair check: Batch B’s approved `wicker-chair-v4.png` already has pink cushions like the painted yard. Reuse that 64x72 sprite. Its reference PNG is included for review; no redundant replacement was painted.

## Painted method and color

Built-in imagegen painted each subject individually. Full prompts are in `generation-prompts.json`; the roof correction has a separate prompt and keeps the earlier study for provenance. Original images are untouched in `sources/`.

The generator did not return exact requested dimensions. As documented in approved Batch B, each painting is refitted onto an exact 8x working canvas (proportional except the explicitly recorded ghost, weed and toy-vehicle silhouette fits), then reduced by one exact 8x8 RGBA block-mode pass. Visible-alpha bounds avoid fitting near-invisible dust around the painting. Final palette mapping selects a material family first, then a tone within that family. This is not full-palette nearest-color matching. No sprite is built from code shapes.

The four isolated pergola posts are cropped from the generated support painting and positioned to meet the repainted roof’s corners; those paint crops and placements are recorded in the manifest. Other sprites use a single proportional fit. The original support painting is retained.

All visible RGB values come from Batch B’s 21-color palette. Cream cloth, autumn oranges, green foliage, timber, ink and metal are selected by material. Neutral white balance throughout. Fog uses three cream/lavender tones selected by painted coverage, with generated alpha attenuated to 60% for soft mist. Other exported sprites use binary alpha.

## Layers and collision proposals

`manifest-batch-c.json` records native size, foot point, visible bounds, footprints, source dimensions/crop, exact 8x working raster and comparison files per piece. Foot points are local `[x,y]`; footprints are local `[x,y,width,height]`.

WALL and BREAKABLE pieces propose solid footprints. WALK-THROUGH pieces have none. The roof, light strand and bunting use `drawLayer: overhead`; their WALK-THROUGH kind means no floor collision. They must draw above the hero, never as floor decals. The lamp has a small footprint only at its base. Four pergola support bases and two light-post bases are separate rectangles, leaving the center open. Chairs and table keep their own footprints.

`assemblies` records review recipes for the pergola, string lights and Halloween lamps. One cushioned chair PNG is instanced twice. Integrating the pergola requires rear/front support depth sorting along with independent furniture and the roof overlay. No runtime placement, collision or navigation is claimed as tested here. Claude must preserve the stage’s 96px passages and two exits when rebuilding yards after approval.

## Validation and reproducibility

`validation-batch-c.json` checks all 30 sizes, exact 8x working sizes, approved RGB palette, clear borders, bounded foot points/footprints, nonblocking collision metadata and byte-identical regeneration from each working raster through block mode/material mapping. Review strips preserve original reference scale and surroundings. Small portions of neighboring subjects remain in some source crops for context.

`build.py` is an art-processing utility, not game code. Requires Python 3, Pillow and NumPy. From this folder run `python build.py --repo '/path/to/Midlife Survivors'`; it writes a fresh `deliver/` directory without overwriting the reviewed exports. Original generation is not replayed or billed by this script.

No game code, version bump, deployment or placement is part of this PR.
