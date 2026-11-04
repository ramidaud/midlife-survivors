// Lighting (Nov 3): darkness overlay with light pools cut out of it, plus additive colored glows.
// Settings: src/data/lighting.js. Light anchors: START_AREA_LAYOUT.lights (src/data/start-area.js).
// Pass 3 (Nov 4): dynamic lights. Lighting.fx(name, x, y) makes a quick flash; Lighting.follow(obj, name)
// makes a light that sticks to an enemy or boss while it's alive. Both use presets in LIGHTING.dynamic.
// Speed (Fable review): the darkness is drawn at half resolution, all light cuts go out in one batched draw,
// off-screen glows are hidden, and nothing is redrawn while a menu has the game frozen.
window.Lighting = (() => {
  let scene = null, refs = null, rt = null, lights = [], tick = 0, floors = [], mood = 1, nextSputter = 0;
  let brushes = [], glowPool = [], flashes = [], followed = new Map(), lastKey = "", blackoutUntil = 0, blackoutLen = 0, blackedOut = false;
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
  const DY = () => C().dynamic || {};
  const now = () => (refs && refs.clock ? refs.clock() : 0); // game time: flashes pause with the game
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
  function frozen() {
    return (typeof levelUpOpen !== "undefined" && levelUpOpen) || (typeof paused !== "undefined" && paused) ||
      (typeof gameOver !== "undefined" && gameOver) || (typeof titleOpen !== "undefined" && titleOpen);
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
      return { x: l.x, y: l.y, size, kind: l.kind, glow, base: glow.alpha, seed: Math.random() * 6.28, sputter: 0, shown: true };
    });
    floors = (START_AREA_LAYOUT.floors || []).filter(f => f.district);
    mood = 1; nextSputter = 0; flashes = []; followed = new Map(); lastKey = "";
    rt = sc.add.renderTexture(0, 0, 2, 2).setOrigin(0, 0).setDepth(49000); // over the whole world, under screen flashes (50000)
    sc.events.on("postupdate", update);
    sc.events.once("shutdown", destroy);
  }

  // One batched erase per frame: each light borrows a brush from the pool.
  let used = 0, scale = 0.5, ox = 0, oy = 0;
  function cut(x, y, size, strength) {
    if (strength <= 0) return;
    let b = brushes[used];
    if (!b) { b = scene.make.image({ key: "ms_light", add: false }).setOrigin(0.5); brushes.push(b); }
    used++;
    b.setPosition((x - ox) * scale, (y - oy) * scale).setDisplaySize(size * scale, size * 0.85 * scale).setAlpha(Math.min(1, strength));
  }
  // Colored floor glow for dynamic lights, from a small reusable pool.
  let glowUsed = 0;
  function glowAt(x, y, size, color, alpha) {
    if (alpha <= 0) return;
    let g = glowPool[glowUsed];
    if (!g) { g = scene.add.image(0, 0, "ms_light").setBlendMode(Phaser.BlendModes.ADD).setDepth(3.6); glowPool.push(g); }
    glowUsed++;
    g.setVisible(true).setPosition(x, y).setDisplaySize(size, size * 0.85).setTint(color).setAlpha(Math.min(1, alpha));
  }

  // ---- Dynamic lights (pass 3) ----
  function fx(name, x, y, opt) {
    if (!scene || !rt) return;
    const P = (DY().flashes || {})[name]; if (!P) return;
    const o = Object.assign({}, P, opt || {});
    // r or r1 of 5 or less means "times the weapon's radius" (opt.scale), so the light matches the blast.
    if (o.scale) { if (P.r <= 5) o.r = P.r * o.scale; if (P.r1 && P.r1 <= 5) o.r1 = P.r1 * o.scale; }
    flashes.push({ x, y, r: o.r, r1: o.r1 || o.r, color: o.color, strength: o.strength, glow: o.glow, ms: o.ms || 250, t0: now(), follow: o.follow || null });
    const max = DY().maxFlashes || 12;
    while (flashes.length > max) flashes.shift();
  }
  function follow(obj, name, opt) {
    if (!scene || !rt || !obj) return;
    const P = (DY().follow || {})[name]; if (!P) return;
    followed.set(obj, Object.assign({ name, seed: Math.random() * 6.28 }, P, opt || {}));
  }
  function unfollow(obj) { followed.delete(obj); }
  // Power outage (the rack with the yellow note): near-total dark, red emergency light, then the lights stutter back.
  function blackout(ms) { blackoutLen = ms; blackoutUntil = now() + ms; }

  function drawDynamic(t, v) {
    // Quick flashes: fade out (and grow, if r1 is set) over their lifetime.
    flashes = flashes.filter(f => t - f.t0 < f.ms && t >= f.t0);
    for (const f of flashes) {
      const k = (t - f.t0) / f.ms, fade = 1 - k * k;
      if (f.follow && f.follow.active) { f.x = f.follow.x; f.y = f.follow.y; }
      const r = f.r + (f.r1 - f.r) * k, size = r * 2;
      cut(f.x, f.y, size, f.strength * fade);
      glowAt(f.x, f.y, size, f.color, f.glow * fade);
    }
    // Lights that follow enemies and bosses: only the closest few that are on screen.
    const p = refs.player, pad = 120, list = [];
    for (const [o, s] of followed) {
      if (!o.active) { followed.delete(o); continue; }
      if (o.x < v.x - pad || o.x > v.right + pad || o.y < v.y - pad || o.y > v.bottom + pad) continue;
      if (s.onlyTyping && !o.typing) continue;
      list.push([o, s, p ? (o.x - p.x) * (o.x - p.x) + (o.y - p.y) * (o.y - p.y) : 0]);
    }
    list.sort((a, b) => (b[1].name === "boss" || b[1].name === "goldWatch" || b[1].name === "headlights") - (a[1].name === "boss" || a[1].name === "goldWatch" || a[1].name === "headlights") || a[2] - b[2]);
    const max = DY().maxFollow || 10;
    for (const [o, s] of list.slice(0, max)) {
      let period = s.periodMs || 800;
      if (s.name === "goldWatch" && typeof modeEndAge === "function" && typeof currentAge !== "undefined") {
        period = 260 + Math.max(0, modeEndAge() - currentAge) * 520; // ticks faster as 65 gets closer
      }
      const b = s.pulse ? 1 - s.pulse * (0.5 + 0.5 * Math.sin(t / period * 6.283 + s.seed)) : 1;
      if (s.name === "headlights") {
        // Two lights ahead of the car, in the direction it's driving (or toward you if it's parked).
        const vx = o.body ? o.body.velocity.x : 0, vy = o.body ? o.body.velocity.y : 0;
        let ang = Math.hypot(vx, vy) > 25 ? Math.atan2(vy, vx) : (p ? Math.atan2(p.y - o.y, p.x - o.x) : 0);
        const cx = Math.cos(ang), cy = Math.sin(ang), px = -cy, py = cx;
        for (const side of [-1, 1]) {
          const hx = o.x + cx * s.ahead + px * s.spread * side, hy = o.y + cy * s.ahead + py * s.spread * side;
          cut(hx, hy, s.r * 2, s.strength); glowAt(hx, hy, s.r * 2, s.color, s.glow);
        }
        cut(o.x, o.y, 120, 0.35); // a little spill around the car itself
        continue;
      }
      const size = s.r * 2 * (o.eliteScale ? Math.min(1.6, o.eliteScale) : 1);
      cut(o.x, o.y, size, s.strength * b);
      glowAt(o.x, o.y, size, s.color, s.glow * b);
    }
  }

  function update(time) {
    if (!rt || !refs) return;
    const L = C(), cam = scene.cameras.main, v = cam.worldView;
    if (!v.width || !v.height) return;
    // While a menu has the game frozen and the camera hasn't moved, last frame's lighting is still right.
    const key = Math.round(v.x) + "," + Math.round(v.y) + "," + Math.round(v.width) + "," + Math.round(v.height);
    if (frozen() && key === lastKey) return;
    lastKey = key;
    scale = Math.max(0.25, Math.min(1, L.darkScale || 0.5));
    const w = Math.ceil((v.width + 2) * scale), h = Math.ceil((v.height + 2) * scale);
    if (rt.width !== w || rt.height !== h) rt.resize(w, h);
    rt.setScale(1 / scale);
    ox = v.x - 1; oy = v.y - 1;
    rt.setPosition(ox, oy);
    rt.clear();
    const p = refs.player;
    const room = p && p.active ? roomAt(p.x, p.y) : null;
    const want = (room && L.roomMood && L.roomMood[room]) || 1;
    mood += (want - mood) * (L.moodEase || 0.04);
    const tNow = now(), left = blackoutUntil - tNow;
    // Last 900 ms: the lights flicker back on, the way old fluorescents do.
    const out = left > 0 && !(left < 900 && Math.floor(left / 110) % 2 === 0);
    if (out !== blackedOut) { blackedOut = out; lights.forEach(l => { l.shown = !out; l.glow.setVisible(!out); }); }
    rt.fill(L.darkness || 0x0a0e20, out ? 0.9 : Math.min(0.92, curve(L.darkByAge, refs.age()) * mood));
    // A meeting-room panel sputters now and then
    const sp = L.ceilingSputter;
    if (sp && time > nextSputter) {
      if (nextSputter) { const c = lights.filter(l => l.kind === "ceiling" && l.x > v.x && l.x < v.right && l.y > v.y && l.y < v.bottom); if (c.length) c[Math.floor(Math.random() * c.length)].sputter = time + sp.length; }
      nextSputter = time + sp.every[0] + Math.random() * (sp.every[1] - sp.every[0]);
    }
    const pad = 220;
    tick++; used = 0; glowUsed = 0;
    for (const l of lights) {
      if (blackedOut) break; // the power is out: no lamps, no screens, no vending machines
      const inView = !(l.x < v.x - pad || l.x > v.right + pad || l.y < v.y - pad || l.y > v.bottom + pad);
      if (inView !== l.shown) { l.shown = inView; l.glow.setVisible(inView); } // glows off screen aren't drawn at all
      if (!inView) continue;
      let k = 1;
      if (l.sputter > time) { k = Math.sin(time / 23) > 0.2 ? 0.25 : 1; l.glow.setAlpha(l.base * k); }
      else if (l.sputter) { l.sputter = 0; l.glow.setAlpha(l.base); }
      cut(l.x, l.y, l.size, strengthOf(L, l.kind) * k);
      const fl = flickerOf(L, l.kind);
      if (fl && k === 1 && tick % 6 === 0) l.glow.setAlpha(Math.max(0, l.base + Math.sin(time / 140 + l.seed) * fl));
    }
    const ch = refs.chests && refs.chests();
    if (ch && ch.countActive()) ch.getChildren().forEach(c => { if (c.active) cut(c.x, c.y, L.chestRadius * 2, 0.9); });
    if (L.dynamic) drawDynamic(now(), v);
    if (blackedOut && p && p.active) {
      // Red emergency light that breathes around you
      const b = 0.75 + 0.25 * Math.sin(tNow / 180);
      cut(p.x, p.y, 320, 0.7 * b); glowAt(p.x, p.y, 380, 0xc45c4b, 0.95 * b); glowAt(p.x, p.y, 200, 0xef9347, 0.35 * b);
    } else if (p && p.active) cut(p.x, p.y, L.playerRadius * 2, L.playerStrength);
    if (used) rt.erase(brushes.slice(0, used));
    for (let i = glowUsed; i < glowPool.length; i++) if (glowPool[i].visible) glowPool[i].setVisible(false);
  }
  function destroy() {
    if (scene) scene.events.off("postupdate", update);
    lights.forEach(l => l.glow && l.glow.destroy()); lights = [];
    glowPool.forEach(g => g.destroy()); glowPool = [];
    brushes.forEach(b => b.destroy()); brushes = [];
    flashes = []; followed = new Map(); blackoutUntil = 0; blackedOut = false;
    if (rt) rt.destroy(); rt = null;
    scene = null; refs = null;
  }
  return { init, destroy, fx, follow, unfollow, blackout, isOut: () => blackedOut, count: () => lights.length, dynamicCount: () => flashes.length + followed.size,
    room: () => { const p = refs && refs.player; return p ? roomAt(p.x, p.y) : null; }, mood: () => mood };
})();
