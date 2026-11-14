// Maple Hollow, the Home stage (Nov 9, step 1 of docs/plans/home-stage.md). Plain numbers you can tweak.
// Two streets of houses, sidewalks and lawns, built from ChatGPT's kit (assets/stage/home/).
// The layout below is generated into the same shape as the office's START_AREA_LAYOUT, so pathfinding,
// spawning, events and bosses work the same way here.
window.MAPLE_HOLLOW = {
  unlockAge: 55,               // reach 55 in any run to unlock it on the title screen
  name: "Maple Hollow",
  tagline: "Peak fall. Wide streets. The HOA is watching.",
  width: 2560,
  lotWidth: 400, firstLotX: 240,
  // rows: y of each band, top to bottom
  rows: { northHouseFront: 440, sidewalk1: 520, street1: 584, street1End: 776, sidewalk2End: 840,
          southHouseFront: 1256, sidewalk3: 1336, street2: 1400, street2End: 1592, sidewalk4End: 1656, bottom: 1720 },
  // Inside your house (Nov 9, step 3b): three rooms side by side over a hallway, built below the neighborhood.
  // You get there through your front door once it's unlocked. Furniture: [piece id, x, y] from each room's top-left;
  // solid pieces block you like office desks. Art: assets/stage/home/house-interior-v1.png (+ .json frame map).
  interior: {
    x: 200, y: 2440, roomW: 384, roomH: 320, hallH: 64, doorGapFromTop: 230, // y: far enough below the street that a phone camera never sees both
    rooms: [
      { id: "living",  floor: ["oak-a", "oak-b"], name: "LIVING ROOM",
        furniture: [["sage-couch", 90, 60, 1], ["recliner", 290, 66, 1], ["coffee-table", 110, 140, 1], ["floor-lamp", 34, 190, 0], ["tv-stand", 110, 268, 1], ["laundry-basket", 300, 262, 0]] },
      { id: "kitchen", floor: ["kitchen-checker-a", "kitchen-checker-b"], name: "KITCHEN",
        furniture: [["sink-counter", 100, 50, 1], ["fridge", 236, 52, 1], ["stove", 316, 56, 1], ["round-table-chairs", 180, 200, 1], ["junk-drawer", 46, 130, 0], ["mail-bills", 312, 190, 0]] },
      { id: "kids",    floor: ["lavender-carpet-a", "lavender-carpet-b"], name: "KID'S ROOM",
        furniture: [["dinosaur-bed", 70, 82, 1], ["homework-desk", 186, 56, 1], ["bookshelf", 322, 52, 1], ["beanbag", 70, 270, 0], ["toy-chest", 196, 266, 1], ["ceiling-stars", 300, 170, 0]] }
    ],
    fridgeHeal: 4,         // the fridge has leftovers: heal this much...
    fridgeRestockYears: 5, // ...and it restocks every 5 years (Nov 12; was once per run)
    fridgeRestockLine: "Somebody went grocery shopping.",
    fridgeLine: "Leftover lasagna. Cold, perfect, and gone.",
    enterLine: "Home. It smells like coffee and someone else's laundry.",
    exitPx: 40
  },
  // The garage (Nov 10, step 5b): a fourth room to the right of the kid's room, reached from the end of the hallway.
  // Art: assets/stage/home/garage-interior-v1.png (+ .json). The Midlife Crisis V8 sits parked in the empty bay all
  // run. At 60 it bursts out: from the garage if you're inside, from your driveway if you're out on the street.
  // Pieces: [id, x, y, solid], x = center, y = top, from the garage's top-left.
  garage: {
    w: 384, name: "GARAGE",
    floor: { "concrete-a": 0.55, "concrete-b": 0.33, "concrete-oil": 0.06, "concrete-tire-marks": 0.06 },
    pieces: [["workbench", 76, 10, 1], ["tool-pegboard", 76, -14, 0], ["dartboard", 262, 6, 0], ["holiday-bins", 336, 18, 1],
             ["sad-box", 274, 52, 1], ["mini-fridge", 352, 100, 1], ["kids-bike", 196, 96, 0],
             ["family-minivan", 96, 132, 1], ["car-dust-outline", 268, 132, 0], ["lawn-mower", 350, 236, 1]],
    parkAt: [268, 300],          // where the V8 sits (feet), over the dust outline
    doors: [96, 268],            // garage door centers along the front wall, one per bay
    teaseAge: 59.4,              // the engine starts turning over a little before 60
    teaseLines: ["vroom...", "VROOM.", "...vrrRRRM"],
    burstLine: "The garage door is going up. That's not the minivan.",
    burstLineInside: "Something in the garage just turned the key.",
    goneLine: "It left a car-shaped outline in the dust. And your dignity."
  },
  northHouses: [0, 1, 2, 3, 4, 5],   // frame order in maple-hollow-houses-v1.png
  southHouses: [3, 5, 0, 4, 2, 1],
  yourHouse: { row: "north", lot: 2 }, // you start on the sidewalk in front of this one
  // little yard props (frame numbers in maple-hollow-tiles-props-v1.png, 32x32 cells): drawn under everyone, not solid
  // Ground v2 (Nov 10, Rami: "match the houses, more details baked in"). Big hand-drawn plates by ChatGPT/Codex replace
  // the 32 px tile mix. Street plates are 832 wide (13 whole dash cycles) and alternate A/B; their own curb cuts get
  // patched over and new ones are stamped where each driveway really meets the sidewalk. Set on: false to go back to v1.
  ground2: {
    on: true,
    street: ["street-band-v2-a.png", "street-band-v2-b.png"], streetStep: 832, plateAprons: [280, 680], apronW: 64, curbRows: [36, 64],
    lawn: ["v4/ground/lawn-a-v4.png", "v4/ground/lawn-b-v4.png"], driveway: "driveway-v2.png",
    details: "lawn-details-v2.png", detailsPerYard: 1, detailsPerBackyard: 1, detailsUpTop: 6
  },
  // Maple Hollow v2 (Nov 10, step 1 of the rebuild: the outside). Art by ChatGPT/Codex in assets/stage/home/v2/.
  // Bigger houses (416 px lots) with a stone side path to each backyard, backyards joined by gates, and a 512 px street
  // band (sidewalk, parkway, a 320 px road with parked cars, parkway, sidewalk). When on, these numbers replace the v1
  // layout above. Set on: false to go back to v1. The two-floor house inside comes in the next step.
  v2: {
    on: true,
    width: 2496, lotWidth: 416, firstLotX: 176,      // firstLotX = the center of lot 0's house front
    rows: { northHouseTop: 448, northHouseFront: 816, sidewalk1: 832, street1: 928, street1End: 1248, sidewalk2End: 1344,
            southHouseTop: 1792, southHouseFront: 2160, sidewalk3: 2176, street2: 2272, street2End: 2592, sidewalk4End: 2688, bottom: 2752 },
    houseCell: [416, 384], facade: [8, 16, 336, 352], backyard: [416, 448],
    fence: { w: 16, top: 40, gate: [208, 304], steps: [162, 258] }, // side fences with a gate gap; the top hedge has steps in the middle. World rules (Nov 11): gaps are 96 px (were 64 and 52, too tight for a 48 px hero)
    // The tree wall (Nov 11, World rules: trees contain the level). Painted by Codex, Batch A. Each side is one 832 px
    // strip repeated along the edge: 192 px of solid forest outside the map and a 64 px leafy fringe that hangs over it.
    // The camera stops at the outside of the forest, so nothing past it ever shows. Corner pieces (corners: true) are Codex's
    // repaint; with corners: false the side strips cover the corners instead. Set on: false to go back to the open edge.
    treeWall: { on: true, dir: "v4/wall/", step: 832, core: 192, fringe: 64, edge: 40, corners: true, margin: 232 }, // margin: a strip of grass between the end houses and the forest, wide enough for the street ends (232 - 40 = 192 px to walk in; was 136 before V2.29.11) // edge: how far in from the map edge the hero is stopped
    // One grass color (V2.29.11, Nov 12): the street band and the house frames repainted to Rami's lighter green #9BAE73
    // by tools/maple_one_green.py (grass only; the house siding keeps its paint). Point these back at v2/ to undo.
    art: { houses: "v4/ground/houses-v4.png", yours: "v4/ground/your-house-v4.png", street: ["v4/roads/deliver/street-ew-a-v1.png", "v4/roads/deliver/street-ew-b-v1.png"] }, // Nov 14: Codex's roads kit (PR #13)
    roadKit: { dir: "v4/roads/deliver/", woods: "v4/woods/deliver/" },
    // Street ends (V2.29.11): Codex's painted dead ends where each street meets the forest. Only the curved part of each
    // 512 px cap is used (crop: [from x, to x]); the street's own art runs out to meet it. inset: how far in from the forest's
    // outer edge the curve starts, so the leafy fringe doesn't hide it. The barricade is solid at its base: [file, x, y, solid width, solid depth].
    streetEnds: {
      on: true, dir: "v4/street/", inset: 56,
      left: { file: "street-end-left-v4.png", crop: [0, 128], barricade: ["street-end-left-barricade-v4.png", 53, 174, 28, 124] },
      right: { file: "street-end-right-v4.png", crop: [336, 512], barricade: ["street-end-right-barricade-v4.png", 349, 172, 28, 140] }
    },
    // Rebuilt yards (Nov 11, World rules): a plain ground picture plus each thing as its own sprite, so what blocks you is
    // an object you can see and walk around or behind. Painted by Codex (Batch A trees, Batch B furniture).
    // Each piece: [file, x, y, solid width, solid depth]. x and y are the top-left corner inside the 416 x 448 yard.
    // Solid width and depth describe the part on the ground that blocks you (leave them out for flat things you walk over).
    // Keep y 200 to 310 clear: that is the lane between the two side gates.
    yards: {
      dir: "v4/yard/",
      you: {
        ground: "ground-player-v4.png",
        pieces: [
          ["soccer-goal-v4.png", 20, 70, 154, 35],
          ["adirondack-chair-v4.png", 228, 36, 58, 23],
          ["fire-pit-v4.png", 296, 56, 84, 43],
          ["tree-maple-orange-v4.png", 8, 276, 24, 25],
          ["decal-leaf-drift-v4.png", 150, 340],
          ["decal-scattered-maple-v4.png", 250, 262]
        ]
      }
    },
    // The whole town (Nov 13, step 1 of the full map, docs/plans/home-map-v3.png). Your block stays put; the town grows up
    // and to the left of it. Roads are 512 px street bands (the vertical ones are the same art turned 90 degrees until
    // Codex paints proper ones). Each area is a closed lot of forest with a sign until its own step builds it.
    // cols/rows count outward from your block: col 1 is the one left of it, row 1 the one above it. Sizes in px.
    town: {
      on: true, road: 512, colW: 2496, rowH: [2752, 2048],   // rowH: the row right above your block, then the top row
      areas: [ // [id, name, opens at age (null = Full Life), col, row]
        ["elementary", "ELEMENTARY", 44, 0, 1], ["birch", "BIRCH CIRCLE", 47, 2, 2], ["mall", "STRIP MALL", 50, 2, 1],
        ["square", "TOWN SQUARE", 53, 1, 1], ["community", "COMMUNITY CENTER", 55, 2, 0], ["parkway", "THE PARKWAY", 59, 1, 0],
        ["park", "MAPLE PARK", 62, 1, 2], ["woods", "THE WOODS", null, 0, 2]
      ],
      // Areas that are built open at their age: the woods clear and the area's pieces appear. The rest stay woods.
      built: ["elementary", "birch", "mall", "square", "community", "park", "parkway"],
      openLines: { elementary: ["ELEMENTARY", "School's open. Somebody's math homework is due tomorrow."],
                   birch: ["BIRCH CIRCLE", "Birch Circle is open. The HOA would like a word about your lawn."],
                   mall: ["STRIP MALL", "The strip mall is open. The bank would like to talk about your mortgage."],
                   square: ["TOWN SQUARE", "Town Square is open. Everybody's here. Somebody brought a guitar."],
                   community: ["COMMUNITY CENTER", "The community center is open. There's a sign-up sheet for the potluck. You're down for napkins."],
                   parkway: ["THE PARKWAY", "The Parkway is open. Nice long road. Somebody's about to buy a sports car."],
                   park: ["MAPLE PARK", "Maple Park is open. Somebody reserved the pavilion for a retirement party."] },
      // Pieces reused from the yard kit (assets/stage/home/v4/yard/): size, feet line (dy) and solid footprint, relative to
      // the picture's top-left corner. flat = walked over.
      pieces: {
        "swing-set": { dy: 156, fp: [[3, 137, 154, 20]] }, "sandbox": { dy: 76, fp: [[6, 26, 84, 48]] },
        "soccer-goal": { dy: 112, fp: [[3, 77, 154, 35]] }, "tree-maple-orange": { dy: 176, fp: [[60, 151, 24, 25]] },
        "autumn-shrub-a": { dy: 58 }, "autumn-shrub-b": { dy: 58 }, "autumn-shrub-c": { dy: 58 },
        // Maple Hollow Elementary (Codex, PR #7, approved Nov 13): src is the file under assets/stage/home/
        "school-front": { src: "v4/elementary/school-front-v1.png", dy: 534, fp: [[17, 446, 1066, 88]] },
        "flagpole": { src: "v4/elementary/flagpole-v1.png", dy: 249, fp: [[18, 241, 12, 8]] },
        "school-sign": { src: "v4/elementary/school-sign-v1.png", dy: 121, fp: [[37, 100, 182, 21]] },
        "minivan-a": { src: "v4/elementary/minivan-a-v1.png", dy: 137, fp: [[12, 15, 56, 116]] },
        "minivan-b": { src: "v4/elementary/minivan-b-v1.png", dy: 137, fp: [[11, 15, 58, 116]] },
        "pickup-suv": { src: "v4/elementary/pickup-suv-v1.png", dy: 137, fp: [[11, 15, 58, 116]] },
        "playground-slide": { src: "v4/elementary/playground-slide-v1.png", dy: 153, fp: [[20, 127, 152, 26]] },
        "monkey-bars": { src: "v4/elementary/monkey-bars-v1.png", dy: 121, fp: [[13, 77, 197, 44]] },
        "merry-go-round": { src: "v4/elementary/merry-go-round-v1.png", dy: 119, fp: [[21, 79, 118, 40]] },
        "bike-rack": { src: "v4/elementary/bike-rack-v1.png", dy: 73, fp: [[13, 60, 134, 13]] },
        "lost-and-found": { src: "v4/elementary/lost-and-found-v1.png", dy: 52, fp: [[7, 44, 50, 8]] },
        "pickup-lane": { src: "v4/elementary/pickup-lane-v1.png", flat: true }, "four-square": { src: "v4/elementary/four-square-v1.png", flat: true },
        "hopscotch": { src: "v4/elementary/hopscotch-v1.png", flat: true }, "usa-map": { src: "v4/elementary/usa-map-v1.png", flat: true },
        // Maple Hollow town buildings (Codex, PR #8, approved Nov 13): strip mall, Town Square, community center
        "mall-grocery-front": { src: "v4/town/mall-grocery-front-v1.png", dy: 377, fp: [[13,  333,  390,  44]] },
        "mall-bank-front": { src: "v4/town/mall-bank-front-v1.png", dy: 377, fp: [[13,  329,  390,  48]] },
        "mall-pizza-front": { src: "v4/town/mall-pizza-front-v1.png", dy: 377, fp: [[13,  330,  390,  47]] },
        "mall-pharmacy-front": { src: "v4/town/mall-pharmacy-front-v1.png", dy: 377, fp: [[13,  335,  390,  42]] },
        "mall-dry-cleaner-front": { src: "v4/town/mall-dry-cleaner-front-v1.png", dy: 377, fp: [[13,  329,  390,  48]] },
        "mall-walkway-ground": { src: "v4/town/mall-walkway-ground-v1.png", flat: true },
        "mall-walkway-canopy": { src: "v4/town/mall-walkway-canopy-v1.png", dy: 96 }, // overhead: no footprint, fades when you walk under it
        "mall-parking-stalls": { src: "v4/town/mall-parking-stalls-v1.png", flat: true },
        "mall-drive-aisle": { src: "v4/town/mall-drive-aisle-v1.png", flat: true },
        "mall-car-teal": { src: "v4/town/mall-car-teal-v1.png", dy: 137, fp: [[9,  14,  61,  118]] },
        "mall-car-cream": { src: "v4/town/mall-car-cream-v1.png", dy: 137, fp: [[8,  14,  63,  118]] },
        "mall-car-russet": { src: "v4/town/mall-car-russet-v1.png", dy: 137, fp: [[14,  14,  52,  118]] },
        "mall-car-sage": { src: "v4/town/mall-car-sage-v1.png", dy: 137, fp: [[10,  14,  59,  118]] },
        "mall-cart-corral": { src: "v4/town/mall-cart-corral-v1.png", dy: 121, fp: [[53,  77,  150,  44]] },
        "mall-runaway-cart": { src: "v4/town/mall-runaway-cart-v1.png", dy: 49, fp: [[16,  39,  32,  10]] },
        "mall-light-pole": { src: "v4/town/mall-light-pole-v1.png", dy: 260, fp: [[24,  250,  16,  10]] },
        "mall-curb-island": { src: "v4/town/mall-curb-island-v1.png", dy: 213, fp: [[34,  171,  157,  42]] },
        "mall-trash-can": { src: "v4/town/mall-trash-can-v1.png", dy: 49, fp: [[11,  39,  26,  10]] },
        "square-arcade-front": { src: "v4/town/square-arcade-front-v1.png", dy: 441, fp: [[13,  383,  806,  58]] },
        "square-coffee-front": { src: "v4/town/square-coffee-front-v1.png", dy: 377, fp: [[14,  324,  388,  53]] },
        "square-hardware-front": { src: "v4/town/square-hardware-front-v1.png", dy: 377, fp: [[13,  327,  390,  50]] },
        "square-fountain": { src: "v4/town/square-fountain-v1.png", dy: 313, fp: [[47,  203,  290,  110]] },
        "square-brick-plaza": { src: "v4/town/square-brick-plaza-v1.png", flat: true },
        "square-quarter-pipe": { src: "v4/town/square-quarter-pipe-v1.png", dy: 153, fp: [[17,  122,  190,  31]] },
        "square-grind-rail": { src: "v4/town/square-grind-rail-v1.png", dy: 57, fp: [[11,  43,  170,  14]] },
        "square-concrete-pad": { src: "v4/town/square-concrete-pad-v1.png", flat: true },
        "square-food-truck-teal": { src: "v4/town/square-food-truck-teal-v1.png", dy: 281, fp: [[20,  17,  120,  256]] },
        "square-food-truck-russet": { src: "v4/town/square-food-truck-russet-v1.png", dy: 281, fp: [[24,  17,  112,  256]] },
        "square-bench": { src: "v4/town/square-bench-v1.png", dy: 73, fp: [[28,  58,  72,  15]] },
        "square-planter": { src: "v4/town/square-planter-v1.png", dy: 73, fp: [[11,  58,  50,  15]] },
        "community-hall": { src: "v4/town/community-hall-v1.png", dy: 553, fp: [[17,  465,  1066,  88]] },
        "community-potluck-table": { src: "v4/town/community-potluck-table-v1.png", dy: 89, fp: [[25,  71,  142,  18]] },
        "community-bounce-house": { src: "v4/town/community-bounce-house-v1.png", dy: 217, fp: [[24,  141,  208,  76]] },
        "community-barricade": { src: "v4/town/community-barricade-v1.png", dy: 73, fp: [[15,  58,  97,  15]] },
        "community-light-posts": { src: "v4/town/community-light-posts-v1.png", dy: 59, fp: [[4,  52,  8,  7],  [146,  52,  8,  7]] },
        "community-light-strand": { src: "v4/town/community-light-strand-v1.png", over: true },
        "community-cooler": { src: "v4/town/community-cooler-v1.png", dy: 52, fp: [[8,  40,  49,  12]] },
        // The Parkway's golf course and road-out-of-town barricade (Codex, PR #9, approved Nov 13)
        "fairway": { src: "v4/parkway/fairway-v1.png", flat: true }, "putting-green": { src: "v4/parkway/putting-green-v1.png", flat: true },
        "sand-trap": { src: "v4/parkway/sand-trap-v1.png", flat: true },
        "golf-flag": { src: "v4/parkway/golf-flag-v1.png", dy: 144, fp: [[4, 140, 6, 5]] },
        "golf-cart": { src: "v4/parkway/golf-cart-v1.png", dy: 89, fp: [[13, 63, 118, 26]] },
        "barricade-ns": { src: "v4/parkway/barricade-north-south-v1.png", dy: 89, fp: [[5, 71, 310, 18]] },
        "toy-car": { flat: true }, "beach-ball": { flat: true }, "decal-leaf-drift": { flat: true }, "decal-scattered-maple": { flat: true }
      },
      // Elementary (Nov 13): Codex's school, pickup line, playground and chalk (PR #7) with yard-kit trees and swings.
      // [piece, x, y] inside the area (2960 x 2752), top-left corner of the picture.
      // Besides pieces, a layout can hold: ["house", x, y, frame] a neighbor's house (solid front), ["yard", x, y, theme] a
      // backyard plate with its theme's pieces (src/data/maple-yards.js), ["street", x, y, length, "capLeft"] a street band
      // ending in the rounded dead end, ["asphalt", x, y, w, h] plain road where streets meet (may reach outside the area),
      // ["text", x, y, w, h, words, color] words painted on a blank sign (centered in that box).
      layouts: {
        // Birch Circle v1 (Nov 13): six houses on a street that ends in the cul-de-sac, HOA-perfect backyards behind them,
        // and the HOA common below the street, where the HOA President fights you (48).
        birch: [
          ["yard", 0, 0, "hoa-president"], ["yard", 416, 0, "retirees"], ["yard", 832, 0, "hoa-president"],
          ["yard", 1248, 0, "young-family"], ["yard", 1664, 0, "hoa-president"], ["yard", 2080, 0, "retirees"],
          ["house", 0, 448, 3], ["house", 416, 448, 1], ["house", 832, 448, 4], ["house", 1248, 448, 0], ["house", 1664, 448, 5], ["house", 2080, 448, 2],
          ["street", 128, 832, 2368, "capLeft"], ["asphalt", 2496, 928, 416, 320],
          ["yard", 220, 1440, "hoa-president"], ["yard", 1040, 1440, "hoa-president"], ["yard", 1860, 1440, "hoa-president"],
          ["tree-maple-orange", 40, 1700], ["tree-maple-orange", 700, 1850], ["tree-maple-orange", 1500, 1860], ["tree-maple-orange", 2330, 1840],
          ["autumn-shrub-a", 660, 1380], ["autumn-shrub-b", 1480, 1380], ["autumn-shrub-c", 2300, 1380]
        ],
        // Maple Park v1 (Nov 13): the yard themes' pieces out on an open lawn. The HOA set is the pavilion (pergola, koi pond,
        // lanterns, hedges), the grill master's set the picnic area, the retirees' set a bird-watching corner. Gold Watch (63.5) at the pavilion.
        // [vignette, x, y, theme]: a theme's pieces without its yard plate or fence posts. Each vignette is 416 x 448.
        // The Strip Mall (Nov 13, Codex's art): five shops along the top with a covered walkway, the parking lot below.
        // The Mortgage (52) comes out of the bank.
        mall: [
          ["mall-grocery-front", 160, 100], ["mall-bank-front", 576, 100], ["mall-pizza-front", 992, 100], ["mall-pharmacy-front", 1408, 100], ["mall-dry-cleaner-front", 1824, 100],
          ["text", 257, 222, 221, 29, "FRESH MARKET", "#171C35"], ["text", 676, 241, 218, 27, "MAPLE SAVINGS & LOAN", "#171C35"],
          ["text", 1075, 202, 248, 37, "TONY'S PIZZA", "#171C35"], ["text", 1508, 186, 200, 40, "PHARMACY", "#171C35"], ["text", 1896, 193, 271, 34, "PRESSED FOR TIME", "#171C35"],
          ["mall-walkway-ground", 0, 484], ["mall-walkway-canopy", 0, 484], ["mall-trash-can", 540, 470], ["mall-trash-can", 1790, 470],
          // the lot: stall rows and drive aisles
          ["mall-parking-stalls", 0, 640], ["mall-drive-aisle", 512, 640], ["mall-parking-stalls", 1024, 640], ["mall-drive-aisle", 1536, 640], ["mall-parking-stalls", 1984, 640],
          ["mall-parking-stalls", 0, 1152], ["mall-drive-aisle", 512, 1152], ["mall-parking-stalls", 1024, 1152], ["mall-drive-aisle", 1536, 1152], ["mall-parking-stalls", 1984, 1152],
          ["mall-parking-stalls", 0, 1664], ["mall-drive-aisle", 512, 1664], ["mall-parking-stalls", 1024, 1664], ["mall-drive-aisle", 1536, 1664], ["mall-parking-stalls", 1984, 1664],
          ["mall-parking-stalls", 0, 2176], ["mall-drive-aisle", 512, 2176], ["mall-parking-stalls", 1024, 2176], ["mall-drive-aisle", 1536, 2176], ["mall-parking-stalls", 1984, 2176],
          ["mall-car-teal", 40, 660], ["mall-car-cream", 260, 660], ["mall-car-russet", 1170, 660], ["mall-car-sage", 1394, 660], ["mall-car-cream", 2024, 660],
          ["mall-car-sage", 150, 1172], ["mall-car-teal", 1064, 1172], ["mall-car-russet", 2134, 1172], ["mall-car-cream", 2354, 1172],
          ["mall-car-russet", 40, 1684], ["mall-car-teal", 370, 1684], ["mall-car-sage", 1280, 1684], ["mall-car-cream", 2244, 1684],
          ["mall-car-cream", 150, 2196], ["mall-car-teal", 1174, 2196], ["mall-car-russet", 1394, 2196], ["mall-car-sage", 2024, 2196],
          ["mall-cart-corral", 640, 1000], ["mall-cart-corral", 1660, 1990], ["mall-runaway-cart", 900, 1300], ["mall-runaway-cart", 1720, 880], ["mall-runaway-cart", 420, 2000],
          ["mall-light-pole", 480, 1080], ["mall-light-pole", 1504, 1080], ["mall-light-pole", 480, 2104], ["mall-light-pole", 1504, 2104],
          ["mall-curb-island", 1200, 1450], ["mall-curb-island", 140, 1450], ["mall-curb-island", 2200, 1960],
          ["tree-maple-orange", 2300, 120], ["tree-maple-orange", 20, 220], ["autumn-shrub-a", 2320, 400], ["autumn-shrub-b", 40, 480]
        ],
        // Town Square (Nov 13, Codex's art): the middle of the map. Shop fronts along the top, a brick plaza with the fountain,
        // the skate park and the food trucks below. No boss: it's where the game comes together.
        square: [
          // the brick plaza around the fountain (four tiles: the brick reads large, so less is more until a finer brick comes)
          ["square-brick-plaza", 736, 856], ["square-brick-plaza", 1248, 856], ["square-brick-plaza", 736, 1368], ["square-brick-plaza", 1248, 1368],
          ["square-arcade-front", 300, 100], ["square-coffee-front", 1250, 164], ["square-hardware-front", 1700, 164],
          ["text", 570, 153, 290, 107, "GAME OVER\nARCADE", "#F2D7A1"], ["text", 1378, 256, 161, 31, "BEAN THERE", "#171C35"], ["text", 1780, 246, 256, 40, "DAD'S HARDWARE", "#171C35"],
          ["square-fountain", 1056, 1210],
          ["square-bench", 860, 1060], ["square-bench", 1510, 1060], ["square-bench", 860, 1660], ["square-bench", 1510, 1660],
          ["square-planter", 740, 860], ["square-planter", 1684, 860], ["square-planter", 740, 1800], ["square-planter", 1684, 1800],
          ["square-planter", 1200, 900], ["square-planter", 1230, 1880],
          // the skate park, bottom left
          ["square-concrete-pad", 120, 2200], ["square-concrete-pad", 632, 2200],
          ["square-quarter-pipe", 160, 2240], ["square-quarter-pipe", 840, 2240], ["square-grind-rail", 470, 2470],
          // the food trucks, bottom right
          ["square-food-truck-teal", 1720, 2240], ["square-food-truck-russet", 1980, 2240],
          ["text", 1749, 2322, 73, 138, "TACOS", "#171C35"], ["text", 2014, 2313, 72, 145, "BBQ", "#171C35"],
          ["square-bench", 1700, 2580], ["square-bench", 2000, 2580], ["mall-trash-can", 2200, 2400],
          ["tree-maple-orange", 60, 300], ["tree-maple-orange", 2300, 260], ["tree-maple-orange", 80, 1300], ["tree-maple-orange", 2340, 1300],
          ["tree-maple-orange", 1300, 2500], ["autumn-shrub-a", 2200, 700], ["autumn-shrub-b", 200, 800], ["autumn-shrub-c", 2300, 1900],
          ["decal-leaf-drift", 300, 1700], ["decal-scattered-maple", 2150, 1500], ["decal-leaf-drift", 1100, 2450]
        ],
        // The Community Center (Nov 13, Codex's art): the hall at the top, a block party on the street in front (barricaded
        // where it meets the road), and a lawn below. The Holiday Party (56) comes out of the hall.
        community: [
          ["community-hall", 700, 120], ["text", 1104, 329, 290, 46, "COMMUNITY CENTER", "#171C35"],
          ["street", 0, 880, 2496], ["asphalt", 2496, 976, 416, 320],
          ["community-barricade", 2300, 980], ["community-barricade", 2300, 1240],
          ["community-potluck-table", 500, 1040], ["community-potluck-table", 740, 1040], ["community-potluck-table", 980, 1040],
          ["community-bounce-house", 1500, 1000], ["community-cooler", 1240, 1100], ["community-cooler", 420, 1150],
          ["community-light-posts", 300, 930], ["community-light-strand", 300, 930], ["community-light-posts", 1000, 1260], ["community-light-strand", 1000, 1260],
          ["community-light-posts", 1900, 930], ["community-light-strand", 1900, 930],
          ["vignette", 300, 1560, "grill-master"], ["vignette", 1500, 1600, "retirees"],
          ["tree-maple-orange", 120, 200], ["tree-maple-orange", 2200, 220], ["tree-maple-orange", 2350, 600], ["tree-maple-orange", 80, 640],
          ["tree-maple-orange", 1100, 1700], ["tree-maple-orange", 1200, 2300], ["tree-maple-orange", 2200, 2200], ["tree-maple-orange", 200, 2400],
          ["autumn-shrub-a", 560, 640], ["autumn-shrub-b", 1860, 640], ["autumn-shrub-c", 900, 2100], ["autumn-shrub-a", 2000, 2500],
          ["decal-leaf-drift", 600, 1900], ["decal-scattered-maple", 1700, 2300], ["decal-leaf-drift", 2300, 1500], ["decal-scattered-maple", 400, 2600]
        ],
        // The Parkway v1 (Nov 13): a through road lined with maples, a golf course edge, and the road out of
        // town running south into the trees (closed until Full Life). The V8 (60) still bursts out of your garage next door.
        // More entries: ["vstreet", x, y, length] a north-south street, ["plate", x, y, theme] a yard's ground picture alone,
        // ["label", x, y, words] a standing sign.
        parkway: [
          ["street", 0, 1120, 2496], ["asphalt", -416, 1216, 416, 320], ["asphalt", 2496, 1216, 416, 320],
          ["vstreet", 992, 1632, 1120], ["asphalt", 1088, 1536, 320, 192],
          ["label", 1248, 2300, "ROAD OUT OF TOWN\nOPENS IN FULL LIFE"], ["barricade-ns", 1088, 2400],
          ["autumn-shrub-a", 1010, 2620], ["autumn-shrub-b", 1120, 2640], ["autumn-shrub-c", 1240, 2620], ["autumn-shrub-a", 1350, 2640],
          ["tree-maple-orange", 1020, 2520], ["tree-maple-orange", 1330, 2510],
          // maples along both sides of the through road, with gaps to cross
          ["tree-maple-orange", 80, 920], ["tree-maple-orange", 420, 920], ["tree-maple-orange", 760, 920], ["tree-maple-orange", 1400, 920],
          ["tree-maple-orange", 1740, 920], ["tree-maple-orange", 2080, 920], ["tree-maple-orange", 2360, 920],
          ["tree-maple-orange", 80, 1660], ["tree-maple-orange", 420, 1660], ["tree-maple-orange", 760, 1660],
          ["tree-maple-orange", 1580, 1660], ["tree-maple-orange", 1920, 1660], ["tree-maple-orange", 2260, 1660],
          // the golf course edge on both sides of the road out of town (Codex, PR #9)
          ["fairway", 0, 1860], ["putting-green", 440, 2200], ["golf-flag", 676, 2400], ["sand-trap", 560, 1940],
          ["fairway", 1560, 1860], ["fairway", 1984, 2200], ["putting-green", 1984, 1820], ["golf-flag", 2220, 2010],
          ["sand-trap", 1620, 2420], ["golf-cart", 1760, 2160], ["golf-cart", 260, 2520],
          // a meadow up top
          ["tree-maple-orange", 300, 200], ["tree-maple-orange", 900, 380], ["tree-maple-orange", 1500, 160], ["tree-maple-orange", 2100, 420],
          ["autumn-shrub-c", 600, 600], ["autumn-shrub-a", 1200, 640], ["autumn-shrub-b", 1800, 560], ["autumn-shrub-c", 2300, 200],
          ["decal-leaf-drift", 200, 700], ["decal-scattered-maple", 700, 300], ["decal-leaf-drift", 1300, 400], ["decal-scattered-maple", 1900, 750],
          ["decal-leaf-drift", 2300, 650], ["decal-scattered-maple", 500, 1850], ["decal-leaf-drift", 1700, 1850]
        ],
        park: [
          ["vignette", 1040, 620, "hoa-president"], ["vignette", 260, 260, "grill-master"], ["vignette", 1880, 300, "retirees"],
          ["vignette", 360, 1280, "retirees"], ["vignette", 1760, 1260, "grill-master"],
          ["tree-maple-orange", 120, 160], ["tree-maple-orange", 800, 120], ["tree-maple-orange", 1500, 160], ["tree-maple-orange", 2300, 120],
          ["tree-maple-orange", 900, 760], ["tree-maple-orange", 1600, 760], ["tree-maple-orange", 60, 900], ["tree-maple-orange", 2360, 900],
          ["tree-maple-orange", 1000, 1500], ["tree-maple-orange", 1480, 1520], ["tree-maple-orange", 200, 1820], ["tree-maple-orange", 2280, 1800],
          ["autumn-shrub-a", 700, 600], ["autumn-shrub-b", 1760, 620], ["autumn-shrub-c", 1100, 1260], ["autumn-shrub-a", 1500, 1240],
          ["autumn-shrub-b", 800, 1820], ["autumn-shrub-c", 1700, 1840], ["autumn-shrub-a", 40, 520], ["autumn-shrub-b", 2420, 560],
          ["decal-leaf-drift", 600, 1000], ["decal-scattered-maple", 1200, 520], ["decal-leaf-drift", 1900, 1000], ["decal-scattered-maple", 400, 1700],
          ["decal-leaf-drift", 1300, 1800], ["decal-scattered-maple", 2100, 1700], ["decal-leaf-drift", 700, 300], ["decal-scattered-maple", 2000, 200],
          ["beach-ball", 1150, 1650]
        ],
        elementary: [
          // the school, its sign and flag, the bike rack and the lost-and-found bin by the door
          ["school-front", 100, 100], ["flagpole", 1200, 400], ["school-sign", 420, 700], ["bike-rack", 120, 700], ["lost-and-found", 760, 600],
          ["text", 530, 341, 240, 32, "MAPLE HOLLOW ELEM.", "#171C35"], ["text", 464, 726, 168, 51, "BOOK FAIR MON\nLICE CHECK TUE", "#F2D7A1"],
          // the pickup line, cars idling in it
          ["pickup-lane", 1300, 0], ["minivan-a", 1360, 150], ["pickup-suv", 1360, 340], ["minivan-b", 1580, 540],
          // chalk on the blacktop
          ["four-square", 140, 980], ["hopscotch", 480, 920], ["usa-map", 700, 1000],
          // the playground, where the Math Homework fight happens
          ["swing-set", 1980, 760], ["swing-set", 2240, 760], ["playground-slide", 2500, 770], ["monkey-bars", 2000, 1080],
          ["merry-go-round", 2330, 1120], ["sandbox", 2620, 1160], ["toy-car", 2200, 1400], ["beach-ball", 2100, 1300], ["beach-ball", 2560, 1420],
          // the soccer field, one goal at each end
          ["soccer-goal", 520, 1480], ["soccer-goal", 520, 2380], ["beach-ball", 600, 1900], ["decal-leaf-drift", 760, 1700],
          // trees and shrubs around the edges, with wide gaps to walk in from every road
          ["tree-maple-orange", 2600, 160], ["tree-maple-orange", 2780, 380], ["tree-maple-orange", 2620, 2250], ["tree-maple-orange", 1250, 2380],
          ["tree-maple-orange", 140, 1650], ["tree-maple-orange", 300, 2540], ["tree-maple-orange", 1720, 2560], ["tree-maple-orange", 2080, 2540],
          ["tree-maple-orange", 60, 2200], ["tree-maple-orange", 2720, 1700], ["tree-maple-orange", 1480, 1980], ["tree-maple-orange", 2300, 2000],
          ["autumn-shrub-a", 1940, 700], ["autumn-shrub-b", 2700, 700], ["autumn-shrub-c", 1940, 1500], ["autumn-shrub-a", 2700, 1560],
          ["autumn-shrub-b", 60, 1300], ["autumn-shrub-c", 1000, 2620], ["autumn-shrub-a", 2200, 2100], ["autumn-shrub-b", 1950, 120],
          ["decal-leaf-drift", 1900, 450], ["decal-scattered-maple", 400, 2500], ["decal-leaf-drift", 2300, 1900], ["decal-scattered-maple", 900, 1400],
          ["decal-leaf-drift", 1100, 1900], ["decal-scattered-maple", 1600, 2300], ["decal-leaf-drift", 2500, 1300], ["decal-scattered-maple", 2600, 2450],
          ["decal-leaf-drift", 300, 2000], ["decal-scattered-maple", 2050, 2250], ["decal-scattered-maple", 2750, 600]
        ]
      },
      bossSpots: { mathHomework: ["elementary", 2300, 1380], hoaPresident: ["birch", 640, 1090], goldWatch: ["park", 1290, 1060], mortgageRefinance: ["mall", 784, 560], holidayParty: ["community", 1250, 760] } // where each boss comes out, if its area is open
    },
    yardOrder: [0, 1, 2, 3, 4, 5],                    // which backyards-v2 cell goes behind each house frame
    interiorY: 3500,                                  // the inside of your house, far below the neighborhood
    yourHouse: { doorDx: -111, garageDx: 56, signDy: -380, door: [37, 232, 42, 108] }, // door rect in your-house-v2.png
    lemonade: [620, 930],                            // one house over from yours, on the parkway
    lego: [[600, 250, 1], [700, 262, 2], [1300, 300, 0], [1150, 1560, 1], [1900, 1650, 0]],
    keyHuntSpots: [["north", 2, -130, 22, "rock"], ["north", 1, 0, 30, "mat"], ["north", 3, 90, 30, "pot"], ["north", 0, -100, 32, "mailbox"],
                   ["north", 4, -40, 30, "mat"], ["south", 2, -60, 30, "pot"], ["south", 1, 40, 30, "rock"], ["south", 3, -30, 30, "mailbox"]]
  },
  // The big house (Nov 10, Maple v2 step 2, Rami picked option C "spread out"): Codex's measured ground floor with the
  // rooms twice as wide and 1.5x as tall, furniture at its drawn size. Layout: src/data/house-v2.js, built by
  // tools/build_house_v2.py. Upstairs comes next; until then a baby gate blocks the stairs. on: false = the v1 rooms.
  house2: {
    on: true,
    entryDx: 72,                 // where you appear inside, this far in from the front door
    exitPx: 34,                  // step this close to the front door (inside) to go back out
    gateLine: "Baby gate. Upstairs opens in the next update.",
    upstairs: true,              // Maple v2 step 2b: the stairs work (false = the baby gate stays)
    upstairsGap: 1400,           // upstairs sits this far to the right of the ground floor (far enough that no camera sees both)
    climbMs: 700,                // the stair climb animation
    follow: { radius: 220, max: 6, delayMs: 1200 }, // decided Nov 10: a few walkers follow you up or down; bosses always do
    parkDx: 150,                 // the V8 parks this far right of the minivan's center
    transitMs: 520               // the walk in or out of a door (you can't be hit while it plays)
  },
  yardProps: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  // Step 4 (Nov 9): the neighborhood's own crowd. When the office would spawn one of these, it sometimes sends the
  // home version instead: [office kind]: [home kind, chance].
  // Nov 12: Maple Hollow has no interns, errands or office plants, so it had half the ways to heal. Now and then a beaten
  // enemy at home leaves a slice of leftover pizza (same +HP as the office's). A cooldown keeps it from raining pizza.
  snackDrop: { chance: 0.02, cooldownMs: 20000, lifeMs: 45000 },
  enemySwap: { bill: ["taxNotice", 0.5], snackAttack: ["leafPile", 0.7], backTwinge: ["gutterClog", 0.6], calendarInvite: ["lawnMower", 0.6], spamCall: ["leafPile", 0.25] },
  // The toy-brick floor (step 4): step on one and you'll know. [x, y, density 0-3] in world px; "kids" spots are
  // inside the kid's room (relative to its top-left). One hit per patch every few seconds, plus a short limp.
  lego: {
    damage: 1, cooldownMs: 3000, slowMs: 700, hitPx: 18,
    lines: ["OUCH! LEGO.", "IN SOCKS?!", "WHO LEFT THIS HERE", "SON OF A BRICK"],
    outdoor: [[880, 470, 1], [990, 488, 2], [1110, 476, 0], [1290, 860, 1], [700, 900, 0]],
    kids: [[120, 160, 2], [210, 150, 3], [260, 220, 1], [150, 230, 2], [320, 250, 0]]
  },
  // The Lemonade Stand (step 4): Maple Hollow's Lounge, on the sidewalk by your house. Items: INTERNS.lounge.stand.
  lemonade: { spot: [1240, 552] },
  // Step 5 (Nov 9, Rami: "line up looks good"): Maple Hollow's own boss lineup. No 56 coin flip at home.
  // "mathHomework" is the Fifth-Grade Math Homework boss (built Nov 10). fallback only matters if a boss is ever missing.
  bosses: {
    midlife: ["mathHomework", "hoaPresident", "mortgageRefinance", "holidayParty", "midlifeCrisis", "goldWatch"],
    full:    ["mathHomework", "hoaPresident", "mortgageRefinance", "holidayParty", "midlifeCrisis", "retirementBoss", "pickleballChamp"],
    ages: { mathHomework: 45, hoaPresident: 48, holidayParty: 56 },   // spawn ages that differ from the office
    hpMult: { hoaPresident: 0.35 },   // the HOA was built for 70; at 48 he's closer to Your New Boss
    fallback: { mathHomework: "performanceReview" }
  },
  // Locked out (Nov 9, step 3a): you can't get into your own house. The spare key is hidden at one of these spots
  // (a different one each run). Walk over a spot to check it. Find the key, then walk to your front door.
  keyHunt: {
    startAge: 40.4,        // a few seconds into the run
    checkPx: 40,           // how close counts as checking a spot
    doorPx: 56,            // how close to your door to unlock it
    // spots: [row, lot, dx, dy, kind]. dx/dy are from the lot's center at the house front.
    spots: [
      ["north", 2, 70, 22, "rock"], ["north", 1, -40, 26, "mat"], ["north", 3, 60, 30, "pot"],
      ["north", 0, 30, 28, "mailbox"], ["north", 4, -60, 24, "mat"], ["south", 2, -50, 26, "pot"],
      ["south", 1, 40, 30, "rock"], ["south", 3, -30, 24, "mailbox"]
    ],
    notHere: {
      rock: ["Just a rock. A real one.", "A real rock. Rude."],
      mat: ["Under the mat: one penny and a spider.", "Under the mat: guilt and dirt."],
      pot: ["The flower pot. Just dirt and a sad mum.", "Empty pot. Dead mum."],
      mailbox: ["The mailbox: three catalogs addressed to the last owner.", "Mailbox: a jury duty notice. Not yours. Probably."]
    },
    found: "There it is. The spare key, right where you'll never remember putting it.",
    doorLine: "Locked out of your own house. The spare key is around here somewhere.",
    openLine: "Home sweet home. Someone left you leftovers. Grab your bonus and walk right in.",
    lootWaitMs: 6000, doorBeatMs: 450, doorSwingMs: 800, // doorBeatMs: the pause after the bonus screen closes, so the swing isn't missed; // the door swings open once you take the bonus chest (or after this long), then you can walk straight in
    chestKey: "keyHunt", scoreBonus: 1500, healFrac: 0.5
  }
};

