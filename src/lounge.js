// The Lounge (Nov 3, TJ's idea, Grok's spec section 8.2). Settings in src/data/interns.js (INTERNS.lounge).
// After each promotion (45, 50, 55, 60) an intern opens the Break Room counter for about 35 seconds.
// Walk up to it to shop: the game pauses while you browse. Prices come out of your 401(k).
// Rules that keep it from becoming a hiding spot:
//   - it only opens for a short window, and never while a boss is alive or the Comfort Zone Tax is on
//   - 3 or more enemies near the counter close the register
//   - enemies still walk in, and hanging around the Break Room while it's closed brings company
window.Lounge = (() => {
  const C = () => (window.INTERNS && INTERNS.lounge) || {};
  let st = null;
  const SPOT_FALLBACK = { x: -1792, y: 56 }; // in front of the coffee cart

  function reset() {
    if (st && st.objs) st.objs.forEach(o => o && o.destroy && o.destroy());
    if (st && st.closedSign) st.closedSign.forEach(o => o.destroy());
    st = { state: "closed", done: {}, pendingAge: 0, openUntil: 0, objs: [], arrowUntil: 0, needExit: false,
           bought: {}, ramp: {}, stock: {}, loiterSince: 0, loiterWarned: 0, staff: null };
    hideModal();
  }

  function gateOpen() {
    const gates = window.START_AREA_GATES || [];
    const g = gates.find(g => g.toDistrict === (C().districtId || "breakroom"));
    return g ? !!g.opened : false;
  }
  function spot() {
    const p = (window.START_AREA_LAYOUT && START_AREA_LAYOUT.placements || []).find(p => p.prop === "coffee_cart" && p.district === "breakroom");
    let s = p ? { x: p.x, y: p.y + 104 } : Object.assign({}, SPOT_FALLBACK);
    if (window.NAV && NAV.fixSpawn) { const f = NAV.fixSpawn(s.x, s.y); if (f) s = { x: f[0], y: f[1] }; }
    return s;
  }
  function inBreakRoom(x, y) {
    const floors = (window.START_AREA_LAYOUT && START_AREA_LAYOUT.floors) || [];
    return floors.some(f => f.district === (C().districtId || "breakroom") && x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height);
  }
  const bossAlive = () => bills.getChildren().some(b => b.active && b.isBoss);
  const taxOn = () => typeof dyn !== "undefined" && dyn.comfortUntil > runElapsedMs;
  const enemiesNear = (x, y, r) => bills.getChildren().filter(b => b.active && !b.ghost && Phaser.Math.Distance.Between(b.x, b.y, x, y) < r).length;

  function open(scene) {
    const L = C(), s = spot();
    st.state = "open"; st.spot = s; st.openUntil = runElapsedMs + (L.openMsPromotion || 35000);
    st.arrowUntil = st.openUntil; // the arrow stays up the whole time it's open (TJ couldn't find it, Nov 3) st.needExit = false; st.bubbleUsed = false;
    (L.catalog || []).forEach(it => { st.stock[it.id] = it.stock; });
    const roster = (window.INTERNS && INTERNS.roster) || [];
    const r = roster[Math.floor(Math.random() * roster.length)] || { name: "The intern", id: "tj" };
    st.staff = r;
    // Counter marker: a cream rug with OPEN on it, plus the intern behind it.
    const rug = scene.add.ellipse(s.x, s.y, 104, 44, 0xF2D7A1, 0.22).setStrokeStyle(3, 0xF2D7A1, 0.9).setDepth(2.5);
    const sign = scene.add.text(s.x, s.y - 2, "THE LOUNGE\nOPEN", { fontFamily: "Silkscreen, monospace", fontSize: "16px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 8, y: 4 }, align: "center", lineSpacing: 2 }).setOrigin(0.5).setDepth(50000);
    scene.tweens.add({ targets: rug, alpha: { from: 0.6, to: 1 }, scale: { from: 0.96, to: 1.04 }, duration: 700, yoyo: true, repeat: -1 });
    const key = "intern_" + r.id + "_0";
    const real = scene.textures.exists("intern2_" + r.id); // ChatGPT's counter pose: row 4, columns 0-3
    const staff = real ? scene.add.sprite(s.x + 58, s.y - 6, "intern2_" + r.id, 32).setOrigin(0.5, 56 / 60).setDepth(4.5)
      : scene.textures.exists(key) ? scene.add.image(s.x + 58, s.y - 6, key).setScale(1.6).setOrigin(0.5, 1).setDepth(4.5) : null;
    st.staffReal = real;
    const tag = scene.add.text(s.x + 58, s.y - 70, r.name.toUpperCase() + " · REGISTER", { fontFamily: "Silkscreen, monospace", fontSize: "10px", color: "#F2D7A1", backgroundColor: "#171C35cc", padding: { x: 4, y: 2 } }).setOrigin(0.5, 1).setDepth(50000);
    const arrow = scene.add.text(0, 0, "THE LOUNGE ▶", { fontFamily: "Silkscreen, monospace", fontSize: "13px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 6, y: 3 } }).setOrigin(0.5).setDepth(50003).setScrollFactor(0);
    st.objs = [rug, sign, staff, tag, arrow]; st.arrow = arrow;
    if (st.closedSign) { st.closedSign.forEach(o => o.destroy()); st.closedSign = null; }
    const line = (L.lines && L.lines.open || "{name} is on the Lounge register.").replace("{name}", r.name);
    if (window.Spotlight && Spotlight.lounge) Spotlight.lounge(r);
    if (window.showLowerThird) window.showLowerThird("promo", "THE LOUNGE", line + " Break Room, near the coffee cart.", 5000);
    sfx("coin");
  }

  function shutter(scene, line) {
    if (st.state === "browsing") closeBrowse(scene);
    st.state = "closed";
    st.objs.forEach(o => o && o.destroy && o.destroy()); st.objs = []; st.arrow = null;
    if (line && window.showLowerThird) window.showLowerThird("lore", "THE LOUNGE", line, 3000);
  }

  // ---------- the shop screen ----------
  function price(it) { return it.price + (st.ramp[it.id] || 0); }
  function canBuy(it) {
    if (it.perRun && (st.bought[it.id] || 0) >= it.perRun) return "SOLD OUT";
    if ((st.stock[it.id] || 0) <= 0) return "SOLD OUT";
    if (meta.coins < price(it)) return "TOO PRICEY";
    return "";
  }
  function ensureModal() {
    let m = document.getElementById("lounge-modal");
    if (m) return m;
    const css = document.createElement("style");
    css.textContent = `
      #lounge-modal .lg-card{width:min(560px,100%);max-height:calc(100dvh - 24px);overflow:auto;background:#171C35;border:3px solid #F2D7A1;border-radius:8px;box-shadow:0 8px 0 rgba(0,0,0,.4);color:#FFF0CF;font-family:"Atkinson Hyperlegible",system-ui,sans-serif}
      #lounge-modal .lg-head{background:#F2D7A1;color:#171C35;padding:8px 14px;font:13px Silkscreen,monospace;display:flex;justify-content:space-between;gap:8px}
      #lounge-modal .lg-scene{display:block;border-bottom:3px solid #F2D7A1;background:#171C35}
      #lounge-modal .lg-scene img{display:block;width:100%;height:auto;max-height:200px;object-fit:cover;image-rendering:pixelated}
      @media (max-width:520px){#lounge-modal .lg-scene img{max-height:30dvh;object-position:50% 30%}}
      #lounge-modal .lg-body{padding:12px 14px;display:grid;gap:10px}
      #lounge-modal .lg-say{font-size:15px}
      #lounge-modal .lg-say b{color:#83A89A}
      #lounge-modal .lg-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
      @media (max-width:520px){#lounge-modal .lg-grid{grid-template-columns:minmax(0,1fr)}}
      #lounge-modal .lg-item{display:grid;gap:4px;text-align:left;background:#1f2640;border:2px solid #3E7775;border-radius:6px;color:#FFF0CF;padding:10px;min-height:44px;cursor:pointer;font:inherit}
      #lounge-modal .lg-item .nm{font:13px Silkscreen,monospace}
      #lounge-modal .lg-item .tx{font-size:13px;color:#B8C0D4}
      #lounge-modal .lg-item .pr{font:12px Silkscreen,monospace;color:#EF9347}
      #lounge-modal .lg-item.off{opacity:.45}
      #lounge-modal .lg-item.nav-focused,#lounge-modal .lg-item:hover{border-color:#EF9347}
      #lounge-modal .lg-leave{font:13px Silkscreen,monospace;background:#EF9347;color:#171C35;border:2px solid #171C35;border-radius:6px;min-height:44px;cursor:pointer}
      #lounge-modal .lg-leave.nav-focused{outline:3px solid #FFF0CF}
      #lounge-modal .lg-note{font-size:12px;color:#B8C0D4}`;
    document.head.appendChild(css);
    m = document.createElement("div");
    m.className = "ui-modal hidden"; m.id = "lounge-modal";
    m.setAttribute("role", "dialog"); m.setAttribute("aria-label", "The Lounge");
    (document.getElementById("ui-layer") || document.body).appendChild(m);
    return m;
  }
  function hideModal() { const m = document.getElementById("lounge-modal"); if (m) m.classList.add("hidden"); }
  function renderModal(scene, msg) {
    const m = ensureModal(), L = C(), r = st.staff || { name: "The intern" };
    const items = (L.catalog || []).map(it => ({ it, why: canBuy(it) }));
    m.innerHTML = `<div class="lg-card">
      <div class="lg-head"><span>THE LOUNGE · BREAK ROOM</span><span>401(k): ${meta.coins}k</span></div>
      <picture class="lg-scene"><source media="(max-width:520px)" srcset="assets/ui/lounge-scene-tall-v1.png?v=${window.BUILD||1}"><img src="assets/ui/lounge-scene-v1.png?v=${window.BUILD||1}" alt="The Student Lounge: futon, paper lamp, collage wall and the desk where TJ and Derek work" width="960" height="360"></picture>
      <div class="lg-body">
        <div class="lg-say"><b>${r.name}:</b> ${msg || "What can I get you?"}</div>
        <div class="lg-grid">${items.map(({ it, why }, i) => `
          <button type="button" class="lg-item${why ? " off" : ""}" data-id="${it.id}" ${why ? 'aria-disabled="true"' : ""}>
            <span class="nm">${it.name}</span><span class="tx">${it.text || ""}</span>
            <span class="pr">${why || price(it) + "k"}${!why && st.stock[it.id] > 1 ? " · " + st.stock[it.id] + " left" : ""}</span>
          </button>`).join("")}</div>
        <button type="button" class="lg-leave" id="lg-leave">BACK TO WORK</button>
        <div class="lg-note">The game is paused while you shop. Prices come out of your 401(k).</div>
      </div></div>`;
    m.classList.remove("hidden");
    const row = (i) => Math.floor(i / 2);
    m.querySelectorAll(".lg-item").forEach((b, i) => window.bindNavItem ? bindNavItem(b, row(i), () => buy(scene, b.dataset.id), i === 0) : b.addEventListener("click", () => buy(scene, b.dataset.id)));
    const leave = m.querySelector("#lg-leave");
    if (window.bindNavItem) bindNavItem(leave, 10, () => closeBrowse(scene, true)); else leave.addEventListener("click", () => closeBrowse(scene, true));
    if (window.menuNav) window.menuNav.refresh();
  }

  function buy(scene, id) {
    const it = (C().catalog || []).find(x => x.id === id); if (!it) return;
    const why = canBuy(it);
    if (why) { sfx("pick"); return renderModal(scene, why === "TOO PRICEY" ? "That one's out of your budget, boss." : "Sold out. Someone got here first."); }
    const cost = price(it);
    meta.coins = Math.max(0, meta.coins - cost); runCoins = Math.max(0, runCoins - cost); saveMeta(meta);
    st.stock[it.id]--; st.bought[it.id] = (st.bought[it.id] || 0) + 1; st.ramp[it.id] = (st.ramp[it.id] || 0) + (C().priceRampAdd || 1);
    let heal = 0;
    if (it.healFlat) heal = healAmt(it.healFlat);
    if (it.useSaladFrac && typeof saladHealAmount === "function") heal = healAmt(saladHealAmount());
    if (it.healFrac) heal = healAmt(Math.max(it.healMin || 1, Math.floor(stats.maxHp * it.healFrac)));
    if (heal) { hp = Math.min(stats.maxHp, hp + heal); if (typeof drawHpBar === "function") drawHpBar(); }
    if (it.speedMult) { buffs.speedUntil = runElapsedMs + it.durMs; buffs.speedMult = Math.max(buffs.speedMult || 1, it.speedMult); }
    if (it.vacuumMs) buffs.vacuumUntil = runElapsedMs + it.vacuumMs;
    if (it.clearRadius) st.quietHour = it.clearRadius; // applied when you go back to work
    if (typeof updateHUD === "function") updateHUD();
    sfx("coin");
    renderModal(scene, (C().lines && C().lines.buy) || "Receipt is a vibe.");
  }

  function startBrowse(scene) {
    st.state = "browsing";
    pauseForMenu(scene);
    // Facilities clears a little space once per window, so you don't come back to a donut pile. Never bosses.
    if (!st.bubbleUsed) {
      st.bubbleUsed = true;
      const R = C().bubblePushRadius || 160;
      bills.getChildren().forEach(b => {
        if (!b.active || b.isBoss) return;
        const d = Phaser.Math.Distance.Between(b.x, b.y, player.x, player.y);
        if (d < R) { const a = Math.atan2(b.y - player.y, b.x - player.x); b.setPosition(player.x + Math.cos(a) * (R + 10), player.y + Math.sin(a) * (R + 10)); }
      });
    }
    renderModal(scene);
  }
  function closeBrowse(scene, saidBye) {
    hideModal();
    if (st.state === "browsing") st.state = "open";
    st.needExit = true; // walk away from the counter before it opens again
    levelUpOpen = false;
    touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
    scene.physics.resume(); scene.time.paused = false;
    if (st.quietHour) {
      const R = st.quietHour; st.quietHour = 0;
      bills.getChildren().slice().forEach(b => { if (b.active && !b.isBoss && !b.elite && Phaser.Math.Distance.Between(b.x, b.y, player.x, player.y) < R) damageBill(b, 99999); });
    }
    if (saidBye && window.showLowerThird) window.showLowerThird("lore", "THE LOUNGE", (C().lines && C().lines.leave) || "Back to work.", 2600);
    if (typeof pendingLevels !== "undefined" && pendingLevels > 0) showLevelUp(scene);
  }

  function updateArrow(scene) {
    if (!st.arrow) return;
    if (runElapsedMs > st.arrowUntil) { st.arrow.setVisible(false); return; }
    const cam = scene.cameras.main, v = cam.worldView;
    const onScreen = st.spot.x > v.x && st.spot.x < v.right && st.spot.y > v.y && st.spot.y < v.bottom;
    st.arrow.setVisible(!onScreen);
    if (onScreen) return;
    const a = Math.atan2(st.spot.y - player.y, st.spot.x - player.x);
    const w = cam.width, h = cam.height, mx = w / 2 - 90, my = h / 2 - 40;
    const k = Math.min(Math.abs(mx / (Math.cos(a) || 1e-6)), Math.abs(my / (Math.sin(a) || 1e-6)));
    st.arrow.setPosition(w / 2 + Math.cos(a) * k, h / 2 + Math.sin(a) * k);
    const arrows = ["▶", "◢", "▼", "◣", "◀", "◤", "▲", "◥"];
    const idx = Math.round(((a + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4)) % 8;
    st.arrow.setText("THE LOUNGE " + arrows[idx]);
  }

  // While it's closed, a dim sign marks the counter so you know where to go next time.
  function closedSign(scene) {
    if (st.closedSign || st.state !== "closed" || !gateOpen()) return;
    const s = spot();
    const sign = scene.add.text(s.x, s.y - 2, "THE LOUNGE\nOPENS AFTER PROMOTIONS", { fontFamily: "Silkscreen, monospace", fontSize: "14px", color: "#F2D7A1", backgroundColor: "#171C35cc", padding: { x: 7, y: 4 }, align: "center", lineSpacing: 2 }).setOrigin(0.5).setDepth(50000).setAlpha(0.75);
    const rug = scene.add.ellipse(s.x, s.y, 104, 44, 0xF2D7A1, 0.08).setStrokeStyle(2, 0xF2D7A1, 0.4).setDepth(2.5);
    st.closedSign = [sign, rug];
  }

  function update(scene, now) {
    if (!st || typeof player === "undefined" || !player || !player.scene) return;
    { const staff = st.objs && st.objs[2]; if (staff && staff.active && typeof player !== "undefined" && player) staff.setDepth(10000 + staff.y - player.y); } // the intern at the register sorts by feet too
    closedSign(scene);
    const L = C(), S = L.safety || {};
    // Arm a window at each promotion age once the Break Room is open.
    (L.promotionAges || []).forEach(age => { if (!st.done[age] && currentAge >= age) { st.done[age] = true; st.pendingAge = age; } });
    if (st.state === "closed" && st.pendingAge && gateOpen() && !bossAlive() && !taxOn()) { st.pendingAge = 0; open(scene); }
    if (st.staffReal && st.objs[2] && st.objs[2].active) st.objs[2].setFrame(32 + Math.floor(now / 185) % 4); // counter wave / register tap
    if (st.state === "open") {
      if (now > st.openUntil || bossAlive() || taxOn()) return shutter(scene, (L.lines && L.lines.shutter) || "Break's over.");
      updateArrow(scene);
      const d = Phaser.Math.Distance.Between(player.x, player.y, st.spot.x, st.spot.y);
      const R = L.browseRadius || 56;
      if (d > R * 1.6) st.needExit = false;
      if (d < R && !st.needExit) {
        if (enemiesNear(st.spot.x, st.spot.y, S.threatRadius || 180) >= (S.closeIfEnemiesInRadius || 3)) {
          if (!st.threatSaid || now - st.threatSaid > 4000) { st.threatSaid = now; if (window.showLowerThird) window.showLowerThird("alert", "THE LOUNGE", (L.lines && L.lines.threat) || "Customers only.", 2600); }
        } else startBrowse(scene);
      }
    }
    // Loitering in the Break Room while the counter is closed brings company.
    if (st.state === "closed" && gateOpen() && inBreakRoom(player.x, player.y)) {
      if (!st.loiterSince) st.loiterSince = now;
      if (now - st.loiterSince > (S.loiterMs || 12000) && now - (st.loiterWarned || -1e9) > (S.loiterPackMs || 15000)) {
        st.loiterWarned = now;
        if (window.showLowerThird) window.showLowerThird("alert", "FACILITIES", (L.lines && L.lines.loiter) || "No sleeping in the Break Room.", 2600);
        for (let i = 0; i < (S.loiterPackAdd || 2); i++) if (typeof spawnBill === "function") spawnBill(scene);
      }
    } else st.loiterSince = 0;
  }

  return { reset, update, isBrowsing: () => !!(st && st.state === "browsing"), isOpen: () => !!(st && st.state !== "closed"),
           forceOpen: (scene) => { if (st && st.state === "closed") open(scene); }, spot };
})();
