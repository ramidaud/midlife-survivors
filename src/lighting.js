// Lighting (Nov 3): darkness overlay with light pools cut out of it, plus additive colored glows.
// Settings: src/data/lighting.js. Light anchors: START_AREA_LAYOUT.lights (src/data/start-area.js).
window.Lighting = (() => {
  let scene = null, refs = null, rt = null, brush = null, lights = [], tick = 0;
  const C = () => window.LIGHTING || {};
  function curve(t, age) {
    if (!t || !t.length) return 0;
    if (age <= t[0][0]) return t[0][1];
    for (let i = 1; i < t.length; i++) if (age <= t[i][0]) { const [a0, v0] = t[i - 1], [a1, v1] = t[i]; return v0 + (v1 - v0) * (age - a0) / (a1 - a0); }
    return t[t.length - 1][1];
  }
  function makeTexture(sc) {
    if (sc.textures.exists("ms_light")) return;
    const s = 256, tex = sc.textures.createCanvas("ms_light", s, s), ctx = tex.getContext();
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, "rgba(255,255,255,0.8)");
    g.addColorStop(0.7, "rgba(255,255,255,0.3)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s); tex.refresh();
  }
  function init(sc, r) {
    destroy();
    const L = C(); if (!L.enabled || !window.START_AREA_LAYOUT) return;
    scene = sc; refs = r; makeTexture(sc);
    const glowDepth = 3.5; // above the floor and rugs, under people and enemies
    lights = (START_AREA_LAYOUT.lights || []).map(l => {
      const size = l.r * 2 * (L.radiusMult || 1.6);
      const glow = sc.add.image(l.x, l.y, "ms_light").setBlendMode(Phaser.BlendModes.ADD).setTint(l.color)
        .setAlpha((L.glow || {})[l.kind] || 0.2).setDisplaySize(size, size * 0.85).setDepth(glowDepth);
      return { x: l.x, y: l.y, size, kind: l.kind, glow, base: glow.alpha, seed: Math.random() * 6.28 };
    });
    const cam = sc.cameras.main;
    rt = sc.add.renderTexture(0, 0, Math.max(2, Math.ceil(cam.worldView.width || cam.width)), Math.max(2, Math.ceil(cam.worldView.height || cam.height)))
      .setOrigin(0, 0).setDepth(49000);  // over the whole world (props sort up to ~13000), under screen flashes (50000)
    brush = sc.make.image({ key: "ms_light", add: false });
    sc.events.on("postupdate", update);
    sc.events.once("shutdown", destroy);
  }
  function cut(x, y, size, strength) {
    brush.setDisplaySize(size, size * 0.85).setAlpha(strength);
    rt.erase(brush, x, y);
  }
  function update(time) {
    if (!rt || !refs) return;
    const L = C(), cam = scene.cameras.main, v = cam.worldView;
    if (!v.width || !v.height) return;
    const w = Math.ceil(v.width) + 2, h = Math.ceil(v.height) + 2;
    if (rt.width !== w || rt.height !== h) rt.resize(w, h);
    rt.setPosition(v.x - 1, v.y - 1);
    rt.clear();
    rt.fill(L.darkness || 0x0a0e20, curve(L.darkByAge, refs.age()));
    const ox = v.x - 1, oy = v.y - 1, pad = 220;
    tick++;
    for (const l of lights) {
      if (l.x < v.x - pad || l.x > v.right + pad || l.y < v.y - pad || l.y > v.bottom + pad) continue;
      cut(l.x - ox, l.y - oy, l.size, (L.lightStrength || {})[l.kind] || 0.8);
      const fl = (L.flicker || {})[l.kind];
      if (fl && tick % 6 === 0) l.glow.setAlpha(Math.max(0, l.base + Math.sin(time / 140 + l.seed) * fl));
    }
    const ch = refs.chests && refs.chests();
    if (ch && ch.countActive()) ch.getChildren().forEach(c => { if (c.active) cut(c.x - ox, c.y - oy, L.chestRadius * 2, 0.9); });
    const p = refs.player;
    if (p && p.active) cut(p.x - ox, p.y - oy, L.playerRadius * 2, L.playerStrength);
  }
  function destroy() {
    if (scene) scene.events.off("postupdate", update);
    lights.forEach(l => l.glow && l.glow.destroy()); lights = [];
    if (rt) rt.destroy(); rt = null;
    if (brush) brush.destroy(); brush = null;
    scene = null; refs = null;
  }
  return { init, destroy };
})();
