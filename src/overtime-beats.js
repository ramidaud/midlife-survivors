// Overtime beats (Nov 9). Grok's spec: docs/handoffs/grok-overtime-plateau-spec.md, section 1. Data: src/data/overtime.js.
// Little retirement-age events that send you running around the office in Overtime runs (Delayed Retirement).
// This file has the scheduler plus the first event, Open Enrollment (and its smaller repeat, Annual Enrollment):
// "Your Medicare window is open. Please visit four different offices, in order." Ten seconds per office.
// Missing one just ends it ("You're on hold"). Nothing here can hurt you; the swarm you run through can.
window.OvertimeBeats = (() => {
  const B = () => window.OVERTIME_BEATS || {};
  let done = {}, cur = null, lastEndAt = -1e9, nextStartAt = null, chip = null, arrow = null, grid = null;

  const overtimeRun = () => typeof modeEndAge === "function" && modeEndAge() > 65.01 && typeof modeCfg === "function" && modeCfg().id === "midlife";
  const playing = () => typeof gameOver !== "undefined" && !gameOver && typeof titleOpen !== "undefined" && !titleOpen;
  const bossAlive = () => typeof bills !== "undefined" && bills.getChildren().some(b => b.active && b.isBoss);
  const coinFace = () => (window.getCoinYieldInfo ? getCoinYieldInfo().value : 1) || 1;

  // ---- UI (the same look as errands) ----
  function ui() {
    if (!document.getElementById("otb-css")) {
      const st = document.createElement("style"); st.id = "otb-css";
      st.textContent = `#otb-chip{position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--ms-nav-h,0px) + 128px);z-index:23;display:flex;align-items:center;gap:8px;max-width:min(92vw,440px);
  background:#F2D7A1;color:#171C35;border:2px solid #171C35;border-left:6px solid #BFA8CF;box-shadow:3px 3px 0 rgba(0,0,0,.45);padding:6px 10px;font:13px/1.25 'Atkinson Hyperlegible',sans-serif;pointer-events:none}
#otb-chip b{font:11px/1 Silkscreen,monospace;letter-spacing:.06em;white-space:nowrap}
#otb-chip .t{font:12px/1 Silkscreen,monospace;margin-left:auto;padding-left:6px;white-space:nowrap}
#otb-chip.low .t{color:#874C3B}
#otb-chip.hidden,#otb-arrow.hidden{display:none}
#otb-arrow{position:fixed;z-index:22;width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-bottom:24px solid #BFA8CF;filter:drop-shadow(2px 2px 0 rgba(0,0,0,.5));pointer-events:none;transform-origin:50% 60%}
@media (max-width:760px),(orientation:portrait){#otb-chip{top:calc(var(--ms-nav-h,0px) + 236px);left:8px;right:8px;transform:none;max-width:none;font-size:12px;padding:5px 8px}}`;
      document.head.appendChild(st);
    }
    if (!chip) { chip = document.createElement("div"); chip.id = "otb-chip"; chip.className = "hidden"; document.body.appendChild(chip); }
    if (!arrow) { arrow = document.createElement("div"); arrow.id = "otb-arrow"; arrow.className = "hidden"; document.body.appendChild(arrow); }
  }
  function hideUI() { if (chip) chip.className = "hidden"; if (arrow) arrow.className = "hidden"; }
  setInterval(() => { if (!playing()) hideUI(); }, 300);
  function aim(scene, x, y) {
    const cam = scene.cameras.main, v = cam.worldView;
    if (x > v.x + 30 && x < v.right - 30 && y > v.y + 30 && y < v.bottom - 30) { arrow.className = "hidden"; return; }
    const r = scene.game.canvas.getBoundingClientRect(), sx = r.width / cam.width, sy = r.height / cam.height;
    const cx = v.centerX, cy = v.centerY, ang = Math.atan2(y - cy, x - cx);
    const hw = v.width / 2 - 60 / cam.zoom, hh = v.height / 2 - 90 / cam.zoom;
    const t = Math.min(Math.abs(hw / Math.cos(ang)), Math.abs(hh / Math.sin(ang)));
    const px = r.left + ((cx + Math.cos(ang) * t) - v.x) * cam.zoom * sx, py = r.top + ((cy + Math.sin(ang) * t) - v.y) * cam.zoom * sy;
    arrow.className = ""; arrow.style.left = (px - 13) + "px"; arrow.style.top = (py - 12) + "px"; arrow.style.transform = `rotate(${ang + Math.PI / 2}rad)`;
  }

  // ---- where can a checkpoint go? A coarse grid of open, reachable floor (built once per event) ----
  function buildGrid(scene) {
    const L = window.START_AREA_LAYOUT; if (!L || !L.bounds) return null;
    const c = 64, Bd = L.bounds, W = Math.ceil(Bd.width / c), H = Math.ceil(Bd.height / c), open = new Uint8Array(W * H), dist = new Int32Array(W * H).fill(-1), room = new Array(W * H);
    const sa = scene.worldArt && scene.worldArt.startArea, pad = 36;
    const solids = [];
    (L.walls || []).forEach(w => solids.push([w.x, w.y, w.width, w.height]));
    if (window.propGroup) propGroup.getChildren().forEach(o => { if (o.active && o.body && o.body.enable) solids.push([o.body.x, o.body.y, o.body.width, o.body.height]); });
    (window.navExtraBlockers || []).forEach(r => solids.push([r.x, r.y, r.w, r.h]));
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const x = Bd.x + i * c + c / 2, y = Bd.y + j * c + c / 2, k = j * W + i;
      const fl = (L.floors || []).find(f => x > f.x && x < f.x + f.width && y > f.y && y < f.y + f.height);
      if (!fl || (sa && !sa.contains(x, y))) continue;
      if (solids.some(([sx, sy, sw, sh]) => x + pad > sx && x - pad < sx + sw && y + pad > sy && y - pad < sy + sh)) continue;
      open[k] = 1; room[k] = fl.district;
    }
    const si = Math.floor((player.x - Bd.x) / c), sj = Math.floor((player.y - Bd.y) / c), q = [];
    const near = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].map(([a, b]) => [si + a, sj + b]).find(([i, j]) => i >= 0 && j >= 0 && i < W && j < H && open[j * W + i]);
    if (!near) return null;
    dist[near[1] * W + near[0]] = 0; q.push(near);
    while (q.length) {
      const [i, j] = q.shift(), d = dist[j * W + i];
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ni = i + a, nj = j + b, nk = nj * W + ni; if (ni >= 0 && nj >= 0 && ni < W && nj < H && open[nk] && dist[nk] < 0) { dist[nk] = d + 1; q.push([ni, nj]); } }
    }
    return { c, Bd, W, H, open, dist, room };
  }
  function pickSpot(g, from, minPx, maxPx, notRoom) {
    const cands = [];
    for (let j = 1; j < g.H - 1; j++) for (let i = 1; i < g.W - 1; i++) {
      const k = j * g.W + i; if (g.dist[k] < 0) continue;
      let roomy = true; for (let b = -1; b <= 1 && roomy; b++) for (let a = -1; a <= 1; a++) if (!g.open[(j + b) * g.W + i + a]) { roomy = false; break; }
      if (!roomy) continue;
      const x = g.Bd.x + i * g.c + g.c / 2, y = g.Bd.y + j * g.c + g.c / 2, d = Math.hypot(x - from.x, y - from.y);
      if (d < minPx || d > maxPx) continue;
      cands.push({ x, y, room: g.room[k], other: g.room[k] !== notRoom });
    }
    const pref = cands.filter(s => s.other);
    const list = pref.length ? pref : cands;
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  }

  // ---- floor marker (the errand clipboard, in lavender) ----
  function marker(scene, x, y, label) {
    const ring = scene.add.circle(x, y, 30).setStrokeStyle(3, 0xBFA8CF, 0.95).setDepth(y / 10000 + 2);
    const pulse = scene.add.circle(x, y, 30).setStrokeStyle(3, 0xBFA8CF, 0.9).setDepth(y / 10000 + 2);
    scene.tweens.add({ targets: pulse, scale: 1.8, alpha: 0, duration: 1000, repeat: -1 });
    const tag = scene.add.text(x, y - 56, label, { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: "#BFA8CF", padding: { x: 5, y: 3 } }).setOrigin(0.5).setDepth(y / 10000 + 3.1);
    scene.tweens.add({ targets: tag, y: y - 66, duration: 650, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    const objs = [ring, pulse, tag];
    if (scene.textures.exists("errand_mark")) { const img = scene.add.image(x, y - 22, "errand_mark").setScale(2).setTint(0xE6DCF2).setDepth(y / 10000 + 3); scene.tweens.add({ targets: img, y: y - 32, duration: 650, yoyo: true, repeat: -1, ease: "Sine.InOut" }); objs.push(img); }
    return objs;
  }
  function chest(scene, x, y, key) {
    if (typeof chests === "undefined" || !chests) return;
    const ch = chests.create(x, y, "chest").setDepth(3);
    ch.bossKind = key; ch.readyAt = runElapsedMs + 800;
    ch.tag = scene.add.text(x, y, "BONUS", { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#EF9347", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5, 1.6).setDepth(4);
  }

  // ---- Open Enrollment ----
  function startEnrollment(scene, id) {
    const C = B()[id] || {}, base = C.like ? (B()[C.like] || {}) : {}, cfg = Object.assign({}, base, C);
    grid = buildGrid(scene);
    if (!grid) return false;
    cur = { id, cfg, leg: 0, labels: cfg.labels || ["PART A", "PART B", "PART C", "PART D"], spot: null, objs: [], until: 0, startAt: runElapsedMs + (cfg.leadMs || 1500), prevRoom: null };
    ui();
    if (window.flashBanner) flashBanner(cfg.bannerTitle || "OPEN ENROLLMENT", cfg.bannerSub || "Four offices. Ten seconds each. Go.", "alert");
    if (window.showLowerThird) showLowerThird("promo", cfg.badge || "MEDICARE", cfg.intro || "Your Medicare window is open. Visit each office in order. Follow the purple arrow.", 6000);
    if (typeof sfx === "function") sfx("levelUp", 0);
    if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + id + "-start");
    nextLeg(scene, true);
    return true;
  }
  function nextLeg(scene, first) {
    const c = cur.cfg;
    cur.objs.forEach(o => o.destroy()); cur.objs = [];
    const from = cur.spot || { x: player.x, y: player.y };
    const spot = pickSpot(grid, from, c.legMinPx || 450, c.legMaxPx || 800, cur.prevRoom) || pickSpot(grid, from, 300, 1100, null);
    if (!spot) return finish(scene, false);
    cur.spot = spot; cur.prevRoom = spot.room;
    cur.objs = marker(scene, spot.x, spot.y, cur.labels[cur.leg] || "OFFICE");
    cur.until = (first ? cur.startAt : runElapsedMs) + (c.legSec || 10) * 1000;
  }
  function reachLeg(scene) {
    const c = cur.cfg, s = cur.spot;
    // rewards for this office: coins (5x the coin face) and a little gem burst
    if (typeof spawnCoin === "function") spawnCoin(s.x, s.y + 10, c.legCoinsPerFace || 5);
    if (typeof gems !== "undefined") for (let i = 0; i < (c.legGems || 6); i++) gems.create(s.x + Phaser.Math.Between(-30, 30), s.y + Phaser.Math.Between(-24, 24), "gem").setDepth(3);
    if (window.burstConfetti) burstConfetti(scene, s.x, s.y - 20, 0xBFA8CF, 12);
    const pop = scene.add.text(s.x, s.y - 70, "✓ " + (cur.labels[cur.leg] || ""), { fontFamily: "Silkscreen, monospace", fontSize: "15px", color: "#FFF0CF", stroke: "#171C35", strokeThickness: 4 }).setOrigin(0.5).setDepth(50004);
    scene.tweens.add({ targets: pop, y: pop.y - 36, alpha: 0, duration: 1200, onComplete: () => pop.destroy() });
    if (typeof sfx === "function") sfx("pick", 0);
    cur.leg++;
    if (cur.leg >= (c.legs || 4)) return finish(scene, true);
    nextLeg(scene, false);
  }
  function finish(scene, allDone) {
    const c = cur.cfg, s = cur.spot || { x: player.x, y: player.y };
    cur.objs.forEach(o => o.destroy());
    if (allDone) {
      chest(scene, s.x, s.y, c.chestKey || "openEnrollment");
      if (typeof stats !== "undefined" && stats) stats.bossPts = (stats.bossPts || 0) + (c.scoreBonus || 2500);
      if (window.showLowerThird) showLowerThird("win", "ENROLLED ✓", c.doneLine || "Your card is in the mail. +2,500 score and a bonus chest.", 4500);
      if (window.achEvent) achEvent("otBeat", { id: cur.id });
      if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + cur.id + "-done");
    } else {
      if (window.showLowerThird) showLowerThird("tip", "ON HOLD", c.missLine || "You're on hold. We'll call you back.", 3500);
      if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + cur.id + "-miss");
    }
    hideUI(); lastEndAt = runElapsedMs; window.runOtBeats = (window.runOtBeats || "") + (window.runOtBeats ? "," : "") + (c.code || cur.id) + cur.leg;
    cur = null; grid = null;
  }
  function tickEnrollment(scene) {
    const c = cur.cfg, s = cur.spot;
    const waiting = runElapsedMs < cur.startAt, left = Math.max(0, cur.until - runElapsedMs);
    chip.className = left < 4000 && !waiting ? "low" : "";
    { const e = document.getElementById("errand-chip"); chip.style.marginTop = e && !e.classList.contains("hidden") ? "56px" : "0"; } // never on top of an errand
    chip.innerHTML = `<b>☐ ${c.chipTitle || "OPEN ENROLLMENT"}</b><span>${cur.labels[cur.leg]} · ${cur.leg + 1}/${c.legs || 4}</span><span class="t">${waiting ? "GET READY" : Math.ceil(left / 1000) + "s"}</span>`;
    aim(scene, s.x, s.y);
    if (!waiting && Math.hypot(player.x - s.x, player.y - s.y) < (c.reachPx || 80)) return reachLeg(scene);
    if (!waiting && left <= 0) return finish(scene, false);
  }

  // ---- the schedule ----
  const RUNNERS = { openEnrollment: startEnrollment, annualEnrollment: startEnrollment };
  function update(scene) {
    const S = B();
    if (!S.on || typeof player === "undefined" || !player || !player.active) return;
    if (!playing()) { hideUI(); return; }
    if (cur) {
      const busy = (typeof levelUpOpen !== "undefined" && levelUpOpen) || (typeof paused !== "undefined" && paused);
      if (busy) return;
      return tickEnrollment(scene);
    }
    if (S.needsOvertime && !overtimeRun()) return;
    const watch = window.GoldWatch && GoldWatch.arrivalAge ? GoldWatch.arrivalAge() : 999;
    for (const e of S.schedule || []) {
      const id = e.id; if (!id || done[id] || !RUNNERS[id]) continue;
      if (currentAge < e.age) continue;
      if (watch - currentAge < (e.minYearsBeforeWatch ?? 1)) { done[id] = "skipped"; continue; }
      if (currentAge > e.age + (S.waitForBossYears ?? 1)) { done[id] = "skipped"; continue; }
      if (bossAlive() || (typeof levelUpOpen !== "undefined" && levelUpOpen) || window.minimapOpen) return; // wait for the boss (up to a year)
      done[id] = "started";
      if (!RUNNERS[id](scene, id)) done[id] = "failed";
      return;
    }
  }
  return {
    update,
    reset: () => { if (cur) cur.objs.forEach(o => o.destroy()); done = {}; cur = null; lastEndAt = -1e9; grid = null; hideUI(); window.runOtBeats = ""; },
    // swarm set pieces wait while an event runs, and for a few seconds either side
    holdEvents: () => !!cur || runElapsedMs - lastEndAt < (B().holdSwarmEventsMs || 10000),
    // Open Enrollment's hold music: some regular spawns become Spam Likely calls
    spamSwap: () => !!(cur && cur.cfg.spamSwapFrac && Math.random() < cur.cfg.spamSwapFrac),
    active: () => cur && cur.id,
    spot: () => cur && cur.spot && { x: cur.spot.x, y: cur.spot.y, leg: cur.leg, waiting: runElapsedMs < cur.startAt },
    debugStart: (scene, id) => { done[id] = "started"; return RUNNERS[id] ? RUNNERS[id](scene, id) : false; }
  };
})();
