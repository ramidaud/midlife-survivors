// The Gold Watch (Nov 3): Midlife mode's final boss. A giant retirement watch, ticking down.
// Numbers from Grok (docs/handoffs/grok-gold-watch-spec.md) live in src/data/bosses.js -> BOSS_ATTACKS.goldWatch.
// Words from Gemini, art from ChatGPT. Plan: docs/handoffs/final-boss-gold-watch.md.
//
// How the fight works:
//   - The watch floats slowly toward you and stops about 200 px away. Its hands do the damage.
//   - One attack at a time: a warning (telegraph), the attack, then a pause before the next.
//   - Minute Hand / Hour Hand: a hand sweeps around the watch. Only its LEADING EDGE hurts, so you can
//     run with it, duck inside, or cross behind it once it has passed.
//   - Alarm: rings expand from the bell with a safe gap at 12 o'clock (straight up).
//   - Loose Gears: gears pop out and bounce around the screen.
//   - It can't be beaten (like the Reaper in Vampire Survivors). Your hits wind it back: they push it away and
//     slow its hands for a moment. Reach 65 and the hands stop at 5:00 on their own: you clock out.
//   - Phases follow the clock: Ticking, then Overtime (adds Hour Hand + Alarm), then The Last Minute (faster).
//   - While it's alive the everyday swarm thins out (see duel() below), so it's a duel, not a second wall.
window.GoldWatch = (() => {
  const D = () => (window.BOSS_ATTACKS && BOSS_ATTACKS.goldWatch) || {};
  const T = () => window.BOSS_ATTACK_TUNING || {};
  const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const UP = -Math.PI / 2; // 12 o'clock
  const wrap = a => Phaser.Math.Angle.Wrap(a);

  function preload(scene) {
    scene.load.image("gw_minute", "assets/bosses/gold-watch-minute-hand-v1.png");
    scene.load.image("gw_hour", "assets/bosses/gold-watch-hour-hand-v1.png");
    scene.load.spritesheet("gw_gear", "assets/bosses/gold-watch-gear-v1.png", { frameWidth: 24, frameHeight: 24 });
    if (!scene.load.isLoading()) scene.load.start(); // called from create(), so start the loader ourselves
  }

  // Same age/Tax scaling the other bosses use (warnings shrink, attacks speed up a little, both with floors/caps).
  function scaling() {
    const t = T(), years = Math.max(0, currentAge - (t.ageRefYear || 40)), tax = (typeof runTaxBracket !== "undefined" ? runTaxBracket : 0) || 0;
    return {
      tele: (base, floor) => Math.max(floor, base - years * (t.telegraphAgeCutPerYear || 0) - tax * (t.telegraphTaxCutPerBracket || 0)),
      speed: Math.min(t.speedMultCap || 1.45, 1 + years * (t.speedAgeAddPerYear || 0) + tax * (t.speedTaxAddPerBracket || 0))
    };
  }
  const pc = player => { const b = player.body; return b ? { x: b.center.x, y: b.center.y } : { x: player.x, y: player.y }; };
  const hit = (player, boss, dmg) => { if (boss._gw) boss._gw.hits = (boss._gw.hits || 0) + 1; hurtPlayer(player, { kind: "goldWatch", damage: dmg, x: boss.x, y: boss.y }); };
  // Pushes from your hits fade out over about half a second.
  function addPush(boss, a) {
    if (!a.pvx && !a.pvy) return;
    boss.setVelocity(boss.body.velocity.x + a.pvx, boss.body.velocity.y + a.pvy);
    a.pvx *= 0.88; a.pvy *= 0.88; if (Math.abs(a.pvx) + Math.abs(a.pvy) < 4) { a.pvx = 0; a.pvy = 0; }
  }

  // It arrives 1.5 years before you retire, and its phases follow the clock from there.
  // Nov 9 (Grok): Overtime years past 65 are only 25 s, so "1.5 years before the end" shrank the Watch's fight
  // from 67.5 s to 37.5 s. In Overtime it arrives 2.7 years early instead (the same 67.5 s), with phases to match.
  const late = () => typeof modeEndAge === "function" && modeEndAge() > 65.01 && typeof modeCfg === "function" && modeCfg().id === "midlife" && D().lateArrivesYearsBeforeEnd;
  function arrivalAge() { const end = typeof modeEndAge === "function" ? modeEndAge() : 65; return end - (late() ? D().lateArrivesYearsBeforeEnd : (D().arrivesYearsBeforeEnd || 1.5)); }
  function phaseOf(boss) {
    const P = D().phases || {}, t = currentAge - arrivalAge(), L = late() ? (D().latePhaseAfterYears || {}) : {};
    if (t >= (L.lastMinute || (P.lastMinute && P.lastMinute.afterYears) || 1.1)) return 3;
    if (t >= (L.overtime || (P.overtime && P.overtime.afterYears) || 0.5)) return 2;
    return 1;
  }
  function phaseMods(ph) { const d = D(); return ph === 3 ? (d.phase3 || {}) : ph === 2 ? (d.phase2 || {}) : {}; }

  function pick(ph) {
    const d = D();
    const opts = [["minuteHand", ph === 1 ? d.minuteHand.weightPhase1 : d.minuteHand.weightPhase2],
                  ["gears", ph === 1 ? d.gears.weightPhase1 : d.gears.weightPhase2]];
    if (ph >= 2) opts.push(["hourHand", d.hourHand.weightPhase2], ["alarm", d.alarm.weightPhase2]);
    const total = opts.reduce((s, [, w]) => s + (w || 0), 0);
    let r = Math.random() * total;
    for (const [k, w] of opts) if ((r -= (w || 0)) <= 0) return k;
    return "minuteHand";
  }

  // First-time banners for each attack and phase (taught once per run).
  function teach(a, key, title, sub) {
    if (a.taught[key]) return; a.taught[key] = true;
    if (window.flashBanner) flashBanner(title, sub, "alert");
  }

  function update(scene, boss, player, now) {
    const d = D(); if (!d.minuteHand) return false;
    const a = boss._gw || (boss._gw = { state: "float", nextAt: now + (d.firstAttackDelayMs || 2000), taught: {}, gears: [], phase: 1 });
    if (!a.g || !a.g.active) {
      a.g = scene.add.graphics().setDepth(20000);
      boss.once("destroy", () => { cleanup(a); });
    }
    const g = a.g; g.clear();
    const S = scaling();

    // Phase changes (once each)
    const ph = phaseOf(boss);
    if (ph > a.phase) {
      a.phase = ph;
      const P = d.phases || {}, info = ph === 2 ? P.overtime : P.lastMinute;
      if (info && window.flashBanner) flashBanner(info.title || info.name, info.bannerSub, "alert");
    }
    const mods = phaseMods(a.phase), wound = now < (a.slowUntil || 0) ? (d.wind && d.wind.handSlowMult) || 0.85 : 1;
    const spd = S.speed * (mods.speedMult || 1) * wound;

    tickGears(scene, a, boss, player, now);

    // Floating: drift toward you, hold at a polite distance. Stationary while warning or attacking.
    const p = pc(player), dist = Math.hypot(p.x - boss.x, p.y - boss.y);
    if (a.state === "float") {
      const want = (d.holdDistance || 200);
      if (dist > want) scene.physics.moveTo(boss, p.x, p.y, (ENEMIES.goldWatch.speed || 48));
      else boss.setVelocity(0, 0);
      addPush(boss, a);
      const v = scene.cameras.main.worldView, m = T().onScreenMargin || 40;
      const onScreen = boss.x > v.x - m && boss.x < v.right + m && boss.y > v.y - m && boss.y < v.bottom + m;
      if (now >= a.nextAt && onScreen && !gameOver) begin(scene, a, boss, player, now, S);
      return true;
    }
    boss.setVelocity(0, 0); addPush(boss, a);

    if (a.state === "telegraph") {
      const k = (now - a.startedAt) / Math.max(1, a.until - a.startedAt);
      const blink = reduceMotion ? 0.6 : 0.35 + 0.35 * Math.abs(Math.sin(now / 70));
      if (window.BossArt) BossArt.marker(scene, boss, boss.x, boss.y + 30, 0, 1.4, 1.4, 0.25 + 0.5 * k);
      if (a.kind === "minuteHand" || a.kind === "hourHand") {
        const H = d[a.kind], len = H.handLength;
        // the clock face: tick marks around the sweep, and the hand's starting line
        g.lineStyle(2, 0xf2d7a1, 0.35 + 0.3 * k);
        for (let i = 0; i < 12; i++) { const an = UP + i * Math.PI / 6; g.lineBetween(boss.x + Math.cos(an) * (len - 14), boss.y + Math.sin(an) * (len - 14), boss.x + Math.cos(an) * len, boss.y + Math.sin(an) * len); }
        g.lineStyle(H.handWidth, 0xd9a441, 0.18 + 0.15 * k).lineBetween(boss.x, boss.y, boss.x + Math.cos(a.ang) * len, boss.y + Math.sin(a.ang) * len);
        g.lineStyle(3, 0xef9347, blink).lineBetween(boss.x, boss.y, boss.x + Math.cos(a.ang) * len, boss.y + Math.sin(a.ang) * len);
        // an arrow along the arc shows which way it will sweep
        const ahead = a.ang + a.dir * 0.35, r = len * 0.75;
        g.fillStyle(0xef9347, blink).fillCircle(boss.x + Math.cos(ahead) * r, boss.y + Math.sin(ahead) * r, 6);
      } else if (a.kind === "alarm") {
        drawRing(g, boss.x, boss.y, 140, UP, d.alarm.gapArcDeg, 0xd9a441, blink, 6);
      } else if (a.kind === "gears") {
        g.lineStyle(3, 0xd9a441, blink).strokeCircle(boss.x, boss.y, 40 + 20 * k);
      }
      if (now >= a.until) { if (window.BossArt) BossArt.hideMarker(boss); startAttack(scene, a, boss, now, spd); }
      return true;
    }

    if (a.state === "attack") {
      let done = false;
      if (a.kind === "minuteHand" || a.kind === "hourHand") done = sweep(scene, a, boss, player, now, spd, g);
      else if (a.kind === "alarm") done = alarm(a, boss, player, now, spd, g);
      else if (a.kind === "gears") done = true; // gears fly on their own after launch
      if (done) {
        a.state = "float";
        if (a.hand) { a.hand.destroy(); a.hand = null; }
        const base = (d[a.kind] && d[a.kind].cooldownMs) || 5200;
        // the cooldown counts from the end of the attack; a little shorter in later phases
        a.nextAt = now + Math.max(1500, base * (mods.cooldownMult || 1)) + (d.recoverMs || 280);
      }
      return true;
    }
    return true;
  }

  function begin(scene, a, boss, player, now, S) {
    const d = D(), kind = pick(a.phase), A = d[kind];
    a.kind = kind; a.state = "telegraph"; a.startedAt = now;
    const floor = kind === "alarm" ? (T().minTelegraphMsWatch || 700) : (T().minTelegraphMs || 550);
    a.until = now + S.tele(A.telegraphMs, floor);
    if (kind === "minuteHand" || kind === "hourHand") {
      const p = pc(player), toP = Math.atan2(p.y - boss.y, p.x - boss.x);
      a.dir = Math.random() < 0.5 ? 1 : -1;
      // start well away from you, coming around toward you (the hour hand starts on the far side)
      a.ang = wrap(toP - a.dir * Phaser.Math.DegToRad(kind === "hourHand" ? 150 : 110));
    }
    const B = d.banners || {};
    if (B[kind]) teach(a, kind, B[kind][0], B[kind][1]);
    sfx("bossSpawn", 0);
  }

  function startAttack(scene, a, boss, now, spd) {
    a.state = "attack"; a.startedAt = now; a.lastNow = now;
    const d = D();
    if (a.kind === "minuteHand" || a.kind === "hourHand") {
      const H = d[a.kind], key = a.kind === "minuteHand" ? "gw_minute" : "gw_hour";
      if (scene.textures.exists(key)) {
        const tex = scene.textures.get(key).getSourceImage();
        a.hand = scene.add.image(boss.x, boss.y, key).setOrigin(0.5, 1).setDepth(19999)
          .setScale(H.handWidth * 1.6 / tex.width, H.handLength / tex.height);
      }
      a.prevAng = a.ang;
    } else if (a.kind === "gears") {
      const G = d.gears, n = a.phase === 3 ? ((d.phase3 && d.phase3.gearCount) || G.gearCount) : G.gearCount, off = Math.random() * Math.PI * 2;
      for (let i = 0; i < n; i++) {
        const an = off + i * Math.PI * 2 / n, sp = G.gearSpeed * spd;
        const o = scene.textures.exists("gw_gear") ? scene.add.sprite(boss.x, boss.y, "gw_gear", 0) : scene.add.circle(boss.x, boss.y, G.gearSize / 2, 0xd9a441);
        o.setDepth(19998).setScale(G.gearSize / 24 * 1.4);
        a.gears.push({ o, x: boss.x, y: boss.y, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, dieAt: now + G.gearLifeMs, spin: 0 });
      }
      sfx("bossSpawn", 0);
    }
  }

  // A hand sweeping around the watch. Only the leading edge hurts: we check whether you were inside the
  // slice the edge passed through since the last frame (so a fast hand can't skip over you).
  function sweep(scene, a, boss, player, now, spd, g) {
    const H = D()[a.kind], dt = Math.min(50, now - a.lastNow) / 1000; a.lastNow = now;
    const step = Phaser.Math.DegToRad(H.sweepDegPerSec) * spd * dt * a.dir;
    const prev = a.ang; a.ang = wrap(a.ang + step);
    if (a.hand) a.hand.setPosition(boss.x, boss.y).setRotation(a.ang + Math.PI / 2);
    else g.lineStyle(H.handWidth, 0x171c35, 1).lineBetween(boss.x, boss.y, boss.x + Math.cos(a.ang) * H.handLength, boss.y + Math.sin(a.ang) * H.handLength);
    const p = pc(player), r = Math.hypot(p.x - boss.x, p.y - boss.y);
    if (r <= H.handLength + 14 && r > 6) {
      const pAng = Math.atan2(p.y - boss.y, p.x - boss.x);
      const edge = (H.leadingEdgeThickness + 12) / Math.max(r, 24); // the edge's width as an angle at your distance (+ about half your body)
      const ahead = wrap((pAng - prev) * a.dir); // how far ahead of last frame's edge you are, in the sweep direction
      if (ahead >= -edge * 0.5 && ahead <= Math.abs(step) + edge * 0.5) hit(player, boss, H.damage);
    }
    return now - a.startedAt >= H.sweepDurationMs;
  }

  function alarm(a, boss, player, now, spd, g) {
    const R = D().alarm, t = now - a.startedAt, p = pc(player);
    const dist = Math.hypot(p.x - boss.x, p.y - boss.y), pang = Math.atan2(p.y - boss.y, p.x - boss.x);
    const inGap = Math.abs(wrap(pang - UP)) <= Phaser.Math.DegToRad(R.gapArcDeg / 2);
    let alive = 0;
    for (let i = 0; i < R.ringCount; i++) {
      const rt = t - i * R.ringGapMs; if (rt < 0) { alive++; continue; }
      const r = R.startRadius + R.expandSpeed * spd * rt / 1000;
      if (r > R.maxRadius) continue;
      alive++;
      drawRing(g, boss.x, boss.y, r, UP, R.gapArcDeg, 0xd9a441, 0.85, R.ringHalfThickness * 2);
      if (!inGap && Math.abs(dist - r) <= R.ringHalfThickness + 20) hit(player, boss, R.damage);
    }
    return alive === 0;
  }

  function tickGears(scene, a, boss, player, now) {
    if (!a.gears.length) return;
    const v = scene.cameras.main.worldView, p = pc(player), G = D().gears, dt = 1 / 60;
    a.gears = a.gears.filter(q => {
      if (now >= q.dieAt || !q.o.active) { if (q.o.active) q.o.destroy(); return false; }
      q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.x < v.x + 12 || q.x > v.right - 12) { q.vx *= -1; q.x = Phaser.Math.Clamp(q.x, v.x + 12, v.right - 12); }
      if (q.y < v.y + 12 || q.y > v.bottom - 12) { q.vy *= -1; q.y = Phaser.Math.Clamp(q.y, v.y + 12, v.bottom - 12); }
      q.o.setPosition(q.x, q.y);
      if (q.o.setFrame && !reduceMotion) q.o.setFrame(Math.floor(now / 90) % 4);
      const left = q.dieAt - now; if (left < 600) q.o.setAlpha(left / 600);
      if (Math.hypot(p.x - q.x, p.y - q.y) <= G.gearSize / 2 + 16) { hit(player, boss, G.damage); q.o.destroy(); return false; }
      return true;
    });
  }

  function drawRing(g, x, y, r, gap, gapDeg, color, alpha, width) {
    const half = Phaser.Math.DegToRad(gapDeg / 2);
    g.lineStyle(width, color, alpha);
    g.beginPath(); g.arc(x, y, r, gap + half, gap - half + Math.PI * 2, false); g.strokePath();
    g.lineStyle(2, 0xf2d7a1, 0.9);
    for (const s of [-1, 1]) { const an = gap + s * half; g.lineBetween(x + Math.cos(an) * (r - 10), y + Math.sin(an) * (r - 10), x + Math.cos(an) * (r + 10), y + Math.sin(an) * (r + 10)); }
  }

  function cleanup(a) {
    if (a.g) a.g.destroy();
    if (a.hand) a.hand.destroy();
    (a.gears || []).forEach(q => { if (q.o && q.o.active) q.o.destroy(); });
    a.gears = [];
  }

  // While a Gold Watch is alive, the everyday swarm thins out (Grok: a duel with light office weather).
  function duel() {
    if (typeof bills === "undefined" || !bills) return null;
    // Nov 9 (Grok): any boss with a swarm block thins the swarm, not just the Watch
    const A = window.BOSS_ATTACKS || {}, b = bills.getChildren().find(o => o.active && o.isBoss && !o.clockOut && A[o.kind] && A[o.kind].swarm);
    return b ? A[b.kind].swarm : null;
  }

  // Your hits wind it back: a shove away from you (bigger hits shove more, up to a cap) and slower hands for a moment.
  function wind(scene, boss, amount, player) {
    const W = D().wind || {}, a = boss._gw; if (!a) return;
    const p = pc(player), dx = boss.x - p.x, dy = boss.y - p.y, len = Math.hypot(dx, dy) || 1;
    const add = Math.min(W.maxPushPerHit || 60, (W.pushPerDamage || 6) * amount);
    a.pvx = (a.pvx || 0) + dx / len * add; a.pvy = (a.pvy || 0) + dy / len * add;
    const cap = W.maxPushSpeed || 240, sp = Math.hypot(a.pvx, a.pvy); if (sp > cap) { a.pvx *= cap / sp; a.pvy *= cap / sp; }
    a.slowUntil = runElapsedMs + (W.handSlowMs || 400);
    if (popDamageNumber && !(a.lastPop > runElapsedMs - 250)) { a.lastPop = runElapsedMs; boss.setTintFill(0xfff0cf); scene.time.delayedCall(50, () => { if (boss.active) boss.clearTint(); }); }
  }

  // You reached retirement: the hands stop at 5:00 on their own. The keepsake, the chest and the bonus are yours.
  function clockOut(scene) {
    if (typeof bills === "undefined" || !bills) return;
    const boss = bills.getChildren().find(b => b.active && b.isBoss && b.kind === "goldWatch");
    if (!boss) return;
    const d = D(), a = boss._gw || {}, clean = !a.hits;
    window.goldWatchBeat = true;
    try { meta.keepsakes = Object.assign({}, meta.keepsakes, { goldWatch: true }); } catch (e) {}
    const bonus = d.killBonusCoins || 0;
    if (bonus) { runCoins += bonus; meta.coins += bonus; window.coinLog && window.coinLog("gold watch", bonus); }
    try { saveMeta(meta); } catch (e) {}
    window.achEvent("bossKill", { kind: "goldWatch" });
    if (clean) window.achEvent("bossKill", { kind: "goldWatchClean" });
    // the stopped watch lingers where it was, and drops the big chest
    if (scene.textures.exists("bossart_goldWatch")) {
      const s = scene.add.sprite(boss.x, boss.y + boss.displayHeight * 0.42, "bossart_goldWatch", 11).setOrigin(0.5, 148 / 152).setDepth(boss.depth + 0.5);
      scene.tweens.add({ targets: s, alpha: 0, delay: 2600, duration: 800, onComplete: () => s.destroy() });
    }
    const ch = chests.create(boss.x, boss.y, "chest").setDepth(3); ch.bossKind = "goldWatch";
    ch.tag = scene.add.text(boss.x, boss.y, "BONUS", { fontFamily: "monospace", fontSize: "11px", color: "#f5c542" }).setOrigin(0.5).setDepth(4);
    if (boss.tag) boss.tag.destroy();
    boss.destroy();
    sfx("levelUp");
    const V = d.victory || {};
    if (!(window.Spotlight && Spotlight.custom) && window.flashBanner) flashBanner(V.title || "FIVE O'CLOCK", V.sub || "The hands stop at 5:00.", "reward");
    if (window.Spotlight && Spotlight.custom && V.lines) {
      const id = (typeof meta !== "undefined" && meta && meta.selectedChar) || "officeWorker";
      setTimeout(() => Spotlight.custom({ kind: "boss", kicker: V.kicker || "CLOCKED OUT", name: V.title || "FIVE O'CLOCK", small: true,
        line: V.lines[id] || V.lines.any, tip: V.keepsake, tipLabel: "KEEPSAKE", hero: id }), 1200);
    }
  }

  return { preload, update, duel, wind, clockOut, arrivalAge };
})();
