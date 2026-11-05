// Remains (Nov 4, Rami: "have the enemies leave some sort of trace behind after defeat").
// A little pile of scraps in the enemy's color lands where it fell, sits for a while, then fades away.
// Numbers live in window.REMAINS below. Capped so a big swarm never slows a phone down.
window.REMAINS = {
  lifeMs: 9000,      // how long a pile stays before it starts fading
  fadeMs: 2500,      // how long the fade takes
  max: 60,           // the oldest pile goes first past this many
  alpha: 0.85,
  bossScale: 2.2     // bosses leave a bigger mess
};
window.Remains = (() => {
  const piles = [];
  // ChatGPT's remains sheet (Nov 4): 10 enemies x 3 variants, final colors, no tint. Others fall back to tinted scraps.
  const ART_KEY = "remains_art", ROWS = ["bill", "lateFee", "spamCall", "snackAttack", "backTwinge", "officeGossip", "threeAmThought", "calendarInvite", "groupChat", "mathWorksheet"];
  function preload(scene) { if (window.ArtSheets) ArtSheets.load(scene, ART_KEY, "assets/enemies/remains-v1.png", 32, 20); }
  const VARIANTS = 4, NAVY = "#171C35";
  // White scraps with a navy outline. The enemy's color is applied as a tint, so one set of textures fits everyone.
  function makeTextures(scene) {
    for (let v = 0; v < VARIANTS; v++) {
      const key = "remains_" + v;
      if (scene.textures.exists(key)) continue;
      const c = document.createElement("canvas"); c.width = 28; c.height = 18;
      const g = c.getContext("2d"); let h = 2166136261 ^ (v * 7919);
      const rnd = () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; };
      const bits = 5 + v;
      for (let i = 0; i < bits; i++) {
        const w = 2 + Math.floor(rnd() * 4), ht = 2 + Math.floor(rnd() * 3);
        const x = 2 + Math.floor(rnd() * (24 - w)), y = 2 + Math.floor(rnd() * (14 - ht));
        g.fillStyle = NAVY; g.fillRect(x - 1, y - 1, w + 2, ht + 2);
        g.fillStyle = "#FFFFFF"; g.fillRect(x, y, w, ht);
        if (w > 3) { g.fillStyle = "#D9D9D9"; g.fillRect(x, y + ht - 1, w, 1); } // a hint of shade
      }
      scene.textures.addCanvas(key, c);
    }
  }
  function add(scene, x, y, color, isBoss, kind) {
    if (!scene || !scene.add) return;
    const R = window.REMAINS;
    while (piles.length >= R.max) { const old = piles.shift(); if (old && old.active) old.destroy(); }
    const row = ROWS.indexOf(kind), art = row >= 0 && scene.textures.exists(ART_KEY);
    let o;
    if (art) { // real debris art, in its own colors
      o = scene.add.image(Math.round(x), Math.round(y + 10), ART_KEY, row * 3 + Math.floor(Math.random() * 3))
        .setDepth(2.3).setAlpha(R.alpha).setScale(isBoss ? R.bossScale : 1).setFlipX(Math.random() < 0.5);
    } else {
      makeTextures(scene);
      o = scene.add.image(Math.round(x), Math.round(y + 10), "remains_" + Math.floor(Math.random() * VARIANTS))
        .setDepth(2.3).setAlpha(R.alpha).setTint(color || 0xF2D7A1)
        .setScale((isBoss ? R.bossScale : 1) * (0.9 + Math.random() * 0.3)).setFlipX(Math.random() < 0.5);
    }
    o.bornAt = scene.time.now;
    piles.push(o);
    scene.tweens.add({ targets: o, alpha: 0, delay: R.lifeMs, duration: R.fadeMs, onComplete: () => { o.destroy(); const i = piles.indexOf(o); if (i >= 0) piles.splice(i, 1); } });
  }
  function reset() { piles.splice(0).forEach(o => o && o.active && o.destroy()); }
  return { preload, add, reset, count: () => piles.length };
})();
