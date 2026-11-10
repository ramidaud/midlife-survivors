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
    if (window.ArtSheets) ArtSheets.load(scene, "treats_atlas", "assets/items/treats-v1.png", 32, 32); // ChatGPT's treats (Nov 4): coffee, burrito, bundt; row 1 = shine
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
    if (window.Spotlight) Spotlight.internDelivery(); // TJ and Derek's duo card, first intern of every run
    const key = texture(scene, r);
    const view = scene.cameras.main.worldView, chase = C().mode === "chase", CH = C().chase || {};
    const side = Math.floor(Math.random() * 4), m = 60;
    let x = side === 0 ? view.x - m : side === 1 ? view.right + m : player.x + Phaser.Math.Between(-200, 200);
    let y = side === 2 ? view.y - m : side === 3 ? view.bottom + m : player.y + Phaser.Math.Between(-150, 150);
    if (chase) { // chase mode: they appear on screen, a short sprint away, so you see them and can go after them
      const [d0, d1] = CH.spawnDist || [210, 290], a = Math.random() * Math.PI * 2, d = d0 + Math.random() * (d1 - d0);
      x = player.x + Math.cos(a) * d; y = player.y + Math.sin(a) * d * 0.8;
    }
    if (window.NAV && NAV.fixSpawn) { const s = NAV.fixSpawn(x, y); if (!s) return; [x, y] = s; }
    const real = hasSheet(scene, r);
    const o = real
      ? scene.physics.add.sprite(x, y, "intern2_" + r.id, 0).setOrigin(0.5, 56 / 60).setDepth(4.6)
      : scene.physics.add.sprite(x, y, key + "_0").setScale(SCALE).setOrigin(0.5, 1).setDepth(4.6);
    if (real) o.body.setSize(16, 10).setOffset(20, 46); else o.body.setSize(14, 10).setOffset(5, 26);
    if (window.propGroup) o.propCollider = scene.physics.add.collider(o, window.propGroup);
    const tag = scene.add.text(x, y, "★ ALLY · " + r.name.toUpperCase(), {
      fontFamily: "Silkscreen, monospace", fontSize: "10px", color: "#171C35", backgroundColor: "#83A89A", padding: { x: 4, y: 2 }
    }).setOrigin(0.5, 1).setDepth(50000);
    // A soft green ring under their feet, so new players read "friend" and walk toward them (Gemini Argon review, Nov 4)
    const ring = scene.add.ellipse(x, y, 46, 18).setStrokeStyle(2, 0x83A89A, 0.95).setFillStyle(0x83A89A, 0.18).setDepth(4.5);
    scene.tweens.add({ targets: ring, scaleX: 1.18, scaleY: 1.18, alpha: 0.55, duration: 700, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    intern = { o, tag, ring, r, key, real, walked: 0, lastX: x, lastY: y, state: chase ? "flee" : "walk", born: runElapsedMs, waitStart: 0, payload: pickPayload(), frameAt: 0, frame: 0, taunted: false };
    if (chase) { tag.setText("★ ALLY · " + r.name.toUpperCase() + " · CATCH ME!"); if (window.Lighting) Lighting.follow(o, "elite", { color: 0xEF9347, r: 44, strength: 0.5, glow: 0.4 }); }
    if (window.showLowerThird && !(window.__internIntroShown)) {
      window.__internIntroShown = true;
      window.showLowerThird("tip", "INTERN", chase ? `${r.name} has a coffee for you. Catch them for a heal and a shield!` : `${r.name} is on the way with something for you. Meet them halfway.`, 4200);
    }
  }

  function bubble(scene, x, y, text) {
    const t = scene.add.text(x, y, text, window.WorldText ? WorldText.bubbleStyle({ wordWrap: { width: 190, useAdvancedWrap: true } }) : {
      fontFamily: "'Atkinson Hyperlegible', sans-serif", fontSize: "14px", fontStyle: "bold", color: "#171C35",
      backgroundColor: "#F2D7A1", padding: { x: 8, y: 5 }, wordWrap: { width: 190 }
    }).setOrigin(0.5, 1).setDepth(50002); // A7: the one bubble style
    scene.tweens.add({ targets: t, y: y - 18, alpha: 0, delay: 1800, duration: 600, onComplete: () => t.destroy() });
  }

  function floatText(scene, text, color) {
    const t = scene.add.text(player.x, player.y - 70, text, {
      fontFamily: "monospace", fontSize: "13px", fontStyle: "bold", color, stroke: "#12152a", strokeThickness: 3
    }).setOrigin(0.5).setDepth(50002);
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
    intern.o.destroy(); intern.tag.destroy(); if (intern.ring) intern.ring.destroy();
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
      if (it.ring) it.ring.setPosition(o.x, o.y + (it.real ? 2 : 0));
      if (it.real) {
        const vx = o.body.velocity.x, vy = o.body.velocity.y, moving = Math.hypot(vx, vy) > 5;
        it.walked += Math.hypot(o.x - it.lastX, o.y - it.lastY); it.lastX = o.x; it.lastY = o.y;
        const row = Math.abs(vx) > Math.abs(vy) ? (vx < 0 ? 2 : 3) : (vy < 0 ? 1 : 0);
        if (moving) { it.row = row; o.setFrame(row * 8 + Math.floor(it.walked / 8.5) % 8); }
        else o.setFrame(36 + Math.floor(now / 185) % 4); // v2 art: TJ sips, Derek raises his camera
      } else {
        if (now - it.frameAt > 160 && o.body.velocity.length() > 5) { it.frameAt = now; it.frame ^= 1; o.setTexture(it.key + "_" + it.frame); }
        o.setFlipX(o.body.velocity.x < -5);
      }
      if (it.state === "leaving") return;
      if (typeof levelUpOpen !== "undefined" && levelUpOpen) { o.setVelocity(0, 0); return; }
      if (it.state === "flee") return chaseStep(scene, it, now);
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
        if (it.r.id === "derek" && window.Lighting) Lighting.fx("cameraFlash", o.x, o.y - 30); // Derek snaps a photo on the hand-off
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

  // Chase mode (Nov 4): run from the player; touch them to catch them.
  function chaseStep(scene, it, now) {
    const CH = C().chase || {}, o = it.o;
    if (bossAlive()) return leave(scene, null, true);
    const dist = Phaser.Math.Distance.Between(o.x, o.y, player.x, player.y);
    if (dist < (CH.catchRadius || 40)) return caught(scene, it);
    if (now - it.born > (CH.giveUpMs || 15000)) {
      const el = CH.escapeLines || ["Too slow!"];
      return leave(scene, `${it.r.name}: ${el[Math.floor(Math.random() * el.length)]}`, true);
    }
    let spd = (PLAYER.speed || 200) * (CH.speedMult || 0.8);
    if (dist > (CH.slowAfterPx || 380)) { // too far ahead: ease off and taunt, so the chase stays winnable
      spd *= CH.slowMult || 0.4;
      if (!it.taunted) { it.taunted = true; const tl = CH.tauntLines || []; if (tl.length) bubble(scene, o.x, o.y - (it.real ? 74 : SPRITE_H * SCALE + 14), `${it.r.name}: ${tl[Math.floor(Math.random() * tl.length)]}`); }
    } else it.taunted = false;
    if (!(window.NAV && NAV.flee && NAV.flee(scene, o, spd))) { // no map yet: run straight away
      const a = Math.atan2(o.y - player.y, o.x - player.x);
      o.setVelocity(Math.cos(a) * spd, Math.sin(a) * spd);
    }
  }
  function caught(scene, it) {
    const CH = C().chase || {};
    if (it.r.id === "derek" && window.Lighting) Lighting.fx("cameraFlash", it.o.x, it.o.y - 30); // Derek still gets his photo
    const amt = healAmt(Math.max(CH.healMin || 2, Math.floor(stats.maxHp * (CH.healFrac || 0.15))));
    const got = Math.min(stats.maxHp - hp, amt);
    if (got > 0) { hp += got; recentHeals.push(runElapsedMs); if (typeof drawHpBar === "function") drawHpBar(); }
    if (window.giveShield) window.giveShield(scene, CH.shieldHits || 2, CH.shieldMs || 20000);
    floatText(scene, got > 0 ? `+${got} HP · SHIELD` : "SHIELD UP", "#83A89A");
    if (window.Lighting) Lighting.unfollow(it.o);
    if (typeof updateHUD === "function") updateHUD();
    if (window.Telemetry && Telemetry.note) Telemetry.note("internCaught");
    if (window.achEvent) window.achEvent("internCaught");
    it.tag.setText(it.r.name.toUpperCase() + " · CAUGHT");
    const id = tossTreat(scene, it);
    const lines = it.r.lines || [], line = lines[Math.floor(Math.random() * lines.length)] || "Here you go!";
    const T = id && (CH.treats || {})[id];
    if (window.CatchMoment && T) { // the GOTCHA! card: their line goes on the card, so no speech bubble in the world
      const icons = {}; ["coffee", "burrito", "bundt"].forEach(k => { try { icons[k] = scene.textures.getBase64(treatTexture(scene, k)); } catch (e) { } });
      CatchMoment.show(scene, it.r, line, { id, name: T.name, text: T.text || "", color: T.color }, icons, CH.shieldHits || 2);
      return leave(scene, null, false);
    }
    sfx("levelUp");
    return leave(scene, line, false);
  }

  // The treat they toss when you catch them: drawn in code (a pixel coffee, burrito or bundt cake), lands a short hop away.
  function treatTexture(scene, id) {
    const key = "treat_" + id; if (scene.textures.exists(key)) return key;
    const px = (c, col, list) => { c.fillStyle = col; list.forEach(([x, y, w, h]) => c.fillRect(x, y, w || 1, h || 1)); };
    makeCanvasTex(scene, key, 16, 16, c => {
      if (id === "coffee") { px(c, "#171C35", [[3, 5, 10, 10]]); px(c, "#FFF0CF", [[4, 6, 8, 8]]); px(c, "#EF9347", [[4, 9, 8, 3]]); px(c, "#171C35", [[12, 8, 3, 4]]); px(c, "#FFF0CF", [[13, 9, 1, 2]]); px(c, "#83A89A", [[6, 1, 1, 3], [9, 2, 1, 3]]); }
      else if (id === "burrito") { px(c, "#171C35", [[1, 5, 14, 8]]); px(c, "#D3B78D", [[2, 6, 12, 6]]); px(c, "#F2D7A1", [[3, 6, 9, 2]]); px(c, "#C45C4B", [[13, 7, 1, 2]]); px(c, "#3E7775", [[13, 9, 1, 2]]); px(c, "#EF9347", [[4, 10, 2, 1], [8, 10, 2, 1]]); }
      else { px(c, "#171C35", [[2, 5, 12, 9]]); px(c, "#BFA8CF", [[3, 6, 10, 7]]); px(c, "#FFF0CF", [[3, 6, 10, 2], [4, 8, 1, 2], [8, 8, 1, 3], [11, 8, 1, 2]]); px(c, "#171C35", [[7, 7, 2, 3]]); px(c, "#C45C4B", [[7, 4, 2, 2]]); }
    });
    return key;
  }
  function tossTreat(scene, it) {
    const CH = C().chase || {}, odds = (CH.treatOdds || {})[it.r.id] || { coffee: 1, burrito: 1, bundt: 1 };
    const ids = Object.keys(odds).filter(k => (CH.treats || {})[k]); if (!ids.length || !window.pizzas) return;
    let r = Math.random() * ids.reduce((s, k) => s + odds[k], 0), id = ids[0];
    for (const k of ids) { r -= odds[k]; if (r <= 0) { id = k; break; } }
    const a = Math.random() * Math.PI * 2, tx = it.o.x + Math.cos(a) * 60, ty = it.o.y + Math.sin(a) * 45;
    const atlas = scene.textures.exists("treats_atlas"), col = ["coffee", "burrito", "bundt"].indexOf(id);
    const t = atlas ? window.pizzas.create(it.o.x, it.o.y - 10, "treats_atlas", Math.max(0, col)).setDepth(3)
      : window.pizzas.create(it.o.x, it.o.y - 10, treatTexture(scene, id)).setScale(2).setDepth(3); // drawn-in-code fallback
    t.isParcel = true; t.payload = "treat_" + id; t.dieAt = runElapsedMs + 15000; t.collectAt = runElapsedMs + 650;
    if (window.Lighting) Lighting.follow(t, "bigGem", { color: 0xF2D7A1, r: 30 });
    scene.tweens.add({ targets: t, x: tx, y: ty, duration: 380, ease: "Quad.easeOut" });
    return id;
  }
  function giveTreat(scene, id) {
    const T = ((C().chase || {}).treats || {})[id]; if (!T) return;
    const until = runElapsedMs + (T.durMs || 10000);
    if (T.speedMult) { buffs.speedUntil = until; buffs.speedMult = Math.max(T.speedMult, runElapsedMs < buffs.speedUntil ? buffs.speedMult : 1); }
    if (T.damageMult) { buffs.damageUntil = until; buffs.damageMult = T.damageMult; }
    if (T.xpMult) { buffs.xpUntil = until; buffs.xpMult = T.xpMult; }
    if (T.vacuumMs) buffs.vacuumUntil = runElapsedMs + T.vacuumMs;
    floatText(scene, T.name + "!", T.color || "#F2D7A1");
    if (window.showLowerThird) window.showLowerThird("reward", T.name, (T.text || "").charAt(0).toUpperCase() + (T.text || "").slice(1) + ".", 3200);
    if (typeof updateHUD === "function") updateHUD();
    sfx("levelUp");
  }

  // A parcel left on the floor was picked up (called from collectPizza).
  function collectParcel(scene, p) { const id = p.payload; p.destroy(); if (String(id).startsWith("treat_")) return giveTreat(scene, id.slice(6)); give(scene, id); }

  return { preload, reset, update, give, collectParcel, forceSpawn: (scene) => { if (!intern) spawn(scene); }, active: () => intern };
})();
