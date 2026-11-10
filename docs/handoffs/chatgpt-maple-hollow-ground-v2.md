# ChatGPT brief: Maple Hollow ground v2 (Nov 10, 2026)

Rami: "I'm not a huge fan of the art of the grass, road and sidewalk in Maple Hollow. They should match the aesthetic
of the houses more closely, and there should be more details baked in."

## What's wrong now
The ground is built from 32 px tiles (`assets/stage/home/maple-hollow-tiles-props-v1.png`, top three rows) repeated across
the whole map. Compare `docs/handoffs/img/maple-hollow-ground-now.png` with `docs/handoffs/img/maple-hollow-houses-zoom.png`:
- **The houses** are clean and readable: big flat color areas, 2-3 tone shading, crisp navy outlines, small deliberate details (a gnome, a hose, pumpkins).
- **The ground** is fine noise: dark speckled grass, dithered sidewalk, gritty asphalt. It reads darker and muddier than the houses, and the 32 px repeat shows.

## The fix: bigger hand-drawn plates instead of tiny tiles
Four images. The game repeats each one, so **edges must line up seamlessly** where noted.

### A · Street band, `street-band-v2.png`, 800x320 (two variants: `-a` and `-b`, same edges)
One full cross-section of a street, top to bottom: sidewalk (y 0-64), road (y 64-256), sidewalk (y 256-320).
**Seamless left to right**, and both variants share identical left/right edge columns so they can alternate.
- Sidewalks: warm cream concrete slabs with clean expansion joints every 64 px, a raised curb lip (navy outline, khaki face) where they meet the road. The sidewalk runs edge to edge; the lawn plate meets its outer side.
- **Driveway aprons baked into the TOP sidewalk** at x 280-344 and x 680-744 (curb cut ramps; the driveways come down from above at those spots).
- Road: slate-blue asphalt with soft wear, cream center dashes at y 160 (32 px long, 32 px gaps, so they line up across the seam), a darker gutter strip along both curbs with drifted maple leaves.
- Baked details, spread out, a few per plate: a storm drain grate on a curb, a manhole cover, a patched pothole, a faded tire skid, chalk drawings on the sidewalk (a sun, a flower, a hopscotch grid with no numbers), a crack with a weed, a fallen acorn cluster, a dropped mitten. Variant `-b` gets different details in different places.

### B · Lawn, `lawn-v2.png`, 512x512 (two variants: `-a` and `-b`)
**Seamless in both directions.** Brighter, cleaner grass that matches the yards drawn at the bases of the houses:
sage and teal blades in clusters with a few darker tufts, not even noise. Peak fall: drifts of orange and russet maple
leaves, some clover patches, a worn dirt spot, a few dandelion puffs. Calm enough that sprites stay readable on top.

### C · Driveway, `driveway-v2.png`, 64x256
**Seamless top to bottom.** Light concrete with a center seam, a faint oil spot, tire-worn tracks, a few leaves. It runs
from each house down to the sidewalk apron.

### D · Lawn details, `lawn-details-v2.png`, 512x64 (eight 64x64 cells on exact #FF00FF)
Flat decals that sit on the lawn under everyone: 1 big leaf drift, 2 mulch bed with orange mums, 3 stepping-stone path,
4 raked leaf pile with a rake handle, 5 chalk hopscotch (no numbers), 6 kid's scooter on its side, 7 bird bath shadow puddle
with leaves, 8 sprinkler wet patch. 4 px clear margin in each cell.

## Style (all four)
Match the attached houses exactly: crisp handmade 16-bit pixel art, top-down three-quarter view, 1 px navy outlines on
objects (not on grass blades), flat color areas with 2-3 tone shading, hard pixel clusters, **little dithering and no
noise texture**. Game palette only: cream #F2D7A1, navy #171C35, slate #303750, muted blue #526078, teal #3E7775,
sage #83A89A, khaki #D3B78D, coffee orange #EF9347, warm white #FFF0CF, tie red #C45C4B, lavender #BFA8CF,
donut pink #F1B5BF. **Neutral white balance: no sepia, no golden haze, no film-look tint.** No text, letters, numbers,
logos or brands.

## Attach
`assets/stage/home/maple-hollow-houses-v1.png`, `assets/stage/home/your-house-v1.png`,
`docs/handoffs/img/maple-hollow-houses-zoom.png`, `docs/handoffs/img/maple-hollow-ground-now.png` (what we're replacing).

## Save to
`assets/stage/home/` with a prompt JSON and a seam check (the plate tiled 2x2 or 3x1) next to each.

## How it plugs in (Claude)
`src/maple-hollow.js` `ground()` swaps the 32 px tile mixer for these plates: street bands alternate `-a`/`-b` every 800 px
(aligned so the aprons meet each driveway), lawns alternate their two variants, driveways use C, and D is scattered on
lawns with a seed like the yard props. The v1 tiles stay as a fallback.
