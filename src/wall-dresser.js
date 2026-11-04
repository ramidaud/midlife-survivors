// The wall dresser (Nov 4, Rami: "line the walls with things rather than a random object every few blocks").
// Lines every room's north wall (the wall face you can see) with ChatGPT's wall kit, and scatters faint floor details.
// Art and metadata: assets/stage/props/manifest-wall.json. Called once from StartAreaArt.build (src/start-area.js).
//
// How a wall gets dressed:
//   1. Find the room in front of it (the floor just south of the wall).
//   2. Some rooms get a continuous strip first (wood paneling, cloud mural, cable tray...).
//   3. Then fill the wall left to right in 32 px modules: framed things on the wall, and furniture that hugs it
//      (shelves, cabinets, counters). Furniture is only placed where it can't narrow a hallway, a doorway or a route.
//   4. Every wall is seeded by its id, so the office looks the same every run.
window.WallDresser = (() => {
  const ROOT = "assets/stage/props/";
  const STRIPS = { // continuous strips per room: [family, which part of the wall]
    executive: [["wood_paneling", "low"]], wellness: [["cloud_mural", "low"]], conference: [["frosting_strip", "mid"]],
    server: [["cable_tray", "top"], ["server_warning_stripe", "floor"]], parking: [["parking_stripes", "floor"]]
  };
  const ROOM_WEIGHT = 3;        // room-specific pieces show up three times as often as the generic ones
  const GAP_CHANCE = 0.22;      // sometimes leave a 32 px breather between pieces
  const HUG_CHANCE = 0.38;      // how often a slot gets furniture instead of a framed piece (when furniture fits)
  const DECAL_EVERY = 110000;   // one faint floor detail per this many square pixels of floor

  function rng(seedText) { let h = 2166136261; for (const c of seedText) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; }; }
  const hit = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  function segDist(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1; const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l)); return Math.hypot(px - ax - t * dx, py - ay - t * dy); }

  async function loadKit(scene, H) {
    let man;
    try { man = await (await fetch(ROOT + "manifest-wall.json?v=" + (window.BUILD || 1))).json(); } catch (e) { console.warn("Wall kit manifest unavailable"); return null; }
    const fams = {};
    await Promise.all(man.assets.map(async a => {
      try {
        const img = await H.image(ROOT + a.file);
        if (!H.isAlive()) return;
        const [w, h] = a.frame;
        for (let v = 0; v < (a.variants || 1); v++) {
          const key = "wk_" + a.id + "_" + v;
          if (scene.textures.exists(key)) continue;
          const c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, v * w, 0, w, h, 0, 0, w, h);
          H.propTexture(scene, c, key, w, h); // keys out the magenta, keeps native pixels
        }
        fams[a.id] = a;
      } catch (e) { /* one missing piece never stops the office */ }
    }));
    return fams;
  }

  // ctx: { data, H, add, items, bodies, layer, BASE }
  async function dress(scene, ctx) {
    const { data, H, add, items, bodies, BASE } = ctx;
    const fams = await loadKit(scene, H);
    if (!fams || !H.isAlive()) return { placed: 0 };
    const list = Object.values(fams);
    const roomAt = (x, y) => { const f = data.floors.find(r => x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height); return f ? f.district : null; };

    // Things furniture must not crowd: routes, clear spaces, gates, props, desks, people.
    const keepClear = [];
    (data.protectedRoutes || []).forEach(r => keepClear.push(r));
    (data.clearSpaces || []).forEach(c => { if (c.shape && c.shape.type === "rect") keepClear.push(c.shape); });
    (data.gates || []).forEach(g => keepClear.push({ x: g.x - 16, y: g.y - 16, width: (g.width || 128) + 32, height: (g.height || 224) + 64 }));
    (data.placements || []).forEach(p => keepClear.push({ x: p.x - 44, y: p.y - 56, width: 88, height: 80 }));
    (data.workers || []).forEach(p => keepClear.push({ x: p.x - 40, y: p.y - 60, width: 80, height: 90 }));
    (data.structures || []).forEach(s => keepClear.push(s));
    const loop = data.officeLoop || {};
    ["pods", "workstations", "partitions", "scenes", "bands"].forEach(k => (loop[k] || []).forEach(o => {
      if (o && typeof o.x === "number" && typeof o.y === "number") keepClear.push({ x: o.x - 24 - (o.width ? 0 : 40), y: o.y - 24 - (o.height ? 0 : 60), width: (o.width || 80) + 48, height: (o.height || 90) + 48 });
    }));
    const routes = data.internalRoutes || [];
    const nearRoute = (x, y) => routes.some(r => { const p = r.points || []; for (let i = 1; i < p.length; i++) if (segDist(x, y, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1]) < (r.width || data.routeWidth || 224) / 2 + 20) return true; return false; });
    // Framed things already on a wall (from the original layout) keep their spot.
    const wallProps = (data.placements || []).filter(p => p.mount === "wall");

    let placed = 0, solids = 0;
    const put = (fam, v, x, baseY, depth) => {
      const key = "wk_" + fam.id + "_" + v;
      if (!scene.textures.exists(key)) return null;
      const o = add(scene.add.image(x, baseY, key).setOrigin(fam.origin[0], fam.origin[1]));
      o.sliceId = "wk-" + fam.id + "-" + placed; o.sliceDepth = depth; items.push(o); placed++;
      return o;
    };

    for (const w of data.walls) {
      if (w.axis !== "x" || w.side !== "n" || w.width < 64) continue;
      if (window.LoungeRoom && LoungeRoom.skipWall(w.id)) continue; // the Student Lounge dresses this stretch (src/lounge-room.js)
      const bottom = w.y + w.height, room = roomAt(w.x + w.width / 2, bottom + 24);
      if (!room) continue;
      const rnd = rng(w.id), low = w.style === "parking" ? 2 : 16; // parking walls are short
      const pick = arr => arr[Math.floor(rnd() * arr.length)];
      // 1. strips
      for (const [id, where] of STRIPS[room] || []) {
        const f = fams[id]; if (!f) continue;
        const v = Math.floor(rnd() * (f.variants || 1)), y = where === "top" ? bottom - 92 : where === "mid" ? bottom - 52 : where === "floor" ? bottom : bottom - 2;
        for (let x = w.x; x < w.x + w.width; x += f.frame[0]) {
          const o = put(f, v, x + f.frame[0] / 2, y, bottom + 2); if (!o) break;
          const left = w.x + w.width - x; if (left < f.frame[0]) o.setCrop(0, 0, left, f.frame[1]);
        }
      }
      // 2. slots
      const pool = list.filter(f => f.mount !== "floor" && !f.repeatX && (f.rooms.includes(room) || f.rooms.includes("*")));
      const weighted = []; pool.forEach(f => { for (let i = 0; i < (f.rooms.includes(room) ? ROOM_WEIGHT : 1); i++) weighted.push(f); });
      let x = w.x + 16, last = null, noHug = false; const used = new Set();
      const end = w.x + w.width - 16;
      while (x + 32 <= end) {
        if (!noHug && rnd() < GAP_CHANCE) { x += 32; continue; }
        const room_ = end - x, wantHug = !noHug && rnd() < HUG_CHANCE;
        noHug = false;
        const fresh = weighted.filter(f => !used.has(f.id)), src = fresh.length ? fresh : weighted; // no repeats on one wall while there's anything new
        const fits = src.filter(f => f.moduleWidth <= room_ && f !== last && (f.mount === "hugging") === wantHug);
        const f = fits.length ? pick(fits) : pick(src.filter(f => f.moduleWidth <= room_ && f !== last && f.mount === "mounted"));
        if (!f) break;
        const cx = x + f.moduleWidth / 2, v = Math.floor(rnd() * (f.variants || 1));
        // Keep clear of framed things already hanging here.
        if (wallProps.some(p => Math.abs(p.y - (bottom - 16)) < 40 && Math.abs(p.x - cx) < f.moduleWidth / 2 + 40)) { x += 32; continue; }
        if (f.mount === "hugging") {
          const fp = { x: cx - f.footprint.width / 2, y: bottom, width: f.footprint.width, height: f.footprint.depth + 8 };
          if (keepClear.some(r => hit(fp, r)) || nearRoute(cx, bottom + 12) || roomAt(cx - f.moduleWidth / 2 + 2, bottom + 30) !== room || roomAt(cx + f.moduleWidth / 2 - 2, bottom + 30) !== room) {
            noHug = true; continue; // no room for furniture here: hang a framed piece in this slot instead
          }
          const o = put(f, v, cx, bottom + f.footprint.depth, bottom + f.footprint.depth);
          if (o) {
            H.body(o, { width: f.footprint.width, back: f.footprint.back, front: f.footprint.front }, "prop_desk"); bodies.push(o); solids++;
            if (window.OfficeEnvironment && ctx.layer) OfficeEnvironment.groundObject(scene, ctx.layer(o.x, o.y), "wk_" + f.id + "_" + v, o.x, o.y, "prop");
          }
        } else {
          const y = f.height <= 32 ? bottom - low - 26 : f.height <= 40 ? bottom - low - 18 : bottom - low;
          put(f, v, cx, y, bottom + 4);
        }
        last = f; used.add(f.id); x += f.moduleWidth;
      }
    }

    // 3. faint floor details (baked into the floor, so they cost nothing per frame)
    const decals = list.filter(f => f.mount === "floor");
    for (const r of data.floors) {
      const rnd = rng("floor" + r.x + "," + r.y), n = Math.min(14, Math.floor(r.width * r.height / DECAL_EVERY));
      for (let i = 0; i < n; i++) {
        const f = decals[Math.floor(rnd() * decals.length)]; if (!f) break;
        const v = Math.floor(rnd() * (f.variants || 1)), key = "wk_" + f.id + "_" + v;
        if (!scene.textures.exists(key)) continue;
        const [fw, fh] = f.frame, x = r.x + fw / 2 + rnd() * Math.max(1, r.width - fw), y = r.y + fh / 2 + rnd() * Math.max(1, r.height - fh);
        const o = add(scene.add.image(Math.round(x), Math.round(y), key).setOrigin(0.5).setAlpha(f.suggestedAlpha || 0.23).setDepth(BASE + 4),
          { x: x - fw / 2, y: y - fh / 2, width: fw, height: fh });
        o.sliceBakeFloor = true;
      }
    }
    return { placed, solids };
  }
  return { dress };
})();
