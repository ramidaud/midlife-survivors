// The Supply Closet (Nov 7, Rami): a secret back hallway from the Server Room to the Executive Wing.
// A glitchy badge reader on the Server Room's east wall blinks red. Stand on the plate in front of it for
// 5 seconds without getting hit and it beeps green: both doors slide open. The Server Room opens at 50 and the
// Executive Wing at 55, so the closet is a way into the corner office early. Eli from IT's card hints at it.
// Art (Nov 7, step 3): ChatGPT's kit in assets/stage/props (manifest-supply-closet-v1.json). Drawn shapes stand in if it fails to load.
window.SUPPLY_CLOSET = {
  standMs: 5000,                       // how long you stand on the plate
  plate: { x: 1168, y: -1476, halfW: 40, halfH: 34 },  // in front of the reader, inside the Server Room
  reader: { x: 1200, y: -1556 },
  doors: [ // the two gaps cut into the walls below (32 wide, 112 tall)
    { id: "closet-door-server", x: 1216, y: -1552, w: 32, h: 112, style: "server" },
    { id: "closet-door-exec", x: 2208, y: -1552, w: 32, h: 112, style: "executive" }
  ],
  line: "Badge accepted. Please don't tell IT.",
  // Today's supply (step 2): one of these is rolled each run when the doors open. weight = how often.
  supplies: {
    chest: { weight: 1, line: "Somebody expensed this and forgot." },
    nap:   { weight: 1, line: "Lights off. Door closed. Nobody checks the Supply Closet.", stillMs: 2000, everyMs: 2000, heal: 1 },
    stash: { weight: 1, line: "Petty cash. Technically.", coins: 3 }
  },
  room: { x: 1248, y: -1600, w: 960, h: 160 }, // the hallway floor, for the nap spot
  spot: { x: 1728, y: -1500 },                  // where the chest or stash lands (middle of the hallway)
  // ChatGPT's closet props, along the back wall (x, y = where the feet touch). caption = the MEMO line when you walk by.
  decor: [
    { id: "closet_shelf_paper", x: 1330, y: -1556, caption: "Paper. Enough to print every email you were cc'd on. Twice." },
    { id: "closet_chair", x: 1440, y: -1566 },
    { id: "closet_lost_found", x: 1560, y: -1560, caption: "Lost and found. Every pen you've lost since 2009." },
    { id: "closet_shelf_toner", x: 1860, y: -1556, caption: "Toner, and the label maker nobody knows how to use." },
    { id: "closet_mop_bucket", x: 2120, y: -1560, caption: "The mop has been here longer than the CEO." }
  ],
  bulbs: [1500, 1800, 2080],                  // bare bulbs hanging along the hallway (x)
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
})();

