// Edge pointers (Nov 14, Rami: "don't forget the indicators for the bosses and open sections").
// When a boss, or an area that just opened (until you walk into it), is off screen, an arrow sits on the edge of the
// screen pointing at it, with a short label. Settings: POINTERS below. main.js calls Pointers.update(scene) every frame.
window.POINTERS = {
  inset: { top: 96, bottom: 84, side: 28 },   // keep clear of the HUD at the top and the ticker at the bottom
  areaForMs: 90000,                            // a newly opened area is pointed at for this long, or until you enter it
  colors: { boss: 0xC45C4B, area: 0x83A89A, chipBg: "#F2D7A1", chipText: "#171C35" }
};

window.Pointers = (() => {
  const P = () => window.POINTERS;
  const pool = [];
  let newAreas = []; // [{ area, until }]

  function make(scene) {
    const g = scene.add.graphics().setScrollFactor(0).setDepth(60000);
    const t = scene.add.text(0, 0, "", { fontFamily: "Silkscreen, monospace", fontSize: "14px", color: P().colors.chipText,
      backgroundColor: P().colors.chipBg, padding: { x: 6, y: 3 } }).setOrigin(0.5).setScrollFactor(0).setDepth(60001);
    return { g, t };
  }
  function hideFrom(i) { for (; i < pool.length; i++) { pool[i].g.clear().setVisible(false); pool[i].t.setVisible(false); } }

  // a new area just opened (src/maple-hollow.js calls this)
  function areaOpened(a) { newAreas.push({ area: a, until: (typeof runElapsedMs !== "undefined" ? runElapsedMs : 0) + P().areaForMs }); }
  function reset() { newAreas = []; hideFrom(0); }

  function update(scene) {
    if (typeof player === "undefined" || !player || !player.active) { hideFrom(0); return; }
    const cam = scene.cameras.main, view = cam.worldView, now = typeof runElapsedMs !== "undefined" ? runElapsedMs : 0;
    const targets = [];
    if (typeof bills !== "undefined") bills.getChildren().forEach(b => { if (b.active && b.isBoss) targets.push({ x: b.x, y: b.y, label: "BOSS", color: P().colors.boss }); });
    const px = player.x, py = player.y;
    newAreas = newAreas.filter(n => {
      const [x0, y0, w, h] = n.area.rect, inside = px > x0 && px < x0 + w && py > y0 && py < y0 + h;
      return !inside && now < n.until;
    });
    newAreas.forEach(n => { const [x0, y0, w, h] = n.area.rect;
      targets.push({ x: Math.max(x0, Math.min(x0 + w, px)), y: Math.max(y0, Math.min(y0 + h, py)), label: (n.area.name || "NEW AREA").toUpperCase(), color: P().colors.area }); });
    let i = 0;
    for (const tg of targets) {
      if (tg.x > view.x && tg.x < view.right && tg.y > view.y && tg.y < view.bottom) continue; // on screen: no arrow needed
      const W = cam.width, H = cam.height, I = P().inset, cx = W / 2, cy = H / 2;
      const sx = (tg.x - view.x) * cam.zoom, sy = (tg.y - view.y) * cam.zoom;
      const dx = sx - cx, dy = sy - cy, ang = Math.atan2(dy, dx);
      const hx = cx - I.side - 24, hyTop = cy - I.top - 24, hyBot = H - cy - I.bottom - 24;
      const sxk = dx !== 0 ? hx / Math.abs(dx) : Infinity, syk = dy < 0 ? hyTop / -dy : dy > 0 ? hyBot / dy : Infinity, k = Math.min(sxk, syk);
      const ex = cx + dx * k, ey = cy + dy * k;
      if (!pool[i]) pool[i] = make(scene);
      const { g, t } = pool[i++];
      g.clear().setVisible(true).fillStyle(tg.color, 1).lineStyle(2, 0x171C35, 1);
      const r = 16, tip = [ex + Math.cos(ang) * r, ey + Math.sin(ang) * r], l = [ex + Math.cos(ang + 2.4) * r, ey + Math.sin(ang + 2.4) * r], rr = [ex + Math.cos(ang - 2.4) * r, ey + Math.sin(ang - 2.4) * r];
      g.fillTriangle(tip[0], tip[1], l[0], l[1], rr[0], rr[1]); g.strokeTriangle(tip[0], tip[1], l[0], l[1], rr[0], rr[1]);
      const lx = ex - Math.cos(ang) * 30, ly = ey - Math.sin(ang) * 22;
      t.setText(tg.label).setPosition(Math.max(t.width / 2 + 6, Math.min(W - t.width / 2 - 6, lx)), Math.max(I.top, Math.min(H - I.bottom, ly))).setVisible(true);
    }
    hideFrom(i);
  }
  const fresh = () => newAreas.map(n => n.area.id); // the map outlines these in orange (src/minimap.js)
  return { update, areaOpened, reset, fresh };
})();
