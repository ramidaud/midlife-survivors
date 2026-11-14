// Push waves (Nov 14, Rami: "extra large waves of easy enemies mixed with a couple tougher ones that kind of push
// you towards a recently opened area"). When an area in Maple Hollow opens, a wide wall of easy enemies comes in from
// the side away from it, with a couple of tough ones in the middle, so the easy way out is toward the new area.
// Settings: AREA_PUSH below. src/maple-hollow.js calls AreaPush.opened(scene, area).
window.AREA_PUSH = {
  on: true,
  delayMs: 2500,          // after the woods fade, so you see the new area first
  easyCount: 34,          // the wall of easy ones...
  easyPerYear: 0.8,       // ...plus this many per year past 40
  tough: 2,               // a couple of tougher ones in the middle of the wall
  arc: 2.4,               // how wide the wall wraps around you (radians), centered on the side away from the area
  easyHpMult: 0.6,        // the easy ones go down fast: it's a push, not a wall you have to chew through
  badge: "MOVING DAY",
  text: area => "Everyone's headed your way. " + area + " just opened."
};

window.AreaPush = (() => {
  const C = () => window.AREA_PUSH || {};
  function pick(n, cmp) { // roll the stage's normal enemy mix a few times and keep the easiest (or toughest)
    let best = null;
    for (let i = 0; i < n; i++) { const k = typeof rollWaveKind === "function" ? rollWaveKind() : "bill"; if (!ENEMIES[k]) continue; if (!best || cmp(ENEMIES[k].hp, ENEMIES[best].hp)) best = k; }
    return best || "bill";
  }
  // a spot in the woods or a wall is refused, so try a little closer, farther, or to either side
  function place(scene, kind, a, r) {
    for (const [da, k] of [[0, 1], [0, 0.8], [0, 1.25], [0.25, 1], [-0.25, 1], [0.5, 0.9], [-0.5, 0.9]]) {
      const e = createEnemy(scene, kind, player.x + Math.cos(a + da) * r * k, player.y + Math.sin(a + da) * r * k);
      if (e) return e;
    }
    return null;
  }
  function opened(scene, area) {
    const c = C(); if (!c.on || typeof player === "undefined" || !player) return;
    scene.time.delayedCall(c.delayMs, () => {
      if (typeof gameOver !== "undefined" && gameOver) return;
      if (typeof bills !== "undefined" && bills.getChildren().some(b => b.active && b.isBoss)) return; // never on top of a boss fight
      const [x0, y0, w, h] = area.rect, ax = x0 + w / 2, ay = y0 + h / 2;
      const toArea = Math.atan2(ay - player.y, ax - player.x), away = toArea + Math.PI;
      const view = scene.cameras.main.worldView, r = Math.hypot(view.width, view.height) / 2 + 90;
      let made = 0;
      const n = Math.round(c.easyCount + Math.max(0, currentAge - 40) * c.easyPerYear), easy = pick(4, (a, b) => a < b), toughK = pick(6, (a, b) => a > b);
      for (let i = 0; i < n; i++) {
        const a = away + (i / Math.max(1, n - 1) - 0.5) * c.arc, rr = r + (i % 3) * 40;
        const e = place(scene, easy, a, rr); if (e) made++;
        if (e) e.hp = Math.max(1, Math.round(e.hp * c.easyHpMult));
      }
      for (let i = 0; i < c.tough; i++) place(scene, toughK, away + (i - (c.tough - 1) / 2) * 0.35, r + 60);
      AreaPush.last = { asked: n, made, at: currentAge };
      if (window.showLowerThird) window.showLowerThird("alert", c.badge, c.text(area.name || "A new area"), 4500);
      if (typeof sfx === "function") sfx("bossSpawn");
    });
  }
  return { opened, last: null };
})();
