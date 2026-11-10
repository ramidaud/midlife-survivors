# ChatGPT brief: Maple Hollow v2, bigger houses, wider street, your real house (Nov 10, 2026)

Rami: "The houses should be bigger and closer together, with narrow pathways to backyards and the ability to cross from one
yard to another, each with its own personality. The street should feel much wider. The home should follow my floor plan and
feel much larger and more visually pleasing. One of the rooms should have my actual desk setup."

References in the repo: `docs/handoffs/img/rami-house-floor-plan.png` (Rami's real two-story townhouse plan),
`docs/handoffs/img/rami-desk-setup.jpg` (his real desk), `assets/stage/home/maple-hollow-houses-v1.png`,
`assets/stage/home/your-house-v1.png`, `assets/stage/home/street-band-v2-a.png`, `lawn-v2-a.png`,
`docs/handoffs/img/maple-hollow-houses-zoom.png`, and the hero `assets/characters/portraits/office-worker-on-break-v1.png`.

The paste-ready prompt is below. Codex: produce every file listed, each with prompt JSON, a JSON rectangle map where noted,
and a check image, like the garage kit. Art only, nothing pushed.

```json
{
  "project": "Midlife Survivors, Maple Hollow v2 (home stage rebuild at a bigger scale)",
  "attach": [
    "docs/handoffs/img/rami-house-floor-plan.png (floor plan to follow exactly)",
    "docs/handoffs/img/rami-desk-setup.jpg (his real desk, for the office room)",
    "assets/stage/home/maple-hollow-houses-v1.png and your-house-v1.png (current style)",
    "assets/stage/home/street-band-v2-a.png and lawn-v2-a.png (current ground, keep this clean style)",
    "assets/characters/portraits/office-worker-on-break-v1.png (hero, for scale)"
  ],
  "scale": {
    "hero_height_px": 56,
    "rule": "1 foot = 24 px everywhere (outside and inside). A 6-foot person is about 56 px tall in this 3/4 top-down view.",
    "lot_width_px": 416,
    "street_plate_repeat_px": 832,
    "note": "Two lots per street plate, so driveway curb cuts are baked in at fixed spots and always line up."
  },
  "style": "Crisp handmade 16-bit pixel art, top-down three-quarter view, matching the attached houses and ground v2: big flat color areas, 2-3 tone shading, crisp 1px navy outlines on objects, small readable details, little dithering, no noise texture. Game palette only: cream #F2D7A1, navy #171C35, slate #303750, muted blue #526078, teal #3E7775, sage #83A89A, khaki #D3B78D, coffee orange #EF9347, warm white #FFF0CF, tie red #C45C4B, lavender #BFA8CF, donut pink #F1B5BF. Peak fall. Neutral white balance: no sepia, no golden haze, no film-look tint. No text, letters, numbers, logos or brands anywhere (no car badges, no console or computer logos).",
  "deliverables": [
    {
      "file": "assets/stage/home/v2/houses-v2.png",
      "what": "Six neighbor houses, each about 336 px wide and 352 px tall (roughly twice today's size), on transparent background, one per 416x384 cell (sheet 2496x384). Each has a distinct personality you can read from the front: 1 young family (bikes, chalk, a basketball hoop), 2 retirees (immaculate porch, wind chimes, rocking chairs), 3 grill-master dad (string lights, cornhole boards visible on the side), 4 overgrown fixer-upper (sagging gutter, tarp on the roof, leaves everywhere), 5 the HOA President's house (perfect symmetry, trimmed topiaries, edged lawn), 6 Halloween-early house (inflatables, fake cobwebs, a plastic skeleton on a chair). Each house leaves a 64 px wide side path on one side with a gate in a short fence leading to the backyard."
    },
    {
      "file": "assets/stage/home/v2/your-house-v2.png",
      "what": "Rami's real house from the attached floor plan, front view, same scale: a narrow, deep two-story townhouse. As in the plan, the front shows the single-car garage door on the RIGHT (10 ft wide = 240 px) and the front entry door on the LEFT, tucked in beside the garage, with a small stoop. Upstairs, the second bedroom's window faces the street; the master bedroom is at the back. Coffee-orange siding to match the current your-house art, navy trim, a wreath, pumpkins on the stoop, a doormat with a fat gray rock beside it (the spare key). Transparent background, about 400 px wide, 400 px tall."
    },
    {
      "file": "assets/stage/home/v2/street-wide-v2-a.png and -b.png",
      "what": "A much wider street cross-section, 832 x 512, seamless left to right, A and B share identical edge columns. Top to bottom: sidewalk 64, grass parkway strip with a young maple tree base every 416 px (32), road 320 (a parking lane on each side with 1-2 parked cars per plate, two travel lanes, center dashes 32 on / 32 off), grass parkway (32), sidewalk 64. Curb cuts and driveway aprons baked into the TOP sidewalk and parkway at x 288-352 and x 704-768. Details like ground v2: storm drains, manhole, chalk drawings, leaves in the gutters, a lost mitten, skid marks. Variant B has different parked cars and details."
    },
    {
      "file": "assets/stage/home/v2/backyards-v2.png",
      "what": "Six backyard plates, each 416 x 448, sheet 2496x448, seamless where neighbors meet. Low fences between yards with an open gate or a gap in each shared fence so you can walk from yard to yard. Each matches its house: 1 trampoline, kiddie pool, swing set; 2 raised vegetable beds, bird feeders, gnomes; 3 smoker, grill, patio table, cornhole; 4 knee-high grass, a rusty wheelbarrow, a broken lawn chair; 5 striped mowed lawn, a koi pond, a pergola; 6 inflatable ghosts, a fog machine, a hay bale. Include Rami's backyard as a seventh plate (416 x 448): the PATIO from his floor plan (concrete slab off the back door), a fire pit, two Adirondack chairs, a kid's soccer goal."
    },
    {
      "file": "assets/stage/home/v2/interior-floor1-v2.png (+ .json)",
      "what": "Rami's FIRST FLOOR exactly as the attached plan, top-down 3/4 view, 1 ft = 24 px, walls 16 px thick with a navy outline. Rooms in plan order, front (bottom of image) to back (top): garage 10'1 x 20' with the family minivan and an empty bay, breakfast nook, entry with a closet, the stairs up (left wall), half bath, kitchen with dishwasher, double sink, stove, fridge, and the washer and dryer in the hall closet, dining room 8'7 x 8'10 with a table for four, living room 16' x 9'7 with the fireplace on the back wall, a sofa, a TV and a rug, and the back door out to the patio. Warm wood floors, kitchen tile, cozy and lived in (kid's backpack, shoes by the door, a fruit bowl, family photos). Deliver the whole floor as one image (about 400 x 1200) plus the JSON with each room's floor rectangle, every wall rectangle, every door opening, and each solid furniture rectangle (sofa, table, counters, fridge, minivan)."
    },
    {
      "file": "assets/stage/home/v2/interior-floor2-v2.png (+ .json)",
      "what": "Rami's SECOND FLOOR exactly as the plan, same scale: master bedroom 16' x 11'1 (bed, nightstands, dresser), walk-in closet, full bath (tub, toilet, sink), linen closet, utility room (water heater), stairs down, and the second bedroom 12'7 x 11'2 turned into RAMI'S HOME OFFICE (next item placed inside it). About 400 x 880, plus the same kind of JSON."
    },
    {
      "file": "assets/stage/home/v2/rami-desk-v2.png",
      "what": "Rami's real desk from the attached photo, as one top-down 3/4 furniture piece about 240 x 140 px: a white desk; a big curved ultrawide monitor on the left and a second widescreen monitor on the right, both glowing with the game's own navy-and-orange title screen; a tablet propped on a stand in front showing the same title; an open dark laptop in the middle; a long dark keyboard and a dark mouse; a red game controller; a tall silver tumbler; over-ear headphones hanging off the right side; a podcast microphone on a boom arm; small cables. On the wall behind (a separate 240 x 96 strip, rami-desk-wall-v2.png): kids' crayon drawings pinned up, an umbrella-shaped drawing and an orange race car drawing, and a warm desk lamp glow. Monitors are the only bright light in the room. No logos on any device."
    }
  ],
  "checks": "For each file: dimensions, palette, transparency, seam tests for the street (A/B/A) and backyards (all six side by side), and a mock-up of one full block: three houses with side paths, their backyards behind, the wide street in front, the hero for scale."
}
```

## How it will plug in (Claude)
- New layout constants: lots 416 wide, street band 512 tall, backyards connected through gates. The current v1/v2 art stays as a fallback until the new set is in.
- Interior moves from 3 rooms to two real floors joined by the stairs (step on the stairs to go up or down).
- Rami's desk goes in the second-floor office. Idea for later: sitting at it is a safe spot or a small bonus.
