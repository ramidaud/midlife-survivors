// Hustle Bonus and Burning the Candle (settings: src/data/hustle.js).
// Before 55, moving around and exploring adds to your end-of-run paycheck. From 55, nonstop movement and energy
// drinks fill a small "candle" meter under your health; when it fills, a Medical Bill comes for you.
window.Hustle = (() => {
  const H = () => window.HUSTLE || {};
  let st = null, bar = null;
  function reset() {
    if (bar) { bar.destroy(); bar = null; }
    st = { dist: 0, areas: new Set(), lastX: null, lastY: null, wear: 0, flipSaid: false, warnSaid: false, areaCheckAt: 0 };
  }
  function areaAt(x, y) {
    const floors = (window.START_AREA_LAYOUT && START_AREA_LAYOUT.floors) || [];
    const f = floors.find(f => x >= f.x && x <= f.x + f.width && y >= f.y && y <= f.y + f.height);
    return f ? f.district : null;
  }
  function update(scene, delta) {
    if (!st || typeof player === "undefined" || !player || !player.active) return;
    const C = H(), dt = (delta || 16.6) / 1000, age = currentAge;
    const dx = st.lastX == null ? 0 : player.x - st.lastX, dy = st.lastY == null ? 0 : player.y - st.lastY;
    st.lastX = player.x; st.lastY = player.y;
    const step = Math.hypot(dx, dy), moving = step > 0.6 && step < 100; // ignore teleports
    if (age < (C.bonusUntilAge || 55)) {
      if (moving) st.dist += step;
      if (runElapsedMs >= st.areaCheckAt) { st.areaCheckAt = runElapsedMs + 500; const a = areaAt(player.x, player.y); if (a) st.areas.add(a); }
    }
    // Burning the candle
    if (age >= (C.candleFromAge || 55)) {
      if (!st.flipSaid) { st.flipSaid = true; if (window.showLowerThird) showLowerThird("tip", "DOCTOR'S ORDERS", C.lines.flip, 6000); }
      const fast = typeof buffs !== "undefined" && buffs.speedUntil > runElapsedMs;
      if (moving && step > 1.5) st.wear += C.fillPerSecMoving * dt * (fast ? C.fillSpeedBuffMult : 1);
      else if (moving) st.wear -= C.drainPerSecSlow * dt;
      else st.wear -= C.drainPerSecStill * dt;
      st.wear = Math.max(0, Math.min(C.full, st.wear));
      if (st.wear >= C.full * 0.7 && !st.warnSaid) { st.warnSaid = true; if (window.showLowerThird) showLowerThird("tip", "HEART RATE", C.lines.warn, 4000); }
      if (st.wear >= C.full) { st.wear = C.resetTo; medicalBill(scene); }
      drawBar(scene);
    }
  }
  function drawBar(scene) {
    if (!bar) bar = scene.add.graphics().setDepth(50001);
    bar.clear();
    const C = H(), w = 34, h = 4, x = player.x - w / 2, y = player.y + 36, f = st.wear / C.full;
    if (f < 0.05) return;
    bar.fillStyle(0x171C35, 0.85).fillRect(x - 1, y - 1, w + 2, h + 2);
    bar.fillStyle(f > 0.7 ? 0xC45C4B : f > 0.4 ? 0xEF9347 : 0xF2D7A1, 1).fillRect(x, y, Math.round(w * f), h);
  }
  function medicalBill(scene) {
    const C = H(), M = C.medical || {};
    const v = player.body ? player.body.velocity : { x: 1, y: 0 }, a = Math.atan2(v.y || 0, v.x || 1);
    const r = Math.max(scene.cameras.main.worldView.width, scene.cameras.main.worldView.height) * 0.5;
    const b = createEnemy(scene, "bill", player.x + Math.cos(a) * r, player.y + Math.sin(a) * r);
    if (!b) return;
    b.medical = true; b.hp = Math.ceil(b.hp * (M.hpMult || 2)); b.damage = (b.damage || 1) + (M.damageAdd || 1);
    if (M.tint) b.setTint(M.tint);
    const tag = scene.add.text(b.x, b.y - 34, M.label || "MEDICAL BILL", { fontFamily: "Silkscreen, monospace", fontSize: "10px", color: "#171C35", backgroundColor: "#F1B5BF", padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(50000);
    b.medTag = tag;
    scene.events.on("postupdate", function follow() { if (!b.active) { tag.destroy(); scene.events.off("postupdate", follow); return; } tag.setPosition(b.x, b.y - 34); });
    if (window.showLowerThird) showLowerThird("alert", "MEDICAL BILL", C.lines.medical, 3500);
  }
  // A Medical Bill's touch also costs a copay out of this run's 401(k).
  function onHit(scene, bill) {
    if (!bill || !bill.medical) return;
    const C = H(), n = (C.medical && C.medical.copay) || 5;
    const pay = Math.min(n, runCoins); if (pay <= 0) return;
    runCoins -= pay; meta.coins = Math.max(0, meta.coins - pay); window.coinLog && coinLog("copays (negative)", pay);
    const t = scene.add.text(player.x, player.y - 60, (C.lines.copay || "COPAY -{n}k").replace("{n}", pay), { fontFamily: "Silkscreen, monospace", fontSize: "13px", color: "#F1B5BF", stroke: "#171C35", strokeThickness: 4 }).setOrigin(0.5).setDepth(50000);
    scene.tweens.add({ targets: t, y: t.y - 24, alpha: 0, duration: 900, onComplete: () => t.destroy() });
  }
  function energyDrink() { if (st && currentAge >= (H().candleFromAge || 55)) st.wear = Math.min(H().full, st.wear + (H().energyDrinkAdd || 0)); }
  function bonus() { // Hustle Bonus for the paycheck
    if (!st) return { coins: 0, dist: 0, areas: 0 };
    const C = H(), c = Math.min(C.bonusCap || 60, Math.floor(st.dist / (C.pxPerCoin || 6000)) + st.areas.size * (C.perNewArea || 0));
    return { coins: c, dist: Math.round(st.dist), areas: st.areas.size };
  }
  return { reset, update, onHit, energyDrink, bonus, wear: () => st ? st.wear : 0 };
})();
