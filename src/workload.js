// Workload (Nov 9). Grok's spec: docs/handoffs/grok-overtime-plateau-spec.md, section 2. Numbers: src/data/overtime.js.
// Past 65 in an Overtime run only. Every 20 seconds the game looks for three signs you're coasting:
// your health never dipped below 70%, the room is mostly empty, and you're barely moving. Two of three, twice in a
// row, and the office gives you more work (one level, up to 5). It eases off the moment your health drops.
// Each level: enemies come a bit faster and tougher, hits sting a bit more, and you earn more score and coins.
window.Workload = (() => {
  const W = () => window.OVERTIME_WORKLOAD || {};
  let level = 0, shown = 0, active = false, win = null, coastRun = 0, calmRun = 0, holdUntil = 0, lastDrop = -1e9, pendingRise = 0, chip = null;
  let blendFrom = 1, blendTo = 1, blendStart = 0;

  function eligible() {
    const C = W();
    if (!C.on || !(C.modes || ["midlife"]).includes(window.runModeId || (typeof modeCfg === "function" ? modeCfg().id : "midlife"))) return false;
    if (C.needsOvertime && !(typeof modeEndAge === "function" && modeEndAge() > 65.01)) return false;
    return typeof currentAge !== "undefined" && currentAge >= (C.fromAge || 65);
  }
  function per(key, lv = level) {
    const P = (W().perLevel || {})[key];
    if (Array.isArray(P)) return P[Math.min(lv, P.length - 1)];
    return (P || 0) * lv;
  }
  // The one helper the game asks, like tax(): returns the Workload effect for a key (0 or 1 when inactive).
  function fx(key) {
    if (!active || level <= 0) return key === "spawnDelayMult" ? 1 : 0;
    if (key === "spawnDelayMult") { // eased in over a few seconds so there's no sudden wall
      const k = Math.min(1, (runElapsedMs - blendStart) / (W().blendMs || 6000));
      return blendFrom + (blendTo - blendFrom) * k;
    }
    if (key === "hitDamageAdd") return Math.min((W().caps || {}).hitDamageAdd || 3, per("hitDamageAdd"));
    if (key === "maxOnScreenMult") return per(isPhone() ? "maxOnScreenMultPhone" : "maxOnScreenMultDesktop");
    return per(key);
  }
  const isPhone = () => Math.min(window.innerWidth, window.innerHeight) < 600 || (typeof touch !== "undefined" && touch.isTouch);

  function setLevel(n, why) {
    const C = W(), old = level;
    n = Math.max(0, Math.min(C.maxLevel || 5, n));
    if (n === old) return;
    blendFrom = fx("spawnDelayMult"); level = n; blendTo = per("spawnDelayMult"); blendStart = runElapsedMs;
    holdUntil = runElapsedMs + (C.holdAfterChangeMs ?? 15000);
    coastRun = 0; calmRun = 0;
    if (n > old) {
      if (window.showLowerThird) showLowerThird("alert", "WORKLOAD UP", Phaser.Utils.Array.GetRandom(C.upLines || ["You make it look easy, so they gave you more."]), 4200);
      if (window.Telemetry && Telemetry.event && !window["_wl" + n]) { window["_wl" + n] = 1; Telemetry.event("workload-" + n); }
      window.runWorkloadMax = Math.max(window.runWorkloadMax || 0, n);
    } else if (window.showLowerThird) showLowerThird("reward", "WORKLOAD EASED", Phaser.Utils.Array.GetRandom(C.downLines || ["Take a breath. Your pay stays."]), 3600);
    draw();
  }

  // ---- the chip under the age ----
  function css() {
    if (document.getElementById("workload-css")) return;
    const st = document.createElement("style"); st.id = "workload-css";
    st.textContent = `#workload-chip{position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--ms-nav-h,0px) + 100px);z-index:22;display:flex;align-items:center;gap:7px;
  background:#171C35;color:#F2D7A1;border:2px solid #EF9347;padding:4px 9px;font:11px/1 Silkscreen,monospace;letter-spacing:.05em;pointer-events:none;box-shadow:2px 2px 0 rgba(0,0,0,.45)}
#workload-chip.hidden{display:none}
#workload-chip .p{display:inline-block;width:8px;height:10px;background:#303750;margin-left:2px}
#workload-chip .p.on{background:#EF9347}
#workload-chip .p.next{animation:wl-blink .4s steps(2) infinite}
@keyframes wl-blink{50%{background:#F2D7A1}}
@media (prefers-reduced-motion:reduce){#workload-chip .p.next{animation:none;background:#F2D7A1}}
@media (max-width:760px),(orientation:portrait){#workload-chip{top:calc(var(--ms-nav-h,0px) + 92px);font-size:10px}}`;
    document.head.appendChild(st);
  }
  function draw() {
    css();
    if (!chip) { chip = document.createElement("div"); chip.id = "workload-chip"; chip.className = "hidden"; document.body.appendChild(chip); }
    const C = W(), max = C.maxLevel || 5, playing = typeof gameOver !== "undefined" && !gameOver && typeof titleOpen !== "undefined" && !titleOpen;
    const errandUp = document.getElementById("errand-chip") && !document.getElementById("errand-chip").classList.contains("hidden") && isPhone();
    if (!active || (level <= 0 && !pendingRise) || !playing || errandUp) { chip.className = "hidden"; return; }
    let pips = "";
    for (let i = 1; i <= max; i++) pips += `<i class="p${i <= level ? " on" : ""}${pendingRise && i === level + 1 ? " next" : ""}"></i>`;
    const pay = Math.round(per("scoreMult") * 100);
    chip.className = ""; chip.innerHTML = `WORKLOAD ${pips}${pay ? ` · +${pay}% PAY` : ""}`;
  }

  // ---- once per frame ----
  function update(scene) {
    const C = W();
    const was = active; active = eligible();
    if (!active) { if (was) { level = 0; draw(); } return; }
    if (!was) { win = null; holdUntil = runElapsedMs + (C.holdFirstMs ?? 15000); }
    const busy = (typeof levelUpOpen !== "undefined" && levelUpOpen) || (typeof paused !== "undefined" && paused) ||
      (typeof bills !== "undefined" && bills.getChildren().some(b => b.active && b.isBoss));
    const hpFrac = (typeof hp !== "undefined" && stats && stats.maxHp) ? hp / stats.maxHp : 1;
    // drops: right away when health falls
    if (level > 0 && runElapsedMs - lastDrop > (C.dropCooldownMs || 10000)) {
      if (hpFrac < (C.dropTwoAtHpFrac || 0.3)) { lastDrop = runElapsedMs; pendingRise = 0; setLevel(level - 2); }
      else if (hpFrac < (C.dropAtHpFrac || 0.5)) { lastDrop = runElapsedMs; pendingRise = 0; setLevel(level - 1); }
    }
    // a rise that was announced (blinking pip) lands after the warning
    if (pendingRise && runElapsedMs >= pendingRise) { pendingRise = 0; setLevel(level + 1); }
    // the 20 s window
    if (!win) win = { start: runElapsedMs, minHp: hpFrac, crowd: 0, speed: 0, n: 0, lastX: player.x, lastY: player.y, lastT: runElapsedMs };
    win.minHp = Math.min(win.minHp, hpFrac);
    const cap = Math.max(1, (typeof ageCurve === "function" && window.INTENSITY ? ageCurve(INTENSITY.maxOnScreenByAge, currentAge) : 0) || (window.SPAWNING && SPAWNING.maxOnScreen) || 200);
    const dt = Math.max(1, runElapsedMs - win.lastT);
    win.crowd += bills.countActive() / cap; win.speed += Math.hypot(player.x - win.lastX, player.y - win.lastY) / dt * 1000; win.n++;
    win.lastX = player.x; win.lastY = player.y; win.lastT = runElapsedMs;
    if (runElapsedMs - win.start >= (C.windowMs || 20000)) {
      const signs = (win.minHp >= (C.hpFloorFrac || 0.7) ? 1 : 0) + (win.crowd / win.n <= (C.crowdFrac || 0.35) ? 1 : 0) + (win.speed / win.n <= (C.moveSpeed || 70) ? 1 : 0);
      const coasting = signs >= (C.coastSignsNeeded || 2);
      win = null;
      if (!busy && runElapsedMs >= holdUntil) {
        if (coasting) { coastRun++; calmRun = 0; if (coastRun >= (C.riseAfterWindows || 2) && level < (C.maxLevel || 5) && !pendingRise) { pendingRise = runElapsedMs + (C.warnMs ?? 3000); coastRun = 0; } }
        else { calmRun++; coastRun = 0; if (calmRun >= (C.fallAfterWindows || 3) && level > 0) setLevel(level - 1); }
      }
    }
    draw();
  }
  function reset() { level = 0; active = false; win = null; coastRun = calmRun = 0; holdUntil = 0; pendingRise = 0; window.runWorkloadMax = 0; for (let i = 1; i <= 5; i++) window["_wl" + i] = 0; if (chip) chip.className = "hidden"; }
  setInterval(() => { if (chip && (typeof gameOver !== "undefined" && gameOver || typeof titleOpen !== "undefined" && titleOpen)) chip.className = "hidden"; }, 300);
  return { update, reset, fx, level: () => (active ? level : 0), debugSet: n => { active = true; setLevel(n); }, state: () => ({ active, level, coastRun, calmRun, holdUntil, pendingRise, win: win && { start: win.start, minHp: win.minHp, n: win.n, crowd: win.crowd / Math.max(1, win.n), speed: win.speed / Math.max(1, win.n) } }) };
})();
