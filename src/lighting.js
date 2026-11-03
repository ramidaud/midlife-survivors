// Lighting (Nov 3): darkness overlay with light pools cut out of it, plus additive colored glows.
// Settings: src/data/lighting.js. Light anchors: START_AREA_LAYOUT.lights (src/data/start-area.js).
window.Lighting = (() => {
  let scene = null, refs = null, rt = null, brush = null, lights = [], tick = 0, floors = [], mood = 1, nextSputter = 0;
  const kindOf = (L, k) => (L.extraKinds || {})[k] || {};
  const strengthOf = (L, k) => (L.lightStrength || {})[k] || kindOf(L, k).strength || 0.8;
  const glowOf = (L, k) => (L.glow || {})[k] || kindOf(L, k).glow || 0.2;
  const flickerOf = (L, k) => (L.flicker || {})[k] || kindOf(L, k).flicker || 0;
  // Hand-placed anchors plus a light for every glowing prop (lamps, vending machines, street lights...)
  function allAnchors(L) {
    const out = (START_AREA_LAYOUT.lights || []).slice(), skip = L.propLightSkip || 70, map = L.propLights || {};
    (START_AREA_LAYOUT.placements || []).forEach(p => {
      const d = map[p.prop]; if (!d) return;
      const x = p.x, y = p.y + (d.dy || 0);
      if (out.some(l => Math.abs(l.x - x) < skip && Math.abs(l.y - y) < skip)) return;
      out.push({ x, y, r: d.r, color: d.color, kind: d.kind });
    });
    return out;
  }
  function roomAt(x, y) {
    for (const f of floors) if (x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height) return f.district;
    return null;
  }
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
    lights = allAnchors(L).map(l => {
      const size = l.r * 2 * (L.radiusMult || 1.6);
      const glow = sc.add.image(l.x, l.y, "ms_light").setBlendMode(Phaser.BlendModes.ADD).setTint(l.color)
        .setAlpha(glowOf(L, l.kind)).setDisplaySize(size, size * 0.85).setDepth(glowDepth);
      return { x: l.x, y: l.y, size, kind: l.kind, glow, base: glow.alpha, seed: Math.random() * 6.28, sputter: 0 };
    });
    floors = (START_AREA_LAYOUT.floors || []).filter(f => f.district);
    mood = 1; nextSputter = 0;
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
    const p = refs.player;
    const room = p && p.active ? roomAt(p.x, p.y) : null;
    const want = (room && L.roomMood && L.roomMood[room]) || 1;
    mood += (want - mood) * (L.moodEase || 0.04);
    rt.fill(L.darkness || 0x0a0e20, Math.min(0.92, curve(L.darkByAge, refs.age()) * mood));
    // A meeting-room panel sputters now and then
    const sp = L.ceilingSputter;
    if (sp && time > nextSputter) {
      if (nextSputter) { const c = lights.filter(l => l.kind === "ceiling" && l.x > v.x && l.x < v.right && l.y > v.y && l.y < v.bottom); if (c.length) c[Math.floor(Math.random() * c.length)].sputter = time + sp.length; }
      nextSputter = time + sp.every[0] + Math.random() * (sp.every[1] - sp.every[0]);
    }
    const ox = v.x - 1, oy = v.y - 1, pad = 220;
    tick++;
    for (const l of lights) {
      if (l.x < v.x - pad || l.x > v.right + pad || l.y < v.y - pad || l.y > v.bottom + pad) continue;
      let k = 1;
      if (l.sputter > time) { k = Math.sin(time / 23) > 0.2 ? 0.25 : 1; l.glow.setAlpha(l.base * k); }
      else if (l.sputter) { l.sputter = 0; l.glow.setAlpha(l.base); }
      cut(l.x - ox, l.y - oy, l.size, strengthOf(L, l.kind) * k);
      const fl = flickerOf(L, l.kind);
      if (fl && k === 1 && tick % 6 === 0) l.glow.setAlpha(Math.max(0, l.base + Math.sin(time / 140 + l.seed) * fl));
    }
    const ch = refs.chests && refs.chests();
    if (ch && ch.countActive()) ch.getChildren().forEach(c => { if (c.active) cut(c.x - ox, c.y - oy, L.chestRadius * 2, 0.9); });
    if (p && p.active) cut(p.x - ox, p.y - oy, L.playerRadius * 2, L.playerStrength);
  }
  function destroy() {
    if (scene) scene.events.off("postupdate", update);
    lights.forEach(l => l.glow && l.glow.destroy()); lights = [];
    if (rt) rt.destroy(); rt = null;
    if (brush) brush.destroy(); brush = null;
    scene = null; refs = null;
  }
  return { init, destroy, count: () => lights.length, room: () => { const p = refs && refs.player; return p ? roomAt(p.x, p.y) : null; }, mood: () => mood };
})();
