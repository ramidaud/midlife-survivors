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
    fridgeHeal: 4,         // the fridge has leftovers: heal this much, once per run
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
    lawn: ["lawn-v2-a.png", "lawn-v2-b.png"], driveway: "driveway-v2.png",
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
    fence: { w: 16, top: 40, gate: [224, 288], steps: [184, 236] }, // side fences with a gate gap; the top hedge has steps in the middle
    yardOrder: [0, 1, 2, 3, 4, 5],                    // which backyards-v2 cell goes behind each house frame
    interiorY: 3500,                                  // the inside of your house, far below the neighborhood
    yourHouse: { doorDx: -111, garageDx: 56, signDy: -380, door: [37, 232, 42, 108] }, // door rect in your-house-v2.png
    lemonade: [620, 930],                            // one house over from yours, on the parkway
    lego: [[600, 250, 1], [700, 180, 2], [1300, 300, 0], [1150, 1560, 1], [1900, 1650, 0]],
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
    parkDx: 150,                 // the V8 parks this far right of the minivan's center
    transitMs: 520               // the walk in or out of a door (you can't be hit while it plays)
  },
  yardProps: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  // Step 4 (Nov 9): the neighborhood's own crowd. When the office would spawn one of these, it sometimes sends the
  // home version instead: [office kind]: [home kind, chance].
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
    openLine: "Home sweet home. Someone left you leftovers. Walk in the front door any time.",
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
    const G = M.garage; G.x = X + gar[0]; G.y = Y + gar[1]; G.w = gar[2]; G.h = gar[3];
  } else {
  I.rooms.forEach((r, i) => floors.push({ x: I.x + i * I.roomW, y: I.y, width: I.roomW, height: I.roomH, material: "mh_room_" + r.id, district: "house" }));
  floors.push({ x: I.x, y: I.y + I.roomH, width: I.roomW * 3, height: I.hallH, material: "mh_hall", district: "house" });
  const G = M.garage; G.x = I.x + I.roomW * 3; G.y = I.y; G.h = I.roomH + I.hallH; // the garage: full height, open to the hallway's end
  floors.push({ x: G.x, y: G.y, width: G.w, height: G.h, material: "mh_garage", district: "house" });
  I.entry = [I.x + I.roomW * 1.5, I.y + I.roomH + I.hallH / 2];   // where you appear inside (middle of the hallway)
  I.exitMat = [I.x + I.roomW * 1.5, I.y + I.roomH + I.hallH - 6]; // step on the front mat to go back out
  }
  const houseBottom = I.h2 ? I.h2.y + I.h2.h : I.y + I.roomH + I.hallH, houseRight = I.h2 ? I.h2.x + I.h2.w : M.garage.x + M.garage.w;
  window.MAPLE_HOLLOW_LAYOUT = {
    id: "maple-hollow", version: 1, stage: "home",
    spawn: [spawnX, spawnY],
    bounds: { x: 0, y: 0, width: W, height: houseBottom + 60 },
    districts: [{ id: "home", name: "Maple Hollow", polygon: [[0, 0], [W, 0], [W, R.bottom], [0, R.bottom]] },
                { id: "house", name: "Your House", polygon: [[I.x, I.y], [houseRight, I.y], [houseRight, houseBottom], [I.x, houseBottom]] }],
    floors, walls, gates: [], placements: [], workers: [], lights: [], floorDecor: [], structures: [], labels: [],
    promotions: { phases: [] }, clearSpaces: [], protectedRoutes: [], internalRoutes: []
  };
})();
