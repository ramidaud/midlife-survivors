# Codex brief: level art redo, painted this time (Nov 11, 2026)

**From:** Claude, for Rami. **Replaces** Jobs 2 and 3 in `codex-level-art-pass.md`. Job 1's four hero sheets are approved and live (V. 2.29.2).

## What went wrong, and it was the brief's fault
The first brief said "draw at native size, nothing meant to be shrunk." You followed it by building the final sprites from code geometry and using image generation only as a study. The result is flat: a flamingo made of an oval and four lines. Rami's words: "major steps backwards."

The old props (`assets/stage/home/maple-hollow-tiles-props-v1.png`, `key-hunt-v1.png`) were **painted by the image model and then reduced**, and they have the shading and charm we want. That method is right. It only failed on tiny faces.

## The method (now a rule in CLAUDE.md)
**World art is painted, then reduced by a whole number. Never built from code shapes.**

1. **Paint** each piece with image generation at exactly **8x** its final size (a 48x48 prop is painted at 384x384), one subject per image or an evenly spaced grid, flat magenta `#FF00FF` background, in the style of the old v1 props: chunky clusters, visible shading, upper-left light, 1 px-equivalent navy outline (8 px at 8x).
2. **Reduce** by exactly 8 with a block method (the most common color in each 8x8 block), so each final pixel comes from one clean block. No smoothing.
3. **Map colors by material**, with **at least three tones per material** (light, mid, shadow) chosen from the palette. A piece with one flat fill per material fails.
4. **Hand-fix** only what broke: eyes, mouths, thin lines.
5. **Compare at 1x and 4x beside the old sprite of the same subject.** If the old one has more charm, it isn't done. Put that side-by-side in the review page.

Palette: the 17 game colors plus the approved greens `#9BAE73`, `#6D895B`, `#315B4B`. Neutral white balance, no sepia, golden haze or film tint. Transparent PNG out.

## Step 0: a sample of eight, then stop
Before any full kit, deliver **only these eight** with the old-vs-new comparison, and stop for Rami:

```json
{
  "job": "redo-sample-v1",
  "out": "assets/stage/home/v4/sample/",
  "pieces": [
    { "name": "lawn flamingo", "final": "48x48", "physical": "pink plastic flamingo on two thin wire legs in a tuft of grass, curved neck, black beak tip, plastic shine on the body, slightly sun-faded" },
    { "name": "yard gnome", "final": "48x48", "physical": "ceramic garden gnome, tall russet pointed hat, full cream beard, teal coat, round nose, chipped paint, standing in grass" },
    { "name": "mailbox", "final": "48x48", "physical": "slate metal mailbox with a rounded top on a weathered wood post, small red flag up, grass tuft at the base" },
    { "name": "trash bin", "final": "48x48", "physical": "teal wheeled trash bin seen three-quarter from above, hinged lid, two wheels, scuffs and a dented corner" },
    { "name": "red maple", "final": "160x192", "physical": "full fall maple, layered leaf clusters in red, russet and peach highlights, a few gaps showing branches, thick brown trunk with root flare, a few leaves falling" },
    { "name": "lawn patch", "final": "128x128 seamless", "physical": "mown grass in the two approved lawn greens with clumps, a few clover spots and stray leaves, quiet enough to sit under sprites" },
    { "name": "bicycle", "final": "96x64", "physical": "kid's bike leaning on its kickstand, teal frame, cream tires with visible tread, a basket on the handlebars" },
    { "name": "Bill, third try", "final": "8 frames of 48x48 (384x48)", "physical": "keep the old shaded cream paper from enemy-bill-v2.png (soft folds, darker underside) and put the clear face from enemy-bill-v3.png on it: furrowed brows, gritted teeth as three separate teeth, not one rectangle" }
  ],
  "also": "if a real autumn gold is needed for oak and birch leaves (the first 'gold oak' came out beige), propose ONE gold on a swatch beside the palette. Rami approves it before it is used."
}
```

## After Rami approves the sample

### Outdoors (was Job 3), in this order
1. **The tree wall.** Trees contain the level on all four sides. Solid, two rows deep: top and bottom plates 832x256 (repeat every 832 px), left and right 256x832, four 256x256 corners. Dense trunks at the base, canopy overlapping inward, drawn on transparent (no black). The first delivery made one decorative strip and called it "not a collision boundary." This one is the boundary.
2. **Backyard furniture as separate sprites**, each with a foot point and small footprint: trampoline, swing set, kiddie pool, sandbox, raised garden beds, tomato trellis, fire pit, Adirondack chairs, wicker chairs and table, grill and smoker, patio table, bird feeder, bird bath, koi pond, stone lantern, wheelbarrow, pallet pile, cinder blocks, soccer goal. Paint them to match `backyards-v2.png`. Plus the seven yards as plain ground plates.
3. **Six fall trees and three pines** (same sizes as before), **shrubs and hedges**, **leaf decals**.
4. **Yard props, key-hunt props and toy bricks** at 48x48, same subjects as the v1 sheets.
5. **Fences and gates** at 64 px modules. Gate gap is 96 px.
6. **Lawn plates** 512x512, seamless, with real texture (the first ones used two colors).

Mark each piece WALL, BREAKABLE or WALK-THROUGH in the manifest (CLAUDE.md, "World rules").

### House fill (was Job 2)
Same list and sizes as the first brief. Rugs, shelves and cabinets from the first delivery may be kept as a base and repainted with shading. Bikes, plants, lamps, baskets and anything organic are redone from scratch.

## Delivery
- Commit and push to a branch and open a pull request. Art and docs only.
- Review page with old-vs-new at 1x and 4x for every piece.
