// Close Calls: rewards for dodging (Grok Part 3C). Numbers live in src/data/nearMiss.js.
//
// Each frame we look at enemies near the player. For each one we track a tiny story:
//   it came inside the "close" ring while moving toward you  ->  it got as close as it was going to get
//   (the distance starts growing again)  ->  if it never touched you, that's a Close Call.
// main.js calls NearMiss.reset() at run start, scan() every frame, and onHurt() when you take damage.
window.NearMiss = (() => {
  const N = () => window.NEAR_MISS || {};
  const reducedMotion = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  let combo, nmStats, xpLog, popupLog, lastShakeAt, lastLine, scoreUnits, gfx, burstUntil, burstMult;

  function reset() {
    combo = { streak: 0, tier: 0, expireAt: 0, flashUntil: 0 };
    nmStats = { credits: 0, rejectedNotClosing: 0, rejectedNoApproach: 0, rejectedCooldown: 0, rejectedXpCap: 0, xpGranted: 0, maxStreak: 0, pingCredits: 0, bossCredits: 0 };
    xpLog = []; popupLog = []; lastShakeAt = -1e9; lastLine = ""; scoreUnits = 0; burstUntil = 0; burstMult = 1;
    if (gfx) { gfx.destroy(); gfx = null; }
  }
  reset();

  const tierFor = streak => { let t = 0; (N().comboTiers || []).forEach((need, i) => { if (streak >= need) t = i + 1; }); return t; };
  const debugOn = () => N().debug || /[?&]nmDebug=1/.test(location.search);

  function sizeOf(t, isPing) {
    if (isPing) return N().pingSize || 14;
    return (window.ENEMIES && ENEMIES[t.kind] && ENEMIES[t.kind].size) || 24;
  }

  // The XP goes through the same pipe as gems, capped per 10 seconds.
  function grantXp(scene, amount) {
    const cap = N().xpFromNearMissPer10s || 6, now = runElapsedMs;
    while (xpLog.length && now - xpLog[0][0] > 10000) xpLog.shift();
    const used = xpLog.reduce((s, e) => s + e[1], 0);
    const give = Math.max(0, Math.min(amount, cap - used));
    if (give <= 0) { nmStats.rejectedXpCap++; return 0; }
    xpLog.push([now, give]); nmStats.xpGranted += give;
    if (typeof window.addXp === "function") window.addXp(scene, give);
    return give;
  }

  function popup(scene, player, text) {
    const now = runElapsedMs;
    while (popupLog.length && now - popupLog[0] > 1000) popupLog.shift();
    if (popupLog.length >= (N().maxPopupsPerSec || 4)) return; // swarm readability: the HUD meter still counts it
    popupLog.push(now);
    const msg = scene.add.text(player.x, player.y - 44, text, {
      fontFamily: "monospace", fontSize: "12px", color: "#f2d7a1", stroke: "#171c35", strokeThickness: 3
    }).setOrigin(0.5).setDepth(50002);
    if (reducedMotion()) scene.time.delayedCall(700, () => msg.destroy());
    else scene.tweens.add({ targets: msg, y: msg.y - 24, alpha: 0, duration: 750, onComplete: () => msg.destroy() });
  }

  function credit(scene, player, t, isPing) {
    const C = N();
    if (runElapsedMs > combo.expireAt) combo.streak = 0;
    combo.streak++;
    combo.expireAt = runElapsedMs + (C.comboDecayMs || 2500);
    const prevTier = combo.tier;
    combo.tier = tierFor(combo.streak);
    nmStats.credits++; if (isPing) nmStats.pingCredits++; if (t.isBoss) nmStats.bossCredits++;
    nmStats.maxStreak = Math.max(nmStats.maxStreak, combo.streak);

    // XP (same multipliers as gems), a short speed blip, and a few score points
    const statXp = (typeof stats !== "undefined" && stats && stats.xpMult) || 1; // Continuing Ed (the game's player stats)
    const taxXp = typeof tax === "function" ? 1 + tax("xpMult") : 1;
    const xpGain = Math.min(C.xpPerCreditMax || 0.85, (C.xpBase || 0.4) * ((C.comboXpMult || [])[combo.tier] || 1) * statXp * taxXp);
    grantXp(scene, xpGain);
    burstUntil = runElapsedMs + (C.speedBurstMs || 350) + (combo.tier >= 2 && prevTier < 2 ? 100 : 0);
    burstMult = C.speedBurstMult || 1.1;
    scoreUnits += C.scorePerCredit || 1;
    if (combo.tier >= 3 && prevTier < 3) scoreUnits += C.tier3ScoreBonus || 0;
    if (combo.tier >= 4 && prevTier < 4) scoreUnits += C.tier4ScoreBonus || 0;

    // You're clearly not camping: hold off the Comfort Zone Tax (but never cancel one already running)
    if (C.comfortCountsAsEngaged && typeof dyn !== "undefined" && runElapsedMs >= dyn.comfortUntil) dyn.lastHitAt = Math.max(dyn.lastHitAt, runElapsedMs);

    // Feedback
    const lines = C.lines || ["CLOSE CALL!"];
    let text;
    if (combo.tier >= 1 && Math.random() < 0.6) text = `${(C.comboLabels || [])[combo.tier] || "CLOSE CALL"} ×${combo.streak}`;
    else { do { text = lines[Math.floor(Math.random() * lines.length)]; } while (lines.length > 1 && text === lastLine); lastLine = text; }
    popup(scene, player, text);
    if (typeof sfx === "function") sfx("nearMiss");
    if (!reducedMotion() && runElapsedMs - lastShakeAt > (C.shakeCooldownMs || 180)) {
      lastShakeAt = runElapsedMs;
      scene.cameras.main.shake(C.shakeDurationMs || 55, C.shakeIntensity || 0.0025);
    }
  }

  function check(scene, player, t, isPing, dtSec, playerMoving) {
    const C = N();
    if (!t.active) return;
    if (t.ghost || t.kind === "theReaper") { t._nm = null; return; }
    if (!isPing && t.kind === "groupChat" && !C.creditGroupChatBody) return;
    // Measure the real gap between the two hit boxes (the same boxes the game uses for damage),
    // so "close" always means "just outside getting hit".
    const pb = player.body, tb = t.body;
    const pw = pb ? pb.width : (PLAYER.size || 32), ph = pb ? pb.height : (PLAYER.size || 32);
    const tw = tb ? tb.width : sizeOf(t, isPing), th = tb ? tb.height : sizeOf(t, isPing);
    const pcx = pb ? pb.center.x : player.x, pcy = pb ? pb.center.y : player.y;
    const tcx = tb ? tb.center.x : t.x, tcy = tb ? tb.center.y : t.y;
    const dx = pcx - tcx, dy = pcy - tcy, d = Math.hypot(dx, dy);
    const gap = Math.max(Math.abs(dx) - (pw + tw) / 2, Math.abs(dy) - (ph + th) / 2); // <= 0 means touching
    const band = C.bandPx || 14;
    if (gap > band + 60) { if (t._nm) t._nm.inBand = false; return; } // far away: nothing to track
    const st = t._nm || (t._nm = { prev: null, inBand: false, closing: false, spoiled: false, lastCreditAt: -1e9 });
    if (gap <= 0) { st.spoiled = true; st.inBand = false; st.closing = false; } // it touched you: damage wins
    else if (gap <= band) {
      st.inBand = true;
      // closing = the enemy's own velocity pointed at you (so running past a parked enemy doesn't count)
      const v = t.body ? t.body.velocity : { x: 0, y: 0 };
      const closing = d > 0 ? (v.x * dx + v.y * dy) / d : 0;
      if (closing >= (C.minClosingSpeed || 40)) st.closing = true;
      // it got as close as it's going to get: the distance is growing again
      if (st.prev !== null && gap > st.prev + 0.25 && st.closing && !st.spoiled && !st.done) {
        const cd = t.isBoss ? C.bossCooldownMs : isPing ? C.pingCooldownMs : C.cooldownMs;
        if (runElapsedMs - st.lastCreditAt < (cd || 450)) nmStats.rejectedCooldown++;
        else if (!playerMoving && !(window.NAV && NAV.hasClearApproach ? NAV.hasClearApproach(t.x, t.y) : true)) nmStats.rejectedNoApproach++;
        else { st.lastCreditAt = runElapsedMs; st.done = true; credit(scene, player, t, isPing); }
        st.closing = false;
      }
    } else { // left the ring: start a fresh pass next time
      if (st.inBand && !st.closing && !st.spoiled && !st.done) nmStats.rejectedNotClosing++;
      st.inBand = false; st.closing = false; st.spoiled = false; st.done = false; // one Close Call per pass
    }
    st.prev = gap;
  }

  let lastScanAt = 0;
  function scan(scene, player, bills, pings) {
    const C = N();
    if (!C.enabled || !player || !bills) return;
    const dtSec = Math.max(0.001, (runElapsedMs - lastScanAt) / 1000); lastScanAt = runElapsedMs;
    if (combo.streak && runElapsedMs > combo.expireAt) { combo.streak = 0; combo.tier = 0; }
    if (gameOver || paused || levelUpOpen || (typeof titleOpen !== "undefined" && titleOpen)) return;
    if (runElapsedMs < (C.armAfterMs || 0)) return;
    if (scene.time.now - lastHurt < PLAYER.hurtCooldownMs) return; // still flashing from a hit
    const v = player.body ? player.body.velocity : { x: 0, y: 0 };
    const moving = Math.hypot(v.x, v.y) >= (C.minPlayerSpeed || 40);
    const list = bills.getChildren();
    for (let i = 0; i < list.length; i++) check(scene, player, list[i], false, dtSec, moving);
    if (pings) { const pl = pings.getChildren(); for (let i = 0; i < pl.length; i++) check(scene, player, pl[i], true, dtSec, moving); }
    if (debugOn()) drawDebug(scene, player);
  }

  function drawDebug(scene, player) {
    if (!gfx) gfx = scene.add.graphics().setDepth(60001);
    gfx.clear();
    const b = player.body, band = N().bandPx || 14;
    if (!b) return;
    gfx.lineStyle(1, 0x171c35, 0.8).strokeRect(b.x, b.y, b.width, b.height);
    gfx.lineStyle(2, 0xef9347, 0.35).strokeRect(b.x - band, b.y - band, b.width + band * 2, b.height + band * 2);
  }

  // A real hit breaks the streak.
  function onHurt() {
    if (combo.streak) combo.flashUntil = runElapsedMs + 400;
    combo.streak = 0; combo.tier = 0; combo.expireAt = 0;
  }

  // Speed multiplier for this frame (the move code takes the bigger of this and an Energy Drink).
  const speedMult = () => (runElapsedMs < burstUntil ? burstMult : 1);
  const score = () => scoreUnits;

  // What the HUD meter shows (null = hidden).
  function hud() {
    if (combo.flashUntil > runElapsedMs) return { text: "STREAK BROKEN", tier: -1 };
    if (!combo.streak || runElapsedMs > combo.expireAt) return null;
    const label = (N().comboLabels || [])[combo.tier] || "CLOSE";
    return { text: `${label} ×${combo.streak}`, tier: combo.tier };
  }

  function logSummary() {
    if (!debugOn()) return;
    console.log("[Close Calls]", JSON.stringify(nmStats));
  }

  return { reset, scan, onHurt, speedMult, score, hud, logSummary, getStats: () => nmStats };
})();
