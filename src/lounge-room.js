// The Student Lounge corner (Nov 4, Rami's office lounge where TJ and Derek do their thing).
// ChatGPT's kit: assets/stage/props/manifest-lounge.json. Built once from StartAreaArt.build, right after the wall dresser.
// The wall pieces hang on the Break Room's north wall behind the coffee cart (the Lounge counter);
// the furniture sits in the open middle of the Break Room, inside the walking loop, so no route gets narrower.
window.LoungeRoom = (() => {
  const ROOT = "assets/stage/props/";
  const WALL_IDS = ["wall-251", "wall-252"]; // x -2032 to -1520: the wall dresser leaves these to us
  const WALL_BOTTOM = -144;
  // [family, variant, x, y]. Floor pieces: y is where the feet touch. Wall pieces: y is the bottom edge.
  const WALL = [
    ["lounge_accent_wall", 0, -1904, WALL_BOTTOM - 2], ["lounge_accent_wall", 0, -1648, WALL_BOTTOM - 2],
    ["lounge_collage_wall", 0, -1900, WALL_BOTTOM - 14], ["lounge_chalkboard", 0, -1990, WALL_BOTTOM - 8],
    ["lounge_posters", 0, -1700, WALL_BOTTOM - 22], ["lounge_posters", 2, -1640, WALL_BOTTOM - 22],
    ["lounge_cube_shelf", 0, -1612, WALL_BOTTOM + 30]
  ];
  const FLOOR = [ // the futons, lamps and mic sit on the Break Room's big rug (x -2097 to -1425, y 165 to 670)
    ["lounge_desk_run", 0, -2240, 470], ["lounge_filing_pumpkins", 0, -2380, 470],
    ["lounge_paper_lamp", 0, -1856, 380], ["lounge_futon", 0, -1768, 380], ["lounge_paper_lamp", 0, -1680, 380],
    ["lounge_coffee_table", 0, -1768, 470], ["lounge_mic_stand", 0, -1570, 450],
    ["lounge_futon", 1, -1960, 600]
  ];
  const skipWall = id => WALL_IDS.includes(id);

  async function build(scene, ctx) {
    const { H, add, items, bodies, layer } = ctx;
    let man;
    try { man = await (await fetch(ROOT + "manifest-lounge.json?v=" + (window.BUILD || 1))).json(); } catch (e) { console.warn("Lounge kit unavailable"); return 0; }
    const fams = {};
    await Promise.all(man.assets.map(async a => {
      try {
        const img = await H.image(ROOT + a.file);
        if (!H.isAlive()) return;
        const [w, h] = a.frame, cells = Math.max(a.variants || 1, a.frames || 1);
        for (let v = 0; v < cells; v++) {
          const key = "lk_" + a.id + "_" + v;
          if (scene.textures.exists(key)) continue;
          const c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, v * w, 0, w, h, 0, 0, w, h);
          H.propTexture(scene, c, key, w, h); // keys out the magenta
        }
        fams[a.id] = a;
      } catch (e) { /* a missing piece never stops the office */ }
    }));
    if (!H.isAlive()) return 0;
    let placed = 0; const lamps = [];
    const put = (id, v, x, y, depth) => {
      const f = fams[id], key = "lk_" + id + "_" + v;
      if (!f || !scene.textures.exists(key)) return null;
      const o = add(scene.add.image(x, y, key).setOrigin(f.origin[0], f.origin[1]));
      o.sliceId = "lounge-" + id + "-" + placed++; o.sliceDepth = depth; items.push(o);
      return o;
    };
    WALL.forEach(([id, v, x, y], i) => put(id, v, x, y, WALL_BOTTOM + 2 + i * 0.01));
    FLOOR.forEach(([id, v, x, y]) => {
      const f = fams[id]; const o = put(id, v, x, y, y); if (!o) return;
      if (f.solid && f.footprint && f.footprint.width) {
        H.body(o, { width: f.footprint.width, back: f.footprint.back, front: f.footprint.front }, "prop_desk"); bodies.push(o);
        if (window.OfficeEnvironment && layer) OfficeEnvironment.groundObject(scene, layer(o.x, o.y), "lk_" + id + "_" + v, o.x, o.y, "prop");
      }
      if (f.frames > 1 && f.frameMs) lamps.push({ o, id, n: f.frames });
    });
    // The paper lamps flicker between their two frames.
    if (lamps.length) scene.time.addEvent({ delay: fams.lounge_paper_lamp.frameMs || 900, loop: true, callback: () => lamps.forEach(l => { if (!l.o.active) return; l.f = ((l.f || 0) + 1) % l.n; l.o.setTexture("lk_" + l.id + "_" + l.f); }) });
    window.LOUNGE_ROOM_STATS = { placed, lamps: lamps.length };
    return placed;
  }
  return { build, skipWall };
})();
