# Codex brief: level art pass, three art jobs (Nov 11, 2026)

> **Update, Nov 11:** Job 1's hero sheets are approved and live. **Jobs 2 and 3 are replaced by `codex-level-art-redo.md`.** The first deliveries were built from code shapes and rejected.

**From:** Claude, for Rami. **Why:** the level art audit (`docs/design/level-art-audit-2026-11.md`) found three places where new art is the fix. The display problems are already fixed in code (V. 2.29.0). These three jobs are decided, so the wider art direction audit (`codex-art-direction-audit.md`) doesn't need to re-request them.

**Do them in this order, one at a time. Stop after each for Rami's review.** Art only. Claude wires everything in.

## Rules for all three (from CLAUDE.md, "Pixel rules for the world")
- Draw at **native size**. The game shows art at 1x. No art that needs 1.5x, and nothing meant to be shrunk.
- **Colors by material.** Decide what each surface is, then give it its palette color on purpose. Never nearest-color snapping.
- Coffee orange `#EF9347` belongs to the hero's mug and weapons. Nothing else on a hero wears it.
- Game palette: `171C35 303750 526078 3E7775 83A89A A88B70 D3B78D F2D7A1 FFF0CF 874C3B C45C4B EF9347 E5A995 F1B5BF BFA8CF B97A58 70402F`.
- 1 px `#171C35` outline, hard edges, upper-left light, transparent PNG (no magenta this time).
- Neutral white balance. No sepia, golden haze or film-look tint.
- Each delivery: native PNG, a 4x preview beside the real 56x60 hero, a manifest (sizes, foot points, footprints), and the prompt saved next to it.

---

## Job 1: heroes and Bill, cleaned up at native size

**Problem:** the walk sheets lost detail when they were reduced. The 9-to-5er's khaki slacks came out coffee orange, and his belt, pocket pens and grey temples are gone. Bill's gritted teeth are noise and his paper is speckled.

**Keep exactly:** sheet layout, frame order, foot line, silhouette and timing. This is a repaint inside the existing outlines, checked on the Sprite Board (`tools/sprites.html`, CHANGED PIXELS view).

```json
{
  "job": "hero-and-bill-cleanup",
  "files": [
    { "in": "assets/characters/office-worker-walk-56x60-v3.png", "out": "office-worker-walk-56x60-v4.png", "grid": "8 columns x 5 rows of 56x60 (448x300)" },
    { "in": "assets/characters/soccer-dad-walk-56x60-v3.png", "out": "soccer-dad-walk-56x60-v4.png", "grid": "same" },
    { "in": "assets/characters/grad-student-walk-56x60-v3.png", "out": "grad-student-walk-56x60-v4.png", "grid": "same" },
    { "in": "assets/characters/cold-war-cowboy-walk-56x60-v4.png", "out": "cold-war-cowboy-walk-56x60-v5.png", "grid": "same" },
    { "in": "assets/enemies/enemy-bill-v2.png", "out": "enemy-bill-v3.png", "grid": "8 frames of 48x48 (384x48)" }
  ],
  "reference": "assets/characters/office-worker-walk-v1.png is the look to get back to: clear face, belt, tie, pens",
  "materials_9_to_5er": {
    "slacks": "khaki D3B78D, shadow A88B70",
    "shirt": "warm white FFF0CF, shadow F2D7A1",
    "tie": "tie red C45C4B, loosened",
    "belt": "dark brown 70402F, one row",
    "shirt_pocket": "two pens, 1 px each, teal 3E7775",
    "hair": "brown B97A58 with 70402F shadow, grey temples 526078",
    "glasses": "black rectangular frames in 171C35, lenses FFF0CF with one highlight pixel",
    "skin": "E5A995, one shadow tone only (no orange patches)",
    "loafers": "russet 874C3B",
    "mug": "coffee orange EF9347, the only orange on him"
  },
  "bill": "cream paper F2D7A1 in flat clusters (no speckle), red FINAL NOTICE band C45C4B, furrowed brows and a clear gritted-teeth mouth that reads at 48 px, navy legs and mitten hands",
  "other_heroes": "same treatment using their descriptions in docs/handoffs/chatgpt-visual-pass.md section 2; fix any material that landed on the wrong color",
  "checks": "same occupied pixels per frame within 2 px, feet on the same line, no frame over 5% changed pixels between neighbors in the idle row"
}
```

---

## Job 2: fill the big house

**Problem:** the rooms were made 2x wide and 1.5x tall and the furniture stayed its drawn size, so composed rooms became islands on bare planks. Target: about 20 objects in view per screen (1280x720 shows 1280x720 px of floor), with clear 96 px walking lanes.

Layout data: `src/data/house-v2.js`. Reference for mood: Rami's photo brief (`chatgpt-maple-interior-from-photos.md`). Photos stay private; no faces, names or logos.

