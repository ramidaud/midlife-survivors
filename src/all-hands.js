// The Quarterly All-Hands (office, age 60). Nov 10, spec by Grok (docs/handoffs/grok-maple-v2-reply.md, part 2).
// Replaces the Midlife Crisis V8 in the office (the V8 now bursts out of your garage in Maple Hollow).
// He walks to about 200 px from you, plants at his podium and clicks to the next slide. The projector screen behind him
// shows what's coming; the dashed shape on the floor is the rule:
//   Bar Chart ("Q3 RESULTS")      4 tall bars light up left to right. Step into a gap.
//   Pie Chart ("BUDGET BREAKDOWN") 4 slices around him go live (5 in phase 2). Stand in a dark slice or step outside.
//   Line Graph ("UP AND TO THE RIGHT") a thick line draws itself across the screen near you. Step off it.
// Phase 2 (half health): every third slide is a Q&A. Two spotlights follow you for 5 s; stand in one for 0.8 s and you
// get Called On. Keep moving and they never catch you. Numbers: BOSS_ATTACKS.allHands in src/data/bosses.js.
window.AllHands = (() => {
  const T = () => window.BOSS_ATTACK_TUNING || {};
  const D = () => (window.BOSS_ATTACKS && BOSS_ATTACKS.allHands) || {};
  const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const COL = { dash: 0xFFF0CF, edge: 0x171C35, live: 0xC45C4B, pie: 0xBFA8CF, screen: 0xF2D7A1, spot: 0xFFF0CF };
  const SLIDES = ["barChart", "pieChart", "lineGraph"];

  function scaling() {
    const t = T(), years = Math.max(0, currentAge - (t.ageRefYear || 40)), tax = (typeof runTaxBracket !== "undefined" ? runTaxBracket : 0) || 0;
    return {
      tele: (base, floor) => Math.max(floor, base - years * (t.telegraphAgeCutPerYear || 0) - tax * (t.telegraphTaxCutPerBracket || 0)),
      speed: Math.min(t.speedMultCap || 1.45, 1 + years * (t.speedAgeAddPerYear || 0) + tax * (t.speedTaxAddPerBracket || 0))
    };
  }
  const pc = () => { const b = player.body; return b ? { x: b.center.x, y: b.center.y, hw: b.halfWidth, hh: b.halfHeight } : { x: player.x, y: player.y, hw: 20, hh: 24 }; };
  const hurt = (dmg, x, y) => hurtPlayer(player, { kind: "allHands", damage: dmg, x, y });
  const floorMs = kind => kind === "line" ? (T().minTelegraphMs || 550) : 750; // area attacks get the 750 floor (office bosses spec)
  const onScreen = (scene, b) => { const v = scene.cameras.main.worldView, m = T().onScreenMargin || 40; return b.x > v.x - m && b.x < v.right + m && b.y > v.y - m && b.y < v.bottom + m; };

  // ---- each slide: plan (where), draw (telegraph / live), hit test ----
  function planBars(C) {
    const p = pc(), step = C.barW + C.gapPx, k = Phaser.Math.Between(0, C.bars - 1);
    return { bars: Array.from({ length: C.bars }, (_, i) => ({ x: p.x + (i - k) * step, y: p.y, w: C.barW, h: C.barH })) };
  }
  function planPie(boss, C, armed) {
    const n = C.slices, picks = [], order = Phaser.Utils.Array.Shuffle([...Array(n).keys()]);
    for (const i of order) { if (picks.length >= armed) break; if (!picks.some(j => Math.abs(j - i) <= 1 || Math.abs(j - i) >= n - 1)) picks.push(i); }
    return { cx: boss.x, cy: boss.y, r: C.radius, n, picks, a0: Math.random() * Math.PI * 2 };
  }
  function planLine(scene, C) {
    const p = pc(), v = scene.cameras.main.worldView, ang = -Math.PI / 4; // bottom-left to top-right
    const ox = p.x + Phaser.Math.Between(-C.nearPlayerPx, C.nearPlayerPx), oy = p.y + Phaser.Math.Between(-C.nearPlayerPx, C.nearPlayerPx);
    const L = Math.hypot(v.width, v.height);
    return { x0: ox - Math.cos(ang) * L, y0: oy - Math.sin(ang) * L, x1: ox + Math.cos(ang) * L, y1: oy + Math.sin(ang) * L, len: 2 * L, drawn: 0 };
  }
  function dashRect(g, r, a) {
    const x0 = r.x - r.w / 2, y0 = r.y - r.h / 2;
    g.lineStyle(4, COL.edge, a).strokeRect(x0, y0, r.w, r.h);
    for (let d = 0; d < 2 * (r.w + r.h); d += 16) { const pt = perim(r, d); g.fillStyle(COL.dash, a).fillRect(pt[0] - 3, pt[1] - 3, 7, 7); }
    function perim(r, d) { if (d < r.w) return [x0 + d, y0]; d -= r.w; if (d < r.h) return [x0 + r.w, y0 + d]; d -= r.h; if (d < r.w) return [x0 + r.w - d, y0 + r.h]; d -= r.w; return [x0, y0 + r.h - d]; }
  }
  function slicePath(g, P, i, fill, a) {
    const s = Math.PI * 2 / P.n, a1 = P.a0 + i * s;
    g.fillStyle(fill, a).slice(P.cx, P.cy, P.r, a1, a1 + s, false).fillPath();
    g.lineStyle(3, COL.edge, Math.min(1, a + 0.3)).slice(P.cx, P.cy, P.r, a1, a1 + s, false).strokePath();
  }
  const inSlice = (P, x, y) => {
    const dx = x - P.cx, dy = y - P.cy; if (Math.hypot(dx, dy) > P.r) return -1;
    const s = Math.PI * 2 / P.n; let ang = Math.atan2(dy, dx) - P.a0; ang = ((ang % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    return Math.floor(ang / s);
  };
  const distToSeg = (px, py, x0, y0, x1, y1) => { const vx = x1 - x0, vy = y1 - y0, L2 = vx * vx + vy * vy || 1; const t = Math.max(0, Math.min(1, ((px - x0) * vx + (py - y0) * vy) / L2)); return Math.hypot(px - (x0 + vx * t), py - (y0 + vy * t)); };

  // the projector screen behind him, with a big simple icon of the next slide
  function drawScreen(g, boss, slide, a) {
    const w = 120, h = 72, x = boss.x - w / 2, y = boss.y - 150;
    g.fillStyle(COL.edge, a).fillRect(x - 4, y - 4, w + 8, h + 8); g.fillStyle(COL.screen, a).fillRect(x, y, w, h);
    g.fillStyle(COL.edge, a).fillRect(boss.x - 2, y + h + 4, 4, 30); // the stand
    if (!slide) return;
    g.fillStyle(0x3E7775, a);
    if (slide === "barChart") [18, 34, 26, 48].forEach((bh, i) => g.fillRect(x + 16 + i * 24, y + h - 10 - bh, 14, bh));
    else if (slide === "pieChart") { g.fillStyle(0xEF9347, a).slice(boss.x, y + h / 2, 26, 0, Math.PI * 1.3, false).fillPath(); g.fillStyle(0x3E7775, a).slice(boss.x, y + h / 2, 26, Math.PI * 1.3, Math.PI * 2, false).fillPath(); }
    else if (slide === "lineGraph") { g.lineStyle(6, 0xC45C4B, a).lineBetween(x + 14, y + h - 12, x + w - 14, y + 12); g.fillStyle(0xC45C4B, a).fillTriangle(x + w - 8, y + 6, x + w - 26, y + 10, x + w - 12, y + 24); }
    else if (slide === "qa") { g.fillStyle(0xEF9347, a).fillCircle(boss.x, y + h / 2 - 6, 14); g.fillStyle(COL.screen, a).fillCircle(boss.x - 4, y + h / 2 - 2, 8); g.fillStyle(0xEF9347, a).fillRect(boss.x - 3, y + h / 2 + 12, 6, 6); }
  }

  function update(scene, boss, playerObj, now) {
    const C = D(), S = scaling();
    const a = boss._atk || (boss._atk = { state: "walk", nextAt: now + C.firstAttackDelayMs, slideN: 0, last: null, seen: {} });
    if (!a.g || !a.g.active) { a.g = scene.add.graphics().setDepth(19999); boss.once("destroy", () => { if (a.g) a.g.destroy(); }); }
    const g = a.g; g.clear();
    const p2 = C.phase2 && boss.hpMax && boss.hp / boss.hpMax <= C.phase2.atHpFrac;
    if (p2 && !a.p2Said) { a.p2Said = true; if (window.flashBanner) flashBanner("ANY QUESTIONS?", "Keep moving. Spotlights call on whoever stands still.", "alert"); }
    const p = pc();

    if (a.state === "walk") {
      drawScreen(g, boss, null, 0.55);
      if (now < a.nextAt || !onScreen(scene, boss) || gameOver) {
        const d = Math.hypot(p.x - boss.x, p.y - boss.y);
        if (d < C.standPx * 0.8) { boss.setVelocity(0, 0); return true; } // close enough: wait at the podium
        return false; // walk toward you
      }
      // next slide (never the same twice in a row; in phase 2 every third is the Q&A)
      a.slideN++;
      let slide = p2 && C.phase2.qaEvery && a.slideN % C.phase2.qaEvery === 0 ? "qa" : Phaser.Utils.Array.GetRandom(SLIDES.filter(s => s !== a.last));
      a.last = slide; a.slide = slide; a.startedAt = now; boss.setVelocity(0, 0);
      const SC = C[slide] || {};
      if (slide === "barChart") a.plan = planBars(SC);
      else if (slide === "pieChart") a.plan = planPie(boss, SC, p2 ? C.phase2.pieArmed : SC.armed);
      else if (slide === "lineGraph") a.plan = planLine(scene, SC);
      else a.plan = { spots: [-1, 1].map(s => ({ x: p.x + s * C.phase2.qa.startPx, y: p.y, dwell: 0, dimUntil: 0 })) };
      a.until = slide === "qa" ? now + C.phase2.qa.durMs : now + S.tele(SC.telegraphMs, floorMs(SC.floor));
      if (!a.seen[slide] && window.flashBanner) { a.seen[slide] = true; flashBanner(slide === "qa" ? "Q&A" : SC.title, slide === "qa" ? "Keep moving." : C.bannerSub, "alert"); }
      if (window.sfx) sfx("pick", 0);
      a.state = slide === "qa" ? "qa" : "telegraph";
    }

    if (a.state === "telegraph" || a.state === "live") {
      boss.setVelocity(0, 0);
      drawScreen(g, boss, a.slide, 1);
      const SC = C[a.slide], k = Math.min(1, (now - a.startedAt) / Math.max(1, a.until - a.startedAt));
      const ta = reduceMotion ? 0.8 : 0.35 + 0.55 * k;
      if (a.state === "telegraph" && now >= a.until) { a.state = "live"; a.liveAt = now; if (window.sfx) sfx("bossSpawn", 0); }
      const live = a.state === "live", t = live ? now - a.liveAt : 0;
      if (a.slide === "barChart") {
        let done = true;
        a.plan.bars.forEach((r, i) => {
          const on = live && t >= i * SC.staggerMs && t < i * SC.staggerMs + SC.liveMs; if (!live || t < i * SC.staggerMs + SC.liveMs) done = false;
          if (on) { g.fillStyle(COL.live, 0.75).fillRect(r.x - r.w / 2, r.y - r.h / 2, r.w, r.h); g.lineStyle(4, COL.edge, 1).strokeRect(r.x - r.w / 2, r.y - r.h / 2, r.w, r.h);
            if (!r.hit && Math.abs(p.x - r.x) <= r.w / 2 + p.hw * 0.6 && Math.abs(p.y - r.y) <= r.h / 2 + p.hh * 0.6) { r.hit = true; hurt(SC.damage, p.x, p.y); } }
          else if (!live || t < i * SC.staggerMs) dashRect(g, r, live ? 0.9 : ta);
        });
        if (live && done) endSlide(a, now, C, p2);
      } else if (a.slide === "pieChart") {
        const P = a.plan; P.cx = P.cx; // pie stays where he planted
        g.lineStyle(2, COL.edge, 0.5 * ta).strokeCircle(P.cx, P.cy, P.r);
        P.picks.forEach(i => slicePath(g, P, i, live ? COL.live : COL.pie, live ? 0.7 : 0.25 + 0.45 * k));
        if (live) {
          if (!P.hit && P.picks.includes(inSlice(P, p.x, p.y))) { P.hit = true; hurt(SC.damage, p.x, p.y); }
          if (t >= SC.liveMs) endSlide(a, now, C, p2);
        }
      } else if (a.slide === "lineGraph") {
        const L = a.plan, hw = SC.halfW;
        // telegraph: dashes along the whole line
        for (let d = 0; d < L.len; d += 26) { const x = L.x0 + (L.x1 - L.x0) * d / L.len, y = L.y0 + (L.y1 - L.y0) * d / L.len; g.fillStyle(COL.edge, live ? 0.4 : ta).fillRect(x - 5, y - 5, 11, 11); g.fillStyle(COL.dash, live ? 0.4 : ta).fillRect(x - 3, y - 3, 7, 7); }
        if (live) {
          L.drawn = Math.min(L.len, t / 1000 * SC.drawSpeed * S.speed);
          const ex = L.x0 + (L.x1 - L.x0) * L.drawn / L.len, ey = L.y0 + (L.y1 - L.y0) * L.drawn / L.len;
          g.lineStyle(hw * 2, COL.edge, 1).lineBetween(L.x0, L.y0, ex, ey); g.lineStyle(hw * 2 - 6, COL.live, 1).lineBetween(L.x0, L.y0, ex, ey);
          if (!L.hit && distToSeg(p.x, p.y, L.x0, L.y0, ex, ey) <= hw + Math.min(p.hw, p.hh) * 0.6) { L.hit = true; hurt(SC.damage, p.x, p.y); }
          if (L.drawn >= L.len) { if (!L.doneAt) L.doneAt = now; if (now - L.doneAt >= SC.liveMs) endSlide(a, now, C, p2); }
        }
      }
      return true;
    }

    if (a.state === "qa") {
      boss.setVelocity(0, 0);
      drawScreen(g, boss, "qa", 1);
      const Q = C.phase2.qa, dt = Math.min(0.05, scene.game.loop.delta / 1000);
      a.plan.spots.forEach(s => {
        const dx = p.x - s.x, dy = p.y - s.y, d = Math.hypot(dx, dy) || 1, step = Math.min(d, Q.speed * dt);
        s.x += dx / d * step; s.y += dy / d * step;
        const dim = now < s.dimUntil, inside = !dim && d <= Q.radius;
        s.dwell = inside ? s.dwell + dt * 1000 : 0;
        // bright enough to read on the beige office floor: cream fill, an orange ring that fills as it "calls on" you
        g.fillStyle(COL.spot, dim ? 0.15 : 0.5 + 0.35 * Math.min(1, s.dwell / Q.dwellMs)).fillCircle(s.x, s.y, Q.radius);
        g.lineStyle(6, COL.edge, dim ? 0.3 : 1).strokeCircle(s.x, s.y, Q.radius);
        g.lineStyle(4, 0xEF9347, dim ? 0.3 : 1).strokeCircle(s.x, s.y, Q.radius - 5);
        if (!dim && s.dwell > 0) g.lineStyle(6, 0xC45C4B, 1).beginPath().arc(s.x, s.y, Q.radius - 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, s.dwell / Q.dwellMs), false).strokePath();
        if (s.dwell >= Q.dwellMs) {
          s.dwell = 0; s.dimUntil = now + Q.dimMs; hurt(Q.damage, p.x, p.y);
          if (window.showLowerThird) showLowerThird("alert", "CALLED ON", Q.line, 2200);
        }
      });
      if (now >= a.until) endSlide(a, now, C, p2);
      return true;
    }
    return false;
  }
  function endSlide(a, now, C, p2) { a.state = "walk"; a.nextAt = now + (p2 ? C.phase2.cooldownMs : C.cooldownMs); a.plan = null; }
  return { update };
})();
