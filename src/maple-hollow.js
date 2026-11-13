// Maple Hollow, the Home stage (Nov 9, step 1). Builds the neighborhood in place of the office when you pick it on
// the title screen. Numbers and layout: src/data/maple-hollow.js. Art: ChatGPT's kit in assets/stage/home/.
// It returns the same kind of "area" object as the office builder (src/start-area.js), so spawning, pathfinding and
// the "stay on the floor" check all work the same way.
window.MapleHollow = (() => {
  const ROOT = "assets/stage/home/";
  const T = { grassA: 0, grassB: 1, leavesA: 2, leavesB: 3, sidewalk: 8, cracked: 9, swLeaves: 10, asphalt: 16, dashed: 17, manhole: 18, patched: 19, driveway: 20, oil: 21 };

  // a seeded random, so the neighborhood looks the same every run
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  async function build(scene, refs, H) {
    const M = window.MAPLE_HOLLOW, R = M.rows, data = window.MAPLE_HOLLOW_LAYOUT, W = M.width;
    window.MapleHollowGarage = null; window.MapleHollowStairs = null; window.MapleHollowGate = null; window.MapleHollowBossSpot = null;
    const items = [], bodies = [], all = [], townObjs = []; let townAreas = null, openTick = 0; // townObjs: the whole-town pieces, hidden while off screen (Nov 13)
    let alive = true;
    const kit = await H.image(ROOT + "maple-hollow-tiles-props-v1.png"); if (!H.isAlive()) return null;
    const housesImg = await H.image(ROOT + "maple-hollow-houses-v1.png"); if (!H.isAlive()) return null;
    let yourImg = null, intImg = null, intMap = null; // your house + the inside (Nov 9); the street still builds if they fail
    try { yourImg = await H.image(ROOT + "your-house-v1.png"); } catch (e) {}
    try { intImg = await H.image(ROOT + "house-interior-v1.png"); intMap = await (await fetch(ROOT + "house-interior-v1.json?v=" + (window.BUILD || 1))).json(); } catch (e) { intImg = null; }
    let h2Img = null; const H2 = M.interior.h2 && window.HOUSE_V2 ? window.HOUSE_V2 : null; // the big house (Maple v2 step 2)
    if (H2) try { h2Img = await H.image(ROOT + H2.atlas); } catch (e) { h2Img = null; console.warn("big house art missing", e); }
    let h2UpImg = null; const H2U = H2 && M.interior.h2.up && H2.floor2 ? H2.floor2 : null; // upstairs (step 2b)
    if (H2U) try { h2UpImg = await H.image(ROOT + H2U.atlas); } catch (e) { h2UpImg = null; console.warn("upstairs art missing", e); }
    let garImg = null, garMap = null; // the garage (Nov 10)
    try { garImg = await H.image(ROOT + "garage-interior-v1.png"); garMap = await (await fetch(ROOT + "garage-interior-v1.json?v=" + (window.BUILD || 1))).json(); } catch (e) { garImg = null; }
    const G2 = M.ground2 && M.ground2.on ? M.ground2 : null, g2 = {}; // ground v2 plates (Nov 10)
    if (G2) try {
      [g2.sa, g2.sb, g2.la, g2.lb, g2.dw, g2.dt] = await Promise.all([G2.street[0], G2.street[1], G2.lawn[0], G2.lawn[1], G2.driveway, G2.details].map(f => H.image(ROOT + f)));
    } catch (e) { g2.sa = null; }
    const MV = M.v2 && M.v2.on ? M.v2 : null, v3 = {}; // Maple Hollow v2 art (Nov 10): bigger houses, wide street, backyards
    if (MV) try {
      const A = MV.art || {}, st = A.street || ["v2/street-wide-v2-a.png", "v2/street-wide-v2-b.png"]; // one grass color (V2.29.11): repainted houses and street
      [v3.houses, v3.yours, v3.sa, v3.sb, v3.yards, v3.yourYard] = await Promise.all([A.houses || "v2/houses-v2.png", A.yours || "v2/your-house-v2.png", st[0], st[1], "v2/backyards-v2.png", "v2/your-backyard-v2.png"].map(f => H.image(ROOT + f)));
    } catch (e) { v3.houses = null; console.warn("Maple Hollow v2 art missing, using v1", e); }
    const NEW = !!(MV && v3.houses);
    const YD = NEW && MV.yards && MV.yards.you ? MV.yards : null, yd = {}; // your rebuilt backyard (Nov 11): plain ground + separate sprites
    if (YD) try {
      yd.ground = await H.image(ROOT + YD.dir + YD.you.ground);
      yd.pieces = await Promise.all(YD.you.pieces.map(q => H.image(ROOT + YD.dir + q[0])));
    } catch (e) { yd.ground = null; console.warn("yard art missing", e); }
    // Nov 12: every yard rebuilt from a plain ground plate plus separate pieces (src/data/maple-yards.js)
    const MY = NEW && window.MAPLE_YARDS && YD ? window.MAPLE_YARDS : null, my = {};
    if (MY) try {
      const files = new Set(MY.frame.map(q => q.f));
      Object.values(MY.themes).forEach(t => { files.add(t.ground); t.pieces.forEach(q => files.add(q.f)); });
      const list = [...files], imgs = await Promise.all(list.map(f => H.image(ROOT + YD.dir + f)));
      list.forEach((f, i) => { my[f] = imgs[i]; });
    } catch (e) { my.failed = true; console.warn("yard pieces missing, keeping the painted yards", e); }
    // Nov 13: the yard-kit pieces the town's areas reuse (MAPLE_HOLLOW.v2.town.pieces)
    const TNd = NEW && data.town && MV.town ? MV.town : null, tp = {};
    if (TNd) try {
      const files = Object.keys(TNd.pieces || {}), imgs = await Promise.all(files.map(f => H.image(ROOT + "v4/yard/" + f + "-v4.png")));
      files.forEach((f, i) => { tp[f] = imgs[i]; });
    } catch (e) { tp.failed = true; console.warn("town pieces missing", e); }
    if (!H.isAlive()) return null;
    const TW = NEW && MV.treeWall && MV.treeWall.on ? MV.treeWall : null, tw = {}; // the tree wall around the town (Nov 11)
    if (TW) try {
      [tw.north, tw.south, tw.west, tw.east, tw.southTop, tw.westTop, tw.eastTop] = await Promise.all(["north-v4", "south-v4", "west-v4", "east-v4", "south-v4-canopy", "west-v4-canopy", "east-v4-canopy"].map(f => H.image(ROOT + TW.dir + "tree-wall-" + f + ".png")));
      if (TW.corners) tw.corners = await Promise.all(["north-west", "north-east", "south-west", "south-east"].flatMap(c => [c + "-v4", c + "-v4-canopy"]).map(f => H.image(ROOT + TW.dir + "tree-wall-" + f + ".png")));
    } catch (e) { tw.north = null; console.warn("tree wall art missing", e); }
    const SE = TW && tw.north && MV.streetEnds && MV.streetEnds.on ? MV.streetEnds : null, se = {}; // street ends (V2.29.11)
    if (SE) try {
      [se.left, se.right, se.leftBar, se.rightBar] = await Promise.all([SE.left.file, SE.right.file, SE.left.barricade[0], SE.right.barricade[0]].map(f => H.image(ROOT + SE.dir + f)));
    } catch (e) { se.left = null; console.warn("street end art missing", e); }
    if (!H.isAlive()) return null;
    if (!H.isAlive()) return null;
    const piece = id => intMap && (intMap.pieces || []).find(p => p.id === id);
    if (window.ArtSheets) { // load early so they're ready when the run starts
      ArtSheets.load(scene, "kh_sheet", ROOT + "key-hunt-v1.png", 32, 32);          // the key hunt's props (src/key-hunt.js)
      ArtSheets.load(scene, "mh_haz", ROOT + "home-hazards-v1.png", 32, 32);        // toy bricks (src/home-hazards.js)
      ArtSheets.load(scene, "mh_stand", ROOT + "home-hazards-v1.png", 64, 128);     // the Lemonade Stand (src/lounge.js)
      ArtSheets.load(scene, "grandkid_2", "assets/characters/grandkid-2-v1.png", 56, 60); // your kid, at the stand
    }

    // ---- ground: compose a few repeating textures from the 32 px kit ----
    const cell = (c, idx, dx, dy) => c.drawImage(kit, (idx % 8) * 32, Math.floor(idx / 8) * 32, 32, 32, dx, dy, 32, 32);
    function ground(key, w, h, pick) {
      if (scene.textures.exists(key)) return key;
      const t = scene.textures.createCanvas(key, w, h), c = t.getContext(); c.imageSmoothingEnabled = false;
      const r = rng(w * 31 + h + key.length * 97);
      for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) cell(c, pick(x, y, r), x, y);
      t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST);
      return key;
    }
    const grassKey = ground("mh_grass", 512, 512, (x, y, r) => { const v = r(); return v < 0.5 ? T.grassA : v < 0.78 ? T.grassB : v < 0.92 ? T.leavesA : T.leavesB; });
    const walkKey = ground("mh_sidewalk", 512, 64, (x, y, r) => { const v = r(); return v < 0.72 ? T.sidewalk : v < 0.86 ? T.cracked : T.swLeaves; });
    const streetKey = ground("mh_street", 512, 192, (x, y, r) => y === 96 ? T.dashed : (r() < 0.04 ? T.patched : T.asphalt));
    const keyFor = { mh_grass: grassKey, mh_sidewalk: walkKey, mh_street: streetKey };
    // big house: one texture per atlas frame (floors, walls, furniture), pixel-crisp
    const h2Tex = (k, D = H2, img = h2Img) => {
      const key = "mh2_" + k; if (scene.textures.exists(key)) return key; if (!img || !D || !D.frames[k]) return null;
      const [sx, sy, w, h] = D.frames[k], c = document.createElement("canvas"); c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, sx, sy, w, h, 0, 0, w, h);
      scene.textures.addCanvas(key, c); scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST); return key;
    };
    if (H2 && h2Img) Object.keys(H2.frames).filter(k => k.startsWith("floor_")).forEach(k => { keyFor["mh2_" + k] = h2Tex(k); });
    if (H2U && h2UpImg) Object.keys(H2U.frames).filter(k => k.startsWith("f2_floor_")).forEach(k => { keyFor["mh2_" + k] = h2Tex(k, H2U, h2UpImg); });
    // inside floors, mixed from the interior kit's two variants per room
    if (intImg) {
      const I = M.interior;
      const roomFloor = (key, ids, h) => {
        if (scene.textures.exists(key)) return key;
        const t = scene.textures.createCanvas(key, 256, h), c = t.getContext(); c.imageSmoothingEnabled = false;
        const r = rng(key.length * 131 + h);
        for (let y = 0; y < h; y += 32) for (let x = 0; x < 256; x += 32) { const pc = piece(ids[r() < 0.6 ? 0 : 1]); if (pc) c.drawImage(intImg, pc.rect[0], pc.rect[1], 32, 32, x, y, 32, 32); }
        t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST); return key;
      };
      I.rooms.forEach(rm => { keyFor["mh_room_" + rm.id] = roomFloor("mh_room_" + rm.id, rm.floor, 256); });
      keyFor.mh_hall = roomFloor("mh_hall", ["hall-runner-a", "hall-runner-b"], 64);
    }
    const gPiece = id => garMap && (garMap.pieces || []).find(p => p.id === id);
    if (garImg && !scene.textures.exists("mh_garage")) { // concrete, mostly plain, now and then an oil stain or tire marks
      const t = scene.textures.createCanvas("mh_garage", 256, 256), c = t.getContext(); c.imageSmoothingEnabled = false;
      const r = rng(4242), F = Object.entries(M.garage.floor);
      for (let y = 0; y < 256; y += 32) for (let x = 0; x < 256; x += 32) {
        let v = r(), id = F[0][0]; for (const [k, w] of F) { if (v < w) { id = k; break; } v -= w; }
        const pc = gPiece(id); if (pc) c.drawImage(garImg, pc.rect[0], pc.rect[1], 32, 32, x, y, 32, 32);
      }
      t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    if (garImg) keyFor.mh_garage = "mh_garage";
    const v2 = !!(G2 && g2.sa);
    if (NEW) { // one street-band picture, two 832 px plates side by side (lots are 416, so the curb cuts already line up)
      // With street ends the band runs out past the town into the grass margin until it meets each curved end (V2.29.11).
      const ends = SE && se.left ? SE : null, mg = ends ? TW.margin || 0 : 0, TN = data.town;
      const bx0 = TN ? TN.blockX[0] : ends ? -mg + ends.inset + (ends.left.crop[1] - ends.left.crop[0]) : 0, bx1 = ends ? W + mg - ends.inset - (ends.right.crop[1] - ends.right.crop[0]) : W;
      if (!scene.textures.exists("mh_band3")) {
        const t = scene.textures.createCanvas("mh_band3", bx1 - bx0, 512), c = t.getContext(); c.imageSmoothingEnabled = false;
        for (let k = Math.floor(bx0 / 832), x = k * 832; x < bx1; k++, x += 832) c.drawImage(Math.abs(k) % 2 ? v3.sb : v3.sa, x - bx0, 0); // plates alternate A/B in both directions
        t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
      [R.sidewalk1, R.sidewalk3].forEach(y => all.push(scene.add.image(bx0, y, "mh_band3").setOrigin(0).setDepth(ends ? -999.7 : -1000))); // with ends it must sit above the margin's grass
      if (ends) { // the curved ends, and a barricade standing in each (solid at its base, sorted with the hero)
        const capKey = (k, img, [a, b]) => { if (!scene.textures.exists(k)) { const c = document.createElement("canvas"); c.width = b - a; c.height = img.height; c.getContext("2d").drawImage(img, a, 0, b - a, img.height, 0, 0, b - a, img.height); scene.textures.addCanvas(k, c); scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST); } return k; };
        [["left", -mg + ends.inset, se.left, se.leftBar], ["right", bx1, se.right, se.rightBar]].filter(([side]) => !(TN && side === "left")).forEach(([side, x, img, bar]) => {
          const E = ends[side], k = capKey("mh_end_" + side, img, E.crop), [, bxp, byp, bw, bd] = E.barricade;
          if (!scene.textures.exists("mh_bar_" + side)) H.propTexture(scene, (() => { const c = document.createElement("canvas"); c.width = bar.width; c.height = bar.height; c.getContext("2d").drawImage(bar, 0, 0); return c; })(), "mh_bar_" + side, bar.width, bar.height);
          [R.sidewalk1, R.sidewalk3].forEach(y => {
            all.push(scene.add.image(x, y, k).setOrigin(0).setDepth(-999.5));
            const o = scene.add.image(x + bxp - E.crop[0] + bar.width / 2, y + byp + bar.height, "mh_bar_" + side).setOrigin(0.5, 1).setDepth(3);
            H.body(o, { width: bw, back: bd, front: 0 }, "prop_wall"); bodies.push(o); items.push(o);
          });
        });
      }
    }
    if (v2 && !NEW) { // ---- ground v2: one street-band picture (both streets use it) and a two-variant lawn ----
      const drives = []; for (let i = 0; i < 6; i++) drives.push(M.firstLotX + i * M.lotWidth + 40);
      if (!scene.textures.exists("mh_band2")) {
        const t = scene.textures.createCanvas("mh_band2", W, 320), c = t.getContext(); c.imageSmoothingEnabled = false;
        const [r0, r1] = G2.curbRows, aw = G2.apronW;
        for (let k = 0, x = 0; x < W; k++, x += G2.streetStep) {
          const img = k % 2 ? g2.sb : g2.sa; c.drawImage(img, x, 0);
          // patch over the plate's own curb cuts with plain curb from 128 px away (same slab rhythm)
          G2.plateAprons.forEach(ax => { const from = ax + 128 + aw <= G2.streetStep ? ax + 128 : ax - 128; c.drawImage(img, from, r0, aw, r1 - r0, x + ax, r0, aw, r1 - r0); });
        }
        // and cut new ones where the driveways really are
        drives.forEach(dx => c.drawImage(g2.sa, G2.plateAprons[0], r0, aw, r1 - r0, dx, r0, aw, r1 - r0));
        t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
      if (!scene.textures.exists("mh_lawn2")) { // A/B checkerboard so the same leaf drift doesn't line up in rows
        const t = scene.textures.createCanvas("mh_lawn2", 1024, 1024), c = t.getContext(); c.imageSmoothingEnabled = false;
        [[0, 0, g2.la], [512, 0, g2.lb], [0, 512, g2.lb], [512, 512, g2.la]].forEach(([x, y, im]) => c.drawImage(im, x, y));
        t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
      if (!scene.textures.exists("mh_drive2")) { const t = scene.textures.createCanvas("mh_drive2", 64, 256); t.getContext().drawImage(g2.dw, 0, 0); t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST); }
      keyFor.mh_grass = "mh_lawn2";
      [R.sidewalk1, R.sidewalk3].forEach(y => all.push(scene.add.image(0, y, "mh_band2").setOrigin(0).setDepth(-1000)));
    }
    if (NEW && v2) { // the lawn still comes from ground v2
      if (!scene.textures.exists("mh_lawn2")) {
        const t = scene.textures.createCanvas("mh_lawn2", 1024, 1024), c = t.getContext(); c.imageSmoothingEnabled = false;
        [[0, 0, g2.la], [512, 0, g2.lb], [0, 512, g2.lb], [512, 512, g2.la]].forEach(([x, y, im]) => c.drawImage(im, x, y));
        t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
      keyFor.mh_grass = "mh_lawn2";
    }
    for (const f of data.floors) {
      if ((v2 || NEW) && (f.material === "mh_sidewalk" || f.material === "mh_street")) continue; // drawn by the street bands above
      if (f.material === "mh_road") continue; // the town's roads (Nov 13): drawn by buildTown()
      const t = scene.add.tileSprite(f.x, f.y, f.width, f.height, keyFor[f.material] || grassKey).setOrigin(0).setDepth(-1000);
      all.push(t);
    }
    if (NEW && v2) { // v2 puts the inside of your house below the town: cover the gap so the office backdrop never shows
      const by = R.bottom, bh = (data.bounds ? data.bounds.y + data.bounds.height : M.interior.y + 1200) - by + 400;
      const bx = data.town ? data.town.x0 - 400 : -400;
      all.push(scene.add.rectangle(bx, by, Math.max(M.width, data.bounds ? data.bounds.width : 0) + 800 + (-400 - bx), bh, 0x303750).setOrigin(0).setDepth(-1001)); // wide enough for upstairs too
    }
    // a manhole or two on each street (v1 only: the v2 plates have their own)
    if (!v2 && !NEW) [[620, R.street1 + 32], [1880, R.street1 + 128], [1240, R.street2 + 32]].forEach(([x, y]) => {
      const k = "mh_tile_" + T.manhole;
      if (!scene.textures.exists(k)) { const t = scene.textures.createCanvas(k, 32, 32); t.getContext().imageSmoothingEnabled = false; cell(t.getContext(), T.manhole, 0, 0); t.refresh(); }
      all.push(scene.add.image(x, y, k).setOrigin(0).setDepth(-999));
    });

    let yourHouse = null;
    if (NEW) buildV2();
    if (NEW && TW && tw.north && data.town) buildTown(data.town);
    const town = NEW && TW && tw.north ? buildTreeWall() : null; // the rectangle the camera stays inside while you're outdoors
    // ---- houses: six fronts, each on a lot with a driveway ----
    if (!NEW) for (let i = 0; i < 6; i++) {
      const k = "mh_house_" + i; if (scene.textures.exists(k)) continue;
      const c = document.createElement("canvas"); c.width = 192; c.height = 224;
      c.getContext("2d").drawImage(housesImg, i * 192, 0, 192, 224, 0, 0, 192, 224);
      H.propTexture(scene, c, k, 192, 224);
    }
    const lotX = i => M.firstLotX + i * M.lotWidth;
    const drive = (x, y0, y1) => {
      const k = v2 ? "mh_drive2" : "mh_drive"; if (!v2) ground(k, 64, 64, (xx, yy, r) => r() < 0.2 ? T.oil : T.driveway);
      all.push(scene.add.tileSprite(x, y0, 64, y1 - y0, k).setOrigin(0).setDepth(-998));
    };
    if (yourImg) for (let i = 0; i < 2; i++) { // cell 0 door closed, cell 1 door open (only the doorway changes)
      const k = "mh_yours_" + i; if (scene.textures.exists(k)) continue;
      const c = document.createElement("canvas"); c.width = 192; c.height = 224;
      c.getContext("2d").drawImage(yourImg, i * 192, 0, 192, 224, 0, 0, 192, 224);
      H.propTexture(scene, c, k, 192, 224);
    }
    function house(frame, cx, frontY, mine, isYours) {
      const tex = isYours && scene.textures.exists("mh_yours_0") ? "mh_yours_0" : "mh_house_" + frame;
      const o = scene.add.image(cx, frontY + 8, tex).setOrigin(0.5, 1).setDepth(3);
      if (isYours) yourHouse = o;
      H.body(o, { width: 172, back: 196, front: 0 }, "prop_house"); bodies.push(o); items.push(o);
      drive(cx + 40, frontY, frontY + (mine === "south" ? R.sidewalk3 - R.southHouseFront : R.sidewalk1 - R.northHouseFront));
      return o;
    }
    const yh0 = M.yourHouse;
    if (!NEW) {
    M.northHouses.forEach((f, i) => house(f, lotX(i), R.northHouseFront, "north", yh0.row === "north" && yh0.lot === i));
    M.southHouses.forEach((f, i) => house(f, lotX(i), R.southHouseFront, "south", yh0.row === "south" && yh0.lot === i));
    window.MapleHollowDoor = open => { if (yourHouse && yourHouse.active && scene.textures.exists("mh_yours_1")) yourHouse.setTexture(open ? "mh_yours_1" : "mh_yours_0"); };
    }
    if (!NEW) { // a little sign on your house
      const yh = M.yourHouse, x = lotX(yh.lot), y = (yh.row === "north" ? R.northHouseFront : R.southHouseFront) - 228;
      all.push(scene.add.text(x, y, "YOUR HOUSE", { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 5, y: 3 } }).setOrigin(0.5, 1).setDepth(4));
    }

    // ---- yard props: flat decorations under everyone, scattered on lawns (seeded) ----
    const r = rng(1979);
    if (!NEW) {
    const propKey = idx => {
      const k = "mh_prop_" + idx; if (scene.textures.exists(k)) return k;
      const c = document.createElement("canvas"); c.width = 32; c.height = 32;
      c.getContext("2d").drawImage(kit, (idx % 8) * 32, Math.floor(idx / 8) * 32, 32, 32, 0, 0, 32, 32);
      H.propTexture(scene, c, k, 32, 32); return k;
    };
    for (let i = 0; i < 6; i++) for (const side of ["north", "south"]) {
      const cx = lotX(i), front = side === "north" ? R.northHouseFront : R.southHouseFront;
      const n = 2 + Math.floor(r() * 2);
      for (let k = 0; k < n; k++) {
        const idx = M.yardProps[Math.floor(r() * M.yardProps.length)];
        const x = cx - 150 + r() * 110, y = front + 18 + r() * 40;
        all.push(scene.add.image(Math.round(x), Math.round(y), propKey(idx)).setScale(1.5).setOrigin(0.5, 1).setDepth(2.5));
      }
      // backyard bits behind the south houses
      if (side === "south") for (let k = 0; k < 2; k++) {
        const idx = [41, 43, 44, 45, 47][Math.floor(r() * 5)];
        all.push(scene.add.image(Math.round(cx - 120 + r() * 240), Math.round(R.sidewalk2End + 50 + r() * 60), propKey(idx)).setScale(1.5).setOrigin(0.5, 1).setDepth(2.5));
      }
    }

    }
    // ---- lawn details v2: flat stickers (leaf drifts, mums, stepping stones, a tipped scooter...) under everyone ----
    if (v2 && g2.dt && !NEW) {
      const dKey = i => {
        const k = "mh_det2_" + i; if (scene.textures.exists(k)) return k;
        const c = document.createElement("canvas"); c.width = 64; c.height = 64; c.getContext("2d").drawImage(g2.dt, i * 64, 0, 64, 64, 0, 0, 64, 64);
        H.propTexture(scene, c, k, 64, 64); return k;
      };
      const r2 = rng(2026), put = (x, y) => all.push(scene.add.image(Math.round(x), Math.round(y), dKey(Math.floor(r2() * 8))).setOrigin(0.5, 1).setDepth(2.4));
      for (let i = 0; i < 6; i++) {
        const cx = lotX(i);
        for (let k = 0; k < G2.detailsPerYard; k++) { put(cx - 150 + r2() * 90, R.northHouseFront + 72); put(cx - 150 + r2() * 90, R.southHouseFront + 72); }
        for (let k = 0; k < G2.detailsPerBackyard; k++) put(cx - 140 + r2() * 280, R.sidewalk2End + 90 + r2() * 80);
      }
      for (let k = 0; k < G2.detailsUpTop; k++) put(80 + r2() * (W - 160), 60 + r2() * 150);
    }

    // ---- the big house (Maple v2 step 2, Nov 10): walls, furniture, stairs, the garage; upstairs to the right ----
    const solidBlock = (x, y, w, h) => { const o = scene.add.rectangle(x + w / 2, y + h, w, h, 0x000000, 0).setOrigin(0.5, 1); H.body(o, { width: w, back: h, front: 0 }, "prop_wall"); bodies.push(o); items.push(o); };
    // one floor: walls, the stairs' art, furniture and decals at their drawn size. Returns the pieces by id.
    function buildFloor(D, img, X, Y) {
      const T = k => h2Tex(k, D, img), byId = {};
      D.walls.forEach(([x, y, w, h]) => {
        const k = T(w >= h ? D.wallTex.h : D.wallTex.v); if (!k) return;
        const t = scene.add.tileSprite(X + x + w / 2, Y + y + h, w, h, k).setOrigin(0.5, 1).setDepth(2.9);
        H.body(t, { width: w, back: h, front: 0 }, "prop_wall"); bodies.push(t); items.push(t);
      });
      const sr = D.stairs.rect, sk = T(D.stairs.art), [, , sw, sh] = D.frames[D.stairs.art] || [0, 0, 0, 0];
      if (sk) all.push(scene.add.image(X + sr[0], Y + sr[1], sk).setOrigin(0).setDepth(2.5));
      D.pieces.forEach(pc => {
        const k = T(pc.key); if (!k) return; const [w, h] = pc.size;
        const o = scene.add.image(X + pc.at[0] + w / 2, Y + pc.at[1] + h, k).setOrigin(0.5, 1).setDepth(pc.layer === "decal" ? 2.6 : 3);
        if (pc.solid) { H.body(o, { width: Math.max(8, pc.foot[2] - 4), back: Math.max(8, pc.foot[3]), front: 0 }, "prop_furniture"); bodies.push(o); }
        items.push(o); byId[pc.id] = o;
      });
      return { byId, stairs: [X + sr[0], Y + sr[1], sw, sh] };
    }
    function buildHouse2() {
      const I = M.interior, X = I.h2.x, Y = I.h2.y, C2 = M.house2;
      const down = buildFloor(H2, h2Img, X, Y);
      // doors to the outside are closed (you leave by walking up to the front door; the patio and garage door stay shut)
      H2.doors.filter(d => d.id === "patio" || d.id === "front-entry" || d.id === "garage-front").forEach(d => solidBlock(X + d.rect[0], Y + d.rect[1], d.rect[2], d.rect[3]));
      const [sx0, sy0, sw, sh] = down.stairs;
      if (!(H2U && h2UpImg)) { // no upstairs yet: a baby gate across the stairs
        solidBlock(sx0, sy0, sw + 8, sh + 6);
        const g = scene.add.graphics().setDepth(3.2); all.push(g); const gy = sy0 + sh + 2, gx = sx0;
        g.fillStyle(0xFFF0CF, 1).fillRect(gx, gy - 4, sw + 8, 4).fillRect(gx, gy + 14, sw + 8, 4);
        for (let i = 0; i <= sw + 8; i += 8) g.fillRect(gx + i, gy - 4, 3, 22);
        g.lineStyle(1, 0x171C35, 1).strokeRect(gx, gy - 4, sw + 8, 22);
        all.push(scene.add.text(gx + (sw + 8) / 2, gy + 24, "UPSTAIRS · SOON", { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 4, y: 2 } }).setOrigin(0.5, 0).setDepth(3.2));
        window.MapleHollowGate = { x: gx + (sw + 8) / 2, y: gy + 10, line: C2.gateLine };
      } else { // upstairs (step 2b): walk onto either staircase to climb it (src/key-hunt.js plays the climb)
        window.MapleHollowGate = null;
        const up = buildFloor(H2U, h2UpImg, I.h2.up.x, I.h2.up.y), [ux, uy, uw, uh] = up.stairs;
        const label = (x, y, t) => all.push(scene.add.text(x, y, t, { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 4, y: 2 } }).setOrigin(0.5, 1).setDepth(3.2).setAlpha(0.9));
        label(sx0 + sw / 2, sy0 - 4, "UP"); label(ux + uw / 2, uy - 4, "DOWN");
        window.MapleHollowStairs = { down: [sx0, sy0, sw, sh], up: [ux, uy, uw, uh],
          arriveUp: [ux + uw + 46, uy + uh * 0.55], arriveDown: [sx0 + sw + 46, sy0 + sh * 0.8] };
      }
      // a doormat inside the front door: walk onto it to go back out
      { const [mx, my] = I.exitMat, g = scene.add.graphics().setDepth(2.55); all.push(g);
        g.fillStyle(0x874C3B, 1).fillRect(mx - 6, my - 50, 30, 60).lineStyle(2, 0x171C35, 1).strokeRect(mx - 6, my - 50, 30, 60);
        g.lineStyle(1, 0xF2D7A1, 0.6); for (let i = 0; i < 4; i++) g.lineBetween(mx - 2 + i * 7, my - 44, mx - 2 + i * 7, my + 4);
        all.push(scene.add.text(mx + 30, my - 20, "OUT", { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 3, y: 2 } }).setOrigin(0, 0.5).setDepth(3.2)); }
      const fr = down.byId["magnet-fridge"]; if (fr) window.MapleHollowFridge = { x: fr.x, y: fr.y + 10 };
      // the garage: its doors on the front wall, and the V8 parked beside the minivan (src/garage.js wakes it up at 60)
      const van = down.byId.minivan, G = M.garage, gf = H2.doors.find(d => d.id === "garage-front").rect;
      const dk = garImg ? [gcut("garage-door-closed"), gcut("garage-door-open")] : [null, null];
      const doors = dk[0] ? [0.27, 0.73].map(f => { const o = scene.add.image(X + gf[0] + gf[2] * f, Y + gf[1] + 16, dk[0]).setOrigin(0.5, 1).setDepth(2.95); all.push(o); return o; }) : [];
      const park = van ? [van.x + C2.parkDx, van.y - 20] : [G.x + G.w * 0.7, G.y + G.h * 0.7];
      let parked = null;
      if (scene.textures.exists("bossart_midlifeCrisis")) { parked = scene.add.image(park[0], park[1], "bossart_midlifeCrisis", 0).setOrigin(0.5, 148 / 152).setDepth(3.1); all.push(parked); }
      window.MapleHollowGarage = { x: G.x, y: G.y, w: G.w, h: G.h, park, parked, setOpen: open => doors.forEach(d => d.active && dk[1] && d.setTexture(open ? dk[1] : dk[0])) };
    }
    const gcut = id => { // garage pieces from the v1 garage kit (doors)
      const k = "mh_gar_" + id; if (scene.textures.exists(k)) return k;
      const pc = gPiece(id); if (!pc || !garImg) return null; const [sx, sy, w, h] = pc.rect;
      const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(garImg, sx, sy, w, h, 0, 0, w, h);
      H.propTexture(scene, c, k, w, h); return k;
    };
    if (H2 && h2Img) buildHouse2();
    // ---- inside your house: walls with doorways into the hallway, furniture, room names ----
    else if (intImg) {
      const I = M.interior, X = I.x, Y = I.y, RW = I.roomW, RH = I.roomH, HW = RW * 3, HH = I.hallH;
      const cut = id => {
        const k = "mh_int_" + id; if (scene.textures.exists(k)) return k;
        const pc = piece(id); if (!pc) return null; const [sx, sy, w, h] = pc.rect;
        const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(intImg, sx, sy, w, h, 0, 0, w, h);
        if (pc.kind === "floor") { scene.textures.addCanvas(k, c); scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST); }
        else H.propTexture(scene, c, k, w, h); // walls and furniture: key out the magenta
        return k;
      };
      const wall = (x, y, w, h, id) => {
        const k = cut(id); if (!k) return;
        const t = scene.add.tileSprite(x, y, w, h, k).setOrigin(0.5, 1).setDepth(2.9);
        t.setPosition(x + w / 2, y + h);
        H.body(t, { width: w, back: h, front: 0 }, "prop_wall"); bodies.push(t); items.push(t);
      };
      function buildGarage(G) {
        const gcut = id => {
          const k = "mh_gar_" + id; if (scene.textures.exists(k)) return k;
          const pc = gPiece(id); if (!pc) return null; const [sx, sy, w, h] = pc.rect;
          const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(garImg, sx, sy, w, h, 0, 0, w, h);
          H.propTexture(scene, c, k, w, h); return k;
        };
        // pegboard back wall over the garage, its own right wall
        const pk = gcut("wall-pegboard-horizontal");
        if (pk) { const t = scene.add.tileSprite(G.x + G.w / 2 + 8, G.y, G.w + 16, 32, pk).setOrigin(0.5, 1).setDepth(2.92); H.body(t, { width: G.w + 16, back: 32, front: 0 }, "prop_wall"); bodies.push(t); items.push(t); }
        wall(G.x + G.w, G.y, 16, G.h, "wall-vertical");
        all.push(scene.add.text(G.x + G.w / 2, G.y + 6, G.name, { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 4, y: 2 } }).setOrigin(0.5, 0).setDepth(2.95).setAlpha(0.85));
        G.pieces.forEach(([id, fx, fy, solid]) => {
          const k = gcut(id); if (!k) return; const pc = gPiece(id), w = pc.rect[2], h = pc.rect[3];
          const decal = id === "car-dust-outline" || id === "tool-pegboard" || id === "dartboard";
          const o = scene.add.image(G.x + fx, G.y + fy + h, k).setOrigin(0.5, 1).setDepth(decal ? 2.6 : 3);
          if (solid) { H.body(o, { width: Math.round(w * 0.86), back: Math.round(h * 0.62), front: 0 }, "prop_furniture"); bodies.push(o); }
          items.push(o);
        });
        // garage doors along the front wall (closed until the V8 leaves)
        const dk = [gcut("garage-door-closed"), gcut("garage-door-open")];
        const doors = G.doors.map(dx => { const o = scene.add.image(G.x + dx, G.y + G.h + 16, dk[0]).setOrigin(0.5, 1).setDepth(2.95); all.push(o); return o; });
        // the V8, parked in the empty bay (src/garage.js wakes it up at 60)
        let parked = null;
        if (scene.textures.exists("bossart_midlifeCrisis")) { parked = scene.add.image(G.x + G.parkAt[0], G.y + G.parkAt[1], "bossart_midlifeCrisis", 0).setOrigin(0.5, 148 / 152).setDepth(3.1); all.push(parked); }
        window.MapleHollowGarage = { x: G.x, y: G.y, w: G.w, h: G.h, park: [G.x + G.parkAt[0], G.y + G.parkAt[1]], parked,
          setOpen: open => doors.forEach(d => d.active && d.setTexture(open ? dk[1] : dk[0])) };
      }
      wall(X - 16, Y - 32, HW + 32, 32, "wall-horizontal");                 // back wall
      wall(X - 16, Y, 16, RH + HH, "wall-vertical");                        // left
      const G = M.garage, GW = garImg ? G.w : 0;
      wall(X + HW, Y, 16, garImg ? RH - 40 : RH + HH, "wall-vertical");     // right (with a garage: it stops short, so the hallway runs straight into the garage)
      wall(X - 16, Y + RH + HH, HW / 2 - 24 + 16, 16, "wall-horizontal");    // front wall, left of the door
      wall(X + HW / 2 + 24, Y + RH + HH, HW / 2 - 24 + 16 + GW, 16, "wall-horizontal"); // front wall, right of the door (and under the garage)
      for (let i = 1; i < 3; i++) wall(X + i * RW - 8, Y, 16, I.doorGapFromTop, "wall-vertical"); // between rooms, open at the bottom
      I.rooms.forEach((rm, i) => {
        const rx = X + i * RW;
        all.push(scene.add.text(rx + RW / 2, Y + 6, rm.name, { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 4, y: 2 } }).setOrigin(0.5, 0).setDepth(2.95).setAlpha(0.85));
        rm.furniture.forEach(([id, fx, fy, solid]) => {
          const k = cut(id); if (!k) return; const pc = piece(id), h = pc.rect[3], w = pc.rect[2];
          const o = scene.add.image(rx + fx, Y + fy + h / 2, k).setOrigin(0.5, 1).setDepth(id === "ceiling-stars" ? 2.6 : 3);
          if (solid) { H.body(o, { width: Math.round(w * 0.86), back: Math.round(h * 0.62), front: 0 }, "prop_furniture"); bodies.push(o); }
          items.push(o);
          if (id === "fridge") window.MapleHollowFridge = { x: o.x, y: o.y + 10 };
        });
      });
      if (garImg) buildGarage(G);
      // the front mat inside (step on it to go back out)
      const mat = cut("wall-doorway");
      if (mat) all.push(scene.add.image(I.exitMat[0], I.exitMat[1], mat).setOrigin(0.5, 1).setDepth(2.6));
    }

    // ---- Maple Hollow v2 (Nov 10): backyards, houses with side paths, your house, fences ----
    function buildV2() {
      const [CW, CH] = MV.houseCell, [fx, fy, fw, fh] = MV.facade, [YW, YH] = MV.backyard, F = MV.fence, yh = M.yourHouse;
      const lotLeft = i => i * M.lotWidth;
      const crop = (key, img, sx, sy, w, h, keyOut) => {
        if (scene.textures.exists(key)) return key;
        const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, sx, sy, w, h, 0, 0, w, h);
        if (keyOut) H.propTexture(scene, c, key, w, h); else { scene.textures.addCanvas(key, c); scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST); }
        return key;
      };
      // an invisible wall (fences, hedges)
      const block = (x, y, w, h) => { const o = scene.add.rectangle(x + w / 2, y + h, w, h, 0x000000, 0).setOrigin(0.5, 1); H.body(o, { width: w, back: h, front: 0 }, "prop_wall"); bodies.push(o); items.push(o); };
      const rows = [["north", R.northHouseTop, M.northHouses], ["south", R.southHouseTop, M.southHouses]];
      rows.forEach(([row, top, frames]) => {
        const yardTop = top - YH;
        frames.forEach((f, i) => {
          const L = lotLeft(i), mine = yh.row === row && yh.lot === i;
          // the backyard behind the house
          const rebuilt = mine && YD && yd.ground;
          const theme = MY && !my.failed && !mine ? MY.themes[MY.cellTheme[MV.yardOrder[f] || 0]] : null; // Nov 12: a neighbor's rebuilt yard
          const yk = rebuilt ? crop("mh4_yard_you", yd.ground, 0, 0, YW, YH) : theme ? crop("mh4_yard_" + theme.ground, my[theme.ground], 0, 0, YW, YH)
            : mine ? crop("mh3_yard_you", v3.yourYard, 0, 0, YW, YH) : crop("mh3_yard_" + f, v3.yards, (MV.yardOrder[f] || 0) * YW, 0, YW, YH);
          all.push(scene.add.image(L, yardTop, yk).setOrigin(0).setDepth(-999));
          if (rebuilt) YD.you.pieces.forEach(([file, x, y, bw, bd], n) => {
            const img = yd.pieces[n], w = img.width, h = img.height, solid = bw > 0;
            const k = crop("mh4_piece_" + file, img, 0, 0, w, h, solid);
            if (!solid) { all.push(scene.add.image(L + x, yardTop + y, k).setOrigin(0).setDepth(-998)); return; } // flat: you walk over it
            const o = scene.add.image(L + x + w / 2, yardTop + y + h, k).setOrigin(0.5, 1).setDepth(3); // stands up: sorted with the hero, blocks at its base
            H.body(o, { width: bw, back: bd, front: 0 }, "prop_wall"); bodies.push(o); items.push(o);
          });
          // Nov 12: the yard's own pieces, plus the shared frame (fence posts and autumn shrubs) on every rebuilt yard
          if (MY && !my.failed && (theme || rebuilt)) (theme ? MY.frame.concat(theme.pieces) : MY.frame).forEach(q => {
            const img = my[q.f]; if (!img) return;
            const w = img.width, h = img.height, k = crop("mh4_piece_" + q.f, img, 0, 0, w, h, q.k !== "flat");
            if (q.k === "flat") { all.push(scene.add.image(L + q.x, yardTop + q.y, k).setOrigin(0).setDepth(-998)); return; } // walked over
            // stands up: drawn by its feet (q.d), so the hero passes in front or behind; "over" pieces (roof, lights, bunting) sort below their posts' feet
            const o = scene.add.image(L + q.x, yardTop + q.d, k).setOrigin(0, (q.d - q.y) / h).setDepth(3);
            o.sliceDepth = yardTop + q.d; items.push(o); all.push(o);
            H.body(o, { width: 1, back: 1, front: 0 }, "prop_decor"); o.body.enable = false; // joins the props sorted by feet each frame; the solid part is the blocks below
            (q.fp || []).forEach(([bx, by, bw, bh]) => block(L + bx, yardTop + by, bw, bh)); // solid only at its base
          });
          // fences on both sides with a gate gap in the middle; the hedge along the top has steps (south row only: the north row's top is the edge of the map)
          [L, L + YW - F.w].forEach(x => { block(x, yardTop + F.top, F.w, F.gate[0] - F.top); block(x, yardTop + F.gate[1], F.w, YH - F.gate[1]); });
          if (row === "south") { block(L, yardTop, F.steps[0], F.top); block(L + F.steps[1], yardTop, YW - F.steps[1], F.top); }
          else block(L, yardTop, YW, F.top); // the north row's top hedge is the edge of the map
          // the house: the whole cell under everyone (side path, front steps), and the front itself as a solid sprite
          if (mine) {
            const k = crop("mh3_yours", v3.yours, 0, 0, 400, 400, true), kf = crop("mh3_yours_front", v3.yours, 0, 0, 336, 400, true);
            all.push(scene.add.image(L + 16, top + CH - 400, k).setOrigin(0).setDepth(2.45));
            const o = scene.add.image(L + 16 + 168, top + CH, kf).setOrigin(0.5, 1).setDepth(3);
            H.body(o, { width: 320, back: 360, front: 0 }, "prop_house"); bodies.push(o); items.push(o); yourHouse = o;
            // the open door: a dark doorway painted over the closed one (src/key-hunt.js opens it)
            const [dx, dy, dw, dh] = yh.door;
            const doorway = scene.add.rectangle(L + 16 + dx + 3, top + CH - 400 + dy + dh / 2, dw - 6, dh - 6, 0x171C35, 1).setOrigin(0, 0.5).setDepth(3.05).setVisible(false); all.push(doorway);
            // open with a time (ms) swings it: the dark doorway widens from the hinge side
            window.MapleHollowDoor = (open, ms) => {
              if (!doorway.active) return;
              scene.tweens.killTweensOf(doorway); doorway.setVisible(!!open).setScale(1, 1);
              if (open && ms) { doorway.scaleX = 0; scene.tweens.add({ targets: doorway, scaleX: 1, duration: ms, ease: "Sine.easeOut" }); }
            };
            // The house front is depth-sorted with the hero every frame, so the doorway rides just above it (it used to sit underneath and never showed).
            const ride = () => { if (!doorway.active || !o.active) { scene.events.off("postupdate", ride); return; } if (doorway.visible) doorway.setDepth(o.depth + 0.01); };
            scene.events.on("postupdate", ride);
            all.push(scene.add.text(L + 16 + 168, top + 4, "YOUR HOUSE", { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 5, y: 3 } }).setOrigin(0.5, 0).setDepth(4));
          } else {
            const k = crop("mh3_house_" + f, v3.houses, f * CW, 0, CW, CH, true), kf = crop("mh3_front_" + f, v3.houses, f * CW + fx, fy, fw, fh, true);
            all.push(scene.add.image(L, top, k).setOrigin(0).setDepth(2.45));
            const o = scene.add.image(L + fx + fw / 2, top + fy + fh, kf).setOrigin(0.5, 1).setDepth(3);
            H.body(o, { width: fw - 16, back: fh - 12, front: 0 }, "prop_house"); bodies.push(o); items.push(o);
          }
        });
      });
    }

    // ---- the whole town (Nov 13, full map step 1): roads, crossings and the areas still to come ----
    // Roads reuse the painted street plates (turned 90 degrees for the north-south ones). Each area not built yet is a
    // closed lot of forest from the tree wall art, solid to you and the swarm, with a sign saying when it opens.
    function buildTown(TN) {
      const C = TW.core, Fr = TW.fringe, S = TW.step, RW = TN.roadW, OVER = 30000;
      const tex = (k, img) => { if (!scene.textures.exists(k)) { scene.textures.addImage(k, img); scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST); } return k; };
      const turned = (k, img) => { // a street plate turned a quarter turn (pixels move whole, nothing is resampled)
        if (scene.textures.exists(k)) return k;
        const c = document.createElement("canvas"); c.width = img.height; c.height = img.width; const g = c.getContext("2d");
        g.imageSmoothingEnabled = false; g.translate(img.height, 0); g.rotate(Math.PI / 2); g.drawImage(img, 0, 0);
        scene.textures.addCanvas(k, c); scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST); return k;
      };
      const ha = tex("mh_plate_a", v3.sa), hb = tex("mh_plate_b", v3.sb), va = turned("mh_plate_va", v3.sa), vb = turned("mh_plate_vb", v3.sb);
      const put = (k, x, y, depth, cw, ch) => { const o = scene.add.image(x, y, k).setOrigin(0).setDepth(depth); if (cw || ch) o.setCrop(0, 0, cw || o.width, ch || o.height); all.push(o); townObjs.push(o); return o; };
      TN.roadsH.forEach(([x, y, w]) => { for (let k = 0, xx = x; xx < x + w; k++, xx += 832) put(k % 2 ? hb : ha, xx, y, -999.8, Math.min(832, x + w - xx)); });
      TN.roadsV.forEach(([x, y, , h]) => { for (let k = 0, yy = y; yy < y + h; k++, yy += 832) put(k % 2 ? vb : va, x, yy, -999.75, 0, Math.min(832, y + h - yy)); });
      // where roads meet: plain asphalt (from the 32 px kit) so no curb runs across the road
      const asphalt = (x, y, w, h) => { const o = scene.add.tileSprite(x, y, w, h, streetKey).setOrigin(0).setDepth(-999.6); all.push(o); townObjs.push(o); };
      const lane = 96; // the sidewalk and parkway on each side of a 512 px band; the road is the middle 320 px
      TN.roadsV.forEach(([vx]) => TN.roadsH.forEach(([, hy]) => asphalt(vx + lane, hy + lane, RW - 2 * lane, RW - 2 * lane)));
      TN.roadsV.forEach(([vx, , , vh], i) => { // your block's two streets run into the road on its left
        if (vx + RW !== TN.blockX[0]) return;
        [R.street1, R.street2].forEach(sy => asphalt(vx + lane, sy, RW - lane, R.street1End - R.street1));
      });
      // the closed areas: rows of forest, leafy edges that hang over the roads, a solid block, and a sign
      const kn = tex("mh_wall_n", tw.north), ks = tex("mh_wall_s", tw.south), kw = tex("mh_wall_w", tw.west), ke = tex("mh_wall_e", tw.east);
      const kst = tex("mh_wall_s_top", tw.southTop), kwt = tex("mh_wall_w_top", tw.westTop), ket = tex("mh_wall_e_top", tw.eastTop);
      const sq = TN.areas.find(a => a.id === "square"), cx = sq.rect[0] + sq.rect[2] / 2, cy = sq.rect[1] + sq.rect[3] / 2;
      window.MapleHollowAreas = []; townAreas = [];
      const built = (TNd && TNd.built) || [];
      TN.areas.forEach(a0 => {
        const a = Object.assign({}, a0, { objs: [], open: false, built: built.includes(a0.id) }); townAreas.push(a);
        const [x0, y0, w, h] = a.rect, x1 = x0 + w, y1 = y0 + h;
        const n0 = all.length; // everything added from here to the sign belongs to this area's woods
        for (let y = y0; y < y1; y += C) { const yy = Math.min(y, y1 - C); for (let x = x0; x < x1; x += S) put(kn, x, yy, -998, Math.min(S, x1 - x)); if (yy === y1 - C) break; }
        for (let x = x0; x < x1; x += S) { const cw = Math.min(S, x1 - x); put(ks, x, y0 - Fr, -997, cw); put(kst, x, y0 - Fr, OVER, cw); }
        for (let y = y0; y < y1; y += S) { const ch = Math.min(S, y1 - y); put(ke, x0 - Fr, y, -997, 0, ch); put(ket, x0 - Fr, y, OVER, 0, ch); put(kw, x1 - C, y, -997, 0, ch); put(kwt, x1 - C, y, OVER, 0, ch); }
        const o = scene.add.rectangle(x0 + w / 2, y1, w, h, 0x000000, 0).setOrigin(0.5, 1); // solid: nobody walks into the woods
        H.body(o, { width: w, back: h, front: 0 }, "prop_wall"); bodies.push(o); items.push(o); a.body = o;
        // the sign stands on the edge that faces the middle of town (Town Square's own sign faces down, toward your block)
        const mx = x0 + w / 2, my = y0 + h / 2, dx = cx - mx, dy = cy - my;
        let sx = mx, sy = y1 + 40;
        if (a.id !== "square") { if (Math.abs(dx) > Math.abs(dy)) { sx = dx > 0 ? x1 + 40 : x0 - 40; sy = my; } else { sx = mx; sy = dy > 0 ? y1 + 40 : y0 - 40; } }
        const line = a.age ? "OPENS AT " + a.age : "FULL LIFE ONLY";
        const t = scene.add.text(sx, sy, a.name + "\n" + line, { fontFamily: "Silkscreen, monospace", fontSize: "14px", color: "#171C35", backgroundColor: "#F2D7A1", align: "center", padding: { x: 8, y: 5 } }).setOrigin(0.5).setDepth(OVER + 1);
        all.push(t); townObjs.push(t);
        a.objs = all.slice(n0);
        window.MapleHollowAreas.push({ id: a.id, name: a.name, age: a.age, rect: a.rect, sign: [sx, sy], area: a });
      });
      if (TNd && TNd.bossSpots) window.MapleHollowBossSpot = kind => { // a boss comes out of its own area, once that area is open
        const sp = TNd.bossSpots[kind], a = sp && townAreas.find(z => z.id === sp[0]);
        if (!a || !a.open) return null;
        const [x0, y0, w, h] = a.rect; let x = x0 + sp[1], y = y0 + sp[2];
        const px = p.x, py = p.y + p.height / 2;
        if (Math.hypot(px - x, py - y) > 1700) { x = Math.max(x0 + 80, Math.min(x0 + w - 80, px)); y = Math.max(y0 + 80, Math.min(y0 + h - 80, py)); } // far away: the edge of its area nearest you
        return resolveSpawn(x, y);
      };
    }

    // An area opens at its age (Nov 13): its woods fade away, the lawn and its pieces appear, and you can walk in.
    function openArea(a, quiet) {
      if (a.open) return; a.open = true;
      const [x0, y0, w, h] = a.rect;
      a.objs.forEach(o => { const i = townObjs.indexOf(o); if (i >= 0) townObjs.splice(i, 1);
        if (quiet) o.destroy(); else scene.tweens.add({ targets: o, alpha: 0, duration: 1400, onComplete: () => o.destroy() }); });
      if (a.body) { const i = bodies.indexOf(a.body); if (i >= 0) bodies.splice(i, 1); a.body.destroy(); a.body = null; }
      data.floors.push({ x: x0, y: y0, width: w, height: h, material: "mh_grass", district: "home" });
      const g = scene.add.tileSprite(x0, y0, w, h, keyFor.mh_grass || grassKey).setOrigin(0).setDepth(-1000); all.push(g); townObjs.push(g);
      const solid = (x, y, w, h) => { const r = scene.add.rectangle(x + w / 2, y + h, w, h, 0x000000, 0).setOrigin(0.5, 1); H.body(r, { width: w, back: h, front: 0 }, "prop_wall"); bodies.push(r); items.push(r); };
      const keyed = (k, img, sx, sy, w, h, keyOut) => { // a crop of a sheet as its own texture (keyOut: magenta becomes see-through)
        if (scene.textures.exists(k)) return k;
        const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, sx, sy, w, h, 0, 0, w, h);
        if (keyOut) H.propTexture(scene, c, k, w, h); else { scene.textures.addCanvas(k, c); scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST); }
        return k;
      };
      const extra = (o) => { all.push(o); townObjs.push(o); return o; };
      ((TNd.layouts || {})[a.id] || []).forEach(e => {
        const [kind, ex, ey] = e, X = x0 + ex, Y = y0 + ey;
        if (kind === "house" && v3.houses) { // a neighbor's house: the cell under everyone, the front solid and sorted with the hero
          const f = e[3], [CW, CH] = MV.houseCell, [fx, fy, fw, fh] = MV.facade;
          extra(scene.add.image(X, Y, keyed("mh3_house_" + f, v3.houses, f * CW, 0, CW, CH, true)).setOrigin(0).setDepth(2.45));
          const o = extra(scene.add.image(X + fx + fw / 2, Y + fy + fh, keyed("mh3_front_" + f, v3.houses, f * CW + fx, fy, fw, fh, true)).setOrigin(0.5, 1).setDepth(3));
          H.body(o, { width: fw - 16, back: fh - 12, front: 0 }, "prop_house"); bodies.push(o); items.push(o);
          return;
        }
        if (kind === "yard" && MY && !my.failed) { // a backyard plate plus its theme's pieces and the shared frame (fence posts, shrubs)
          const th = MY.themes[e[3]]; if (!th) return;
          extra(scene.add.image(X, Y, keyed("mh4_yard_" + th.ground, my[th.ground], 0, 0, my[th.ground].width, my[th.ground].height)).setOrigin(0).setDepth(-999));
          MY.frame.concat(th.pieces).forEach(q => {
            const img = my[q.f]; if (!img) return;
            const k = keyed("mh4_piece_" + q.f, img, 0, 0, img.width, img.height, q.k !== "flat");
            if (q.k === "flat") { extra(scene.add.image(X + q.x, Y + q.y, k).setOrigin(0).setDepth(-998)); return; }
            const o = extra(scene.add.image(X + q.x, Y + q.d, k).setOrigin(0, (q.d - q.y) / img.height).setDepth(3));
            o.sliceDepth = Y + q.d; items.push(o); H.body(o, { width: 1, back: 1, front: 0 }, "prop_decor"); o.body.enable = false;
            (q.fp || []).forEach(([bx, by, bw, bh]) => solid(X + bx, Y + by, bw, bh));
          });
          return;
        }
        if (kind === "street") { // street plates, with the rounded dead end on the left
          const len = e[3];
          for (let k2 = 0, xx = X; xx < X + len; k2++, xx += 832) { const o = extra(scene.add.image(xx, Y, k2 % 2 ? "mh_plate_b" : "mh_plate_a").setOrigin(0).setDepth(-999.7)); o.setCrop(0, 0, Math.min(832, X + len - xx), 512); }
          if (e[4] === "capLeft" && se.left && SE) { const [ca, cb] = SE.left.crop; extra(scene.add.image(X - (cb - ca), Y, keyed("mh_end_left", se.left, ca, 0, cb - ca, se.left.height)).setOrigin(0).setDepth(-999.7)); }
          return;
        }
        if (kind === "asphalt") { extra(scene.add.tileSprite(X, Y, e[3], e[4], streetKey).setOrigin(0).setDepth(-999.6)); return; }
        if (tp.failed) return;
        const f = kind, x = ex, y = ey;
        const img = tp[f], P = TNd.pieces[f]; if (!img || !P) return;
        const k = "mh4_piece_" + f + "-v4.png";
        if (!scene.textures.exists(k)) { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; c.getContext("2d").drawImage(img, 0, 0);
          if (P.flat) { scene.textures.addCanvas(k, c); scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST); } else H.propTexture(scene, c, k, img.width, img.height); }
        let o;
        if (P.flat) o = scene.add.image(X, Y, k).setOrigin(0).setDepth(-998);
        else { // stands up: sorted by its feet with the hero, solid only at its base (the yards' rule)
          o = scene.add.image(X, Y + P.dy, k).setOrigin(0, P.dy / img.height).setDepth(3); o.sliceDepth = Y + P.dy; items.push(o);
          H.body(o, { width: 1, back: 1, front: 0 }, "prop_decor"); o.body.enable = false;
          (P.fp || []).forEach(([bx, by, bw, bh]) => { const r = scene.add.rectangle(X + bx + bw / 2, Y + by + bh, bw, bh, 0x000000, 0).setOrigin(0.5, 1);
            H.body(r, { width: bw, back: bh, front: 0 }, "prop_wall"); bodies.push(r); items.push(r); });
        }
        all.push(o); townObjs.push(o);
      });
      if (window.NAV && NAV.invalidate) NAV.invalidate();
      if (!quiet) {
        const L = (TNd.openLines || {})[a.id];
        if (L && window.showLowerThird) showLowerThird("promo", L[0], L[1], 6000);
        if (typeof sfx === "function") sfx("levelUp", 0);
      }
    }

    // ---- the tree wall (Nov 11): solid forest on all four sides of the town ----
    // Top and bottom strips run one piece past each end so they fill the corners; the side strips sit on top of them.
    // The leafy inside edge of the bottom and side strips is drawn again above everyone, so you walk under the leaves.
    function buildTreeWall() {
      const S = TW.step, C = TW.core, Fr = TW.fringe, W = M.width, B = R.bottom, OVER = 30000;
      const tex = (k, img) => { if (!scene.textures.exists(k)) { scene.textures.addImage(k, img); scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST); } return k; };
      const put = (k, x, y, depth, cw, ch) => { const o = scene.add.image(x, y, k).setOrigin(0).setDepth(depth); if (cw || ch) o.setCrop(0, 0, cw || o.width, ch || o.height); all.push(o); };
      const kn = tex("mh_wall_n", tw.north), ks = tex("mh_wall_s", tw.south), kw = tex("mh_wall_w", tw.west), ke = tex("mh_wall_e", tw.east);
      const kst = tex("mh_wall_s_top", tw.southTop), kwt = tex("mh_wall_w_top", tw.westTop), ket = tex("mh_wall_e_top", tw.eastTop);
      // With corner pieces: each strip starts where a corner ends (Fr px in from the map edge), so that join is seamless.
      // Without them the top and bottom strips run one piece past each end and the side strips sit on top.
      // L and Rt are the left and right ends of the walkable ground: the town plus a grass margin on each side.
      const mg = TW.margin || 0, TN = data.town, L = TN ? TN.x0 : -mg, Rt = TN ? TN.x1 : W + mg, Tp = TN ? TN.y0 : 0; // Tp: the top edge (the whole town reaches above your block)
      const K = tw.corners ? Fr : 0, x0 = K ? L + K : L - S, x1 = K ? Rt - K : Rt + S;
      for (let x = x0; x < x1; x += S) {
        const w = Math.min(S, x1 - x);
        put(kn, x, Tp - C, -998, w);
        put(ks, x, B - Fr, -998, w);
        if (x + w > L && x < Rt) put(kst, x, B - Fr, OVER, w);
      }
      for (let y = Tp + K; y < B - K; y += S) {
        const h = Math.min(S, B - K - y);
        put(kw, L - C, y, -997, 0, h); put(ke, Rt - Fr, y, -997, 0, h);
        put(kwt, L - C, y, OVER, 0, h); put(ket, Rt - Fr, y, OVER, 0, h);
      }
      if (K) [[L - C, Tp - C], [Rt - Fr, Tp - C], [L - C, B - Fr], [Rt - Fr, B - Fr]].forEach(([x, y], i) => {
        put(tex("mh_wall_c" + i, tw.corners[i * 2]), x, y, -996); put(tex("mh_wall_c" + i + "_top", tw.corners[i * 2 + 1]), x, y, OVER);
      });
      // Solid edge: the hero stops a little inside the leaves instead of disappearing under them (the north side already has its hedge).
      const E = TW.edge, wall = (x, y, w, h) => { const o = scene.add.rectangle(x + w / 2, y + h, w, h, 0x000000, 0).setOrigin(0.5, 1); H.body(o, { width: w, back: h, front: 0 }, "prop_wall"); bodies.push(o); items.push(o); };
      if (E) { wall(L, Tp, E, B - Tp); wall(Rt - E, Tp, E, B - Tp); wall(L + E, B - E, Rt - L - 2 * E, E);
        if (TN) wall(L + E, Tp, Rt - L - 2 * E, E); else if (mg) { wall(L + E, 0, mg - E, E); wall(W, 0, mg - E, E); } }
      return { x: L - C, y: Tp - C, width: Rt - L + 2 * C, height: B - Tp + 2 * C, bottom: B };
    }

    // ---- camera and the area object the rest of the game talks to ----
    const cam = scene.cameras.main;
    // Outdoors the camera stays inside the tree wall. Indoors (the house sits far below the town) it uses the old wide bounds.
    let camIn = null;
    const fitCam = () => {
      const inTown = !!town && p.y < town.bottom + 200;
      if (inTown === camIn) return; camIn = inTown;
      if (inTown) cam.setBounds(town.x, town.y, town.width, town.height);
      else cam.setBounds(data.bounds.x - 200, data.bounds.y - 200, data.bounds.width + 400, data.bounds.height + 400);
    };
    cam.setBackgroundColor("#3E7775");
    const p = refs.player;
    const within = (x, y) => data.floors.some(f => x >= f.x && x < f.x + f.width && y >= f.y && y < f.y + f.height);
    p.setPosition(data.spawn[0], data.spawn[1] - p.height / 2); p.body.updateFromGameObject();
    fitCam();
    for (const o of bodies) o.body.updateFromGameObject();
    let lastValid = data.spawn.slice();
    const spawnPadding = 20;
    function fitsSpawn(x, y) {
      return [[x - spawnPadding, y - spawnPadding], [x + spawnPadding, y + spawnPadding], [x + spawnPadding, y - spawnPadding], [x - spawnPadding, y + spawnPadding]].every(q => within(...q)) &&
        !bodies.some(o => { const b = o.body; return o.active && b && b.enable && x > b.x - spawnPadding && x < b.right + spawnPadding && y > b.y - spawnPadding && y < b.bottom + spawnPadding; });
    }
    function resolveSpawn(x, y) {
      x = Math.max(data.bounds.x + 24, Math.min(data.bounds.x + data.bounds.width - 24, x));
      y = Math.max(data.bounds.y + 24, Math.min(data.bounds.y + data.bounds.height - 24, y));
      if (fitsSpawn(x, y)) return [x, y];
      for (let d = 32; d <= 256; d += 32) for (const [dx, dy] of [[0, d], [0, -d], [d, 0], [-d, 0]]) if (fitsSpawn(x + dx, y + dy)) return [x + dx, y + dy];
      return null;
    }
    function update() {
      if (!alive) return;
      const x = p.x, y = p.y + p.height / 2;
      if (!within(x, y)) { p.setPosition(lastValid[0], lastValid[1] - p.height / 2); p.setVelocity(0, 0); p.body.updateFromGameObject(); }
      else lastValid = [x, y];
      fitCam();
      if (townAreas && ++openTick % 30 === 0 && typeof currentAge !== "undefined") townAreas.forEach(a => {
        // a resumed run (or one that starts late) opens what's already due without the fanfare
        if (!a.open && a.built && a.age && currentAge >= a.age) openArea(a, currentAge >= a.age + 0.4);
      });
      if (townObjs.length && ++cullTick % 10 === 0) { // draw only the town pieces near the screen (a big map is cheap this way)
        const v = cam.worldView, m = 400;
        townObjs.forEach(o => { const w = o.displayWidth || o.width, h = o.displayHeight || o.height, x = o.x - w * o.originX, y = o.y - h * o.originY;
          o.setVisible(x < v.right + m && x + w > v.x - m && y < v.bottom + m && y + h > v.y - m); });
      }
    }
    let cullTick = 9;
    function destroy() { alive = false; all.forEach(o => o.destroy()); items.forEach(o => o.destroy()); }
    return { data, gates: [], items, bodies, active: true, visibleProps: 0, peakVisibleProps: 0, spawnPadding, repairedSpawns: 0,
      resolveSpawn, update, sync() {}, destroy, contains: within, stage: "home" };
  }
  return { build };
})();
