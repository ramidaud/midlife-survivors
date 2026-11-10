// The Fifth-Grade Math Homework (Maple Hollow, age 45). Nov 10. Art by ChatGPT/Codex: assets/bosses/boss-math-homework-v1.png
// plus extras (paper airplanes, eraser crumbs, a crumpled ball, a gold star). Numbers: BOSS_ATTACKS.mathHomework in src/data/bosses.js.
// One move, "Pop Quiz": he stops, leans back and scribbles (dotted fan lines show where the planes will fly), then throws a
// fan of paper airplanes. Step into a gap between the lines. Below half health he throws a second, offset fan, and he
// lobs crumpled paper balls that land on marked circles. Planes fly on after he goes back to walking, so the fan keeps moving.
window.MathHomework = (() => {
  const T = () => window.BOSS_ATTACK_TUNING || {};
  const D = () => (window.BOSS_ATTACKS && BOSS_ATTACKS.mathHomework) || {};
  const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const EX = "mh_extras";
  let planes = [], balls = [], g = null;

  function preload(scene) { if (window.ArtSheets) ArtSheets.load(scene, EX, "assets/bosses/boss-math-homework-extras-v1.png", 32, 32); }
  function scaling() {
    const t = T(), years = Math.max(0, currentAge - (t.ageRefYear || 40)), tax = (typeof runTaxBracket !== "undefined" ? runTaxBracket : 0) || 0;
    return {
      tele: (base, floor) => Math.max(floor, base - years * (t.telegraphAgeCutPerYear || 0) - tax * (t.telegraphTaxCutPerBracket || 0)),
      speed: Math.min(t.speedMultCap || 1.45, 1 + years * (t.speedAgeAddPerYear || 0) + tax * (t.speedTaxAddPerBracket || 0))
    };
  }
  const onScreen = (scene, b) => { const v = scene.cameras.main.worldView, m = T().onScreenMargin || 40; return b.x > v.x - m && b.x < v.right + m && b.y > v.y - m && b.y < v.bottom + m; };
  const pCenter = () => { const b = player.body; return b ? { x: b.center.x, y: b.center.y, hw: b.halfWidth, hh: b.halfHeight } : { x: player.x, y: player.y, hw: 20, hh: 24 }; };
  const hurt = (boss, dmg, x, y) => hurtPlayer(player, { kind: "mathHomework", damage: dmg, x, y });

  // The fan: n lanes spread around the aim. The second volley sits halfway between the first one's lanes.
  function lanes(aim, n, spreadDeg, offsetHalf) {
    const out = [], step = n > 1 ? Phaser.Math.DegToRad(spreadDeg) / (n - 1) : 0, start = aim - step * (n - 1) / 2 + (offsetHalf ? step / 2 : 0);
    for (let i = 0; i < n - (offsetHalf ? 1 : 0); i++) out.push(start + i * step);
    return out;
  }
  function launch(scene, boss, angles, C, S) {
    const sx = boss.x, sy = boss.y - 30; // from his hands, not his feet
    angles.forEach((ang, i) => {
      const spr = scene.textures.exists(EX) ? scene.add.sprite(sx, sy, EX, i % 2).setDepth(boss.depth + 2).setRotation(ang) : null;
      planes.push({ x: sx, y: sy, ang, spd: C.planeSpeed * S.speed, dist: 0, max: C.planeRange, spr, frameAt: 0, flap: i % 2, dead: false });
    });
    // a puff of eraser crumbs where he threw
    if (scene.textures.exists(EX) && !reduceMotion) for (let k = 0; k < 3; k++) {
      const c = scene.add.image(sx + Phaser.Math.Between(-18, 18), sy + Phaser.Math.Between(-6, 10), EX, 2).setDepth(boss.depth + 1).setScale(0.8);
      scene.tweens.add({ targets: c, y: c.y + 26, alpha: 0, duration: 650, onComplete: () => c.destroy() });
    }
    if (window.sfx) sfx("pick", 0);
  }
  function lob(scene, boss, C, now) {
    const P = C.phase2.balls, pc = pCenter();
    for (let i = 0; i < P.count; i++) {
      const a = Math.random() * Math.PI * 2, r = i === 0 ? 0 : Phaser.Math.Between(P.scatterMinPx, P.scatterMaxPx);
      const tx = pc.x + Math.cos(a) * r, ty = pc.y + Math.sin(a) * r;
      const spr = scene.textures.exists(EX) ? scene.add.image(boss.x, boss.y - 40, EX, 3).setDepth(20001) : null;
      balls.push({ sx: boss.x, sy: boss.y - 40, tx, ty, t0: now + i * P.staggerMs, flight: P.flightMs, r: P.radius, dmg: P.damage, spr, done: false });
    }
  }
  function tickProjectiles(scene, now) {
    if (!g || !g.active) g = scene.add.graphics().setDepth(19999); // above every floor (Maple Hollow's lawn sits high)
    g.clear();
    const dt = Math.min(0.05, scene.game.loop.delta / 1000), pc = pCenter(), C = D();
    for (const p of planes) {
      if (p.dead) continue;
      const step = p.spd * dt; p.x += Math.cos(p.ang) * step; p.y += Math.sin(p.ang) * step; p.dist += step;
      if (p.spr) {
        if (now - p.frameAt > 100) { p.frameAt = now; p.flap ^= 1; p.spr.setFrame(p.flap); }
        p.spr.setPosition(p.x, p.y).setAlpha(p.dist > p.max - 80 ? Math.max(0, (p.max - p.dist) / 80) : 1);
      } else g.fillStyle(0xFFF0CF, 1).fillTriangle(p.x + Math.cos(p.ang) * 12, p.y + Math.sin(p.ang) * 12, p.x + Math.cos(p.ang + 2.5) * 10, p.y + Math.sin(p.ang + 2.5) * 10, p.x + Math.cos(p.ang - 2.5) * 10, p.y + Math.sin(p.ang - 2.5) * 10);
      if (!gameOver && Math.abs(pc.x - p.x) <= (C.planeHalf || 10) + pc.hw && Math.abs(pc.y - p.y) <= (C.planeHalf || 10) + pc.hh) { hurt(null, C.damage, p.x, p.y); p.dead = true; }
      if (p.dist >= p.max) p.dead = true;
      if (p.dead && p.spr) p.spr.destroy();
    }
    planes = planes.filter(p => !p.dead);
    for (const b of balls) {
      if (b.done) continue;
      const k = (now - b.t0) / b.flight;
      // the landing circle shows from the moment it's thrown
      g.lineStyle(2, 0xC45C4B, reduceMotion ? 0.7 : 0.45 + 0.35 * Math.abs(Math.sin(now / 90))).strokeCircle(b.tx, b.ty, b.r);
      g.fillStyle(0xC45C4B, 0.12 + 0.18 * Math.max(0, k)).fillCircle(b.tx, b.ty, b.r * Math.max(0.2, Math.min(1, k)));
      if (k < 0) { if (b.spr) b.spr.setVisible(false); continue; }
      const x = b.sx + (b.tx - b.sx) * k, y = b.sy + (b.ty - b.sy) * k - Math.sin(Math.PI * Math.min(1, k)) * 120;
      if (b.spr) b.spr.setVisible(true).setPosition(x, y).setRotation(k * 6);
      if (k >= 1) {
        b.done = true;
        if (!gameOver && Math.hypot(pc.x - b.tx, pc.y - b.ty) <= b.r + Math.min(pc.hw, pc.hh)) hurt(null, b.dmg, b.tx, b.ty);
        if (b.spr) scene.tweens.add({ targets: b.spr, alpha: 0, scale: 0.6, duration: 300, onComplete: () => b.spr.destroy() });
      }
    }
    balls = balls.filter(b => !b.done);
  }

  // Returns true while the attack is steering him (the normal chase is skipped).
  function update(scene, boss, player, now) {
    const C = D(), S = scaling();
    if (!boss._atk) clear(); // a fresh fight: drop anything left over from an earlier run
    tickProjectiles(scene, now);
    const a = boss._atk || (boss._atk = { state: "chase", nextAt: now + C.firstAttackDelayMs, announced: false });
    if (!a.cleanup) { a.cleanup = true; boss.once("destroy", () => { clear(); if (a.g) a.g.destroy(); }); }
    if (!a.g || !a.g.active) a.g = scene.add.graphics().setDepth(19999);
    a.g.clear();
    const p2 = C.phase2 && boss.hpMax && boss.hp / boss.hpMax <= C.phase2.atHpFrac;

    if (a.state === "chase") {
      if (now < a.nextAt || !onScreen(scene, boss) || gameOver) return false;
      a.state = "telegraph"; a.startedAt = now; a.until = now + S.tele(C.telegraphMs, T().minTelegraphMs || 550);
      const pc = pCenter(); a.aim = Math.atan2(pc.y - (boss.y - 30), pc.x - boss.x);
      a.n = p2 ? C.phase2.planes : C.planes; a.spread = p2 ? C.phase2.spreadDeg : C.spreadDeg;
      a.volleys = p2 ? C.phase2.volleys : 1;
      boss.setVelocity(0, 0);
      if (!a.announced) { a.announced = true; if (window.flashBanner) flashBanner(C.bannerTitle, C.bannerSub, "alert", { bossFirst: true }); }
      if (window.sfx) sfx("bossSpawn", 0);
      if (p2 && !a.p2Said && window.flashBanner) { a.p2Said = true; flashBanner(C.phase2.bannerTitle, C.phase2.bannerSub, "alert"); }
    }
    if (a.state === "telegraph") {
      boss.setVelocity(0, 0);
      const k = (now - a.startedAt) / Math.max(1, a.until - a.startedAt), sx = boss.x, sy = boss.y - 30, L = C.planeRange * 0.75;
      const alpha = reduceMotion ? 0.7 : 0.3 + 0.5 * k;
      const dash = (ang, col) => { for (let d = 34; d < L; d += 22) { const x = sx + Math.cos(ang) * d, y = sy + Math.sin(ang) * d; a.g.fillStyle(0x171C35, alpha).fillRect(x - 4, y - 4, 9, 9); a.g.fillStyle(col, alpha).fillRect(x - 2, y - 2, 5, 5); } };
      lanes(a.aim, a.n, a.spread, false).forEach(ang => dash(ang, 0xFFF0CF));
      if (a.volleys > 1) lanes(a.aim, a.n, a.spread, true).forEach(ang => dash(ang, 0xEF9347));
      if (now >= a.until) {
        a.state = "attack"; a.startedAt = now; a.fired = 0;
        launch(scene, boss, lanes(a.aim, a.n, a.spread, false), C, S); a.fired = 1;
        if (p2 && C.phase2.balls) lob(scene, boss, C, now);
      }
      return true;
    }
    if (a.state === "attack") {
      boss.setVelocity(0, 0);
      if (a.fired < a.volleys && now - a.startedAt >= C.phase2.volleyGapMs) { launch(scene, boss, lanes(a.aim, a.n, a.spread, true), C, S); a.fired++; }
      if (now - a.startedAt >= C.attackPoseMs + (a.volleys > 1 ? C.phase2.volleyGapMs : 0)) { a.state = "recover"; a.startedAt = now; }
      return true;
    }
    if (a.state === "recover") {
      if (now - a.startedAt > (C.recoverMs || 300)) { a.state = "chase"; a.nextAt = now + C.cooldownMs; }
      return false;
    }
    return false;
  }
  function clear() {
    planes.forEach(p => p.spr && p.spr.destroy()); balls.forEach(b => b.spr && b.spr.destroy());
    planes = []; balls = []; if (g) { g.destroy(); g = null; }
  }
  return { preload, update, clear, count: () => ({ planes: planes.length, balls: balls.length }) };
})();
