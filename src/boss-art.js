// Big boss art (ChatGPT, Nov 2): native 144x152 frames, already full size (do not scale them up again).
// The physics sprite stays invisible; this draws the boss and picks a pose from what it's doing.
window.BossArt = (() => {
  const FILES = {
    performanceReview: "assets/bosses/boss-performance-review-v1.png",
    mortgageRefinance: "assets/bosses/boss-30-year-mortgage-v1.png",
    midlifeCrisis: "assets/bosses/boss-midlife-crisis-v8-v1.png",
    goldWatch: "assets/bosses/boss-gold-watch-v1.png"
  };
  const MARKERS = {
    performanceReview: ["assets/bosses/telegraph-performance-review-v1.png", 256, 128],
    mortgageRefinance: ["assets/bosses/telegraph-30-year-mortgage-v1.png", 192, 128],
    midlifeCrisis: ["assets/bosses/telegraph-midlife-crisis-v8-v1.png", 256, 128],
    goldWatch: ["assets/bosses/telegraph-gold-watch-v1.png", 256, 128]
  };
  const ORIGIN_Y = 148 / 152; // the foot point
  function preload(scene) {
    for (const [k, f] of Object.entries(FILES)) ArtSheets.load(scene, "bossart_" + k, f, 144, 152);
    for (const [k, [f, w, h]] of Object.entries(MARKERS)) ArtSheets.load(scene, "bossmark_" + k, f, w, h);
  }
  // state: chase | telegraph | attack | recover
  function sync(scene, boss, state, now) {
    const key = "bossart_" + boss.kind;
    if (!FILES[boss.kind] || !scene.textures.exists(key)) return;
    let v = boss._art;
    if (!v || !v.active) {
      v = boss._art = scene.add.sprite(boss.x, boss.y, key, 0).setOrigin(0.5, ORIGIN_Y);
      boss.artRecord = { visual: v }; // death pop and hit squash use the drawn boss
      boss.once("destroy", () => { if (v.active) v.destroy(); if (boss._mark) boss._mark.destroy(); });
    }
    boss.setVisible(false);
    const feetY = boss.y + boss.displayHeight * 0.42;
    let frame;
    if (boss.hitAt && now - boss.hitAt < 160 && state === "chase") frame = 10;
    else if (state === "telegraph") frame = 6 + (Math.floor(now / 220) % 2);
    else if (state === "attack") frame = 8 + (Math.floor(now / 130) % 2);
    else frame = Math.floor(now / 140) % 6;
    v.setFrame(frame).setPosition(Math.round(boss.x), Math.round(feetY)).setDepth(boss.depth + 0.5);
    const vx = boss.body ? boss.body.velocity.x : 0;
    if (Math.abs(vx) > 5) v.setFlipX(vx < 0);
    if (boss.isTinted && state === "chase") { if (boss.tintFill) v.setTintFill(boss.tintTopLeft); else v.setTint(boss.tintTopLeft); } else v.clearTint();
    // squash on hit, like regular enemies
    const k = boss.hitAt ? (now - boss.hitAt) / 120 : 1;
    if (k >= 0 && k < 1) { const w = Math.sin(Math.PI * k); v.setScale(1 + 0.12 * w, 1 - 0.1 * w); } else v.setScale(1);
  }
  // Floor decal under a telegraph: placed and rotated by the attack code.
  function marker(scene, boss, x, y, angle, sx, sy, alpha) {
    const key = "bossmark_" + boss.kind;
    if (!scene.textures.exists(key)) return;
    if (!boss._mark || !boss._mark.active) boss._mark = scene.add.image(x, y, key, 0).setDepth(3);
    boss._mark.setVisible(alpha > 0).setPosition(x, y).setRotation(angle).setScale(sx, sy).setAlpha(alpha);
  }
  function hideMarker(boss) { if (boss._mark) boss._mark.setVisible(false); }
  return { preload, sync, marker, hideMarker };
})();
