// The Interns, part 1: deliveries (Nov 3). Settings and lines live in src/data/interns.js.
// Every so often an intern (TJ or Derek) walks over with a snack, a coffee, a focus boost or a gem run.
// They can't be hit, they don't block anything, and if a Bill bumps them they run off.
// main.js calls Interns.reset() at run start and Interns.update(scene, now) every frame.
window.Interns = (() => {
  const C = () => window.INTERNS || {};
  const D = () => C().delivery || {};
  let intern = null, nextAt = 0, rosterIdx = 0, recentHeals = [];
  const SPRITE_W = 24, SPRITE_H = 36, SCALE = 1.6;

  // Placeholder pixel intern (until ChatGPT draws the real ones): lanyard, rolled sleeves, coffee in hand.
  function texture(scene, r) {
    const key = "intern_" + r.id;
    if (scene.textures.exists(key + "_0")) return key;
    for (let f = 0; f < 2; f++) {
      const t = scene.textures.createCanvas(key + "_" + f, SPRITE_W, SPRITE_H), c = t.getContext();
      const px = (col, x, y, w, h) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
      const step = f ? 1 : 0;
      px("rgba(0,0,0,0.3)", 6, 33, 12, 2);                                   // shadow
      px("#171C35", 7, 26, 4, 8 - step); px("#171C35", 13, 26, 4, 7 + step);  // legs (outline)
      px(r.pants || "#303750", 8, 26, 2, 6 - step); px(r.pants || "#303750", 14, 26, 2, 5 + step);  // pants
      px("#171C35", 5, 13, 14, 14);                                         // torso outline
      px(r.shirt, 6, 14, 12, 12);                                           // shirt
      px("#F2D7A1", 11, 14, 2, 8); px("#FFF0CF", 10, 21, 4, 3);             // lanyard + badge
      px("#171C35", 7, 2, 10, 12);                                          // head outline
      px(r.skin, 8, 4, 8, 9);                                               // face
      px(r.hair, 7, 1, 10, 4); px(r.hair, 7, 4, 2, 3);                      // hair
      px("#171C35", 10, 8, 1, 1); px("#171C35", 13, 8, 1, 1);               // eyes
      if (r.beanie) { px(r.hair, 7, 0, 10, 5); px("#FFF0CF", 10, 3, 4, 1); }  // beanie with a little patch
      if (r.glasses) { px("#171C35", 9, 7, 3, 1); px("#171C35", 12, 7, 3, 1); px("#171C35", 9, 8, 1, 1); px("#171C35", 14, 8, 1, 1); }
      if (r.beard) { px(r.hair, 8, 10, 8, 3); px(r.skin, 10, 10, 4, 1); }
      px("#171C35", 18, 15, 5, 7); px("#FFF0CF", 19, 16, 3, 5); px("#EF9347", 19, 16, 3, 1); // coffee cup
      px(r.skin, 17, 18, 2, 2);                                             // hand
      t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    return key;
  }

  // Real art (ChatGPT, Nov 3): 448x300 sheets of 56x60 cells. Rows 0-3 walk down/up/left/right (8 frames),
  // row 4 columns 0-3 the counter pose. Feet sit at y56. Until they load, the placeholder above is used.
  function preload(scene) {
    (C().roster || []).forEach(r => { if (r.sheet && window.ArtSheets) ArtSheets.load(scene, "intern2_" + r.id, r.sheet, 56, 60); });
  }
  const hasSheet = (scene, r) => scene.textures.exists("intern2_" + r.id);

  function cadence(age) {
    const rows = D().cadenceByAge || [[40, 60000]];
    let ms = rows[0][1];
    rows.forEach(([a, v]) => { if (age >= a) ms = v; });
    const j = D().jitterFrac || 0;
    return ms * (1 - j + Math.random() * 2 * j);
  }

  function reset() {
    if (intern) despawn(true);
    intern = null; recentHeals = [];
    nextAt = (D().armAfterMs || 45000) + Math.random() * 10000;
  }

  function bossAlive() { return typeof bills !== "undefined" && bills.getChildren().some(b => b.active && b.isBoss); }
  function suppressed() {
    if (!C().enabled) return true;
    if (typeof levelUpOpen !== "undefined" && levelUpOpen) return true;
    if (typeof paused !== "undefined" && paused) return true;
    if (typeof gameOver !== "undefined" && gameOver) return true;
    if (bossAlive()) return true;
    if (typeof dyn !== "undefined" && dyn.comfortUntil > runElapsedMs) return true; // Comfort Zone Tax active
    if (window.Lounge && Lounge.isBrowsing && Lounge.isBrowsing()) return true;
    return false;
  }

  function pickPayload() {
    const P = D().payloads || {};
    const heavy = typeof hp !== "undefined" && hp / stats.maxHp >= ((window.HEALING && HEALING.budget && HEALING.budget.skipInternAboveHpFrac) || 0.75);
    const budget = (window.HEALING && HEALING.budget) || {};
    recentHeals = recentHeals.filter(t => runElapsedMs - t < (budget.windowMs || 20000));
    const noHeal = heavy || recentHeals.length >= (budget.maxBigHealsInWindow || 2);
    const ids = Object.keys(P).filter(id => !(noHeal && id === "snack"));
    let total = ids.reduce((s, id) => s + (P[id].weight || 1), 0), r = Math.random() * total;
    for (const id of ids) { r -= P[id].weight || 1; if (r <= 0) return id; }
    return ids[0];
  }

  function spawn(scene) {
    const roster = C().roster || []; if (!roster.length) return;
    const r = roster[rosterIdx++ % roster.length];
    const key = texture(scene, r);
    const view = scene.cameras.main.worldView;
    const side = Math.floor(Math.random() * 4), m = 60;
    let x = side === 0 ? view.x - m : side === 1 ? view.right + m : player.x + Phaser.Math.Between(-200, 200);
    let y = side === 2 ? view.y - m : side === 3 ? view.bottom + m : player.y + Phaser.Math.Between(-150, 150);
    if (window.NAV && NAV.fixSpawn) { const s = NAV.fixSpawn(x, y); if (!s) return; [x, y] = s; }
    const real = hasSheet(scene, r);
    const o = real
      ? scene.physics.add.sprite(x, y, "intern2_" + r.id, 0).setOrigin(0.5, 56 / 60).setDepth(4.6)
      : scene.physics.add.sprite(x, y, key + "_0").setScale(SCALE).setOrigin(0.5, 1).setDepth(4.6);
    if (real) o.body.setSize(16, 10).setOffset(20, 46); else o.body.setSize(14, 10).setOffset(5, 26);
    if (window.propGroup) o.propCollider = scene.physics.add.collider(o, window.propGroup);
    const tag = scene.add.text(x, y, r.name.toUpperCase() + " · INTERN", {
      fontFamily: "Silkscreen, monospace", fontSize: "10px", color: "#F2D7A1", backgroundColor: "#171C35cc", padding: { x: 4, y: 2 }
    }).setOrigin(0.5, 1).setDepth(21);
    intern = { o, tag, r, key, real, walked: 0, lastX: x, lastY: y, state: "walk", born: runElapsedMs, waitStart: 0, payload: pickPayload(), frameAt: 0, frame: 0 };
    if (window.showLowerThird && !(window.__internIntroShown)) {
      window.__internIntroShown = true;
      window.showLowerThird("tip", "INTERN", `${r.name} is on the way with something for you. Meet them halfway.`, 3800);
    }
  }

  function bubble(scene, x, y, text) {
    const t = scene.add.text(x, y, text, {
      fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: "13px", fontStyle: "bold", color: "#171C35",
      backgroundColor: "#FFF0CF", padding: { x: 6, y: 4 }, wordWrap: { width: 190 }
    }).setOrigin(0.5, 1).setDepth(22);
    scene.tweens.add({ targets: t, y: y - 18, alpha: 0, delay: 1800, duration: 600, onComplete: () => t.destroy() });
  }

  function floatText(scene, text, color) {
    const t = scene.add.text(player.x, player.y - 70, text, {
      fontFamily: "monospace", fontSize: "13px", fontStyle: "bold", color, stroke: "#12152a", strokeThickness: 3
    }).setOrigin(0.5).setDepth(22);
    scene.tweens.add({ targets: t, y: t.y - 26, alpha: 0, duration: 1100, onComplete: () => t.destroy() });
  }

  // Apply a delivery. Exposed so the Lounge and the dev console can reuse it.
  function give(scene, id) {
    const P = (D().payloads || {})[id]; if (!P) return;
    if (id === "snack") {
      const amt = healAmt(Math.max(P.healMin || 2, Math.floor(stats.maxHp * (P.healFrac || 0.12))));
      const got = Math.min(stats.maxHp - hp, amt);
      hp += got; recentHeals.push(runElapsedMs);
      if (typeof drawHpBar === "function") drawHpBar();
      floatText(scene, `+${got} HP (SNACK)`, "#83A89A");
    } else if (id === "coffee") {
      buffs.speedUntil = runElapsedMs + P.durMs; buffs.speedMult = Math.max(buffs.speedMult || 1, P.speedMult);
      floatText(scene, "COFFEE: FASTER", "#EF9347");
    } else if (id === "focus") {
      buffs.damageUntil = runElapsedMs + P.durMs; buffs.damageMult = Math.max(buffs.damageMult || 1, P.damageMult);
      floatText(scene, "FOCUS: +15% DAMAGE", "#F2D7A1");
    } else if (id === "magnet") {
      buffs.vacuumUntil = runElapsedMs + (P.vacuumMs || 2500);
      floatText(scene, "GEM RUN!", "#BFA8CF");
    }
    if (typeof updateHUD === "function") updateHUD();
    sfx("levelUp");
  }

  function leave(scene, line, fast) {
    if (!intern) return;
    const it = intern;
    it.state = "leaving"; it.leaveAt = runElapsedMs;
    if (line) bubble(scene, it.o.x, it.o.y - (it.real ? 74 : SPRITE_H * SCALE + 14), line);
    const ang = Math.atan2(it.o.y - player.y, it.o.x - player.x);
    it.o.setVelocity(Math.cos(ang) * (fast ? 260 : 120), Math.sin(ang) * (fast ? 260 : 120));
    scene.tweens.add({ targets: [it.o, it.tag], alpha: 0, delay: fast ? 300 : 1400, duration: 500, onComplete: () => { if (intern === it) despawn(); } });
  }

  function despawn() {
    if (!intern) return;
    if (intern.propCollider) intern.propCollider.destroy();
    intern.o.destroy(); intern.tag.destroy();
    intern = null;
  }

  function dropParcel(scene) {
    // Mobbed: leave it on the floor. It works like pizza: walk over it.
    const p = window.pizzas && window.pizzas.create(intern.o.x, intern.o.y - 6, intern.key + "_0");
    if (p) { p.isParcel = true; p.payload = intern.payload; p.setScale(0.9).setDepth(3); p.dieAt = runElapsedMs + 20000; }
  }

  function update(scene, now) {
    if (typeof player === "undefined" || !player || !player.scene) return;
    if (intern) {
      const it = intern, o = it.o;
      if (!o.active) { intern = null; return; }
      it.tag.setPosition(o.x, o.y - (it.real ? 62 : SPRITE_H * SCALE + 2));
      if (it.real) {
        const vx = o.body.velocity.x, vy = o.body.velocity.y, moving = Math.hypot(vx, vy) > 5;
        it.walked += Math.hypot(o.x - it.lastX, o.y - it.lastY); it.lastX = o.x; it.lastY = o.y;
        const row = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 2 : 3) : (vy < 0 ? 1 : 0);
        if (moving) { it.row = row; o.setFrame(row * 8 + Math.floor(it.walked / 8.5) % 8); }
        else o.setFrame((it.row || 0) * 8);
      } else {
        if (now - it.frameAt > 160 && o.body.velocity.length() > 5) { it.frameAt = now; it.frame ^= 1; o.setTexture(it.key + "_" + it.frame); }
        o.setFlipX(o.body.velocity.x < -5);
      }
      if (it.state === "leaving") return;
      if (typeof levelUpOpen !== "undefined" && levelUpOpen) { o.setVelocity(0, 0); return; }
      // A Bill bumped into them: they run.
      const fr = D().fleeRadius || 26;
      if (bills.getChildren().some(b => b.active && !b.ghost && Math.abs(b.x - o.x) < fr && Math.abs(b.y - o.y) < fr)) {
        const fl = C().fleeLines || ["Nope!"];
        return leave(scene, `${it.r.name}: ${fl[Math.floor(Math.random() * fl.length)]}`, true);
      }
      if (now - it.born > (D().giveUpMs || 25000) || bossAlive()) return leave(scene, null, false);
      const dist = Phaser.Math.Distance.Between(o.x, o.y, player.x, player.y);
      if (dist < (D().handOffRadius || 70)) {
        const crowd = bills.getChildren().filter(b => b.active && Phaser.Math.Distance.Between(b.x, b.y, player.x, player.y) < (D().crowdRadius || 90)).length;
        if (crowd >= (D().crowdCount || 5)) {
          o.setVelocity(0, 0);
          if (!it.waitStart) it.waitStart = now;
          if (now - it.waitStart > (D().waitMs || 4000)) { dropParcel(scene); leave(scene, `${it.r.name}: Left it on the floor!`, false); }
          return;
        }
        give(scene, it.payload);
        const lines = it.r.lines || [];
        return leave(scene, lines[Math.floor(Math.random() * lines.length)] || "Here you go!", false);
      }
      const spd = (PLAYER.speed || 200) * (D().speedMult || 0.85);
      if (window.NAV) NAV.steer(scene, o, player, spd); else scene.physics.moveToObject(o, player, spd);
      return;
    }
    if (now < nextAt) return;
    nextAt = now + cadence(typeof currentAge !== "undefined" ? currentAge : 40);
    if (suppressed()) return;
    spawn(scene);
  }

  // A parcel left on the floor was picked up (called from collectPizza).
  function collectParcel(scene, p) { const id = p.payload; p.destroy(); give(scene, id); }

  return { preload, reset, update, give, collectParcel, forceSpawn: (scene) => { if (!intern) spawn(scene); }, active: () => intern };
})();
