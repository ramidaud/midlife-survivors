// Boss special attacks: a warning ("telegraph"), then the attack, then a short recovery. (Nov 2, from Grok's spec)
// Numbers live in src/data/bosses.js. Every hit goes through hurtPlayer, so the usual safe window after a hit applies.
window.BossAttacks = (() => {
  const T = () => window.BOSS_ATTACK_TUNING || {};
  const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  function scaling() {
    const t = T(), years = Math.max(0, currentAge - (t.ageRefYear || 40)), tax = (typeof runTaxBracket !== "undefined" ? runTaxBracket : 0) || 0;
    return {
      tele: (base, floor) => Math.max(floor, base - years * (t.telegraphAgeCutPerYear || 0) - tax * (t.telegraphTaxCutPerBracket || 0)),
      speed: Math.min(t.speedMultCap || 1.45, 1 + years * (t.speedAgeAddPerYear || 0) + tax * (t.speedTaxAddPerBracket || 0))
    };
  }
  // Is the player's body inside a box of half-size (hw, hh) around (x, y)?
  function touches(player, x, y, hw, hh) {
    const pb = player.body, pw = pb ? pb.halfWidth : 24, ph = pb ? pb.halfHeight : 26;
    const px = pb ? pb.center.x : player.x, py = pb ? pb.center.y : player.y;
    return Math.abs(px - x) <= hw + pw && Math.abs(py - y) <= hh + ph;
  }
  const hit = (player, boss, dmg) => hurtPlayer(player, { kind: boss.kind, damage: dmg, x: boss.x, y: boss.y });
  const onScreen = (scene, b) => { const v = scene.cameras.main.worldView, m = T().onScreenMargin || 40; return b.x > v.x - m && b.x < v.right + m && b.y > v.y - m && b.y < v.bottom + m; };
  function gfx(scene, a) {
    if (!a.g || !a.g.active) a.g = scene.add.graphics().setDepth(20000);
    if (!a.skidG || !a.skidG.active) a.skidG = scene.add.graphics().setDepth(3);
    return a.g;
  }
  // Did a charging boss run into a wall, a closed door, or off the floor? (Nov 4, Rami: "he goes right through walls")
  // Furniture still doesn't stop him (that's what pass() is for); only walls do.
  function wallHit(scene, boss, D, px, py, pad = 0) {
    const L = window.START_AREA_LAYOUT, hw = D.bodyHalfW + pad, hh = D.bodyHalfH + pad, x = px ?? boss.x, y = py ?? boss.y;
    const over = r => x - hw < r.x + r.width && x + hw > r.x && y - hh < r.y + r.height && y + hh > r.y;
    if (L && L.walls.some(over)) return true;
    if ((window.START_AREA_GATES || []).some(g => !g.opened && g.rect && over({ x: g.rect.x, y: g.rect.y, width: g.rect.w, height: g.rect.h }))) return true;
    const sa = scene.worldArt && scene.worldArt.startArea;
    return !!(sa && !sa.contains(x, y));
  }
  // A jagged crack where the boss hit the wall. Fades after a few seconds.
  function crack(scene, x, y, B) {
    if (scene.textures.exists("bonk_crack") && scene.textures.get("bonk_crack").frameTotal > 2) { // ChatGPT's drywall cracks (3 variants)
      const o = scene.add.image(Math.round(x), Math.round(y), "bonk_crack", Phaser.Math.Between(0, 2)).setDepth(50003).setScale(1.25).setAngle(Phaser.Math.Between(-12, 12)).setFlipX(Math.random() < 0.5);
      scene.tweens.add({ targets: o, alpha: 0, delay: (B.crackMs || 3500), duration: 600, onComplete: () => o.destroy() });
      return;
    }
    const key = "bonk_crack_code";
    if (!scene.textures.exists(key)) {
      const c = document.createElement("canvas"); c.width = 44; c.height = 44; const g = c.getContext("2d");
      g.strokeStyle = "#171C35"; g.lineWidth = 2; g.lineCap = "square";
      [[22, 22, 4, 8], [22, 22, 40, 12], [22, 22, 8, 38], [22, 22, 38, 36], [22, 22, 24, 2]].forEach(([x0, y0, x1, y1]) => {
        g.beginPath(); g.moveTo(x0, y0); g.lineTo((x0 + x1) / 2 + 3, (y0 + y1) / 2 - 2); g.lineTo(x1, y1); g.stroke(); });
      g.fillStyle = "#171C35"; g.fillRect(19, 19, 6, 6);
      scene.textures.addCanvas(key, c);
    }
    const o = scene.add.image(Math.round(x), Math.round(y), key).setDepth(50003).setAlpha(0.85).setAngle(Phaser.Math.Between(0, 359)).setScale(1.2);
    scene.tweens.add({ targets: o, alpha: 0, delay: (B.crackMs || 3500), duration: 600, onComplete: () => o.destroy() });
  }
  // Little stars that circle the boss's head while it's dizzy.
  function stars(scene, boss, B) {
    if (boss._stars) boss._stars.forEach(o => o.destroy());
    if (scene.textures.exists("dizzy_stars") && scene.textures.get("dizzy_stars").frameTotal > 8) { // ChatGPT's twinkling stars, plus one little bird
      boss._stars = [0, 1, 2].map(i => { const o = scene.add.image(boss.x, boss.y, "dizzy_stars", i === 1 ? 6 : 0).setDepth(50004).setScale(1.5); o.bird = i === 1; o.phase = i * 2; return o; });
    } else boss._stars = [0, 1, 2].map(i => scene.add.text(boss.x, boss.y, i === 1 ? "✦" : "★", { fontFamily: "monospace", fontSize: i === 1 ? "14px" : "16px", color: i === 1 ? "#FFF0CF" : "#EF9347", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(50004));
    if (!boss._starsHooked) { boss._starsHooked = true; boss.once("destroy", () => { if (boss._stars) boss._stars.forEach(o => o.destroy()); boss._stars = null; }); }
  }
  function moveStars(boss, t, total) {
    if (!boss._stars) return;
    const v = boss.artRecord && boss.artRecord.visual && boss.artRecord.visual.active ? boss.artRecord.visual : boss;
    const top = v.y - (v.displayHeight || 80) * (v === boss ? 0.6 : 0.95), fade = Math.max(0, Math.min(1, (total - t) / 250));
    boss._stars.forEach((o, i) => { if (o.type === "Image") o.setFrame(o.bird ? 6 + Math.floor(t / 120) % 2 : (Math.floor(t / 100) + o.phase) % 6);
      const ang = t / 160 + i * Math.PI * 2 / 3; o.setPosition(v.x + Math.cos(ang) * 26, top + Math.sin(ang) * 8).setAlpha(fade).setDepth(Math.sin(ang) > 0 ? 50004 : (v.depth || 4) - 0.1); });
    if (t >= total) { boss._stars.forEach(o => o.destroy()); boss._stars = null; }
  }
  function bonk(scene, boss, a, now) { // bounce back off the wall, then a dizzy moment before chasing again
    pass(boss, false);
    if (a.lastX !== undefined && boss.body) boss.body.reset(a.lastX, a.lastY); // step back out of the wall
    const B = T().wallBonk || {};
    a.state = "stagger"; a.startedAt = now; a.bounceUntil = now + (B.bounceMs || 320);
    a.bounceVx = -Math.cos(a.aim) * (B.bounceSpeed || 260); a.bounceVy = -Math.sin(a.aim) * (B.bounceSpeed || 260);
    scene.cameras.main.shake(160, 0.006); sfx("hurt", 0);
    // Comic bonk (Nov 4, Rami): the word pops in big and wobbly, the boss splats flat (src/boss-art.js reads _bonkAt),
    // a crack appears in the wall, and stars circle the boss's head while it's dizzy.
    const t = scene.add.text(boss.x, boss.y - 76, Phaser.Utils.Array.GetRandom(B.words || ["BONK!", "OOF!", "THUD!"]), { fontFamily: "Silkscreen, monospace", fontSize: "18px", color: "#FFF0CF", backgroundColor: "#C45C4B", padding: { x: 6, y: 3 }, stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(50004).setScale(0.3).setAngle(Phaser.Math.Between(-14, 14));
    scene.tweens.add({ targets: t, scale: 1.25, duration: 120, ease: "Back.Out", onComplete: () => scene.tweens.add({ targets: t, scale: 1, duration: 90,
      onComplete: () => scene.tweens.add({ targets: t, y: t.y - 22, alpha: 0, delay: 420, duration: 420, ease: "Cubic.easeIn", onComplete: () => t.destroy() }) }) });
    boss._bonkAt = now; boss._bonkFlat = Math.abs(Math.cos(a.aim)) >= Math.abs(Math.sin(a.aim)) ? "x" : "y"; // which way it flattens
    const D = (window.BOSS_ATTACKS && BOSS_ATTACKS[boss.kind]) || {};
    crack(scene, boss.x + Math.cos(a.aim) * ((D.bodyHalfW || 22) + 14), boss.y + Math.sin(a.aim) * ((D.bodyHalfH || 24) + 6) - 20, B);
    if (!reduceMotion) stars(scene, boss, B);
    if (typeof sfx === "function") scene.time.delayedCall(140, () => sfx("pick")); // a little boing
    if (typeof burstConfetti === "function") burstConfetti(scene, boss.x + Math.cos(a.aim) * 20, boss.y + Math.sin(a.aim) * 20, 0xD3B78D, 8); // drywall dust
  }
  function pass(boss, on) { if (boss.body) boss.body.checkCollision.none = on; } // walk through furniture during an attack

  // Returns true while the attack system is steering the boss (so the normal chase is skipped).
  function update(scene, boss, player, now) {
    if (!boss || !boss.active) return false;
    if (boss.kind === "goldWatch" && window.GoldWatch) { // the final boss has its own fight (src/gold-watch.js)
      const r = GoldWatch.update(scene, boss, player, now), st = boss._gw ? boss._gw.state : "chase";
      if (window.BossArt) BossArt.sync(scene, boss, st === "float" ? "chase" : st, now);
      return r;
    }
    const r = step(scene, boss, player, now);
    if (window.BossArt) BossArt.sync(scene, boss, boss._atk ? boss._atk.state : "chase", now);
    return r;
  }
  function step(scene, boss, player, now) {
    const D = window.BOSS_ATTACKS && BOSS_ATTACKS[boss.kind];
    if (!D) return false;
    // Three moves, shared by the Full Life bosses (Nov 4): charge (Performance Review, HOA), rings (Mortgage, Audit), drift (V8, Pickleball).
    const st = D.style || ({ performanceReview: "charge", mortgageRefinance: "rings", midlifeCrisis: "drift" })[boss.kind];
    const a = boss._atk || (boss._atk = { state: "chase", nextAt: now + D.firstAttackDelayMs, skids: [], announced: false });
    const g = gfx(scene, a); g.clear();
    if (!boss.once_cleanup) { boss.once_cleanup = true; boss.once("destroy", () => { if (a.g) a.g.destroy(); if (a.skidG) a.skidG.destroy(); if (a.label) a.label.destroy(); }); }
    tickSkids(scene, a, boss, player, now, D);
    const S = scaling();

    if (a.state === "chase") {
      if (now < a.nextAt || !onScreen(scene, boss) || gameOver) return false;
      // Start the warning.
      a.state = "telegraph"; a.startedAt = now;
      a.until = now + S.tele(D.telegraphMs, st === "rings" ? (T().minTelegraphMsMortgage || 650) : (T().minTelegraphMs || 550));
      const ang = Math.atan2(player.y - boss.y, player.x - boss.x);
      a.aim = ang;
      if (st === "rings") a.gap = ang + (Math.random() < 0.5 ? -1 : 1) * Phaser.Math.DegToRad(60 + Math.random() * 50);
      if (st === "drift") {
        const v = scene.cameras.main.worldView, R = Math.max(90, Math.min(D.loopRadius, 0.32 * Math.min(v.width, v.height)));
        const side = Math.random() < 0.5 ? -1 : 1, off = ang + side * Phaser.Math.DegToRad(55);
        a.R = R; a.cx = boss.x + Math.cos(off) * R; a.cy = boss.y + Math.sin(off) * R;
        a.theta = Math.atan2(boss.y - a.cy, boss.x - a.cx); a.dir = -side; a.traveled = 0; a.lastSkid = 0;
      }
      boss.setVelocity(0, 0); boss.setTint(0xff6b7a);
      if (!a.announced) { a.announced = true; if (window.flashBanner) flashBanner(D.bannerTitle, D.bannerSub, "alert"); }
      sfx("bossSpawn", 0);
    }

    if (a.state === "telegraph") {
      boss.setVelocity(0, 0);
      const k = (now - a.startedAt) / Math.max(1, a.until - a.startedAt), blink = reduceMotion ? 0.6 : 0.35 + 0.35 * Math.abs(Math.sin(now / 70));
      if (window.BossArt) { // ChatGPT's floor decal for this attack, fading in
        if (st === "charge") BossArt.marker(scene, boss, boss.x + Math.cos(a.aim) * 190, boss.y + Math.sin(a.aim) * 190, a.aim, 1, 1, 0.35 + 0.5 * k);
        else if (st === "rings") BossArt.marker(scene, boss, boss.x, boss.y + 30, 0, 1.6, 1.6, 0.3 + 0.5 * k);
        else if (st === "drift" && D.driftMarker) BossArt.marker(scene, boss, a.cx, a.cy, a.theta, 1, 1, 0.3 + 0.5 * k);
      }
      if (st === "charge") {
        const ex = boss.x + Math.cos(a.aim) * D.chargeMaxDist, ey = boss.y + Math.sin(a.aim) * D.chargeMaxDist;
        g.lineStyle(D.bodyHalfW * 2 + 24, 0xef9347, 0.18 + 0.12 * k).lineBetween(boss.x, boss.y, ex, ey);
        g.lineStyle(3, 0xef9347, blink).lineBetween(boss.x, boss.y, ex, ey);
        if (!reduceMotion) for (let i = 0; i < 4; i++) { // chevrons sliding down the lane
          const d = ((now / 3 + i * D.chargeMaxDist / 4) % D.chargeMaxDist), cx = boss.x + Math.cos(a.aim) * d, cy = boss.y + Math.sin(a.aim) * d;
          g.fillStyle(0xef9347, 0.8).fillTriangle(cx + Math.cos(a.aim) * 10, cy + Math.sin(a.aim) * 10, cx + Math.cos(a.aim + 2.4) * 9, cy + Math.sin(a.aim + 2.4) * 9, cx + Math.cos(a.aim - 2.4) * 9, cy + Math.sin(a.aim - 2.4) * 9);
        }
      } else if (st === "rings") {
        drawRing(g, boss.x, boss.y, 140, a.gap, D.gapArcDeg, D.color || 0x9b6bd6, blink, 6);
        gapMarker(scene, a, boss, 140);
      } else if (st === "drift") {
        g.lineStyle(3, D.color || 0xe0564f, blink).strokeCircle(a.cx, a.cy, a.R);
        g.lineStyle(D.bodyHalfW * 2, D.color || 0xe0564f, 0.12).strokeCircle(a.cx, a.cy, a.R);
      }
      if (now >= a.until) { if (window.BossArt) BossArt.hideMarker(boss); a.state = "attack"; a.startedAt = now; a.rings = []; a.lastX = null; a.sx = boss.x; a.sy = boss.y; boss.clearTint(); pass(boss, true); if (a.label) a.label.setVisible(st === "rings"); }
      return true;
    }

    if (a.state === "attack") {
      const t = now - a.startedAt;
      let done = false;
      if (st === "charge") {
        const spd = D.chargeSpeed * S.speed;
        // Hit a wall? Either the map says so, or the physics stopped the charge short (Nov 5: north walls stop bosses ~30 px early).
        const b = boss.body, stalled = a.lastX != null && Math.hypot(boss.x - a.lastX, boss.y - a.lastY) < 0.5;
        if (t > 60 && (wallHit(scene, boss, D) || (((b && !b.blocked.none) || (t > 140 && stalled)) && wallHit(scene, boss, D, null, null, 40)))) { bonk(scene, boss, a, now); return true; }
        a.lastX = boss.x; a.lastY = boss.y;
        boss.setVelocity(Math.cos(a.aim) * spd, Math.sin(a.aim) * spd);
        if (touches(player, boss.x, boss.y, D.bodyHalfW, D.bodyHalfH)) hit(player, boss, D.damage);
        g.lineStyle(D.bodyHalfW * 2, 0xef9347, 0.12).lineBetween(a.sx, a.sy, boss.x, boss.y);
        done = t > D.chargeDurationMs || Math.hypot(boss.x - a.sx, boss.y - a.sy) > D.chargeMaxDist;
      } else if (st === "rings") {
        boss.setVelocity(0, 0);
        const pb = player.body, px = pb ? pb.center.x : player.x, py = pb ? pb.center.y : player.y;
        const dist = Math.hypot(px - boss.x, py - boss.y), pang = Math.atan2(py - boss.y, px - boss.x);
        const inGap = Math.abs(Phaser.Math.Angle.Wrap(pang - a.gap)) <= Phaser.Math.DegToRad(D.gapArcDeg / 2);
        let alive = 0;
        for (let i = 0; i < D.ringCount; i++) {
          const rt = t - i * D.ringGapMs; if (rt < 0) { alive++; continue; }
          const r = D.startRadius + D.expandSpeed * S.speed * rt / 1000;
          if (r > D.maxRadius) continue;
          alive++;
          drawRing(g, boss.x, boss.y, r, a.gap, D.gapArcDeg, D.color || 0x9b6bd6, 0.85, D.ringHalfThickness * 2);
          if (!inGap && Math.abs(dist - r) <= D.ringHalfThickness + 20) hit(player, boss, D.damage); // +20: about half the player's body
        }
        gapMarker(scene, a, boss, Math.min(D.maxRadius, D.startRadius + D.expandSpeed * S.speed * t / 1000));
        done = alive === 0;
      } else if (st === "drift") {
        const step = D.driftSpeed * S.speed * (scene.game.loop.delta / 1000);
        a.theta += a.dir * step / a.R; a.traveled += step;
        const nx = a.cx + Math.cos(a.theta) * a.R, ny = a.cy + Math.sin(a.theta) * a.R;
        if (wallHit(scene, boss, D, nx, ny)) { a.aim = a.theta + a.dir * Math.PI / 2; a.lastX = boss.x; a.lastY = boss.y; bonk(scene, boss, a, now); return true; } // the V8 spins out on a wall too
        boss.setVelocity(0, 0); boss.setPosition(nx, ny); if (boss.body) boss.body.reset(nx, ny);
        boss.setFlipX(Math.sin(a.theta) * a.dir > 0);
        if (a.traveled - a.lastSkid >= D.skidEveryPx) { a.lastSkid = a.traveled; a.skids.push({ x: nx, y: ny, ang: a.theta + Math.PI / 2, dieAt: now + D.skidLifeMs }); }
        if (touches(player, boss.x, boss.y, D.bodyHalfW, D.bodyHalfH)) hit(player, boss, D.damage);
        done = a.traveled >= D.loopRevs * Math.PI * 2 * a.R;
      }
      if (done) { a.state = "recover"; a.startedAt = now; pass(boss, false); if (a.label) a.label.setVisible(false); }
      return true;
    }

    if (a.state === "stagger") { // knocked back, then wobbling: no damage, then back to the chase
      const B = T().wallBonk || {}, t = now - a.startedAt, dizzyMs = B.dizzyMs || 700;
      if (now < a.bounceUntil) { const k = 1 - t / (a.bounceUntil - a.startedAt); boss.setVelocity(a.bounceVx * k, a.bounceVy * k); }
      else boss.setVelocity(0, 0);
      boss._wobble = reduceMotion ? 0 : Math.sin(t / 55) * 10 * Math.max(0, 1 - t / ((B.bounceMs || 320) + dizzyMs));
      moveStars(boss, t, (B.bounceMs || 320) + dizzyMs);
      if (t > (B.bounceMs || 320) + dizzyMs) { boss._wobble = 0; a.state = "chase"; a.nextAt = now + D.cooldownMs; return false; }
      return true;
    }

    if (a.state === "recover") {
      if (now - a.startedAt > (D.recoverMs || 300)) { a.state = "chase"; a.nextAt = now + D.cooldownMs; }
      return false; // a slowed normal chase
    }
    return false;
  }

  function drawRing(g, x, y, r, gap, gapDeg, color, alpha, width) {
    const half = Phaser.Math.DegToRad(gapDeg / 2);
    g.lineStyle(width, color, alpha);
    g.beginPath(); g.arc(x, y, r, gap + half, gap - half + Math.PI * 2, false); g.strokePath();
    g.lineStyle(2, 0xf2d7a1, 0.9); // cream tick marks at the edges of the safe gap
    for (const s of [-1, 1]) { const ang = gap + s * half; g.lineBetween(x + Math.cos(ang) * (r - 10), y + Math.sin(ang) * (r - 10), x + Math.cos(ang) * (r + 10), y + Math.sin(ang) * (r + 10)); }
  }
  function gapMarker(scene, a, boss, r) {
    if (!a.label || !a.label.active) a.label = scene.add.text(0, 0, (BOSS_ATTACKS[boss.kind] || {}).gapLabel || "%", { fontFamily: "monospace", fontSize: "20px", color: "#f2d7a1", fontStyle: "bold", backgroundColor: "#171c35cc", padding: { x: 4, y: 1 } }).setOrigin(0.5).setDepth(20001);
    a.label.setVisible(true).setPosition(boss.x + Math.cos(a.gap) * r, boss.y + Math.sin(a.gap) * r);
  }
  function tickSkids(scene, a, boss, player, now, D) {
    const g = a.skidG; if (!g) return; g.clear();
    a.skids = a.skids.filter(s => s.dieAt > now);
    for (const s of a.skids) {
      const life = (s.dieAt - now) / D.skidLifeMs;
      g.fillStyle(0x1b1b22, 0.55 * Math.min(1, life * 2));
      const c = Math.cos(s.ang), si = Math.sin(s.ang), hw = D.skidHalfW, hl = D.skidHalfL / 2;
      for (const off of [-hw * 0.6, hw * 0.6]) { // two tire tracks
        const ox = -si * off, oy = c * off;
        g.fillPoints([{ x: s.x + ox + c * hl - si * 3, y: s.y + oy + si * hl + c * 3 }, { x: s.x + ox + c * hl + si * 3, y: s.y + oy + si * hl - c * 3 },
          { x: s.x + ox - c * hl + si * 3, y: s.y + oy - si * hl - c * 3 }, { x: s.x + ox - c * hl - si * 3, y: s.y + oy - si * hl + c * 3 }], true);
      }
      if (touches(player, s.x, s.y, D.skidHalfW, D.skidHalfW)) hit(player, boss, D.skidDamage);
    }
  }
  return { update };
})();