```json
{
  "job": "big-house-fill-v1",
  "out": "assets/stage/home/v2/house2-fill-v1.png plus manifest house2-fill-v1.json",
  "rooms_px": {
    "living": "768x345 (has 14 pieces)", "desk nook": "584x322 (4)", "dining": "404x322 (2)", "kitchen": "416x332 (6)",
    "breakfast nook": "464x252 (0)", "garage": "532x724 (3)", "hall": "136x624 (1)", "entry": "184x172 (1)",
    "main bedroom": "768x403 (7)", "Abe's room": "604x406 (11)", "walk-in closet": "424x248 (1)", "bathroom": "424x212 (3)", "upstairs hall": "144x508 (0)"
  },
  "draw": [
    "rugs sized to each sitting area: living 320x200 patterned, dining 280x200, bedroom 300x180, hall runner 64x400, entry mat 96x64 (non-solid, floor layer)",
    "kitchen: an island 160x72 with stools, a run of upper and lower cabinets to line two walls (modular 64 px pieces), fridge magnets and a fruit bowl",
    "breakfast nook: round table 96x80 with four chairs, a high chair, a window with a plant shelf",
    "garage: wall shelving 128x96 x3, tool pegboard 128x64, recycling bins, stacked storage totes, a chest freezer, oil stain and tire marks as floor decals, two bikes",
    "wall dressing at 64 px modules for every room: framed photos (abstract, no faces), shelves with books and plants, a wall clock, coat hooks, a mirror",
    "plants in corners (3 sizes), floor lamps and table lamps (warm), baskets, a toy bin, a laundry pile, shoes by the door",
    "wall depth: a 32 px tall wall face strip for north walls and baseboard shadow tiles, so rooms stop looking like outlines"
  ],
  "whimsy": "hide small jokes at 1x: a sock nobody can find a match for, a chore chart with one name doing everything, a 'live laugh laundry' sign, a single toy brick in the hall",
  "manifest_per_piece": "name, size, foot point, footprint (solid part only), layer (floor, furniture or wall), suggested room"
}
```

---

## Job 3: Maple Hollow outdoors, trees and greens

**Problem:** the style board (`assets/art-direction/home-style-board-v1.png`) is half fall trees and the kit has none. Lawns are flat sage because the palette has no grass green. Yard props are 32 px art shown at 1.5x.

**First, before drawing:** a swatch board proposing **three outdoor greens** (lawn light, lawn shadow, evergreen) next to the existing palette and the house fronts. Rami approves the greens, then draw.

```json
{
  "job": "maple-hollow-outdoor-kit-v3",
  "step_1": "swatch board: 3 proposed greens beside the 17 palette colors and houses-v2.png. Stop for Rami.",
  "out": "assets/stage/home/v3/ (trees, shrubs, lawn plates, props) plus manifest",
  "draw": [
    "fall trees: 6 kinds at 128x160 to 160x192 (maple red, maple orange, oak gold, birch yellow, a bare one, one half-turned), trunk base as the foot point, canopy overlaps what is behind it",
    "evergreens: 3 sizes, 64x96 to 96x144",
    "THE BOUNDARY (Rami, Nov 11): trees contain the level on all four sides. Tree wall plates two rows deep: top and bottom 832x256 (repeat every 832 px), left and right 256x832, plus four 256x256 corners. Dense trunks at the base so it reads as solid, canopy overlapping inward. The player never sees past it",
    "backyard furniture as SEPARATE sprites, not painted into the yard picture (trampoline, swing set, pool, sandbox, raised beds, fire pit, chairs, grill, pond, lantern, wheelbarrow, pallet, cinder blocks, soccer goal). Each with a foot point and a small footprint so the hero can walk behind it. Plus the seven yards redrawn as plain ground plates (lawn, patio, paths only)",
    "shrubs and hedges: 8 pieces at 64 px modules, flowering and plain; foundation plantings to hide the hard edges of the house cells",
    "leaf drifts and scattered leaves as non-solid decals, 8 pieces, 32 to 96 px",
    "lawn plates redrawn with the approved greens: lawn-v3-a and lawn-v3-b at 512x512, seamless, mixed-variant seam check",
    "yard props redrawn at native 48x48 (the current 16 lawn props, 8 key-hunt spots and the toy-brick patches), same subjects, so the game can stop scaling them",
    "fences: picket and wood, 64 px modules with posts, gate open and closed"
  ],
  "world_rules": "three kinds of object, and the art has to show which is which. WALL: taller than the hero, full dark outline, heavy contact shadow (trees, fences, hedges, cars, big furniture). BREAKABLE: hero height or smaller, with a 1 px cream top highlight so it reads as loose (bins, planters, gnome, mailbox). WALK-THROUGH: flat on the ground, no outline, no shadow (leaves, chalk, hoses, rugs, low flowers). Mark each piece's kind in the manifest. Gates and gaps are drawn 96 px wide",
  "placement_note": "Claude places these by hand, lot by lot, to match the style board. Include one suggested lot layout (416 px wide) as a picture."
}
```

---

## After these
Office density (Lobby and Parking Lot first) comes next. It mostly reuses the existing 64-family kit, so wait for the art direction audit before requesting anything new there.
