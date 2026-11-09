// The Holiday Party (Nov 9). Grok's spec: docs/handoffs/grok-office-bosses-spec.md, section 2. Numbers: src/data/bosses.js.
// The leader chases you slowly while a conga line of ugly-sweater coworkers follows his exact path.
// Knock a dancer out of line (or pay one off) to open a doorway. Mistletoe circles drop near you: step in one and
// you slow down for an awkward moment (Rami, Nov 9: a slow, not a full stop), but nothing can hurt you during it.
// Below half health: more dancers, three circles, and a short Group Hug lunge.
window.HolidayParty = (() => {
  const T = () => window.BOSS_ATTACK_TUNING || {};
  const D = () => (window.BOSS_ATTACKS && BOSS_ATTACKS.holidayParty) || {};
  const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const TINTS = [0xffffff, 0xd9efe6, 0xffe1e6, 0xe6e0ff, 0xfff0cf, 0xe0f0ff, 0xf6e6d2];
  let slowUntil = 0, safeUntil = 0, immuneUntil = 0, lastCatch = -1e9;

  function scaling() {
    const t = T(), years = Math.max(0, currentAge - (t.ageRefYear || 40)), tax = (typeof runTaxBracket !== "undefined" ? runTaxBracket : 0) || 0;
    return {
      tele: (base, floor) => Math.max(floor, base - years * (t.telegraphAgeCutPerYear || 0) - tax * (t.telegraphTaxCutPerBracket || 0)),
      speed: Math.min(t.speedMultCap || 1.45, 1 + years * (t.speedAgeAddPerYear || 0) + tax * (t.speedTaxAddPerBracket || 0))
    };
  }
  const pc = p => (p.body ? { x: p.body.center.x, y: p.body.center.y } : { x: p.x, y: p.y });
  const onScreen = (scene, b) => { const v = scene.cameras.main.worldView, m = T().onScreenMargin || 40; return b.x > v.x - m && b.x < v.right + m && b.y > v.y - m && b.y < v.bottom + m; };
  function openFloor(scene, x, y, r) { // no walls, closed doors or off-floor within r (so you can't get pinned)
    const L = window.START_AREA_LAYOUT, sa = scene.worldArt && scene.worldArt.startArea;
    if (sa && (!sa.contains(x, y) || !sa.contains(x - r, y) || !sa.contains(x + r, y) || !sa.contains(x, y - r) || !sa.contains(x, y + r))) return false;
    const over = q => x + r > q.x && x - r < q.x + q.width && y + r > q.y && y - r < q.y + q.height;
    if (L && L.walls && L.walls.some(over)) return false;
    if ((window.START_AREA_GATES || []).some(g => !g.opened && g.rect && over({ x: g.rect.x, y: g.rect.y, width: g.rect.w, height: g.rect.h }))) return false;
    // no desks, counters, kiosks or other solid furniture inside the circle either (Grok: never pinned against furniture)
    const pg = window.propGroup;
    if (pg && pg.getChildren().some(o => o.active && o.body && o.body.enable && over({ x: o.body.x, y: o.body.y, width: o.body.width, height: o.body.height }))) return false;
    return true;
  }

  // ---- the conga line ----
  function addGuest(scene, boss, a) {
    const C = D().conga || {};
    const tail = a.line.length ? a.line[a.line.length - 1] : boss;
    const e = createEnemy(scene, "partyGuest", tail.x - 20, tail.y + 6);
    if (!e) return null;
    e.party = boss; e.inLine = true; e.waitUntil = 0;
    e.setVisible(false); if (e.tag) e.tag.setVisible(false);
    if (scene.textures.exists("bossart_holidayParty")) {
      const v = scene.add.sprite(e.x, e.y, "bossart_holidayParty", 0).setOrigin(0.5, 148 / 152).setScale(C.guestScale || 0.42).setTint(TINTS[a.joined % TINTS.length]);
      e.artRecord = { visual: v }; e._pv = v;
      e.once("destroy", () => { if (v.active) v.destroy(); });
    }
    a.joined++;
    a.line.push(e);
    const pop = scene.add.text(e.x, e.y - 40, "+1", { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#FFF0CF", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(50004);
    scene.tweens.add({ targets: pop, y: pop.y - 18, alpha: 0, duration: 700, onComplete: () => pop.destroy() });
    return e;
  }
  // Called from the main enemy loop for each partyGuest. Returns true when it steered the guest.
  function steerGuest(scene, e, now) {
    const C = D().conga || {}, boss = e.party, a = boss && boss._atk;
    if (e._pv) { // draw the little dancer
      const moving = Math.hypot(e.body.velocity.x, e.body.velocity.y) > 8;
      e._pv.setPosition(Math.round(e.x), Math.round(e.y + 14)).setDepth(e.depth + 0.5).setFrame(moving ? Math.floor(now / 140) % 6 : 0);
      if (Math.abs(e.body.velocity.x) > 5) e._pv.setFlipX(e.body.velocity.x < 0);
      const k = e.hitAt ? (now - e.hitAt) / 120 : 1, s = C.guestScale || 0.42;
      if (k >= 0 && k < 1) { const w = Math.sin(Math.PI * k); e._pv.setScale(s * (1 + 0.12 * w), s * (1 - 0.1 * w)); } else e._pv.setScale(s);
    }
    if (!e.inLine || !boss || !boss.active || !a) { e.inLine = false; return false; } // out of line: a normal coworker wandering at you
    const idx = a.line.indexOf(e);
    if (idx < 0) { e.inLine = false; return false; }
    const want = Math.round((idx + 1) * (C.spacingPx || 34) / (C.crumbEveryPx || 8));
    const pt = a.crumbs[Math.min(want, a.crumbs.length - 1)] || { x: boss.x, y: boss.y };
    const dx = pt.x - e.x, dy = pt.y - e.y, d = Math.hypot(dx, dy);
    if (d > (C.leaveLineAtPx || 110) && now > e.waitUntil + 1500) { // knocked clean out of line (Dad Joke, "No.")
      e.inLine = false; a.line.splice(idx, 1); return false;
    }
    if (now < e.waitUntil) { e.setVelocity(0, 0); return true; } // "hey, wait up!"
    const lead = boss.speed || 62, spd = d > 6 ? Math.min(lead * (C.catchUpMult || 1.6), d * 8) : 0;
    e.setVelocity(d > 0.5 ? dx / d * spd : 0, d > 0.5 ? dy / d * spd : 0);
    return true;
  }
  function tidyLine(a, now) { // a dancer dropped: everyone behind waits a moment, then catches up
    const C = D().conga || {};
    for (let i = 0; i < a.line.length; i++) {
      if (!a.line[i].active) {
        for (let j = i + 1; j < a.line.length; j++) a.line[j].waitUntil = now + (C.waitMs || 500);
        a.line.splice(i, 1); i--;
      }
    }
  }
  function drawTinsel(g, boss, a) {
    if (!a.line.length) return;
    g.lineStyle(3, 0xEF9347, 0.85).beginPath(); g.moveTo(boss.x, boss.y);
    for (const e of a.line) if (e.active && e.inLine) g.lineTo(e.x, e.y);
    g.strokePath();
    a.line.forEach((e, i) => { if (e.active && e.inLine) g.fillStyle([0xF1B5BF, 0x83A89A, 0xF2D7A1][i % 3], 1).fillCircle(e.x, e.y - 4, 4); }); // little party bulbs
  }

  // ---- mistletoe ----
  function placeZones(scene, boss, a, player, count) {
    const M = D().mistletoe || {}, r = M.radius || 56, p = pc(player), zones = [];
    const tryAdd = (x, y) => {
      if (!openFloor(scene, x, y, r + (M.propClearPx || 48) * 0.5)) return false;
      if (zones.some(z => Math.hypot(z.x - x, z.y - y) < r * 2 + (M.edgeGapPx || 64))) return false;
      zones.push({ x, y, r }); return true;
    };
    if (!tryAdd(p.x, p.y)) { // the first one lands on you, so you have to move (nudged if you're hugging a wall)
      for (let i = 0; i < 8 && !zones.length; i++) { const ang = i * Math.PI / 4; tryAdd(p.x + Math.cos(ang) * 40, p.y + Math.sin(ang) * 40); }
    }
    const base = Math.random() * Math.PI * 2;
    for (let i = 0, tries = 0; zones.length < count && tries < 24; tries++, i++) {
      const ang = base + (i % 3) * Phaser.Math.DegToRad(Math.max(100, M.minAngleDeg || 100)) + Phaser.Math.FloatBetween(-0.25, 0.25);
      const dist = Phaser.Math.Between(M.nearMinPx || 160, M.nearMaxPx || 240);
      tryAdd(p.x + Math.cos(ang) * dist, p.y + Math.sin(ang) * dist);
    }
    return zones;
  }
  function drawZone(scene, boss, g, z, k, armed, now) {
    const pink = 0xF1B5BF, lav = 0xBFA8CF;
    if (!armed) { // dashed and growing: coming
      const rr = z.r * (0.55 + 0.45 * k), segs = 16;
      g.lineStyle(3, lav, 0.85);
      for (let i = 0; i < segs; i += 2) { g.beginPath(); g.arc(z.x, z.y, rr, i / segs * Math.PI * 2, (i + 1) / segs * Math.PI * 2); g.strokePath(); }
      g.fillStyle(pink, 0.10 + 0.10 * k).fillCircle(z.x, z.y, rr);
    } else { // solid: live
      const pulse = reduceMotion ? 0 : Math.sin(now / 160) * 2;
      g.fillStyle(pink, 0.22).fillCircle(z.x, z.y, z.r);
      g.lineStyle(4, lav, 0.95).strokeCircle(z.x, z.y, z.r + pulse);
    }
    if (!z.img && scene.textures.exists("bossmark_holidayParty")) z.img = scene.add.image(z.x, z.y, "bossmark_holidayParty").setDepth(3);
    if (z.img) z.img.setDisplaySize(z.r * 2.3, z.r * 2.3 * 128 / 192).setAlpha(armed ? 0.95 : 0.3 + 0.5 * k);
  }
  function clearZone(z) { if (z.img) z.img.destroy(); z.img = null; }
  function caught(scene, a, z, player) {
    const M = D().mistletoe || {}, nowT = scene.time.now;
    lastCatch = runElapsedMs;
    slowUntil = runElapsedMs + (M.slowAltMs || 900);
    safeUntil = nowT + (M.slowAltMs || 900) + (M.safeAfterMs || 400);
    immuneUntil = runElapsedMs + (M.immuneMs || 2500);
    a.nextAt = Math.max(a.nextAt || 0, runElapsedMs + (M.noFollowUpMs || 1500));
    z.dead = true; clearZone(z);
    const p = pc(player);
    if (typeof burstConfetti === "function") burstConfetti(scene, z.x, z.y, 0xF1B5BF, 10);
    const t = scene.add.text(p.x, p.y - 58, Phaser.Utils.Array.GetRandom(M.awkwardLines || ["...hi."]), { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: "#F1B5BF", padding: { x: 5, y: 3 } }).setOrigin(0.5).setDepth(50005);
    scene.tweens.add({ targets: t, y: t.y - 16, alpha: 0, delay: 600, duration: 500, onComplete: () => t.destroy() });
    if (typeof sfx === "function") sfx("pick", 0);
    // personal space: nearby coworkers (not the boss, not the conga) take a polite step back
    if (typeof bills !== "undefined" && typeof shoveEnemy === "function") bills.getChildren().forEach(o => {
      if (!o.active || o.isBoss || o.kind === "partyGuest") return;
      const d = Math.hypot(o.x - p.x, o.y - p.y); if (d > 0 && d < (M.shoveRadius || 120)) shoveEnemy(o, (o.x - p.x) / d, (o.y - p.y) / d, M.shovePx || 80);
    });
  }

  // ---- the fight ----
  function update(scene, boss, player, now) {
    const P = D(), C = P.conga || {}, M = P.mistletoe || {}, P2 = P.phase2 || {}, S = scaling();
    const a = boss._atk || (boss._atk = { state: "chase", nextAt: now + (P.firstAttackDelayMs || 2000), announced: false, line: [], crumbs: [], zones: [], joined: 0, nextJoin: 0, flip: 0 });
    if (!a.g || !a.g.active) { a.g = scene.add.graphics().setDepth(20000); a.tg = scene.add.graphics().setDepth(3.5); }
    if (!a.hooked) { a.hooked = true; boss.once("destroy", () => { if (a.g) a.g.destroy(); if (a.tg) a.tg.destroy(); a.zones.forEach(clearZone); a.line.forEach(e => { if (e.active) e.inLine = false; }); }); }
    const g = a.g; g.clear(); a.tg.clear();
    const phase2 = boss.hpMax && boss.hp / boss.hpMax <= (P2.atHpFrac || 0.5);
    boss.speed = (phase2 ? (P2.walkSpeed || 70) : (ENEMIES.holidayParty.speed || 62)) * (typeof runSprint !== "undefined" && runSprint && window.SPRINT ? SPRINT.enemySpeedMult : 1);

    // breadcrumbs for the conga line
    const last = a.crumbs[0];
    if (!last || Math.hypot(boss.x - last.x, boss.y - last.y) >= (C.crumbEveryPx || 8)) { a.crumbs.unshift({ x: boss.x, y: boss.y }); if (a.crumbs.length > 80) a.crumbs.length = 80; }
    tidyLine(a, now);
    const maxLine = phase2 ? (P2.congaMax || 7) : (C.max || 5);
    if (!a.started) {
      a.started = true; for (let i = 0; i < (C.start || 5); i++) addGuest(scene, boss, a); a.nextJoin = now + (C.joinEveryMs || 8000);
      if (typeof burstConfetti === "function") [0, 200, 400].forEach(t => scene.time.delayedCall(t, () => boss.active && burstConfetti(scene, boss.x + Phaser.Math.Between(-40, 40), boss.y - 40, [0xF1B5BF, 0x83A89A, 0xEF9347][t / 200], 16)));
      if (window.Lighting && Lighting.fx) try { Lighting.fx("levelUp", boss.x, boss.y); } catch (e) {}
    }
    else if (now >= a.nextJoin) { a.nextJoin = now + (phase2 ? (P2.joinEveryMs || 4000) : (C.joinEveryMs || 8000)); if (a.line.length < maxLine) addGuest(scene, boss, a); }
    drawTinsel(a.tg, boss, a);
    // the line protects her (Nov 9): a tinsel ring around her while 3+ dancers are in line
    const SH = P.shield || {}, inLine = a.line.filter(e => e.active && e.inLine).length, shielded = inLine >= (SH.minLine || 3);
    if (shielded !== !!boss._shielded) {
      boss._shielded = shielded;
      if (boss.tag) boss.tag.setText(`${ENEMIES[boss.kind].label}${shielded ? " 🛡" : ""}:${boss.hp}`);
      if (!shielded && a.started) { // the line broke: tell the player it's their moment
        flash(scene, boss, "LINE BROKEN!", "#83A89A");
        if (typeof sfx === "function") sfx("pick", 0);
      } else if (shielded && a.brokeOnce) flash(scene, boss, "BACK IN LINE!", "#F1B5BF");
      if (!shielded) a.brokeOnce = true;
    }
    if (shielded) {
      const pulse = reduceMotion ? 0 : Math.sin(now / 200) * 3, r = 70 + pulse;
      a.tg.lineStyle(6, 0xEF9347, 0.9).strokeCircle(boss.x, boss.y, r);
      for (let i = 0; i < 10; i++) { const ang = i / 10 * Math.PI * 2 + now / 900; a.tg.fillStyle(i % 2 ? 0xF1B5BF : 0x83A89A, 1).fillCircle(boss.x + Math.cos(ang) * r, boss.y + Math.sin(ang) * r, 6); }
    }

    // armed zones
    const p = pc(player);
    for (const z of a.zones) {
      if (z.dead) continue;
      const armed = now >= z.armAt;
      if (now > z.dieAt) { z.dead = true; clearZone(z); continue; }
      drawZone(scene, boss, g, z, armed ? 1 : Math.min(1, (now - z.bornAt) / Math.max(1, z.armAt - z.bornAt)), armed, now);
      const shielded = typeof buffs !== "undefined" && runElapsedMs < (buffs.drinkShieldUntil || 0); // too wired to stop
      if (armed && !shielded && runElapsedMs > immuneUntil && runElapsedMs - lastCatch > (M.minGapBetweenFreezesMs || 3000) && Math.hypot(p.x - z.x, p.y - z.y) < z.r + 20) caught(scene, a, z, player);
    }
    a.zones = a.zones.filter(z => !z.dead);

    if (a.state === "chase") {
      if (now < a.nextAt || !onScreen(scene, boss) || gameOver) return false;
      const hug = phase2 && (a.flip++ % 2 === 1);
      a.move = hug ? "hug" : "mistletoe"; a.state = "telegraph"; a.startedAt = now;
      boss.setVelocity(0, 0); boss.setTint(0xff6b7a);
      if (hug) {
        const H = P2.groupHug || {};
        a.until = now + S.tele(H.telegraphMs || 700, T().minTelegraphMs || 550);
        a.aim = Math.atan2(player.y - boss.y, player.x - boss.x);
      } else {
        a.until = now + S.tele(P.telegraphMs || 1000, T().minTelegraphMsArea || 750);
        const zones = placeZones(scene, boss, a, player, phase2 ? (P2.zones || 3) : (M.zones || 2));
        zones.forEach(z => { z.bornAt = now; z.armAt = a.until; z.dieAt = a.until + (M.armedMs || 2400); a.zones.push(z); });
      }
      if (!a.announced) { a.announced = true; if (window.flashBanner) flashBanner(P.bannerTitle, P.bannerSub, "alert"); }
      else if (P.partyLines && Math.random() < 0.6) say(scene, boss, Phaser.Utils.Array.GetRandom(P.partyLines));
      sfx("bossSpawn", 0);
    }
    if (a.state === "telegraph") {
      boss.setVelocity(0, 0);
      if (a.move === "hug") {
        const H = P2.groupHug || {}, k = (now - a.startedAt) / Math.max(1, a.until - a.startedAt), len = H.chargeMaxDist || 200, w = (H.bodyHalfW || 22) * 2 + 24;
        const ex = boss.x + Math.cos(a.aim) * len, ey = boss.y + Math.sin(a.aim) * len;
        g.lineStyle(w, 0xF1B5BF, 0.18 + 0.14 * k).lineBetween(boss.x, boss.y, ex, ey);
        g.lineStyle(3, 0xBFA8CF, reduceMotion ? 0.7 : 0.4 + 0.4 * Math.abs(Math.sin(now / 70))).lineBetween(boss.x, boss.y, ex, ey);
      }
      if (now >= a.until) {
        boss.clearTint();
        if (a.move === "hug") { a.state = "attack"; a.startedAt = now; a.sx = boss.x; a.sy = boss.y; if (boss.body) boss.body.checkCollision.none = true; }
        else { a.state = "recover"; a.startedAt = now; }
      }
      return true;
    }
    if (a.state === "attack") { // Group Hug
      const H = P2.groupHug || {}, spd = (H.chargeSpeed || 300) * S.speed, t = now - a.startedAt;
      boss.setVelocity(Math.cos(a.aim) * spd, Math.sin(a.aim) * spd);
      const pb = player.body, hw = (H.bodyHalfW || 22) + (pb ? pb.halfWidth : 24), hh = (H.bodyHalfH || 26) + (pb ? pb.halfHeight : 26);
      if (Math.abs(p.x - boss.x) <= hw && Math.abs(p.y - boss.y) <= hh && scene.time.now >= safeUntil) hurtPlayer(player, { kind: boss.kind, damage: H.damage || 1, x: boss.x, y: boss.y });
      if (Math.hypot(boss.x - a.sx, boss.y - a.sy) >= (H.chargeMaxDist || 200) || t > 1200) { boss.setVelocity(0, 0); if (boss.body) boss.body.checkCollision.none = false; a.state = "recover"; a.startedAt = now; }
      return true;
    }
    if (a.state === "recover") {
      if (now - a.startedAt > (P.recoverMs || 300)) { a.state = "chase"; a.nextAt = Math.max(a.nextAt, now + (P.cooldownMs || 5200)); }
      return false;
    }
    return false;
  }
  function flash(scene, boss, text, color) {
    const t = scene.add.text(boss.x, boss.y - 70, text, { fontFamily: "Silkscreen, monospace", fontSize: "16px", color, stroke: "#171C35", strokeThickness: 4 }).setOrigin(0.5).setDepth(50005);
    scene.tweens.add({ targets: t, y: t.y - 30, alpha: 0, delay: 500, duration: 700, onComplete: () => t.destroy() });
  }
  function shieldDamage(scene, boss, amount) {
    if (!boss._shielded) return amount;
    const now = scene.time.now;
    if (!boss._shieldTipAt || now - boss._shieldTipAt > 4000) { boss._shieldTipAt = now; flash(scene, boss, "BREAK THE LINE!", "#EF9347"); }
    return Math.max(1, Math.round(amount * ((D().shield || {}).damageMult || 0.25)));
  }
  function say(scene, boss, text) {
    const t = scene.add.text(boss.x, boss.y - 96, text, { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#171C35", backgroundColor: "#FFF0CF", padding: { x: 6, y: 4 }, wordWrap: { width: 220 }, align: "center" }).setOrigin(0.5, 1).setDepth(50005);
    scene.tweens.add({ targets: t, alpha: 0, delay: 1600, duration: 400, onComplete: () => t.destroy() });
    const follow = scene.time.addEvent({ delay: 16, repeat: 120, callback: () => { if (t.active && boss.active) t.setPosition(Math.round(boss.x), Math.round(boss.y - 96)); } });
    t.once("destroy", () => follow.remove());
  }

  return {
    update, steerGuest, shieldDamage,
    playerSpeedMult: () => (runElapsedMs < slowUntil ? ((D().mistletoe || {}).slowAltMult || 0.35) : 1),
    safe: nowT => nowT < safeUntil, // no damage during the awkward moment (and a beat after)
    reset: () => { slowUntil = 0; safeUntil = 0; immuneUntil = 0; lastCatch = -1e9; }
  };
})();
