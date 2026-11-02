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
  function pass(boss, on) { if (boss.body) boss.body.checkCollision.none = on; } // walk through furniture during an attack

  // Returns true while the attack system is steering the boss (so the normal chase is skipped).
  function update(scene, boss, player, now) {
    const r = step(scene, boss, player, now);
    if (window.BossArt) BossArt.sync(scene, boss, boss._atk ? boss._atk.state : "chase", now);
    return r;
  }
  function step(scene, boss, player, now) {
    const D = window.BOSS_ATTACKS && BOSS_ATTACKS[boss.kind];
    if (!D) return false;
    const a = boss._atk || (boss._atk = { state: "chase", nextAt: now + D.firstAttackDelayMs, skids: [], announced: false });
    const g = gfx(scene, a); g.clear();
    if (!boss.once_cleanup) { boss.once_cleanup = true; boss.once("destroy", () => { if (a.g) a.g.destroy(); if (a.skidG) a.skidG.destroy(); if (a.label) a.label.destroy(); }); }
    tickSkids(scene, a, boss, player, now, D);
    const S = scaling();

    if (a.state === "chase") {
      if (now < a.nextAt || !onScreen(scene, boss) || gameOver) return false;
      // Start the warning.
      a.state = "telegraph"; a.startedAt = now;
      a.until = now + S.tele(D.telegraphMs, boss.kind === "mortgageRefinance" ? (T().minTelegraphMsMortgage || 650) : (T().minTelegraphMs || 550));
      const ang = Math.atan2(player.y - boss.y, player.x - boss.x);
      a.aim = ang;
      if (boss.kind === "mortgageRefinance") a.gap = ang + (Math.random() < 0.5 ? -1 : 1) * Phaser.Math.DegToRad(60 + Math.random() * 50);
      if (boss.kind === "midlifeCrisis") {
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
        if (boss.kind === "performanceReview") BossArt.marker(scene, boss, boss.x + Math.cos(a.aim) * 190, boss.y + Math.sin(a.aim) * 190, a.aim, 1, 1, 0.35 + 0.5 * k);
        else if (boss.kind === "mortgageRefinance") BossArt.marker(scene, boss, boss.x, boss.y + 30, 0, 1.6, 1.6, 0.3 + 0.5 * k);
      }
      if (boss.kind === "performanceReview") {
        const ex = boss.x + Math.cos(a.aim) * D.chargeMaxDist, ey = boss.y + Math.sin(a.aim) * D.chargeMaxDist;
        g.lineStyle(D.bodyHalfW * 2 + 24, 0xef9347, 0.18 + 0.12 * k).lineBetween(boss.x, boss.y, ex, ey);
        g.lineStyle(3, 0xef9347, blink).lineBetween(boss.x, boss.y, ex, ey);
        if (!reduceMotion) for (let i = 0; i < 4; i++) { // chevrons sliding down the lane
          const d = ((now / 3 + i * D.chargeMaxDist / 4) % D.chargeMaxDist), cx = boss.x + Math.cos(a.aim) * d, cy = boss.y + Math.sin(a.aim) * d;
          g.fillStyle(0xef9347, 0.8).fillTriangle(cx + Math.cos(a.aim) * 10, cy + Math.sin(a.aim) * 10, cx + Math.cos(a.aim + 2.4) * 9, cy + Math.sin(a.aim + 2.4) * 9, cx + Math.cos(a.aim - 2.4) * 9, cy + Math.sin(a.aim - 2.4) * 9);
        }
      } else if (boss.kind === "mortgageRefinance") {
        drawRing(g, boss.x, boss.y, 140, a.gap, D.gapArcDeg, 0x9b6bd6, blink, 6);
        gapMarker(scene, a, boss, 140);
      } else if (boss.kind === "midlifeCrisis") {
        g.lineStyle(3, 0xe0564f, blink).strokeCircle(a.cx, a.cy, a.R);
        g.lineStyle(D.bodyHalfW * 2, 0xe0564f, 0.12).strokeCircle(a.cx, a.cy, a.R);
      }
      if (now >= a.until) { if (window.BossArt) BossArt.hideMarker(boss); a.state = "attack"; a.startedAt = now; a.rings = []; a.sx = boss.x; a.sy = boss.y; boss.clearTint(); pass(boss, true); if (a.label) a.label.setVisible(boss.kind === "mortgageRefinance"); }
      return true;
    }

    if (a.state === "attack") {
      const t = now - a.startedAt;
      let done = false;
      if (boss.kind === "performanceReview") {
        const spd = D.chargeSpeed * S.speed;
        boss.setVelocity(Math.cos(a.aim) * spd, Math.sin(a.aim) * spd);
        if (touches(player, boss.x, boss.y, D.bodyHalfW, D.bodyHalfH)) hit(player, boss, D.damage);
        g.lineStyle(D.bodyHalfW * 2, 0xef9347, 0.12).lineBetween(a.sx, a.sy, boss.x, boss.y);
        done = t > D.chargeDurationMs || Math.hypot(boss.x - a.sx, boss.y - a.sy) > D.chargeMaxDist;
      } else if (boss.kind === "mortgageRefinance") {
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
          drawRing(g, boss.x, boss.y, r, a.gap, D.gapArcDeg, 0x9b6bd6, 0.85, D.ringHalfThickness * 2);
          if (!inGap && Math.abs(dist - r) <= D.ringHalfThickness + 20) hit(player, boss, D.damage); // +20: about half the player's body
        }
        gapMarker(scene, a, boss, Math.min(D.maxRadius, D.startRadius + D.expandSpeed * S.speed * t / 1000));
        done = alive === 0;
      } else if (boss.kind === "midlifeCrisis") {
        const step = D.driftSpeed * S.speed * (scene.game.loop.delta / 1000);
        a.theta += a.dir * step / a.R; a.traveled += step;
        const nx = a.cx + Math.cos(a.theta) * a.R, ny = a.cy + Math.sin(a.theta) * a.R;
        boss.setVelocity(0, 0); boss.setPosition(nx, ny); if (boss.body) boss.body.reset(nx, ny);
        boss.setFlipX(Math.sin(a.theta) * a.dir > 0);
        if (a.traveled - a.lastSkid >= D.skidEveryPx) { a.lastSkid = a.traveled; a.skids.push({ x: nx, y: ny, ang: a.theta + Math.PI / 2, dieAt: now + D.skidLifeMs }); }
        if (touches(player, boss.x, boss.y, D.bodyHalfW, D.bodyHalfH)) hit(player, boss, D.damage);
        done = a.traveled >= D.loopRevs * Math.PI * 2 * a.R;
      }
      if (done) { a.state = "recover"; a.startedAt = now; pass(boss, false); if (a.label) a.label.setVisible(false); }
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
    if (!a.label || !a.label.active) a.label = scene.add.text(0, 0, "%", { fontFamily: "monospace", fontSize: "20px", color: "#f2d7a1", fontStyle: "bold", backgroundColor: "#171c35cc", padding: { x: 4, y: 1 } }).setOrigin(0.5).setDepth(20001);
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
