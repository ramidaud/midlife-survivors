// The seven loadout-expansion weapons (Nov 4) and the passives that need a clock (Multivitamin, Cardigan).
// Numbers: src/data/weapons.js. Cards and slots: src/data/loadout.js.
// main.js calls MoreWeapons.update() each frame (before enemies move), .post() after enemies move
// (so slows and freezes stick), and .onBlock() when a shield soaks a hit.
// Art is drawn in code for now (placeholder until ChatGPT's sheets land).
window.MoreWeapons = (() => {
  let W = null;
  const C = {
    navy: 0x171C35, slate: 0x303750, blue: 0x526078, teal: 0x3E7775, sage: 0x83A89A, khaki: 0xD3B78D,
    cream: 0xF2D7A1, white: 0xFFF0CF, orange: 0xEF9347, russet: 0xC45C4B, lav: 0xBFA8CF, ice: 0xB8C0D4
  };
  const size = b => ((ENEMIES[b.kind] && ENEMIES[b.kind].size) || 24) / 2;
  const near = (b, x, y, r) => Phaser.Math.Distance.Between(b.x, b.y, x, y) <= r + size(b);
  const live = () => bills.getChildren().filter(b => b.active && !b.ghost);

  // ---------- Placeholder pixel art ----------
  function buildSprites(scene) {
    const px = (ctx, col, list) => { ctx.fillStyle = col; list.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w || 1, h || 1)); };
    if (!scene.textures.exists("w_casserole")) makeCanvasTex(scene, "w_casserole", 30, 20, c => {
      px(c, "#171C35", [[1, 6, 28, 13], [0, 9, 1, 4], [29, 9, 1, 4]]); px(c, "#D3B78D", [[2, 7, 26, 11]]);
      px(c, "#EF9347", [[3, 7, 24, 5]]); px(c, "#F2D7A1", [[5, 8, 4, 2], [13, 7, 5, 2], [21, 8, 4, 2]]); px(c, "#C45C4B", [[9, 9, 3, 2], [18, 10, 3, 1]]);
      px(c, "#874C3B", [[2, 15, 26, 3]]); px(c, "#FFF0CF", [[8, 1, 1, 4], [14, 0, 1, 5], [20, 2, 1, 3]]);
    });
    if (!scene.textures.exists("w_chair")) makeCanvasTex(scene, "w_chair", 24, 26, c => {
      px(c, "#171C35", [[5, 0, 14, 12], [3, 11, 18, 6], [11, 17, 2, 4], [3, 21, 18, 2]]);
      px(c, "#526078", [[6, 1, 12, 10], [4, 12, 16, 4]]); px(c, "#83A89A", [[7, 2, 3, 8]]);
      px(c, "#303750", [[2, 23, 3, 3], [10, 23, 3, 3], [19, 23, 3, 3]]);
    });
    if (!scene.textures.exists("w_email")) makeCanvasTex(scene, "w_email", 16, 12, c => {
      px(c, "#171C35", [[0, 0, 16, 12]]); px(c, "#FFF0CF", [[1, 1, 14, 10]]);
      px(c, "#EF9347", [[2, 2, 2, 1], [4, 3, 2, 1], [6, 4, 4, 1], [10, 3, 2, 1], [12, 2, 2, 1]]); px(c, "#C45C4B", [[12, 7, 2, 2]]);
    });
    if (!scene.textures.exists("w_sticky")) makeCanvasTex(scene, "w_sticky", 14, 14, c => {
      px(c, "#171C35", [[0, 0, 14, 14]]); px(c, "#F2D7A1", [[1, 1, 12, 12]]); px(c, "#D3B78D", [[9, 9, 4, 4]]);
      px(c, "#171C35", [[9, 9, 1, 4], [9, 9, 4, 1]]); px(c, "#526078", [[3, 4, 7, 1], [3, 7, 5, 1]]);
    });
    if (!scene.textures.exists("w_snow")) makeCanvasTex(scene, "w_snow", 9, 9, c => {
      px(c, "#FFF0CF", [[4, 0, 1, 9], [0, 4, 9, 1], [1, 1, 1, 1], [7, 1, 1, 1], [1, 7, 1, 1], [7, 7, 1, 1], [2, 2, 1, 1], [6, 2, 1, 1], [2, 6, 1, 1], [6, 6, 1, 1]]);
    });
  }

  function init(scene) {
    buildSprites(scene);
    W = { dishes: [], chairs: [], notes: [], fx: [], next: {}, phonesUp: false, phonesAt: 0, cardiganAt: null, regenAt: null, healAt: 0, oooTick: 0, fieldG: null, label: null };
  }
  const ready = (key, every) => { const now = runElapsedMs; if (W.next[key] === undefined) W.next[key] = now + 400; if (now < W.next[key]) return false; W.next[key] = now + every * (stats.cooldownMult || 1); return true; };
  const pop = (scene, x, y, text, color) => {
    const t = scene.add.text(x, y, text, { fontFamily: "Silkscreen, monospace", fontSize: "12px", color, stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(50002);
    scene.tweens.add({ targets: t, y: y - 24, alpha: 0, duration: 800, onComplete: () => t.destroy() });
  };
  const heal = (scene, n, label) => {
    const got = Math.min(stats.maxHp - hp, healAmt(n)); if (got <= 0) return;
    hp += got; if (typeof drawHpBar === "function") drawHpBar();
    pop(scene, player.x, player.y - 48, `+${got} HP${label ? " · " + label : ""}`, "#83A89A");
  };
  // An expanding ring (cold snaps, headphone pops, sticky pops).
  function ring(scene, x, y, r, color, ms) {
    const g = scene.add.graphics().setDepth(5.6);
    const o = { t: 0 };
    scene.tweens.add({ targets: o, t: 1, duration: ms || 320, ease: "Cubic.easeOut",
      onUpdate: () => { g.clear(); g.lineStyle(4 * (1 - o.t) + 1, color, 1 - o.t).strokeCircle(x, y, r * (0.3 + 0.7 * o.t)); g.fillStyle(color, 0.18 * (1 - o.t)).fillCircle(x, y, r * (0.3 + 0.7 * o.t)); },
      onComplete: () => g.destroy() });
  }
  function freeze(b, ms) {
    if (b.isBoss) { b.slowUntil = Math.max(b.slowUntil || 0, runElapsedMs + ms); return; }
    b.frozenUntil = Math.max(b.frozenUntil || 0, runElapsedMs + ms);
    b.cringeUntil = Math.max(b.cringeUntil || 0, b.frozenUntil); // main.js already skips moving while this is set
    if (b.body) b.setVelocity(0, 0);
  }

  // ---------- Every frame, before enemies move ----------
  function update(scene, delta) {
    if (!W || !stats || !player) return;
    const dt = Math.min(delta, 50) / 1000, now = runElapsedMs;

    // MOM'S CASSEROLE: hot dishes on the floor. They burn enemies and heal you while you stand in them.
    if (stats.casserole && ready("cas", stats.casEveryMs)) {
      const n = stats.potluck ? 2 : 1, CW = WEAPONS.casserole;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, d = i ? 70 : 0;
        const x = player.x + Math.cos(a) * d, y = player.y + Math.sin(a) * d + 6;
        const g = scene.add.graphics().setDepth(2.5), img = scene.add.image(x, y, "w_casserole").setDepth(2.6).setScale(1.4);
        W.dishes.push({ x, y, g, img, until: now + CW.lifeMs * (stats.potluck ? 1.5 : 1), tickAt: now, born: now });
        if (window.Lighting) Lighting.fx("coffeeHit", x, y);
      }
      sfx("pick");
    }
    let inDish = false;
    W.dishes = W.dishes.filter(d => {
      if (now >= d.until) { d.g.destroy(); d.img.destroy(); return false; }
      const r = stats.casRadius, left = d.until - now, fade = Math.min(1, left / 600);
      d.g.clear();
      d.g.fillStyle(C.orange, 0.16 * fade).fillEllipse(d.x, d.y, r * 2.1, r * 1.5);
      d.g.lineStyle(2, C.cream, 0.5 * fade).strokeEllipse(d.x, d.y, r * 2.1 + Math.sin(now / 120) * 3, r * 1.5 + Math.sin(now / 120) * 2);
      d.img.setAlpha(fade).setY(d.y - 2 + Math.sin((now - d.born) / 200));
      if (now >= d.tickAt) { d.tickAt = now + WEAPONS.casserole.tickMs; live().forEach(b => { if (near(b, d.x, d.y, r)) damageBill(b, stats.casDamage); }); }
      if (Phaser.Math.Distance.Between(player.x, player.y, d.x, d.y) <= r) inDish = true;
      return true;
    });
    if (inDish && now >= W.healAt) {
      W.healAt = now + WEAPONS.casserole.healEveryMs / (stats.potluck ? 2 : 1);
      heal(scene, Math.max(1, Math.round(WEAPONS.casserole.healAmt * (stats.foodMult || 1))), "CASSEROLE");
    }

    // NOISE-CANCELLING HEADPHONES: a bubble (the same shield as the interns' gift) that pops when it blocks.
    if (stats.phones && shield.hits <= 0) {
      if (W.phonesUp) { W.phonesUp = false; W.phonesAt = now + stats.phonesRechargeMs * (stats.cooldownMult || 1); } // it ran out on its own
      else if (now >= W.phonesAt) { window.giveShield(scene, stats.dnd ? 2 : 1, WEAPONS.headphones.holdMs); W.phonesUp = true; sfx("wordNo"); }
    }
    // CARDIGAN: a free one-hit shield on a timer.
    if (stats.hasCardigan && shield.hits <= 0) {
      if (W.cardiganAt === null) W.cardiganAt = now + 1500;
      if (now >= W.cardiganAt) { window.giveShield(scene, 1, 60000); W.cardiganAt = now + stats.cardiganMs; pop(scene, player.x, player.y - 56, "CARDIGAN ON", "#83A89A"); }
    }
    // MULTIVITAMIN: slow, steady healing.
    if (stats.hasVitamin) {
      if (W.regenAt === null) W.regenAt = now + stats.regenMs;
      if (now >= W.regenAt) { W.regenAt = now + stats.regenMs; heal(scene, 1, "VITAMIN"); }
    }

    // ROLLING OFFICE CHAIR: bowls through a line of enemies.
    if (stats.chair && ready("chair", stats.chairEveryMs)) {
      const t = nearestBill(), base = t ? Phaser.Math.Angle.Between(player.x, player.y, t.x, t.y) : Math.random() * Math.PI * 2;
      (stats.swivel ? [-0.4, 0, 0.4] : [0]).forEach(off => {
        const a = base + off, c = scene.add.image(player.x, player.y, "w_chair").setDepth(6).setScale(stats.swivel ? 1.5 : 1.25);
        c.uid = "ch" + (projUid++); c.vx = Math.cos(a) * stats.chairSpeed; c.vy = Math.sin(a) * stats.chairSpeed; c.life = WEAPONS.officeChair.lifeMs;
        W.chairs.push(c);
      });
      sfx("shoot");
    }
    W.chairs = W.chairs.filter(c => {
      c.x += c.vx * dt; c.y += c.vy * dt; c.life -= dt * 1000; c.rotation += (stats.swivel ? 16 : 9) * dt;
      hitEnemiesNear(c, WEAPONS.officeChair.radius * (stats.swivel ? 1.3 : 1), stats.chairDamage, 700);
      if (c.life <= 0) { c.destroy(); return false; }
      if (c.life < 250) c.setAlpha(c.life / 250);
      return true;
    });

    // REPLY-ALL STORM: zaps the nearest enemy, then jumps from enemy to enemy.
    if (stats.replyAll && ready("reply", stats.replyEveryMs)) {
      const all = live(), starts = all.filter(b => near(b, player.x, player.y, 320))
        .sort((a, b) => Phaser.Math.Distance.Between(a.x, a.y, player.x, player.y) - Phaser.Math.Distance.Between(b.x, b.y, player.x, player.y));
      const storms = stats.memo ? 2 : 1, used = new Set();
      for (let s = 0; s < storms && starts[s]; s++) {
        let from = { x: player.x, y: player.y - 10 }, cur = starts[s], pts = [from];
        for (let j = 0; j <= stats.replyChains && cur; j++) {
          used.add(cur); pts.push({ x: cur.x, y: cur.y });
          const tgt = cur; damageBill(tgt, stats.replyDamage);
          const nx = all.filter(b => b.active && !used.has(b) && near(b, tgt.x, tgt.y, WEAPONS.replyAll.jumpPx));
          cur = nx.sort((a, b) => Phaser.Math.Distance.Between(a.x, a.y, tgt.x, tgt.y) - Phaser.Math.Distance.Between(b.x, b.y, tgt.x, tgt.y))[0];
        }
        zap(scene, pts);
      }
      if (starts.length) sfx("shoot");
    }

    // OUT-OF-OFFICE REPLY: the field itself is drawn here; the slowing happens in post().
    if (stats.ooo) {
      if (!W.fieldG || !W.fieldG.active) {
        W.fieldG = scene.add.graphics().setDepth(2.4);
        W.label = scene.add.text(0, 0, "AWAY", { fontFamily: "Silkscreen, monospace", fontSize: "9px", color: "#BFA8CF", stroke: "#171C35", strokeThickness: 2 }).setOrigin(0.5).setDepth(2.45).setAlpha(0.8);
      }
      const r = stats.oooRadius, g = W.fieldG; g.clear();
      g.fillStyle(C.lav, stats.sabbatical ? 0.1 : 0.07).fillEllipse(player.x, player.y + 6, r * 2, r * 1.6);
      const dashes = 28, spin = now / 2400;
      for (let i = 0; i < dashes; i += 2) {
        const a1 = spin + (i / dashes) * Math.PI * 2, a2 = spin + ((i + 1) / dashes) * Math.PI * 2;
        g.lineStyle(2, C.lav, 0.55).lineBetween(player.x + Math.cos(a1) * r, player.y + 6 + Math.sin(a1) * r * 0.8, player.x + Math.cos(a2) * r, player.y + 6 + Math.sin(a2) * r * 0.8);
      }
      W.label.setPosition(player.x, player.y + 6 + r * 0.8 + 6);
      if (stats.sabbatical && now >= W.oooTick) { W.oooTick = now + 1000; live().forEach(b => { if (near(b, player.x, player.y, r)) damageBill(b, 1); }); }
    }

    // STICKY NOTES: dropped near you. An enemy that steps on one is stuck until it pops.
    if (stats.sticky && ready("sticky", stats.stickyEveryMs)) {
      const S = WEAPONS.stickyNotes, n = stats.postItWall ? 6 + stats.stickyCount : stats.stickyCount;
      for (let i = 0; i < n; i++) {
        const a = stats.postItWall ? (i / n) * Math.PI * 2 : Math.random() * Math.PI * 2, d = stats.postItWall ? 90 : 30 + Math.random() * 60;
        const img = scene.add.image(player.x + Math.cos(a) * d, player.y + Math.sin(a) * d, "w_sticky").setDepth(2.6).setScale(1.5).setAngle(Phaser.Math.Between(-12, 12));
        W.notes.push({ img, until: now + S.lifeMs, popAt: 0, victim: null });
      }
      while (W.notes.length > S.maxOnFloor + (stats.postItWall ? 10 : 0)) { const o = W.notes.shift(); o.img.destroy(); }
    }
    W.notes = W.notes.filter(nt => {
      const S = WEAPONS.stickyNotes, x = nt.img.x, y = nt.img.y;
      if (!nt.popAt) {
        if (now >= nt.until) { nt.img.destroy(); return false; }
        const v = live().find(b => near(b, x, y, 8));
        if (v) { nt.popAt = now + stats.stickyMs; nt.victim = v; freeze(v, stats.stickyMs); nt.img.setTint(0xEF9347); }
        return true;
      }
      if (nt.victim && nt.victim.active) nt.img.setPosition(nt.victim.x, nt.victim.y + 8);
      nt.img.setScale(1.5 + Math.sin(now / 50) * 0.15);
      if (now < nt.popAt) return true;
      const r = S.popRadius * (stats.postItWall ? 1.4 : 1), px = nt.img.x, py = nt.img.y;
      live().forEach(b => { if (near(b, px, py, r)) damageBill(b, stats.stickyDamage); });
      ring(scene, px, py, r, C.cream, 260); nt.img.destroy();
      return false;
    });

    // THERMOSTAT WARS: a cold snap freezes everything near you (bosses just slow down).
    if (stats.thermo && ready("thermo", stats.thermoEveryMs)) {
      const r = stats.thermoRadius;
      ring(scene, player.x, player.y, r, C.ice, 420);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2, f = scene.add.image(player.x, player.y, "w_snow").setDepth(6).setScale(1.5);
        scene.tweens.add({ targets: f, x: player.x + Math.cos(a) * r, y: player.y + Math.sin(a) * r, angle: 180, alpha: 0, duration: 520, onComplete: () => f.destroy() });
      }
      let n = 0;
      live().forEach(b => { if (near(b, player.x, player.y, r)) { freeze(b, stats.thermoFreezeMs); damageBill(b, stats.thermoDamage); n++; } });
      sfx("wordNo");
      if (n >= 8 && Math.random() < 0.35) pop(scene, player.x, player.y - 60, Phaser.Utils.Array.GetRandom(["WHO TOUCHED THE THERMOSTAT?", "IT'S FREEZING IN HERE", "SWEATER WEATHER"]), "#FFF0CF");
    }
  }

  function zap(scene, pts) {
    const g = scene.add.graphics().setDepth(6.5);
    const draw = (alpha, jit) => {
      g.clear();
      [[5, C.navy], [3, C.orange], [1, C.white]].forEach(([w, col]) => {
        g.lineStyle(w, col, alpha); g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i], mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * jit, my = (a.y + b.y) / 2 + (Math.random() - 0.5) * jit;
          g.lineTo(mx, my); g.lineTo(b.x, b.y);
        }
        g.strokePath();
      });
    };
    draw(1, 22);
    pts.slice(1).forEach(p => { const e = scene.add.image(p.x, p.y - 12, "w_email").setDepth(6.6).setScale(1.4); scene.tweens.add({ targets: e, y: e.y - 16, alpha: 0, duration: 380, onComplete: () => e.destroy() }); });
    const o = { a: 1 };
    scene.tweens.add({ targets: o, a: 0, duration: 220, onUpdate: () => draw(o.a, 16), onComplete: () => g.destroy() });
  }

  // ---------- After enemies move: slows and freezes ----------
  function post(scene) {
    if (!W || !stats || !player) return;
    const now = runElapsedMs, r = stats.ooo ? stats.oooRadius : 0;
    bills.getChildren().forEach(b => {
      if (!b.active || !b.body) return;
      if (b.frozenUntil) {
        if (now < b.frozenUntil) { b.setVelocity(0, 0); if (!b.tintFill) b.setTint(C.ice); return; }
        b.frozenUntil = 0; b.clearTint();
      }
      let k = 1;
      if (b.slowUntil && now < b.slowUntil) k = 0.5;
      if (r && near(b, player.x, player.y, r)) k = Math.min(k, b.isBoss ? Math.max(stats.oooSlow, 0.75) : stats.oooSlow);
      if (k < 1) b.setVelocity(b.body.velocity.x * k, b.body.velocity.y * k);
    });
  }

  // A shield soaked a hit. With the headphones on, the bubble pops in a wave.
  function onBlock(scene, p) {
    if (!W || !stats) return;
    if (stats.phones && W.phonesUp) {
      const r = stats.phonesPopRadius;
      ring(scene, p.x, p.y, r, C.teal, 360);
      live().forEach(b => { if (near(b, p.x, p.y, r)) damageBill(b, stats.phonesPopDamage); });
      scene.cameras.main.shake(100, 0.004);
      if (shield.hits <= 0) { W.phonesUp = false; W.phonesAt = runElapsedMs + stats.phonesRechargeMs * (stats.cooldownMult || 1); }
    }
    if (stats.hasCardigan && shield.hits <= 0) W.cardiganAt = runElapsedMs + stats.cardiganMs;
  }

  return { init, update, post, onBlock };
})();
