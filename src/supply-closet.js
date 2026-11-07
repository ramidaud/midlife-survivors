// The Supply Closet (Nov 7, Rami): a secret back hallway from the Server Room to the Executive Wing.
// A glitchy badge reader on the Server Room's east wall blinks red. Stand on the plate in front of it for
// 5 seconds without getting hit and it beeps green: both doors slide open. The Server Room opens at 50 and the
// Executive Wing at 55, so the closet is a way into the corner office early. Eli from IT's card hints at it.
// Step 1 of docs/plans/supply-closet.md: placeholder doors and reader until ChatGPT's art lands.
window.SUPPLY_CLOSET = {
  standMs: 5000,                       // how long you stand on the plate
  plate: { x: 1168, y: -1476, halfW: 40, halfH: 34 },  // in front of the reader, inside the Server Room
  reader: { x: 1200, y: -1556 },
  doors: [ // the two gaps cut into the walls below (32 wide, 112 tall)
    { id: "closet-door-server", x: 1216, y: -1552, w: 32, h: 112, style: "server" },
    { id: "closet-door-exec", x: 2208, y: -1552, w: 32, h: 112, style: "executive" }
  ],
  line: "Badge accepted. Please don't tell IT.",
  readerCaption: "BADGE READER. The light is red. It's been red since 2019. It seems to be thinking about it."
};

// Add the hallway to the office map before the office is built: a floor, two walls, decor, and door-sized gaps
// in the Server Room and Executive Wing walls. The doors that fill those gaps are made in init() below.
(function addClosetToMap() {
  const L = window.START_AREA_LAYOUT;
  if (!L || L._supplyCloset) return;
  L._supplyCloset = true;
  const split = (id, cutTop, cutBottom) => { // replace one wall with the parts above and below the door
    const i = L.walls.findIndex(w => w.id === id); if (i < 0) return;
    const w = L.walls[i], parts = [];
    if (cutTop > w.y) parts.push({ ...w, id: w.id + "-a", height: cutTop - w.y });
    if (cutBottom < w.y + w.height) parts.push({ ...w, id: w.id + "-b", y: cutBottom, height: w.y + w.height - cutBottom });
    L.walls.splice(i, 1, ...parts);
  };
  split("wall-131", -1552, -1440); split("wall-132", -1552, -1440); split("wall-174", -1552, -1440);
  // Hallway: interior x 1248 to 2208, y -1600 to -1440, plus the two door gaps (below the Server Room's OFFLINE rack).
  L.floors.push({ x: 1248, y: -1600, width: 960, height: 160, material: "server" });
  L.floors.push({ x: 1216, y: -1552, width: 32, height: 112, material: "server" });
  L.floors.push({ x: 2208, y: -1552, width: 32, height: 112, material: "server" });
  for (let x = 1248; x < 2208; x += 256) {
    const width = Math.min(256, 2208 - x);
    L.walls.push({ id: "closet-wall-n-" + x, axis: "x", side: "n", style: "server", x, y: -1632, width, height: 32 });
    L.walls.push({ id: "closet-wall-s-" + x, axis: "x", side: "s", style: "server", x, y: -1440, width, height: 32 });
  }
  // June's coat rack stood right in front of the Executive Wing door: scoot it over.
  const coat = L.placements.find(p => p.id === "coat_rack-199"); if (coat) coat.x = 2400;
  // Placeholder decor against the back wall (the real closet props come from ChatGPT in step 3).
  L.placements.push({ id: "closet-lost-found", prop: "lost_found", x: 1520, y: -1562, variant: 1, group: "Supply Closet", caption: "Lost and found. Every pen you've lost since 2009." });
  L.placements.push({ id: "closet-cabinet", prop: "cabinet", x: 1760, y: -1562, variant: 0, group: "Supply Closet", caption: "SUPPLY CABINET. Toner, paper, and one label maker nobody knows how to use." });
  L.placements.push({ id: "closet-crash-cart", prop: "server_crash_cart", x: 1980, y: -1562, variant: 1, group: "Supply Closet", caption: "A monitor cart someone parked here in 2014. It has seniority now." });
})();

