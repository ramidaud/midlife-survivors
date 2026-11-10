// Big boss art (ChatGPT, Nov 2): native 144x152 frames, already full size (do not scale them up again).
// The physics sprite stays invisible; this draws the boss and picks a pose from what it's doing.
window.BossArt = (() => {
  const FILES = {
    performanceReview: "assets/bosses/boss-performance-review-v1.png",
    mathHomework: "assets/bosses/boss-math-homework-v1.png", // Nov 10, Maple Hollow at 45
    newBoss: "assets/bosses/boss-new-boss-v1.png", // Nov 9
    holidayParty: "assets/bosses/boss-holiday-party-v1.png",
    theReorg: "assets/bosses/boss-reorg-v1.png",
    mortgageRefinance: "assets/bosses/boss-30-year-mortgage-v1.png",
    midlifeCrisis: "assets/bosses/boss-midlife-crisis-v8-v1.png",
    goldWatch: "assets/bosses/boss-gold-watch-v1.png",
    // Full Life bosses (ChatGPT, Nov 4)
    hoaPresident: "assets/bosses/boss-hoa-president-v1.png",
    retirementBoss: "assets/bosses/boss-retirement-audit-v1.png",
    pickleballChamp: "assets/bosses/boss-pickleball-champ-v1.png"
  };
  const MARKERS = {
    performanceReview: ["assets/bosses/telegraph-performance-review-v1.png", 256, 128],
    newBoss: ["assets/bosses/telegraph-new-boss-v1.png", 256, 128],
    holidayParty: ["assets/bosses/telegraph-holiday-party-v1.png", 192, 128],
    theReorg: ["assets/bosses/telegraph-reorg-v1.png", 256, 128],
    mortgageRefinance: ["assets/bosses/telegraph-30-year-mortgage-v1.png", 192, 128],
    midlifeCrisis: ["assets/bosses/telegraph-midlife-crisis-v8-v1.png", 256, 128],
    goldWatch: ["assets/bosses/telegraph-gold-watch-v1.png", 256, 128],
    hoaPresident: ["assets/bosses/telegraph-hoa-president-v1.png", 256, 128],
    retirementBoss: ["assets/bosses/telegraph-retirement-audit-v1.png", 192, 128],
    pickleballChamp: ["assets/bosses/telegraph-pickleball-champ-v1.png", 256, 128]
  };
  const ORIGIN_Y = 148 / 152; // the foot point
  // The friendly retirement punch clock at 65 (ChatGPT, Nov 4). Row 0 waits (160 ms), row 1 clocks out once (110 ms) and holds.
  const CLOCK_OUT = "assets/bosses/clock-out-goal-v1.png";
  // Father Time at 100 (ChatGPT, Nov 4): same layout, row 0 waits, row 1 shakes your hand. Feet at y148.
  const FATHER_TIME = "assets/bosses/father-time-v1.png";
  function preload(scene) {
    ArtSheets.load(scene, "bossart_clockOut", CLOCK_OUT, 144, 152);
    ArtSheets.load(scene, "bossart_fatherTime", FATHER_TIME, 144, 152);
    for (const [k, f] of Object.entries(FILES)) ArtSheets.load(scene, "bossart_" + k, f, 144, 152);
    if (window.MathHomework) MathHomework.preload(scene); // paper airplanes and friends
    for (const [k, [f, w, h]] of Object.entries(MARKERS)) ArtSheets.load(scene, "bossmark_" + k, f, w, h);
  }
  // state: chase | telegraph | attack | recover
  function sync(scene, boss, state, now) {
    if (!boss || !boss.active || !boss.scene) return; // never redraw a boss that was just defeated (Nov 4: the frozen Performance Review)
    const father = boss.clockOut && boss.kind === "theReaper" && !(window.modeCfg && modeCfg().endBossLabel);
    const key = boss.clockOut ? (father ? "bossart_fatherTime" : "bossart_clockOut") : "bossart_" + boss.kind;
    if ((!boss.clockOut && !FILES[boss.kind]) || !scene.textures.exists(key)) return;
    let v = boss._art;
    if (!v || !v.active) {
      v = boss._art = scene.add.sprite(boss.x, boss.y, key, 0).setOrigin(0.5, boss.clockOut && !father ? 151 / 152 : ORIGIN_Y);
      boss.artRecord = { visual: v }; // death pop and hit squash use the drawn boss
      boss.once("destroy", () => { if (v.active) v.destroy(); if (boss._mark) boss._mark.destroy(); });
    }
    boss.setVisible(false);
    const feetY = boss.y + boss.displayHeight * 0.42;
    if (boss.clockOut) { // stands still, never flips or flashes
      const f = boss.punchAt ? 6 + Math.min(5, Math.floor((now - boss.punchAt) / 110)) : Math.floor(now / 160) % 6;
      v.setFrame(f).setPosition(Math.round(boss.x), Math.round(feetY)).setDepth(boss.depth + 0.5);
      return;
    }
    let frame;
    if (state === "stagger" || state === "crash") frame = 10; // bonked into a wall (or a sugar crash): the hurt pose
    else if (state === "winded") frame = 9; // catching his breath after a dash chain: thumbs up
    else if (boss.hitAt && now - boss.hitAt < 160 && state === "chase") frame = 10;
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
    // Wall bonk (src/boss-attacks.js): splat flat against the wall, then spring back with a jiggle.
    if (state === "stagger" && boss._bonkAt != null) {
      const t = now - boss._bonkAt; let f = 0;
      if (t < 90) f = 0.42 * (t / 90);
      else if (t < 900) f = 0.42 * Math.exp(-(t - 90) / 170) * Math.cos((t - 90) / 45);
      if (f) { const a = 1 - f, b = 1 + f * 0.7; if (boss._bonkFlat === "x") v.setScale(a, b); else v.setScale(b, a); }
    }
    v.setAngle(boss._wobble || 0);
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
