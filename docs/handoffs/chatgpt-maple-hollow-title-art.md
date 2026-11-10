# ChatGPT brief: Maple Hollow title-screen key art (Nov 10, 2026)

Two new slides for the title slideshow that show off the home stage. Same rules as the office key art v2
(`docs/handoffs/chatgpt-key-art-v2.md`): each scene is drawn twice, a 1920x1080 desktop version and a recomposed
1080x1920 portrait version, with the main action inside the zone the title UI leaves open.

## Where the action has to sit
- **Desktop 1920x1080:** main action in the **upper right**, about x 950-1850, y 100-470. Left third and bottom half are quiet environment (lawn, sidewalk, street), lower contrast. Guide: `docs/handoffs/img/title-zones-desktop.png`.
- **Portrait 1080x1920:** main action in the band **y 600-880**, centered. Above it (y 0-580): sky and treetops, quiet. Below (y 900-1920): lawn, sidewalk, street, quiet. Guide: `docs/handoffs/img/title-zones-phone.png`.

## Attach as references
- Town: `assets/stage/home/maple-hollow-houses-v1.png`, `assets/stage/home/your-house-v1.png`, `assets/stage/home/maple-hollow-tiles-props-v1.png`
- Hero: `assets/characters/portraits/office-worker-on-break-v1.png` (the 9-to-5er)
- Kid and stand: `assets/characters/grandkid-2-v1.png`, `assets/stage/home/home-hazards-v1.png` (Lemonade Stand cell)
- Enemies: `assets/enemies/enemy-leaf-pile-v1.png`, `enemy-lawn-mower-v1.png`, `enemy-gutter-clog-v1.png`, `enemy-tax-notice-v1.png`
- Bosses: `assets/bosses/boss-hoa-president-v1.png`, `boss-midlife-crisis-v8-v1.png`, `boss-math-homework-v1.png`
- Garage: `assets/stage/home/garage-room-preview-v1.png` (the minivan and the dust outline)

## Style (all four images)
Crisp handmade 16-bit pixel art, top-down three-quarter view, matching the attached sprites. Game palette only: cream #F2D7A1,
navy #171C35, slate #303750, muted blue #526078, teal #3E7775, sage #83A89A, khaki #D3B78D, coffee orange #EF9347,
warm white #FFF0CF, tie red #C45C4B, lavender #BFA8CF, donut pink #F1B5BF. Peak fall: orange and russet leaves.
Hard pixel clusters, no anti-aliasing, contact shadows. **Neutral white balance: no sepia, no golden haze, no film-look
tint.** No text, letters, numbers, logos, brands or license plates anywhere. Warm and funny, never mean.

## Files to save
`assets/title-screen/slides/13-maple-hollow-desktop.jpg`, `13-maple-hollow-portrait.jpg`,
`14-not-the-minivan-desktop.jpg`, `14-not-the-minivan-portrait.jpg` (plus the prompt JSON next to each).

## 13 · Welcome to Maple Hollow
```json
{
  "scene": "A peak-fall suburban street in Maple Hollow. The 9-to-5er (black rectangular glasses, messy brown hair graying at the temples, white short-sleeve shirt, loose red tie, khaki slacks, orange coffee mug) is locked out of his own orange two-story house: he crouches at the front step lifting the doormat, looking under it, while a fat gray rock beside the step obviously hides the spare key. On the sidewalk in front, his kid runs a little striped Lemonade Stand and waves at him. Across the lawn the HOA Board President stands with a yardstick measuring the grass, frowning. A Leaf Pile monster creeps out of a raked heap, and the neighbor's angry Lawn Mower rolls in from the side.",
  "focus": "the hero at his door, the kid's stand and the HOA president with the yardstick",
  "mood": "cozy, sunny, a little absurd: home is its own boss fight",
  "quiet_areas": "neighbor houses, maple trees, lawns, sidewalk and the street, lower contrast, a few tiny Tax Notices fluttering at the far edges",
  "lighting": "bright clear autumn afternoon from the upper left, crisp shadows, neutral white balance",
  "desktop": "1920x1080. The hero's house, the stand and the HOA president sit in the upper right (x 950-1850, y 100-470). The left third is the street and neighbor lawns.",
  "portrait": "1080x1920, recomposed (not a crop). The house front, the hero at the mat and the stand sit in the band y 600-880, centered; the HOA president at the right edge of that band. Treetops and sky above, lawn and street below."
}
```

## 14 · That's Not the Minivan
```json
{
  "scene": "The garage door of the hero's orange house is flying up, and the Midlife Crisis V8 (the attached red convertible with big angry cartoon eyes) bursts out down the driveway in a cloud of dust and leaves, mid-wheelie. In the garage behind it you can see the beige family minivan and an empty car-shaped outline in the dust. The 9-to-5er stands on the driveway in shock, coffee mug splashing, red tie blown sideways. His kid on the sidewalk holds up a toy steering wheel, delighted. Through the kitchen window, the Fifth-Grade Math Homework (the attached worksheet monster with a pencil) glares out, waiting.",
  "focus": "the V8 bursting out of the garage and the hero's shocked face",
  "mood": "slapstick action: the midlife crisis has arrived, and it's fast",
  "quiet_areas": "neighbor houses, lawns with leaf piles, the street, lower contrast",
  "lighting": "same clear autumn afternoon, warm light spilling out of the open garage, neutral white balance",
  "desktop": "1920x1080. The garage, the V8 and the hero sit in the upper right (x 950-1850, y 100-470). The left third is the street and a neighbor's yard.",
  "portrait": "1080x1920, recomposed (not a crop). The garage door, the V8 mid-wheelie and the hero sit in the band y 600-880, centered. Roof and maple branches above, driveway and street below."
}
```

## How they'll be used (Claude)
Added to `src/data/title-art.js`. Suggested: when Maple Hollow is picked on the title screen, these two lead the
slideshow; otherwise they mix in with the office slides as a teaser for the unlock.