window.SupplyCloset = (() => {
  let art = false, artObjs = [], doorArt = [], seenCaps = new Set(), supply = null, napStill = 0, napNext = 0, napZz = null, wallsFixed = false, scene = null, doors = [], reader = null, ring = null, plateImg = null, opened = false, standSince = 0, blink = 0, hurtMark = null;
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
  // Load a magenta-backed PNG, key the magenta out, and register it as a texture with equal frames.
  function loadKeyed(sc, key, src, fw, fh) {
    return new Promise((ok, bad) => {
      if (sc.textures.exists(key)) return ok();
      const im = new Image();
      im.onload = () => {
        const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
        const g = c.getContext("2d"); g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height), px = d.data;
        for (let i = 0; i < px.length; i += 4) if (px[i] > 230 && px[i + 1] < 40 && px[i + 2] > 230) px[i + 3] = 0;
        g.putImageData(d, 0, 0);
        if (sc.textures.exists(key)) return ok();
        const t = sc.textures.addCanvas(key, c);
        if (fw) for (let n = 0, x = 0; x + fw <= c.width; x += fw, n++) t.add(n, 0, x, 0, fw, fh || c.height);
        ok();
      };
      im.onerror = bad;
      im.src = (window.SPOTLIGHT_ROOT || "") + "assets/stage/props/" + src + (window.BUILD ? "?v=" + window.BUILD : "");
    });
  }
  async function loadArt(sc) {
    try {
      await Promise.all([
        loadKeyed(sc, "closet_reader_art", "closet_badge_reader-v1.png", 24, 32),
        loadKeyed(sc, "closet_plate_art", "closet_floor_plate-v1.png"),
        loadKeyed(sc, "closet_door_art", "closet_door-open-v1.png", 64, 96),
        loadKeyed(sc, "closet_props_art", "supply-closet-props-v1.png")
      ]);
    } catch (e) { console.warn("Supply Closet art unavailable, using shapes"); return; }
    if (scene !== sc) return;
    const atlas = sc.textures.get("closet_props_art");
    const cells = { closet_shelf_paper: [0, 0, 96, 112], closet_shelf_toner: [96, 0, 96, 112], closet_lost_found: [192, 0, 64, 64],
      closet_mop_bucket: [256, 0, 48, 64], closet_chair: [304, 0, 48, 56], bulb0: [352, 0, 24, 40], bulb1: [376, 0, 24, 40], floor: [400, 0, 64, 64] };
    Object.entries(cells).forEach(([k, r]) => { if (!atlas.has(k)) atlas.add(k, 0, ...r); });
    if (!sc.textures.exists("closet_floor_tile")) { // a standalone copy so it can repeat as a tile
      const c = document.createElement("canvas"); c.width = 64; c.height = 64;
      c.getContext("2d").drawImage(atlas.getSourceImage(), 400, 0, 64, 64, 0, 0, 64, 64);
      sc.textures.addCanvas("closet_floor_tile", c);
    }
    art = true;
    const C = SUPPLY_CLOSET, R = C.room;
    // Concrete floor over the hallway (and the two doorways).
    artObjs.push(sc.add.tileSprite(R.x, R.y, R.w, R.h, "closet_floor_tile").setOrigin(0, 0).setDepth(3.2));
    C.doors.forEach(d => artObjs.push(sc.add.tileSprite(d.x, d.y, d.w, d.h, "closet_floor_tile").setOrigin(0, 0).setDepth(3.2)));
    plateImg.setTexture("closet_plate_art");
    reader.setTexture("closet_reader_art", 0).setScale(1);
    // Doors: the drawn door stands in each doorway. The plain block keeps doing the colliding, unseen.
    doorArt = doors.map(({ o }, i) => {
      const d = C.doors[i];
      o.setVisible(false);
      const v = sc.add.image(d.x + d.w / 2, d.y + d.h, "closet_door_art", opened ? 3 : 0).setOrigin(0.5, 1).setDepth(10000 + d.y + d.h);
      artObjs.push(v); return v;
    });
    // Props along the back wall, solid like the rest of the office furniture.
    const foot = { closet_shelf_paper: [48, 109, 50, 16], closet_shelf_toner: [48, 109, 50, 16], closet_lost_found: [32, 61, 48, 16], closet_mop_bucket: [24, 61, 28, 14], closet_chair: [24, 53, 34, 18] };
    C.decor.forEach(p => {
      const f = foot[p.id], fr = atlas.get(p.id);
      const o = sc.add.image(p.x, p.y, "closet_props_art", p.id).setOrigin(f[0] / fr.width, f[1] / fr.height);
      sc.physics.add.existing(o); if (window.propGroup) window.propGroup.add(o);
      o.body.setImmovable(true); o.body.moves = false;
      o.body.setSize(f[2], f[3]).setOffset(f[0] - f[2] / 2, f[1] - f[3]);
      o.propKind = "prop_desk"; o.hp = 9999; o.closetY = p.y; o.caption = p.caption;
      artObjs.push(o);
    });
    C.bulbs.forEach((x, i) => { const b = sc.add.image(x, C.room.y + 34, "closet_props_art", "bulb0").setOrigin(0.5, 1); b.bulb = i; b.closetY = C.room.y + 200; artObjs.push(b); });
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
    loadArt(sc);
    sc.events.once("shutdown", () => { doors = []; artObjs = []; doorArt = []; art = false; reader = ring = plateImg = napZz = null; scene = null; });
  }
  // 0 = red, 1 = brighter red, 2 = green
  function readerState(n) {
    if (!reader) return;
    if (art) reader.setTexture("closet_reader_art", n);
    else reader.setTexture(n === 2 ? "closet_reader_green" : n ? "closet_reader_dim" : "closet_reader_red");
  }
  function open(sc, quiet) {
    opened = true;
    if (ring) ring.clear();
    readerState(2);
    doors.forEach(({ o, rect }) => {
      const list = window.navExtraBlockers || [], i = list.indexOf(rect); if (i >= 0) list.splice(i, 1);
      if (o.body) o.body.enable = false;
      if (!art) sc.tweens.add({ targets: o, alpha: 0, scaleY: 0.1, duration: 420, ease: "Quad.In", onComplete: () => o.active && o.setVisible(false) });
    });
    doorArt.forEach(v => [1, 2, 3].forEach(f => sc.time.delayedCall(f * 180, () => v.active && v.setFrame(f)))); // slides open, holds open
    if (quiet) return;
    if (typeof sfx === "function") sfx("chestOpen");
    if (window.showLowerThird) window.showLowerThird("reward", "IT", SUPPLY_CLOSET.line, 4500, "SUPPLY CLOSET");
    if (window.achEvent) window.achEvent("closetBadge");
    if (window.Telemetry && Telemetry.note) Telemetry.note("closetBadge");
    stock(sc);
  }
  // Roll today's supply and put it in the closet.
  function roll() {
    const S = SUPPLY_CLOSET.supplies, keys = Object.keys(S), total = keys.reduce((a, k) => a + (S[k].weight || 0), 0);
    let r = Math.random() * total;
    for (const k of keys) { r -= S[k].weight || 0; if (r < 0) return k; }
    return keys[0];
  }
  function stock(sc, forced) {
    supply = forced || roll();
    const S = SUPPLY_CLOSET.supplies[supply], P = SUPPLY_CLOSET.spot;
    if (supply === "chest" && typeof chests !== "undefined") {
      const ch = chests.create(P.x, P.y, "chest").setDepth(3);
      ch.bossKind = "supplyCloset"; // a small chest: PICKUPS.bossChest.tiers.supplyCloset
      ch.tag = sc.add.text(P.x, P.y, "SUPPLIES", { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#EF9347", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5, 1.6).setDepth(4);
    } else if (supply === "stash") {
      for (let i = 0; i < (S.coins || 3); i++) spawnCoin(P.x - 30 + i * 30, P.y + 10, 2);
      const pz = window.pizzas && window.pizzas.create(P.x, P.y - 24, "pizza").setDepth(3);
      if (pz) pz.dieAt = runElapsedMs + 10 * 60000; // it keeps in here
    } else if (supply === "nap") {
      napStill = 0; napNext = 0;
    }
    // The supply line follows the badge line once that has had its moment.
    if (window.showLowerThird) setTimeout(() => { if (scene === sc) window.showLowerThird("reward", "SUPPLY CLOSET", S.line, 4500, "TODAY'S SUPPLY"); }, 4800);
  }
  // Nap spot: stand still inside the closet and heal a little at a time.
  function nap(sc) {
    const R = SUPPLY_CLOSET.room, N = SUPPLY_CLOSET.supplies.nap, now = runElapsedMs;
    const fx = player.x, fy = player.y + player.height / 2;
    const inside = fx > R.x && fx < R.x + R.w && fy > R.y && fy < R.y + R.h;
    const still = Math.hypot(player.body.velocity.x, player.body.velocity.y) < 5;
    if (!inside || !still) { napStill = 0; if (napZz) napZz.setVisible(false); return; }
    if (!napStill) { napStill = now; napNext = now + N.stillMs; return; }
    if (!napZz) napZz = sc.add.text(0, 0, "z z", { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#BFA8CF", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(100000);
    if (now - napStill > N.stillMs) napZz.setVisible(true).setPosition(player.x + 18, player.y - 34 - Math.sin(now / 300) * 3);
    if (now >= napNext) {
      napNext = now + N.everyMs;
      if (hp < stats.maxHp) {
        const amt = typeof healAmt === "function" ? healAmt(N.heal) : N.heal;
        hp = Math.min(stats.maxHp, hp + amt);
        if (typeof drawHpBar === "function") drawHpBar();
        if (typeof updateHUD === "function") updateHUD();
        const t = sc.add.text(player.x, player.y - 46, `+${amt} HP`, { fontFamily: "monospace", fontSize: "12px", fontStyle: "bold", color: "#83A89A", stroke: "#12152a", strokeThickness: 3 }).setOrigin(0.5).setDepth(100000);
        sc.tweens.add({ targets: t, y: t.y - 20, alpha: 0, duration: 700, onComplete: () => t.destroy() });
      }
    }
  }
  // Vertical walls are drawn rising 112 px above their base, so the piece below each door would cover the doorway.
  // Trim those two pieces once the office has been built.
  function fixWalls(sc) {
    const want = ["wall-132-b", "wall-174-b"], found = sc.children.list.filter(o => want.includes(o.sliceId));
    found.forEach(o => { if (!o._closetCrop) { o._closetCrop = true; o.setCrop(0, 112, o.width, o.height - 112); } });
    // The hallway is narrow, so its front wall stays low (a knee wall) instead of hiding the floor behind it.
    const low = sc.children.list.filter(o => o.sliceId && o.sliceId.startsWith("closet-wall-s-"));
    low.forEach(o => { if (!o._closetCrop) { o._closetCrop = true; o.setCrop(0, o.height - 44, o.width, 44); } });
    if (found.length === want.length && low.length >= 4) wallsFixed = true;
  }
  function update(sc) {
    if (scene && !wallsFixed) fixWalls(sc);
    if (!scene || !player || !player.active) return;
    if (typeof paused !== "undefined" && paused) return;
    if (art) {
      for (const o of artObjs) {
        if (o.closetY !== undefined) o.setDepth(10000 + o.closetY - player.y);
        if (o.bulb !== undefined) o.setFrame(Math.floor((runElapsedMs + o.bulb * 170) / 400) % 2 ? "bulb1" : "bulb0");
        if (o.caption && !seenCaps.has(o.caption) && Math.abs(o.x - player.x) < 90 && Math.abs(o.closetY - player.y) < 110 && window.showLowerThird) {
          seenCaps.add(o.caption); window.showLowerThird("lore", "MEMO", o.caption, 4000);
        }
      }
    }
    if (opened) { if (supply === "nap") nap(sc); return; }
    const C = SUPPLY_CLOSET, now = runElapsedMs;
    // The reader blinks while it waits.
    if (now > blink && !standSince) { blink = now + 400; readerState(Math.floor(now / 400) % 2); }
    const fx = player.x, fy = player.y + player.height / 2; // your feet
    const on = Math.abs(fx - C.plate.x) < C.plate.halfW && Math.abs(fy - C.plate.y) < C.plate.halfH;
    const hurtNow = typeof lastHurt !== "undefined" ? lastHurt : 0; // getting hit changes lastHurt
    if (!on) { if (standSince) { standSince = 0; ring.clear(); } return; }
    if (!standSince || hurtNow !== hurtMark) { standSince = now; hurtMark = hurtNow; } // step on, or got hit: start over
    const t = Math.min(1, (now - standSince) / C.standMs);
    ring.clear();
    ring.lineStyle(4, 0x171C35, 0.9).strokeCircle(C.plate.x, C.plate.y, 30);
    ring.lineStyle(3, 0xEF9347, 1).beginPath().arc(C.plate.x, C.plate.y, 30, -Math.PI / 2, -Math.PI / 2 + t * Math.PI * 2).strokePath();
    readerState(Math.floor(now / 150) % 2); // blinks fast while it thinks
    if (t >= 1) open(sc);
  }
  function destroy() {
    doors.forEach(({ o, rect }) => {
      const list = window.navExtraBlockers || [], i = list.indexOf(rect); if (i >= 0) list.splice(i, 1);
      if (o && o.destroy) o.destroy();
    });
    [reader, ring, plateImg, napZz, ...artObjs].forEach(o => o && o.destroy && o.destroy());
    artObjs = []; doorArt = []; art = false; seenCaps = new Set();
    doors = []; reader = ring = plateImg = napZz = null; scene = null; opened = false; standSince = 0; supply = null;
  }
  return {
    init, update, destroy,
    open: (forced) => { if (scene && !opened) { open(scene, true); stock(scene, forced); } }, // dev console: skip the badge (no achievement)
    isOpen: () => opened, supply: () => supply, plate: () => SUPPLY_CLOSET.plate
  };
})();
