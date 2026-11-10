// Age 50+ run modifiers: the runtime (Nov 3). Data lives in src/data/modifiers.js.
// One modifier at a time. Rolls every 2.5 age-years after 50, never during a boss, right after a hit or a
// level-up, or while the Comfort Zone Tax is on. While one is active, the Comfort Zone Tax can't start.
// Game code asks window.modFx(key, default) wherever a modifier changes something.
window.Modifiers = (() => {
  const T = () => window.RUN_MODIFIER_TUNING || {};
  const DEFS = () => window.RUN_MODIFIER_DEFS || [];
  let st = null, chip = null;

  function reset() {
    st = { active: null, def: null, endsAtAge: 0, lastEndedAtAge: -99, lastId: null, failStreak: 0, first: true,
           nextRollAtAge: Math.max(T().firstEligibleAge || 50, typeof runStartAge !== "undefined" ? runStartAge : 40),
           levelUpClosedAt: -1e9, wasLevelUp: false, intensity: 1, stats: { rolls: 0, hits: 0, byId: {} } };
    setChip(null);
    // QA: ?forceMod=ghostHour starts that one at 50 (or right away if older).
    const m = /[?&]forceMod=([A-Za-z]+)/.exec(location.search); st.force = m ? m[1] : null;
  }

  function fx(key, dflt) {
    if (!st || !st.def) return dflt;
    const e = st.def.effects || {};
    if (!(key in e)) return dflt;
    let v = e[key];
    if (typeof v === "number" && (st.def.scales || []).includes(key)) v = v * st.intensity; // Rent Hike: 1.25 x (1 + 0.05 per Tax Bracket)
    return v;
  }

  function setChip(def) {
    if (!chip) {
      chip = document.createElement("div");
      chip.id = "mod-chip";
      chip.setAttribute("role", "status");
      chip.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--ms-nav-h,0px) + var(--ms-hud-b,122px) + 12px);z-index:30;pointer-events:none;" +
        "font:11px Silkscreen,monospace;letter-spacing:.05em;padding:4px 10px;border-radius:999px;background:rgba(23,28,53,.88);color:#F2D7A1;border:2px solid #EF9347;display:none";
      document.body.appendChild(chip);
    }
    if (!def) { clearTimeout(chip._t); chip.style.display = "none"; return; }
    chip.textContent = def.title;
    chip.style.borderColor = def.kind === "reward" ? "#83A89A" : "#EF9347";
    // Wait for the center banner to finish so they don't overlap on phones.
    clearTimeout(chip._t);
    chip.style.display = "none";
    chip._t = setTimeout(() => { if (st && st.def === def) chip.style.display = "block"; }, 2200);
  }

  function bossAlive() { return bills.getChildren().some(b => b.active && b.isBoss); }

  function pick() {
    const pairs = T().exclusivePairs || [];
    const blocked = new Set([st.lastId]);
    pairs.forEach(([a, b]) => { if (st.lastId === a) blocked.add(b); if (st.lastId === b) blocked.add(a); });
    const pool = DEFS().filter(d => currentAge >= (d.minAge || 50) && !blocked.has(d.id));
    const total = pool.reduce((s, d) => s + (d.weight || 1), 0);
    let r = Math.random() * total;
    for (const d of pool) { r -= d.weight || 1; if (r <= 0) return d; }
    return pool[0] || null;
  }

  function start(def) {
    const yrs = def.durationYears || 2;
    st.active = def.id; st.def = def; st.endsAtAge = currentAge + yrs;
    st.intensity = 1 + (T().heatIntensityAddPerBracket || 0) * (typeof runTaxBracket !== "undefined" ? runTaxBracket : 0);
    st.stats.hits++; st.stats.byId[def.id] = (st.stats.byId[def.id] || 0) + 1;
    if (window.flashBanner) window.flashBanner(def.title, def.sub, def.kind);
    if (window.showLowerThird) window.showLowerThird(def.kind === "reward" ? "reward" : "alert", def.title, def.sub, 4000, def.sub);
    if (window.Spotlight) setTimeout(() => Spotlight.tip("modifier"), 4500); // first surprise ever, after its own banner
    if (typeof sfx === "function") sfx("pick");
    setChip(def);
  }

  function end() {
    st.lastEndedAtAge = currentAge; st.lastId = st.active;
    st.active = null; st.def = null;
    st.nextRollAtAge = Math.max(st.nextRollAtAge, currentAge + (T().cooldownYears || 1.5));
    setChip(null);
    if (window.showLowerThird) window.showLowerThird("tip", "BACK TO NORMAL", "That one passed. For now.", 2400);
  }

  function update(scene, now) {
    if (!st || typeof currentAge === "undefined") return;
    if (typeof gameOver !== "undefined" && gameOver) { setChip(null); return; }
    const lvl = typeof levelUpOpen !== "undefined" && levelUpOpen;
    if (st.wasLevelUp && !lvl) st.levelUpClosedAt = now;
    st.wasLevelUp = lvl;
    if (st.active) { if (currentAge >= st.endsAtAge) end(); return; }
    if (st.force) {
      const d = DEFS().find(x => x.id === st.force);
      if (d && currentAge >= Math.min(50, d.minAge || 50)) { st.force = null; return start(d); }
    }
    if (currentAge < (T().firstEligibleAge || 50) || currentAge < st.nextRollAtAge) return;
    if (currentAge < st.lastEndedAtAge + (T().cooldownYears || 1.5)) return;
    // Gates that wait without burning a roll.
    if (lvl || now - st.levelUpClosedAt < (T().noRollAfterLevelUpMs || 2500)) return;
    if (bossAlive()) return;
    if (typeof dyn !== "undefined" && dyn.comfortUntil > runElapsedMs) return;
    if (typeof lastHurt !== "undefined" && scene.time.now - lastHurt < (T().noRollAfterHurtMs || 3000)) return;
    st.nextRollAtAge = currentAge + (T().rollEveryYears || 2.5);
    st.stats.rolls++;
    let chance = (T().chancePerRoll || 0.55) + (T().heatChanceAddPerBracket || 0) * (typeof runTaxBracket !== "undefined" ? runTaxBracket : 0) + (st.first ? (T().firstRollChanceBonus || 0) : 0);
    chance = Math.min(T().chanceMax || 0.9, Math.max(T().chanceMin || 0.15, chance));
    st.first = false;
    const forced = st.failStreak >= (T().pityFailsBeforeForce || 3);
    if (!forced && Math.random() >= chance) { st.failStreak++; return; }
    st.failStreak = 0;
    const d = pick(); if (d) start(d);
  }

  return { reset, update, fx, active: () => st && st.def, endsAtAge: () => st && st.endsAtAge, forceStart: id => { const d = DEFS().find(x => x.id === id) || pick(); if (d && st) { if (st.active) end(); start(d); } }, stop: () => { if (st && st.active) end(); }, stats: () => st && st.stats };
})();
window.modFx = (key, dflt) => (window.Modifiers ? Modifiers.fx(key, dflt) : dflt);
