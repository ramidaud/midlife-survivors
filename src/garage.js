// The garage and the V8 (Nov 10, Maple Hollow step 5b). The Midlife Crisis V8 sits parked in your garage all run.
// A little before 60 its engine starts turning over ("vroom..."). At 60 it bursts out: through the garage door if
// you're inside, down your driveway if you're out on the street. When it's beaten, its parking spot is just dust.
// Numbers and lines: MAPLE_HOLLOW.garage. The room itself is built in src/maple-hollow.js.
window.Garage = (() => {
  const G = () => (window.MAPLE_HOLLOW && MAPLE_HOLLOW.garage) || {};
  const home = () => window.STAGE_ID === "home";
  let st = { teaseAt: 0, teased: false, burst: false };
  const inside = () => !!(window.KeyHunt && KeyHunt.state() && KeyHunt.state().inside);
  // where your garage meets the driveway, out on the street
  function driveway() {
    const M = MAPLE_HOLLOW, yh = M.yourHouse, cx = M.firstLotX + yh.lot * M.lotWidth;
    const front = yh.row === "north" ? M.rows.northHouseFront : M.rows.southHouseFront;
    return [cx + 72, front + 44];
  }
  function pop(scene, x, y, text, bg) {
    const t = scene.add.text(x, y, text, { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: bg || "#F2D7A1", padding: { x: 5, y: 3 } }).setOrigin(0.5).setDepth(50004);
    scene.tweens.add({ targets: t, y: y - 22, alpha: 0, delay: 1100, duration: 500, onComplete: () => t.destroy() });
  }
  function dust(scene, x, y, n) {
    for (let i = 0; i < n; i++) {
      const c = scene.add.circle(x + Phaser.Math.Between(-40, 40), y + Phaser.Math.Between(-10, 14), Phaser.Math.Between(8, 18), 0xD3B78D, 0.8).setDepth(50000);
      scene.tweens.add({ targets: c, x: c.x + Phaser.Math.Between(-60, 60), y: c.y + Phaser.Math.Between(-30, 10), scale: 1.8, alpha: 0, duration: Phaser.Math.Between(500, 900), onComplete: () => c.destroy() });
    }
  }
  function update(scene) {
    const g = window.MapleHollowGarage, C = G();
    if (!home() || !g || st.burst || typeof currentAge === "undefined" || gameOver) return;
    if (currentAge < (C.teaseAge || 59.4) || runElapsedMs < st.teaseAt) return;
    st.teaseAt = runElapsedMs + 3800;
    const L = C.teaseLines || ["vroom..."]; st.teaseN = (st.teaseN || 0) + 1;
    const line = L[Math.min(L.length - 1, st.teaseN - 1)];
    const [dx, dy] = inside() ? g.park : driveway();
    pop(scene, dx, dy - (inside() ? 120 : 70), line, "#EF9347");
    if (g.parked && g.parked.active) scene.tweens.add({ targets: g.parked, x: g.parked.x + 3, duration: 45, yoyo: true, repeat: 5 }); // the parked car shudders
    if (!st.teased) { st.teased = true; if (typeof sfx === "function") sfx("bossSpawn", 0); }
  }
  // spawnBoss asks: should this boss arrive somewhere special?
  function bossSpot(kind) {
    if (kind !== "midlifeCrisis" || !home() || !window.MapleHollowGarage || st.burst) return null;
    return inside() ? MapleHollowGarage.park.slice() : driveway();
  }
  function onBossSpawn(scene, boss) {
    const g = window.MapleHollowGarage, C = G();
    if (boss.kind !== "midlifeCrisis" || !home() || !g || st.burst) return;
    st.burst = true;
    const wasInside = inside();
    if (g.parked && g.parked.active) g.parked.destroy();
    g.setOpen(true);
    scene.cameras.main.shake(420, 0.016);
    dust(scene, boss.x, boss.y + 30, 12);
    pop(scene, boss.x, boss.y - 120, "VROOOOOM!", "#C45C4B");
    if (window.showLowerThird) showLowerThird("alert", "THE GARAGE", wasInside ? C.burstLineInside : C.burstLine, 4500);
    if (window.Telemetry && Telemetry.event) Telemetry.event("garage-burst-" + (wasInside ? "inside" : "street"));
    boss.once("destroy", () => {
      if (typeof gameOver !== "undefined" && gameOver) return;
      setTimeout(() => { if (home() && window.showLowerThird && typeof gameOver !== "undefined" && !gameOver) showLowerThird("promo", "THE GARAGE", C.goneLine, 4500); }, 3500);
    });
  }
  function reset() { st = { teaseAt: 0, teased: false, burst: false }; }
  return { update, bossSpot, onBossSpawn, reset, state: () => Object.assign({}, st) };
})();
