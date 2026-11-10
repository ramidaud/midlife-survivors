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
      st.textContent = `#otb-chip{position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--ms-nav-h,0px) + var(--ms-hud-b,122px) + 28px);z-index:23;display:flex;align-items:center;gap:8px;max-width:min(92vw,440px);
  background:#F2D7A1;color:#171C35;border:2px solid #171C35;border-left:6px solid #BFA8CF;box-shadow:3px 3px 0 rgba(0,0,0,.45);padding:6px 10px;font:13px/1.25 'Atkinson Hyperlegible',sans-serif;pointer-events:none}
#otb-chip b{font:11px/1 Silkscreen,monospace;letter-spacing:.06em;white-space:nowrap}
#otb-chip .t{font:12px/1 Silkscreen,monospace;margin-left:auto;padding-left:6px;white-space:nowrap}
#otb-chip.low .t{color:#874C3B}
#otb-chip.hidden,#otb-arrow.hidden{display:none}
#otb-arrow{position:fixed;z-index:22;width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-bottom:24px solid #BFA8CF;filter:drop-shadow(2px 2px 0 rgba(0,0,0,.5));pointer-events:none;transform-origin:50% 60%}
@media (max-width:760px),(orientation:portrait){#otb-chip{top:calc(var(--ms-nav-h,0px) + var(--ms-mm-top,108px) + 178px);left:8px;right:8px;transform:none;max-width:none;font-size:12px;padding:5px 8px}}`;
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
    if (window.flashBanner) flashBanner(cfg.bannerTitle || "OPEN ENROLLMENT", cfg.bannerSub || "Four offices. Ten seconds each. Go.", "objective");
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

  // ---- Grandkids' Visit: "The grandkids stopped by the office. They want to play tag. You're it." ----
  const KID_TINTS = [0xffd6e0, 0xe6dcff, 0xd9f2e6, 0xfff0cf, 0xd6ecff];
  // ChatGPT's grandkid sheets (Nov 9): 56x60 cells, rows down/up/left/right, 8 frames each, drawn at 70% of TJ's height.
  const KID_SHEETS = ["grandkid-1-v1.png", "grandkid-2-v1.png", "grandkid-3-v1.png"];
  let kidsAsked = false;
  function preloadKids(scene) { if (window.ArtSheets) KID_SHEETS.forEach((f, i) => ArtSheets.load(scene, "grandkid_" + (i + 1), "assets/characters/" + f, 56, 60)); }
  function startGrandkids(scene, id) {
    const C = B()[id] || {}, base = C.like ? (B()[C.like] || {}) : {}, cfg = Object.assign({}, base, C);
    grid = buildGrid(scene); if (!grid) return false;
    if (window.Interns && Interns.preload) try { Interns.preload(scene); } catch (e) {}
    preloadKids(scene);
    cur = { id, cfg, kind: "kids", kids: [], tagged: 0, until: runElapsedMs + (cfg.leadMs || 1200) + (cfg.windowSec || 20) * 1000, spawnAt: runElapsedMs + (cfg.leadMs || 1200), spawned: false, objs: [] };
    ui();
    if (window.showLowerThird) showLowerThird("promo", "GRANDKIDS", cfg.intro || `The grandkids stopped by. Tag all ${cfg.kids || 3} before they get bored.`, 5000);
    if (window.flashBanner) flashBanner(cfg.bannerTitle || "GRANDKIDS' VISIT", cfg.bannerSub || "They want to play tag. You're it.", "objective");
    if (typeof sfx === "function") sfx("levelUp", 0);
    if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + id + "-start");
    return true;
  }
  function kidGoal(k) { // somewhere open, 260 to 420 px from you, preferably on the far side
    const c = cur.cfg, away = Math.atan2(k.o.y - player.y, k.o.x - player.x);
    for (let t = 0; t < 12; t++) {
      const ang = away + Phaser.Math.FloatBetween(-1.1, 1.1), d = Phaser.Math.Between(c.keepMinPx || 260, c.keepMaxPx || 420);
      const x = player.x + Math.cos(ang) * d, y = player.y + Math.sin(ang) * d;
      const i = Math.floor((x - grid.Bd.x) / grid.c), j = Math.floor((y - grid.Bd.y) / grid.c);
      if (i > 0 && j > 0 && i < grid.W && j < grid.H && grid.dist[j * grid.W + i] >= 0) return { x, y };
    }
    return pickSpot(grid, player, c.keepMinPx || 260, c.keepMaxPx || 420, null) || { x: player.x, y: player.y };
  }
  function spawnKids(scene) {
    const c = cur.cfg, n = c.kids || 3, real = ["grandkid_1", "grandkid_2", "grandkid_3"].filter(k => scene.textures.exists(k));
    const sheets = real.length ? real : ["intern2_tj", "intern2_derek"].filter(k => scene.textures.exists(k)); // tinted interns until the kids load
    for (let i = 0; i < n; i++) {
      const spot = pickSpot(grid, player, 380, 560, null); if (!spot) continue;
      const key = sheets.length ? sheets[i % sheets.length] : null;
      const o = key && real.length ? scene.physics.add.sprite(spot.x, spot.y, key, 0).setOrigin(0.5, 56 / 60)
              : key ? scene.physics.add.sprite(spot.x, spot.y, key, 0).setOrigin(0.5, 56 / 60).setScale(c.kidScale || 0.62).setTint(KID_TINTS[i % KID_TINTS.length])
                    : scene.physics.add.sprite(spot.x, spot.y, "__WHITE").setDisplaySize(16, 24).setTint(KID_TINTS[i % KID_TINTS.length]);
      o.setDepth(4.6); if (key) o.body.setSize(16, 12).setOffset(20, 44);
      if (window.propGroup) o.propCollider = scene.physics.add.collider(o, window.propGroup);
      const heart = scene.add.text(spot.x, spot.y - 52, "♥", { fontFamily: "Silkscreen, monospace", fontSize: "22px", color: "#F1B5BF", stroke: "#171C35", strokeThickness: 5 }).setOrigin(0.5).setDepth(50001);
      // a pink ring at their feet and a soft glow, so they read as "friend" even in a crowd (like the interns' green ring)
      const ring = scene.add.ellipse(spot.x, spot.y, 50, 20).setStrokeStyle(3, 0xF1B5BF, 1).setFillStyle(0xF1B5BF, 0.25).setDepth(4.5);
      scene.tweens.add({ targets: ring, scaleX: 1.2, scaleY: 1.2, alpha: 0.6, duration: 600, yoyo: true, repeat: -1, ease: "Sine.InOut" });
      if (window.Lighting && Lighting.follow) try { Lighting.follow(o, "elite", { color: 0xF1B5BF, r: 48, strength: 0.55, glow: 0.45 }); } catch (e) {}
      const k = { o, heart, ring, key, walked: 0, lastX: spot.x, lastY: spot.y, goal: null, phase: Math.random() * 6, stuck: 0 };
      k.goal = kidGoal(k);
      cur.kids.push(k);
      if (window.burstConfetti) burstConfetti(scene, spot.x, spot.y - 20, 0xF1B5BF, 8);
    }
    cur.spawned = true;
  }
  function tagKid(scene, k) {
    const c = cur.cfg, g = c.gifts || {}, roll = Math.random();
    let label;
    if (roll < 0.34) { if (typeof gems !== "undefined") for (let i = 0; i < (g.drawingGems || 6); i++) gems.create(k.o.x + Phaser.Math.Between(-24, 24), k.o.y + Phaser.Math.Between(-18, 18), "gem").setDepth(3); label = "A CRAYON DRAWING!"; }
    else if (roll < 0.67) { if (typeof healAmt === "function" && typeof hp !== "undefined") { hp = Math.min(stats.maxHp, hp + healAmt(g.cookieHeal || 3)); if (typeof drawHpBar === "function") drawHpBar(); } label = "A COOKIE! +HP"; }
    else { if (typeof spawnCoin === "function") spawnCoin(k.o.x, k.o.y + 8, g.coinPerFace || 4); label = "GRANDPA'S LUCKY COIN!"; }
    cur.tagged++;
    const t = scene.add.text(k.o.x, k.o.y - 60, "GOT YOU! " + label, { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: "#F1B5BF", padding: { x: 5, y: 3 } }).setOrigin(0.5).setDepth(50004);
    scene.tweens.add({ targets: t, y: t.y - 24, alpha: 0, delay: 700, duration: 600, onComplete: () => t.destroy() });
    if (window.burstConfetti) burstConfetti(scene, k.o.x, k.o.y - 20, 0xF1B5BF, 12);
    if (typeof sfx === "function") sfx("pick", 0);
    kidLeave(scene, k);
  }
  function kidLeave(scene, k, line) {
    k.gone = true; k.heart.destroy(); k.ring.destroy(); if (k.o.propCollider) k.o.propCollider.destroy();
    if (line) { const t = scene.add.text(k.o.x, k.o.y - 50, line, { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#FFF0CF", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(50004); scene.tweens.add({ targets: t, alpha: 0, delay: 900, duration: 500, onComplete: () => t.destroy() }); }
    k.o.body.enable = false;
    scene.tweens.add({ targets: k.o, alpha: 0, y: k.o.y - 10, duration: 700, onComplete: () => k.o.destroy() });
  }
  function tickKids(scene) {
    const c = cur.cfg, now = runElapsedMs;
    if (!cur.spawned) { if (now >= cur.spawnAt) spawnKids(scene); }
    const left = Math.max(0, cur.until - now), n = c.kids || 3;
    chip.className = left < 5000 && cur.spawned ? "low" : "";
    { const e = document.getElementById("errand-chip"); chip.style.marginTop = e && !e.classList.contains("hidden") ? "56px" : "0"; }
    chip.innerHTML = `<b>♥ GRANDKIDS</b><span>Tag them all · ${cur.tagged}/${n}</span><span class="t">${cur.spawned ? Math.ceil(left / 1000) + "s" : "HERE THEY COME"}</span>`;
    const spd = (c.speed || 150) * (typeof runSprint !== "undefined" && runSprint && window.SPRINT ? SPRINT.playerSpeedMult : 1);
    let nearest = null, nd = 1e9;
    for (const k of cur.kids) {
      if (k.gone || !k.o.active) continue;
      const o = k.o, dP = Math.hypot(o.x - player.x, o.y - player.y);
      if (dP < (c.tagPx || 44)) { tagKid(scene, k); continue; }
      if (dP < nd) { nd = dP; nearest = k; }
      // run toward a goal away from you, with a little wobble; pick a new goal when it's reached, blocked or you get close
      if (!k.goal || Math.hypot(o.x - k.goal.x, o.y - k.goal.y) < 30 || dP < 170 || k.stuck > 12) { k.goal = kidGoal(k); k.stuck = 0; }
      let ang = Math.atan2(k.goal.y - o.y, k.goal.x - o.x);
      ang += Math.sin(now / 1000 * Math.PI * 2 * (c.swayHz || 0.8) + k.phase) * 0.35;
      o.setVelocity(Math.cos(ang) * spd, Math.sin(ang) * spd);
      if (o.body.blocked && !o.body.blocked.none) k.stuck++;
      // walk animation (rows: 0 down, 1 up, 2 left, 3 right; 8 frames each)
      k.walked += Math.hypot(o.x - k.lastX, o.y - k.lastY); k.lastX = o.x; k.lastY = o.y;
      if (k.key) { const vx = o.body.velocity.x, vy = o.body.velocity.y, row = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 2 : 3) : (vy < 0 ? 1 : 0); o.setFrame(row * 8 + Math.floor(k.walked / 6) % 8); }
      k.heart.setPosition(o.x, o.y - 52 + Math.sin(now / 160 + k.phase) * 3); k.ring.setPosition(o.x, o.y + 2);
    }
    if (nearest) aim(scene, nearest.o.x, nearest.o.y); else arrow.className = "hidden";
    const all = cur.spawned && cur.tagged >= n;
    if (all || (cur.spawned && left <= 0) || (cur.spawned && !cur.kids.some(k => !k.gone))) finishKids(scene, all);
  }
  function finishKids(scene, all) {
    const c = cur.cfg;
    cur.kids.forEach(k => { if (!k.gone && k.o.active) kidLeave(scene, k, Phaser.Utils.Array.GetRandom(["SEE YOU AT THANKSGIVING!", "BYE GRANDPA!", "LOVE YOU! BYE!"])); });
    if (all) {
      chest(scene, player.x + 60, player.y, c.chestKey || "grandkids");
      if (typeof stats !== "undefined" && stats) stats.bossPts = (stats.bossPts || 0) + (c.scoreBonus || 2000);
      if (window.showLowerThird) showLowerThird("win", "BEST GRANDPARENT ✓", c.doneLine || "You tagged them all. +2,000 score and a bonus chest.", 4500);
      if (window.achEvent) achEvent("otBeat", { id: cur.id });
      if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + cur.id + "-done");
    } else {
      if (window.showLowerThird) showLowerThird("tip", "GRANDKIDS", c.missLine || "They had to go. See you at Thanksgiving!", 3500);
      if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + cur.id + "-miss");
    }
    hideUI(); lastEndAt = runElapsedMs; window.runOtBeats = (window.runOtBeats || "") + (window.runOtBeats ? "," : "") + (c.code || "GK") + cur.tagged;
    cur = null; grid = null;
  }

  // ---- the schedule ----

  // ---- Clean Out Your Desk: "Twenty-five years of desk. One cardboard box. Bargain hunters incoming." ----
  function preloadKeepsakes(scene) { if (window.ArtSheets) ArtSheets.load(scene, "keepsakes", "assets/ui/keepsakes-v1.png", 32, 32); }
  function keepsakeTex(scene) { // drawn-in-code stand-in if the sheet isn't there: a little cream box
    if (scene.textures.exists("keepsakes")) return "keepsakes";
    if (!scene.textures.exists("keepsake_box")) {
      const c = document.createElement("canvas"); c.width = 16; c.height = 16; const g = c.getContext("2d");
      g.fillStyle = "#171C35"; g.fillRect(1, 3, 14, 12); g.fillStyle = "#F2D7A1"; g.fillRect(2, 4, 12, 10); g.fillStyle = "#EF9347"; g.fillRect(2, 7, 12, 2);
      scene.textures.addCanvas("keepsake_box", c);
    }
    return "keepsake_box";
  }
  function startDesk(scene, id) {
    const C = B()[id] || {}, base = C.like ? (B()[C.like] || {}) : {}, cfg = Object.assign({}, base, C);
    grid = buildGrid(scene); if (!grid) return false;
    preloadKeepsakes(scene);
    const items = cfg.items || [], spots = [], tex = keepsakeTex(scene);
    const near = Math.min(window.innerWidth, window.innerHeight) < 600 ? 0.7 : 1; // phones see less floor: keep them closer
    for (let i = 0; i < items.length; i++) {
      let spot = null;
      for (let t = 0; t < 30 && !spot; t++) {
        const sp = pickSpot(grid, player, (cfg.minPx || 200) * near, (cfg.maxPx || 500) * near, null);
        if (sp && spots.every(o => Math.hypot(o.x - sp.x, o.y - sp.y) >= (cfg.gapPx || 96))) spot = sp;
      }
      if (!spot) spot = pickSpot(grid, player, 120, 700, null);
      if (spot) spots.push({ x: spot.x + Phaser.Math.Between(-12, 12), y: spot.y + Phaser.Math.Between(-12, 12), i });
    }
    if (spots.length < 4) return false;
    cur = { id, cfg, kind: "desk", items: [], packed: 0, sold: 0, landAt: runElapsedMs + (cfg.leadMs || 1200) + (cfg.flyMs || 1000), until: 0, nextHaggler: 0, hagglers: [], objs: [] };
    cur.until = null; cur.nextHaggler = Infinity;
    // the drawer bursts: each keepsake arcs out from you and lands on open floor
    const sx = player.x, sy = player.y, sc = (cfg.scale || 1.5) * (tex === "keepsakes" ? 1 : 2);
    spots.forEach((sp, n) => {
      const it = items[sp.i];
      const o = scene.add.image(sx, sy - 20, tex, tex === "keepsakes" ? sp.i : 0).setScale(sc * 0.6).setDepth(50002).setAlpha(0);
      const ring = scene.add.ellipse(sp.x, sp.y + 14, 44, 16).setStrokeStyle(2, 0xEF9347, 0.9).setFillStyle(0xEF9347, 0.18).setDepth(sp.y / 10000 + 2).setVisible(false);
      const k = { o, ring, x: sp.x, y: sp.y, name: it.name, landed: false, gone: false, frame: sp.i };
      cur.items.push(k);
      const delay = (cfg.leadMs || 1200) + n * 60, dur = (cfg.flyMs || 1000) - n * 60;
      scene.tweens.add({ targets: o, alpha: 1, delay: delay - 1, duration: 1 });
      scene.tweens.add({ targets: o, x: sp.x, scale: sc, delay, duration: dur, ease: "Linear" });
      scene.tweens.add({ targets: o, y: Math.min(sy, sp.y) - 110, delay, duration: dur * 0.45, ease: "Quad.Out",
        onComplete: () => scene.tweens.add({ targets: o, y: sp.y, duration: dur * 0.55, ease: "Bounce.Out", onComplete: () => {
          if (!cur || k.gone) return;
          k.landed = true; o.setDepth(sp.y / 10000 + 3); ring.setVisible(true);
          if (o.texture.key !== "keepsakes" && scene.textures.exists("keepsakes")) o.setTexture("keepsakes", sp.i).setScale(cfg.scale || 1.5); // the art arrived late
          if (cur.until == null) { cur.until = runElapsedMs + (cfg.windowSec || 15) * 1000; cur.nextHaggler = runElapsedMs + 800; } // the clock starts when the first one lands
          scene.tweens.add({ targets: o, y: sp.y - 6, duration: 600, yoyo: true, repeat: -1, ease: "Sine.InOut" });
          scene.tweens.add({ targets: ring, scaleX: 1.2, scaleY: 1.2, alpha: 0.6, duration: 600, yoyo: true, repeat: -1 });
        } }) });
      scene.tweens.add({ targets: o, angle: Phaser.Math.Between(-360, 360), delay, duration: dur * 0.6, onComplete: () => o.setAngle(0) });
    });
    if (window.burstConfetti) scene.time.delayedCall(cfg.leadMs || 1200, () => burstConfetti(scene, player.x, player.y - 20, 0xF2D7A1, 16));
    ui();
    if (window.flashBanner) flashBanner(cfg.bannerTitle || "DOWNSIZING", cfg.bannerSub || "Pack your keepsakes before the bargain hunters do.", "objective");
    if (window.showLowerThird) showLowerThird("promo", "DOWNSIZING", cfg.intro || "Walk over your keepsakes to pack them.", 6000);
    if (typeof sfx === "function") sfx("levelUp", 0);
    if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + id + "-start");
    return true;
  }
  function liveItems() { return cur && cur.items ? cur.items.filter(k => !k.gone) : []; }
  function removeItem(scene, k, packed) {
    k.gone = true; scene.tweens.killTweensOf(k.o); scene.tweens.killTweensOf(k.ring); k.ring.destroy();
    if (packed) scene.tweens.add({ targets: k.o, x: player.x, y: player.y - 20, scale: 0.3, alpha: 0, duration: 260, onComplete: () => k.o.destroy() });
    else scene.tweens.add({ targets: k.o, y: k.o.y - 30, alpha: 0, duration: 500, onComplete: () => k.o.destroy() });
  }
  function packItem(scene, k) {
    const c = cur.cfg;
    removeItem(scene, k, true); k.packedFlag = true; cur.packed++;
    if (typeof gems !== "undefined") for (let i = 0; i < (c.perItemGems || 3); i++) gems.create(k.x + Phaser.Math.Between(-20, 20), k.y + Phaser.Math.Between(-16, 16), "gem").setDepth(3);
    if (typeof spawnCoin === "function") spawnCoin(k.x, k.y + 10, c.perItemCoinFace || 1);
    const t = scene.add.text(k.x, k.y - 40, "PACKED: " + k.name, { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 5, y: 3 } }).setOrigin(0.5).setDepth(50004);
    scene.tweens.add({ targets: t, y: t.y - 22, alpha: 0, delay: 600, duration: 500, onComplete: () => t.destroy() });
    if (typeof sfx === "function") sfx("pick", 0);
  }
  function sellItem(scene, k, h) {
    const c = cur.cfg;
    removeItem(scene, k, false); cur.sold++;
    if (typeof spawnCoin === "function") spawnCoin(k.x, k.y + 8, 1);
    const t = scene.add.text(k.x, k.y - 36, Phaser.Utils.Array.GetRandom(c.soldLines || ["SOLD! 50¢"]), { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#FFF0CF", backgroundColor: "#C45C4B", padding: { x: 5, y: 3 } }).setOrigin(0.5).setDepth(50004).setAngle(-6);
    scene.tweens.add({ targets: t, y: t.y - 20, alpha: 0, delay: 700, duration: 500, onComplete: () => t.destroy() });
    hagglerLeave(scene, h);
  }
  function hagglerLeave(scene, h) {
    if (!h || !h.active) return;
    if (window.burstConfetti) burstConfetti(scene, h.x, h.y, 0xF2D7A1, 6);
    if (h.tag) h.tag.destroy(); h.destroy();
  }
  function spawnHaggler(scene) {
    const v = scene.cameras.main.worldView, side = Phaser.Math.Between(0, 3), m = 30;
    const x = side === 0 ? v.x - m : side === 1 ? v.right + m : Phaser.Math.Between(v.x, v.right);
    const y = side === 2 ? v.y - m : side === 3 ? v.bottom + m : Phaser.Math.Between(v.y, v.bottom);
    const e = typeof createEnemy === "function" ? createEnemy(scene, "haggler", x, y) : null;
    if (!e) return;
    e.haggling = true; cur.hagglers.push(e);
    if (e.tag) e.tag.setText("50¢").setColor("#F2D7A1");
  }
  // Called from the main enemy loop for each haggler. Returns true when it steered it.
  function steerHaggler(scene, h) {
    if (!h.haggling) return false;
    if (!(h.artRecord && h.artRecord.shown)) { if (h.tintTopLeft !== 0xF2D7A1) h.setTint(0xF2D7A1); } // cream Late Fee until the real art shows
    else if (h.isTinted && !h.tintFill) h.clearTint();
    if (!cur || cur.kind !== "desk") { h.haggling = false; return false; } // event over: they wander off
    const live = liveItems().filter(k => k.landed);
    if (!live.length) { h.setVelocity(0, 0); return true; }
    let best = null, bd = 1e9;
    for (const k of live) { const d = Math.hypot(k.x - h.x, k.y - h.y); if (d < bd) { bd = d; best = k; } }
    if (bd < (cur.cfg.hagglerReachPx || 22)) { sellItem(scene, best, h); return true; }
    const a = Math.atan2(best.y - h.y, best.x - h.x);
    h.setVelocity(Math.cos(a) * h.speed, Math.sin(a) * h.speed); h.setFlipX(Math.cos(a) < 0);
    return true;
  }
  function tickDesk(scene) {
    const c = cur.cfg, now = runElapsedMs, n = cur.items.length;
    const flying = cur.until == null, left = flying ? 0 : Math.max(0, cur.until - now);
    if (flying && now > cur.landAt + 8000) cur.until = now; // safety: never wait forever
    chip.className = left < 4000 && !flying ? "low" : "";
    { const e = document.getElementById("errand-chip"); chip.style.marginTop = e && !e.classList.contains("hidden") ? "56px" : "0"; }
    chip.innerHTML = `<b>📦 DOWNSIZING</b><span>Packed ${cur.packed}/${n}${cur.sold ? ` · sold ${cur.sold}` : ""}</span><span class="t">${flying ? "INCOMING" : Math.ceil(left / 1000) + "s"}</span>`;
    let nearest = null, nd = 1e9;
    for (const k of cur.items) {
      if (k.gone || !k.landed) continue;
      const d = Math.hypot(player.x - k.x, player.y - k.y);
      if (d < (c.packPx || 40) + 16) { packItem(scene, k); continue; }
      if (d < nd) { nd = d; nearest = k; }
    }
    if (!flying && now >= cur.nextHaggler && liveItems().length) { cur.nextHaggler = now + (c.hagglerEveryMs || 2500); spawnHaggler(scene); }
    if (nearest) aim(scene, nearest.x, nearest.y); else arrow.className = "hidden";
    if (!flying && (left <= 0 || !liveItems().length)) finishDesk(scene);
  }
  function finishDesk(scene) {
    const c = cur.cfg, n = cur.items.length, all = cur.packed >= n;
    liveItems().forEach(k => removeItem(scene, k, false));
    cur.hagglers.forEach(h => hagglerLeave(scene, h));
    if (cur.packed >= (c.chestAt || 6)) chest(scene, player.x + 60, player.y, c.chestKey || "cleanOutDesk");
    if (all) {
      if (typeof stats !== "undefined" && stats) stats.bossPts = (stats.bossPts || 0) + (c.scoreBonus || 2000);
      if (window.showLowerThird) showLowerThird("win", "BOX PACKED ✓", c.doneLine || "Every last thing.", 4500);
      if (window.achEvent) achEvent("otBeat", { id: cur.id, all: true });
    } else if (cur.packed >= (c.chestAt || 6)) {
      if (window.showLowerThird) showLowerThird("win", "BOX PACKED", c.boxLine || "Packed enough to fill the box. Bonus chest!", 4000);
    } else if (window.showLowerThird) showLowerThird("tip", "YARD SALE", c.missLine || "The rest went in the yard sale.", 3800);
    if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + cur.id + (all ? "-done" : "-" + cur.packed));
    window.runKeepsakes = cur.items.filter(k => k.packedFlag).map(k => k.frame);
    hideUI(); lastEndAt = runElapsedMs; window.runOtBeats = (window.runOtBeats || "") + (window.runOtBeats ? "," : "") + (c.code || cur.id) + cur.packed;
    cur = null; grid = null;
  }


  // ---- The Reunion: "Your old coworkers are all here. You will have to say hi to every single one." ----
  function preloadReunion(scene) {
    if (!window.ArtSheets) return;
    ArtSheets.load(scene, "reunion_cast", "assets/characters/old-coworkers-reunion-v1.png", 48, 48);
    ArtSheets.load(scene, "otui", "assets/ui/overtime-ui-kit-v1.png", 32, 32); // frame 5 = the name tag
  }
  function startReunion(scene, id) {
    const C = B()[id] || {}, cfg = Object.assign({}, C);
    grid = buildGrid(scene); if (!grid) return false;
    preloadReunion(scene);
    const n = cfg.count || 8, v = scene.cameras.main.worldView, R = Math.min(cfg.maxRingPx || 420, Math.hypot(v.width, v.height) / 2 - (cfg.ringPad || 60)); // around the edge of the view
    const ppl = []; (cfg.people || []).forEach(p => (p.lines || []).forEach(l => ppl.push({ row: p.row, line: l })));
    Phaser.Utils.Array.Shuffle(ppl);
    cur = { id, cfg, kind: "reunion", folks: [], caught: 0, until: runElapsedMs + (cfg.leadMs || 1200) + (cfg.windowSec || 20) * 1000, spawnAt: runElapsedMs + (cfg.leadMs || 1200), spawned: false, objs: [], ppl, ring: R };
    ui();
    if (window.flashBanner) flashBanner(cfg.bannerTitle || "REUNION", cfg.bannerSub || "Say hi to everyone before they leave.", "objective");
    if (window.showLowerThird) showLowerThird("promo", "REUNION", cfg.intro || "Walk past each one to catch up.", 6000);
    if (typeof sfx === "function") sfx("levelUp", 0);
    if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + id + "-start");
    return true;
  }
  function openAt(x, y) {
    const i = Math.floor((x - grid.Bd.x) / grid.c), j = Math.floor((y - grid.Bd.y) / grid.c);
    return i > 0 && j > 0 && i < grid.W && j < grid.H && grid.dist[j * grid.W + i] >= 0;
  }
  function spawnFolks(scene) {
    const c = cur.cfg, n = Math.min(c.count || 8, cur.ppl.length), real = scene.textures.exists("reunion_cast"), tag = scene.textures.exists("otui");
    const a0 = Math.random() * Math.PI * 2;
    for (let k = 0; k < n; k++) {
      const ang = a0 + k / n * Math.PI * 2;
      let x = 0, y = 0, ok = false;
      for (let r = cur.ring; r >= 160 && !ok; r -= 40) { x = player.x + Math.cos(ang) * r; y = player.y + Math.sin(ang) * r; ok = openAt(x, y); }
      if (!ok) { const sp = pickSpot(grid, player, 200, 520, null); if (!sp) continue; x = sp.x; y = sp.y; }
      const who = cur.ppl[k];
      const o = real ? scene.physics.add.sprite(x, y, "reunion_cast", who.row * 10).setOrigin(0.5, 45 / 48).setScale(c.scale || 1.25)
                     : scene.physics.add.sprite(x, y, "__WHITE").setDisplaySize(18, 26).setTint(0x83A89A);
      o.setDepth(4.6); if (real) o.body.setSize(16, 10).setOffset(16, 34);
      if (window.propGroup) o.propCollider = scene.physics.add.collider(o, window.propGroup);
      const badge = tag ? scene.add.image(x, y - 50, "otui", 5).setScale(0.75).setDepth(50001)
                        : scene.add.text(x, y - 50, "HI!", { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 3, y: 2 } }).setOrigin(0.5).setDepth(50001);
      const ring = scene.add.ellipse(x, y, 46, 18).setStrokeStyle(3, 0x83A89A, 1).setFillStyle(0x83A89A, 0.22).setDepth(4.5);
      scene.tweens.add({ targets: ring, scaleX: 1.2, scaleY: 1.2, alpha: 0.6, duration: 650, yoyo: true, repeat: -1, ease: "Sine.InOut" });
      cur.folks.push({ o, badge, ring, row: who.row, line: who.line, real, phase: Math.random() * 6 });
      if (window.burstConfetti) burstConfetti(scene, x, y - 20, 0x83A89A, 6);
    }
    cur.spawned = true;
  }
  function folkLeave(scene, f, line, happy) {
    f.gone = true; f.badge.destroy(); f.ring.destroy(); if (f.o.propCollider) f.o.propCollider.destroy();
    f.o.body.enable = false;
    if (f.real) { let w = 0; f.waveT = scene.time.addEvent({ delay: 150, repeat: 7, callback: () => { if (f.o.active) f.o.setFrame(f.row * 10 + 8 + (w++ % 2)); } }); }
    if (line) {
      const t = scene.add.text(f.o.x, f.o.y - 58, line, { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: happy ? "#F2D7A1" : "#D3B78D", padding: { x: 5, y: 3 } }).setOrigin(0.5).setDepth(50004);
      { const vw = scene.cameras.main.worldView; t.x = Math.max(vw.x + t.width / 2 + 6, Math.min(t.x, vw.right - t.width / 2 - 6)); }
      scene.tweens.add({ targets: t, y: t.y - 18, alpha: 0, delay: 1100, duration: 500, onComplete: () => t.destroy() });
    }
    scene.tweens.add({ targets: f.o, alpha: 0, delay: 1200, duration: 600, onComplete: () => f.o.destroy() });
  }
  function catchUp(scene, f) {
    const c = cur.cfg;
    cur.caught++;
    if (typeof gems !== "undefined") for (let i = 0; i < (c.perPersonGems || 3); i++) gems.create(f.o.x + Phaser.Math.Between(-20, 20), f.o.y + Phaser.Math.Between(-16, 16), "gem").setDepth(3);
    if (window.burstConfetti) burstConfetti(scene, f.o.x, f.o.y - 20, 0xF2D7A1, 10);
    if (typeof sfx === "function") sfx("pick", 0);
    folkLeave(scene, f, f.line, true);
  }
  function tickReunion(scene) {
    const c = cur.cfg, now = runElapsedMs, n = c.count || 8;
    if (!cur.spawned) { if (now >= cur.spawnAt) spawnFolks(scene); }
    const left = Math.max(0, cur.until - now);
    chip.className = left < 5000 && cur.spawned ? "low" : "";
    { const e = document.getElementById("errand-chip"); chip.style.marginTop = e && !e.classList.contains("hidden") ? "56px" : "0"; }
    chip.innerHTML = `<b>📛 REUNION</b><span>Caught up · ${cur.caught}/${cur.folks.length || n}</span><span class="t">${cur.spawned ? Math.ceil(left / 1000) + "s" : "ARRIVING"}</span>`;
    let nearest = null, nd = 1e9;
    for (const f of cur.folks) {
      if (f.gone || !f.o.active) continue;
      const o = f.o, d = Math.hypot(o.x - player.x, o.y - player.y);
      if (d < (c.catchPx || 64)) { catchUp(scene, f); continue; }
      if (d < nd) { nd = d; nearest = f; }
      if (window.NAV && NAV.steer) NAV.steer(scene, o, player, c.speed || 60);
      else { const a = Math.atan2(player.y - o.y, player.x - o.x); o.setVelocity(Math.cos(a) * (c.speed || 60), Math.sin(a) * (c.speed || 60)); }
      if (f.real) { const vx = o.body.velocity.x; o.setFlipX(vx < 0); o.setFrame(f.row * 10 + Math.floor((now / 120 + f.phase)) % 8); }
      f.badge.setPosition(o.x, o.y - 50 + Math.sin(now / 200 + f.phase) * 2); f.ring.setPosition(o.x, o.y + 2);
    }
    if (nearest) aim(scene, nearest.o.x, nearest.o.y); else arrow.className = "hidden";
    const total = cur.folks.length;
    if (cur.spawned && (left <= 0 || !cur.folks.some(f => !f.gone))) finishReunion(scene, total && cur.caught >= total);
  }
  function finishReunion(scene, all) {
    const c = cur.cfg;
    cur.folks.forEach(f => { if (!f.gone && f.o.active) folkLeave(scene, f, Phaser.Utils.Array.GetRandom(c.leaveLines || ["We should get lunch sometime!"]), false); });
    if (cur.caught >= (c.chestAt || 6)) {
      chest(scene, player.x + 60, player.y, c.chestKey || "reunion");
      if (typeof stats !== "undefined" && stats) stats.bossPts = (stats.bossPts || 0) + (c.scoreBonus || 1500);
    }
    if (all) {
      if (window.showLowerThird) showLowerThird("win", "CAUGHT UP ✓", c.doneLine || "You caught up with everyone.", 4500);
      if (window.achEvent) achEvent("otBeat", { id: cur.id, all: true });
    } else if (cur.caught >= (c.chestAt || 6)) { if (window.showLowerThird) showLowerThird("win", "REUNION", c.someLine || "Good to see the old crew.", 4000); }
    else if (window.showLowerThird) showLowerThird("tip", "REUNION", c.missLine || "We should really get lunch sometime.", 3800);
    if (window.Telemetry && Telemetry.event) Telemetry.event("ot-" + cur.id + "-" + cur.caught);
    hideUI(); lastEndAt = runElapsedMs; window.runOtBeats = (window.runOtBeats || "") + (window.runOtBeats ? "," : "") + (c.code || cur.id) + cur.caught;
    cur = null; grid = null;
  }

  const RUNNERS = { openEnrollment: startEnrollment, annualEnrollment: startEnrollment, grandkids: startGrandkids, grandkids2: startGrandkids, cleanOutDesk: startDesk, reunion: startReunion };
  function update(scene) {
    const S = B();
    if (!S.on || typeof player === "undefined" || !player || !player.active) return;
    if (!playing()) { hideUI(); return; }
    if (!kidsAsked && typeof currentAge !== "undefined" && currentAge >= 60) { kidsAsked = true; preloadKids(scene); preloadKeepsakes(scene); preloadReunion(scene); } // load the grandkid art well before 66
    if (cur) {
      const busy = (typeof levelUpOpen !== "undefined" && levelUpOpen) || (typeof paused !== "undefined" && paused);
      if (busy) { hideUI(); return; } // the level-up menu sits on top; the chip comes back next frame
      return cur.kind === "kids" ? tickKids(scene) : cur.kind === "desk" ? tickDesk(scene) : cur.kind === "reunion" ? tickReunion(scene) : tickEnrollment(scene);
    }
    if (S.needsOvertime && !overtimeRun()) return;
    const watch = window.GoldWatch && GoldWatch.arrivalAge ? GoldWatch.arrivalAge() : 999;
    for (const e of S.schedule || []) {
      const id = e.id, key = e.key || id; if (!id || done[key] || !RUNNERS[id]) continue;
      if (currentAge < e.age) continue;
      if (e.unlessDone && done[e.unlessDone] === "started") { done[key] = "skipped"; continue; }
      if (e.onlyIfDone && done[e.onlyIfDone] !== "started") { done[key] = "skipped"; continue; }
      if (e.onlyIfWatchWithin && watch - currentAge >= e.onlyIfWatchWithin) { done[key] = "skipped"; continue; }
      if (watch - currentAge < (e.minYearsBeforeWatch ?? 1)) { done[key] = "skipped"; continue; }
      if (currentAge > e.age + (S.waitForBossYears ?? 1)) { done[key] = "skipped"; continue; }
      if (bossAlive() || (typeof levelUpOpen !== "undefined" && levelUpOpen) || window.minimapOpen) return; // wait for the boss (up to a year)
      done[key] = "started";
      if (!RUNNERS[id](scene, id)) done[key] = "failed";
      return;
    }
  }
  return {
    update,
    reset: () => { if (cur) { cur.objs.forEach(o => o.destroy()); (cur.kids || []).forEach(k => { if (k.o.active) k.o.destroy(); if (k.heart.active) k.heart.destroy(); if (k.ring.active) k.ring.destroy(); }); (cur.items || []).forEach(k => { if (k.o.active) k.o.destroy(); if (k.ring.active) k.ring.destroy(); }); (cur.folks || []).forEach(f => { if (f.o.active) f.o.destroy(); if (f.badge.active) f.badge.destroy(); if (f.ring.active) f.ring.destroy(); }); } done = {}; cur = null; lastEndAt = -1e9; grid = null; hideUI(); window.runOtBeats = ""; },
    // swarm set pieces wait while an event runs, and for a few seconds either side
    holdEvents: () => !!cur || runElapsedMs - lastEndAt < (B().holdSwarmEventsMs || 10000),
    // Open Enrollment's hold music: some regular spawns become Spam Likely calls
    spamSwap: () => !!(cur && cur.cfg.spamSwapFrac && Math.random() < cur.cfg.spamSwapFrac),
    active: () => cur && cur.id,
    steerHaggler,
    folks: () => cur && cur.folks && cur.folks.filter(f => !f.gone && f.o.active).map(f => ({ x: f.o.x, y: f.o.y })),
    reunion: () => cur && cur.kind === "reunion" && { caught: cur.caught, n: cur.folks.length, spawned: cur.spawned },
    items: () => cur && cur.items && cur.items.filter(k => !k.gone).map(k => ({ x: k.x, y: k.y, landed: k.landed })),
    desk: () => cur && cur.kind === "desk" && { packed: cur.packed, sold: cur.sold, hagglers: cur.hagglers.filter(h => h.active).length },
    kids: () => cur && cur.kids && cur.kids.filter(k => !k.gone && k.o.active).map(k => ({ x: k.o.x, y: k.o.y })),
    spot: () => cur && cur.spot && { x: cur.spot.x, y: cur.spot.y, leg: cur.leg, waiting: runElapsedMs < cur.startAt },
    debugStart: (scene, id) => { done[id] = "started"; return RUNNERS[id] ? RUNNERS[id](scene, id) : false; }
  };
})();
