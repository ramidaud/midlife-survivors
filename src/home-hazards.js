// Maple Hollow's toy-brick floor (Nov 9, step 4). Little patches of plastic bricks in the kid's room and on the lawn
// by your house. Step on one: a hit and a short limp, then that patch leaves you alone for a few seconds.
// Positions and numbers: MAPLE_HOLLOW.lego. Art: assets/stage/home/home-hazards-v1.png (row 0, 32x32 cells).
window.HomeHazards = (() => {
  let patches = null, objs = [];
  const L = () => (window.MAPLE_HOLLOW && MAPLE_HOLLOW.lego) || {};
  function tex(scene, d) {
    if (scene.textures.exists("mh_haz")) return ["mh_haz", d];
    const k = "lego_code"; if (!scene.textures.exists(k)) { // stand-in: four bright pegs
      const c = document.createElement("canvas"); c.width = 32; c.height = 32; const g = c.getContext("2d");
      [["#EF9347", 6, 10], ["#3E7775", 18, 16], ["#BFA8CF", 10, 22], ["#F2D7A1", 22, 6]].forEach(([col, x, y]) => { g.fillStyle = "#171C35"; g.fillRect(x - 1, y - 1, 8, 6); g.fillStyle = col; g.fillRect(x, y, 6, 4); });
      scene.textures.addCanvas(k, c);
    }
    return [k, 0];
  }
  function build(scene) {
    const C = L(), I = window.MAPLE_HOLLOW.interior;
    if (window.ArtSheets) ArtSheets.load(scene, "mh_haz", "assets/stage/home/home-hazards-v1.png", 32, 32);
    patches = [];
    (C.outdoor || []).forEach(([x, y, d]) => patches.push({ x, y, d, next: 0 }));
    const kx = I.x + I.roomW * 2, ky = I.y; // the kid's room is the third room (v1 only: in the big house it's upstairs, step 2)
    if (!I.h2) (C.kids || []).forEach(([x, y, d]) => patches.push({ x: kx + x, y: ky + y, d, next: 0 }));
    patches.forEach(p => { const [k, f] = tex(scene, p.d); p.img = scene.add.image(p.x, p.y, k, f).setScale(1.5).setDepth(2.55); objs.push(p.img); });
  }
  function update(scene) {
    if (window.STAGE_ID !== "home" || typeof player === "undefined" || !player || !player.active) return;
    if (!patches) build(scene);
    // the real art arrives a moment after the stand-ins: swap it in
    if (scene.textures.exists("mh_haz")) patches.forEach(p => { if (p.img.texture.key !== "mh_haz") p.img.setTexture("mh_haz", p.d); });
    const C = L(), px = player.x, py = player.y + player.height / 2;
    for (const p of patches) {
      if (runElapsedMs < p.next || Math.hypot(px - p.x, py - p.y) > (C.hitPx || 18)) continue;
      p.next = runElapsedMs + (C.cooldownMs || 3000);
      if (typeof hurtPlayer === "function") hurtPlayer(player, { kind: "lego", damage: C.damage || 1, x: p.x, y: p.y });
      if (typeof slowUntil !== "undefined") slowUntil = Math.max(slowUntil, runElapsedMs + (C.slowMs || 700));
      const t = scene.add.text(px, py - 70, Phaser.Utils.Array.GetRandom(C.lines || ["OUCH!"]), { fontFamily: "Silkscreen, monospace", fontSize: "14px", color: "#EF9347", stroke: "#171C35", strokeThickness: 4 }).setOrigin(0.5).setDepth(50004);
      scene.tweens.add({ targets: t, y: t.y - 20, alpha: 0, delay: 500, duration: 500, onComplete: () => t.destroy() });
      if (scene.textures.exists("mh_haz")) { p.img.setFrame(4); scene.time.delayedCall(400, () => p.img.active && p.img.setFrame(p.d)); }
      if (window.achEvent) achEvent("lego", {});
    }
  }
  function reset() { objs.forEach(o => o && o.active && o.destroy()); objs = []; patches = null; }
  return { update, reset, patches: () => patches && patches.map(p => ({ x: p.x, y: p.y })) };
})();