window.SupplyCloset = (() => {
  let wallsFixed = false, scene = null, doors = [], reader = null, ring = null, plateImg = null, opened = false, standSince = 0, blink = 0, hurtMark = null;
  function textures(sc) {
    if (!sc.textures.exists("closet_door")) makeCanvasTex(sc, "closet_door", 32, 208, c => {
      c.fillStyle = "#171C35"; c.fillRect(0, 0, 32, 208);
      c.fillStyle = "#526078"; c.fillRect(2, 2, 28, 204);
      c.fillStyle = "#83A89A"; c.fillRect(2, 2, 28, 3);
      c.fillStyle = "#303750"; for (let y = 20; y < 200; y += 24) c.fillRect(4, y, 24, 2);
      c.fillStyle = "#EF9347"; c.fillRect(2, 120, 28, 4); // a strip of caution tape
    });
    for (const [key, color] of [["closet_reader_red", "#C45C4B"], ["closet_reader_dim", "#5A2E2A"], ["closet_reader_green", "#83A89A"]]) {
      if (!sc.textures.exists(key)) makeCanvasTex(sc, key, 12, 18, c => {
        c.fillStyle = "#171C35"; c.fillRect(0, 0, 12, 18);
        c.fillStyle = "#303750"; c.fillRect(1, 1, 10, 16);
        c.fillStyle = "#526078"; c.fillRect(3, 8, 6, 7);   // the card slot
        c.fillStyle = color; c.fillRect(4, 3, 4, 3);        // the light
      });
    }
    if (!sc.textures.exists("closet_plate")) makeCanvasTex(sc, "closet_plate", 48, 32, c => {
      c.fillStyle = "#171C35"; c.fillRect(0, 0, 48, 32);
      c.fillStyle = "#526078"; c.fillRect(2, 2, 44, 28);
      c.fillStyle = "#303750"; for (let x = 6; x < 44; x += 8) c.fillRect(x, 6, 4, 2), c.fillRect(x + 2, 16, 4, 2), c.fillRect(x, 24, 4, 2);
    });
  }
  function init(sc) {
    destroy();
    if (!window.USE_START_AREA || !window.START_AREA_LAYOUT || !START_AREA_LAYOUT._supplyCloset) return;
    scene = sc; opened = false; standSince = 0; wallsFixed = false; textures(sc);
    const C = SUPPLY_CLOSET;
    doors = C.doors.map(d => {
      const o = sc.add.image(d.x + d.w / 2, d.y + d.h, "closet_door").setOrigin(0.5, 1);
      o.setDepth(10000 + o.y);
      sc.physics.add.existing(o);
      if (window.propGroup) window.propGroup.add(o);
      o.body.setImmovable(true); o.body.moves = false;
      o.body.setSize(d.w, d.h).setOffset(0, o.height - d.h);
      o.propKind = "prop_wall"; o.hp = 9999;
      const rect = { x: d.x - 8, y: d.y, w: d.w + 16, h: d.h };
      window.navExtraBlockers = window.navExtraBlockers || []; window.navExtraBlockers.push(rect);
      return { o, rect };
    });
    plateImg = sc.add.image(C.plate.x, C.plate.y, "closet_plate").setDepth(3.4);
    reader = sc.add.image(C.reader.x, C.reader.y, "closet_reader_red").setScale(2).setDepth(10000 + C.reader.y + 200);
    reader.caption = C.readerCaption;
    ring = sc.add.graphics().setDepth(3.5);
    sc.events.once("shutdown", () => { doors = []; reader = ring = plateImg = null; scene = null; });
  }
  function open(sc, quiet) {
    opened = true;
    if (ring) ring.clear();
    if (reader) reader.setTexture("closet_reader_green");
    doors.forEach(({ o, rect }) => {
      const list = window.navExtraBlockers || [], i = list.indexOf(rect); if (i >= 0) list.splice(i, 1);
      if (o.body) o.body.enable = false;
      sc.tweens.add({ targets: o, alpha: 0, scaleY: 0.1, duration: 420, ease: "Quad.In", onComplete: () => o.active && o.setVisible(false) });
    });
    if (quiet) return;
    if (typeof sfx === "function") sfx("chestOpen");
    if (window.showLowerThird) window.showLowerThird("reward", "IT", SUPPLY_CLOSET.line, 4500, "SUPPLY CLOSET");
    if (window.achEvent) window.achEvent("closetBadge");
    if (window.Telemetry && Telemetry.note) Telemetry.note("closetBadge");
  }
  // Vertical walls are drawn rising 112 px above their base, so the piece below each door would cover the doorway.
  // Trim those two pieces once the office has been built.
  function fixWalls(sc) {
    const want = ["wall-132-b", "wall-174-b"], found = sc.children.list.filter(o => want.includes(o.sliceId));
    found.forEach(o => { if (!o._closetCrop) { o._closetCrop = true; o.setCrop(0, 112, o.width, o.height - 112); } });
    if (found.length === want.length) wallsFixed = true;
  }
  function update(sc) {
    if (scene && !wallsFixed) fixWalls(sc);
    if (!scene || opened || !player || !player.active) return;
    if (typeof paused !== "undefined" && paused) return;
    const C = SUPPLY_CLOSET, now = runElapsedMs;
    // The reader blinks while it waits.
    if (now > blink) { blink = now + 600; if (reader && !standSince) reader.setTexture(reader.texture.key === "closet_reader_red" ? "closet_reader_dim" : "closet_reader_red"); }
    const fx = player.x, fy = player.y + player.height / 2; // your feet
    const on = Math.abs(fx - C.plate.x) < C.plate.halfW && Math.abs(fy - C.plate.y) < C.plate.halfH;
    const hurtNow = typeof lastHurt !== "undefined" ? lastHurt : 0; // getting hit changes lastHurt
    if (!on) { if (standSince) { standSince = 0; ring.clear(); } return; }
    if (!standSince || hurtNow !== hurtMark) { standSince = now; hurtMark = hurtNow; } // step on, or got hit: start over
    const t = Math.min(1, (now - standSince) / C.standMs);
    ring.clear();
    ring.lineStyle(4, 0x171C35, 0.9).strokeCircle(C.plate.x, C.plate.y, 30);
    ring.lineStyle(3, 0xEF9347, 1).beginPath().arc(C.plate.x, C.plate.y, 30, -Math.PI / 2, -Math.PI / 2 + t * Math.PI * 2).strokePath();
    if (reader) reader.setTexture(Math.floor(now / 150) % 2 ? "closet_reader_red" : "closet_reader_dim");
    if (t >= 1) open(sc);
  }
  function destroy() {
    doors.forEach(({ o, rect }) => {
      const list = window.navExtraBlockers || [], i = list.indexOf(rect); if (i >= 0) list.splice(i, 1);
      if (o && o.destroy) o.destroy();
    });
    [reader, ring, plateImg].forEach(o => o && o.destroy && o.destroy());
    doors = []; reader = ring = plateImg = null; scene = null; opened = false; standSince = 0;
  }
  return { init, update, destroy, open: () => scene && !opened && open(scene, false), isOpen: () => opened, plate: () => SUPPLY_CLOSET.plate };
})();
