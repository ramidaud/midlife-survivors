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
  northHouses: [0, 1, 2, 3, 4, 5],   // frame order in maple-hollow-houses-v1.png
  southHouses: [3, 5, 0, 4, 2, 1],
  yourHouse: { row: "north", lot: 2 }, // you start on the sidewalk in front of this one
  // little yard props (frame numbers in maple-hollow-tiles-props-v1.png, 32x32 cells): drawn under everyone, not solid
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
  I.rooms.forEach((r, i) => floors.push({ x: I.x + i * I.roomW, y: I.y, width: I.roomW, height: I.roomH, material: "mh_room_" + r.id, district: "house" }));
  floors.push({ x: I.x, y: I.y + I.roomH, width: I.roomW * 3, height: I.hallH, material: "mh_hall", district: "house" });
  I.entry = [I.x + I.roomW * 1.5, I.y + I.roomH + I.hallH / 2];   // where you appear inside (middle of the hallway)
  I.exitMat = [I.x + I.roomW * 1.5, I.y + I.roomH + I.hallH - 6]; // step on the front mat to go back out
  window.MAPLE_HOLLOW_LAYOUT = {
    id: "maple-hollow", version: 1, stage: "home",
    spawn: [spawnX, spawnY],
    bounds: { x: 0, y: 0, width: W, height: I.y + I.roomH + I.hallH + 60 },
    districts: [{ id: "home", name: "Maple Hollow", polygon: [[0, 0], [W, 0], [W, R.bottom], [0, R.bottom]] },
                { id: "house", name: "Your House", polygon: [[I.x, I.y], [I.x + I.roomW * 3, I.y], [I.x + I.roomW * 3, I.y + I.roomH + I.hallH], [I.x, I.y + I.roomH + I.hallH]] }],
    floors, walls, gates: [], placements: [], workers: [], lights: [], floorDecor: [], structures: [], labels: [],
    promotions: { phases: [] }, clearSpaces: [], protectedRoutes: [], internalRoutes: []
  };
})();
