// The Reorg (Nov 9). Grok's spec: docs/handoffs/grok-office-bosses-spec.md, section 3. Numbers: src/data/bosses.js.
// He brings his own rolling Hot Desks (and leaves the office's desks alone). Two attacks:
//  - Restructure: ghost outlines and arrows show where 2 or 3 desks will slide, then they roll there. A desk never
//    lands on you, never leaves a gap you could get wedged in, and never boxes you in (we check you can still reach
//    two edges of the screen first). If you step into a desk's path, it stops short. Desks never hurt.
//  - New Org Chart: for a few seconds every new enemy comes from one corner (below half health: one edge, then the
//    opposite one). Arrows on the screen edge show where, ahead of time.
// While he works the whiteboard he stands still: that's your window. When he's beaten, the desks roll away.
window.Reorg = (() => {
  const T = () => window.BOSS_ATTACK_TUNING || {};
  const D = () => (window.BOSS_ATTACKS && BOSS_ATTACKS.theReorg) || {};
  const reduceMotion = () => !!(window.reduceFlashing && reduceFlashing()); // Settings > Reduce flashing, or the device setting
  let spawnPlan = null, edgeEls = [];

  function scaling() {
    const t = T(), years = Math.max(0, currentAge - (t.ageRefYear || 40)), tax = (typeof runTaxBracket !== "undefined" ? runTaxBracket : 0) || 0;
    return { tele: (base, floor) => Math.max(floor, base - years * (t.telegraphAgeCutPerYear || 0) - tax * (t.telegraphTaxCutPerBracket || 0)) };
  }
  const onScreen = (scene, b) => { const v = scene.cameras.main.worldView, m = T().onScreenMargin || 40; return b.x > v.x - m && b.x < v.right + m && b.y > v.y - m && b.y < v.bottom + m; };
  const pbox = () => { const b = player.body; return b ? { x: b.x, y: b.y, w: b.width, h: b.height } : { x: player.x - 24, y: player.y - 26, w: 48, h: 52 }; };
  const hit = (a, b, pad = 0) => a.x - pad < b.x + b.w && a.x + a.w + pad > b.x && a.y - pad < b.y + b.h && a.y + a.h + pad > b.y;

  // ---- solid things the desks must respect ----
  function solids(scene, except) {
    const out = [], L = window.START_AREA_LAYOUT;
    if (window.propGroup) propGroup.getChildren().forEach(o => { if (o !== except && o.active && o.body && o.body.enable) out.push({ x: o.body.x, y: o.body.y, w: o.body.width, h: o.body.height }); });
    if (L && L.walls) L.walls.forEach(w => out.push({ x: w.x, y: w.y, w: w.width, h: w.height }));
    (window.navExtraBlockers || []).forEach(r => out.push({ x: r.x, y: r.y, w: r.w, h: r.h }));
    return out;
  }
  function onFloor(scene, r) {
    const sa = scene.worldArt && scene.worldArt.startArea;
    if (!sa) return true;
    return sa.contains(r.x + 2, r.y + 2) && sa.contains(r.x + r.w - 2, r.y + 2) && sa.contains(r.x + 2, r.y + r.h - 2) && sa.contains(r.x + r.w - 2, r.y + r.h - 2);
  }
  function gateClear(r, px) { return !(window.START_AREA_GATES || []).some(g => g.rect && hit(r, { x: g.rect.x, y: g.rect.y, w: g.rect.w, h: g.rect.h }, px)); }
  // Either flush against something (0 to 2 px) or at least minGap away. Never a 3 to 95 px pinch.
  function gapOk(r, list, minGap) {
    for (const s of list) {
      if (hit(r, s)) return false;
      if (hit(r, s, minGap)) { // close: only allowed if it's touching (flush)
        const dx = Math.max(s.x - (r.x + r.w), r.x - (s.x + s.w)), dy = Math.max(s.y - (r.y + r.h), r.y - (s.y + s.h));
        const gap = Math.max(dx, dy);
        if (gap > 2) return false;
      }
    }
    return true;
  }
  // Can the player still reach at least two edges of the screen through a corridor at least 2 cells wide?
  function notBoxedIn(scene, extra) {
    const v = scene.cameras.main.worldView, c = 32, W = Math.ceil(v.width / c), H = Math.ceil(v.height / c);
    const block = new Uint8Array(W * H), list = solids(scene).concat(extra);
    const sa = scene.worldArt && scene.worldArt.startArea;
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const cx = v.x + i * c + c / 2, cy = v.y + j * c + c / 2;
      if (sa && !sa.contains(cx, cy)) { block[j * W + i] = 1; continue; }
      const cell = { x: v.x + i * c, y: v.y + j * c, w: c, h: c };
      if (list.some(s => hit(cell, s))) block[j * W + i] = 1;
    }
    // a 2-cell-wide corridor: a cell is walkable only if it and its right and down neighbours are open
    const open = (i, j) => i >= 0 && j >= 0 && i < W - 1 && j < H - 1 && !block[j * W + i] && !block[j * W + i + 1] && !block[(j + 1) * W + i] && !block[(j + 1) * W + i + 1];
    let si = Math.floor((player.x - v.x) / c), sj = Math.floor((player.y - v.y) / c);
    if (!open(si, sj)) { const near = [[0, 0], [-1, 0], [0, -1], [-1, -1], [1, 0], [0, 1]].find(([a, b]) => open(si + a, sj + b)); if (!near) return false; si += near[0]; sj += near[1]; }
    const seen = new Uint8Array(W * H), q = [[si, sj]]; seen[sj * W + si] = 1;
    const edges = new Set();
    while (q.length) {
      const [i, j] = q.pop();
      if (i === 0) edges.add("L"); if (j === 0) edges.add("T"); if (i >= W - 2) edges.add("R"); if (j >= H - 2) edges.add("B");
      if (edges.size >= (D().restructure || {}).reachEdgesMin || edges.size >= 2) return true;
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = i + a, nj = j + b; if (open(ni, nj) && !seen[nj * W + ni]) { seen[nj * W + ni] = 1; q.push([ni, nj]); } }
    }
    return false;
  }

  // ---- Hot Desks ----
  function deskRect(x, y) { const H = D().hotDesks || {}, w = H.bodyW || 96, h = H.bodyH || 56; return { x: x - w / 2, y: y - h / 2, w, h }; }
  function makeDesk(scene, a, x, y) {
    const H = D().hotDesks || {};
    const has = scene.textures.exists("hot_desk");
    const d = has ? scene.physics.add.image(x, y - 4, "hot_desk", 0) : scene.physics.add.image(x, y, "__WHITE").setDisplaySize(H.bodyW || 96, H.bodyH || 56).setTint(0xD3B78D);
    window.propGroup.add(d);
    d.body.setImmovable(true); d.body.setAllowGravity && d.body.setAllowGravity(false);
    if (has) { d.setScale(1); d.body.setSize(H.bodyW || 96, H.bodyH || 56).setOffset(0, 8); }
    d.setDepth(4.5); d.hotDesk = true; d.setAlpha(0);
    scene.tweens.add({ targets: d, alpha: 1, duration: 300 });
    a.desks.push(d);
    return d;
  }
  function placeDesks(scene, a, n, now) {
    const H = D().hotDesks || {}, p = pbox(), tries = 40;
    for (let k = 0; k < n; k++) {
      for (let t = 0; t < tries; t++) {
        const ang = Math.random() * Math.PI * 2, dist = Phaser.Math.Between(H.placeMinPx || 180, H.placeMaxPx || 300);
        const x = Math.round(player.x + Math.cos(ang) * dist), y = Math.round(player.y + Math.sin(ang) * dist), r = deskRect(x, y);
        const others = solids(scene).concat(a.ghosts.map(g => g.r));
        if (!onFloor(scene, r) || !gateClear(r, 64) || hit(r, p, 24) || !gapOk(r, others, 96)) continue;
        if (!notBoxedIn(scene, a.ghosts.map(g => g.r).concat([r]))) continue;
        a.ghosts.push({ r, x, y, until: now + (H.placeTelegraphMs || 900) });
        break;
      }
    }
  }

  // ---- Restructure ----
  function planSlides(scene, a, moves) {
    const R = D().restructure || {}, plans = [], p = pbox();
    const pool = Phaser.Utils.Array.Shuffle(a.desks.filter(d => d.active).slice());
    for (const d of pool) {
      if (plans.length >= moves) break;
      for (let t = 0; t < (R.rerollTries || 3) * 4; t++) {
        const axis = Math.random() < 0.5 ? "x" : "y", sign = Math.random() < 0.5 ? -1 : 1, len = Phaser.Math.Between(R.slideMinPx || 128, R.slideMaxPx || 224);
        const tx = d.body.center.x + (axis === "x" ? sign * len : 0), ty = d.body.center.y + (axis === "y" ? sign * len : 0);
        const r = deskRect(tx, ty);
        const others = solids(scene, d).filter(s => !plans.some(pl => pl.d.body && s.x === pl.d.body.x && s.y === pl.d.body.y)).concat(plans.map(pl => pl.r));
        const v = scene.cameras.main.worldView, inView = r.x > v.x + 24 && r.y > v.y + 60 && r.x + r.w < v.right - 24 && r.y + r.h < v.bottom - 90; // you can see where it lands
        if (!inView || !onFloor(scene, r) || !gateClear(r, R.gateClearPx || 64) || hit(r, p, R.playerMarginPx || 24) || !gapOk(r, others, R.flushOrMinGapPx || 96)) continue;
        // the path itself must be clear of other solids (a desk slides, it doesn't teleport)
        const sweep = { x: Math.min(r.x, d.body.x), y: Math.min(r.y, d.body.y), w: Math.abs(r.x - d.body.x) + r.w, h: Math.abs(r.y - d.body.y) + r.h };
        if (solids(scene, d).some(s => hit(sweep, s))) continue;
        const moved = plans.map(pl => pl.r).concat([r]), stay = a.desks.filter(o => o.active && o !== d && !plans.some(pl => pl.d === o)).map(o => ({ x: o.body.x, y: o.body.y, w: o.body.width, h: o.body.height }));
        if (!notBoxedIn(scene, moved.concat(stay).filter(Boolean))) continue;
        plans.push({ d, r, tx, ty, sx: d.body.center.x, sy: d.body.center.y, axis, sign });
        break;
      }
    }
    return plans;
  }
  function drawGhost(g, r, k, now) { // dashed outline: furniture is about to move here
    const dash = 10, gap = 7, alpha = reduceMotion() ? 0.85 : 0.55 + 0.35 * Math.abs(Math.sin(now / 120));
    g.lineStyle(3, 0xF2D7A1, alpha);
    const edge = (x1, y1, x2, y2) => { const len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len; for (let s = 0; s < len; s += dash + gap) { const e = Math.min(len, s + dash); g.lineBetween(x1 + ux * s, y1 + uy * s, x1 + ux * e, y1 + uy * e); } };
    edge(r.x, r.y, r.x + r.w, r.y); edge(r.x + r.w, r.y, r.x + r.w, r.y + r.h); edge(r.x + r.w, r.y + r.h, r.x, r.y + r.h); edge(r.x, r.y + r.h, r.x, r.y);
    g.fillStyle(0xF2D7A1, 0.08 + 0.12 * k).fillRect(r.x, r.y, r.w, r.h);
  }
  function drawArrow(g, sx, sy, tx, ty) {
    g.lineStyle(5, 0xEF9347, 0.9).lineBetween(sx, sy, tx, ty);
    const ang = Math.atan2(ty - sy, tx - sx), h = 16;
    g.fillStyle(0xEF9347, 0.95).fillTriangle(tx, ty, tx - Math.cos(ang - 0.5) * h, ty - Math.sin(ang - 0.5) * h, tx - Math.cos(ang + 0.5) * h, ty - Math.sin(ang + 0.5) * h);
  }

  // ---- New Org Chart (spawn sides) ----
  function edgeMarkers(sides, on) {
    edgeEls.forEach(e => e.remove()); edgeEls = [];
    if (!on) return;
    if (!document.getElementById("reorg-css")) {
      const st = document.createElement("style"); st.id = "reorg-css";
      st.textContent = `.reorg-edge{position:fixed;z-index:21;pointer-events:none;display:flex;align-items:center;justify-content:center;gap:10px;font:12px/1 Silkscreen,monospace;color:#171C35}
.reorg-edge b{background:#EF9347;padding:5px 8px;border:2px solid #171C35;box-shadow:2px 2px 0 rgba(0,0,0,.45)}
.reorg-edge i{width:0;height:0;border:12px solid transparent}
.reorg-edge.T{top:calc(var(--ms-nav-h,0px) + var(--ms-hud-b,122px) + 12px);left:0;right:0}.reorg-edge.B{bottom:96px;left:0;right:0}
.reorg-edge.L{left:6px;top:0;bottom:0;flex-direction:column}.reorg-edge.R{right:6px;top:0;bottom:0;flex-direction:column}
.reorg-edge.T i{border-top-color:#EF9347;border-bottom:0}.reorg-edge.B i{border-bottom-color:#EF9347;border-top:0}
.reorg-edge.L i{border-left-color:#EF9347;border-right:0}.reorg-edge.R i{border-right-color:#EF9347;border-left:0}
@media (prefers-reduced-motion:no-preference){.reorg-edge i{animation:reorg-blink .5s steps(2) infinite}}@keyframes reorg-blink{50%{opacity:.35}}`;
      document.head.appendChild(st);
    }
    sides.forEach(s => { const el = document.createElement("div"); el.className = "reorg-edge " + s; el.innerHTML = "<i></i><b>NEW ORG CHART</b><i></i>"; document.body.appendChild(el); edgeEls.push(el); });
  }
  // Called from spawnBill: 0 top, 1 bottom, 2 left, 3 right. Returns null when there's no override.
  function spawnSide() {
    if (!spawnPlan || runElapsedMs < spawnPlan.from || runElapsedMs > spawnPlan.until) return null;
    const codes = { T: 0, B: 1, L: 2, R: 3 }, s = spawnPlan.sides;
    return codes[s[Math.floor(Math.random() * s.length)]];
  }

  // ---- the fight ----
  function update(scene, boss, player, now) {
    const P = D(), H = P.hotDesks || {}, R = P.restructure || {}, O = P.orgChart || {}, P2 = P.phase2 || {}, S = scaling();
    const a = boss._atk || (boss._atk = { state: "chase", nextAt: now + (P.firstAttackDelayMs || 2200), announced: false, desks: [], ghosts: [], plans: [], last: [] });
    if (!a.g || !a.g.active) a.g = scene.add.graphics().setDepth(20000);
    if (!a.hooked) { a.hooked = true; boss.once("destroy", () => cleanup(scene, a)); }
    const g = a.g; g.clear();
    const phase2 = boss.hpMax && boss.hp / boss.hpMax <= (P2.atHpFrac || 0.5);
    if (window.ArtSheets && !scene.textures.exists("hot_desk") && !a.loading) { a.loading = true; ArtSheets.load(scene, "hot_desk", "assets/stage/props/prop-hot-desk-v1.png", 96, 64); }

    // he rolls his desks in when he first shows up (and a 4th in phase 2)
    const want = phase2 ? (P2.hotDeskCount || 4) : (H.count || 3);
    if (onScreen(scene, boss) && a.desks.filter(d => d.active).length + a.ghosts.length < want && (!a.nextPlace || now >= a.nextPlace)) {
      a.nextPlace = now + 1500; placeDesks(scene, a, want - a.desks.filter(d => d.active).length - a.ghosts.length, now);
    }
    for (const gh of a.ghosts) { drawGhost(g, gh.r, 1 - Math.max(0, (gh.until - now) / (H.placeTelegraphMs || 900)), now); if (now >= gh.until) { gh.done = true; if (!hit(gh.r, pbox(), 8)) makeDesk(scene, a, gh.x, gh.y); } }
    a.ghosts = a.ghosts.filter(gh => !gh.done);

    // spawn-side plan running?
    if (spawnPlan && runElapsedMs > spawnPlan.until) { if (spawnPlan.hop) { spawnPlan = { sides: spawnPlan.hop, from: runElapsedMs + (O.markerLeadMs || 1200), until: runElapsedMs + (O.markerLeadMs || 1200) + (P2.orgChart && P2.orgChart.durationMs || 8000) / 2 }; edgeMarkers(spawnPlan.sides, true); } else { spawnPlan = null; edgeMarkers([], false); } }

    if (a.state === "chase") {
      boss.speed = ENEMIES.theReorg.speed;
      if (now < a.nextAt || !onScreen(scene, boss) || gameOver || a.desks.filter(d => d.active).length < 2) return false;
      // pick an attack: Restructure 60, New Org Chart 40, never the same one 3 times in a row
      const w = P.weights || { restructure: 60, orgChart: 40 };
      let pick = Math.random() * (w.restructure + w.orgChart) < w.restructure ? "restructure" : "orgChart";
      if (a.last.length >= 2 && a.last[0] === pick && a.last[1] === pick) pick = pick === "restructure" ? "orgChart" : "restructure";
      a.last.unshift(pick); a.last.length = 2;
      a.move = pick; a.state = "telegraph"; a.startedAt = now; boss.setVelocity(0, 0); boss.setTint(0xff6b7a);
      if (pick === "restructure") {
        a.plans = planSlides(scene, a, phase2 ? (P2.moves || 3) : (R.moves || 2));
        if (!a.plans.length) { a.state = "chase"; a.nextAt = now + 1500; boss.clearTint(); return false; } // nothing safe to move: try again soon
        a.until = now + S.tele(R.telegraphMs || 1000, T().minTelegraphMsArea || 750);
      } else {
        const corners = [["T", "L"], ["T", "R"], ["B", "L"], ["B", "R"]], edges = ["T", "B", "L", "R"], opp = { T: "B", B: "T", L: "R", R: "L" };
        const sides = phase2 ? [Phaser.Utils.Array.GetRandom(edges)] : Phaser.Utils.Array.GetRandom(corners);
        const lead = Math.max(T().minTelegraphMsEdgeMarker || 900, O.markerLeadMs || 1200), dur = phase2 ? (P2.orgChart && P2.orgChart.durationMs || 8000) / 2 : (O.durationMs || 6000);
        spawnPlan = { sides, from: runElapsedMs + lead, until: runElapsedMs + lead + dur, hop: phase2 ? [opp[sides[0]]] : null };
        edgeMarkers(sides, true);
        a.until = now + lead;
      }
      if (!a.announced) { a.announced = true; if (window.flashBanner) flashBanner(P.bannerTitle, P.bannerSub, "alert", { bossFirst: true }); }
      else if (P.memoLines && Math.random() < 0.6) say(scene, boss, Phaser.Utils.Array.GetRandom(P.memoLines));
      sfx("bossSpawn", 0);
    }
    if (a.state === "telegraph") {
      boss.setVelocity(0, 0);
      const k = Math.min(1, (now - a.startedAt) / Math.max(1, a.until - a.startedAt));
      if (a.move === "restructure") {
        for (const pl of a.plans) { drawGhost(g, pl.r, k, now); drawArrow(g, pl.sx, pl.sy, pl.tx, pl.ty); }
        if (window.BossArt && scene.textures.exists("bossmark_theReorg")) BossArt.marker(scene, boss, boss.x, boss.y - 110, 0, 0.6, 0.6, 0.5 + 0.4 * k);
      }
      if (now >= a.until) {
        if (window.BossArt) BossArt.hideMarker(boss);
        boss.clearTint(); a.state = "attack"; a.startedAt = now;
        if (a.move === "restructure") a.plans.forEach(pl => { pl.d.body.setImmovable(true); });
      }
      return true;
    }
    if (a.state === "attack") {
      boss.setVelocity(0, 0);
      if (a.move === "restructure") {
        const spd = R.slideSpeed || 240, dt = Math.min(0.05, (scene.game.loop.delta || 16) / 1000), p = pbox();
        let moving = false;
        for (const pl of a.plans) {
          if (pl.done || !pl.d.active) { pl.done = true; continue; }
          const b = pl.d.body, cx = b.center.x, cy = b.center.y, rem = pl.axis === "x" ? pl.tx - cx : pl.ty - cy;
          if (Math.abs(rem) < 1) { pl.done = true; b.setVelocity(0, 0); continue; }
          const step = Math.sign(rem) * Math.min(Math.abs(rem), spd * dt);
          const next = { x: b.x + (pl.axis === "x" ? step : 0), y: b.y + (pl.axis === "y" ? step : 0), w: b.width, h: b.height };
          if (hit(next, p, R.stopShortPx || 8)) { pl.done = true; b.setVelocity(0, 0); continue; } // you're in the way: it stops short
          pl.d.x += pl.axis === "x" ? step : 0; pl.d.y += pl.axis === "y" ? step : 0; b.updateFromGameObject ? b.updateFromGameObject() : b.reset(pl.d.x, pl.d.y);
          if (scene.textures.exists("hot_desk")) pl.d.setFrame(1);
          drawGhost(g, pl.r, 1, now);
          moving = true;
        }
        if (!moving || now - a.startedAt > 2500) {
          a.plans.forEach(pl => { if (pl.d.active) { pl.d.body.setVelocity(0, 0); if (scene.textures.exists("hot_desk")) pl.d.setFrame(0); } });
          if (window.NAV && NAV.invalidate) NAV.invalidate(); // enemies re-plan around the new layout right away
          a.state = "recover"; a.startedAt = now;
        }
        return true;
      }
      a.state = "recover"; a.startedAt = now; // the org chart runs on its own clock
      return true;
    }
    if (a.state === "recover") {
      if (now - a.startedAt > (P.recoverMs || 300)) { a.state = "chase"; a.nextAt = now + (P.cooldownMs || 5000); }
      return false;
    }
    return false;
  }
  function say(scene, boss, text) {
    const t = scene.add.text(boss.x, boss.y - 100, text, { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: "#FFF0CF", padding: { x: 6, y: 4 }, wordWrap: { width: 220 }, align: "center" }).setOrigin(0.5, 1).setDepth(50005);
    scene.tweens.add({ targets: t, alpha: 0, delay: 1800, duration: 400, onComplete: () => t.destroy() });
  }
  function cleanup(scene, a) {
    spawnPlan = null; edgeMarkers([], false);
    if (a.g) a.g.destroy();
    a.desks.forEach(d => { if (!d.active) return; d.body.enable = false; scene.tweens.add({ targets: d, alpha: 0, y: d.y + 20, duration: (D().hotDesks || {}).despawnFadeMs || 600, onComplete: () => d.destroy() }); });
    if (window.NAV && NAV.invalidate) NAV.invalidate();
  }
  return { update, spawnSide, reset: () => { spawnPlan = null; edgeMarkers([], false); } };
})();
