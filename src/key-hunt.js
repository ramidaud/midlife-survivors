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
    s.textContent = `#keyhunt-chip{position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--ms-nav-h,0px) + 128px);z-index:23;display:flex;align-items:center;gap:8px;max-width:min(92vw,460px);
  background:#F2D7A1;color:#171C35;border:2px solid #171C35;border-left:6px solid #EF9347;box-shadow:3px 3px 0 rgba(0,0,0,.45);padding:6px 10px;font:13px/1.25 'Atkinson Hyperlegible',sans-serif;pointer-events:none}
#keyhunt-chip b{font:11px/1 Silkscreen,monospace;letter-spacing:.06em;white-space:nowrap}
#keyhunt-chip.hidden{display:none}
@media (max-width:760px),(orientation:portrait){#keyhunt-chip{top:calc(var(--ms-nav-h,0px) + 236px);left:8px;right:8px;transform:none;max-width:none;font-size:12px;padding:5px 8px}}`;
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

  function start(scene) {
    const C = K(), M = window.MAPLE_HOLLOW, R = M.rows, lotX = i => M.firstLotX + i * M.lotWidth;
    const front = row => row === "north" ? R.northHouseFront : R.southHouseFront;
    css();
    if (window.ArtSheets) ArtSheets.load(scene, "kh_sheet", "assets/stage/home/key-hunt-v1.png", 32, 32);
    const yh = M.yourHouse, door = { x: lotX(yh.lot) - 18, y: front(yh.row) + 18 }; // the steps under your front door
    const spots = (C.spots || []).map(([row, lot, dx, dy, kind]) => ({ x: lotX(lot) + dx, y: front(row) + dy, kind }));
    // the key is never in the spot closest to your door, so you have to look around a little
    const near = spots.reduce((b, s, i) => Math.hypot(s.x - door.x, s.y - door.y) < Math.hypot(spots[b].x - door.x, spots[b].y - door.y) ? i : b, 0);
    let keyAt = Math.floor(Math.random() * spots.length); if (keyAt === near) keyAt = (keyAt + 1) % spots.length;
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
      const ch = chests.create(st.door.x + 70, st.door.y + 30, "chest").setDepth(3); ch.bossKind = C.chestKey || "keyHunt"; ch.readyAt = runElapsedMs + 800;
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
    if (window.MapleHollowDoor) MapleHollowDoor(true);
    st.armed = false; // step off the steps once, then the door takes you inside
    draw();
  }

  // ---- inside your house (Nov 9, step 3b) ----
  function moveTo(scene, x, y) {
    player.body.reset(x, y - player.height / 2); player.setVelocity(0, 0);
    scene.cameras.main.centerOn(player.x, player.y);
    // anything that can't follow you through the door clocks out; bosses come along
    const area = scene.worldArt && scene.worldArt.startArea;
    bills.getChildren().slice().forEach(b => {
      if (!b.active) return;
      const far = Math.hypot(b.x - x, b.y - y) > 900;
      if (!far) return;
      if (b.isBoss) { const s = area && area.resolveSpawn ? area.resolveSpawn(x + (Math.random() < 0.5 ? -320 : 320), y - 120) : null; if (s) b.body.reset(s[0], s[1]); }
      else { if (b.tag) b.tag.destroy(); b.destroy(); }
    });
    if (typeof pings !== "undefined" && pings) pings.getChildren().slice().forEach(pg => pg.destroy());
    if (window.NAV && NAV.invalidate) NAV.invalidate();
  }
  function goInside(scene) {
    const I = MAPLE_HOLLOW.interior, C = I;
    st.inside = true; st.armed = false;
    moveTo(scene, I.entry[0], I.entry[1]);
    if (!st.entered) { st.entered = true; if (window.showLowerThird) showLowerThird("promo", "HOME", C.enterLine || "Home.", 4200); if (window.Telemetry && Telemetry.event) Telemetry.event("home-inside"); }
    if (typeof sfx === "function") sfx("pick", 0);
  }
  function goOutside(scene) {
    st.inside = false; st.armed = false;
    moveTo(scene, st.door.x, st.door.y + 60);
    if (typeof sfx === "function") sfx("pick", 0);
  }
  function tickHouse(scene, px, py) {
    const I = MAPLE_HOLLOW.interior;
    if (!st.inside) {
      const d = Math.hypot(px - st.door.x, py - st.door.y);
      if (d > 90) st.armed = true;
      else if (st.armed && d < (K().doorPx || 56)) goInside(scene);
      return;
    }
    const dm = Math.hypot(px - I.exitMat[0], py - I.exitMat[1]);
    if (dm > 80) st.armed = true;
    else if (st.armed && dm < (I.exitPx || 40)) { goOutside(scene); return; }
    const F = window.MapleHollowFridge;
    if (F && !st.fridgeUsed && Math.hypot(px - F.x, py - F.y) < 60) {
      st.fridgeUsed = true;
      if (typeof hp !== "undefined" && stats) { hp = Math.min(stats.maxHp, hp + (typeof healAmt === "function" ? healAmt(I.fridgeHeal || 4) : (I.fridgeHeal || 4))); if (typeof drawHpBar === "function") drawHpBar(); }
      pop(scene, F.x, F.y - 40, "+HP · " + (I.fridgeLine || "Leftovers."), "#83A89A");
      if (typeof sfx === "function") sfx("pick", 0);
    }
  }
  function update(scene) {
    if (!home() || typeof player === "undefined" || !player || !player.active || !playing()) return;
    if (!st) { if (typeof currentAge !== "undefined" && currentAge >= (K().startAge || 40.4)) start(scene); return; }
    const C = K(), px = player.x, py = player.y + player.height / 2;
    if (st.open) return tickHouse(scene, px, py);
    if (!st.hasKey) st.spots.forEach((s, i) => { if (!s.checked && Math.hypot(px - s.x, py - s.y) < (C.checkPx || 40)) check(scene, i); });
    const dDoor = Math.hypot(px - st.door.x, py - st.door.y);
    if (dDoor < (C.doorPx || 56)) {
      if (st.hasKey) openDoor(scene);
      else if (runElapsedMs > st.doorWarnAt) { st.doorWarnAt = runElapsedMs + 4000; pop(scene, st.door.x, st.door.y, "LOCKED. Of course it is.", "#EF9347"); }
    }
  }
  function reset() { if (st) st.objs.forEach(o => o && o.active && o.destroy()); st = null; if (chip) chip.className = "hidden"; }
  return { update, reset, state: () => st && { inside: st.inside, armed: st.armed, fridgeUsed: st.fridgeUsed, hasKey: st.hasKey, open: st.open, checked: st.checked, keyAt: st.spots[st.keyAt] && { x: st.spots[st.keyAt].x, y: st.spots[st.keyAt].y }, door: st.door } };
})();
