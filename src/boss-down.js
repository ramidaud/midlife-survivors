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
    pickleballChamp: "GAME, SET, MATCH"
  },
  defaultStamp: "DEFEATED"
};
window.BossDown = (() => {
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
        const dir = Math.random() < 0.5 ? -1 : 1;
        scene.tweens.add({ targets: body, angle: dir * 78, x: x + dir * 18, y: y + 8, duration: calm ? 1 : 520, ease: "Back.In",
          onComplete: () => { if (typeof burstConfetti === "function") burstConfetti(scene, body.x, body.y, 0xD3B78D, 10); // it lands with a puff of dust
            scene.tweens.add({ targets: body, alpha: 0, y: body.y + 14, scaleY: body.scaleY * 0.7, delay: 260, duration: 520, ease: "Quad.In", onComplete: () => body.destroy() }); } });
      });
    }
    // 4. Confetti in three waves, in the boss's color and the game's orange and cream.
    if (typeof burstConfetti === "function") [0, 260, 620].forEach((t, i) => scene.time.delayedCall(t, () =>
      burstConfetti(scene, x + (i - 1) * 26, y - 30, [color || 0xEF9347, 0xEF9347, 0xF2D7A1][i], 18)));
    // 5. The stamp.
    const word = (C.stamps && C.stamps[boss.kind]) || C.defaultStamp;
    const stamp = scene.add.text(x, y - 60, word, {
      fontFamily: "Silkscreen, monospace", fontSize: "22px", color: "#C45C4B", backgroundColor: "#FFF0CFEE",
      padding: { x: 10, y: 6 }, align: "center", stroke: "#C45C4B", strokeThickness: 1
    }).setOrigin(0.5).setDepth(50010).setAngle(-8).setAlpha(0).setScale(2.4);
    scene.time.delayedCall(calm ? 0 : 380, () => {
      if (!stamp.active) return;
      if (typeof sfx === "function") sfx("wordNo");
      scene.tweens.add({ targets: stamp, alpha: 1, scale: 1, duration: calm ? 1 : 160, ease: "Back.Out",
        onComplete: () => { if (!calm) scene.cameras.main.shake(120, 0.006);
          scene.tweens.add({ targets: stamp, alpha: 0, y: stamp.y - 18, delay: 1300, duration: 500, onComplete: () => stamp.destroy() }); } });
    });
  }
  function reset() { clearTimeout(slowTimer); }
  return { play, reset };
})();
