// Hit, death and movement effects ("juice"): the little things that make a fight feel good. (Nov 2)
// Tweak the numbers in JUICE below. All of this is visual only: nothing here changes damage or hit boxes.
window.JUICE = {
  knockback: 7,        // pixels a regular enemy gets shoved when hit (bosses: a third of this)
  deathPop: true,      // enemies flash, squash and pop instead of vanishing
  ring: true,          // a quick shockwave ring on each kill
  maxEffects: 45,      // cap on death effects at once, so huge fights stay smooth
  dust: true,          // little dust puffs at your feet while you walk
  dustEveryMs: 120
};

window.Juice = (() => {
  let live = 0, lastDust = 0;

  // A hit: squash the drawn sprite (enemy-art reads hitAt) and shove the enemy away from you a little.
  function hit(scene, e, player, now) {
    e.hitAt = now;
    if (!player || !e.body) return;
    const dx = e.x - player.x, dy = e.y - player.y, d = Math.hypot(dx, dy) || 1;
    const k = (JUICE.knockback || 0) * (e.isBoss ? 0.33 : 1);
    if (window.shoveEnemy) shoveEnemy(e, dx / d, dy / d, k); // stops at walls (never through them)
  }

  // A kill: a white flash, a squash, then a stretch-and-pop up and away, plus a shockwave ring.
  function death(scene, e) {
    if (!JUICE.deathPop || live >= JUICE.maxEffects) return;
    const v = e.artRecord && e.artRecord.visual && e.artRecord.visual.visible ? e.artRecord.visual : e;
    if (!v.texture) return;
    live++;
    const sx = Math.abs(v.scaleX), sy = Math.abs(v.scaleY), big = e.isBoss ? 1.6 : 1;
    const img = scene.add.image(e.x, e.y, v.texture.key, v.frame.name)
      .setScale(sx, sy).setFlipX(v.flipX).setDepth((v.depth || 4) + 0.5).setTintFill(0xffffff);
    scene.tweens.add({
      targets: img, scaleX: sx * 1.35 * big, scaleY: sy * 0.62, duration: 70, ease: "Quad.Out",
      onComplete: () => {
        if (!img.active) { live--; return; }
        img.clearTint();
        scene.tweens.add({
          targets: img, scaleX: sx * 0.25, scaleY: sy * 1.5 * big, y: img.y - 16 * big, alpha: 0,
          angle: (Math.random() < 0.5 ? -1 : 1) * (12 + Math.random() * 20),
          duration: 200, ease: "Quad.In",
          onComplete: () => { img.destroy(); live--; }
        });
      }
    });
    if (JUICE.ring) {
      const r = Math.max(10, (e.displayWidth || 30) * 0.45);
      const ring = scene.add.circle(e.x, e.y, r).setStrokeStyle(e.isBoss ? 4 : 2, 0xffffff, 0.85).setDepth((v.depth || 4) + 0.4);
      scene.tweens.add({ targets: ring, scale: e.isBoss ? 3.2 : 2.1, alpha: 0, duration: e.isBoss ? 420 : 230, ease: "Quad.Out", onComplete: () => ring.destroy() });
    }
  }

  // Dust puffs at your feet while you walk.
  function step(scene, player, moving, now, hero) {
    if (now < lastDust) lastDust = 0; // new run
    if (!JUICE.dust || !moving || now - lastDust < JUICE.dustEveryMs) return;
    lastDust = now;
    const feetY = player.y + (player.height || 52) / 2 - 2;
    const puff = scene.add.circle(player.x + (Math.random() * 10 - 5), feetY, 3 + Math.random() * 2, 0xd8c7a3, 0.55)
      .setDepth((hero && hero.depth ? hero.depth : 5) - 0.2);
    scene.tweens.add({ targets: puff, scale: 2, alpha: 0, y: feetY - 5, duration: 380, ease: "Quad.Out", onComplete: () => puff.destroy() });
  }

  return { hit, death, step };
})();
