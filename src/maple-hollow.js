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
    const items = [], bodies = [], all = [];
    let alive = true;
    const kit = await H.image(ROOT + "maple-hollow-tiles-props-v1.png"); if (!H.isAlive()) return null;
    const housesImg = await H.image(ROOT + "maple-hollow-houses-v1.png"); if (!H.isAlive()) return null;
    let yourImg = null, intImg = null, intMap = null; // your house + the inside (Nov 9); the street still builds if they fail
    try { yourImg = await H.image(ROOT + "your-house-v1.png"); } catch (e) {}
    try { intImg = await H.image(ROOT + "house-interior-v1.png"); intMap = await (await fetch(ROOT + "house-interior-v1.json?v=" + (window.BUILD || 1))).json(); } catch (e) { intImg = null; }
    if (!H.isAlive()) return null;
    const piece = id => intMap && (intMap.pieces || []).find(p => p.id === id);
    if (window.ArtSheets) ArtSheets.load(scene, "kh_sheet", ROOT + "key-hunt-v1.png", 32, 32); // the key hunt's props (src/key-hunt.js)

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
    for (const f of data.floors) {
      const t = scene.add.tileSprite(f.x, f.y, f.width, f.height, keyFor[f.material] || grassKey).setOrigin(0).setDepth(-1000);
      all.push(t);
    }
    // a manhole or two on each street
    [[620, R.street1 + 32], [1880, R.street1 + 128], [1240, R.street2 + 32]].forEach(([x, y]) => {
      const k = "mh_tile_" + T.manhole;
      if (!scene.textures.exists(k)) { const t = scene.textures.createCanvas(k, 32, 32); t.getContext().imageSmoothingEnabled = false; cell(t.getContext(), T.manhole, 0, 0); t.refresh(); }
      all.push(scene.add.image(x, y, k).setOrigin(0).setDepth(-999));
    });

    // ---- houses: six fronts, each on a lot with a driveway ----
    for (let i = 0; i < 6; i++) {
      const k = "mh_house_" + i; if (scene.textures.exists(k)) continue;
      const c = document.createElement("canvas"); c.width = 192; c.height = 224;
      c.getContext("2d").drawImage(housesImg, i * 192, 0, 192, 224, 0, 0, 192, 224);
      H.propTexture(scene, c, k, 192, 224);
    }
    const lotX = i => M.firstLotX + i * M.lotWidth;
    const drive = (x, y0, y1) => {
      const k = "mh_drive"; ground(k, 64, 64, (xx, yy, r) => r() < 0.2 ? T.oil : T.driveway);
      all.push(scene.add.tileSprite(x, y0, 64, y1 - y0, k).setOrigin(0).setDepth(-998));
    };
    if (yourImg) for (let i = 0; i < 2; i++) { // cell 0 door closed, cell 1 door open (only the doorway changes)
      const k = "mh_yours_" + i; if (scene.textures.exists(k)) continue;
      const c = document.createElement("canvas"); c.width = 192; c.height = 224;
      c.getContext("2d").drawImage(yourImg, i * 192, 0, 192, 224, 0, 0, 192, 224);
      H.propTexture(scene, c, k, 192, 224);
    }
    let yourHouse = null;
    function house(frame, cx, frontY, mine, isYours) {
      const tex = isYours && scene.textures.exists("mh_yours_0") ? "mh_yours_0" : "mh_house_" + frame;
      const o = scene.add.image(cx, frontY + 8, tex).setOrigin(0.5, 1).setDepth(3);
      if (isYours) yourHouse = o;
      H.body(o, { width: 172, back: 196, front: 0 }, "prop_house"); bodies.push(o); items.push(o);
      drive(cx + 40, frontY, frontY + (mine === "south" ? R.sidewalk3 - R.southHouseFront : R.sidewalk1 - R.northHouseFront));
      return o;
    }
    const yh0 = M.yourHouse;
    M.northHouses.forEach((f, i) => house(f, lotX(i), R.northHouseFront, "north", yh0.row === "north" && yh0.lot === i));
    M.southHouses.forEach((f, i) => house(f, lotX(i), R.southHouseFront, "south", yh0.row === "south" && yh0.lot === i));
    window.MapleHollowDoor = open => { if (yourHouse && yourHouse.active && scene.textures.exists("mh_yours_1")) yourHouse.setTexture(open ? "mh_yours_1" : "mh_yours_0"); };
    { // a little sign on your house
      const yh = M.yourHouse, x = lotX(yh.lot), y = (yh.row === "north" ? R.northHouseFront : R.southHouseFront) - 228;
      all.push(scene.add.text(x, y, "YOUR HOUSE", { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 5, y: 3 } }).setOrigin(0.5, 1).setDepth(4));
    }

    // ---- yard props: flat decorations under everyone, scattered on lawns (seeded) ----
    const r = rng(1979);
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

    // ---- inside your house: walls with doorways into the hallway, furniture, room names ----
    if (intImg) {
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
      wall(X - 16, Y - 32, HW + 32, 32, "wall-horizontal");                 // back wall
      wall(X - 16, Y, 16, RH + HH, "wall-vertical");                        // left
      wall(X + HW, Y, 16, RH + HH, "wall-vertical");                        // right
      wall(X - 16, Y + RH + HH, HW / 2 - 24 + 16, 16, "wall-horizontal");    // front wall, left of the door
      wall(X + HW / 2 + 24, Y + RH + HH, HW / 2 - 24 + 16, 16, "wall-horizontal"); // front wall, right of the door
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
      // the front mat inside (step on it to go back out)
      const mat = cut("wall-doorway");
      if (mat) all.push(scene.add.image(I.exitMat[0], I.exitMat[1], mat).setOrigin(0.5, 1).setDepth(2.6));
    }

    // ---- camera and the area object the rest of the game talks to ----
    const cam = scene.cameras.main;
    cam.setBounds(data.bounds.x - 200, data.bounds.y - 200, data.bounds.width + 400, data.bounds.height + 400);
    cam.setBackgroundColor("#3E7775");
    const p = refs.player;
    const within = (x, y) => data.floors.some(f => x >= f.x && x < f.x + f.width && y >= f.y && y < f.y + f.height);
    p.setPosition(data.spawn[0], data.spawn[1] - p.height / 2); p.body.updateFromGameObject();
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
    }
    function destroy() { alive = false; all.forEach(o => o.destroy()); items.forEach(o => o.destroy()); }
    return { data, gates: [], items, bodies, active: true, visibleProps: 0, peakVisibleProps: 0, spawnPadding, repairedSpawns: 0,
      resolveSpawn, update, sync() {}, destroy, contains: within, stage: "home" };
  }
  return { build };
})();
