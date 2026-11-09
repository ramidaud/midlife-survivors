// Boss defeat moment (Nov 4, Rami: "create a little animation for when the bosses go down ... more cinematic").
// Regular enemies keep the quick pop in src/juice.js. Bosses get: a slow-motion beat, a white flicker,
// a topple and sink, three bursts of confetti, and a rubber stamp across the screen. Words and timing below.
window.BOSS_DOWN = {
  slowMoMs: 700,        // real milliseconds of slow motion right after the hit
  slowMoFactor: 3,      // the world runs this many times slower during it
  chestDelayMs: 2000,   // game time before the boss chest starts coming to you
  stamps: {             // the stamp that slams down over the fallen boss
    performanceReview: "EXCEEDS EXPECTATIONS",
    mortgageRefinance: "PAID IN FULL",
    midlifeCrisis: "CRISIS AVERTED",
    goldWatch: "OFF THE CLOCK",
    hoaPresident: "VARIANCE APPROVED",
    retirementBoss: "AUDIT PASSED",
    pickleballChamp: "GAME, SET, MATCH",
    newBoss: "MEETING ADJOURNED",   // Nov 9 (Rami: "his defeat animation is kind of lame")
    holidayParty: "PARTY'S OVER",
    theReorg: "POSITION ELIMINATED"
  },
  // Nov 9: bosses without a drawn knockdown pose fall in their own "crash" frame and get a last word.
  lastWords: {
    newBoss: ["Let's... circle back... on me.", "Can we... take this offline?", "I need... a mental health day.", "Tell HR... I pivoted."],
    holidayParty: ["Who turned the lights on?", "Same time next year?", "I'll... get my coat."],
    theReorg: ["This was always the plan.", "Your new manager... is you.", "Effective... immediately..."]
  },
  defaultStamp: "DEFEATED"
};
window.BossDown = (() => {
  // ChatGPT art (Nov 4): one knockdown pose per boss (144x152, feet at y=148) and a russet stamp plate (9-slice).
  const KO_KEY = "boss_knockdown", KO_ORDER = ["performanceReview", "mortgageRefinance", "midlifeCrisis", "goldWatch", "hoaPresident", "retirementBoss", "pickleballChamp"];
  const PLATE_KEY = "stamp_plate";
  const KO2_KEY = "boss_knockdown2", KO2_ORDER = ["newBoss", "holidayParty", "theReorg"];
  function preload(scene) {
    if (!window.ArtSheets) return;
    ArtSheets.load(scene, KO_KEY, "assets/bosses/boss-knockdown-v1.png", 144, 152);
    ArtSheets.load(scene, KO2_KEY, "assets/bosses/boss-knockdown-new-office-v1.png", 144, 152); // Nov 9: New Boss, Holiday Party, Reorg
    ArtSheets.load(scene, PLATE_KEY, "assets/ui/stamp-plate-v1.png", 48, 24);
    ArtSheets.load(scene, "bonk_crack", "assets/bosses/bonk-crack-v1.png", 48, 48);   // wall bonk (src/boss-attacks.js)
    ArtSheets.load(scene, "dizzy_stars", "assets/bosses/dizzy-stars-v1.png", 16, 16); // 6 star frames + 2 bird frames
  }
  const reduced = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  let slowTimer = null;
  function play(scene, boss, color) {
    if (!scene || !scene.add) return;
    const C = window.BOSS_DOWN, calm = reduced();
    const v = boss.artRecord && boss.artRecord.visual && boss.artRecord.visual.active ? boss.artRecord.visual : boss;
    const x = v.x, y = v.y;
    // 1. A copy of the boss as it looked when it fell (the real one is removed right away).
    let body = null;
    if (v.texture && v.texture.key !== "__MISSING") {
      body = scene.add.image(x, y, v.texture.key, v.frame.name).setOrigin(v.originX, v.originY)
        .setScale(v.scaleX, v.scaleY).setFlipX(v.flipX).setDepth(50005).setTintFill(0xFFFFFF);
    }
    // 2. Slow motion for a beat, with a shake and a warm flash.
    if (!calm) {
      const w = scene.physics && scene.physics.world;
      if (w) { w.timeScale = C.slowMoFactor; clearTimeout(slowTimer); slowTimer = setTimeout(() => { if (w) w.timeScale = 1; }, C.slowMoMs); }
      scene.cameras.main.shake(380, 0.014);
      scene.cameras.main.flash(180, 255, 240, 207);
    }
    // 3. Flicker white, then topple over and sink away.
    if (body) {
      [90, 180, 270, 360, 450].forEach((t, i) => scene.time.delayedCall(t, () => { if (!body.active) return; if (i % 2) body.setTintFill(0xFFFFFF); else body.clearTint(); }));
      scene.time.delayedCall(520, () => {
        if (!body.active) return;
        body.clearTint();
        let ko = KO_ORDER.indexOf(boss.kind), koKey = KO_KEY;
        if (ko < 0 && KO2_ORDER.includes(boss.kind) && scene.textures.exists(KO2_KEY)) { ko = KO2_ORDER.indexOf(boss.kind); koKey = KO2_KEY; }
        if (ko >= 0 && scene.textures.exists(koKey)) { // drop into the knockdown pose: land with a squash, lie there dazed, then fade
          const feetY = v === boss ? y + (boss.displayHeight || 0) * 0.42 : y;
          body.setTexture(koKey, ko).setOrigin(0.5, 148 / 152).setPosition(x, feetY).setAngle(0).setFlipX(Math.random() < 0.5).setScale(calm ? 1 : 1.22, calm ? 1 : 0.72);
          if (typeof burstConfetti === "function") burstConfetti(scene, x, feetY - 10, 0xD3B78D, 12); // thud of dust
          if (!calm) scene.cameras.main.shake(140, 0.008);
          scene.tweens.add({ targets: body, scaleX: 1, scaleY: 1, duration: 280, ease: "Back.Out",
            onComplete: () => scene.tweens.add({ targets: body, alpha: 0, delay: 1300, duration: 550, ease: "Quad.In", onComplete: () => body.destroy() }) });
          return;
        }
        // Our own sheets (src/boss-art.js) have a crash/stagger pose at frame 10: fall in that instead of the walk frame.
        const tex = body.texture;
        if (tex && tex.frameTotal > 11 && tex.has && tex.has(10)) body.setFrame(10);
        const dir = Math.random() < 0.5 ? -1 : 1;
        scene.tweens.add({ targets: body, angle: dir * 78, x: x + dir * 18, y: y + 8, duration: calm ? 1 : 520, ease: "Back.In",
          onComplete: () => { if (typeof burstConfetti === "function") burstConfetti(scene, body.x, body.y, 0xD3B78D, 10); // it lands with a puff of dust
            scene.tweens.add({ targets: body, alpha: 0, y: body.y + 14, scaleY: body.scaleY * 0.7, delay: 260, duration: 520, ease: "Quad.In", onComplete: () => body.destroy() }); } });
      });
    }
    // 3b. A last word in a speech bubble, for the bosses that have one.
    const lines = C.lastWords && C.lastWords[boss.kind];
    if (lines && lines.length) {
      const say = scene.add.text(x + 34, y - 26, Phaser.Utils.Array.GetRandom(lines), { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35",
        backgroundColor: "#FFF0CF", padding: { x: 6, y: 4 } }).setOrigin(0, 1).setDepth(50009).setAlpha(0);
      { const vw = scene.cameras.main.worldView, m = 8; say.x = Math.max(vw.x + m, Math.min(say.x, vw.right - say.width - m)); } // keep it on screen
      scene.tweens.add({ targets: say, alpha: 1, delay: calm ? 0 : 560, duration: 160,
        onComplete: () => scene.tweens.add({ targets: say, alpha: 0, y: say.y - 10, delay: 1700, duration: 400, onComplete: () => say.destroy() }) });
    }
    // 3c. Your New Boss: his energy drinks, phone and lanyard go flying.
    if (boss.kind === "newBoss" && !calm) spill(scene, x, y);
    // 4. Confetti in three waves, in the boss's color and the game's orange and cream.
    if (typeof burstConfetti === "function") [0, 260, 620].forEach((t, i) => scene.time.delayedCall(t, () =>
      burstConfetti(scene, x + (i - 1) * 26, y - 30, [color || 0xEF9347, 0xEF9347, 0xF2D7A1][i], 18)));
    // 5. The stamp.
    const word = (C.stamps && C.stamps[boss.kind]) || C.defaultStamp;
    let stamp;
    if (scene.textures.exists(PLATE_KEY) && scene.add.nineslice) { // russet ink plate with the words stamped inside
      const txt = scene.add.text(0, 0, word, { fontFamily: "Silkscreen, monospace", fontSize: "22px", color: "#C45C4B", align: "center" }).setOrigin(0.5);
      const w = Math.ceil(txt.width) + 36, h = Math.ceil(txt.height) + 22;
      const paper = scene.add.rectangle(0, 0, w - 8, h - 8, 0xFFF0CF, 0.92);
      const plate = scene.add.nineslice(0, 0, PLATE_KEY, 0, w, h, 8, 8, 8, 8);
      stamp = scene.add.container(x, y - 130, [paper, plate, txt]).setDepth(50010).setAngle(-8).setAlpha(0).setScale(2.4);
    } else {
      stamp = scene.add.text(x, y - 130, word, {
        fontFamily: "Silkscreen, monospace", fontSize: "22px", color: "#C45C4B", backgroundColor: "#FFF0CFEE",
        padding: { x: 10, y: 6 }, align: "center", stroke: "#C45C4B", strokeThickness: 1
      }).setOrigin(0.5).setDepth(50010).setAngle(-8).setAlpha(0).setScale(2.4);
    }
    scene.time.delayedCall(calm ? 0 : 380, () => {
      if (!stamp.active) return;
      if (typeof sfx === "function") sfx("wordNo");
      scene.tweens.add({ targets: stamp, alpha: 1, scale: 1, duration: calm ? 1 : 160, ease: "Back.Out",
        onComplete: () => { if (!calm) scene.cameras.main.shake(120, 0.006);
          scene.tweens.add({ targets: stamp, alpha: 0, y: stamp.y - 18, delay: 1300, duration: 500, onComplete: () => stamp.destroy() }); } });
      // The score bonus this boss paid (src/main.js, LEADERBOARD.bossBonus), under the stamp.
      if (boss.scoreBonus) {
        const pts = scene.add.text(x, y - 92, "+" + boss.scoreBonus.toLocaleString() + " SCORE", { fontFamily: "Silkscreen, monospace", fontSize: "14px", color: "#FFF0CF", stroke: "#171C35", strokeThickness: 4 })
          .setOrigin(0.5).setDepth(50011).setAlpha(0);
        scene.tweens.add({ targets: pts, alpha: 1, y: pts.y + 4, delay: 220, duration: 200, ease: "Back.Out",
          onComplete: () => scene.tweens.add({ targets: pts, alpha: 0, y: pts.y - 14, delay: 1200, duration: 450, onComplete: () => pts.destroy() }) });
      }
    });
  }
  // Little flat-drawn props that pop out of the New Boss, arc up and bounce. No art needed.
  function spill(scene, x, y) {
    const key = "boss_spill_bits";
    if (!scene.textures.exists(key)) {
      const c = document.createElement("canvas"); c.width = 48; c.height = 16; const g = c.getContext("2d");
      g.fillStyle = "#171C35"; g.fillRect(0, 0, 10, 16); g.fillStyle = "#3E8E8A"; g.fillRect(1, 1, 8, 14); g.fillStyle = "#F2D7A1"; g.fillRect(1, 5, 8, 3); // can
      g.fillStyle = "#171C35"; g.fillRect(16, 1, 10, 15); g.fillStyle = "#303750"; g.fillRect(17, 2, 8, 13); g.fillStyle = "#8FA98A"; g.fillRect(18, 3, 6, 9); // phone
      g.fillStyle = "#EF9347"; g.fillRect(32, 0, 2, 9); g.fillRect(44, 0, 2, 9); g.fillRect(34, 8, 10, 2); g.fillStyle = "#F2D7A1"; g.fillRect(35, 9, 8, 7); g.fillStyle = "#171C35"; g.fillRect(36, 11, 6, 1); // lanyard + badge
      scene.textures.addCanvas(key, c);
      const t = scene.textures.get(key); t.add(0, 0, 0, 0, 10, 16); t.add(1, 0, 16, 0, 10, 16); t.add(2, 0, 32, 0, 16, 16);
    }
    [0, 0, 1, 2, 0].forEach((f, i) => {
      const o = scene.add.image(x, y - 20, key, f).setDepth(50006).setScale(2);
      const dx = (i - 2) * Phaser.Math.Between(26, 40) + Phaser.Math.Between(-8, 8), up = Phaser.Math.Between(70, 120), land = y + Phaser.Math.Between(10, 34);
      scene.tweens.add({ targets: o, x: x + dx, duration: 700, ease: "Linear" });
      scene.tweens.add({ targets: o, y: y - 20 - up, duration: 300, ease: "Quad.Out",
        onComplete: () => scene.tweens.add({ targets: o, y: land, duration: 400, ease: "Bounce.Out",
          onComplete: () => scene.tweens.add({ targets: o, alpha: 0, delay: 1400, duration: 500, onComplete: () => o.destroy() }) }) });
      scene.tweens.add({ targets: o, angle: Phaser.Math.Between(-540, 540), duration: 700 });
    });
  }
  function reset() { clearTimeout(slowTimer); }
  return { preload, play, reset };
})();
