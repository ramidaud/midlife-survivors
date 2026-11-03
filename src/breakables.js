// Smashable office props (Nov 2): printers, cabinets, vending machines and more crack, then break for loot.
// Numbers and jokes: src/data/breakables.js. The broken pile stays on the floor (you can walk over it),
// then the prop is put back together after a while. Enemies path around intact props and over broken ones.
window.Breakables = (() => {
  let lastLine = -1e9, scanAt = 0;
  const B = () => window.BREAKABLES || { props: {}, lines: {} };
  const key = id => "brk_" + id, debrisKey = id => "brkd_" + id;

  function preload(scene) {
    for (const [id, P] of Object.entries(B().props)) {
      ArtSheets.load(scene, key(id), `assets/breakables/${id}-states-v1.png`, P.w, P.h);
      ArtSheets.load(scene, debrisKey(id), `assets/breakables/${id}-debris-v1.png`, 16, 16);
    }
  }

  // Find start-area props that can break and tag them (runs now and then, since the room builds in the background).
  function scan(scene, now) {
    if (scanAt - now > 1000) { scanAt = 0; lastLine = -1e9; } // new run: the run clock went back to 0
    if (now < scanAt || !window.propGroup) return; scanAt = now + 1000;
    propGroup.getChildren().forEach(o => {
      if (o.brk !== undefined || !o.sliceMeta) return;
      const id = o.sliceMeta.prop, P = B().props[id];
      if (!P || !scene.textures.exists(key(id))) { if (!P) o.brk = null; return; }
      const row = Math.max(0, Math.min(P.rows - 1, o.sliceMeta.variant || 0));
      o.brk = { id, row, hp: P.hp, max: P.hp, state: 0 };
      o.setTexture(key(id), row * 3);
    });
  }

  const isSmashable = o => !!(o && o.active && ((o.brk && o.brk.state < 2) || (!o.brk && o.propKind === "prop_plant" && o.visible)));

  function damage(scene, o, amount, now) {
    const b = o.brk; if (!b || b.state >= 2) return;
    b.hp -= amount;
    o.hitAt = now;
    o.setTintFill(0xffffff); scene.time.delayedCall(60, () => { if (o.active) o.clearTint(); });
    const sx = o.scaleX, sy = o.scaleY;
    scene.tweens.add({ targets: o, scaleX: sx * 1.1, scaleY: sy * 0.92, duration: 55, yoyo: true, onComplete: () => { if (o.active) o.setScale(sx, sy); } });
    if (b.hp <= 0) return smash(scene, o, now);
    sfx("hit");
    if (b.state === 0 && b.hp <= b.max / 2) { b.state = 1; o.setFrame(b.row * 3 + 1); debris(scene, o, 2); }
  }

  function smash(scene, o, now) {
    const b = o.brk, P = B().props[b.id];
    b.state = 2; o.setFrame(b.row * 3 + 2);
    if (o.body) { o.body.enable = false; }
    sfx("billPaid", 0);
    debris(scene, o, 6);
    if (window.burstConfetti) burstConfetti(scene, o.x, o.y - P.h * 0.4, 0xf2d7a1, 8);
    if (b.id === "plant") { if (o.cellKey && window.smashedPlants) smashedPlants.add(o.cellKey); window.achEvent && achEvent("plant"); }
    loot(scene, o, P.loot || {});
    const lines = B().lines[b.id];
    if (lines && now - lastLine > (B().linesEveryMs || 7000) && window.showLowerThird) {
      lastLine = now; window.showLowerThird("lore", "SMASHED", lines[Math.floor(Math.random() * lines.length)], 4200);
    }
    const back = () => {
      if (!o.active) return;
      if (Phaser.Math.Distance.Between(o.x, o.y, player.x, player.y) < 110) { scene.time.delayedCall(3000, back); return; }
      b.state = 0; b.hp = b.max; o.setFrame(b.row * 3);
      if (o.body) { o.body.enable = true; if (o.body.updateFromGameObject) o.body.updateFromGameObject(); }
      if (o.cellKey && window.smashedPlants) smashedPlants.delete(o.cellKey);
      const sx = o.scaleX, sy = o.scaleY; o.setScale(sx, sy * 0.2);
      scene.tweens.add({ targets: o, scaleY: sy, duration: 380, ease: "Back.Out" });
    };
    scene.time.delayedCall(B().regrowMs || 90000, back);
  }

  function loot(scene, o, L) {
    const y = o.y - 10;
    if (L.pizza && Math.random() < L.pizza && window.pizzas) window.pizzas.create(o.x - 8, y, "pizza").setDepth(3);
    for (let i = 0; i < (L.coins || 0); i++) spawnCoin(o.x + (i - (L.coins - 1) / 2) * 12, y + 8, 1);
    for (let i = 0; i < (L.gems || 0); i++) gems.create(o.x + Phaser.Math.Between(-18, 18), y + Phaser.Math.Between(-6, 10), "gem").setDepth(3);
    if (L.item && Math.random() < L.item && typeof spawnFieldItem === "function") spawnFieldItem(scene, o.x, y + 16);
  }

  // Little pieces fly out and land on the floor, then fade.
  function debris(scene, o, n) {
    const b = o.brk, k = debrisKey(b.id); if (!scene.textures.exists(k)) return;
    const P = B().props[b.id], cy = o.y - P.h * 0.45;
    for (let i = 0; i < n; i++) {
      const piece = scene.add.image(o.x, cy, k, b.row * 6 + (i % 6)).setDepth((o.depth || 4) + 1);
      const ang = Math.random() * Math.PI * 2, dist = 24 + Math.random() * 40;
      scene.tweens.add({ targets: piece, x: o.x + Math.cos(ang) * dist, y: o.y + Math.sin(ang) * dist * 0.5 - 4, angle: Phaser.Math.Between(-200, 200), duration: 320, ease: "Quad.Out",
        onComplete: () => scene.tweens.add({ targets: piece, alpha: 0, delay: 900, duration: 500, onComplete: () => piece.destroy() }) });
    }
  }

  return { preload, scan, damage, isSmashable };
})();
