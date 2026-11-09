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
  northHouses: [0, 1, 2, 3, 4, 5],   // frame order in maple-hollow-houses-v1.png
  southHouses: [3, 5, 0, 4, 2, 1],
  yourHouse: { row: "north", lot: 2 }, // you start on the sidewalk in front of this one
  // little yard props (frame numbers in maple-hollow-tiles-props-v1.png, 32x32 cells): drawn under everyone, not solid
  yardProps: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
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
  window.MAPLE_HOLLOW_LAYOUT = {
    id: "maple-hollow", version: 1, stage: "home",
    spawn: [spawnX, spawnY],
    bounds: { x: 0, y: 0, width: W, height: R.bottom },
    districts: [{ id: "home", name: "Maple Hollow", polygon: [[0, 0], [W, 0], [W, R.bottom], [0, R.bottom]] }],
    floors, walls, gates: [], placements: [], workers: [], lights: [], floorDecor: [], structures: [], labels: [],
    promotions: { phases: [] }, clearSpaces: [], protectedRoutes: [], internalRoutes: []
  };
})();
