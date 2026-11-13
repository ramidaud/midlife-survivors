// Locked out (Nov 9, Maple Hollow step 3a). You can't get into your own house: the spare key is hidden at one of
// several spots around the block, a different one each run. Walk over a spot to check it. Find the key, then walk
// to your front door: bonus chest, a heal and the achievement. Numbers and lines: MAPLE_HOLLOW.keyHunt.
window.KeyHunt = (() => {
  const K = () => (window.MAPLE_HOLLOW && MAPLE_HOLLOW.keyHunt) || {};
  let st = null, chip = null;
  const home = () => window.STAGE_ID === "home";
  const playing = () => typeof gameOver !== "undefined" && !gameOver && typeof titleOpen !== "undefined" && !titleOpen;

  function css() {
    if (document.getElementById("keyhunt-css")) return;
    const s = document.createElement("style"); s.id = "keyhunt-css";
    s.textContent = `#keyhunt-chip{position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--ms-nav-h,0px) + var(--ms-hud-b,122px) + 28px);z-index:23;display:flex;align-items:center;gap:8px;max-width:min(92vw,460px);
  background:#F2D7A1;color:#171C35;border:2px solid #171C35;border-left:6px solid #EF9347;box-shadow:3px 3px 0 rgba(0,0,0,.45);padding:6px 10px;font:13px/1.25 'Atkinson Hyperlegible',sans-serif;pointer-events:none}
#keyhunt-chip b{font:11px/1 Silkscreen,monospace;letter-spacing:.06em;white-space:nowrap}
#keyhunt-chip.hidden{display:none}
@media (max-width:760px),(orientation:portrait){#keyhunt-chip{top:calc(var(--ms-nav-h,0px) + var(--ms-mm-top,108px) + 178px);left:8px;right:8px;transform:none;max-width:none;font-size:12px;padding:5px 8px}}`;
    document.head.appendChild(s);
    chip = document.createElement("div"); chip.id = "keyhunt-chip"; chip.className = "hidden"; document.body.appendChild(chip);
  }
  setInterval(() => { if (chip && (!playing() || !home())) chip.className = "hidden"; }, 300);

  // placeholder art, drawn in code until ChatGPT's key-hunt props arrive (assets/stage/home/key-hunt-v1.png)
  // ChatGPT's props (Nov 9): assets/stage/home/key-hunt-v1.png, 32x32 cells
  const SHEET = { rock: 0, rockOpen: 1, mat: 2, pot: 3, mailbox: 5, key: 6 };
  function texF(scene, kind) { return scene.textures.exists("kh_sheet") && SHEET[kind] !== undefined ? ["kh_sheet", SHEET[kind]] : [tex(scene, kind), 0]; }
  function tex(scene, kind) {
    const key = "kh_" + kind; if (scene.textures.exists(key)) return key;
    const c = document.createElement("canvas"); c.width = 32; c.height = 32; const g = c.getContext("2d");
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    if (kind === "rock") { R(6, 14, 20, 12, "#171C35"); R(7, 15, 18, 10, "#526078"); R(9, 16, 10, 3, "#83A89A"); }
    else if (kind === "mat") { R(3, 18, 26, 10, "#171C35"); R(4, 19, 24, 8, "#C45C4B"); R(6, 21, 20, 1, "#F2D7A1"); R(6, 24, 20, 1, "#F2D7A1"); }
    else if (kind === "pot") { R(9, 14, 14, 14, "#171C35"); R(10, 15, 12, 12, "#C45C4B"); R(9, 12, 14, 3, "#EF9347"); R(14, 6, 4, 6, "#83A89A"); }
    else if (kind === "mailbox") { R(14, 16, 4, 14, "#171C35"); R(7, 7, 18, 11, "#171C35"); R(8, 8, 16, 9, "#526078"); R(23, 5, 3, 7, "#C45C4B"); }
    else if (kind === "key") { R(6, 12, 10, 10, "#171C35"); R(7, 13, 8, 8, "#E6BE58"); R(9, 15, 4, 4, "#171C35"); R(15, 16, 12, 3, "#171C35"); R(16, 16, 10, 2, "#E6BE58"); R(22, 18, 2, 3, "#E6BE58"); R(25, 18, 2, 4, "#E6BE58"); }
    scene.textures.addCanvas(key, c);
    return key;
  }

  // Nov 12 (Rami: "after returning from a saved state the house key mini game restarts"): the hunt is saved with the run.
  let pending = null;
  function save() {
    if (!st) return null;
    return { keyAt: st.keyAt, checked: st.spots.map(s => !!s.checked), hasKey: st.hasKey, open: st.open, entered: st.entered, fridgeUsed: st.fridgeUsed, fridgeAge: st.fridgeAge || 0 };
  }
  function restore(saved) { pending = saved && saved.keyAt != null ? saved : null; }
  function start(scene) {
    const C = K(), M = window.MAPLE_HOLLOW, R = M.rows, lotX = i => M.firstLotX + i * M.lotWidth;
    const front = row => row === "north" ? R.northHouseFront : R.southHouseFront;
    css();
    if (window.ArtSheets) ArtSheets.load(scene, "kh_sheet", "assets/stage/home/key-hunt-v1.png", 32, 32);
    const yh = M.yourHouse, door = { x: lotX(yh.lot) + (yh.doorDx != null ? yh.doorDx : -18), y: front(yh.row) + 18 }; // the steps under your front door
    const spots = (C.spots || []).map(([row, lot, dx, dy, kind]) => ({ x: lotX(lot) + dx, y: front(row) + dy, kind }));
    // the key is never in the spot closest to your door, so you have to look around a little
    const near = spots.reduce((b, s, i) => Math.hypot(s.x - door.x, s.y - door.y) < Math.hypot(spots[b].x - door.x, spots[b].y - door.y) ? i : b, 0);
    let keyAt = Math.floor(Math.random() * spots.length); if (keyAt === near) keyAt = (keyAt + 1) % spots.length;
    const P = pending; pending = null;
    if (P && P.keyAt < spots.length) keyAt = P.keyAt;
    st = { door, spots, keyAt, checked: 0, hasKey: false, open: false, objs: [], doorWarnAt: 0, inside: false, armed: true, fridgeUsed: false, entered: false };
    spots.forEach((s, i) => {
      const [tk, tf] = texF(scene, s.kind);
      s.img = scene.add.image(s.x, s.y, tk, tf).setOrigin(0.5, 1).setScale(1.5).setDepth(2.6);
      s.q = scene.add.text(s.x, s.y - 50, "?", { fontFamily: "Silkscreen, monospace", fontSize: "16px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 4, y: 1 } }).setOrigin(0.5).setDepth(50001);
      scene.tweens.add({ targets: s.q, y: s.y - 56, duration: 600, yoyo: true, repeat: -1, ease: "Sine.InOut" });
      st.objs.push(s.img, s.q);
    });
    st.doorMark = scene.add.ellipse(door.x, door.y, 60, 22).setStrokeStyle(3, 0xEF9347, 0.9).setFillStyle(0xEF9347, 0.15).setDepth(2.7);
    scene.tweens.add({ targets: st.doorMark, scaleX: 1.15, scaleY: 1.15, alpha: 0.6, duration: 700, yoyo: true, repeat: -1 });
    st.objs.push(st.doorMark);
    if (P) { // a resumed run: put the hunt back the way you left it. The bonus chest only ever comes once.
      st.spots.forEach((s, i) => { if ((P.checked || [])[i] || P.hasKey) { s.checked = i === keyAt || !!(P.checked || [])[i]; if (s.q && s.q.active) s.q.destroy(); if (s.checked && i !== keyAt) s.img.setAlpha(0.6); } });
      st.checked = (P.checked || []).filter(Boolean).length; st.hasKey = !!P.hasKey; st.fridgeUsed = !!P.fridgeUsed; st.fridgeAge = P.fridgeAge || 0; st.entered = !!P.entered;
      if (P.hasKey && st.spots[keyAt].kind === "rock" && scene.textures.exists("kh_sheet")) st.spots[keyAt].img.setTexture("kh_sheet", SHEET.rockOpen);
      if (P.open) { st.open = true; st.armed = true; st.doorMark.setStrokeStyle(3, 0x83A89A, 0.9).setFillStyle(0x83A89A, 0.2); if (window.MapleHollowDoor) MapleHollowDoor(true); }
      draw(); return;
    }
    if (window.showLowerThird) showLowerThird("promo", "LOCKED OUT", C.doorLine || "The spare key is around here somewhere.", 6000);
    draw();
  }
  function draw() {
    if (!chip || !st) return;
    const n = st.spots.length;
    chip.className = st.open ? "hidden" : "";
    chip.innerHTML = st.hasKey ? `<b>🔑 GOT THE KEY</b><span>Head to your front door (the orange ring).</span>`
      : `<b>🔑 LOCKED OUT</b><span>Find the spare key. Check the <b>?</b> spots · ${st.checked}/${n}</span>`;
  }
  function pop(scene, x, y, text, bg) {
    const t = scene.add.text(x, y - 46, text, { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#171C35", backgroundColor: bg || "#F2D7A1", padding: { x: 5, y: 3 } }).setOrigin(0.5).setDepth(50004);
    const v = scene.cameras.main.worldView; t.x = Math.max(v.x + t.width / 2 + 6, Math.min(t.x, v.right - t.width / 2 - 6));
    scene.tweens.add({ targets: t, y: t.y - 18, alpha: 0, delay: 1300, duration: 500, onComplete: () => t.destroy() });
  }
  function check(scene, i) {
    const C = K(), s = st.spots[i]; s.checked = true; st.checked++;
    s.q.destroy();
    if (i === st.keyAt) {
      st.hasKey = true;
      if (s.kind === "rock" && scene.textures.exists("kh_sheet")) s.img.setTexture("kh_sheet", SHEET.rockOpen);
      const [kk, kf] = texF(scene, "key");
      const k = scene.add.image(s.x, s.y - 24, kk, kf).setScale(2).setDepth(50003);
      scene.tweens.add({ targets: k, y: player.y - 60, x: player.x, scale: 1, alpha: 0, duration: 700, ease: "Quad.In", onComplete: () => k.destroy() });
      if (window.burstConfetti) burstConfetti(scene, s.x, s.y - 20, 0xE6BE58, 14);
      if (typeof sfx === "function") sfx("levelUp", 0);
      if (window.showLowerThird) showLowerThird("reward", "SPARE KEY", C.found || "Found the spare key.", 4500);
      st.spots.forEach(o => { if (!o.checked && o.q && o.q.active) o.q.destroy(); });
    } else {
      const lines = (C.notHere || {})[s.kind] || ["Not here."];
      pop(scene, s.x, s.y, Phaser.Utils.Array.GetRandom(lines));
      if (typeof sfx === "function") sfx("pick", 0);
      s.img.setAlpha(0.6);
    }
    draw();
  }
  function openDoor(scene) {
    const C = K(); st.open = true;
    if (typeof chests !== "undefined" && chests) {
      const ch = chests.create(st.door.x + 70, st.door.y + 30, "chest").setDepth(3); ch.bossKind = C.chestKey || "keyHunt"; ch.readyAt = runElapsedMs + 800; st.chest = ch;
      ch.tag = scene.add.text(ch.x, ch.y, "BONUS", { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#EF9347", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5, 1.6).setDepth(4);
    }
    if (typeof hp !== "undefined" && stats) { hp = Math.min(stats.maxHp, hp + Math.max(2, Math.round(stats.maxHp * (C.healFrac || 0.5)))); if (typeof drawHpBar === "function") drawHpBar(); }
    if (stats) stats.bossPts = (stats.bossPts || 0) + (C.scoreBonus || 1500);
    if (window.burstConfetti) burstConfetti(scene, st.door.x, st.door.y - 30, 0xEF9347, 18);
    if (typeof sfx === "function") sfx("bossDefeat", 0);
    if (window.showLowerThird) showLowerThird("win", "HOME ✓", C.openLine || "Home sweet home.", 5000);
    if (window.achEvent) achEvent("keyHunt", {});
    if (window.Telemetry && Telemetry.event) Telemetry.event("home-door-open");
    st.doorMark.setStrokeStyle(3, 0x83A89A, 0.9).setFillStyle(0x83A89A, 0.2);
    // The door stays shut until you pick up the bonus chest (or a few seconds pass), then it swings open and you can
    // walk straight in. (Nov 11, Rami: having to walk away and come back was confusing.)
    st.armed = false; st.lootUntil = runElapsedMs + (C.lootWaitMs || 6000);
    draw();
  }

  // ---- inside your house (Nov 9, step 3b) ----
  function moveTo(scene, x, y) {
    player.body.reset(x, y - player.height / 2); player.setVelocity(0, 0);
    scene.cameras.main.centerOn(player.x, player.y);
    // anything that can't follow you through the door clocks out; bosses come along
    const area = scene.worldArt && scene.worldArt.startArea;
    bills.getChildren().slice().forEach(b => {
      if (!b.active || b.stairFollow) return; // the ones following you up or down the stairs arrive on their own
      const far = Math.hypot(b.x - x, b.y - y) > 900;
      if (!far) return;
      if (b.isBoss) { const s = area && area.resolveSpawn ? area.resolveSpawn(x + (Math.random() < 0.5 ? -320 : 320), y - 120) : null; if (s) b.body.reset(s[0], s[1]); }
      else { if (b.tag) b.tag.destroy(); b.destroy(); }
    });
    if (typeof pings !== "undefined" && pings) pings.getChildren().slice().forEach(pg => pg.destroy());
    if (window.NAV && NAV.invalidate) NAV.invalidate();
  }
  // The door swings open (the doorway widens from its hinge), with a little "COME IN" sign.
  function swingDoor(scene) {
    const ms = K().doorSwingMs || 800;
    st.lootUntil = 0; st.swinging = true;
    if (window.MapleHollowDoor) MapleHollowDoor(true, ms);
    if (typeof sfx === "function") sfx("pick", 0);
    pop(scene, st.door.x, st.door.y - 40, "COME IN", "#83A89A");
    scene.time.delayedCall(ms, () => { if (st) { st.swinging = false; st.walkIn = true; } });
  }

  // Walking through a door (Maple v2 step 2, Rami: "animate them going into the house"): you shrink a little and fade
  // into the doorway while the screen fades, then step through on the other side. Nothing can hit you meanwhile.
  function walkThrough(scene, goingIn) {
    const P = MAPLE_HOLLOW.house2, ms = P && P.on && MAPLE_HOLLOW.interior.h2 ? (P.transitMs || 520) : 0;
    if (!ms) return goingIn ? goInside(scene) : goOutside(scene);
    if (window.homeTransit) return;
    window.homeTransit = true; st.armed = false;
    setTimeout(() => { window.homeTransit = false; }, ms * 4); // backstop: a pause mid-door can never leave you stuck
    const cam = scene.cameras.main, sx = player.scaleX, sy = player.scaleY, half = Math.round(ms / 2);
    scene.tweens.add({ targets: player, alpha: 0, scaleX: sx * 0.82, scaleY: sy * 0.82, duration: Math.round(half * 0.85) });
    cam.fadeOut(half, 23, 28, 53);
    scene.time.delayedCall(half, () => {
      if (goingIn) goInside(scene); else goOutside(scene);
      const x0 = player.x, y0 = player.y, dx = goingIn ? 34 : 0, dy = goingIn ? 0 : 30;
      player.body.reset(x0 - dx, y0 - dy); player.setFlipX(false);
      cam.fadeIn(half, 23, 28, 53);
      const step = { t: 0 };
      scene.tweens.add({ targets: player, alpha: 1, scaleX: sx, scaleY: sy, duration: half });
      scene.tweens.add({ targets: step, t: 1, duration: half, ease: "Sine.easeOut",
        onUpdate: () => player.body.reset(x0 - dx * (1 - step.t), y0 - dy * (1 - step.t)),
        onComplete: () => { window.homeTransit = false; } });
    });
  }
  // The stairs (Maple v2 step 2b, Rami: "animate them ... climbing stairs"). You hop up (or down) the steps, the screen
  // fades, and you come out beside the stairs on the other floor. A few nearby walkers follow a moment later; bosses always.
  function climb(scene, goingUp) {
    const S = window.MapleHollowStairs, P = MAPLE_HOLLOW.house2, F = P.follow || {}, ms = P.climbMs || 700;
    if (!S || window.homeTransit) return;
    window.homeTransit = true; setTimeout(() => { window.homeTransit = false; }, ms * 4); // backstop
    const [ax, ay, aw, ah] = goingUp ? S.down : S.up, arrive = goingUp ? S.arriveUp : S.arriveDown;
    const half = player.height / 2, x0 = player.x, y0 = player.y, fx = ax + aw / 2;
    const toY = (goingUp ? ay + 26 : ay + ah - 6) - half;     // walk to the far end of the flight
    const followers = bills.getChildren().filter(b => b.active && !b.isBoss && Math.hypot(b.x - x0, b.y - y0) < (F.radius || 220)).slice(0, F.max || 6);
    followers.forEach(b => { b.stairFollow = true; });
    const sx = player.scaleX, sy = player.scaleY, cam = scene.cameras.main, t = { k: 0 }, hops = 5, walk = Math.round(ms * 0.7);
    if (typeof sfx === "function") sfx("pick", 0);
    scene.tweens.add({ targets: t, k: 1, duration: walk, onUpdate: () => {
      const k = t.k, hop = Math.abs(Math.sin(k * Math.PI * hops)) * 7; // one little hop per step
      player.body.reset(Phaser.Math.Linear(x0, fx, Math.min(1, k * 3)), Phaser.Math.Linear(y0, toY, k) - hop);
      const sc = goingUp ? 1 - 0.14 * k : 1; player.setScale(sx * sc, sy * sc); player.setAlpha(k > 0.6 ? 1 - (k - 0.6) / 0.4 : 1);
    } });
    scene.time.delayedCall(Math.round(walk * 0.55), () => cam.fadeOut(Math.round(walk * 0.45), 23, 28, 53));
    scene.time.delayedCall(walk, () => {
      moveTo(scene, arrive[0] - 30, arrive[1]);
      player.setScale(sx, sy); player.setFlipX(false); cam.fadeIn(Math.round(ms * 0.35), 23, 28, 53);
      const a0 = player.x, step = { t: 0 };
      scene.tweens.add({ targets: player, alpha: 1, duration: Math.round(ms * 0.3) });
      scene.tweens.add({ targets: step, t: 1, duration: Math.round(ms * 0.35), ease: "Sine.easeOut",
        onUpdate: () => player.body.reset(a0 + 30 * step.t, player.y), onComplete: () => { window.homeTransit = false; } });
      st.floor = goingUp ? 2 : 1;
      scene.time.delayedCall(F.delayMs || 1200, () => followers.forEach((b, i) => {
        if (!b.active) return; b.stairFollow = false;
        const ang = Math.PI * (0.6 + 0.8 * (i / Math.max(1, followers.length - 1))); // fan out behind you, toward the stairs
        b.body.reset(arrive[0] + Math.cos(ang) * 70, arrive[1] - 30 + Math.sin(ang) * 50);
      }));
    });
  }
  function goInside(scene) {
    const I = MAPLE_HOLLOW.interior, C = I;
    st.inside = true; st.armed = false;
    moveTo(scene, I.entry[0], I.entry[1]);
    if (!st.entered) { st.entered = true; if (window.showLowerThird) showLowerThird("promo", "HOME", C.enterLine || "Home.", 4200); if (window.Telemetry && Telemetry.event) Telemetry.event("home-inside"); }
    if (typeof sfx === "function") sfx("pick", 0);
  }
  function goOutside(scene) {
    st.inside = false; st.armed = false; st.floor = 1;
    moveTo(scene, st.door.x, st.door.y + 60);
    if (typeof sfx === "function") sfx("pick", 0);
  }
  function tickHouse(scene, px, py) {
    const I = MAPLE_HOLLOW.interior;
    if (!st.inside) {
      const d = Math.hypot(px - st.door.x, py - st.door.y);
      // Wait for the bonus screen (and any level-up) to close, then a short beat, so you actually see the door open.
      // only a menu that's actually on screen holds the door (Nov 12: a stuck flag kept it shut for good)
      const busy = (typeof levelUpOpen !== "undefined" && levelUpOpen && scene.physics.world.isPaused) || (window.BonusChest && BonusChest.isOpen() && BonusChest.visible());
      if (st.lootUntil && !busy && (!st.chest || !st.chest.active || runElapsedMs > st.lootUntil)) {
        if (!st.swingAt) st.swingAt = runElapsedMs + (K().doorBeatMs || 450);
        else if (runElapsedMs >= st.swingAt) swingDoor(scene);
      }
      if (st.lootUntil || st.swinging) return;
      if (d > 90) st.armed = true;
      // walkIn: right after the door swings open you can walk straight in, but standing still on the steps won't pull you inside
      const moving = player.body && (Math.abs(player.body.velocity.x) + Math.abs(player.body.velocity.y)) > 10;
      if (d < (K().doorPx || 56) && (st.armed || (st.walkIn && moving))) { st.walkIn = false; walkThrough(scene, true); }
      return;
    }
    const dm = Math.hypot(px - I.exitMat[0], py - I.exitMat[1]);
    if (dm > 80) st.armed = true;
    else if (st.armed && dm < (I.exitPx || 40)) { walkThrough(scene, false); return; }
    const S = window.MapleHollowStairs; // the stairs: step onto either flight to climb it (step off before it fires again)
    if (S && !window.homeTransit) {
      const on = r => px > r[0] + 6 && px < r[0] + r[2] - 6 && py > r[1] + 8 && py < r[1] + r[3] - 4;
      const onDown = on(S.down), onUp = on(S.up);
      if (!onDown && !onUp) st.stairArmed = true;
      else if (st.stairArmed) { st.stairArmed = false; climb(scene, onDown); return; }
    }
    // bosses can't walk between floors: one left far behind walks back in near you
    if (S && runElapsedMs - (st.bossCheck || 0) > 1500) {
      st.bossCheck = runElapsedMs;
      const area = scene.worldArt && scene.worldArt.startArea;
      bills.getChildren().forEach(b => { if (b.active && b.isBoss && Math.hypot(b.x - px, b.y - py) > 1100 && area && area.resolveSpawn) {
        const q = area.resolveSpawn(px + (Math.random() < 0.5 ? -300 : 300), py - 100); if (q) b.body.reset(q[0], q[1]); } });
    }
    const BG = window.MapleHollowGate; // the baby gate on the stairs (until upstairs opens)
    if (BG && Math.hypot(px - BG.x, py - BG.y) < 70 && runElapsedMs - (st.gateSaid || -1e9) > 20000) { st.gateSaid = runElapsedMs; pop(scene, BG.x, BG.y - 60, BG.line, "#F2D7A1"); }
    const F = window.MapleHollowFridge;
    // Nov 12: the fridge restocks every few years instead of once per run
    if (F && st.fridgeUsed && I.fridgeRestockYears && typeof currentAge !== "undefined" && currentAge - (st.fridgeAge || 0) >= I.fridgeRestockYears) {
      st.fridgeUsed = false; st.fridgeRestocked = true;
    }
    if (F && !st.fridgeUsed && Math.hypot(px - F.x, py - F.y) < 60) {
      st.fridgeUsed = true; st.fridgeAge = typeof currentAge !== "undefined" ? currentAge : 0;
      if (typeof hp !== "undefined" && stats) { hp = Math.min(stats.maxHp, hp + (typeof healAmt === "function" ? healAmt(I.fridgeHeal || 4) : (I.fridgeHeal || 4))); if (typeof drawHpBar === "function") drawHpBar(); }
      pop(scene, F.x, F.y - 40, "+HP · " + ((st.fridgeRestocked && I.fridgeRestockLine) || I.fridgeLine || "Leftovers."), "#83A89A");
      if (typeof sfx === "function") sfx("pick", 0);
    }
  }
  function update(scene) {
    if (!home() || typeof player === "undefined" || !player || !player.active || !playing()) return;
    if (!st) { if (pending || (typeof currentAge !== "undefined" && currentAge >= (K().startAge || 40.4))) start(scene); return; }
    const C = K(), px = player.x, py = player.y + player.height / 2;
    if (st.open) return tickHouse(scene, px, py);
    if (!st.hasKey) st.spots.forEach((s, i) => { if (!s.checked && Math.hypot(px - s.x, py - s.y) < (C.checkPx || 40)) check(scene, i); });
    const dDoor = Math.hypot(px - st.door.x, py - st.door.y);
    if (dDoor < (C.doorPx || 56)) {
      if (st.hasKey) openDoor(scene);
      else if (runElapsedMs > st.doorWarnAt) { st.doorWarnAt = runElapsedMs + 4000; pop(scene, st.door.x, st.door.y, "LOCKED. Of course it is.", "#EF9347"); }
    }
  }
  function reset() { if (st) st.objs.forEach(o => o && o.active && o.destroy()); st = null; pending = null; if (chip) chip.className = "hidden"; }
  return { update, reset, save, restore, state: () => st && { inside: st.inside, floor: st.floor || 1, stairArmed: !!st.stairArmed, armed: st.armed, fridgeUsed: st.fridgeUsed, hasKey: st.hasKey, open: st.open, checked: st.checked, keyAt: st.spots[st.keyAt] && { x: st.spots[st.keyAt].x, y: st.spots[st.keyAt].y }, door: st.door } };
})();