(() => {
  const M0 = window.MAPLE_HOLLOW, V = M0.v2;
  if (V && V.on) { // v2: swap in the bigger layout before anything is generated
    M0.width = V.width; M0.lotWidth = V.lotWidth; M0.firstLotX = V.firstLotX; M0.rows = V.rows;
    M0.interior.y = V.interiorY; Object.assign(M0.yourHouse, V.yourHouse);
    M0.lemonade.spot = V.lemonade; M0.lego.outdoor = V.lego; M0.keyHunt.spots = V.keyHuntSpots;
  }
  const M = window.MAPLE_HOLLOW, R = M.rows, W = M.width;
  const floors = [], walls = [];
  const band = (y0, y1, material) => floors.push({ x: 0, y: y0, width: W, height: y1 - y0, material, district: "home" });
  band(0, R.sidewalk1, "mh_grass");
  band(R.sidewalk1, R.street1, "mh_sidewalk");
  band(R.street1, R.street1End, "mh_street");
  band(R.street1End, R.sidewalk2End, "mh_sidewalk");
  band(R.sidewalk2End, R.sidewalk3, "mh_grass");
  band(R.sidewalk3, R.street2, "mh_sidewalk");
  band(R.street2, R.street2End, "mh_street");
  band(R.street2End, R.sidewalk4End, "mh_sidewalk");
  band(R.sidewalk4End, R.bottom, "mh_grass");
  const TWm = V && V.on && V.treeWall && V.treeWall.on ? (V.treeWall.margin || 0) : 0; // breathing room at the left and right ends (Nov 11)
  if (TWm) [-TWm, W].forEach(x => floors.push({ x, y: 0, width: TWm, height: R.bottom, material: "mh_grass", district: "home" }));
  const lotX = i => M.firstLotX + i * M.lotWidth;
  const yh = M.yourHouse, spawnX = lotX(yh.lot), spawnY = (yh.row === "north" ? R.sidewalk1 : R.sidewalk3) + 32;
  // inside the house: three room floors and the hallway under them
  const I = M.interior;
  const H2 = M.house2 && M.house2.on && window.HOUSE_V2 ? window.HOUSE_V2 : null;
  if (H2) { // the big house (step 2): floors from house-v2.js; walls and furniture are built in src/maple-hollow.js
    const X = I.x, Y = I.y, add = (r, mat) => floors.push({ x: X + r[0], y: Y + r[1], width: r[2], height: r[3], material: mat, district: "house" });
    H2.base.forEach(b => add(b.rect, "mh2_" + b.floor));
    H2.rooms.forEach(r => add(r.rect, r.id === "stairs" ? "mh2_" + H2.base[0].floor : "mh2_" + r.floor));
    const fe = H2.doors.find(d => d.id === "front-entry").rect, gar = H2.rooms.find(r => r.id === "garage").rect;
    const doorFeet = Y + fe[1] + fe[3] / 2 + 24;                 // feet level when you stand in the front door
    I.entry = [X + fe[0] + fe[2] + M.house2.entryDx, doorFeet];
    I.exitMat = [X + fe[0] + fe[2] + 6, doorFeet];
    I.exitPx = M.house2.exitPx;
    I.h2 = { x: X, y: Y, w: H2.size[0], h: H2.size[1] };
    const U = H2.floor2;
    if (U && M.house2.upstairs) { // upstairs, to the right of the ground floor
      const UX = X + H2.size[0] + M.house2.upstairsGap, addU = (r, mat) => floors.push({ x: UX + r[0], y: Y + r[1], width: r[2], height: r[3], material: mat, district: "house" });
      U.base.forEach(b => addU(b.rect, "mh2_" + b.floor));
      U.rooms.forEach(r => addU(r.rect, r.id === "stairs" ? "mh2_" + U.base[0].floor : "mh2_" + r.floor));
      I.h2.up = { x: UX, y: Y, w: U.size[0], h: U.size[1] };
      const ab = U.rooms.find(r => r.id === "abe-room"); if (ab) I.h2.abe = [UX + ab.rect[0], Y + ab.rect[1], ab.rect[2], ab.rect[3]];
    }
    const G = M.garage; G.x = X + gar[0]; G.y = Y + gar[1]; G.w = gar[2]; G.h = gar[3];
  } else {
  I.rooms.forEach((r, i) => floors.push({ x: I.x + i * I.roomW, y: I.y, width: I.roomW, height: I.roomH, material: "mh_room_" + r.id, district: "house" }));
  floors.push({ x: I.x, y: I.y + I.roomH, width: I.roomW * 3, height: I.hallH, material: "mh_hall", district: "house" });
  const G = M.garage; G.x = I.x + I.roomW * 3; G.y = I.y; G.h = I.roomH + I.hallH; // the garage: full height, open to the hallway's end
  floors.push({ x: G.x, y: G.y, width: G.w, height: G.h, material: "mh_garage", district: "house" });
  I.entry = [I.x + I.roomW * 1.5, I.y + I.roomH + I.hallH / 2];   // where you appear inside (middle of the hallway)
  I.exitMat = [I.x + I.roomW * 1.5, I.y + I.roomH + I.hallH - 6]; // step on the front mat to go back out
  }
  // ---- the whole town (Nov 13): roads and closed areas around your block (MAPLE_HOLLOW.v2.town) ----
  const TN = V && V.on && V.town && V.town.on && TWm && !/[?&]notown=1/.test(location.search) ? V.town : null; let town = null;
  if (TN) {
    const RW = TN.road, bx0 = -TWm, bx1 = W + TWm;                       // your block's walkable edges (with the grass margins)
    const colX = [bx0], rowY = [0];                                        // left edge of each column, top edge of each row, from your block outward
    for (let c = 1; c <= 2; c++) colX.push(colX[c - 1] - RW - TN.colW);
    for (let r = 1; r <= 2; r++) rowY.push(rowY[r - 1] - RW - TN.rowH[r - 1]);
    const colW = c => c === 0 ? bx1 - bx0 : TN.colW, rowH = r => r === 0 ? R.bottom : TN.rowH[r - 1];
    const x0 = colX[2], y0 = rowY[2], x1 = bx1, y1 = R.bottom;
    const roadsV = [1, 2].map(c => [colX[c] + TN.colW, y0, RW, y1 - y0]);  // [x, y, w, h], the road just right of column c
    const roadsH = [1, 2].map(r => [x0, rowY[r] + TN.rowH[r - 1], x1 - x0, RW]); // the road just below row r
    [...roadsV, ...roadsH].forEach(([x, y, w, h]) => floors.push({ x, y, width: w, height: h, material: "mh_road", district: "home" }));
    const areas = TN.areas.map(([id, name, age, c, r]) => ({ id, name, age, rect: [colX[c], rowY[r], colW(c), rowH(r)] }));
    town = { x0, y0, x1, y1, roadW: RW, roadsV, roadsH, areas, blockX: [bx0, bx1] };
  }
  const houseBottom = I.h2 ? I.h2.y + I.h2.h : I.y + I.roomH + I.hallH, houseRight = I.h2 ? (I.h2.up ? I.h2.up.x + I.h2.up.w : I.h2.x + I.h2.w) : M.garage.x + M.garage.w;
  window.MAPLE_HOLLOW_LAYOUT = {
    id: "maple-hollow", version: 1, stage: "home",
    spawn: [spawnX, spawnY],
    bounds: town ? { x: town.x0, y: town.y0, width: Math.max(W, houseRight + 60) - town.x0, height: houseBottom + 60 - town.y0 }
      : { x: 0, y: 0, width: Math.max(W, houseRight + 60), height: houseBottom + 60 },
    town,
    districts: [{ id: "home", name: "Maple Hollow", polygon: town ? [[town.x0, town.y0], [town.x1, town.y0], [town.x1, R.bottom], [town.x0, R.bottom]] : [[0, 0], [W, 0], [W, R.bottom], [0, R.bottom]] },
                { id: "house", name: "Your House", polygon: [[I.x, I.y], [houseRight, I.y], [houseRight, houseBottom], [I.x, houseBottom]] }],
    floors, walls, gates: [], placements: [], workers: [], lights: [], floorDecor: [], structures: [], labels: [],
    promotions: { phases: [] }, clearSpaces: [], protectedRoutes: [], internalRoutes: []
  };
})();
